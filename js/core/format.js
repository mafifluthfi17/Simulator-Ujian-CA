// Format angka, waktu, dan pembacaan angka ketikan peserta (id-ID).

const nf2 = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nf4 = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
const nfFree = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 6 });

// SPEC 10: 2 desimal; 4 desimal bila nilai di sekitar batas lulus 70.
export function formatScore(value) {
  if (value >= 69.995 && value <= 70.005) return nf4.format(value);
  return nf2.format(value);
}

// Angka skor biasa (maks, skor per soal, passing grade): selalu 2 desimal.
export function formatFixed2(value) {
  return nf2.format(value);
}

export function formatNumber(value) {
  return nfFree.format(value);
}

// "HH:MM:SS" bila >= 1 jam, selain itu "MM:SS".
export function formatDuration(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatMinutes(ms) {
  if (ms < 60000) return `${Math.round(ms / 1000)} detik`;
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes} menit`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} jam ${m} menit` : `${h} jam`;
}

// "HH:MM:SS" waktu lokal (SPEC 3: indikator "Tersimpan HH:MM:SS").
export function formatClockTime(date) {
  return [date.getHours(), date.getMinutes(), date.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
}

export function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

// Membaca angka ketikan peserta. Koma = desimal (gaya Indonesia).
// Titik dianggap pemisah ribuan hanya bila polanya ribuan (1.200 atau 12.500.000);
// selain itu titik dianggap desimal (47.8). Mengembalikan null bila tidak terbaca.
export function parseDecimalInput(text) {
  if (typeof text !== 'string') return null;
  let s = text.trim().replace(/\s+/g, '');
  if (!s) return null;
  const negative = s.startsWith('-');
  if (negative || s.startsWith('+')) s = s.slice(1);
  const hasComma = s.includes(',');
  const hasDot = s.includes('.');
  if (hasComma && hasDot) {
    if (!/^\d{1,3}(\.\d{3})+,\d+$/.test(s)) return null;
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (hasComma) {
    if (!/^\d+,\d+$/.test(s)) return null;
    s = s.replace(',', '.');
  } else if (hasDot) {
    if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    else if (!/^\d*\.\d+$/.test(s)) return null;
  } else if (!/^\d+$/.test(s)) {
    return null;
  }
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return negative ? -n : n;
}

export function countWords(text) {
  if (typeof text !== 'string') return 0;
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function round2(n) {
  return Math.round(n * 100) / 100;
}

// Menghilangkan galat floating point pada penjumlahan skor (bukan pembulatan tampilan).
export function roundScore(n) {
  return Math.round(n * 1e6) / 1e6;
}
