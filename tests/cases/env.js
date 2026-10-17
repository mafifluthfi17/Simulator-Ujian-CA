// Membaca berkas proyek di Node (fs) maupun browser (fetch, path relatif akar situs).

export const isNode = typeof window === 'undefined';

export async function loadText(relPath) {
  if (isNode) {
    const { readFile } = await import('node:fs/promises');
    const { fileURLToPath } = await import('node:url');
    return readFile(fileURLToPath(new URL(`../../${relPath}`, import.meta.url)), 'utf8');
  }
  const res = await fetch(new URL(`../../${relPath}`, import.meta.url), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Gagal memuat ${relPath} (${res.status})`);
  return res.text();
}

export async function loadJson(relPath) {
  return JSON.parse((await loadText(relPath)).replace(/^﻿/, ''));
}

// Daftar nama berkas skema diambil dari js/core/schemas.js agar tidak perlu membaca direktori.
export async function schemaFileNames() {
  const { SCHEMAS } = await import('../../js/core/schemas.js');
  return Object.keys(SCHEMAS);
}
