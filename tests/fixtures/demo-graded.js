// Sesi demo deterministik + hasil penilaian contoh untuk tes A2 dan contoh laporan
// di tests/output/. Hasil penilaian di sini FIKTIF (bukan keluaran AI nyata).

import { createRng } from '../../js/core/random.js';
import { buildFromPackage, orderItems } from '../../js/core/blueprint.js';
import { createSession, setAnswer, submit } from '../../js/core/session.js';
import { answersChecksum } from '../../js/core/grading-io.js';

export const T0 = Date.parse('2026-10-17T01:00:00Z');
export const MIN = 60000;

export function newDemoSession(pack, { seed = 11, mode = 'latihan' } = {}) {
  const rng = createRng(seed);
  const pkg = pack.packages[0];
  const built = buildFromPackage(pack, pkg, rng);
  if (!built.ok) throw new Error(built.problems.join('; '));
  const weights = {};
  for (const s of pkg.sections) weights[s.type] = (weights[s.type] || 0) + s.weight;
  return createSession({
    pack, packageId: pkg.id, packageName: pkg.name, mode,
    config: { durationMinutes: pkg.durationMinutes, passingGrade: pack.passingGrade, shuffleQuestions: true, shuffleOptions: true, sectionWeights: weights },
    items: orderItems(built.items, true, rng), rng, now: T0,
  });
}

export const ESSAY_ANSWER = 'Laba bersih dan pertumbuhan pendapatan hanya menunjukkan hasil masa lalu (lagging) dan mendorong keputusan jangka pendek, misalnya menunda perawatan kebun.\n\nBalanced scorecard menambah perspektif pelanggan, proses internal, serta pembelajaran dan pertumbuhan. Contoh ukuran: ROCE, retensi distributor, rendemen pengolahan, dan jam pelatihan agronomi.';
export const CASE_ANSWER = {
  a: 'B2B menyumbang laba operasi terbesar (98,4), pergudangan paling efisien dengan margin 15%, sedangkan ritel hanya 5% dan ditekan pesaing digital.',
  b: 'Memperbesar armada ritel berisiko perang tarif. Pergudangan terpadu bersinergi dengan klien B2B dan marginnya tinggi. Saya merekomendasikan pergudangan; risikonya utilisasi gudang rendah pada tahun awal.',
};

// Menjawab sesi demo: PG pertama benar, PG kedua salah, numerik benar, esai dan kasus terisi.
export function answerDemo(session, now = T0 + 5 * MIN) {
  let mcqSeen = 0;
  for (const item of session.items) {
    const q = item.question;
    if (item.type === 'mcq') {
      const value = mcqSeen === 0 ? q.answerKey : ['A', 'B', 'C', 'D'].find((k) => k !== q.answerKey);
      mcqSeen++;
      setAnswer(session, item.questionId, value, now);
    } else if (item.type === 'numeric') {
      setAnswer(session, item.questionId, 47.8, now);
    } else if (item.type === 'essay') {
      setAnswer(session, item.questionId, ESSAY_ANSWER, now);
    } else {
      setAnswer(session, item.questionId, CASE_ANSWER, now);
    }
  }
  session.events.push({ type: 'focus_lost', at: new Date(now + MIN).toISOString(), durationMs: 12000 });
  return session;
}

const RATIOS = [0.75, 0.6, 0.8, 0.5, 0.7, 0.65];
const roundHalf = (n) => Math.round(n * 2) / 2;

function criteria(rubric, offset) {
  return rubric.map((c, i) => ({
    criterionId: c.criterionId,
    maxScore: c.maxScore,
    awardedScore: roundHalf(c.maxScore * RATIOS[(i + offset) % RATIOS.length]),
    justification: `Bukti untuk ${c.description.toLowerCase()} ditemukan sebagian di jawaban (contoh fiktif).`,
  }));
}
const total = (list) => list.reduce((n, c) => n + c.awardedScore, 0);

// Skor contoh untuk satu item sesi (esai atau kasus).
export function sampleScore(item) {
  const q = item.question;
  const base = {
    questionId: item.questionId, maxScore: q.maxScore,
    strengths: 'Membaca data dan konsep utama dengan benar.',
    weaknesses: 'Hubungan sebab-akibat dan dampak keuangan belum dijelaskan.',
    improvement: 'Tunjukkan rantai sebab-akibat dan hitung dampak keputusan pada laba.',
    confidence: 'sedang',
  };
  if (item.type === 'essay') {
    const cs = criteria(q.rubric, 0);
    return { ...base, awardedScore: total(cs), criteriaScores: cs, subQuestionScores: [] };
  }
  const subs = q.subQuestions.map((s, i) => {
    const cs = criteria(s.rubric, i + 1);
    return { subId: s.id, maxScore: s.maxScore, awardedScore: total(cs), criteriaScores: cs };
  });
  return { ...base, awardedScore: total(subs), criteriaScores: [], subQuestionScores: subs };
}

// Hasil penilaian contoh untuk soal uraian sesi (types: daftar tipe yang dinilai).
export async function sampleResult(session, { types = ['essay', 'case'] } = {}) {
  const items = session.items.filter((it) => types.includes(it.type));
  return {
    gradingVersion: '4.1',
    sessionId: session.sessionId,
    answersChecksum: await answersChecksum(session),
    graderModel: 'contoh-penilai (fiktif, untuk uji)',
    evaluatedQuestionIds: items.map((it) => it.questionId),
    scores: items.map(sampleScore),
    reviewFlags: [],
    overallFeedback: 'Contoh umpan balik fiktif: pemahaman konsep baik; perkuat analisis kuantitatif.',
  };
}

export function submittedDemo(pack, opts) {
  const s = answerDemo(newDemoSession(pack, opts));
  submit(s, 'MANUAL', T0 + 25 * MIN);
  return s;
}
