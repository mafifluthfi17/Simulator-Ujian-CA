// Ekspor paket penilaian esai/kasus, validasi impor hasil AI, dan koreksi manual
// (SPEC 5.5 dan 10). Fungsi murni tanpa DOM; waktu `now` dari pemanggil.

import { getType } from '../types/registry.js';
import { sha256Hex } from './hash.js';
import { validateDocument } from './contract.js';
import { SCHEMA_VERSION } from './version.js';
import { aiItems, effectiveEvaluations, recomputeGrading, sumMismatches } from './scoring.js';
import { formatNumber } from './format.js';

const iso = (ms) => new Date(ms).toISOString();
const isHalfStep = (n) => typeof n === 'number' && Number.isFinite(n) && Math.abs(n * 2 - Math.round(n * 2)) < 1e-9;
const fmt = (n) => formatNumber(n);

// Jawaban yang dikirim ke AI per soal uraian, dalam urutan tampil.
export function gradingAnswers(session) {
  return aiItems(session).map((item) => {
    const { answer, isBlank } = getType(item.type).exportForGrading(item.question, session.answers[item.questionId].value);
    return { item, answer, isBlank };
  });
}

// DECISIONS D-14: JSON.stringify([[questionId, answer], ...]) terurut questionId (code point).
export function checksumPayload(pairs) {
  const sorted = pairs.map(([id, answer]) => [id, answer]).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return JSON.stringify(sorted);
}

export async function answersChecksum(session) {
  return sha256Hex(checksumPayload(gradingAnswers(session).map(({ item, answer }) => [item.questionId, answer])));
}

// Paket penilaian (grading-export.schema.json). Urutan field mengikuti SPEC 5.5.
export async function buildGradingPackage(session) {
  const answers = gradingAnswers(session);
  if (!answers.length) throw new Error('Sesi ini tidak memiliki soal esai atau kasus.');
  const items = answers.map(({ item, answer, isBlank }) => {
    const q = item.question;
    const out = { questionId: item.questionId, type: item.type, stem: q.stem };
    if (item.type === 'case') {
      out.caseNarrative = q.caseNarrative;
      if (q.caseData) out.caseData = q.caseData;
      out.subQuestions = q.subQuestions;
    }
    out.maxScore = q.maxScore;
    if (item.type === 'essay') out.rubric = q.rubric;
    if (q.modelAnswer !== undefined) out.modelAnswer = q.modelAnswer;
    out.acceptableAlternatives = q.acceptableAlternatives;
    out.answer = answer;
    out.isBlank = isBlank;
    return out;
  });
  return {
    gradingVersion: SCHEMA_VERSION,
    sessionId: session.sessionId,
    subjectId: session.subjectId,
    packVersion: session.packVersion,
    answersChecksum: await answersChecksum(session),
    items,
  };
}

// Teks untuk tombol "Salin Prompt + Data": Prompt D + JSON paket penilaian.
export function promptPlusData(promptText, pkg) {
  return `${promptText.trim()}\n\n## PAKET PENILAIAN (JSON)\n\n${JSON.stringify(pkg, null, 2)}\n`;
}

// Membaca teks tempelan: BOM, spasi, dan pagar ```json ... ``` dibuang (DECISIONS D-38).
export function parseResultText(text) {
  let s = String(text ?? '').replace(/^﻿/, '').trim();
  const fenced = /^```[a-zA-Z]*\s*\n([\s\S]*?)\n?```$/.exec(s);
  if (fenced) s = fenced[1].trim();
  if (!s) return { ok: false, errors: [{ path: '$', message: 'Teks hasil penilaian masih kosong. Tempel jawaban AI lebih dulu.' }] };
  try {
    return { ok: true, data: JSON.parse(s) };
  } catch (e) {
    return {
      ok: false,
      errors: [{ path: '$', message: `Teks bukan JSON yang valid (${e.message}). Salin seluruh jawaban AI, dari tanda { pertama sampai } terakhir.` }],
    };
  }
}

const err = (path, message) => ({ path, message });

// Validasi hasil penilaian AI terhadap sesi (SPEC 10). Hasil:
// { ok, errors: [{ path, message }], warnings: [teks], result, questionIds, regraded: [questionId] }.
// Hasil boleh mencakup sebagian soal uraian (PENILAIAN SEBAGIAN), tetapi setiap soal
// yang dicantumkan harus dinilai lengkap.
export async function validateGradingResult(session, input) {
  let data = input;
  if (typeof input === 'string') {
    const parsed = parseResultText(input);
    if (!parsed.ok) return { ok: false, errors: parsed.errors, warnings: [] };
    data = parsed.data;
  }
  const fail = (errors) => ({ ok: false, errors, warnings: [] });
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return fail([err('$', 'Hasil penilaian harus berupa satu objek JSON { ... }.')]);
  }
  if (session.status !== 'SUBMITTED') return fail([err('$', 'Ujian belum dikumpulkan; hasil penilaian belum dapat diimpor.')]);

  // 1. Dokumen untuk sesi ini? (versi, sesi, checksum jawaban)
  const identity = [];
  if (data.gradingVersion !== SCHEMA_VERSION) {
    identity.push(err('$.gradingVersion', `harus "${SCHEMA_VERSION}", tertulis ${JSON.stringify(data.gradingVersion ?? null)}.`));
  }
  if (data.sessionId !== session.sessionId) {
    identity.push(err('$.sessionId', `hasil ini untuk sesi ${JSON.stringify(data.sessionId ?? null)}, bukan sesi ini (${session.sessionId}).`));
  }
  const expected = await answersChecksum(session);
  if (data.answersChecksum !== expected) {
    identity.push(err('$.answersChecksum', 'tidak cocok dengan jawaban sesi ini. Gunakan paket penilaian dari sesi ini dan pastikan AI menyalin answersChecksum persis tanpa perubahan.'));
  }
  if (identity.length) return fail(identity);

  // 2. Bentuk data (skema): field wajib, tipe, kelipatan 0,5, field tak dikenal.
  const schemaErrors = validateDocument('grading-result', data);
  if (schemaErrors.length) return fail(schemaErrors);

  // 3. Aturan isi.
  const errors = [];
  const warnings = [];
  const items = new Map(aiItems(session).map((it) => [it.questionId, it]));
  const seen = new Map();
  data.scores.forEach((score, i) => {
    const path = `$.scores[${i}]`;
    if (!items.has(score.questionId)) {
      errors.push(err(`${path}.questionId`, `soal ${score.questionId} bukan soal esai/kasus di sesi ini.`));
      return;
    }
    if (seen.has(score.questionId)) {
      errors.push(err(`${path}.questionId`, `soal ${score.questionId} dinilai lebih dari sekali (juga di scores[${seen.get(score.questionId)}]).`));
      return;
    }
    seen.set(score.questionId, i);
    checkScore(items.get(score.questionId), score, path, errors);
  });

  const evaluated = data.evaluatedQuestionIds;
  evaluated.forEach((id, i) => {
    if (!items.has(id)) errors.push(err(`$.evaluatedQuestionIds[${i}]`, `soal ${id} bukan soal esai/kasus di sesi ini.`));
  });
  const missing = evaluated.filter((id) => items.has(id) && !seen.has(id));
  const extra = [...seen.keys()].filter((id) => !evaluated.includes(id));
  if (missing.length) errors.push(err('$.scores', `tidak ada skor untuk ${missing.join(', ')} padahal tercantum di evaluatedQuestionIds.`));
  if (extra.length) errors.push(err('$.evaluatedQuestionIds', `${extra.join(', ')} dinilai di scores tetapi tidak tercantum di evaluatedQuestionIds.`));
  data.reviewFlags.forEach((f, i) => {
    if (!items.has(f.questionId)) errors.push(err(`$.reviewFlags[${i}].questionId`, `soal ${f.questionId} bukan soal esai/kasus di sesi ini.`));
  });
  if (errors.length) return fail(errors);

  for (const score of data.scores) {
    for (const m of sumMismatches(score)) {
      const where = m.subId ? `${score.questionId} bagian (${m.subId})` : score.questionId;
      warnings.push(`${where}: awardedScore dari AI ${fmt(m.stated)} tidak sama dengan jumlah skor komponennya ${fmt(m.computed)}; aplikasi memakai ${fmt(m.computed)}.`);
    }
  }
  const already = effectiveEvaluations(session);
  return {
    ok: true,
    errors: [],
    warnings,
    result: data,
    questionIds: [...seen.keys()],
    regraded: [...seen.keys()].filter((id) => already.has(id)),
  };
}

function checkScore(item, score, path, errors) {
  const q = item.question;
  const id = item.questionId;
  if (score.maxScore !== q.maxScore) {
    errors.push(err(`${path}.maxScore`, `soal ${id}: maxScore harus ${fmt(q.maxScore)} (skala asli soal), tertulis ${fmt(score.maxScore)}.`));
  }
  checkAwarded(score.awardedScore, score.maxScore, `${path}.awardedScore`, `soal ${id}`, errors);
  if (item.type === 'essay') {
    if (score.subQuestionScores.length) errors.push(err(`${path}.subQuestionScores`, `soal esai ${id}: harus [] (kosong).`));
    checkCriteria(q.rubric, score.criteriaScores, `${path}.criteriaScores`, `soal ${id}`, errors);
    return;
  }
  if (score.criteriaScores.length) {
    errors.push(err(`${path}.criteriaScores`, `soal kasus ${id}: harus [] (kosong); skor kriteria diisi di subQuestionScores.`));
  }
  const subs = new Map(q.subQuestions.map((s) => [s.id, s]));
  const seen = new Set();
  score.subQuestionScores.forEach((s, j) => {
    const at = `${path}.subQuestionScores[${j}]`;
    const sub = subs.get(s.subId);
    if (!sub) {
      errors.push(err(`${at}.subId`, `soal ${id}: tidak ada sub-pertanyaan "${s.subId}".`));
      return;
    }
    if (seen.has(s.subId)) {
      errors.push(err(`${at}.subId`, `soal ${id}: sub-pertanyaan (${s.subId}) dinilai lebih dari sekali.`));
      return;
    }
    seen.add(s.subId);
    const owner = `soal ${id} bagian (${s.subId})`;
    if (s.maxScore !== sub.maxScore) errors.push(err(`${at}.maxScore`, `${owner}: maxScore harus ${fmt(sub.maxScore)}, tertulis ${fmt(s.maxScore)}.`));
    checkAwarded(s.awardedScore, s.maxScore, `${at}.awardedScore`, owner, errors);
    checkCriteria(sub.rubric, s.criteriaScores, `${at}.criteriaScores`, owner, errors);
  });
  const missing = q.subQuestions.filter((s) => !seen.has(s.id)).map((s) => `(${s.id})`);
  if (missing.length) errors.push(err(`${path}.subQuestionScores`, `soal ${id}: sub-pertanyaan ${missing.join(', ')} belum dinilai.`));
}

function checkCriteria(rubric, criteria, path, owner, errors) {
  const byId = new Map(rubric.map((c) => [c.criterionId, c]));
  const seen = new Set();
  criteria.forEach((c, k) => {
    const at = `${path}[${k}]`;
    const ref = byId.get(c.criterionId);
    if (!ref) {
      errors.push(err(`${at}.criterionId`, `${owner}: kriteria ${c.criterionId} tidak ada di rubrik.`));
      return;
    }
    if (seen.has(c.criterionId)) {
      errors.push(err(`${at}.criterionId`, `${owner}: kriteria ${c.criterionId} dinilai lebih dari sekali.`));
      return;
    }
    seen.add(c.criterionId);
    if (c.maxScore !== ref.maxScore) {
      errors.push(err(`${at}.maxScore`, `${owner} kriteria ${c.criterionId}: maxScore harus ${fmt(ref.maxScore)} sesuai rubrik, tertulis ${fmt(c.maxScore)}.`));
    }
    checkAwarded(c.awardedScore, Math.min(c.maxScore, ref.maxScore), `${at}.awardedScore`, `${owner} kriteria ${c.criterionId}`, errors);
  });
  const missing = rubric.filter((c) => !seen.has(c.criterionId)).map((c) => c.criterionId);
  if (missing.length) errors.push(err(path, `${owner}: kriteria ${missing.join(', ')} belum dinilai.`));
}

function checkAwarded(value, max, path, owner, errors) {
  if (value < 0) errors.push(err(path, `${owner}: skor tidak boleh negatif (tertulis ${fmt(value)}).`));
  else if (value > max) errors.push(err(path, `${owner}: skor ${fmt(value)} melebihi maksimum ${fmt(max)}.`));
  if (!isHalfStep(value)) errors.push(err(path, `${owner}: skor harus kelipatan 0,5 (tertulis ${value}).`));
}

// Menyimpan hasil yang sudah lolos validasi ke sesi lalu menghitung ulang status dan nilai.
export async function applyGradingResult(session, validation, now) {
  if (!validation.ok) throw new Error('Hasil penilaian belum valid.');
  const g = session.grading;
  g.answersChecksum = validation.result.answersChecksum;
  g.aiImports.push({ importedAt: iso(now), result: validation.result, warnings: validation.warnings });
  recomputeGrading(session);
  return session;
}

// Koreksi manual satu skor kriteria (SPEC 10). Alasan wajib; dicatat dan ditandai di laporan.
// correction: { questionId, subId (null untuk esai), criterionId, after, reason }
export function applyManualCorrection(session, correction, now) {
  const { questionId, criterionId } = correction;
  const subId = correction.subId ?? null;
  const ev = effectiveEvaluations(session).get(questionId);
  if (!ev) throw new Error(`Soal ${questionId} belum dinilai; koreksi manual hanya untuk skor yang sudah ada.`);
  const criterion = ev.criteria.find((c) => c.criterionId === criterionId && c.subId === subId);
  if (!criterion) throw new Error(`Kriteria ${criterionId}${subId ? ` bagian (${subId})` : ''} tidak ada pada soal ${questionId}.`);
  const after = Number(correction.after);
  if (!Number.isFinite(after) || after < 0 || after > criterion.maxScore) {
    throw new Error(`Skor baru harus antara 0 dan ${fmt(criterion.maxScore)}.`);
  }
  if (!isHalfStep(after)) throw new Error('Skor baru harus kelipatan 0,5 (mis. 2 atau 2,5).');
  const reason = String(correction.reason ?? '').trim();
  if (!reason) throw new Error('Alasan koreksi wajib diisi.');
  if (after === criterion.awardedScore) throw new Error('Skor baru sama dengan skor saat ini.');
  session.grading.manualCorrections.push({
    questionId, subId, criterionId, before: criterion.awardedScore, after, reason, at: iso(now),
  });
  recomputeGrading(session);
  return session;
}
