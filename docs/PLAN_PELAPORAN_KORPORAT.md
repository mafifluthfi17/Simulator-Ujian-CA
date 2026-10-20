# Rencana Mata Ujian Pelaporan Korporat (PK)

Dokumen kerja untuk menyiapkan mata ujian **Pelaporan Korporat** di simulator.
Mesinnya sudah generik, jadi pekerjaan utamanya ada pada **isi** (taksonomi,
blueprint, dan bank soal), bukan kode. Alur teknisnya mengikuti
`docs/panduan_menambah_mata_ujian.md`.

## Posisi saat ini (2026-10-20)

| Item | Status |
|---|---|
| Menu "Pelaporan Korporat" di pemilih mata ujian beranda | **Selesai** (`packs/pk/`) |
| Paket Training 1, Training 2, Simulasi, dan Kustom tampil | **Selesai**. Belum bisa dimulai karena bank soal masih kosong |
| Taksonomi | **14 topik = 14 bab modul IAI** (cetakan 8, Okt 2025); 5 kompetensi masih sementara. Menunggu persetujuan (`docs/pk_taksonomi.md`, D-80) |
| Materi | Modul (foto bab 1-10, bab 5/7/8 belum lengkap; bab 11-14 belum ada), slide PSAK, dan 2 contoh ujian (2015, 2016-2017) di `Materi Pelaporan Korposat/` (tidak di-commit) |
| Blueprint paket | **Sementara**: disamakan dengan MSK |
| Bank soal | Kosong (0 soal) |
| Penyimpanan, riwayat, dan bank soal | Sudah terpisah otomatis per mata ujian (`caSim:pk:...`) |

---

## A. Yang perlu disiapkan pemilik

1. **Sumber materi resmi**
   - ✅ Modul PK CA IAI (daftar isi dan sebagian bab), slide PSAK, dan contoh ujian.
   - ⬜ Foto bab 11-14 dan sisa bab 5, 7, 8. Ini berguna sebagai rujukan penyusun soal.
   - ⬜ RPS/silabus PK yang memuat CPMK, bila ada, untuk kompetensi K01-K05.
   - ⬜ Format ujian PK yang berlaku sekarang. Contoh ujian 2015-2017 memuat 80-90 PG,
     8-9 esai (banyak hitungan), dan 3 studi kasus (mis. kertas kerja konsolidasi).
     Format ujian CA saat ini belum diketahui; blueprint MSK (SPEC 6) dipakai sementara.
2. **Keputusan isi**
   - Persetujuan atau revisi taksonomi (topik T01-T14, kompetensi K01-K05).
   - Penomoran PSAK di soal. Usulan: nomor baru dengan nomor lama dalam kurung, mis. "PSAK 228 (15)".
   - Topik syariah dan sektor publik dari contoh ujian lama. Usulan: tidak dimasukkan karena tidak ada di modul 2025.
   - Blueprint paket PK, termasuk apakah tipe **numerik** dipakai (lihat B-3).
   - Target ukuran bank soal v1.0 (usulan di bagian C).
3. **Perangkat di luar repositori**
   - Project Claude untuk penyusun (Prompt B, `schema/CONTRACT.md`, `docs/pk_taksonomi.md`).
   - Project ChatGPT untuk reviewer (Prompt C, `CONTRACT.md`, `docs/pk_taksonomi.md`).
   - Penelaah manusia (pemilik atau rekan ahli akuntansi) untuk persetujuan akhir.

## B. Langkah demi langkah

### Tahap 1 — Kerangka mata ujian (sebagian sudah selesai)
1. ✅ Buat `packs/pk/pack.json` (subjectId `pk`) tanpa soal; build pack, service worker, dan versi offline.
2. ✅ Taksonomi diselaraskan dengan 14 bab modul (2026-10-20).
   ⬜ Pemilik memeriksa dan menyetujui `docs/pk_taksonomi.md`, termasuk tabel nomor PSAK.
3. ⬜ Pemilik menetapkan blueprint. Pilihan:
   - **(a)** sama dengan MSK (kondisi saat ini): PG/esai/kasus 20/40/40 dan SIM 17/50/33;
   - **(b)** dengan bagian **numerik**, misalnya T1: 6 PG + 4 numerik (20), 4 esai (40), 2 kasus mini (40).
     PK banyak memuat perhitungan dan tipe numerik dinilai otomatis;
   - **(c)** mengikuti format resmi ujian PK bila berbeda.
4. ⬜ Claude Code memperbarui `pack.json`, tes kerangka, `DECISIONS.md` (D-80 menjadi DISETUJUI), lalu build dan commit.

### Tahap 2 — Penyesuaian prompt (opsional, kecil)
5. ⬜ Periksa Prompt B dan C. Keduanya generik untuk semua mata ujian, tetapi
   formulir batch perlu diisi dengan prefiks `PK-` dan taksonomi PK. Bila perlu
   aturan khusus PK (mis. menyebut nomor PSAK, format tabel jurnal di `caseData`,
   pembulatan Rupiah pada numerik), itu termasuk isi prompt dan **harus
   disetujui pemilik** (CLAUDE.md: isi prompts/*.md tidak diubah tanpa izin).
6. ⬜ Unggah `docs/pk_taksonomi.md` ke kedua Project AI.

### Tahap 3 — Produksi bank soal (di luar Claude Code)
7. ⬜ Pasang pack PK di aplikasi (sudah otomatis setelah deploy), lalu buka **⋯ › Pengelola Bank Soal**.
8. ⬜ Buat **1 batch soal kalibrasi** PK, yaitu soal bercacat sengaja, berstatus CALIBRATION.
9. ⬜ Siklus per batch (maks 10 PG/numerik, 5 esai, atau 2 kasus):
   penyusun (Prompt B) → Impor Batch → paket review + kalibrasi → reviewer
   (Prompt C) → impor hasil → revisi (**Salin untuk penyusun**) → **Setujui** dengan inisial.
10. ⬜ Urutan batch yang disarankan: PG per topik dulu (cakupan 12 topik), lalu
    numerik, esai, kasus mini, dan terakhir kasus komprehensif (konsolidasi, pajak tangguhan, instrumen keuangan).
11. ⬜ Pantau tab **Statistik**: sebaran topik dan posisi kunci PG ≤ 35% per huruf.

### Tahap 4 — Publikasi
12. ⬜ **Publikasikan** soal Disetujui menjadi LIVE (versi pack naik 1.0.0 → 1.1.0).
13. ⬜ **Ekspor Pack**, simpan ke `packs/pk/pack.json`, lalu minta Claude Code
    menjalankan validasi, build, dan tes, kemudian commit dan push.
14. ⬜ Uji coba: kerjakan T1, T2, dan SIM PK sekali masing-masing, coba
    penilaian AI esai/kasus (Prompt penilai), dan periksa laporan.

### Tahap 5 — Pemeliharaan
15. ⬜ Tinjau soal saat SAK berubah (soal lama → RETIRED, ganti dengan revisi).
16. ⬜ Kumpulkan masukan peserta; soal bermasalah diperbaiki lewat siklus revisi.

## C. Usulan target bank soal PK v1.0 (perlu persetujuan)

Mengikuti SPEC 7 untuk MSK, ditambah numerik bila blueprint (b) dipilih:

| Tipe | Minimal | Catatan |
|---|---|---|
| PG | 60 | ≥ 20 sulit/sangat sulit; setiap topik ≥ 4 |
| Numerik | 20 (bila dipakai) | setidaknya di T02-T11 yang bersifat hitungan |
| Esai | 15 | ≥ 8 sulit/sangat sulit |
| Kasus | 10 | ≥ 4 mini, ≥ 6 komprehensif |

Kebutuhan minimum agar satu paket dapat dimulai: T1 = 10 PG + 4 esai + 2 kasus
mini LIVE yang memenuhi aturan kesulitan dan cakupan (≥ 6 topik). SIM butuh
17 PG + 5 esai + 2 kasus komprehensif dengan ≥ 70% skor sulit/sangat sulit dan ≥ 9 topik.

## D. Risiko dan catatan

- **Taksonomi belum disetujui.** Mengubah kode topik setelah soal diimpor berarti
  merevisi semua soal, jadi Tahap 1 langkah 2 harus selesai sebelum batch pertama.
- **Perubahan SAK.** Penomoran PSAK baru dan standar yang belum efektif dapat
  membuat kunci jawaban salah. Cantumkan tanggal efektif yang berlaku di formulir batch.
- **Soal hitungan panjang.** Untuk kasus komprehensif (mis. kertas kerja
  konsolidasi), pastikan tabel `caseData` konsisten (jumlah sel = jumlah kolom,
  total benar). Reviewer memeriksa dimensi `dataConsistency`.
- Menu PK sudah tampil untuk peserta. Selama bank kosong, paket menampilkan
  pesan kekurangan soal. Bila ingin disembunyikan sampai siap, pemilik perlu
  memutuskan; saat ini tidak ada fitur sembunyikan pack.
