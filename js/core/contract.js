// Validasi dokumen terhadap kontrak (skema + aturan konsistensi) dengan skema
// yang tertanam di schemas.js, sehingga berjalan tanpa fetch (termasuk file://).

import { SchemaRegistry } from './jsonschema.js';
import { checkConsistency } from './consistency.js';
import { migrate } from './migrate.js';
import { SCHEMAS } from './schemas.js';

let registry = null;

export function getRegistry() {
  if (!registry) {
    registry = new SchemaRegistry();
    for (const schema of Object.values(SCHEMAS)) registry.add(schema);
  }
  return registry;
}

// Mengembalikan daftar error [{path, message}]; kosong bila valid.
export function validateDocument(kind, data) {
  const { errors } = getRegistry().validate(`${kind}.schema.json`, data);
  return errors.length ? errors : checkConsistency(kind, data);
}

// Migrasi bila perlu, lalu validasi. Hasil: { ok, data, errors, migrated }.
export function loadDocument(kind, data) {
  const m = migrate(kind, data);
  if (!m.ok) return { ok: false, errors: [{ path: '$.schemaVersion', message: m.message }] };
  const errors = validateDocument(kind, m.data);
  return errors.length ? { ok: false, errors } : { ok: true, data: m.data, migrated: m.migrated };
}

export function parseJsonText(text) {
  try {
    return { ok: true, data: JSON.parse(String(text).replace(/^﻿/, '')) };
  } catch (e) {
    return { ok: false, errors: [{ path: '$', message: `Berkas bukan JSON yang valid (${e.message}).` }] };
  }
}
