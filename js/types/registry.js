// Registry tipe soal (SPEC 4). Setiap modul menyediakan render(), getAnswer(),
// isAnswered(), autoScore() (opsional: hanya tipe yang dinilai aplikasi),
// exportForGrading(), dan renderReport(). Tipe baru cukup didaftarkan di sini.

import * as mcq from './mcq.js';
import * as numeric from './numeric.js';
import * as essay from './essay.js';
import * as caseType from './case.js';

const TYPES = { mcq, numeric, essay, case: caseType };

export function getType(type) {
  const mod = TYPES[type];
  if (!mod) throw new Error(`Tipe soal tidak dikenal: ${type}`);
  return mod;
}

export function registeredTypes() {
  return Object.keys(TYPES);
}

export function isItemAnswered(item, value) {
  return getType(item.type).isAnswered(value);
}
