// Tes kontrak data: validator subset JSON Schema + aturan konsistensi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SchemaRegistry } from '../js/core/jsonschema.js';
import { checkConsistency } from '../js/core/consistency.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async (rel) => JSON.parse(await readFile(path.join(ROOT, rel), 'utf8'));

async function loadRegistry() {
  const registry = new SchemaRegistry();
  for (const name of await readdir(path.join(ROOT, 'schema'))) {
    if (name.endsWith('.schema.json')) registry.add(await readJson(`schema/${name}`));
  }
  return registry;
}

function check(registry, kind, data) {
  const { errors } = registry.validate(`${kind}.schema.json`, data);
  return errors.length ? errors : checkConsistency(kind, data);
}

test('semua $ref antarskema ter-resolve', async () => {
  const registry = await loadRegistry();
  assert.deepEqual(registry.findBrokenRefs(), []);
});

test('kata kunci skema yang tidak didukung ditolak saat didaftarkan', () => {
  const registry = new SchemaRegistry();
  assert.throws(() => registry.add({ $id: 'x.json', type: 'object', unevaluatedProperties: false }), /tidak didukung/);
});

test('multipleOf 0,5 menerima 2,5 dan menolak 2,3', () => {
  const registry = new SchemaRegistry();
  registry.add({ $id: 's.json', type: 'number', multipleOf: 0.5 });
  assert.equal(registry.validate('s.json', 2.5).valid, true);
  assert.equal(registry.validate('s.json', 2.3).valid, false);
});

test('multipleOf 0,01 tahan galat pembulatan (33,33)', () => {
  const registry = new SchemaRegistry();
  registry.add({ $id: 's.json', type: 'number', multipleOf: 0.01 });
  assert.equal(registry.validate('s.json', 33.33).valid, true);
});

test('pesan error menyebut path field', async () => {
  const registry = await loadRegistry();
  const q = await readJson('schema/examples/question.mcq.json');
  delete q.answerKey;
  const errors = check(registry, 'question', q);
  assert.ok(errors.some((e) => e.path === '$.answerKey'));
});

test('TS-02: jumlah rubrik salah ditolak dengan ID soal', async () => {
  const registry = await loadRegistry();
  const q = await readJson('schema/examples/invalid/question.rubric-sum.json');
  const errors = check(registry, 'question', q);
  assert.ok(errors.some((e) => e.message.includes('CTH-ESA-901')));
});

test('field terlarang per tipe soal ditolak (rubric pada mcq)', async () => {
  const registry = await loadRegistry();
  const q = await readJson('schema/examples/question.mcq.json');
  q.rubric = [];
  assert.ok(check(registry, 'question', q).some((e) => e.path === '$.rubric'));
});

test('batch dari AI tidak boleh berstatus LIVE', async () => {
  const registry = await loadRegistry();
  const batch = await readJson('schema/examples/batch.example.json');
  batch.items[0].lifecycle.status = 'LIVE';
  assert.equal(check(registry, 'batch', batch).length > 0, true);
});

test('pack: bobot bagian harus 100', async () => {
  const registry = await loadRegistry();
  const pack = await readJson('schema/examples/pack.example.json');
  pack.packages[0].sections[0].weight = 19;
  assert.ok(check(registry, 'pack', pack).some((e) => e.message.includes('harus 100')));
});

test('review-export tidak boleh membocorkan id soal', async () => {
  const registry = await loadRegistry();
  const exp = await readJson('schema/examples/review-export.example.json');
  exp.items[0].id = 'CTH-MCQ-004';
  assert.ok(check(registry, 'review-export', exp).some((e) => e.path === '$.items[0].id'));
});
