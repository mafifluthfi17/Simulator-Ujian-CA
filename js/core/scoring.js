// Penilaian otomatis mcq dan numeric serta status penilaian sesi (SPEC 10).
// Soal esai dan kasus menunggu penilaian AI (fase A2).

import { getType } from '../types/registry.js';
import { roundScore } from './format.js';

const AI_GRADED = new Set(['essay', 'case']);

export function needsAiGrading(session) {
  return session.items.some((it) => AI_GRADED.has(it.type));
}

export function scoreSubmission(session, questionsById, passingGrade) {
  const autoScores = [];
  for (const item of session.items) {
    const type = getType(item.type);
    if (!type.autoScore) continue;
    const question = questionsById.get(item.questionId);
    const raw = question ? type.autoScore(question, session.answers[item.questionId].value) : 0;
    autoScores.push({ questionId: item.questionId, rawScore: raw, scaledScore: roundScore(raw * item.scaleFactor) });
  }
  const pending = needsAiGrading(session);
  const autoTotal = roundScore(autoScores.reduce((n, s) => n + s.scaledScore, 0));
  return {
    status: pending ? 'MENUNGGU_PENILAIAN_URAIAN' : 'FINAL',
    answersChecksum: null,
    autoScores,
    aiImports: [],
    essayScores: [],
    manualCorrections: [],
    finalScore: pending ? null : autoTotal,
    passed: pending ? null : isPass(autoTotal, passingGrade),
  };
}

// LULUS bila nilai >= passing grade SEBELUM pembulatan tampilan.
export function isPass(score, passingGrade) {
  return score >= passingGrade;
}

// Ringkasan per komponen untuk layar hasil.
export function componentSummary(session) {
  const rows = new Map();
  for (const item of session.items) {
    const row = rows.get(item.type) || { type: item.type, count: 0, max: 0, score: 0, pending: AI_GRADED.has(item.type) };
    row.count++;
    row.max = roundScore(row.max + item.points);
    rows.set(item.type, row);
  }
  for (const s of (session.grading && session.grading.autoScores) || []) {
    const item = session.items.find((it) => it.questionId === s.questionId);
    const row = rows.get(item.type);
    row.score = roundScore(row.score + s.scaledScore);
  }
  return [...rows.values()];
}
