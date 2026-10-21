// Kontrak data: validator skema, contoh, pack demo, sinkronisasi berkas turunan.
import * as assert from './assert.js';
import { loadJson, loadText, schemaFileNames, isNode } from './env.js';
import { SchemaRegistry } from '../../js/core/jsonschema.js';
import { SCHEMAS } from '../../js/core/schemas.js';
import { validateDocument } from '../../js/core/contract.js';
import { validatePack } from '../../js/core/pack-loader.js';
import { contentHash } from '../../js/core/hash.js';
import { buildFromPackage } from '../../js/core/blueprint.js';
import { createRng } from '../../js/core/random.js';
import { makeSyntheticPack } from '../fixtures/make-pack.js';
import { packScript, packIndexJson, promptsModule } from '../../tools/generate.mjs';
import { PROMPTS } from '../../js/core/prompts.js';

const PROMPT_FILES = ['prompt_penilai_ai.md', 'prompt_penyusun_soal.md', 'prompt_reviewer_soal.md'];

const EXAMPLES = [
  'batch.example.json', 'grading-export.example.json', 'grading-result.example.json', 'pack.example.json',
  'question.case.json', 'question.essay.json', 'question.mcq.json', 'question.numeric.json',
  'review-export.example.json', 'review-result.example.json', 'session.example.json',
];
const INVALID = [
  'grading-result.bukan-kelipatan.json', 'question.mcq-field-terlarang.json',
  'question.rubric-sum.json', 'review-result.dimensi-tak-dikenal.json',
];

export default {
  name: 'Kontrak',
  cases: [
    {
      name: 'js/core/prompts.js sinkron dengan prompts/*.md',
      run: async () => {
        let files = PROMPT_FILES;
        if (isNode) {
          const { readdir } = await import('node:fs/promises');
          const { fileURLToPath } = await import('node:url');
          files = (await readdir(fileURLToPath(new URL('../../prompts/', import.meta.url)))).filter((n) => n.endsWith('.md'));
        }
        assert.deepEqual(Object.keys(PROMPTS).sort(), files.slice().sort(), 'daftar prompt berbeda; jalankan node tools/build-prompts.mjs');
        const texts = {};
        for (const name of files) texts[name] = await loadText(`prompts/${name}`);
        assert.equal(await loadText('js/core/prompts.js'), promptsModule(texts), 'prompts.js tidak sinkron; jalankan node tools/build-prompts.mjs');
      },
    },
    {
      name: 'js/core/schemas.js sinkron dengan schema/*.schema.json',
      run: async () => {
        let files = await schemaFileNames();
        if (isNode) {
          const { readdir } = await import('node:fs/promises');
          const { fileURLToPath } = await import('node:url');
          files = (await readdir(fileURLToPath(new URL('../../schema/', import.meta.url)))).filter((n) => n.endsWith('.schema.json'));
        }
        assert.deepEqual(Object.keys(SCHEMAS).sort(), files.slice().sort(), 'daftar skema berbeda; jalankan node tools/build-schemas.mjs');
        for (const name of files) {
          assert.deepEqual(SCHEMAS[name], await loadJson(`schema/${name}`), `${name} berbeda; jalankan node tools/build-schemas.mjs`);
        }
      },
    },
    {
      name: 'semua $ref antarskema ter-resolve',
      run: () => {
        const reg = new SchemaRegistry();
        for (const s of Object.values(SCHEMAS)) reg.add(s);
        assert.deepEqual(reg.findBrokenRefs(), []);
      },
    },
    {
      name: 'kata kunci skema tak didukung ditolak',
      run: async () => {
        const reg = new SchemaRegistry();
        await assert.rejects(() => reg.add({ $id: 'x.json', unevaluatedProperties: false }), /tidak didukung/);
      },
    },
    {
      name: 'multipleOf 0,5 dan 0,01 tahan galat pembulatan',
      run: () => {
        const reg = new SchemaRegistry();
        reg.add({ $id: 'h.json', type: 'number', multipleOf: 0.5 });
        reg.add({ $id: 'c.json', type: 'number', multipleOf: 0.01 });
        assert.ok(reg.validate('h.json', 2.5).valid);
        assert.ok(!reg.validate('h.json', 2.3).valid);
        assert.ok(reg.validate('c.json', 33.33).valid);
        assert.ok(reg.validate('c.json', 4.29).valid);
      },
    },
    {
      name: 'contoh valid lolos, contoh tidak valid ditolak',
      run: async () => {
        for (const file of EXAMPLES) {
          const errors = validateDocument(file.split('.')[0], await loadJson(`schema/examples/${file}`));
          assert.equal(errors.length, 0, `${file}: ${errors.map((e) => `${e.path} ${e.message}`).join('; ')}`);
        }
        for (const file of INVALID) {
          const errors = validateDocument(file.split('.')[0], await loadJson(`schema/examples/invalid/${file}`));
          assert.ok(errors.length > 0, `${file} seharusnya ditolak`);
        }
      },
    },
    {
      id: 'TS-01',
      name: 'pack demo valid, 0 error, hash cocok, T1 demo dapat dibentuk',
      run: async () => {
        const raw = await loadJson('packs/demo/pack.json');
        const result = validatePack(raw);
        assert.ok(result.ok, result.errors && result.errors.map((e) => `${e.path} ${e.message}`).join('; '));
        const types = raw.questions.map((q) => q.type).sort();
        assert.deepEqual(types, ['case', 'essay', 'mcq', 'mcq', 'numeric']);
        for (const q of raw.questions) {
          assert.ok(q.stem.startsWith('[DEMO]'), `${q.id} harus berlabel [DEMO]`);
          assert.equal(q.lifecycle.contentHash, await contentHash(q), `${q.id}: contentHash tidak cocok`);
        }
        const built = buildFromPackage(raw, raw.packages[0], createRng(1));
        assert.ok(built.ok, built.problems && built.problems.join('; '));
        assert.equal(built.items.length, 5);
      },
    },
    {
      name: 'packs/*/pack.js dan packs/index.json sinkron dengan pack.json',
      run: async () => {
        const ids = ['demo', 'msk', 'pk'];
        assert.equal(await loadText('packs/index.json'), packIndexJson(ids), 'packs/index.json usang; jalankan node tools/build-pack.mjs');
        for (const id of ids) {
          const pack = await loadJson(`packs/${id}/pack.json`);
          assert.equal(await loadText(`packs/${id}/pack.js`), packScript(pack), `packs/${id}/pack.js usang; jalankan node tools/build-pack.mjs`);
        }
      },
    },
    {
      name: 'pack MSK: valid, 12 topik, 6 kompetensi, blueprint SPEC 6, soal dari alur bank soal',
      run: async () => {
        const pack = await loadJson('packs/msk/pack.json');
        const result = validatePack(pack);
        assert.ok(result.ok, result.errors && result.errors.map((e) => `${e.path}: ${e.message}`).join('; '));
        assert.equal(pack.topics.length, 12);
        assert.equal(pack.competencies.length, 6);
        assert.deepEqual(pack.packages.map((p) => [p.id, p.durationMinutes, p.sections.map((s) => `${s.type}${s.count}:${s.weight}`).join(' ')]), [
          ['T1', 60, 'mcq10:20 essay4:40 case2:40'],
          ['T2', 120, 'mcq10:20 essay4:40 case2:40'],
          ['SIM', 180, 'mcq17:17 essay5:50 case2:33'],
        ]);
        // Soal MSK hanya berasal dari Ekspor Pack bank soal (D-89), bukan ditulis Claude Code.
        for (const q of pack.questions) {
          assert.ok(q.id.startsWith('MSK-'), `${q.id}: prefiks ID harus MSK-`);
          assert.ok(!q.stem.startsWith('[DEMO]') && !q.stem.startsWith('[UJI'), `${q.id}: soal demo/uji hanya di packs/demo/ dan tests/`);
        }
        for (const p of pack.packages) {
          const built = buildFromPackage(pack, p, createRng(1));
          assert.ok(built.ok, `${p.id}: ${built.problems && built.problems.join('; ')}`);
        }
      },
    },
    {
      name: 'pack Pelaporan Korporat: valid, 14 topik (bab modul), 5 kompetensi, blueprint sama dengan MSK, soal dari alur bank soal',
      run: async () => {
        const pack = await loadJson('packs/pk/pack.json');
        const msk = await loadJson('packs/msk/pack.json');
        const result = validatePack(pack);
        assert.ok(result.ok, result.errors && result.errors.map((e) => `${e.path}: ${e.message}`).join('; '));
        assert.equal(pack.subjectId, 'pk');
        assert.equal(pack.topics.length, 14);
        assert.equal(pack.competencies.length, 5);
        assert.deepEqual(pack.packages, msk.packages);
        for (const q of pack.questions) {
          assert.ok(q.id.startsWith('PK-'), `${q.id}: prefiks ID harus PK-`);
          assert.ok(['LIVE', 'APPROVED', 'AI_REVIEWED', 'DRAFT', 'NEEDS_REVISION', 'REJECTED', 'RETIRED', 'CALIBRATION'].includes(q.lifecycle.status), q.id);
          assert.ok(!q.stem.startsWith('[DEMO]'), `${q.id}: soal demo hanya di packs/demo/`);
        }
      },
    },
    {
      name: 'pack uji sintetis 60/15/10 valid terhadap kontrak',
      run: () => {
        const result = validatePack(makeSyntheticPack());
        assert.ok(result.ok, result.errors && result.errors.slice(0, 5).map((e) => `${e.path} ${e.message}`).join('; '));
      },
    },
    {
      name: 'pack: soal LIVE tanpa contentHash ditolak',
      run: async () => {
        const pack = await loadJson('packs/demo/pack.json');
        pack.questions[0].lifecycle.contentHash = '';
        const result = validatePack(pack);
        assert.ok(!result.ok);
        assert.ok(result.errors.some((e) => e.message.includes('DEMO-MCQ-001')));
      },
    },
  ],
};
