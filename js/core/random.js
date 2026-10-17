// Bilangan acak yang dapat diulang (seed) untuk tes, dan seed acak untuk aplikasi.

// mulberry32: cukup untuk mengacak soal; bukan untuk keperluan kriptografi.
export function createRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed() {
  const buf = new Uint32Array(1);
  globalThis.crypto.getRandomValues(buf);
  return buf[0];
}

export function shuffle(list, rng) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function randomHex(length, rng) {
  let s = '';
  for (let i = 0; i < length; i++) s += Math.floor(rng() * 16).toString(16);
  return s;
}
