#!/usr/bin/env node
// Menanam schema/*.schema.json ke js/core/schemas.js agar aplikasi dapat
// memvalidasi tanpa fetch (termasuk saat dibuka dari file://).

import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { schemasModule } from './generate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const schemas = {};
for (const name of (await readdir(path.join(ROOT, 'schema'))).filter((n) => n.endsWith('.schema.json'))) {
  schemas[name] = JSON.parse((await readFile(path.join(ROOT, 'schema', name), 'utf8')).replace(/^﻿/, ''));
}
await writeFile(path.join(ROOT, 'js/core/schemas.js'), schemasModule(schemas));
console.log(`js/core/schemas.js: ${Object.keys(schemas).length} skema`);
