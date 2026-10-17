// Pack uji sintetis untuk TS-03 dan TS-14: 60 PG, 15 esai, 10 kasus (4 mini,
// 6 komprehensif) berstatus LIVE, ditambah soal non-LIVE yang tidak boleh
// pernah terpilih. Paket T1, T2, SIM mengikuti tabel SPEC 6. Hanya untuk tes.

const LEVELS = ['mudah', 'sedang', 'sulit', 'sangat_sulit'];
const NON_LIVE = ['DRAFT', 'AI_REVIEWED', 'APPROVED', 'NEEDS_REVISION', 'REJECTED', 'RETIRED', 'CALIBRATION'];

const fakeHash = (n) => n.toString(16).padStart(64, '0');
const topic = (i) => `T${String((i % 12) + 1).padStart(2, '0')}`;
const competency = (i) => `K0${(i % 4) + 1}`;

const criterion = (id, maxScore) => ({ criterionId: id, description: `Kriteria ${id}`, maxScore, full: 'Penuh.', partial: 'Sebagian.', zero: 'Nol.' });

function base(id, type, i, status, maxScore, difficulty) {
  return {
    id, type, topicIds: [topic(i)], competencyIds: [competency(i)], difficulty,
    cognitiveLevel: 'C4', estimatedMinutes: { mcq: 1.5, essay: 15, case: 30 }[type], maxScore,
    stem: `[UJI] Soal ${id}`,
    lifecycle: {
      status, contentHash: status === 'DRAFT' || status === 'CALIBRATION' || status === 'NEEDS_REVISION' || status === 'REJECTED' ? '' : fakeHash(i + 1),
      review: null, approvedBy: null, approvedAt: null,
    },
    authoring: { createdBy: 'manusia', createdAt: '2026-10-17', revision: 1 },
  };
}

function mcq(n, status = 'LIVE') {
  const id = `UJI-MCQ-${String(n).padStart(3, '0')}`;
  return {
    ...base(id, 'mcq', n, status, 1, LEVELS[n % 4]),
    options: ['A', 'B', 'C', 'D'].map((key) => ({ key, text: `Opsi ${key}` })),
    answerKey: ['A', 'B', 'C', 'D'][n % 4],
    distractorRationale: Object.fromEntries(['A', 'B', 'C', 'D'].filter((k) => k !== ['A', 'B', 'C', 'D'][n % 4]).map((k) => [k, 'Salah.'])),
    explanation: 'Pembahasan.',
  };
}

function essay(n, status = 'LIVE') {
  const id = `UJI-ESA-${String(n).padStart(3, '0')}`;
  return {
    ...base(id, 'essay', 100 + n, status, 10, LEVELS[n % 4]),
    modelAnswer: 'Jawaban ideal.',
    rubric: [criterion('C1', 3), criterion('C2', 3), criterion('C3', 2), criterion('C4', 2)],
    acceptableAlternatives: 'Alternatif.',
  };
}

function caseQ(n, caseSize, difficulty, status = 'LIVE') {
  const id = `UJI-KAS-${String(n).padStart(3, '0')}`;
  return {
    ...base(id, 'case', 200 + n, status, 20, difficulty),
    caseSize,
    caseNarrative: 'Narasi kasus.',
    subQuestions: [
      { id: 'a', prompt: 'Bagian a', maxScore: 8, modelAnswer: 'Ideal a.', rubric: [criterion('C1', 3), criterion('C2', 3), criterion('C3', 2)] },
      { id: 'b', prompt: 'Bagian b', maxScore: 12, modelAnswer: 'Ideal b.', rubric: [criterion('C1', 4), criterion('C2', 4), criterion('C3', 2), criterion('C4', 2)] },
    ],
    acceptableAlternatives: 'Alternatif.',
  };
}

export function makeSyntheticPack() {
  const questions = [];
  for (let n = 1; n <= 60; n++) questions.push(mcq(n));
  for (let n = 1; n <= 15; n++) questions.push(essay(n));
  ['mudah', 'sedang', 'sedang', 'sulit'].forEach((d, i) => questions.push(caseQ(i + 1, 'mini', d)));
  ['sedang', 'sulit', 'sulit', 'sangat_sulit', 'sulit', 'sedang'].forEach((d, i) => questions.push(caseQ(i + 5, 'komprehensif', d)));
  // Soal non-LIVE di setiap tipe: tidak boleh pernah masuk paket (TS-14).
  NON_LIVE.forEach((status, i) => {
    questions.push(mcq(900 + i, status));
    questions.push(essay(900 + i, status));
    questions.push(caseQ(900 + i, i % 2 ? 'mini' : 'komprehensif', 'sulit', status));
  });
  for (const q of questions) {
    if (q.lifecycle.status === 'CALIBRATION') {
      q.calibration = { defectDimension: 'stemClarity', defectDescription: 'Cacat uji.', expectedVerdict: 'REVISE' };
    }
  }
  return {
    schemaVersion: '4.1',
    subjectId: 'uji',
    subjectName: 'Pack Uji Sintetis',
    packVersion: '1.0.0',
    language: 'id',
    passingGrade: 70,
    topics: Array.from({ length: 12 }, (_, i) => ({ id: topic(i), name: `Topik ${i + 1}` })),
    competencies: Array.from({ length: 4 }, (_, i) => ({ id: competency(i), name: `Kompetensi ${i + 1}` })),
    packages: [
      {
        id: 'T1', name: 'Latihan Dasar', durationMinutes: 60, strictMode: false,
        sections: [
          { type: 'mcq', count: 10, weight: 20 },
          { type: 'essay', count: 4, weight: 40 },
          { type: 'case', count: 2, caseSize: 'mini', weight: 40 },
        ],
        suggestedMinutes: { mcq: 15, essay: 20, case: 25 },
        difficultyTarget: { levels: ['mudah', 'sedang'], minScoreShare: 0.6 },
        coverage: { minTopics: 6, maxTopicScoreShare: 0.25 },
      },
      {
        id: 'T2', name: 'Latihan Lanjutan', durationMinutes: 120, strictMode: false,
        sections: [
          { type: 'mcq', count: 10, weight: 20 },
          { type: 'essay', count: 4, weight: 40 },
          { type: 'case', count: 2, caseSize: 'komprehensif', weight: 40 },
        ],
        suggestedMinutes: { mcq: 20, essay: 40, case: 60 },
        difficultyTarget: { levels: ['sedang', 'sulit'], minScoreShare: 0.5 },
        coverage: { minTopics: 6, maxTopicScoreShare: 0.25 },
      },
      {
        id: 'SIM', name: 'Simulasi Ujian', durationMinutes: 180, strictMode: true,
        sections: [
          { type: 'mcq', count: 17, weight: 17 },
          { type: 'essay', count: 5, weight: 50 },
          { type: 'case', count: 2, caseSize: 'komprehensif', weight: 33, itemScores: [16, 17] },
        ],
        suggestedMinutes: { mcq: 25, essay: 90, case: 65 },
        difficultyTarget: { levels: ['sulit', 'sangat_sulit'], minScoreShare: 0.7 },
        coverage: { minTopics: 9, maxTopicScoreShare: 0.25 },
      },
    ],
    questions,
    changelog: [{ version: '1.0.0', date: '2026-10-17', notes: 'Pack uji sintetis.' }],
  };
}
