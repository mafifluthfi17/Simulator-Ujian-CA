// Batch soal dan hasil review sintetis untuk tes A3 (berdasarkan soal demo).
// Isi soal diberi awalan [UJI-A3]; bukan soal MSK.

const clone = (x) => JSON.parse(JSON.stringify(x));

// Membuat soal DRAFT baru dari soal demo bertipe `type`.
export function draftFrom(pack, type, n, { calibration = null } = {}) {
  const template = pack.questions.find((q) => q.type === type);
  const prefix = { mcq: 'MCQ', numeric: 'NUM', essay: 'ESA', case: 'KAS' }[type];
  const q = clone(template);
  q.id = `DEMO-${prefix}-${String(100 + n).padStart(3, '0')}`;
  q.stem = `[UJI-A3 ${n}] ${template.stem.replace(/^\[DEMO\]\s*/, '')}`;
  q.lifecycle = { status: calibration ? 'CALIBRATION' : 'DRAFT', contentHash: '', review: null, approvedBy: null, approvedAt: null };
  q.authoring = { createdBy: 'AI', model: 'penyusun-uji', createdAt: '2026-10-17', revision: 1, notes: '' };
  if (calibration) q.calibration = calibration;
  return q;
}

export function makeBatch(pack, items, batchId = 'DEMO-B01') {
  return { batchType: 'soal', schemaVersion: '4.1', subjectId: pack.subjectId, batchId, items };
}

export const KEY_DEFECT = { defectDimension: 'keyCorrectness', defectDescription: 'Kunci sengaja ditukar dengan distraktor.', expectedVerdict: 'REJECT' };

const SCORES = {
  keyCorrectness: 5, singleBestAnswer: 5, stemClarity: 4, distractorQuality: 4, rubricQuality: null,
  dataConsistency: null, alignment: 4, timeEstimate: 4, originality: 5, fairness: 5,
};

// Hasil review untuk paket `pkg`. verdictFor(item) -> { verdict, findings? } (bawaan APPROVE tanpa temuan).
export function makeReviewResult(pkg, { model = 'reviewer-uji', verdictFor = () => ({ verdict: 'APPROVE' }) } = {}) {
  return {
    reviewVersion: '4.1',
    batchId: pkg.batchId,
    reviewerModel: model,
    reviewedAt: '2026-10-17T10:00:00+07:00',
    items: pkg.items.map((item) => {
      const v = verdictFor(item);
      return {
        reviewKey: item.reviewKey,
        contentHash: item.contentHash,
        independentAnswer: item.answerKey || 'Jawaban independen reviewer uji.',
        keyAgreement: v.verdict === 'APPROVE' ? 'setuju' : 'sebagian',
        dimensionScores: { ...SCORES },
        findings: v.findings || [],
        suggestedDifficulty: item.difficulty,
        verdict: v.verdict,
        confidence: 'sedang',
        summary: `Hasil uji ${v.verdict}.`,
      };
    }),
    batchNotes: 'Catatan uji.',
  };
}

export const finding = (severity, dimension) => ({ severity, dimension, issue: `Temuan ${severity} pada ${dimension}.`, suggestedFix: 'Perbaiki.' });
