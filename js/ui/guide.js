// Panduan singkat dan keterbatasan yang wajib diungkapkan (SPEC 12).

import { h } from './dom.js';
import { disclaimer, header } from './layout.js';
import { APP_VERSION } from '../core/version.js';

const STEPS = [
  'Pilih paket di beranda (Training 1, Training 2, Simulasi Ujian, atau Kustom), lalu ketuk MULAI.',
  'Timer berjalan sejak MULAI. Jawaban tersimpan otomatis; lihat tulisan "Tersimpan" di bawah soal.',
  'Gunakan Daftar Soal untuk berpindah soal dan melihat soal yang belum dijawab atau ditandai.',
  'Mode latihan boleh dijeda. Mode ketat (Simulasi Ujian) tidak dapat dijeda.',
  'Ketuk KUMPULKAN bila selesai. Saat waktu habis, ujian dikumpulkan otomatis.',
  'Soal pilihan ganda dan numerik langsung dinilai. Esai dan kasus menunggu penilaian uraian.',
];

const LIMITS = [
  'Kunci jawaban dapat dilihat oleh siapa pun yang membuka kode sumber aplikasi.',
  'Aplikasi tidak mengunci perangkat. Gunakan Safe Exam Browser (SEB) bila perlu.',
  'JavaScript tidak berjalan saat aplikasi ditutup; tenggat waktu diperiksa saat aplikasi dibuka kembali.',
  'Deteksi perubahan jam perangkat tidak sempurna.',
  'Data hanya tersimpan di perangkat ini dan dapat hilang bila data browser dibersihkan. Buat cadangan sesi secara berkala di Pengaturan.',
  'Penilaian uraian bergantung pada layanan AI pihak ketiga pilihan Anda.',
];

export function renderGuide(app) {
  const el = h('div', { class: 'screen' },
    header(app, { title: 'Panduan' }),
    h('div', { class: 'card' },
      h('h2', { style: 'margin-top:0', text: 'Cara memakai' }),
      h('ol', {}, STEPS.map((s) => h('li', { text: s })))),
    h('div', { class: 'card' },
      h('h2', { style: 'margin-top:0', text: 'Tentang dan keterbatasan' }),
      h('ul', {}, LIMITS.map((s) => h('li', { text: s }))),
      h('p', { class: 'hint', text: `Versi aplikasi ${APP_VERSION}` })),
    disclaimer());
  return { el };
}
