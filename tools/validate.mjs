#!/usr/bin/env node
// Validasi kontrak data:
//   1. setiap schema/*.schema.json dapat dimuat dan semua $ref ter-resolve;
//   2. setiap contoh di schema/examples/ lolos skema + aturan konsistensi;
//   3. setiap contoh di schema/examples/invalid/ DITOLAK (validator benar-benar menangkap kesalahan);
//   4. setiap packs/*/pack.json lolos skema + aturan konsistensi.
// Nama berkas contoh: <skema>.<varian>.json, mis. question.mcq.json -> question.schema.json.
// Keluar dengan kode 1 bila ada FAIL.

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SchemaRegistry, formatErrors } from '../js/core/jsonschema.js';
import { checkConsistency } from '../js/core/consistency.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCHEMA_DIR = path.join(ROOT, 'schema');
const EXAMPLE_DIR = path.join(SCHEMA_DIR, 'examples');
const INVALID_DIR = path.join(EXAMPLE_DIR, 'invalid');
const PACKS_DIR = path.join(ROOT, 'packs');
// Skema pustaka ($defs saja) tidak wajib punya contoh.
const LIBRARY_SCHEMAS = new Set(['common']);

let failures = 0;
const rel = (file) => path.relative(ROOT, file).split(path.sep).join('/');
const pass = (label, note) => console.log(`PASS  ${label}${note ? `  (${note})` : ''}`);
const fail = (label, lines) => {
  failures++;
  console.log(`FAIL  ${label}`);
  for (const line of lines) console.log(`      ${line}`);
};

async function readJson(file) {
  const text = await readFile(file, 'utf8');
  return JSON.parse(text.replace(/^﻿/, ''));
}

async function listFiles(dir, suffix) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isFile() && e.name.endsWith(suffix)).map((e) => path.join(dir, e.name)).sort();
}

function validateDocument(registry, kind, data) {
  const { errors } = registry.validate(`${kind}.schema.json`, data);
  return errors.length ? errors : checkConsistency(kind, data);
}

async function main() {
  const registry = new SchemaRegistry();
  const kinds = [];

  console.log('== Skema ==');
  for (const file of await listFiles(SCHEMA_DIR, '.schema.json')) {
    const name = path.basename(file);
    try {
      const schema = await readJson(file);
      if (schema.$id !== name) throw new Error(`$id "${schema.$id}" harus sama dengan nama berkas "${name}"`);
      registry.add(schema);
      kinds.push(name.replace(/\.schema\.json$/, ''));
      pass(rel(file));
    } catch (e) {
      fail(rel(file), [e.message]);
    }
  }
  const broken = registry.findBrokenRefs();
  if (broken.length) fail('referensi $ref antarskema', broken);
  else pass('referensi $ref antarskema', 'semua ter-resolve');

  console.log('\n== Contoh valid ==');
  const covered = new Set();
  for (const file of await listFiles(EXAMPLE_DIR, '.json')) {
    const kind = path.basename(file).split('.')[0];
    if (!registry.has(`${kind}.schema.json`)) {
      fail(rel(file), [`tidak ada skema ${kind}.schema.json`]);
      continue;
    }
    covered.add(kind);
    try {
      const errors = validateDocument(registry, kind, await readJson(file));
      if (errors.length) fail(rel(file), formatErrors(errors));
      else pass(rel(file));
    } catch (e) {
      fail(rel(file), [e.message]);
    }
  }
  for (const kind of kinds) {
    if (!LIBRARY_SCHEMAS.has(kind) && !covered.has(kind)) {
      fail(`cakupan contoh: ${kind}`, [`belum ada contoh untuk ${kind}.schema.json di schema/examples/`]);
    }
  }

  console.log('\n== Contoh tidak valid (harus ditolak) ==');
  for (const file of await listFiles(INVALID_DIR, '.json')) {
    const kind = path.basename(file).split('.')[0];
    try {
      const errors = validateDocument(registry, kind, await readJson(file));
      if (errors.length) pass(rel(file), `ditolak: ${formatErrors(errors)[0]}`);
      else fail(rel(file), ['seharusnya ditolak, tetapi lolos validasi']);
    } catch (e) {
      fail(rel(file), [e.message]);
    }
  }

  console.log('\n== Subject Pack ==');
  const packFiles = [];
  if (existsSync(PACKS_DIR)) {
    for (const entry of await readdir(PACKS_DIR, { withFileTypes: true })) {
      const file = path.join(PACKS_DIR, entry.name, 'pack.json');
      if (entry.isDirectory() && existsSync(file)) packFiles.push(file);
    }
  }
  if (!packFiles.length) console.log('INFO  belum ada packs/*/pack.json');
  for (const file of packFiles.sort()) {
    try {
      const errors = validateDocument(registry, 'pack', await readJson(file));
      if (errors.length) fail(rel(file), formatErrors(errors));
      else pass(rel(file));
    } catch (e) {
      fail(rel(file), [e.message]);
    }
  }

  console.log(failures ? `\nHASIL: ${failures} FAIL` : '\nHASIL: semua PASS');
  process.exitCode = failures ? 1 : 0;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
