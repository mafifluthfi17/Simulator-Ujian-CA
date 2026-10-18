# Panduan pengelola — melayani permintaan penilaian (Cara 2)

Peserta yang memilih **Minta dinilai pengelola** mengirim email berisi lampiran
`prompt-penilaian-<kode sesi>.txt`. Berkas itu sudah memuat prompt penilai
(`prompts/prompt_penilai_ai.md`) dan paket penilaian JSON. Keputusan: D-81.

## 1. Mengaktifkan Cara 2 (sekali)

1. Buka `js/core/grader-contact.js`, isi `email` dengan alamat khusus penilaian
   (alamat ini tampil di aplikasi publik). Ubah `responseTime` bila perlu.
2. Bangun ulang berkas turunan (D-71): `node tools/build-sw.mjs` dan
   `node tools/build-offline.mjs`, lalu jalankan self-test.
3. Commit dan push. Selama `email` kosong, Cara 2 tidak tampil.

## 2. Menyiapkan Project Claude (sekali)

1. Di claude.ai buat Project, mis. "Penilai Ujian CA".
2. **Add content → GitHub**: pilih repo ini, lalu `prompts/prompt_penilai_ai.md`
   dan `schema/grading-result.schema.json`. Setelah prompt diubah dan di-push,
   tekan sync di Project.
3. Instruksi Project: "Nilai paket penilaian yang dilampirkan sesuai
   prompt_penilai_ai.md. Keluarkan satu objek JSON saja."

## 3. Menilai satu permintaan

1. Unggah lampiran `.txt` dari email peserta ke percakapan **baru** di Project.
2. Bila jawaban terpotong, minta "lanjutkan". Simpan JSON hasil sebagai berkas
   `hasil-penilaian-<kode sesi>.json` (salin dari `{` pertama sampai `}` terakhir).
3. Hasil tidak dapat diperiksa di aplikasi Anda karena sesinya hanya ada di
   perangkat peserta. Cukup pastikan `sessionId` di JSON sama dengan kode sesi
   di subjek email.
4. Balas email peserta dengan berkas itu terlampir. Peserta mengambilnya lewat
   **Ambil dari berkas**; aplikasi memeriksa checksum, skema, dan batas skor.

## Catatan

- Jawaban dan alamat email peserta adalah data pribadi. Simpan seperlunya dan
  hapus email setelah penilaian selesai.
- Berkas hasil berupa teks biasa; peserta dapat mengubah skor sebelum impor.
  Cukup untuk latihan mandiri, tidak untuk bukti kelulusan.
