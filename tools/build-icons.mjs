#!/usr/bin/env node
// Membuat icons/icon-192.png, icon-512.png, apple-touch-icon.png (180 px), icon.svg.

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { iconFiles } from './icons.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await mkdir(path.join(ROOT, 'icons'), { recursive: true });
for (const { path: rel, data } of await iconFiles()) {
  await writeFile(path.join(ROOT, rel), data);
  console.log(`${rel} (${data.length} byte)`);
}
