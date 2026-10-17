#!/usr/bin/env node
// Membuat service-worker.js (daftar aset + versi cache dari hash isi aset).
// Jalankan ulang setiap kali berkas aplikasi berubah; tes sinkronisasi mengingatkan.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildServiceWorker } from './pwa-build.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (rel) => readFile(path.join(ROOT, rel), 'utf8');

const { version, assets, source } = await buildServiceWorker(load);
await writeFile(path.join(ROOT, 'service-worker.js'), source);
console.log(`service-worker.js: ${version}, ${assets.length} aset`);
