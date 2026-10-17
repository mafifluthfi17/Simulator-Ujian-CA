// Migrasi data antarversi skema (SPEC 4). Data yang tidak dapat dimigrasi
// DITOLAK dengan pesan dan dibiarkan utuh; tidak pernah dihapus diam-diam.

import { SCHEMA_VERSION } from './version.js';

// kind -> { versiLama: fungsi(data) -> data versi berikutnya }.
// Belum ada versi lama yang dirilis, jadi daftar masih kosong.
const MIGRATIONS = {
  session: {},
  pack: {},
};

const LABELS = { session: 'sesi', pack: 'Subject Pack' };

export function migrate(kind, data) {
  const label = LABELS[kind] || kind;
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, message: `Data ${label} tidak berbentuk objek JSON.` };
  }
  let current = data;
  let migrated = false;
  const seen = new Set();
  while (current.schemaVersion !== SCHEMA_VERSION) {
    const version = current.schemaVersion;
    const step = (MIGRATIONS[kind] || {})[version];
    if (!step || seen.has(version)) {
      const shown = version === undefined ? 'tanpa schemaVersion' : `versi ${JSON.stringify(version)}`;
      return {
        ok: false,
        message: `Data ${label} memakai ${shown}, sedangkan aplikasi ini memakai versi ${SCHEMA_VERSION}. `
          + 'Data tidak dapat dimigrasi otomatis sehingga tidak dimuat; data asli tetap disimpan.',
      };
    }
    seen.add(version);
    current = step(JSON.parse(JSON.stringify(current)));
    migrated = true;
  }
  return { ok: true, data: current, migrated };
}
