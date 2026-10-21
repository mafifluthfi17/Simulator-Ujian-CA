// Bank soal (SPEC 8): lint batch, contentHash, siklus status, paket review,
// kalibrasi, review ganda, persetujuan, publikasi, alur penuh.
import * as assert from './assert.js';
import { loadJson } from './env.js';
import {
  applyBatchImport, approve, bankStats, createBank, editQuestion, exportPackText, extractJson, findQuestion,
  loadBank, planBatchImport, publish, resolveConflict, retire, returnToDraft, saveBank, taxonomyDiff, undoReject, updateTaxonomy, withTaxonomy,
} from '../../js/core/bank.js';
import {
  applyReviewResult, buildReviewPackage, checkReviewSelection, decide, reviewPromptText, revisionRequestText, validateReviewResult,
} from '../../js/core/review-io.js';
import { contentHash } from '../../js/core/hash.js';
import { validatePack, loadAllPacks, saveImportedPack } from '../../js/core/pack-loader.js';
import { validateDocument } from '../../js/core/contract.js';
import { buildCustom } from '../../js/core/blueprint.js';
import { createRng } from '../../js/core/random.js';
import { Store, memoryBackend } from '../../js/core/storage.js';
import { PROMPTS } from '../../js/core/prompts.js';
import { KEY_DEFECT, draftFrom, finding, makeBatch, makeReviewResult } from '../fixtures/bank-batch.js';

const T = Date.parse('2026-10-17T03:00:00Z');
const clone = (x) => JSON.parse(JSON.stringify(x));
const messages = (errors) => errors.map((e) => `${e.path}: ${e.message}`).join(' | ');

async function freshBank() {
  const pack = await loadJson('packs/demo/pack.json');
  return { pack, bank: await createBank(pack, T) };
}

async function importItems(bank, pack, items, batchId) {
  const plan = await planBatchImport(bank, makeBatch(pack, items, batchId));
  assert.ok(plan.ok, plan.errors && messages(plan.errors));
  applyBatchImport(bank, plan, T);
  return plan;
}

// Bank dengan n PG draf dan satu soal kalibrasi.
async function bankWithDrafts(n = 3) {
  const { pack, bank } = await freshBank();
  await importItems(bank, pack, Array.from({ length: n }, (_, i) => draftFrom(pack, 'mcq', i + 1)), 'DEMO-B01');
  await importItems(bank, pack, [draftFrom(pack, 'mcq', 90, { calibration: KEY_DEFECT })], 'DEMO-B02');
  return { pack, bank, ids: Array.from({ length: n }, (_, i) => `DEMO-MCQ-${101 + i}`) };
}

function calibrationKeyOf(bank, pkg) {
  return bank.pendingReviews.find((p) => p.batchId === pkg.batchId).calibrationKey;
}

export default {
  name: 'Bank soal',
  cases: [
    {
      id: 'TS-02',
      name: 'pack dengan jumlah rubrik salah ditolak, error menyebut ID',
      run: async () => {
        const pack = await loadJson('packs/demo/pack.json');
        const essay = pack.questions.find((q) => q.type === 'essay');
        essay.rubric[0].maxScore = 4; // jumlah 11, bukan 10
        const r = validatePack(pack);
        assert.ok(!r.ok);
        assert.ok(r.errors.some((e) => e.message.includes(essay.id) && /rubrik/.test(e.message) && /rubric/.test(e.path)), messages(r.errors));
        // Batch dengan rubrik kasus salah juga ditolak dengan ID dan field.
        const { bank } = await freshBank();
        const kasus = draftFrom(pack, 'case', 1);
        kasus.subQuestions[1].rubric[0].maxScore = 6;
        const plan = await planBatchImport(bank, makeBatch(pack, [kasus]));
        assert.ok(!plan.ok);
        assert.ok(plan.errors.some((e) => e.message.includes(kasus.id) && e.path.includes('subQuestions[1].rubric')), messages(plan.errors));
      },
    },
    {
      name: 'lint batch: pesan menyebut ID dan field; batch ditolak utuh',
      run: async () => {
        const { pack, bank } = await freshBank();
        const a = draftFrom(pack, 'mcq', 1);
        delete a.explanation;
        const b = draftFrom(pack, 'mcq', 2);
        b.options.pop();
        const c = draftFrom(pack, 'mcq', 3);
        c.topicIds = ['T09'];
        const d = draftFrom(pack, 'mcq', 4);
        d.distractorRationale = { A: 'x', B: 'y', C: 'z' }; // kunci demo B ikut dijelaskan
        const plan = await planBatchImport(bank, makeBatch(pack, [a, b, c, d]));
        assert.ok(!plan.ok);
        const text = messages(plan.errors);
        assert.ok(/\$\.items\[0\]\.explanation: Soal DEMO-MCQ-101/.test(text), text);
        assert.ok(/\$\.items\[1\]\.options: Soal DEMO-MCQ-102/.test(text), text);
        // Topik di luar pack baru diperiksa setelah skema lolos: uji terpisah.
        const plan2 = await planBatchImport(bank, makeBatch(pack, [c]));
        assert.ok(!plan2.ok && /items\[0\]\.topicIds: Soal DEMO-MCQ-103: topik T09 tidak ada di pack/.test(messages(plan2.errors)), messages(plan2.errors));
        const plan3 = await planBatchImport(bank, makeBatch(pack, [d]));
        assert.ok(!plan3.ok && /DEMO-MCQ-104/.test(messages(plan3.errors)) && /distractorRationale/.test(messages(plan3.errors)), messages(plan3.errors));
        const dup = await planBatchImport(bank, makeBatch(pack, [draftFrom(pack, 'mcq', 5), draftFrom(pack, 'mcq', 5)]));
        assert.ok(!dup.ok && /DEMO-MCQ-105 muncul lebih dari sekali/.test(messages(dup.errors)), messages(dup.errors));
        const other = await planBatchImport(bank, { ...makeBatch(pack, [draftFrom(pack, 'mcq', 6)]), subjectId: 'msk' });
        assert.ok(!other.ok && /subjectId/.test(messages(other.errors)));
        assert.equal(bank.pack.questions.length, pack.questions.length, 'tidak ada soal yang masuk');
      },
    },
    {
      name: 'keluaran AI penyusun: blok kode JSON + Catatan penyusun terbaca',
      run: async () => {
        const { pack, bank } = await freshBank();
        const text = `\`\`\`json\n${JSON.stringify(makeBatch(pack, [draftFrom(pack, 'mcq', 1)]), null, 2)}\n\`\`\`\nCatatan penyusun\n- Topik T02 dari pengetahuan umum.`;
        const plan = await planBatchImport(bank, text);
        assert.ok(plan.ok, plan.errors && messages(plan.errors));
        assert.ok(plan.notes.includes('Catatan penyusun'));
        assert.ok(!extractJson('tanpa json').ok);
        const counts = applyBatchImport(bank, plan, T);
        assert.equal(counts.baru, 1);
        const q = findQuestion(bank, 'DEMO-MCQ-101');
        assert.equal(q.lifecycle.status, 'DRAFT');
        assert.equal(q.lifecycle.contentHash, await contentHash(q), 'contentHash dihitung aplikasi');
      },
    },
    {
      id: 'TS-13',
      name: 'ubah stem soal APPROVED: kembali DRAFT, hash berubah',
      run: async () => {
        const { bank, ids } = await bankWithDrafts(1);
        const pkg = await buildReviewPackage(bank, ids, { rng: createRng(1), now: T });
        applyReviewResult(bank, validateReviewResult(bank, makeReviewResult(pkg, { verdictFor: (i) => ({ verdict: i.reviewKey === calibrationKeyOf(bank, pkg) ? 'REJECT' : 'APPROVE', findings: i.reviewKey === calibrationKeyOf(bank, pkg) ? [finding('kritis', 'keyCorrectness')] : [] }) })), T);
        approve(bank, ids, 'LMA', T);
        const q = findQuestion(bank, ids[0]);
        assert.equal(q.lifecycle.status, 'APPROVED');
        const oldHash = q.lifecycle.contentHash;
        const edited = clone(q);
        edited.stem += ' (diubah)';
        await editQuestion(bank, edited, T + 1000, 'stem diubah');
        const after = findQuestion(bank, ids[0]);
        assert.equal(after.lifecycle.status, 'DRAFT');
        assert.ok(after.lifecycle.contentHash !== oldHash && after.lifecycle.contentHash === await contentHash(after));
        assert.equal(after.lifecycle.approvedBy, null);
        assert.equal(after.lifecycle.review, null);
        assert.equal(after.lifecycle.history.at(-1).from, 'APPROVED');
        // Hanya pembahasan berubah (di luar contentHash): status tetap.
        const { bank: b2, ids: ids2 } = await bankWithDrafts(1);
        const q2 = clone(findQuestion(b2, ids2[0]));
        q2.explanation = 'Pembahasan baru.';
        await editQuestion(b2, q2, T);
        assert.equal(findQuestion(b2, ids2[0]).lifecycle.status, 'DRAFT');
        // Revisi lewat impor batch dengan ID sama: LIVE -> DRAFT.
        const pack = await loadJson('packs/demo/pack.json');
        const { bank: b3 } = await freshBank();
        const live = clone(pack.questions[0]);
        live.stem += ' revisi';
        live.lifecycle = { status: 'DRAFT', contentHash: '', review: null, approvedBy: null, approvedAt: null };
        live.authoring = { createdBy: 'AI', model: 'uji', createdAt: '2026-10-17', revision: 2, notes: '' };
        const plan = await planBatchImport(b3, makeBatch(pack, [live]));
        assert.equal(plan.entries[0].action, 'revisi');
        assert.equal(plan.entries[0].previousStatus, 'LIVE');
        applyBatchImport(b3, plan, T);
        assert.equal(findQuestion(b3, live.id).lifecycle.status, 'DRAFT');
      },
    },
    {
      name: 'siklus status ditegakkan',
      run: async () => {
        const { bank, ids } = await bankWithDrafts(2);
        await assert.rejects(() => approve(bank, [ids[0]], 'LMA', T), /Lolos review AI/);
        await assert.rejects(() => approve(bank, ['DEMO-MCQ-190'], 'LMA', T), /Lolos review AI/);
        await assert.rejects(() => publish(bank, T), /Tidak ada perubahan/);
        await assert.rejects(() => retire(bank, ids[0], { reason: 'x' }, T), /LIVE/);
        await assert.rejects(() => approve(bank, [ids[0]], '', T), /inisial/);
        assert.deepEqual(checkReviewSelection(bank, ['DEMO-MCQ-190']).length, 1, 'soal kalibrasi tidak dapat dipilih untuk review biasa');
        const live = bank.pack.questions.find((q) => q.lifecycle.status === 'LIVE');
        await assert.rejects(() => undoReject(bank, live.id, { reason: 'x' }, T), /Ditolak/);
        retire(bank, live.id, { by: 'LMA', reason: 'usang' }, T);
        assert.equal(findQuestion(bank, live.id).lifecycle.status, 'RETIRED');
        await assert.rejects(() => retire(bank, ids[1], { reason: '' }, T), /LIVE|Alasan/);
      },
    },
    {
      name: 'paket review: reviewKey menyembunyikan ID, kalibrasi tersisip acak, batas jumlah, valid skema',
      run: async () => {
        const { pack, bank, ids } = await bankWithDrafts(3);
        const pkg = await buildReviewPackage(bank, ids, { includeCalibration: true, rng: createRng(7), now: T });
        assert.deepEqual(validateDocument('review-export', pkg), []);
        assert.equal(pkg.items.length, 4);
        assert.deepEqual(pkg.items.map((i) => i.reviewKey), ['R01', 'R02', 'R03', 'R04']);
        for (const item of pkg.items) {
          for (const f of ['id', 'lifecycle', 'authoring', 'calibration']) assert.ok(!(f in item), `${f} tidak boleh ada`);
        }
        const text = JSON.stringify(pkg);
        assert.ok(!text.includes('DEMO-MCQ-') && !text.includes('CALIBRATION') && !text.includes(KEY_DEFECT.defectDescription), 'paket tidak membocorkan ID/kalibrasi');
        const pending = bank.pendingReviews.at(-1);
        assert.equal(pending.keyMap[pending.calibrationKey].questionId, 'DEMO-MCQ-190');
        const positions = new Set();
        for (let seed = 1; seed <= 12; seed++) {
          const p = await buildReviewPackage(bank, ids, { includeCalibration: true, rng: createRng(seed), now: T });
          positions.add(bank.pendingReviews.find((x) => x.batchId === p.batchId).calibrationKey);
        }
        assert.ok(positions.size > 1, 'posisi kalibrasi harus acak');
        assert.ok(reviewPromptText(PROMPTS['prompt_reviewer_soal.md'], pkg).startsWith('# PROMPT REVIEWER'));
        // Batas: 11 PG ditolak; campuran tipe ditolak.
        await importItems(bank, pack, Array.from({ length: 8 }, (_, i) => draftFrom(pack, 'mcq', 10 + i)), 'DEMO-B03');
        const eleven = bank.pack.questions.filter((q) => q.type === 'mcq' && q.lifecycle.status === 'DRAFT').map((q) => q.id);
        assert.equal(eleven.length, 11);
        assert.ok(checkReviewSelection(bank, eleven).some((m) => /Maksimal 10/.test(m)));
        await importItems(bank, pack, [draftFrom(pack, 'essay', 1)], 'DEMO-B04');
        assert.ok(checkReviewSelection(bank, [ids[0], 'DEMO-ESA-101']).some((m) => /satu jenis/.test(m)));
      },
    },
    {
      id: 'TS-19',
      name: 'kalibrasi di-APPROVE reviewer: seluruh hasil batch ditolak',
      run: async () => {
        const { bank, ids } = await bankWithDrafts(3);
        const pkg = await buildReviewPackage(bank, ids, { includeCalibration: true, rng: createRng(3), now: T });
        const v = validateReviewResult(bank, makeReviewResult(pkg, { model: 'reviewer-lengah' }));
        assert.ok(v.ok, v.errors && messages(v.errors));
        assert.equal(v.calibration.caught, false);
        const out = applyReviewResult(bank, v, T);
        assert.equal(out.rejectedByCalibration, true);
        for (const id of ids) assert.equal(findQuestion(bank, id).lifecycle.status, 'DRAFT', `${id} harus tetap DRAFT`);
        assert.deepEqual(bank.calibrationStats['reviewer-lengah'].missed, 1);
        assert.ok(bank.log.at(-1).message.includes('DITOLAK'));
        assert.equal(bank.pendingReviews.at(-1).imports[0].outcome, 'DITOLAK_KALIBRASI');
        // REVISE tanpa temuan pada dimensi cacat juga tidak tertangkap.
        const pkg2 = await buildReviewPackage(bank, ids, { includeCalibration: true, rng: createRng(4), now: T });
        const cal2 = calibrationKeyOf(bank, pkg2);
        const v2 = validateReviewResult(bank, makeReviewResult(pkg2, { model: 'reviewer-b', verdictFor: (i) => (i.reviewKey === cal2 ? { verdict: 'REVISE', findings: [finding('mayor', 'stemClarity')] } : { verdict: 'APPROVE' }) }));
        assert.equal(v2.calibration.caught, false);
      },
    },
    {
      name: 'kalibrasi tertangkap: keputusan otomatis diterapkan dan statistik per reviewer',
      run: async () => {
        const { bank, ids } = await bankWithDrafts(4);
        const pkg = await buildReviewPackage(bank, ids, { includeCalibration: true, rng: createRng(5), now: T });
        const pending = bank.pendingReviews.at(-1);
        const byId = (key) => pending.keyMap[key].questionId;
        const plan = { [ids[0]]: { verdict: 'APPROVE' }, [ids[1]]: { verdict: 'REVISE', findings: [finding('mayor', 'stemClarity')] }, [ids[2]]: { verdict: 'APPROVE', findings: [finding('kritis', 'singleBestAnswer')] }, [ids[3]]: { verdict: 'REJECT' } };
        const result = makeReviewResult(pkg, { model: 'reviewer-teliti', verdictFor: (i) => (i.reviewKey === pending.calibrationKey ? { verdict: 'REJECT', findings: [finding('kritis', 'keyCorrectness')] } : plan[byId(i.reviewKey)]) });
        const v = validateReviewResult(bank, result);
        assert.ok(v.ok && v.calibration.caught, v.errors && messages(v.errors));
        const out = applyReviewResult(bank, v, T);
        assert.ok(!out.rejectedByCalibration);
        assert.deepEqual(ids.map((id) => findQuestion(bank, id).lifecycle.status), ['AI_REVIEWED', 'NEEDS_REVISION', 'NEEDS_REVISION', 'REJECTED']);
        assert.equal(findQuestion(bank, 'DEMO-MCQ-190').lifecycle.status, 'CALIBRATION');
        assert.deepEqual(bank.calibrationStats['reviewer-teliti'], { caught: 1, missed: 0, lastAt: new Date(T).toISOString() });
        assert.equal(findQuestion(bank, ids[0]).lifecycle.review.reviewerModel, 'reviewer-teliti');
        assert.equal(decide({ verdict: 'APPROVE', findings: [finding('mayor', 'alignment')] }), 'AI_REVIEWED');
        // Batalkan penolakan wajib alasan -> DRAFT.
        await assert.rejects(() => undoReject(bank, ids[3], { by: 'LMA', reason: ' ' }, T), /Alasan/);
        undoReject(bank, ids[3], { by: 'LMA', reason: 'Reviewer keliru membaca stem.' }, T);
        assert.equal(findQuestion(bank, ids[3]).lifecycle.status, 'DRAFT');
        assert.deepEqual(validatePack(bank.pack).errors, undefined);
      },
    },
    {
      name: 'revisi soal Perlu revisi di luar contentHash kembali Draf; tanpa perubahan tetap; Kembalikan ke Draf manual',
      run: async () => {
        const { pack, bank, ids } = await bankWithDrafts(3);
        const pkg = await buildReviewPackage(bank, ids, { includeCalibration: true, rng: createRng(5), now: T });
        const pending = bank.pendingReviews.at(-1);
        applyReviewResult(bank, validateReviewResult(bank, makeReviewResult(pkg, {
          verdictFor: (i) => (i.reviewKey === pending.calibrationKey ? { verdict: 'REJECT', findings: [finding('kritis', 'keyCorrectness')] }
            : pending.keyMap[i.reviewKey].questionId === ids[2] ? { verdict: 'APPROVE' } : { verdict: 'REVISE', findings: [finding('mayor', 'distractorQuality')] }),
        })), T);
        assert.deepEqual(ids.map((id) => findQuestion(bank, id).lifecycle.status), ['NEEDS_REVISION', 'NEEDS_REVISION', 'AI_REVIEWED']);

        // Revisi hanya alasan distraktor dan kesulitan (di luar contentHash), authoring.revision naik.
        const revised = clone(findQuestion(bank, ids[0]));
        const wrong = Object.keys(revised.distractorRationale)[0];
        revised.distractorRationale[wrong] = 'Alasan distraktor diperjelas.';
        revised.difficulty = 'sulit';
        revised.authoring.revision = 2;
        // Soal kedua: hanya authoring berubah -> bukan revisi isi.
        const untouched = clone(findQuestion(bank, ids[1]));
        untouched.authoring.revision = 2;
        // Soal Lolos review AI: perubahan di luar hash tetap tidak menurunkan status (D-63).
        const reviewed = clone(findQuestion(bank, ids[2]));
        reviewed.explanation = 'Pembahasan diperbarui.';
        const asBatchItem = (q) => ({ ...q, lifecycle: { status: 'DRAFT', contentHash: '', review: null, approvedBy: null, approvedAt: null } });
        const plan = await planBatchImport(bank, makeBatch(pack, [revised, untouched, reviewed].map(asBatchItem), 'DEMO-B01'));
        assert.ok(plan.ok, plan.errors && messages(plan.errors));
        assert.deepEqual(plan.entries.map((e) => e.action), ['revisi', 'sama', 'sama']);
        applyBatchImport(bank, plan, T);
        const q0 = findQuestion(bank, ids[0]);
        assert.equal(q0.lifecycle.status, 'DRAFT');
        assert.equal(q0.lifecycle.review, null);
        assert.equal(q0.difficulty, 'sulit');
        assert.equal(findQuestion(bank, ids[1]).lifecycle.status, 'NEEDS_REVISION');
        assert.equal(findQuestion(bank, ids[2]).lifecycle.status, 'AI_REVIEWED');
        assert.equal(findQuestion(bank, ids[2]).explanation, 'Pembahasan diperbarui.');
        assert.deepEqual(checkReviewSelection(bank, [ids[0]]), []);

        // Kembalikan ke Draf manual: alasan wajib, hanya untuk Perlu revisi.
        await assert.rejects(async () => returnToDraft(bank, ids[1], { by: 'LMA', reason: ' ' }, T), /Alasan/);
        await assert.rejects(async () => returnToDraft(bank, ids[2], { by: 'LMA', reason: 'x' }, T), /tidak berstatus Perlu revisi/);
        returnToDraft(bank, ids[1], { by: 'LMA', reason: 'Revisi sudah diimpor sebelum perbaikan.' }, T);
        const q1 = findQuestion(bank, ids[1]);
        assert.equal(q1.lifecycle.status, 'DRAFT');
        assert.equal(q1.lifecycle.review, null);
        assert.equal(q1.lifecycle.history.at(-1).by, 'LMA');
        assert.ok(validatePack(bank.pack).ok);
      },
    },
    {
      name: 'salin untuk penyusun: temuan + JSON soal; JSON dapat diimpor ulang sebagai batch',
      run: async () => {
        const { pack, bank, ids } = await bankWithDrafts(2);
        const pkg = await buildReviewPackage(bank, ids, { includeCalibration: true, rng: createRng(5), now: T });
        const pending = bank.pendingReviews.at(-1);
        const fix = { severity: 'kritis', dimension: 'singleBestAnswer', issue: 'Opsi B juga dapat dibenarkan.', suggestedFix: 'Pertegas stem.' };
        const verdictFor = (i) => (i.reviewKey === pending.calibrationKey ? { verdict: 'REJECT', findings: [finding('kritis', 'keyCorrectness')] }
          : pending.keyMap[i.reviewKey].questionId === ids[0] ? { verdict: 'REVISE', findings: [fix] } : { verdict: 'APPROVE' });
        applyReviewResult(bank, validateReviewResult(bank, makeReviewResult(pkg, { verdictFor })), T);
        assert.equal(findQuestion(bank, ids[0]).lifecycle.status, 'NEEDS_REVISION');

        const text = revisionRequestText(bank, ids);
        assert.ok(text.includes('bagian "Revisi"'));
        assert.ok(text.includes(`## ${ids[0]}`) && text.includes(`## ${ids[1]}`));
        assert.ok(text.includes('1. [kritis] singleBestAnswer: Opsi B juga dapat dibenarkan. Saran: Pertegas stem.'));
        assert.ok(text.includes('(tanpa temuan)'));
        assert.ok(!text.includes('DEMO-MCQ-190'), 'soal kalibrasi tidak ikut');
        const parsed = extractJson(text);
        assert.ok(parsed.ok, parsed.errors && messages(parsed.errors));
        assert.deepEqual(parsed.data.map((q) => q.id), ids);
        assert.deepEqual(parsed.data[0].lifecycle, { status: 'DRAFT', contentHash: '', review: null, approvedBy: null, approvedAt: null });
        // Bank tidak berubah; JSON yang disalin lolos lint batch dan isinya dikenali sama.
        assert.equal(findQuestion(bank, ids[0]).lifecycle.status, 'NEEDS_REVISION');
        const plan = await planBatchImport(bank, makeBatch(pack, parsed.data, 'DEMO-B01'));
        assert.ok(plan.ok, plan.errors && messages(plan.errors));
        assert.deepEqual(plan.entries.map((e) => e.action), ['sama', 'sama']);
        await assert.rejects(async () => revisionRequestText(bank, []), /minimal satu/);
        await assert.rejects(async () => revisionRequestText(bank, ['DEMO-MCQ-999']), /tidak ada di bank/);
      },
    },
    {
      name: 'validasi hasil review: batchId, reviewKey, contentHash, kelengkapan, reviewer ganda sama',
      run: async () => {
        const { bank, ids } = await bankWithDrafts(2);
        const pkg = await buildReviewPackage(bank, ids, { rng: createRng(2), now: T });
        const good = makeReviewResult(pkg);
        const mut = (fn) => { const r = clone(good); fn(r); return validateReviewResult(bank, r); };
        assert.ok(/batchId/.test(mut((r) => { r.batchId = 'X'; }).errors[0].path));
        assert.ok(mut((r) => { r.items[0].contentHash = 'a'.repeat(64); }).errors.some((e) => /items\[0\]\.contentHash/.test(e.path) && /R01/.test(e.message)));
        assert.ok(mut((r) => { r.items.pop(); }).errors.some((e) => /belum ada hasil untuk R02/.test(e.message)));
        assert.ok(mut((r) => { r.items[1].reviewKey = 'R09'; }).errors.some((e) => /R09 tidak ada/.test(e.message)));
        assert.ok(mut((r) => { r.items[0].findings = [{ severity: 'kritis', dimension: 'kunci', issue: 'x', suggestedFix: '' }]; }).errors.some((e) => /findings\[0\]\.dimension/.test(e.path)));
        assert.ok(!validateReviewResult(bank, 'bukan json').ok);
        applyReviewResult(bank, validateReviewResult(bank, good), T);
        const again = validateReviewResult(bank, good);
        assert.ok(!again.ok && /sudah pernah diimpor/.test(again.errors[0].message));
      },
    },
    {
      name: 'review ganda berbeda pendapat: status paling hati-hati, wajib keputusan manusia',
      run: async () => {
        const { bank, ids } = await bankWithDrafts(2);
        const pkg = await buildReviewPackage(bank, ids, { rng: createRng(2), now: T });
        applyReviewResult(bank, validateReviewResult(bank, makeReviewResult(pkg, { model: 'reviewer-1' })), T);
        assert.equal(findQuestion(bank, ids[0]).lifecycle.status, 'AI_REVIEWED');
        const pending = bank.pendingReviews.at(-1);
        const second = makeReviewResult(pkg, { model: 'reviewer-2', verdictFor: (i) => (pending.keyMap[i.reviewKey].questionId === ids[0] ? { verdict: 'REVISE', findings: [finding('mayor', 'stemClarity')] } : { verdict: 'APPROVE' }) });
        const out = applyReviewResult(bank, validateReviewResult(bank, second), T);
        assert.ok(out.decisions.find((d) => d.questionId === ids[0]).conflict);
        assert.equal(findQuestion(bank, ids[0]).lifecycle.status, 'NEEDS_REVISION');
        assert.ok(bank.conflicts[ids[0]] && !bank.conflicts[ids[1]]);
        assert.equal(findQuestion(bank, ids[1]).lifecycle.status, 'AI_REVIEWED', 'review sepakat tidak berkonflik');
        await assert.rejects(() => resolveConflict(bank, ids[0], 'AI_REVIEWED', { by: 'LMA', reason: '' }, T), /Alasan/);
        resolveConflict(bank, ids[0], 'AI_REVIEWED', { by: 'LMA', reason: 'Stem sudah jelas bagi peserta.' }, T);
        assert.equal(findQuestion(bank, ids[0]).lifecycle.status, 'AI_REVIEWED');
        approve(bank, [ids[0]], 'LMA', T);
        assert.equal(findQuestion(bank, ids[0]).lifecycle.status, 'APPROVED');
      },
    },
    {
      name: 'impor soal kalibrasi: batch berlabel kalibrasi, tidak boleh dicampur, tidak pernah LIVE',
      run: async () => {
        const { pack, bank } = await freshBank();
        const cal = draftFrom(pack, 'essay', 1, { calibration: { ...KEY_DEFECT, defectDimension: 'rubricQuality' } });
        const mixed = await planBatchImport(bank, makeBatch(pack, [cal, draftFrom(pack, 'mcq', 1)]));
        assert.ok(!mixed.ok && /mencampur/.test(messages(mixed.errors)));
        const noInfo = draftFrom(pack, 'mcq', 2);
        noInfo.lifecycle.status = 'CALIBRATION';
        const missing = await planBatchImport(bank, makeBatch(pack, [noInfo]));
        assert.ok(!missing.ok && /calibration/.test(messages(missing.errors)));
        const plan = await planBatchImport(bank, makeBatch(pack, [cal]));
        assert.ok(plan.ok && plan.calibration, plan.errors && messages(plan.errors));
        applyBatchImport(bank, plan, T);
        assert.equal(findQuestion(bank, cal.id).lifecycle.status, 'CALIBRATION');
        await assert.rejects(() => approve(bank, [cal.id], 'LMA', T), /Lolos review AI/);
        const normal = draftFrom(pack, 'essay', 1);
        const clash = await planBatchImport(bank, makeBatch(pack, [normal]));
        assert.ok(!clash.ok && /soal kalibrasi/.test(messages(clash.errors)));
      },
    },
    {
      name: 'statistik cakupan: topik, kesulitan, posisi kunci > 35% ditandai',
      run: async () => {
        const { pack, bank } = await freshBank();
        const s = bankStats(bank);
        assert.equal(s.total, pack.questions.filter((q) => q.lifecycle.status === 'LIVE').length);
        assert.equal(s.topics.find((t) => t.id === 'T01').mcq, 1);
        assert.deepEqual(s.keyCounts, { A: 0, B: 1, C: 1, D: 0 });
        assert.deepEqual(s.overKey.sort(), ['B', 'C'], '2 PG: masing-masing 50% > 35%');
        assert.equal(s.difficulty.case.sulit, 1);
        assert.equal(s.byStatus.LIVE, 5);
      },
    },
    {
      name: 'alur penuh: impor batch -> review -> setujui -> publikasi -> soal muncul di paket',
      run: async () => {
        const { pack, bank, ids } = await bankWithDrafts(2);
        const store = new Store(memoryBackend());
        saveBank(store, bank);
        const reloaded = loadBank(store, pack.subjectId);
        assert.ok(reloaded.ok, reloaded.errors && messages(reloaded.errors));
        const b = reloaded.bank;
        const pkg = await buildReviewPackage(b, ids, { includeCalibration: true, rng: createRng(9), now: T });
        const cal = calibrationKeyOf(b, pkg);
        const result = makeReviewResult(pkg, { model: 'reviewer-x', verdictFor: (i) => (i.reviewKey === cal ? { verdict: 'REJECT', findings: [finding('kritis', 'keyCorrectness')] } : { verdict: 'APPROVE' }) });
        const text = `\`\`\`json\n${JSON.stringify(result)}\n\`\`\``;
        const out = applyReviewResult(b, validateReviewResult(b, text), T);
        assert.ok(!out.rejectedByCalibration);
        approve(b, ids, 'LMA', T + 1000);
        const before = b.pack.packVersion;
        const pub = publish(b, T + 2000, { publishedPack: pack });
        assert.deepEqual(pub.published.sort(), ids.slice().sort());
        assert.equal(pub.version, '1.1.0');
        assert.equal(before, '1.0.0');
        assert.equal(pub.pack.changelog.at(-1).version, '1.1.0');
        for (const id of ids) {
          const q = pub.pack.questions.find((x) => x.id === id);
          assert.equal(q.lifecycle.status, 'LIVE');
          assert.equal(q.lifecycle.approvedBy, 'LMA');
          assert.equal(q.lifecycle.contentHash, await contentHash(q));
        }
        assert.ok(validatePack(pub.pack).ok);
        // Pack hasil publikasi dipakai ujian (pack impor menggantikan bawaan).
        saveImportedPack(store, pub.pack);
        saveBank(store, b);
        const { packs } = await loadAllPacks({ store, win: null });
        const used = packs.find((p) => p.pack.subjectId === pack.subjectId);
        assert.equal(used.pack.packVersion, '1.1.0');
        const liveMcq = used.pack.questions.filter((q) => q.type === 'mcq' && q.lifecycle.status === 'LIVE').length;
        assert.equal(liveMcq, 4);
        const built = buildCustom(used.pack, { durationMinutes: 30, counts: { mcq: liveMcq }, weights: { mcq: 100 }, difficulty: [], topicIds: [] }, createRng(1));
        assert.ok(built.ok, built.problems && built.problems.join('; '));
        const chosen = built.items.map((it) => it.question.id);
        for (const id of ids) assert.ok(chosen.includes(id), `${id} harus bisa muncul di paket`);
        assert.ok(!chosen.includes('DEMO-MCQ-190'), 'soal kalibrasi tidak pernah masuk paket');
        // Ekspor Pack: pack.json lengkap dan valid.
        const exported = JSON.parse(exportPackText(b));
        assert.ok(validatePack(exported).ok);
        assert.ok(exported.questions.some((q) => q.lifecycle.status === 'CALIBRATION'));
        await assert.rejects(() => publish(b, T + 3000, { publishedPack: used.pack }), /Tidak ada perubahan/);
      },
    },
    {
      name: 'pembaruan taksonomi bank dari pack bawaan: deteksi, kode hilang ditolak, soal dan hash tetap (D-87)',
      run: async () => {
        const { pack, bank } = await bankWithDrafts(2);
        assert.equal(taxonomyDiff(bank, pack), null, 'taksonomi sama: tidak ada pemberitahuan');
        assert.equal(taxonomyDiff(bank, { ...pack, subjectId: 'lain' }), null, 'mata ujian lain diabaikan');
        const source = clone(pack);
        source.packVersion = '2.0.0';
        source.topics = source.topics.map((t) => ({ ...t, name: `${t.name} (baru)` }));
        source.topics.push({ id: 'T99', name: 'Topik tambahan' });
        const diff = taxonomyDiff(bank, source);
        assert.ok(diff && diff.topics && !diff.competencies && diff.missing.length === 0, JSON.stringify(diff));
        const before = clone(bank.pack.questions);
        const version = bank.pack.packVersion;
        updateTaxonomy(bank, source, T);
        assert.deepEqual(bank.pack.topics, source.topics);
        assert.deepEqual(bank.pack.questions, before, 'soal, status, dan contentHash tidak berubah');
        assert.equal(bank.pack.packVersion, version, 'versi pack tidak berubah');
        assert.ok(bank.log.at(-1).message.includes('versi 2.0.0'));
        assert.equal(taxonomyDiff(bank, source), null);
        assert.ok(validatePack(bank.pack).ok);
        await assert.rejects(async () => updateTaxonomy(bank, source, T), /sudah sama/);
        // Kode yang dipakai soal hilang dari pack bawaan: ditolak, bank tidak berubah.
        const usedTopic = bank.pack.questions[0].topicIds[0];
        const shrunk = clone(source);
        shrunk.topics = shrunk.topics.filter((t) => t.id !== usedTopic);
        const d2 = taxonomyDiff(bank, shrunk);
        assert.ok(d2.missing.some((m) => m.code === usedTopic));
        await assert.rejects(async () => updateTaxonomy(bank, shrunk, T), new RegExp(usedTopic));
        assert.deepEqual(bank.pack.topics, source.topics);
        // Pack ujian di perangkat (impor) ikut diperbarui tanpa mengubah soal.
        const updated = withTaxonomy(pack, source);
        assert.deepEqual(updated.topics, source.topics);
        assert.deepEqual(updated.questions, pack.questions);
        assert.ok(validatePack(updated).ok);
      },
    },
    {
      name: 'loadAllPacks: pack bawaan tetap tersedia walau digantikan pack impor (D-87)',
      run: async () => {
        const pack = await loadJson('packs/demo/pack.json');
        const imported = { ...clone(pack), topics: pack.topics.map((t) => ({ ...t, name: 'lama' })) };
        const store = new Store(memoryBackend());
        saveImportedPack(store, imported);
        const win = { location: { protocol: 'file:' }, CA_SIM_PACK_INDEX: [pack.subjectId], CA_SIM_PACKS: { [pack.subjectId]: pack } };
        const { packs, builtIn } = await loadAllPacks({ store, win });
        assert.equal(packs.find((p) => p.pack.subjectId === pack.subjectId).source, 'impor');
        assert.deepEqual(builtIn[pack.subjectId].topics, pack.topics);
      },
    },
  ],
};
