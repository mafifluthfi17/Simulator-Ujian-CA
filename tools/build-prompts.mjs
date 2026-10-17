#!/usr/bin/env node
// Menanam prompts/*.md ke js/core/prompts.js agar tombol "Salin Prompt + Data"
// tidak membutuhkan fetch (berfungsi juga dari file://).

import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promptsModule } from './generate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const prompts = {};
for (const name of (await readdir(path.join(ROOT, 'prompts'))).filter((n) => n.endsWith('.md'))) {
  prompts[name] = await readFile(path.join(ROOT, 'prompts', name), 'utf8');
}
await writeFile(path.join(ROOT, 'js/core/prompts.js'), promptsModule(prompts));
console.log(`js/core/prompts.js: ${Object.keys(prompts).length} prompt`);
