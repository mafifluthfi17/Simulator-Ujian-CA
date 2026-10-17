// Logika inti: hash, format, paket, sesi, timer, penilaian, migrasi, penyimpanan.
import * as assert from './assert.js';
import { loadJson } from './env.js';
import { canonicalize, contentHash, sha256Fallback, sha256Hex } from '../../js/core/hash.js';
import { formatScore, parseDecimalInput } from '../../js/core/format.js';
import {
  allocatePoints, buildCustom, buildFromPackage, orderItems, sumCents, validateCustom,
} from '../../js/core/blueprint.js';
import { createRng } from '../../js/core/random.js';
import {
  createSession, pause, recoverOnOpen, remainingMs, resume, setAnswer, submit, toggleFlag, SessionLockedError,
} from '../../js/core/session.js';
import { ClockWatch, dueWarning } from '../../js/core/timer.js';
import { isPass } from '../../js/core/scoring.js';
import { getType } from '../../js/types/registry.js';
import { originalKeyForDisplay, displayLetterForKey } from '../../js/types/mcq.js';
import { Store, StorageFullError, memoryBackend, keys } from '../../js/core/storage.js';
import { listSessions, loadSession, saveSession, planBackupImport, makeBackup } from '../../js/core/session-store.js';
import { validateDocument } from '../../js/core/contract.js';
import { makeSyntheticPack } from '../fixtures/make-pack.js';

const T0 = Date.parse('2026-10-17T08:00:00Z');
const MIN = 60000;

function demoSession(pack, { mode = 'latihan', durationMinutes = 30, shuffleOptions = true, seed = 7 } = {}) {
  const rng = createRng(seed);
  const pkg = pack.packages[0];
  const built = buildFromPackage(pack, pkg, rng);
  if (!built.ok) throw new Error(built.problems.join('; '));
  return createSession({
    pack, packageId: pkg.id, packageName: pkg.name, mode,
    config: { durationMinutes, passingGrade: pack.passingGrade, shuffleQuestions: true, shuffleOptions, sectionWeights: { mcq: 20, numeric: 10, essay: 30, case: 40 } },
    items: orderItems(built.items, true, rng), rng, now: T0,
  });
}

const byId = (pack) => new Map(pack.questions.map((q) => [q.id, q]));
const sectionCents = (items, type) => sumCents(items.filter((it) => it.question.type === type).map((it) => it.points));

export default {
  name: 'Inti',
  cases: [
    {
      name: 'SHA-256: vektor uji standar dan cadangan JS = crypto.subtle',
      run: async () => {
        const enc = (s) => new TextEncoder().encode(s);
        assert.equal(sha256Fallback(enc('abc')), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
        assert.equal(sha256Fallback(enc('')), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
        const rng = createRng(3);
        for (const len of [1, 55, 56, 63, 64, 65, 119, 1000]) {
          const s = Array.from({ length: len }, () => String.fromCharCode(32 + Math.floor(rng() * 300))).join('');
          assert.equal(sha256Fallback(enc(s)), await sha256Hex(s), `panjang ${len}`);
        }
      },
    },
    {
      name: 'contentHash: spasi dinormalisasi; berubah bila stem berubah; tidak terpengaruh pembahasan',
      run: async () => {
        const q = await loadJson('packs/demo/pack.json').then((p) => p.questions[0]);
        const h0 = await contentHash(q);
        assert.equal(await contentHash({ ...q, stem: `  ${q.stem.replace(/ /g, '   ')} ` }), h0);
        assert.equal(await contentHash({ ...q, explanation: 'lain' }), h0);
        assert.ok((await contentHash({ ...q, stem: `${q.stem}?` })) !== h0);
        assert.deepEqual(canonicalize({ b: ' x  y ', a: [1] }), { a: [1], b: 'x y' });
      },
    },
    {
      name: 'format angka peserta (koma desimal, titik ribuan)',
      run: () => {
        const cases = [['47,8', 47.8], ['47.8', 47.8], ['1.200', 1200], ['1.200,5', 1200.5], ['-3,25', -3.25], ['12', 12], ['abc', null], ['1,2,3', null], ['', null]];
        for (const [input, expected] of cases) assert.equal(parseDecimalInput(input), expected, `"${input}"`);
      },
    },
    {
      name: 'largest remainder: jumlah tepat dan selisih maksimal 0,01',
      run: () => {
        assert.deepEqual(allocatePoints(30, 7), [4.29, 4.29, 4.29, 4.29, 4.28, 4.28, 4.28]);
        assert.deepEqual(allocatePoints(40, 3), [13.34, 13.33, 13.33]);
        for (const [w, n] of [[17, 17], [33, 2], [100, 3], [50, 7], [1, 3]]) assert.equal(sumCents(allocatePoints(w, n)), w * 100);
      },
    },
    {
      id: 'TS-03',
      name: 'SIM dari pack uji 60/15/10: 17/5/2 soal, total maks 100,00',
      run: () => {
        const pack = makeSyntheticPack();
        const sim = pack.packages.find((p) => p.id === 'SIM');
        for (let seed = 1; seed <= 10; seed++) {
          const built = buildFromPackage(pack, sim, createRng(seed));
          assert.ok(built.ok, built.problems && built.problems.join('; '));
          const count = (t) => built.items.filter((it) => it.question.type === t).length;
          assert.deepEqual([count('mcq'), count('essay'), count('case')], [17, 5, 2]);
          assert.equal(sumCents(built.items.map((it) => it.points)), 10000);
          assert.deepEqual(built.items.filter((it) => it.question.type === 'case').map((it) => it.points).sort(), [16, 17]);
          assert.ok(built.items.filter((it) => it.question.type === 'case').every((it) => it.question.caseSize === 'komprehensif'));
        }
      },
    },
    {
      name: 'paket kurang soal tidak dapat dimulai dan menyebut kekurangannya',
      run: () => {
        const pack = makeSyntheticPack();
        pack.questions = pack.questions.filter((q) => q.type !== 'mcq' || Number(q.id.slice(-3)) <= 12);
        const built = buildFromPackage(pack, pack.packages.find((p) => p.id === 'SIM'), createRng(1));
        assert.ok(!built.ok);
        assert.ok(built.problems.includes('butuh 17 PG, tersedia 12 yang sesuai'), built.problems.join('; '));
      },
    },
    {
      id: 'TS-04',
      name: 'Kustom 7/3/1 bobot 30/40/30: total 100,00, tiap bagian = bobotnya',
      run: () => {
        const pack = makeSyntheticPack();
        const custom = { durationMinutes: 120, counts: { mcq: 7, essay: 3, case: 1 }, weights: { mcq: 30, essay: 40, case: 30 }, difficulty: [], topicIds: [] };
        assert.ok(validateCustom(pack, custom).ok);
        const built = buildCustom(pack, custom, createRng(2));
        assert.ok(built.ok, built.problems && built.problems.join('; '));
        assert.equal(sumCents(built.items.map((it) => it.points)), 10000);
        assert.equal(sectionCents(built.items, 'mcq'), 3000);
        assert.equal(sectionCents(built.items, 'essay'), 4000);
        assert.equal(sectionCents(built.items, 'case'), 3000);
      },
    },
    {
      name: 'Kustom: validasi bobot, durasi, dan ketersediaan',
      run: () => {
        const pack = makeSyntheticPack();
        const base = { durationMinutes: 60, counts: { mcq: 10 }, weights: { mcq: 100 }, difficulty: [], topicIds: [] };
        assert.ok(validateCustom(pack, base).ok);
        assert.ok(!validateCustom(pack, { ...base, weights: { mcq: 99 } }).ok);
        assert.ok(!validateCustom(pack, { ...base, weights: { mcq: 90, essay: 10 } }).ok, 'bagian tanpa soal harus berbobot 0');
        assert.ok(!validateCustom(pack, { ...base, durationMinutes: 10 }).ok);
        assert.ok(!validateCustom(pack, { ...base, durationMinutes: 241 }).ok);
        const short = validateCustom(pack, { ...base, counts: { mcq: 99 } });
        assert.ok(short.errors.some((e) => /butuh 99 PG, tersedia 60/i.test(e)), short.errors.join('; '));
        const warn = validateCustom(pack, { ...base, durationMinutes: 240 });
        assert.ok(warn.warnings.length === 1, 'durasi > 200% perkiraan harus diperingatkan');
      },
    },
    {
      id: 'TS-05',
      name: 'opsi diacak, memilih kunci asli dinilai benar',
      run: async () => {
        const pack = await loadJson('packs/demo/pack.json');
        let shuffled = 0;
        for (let seed = 1; seed <= 20; seed++) {
          const session = demoSession(pack, { seed });
          for (const item of session.items.filter((it) => it.type === 'mcq')) {
            const q = byId(pack).get(item.questionId);
            if (item.optionOrder.join('') !== 'ABCD') shuffled++;
            const shownLetter = displayLetterForKey(item.optionOrder, q.answerKey);
            const chosen = originalKeyForDisplay(item.optionOrder, shownLetter);
            assert.equal(chosen, q.answerKey);
            assert.equal(getType('mcq').autoScore(q, chosen), 1);
            const wrongLetter = ['A', 'B', 'C', 'D'].find((l) => l !== shownLetter);
            assert.equal(getType('mcq').autoScore(q, originalKeyForDisplay(item.optionOrder, wrongLetter)), 0);
          }
        }
        assert.ok(shuffled > 0, 'opsi tidak pernah teracak');
      },
    },
    {
      id: 'TS-06',
      name: 'dibuka ulang setelah deadline: terkunci, EXPIRED_ON_REOPEN',
      run: async () => {
        const pack = await loadJson('packs/demo/pack.json');
        const session = demoSession(pack);
        const qid = session.items[0].questionId;
        setAnswer(session, qid, session.items[0].type === 'mcq' ? 'A' : 'x', T0 + MIN);
        const notYet = recoverOnOpen(session, T0 + 29 * MIN, byId(pack), 70);
        assert.ok(!notYet.expired);
        const r = recoverOnOpen(session, T0 + 31 * MIN, byId(pack), 70);
        assert.ok(r.expired);
        assert.equal(session.status, 'SUBMITTED');
        assert.equal(session.submittedReason, 'EXPIRED_ON_REOPEN');
        assert.equal(session.grading.status, 'MENUNGGU_PENILAIAN_URAIAN');
        await assert.rejects(() => setAnswer(session, qid, null, T0 + 32 * MIN), /terkunci/);
        assert.ok(validateDocument('session', session).length === 0, 'sesi hasil harus valid terhadap skema');
      },
    },
    {
      id: 'TS-07',
      name: 'jeda 2 menit di mode latihan: sisa waktu sama',
      run: async () => {
        const pack = await loadJson('packs/demo/pack.json');
        const session = demoSession(pack);
        const t = T0 + 10 * MIN + 1234;
        const before = remainingMs(session, t);
        pause(session, t);
        assert.equal(session.status, 'PAUSED');
        assert.equal(remainingMs(session, t + 2 * MIN), before);
        resume(session, t + 2 * MIN);
        assert.equal(remainingMs(session, t + 2 * MIN), before);
        assert.equal(session.totalPausedMs, 2 * MIN);
        assert.ok(!recoverOnOpen(session, T0 + 31 * MIN, byId(pack), 70).expired, 'deadline harus bergeser 2 menit');
        assert.ok(validateDocument('session', session).length === 0);
      },
    },
    {
      name: 'mode ketat tidak dapat dijeda; sesi dijeda tidak kedaluwarsa',
      run: async () => {
        const pack = await loadJson('packs/demo/pack.json');
        await assert.rejects(() => pause(demoSession(pack, { mode: 'ketat' }), T0), /mode latihan/);
        const s = demoSession(pack);
        pause(s, T0 + MIN);
        assert.ok(!recoverOnOpen(s, T0 + 999 * MIN, byId(pack), 70).expired);
      },
    },
    {
      id: 'TS-14',
      name: '50 kali bentuk paket: 0 soal non-LIVE',
      run: () => {
        const pack = makeSyntheticPack();
        const rng = createRng(14);
        const custom = { durationMinutes: 120, counts: { mcq: 20, essay: 5, case: 3 }, weights: { mcq: 30, essay: 40, case: 30 }, difficulty: [], topicIds: [] };
        let checked = 0;
        for (let i = 0; i < 50; i++) {
          for (const pkg of pack.packages) {
            const built = buildFromPackage(pack, pkg, rng);
            assert.ok(built.ok, `${pkg.id}: ${built.problems && built.problems.join('; ')}`);
            for (const it of built.items) assert.equal(it.question.lifecycle.status, 'LIVE', `${it.question.id} non-LIVE`);
            checked += built.items.length;
          }
          for (const it of buildCustom(pack, custom, rng).items) assert.equal(it.question.lifecycle.status, 'LIVE');
        }
        assert.ok(checked > 2000);
      },
    },
    {
      name: 'aturan kesulitan dan cakupan paket terpenuhi (T1, T2, SIM)',
      run: () => {
        const pack = makeSyntheticPack();
        for (const pkg of pack.packages) {
          const built = buildFromPackage(pack, pkg, createRng(5));
          assert.ok(built.ok, `${pkg.id}: ${built.problems && built.problems.join('; ')}`);
          const total = built.items.reduce((n, it) => n + it.points, 0);
          const target = built.items.filter((it) => pkg.difficultyTarget.levels.includes(it.question.difficulty)).reduce((n, it) => n + it.points, 0);
          assert.ok(target / total >= pkg.difficultyTarget.minScoreShare - 1e-9, `${pkg.id} kesulitan ${target / total}`);
          const topics = new Set(built.items.flatMap((it) => it.question.topicIds));
          assert.ok(topics.size >= pkg.coverage.minTopics, `${pkg.id} topik ${topics.size}`);
        }
      },
    },
    {
      id: 'TS-17',
      name: 'numeric toleransi 1%, kunci 100: 99,2 benar; 98 salah',
      run: () => {
        const numeric = getType('numeric');
        const q = { maxScore: 1, numericAnswer: { value: 100, unit: '', tolerance: { type: 'relative', value: 0.01 } } };
        assert.equal(numeric.autoScore(q, 99.2), 1);
        assert.equal(numeric.autoScore(q, 101), 1);
        assert.equal(numeric.autoScore(q, 98), 0);
        assert.equal(numeric.autoScore(q, null), 0);
        const abs = { maxScore: 1, numericAnswer: { value: 48, unit: 'Rp miliar', tolerance: { type: 'absolute', value: 0.5 } } };
        assert.equal(numeric.autoScore(abs, 47.5), 1);
        assert.equal(numeric.autoScore(abs, 47.4), 0);
      },
    },
    {
      name: 'penilaian mcq/numeric dengan faktor skala; nilai FINAL tanpa uraian',
      run: async () => {
        const pack = await loadJson('packs/demo/pack.json');
        const session = demoSession(pack);
        for (const item of session.items) {
          const q = byId(pack).get(item.questionId);
          if (item.type === 'mcq') setAnswer(session, item.questionId, q.answerKey, T0 + MIN);
          if (item.type === 'numeric') setAnswer(session, item.questionId, 47.8, T0 + MIN);
        }
        submit(session, 'MANUAL', T0 + 5 * MIN, byId(pack), 70);
        const g = session.grading;
        assert.equal(g.status, 'MENUNGGU_PENILAIAN_URAIAN');
        assert.equal(g.finalScore, null);
        assert.equal(g.autoScores.reduce((n, s) => n + s.scaledScore, 0), 30);

        const mcqOnly = makeSyntheticPack();
        const rng = createRng(9);
        const built = buildCustom(mcqOnly, { durationMinutes: 30, counts: { mcq: 3 }, weights: { mcq: 100 }, difficulty: [], topicIds: [] }, rng);
        const s2 = createSession({ pack: mcqOnly, packageId: 'KUSTOM', packageName: 'Kustom', mode: 'latihan', config: { durationMinutes: 30, passingGrade: 70, shuffleQuestions: false, shuffleOptions: false, sectionWeights: { mcq: 100 } }, items: built.items, rng, now: T0 });
        s2.items.slice(0, 2).forEach((it) => setAnswer(s2, it.questionId, byId(mcqOnly).get(it.questionId).answerKey, T0));
        submit(s2, 'MANUAL', T0 + MIN, byId(mcqOnly), 70);
        assert.equal(s2.grading.status, 'FINAL');
        assert.equal(s2.grading.finalScore, 66.67);
        assert.equal(s2.grading.passed, false);
      },
    },
    {
      name: 'batas lulus 70 sebelum pembulatan dan tampilan 4 desimal (TS-11, TS-12)',
      run: () => {
        assert.equal(isPass(69.996, 70), false);
        assert.equal(formatScore(69.996), '69,9960');
        assert.equal(isPass(70, 70), true);
        assert.equal(formatScore(85.5), '85,50');
      },
    },
    {
      name: 'peringatan 15/5/1 menit tidak berulang; ambang terlewati dicatat',
      run: async () => {
        const pack = await loadJson('packs/demo/pack.json');
        const s = demoSession(pack, { durationMinutes: 30 });
        assert.equal(dueWarning(s, 20 * MIN), null);
        const w = dueWarning(s, 3 * MIN);
        assert.equal(w.minutes, 5);
        assert.deepEqual(w.events, ['15 menit (terlewati)', '5 menit']);
        for (const detail of w.events) s.events.push({ type: 'warning', at: new Date(T0).toISOString(), detail });
        assert.equal(dueWarning(s, 2 * MIN), null);
        assert.equal(dueWarning(s, 50000).minutes, 1);
        const short = demoSession(pack, { durationMinutes: 5 });
        assert.equal(dueWarning(short, 4 * MIN), null, 'ambang 5 menit tidak berlaku untuk ujian 5 menit');
      },
    },
    {
      name: 'deteksi lompatan jam > 60 detik',
      run: () => {
        let wall = 0;
        let mono = 0;
        const watch = new ClockWatch(() => wall, () => mono);
        wall += 1000; mono += 1000;
        assert.equal(watch.check(), 0);
        wall += 5 * MIN; mono += 1000;
        assert.ok(watch.check() > 60000);
        wall -= 2 * MIN; mono += 500;
        assert.ok(watch.check() < -60000);
      },
    },
    {
      name: 'log sesi: start, flag, answer_changed tanpa isi jawaban',
      run: async () => {
        const pack = await loadJson('packs/demo/pack.json');
        const s = demoSession(pack);
        const essay = s.items.find((it) => it.type === 'essay');
        setAnswer(s, essay.questionId, 'RAHASIA-JAWABAN', T0 + 1000);
        setAnswer(s, essay.questionId, 'RAHASIA-JAWABAN lagi', T0 + 2000);
        toggleFlag(s, essay.questionId, T0 + 3000);
        assert.deepEqual(s.events.map((e) => e.type), ['start', 'answer_changed', 'flag']);
        assert.ok(!JSON.stringify(s.events).includes('RAHASIA'));
      },
    },
    {
      id: 'TS-18',
      name: 'sesi schemaVersion lama ditolak dengan pesan; data tidak dihapus',
      run: async () => {
        const pack = await loadJson('packs/demo/pack.json');
        const store = new Store(memoryBackend());
        const old = demoSession(pack);
        old.schemaVersion = '4.0';
        store.setJson(keys.session('demo', old.sessionId), old);
        store.setJson(keys.sessionList('demo'), [old.sessionId]);
        const r = loadSession(store, 'demo', old.sessionId);
        assert.ok(!r.ok);
        assert.ok(/versi "4\.0"/.test(r.errors[0].message) && /tidak dimuat/.test(r.errors[0].message), r.errors[0].message);
        assert.ok(store.getJson(keys.session('demo', old.sessionId)), 'data lama harus tetap ada');
        assert.equal(listSessions(store, 'demo').failures.length, 1);
        const plan = planBackupImport(store, 'demo', { backupVersion: '4.0', subjectId: 'demo', sessions: [old] });
        assert.equal(plan.rejected.length, 1);
      },
    },
    {
      name: 'penyimpanan: satu sesi aktif, cadangan, penuh -> StorageFullError',
      run: async () => {
        const pack = await loadJson('packs/demo/pack.json');
        const store = new Store(memoryBackend());
        const a = demoSession(pack, { seed: 1 });
        saveSession(store, a);
        assert.equal(store.getJson(keys.active('demo')), a.sessionId);
        submit(a, 'MANUAL', T0 + MIN, byId(pack), 70);
        saveSession(store, a);
        assert.equal(store.getJson(keys.active('demo')), null);
        const backup = makeBackup(store, 'demo', T0);
        const fresh = new Store(memoryBackend());
        const plan = planBackupImport(fresh, 'demo', backup);
        assert.equal(plan.accepted.length, 1);
        const tiny = new Store(memoryBackend(100));
        await assert.rejects(() => saveSession(tiny, demoSession(pack)), /penuh/);
        assert.ok(new StorageFullError() instanceof Error);
      },
    },
    {
      name: 'sesi terkunci menolak perubahan',
      run: async () => {
        const pack = await loadJson('packs/demo/pack.json');
        const s = demoSession(pack);
        submit(s, 'MANUAL', T0, byId(pack), 70);
        await assert.rejects(() => toggleFlag(s, s.items[0].questionId, T0), /terkunci/);
        assert.ok(new SessionLockedError().message.includes('terkunci'));
      },
    },
  ],
};
