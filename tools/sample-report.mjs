#!/usr/bin/env node
// Menulis contoh laporan dari sesi demo ke tests/output/ (.docx, Lembar Belajar,
// .xlsx, HTML, fallback .doc dan .csv). Penilaian uraian di contoh ini fiktif.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sampleReportFiles } from '../tests/fixtures/sample-report.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests', 'output');

const pack = JSON.parse((await readFile(path.join(ROOT, 'packs/demo/pack.json'), 'utf8')).replace(/^﻿/, ''));
await mkdir(OUT, { recursive: true });
for (const { name, data } of await sampleReportFiles(pack)) {
  await writeFile(path.join(OUT, name), data);
  console.log(`tests/output/${name} (${data.length} byte)`);
}
