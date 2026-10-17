#!/usr/bin/env node
// Membuat dist/simulator-offline.html: satu berkas (CSS, pack, dan semua modul
// digabung) yang dapat dibuka langsung dari file:// tanpa server (SPEC 2).

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildOfflineHtml } from './pwa-build.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (rel) => readFile(path.join(ROOT, rel), 'utf8');

const html = await buildOfflineHtml(load);
await mkdir(path.join(ROOT, 'dist'), { recursive: true });
await writeFile(path.join(ROOT, 'dist', 'simulator-offline.html'), html);
console.log(`dist/simulator-offline.html (${html.length} karakter)`);
