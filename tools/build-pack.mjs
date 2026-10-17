#!/usr/bin/env node
// Memvalidasi packs/<id>/pack.json lalu membuat packs/<id>/pack.js (cadangan
// file://), packs/index.json, dan packs/index.js. Pack yang tidak valid atau
// soal LIVE/APPROVED/AI_REVIEWED dengan contentHash tidak cocok menggagalkan build.
// Jalankan tools/build-schemas.mjs lebih dulu bila skema berubah.

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validatePack } from '../js/core/pack-loader.js';
import { contentHash } from '../js/core/hash.js';
import { packIndexJson, packIndexScript, packScript } from './generate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKS = path.join(ROOT, 'packs');
const HASHED = new Set(['AI_REVIEWED', 'APPROVED', 'LIVE']);

let failed = false;
const ids = [];
for (const entry of (await readdir(PACKS, { withFileTypes: true })).filter((e) => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
  const file = path.join(PACKS, entry.name, 'pack.json');
  if (!existsSync(file)) continue;
  const pack = JSON.parse((await readFile(file, 'utf8')).replace(/^﻿/, ''));
  const result = validatePack(pack);
  if (!result.ok) {
    failed = true;
    console.log(`FAIL  packs/${entry.name}/pack.json`);
    for (const e of result.errors) console.log(`      ${e.path}: ${e.message}`);
    continue;
  }
  if (pack.subjectId !== entry.name) {
    failed = true;
    console.log(`FAIL  packs/${entry.name}: subjectId "${pack.subjectId}" harus sama dengan nama folder`);
    continue;
  }
  const mismatches = [];
  for (const q of pack.questions) {
    if (!HASHED.has(q.lifecycle.status)) continue;
    const actual = await contentHash(q);
    if (actual !== q.lifecycle.contentHash) mismatches.push(`${q.id}: contentHash tersimpan ${q.lifecycle.contentHash}, hasil hitung ${actual}`);
  }
  if (mismatches.length) {
    failed = true;
    console.log(`FAIL  packs/${entry.name}/pack.json (isi soal berubah setelah review/persetujuan)`);
    for (const m of mismatches) console.log(`      ${m}`);
    continue;
  }
  await writeFile(path.join(PACKS, entry.name, 'pack.js'), packScript(pack));
  ids.push(pack.subjectId);
  console.log(`OK    packs/${entry.name}/pack.js (${pack.questions.length} soal, v${pack.packVersion})`);
}
await writeFile(path.join(PACKS, 'index.json'), packIndexJson(ids));
await writeFile(path.join(PACKS, 'index.js'), packIndexScript(ids));
console.log(`packs/index.json: ${JSON.stringify(ids)}`);
process.exitCode = failed ? 1 : 0;
