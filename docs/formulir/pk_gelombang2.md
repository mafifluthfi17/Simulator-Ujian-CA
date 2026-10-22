# Formulir Batch PK — Gelombang 2 (konteks ekonomi 2023-2026)

Disusun 2026-10-22 untuk Prompt B v4.2. Posisi bank saat disusun: pack PK 1.6.0
(PK-MCQ-001 s.d. 035, PK-ESA-001 s.d. 005, PK-KAS-001 s.d. 005).

## Cara pakai
1. Buka satu percakapan baru di Project Claude (penyusun). Pastikan pengetahuan
   Project memuat versi terbaru `pk_taksonomi.md`, `pk_rujukan_penyusun.md`, dan
   `CONTRACT.md`.
2. Tempel **satu formulir per pesan**, berurutan dari B09 sampai B21. Di bawah setiap
   formulir, tempel blok **CATATAN UMUM PK** dan **KONTEKS EKONOMI PK**.
3. Impor setiap hasil ke Pengelola Bank Soal, lalu review dengan Prompt C, sebelum
   lanjut ke batch berikutnya, atau kumpulkan beberapa batch dulu.
4. Bila Project melaporkan Batch ID atau rentang ID sudah terpakai, naikkan nomornya.

## Ringkasan (66 soal, 13 batch)

| Batch | Tipe | Jumlah | ID | Kesulitan |
|---|---|---|---|---|
| PK-B09 | PG | 10 | PK-MCQ-036 s.d. 045 | 1 / 4 / 4 / 1 |
| PK-B10 | PG | 10 | PK-MCQ-046 s.d. 055 | 1 / 4 / 4 / 1 |
| PK-B11 | PG | 10 | PK-MCQ-056 s.d. 065 | 1 / 4 / 4 / 1 |
| PK-B12 | PG | 10 | PK-MCQ-066 s.d. 075 | 1 / 4 / 4 / 1 |
| PK-B13 | Esai | 5 | PK-ESA-006 s.d. 010 | sedang 2, sulit 2, sangat sulit 1 |
| PK-B14 | Esai | 5 | PK-ESA-011 s.d. 015 | sedang 2, sulit 2, sangat sulit 1 |
| PK-B15 | Esai | 5 | PK-ESA-016 s.d. 020 | sedang 1, sulit 2, sangat sulit 2 |
| PK-B16 | Kasus mini | 2 | PK-KAS-006, 007 | sedang 2 |
| PK-B17 | Kasus mini | 2 | PK-KAS-008, 009 | sedang 1, sulit 1 |
| PK-B18 | Kasus mini | 1 | PK-KAS-010 | sulit 1 |
| PK-B19 | Kasus komprehensif | 2 | PK-KAS-011, 012 | sedang 2 |
| PK-B20 | Kasus komprehensif | 2 | PK-KAS-013, 014 | sulit 2 |
| PK-B21 | Kasus komprehensif | 2 | PK-KAS-015, 016 | sangat sulit 2 |

Kesulitan PG ditulis mudah / sedang / sulit / sangat sulit.

Setelah gelombang ini, bank PK berisi 75 PG dengan minimal 4 PG per topik, 20 esai,
10 kasus mini, dan 8 kasus komprehensif.

---

## CATATAN UMUM PK (tempel di bawah setiap formulir)
```
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; jangan memakai standar atau amendemen yang belum efektif.
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md.
- Tulis PSAK dengan nomor baru dan nomor lama, mis. "PSAK 116 (73)". Untuk ISAK, cukup nomor baru bila ragu.
- Nilai uang dalam Rupiah; sebut satuan (ribu/juta/miliar) dan aturan pembulatan di stem.
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi. Tanpa kategori lama PSAK 55.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian.
- Hindari skenario yang mirip soal PK yang sudah ada (PK-MCQ-001 s.d. 035, PK-ESA-001 s.d. 005, PK-KAS-001 s.d. 005) dan batch sebelumnya di percakapan ini.
```

## KONTEKS EKONOMI PK (tempel di bawah CATATAN UMUM PK)
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
- Kunci jawaban tidak boleh bergantung pada fakta ekonomi di luar soal. Semua data yang dibutuhkan ada di stem atau caseData.
- Jangan menjadikan ketentuan yang belum efektif per 1 Januari 2026 sebagai dasar kunci jawaban. Contoh: PSPK 1 dan PSPK 2 (standar pengungkapan keberlanjutan berbasis IFRS S1/S2) disahkan DSK IAI 1 Juli 2025 dan baru efektif 1 Januari 2027. Penerapan dini diperbolehkan, jadi jangan membuat kunci yang menganggap entitas dilarang menerapkannya.
Tema:
1. Suku bunga tinggi 2023-2024 lalu turun bertahap: tingkat diskonto PSAK 219 (24) dan PSAK 237 (57), suku bunga pinjaman inkremental PSAK 116 (73), biaya pinjaman PSAK 223 (26), nilai wajar PSAK 113 (68), kerugian kredit ekspektasian PSAK 109 (71).
2. Pelemahan dan volatilitas rupiah: transaksi valuta asing dan penjabaran entitas luar negeri PSAK 221 (10), utang valas, lindung nilai.
3. Tarif resiprokal Amerika Serikat (diumumkan 2 April 2025; tarif untuk Indonesia berubah selama negosiasi, jadi soal wajib menyebut tarif yang diasumsikan dan periodenya) dan ketegangan dagang: indikasi penurunan nilai PSAK 236 (48), nilai realisasi neto PSAK 202 (14), kelangsungan usaha, peristiwa setelah periode pelaporan PSAK 210 (8).
4. Tekanan industri padat karya (tekstil, alas kaki) dan PHK: pesangon dan provisi restrukturisasi PSAK 237 (57), imbalan kerja PSAK 219 (24), aset dikuasai untuk dijual dan operasi dihentikan PSAK 105 (58).
5. Hilirisasi mineral dan ekosistem baterai/kendaraan listrik: aset eksplorasi PSAK 106 (64), aset tetap PSAK 216 (16), biaya pinjaman, pengaturan bersama PSAK 111 (66), entitas asosiasi PSAK 228 (15), kewajiban restorasi ISAK 101.
6. Normalisasi harga komoditas (batu bara, CPO) setelah lonjakan 2022: penurunan nilai aset, agrikultur PSAK 241 (69).
7. Restrukturisasi dan konsolidasi grup BUMN/holding di bawah BPI Danantara (diluncurkan 24 Februari 2025); grup dan anak usaha dalam soal tetap fiktif: kombinasi bisnis entitas sepengendali PSAK 338 (38), pengendalian PSAK 110 (65), laporan keuangan tersendiri PSAK 227 (4).
8. Ekonomi digital dan e-commerce: prinsipal vs agen, program loyalitas, imbalan variabel PSAK 115 (72); aset takberwujud PSAK 238 (19) dan biaya situs web ISAK 232.
9. Reformasi pajak internasional (pajak minimum global/Pilar Dua, diterapkan di Indonesia sejak 1 Januari 2025) dan ketidakpastian perlakuan pajak: PSAK 212 (46), ISAK 123. Amendemen PSAK 212 (46) tentang Ketentuan Model Pilar Dua sudah efektif (berlaku surut 1 Januari 2023) dan boleh menjadi dasar kunci: pengecualian wajib atas pengakuan dan pengungkapan aset dan liabilitas pajak tangguhan terkait pajak penghasilan Pilar Dua, serta pengungkapan terpisah beban pajak kini Pilar Dua. Jangan menguji perhitungan tarif efektif GloBE atau ketentuan PMK secara rinci. Pajak minimum global hanya berlaku bagi grup multinasional dengan pendapatan konsolidasian minimal EUR 750 juta, dan tarif efektif minimum 15% bukan tarif nominal PPh badan. Jangan menulis seolah semua perusahaan Indonesia terkena.
10. Melemahnya daya beli kelas menengah: penurunan penjualan, diskon dan retur, piutang bermasalah, persediaan usang.
11. Kasus salah saji laporan keuangan dan gagal bayar emiten serta lembaga keuangan nonbank: financial shenanigans dan red flags fraud (T13), etika dan tata kelola (T02).
12. Transisi energi dan tuntutan keberlanjutan dari investor dan regulator: pelaporan keberlanjutan dan terintegrasi (T14), provisi lingkungan.
```

---

## 1. PG — PK-B09
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B09
Tipe: mcq | Jumlah: 10 | ID mulai: PK-MCQ-036
Sebaran topik: T03 2, T05 2, T07 2, T01 1, T04 1, T12 1, T13 1
Sebaran kesulitan: mudah 1, sedang 4, sulit 4, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C3-C6
Catatan khusus:
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- T03: transaksi dan penjabaran valuta asing PSAK 221 (10) dengan rupiah melemah (tema 2), atau peristiwa setelah periode pelaporan karena tarif impor (tema 3).
- T05: indikasi dan pengujian penurunan nilai aset/UPK (tema 3 atau 6).
- T07: kerugian kredit ekspektasian saat suku bunga tinggi dan daya beli melemah (tema 1, 10).
```

## 2. PG — PK-B10
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B10
Tipe: mcq | Jumlah: 10 | ID mulai: PK-MCQ-046
Sebaran topik: T05 2, T07 2, T02 1, T03 1, T08 1, T09 1, T11 1, T14 1
Sebaran kesulitan: mudah 1, sedang 4, sulit 4, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C3-C6
Catatan khusus:
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- T05: kapitalisasi biaya pinjaman atau aset eksplorasi proyek hilirisasi (tema 1, 5).
- T07: klasifikasi aset keuangan atau pengukuran nilai wajar obligasi saat suku bunga berubah (tema 1).
- T08: provisi restrukturisasi karena PHK (tema 4).
- T11: ventura bersama vs operasi bersama pada proyek smelter (tema 5).
```

## 3. PG — PK-B11
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B11
Tipe: mcq | Jumlah: 10 | ID mulai: PK-MCQ-056
Sebaran topik: T04 2, T10 2, T03 1, T05 1, T06 1, T11 1, T12 1, T13 1
Sebaran kesulitan: mudah 1, sedang 4, sulit 4, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C3-C6
Catatan khusus:
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- T04: nilai realisasi neto persediaan ekspor setelah tarif impor (tema 3) atau aset dikuasai untuk dijual pada penutupan pabrik (tema 4).
- T10: kombinasi bisnis entitas sepengendali dalam restrukturisasi holding (tema 7) dan pengendalian.
- T06: remeasurement liabilitas sewa saat suku bunga atau masa sewa berubah (tema 1).
- T12: prinsipal vs agen di marketplace (tema 8).
```

## 4. PG — PK-B12
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B12
Tipe: mcq | Jumlah: 10 | ID mulai: PK-MCQ-066
Sebaran topik: T01 1, T02 1, T06 1, T07 1, T08 1, T09 1, T11 1, T12 1, T13 1, T14 1
Sebaran kesulitan: mudah 1, sedang 4, sulit 4, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C3-C6
Catatan khusus:
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- Setiap soal memakai tema ekonomi yang berbeda.
- T09: pengakuan aset pajak tangguhan saat prospek laba menurun (tema 3, 10), ketidakpastian perlakuan pajak ISAK 123, atau pengecualian pajak tangguhan Pilar Dua pada grup multinasional (tema 9).
- T13: red flags pengakuan pendapatan dini menjelang gagal bayar (tema 11).
```

## 5. Esai — PK-B13
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B13
Tipe: essay | Jumlah: 5 | ID mulai: PK-ESA-006
Sebaran topik: T04 1, T06 1, T08 1, T09 1, T11 1
Sebaran kesulitan: sedang 2, sulit 2, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C4-C6
Catatan khusus:
- Setiap esai meminta perlakuan akuntansi, dasar standar, jurnal bila relevan, dan dampak pada laporan keuangan.
- T04: penutupan lini produksi tekstil, dengan aset dikuasai untuk dijual dan operasi dihentikan (tema 4).
- T06: sale and leaseback atau modifikasi sewa saat perusahaan kesulitan likuiditas (tema 1).
- T08: imbalan pascakerja dan perubahan tingkat diskonto (tema 1).
- T09: pajak tangguhan atas rugi fiskal dan uji pemulihannya (tema 3 atau 10).
- T11: perubahan dari entitas asosiasi menjadi ventura bersama atau penurunan nilai investasi pada asosiasi tambang (tema 5, 6).
- 3-6 kriteria rubrik berjumlah 10; acceptableAlternatives wajib.
```

## 6. Esai — PK-B14
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B14
Tipe: essay | Jumlah: 5 | ID mulai: PK-ESA-011
Sebaran topik: T01 1, T02 1, T03 1, T13 1, T14 1
Sebaran kesulitan: sedang 2, sulit 2, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C4-C6
Catatan khusus:
- T01: penerapan kerangka konseptual (definisi aset/liabilitas, ketidakpastian pengukuran) pada transaksi baru ekonomi digital (tema 8).
- T02: dilema etis akuntan manajemen yang ditekan memenuhi covenant pinjaman (tema 1, 11).
- T03: perubahan estimasi vs koreksi kesalahan, atau pengungkapan kelangsungan usaha setelah tarif impor (tema 3).
- T13: analisis rasio dan arus kas untuk mendeteksi rekayasa laba sebelum gagal bayar (tema 11).
- T14: kebutuhan informasi investor tentang risiko transisi energi dan cara laporan terintegrasi menjawabnya (tema 12). Boleh membahas kesiapan menuju PSPK 1 dan 2 (efektif 1 Januari 2027, penerapan dini diperbolehkan), tetapi kunci tidak bergantung pada ketentuan rinci PSPK.
- 3-6 kriteria rubrik berjumlah 10; acceptableAlternatives wajib.
```

## 7. Esai — PK-B15
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B15
Tipe: essay | Jumlah: 5 | ID mulai: PK-ESA-016
Sebaran topik: T05 1, T07 1, T08 1, T10 1, T12 1
Sebaran kesulitan: sedang 1, sulit 2, sangat_sulit 2
Ukuran kasus: -
Level kognitif: C4-C6
Catatan khusus:
- T05: penurunan nilai UPK pertambangan batu bara saat harga turun (tema 6), termasuk alokasi ke aset.
- T07: restrukturisasi pinjaman debitur (modifikasi aset keuangan) dan tahap kerugian kredit (tema 1, 10).
- T08: provisi kontrak memberatkan karena tarif impor menaikkan biaya (tema 3).
- T10: pembentukan holding di bawah badan pengelola investasi negara, membandingkan PSAK 338 (38) dengan PSAK 103 (22) (tema 7).
- T12: program loyalitas dan imbalan variabel di platform e-commerce (tema 8).
- 3-6 kriteria rubrik berjumlah 10; acceptableAlternatives wajib.
```

## 8. Kasus mini — PK-B16
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B16
Tipe: case | Jumlah: 2 | ID mulai: PK-KAS-006
Sebaran topik: PK-KAS-006 T04; PK-KAS-007 T08
Sebaran kesulitan: sedang 2
Ukuran kasus: mini
Level kognitif: C3-C5
Catatan khusus:
- PK-KAS-006: eksportir alas kaki terkena tarif impor (tema 3). Perhitungan nilai realisasi neto beberapa kelompok persediaan, penurunan nilai, jurnal, dan pengungkapan.
- PK-KAS-007: program PHK dan pesangon pada pabrik tekstil (tema 4). Pembedaan pesangon dengan provisi restrukturisasi, pengukuran, dan jurnal.
- Data angka di caseData; total konsisten. Total skor tiap kasus 20; rujukan kriteria di acceptableAlternatives menyebut bagiannya, mis. "(b) C2".
```

## 9. Kasus mini — PK-B17
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B17
Tipe: case | Jumlah: 2 | ID mulai: PK-KAS-008
Sebaran topik: PK-KAS-008 T07; PK-KAS-009 T03
Sebaran kesulitan: sedang 1, sulit 1
Ukuran kasus: mini
Level kognitif: C3-C5
Catatan khusus:
- PK-KAS-008 (sedang): perusahaan pembiayaan menghitung kerugian kredit ekspektasian dengan matriks provisi saat daya beli melemah (tema 1, 10).
- PK-KAS-009 (sulit): importir bahan baku dengan utang USD dan rupiah melemah (tema 2). Selisih kurs saat transaksi, akhir tahun, dan pelunasan, serta pos moneter vs nonmoneter.
- Data angka di caseData; total skor tiap kasus 20.
```

## 10. Kasus mini — PK-B18
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B18
Tipe: case | Jumlah: 1 | ID mulai: PK-KAS-010
Sebaran topik: T13 1
Sebaran kesulitan: sulit 1
Ukuran kasus: mini
Level kognitif: C4-C5
Catatan khusus:
- Emiten ritel fiktif dengan laba naik tetapi arus kas operasi negatif menjelang gagal bayar obligasi (tema 10, 11). Analisis rasio tiga tahun, identifikasi teknik financial shenanigans, dan langkah investigasi.
- caseData memuat ikhtisar laporan keuangan tiga tahun; rasio harus dapat dihitung dari data. Total skor 20.
```

## 11. Kasus komprehensif sedang — PK-B19
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B19
Tipe: case | Jumlah: 2 | ID mulai: PK-KAS-011
Sebaran topik: PK-KAS-011 T04, T05, T12; PK-KAS-012 T06, T08, T09
Sebaran kesulitan: sedang 2
Ukuran kasus: komprehensif
Level kognitif: C3-C5
Catatan khusus:
- Tingkat sedang: perhitungan lugas, satu langkah pertimbangan per isu, data jelas.
- PK-KAS-011: produsen makanan kemasan menghadapi daya beli melemah (tema 10). Isu: persediaan usang, penurunan nilai mesin, diskon dan retur penjualan.
- PK-KAS-012: perusahaan logistik saat suku bunga tinggi (tema 1). Isu: sewa armada baru, imbalan pascakerja dengan tingkat diskonto berubah, dan pajak tangguhan atas sewa.
- caseData memuat neraca saldo atau ikhtisar angka; jumlah sel tiap baris = jumlah kolom; semua total konsisten. Total skor tiap kasus 20.
```

## 12. Kasus komprehensif sulit — PK-B20
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B20
Tipe: case | Jumlah: 2 | ID mulai: PK-KAS-013
Sebaran topik: PK-KAS-013 T10, T11, T03; PK-KAS-014 T07, T05, T13
Sebaran kesulitan: sulit 2
Ukuran kasus: komprehensif
Level kognitif: C4-C6
Catatan khusus:
- PK-KAS-013: grup nikel mengakuisisi entitas anak dan membentuk ventura bersama smelter dengan mitra asing; entitas anak memakai mata uang fungsional USD (tema 2, 5). Isu: goodwill dan KNP, metode ekuitas atas ventura bersama, penjabaran laporan entitas anak, dan selisih kurs di OCI.
- PK-KAS-014: perusahaan pembiayaan kendaraan dengan portofolio piutang memburuk (tema 1, 10, 11). Isu: kerugian kredit ekspektasian bertahap, penurunan nilai aset sitaan, dan red flags penundaan pencadangan oleh manajemen.
- caseData konsisten; total skor tiap kasus 20; rujukan kriteria menyebut bagiannya.
```

## 13. Kasus komprehensif sangat sulit — PK-B21
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B21
Tipe: case | Jumlah: 2 | ID mulai: PK-KAS-015
Sebaran topik: PK-KAS-015 T10, T09, T05, T07; PK-KAS-016 T12, T08, T13, T02, T14
Sebaran kesulitan: sangat_sulit 2
Ukuran kasus: komprehensif
Level kognitif: C5-C6
Catatan khusus:
- Tingkat sangat sulit: beberapa isu saling memengaruhi, menuntut pertimbangan profesional dan evaluasi alternatif, serta perhitungan bertingkat.
- PK-KAS-015: holding BUMN fiktif melakukan reorganisasi sepengendali, lalu mengakuisisi pihak ketiga pada tahun yang sama (tema 7). Isu: PSAK 338 (38) vs PSAK 103 (22), kertas kerja konsolidasi, penyesuaian nilai wajar dan pajak tangguhannya, penurunan nilai goodwill, dan obligasi antarperusahaan.
- PK-KAS-016: platform e-commerce menjelang penawaran umum (tema 8, 11, 12). Isu: prinsipal vs agen, insentif penjual, program loyalitas, provisi sengketa konsumen, tekanan manajemen memenuhi target pendapatan, sikap etis akuntan, dan pengungkapan keberlanjutan yang diminta investor.
- caseData memuat neraca saldo dan data transaksi; semua total konsisten. Total skor tiap kasus 20; rujukan kriteria menyebut bagiannya.
```
