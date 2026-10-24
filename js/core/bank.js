// Bank soal (SPEC 8): ruang kerja per mata ujian berisi salinan pack dengan soal
// semua status, ditambah data review. Fungsi murni tanpa DOM; waktu `now` dan
// RNG dari pemanggil. Ujian hanya memakai pack yang DIPUBLIKASIKAN (soal LIVE);
// perubahan di bank baru berlaku setelah Publikasikan (DECISIONS D-58).
//
// Bentuk bank (disimpan di caSim:<subjectId>:bank):
// { bankVersion, subjectId, pack, reviewCounter, pendingReviews: [...],
//   reviewRecords: [...], conflicts: { [questionId]: {...} }, calibrationStats: { [model]: {...} },
//   log: [{ at, message }] }

import { canonicalize, contentHash } from './hash.js';
import { timeStandardIssues } from './time-standard.js';
import { loadDocument, validateDocument } from './contract.js';
import { keys } from './storage.js';
import { SCHEMA_VERSION } from './version.js';

const iso = (ms) => new Date(ms).toISOString();
const clone = (x) => JSON.parse(JSON.stringify(x));

export const STATUS_LABELS = {
  DRAFT: 'Draf',
  AI_REVIEWED: 'Lolos review AI',
  APPROVED: 'Disetujui',
  LIVE: 'Tayang (LIVE)',
  NEEDS_REVISION: 'Perlu revisi',
  REJECTED: 'Ditolak',
  RETIRED: 'Dipensiunkan',
  CALIBRATION: 'Kalibrasi',
};
export const STATUS_ORDER = ['DRAFT', 'AI_REVIEWED', 'APPROVED', 'LIVE', 'NEEDS_REVISION', 'REJECTED', 'RETIRED', 'CALIBRATION'];

// Transisi yang diizinkan (SPEC 8). Perubahan isi soal selalu mengembalikan ke
// DRAFT (kecuali CALIBRATION) lewat jalur khusus `changeContent`.
const TRANSITIONS = {
  DRAFT: ['AI_REVIEWED', 'NEEDS_REVISION', 'REJECTED'],
  AI_REVIEWED: ['APPROVED', 'NEEDS_REVISION', 'REJECTED'],
  NEEDS_REVISION: ['DRAFT', 'AI_REVIEWED', 'REJECTED'],
  REJECTED: ['DRAFT', 'AI_REVIEWED', 'NEEDS_REVISION'],
  APPROVED: ['LIVE'],
  LIVE: ['RETIRED'],
  RETIRED: ['DRAFT'],
  CALIBRATION: [],
};

export class BankError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BankError';
  }
}

export function canTransition(from, to) {
  return (TRANSITIONS[from] || []).includes(to);
}

function setStatus(q, to, now, { by, reason } = {}) {
  const from = q.lifecycle.status;
  if (!canTransition(from, to)) {
    throw new BankError(`Soal ${q.id}: status ${STATUS_LABELS[from]} (${from}) tidak dapat diubah menjadi ${STATUS_LABELS[to]} (${to}).`);
  }
  pushHistory(q, from, to, now, by, reason);
  q.lifecycle.status = to;
}

function pushHistory(q, from, to, now, by, reason) {
  const entry = { from, to, at: iso(now) };
  if (by) entry.by = by;
  if (reason) entry.reason = reason;
  q.lifecycle.history = [...(q.lifecycle.history || []), entry];
}

function log(bank, now, message) {
  bank.log.push({ at: iso(now), message });
}

// ---------- Membuat, memuat, menyimpan ----------

export async function createBank(pack, now) {
  const bank = {
    bankVersion: SCHEMA_VERSION,
    subjectId: pack.subjectId,
    pack: clone(pack),
    reviewCounter: 0,
    pendingReviews: [],
    reviewRecords: [],
    conflicts: {},
    calibrationStats: {},
    log: [],
  };
  for (const q of bank.pack.questions) {
    if (!q.lifecycle.contentHash) q.lifecycle.contentHash = await contentHash(q);
  }
  log(bank, now, `Bank dibuat dari pack versi ${pack.packVersion} (${pack.questions.length} soal).`);
  return bank;
}

// Hasil: null (belum ada), { ok: true, bank } atau { ok: false, errors } (data tidak dihapus).
export function loadBank(store, subjectId) {
  const raw = store.getJson(keys.bank(subjectId));
  if (raw === null) return null;
  if (raw.__unreadable !== undefined || !raw.pack) {
    return { ok: false, errors: [{ path: '$', message: 'Data bank soal rusak dan tidak dapat dibaca.' }] };
  }
  const result = loadDocument('pack', raw.pack);
  if (!result.ok) return { ok: false, errors: result.errors.map((e) => ({ ...e, path: e.path.replace(/^\$/, '$.pack') })) };
  return { ok: true, bank: { ...raw, pack: result.data } };
}

export function saveBank(store, bank) {
  store.setJson(keys.bank(bank.subjectId), bank);
}

export function findQuestion(bank, id) {
  return bank.pack.questions.find((q) => q.id === id) || null;
}

// Navigasi pratinjau Sebelumnya/Berikutnya mengikuti urutan daftar yang tampil
// (sesudah filter). index -1 bila soal tidak ada di daftar (D-96).
export function previewNeighbors(ids, id) {
  const index = ids.indexOf(id);
  return {
    index,
    total: ids.length,
    prev: index > 0 ? ids[index - 1] : null,
    next: index >= 0 && index < ids.length - 1 ? ids[index + 1] : null,
  };
}

// ---------- Pembaruan taksonomi dari pack bawaan (D-87) ----------

const sameList = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Bank menyimpan salinan pack sendiri, sehingga daftar topik/kompetensi dan
// paket ujian yang diperbarui di pack bawaan tidak ikut berubah. Hasil: null bila
// sama atau mata ujian berbeda; selain itu { topics, competencies, packages,
// missing } dengan missing = kode yang dipakai soal bank tetapi tidak ada di pack
// sumber. Paket ikut diperbarui sejak D-100.
export function taxonomyDiff(bank, sourcePack) {
  if (!sourcePack || sourcePack.subjectId !== bank.subjectId) return null;
  const topics = !sameList(bank.pack.topics, sourcePack.topics);
  const competencies = !sameList(bank.pack.competencies, sourcePack.competencies);
  const packages = !sameList(bank.pack.packages, sourcePack.packages);
  if (!topics && !competencies && !packages) return null;
  const topicIds = new Set(sourcePack.topics.map((t) => t.id));
  const competencyIds = new Set(sourcePack.competencies.map((k) => k.id));
  const missing = [];
  for (const q of bank.pack.questions) {
    for (const id of q.topicIds) if (!topicIds.has(id)) missing.push({ questionId: q.id, code: id });
    for (const id of q.competencyIds) if (!competencyIds.has(id)) missing.push({ questionId: q.id, code: id });
  }
  return { topics, competencies, packages, missing };
}

// Salinan pack dengan topik, kompetensi, dan paket ujian dari pack sumber; soal,
// versi, dan changelog tidak berubah (contentHash tidak mencakup topik).
export function withTaxonomy(pack, sourcePack) {
  return {
    ...clone(pack),
    topics: clone(sourcePack.topics),
    competencies: clone(sourcePack.competencies),
    packages: clone(sourcePack.packages),
  };
}

export function updateTaxonomy(bank, sourcePack, now) {
  const diff = taxonomyDiff(bank, sourcePack);
  if (!diff) throw new BankError('Daftar topik, kompetensi, dan paket bank sudah sama dengan pack bawaan.');
  if (diff.missing.length) {
    throw new BankError(`Kode berikut dipakai soal tetapi tidak ada di pack bawaan: ${diff.missing.map((m) => `${m.questionId} (${m.code})`).join(', ')}.`);
  }
  bank.pack = withTaxonomy(bank.pack, sourcePack);
  log(bank, now, `Topik, kompetensi, dan paket diperbarui dari pack bawaan versi ${sourcePack.packVersion} (${sourcePack.topics.length} topik, ${sourcePack.competencies.length} kompetensi, paket ${sourcePack.packages.map((p) => p.id).join('/')}).`);
  return diff;
}

// ---------- Soal LIVE pack bawaan yang belum ada di bank (D-90) ----------

const versionParts = (v) => v.split('.').map(Number);
const newerVersion = (a, b) => {
  const [x, y] = [versionParts(a), versionParts(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i] ? a : b;
  return a;
};

// Mis. soal yang digabung ke repositori dari ekspor bank lama (D-89). Hasil: null bila
// tidak ada yang dapat diambil atau mata ujian berbeda; selain itu
// { add: [soal], skipped: [{ id, reason }], missing: [{ questionId, code }] }.
// Soal yang ID-nya sudah ada di bank tidak pernah ditimpa.
export async function builtInLiveDiff(bank, sourcePack) {
  if (!sourcePack || sourcePack.subjectId !== bank.subjectId) return null;
  const topicIds = new Set(bank.pack.topics.map((t) => t.id));
  const competencyIds = new Set(bank.pack.competencies.map((k) => k.id));
  const add = [];
  const skipped = [];
  const missing = [];
  for (const q of sourcePack.questions) {
    if (q.lifecycle.status !== 'LIVE') continue;
    const existing = findQuestion(bank, q.id);
    const hash = await contentHash(q);
    if (existing) {
      if (existing.lifecycle.contentHash !== hash) skipped.push({ id: q.id, reason: `ID sudah dipakai soal lain di bank (${STATUS_LABELS[existing.lifecycle.status]})` });
      continue;
    }
    if (q.lifecycle.contentHash !== hash) {
      skipped.push({ id: q.id, reason: 'isi soal tidak cocok dengan contentHash' });
      continue;
    }
    for (const id of q.topicIds) if (!topicIds.has(id)) missing.push({ questionId: q.id, code: id });
    for (const id of q.competencyIds) if (!competencyIds.has(id)) missing.push({ questionId: q.id, code: id });
    add.push(q);
  }
  return add.length || skipped.length ? { add, skipped, missing } : null;
}

// Menambahkan soal LIVE pack bawaan ke bank (status tetap LIVE), versi pack naik minor
// dari versi tertinggi bank/pack bawaan, changelog diperbarui. Hasil seperti publish():
// { pack (salinan tervalidasi untuk ujian di perangkat), added: [id], version }.
export async function adoptBuiltInLive(bank, sourcePack, now) {
  const diff = await builtInLiveDiff(bank, sourcePack);
  if (!diff || !diff.add.length) throw new BankError('Tidak ada soal tayang di pack bawaan yang belum ada di bank.');
  if (diff.missing.length) {
    throw new BankError(`Kode berikut dipakai soal pack bawaan tetapi tidak ada di daftar topik/kompetensi bank: ${diff.missing.map((m) => `${m.questionId} (${m.code})`).join(', ')}. Perbarui daftar topik lebih dulu.`);
  }
  // Dikerjakan pada salinan agar bank tidak berubah bila validasi gagal.
  const pack = clone(bank.pack);
  const reason = `diambil dari pack bawaan versi ${sourcePack.packVersion}`;
  for (const q of diff.add) {
    const copy = clone(q);
    pushHistory(copy, 'LIVE', 'LIVE', now, undefined, reason);
    pack.questions.push(copy);
  }
  const added = diff.add.map((q) => q.id);
  const version = nextMinorVersion(newerVersion(pack.packVersion, sourcePack.packVersion));
  const notes = `${added.length} soal tayang diambil dari pack bawaan versi ${sourcePack.packVersion}: ${added.join(', ')}.`;
  pack.packVersion = version;
  pack.changelog.push({ version, date: localDate(now), notes });
  const checked = loadDocument('pack', clone(pack));
  if (!checked.ok) {
    throw new BankError(`Pack tidak valid setelah soal diambil: ${checked.errors.slice(0, 3).map((e) => `${e.path}: ${e.message}`).join('; ')}`);
  }
  bank.pack = pack;
  log(bank, now, `Versi ${version}: ${notes}`);
  return { pack: checked.data, added, version };
}

// ---------- Impor batch (SPEC 5.3, 8) ----------

// Teks dari penyusun: JSON murni, atau blok kode ```json ... ``` diikuti "Catatan penyusun".
export function extractJson(text) {
  const s = String(text ?? '').replace(/^﻿/, '').trim();
  if (!s) return { ok: false, errors: [{ path: '$', message: 'Teks masih kosong. Tempel keluaran AI lebih dulu.' }] };
  let body = s;
  let notes = '';
  if (!s.startsWith('{')) {
    const m = /```[a-zA-Z]*\s*\n([\s\S]*?)\n?```/.exec(s);
    if (!m) return { ok: false, errors: [{ path: '$', message: 'Tidak menemukan JSON. Tempel seluruh keluaran AI, termasuk blok kode JSON-nya.' }] };
    body = m[1].trim();
    notes = (s.slice(0, m.index) + s.slice(m.index + m[0].length)).trim();
  }
  try {
    return { ok: true, data: JSON.parse(body), notes };
  } catch (e) {
    return { ok: false, errors: [{ path: '$', message: `Bukan JSON yang valid (${e.message}).` }] };
  }
}

// Menambahkan ID soal ke pesan error ber-path $.items[i]... (SPEC 8: pesan lint menyebut ID dan field).
export function labelItemErrors(errors, items, root = '$.items') {
  const re = new RegExp(`^${root.replace(/[$.[\]]/g, '\\$&')}\\[(\\d+)\\]`);
  return errors.map((e) => {
    const m = re.exec(e.path);
    const item = m && Array.isArray(items) ? items[Number(m[1])] : null;
    const id = item && typeof item.id === 'string' ? item.id : null;
    if (!id || e.message.includes(id)) return e;
    return { ...e, message: `Soal ${id}: ${e.message}` };
  });
}

// Soal Perlu revisi kembali ke Draf bila ADA field yang berubah, termasuk field di
// luar contentHash (mis. alasan distraktor, kesulitan, topik) (D-88).
function bodyChanged(existing, incoming) {
  const body = (q) => {
    const { lifecycle, authoring, ...rest } = q;
    return JSON.stringify(canonicalize(rest));
  };
  return body(existing) !== body(incoming);
}

// Rencana impor tanpa mengubah bank. Hasil:
// { ok, errors, notes, batch, calibration, entries: [{ question, hash, action: 'baru'|'revisi'|'sama', previousStatus, warnings }] }
// warnings = peringatan standar waktu (D-100); tidak menolak batch.
export async function planBatchImport(bank, text) {
  const parsed = typeof text === 'string' ? extractJson(text) : { ok: true, data: text, notes: '' };
  if (!parsed.ok) return { ok: false, errors: parsed.errors };
  const batch = parsed.data;
  const items = batch && Array.isArray(batch.items) ? batch.items : [];
  const schemaErrors = validateDocument('batch', batch);
  if (schemaErrors.length) return { ok: false, errors: labelItemErrors(schemaErrors, items) };

  const errors = [];
  const pack = bank.pack;
  if (batch.subjectId !== bank.subjectId) {
    errors.push({ path: '$.subjectId', message: `batch untuk mata ujian "${batch.subjectId}", bukan "${bank.subjectId}".` });
  }
  const topics = new Set(pack.topics.map((t) => t.id));
  const competencies = new Set(pack.competencies.map((c) => c.id));
  items.forEach((q, i) => {
    q.topicIds.filter((t) => !topics.has(t)).forEach((t) => errors.push({ path: `$.items[${i}].topicIds`, message: `Soal ${q.id}: topik ${t} tidak ada di pack.` }));
    q.competencyIds.filter((c) => !competencies.has(c)).forEach((c) => errors.push({ path: `$.items[${i}].competencyIds`, message: `Soal ${q.id}: kompetensi ${c} tidak ada di pack.` }));
  });
  // Batch kalibrasi: semua soal berstatus CALIBRATION, atau tidak satu pun (D-61).
  const calibrationCount = items.filter((q) => q.lifecycle.status === 'CALIBRATION').length;
  if (calibrationCount && calibrationCount !== items.length) {
    errors.push({ path: '$.items', message: `Batch mencampur ${calibrationCount} soal kalibrasi dengan soal biasa. Impor soal kalibrasi dalam batch tersendiri.` });
  }

  const entries = [];
  for (const [i, raw] of items.entries()) {
    const question = clone(raw);
    const hash = await contentHash(question);
    const existing = findQuestion(bank, question.id);
    const isCalibration = question.lifecycle.status === 'CALIBRATION';
    if (existing && (existing.lifecycle.status === 'CALIBRATION') !== isCalibration) {
      errors.push({ path: `$.items[${i}].lifecycle.status`, message: `Soal ${question.id}: ID sudah dipakai soal ${isCalibration ? 'biasa' : 'kalibrasi'} di bank.` });
      continue;
    }
    const action = !existing ? 'baru'
      : existing.lifecycle.contentHash !== hash || (existing.lifecycle.status === 'NEEDS_REVISION' && bodyChanged(existing, question)) ? 'revisi'
      : 'sama';
    entries.push({ question, hash, action, previousStatus: existing ? existing.lifecycle.status : null, warnings: timeStandardIssues(question) });
  }
  if (errors.length) return { ok: false, errors };
  return { ok: true, errors: [], notes: parsed.notes, batch, calibration: calibrationCount > 0, entries };
}

// Menerapkan rencana impor. Soal baru -> DRAFT (atau CALIBRATION); isi berubah -> DRAFT.
export function applyBatchImport(bank, plan, now) {
  for (const entry of plan.entries) {
    const q = entry.question;
    const existing = findQuestion(bank, q.id);
    if (!existing) {
      q.lifecycle = { status: q.lifecycle.status, contentHash: entry.hash, review: null, approvedBy: null, approvedAt: null };
      bank.pack.questions.push(q);
      continue;
    }
    if (entry.action === 'sama') {
      // Isi ber-hash sama: field lain (mis. pembahasan) diperbarui, status tetap.
      q.lifecycle = existing.lifecycle;
      replaceQuestion(bank, q);
    } else {
      changeContent(bank, q, now, `isi berubah lewat impor batch ${plan.batch.batchId}`, entry.hash, existing);
    }
  }
  const counts = { baru: 0, revisi: 0, sama: 0 };
  plan.entries.forEach((e) => { counts[e.action]++; });
  log(bank, now, `Impor batch ${plan.batch.batchId}${plan.calibration ? ' (kalibrasi)' : ''}: ${counts.baru} baru, ${counts.revisi} revisi, ${counts.sama} tanpa perubahan isi.`);
  return counts;
}

function replaceQuestion(bank, q) {
  const index = bank.pack.questions.findIndex((x) => x.id === q.id);
  bank.pack.questions[index] = q;
}

// Isi soal berubah setelah review/persetujuan -> kembali DRAFT (SPEC 8, TS-13).
// Riwayat transisi lama dipertahankan; hasil review dan persetujuan dikosongkan.
export function changeContent(bank, question, now, reason, hash, existing = findQuestion(bank, question.id)) {
  if (!existing) throw new BankError(`Soal ${question.id} tidak ada di bank.`);
  const from = existing.lifecycle.status;
  const to = from === 'CALIBRATION' ? 'CALIBRATION' : 'DRAFT';
  question.lifecycle = {
    status: to,
    contentHash: hash,
    review: null,
    approvedBy: null,
    approvedAt: null,
    history: [...(existing.lifecycle.history || []), { from, to, at: iso(now), reason }],
  };
  replaceQuestion(bank, question);
  delete bank.conflicts[question.id];
  return question;
}

// Untuk perubahan isi di luar impor batch (mis. koreksi langsung): hash dihitung ulang.
export async function editQuestion(bank, question, now, reason = 'isi diubah') {
  const hash = await contentHash(question);
  const existing = findQuestion(bank, question.id);
  if (existing && existing.lifecycle.contentHash === hash) {
    question.lifecycle = existing.lifecycle;
    replaceQuestion(bank, question);
    return question;
  }
  return changeContent(bank, clone(question), now, reason, hash, existing);
}

// ---------- Keputusan manusia ----------

const INITIALS = /^[A-Za-z][A-Za-z. ]{0,14}$/;

export function approve(bank, ids, initials, now) {
  const by = String(initials ?? '').trim();
  if (!INITIALS.test(by)) throw new BankError('Isi inisial penyetuju (huruf, maks 15 karakter), mis. "LMA".');
  const targets = ids.map((id) => findQuestion(bank, id));
  targets.forEach((q, i) => {
    if (!q) throw new BankError(`Soal ${ids[i]} tidak ada di bank.`);
    if (bank.conflicts[q.id]) throw new BankError(`Soal ${q.id}: dua review berbeda pendapat; putuskan lebih dulu.`);
    if (q.lifecycle.status !== 'AI_REVIEWED') throw new BankError(`Soal ${q.id}: hanya soal berstatus Lolos review AI yang dapat disetujui (status sekarang ${STATUS_LABELS[q.lifecycle.status]}).`);
  });
  for (const q of targets) {
    setStatus(q, 'APPROVED', now, { by });
    q.lifecycle.approvedBy = by;
    q.lifecycle.approvedAt = iso(now);
  }
  log(bank, now, `${targets.length} soal disetujui oleh ${by}: ${ids.join(', ')}.`);
}

function requireReason(reason) {
  const r = String(reason ?? '').trim();
  if (!r) throw new BankError('Alasan wajib diisi.');
  return r;
}

// REJECTED dapat dibatalkan manusia dengan alasan tertulis (SPEC 8) -> DRAFT untuk direview ulang.
export function undoReject(bank, id, { by, reason }, now) {
  const q = findQuestion(bank, id);
  if (!q || q.lifecycle.status !== 'REJECTED') throw new BankError(`Soal ${id} tidak berstatus Ditolak.`);
  setStatus(q, 'DRAFT', now, { by: String(by ?? '').trim() || undefined, reason: requireReason(reason) });
  q.lifecycle.review = null;
  log(bank, now, `Penolakan soal ${id} dibatalkan: ${reason}`);
}

// Perlu revisi -> Draf oleh manusia dengan alasan tertulis (D-88), mis. revisi sudah
// diimpor sebelum perbaikan D-88 atau pemilik tidak setuju dengan temuan reviewer.
export function returnToDraft(bank, id, { by, reason }, now) {
  const q = findQuestion(bank, id);
  if (!q || q.lifecycle.status !== 'NEEDS_REVISION') throw new BankError(`Soal ${id} tidak berstatus Perlu revisi.`);
  setStatus(q, 'DRAFT', now, { by: String(by ?? '').trim() || undefined, reason: requireReason(reason) });
  q.lifecycle.review = null;
  delete bank.conflicts[id];
  log(bank, now, `Soal ${id} dikembalikan ke Draf: ${reason}`);
}

export function retire(bank, id, { by, reason }, now) {
  const q = findQuestion(bank, id);
  if (!q || q.lifecycle.status !== 'LIVE') throw new BankError(`Soal ${id} tidak berstatus LIVE.`);
  setStatus(q, 'RETIRED', now, { by: String(by ?? '').trim() || undefined, reason: requireReason(reason) });
  log(bank, now, `Soal ${id} dipensiunkan: ${reason}`);
}

// Dua review berbeda pendapat -> keputusan manusia (SPEC 8, review ganda).
export function resolveConflict(bank, id, status, { by, reason }, now) {
  const c = bank.conflicts[id];
  const q = findQuestion(bank, id);
  if (!c || !q) throw new BankError(`Soal ${id} tidak memiliki perbedaan review.`);
  if (!['AI_REVIEWED', 'NEEDS_REVISION', 'REJECTED'].includes(status)) throw new BankError('Keputusan tidak dikenal.');
  const who = String(by ?? '').trim();
  if (!INITIALS.test(who)) throw new BankError('Isi inisial pengambil keputusan.');
  const why = requireReason(reason);
  if (q.lifecycle.status !== status) setStatus(q, status, now, { by: who, reason: `keputusan review ganda: ${why}` });
  else pushHistory(q, status, status, now, who, `keputusan review ganda: ${why}`);
  delete bank.conflicts[id];
  log(bank, now, `Perbedaan review soal ${id} diputuskan ${status} oleh ${who}: ${why}`);
}

// ---------- Publikasi dan ekspor pack ----------

export function nextMinorVersion(version) {
  const [major, minor] = version.split('.').map(Number);
  return `${major}.${minor + 1}.0`;
}

function localDate(now) {
  const d = new Date(now);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Perbedaan bank dengan pack yang sedang dipakai ujian (untuk tombol Publikasikan).
export function pendingPublication(bank, publishedPack) {
  const published = new Map((publishedPack ? publishedPack.questions : []).map((q) => [q.id, q]));
  const approved = bank.pack.questions.filter((q) => q.lifecycle.status === 'APPROVED').map((q) => q.id);
  const leaving = bank.pack.questions
    .filter((q) => published.get(q.id) && published.get(q.id).lifecycle.status === 'LIVE' && q.lifecycle.status !== 'LIVE')
    .map((q) => q.id);
  return { approved, leaving };
}

// APPROVED -> LIVE, packVersion naik minor, changelog diperbarui (SPEC 8).
// Hasil: { pack (salinan tervalidasi), published: [id], version }.
export function publish(bank, now, { notes, publishedPack } = {}) {
  const { approved, leaving } = pendingPublication(bank, publishedPack);
  if (!approved.length && !leaving.length) throw new BankError('Tidak ada perubahan untuk dipublikasikan (belum ada soal Disetujui).');
  for (const id of approved) setStatus(findQuestion(bank, id), 'LIVE', now, { by: findQuestion(bank, id).lifecycle.approvedBy || undefined, reason: 'dipublikasikan' });
  const version = nextMinorVersion(bank.pack.packVersion);
  const parts = [];
  if (approved.length) parts.push(`${approved.length} soal tayang: ${approved.join(', ')}`);
  if (leaving.length) parts.push(`${leaving.length} soal tidak lagi tayang: ${leaving.join(', ')}`);
  bank.pack.packVersion = version;
  bank.pack.changelog.push({ version, date: localDate(now), notes: String(notes || '').trim() || `${parts.join('; ')}.` });
  const checked = loadDocument('pack', clone(bank.pack));
  if (!checked.ok) {
    throw new BankError(`Pack hasil publikasi tidak valid: ${checked.errors.slice(0, 3).map((e) => `${e.path}: ${e.message}`).join('; ')}`);
  }
  log(bank, now, `Publikasi versi ${version}: ${parts.join('; ')}.`);
  return { pack: checked.data, published: approved, leaving, version };
}

// Ekspor Pack: pack.json lengkap (semua status) untuk disimpan ke repositori.
export function exportPackText(bank) {
  const checked = loadDocument('pack', clone(bank.pack));
  if (!checked.ok) throw new BankError(`Pack tidak valid: ${checked.errors.slice(0, 3).map((e) => `${e.path}: ${e.message}`).join('; ')}`);
  return `${JSON.stringify(checked.data, null, 2)}\n`;
}

// ---------- Daftar, filter, statistik ----------

export function filterQuestions(bank, { status, topicId, type, difficulty } = {}) {
  return bank.pack.questions.filter((q) => (!status || q.lifecycle.status === status)
    && (!topicId || q.topicIds.includes(topicId))
    && (!type || q.type === type)
    && (!difficulty || q.difficulty === difficulty));
}

export const KEY_SHARE_LIMIT = 0.35; // SPEC 7: posisi kunci PG maks 35% di satu huruf.

// Statistik cakupan untuk soal dengan status tertentu (bawaan: LIVE).
export function bankStats(bank, statuses = ['LIVE']) {
  const qs = bank.pack.questions.filter((q) => statuses.includes(q.lifecycle.status));
  const topics = bank.pack.topics.map((t) => {
    const inTopic = qs.filter((q) => q.topicIds.includes(t.id));
    const count = (type) => inTopic.filter((q) => q.type === type).length;
    return { id: t.id, name: t.name, mcq: count('mcq'), numeric: count('numeric'), essay: count('essay'), case: count('case'), total: inTopic.length };
  });
  const difficulty = {};
  for (const q of qs) {
    difficulty[q.type] = difficulty[q.type] || { mudah: 0, sedang: 0, sulit: 0, sangat_sulit: 0 };
    difficulty[q.type][q.difficulty]++;
  }
  const mcq = qs.filter((q) => q.type === 'mcq');
  const keyCounts = { A: 0, B: 0, C: 0, D: 0 };
  mcq.forEach((q) => { keyCounts[q.answerKey]++; });
  const keyShares = Object.fromEntries(Object.entries(keyCounts).map(([k, n]) => [k, mcq.length ? n / mcq.length : 0]));
  const overKey = Object.entries(keyShares).filter(([, s]) => s > KEY_SHARE_LIMIT + 1e-9).map(([k]) => k);
  const byStatus = Object.fromEntries(STATUS_ORDER.map((s) => [s, bank.pack.questions.filter((q) => q.lifecycle.status === s).length]));
  const caseSizes = {
    mini: qs.filter((q) => q.type === 'case' && q.caseSize === 'mini').length,
    komprehensif: qs.filter((q) => q.type === 'case' && q.caseSize === 'komprehensif').length,
  };
  return { total: qs.length, topics, difficulty, keyCounts, keyShares, overKey, byStatus, caseSizes };
}
