// Penilaian (SPEC 10): mcq dan numeric dinilai aplikasi; esai dan kasus dari
// hasil AI yang sudah divalidasi (grading-io.js). Nilai akhir SELALU dihitung
// aplikasi = skor PG/numerik + skor uraian (jumlah skor kriteria x faktor skala);
// total dari AI tidak pernah dipakai.
//
// Skor uraian efektif diturunkan dari data yang tersimpan (DECISIONS D-36):
// impor AI terakhir yang memuat soal itu, lalu koreksi manual yang dibuat
// sesudah impor tersebut. Impor ulang tidak menghapus koreksi lama; koreksi
// lama hanya tidak berlaku lagi untuk soal yang dinilai ulang.

import { getType } from '../types/registry.js';
import { roundScore } from './format.js';

export const AI_GRADED = new Set(['essay', 'case']);
const SUM_TOLERANCE = 0.01;

export function needsAiGrading(session) {
  return session.items.some((it) => AI_GRADED.has(it.type));
}

export function aiItems(session) {
  return session.items.filter((it) => AI_GRADED.has(it.type));
}

export function scoreSubmission(session) {
  const autoScores = [];
  for (const item of session.items) {
    const type = getType(item.type);
    if (!type.autoScore) continue;
    const raw = type.autoScore(item.question, session.answers[item.questionId].value);
    autoScores.push({ questionId: item.questionId, rawScore: raw, scaledScore: roundScore(raw * item.scaleFactor) });
  }
  const grading = {
    status: 'MENUNGGU_PENILAIAN_URAIAN',
    answersChecksum: null,
    autoScores,
    aiImports: [],
    essayScores: [],
    manualCorrections: [],
    finalScore: null,
    passed: null,
  };
  return recomputeGrading({ ...session, grading }).grading;
}

// LULUS bila nilai >= passing grade SEBELUM pembulatan tampilan.
export function isPass(score, passingGrade) {
  return score >= passingGrade;
}

const sum = (values) => roundScore(values.reduce((a, b) => a + b, 0));
const differs = (a, b) => Math.abs(a - b) > SUM_TOLERANCE;

// Kriteria dari satu skor AI dalam bentuk datar: [{ subId, criterionId, maxScore, aiScore, justification }].
function flattenCriteria(score) {
  if (score.subQuestionScores.length) {
    return score.subQuestionScores.flatMap((s) => s.criteriaScores.map((c) => ({
      subId: s.subId, criterionId: c.criterionId, maxScore: c.maxScore, aiScore: c.awardedScore, justification: c.justification,
    })));
  }
  return score.criteriaScores.map((c) => ({
    subId: null, criterionId: c.criterionId, maxScore: c.maxScore, aiScore: c.awardedScore, justification: c.justification,
  }));
}

// awardedScore dari AI yang tidak sama dengan jumlah komponennya (soal atau sub-pertanyaan).
export function sumMismatches(score) {
  const found = [];
  if (score.subQuestionScores.length) {
    let subsTotal = 0;
    for (const s of score.subQuestionScores) {
      const total = sum(s.criteriaScores.map((c) => c.awardedScore));
      if (differs(s.awardedScore, total)) found.push({ subId: s.subId, stated: s.awardedScore, computed: total });
      subsTotal += total;
    }
    const total = roundScore(subsTotal);
    if (differs(score.awardedScore, total)) found.push({ subId: null, stated: score.awardedScore, computed: total });
  } else {
    const total = sum(score.criteriaScores.map((c) => c.awardedScore));
    if (differs(score.awardedScore, total)) found.push({ subId: null, stated: score.awardedScore, computed: total });
  }
  return found;
}

// Map questionId -> evaluasi efektif:
// { questionId, importIndex, importedAt, graderModel, score, criteria: [{ subId, criterionId, maxScore,
//   aiScore, awardedScore, justification, corrected }], rawScore, aiAwardedScore, sumMismatch,
//   manuallyCorrected, corrections: [koreksi yang berlaku], flags: [reviewFlags soal ini] }
export function effectiveEvaluations(session) {
  const g = session.grading;
  const byQuestion = new Map();
  if (!g) return byQuestion;
  g.aiImports.forEach((imp, importIndex) => {
    for (const score of imp.result.scores) {
      byQuestion.set(score.questionId, {
        questionId: score.questionId,
        importIndex,
        importedAt: imp.importedAt,
        graderModel: imp.result.graderModel,
        score,
        flags: imp.result.reviewFlags.filter((f) => f.questionId === score.questionId),
      });
    }
  });
  for (const ev of byQuestion.values()) {
    const since = Date.parse(ev.importedAt);
    ev.corrections = g.manualCorrections.filter((c) => c.questionId === ev.questionId && Date.parse(c.at) >= since);
    ev.criteria = flattenCriteria(ev.score).map((c) => {
      const applied = ev.corrections.filter((m) => m.criterionId === c.criterionId && (m.subId ?? null) === c.subId);
      const last = applied[applied.length - 1];
      return { ...c, awardedScore: last ? last.after : c.aiScore, corrected: Boolean(last) };
    });
    ev.rawScore = sum(ev.criteria.map((c) => c.awardedScore));
    ev.aiAwardedScore = ev.score.awardedScore;
    ev.mismatches = sumMismatches(ev.score);
    ev.sumMismatch = ev.mismatches.length > 0;
    ev.manuallyCorrected = ev.criteria.some((c) => c.corrected);
  }
  return byQuestion;
}

// Menghitung ulang essayScores, status, nilai akhir, dan LULUS dari data tersimpan.
export function recomputeGrading(session) {
  const g = session.grading;
  const evaluations = effectiveEvaluations(session);
  const pending = aiItems(session);
  g.essayScores = pending.filter((it) => evaluations.has(it.questionId)).map((it) => {
    const ev = evaluations.get(it.questionId);
    return {
      questionId: it.questionId,
      rawScore: ev.rawScore,
      scaledScore: roundScore(ev.rawScore * it.scaleFactor),
      sumMismatch: ev.sumMismatch,
      manuallyCorrected: ev.manuallyCorrected,
    };
  });
  const graded = g.essayScores.length;
  g.status = graded === pending.length ? 'FINAL' : graded === 0 ? 'MENUNGGU_PENILAIAN_URAIAN' : 'PENILAIAN_SEBAGIAN';
  if (g.status === 'FINAL') {
    g.finalScore = currentTotal(session);
    g.passed = isPass(g.finalScore, session.config.passingGrade);
  } else {
    g.finalScore = null;
    g.passed = null;
  }
  return session;
}

// Jumlah skor yang sudah ada (PG/numerik + uraian yang sudah dinilai), skala 100.
export function currentTotal(session) {
  const g = session.grading;
  return sum([...g.autoScores, ...g.essayScores].map((s) => s.scaledScore));
}

// Ringkasan per komponen untuk layar hasil dan laporan.
export function componentSummary(session) {
  const rows = new Map();
  for (const item of session.items) {
    const row = rows.get(item.type) || { type: item.type, count: 0, graded: 0, max: 0, score: 0, aiGraded: AI_GRADED.has(item.type) };
    row.count++;
    row.max = roundScore(row.max + item.points);
    rows.set(item.type, row);
  }
  const g = session.grading;
  for (const s of g ? [...g.autoScores, ...g.essayScores] : []) {
    const item = session.items.find((it) => it.questionId === s.questionId);
    const row = rows.get(item.type);
    row.graded++;
    row.score = roundScore(row.score + s.scaledScore);
  }
  return [...rows.values()].map((r) => ({ ...r, pending: r.graded < r.count }));
}
