# Formulir Batch MSK — Gelombang 2 (konteks ekonomi 2023-2026)

Disusun 2026-10-22 untuk Prompt B v4.2. Posisi bank saat disusun: pack MSK 1.4.1
(MSK-MCQ-001 s.d. 030, MSK-ESA-001 s.d. 015, MSK-KAS-001 s.d. 005).

## Cara pakai
1. Buka satu percakapan baru di Project Claude (penyusun). Pastikan pengetahuan
   Project memuat `msk_taksonomi.md` dan `CONTRACT.md`.
2. Tempel **satu formulir per pesan**, berurutan dari B12 sampai B24. Di bawah setiap
   formulir, tempel blok **CATATAN UMUM MSK** dan **KONTEKS EKONOMI MSK**.
3. Bila Project melaporkan Batch ID atau rentang ID sudah terpakai, naikkan nomornya.

**Penting tentang ID:**
- Batch ID MSK-B07 dan rentang MSK-MCQ-061 s.d. 070 pernah dipakai batch lama
  (taksonomi T01-T16) yang dibuang. Karena itu batch PG keempat memakai
  **MSK-MCQ-071 s.d. 080** dan rentang 061-070 dilewati.
- MSK-B05 tidak dipakai karena riwayatnya tidak jelas.

## Ringkasan (66 soal, 13 batch)

| Batch | Tipe | Jumlah | ID | Kesulitan |
|---|---|---|---|---|
| MSK-B12 | PG | 10 | MSK-MCQ-031 s.d. 040 | 1 / 4 / 4 / 1 |
| MSK-B13 | PG | 10 | MSK-MCQ-041 s.d. 050 | 1 / 4 / 4 / 1 |
| MSK-B14 | PG | 10 | MSK-MCQ-051 s.d. 060 | 1 / 4 / 4 / 1 |
| MSK-B15 | PG | 10 | MSK-MCQ-071 s.d. 080 | 1 / 4 / 4 / 1 |
| MSK-B16 | Esai | 5 | MSK-ESA-016 s.d. 020 | sedang 2, sulit 2, sangat sulit 1 |
| MSK-B17 | Esai | 5 | MSK-ESA-021 s.d. 025 | sedang 2, sulit 2, sangat sulit 1 |
| MSK-B18 | Esai | 5 | MSK-ESA-026 s.d. 030 | sedang 1, sulit 2, sangat sulit 2 |
| MSK-B19 | Kasus mini | 2 | MSK-KAS-006, 007 | sedang 2 |
| MSK-B20 | Kasus mini | 2 | MSK-KAS-008, 009 | sedang 1, sulit 1 |
| MSK-B21 | Kasus mini | 1 | MSK-KAS-010 | sulit 1 |
| MSK-B22 | Kasus komprehensif | 2 | MSK-KAS-011, 012 | sedang 2 |
| MSK-B23 | Kasus komprehensif | 2 | MSK-KAS-013, 014 | sulit 2 |
| MSK-B24 | Kasus komprehensif | 2 | MSK-KAS-015, 016 | sangat sulit 2 |

Kesulitan PG ditulis mudah / sedang / sulit / sangat sulit.

Setelah gelombang ini, bank MSK berisi 70 PG dengan minimal 5 PG per topik, 30 esai,
8 kasus mini, dan 8 kasus komprehensif. Target bank v1.0 (≥ 60 PG, ≥ 15 esai,
≥ 4 kasus mini, ≥ 6 kasus komprehensif) tercapai.

---

## CATATAN UMUM MSK (tempel di bawah setiap formulir)
```
Catatan umum:
- Ikuti docs/msk_taksonomi.md (taksonomi 12 topik T01-T12 dan kompetensi K01-K06; bukan taksonomi lama T01-T16).
- Soal penerapan pada perusahaan Indonesia fiktif, bukan hafalan definisi.
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi.
- Hindari skenario yang mirip soal MSK yang sudah ada (MSK-MCQ-001 s.d. 030, MSK-ESA-001 s.d. 015, MSK-KAS-001 s.d. 005) dan batch sebelumnya di percakapan ini.
```

## KONTEKS EKONOMI MSK (tempel di bawah CATATAN UMUM MSK)
```
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global 2023-2026 yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji penerapan konsep, bukan hafalan berita.
- Angka pasar (suku bunga, kurs, inflasi, harga komoditas, pangsa pasar) adalah angka asumsi dan ditulis "diasumsikan", kecuali angka itu fakta terverifikasi menurut aturan (a).
- Kebijakan yang berubah dari waktu ke waktu (tarif perdagangan, aturan pajak) wajib dikaitkan dengan periode kasus. Jangan menganggap tarif atau ketentuan 2025 masih berlaku saat ini. Bila soal menghitung dampak tarif, sebutkan tarif, tanggal berlaku, jenis produk, dan asumsi perhitungannya.
- Perusahaan dan tokoh dalam soal tetap fiktif. Lembaga dan kebijakan publik nyata boleh disebut menurut aturan (a).
- Kunci jawaban tidak boleh bergantung pada fakta ekonomi di luar soal. Semua informasi yang dibutuhkan ada di stem atau caseData.
Tema:
1. Suku bunga tinggi 2023-2024 lalu turun bertahap: biaya modal, waktu ekspansi, pendanaan strategi.
2. Pelemahan dan volatilitas rupiah: ketergantungan bahan baku impor, peluang ekspor, lindung nilai operasional.
3. Tarif resiprokal Amerika Serikat (diumumkan 2 April 2025; tarif untuk Indonesia berubah selama negosiasi, jadi soal wajib menyebut tarif yang diasumsikan dan periodenya), relokasi rantai pasok global, dan diversifikasi pasar ekspor melalui perjanjian dagang: strategi internasional (T06), lingkungan eksternal (T02).
4. Hilirisasi mineral dan industri baterai/kendaraan listrik: integrasi vertikal, aliansi dan usaha patungan dengan mitra asing (T06, T07).
5. Restrukturisasi BUMN di bawah BPI Danantara (diluncurkan 24 Februari 2025); grup dan anak usaha dalam soal tetap fiktif: strategi korporat dan portofolio (T07), struktur dan tata kelola (T09, K04).
6. Program pemerintah berskala besar (mis. program makan bergizi) yang membuka peluang dan risiko bagi rantai pasok UMKM pangan: T02, T05.
7. Melemahnya daya beli kelas menengah: strategi generik, value positioning, dan penyesuaian bauran produk (T04).
8. PHK di industri padat karya dan otomasi: SDM dan operasi (T09), perubahan organisasi (T11), etika (T08).
9. Ekonomi digital, AI generatif, serta konsolidasi e-commerce dan social commerce: strategi informasi dan analisis data (T12), keunggulan bersaing (T03, T04).
10. Transisi energi dan tuntutan ESG dari investor, pembeli global, dan regulator: CSR dan keberlanjutan (T08), visi-misi (T01).
11. Kasus tata kelola dan gagal bayar di lembaga keuangan nonbank, koperasi, dan pinjaman daring: etika (T08), manajemen risiko dan tata kelola (K04).
12. Gangguan logistik dan ketegangan geopolitik: risiko rantai pasok, ketahanan operasi (T06, T09).
```

---

## 1. PG — MSK-B12
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B12
Tipe: mcq | Jumlah: 10 | ID mulai: MSK-MCQ-031
Sebaran topik: T02 2, T03 2, T04 2, T05 2, T06 2
Sebaran kesulitan: mudah 1, sedang 4, sulit 4, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C3-C6
Catatan khusus:
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- T02: dampak tarif impor dan rupiah melemah pada lima kekuatan industri (tema 2, 3).
- T04: strategi generik saat daya beli kelas menengah melemah (tema 7).
- T06: pilihan strategi masuk pasar ekspor baru (tema 3).
```

## 2. PG — MSK-B13
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B13
Tipe: mcq | Jumlah: 10 | ID mulai: MSK-MCQ-041
Sebaran topik: T07 2, T08 2, T09 2, T10 2, T12 2
Sebaran kesulitan: mudah 1, sedang 4, sulit 4, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C3-C6
Catatan khusus:
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- T07: integrasi vertikal dalam hilirisasi (tema 4) atau portofolio holding BUMN (tema 5).
- T08: tuntutan ESG pembeli global (tema 10) atau dilema etika di pinjaman daring (tema 11).
- T12: pemanfaatan AI generatif dan analisis data (tema 9).
```

## 3. PG — MSK-B14
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B14
Tipe: mcq | Jumlah: 10 | ID mulai: MSK-MCQ-051
Sebaran topik: T02 1, T03 1, T04 1, T05 1, T06 1, T07 1, T08 1, T09 1, T10 1, T11 1
Sebaran kesulitan: mudah 1, sedang 4, sulit 4, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C3-C6
Catatan khusus:
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- Setiap soal memakai tema ekonomi yang berbeda.
- T05: strategi fungsional UMKM pemasok program pangan pemerintah (tema 6).
- T11: perubahan organisasi saat otomasi dan PHK (tema 8).
```

## 4. PG — MSK-B15
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B15
Tipe: mcq | Jumlah: 10 | ID mulai: MSK-MCQ-071
Sebaran topik: T01 1, T04 1, T05 1, T06 1, T07 1, T08 1, T09 1, T10 1, T11 1, T12 1
Sebaran kesulitan: mudah 1, sedang 4, sulit 4, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C3-C6
Catatan khusus:
- ID mulai 071 disengaja: rentang MSK-MCQ-061 s.d. 070 pernah dipakai batch lama yang dibuang, jadi jangan dipakai.
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- Setiap soal memakai tema ekonomi yang berbeda.
- T01: penyesuaian visi dan tujuan stratejik setelah perubahan lingkungan besar (tema 3 atau 10).
- T09: balanced scorecard atau manajemen risiko rantai pasok (tema 12) dengan K04.
```

## 5. Esai — MSK-B16
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B16
Tipe: essay | Jumlah: 5 | ID mulai: MSK-ESA-016
Sebaran topik: T01 1, T02 1, T03 1, T05 1, T06 1
Sebaran kesulitan: sedang 2, sulit 2, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C4-C6
Catatan khusus:
- Setiap esai menuntut analisis situasi, evaluasi minimal dua alternatif, dan rekomendasi yang beralasan.
- T01: merumuskan ulang visi-misi perusahaan batu bara menghadapi transisi energi (tema 10).
- T02: analisis PESTEL industri tekstil setelah tarif impor dan rupiah melemah (tema 2, 3).
- T03: kapabilitas apa yang masih menjadi keunggulan ritel modern saat social commerce tumbuh (tema 9).
- T05: rencana bisnis dan strategi fungsional UMKM pangan yang ingin menjadi pemasok program pemerintah (tema 6).
- T06: memilih pasar ekspor pengganti dan strategi masuknya (tema 3).
- 3-6 kriteria rubrik berjumlah 10; acceptableAlternatives wajib.
```

## 6. Esai — MSK-B17
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B17
Tipe: essay | Jumlah: 5 | ID mulai: MSK-ESA-021
Sebaran topik: T04 1, T08 1, T10 1, T11 1, T12 1
Sebaran kesulitan: sedang 2, sulit 2, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C4-C6
Catatan khusus:
- T04: merek konsumen menengah memilih antara strategi biaya rendah dan diferensiasi saat daya beli melemah (tema 7).
- T08: menimbang tuntutan pemegang saham jangka pendek dengan komitmen keberlanjutan (tema 10).
- T10: gaya kepemimpinan untuk memulihkan kepercayaan setelah skandal tata kelola (tema 11).
- T11: mengelola perubahan dan resistensi saat otomasi pabrik (tema 8).
- T12: strategi data dan AI bagi bank daerah atau perusahaan asuransi menengah (tema 9).
- 3-6 kriteria rubrik berjumlah 10; acceptableAlternatives wajib.
```

## 7. Esai — MSK-B18
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B18
Tipe: essay | Jumlah: 5 | ID mulai: MSK-ESA-026
Sebaran topik: T03 1, T06 1, T07 1, T09 1, T12 1
Sebaran kesulitan: sedang 1, sulit 2, sangat_sulit 2
Ukuran kasus: -
Level kognitif: C4-C6
Catatan khusus:
- T03: analisis rantai nilai produsen komponen kendaraan listrik (tema 4).
- T06: usaha patungan dengan mitra asing dalam hilirisasi, meliputi risiko, kendali, dan transfer teknologi (tema 4).
- T07: holding BUMN menilai unit bisnis mana yang dipertahankan, digabung, atau dilepas (tema 5).
- T09: merancang struktur dan sistem pengendalian untuk ketahanan rantai pasok (tema 12).
- T12: platform digital memonetisasi data pelanggan secara etis dan sesuai aturan perlindungan data (tema 9).
- 3-6 kriteria rubrik berjumlah 10; acceptableAlternatives wajib.
```

## 8. Kasus mini — MSK-B19
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B19
Tipe: case | Jumlah: 2 | ID mulai: MSK-KAS-006
Sebaran topik: MSK-KAS-006 T02, T06; MSK-KAS-007 T05, T12
Sebaran kesulitan: sedang 2
Ukuran kasus: mini
Level kognitif: C3-C5
Catatan khusus:
- MSK-KAS-006: eksportir furnitur kehilangan sebagian pasar Amerika Serikat karena tarif (tema 3). Analisis lingkungan dan pilihan pasar alternatif.
- MSK-KAS-007: jaringan toko roti UMKM ingin tumbuh lewat kanal digital (tema 9). Strategi fungsional dan pemanfaatan data penjualan.
- Data pendukung di caseData (penjualan, margin, pangsa pasar); angka konsisten. Total skor tiap kasus 20; rujukan kriteria di acceptableAlternatives menyebut bagiannya, mis. "(b) C2".
```

## 9. Kasus mini — MSK-B20
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B20
Tipe: case | Jumlah: 2 | ID mulai: MSK-KAS-008
Sebaran topik: MSK-KAS-008 T08, T01; MSK-KAS-009 T09, T03
Sebaran kesulitan: sedang 1, sulit 1
Ukuran kasus: mini
Level kognitif: C3-C5
Catatan khusus:
- MSK-KAS-008 (sedang): perkebunan sawit diminta pembeli Eropa membuktikan rantai pasok bebas deforestasi (tema 10). CSR, keberlanjutan, dan penyesuaian tujuan stratejik.
- MSK-KAS-009 (sulit): produsen garmen menekan biaya saat pesanan ekspor turun (tema 3, 8). Efisiensi operasi internal tanpa merusak kapabilitas inti.
- Total skor tiap kasus 20.
```

## 10. Kasus mini — MSK-B21
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B21
Tipe: case | Jumlah: 1 | ID mulai: MSK-KAS-010
Sebaran topik: MSK-KAS-010 T10, T11
Sebaran kesulitan: sulit 1
Ukuran kasus: mini
Level kognitif: C4-C5
Catatan khusus:
- Koperasi simpan pinjam fiktif yang sempat gagal bayar menunjuk pengurus baru (tema 11). Diagnosis budaya, kepemimpinan stratejik untuk pemulihan kepercayaan, dan tahapan perubahan.
- Total skor 20.
```

## 11. Kasus komprehensif sedang — MSK-B22
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B22
Tipe: case | Jumlah: 2 | ID mulai: MSK-KAS-011
Sebaran topik: MSK-KAS-011 T02, T04, T05; MSK-KAS-012 T03, T09, T12
Sebaran kesulitan: sedang 2
Ukuran kasus: komprehensif
Level kognitif: C3-C5
Catatan khusus:
- Tingkat sedang: data jelas, analisis memakai alat baku (PESTEL, lima kekuatan, VRIO, strategi generik), dan rekomendasi lugas.
- MSK-KAS-011: jaringan minimarket regional menghadapi daya beli melemah dan pesaing e-commerce (tema 7, 9).
- MSK-KAS-012: produsen suku cadang menengah mempertimbangkan otomasi dan sistem data produksi (tema 8, 9).
- Setiap kasus menuntut analisis, evaluasi alternatif, risiko, implikasi keuangan, dan rekomendasi.
- caseData memuat data keuangan dan operasional; jumlah sel tiap baris = jumlah kolom; semua total, rasio, dan persentase konsisten. Total skor tiap kasus 20.
```

## 12. Kasus komprehensif sulit — MSK-B23
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B23
Tipe: case | Jumlah: 2 | ID mulai: MSK-KAS-013
Sebaran topik: MSK-KAS-013 T06, T07, T02; MSK-KAS-014 T01, T08, T11
Sebaran kesulitan: sulit 2
Ukuran kasus: komprehensif
Level kognitif: C4-C6
Catatan khusus:
- MSK-KAS-013: grup tambang nasional menimbang usaha patungan smelter dengan mitra asing vs membangun sendiri, dengan rupiah melemah dan suku bunga tinggi (tema 1, 2, 4).
- MSK-KAS-014: perusahaan energi berbasis fosil merumuskan strategi transisi energi dan mengelola perubahan organisasi besar (tema 10, 8).
- Data proyeksi investasi dan kinerja di caseData, konsisten. Total skor tiap kasus 20; rujukan kriteria menyebut bagiannya.
```

## 13. Kasus komprehensif sangat sulit — MSK-B24
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B24
Tipe: case | Jumlah: 2 | ID mulai: MSK-KAS-015
Sebaran topik: MSK-KAS-015 T07, T09, T10, T11; MSK-KAS-016 T04, T06, T12, T08, T03
Sebaran kesulitan: sangat_sulit 2
Ukuran kasus: komprehensif
Level kognitif: C5-C6
Catatan khusus:
- Tingkat sangat sulit: beberapa isu saling bertentangan, informasi tidak lengkap sehingga perlu asumsi yang dinyatakan, dan tuntutan rekomendasi terintegrasi dengan urutan implementasi.
- MSK-KAS-015: holding BUMN fiktif di bawah badan pengelola investasi negara merestrukturisasi portofolio anak usaha, menyatukan budaya, dan memperbaiki tata kelola (tema 5, 11).
- MSK-KAS-016: perusahaan consumer goods nasional terjepit tarif ekspor, rupiah melemah, daya beli domestik melemah, dan pesaing digital, sambil menghadapi tuntutan ESG (tema 2, 3, 7, 9, 10).
- caseData memuat data keuangan beberapa tahun dan data pasar; semua angka konsisten. Total skor tiap kasus 20; rujukan kriteria menyebut bagiannya.
```
