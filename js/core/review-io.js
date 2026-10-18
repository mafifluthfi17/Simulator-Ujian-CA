// Paket review dan impor hasil review AI (SPEC 5.4 dan 8). Fungsi murni tanpa DOM.
// reviewKey sementara (R01, R02, ...) dipetakan ke ID asli di bank sehingga
// reviewer tidak dapat membedakan soal kalibrasi.

import { contentHash } from './hash.js';
import { validateDocument } from './contract.js';
import { SCHEMA_VERSION } from './version.js';
import { shuffle } from './random.js';
import { BankError, STATUS_LABELS, extractJson, findQuestion } from './bank.js';

const iso = (ms) => new Date(ms).toISOString();
const clone = (x) => JSON.parse(JSON.stringify(x));

// SPEC 8: maks 10 soal PG, 5 esai, atau 2 kasus per batch; satu kelompok tipe per paket (D-59).
const GROUPS = { mcq: 'pg', numeric: 'pg', essay: 'essay', case: 'case' };
export const REVIEW_LIMITS = { pg: 10, essay: 5, case: 2 };
const GROUP_LABELS = { pg: 'pilihan ganda/numerik', essay: 'esai', case: 'kasus' };
export const REVIEWABLE = ['DRAFT', 'AI_REVIEWED'];
// Status yang masih boleh menerima hasil review (review kedua ikut di sini).
const ACCEPTS_REVIEW = ['DRAFT', 'AI_REVIEWED', 'NEEDS_REVISION', 'REJECTED'];
const DECISION_RANK = { AI_REVIEWED: 0, NEEDS_REVISION: 1, REJECTED: 2 };
const STRIPPED = ['id', 'lifecycle', 'authoring', 'calibration'];

function reviewItem(q, reviewKey, hash) {
  const item = { reviewKey, contentHash: hash };
  for (const [k, v] of Object.entries(q)) if (!STRIPPED.includes(k)) item[k] = clone(v);
  return item;
}

// Memeriksa pilihan soal untuk satu paket review. Hasil: daftar pesan error.
export function checkReviewSelection(bank, ids) {
  const errors = [];
  if (!ids.length) return ['Pilih minimal satu soal.'];
  const qs = ids.map((id) => findQuestion(bank, id));
  qs.forEach((q, i) => {
    if (!q) errors.push(`Soal ${ids[i]} tidak ada di bank.`);
    else if (!REVIEWABLE.includes(q.lifecycle.status)) errors.push(`Soal ${q.id} berstatus ${STATUS_LABELS[q.lifecycle.status]}; hanya Draf (atau Lolos review AI untuk review ganda) yang dapat direview.`);
  });
  const groups = new Set(qs.filter(Boolean).map((q) => GROUPS[q.type]));
  if (groups.size > 1) errors.push('Satu paket review hanya berisi satu jenis: pilihan ganda/numerik, esai, atau kasus.');
  if (groups.size === 1) {
    const g = [...groups][0];
    if (ids.length > REVIEW_LIMITS[g]) errors.push(`Maksimal ${REVIEW_LIMITS[g]} soal ${GROUP_LABELS[g]} per paket review (dipilih ${ids.length}).`);
  }
  return errors;
}

// Paket review (review-export.schema.json) + catatan pemetaan yang disimpan di bank.
// options: { includeCalibration, rng, now }
export async function buildReviewPackage(bank, ids, { includeCalibration = false, rng = Math.random, now = Date.now() } = {}) {
  const errors = checkReviewSelection(bank, ids);
  if (errors.length) throw new BankError(errors.join(' '));
  const qs = ids.map((id) => findQuestion(bank, id));
  let calibration = null;
  if (includeCalibration) {
    const pool = bank.pack.questions.filter((q) => q.lifecycle.status === 'CALIBRATION');
    if (!pool.length) throw new BankError('Belum ada soal kalibrasi. Impor batch kalibrasi lebih dulu.');
    const sameGroup = pool.filter((q) => GROUPS[q.type] === GROUPS[qs[0].type]);
    const from = sameGroup.length ? sameGroup : pool;
    calibration = from[Math.floor(rng() * from.length)];
  }
  const all = shuffle(calibration ? [...qs, calibration] : qs, rng);
  bank.reviewCounter += 1;
  const batchId = `${bank.subjectId.toUpperCase()}-RV${String(bank.reviewCounter).padStart(3, '0')}`;
  const keyMap = {};
  const items = [];
  let calibrationKey = null;
  for (const [i, q] of all.entries()) {
    const key = `R${String(i + 1).padStart(2, '0')}`;
    const hash = await contentHash(q);
    keyMap[key] = { questionId: q.id, contentHash: hash };
    if (q === calibration) calibrationKey = key;
    items.push(reviewItem(q, key, hash));
  }
  const pkg = {
    reviewVersion: SCHEMA_VERSION,
    batchId,
    subjectName: bank.pack.subjectName,
    topics: clone(bank.pack.topics),
    competencies: clone(bank.pack.competencies),
    items,
  };
  const schemaErrors = validateDocument('review-export', pkg);
  if (schemaErrors.length) throw new BankError(`Paket review tidak valid: ${schemaErrors[0].path}: ${schemaErrors[0].message}`);
  bank.pendingReviews.push({ batchId, exportedAt: iso(now), keyMap, calibrationKey, imports: [], package: pkg });
  bank.log.push({ at: iso(now), message: `Paket review ${batchId} diekspor: ${ids.join(', ')}${calibration ? ' + 1 soal kalibrasi' : ''}.` });
  return pkg;
}

export function reviewPromptText(promptText, pkg) {
  return `${promptText.trim()}\n\n## PAKET REVIEW (JSON)\n\n${JSON.stringify(pkg, null, 2)}\n`;
}

// Permintaan revisi untuk AI penyusun (D-79): temuan review terakhir + JSON soal
// dalam bentuk item batch (lifecycle dikosongkan seperti keluaran penyusun), siap
// ditempel ke Project penyusun. Batch asal soal tidak tercatat di bank.
export function revisionRequestText(bank, ids) {
  if (!ids.length) throw new BankError('Pilih minimal satu soal.');
  const qs = ids.map((id) => {
    const q = findQuestion(bank, id);
    if (!q) throw new BankError(`Soal ${id} tidak ada di bank.`);
    return q;
  });
  const sections = qs.map((q) => {
    const review = q.lifecycle.review;
    const lines = [`## ${q.id}`];
    if (!review) lines.push('Belum ada hasil review untuk soal ini.');
    else {
      const r = review.result;
      lines.push(`Verdict reviewer: ${r.verdict} (keyakinan ${r.confidence}, kesepakatan kunci ${r.keyAgreement})`);
      lines.push(`Ringkasan reviewer: ${r.summary}`);
      lines.push(`Jawaban independen reviewer: ${r.independentAnswer}`);
      lines.push('Temuan:');
      if (r.findings.length) r.findings.forEach((f, i) => lines.push(`${i + 1}. [${f.severity}] ${f.dimension}: ${f.issue}${f.suggestedFix ? ` Saran: ${f.suggestedFix}` : ''}`));
      else lines.push('(tanpa temuan)');
    }
    return lines.join('\n');
  });
  const items = qs.map((q) => {
    const item = clone(q);
    item.lifecycle = { status: q.lifecycle.status === 'CALIBRATION' ? 'CALIBRATION' : 'DRAFT', contentHash: '', review: null, approvedBy: null, approvedAt: null };
    return item;
  });
  return [
    'Mohon revisi soal berikut sesuai bagian "Revisi" pada instruksi penyusun.',
    `subjectId: ${bank.subjectId} · schemaVersion: ${SCHEMA_VERSION} · soal: ${qs.map((q) => q.id).join(', ')}`,
    'batchId batch asal tidak tercatat di aplikasi. Pakai batchId asal bila Anda mengetahuinya; bila tidak, buat batchId baru.',
    '',
    '# TEMUAN REVIEWER',
    '',
    sections.join('\n\n'),
    '',
    '# SOAL SAAT INI (JSON)',
    '',
    '```json',
    JSON.stringify(items, null, 2),
    '```',
    '',
  ].join('\n');
}

// Keputusan otomatis (SPEC 8): APPROVE tanpa temuan kritis -> AI_REVIEWED;
// REVISE atau ada temuan kritis -> NEEDS_REVISION; REJECT -> REJECTED.
export function decide(item) {
  if (item.verdict === 'REJECT') return 'REJECTED';
  const critical = item.findings.some((f) => f.severity === 'kritis');
  if (item.verdict === 'APPROVE' && !critical) return 'AI_REVIEWED';
  return 'NEEDS_REVISION';
}

// Kalibrasi tertangkap bila verdict bukan APPROVE DAN ada temuan kritis/mayor pada defectDimension.
export function calibrationCaught(item, calibration) {
  return item.verdict !== 'APPROVE'
    && item.findings.some((f) => (f.severity === 'kritis' || f.severity === 'mayor') && f.dimension === calibration.defectDimension);
}

const err = (path, message) => ({ path, message });

// Validasi hasil review terhadap paket yang diekspor. Hasil:
// { ok, errors, warnings, result, pending, calibration: null | { key, questionId, caught } }
export function validateReviewResult(bank, input) {
  let data = input;
  if (typeof input === 'string') {
    const parsed = extractJson(input);
    if (!parsed.ok) return { ok: false, errors: parsed.errors, warnings: [] };
    data = parsed.data;
  }
  const fail = (errors) => ({ ok: false, errors, warnings: [] });
  if (!data || typeof data !== 'object' || Array.isArray(data)) return fail([err('$', 'Hasil review harus berupa satu objek JSON { ... }.')]);
  const pending = bank.pendingReviews.find((p) => p.batchId === data.batchId);
  if (!pending) {
    return fail([err('$.batchId', `tidak ada paket review "${data.batchId ?? ''}" yang menunggu hasil di bank ini. Pastikan AI menyalin batchId dari paket.`)]);
  }
  const schemaErrors = validateDocument('review-result', data);
  if (schemaErrors.length) {
    return fail(schemaErrors.map((e) => {
      const m = /^\$\.items\[(\d+)\]/.exec(e.path);
      const key = m && data.items[Number(m[1])] && data.items[Number(m[1])].reviewKey;
      return key && !e.message.includes(key) ? { ...e, message: `${key}: ${e.message}` } : e;
    }));
  }
  if (pending.imports.some((imp) => imp.reviewerModel === data.reviewerModel)) {
    return fail([err('$.reviewerModel', `hasil dari ${data.reviewerModel} untuk ${data.batchId} sudah pernah diimpor. Review ganda memakai reviewer (model) lain.`)]);
  }

  const errors = [];
  const warnings = [];
  const seen = new Set();
  data.items.forEach((item, i) => {
    const path = `$.items[${i}]`;
    const ref = pending.keyMap[item.reviewKey];
    if (!ref) {
      errors.push(err(`${path}.reviewKey`, `${item.reviewKey} tidak ada di paket ${data.batchId}.`));
      return;
    }
    if (seen.has(item.reviewKey)) {
      errors.push(err(`${path}.reviewKey`, `${item.reviewKey} muncul lebih dari sekali.`));
      return;
    }
    seen.add(item.reviewKey);
    if (item.contentHash !== ref.contentHash) {
      errors.push(err(`${path}.contentHash`, `${item.reviewKey}: tidak sama dengan paket. AI harus menyalin contentHash persis.`));
    }
    const q = findQuestion(bank, ref.questionId);
    if (!q) {
      errors.push(err(`${path}.reviewKey`, `${item.reviewKey}: soal ${ref.questionId} sudah tidak ada di bank.`));
      return;
    }
    if (item.reviewKey === pending.calibrationKey) return;
    if (q.lifecycle.contentHash !== ref.contentHash) {
      errors.push(err(`${path}.reviewKey`, `${item.reviewKey}: soal ${q.id} sudah berubah sejak paket diekspor; ekspor paket review baru.`));
    } else if (!ACCEPTS_REVIEW.includes(q.lifecycle.status)) {
      errors.push(err(`${path}.reviewKey`, `${item.reviewKey}: soal ${q.id} sudah berstatus ${STATUS_LABELS[q.lifecycle.status]}; hasil review tidak dapat diterapkan.`));
    }
    if (item.verdict === 'APPROVE' && item.findings.some((f) => f.severity === 'mayor')) {
      warnings.push(`${q.id} (${item.reviewKey}): APPROVE dengan temuan mayor; menurut aturan aplikasi tetap Lolos review AI. Periksa sebelum menyetujui.`);
    }
    if (item.verdict === 'APPROVE' && item.keyAgreement !== 'setuju') {
      warnings.push(`${q.id} (${item.reviewKey}): reviewer APPROVE tetapi keyAgreement "${item.keyAgreement}". Periksa kunci sebelum menyetujui.`);
    }
  });
  const missing = Object.keys(pending.keyMap).filter((k) => !seen.has(k));
  if (missing.length) errors.push(err('$.items', `belum ada hasil untuk ${missing.join(', ')}. Jumlah items harus sama dengan paket.`));
  if (errors.length) return fail(errors);

  let calibration = null;
  if (pending.calibrationKey) {
    const ref = pending.keyMap[pending.calibrationKey];
    const q = findQuestion(bank, ref.questionId);
    const item = data.items.find((x) => x.reviewKey === pending.calibrationKey);
    calibration = { key: pending.calibrationKey, questionId: q.id, caught: calibrationCaught(item, q.calibration), dimension: q.calibration.defectDimension };
  }
  return { ok: true, errors: [], warnings, result: data, pending, calibration };
}

// Menerapkan hasil review yang sudah tervalidasi. Bila soal kalibrasi tidak tertangkap,
// seluruh hasil batch DITOLAK: dicatat, statistik diperbarui, status soal tidak berubah.
// Hasil: { rejectedByCalibration, decisions: [{ questionId, verdict, decision, status, conflict }] }
export function applyReviewResult(bank, validation, now) {
  if (!validation.ok) throw new BankError('Hasil review belum valid.');
  const { result, pending, calibration } = validation;
  const model = result.reviewerModel;
  if (calibration) {
    const s = bank.calibrationStats[model] || { caught: 0, missed: 0 };
    if (calibration.caught) s.caught++;
    else s.missed++;
    s.lastAt = iso(now);
    bank.calibrationStats[model] = s;
  }
  if (calibration && !calibration.caught) {
    pending.imports.push({ reviewerModel: model, importedAt: iso(now), outcome: 'DITOLAK_KALIBRASI' });
    bank.log.push({ at: iso(now), message: `Hasil review ${result.batchId} dari ${model} DITOLAK: soal kalibrasi (${calibration.questionId}, cacat ${calibration.dimension}) tidak tertangkap. Soal tetap pada status sebelumnya.` });
    return { rejectedByCalibration: true, decisions: [] };
  }
  const decisions = [];
  for (const item of result.items) {
    if (item.reviewKey === pending.calibrationKey) continue;
    const ref = pending.keyMap[item.reviewKey];
    const q = findQuestion(bank, ref.questionId);
    const decision = decide(item);
    const record = { questionId: q.id, contentHash: ref.contentHash, batchId: result.batchId, reviewerModel: model, reviewedAt: result.reviewedAt, decision, verdict: item.verdict };
    const earlier = bank.reviewRecords.filter((r) => r.questionId === q.id && r.contentHash === ref.contentHash && r.reviewerModel !== model);
    bank.reviewRecords.push(record);
    q.lifecycle.review = { batchId: result.batchId, reviewerModel: model, reviewedAt: result.reviewedAt, result: clone(item) };
    const all = [...earlier, record];
    const distinct = [...new Set(all.map((r) => r.decision))];
    let target = decision;
    let conflict = false;
    if (distinct.length > 1) {
      // Review ganda berbeda pendapat: status paling hati-hati sampai manusia memutuskan.
      conflict = true;
      target = distinct.sort((a, b) => DECISION_RANK[b] - DECISION_RANK[a])[0];
      bank.conflicts[q.id] = { contentHash: ref.contentHash, decisions: all.map((r) => ({ reviewerModel: r.reviewerModel, verdict: r.verdict, decision: r.decision, batchId: r.batchId })) };
    }
    const from = q.lifecycle.status;
    const reason = `review ${result.batchId} oleh ${model}: ${item.verdict}${conflict ? ' (berbeda dengan review lain)' : ''}`;
    if (from !== target) {
      q.lifecycle.history = [...(q.lifecycle.history || []), { from, to: target, at: iso(now), by: model, reason }];
      q.lifecycle.status = target;
    }
    decisions.push({ questionId: q.id, verdict: item.verdict, decision, status: target, conflict });
  }
  pending.imports.push({ reviewerModel: model, importedAt: iso(now), outcome: 'DITERAPKAN' });
  const tally = decisions.reduce((acc, d) => ({ ...acc, [d.status]: (acc[d.status] || 0) + 1 }), {});
  bank.log.push({ at: iso(now), message: `Hasil review ${result.batchId} dari ${model} diterapkan: ${Object.entries(tally).map(([s, n]) => `${n} ${STATUS_LABELS[s]}`).join(', ')}${calibration ? '; kalibrasi tertangkap' : ''}.` });
  return { rejectedByCalibration: false, decisions };
}

// Statistik tangkapan kalibrasi per reviewerModel: [{ model, caught, missed, rate }].
export function calibrationTable(bank) {
  return Object.entries(bank.calibrationStats).map(([model, s]) => ({
    model, caught: s.caught, missed: s.missed, rate: s.caught + s.missed ? s.caught / (s.caught + s.missed) : null, lastAt: s.lastAt,
  }));
}
