// Panduan singkat dan keterbatasan yang wajib diungkapkan (SPEC 12).

import { h } from './dom.js';
import { disclaimer, header } from './layout.js';
import { APP_VERSION } from '../core/version.js';
import { LIMITATIONS } from '../core/report.js';

const STEPS = [
  'Pilih paket di beranda (Training 1, Training 2, Simulasi Ujian, atau Kustom), lalu ketuk MULAI.',
  'Timer berjalan sejak MULAI. Jawaban tersimpan otomatis; lihat tulisan "Tersimpan" di bawah soal.',
  'Gunakan Daftar Soal untuk berpindah soal dan melihat soal yang belum dijawab atau ditandai.',
  'Mode latihan boleh dijeda. Mode ketat (Simulasi Ujian) tidak dapat dijeda.',
  'Ketuk KUMPULKAN bila selesai. Saat waktu habis, ujian dikumpulkan otomatis.',
  'Soal pilihan ganda dan numerik langsung dinilai. Esai dan kasus dinilai dengan AI pilihan Anda: di layar Hasil, salin prompt dan data, tempel ke AI, lalu tempel jawabannya kembali.',
  'Laporan dapat diunduh sebagai Word, Excel, PDF (cetak), halaman web, atau berkas data sesi. Lembar Belajar berisi soal, kunci, dan pembahasan tanpa jawaban Anda.',
];

const BANK_STEPS = [
  'Buka menu ⋯ › Pengelola Bank Soal dan masukkan PIN.',
  'Impor Batch: tempel keluaran AI penyusun. Soal yang lolos pemeriksaan masuk sebagai Draf.',
  'Review: pilih soal Draf, buat paket review (boleh sisipkan soal kalibrasi), salin ke AI reviewer, lalu tempel hasilnya. Bila soal kalibrasi tidak tertangkap, seluruh hasil ditolak.',
  'Periksa soal yang Lolos review AI di pratinjau, lalu Setujui dengan inisial Anda.',
  'Publikasi: soal Disetujui menjadi tayang (LIVE) dan dapat muncul di paket ujian. Ekspor Pack untuk menyimpan berkas bank soal lengkap.',
];

// SPEC 12: daftar yang sama dipakai di laporan (js/core/report.js).
const LIMITS = LIMITATIONS;

export function renderGuide(app) {
  const el = h('div', { class: 'screen' },
    header(app, { title: 'Panduan' }),
    h('div', { class: 'card' },
      h('h2', { style: 'margin-top:0', text: 'Cara memakai' }),
      h('ol', {}, STEPS.map((s) => h('li', { text: s })))),
    h('div', { class: 'card' },
      h('h2', { style: 'margin-top:0', text: 'Pengelola Bank Soal' }),
      h('ol', {}, BANK_STEPS.map((s) => h('li', { text: s }))),
      h('p', { class: 'notice', text: 'PIN Pengelola Bank Soal hanya mencegah salah tekan oleh peserta. PIN ini BUKAN fitur keamanan: siapa pun yang membuka kode sumber atau data browser tetap dapat melihat kunci jawaban.' })),
    h('div', { class: 'card' },
      h('h2', { style: 'margin-top:0', text: 'Tentang dan keterbatasan' }),
      h('ul', {}, LIMITS.map((s) => h('li', { text: s }))),
      h('p', { class: 'hint', text: `Versi aplikasi ${APP_VERSION}` })),
    disclaimer());
  return { el };
}
