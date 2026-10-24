// Standar waktu dan kriteria tingkat kesulitan (SPEC 6.2, D-99). Dipakai lint
// impor batch dan pratinjau soal di Pengelola Bank Soal (D-100). Hasilnya hanya
// peringatan; batch tidak ditolak.

const DIFFICULTY_NAMES = { mudah: 'mudah', sedang: 'sedang', sulit: 'sulit', sangat_sulit: 'sangat sulit' };

// Menit standar per tipe (kasus: per ukuran) × tingkat kesulitan. null = kombinasi tidak dipakai.
export const STANDARD_MINUTES = {
  mcq: { mudah: 1, sedang: 1.5, sulit: 2.5, sangat_sulit: 3.5 },
  numeric: { mudah: 1, sedang: 1.5, sulit: 2.5, sangat_sulit: 3.5 },
  essay: { mudah: 6, sedang: 10, sulit: 15, sangat_sulit: 20 },
  mini: { mudah: 15, sedang: 20, sulit: null, sangat_sulit: null },
  komprehensif: { mudah: null, sedang: null, sulit: 40, sangat_sulit: 45 },
};

// Batas atas jumlah kata: reading = stem (+ opsi PG, + narasi dan data kasus);
// answer = jawaban ideal (kasus: jumlah semua sub).
export const WORD_LIMITS = {
  mcq: { mudah: { reading: 90 }, sedang: { reading: 120 }, sulit: { reading: 160 }, sangat_sulit: { reading: 200 } },
  essay: {
    mudah: { reading: 120, answer: 100 }, sedang: { reading: 150, answer: 170 },
    sulit: { reading: 200, answer: 250 }, sangat_sulit: { reading: 250, answer: 330 },
  },
  mini: { mudah: { reading: 300, answer: 230 }, sedang: { reading: 400, answer: 320 } },
  komprehensif: { sulit: { reading: 700, answer: 600 }, sangat_sulit: { reading: 900, answer: 650 } },
};

// Kasus tanpa ukuran (bagian paket Level, D-101): ukuran mengikuti tingkat kesulitan.
const sizeFor = (difficulty) => (difficulty === 'mudah' || difficulty === 'sedang' ? 'mini' : 'komprehensif');
const standardKey = (q) => (q.type === 'case' ? q.caseSize || sizeFor(q.difficulty) : q.type);

export function countWords(value) {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'string') return value.split(/\s+/).filter(Boolean).length;
  if (Array.isArray(value)) return value.reduce((n, v) => n + countWords(v), 0);
  if (typeof value === 'object') return Object.values(value).reduce((n, v) => n + countWords(v), 0);
  return String(value).length ? 1 : 0;
}

export function standardMinutes(q) {
  const row = STANDARD_MINUTES[standardKey(q)];
  return row ? row[q.difficulty] ?? null : null;
}

// Hasil: { reading, answer } jumlah kata yang dibandingkan dengan WORD_LIMITS.
export function measureWords(q) {
  if (q.type === 'mcq') return { reading: countWords(q.stem) + countWords((q.options || []).map((o) => o.text)), answer: 0 };
  if (q.type === 'essay') return { reading: countWords(q.stem), answer: countWords(q.modelAnswer) };
  if (q.type === 'case') {
    return {
      reading: countWords(q.stem) + countWords(q.caseNarrative) + countWords(q.caseData),
      answer: (q.subQuestions || []).reduce((n, s) => n + countWords(s.modelAnswer), 0),
    };
  }
  return { reading: countWords(q.stem), answer: 0 };
}

// Daftar pesan peringatan (kosong bila sesuai standar). Soal kalibrasi tidak
// diperiksa; soal yang sudah tayang (LIVE/RETIRED) dipertahankan apa adanya (D-101).
const UNCHECKED = ['CALIBRATION', 'LIVE', 'RETIRED'];
export function timeStandardIssues(q) {
  if (q.lifecycle && UNCHECKED.includes(q.lifecycle.status)) return [];
  const issues = [];
  const level = DIFFICULTY_NAMES[q.difficulty] || q.difficulty;
  if (q.type === 'case') {
    const allowed = q.difficulty === 'mudah' || q.difficulty === 'sedang' ? 'mini' : 'komprehensif';
    if (q.caseSize !== allowed) issues.push(`kasus ${level} harus berukuran ${allowed}, bukan ${q.caseSize}`);
  }
  const std = standardMinutes(q);
  if (std !== null && q.estimatedMinutes !== std) {
    issues.push(`perkiraan waktu ${String(q.estimatedMinutes).replace('.', ',')} menit, standar ${level} ${String(std).replace('.', ',')} menit`);
  }
  const limits = (WORD_LIMITS[standardKey(q)] || {})[q.difficulty];
  if (limits) {
    const words = measureWords(q);
    const readingName = q.type === 'case' ? 'narasi dan data' : q.type === 'mcq' ? 'stem dan opsi' : 'stem';
    if (words.reading > limits.reading) issues.push(`${readingName} ${words.reading} kata, batas ${level} ${limits.reading}`);
    if (limits.answer && words.answer > limits.answer) issues.push(`jawaban ideal ${words.answer} kata, batas ${level} ${limits.answer}`);
  }
  return issues;
}
