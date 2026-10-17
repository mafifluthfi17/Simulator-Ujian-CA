// Penyimpanan lokal ber-namespace caSim:<subjectId>:... (SPEC 4).
// Backend dapat diganti (memoryBackend) agar logika dapat dites di Node.

export class StorageFullError extends Error {
  constructor() {
    super('Penyimpanan perangkat penuh. Data terbaru belum tersimpan. '
      + 'Ekspor cadangan sesi lalu hapus riwayat lama di Pengaturan.');
    this.name = 'StorageFullError';
  }
}

export const keys = {
  session: (subjectId, sessionId) => `caSim:${subjectId}:session:${sessionId}`,
  sessionList: (subjectId) => `caSim:${subjectId}:sessions`,
  active: (subjectId) => `caSim:${subjectId}:active`,
  importedPack: (subjectId) => `caSim:${subjectId}:pack`,
  bank: (subjectId) => `caSim:${subjectId}:bank`,
  settings: 'caSim:_app:settings',
};

export class Store {
  constructor(backend) {
    this.backend = backend;
  }

  getJson(key) {
    const raw = this.backend.getItem(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return { __unreadable: raw };
    }
  }

  setJson(key, value) {
    try {
      this.backend.setItem(key, JSON.stringify(value));
    } catch (e) {
      if (isQuotaError(e)) throw new StorageFullError();
      throw e;
    }
  }

  remove(key) {
    this.backend.removeItem(key);
  }

  keysWithPrefix(prefix) {
    const found = [];
    for (let i = 0; i < this.backend.length; i++) {
      const k = this.backend.key(i);
      if (k && k.startsWith(prefix)) found.push(k);
    }
    return found;
  }
}

export function memoryBackend(limitBytes = Infinity) {
  const map = new Map();
  const size = () => [...map.values()].reduce((n, v) => n + v.length, 0);
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => {
      const value = String(v);
      const previous = map.has(k) ? map.get(k).length : 0;
      if (size() - previous + value.length > limitBytes) {
        const e = new Error('quota');
        e.name = 'QuotaExceededError';
        throw e;
      }
      map.set(k, value);
    },
    removeItem: (k) => { map.delete(k); },
    key: (i) => [...map.keys()][i] ?? null,
    get length() { return map.size; },
  };
}

function isQuotaError(e) {
  return e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    || e.code === 22 || e.code === 1014);
}
