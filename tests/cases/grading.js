// Penilaian uraian (SPEC 10): paket penilaian, checksum, validasi impor,
// status PENILAIAN SEBAGIAN/FINAL, koreksi manual, batas lulus.
import * as assert from './assert.js';
import { loadJson } from './env.js';
import { sha256Hex } from '../../js/core/hash.js';
import {
  answersChecksum, applyGradingResult, applyManualCorrection, buildGradingPackage, checksumPayload,
  parseResultText, promptPlusData, validateGradingResult,
} from '../../js/core/grading-io.js';
import { validateDocument } from '../../js/core/contract.js';
import { createSession, setAnswer, submit } from '../../js/core/session.js';
import { createRng } from '../../js/core/random.js';
import { formatScore } from '../../js/core/format.js';
import { PROMPTS } from '../../js/core/prompts.js';
import { MIN, T0, sampleResult, submittedDemo } from '../fixtures/demo-graded.js';

const clone = (x) => JSON.parse(JSON.stringify(x));
const loadPack = () => loadJson('packs/demo/pack.json');

async function gradedDemo() {
  const pack = await loadPack();
  const session = submittedDemo(pack);
  return { pack, session, result: await sampleResult(session) };
}

async function expectRejected(session, result, pathPattern, messagePattern) {
  const v = await validateGradingResult(session, result);
  assert.ok(!v.ok, 'hasil seharusnya ditolak');
  const hit = v.errors.find((e) => pathPattern.test(e.path) && (!messagePattern || messagePattern.test(e.message)));
  assert.ok(hit, `error yang diharapkan tidak ada; didapat: ${v.errors.map((e) => `${e.path}: ${e.message}`).join(' | ')}`);
  return v;
}

// Sesi kecil untuk uji batas lulus: 2 PG @30, numerik 0,24, esai dan kasus dengan poin tertentu.
async function boundarySession(essayPoints, casePoints, essayRaw) {
  const pack = await loadPack();
  const q = (type) => pack.questions.filter((x) => x.type === type);
  const [m1, m2] = q('mcq');
  const items = [
    { question: m1, points: 30 }, { question: m2, points: 30 }, { question: q('numeric')[0], points: 0.24 },
    { question: q('essay')[0], points: essayPoints }, { question: q('case')[0], points: casePoints },
  ];
  const s = createSession({
    pack, packageId: 'KUSTOM', packageName: 'Kustom uji', mode: 'latihan',
    config: { durationMinutes: 60, passingGrade: 70, shuffleQuestions: false, shuffleOptions: false, sectionWeights: { mcq: 60, numeric: 0.24, essay: essayPoints, case: casePoints } },
    items, rng: createRng(1), now: T0,
  });
  setAnswer(s, m1.id, m1.answerKey, T0 + MIN);
  setAnswer(s, m2.id, m2.answerKey, T0 + MIN);
  setAnswer(s, q('essay')[0].id, 'jawaban', T0 + MIN);
  submit(s, 'MANUAL', T0 + 2 * MIN);
  const result = await sampleResult(s);
  const essay = result.scores.find((x) => x.questionId === q('essay')[0].id);
  // Sebar essayRaw ke kriteria (kelipatan 0,5, tidak melebihi maks).
  let left = essayRaw;
  for (const c of essay.criteriaScores) {
    c.awardedScore = Math.min(c.maxScore, left);
    left -= c.awardedScore;
  }
  essay.awardedScore = essayRaw;
  const kasus = result.scores.find((x) => x.questionId === q('case')[0].id);
  for (const sub of kasus.subQuestionScores) {
    sub.criteriaScores.forEach((c) => { c.awardedScore = 0; });
    sub.awardedScore = 0;
  }
  kasus.awardedScore = 0;
  const v = await validateGradingResult(s, result);
  assert.ok(v.ok, v.errors && v.errors.map((e) => `${e.path}: ${e.message}`).join('; '));
  await applyGradingResult(s, v, T0 + 3 * MIN);
  return s;
}

export default {
  name: 'Penilaian',
  cases: [
    {
      name: 'answersChecksum = SHA-256 atas [questionId, answer] terurut questionId (D-14)',
      run: async () => {
        const { session } = await gradedDemo();
        const pkg = await buildGradingPackage(session);
        const pairs = pkg.items.map((it) => [it.questionId, it.answer]);
        const manual = await sha256Hex(JSON.stringify(pairs.slice().sort((a, b) => (a[0] < b[0] ? -1 : 1))));
        assert.equal(pkg.answersChecksum, manual);
        assert.equal(checksumPayload(pairs.slice().reverse()), checksumPayload(pairs), 'urutan masukan tidak berpengaruh');
        const changed = clone(session);
        const essay = changed.items.find((it) => it.type === 'essay');
        changed.answers[essay.questionId].value += ' tambahan';
        assert.ok((await answersChecksum(changed)) !== pkg.answersChecksum, 'checksum harus berubah bila jawaban berubah');
      },
    },
    {
      name: 'paket penilaian: valid terhadap skema, hanya esai/kasus, jawaban asli utuh, kasus berlabel [a] [b]',
      run: async () => {
        const { session } = await gradedDemo();
        const pkg = await buildGradingPackage(session);
        assert.deepEqual(validateDocument('grading-export', pkg), []);
        assert.deepEqual(pkg.items.map((i) => i.type).sort(), ['case', 'essay']);
        const essay = pkg.items.find((i) => i.type === 'essay');
        assert.equal(essay.answer, session.answers[essay.questionId].value);
        assert.equal(essay.isBlank, false);
        const kasus = pkg.items.find((i) => i.type === 'case');
        assert.ok(kasus.answer.startsWith('[a] ') && kasus.answer.includes('\n\n[b] '), kasus.answer.slice(0, 40));
        const text = promptPlusData(PROMPTS['prompt_penilai_ai.md'], pkg);
        assert.ok(text.startsWith('# PROMPT PENILAI AI'), 'teks diawali Prompt D');
        assert.ok(text.includes(PROMPTS['prompt_penilai_ai.md'].trim()), 'Prompt D disalin utuh');
        const marker = '## PAKET PENILAIAN (JSON)';
        assert.deepEqual(JSON.parse(text.slice(text.indexOf(marker) + marker.length)), pkg, 'JSON di akhir teks = paket penilaian');
      },
    },
    {
      id: 'TS-08',
      name: 'impor penilaian dengan checksum salah ditolak',
      run: async () => {
        const { session, result } = await gradedDemo();
        const wrong = clone(result);
        wrong.answersChecksum = 'f'.repeat(64);
        const v = await expectRejected(session, wrong, /^\$\.answersChecksum$/, /tidak cocok/);
        assert.equal(v.errors.length, 1);
        assert.equal(session.grading.aiImports.length, 0, 'tidak ada yang tersimpan');
        // Jawaban diubah setelah paket diekspor (checksum lama) juga ditolak.
        const tampered = clone(session);
        const essay = tampered.items.find((it) => it.type === 'essay');
        tampered.answers[essay.questionId].value = 'jawaban lain';
        await expectRejected(tampered, result, /^\$\.answersChecksum$/);
      },
    },
    {
      id: 'TS-09',
      name: 'impor skor melebihi maksimum ditolak dan field disebut',
      run: async () => {
        const { session, result } = await gradedDemo();
        const r1 = clone(result);
        const essayIndex = r1.scores.findIndex((s) => s.subQuestionScores.length === 0);
        const c = r1.scores[essayIndex].criteriaScores[1];
        c.awardedScore = c.maxScore + 1;
        await expectRejected(session, r1, new RegExp(`^\\$\\.scores\\[${essayIndex}\\]\\.criteriaScores\\[1\\]\\.awardedScore$`), /melebihi maksimum/);
        const r2 = clone(result);
        r2.scores[essayIndex].awardedScore = 12;
        await expectRejected(session, r2, new RegExp(`^\\$\\.scores\\[${essayIndex}\\]\\.awardedScore$`), /melebihi maksimum 10/);
        const r3 = clone(result);
        const caseIndex = 1 - essayIndex;
        r3.scores[caseIndex].subQuestionScores[0].awardedScore = 99;
        await expectRejected(session, r3, /subQuestionScores\[0\]\.awardedScore$/, /melebihi/);
        const r4 = clone(result);
        r4.scores[essayIndex].criteriaScores[0].maxScore = 5;
        await expectRejected(session, r4, /criteriaScores\[0\]\.maxScore$/, /sesuai rubrik/);
      },
    },
    {
      id: 'TS-10',
      name: 'kriteria tidak menjumlah: diterima dengan jumlah kriteria + tanda',
      run: async () => {
        const { session, result } = await gradedDemo();
        const r = clone(result);
        const essay = r.scores.find((s) => s.subQuestionScores.length === 0);
        const sum = essay.criteriaScores.reduce((n, c) => n + c.awardedScore, 0);
        essay.awardedScore = sum + 2; // AI salah menjumlah
        const v = await validateGradingResult(session, r);
        assert.ok(v.ok, v.errors && v.errors.map((e) => e.message).join('; '));
        assert.ok(v.warnings.some((w) => w.includes(essay.questionId) && w.includes('jumlah')), v.warnings.join('; '));
        await applyGradingResult(session, v, T0 + 30 * MIN);
        const es = session.grading.essayScores.find((s) => s.questionId === essay.questionId);
        assert.equal(es.rawScore, sum, 'skor = jumlah kriteria, bukan awardedScore AI');
        assert.equal(es.sumMismatch, true);
        assert.deepEqual(validateDocument('session', session), []);
      },
    },
    {
      name: 'validasi impor: sesi, versi, soal asing, duplikat, kelengkapan, kelipatan 0,5, bentuk esai/kasus',
      run: async () => {
        const { session, result } = await gradedDemo();
        const essayIndex = result.scores.findIndex((s) => s.subQuestionScores.length === 0);
        const caseIndex = 1 - essayIndex;
        const mut = (fn) => { const r = clone(result); fn(r); return r; };
        await expectRejected(session, mut((r) => { r.sessionId = 'demo-20990101-00000000'; }), /^\$\.sessionId$/, /bukan sesi ini/);
        await expectRejected(session, mut((r) => { r.gradingVersion = '4.0'; }), /^\$\.gradingVersion$/);
        await expectRejected(session, mut((r) => { r.scores[0].questionId = 'DEMO-MCQ-001'; r.evaluatedQuestionIds[r.evaluatedQuestionIds.indexOf(result.scores[0].questionId)] = 'DEMO-MCQ-001'; }), /scores\[0\]\.questionId$/, /bukan soal esai\/kasus/);
        await expectRejected(session, mut((r) => { r.scores.push(clone(r.scores[0])); }), /scores\[2\]\.questionId$/, /lebih dari sekali/);
        await expectRejected(session, mut((r) => { r.scores[essayIndex].criteriaScores.pop(); }), /scores\[\d\]\.criteriaScores$/, /belum dinilai/);
        await expectRejected(session, mut((r) => { r.scores[caseIndex].subQuestionScores.pop(); }), /subQuestionScores$/, /belum dinilai/);
        await expectRejected(session, mut((r) => { r.scores[essayIndex].criteriaScores[0].awardedScore = 1.25; }), /criteriaScores\[0\]\.awardedScore$/, /kelipatan/);
        await expectRejected(session, mut((r) => { r.scores[essayIndex].subQuestionScores = clone(r.scores[caseIndex].subQuestionScores); }), /subQuestionScores$/, /harus \[\]/);
        await expectRejected(session, mut((r) => { r.evaluatedQuestionIds.pop(); }), /^\$\.evaluatedQuestionIds$/);
        await expectRejected(session, mut((r) => { r.scores[0].bonus = 1; }), /scores\[0\]\.bonus$/);
        await expectRejected(session, mut((r) => { r.reviewFlags.push({ questionId: 'DEMO-MCQ-001', type: 'soal_bermasalah', note: 'x' }); }), /reviewFlags\[0\]\.questionId$/);
        const notJson = await validateGradingResult(session, 'Berikut hasilnya: {');
        assert.ok(!notJson.ok && /bukan JSON/.test(notJson.errors[0].message));
        const fenced = await validateGradingResult(session, `\`\`\`json\n${JSON.stringify(result)}\n\`\`\``);
        assert.ok(fenced.ok, 'pagar ```json dari AI diterima');
        assert.deepEqual(parseResultText('﻿ {"a":1} ').data, { a: 1 });
      },
    },
    {
      name: 'status MENUNGGU -> PENILAIAN SEBAGIAN -> FINAL; nilai akhir dihitung aplikasi',
      run: async () => {
        const { session } = await gradedDemo();
        assert.equal(session.grading.status, 'MENUNGGU_PENILAIAN_URAIAN');
        const essayOnly = await sampleResult(session, { types: ['essay'] });
        const v1 = await validateGradingResult(session, essayOnly);
        assert.ok(v1.ok, v1.errors && v1.errors.map((e) => e.message).join('; '));
        await applyGradingResult(session, v1, T0 + 30 * MIN);
        assert.equal(session.grading.status, 'PENILAIAN_SEBAGIAN');
        assert.equal(session.grading.finalScore, null);
        assert.equal(session.grading.passed, null, 'LULUS/TIDAK LULUS hanya pada FINAL');
        const caseOnly = await sampleResult(session, { types: ['case'] });
        caseOnly.scores[0].awardedScore = 20; // total dari AI tidak dipakai
        const v2 = await validateGradingResult(session, caseOnly);
        await applyGradingResult(session, v2, T0 + 31 * MIN);
        const g = session.grading;
        assert.equal(g.status, 'FINAL');
        const expected = [...g.autoScores, ...g.essayScores].reduce((n, s) => n + s.scaledScore, 0);
        assert.ok(Math.abs(g.finalScore - expected) < 1e-9);
        const caseItem = session.items.find((it) => it.type === 'case');
        const caseScore = g.essayScores.find((s) => s.questionId === caseItem.questionId);
        assert.ok(caseScore.rawScore < 20, 'skor kasus = jumlah kriteria, bukan 20 dari AI');
        assert.ok(Math.abs(caseScore.scaledScore - caseScore.rawScore * caseItem.scaleFactor) < 1e-6, 'skor uraian x faktor skala');
        assert.equal(g.passed, g.finalScore >= 70);
        assert.deepEqual(validateDocument('session', session), []);
      },
    },
    {
      name: 'koreksi manual: alasan wajib, batas skor, tercatat; impor ulang tidak menghapus catatan',
      run: async () => {
        const { session, result } = await gradedDemo();
        await applyGradingResult(session, await validateGradingResult(session, result), T0 + 30 * MIN);
        const essay = session.items.find((it) => it.type === 'essay');
        const base = { questionId: essay.questionId, subId: null, criterionId: 'C1' };
        await assert.rejects(() => applyManualCorrection(session, { ...base, after: 3, reason: '  ' }, T0 + 32 * MIN), /Alasan/);
        await assert.rejects(() => applyManualCorrection(session, { ...base, after: 3.5, reason: 'x' }, T0 + 32 * MIN), /antara 0 dan 3/);
        await assert.rejects(() => applyManualCorrection(session, { ...base, after: 1.2, reason: 'x' }, T0 + 32 * MIN), /kelipatan/);
        const before = session.grading.essayScores.find((s) => s.questionId === essay.questionId).rawScore;
        const c1 = result.scores.find((s) => s.questionId === essay.questionId).criteriaScores[0].awardedScore;
        applyManualCorrection(session, { ...base, after: 3, reason: 'Bukti kelemahan ketiga ada di paragraf 1.' }, T0 + 32 * MIN);
        const es = session.grading.essayScores.find((s) => s.questionId === essay.questionId);
        assert.equal(es.rawScore, before - c1 + 3);
        assert.equal(es.manuallyCorrected, true);
        assert.equal(session.grading.manualCorrections.length, 1);
        assert.equal(session.grading.manualCorrections[0].before, c1);
        assert.deepEqual(validateDocument('session', session), []);
        // Impor ulang soal yang sama: koreksi lama tetap tercatat tetapi tidak berlaku.
        const v = await validateGradingResult(session, result);
        assert.deepEqual(v.regraded.sort(), session.items.filter((it) => it.type !== 'mcq' && it.type !== 'numeric').map((it) => it.questionId).sort());
        await applyGradingResult(session, v, T0 + 40 * MIN);
        const after = session.grading.essayScores.find((s) => s.questionId === essay.questionId);
        assert.equal(after.rawScore, before);
        assert.equal(after.manuallyCorrected, false);
        assert.equal(session.grading.manualCorrections.length, 1, 'catatan koreksi tidak dihapus');
        assert.equal(session.grading.aiImports.length, 2, 'riwayat impor disimpan');
      },
    },
    {
      id: 'TS-11',
      name: 'nilai 69,996: TIDAK LULUS, tampil 4 desimal',
      run: async () => {
        // 30 + 30 + 0 (numerik kosong) + esai 8,5/10 x 11,76 = 69,996; kasus 0.
        const s = await boundarySession(11.76, 28, 8.5);
        assert.equal(s.grading.status, 'FINAL');
        assert.ok(Math.abs(s.grading.finalScore - 69.996) < 1e-9, String(s.grading.finalScore));
        assert.equal(s.grading.passed, false);
        assert.equal(formatScore(s.grading.finalScore), '69,9960');
      },
    },
    {
      id: 'TS-12',
      name: 'nilai 70,00: LULUS',
      run: async () => {
        // 30 + 30 + esai 5/10 x 20 = 70; kasus 0.
        const s = await boundarySession(20, 19.76, 5);
        assert.equal(s.grading.finalScore, 70);
        assert.equal(s.grading.passed, true);
        assert.equal(formatScore(s.grading.finalScore), '70,0000');
      },
    },
  ],
};
