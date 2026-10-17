// Asersi minimal yang berjalan di Node dan browser (tanpa node:assert).
import { deepEqual as structurallyEqual } from '../../js/core/jsonschema.js';

export class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AssertionError';
  }
}

const show = (v) => {
  const s = JSON.stringify(v);
  return s && s.length > 200 ? `${s.slice(0, 197)}...` : String(s);
};

export function ok(value, message = 'nilai harus truthy') {
  if (!value) throw new AssertionError(message);
}

export function equal(actual, expected, message) {
  if (actual !== expected) throw new AssertionError(message || `diharapkan ${show(expected)}, didapat ${show(actual)}`);
}

export function deepEqual(actual, expected, message) {
  if (!structurallyEqual(actual, expected)) throw new AssertionError(message || `diharapkan ${show(expected)}, didapat ${show(actual)}`);
}

export async function rejects(fn, pattern, message) {
  try {
    await fn();
  } catch (e) {
    if (pattern && !pattern.test(e.message)) throw new AssertionError(`pesan error "${e.message}" tidak cocok dengan ${pattern}`);
    return;
  }
  throw new AssertionError(message || 'diharapkan error, tetapi tidak ada');
}
