# PK gelombang 3 — siap tempel

Formulir gelombang 3 (konteks ekonomi tiga tahun terakhir, 2023-2026), disusun 2026-10-22 untuk Prompt B v4.2.
Melanjutkan gelombang 2 yang berakhir di PK-B21 (PK-MCQ-075, PK-ESA-020, PK-KAS-016). Isi: 40 PG, 15 esai, 5 kasus mini, 6 kasus komprehensif (66 soal, 13 batch).

Cara pakai: buka **satu percakapan baru** di Project Claude penyusun, lalu salin satu blok utuh per pesan, berurutan dari atas.
Impor setiap hasil ke Pengelola Bank Soal dan review dengan Prompt C. Bila Project melaporkan Batch ID atau rentang ID sudah terpakai, naikkan nomornya.

PG dan esai mencampur soal teori dan soal analisis (PG: 4 teori + 6 analisis per batch; esai: 2 teori + 3 analisis per batch). Kasus seluruhnya analisis.

| Batch | Tipe | Jumlah | ID | Kesulitan |
|---|---|---|---|---|
| PK-B22 | PG | 10 | PK-MCQ-076 s.d. 085 | mudah 2, sedang 4, sulit 3, sangat sulit 1 |
| PK-B23 | PG | 10 | PK-MCQ-086 s.d. 095 | mudah 2, sedang 4, sulit 3, sangat sulit 1 |
| PK-B24 | PG | 10 | PK-MCQ-096 s.d. 105 | mudah 2, sedang 4, sulit 3, sangat sulit 1 |
| PK-B25 | PG | 10 | PK-MCQ-106 s.d. 115 | mudah 2, sedang 4, sulit 3, sangat sulit 1 |
| PK-B26 | Esai | 5 | PK-ESA-021 s.d. 025 | mudah 1, sedang 2, sulit 1, sangat sulit 1 |
| PK-B27 | Esai | 5 | PK-ESA-026 s.d. 030 | mudah 1, sedang 2, sulit 1, sangat sulit 1 |
| PK-B28 | Esai | 5 | PK-ESA-031 s.d. 035 | mudah 1, sedang 2, sulit 1, sangat sulit 1 |
| PK-B29 | Kasus mini | 2 | PK-KAS-017 s.d. 018 | sedang 2 |
| PK-B30 | Kasus mini | 2 | PK-KAS-019 s.d. 020 | sulit 2 |
| PK-B31 | Kasus mini | 1 | PK-KAS-021 | sangat sulit 1 |
| PK-B32 | Kasus komprehensif | 2 | PK-KAS-022 s.d. 023 | sedang 2 |
| PK-B33 | Kasus komprehensif | 2 | PK-KAS-024 s.d. 025 | sulit 2 |
| PK-B34 | Kasus komprehensif | 2 | PK-KAS-026 s.d. 027 | sangat sulit 2 |

## 1. PK-B22 (mcq)
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B22
Tipe: mcq | Jumlah: 10 | ID mulai: PK-MCQ-076
Sebaran topik: T01 1, T03 1, T04 1, T05 1, T06 1, T07 1, T08 1, T10 1, T12 1, T13 1
Sebaran kesulitan: mudah 2, sedang 4, sulit 3, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C2-C6
Catatan khusus:
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- Bentuk: 4 soal teori dan 6 soal analisis. Kedua soal mudah berbentuk teori; soal sulit dan sangat sulit berbentuk analisis.
- Level kognitif C2 hanya untuk soal teori yang mudah.
- T01 (teori): karakteristik kualitatif atau definisi liabilitas ketika entitas menghadapi ketidakpastian kebijakan dagang (tema 3).
- T06: suku bunga pinjaman inkremental untuk sewa baru saat suku bunga turun bertahap (tema 1).
- T10: penilaian pengendalian atas entitas yang sahamnya dialihkan ke holding (tema 7).
- T12: identifikasi kewajiban pelaksanaan pada paket langganan layanan digital (tema 8).
- T13: rasio kualitas laba dan arus kas sebagai tanda peringatan (tema 11).
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; jangan memakai standar atau amendemen yang belum efektif.
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md.
- Tulis PSAK dengan nomor baru dan nomor lama, mis. "PSAK 116 (73)". Untuk ISAK, cukup nomor baru bila ragu.
- Nilai uang dalam Rupiah; sebut satuan (ribu/juta/miliar) dan aturan pembulatan di stem.
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi. Tanpa kategori lama PSAK 55.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian.
- Hindari skenario yang mirip soal PK yang sudah ada, termasuk gelombang 2 (PK-MCQ-001 s.d. 075, PK-ESA-001 s.d. 020, PK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Bentuk soal (wajib):
- Teori: menguji pemahaman konsep, prinsip, dan dasar standar atau kerangka; stem singkat, boleh dengan ilustrasi pendek. Bukan hafalan definisi, nomor paragraf, atau tahun terbit.
- Analisis: skenario perusahaan fiktif dengan data; peserta menganalisis, menghitung, menilai, atau merekomendasikan.
- Tulis bentuk setiap soal di baris pertama authoring.notes: "Bentuk: teori" atau "Bentuk: analisis".
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 2. PK-B23 (mcq)
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B23
Tipe: mcq | Jumlah: 10 | ID mulai: PK-MCQ-086
Sebaran topik: T02 1, T03 1, T05 1, T06 1, T07 1, T08 1, T09 1, T10 1, T11 1, T12 1
Sebaran kesulitan: mudah 2, sedang 4, sulit 3, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C2-C6
Catatan khusus:
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- Bentuk: 4 soal teori dan 6 soal analisis. Kedua soal mudah berbentuk teori; soal sulit dan sangat sulit berbentuk analisis.
- Level kognitif C2 hanya untuk soal teori yang mudah.
- T02 (teori): ancaman terhadap prinsip dasar etika dan pengamanannya saat akuntan diminta menunda pencadangan (tema 11).
- T07: lindung nilai arus kas atas rencana pembelian bahan baku dalam valuta asing (tema 2).
- T09 (teori): perbedaan temporer, tarif pajak yang dipakai, dan pengecualian pajak tangguhan Pilar Dua sebagai latar (tema 9).
- T11: penghentian metode ekuitas atau perubahan pengaruh signifikan pada investasi tambang (tema 5).
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; jangan memakai standar atau amendemen yang belum efektif.
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md.
- Tulis PSAK dengan nomor baru dan nomor lama, mis. "PSAK 116 (73)". Untuk ISAK, cukup nomor baru bila ragu.
- Nilai uang dalam Rupiah; sebut satuan (ribu/juta/miliar) dan aturan pembulatan di stem.
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi. Tanpa kategori lama PSAK 55.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian.
- Hindari skenario yang mirip soal PK yang sudah ada, termasuk gelombang 2 (PK-MCQ-001 s.d. 075, PK-ESA-001 s.d. 020, PK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Bentuk soal (wajib):
- Teori: menguji pemahaman konsep, prinsip, dan dasar standar atau kerangka; stem singkat, boleh dengan ilustrasi pendek. Bukan hafalan definisi, nomor paragraf, atau tahun terbit.
- Analisis: skenario perusahaan fiktif dengan data; peserta menganalisis, menghitung, menilai, atau merekomendasikan.
- Tulis bentuk setiap soal di baris pertama authoring.notes: "Bentuk: teori" atau "Bentuk: analisis".
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 3. PK-B24 (mcq)
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B24
Tipe: mcq | Jumlah: 10 | ID mulai: PK-MCQ-096
Sebaran topik: T01 1, T03 1, T04 1, T05 1, T07 1, T09 1, T10 1, T12 1, T13 1, T14 1
Sebaran kesulitan: mudah 2, sedang 4, sulit 3, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C2-C6
Catatan khusus:
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- Bentuk: 4 soal teori dan 6 soal analisis. Kedua soal mudah berbentuk teori; soal sulit dan sangat sulit berbentuk analisis.
- Level kognitif C2 hanya untuk soal teori yang mudah.
- T04: biaya dan nilai realisasi neto persediaan produk agrikultur setelah panen saat harga CPO turun (tema 6).
- T05: model revaluasi aset tetap dan penurunan nilai saat harga komoditas turun (tema 6).
- T09: ketidakpastian perlakuan pajak ISAK 123 saat entitas menghadapi pemeriksaan pajak (tema 9).
- T14 (teori): tujuan dan elemen pelaporan terintegrasi dan keberlanjutan (tema 12). Kunci tidak bergantung pada ketentuan rinci PSPK.
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; jangan memakai standar atau amendemen yang belum efektif.
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md.
- Tulis PSAK dengan nomor baru dan nomor lama, mis. "PSAK 116 (73)". Untuk ISAK, cukup nomor baru bila ragu.
- Nilai uang dalam Rupiah; sebut satuan (ribu/juta/miliar) dan aturan pembulatan di stem.
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi. Tanpa kategori lama PSAK 55.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian.
- Hindari skenario yang mirip soal PK yang sudah ada, termasuk gelombang 2 (PK-MCQ-001 s.d. 075, PK-ESA-001 s.d. 020, PK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Bentuk soal (wajib):
- Teori: menguji pemahaman konsep, prinsip, dan dasar standar atau kerangka; stem singkat, boleh dengan ilustrasi pendek. Bukan hafalan definisi, nomor paragraf, atau tahun terbit.
- Analisis: skenario perusahaan fiktif dengan data; peserta menganalisis, menghitung, menilai, atau merekomendasikan.
- Tulis bentuk setiap soal di baris pertama authoring.notes: "Bentuk: teori" atau "Bentuk: analisis".
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 4. PK-B25 (mcq)
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B25
Tipe: mcq | Jumlah: 10 | ID mulai: PK-MCQ-106
Sebaran topik: T02 1, T04 1, T05 1, T06 1, T07 1, T08 1, T09 1, T10 1, T11 1, T12 1
Sebaran kesulitan: mudah 2, sedang 4, sulit 3, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C2-C6
Catatan khusus:
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- Bentuk: 4 soal teori dan 6 soal analisis. Kedua soal mudah berbentuk teori; soal sulit dan sangat sulit berbentuk analisis.
- Level kognitif C2 hanya untuk soal teori yang mudah.
- T06 (teori): pengecualian sewa jangka pendek dan aset bernilai rendah.
- T08: provisi vs liabilitas kontinjensi atas gugatan konsumen (tema 10 atau 11).
- T10: perubahan kepemilikan tanpa kehilangan pengendalian dan kepentingan nonpengendali (tema 7).
- T12: imbalan variabel berupa diskon volume saat daya beli melemah (tema 10).
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; jangan memakai standar atau amendemen yang belum efektif.
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md.
- Tulis PSAK dengan nomor baru dan nomor lama, mis. "PSAK 116 (73)". Untuk ISAK, cukup nomor baru bila ragu.
- Nilai uang dalam Rupiah; sebut satuan (ribu/juta/miliar) dan aturan pembulatan di stem.
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi. Tanpa kategori lama PSAK 55.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian.
- Hindari skenario yang mirip soal PK yang sudah ada, termasuk gelombang 2 (PK-MCQ-001 s.d. 075, PK-ESA-001 s.d. 020, PK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Bentuk soal (wajib):
- Teori: menguji pemahaman konsep, prinsip, dan dasar standar atau kerangka; stem singkat, boleh dengan ilustrasi pendek. Bukan hafalan definisi, nomor paragraf, atau tahun terbit.
- Analisis: skenario perusahaan fiktif dengan data; peserta menganalisis, menghitung, menilai, atau merekomendasikan.
- Tulis bentuk setiap soal di baris pertama authoring.notes: "Bentuk: teori" atau "Bentuk: analisis".
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 5. PK-B26 (essay)
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B26
Tipe: essay | Jumlah: 5 | ID mulai: PK-ESA-021
Sebaran topik: T01 1, T03 1, T05 1, T07 1, T12 1
Sebaran kesulitan: mudah 1, sedang 2, sulit 1, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C2-C6
Catatan khusus:
- Esai teori meminta penjelasan konsep dan dasar standar dengan contoh penerapan. Esai analisis meminta perlakuan akuntansi, dasar standar, jurnal bila relevan, dan dampak pada laporan keuangan.
- Bentuk: 2 esai teori dan 3 esai analisis (lihat tanda di setiap topik). Esai mudah berbentuk teori.
- Level kognitif C2 hanya untuk esai teori yang mudah.
- 3-6 kriteria rubrik berjumlah 10; acceptableAlternatives wajib.
- T01 (teori, mudah): peran netralitas dan kehati-hatian dalam estimasi saat kondisi ekonomi tidak pasti (tema 1 atau 3).
- T03 (analisis): perubahan estimasi vs perubahan kebijakan akuntansi saat pola penggunaan aset berubah (tema 4 atau 6).
- T05 (analisis): reklasifikasi aset eksplorasi dan evaluasi PSAK 106 (64) ke aset tetap saat proyek nikel masuk tahap pengembangan, termasuk uji penurunan nilai (tema 5).
- T07 (teori): model bisnis dan karakteristik arus kas kontraktual dalam klasifikasi aset keuangan (tema 1).
- T12 (analisis): lisensi kekayaan intelektual, hak akses vs hak pakai, pada perusahaan konten digital (tema 8).
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; jangan memakai standar atau amendemen yang belum efektif.
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md.
- Tulis PSAK dengan nomor baru dan nomor lama, mis. "PSAK 116 (73)". Untuk ISAK, cukup nomor baru bila ragu.
- Nilai uang dalam Rupiah; sebut satuan (ribu/juta/miliar) dan aturan pembulatan di stem.
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi. Tanpa kategori lama PSAK 55.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian.
- Hindari skenario yang mirip soal PK yang sudah ada, termasuk gelombang 2 (PK-MCQ-001 s.d. 075, PK-ESA-001 s.d. 020, PK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Bentuk soal (wajib):
- Teori: menguji pemahaman konsep, prinsip, dan dasar standar atau kerangka; stem singkat, boleh dengan ilustrasi pendek. Bukan hafalan definisi, nomor paragraf, atau tahun terbit.
- Analisis: skenario perusahaan fiktif dengan data; peserta menganalisis, menghitung, menilai, atau merekomendasikan.
- Tulis bentuk setiap soal di baris pertama authoring.notes: "Bentuk: teori" atau "Bentuk: analisis".
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 6. PK-B27 (essay)
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B27
Tipe: essay | Jumlah: 5 | ID mulai: PK-ESA-026
Sebaran topik: T02 1, T04 1, T06 1, T08 1, T10 1
Sebaran kesulitan: mudah 1, sedang 2, sulit 1, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C2-C6
Catatan khusus:
- Esai teori meminta penjelasan konsep dan dasar standar dengan contoh penerapan. Esai analisis meminta perlakuan akuntansi, dasar standar, jurnal bila relevan, dan dampak pada laporan keuangan.
- Bentuk: 2 esai teori dan 3 esai analisis (lihat tanda di setiap topik). Esai mudah berbentuk teori.
- Level kognitif C2 hanya untuk esai teori yang mudah.
- 3-6 kriteria rubrik berjumlah 10; acceptableAlternatives wajib.
- T02 (teori, mudah): kerangka pengambilan keputusan etis bagi akuntan profesional (tema 11).
- T04 (analisis): aset dikuasai untuk dijual yang rencana penjualannya dibatalkan dalam restrukturisasi grup (tema 7).
- T06 (analisis): sewa ruang ritel dengan pembayaran variabel berbasis penjualan dan konsesi sewa saat daya beli melemah (tema 10).
- T08 (teori): provisi, liabilitas kontinjensi, dan aset kontinjensi untuk kewajiban lingkungan (tema 12).
- T10 (analisis): kombinasi bisnis bertahap dan pengukuran kembali kepemilikan sebelumnya (tema 5 atau 7).
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; jangan memakai standar atau amendemen yang belum efektif.
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md.
- Tulis PSAK dengan nomor baru dan nomor lama, mis. "PSAK 116 (73)". Untuk ISAK, cukup nomor baru bila ragu.
- Nilai uang dalam Rupiah; sebut satuan (ribu/juta/miliar) dan aturan pembulatan di stem.
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi. Tanpa kategori lama PSAK 55.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian.
- Hindari skenario yang mirip soal PK yang sudah ada, termasuk gelombang 2 (PK-MCQ-001 s.d. 075, PK-ESA-001 s.d. 020, PK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Bentuk soal (wajib):
- Teori: menguji pemahaman konsep, prinsip, dan dasar standar atau kerangka; stem singkat, boleh dengan ilustrasi pendek. Bukan hafalan definisi, nomor paragraf, atau tahun terbit.
- Analisis: skenario perusahaan fiktif dengan data; peserta menganalisis, menghitung, menilai, atau merekomendasikan.
- Tulis bentuk setiap soal di baris pertama authoring.notes: "Bentuk: teori" atau "Bentuk: analisis".
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 7. PK-B28 (essay)
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B28
Tipe: essay | Jumlah: 5 | ID mulai: PK-ESA-031
Sebaran topik: T03 1, T09 1, T11 1, T13 1, T14 1
Sebaran kesulitan: mudah 1, sedang 2, sulit 1, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C2-C6
Catatan khusus:
- Esai teori meminta penjelasan konsep dan dasar standar dengan contoh penerapan. Esai analisis meminta perlakuan akuntansi, dasar standar, jurnal bila relevan, dan dampak pada laporan keuangan.
- Bentuk: 2 esai teori dan 3 esai analisis (lihat tanda di setiap topik). Esai mudah berbentuk teori.
- Level kognitif C2 hanya untuk esai teori yang mudah.
- 3-6 kriteria rubrik berjumlah 10; acceptableAlternatives wajib.
- T03 (analisis): penentuan mata uang fungsional entitas anak berorientasi ekspor setelah pasar utama berubah (tema 2, 3).
- T09 (teori, mudah): dasar pengakuan aset pajak tangguhan dan pengecualian Pilar Dua (tema 9).
- T11 (analisis): dilusi kepemilikan dan hilangnya pengaruh signifikan atas entitas asosiasi (tema 7).
- T13 (analisis): rekayasa arus kas operasi melalui anjak piutang dan klasifikasi arus kas (tema 11).
- T14 (teori): manfaat pelaporan terintegrasi bagi investor saat transisi energi. Boleh membahas kesiapan PSPK 1 dan 2 (efektif 1 Januari 2027, penerapan dini diperbolehkan), tetapi kunci tidak bergantung pada ketentuan rinci PSPK (tema 12).
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; jangan memakai standar atau amendemen yang belum efektif.
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md.
- Tulis PSAK dengan nomor baru dan nomor lama, mis. "PSAK 116 (73)". Untuk ISAK, cukup nomor baru bila ragu.
- Nilai uang dalam Rupiah; sebut satuan (ribu/juta/miliar) dan aturan pembulatan di stem.
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi. Tanpa kategori lama PSAK 55.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian.
- Hindari skenario yang mirip soal PK yang sudah ada, termasuk gelombang 2 (PK-MCQ-001 s.d. 075, PK-ESA-001 s.d. 020, PK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Bentuk soal (wajib):
- Teori: menguji pemahaman konsep, prinsip, dan dasar standar atau kerangka; stem singkat, boleh dengan ilustrasi pendek. Bukan hafalan definisi, nomor paragraf, atau tahun terbit.
- Analisis: skenario perusahaan fiktif dengan data; peserta menganalisis, menghitung, menilai, atau merekomendasikan.
- Tulis bentuk setiap soal di baris pertama authoring.notes: "Bentuk: teori" atau "Bentuk: analisis".
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 8. PK-B29 (case)
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B29
Tipe: case | Jumlah: 2 | ID mulai: PK-KAS-017
Sebaran topik: PK-KAS-017 T05; PK-KAS-018 T12, T08
Sebaran kesulitan: sedang 2
Ukuran kasus: mini
Level kognitif: C3-C5
Catatan khusus:
- PK-KAS-017: produsen semen menghadapi kelebihan pasokan dan biaya modal tinggi (tema 1). Indikasi penurunan nilai, nilai pakai UPK dengan tingkat diskonto yang diberikan, dan jurnal.
- PK-KAS-018: dealer kendaraan listrik menjual paket kendaraan, paket servis, dan garansi (tema 5, 8). Kewajiban pelaksanaan, alokasi harga transaksi, dan provisi garansi jenis jaminan.
- Data angka di caseData; total konsisten. Total skor tiap kasus 20; rujukan kriteria di acceptableAlternatives menyebut bagiannya, mis. "(b) C2".
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; jangan memakai standar atau amendemen yang belum efektif.
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md.
- Tulis PSAK dengan nomor baru dan nomor lama, mis. "PSAK 116 (73)". Untuk ISAK, cukup nomor baru bila ragu.
- Nilai uang dalam Rupiah; sebut satuan (ribu/juta/miliar) dan aturan pembulatan di stem.
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi. Tanpa kategori lama PSAK 55.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian.
- Hindari skenario yang mirip soal PK yang sudah ada, termasuk gelombang 2 (PK-MCQ-001 s.d. 075, PK-ESA-001 s.d. 020, PK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 9. PK-B30 (case)
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B30
Tipe: case | Jumlah: 2 | ID mulai: PK-KAS-019
Sebaran topik: PK-KAS-019 T06; PK-KAS-020 T07
Sebaran kesulitan: sulit 2
Ukuran kasus: mini
Level kognitif: C4-C5
Catatan khusus:
- PK-KAS-019: peritel menyewa ruang toko, lalu memodifikasi sewa dan menyewakan kembali sebagian ruang (subsewa) saat daya beli melemah (tema 10). Pengukuran kembali liabilitas sewa dan klasifikasi subsewa.
- PK-KAS-020: perusahaan memegang obligasi korporasi FVOCI saat suku bunga turun dan risiko kredit penerbit naik (tema 1). Nilai wajar, kerugian kredit ekspektasian per tahap, dan dampak ke OCI dan laba rugi.
- Data angka di caseData; total skor tiap kasus 20; rujukan kriteria menyebut bagiannya.
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; jangan memakai standar atau amendemen yang belum efektif.
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md.
- Tulis PSAK dengan nomor baru dan nomor lama, mis. "PSAK 116 (73)". Untuk ISAK, cukup nomor baru bila ragu.
- Nilai uang dalam Rupiah; sebut satuan (ribu/juta/miliar) dan aturan pembulatan di stem.
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi. Tanpa kategori lama PSAK 55.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian.
- Hindari skenario yang mirip soal PK yang sudah ada, termasuk gelombang 2 (PK-MCQ-001 s.d. 075, PK-ESA-001 s.d. 020, PK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 10. PK-B31 (case)
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B31
Tipe: case | Jumlah: 1 | ID mulai: PK-KAS-021
Sebaran topik: T08 1
Sebaran kesulitan: sangat_sulit 1
Ukuran kasus: mini
Level kognitif: C5-C6
Catatan khusus:
- Program pensiun manfaat pasti pada produsen padat karya yang melakukan PHK dan menghadapi perubahan tingkat diskonto (tema 1, 4). Pengukuran kembali, kurtailmen, batas atas aset (asset ceiling), dan penyajian di laba rugi dan OCI.
- caseData memuat data aktuaria dan aset program; semua angka konsisten. Total skor 20; rujukan kriteria menyebut bagiannya.
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; jangan memakai standar atau amendemen yang belum efektif.
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md.
- Tulis PSAK dengan nomor baru dan nomor lama, mis. "PSAK 116 (73)". Untuk ISAK, cukup nomor baru bila ragu.
- Nilai uang dalam Rupiah; sebut satuan (ribu/juta/miliar) dan aturan pembulatan di stem.
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi. Tanpa kategori lama PSAK 55.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian.
- Hindari skenario yang mirip soal PK yang sudah ada, termasuk gelombang 2 (PK-MCQ-001 s.d. 075, PK-ESA-001 s.d. 020, PK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 11. PK-B32 (case)
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B32
Tipe: case | Jumlah: 2 | ID mulai: PK-KAS-022
Sebaran topik: PK-KAS-022 T03, T04, T12; PK-KAS-023 T05, T06, T08
Sebaran kesulitan: sedang 2
Ukuran kasus: komprehensif
Level kognitif: C3-C5
Catatan khusus:
- Tingkat sedang: perhitungan lugas, satu langkah pertimbangan per isu, data jelas.
- PK-KAS-022: distributor elektronik impor saat rupiah melemah dan daya beli turun (tema 2, 10). Isu: selisih kurs utang dagang, nilai realisasi neto persediaan, dan hak retur penjualan.
- PK-KAS-023: jaringan rumah sakit swasta berekspansi (tema 1). Isu: komponen aset tetap dan biaya pinjaman, sewa alat medis, dan provisi gugatan pasien.
- caseData memuat neraca saldo atau ikhtisar angka; jumlah sel tiap baris = jumlah kolom; semua total konsisten. Total skor tiap kasus 20.
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; jangan memakai standar atau amendemen yang belum efektif.
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md.
- Tulis PSAK dengan nomor baru dan nomor lama, mis. "PSAK 116 (73)". Untuk ISAK, cukup nomor baru bila ragu.
- Nilai uang dalam Rupiah; sebut satuan (ribu/juta/miliar) dan aturan pembulatan di stem.
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi. Tanpa kategori lama PSAK 55.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian.
- Hindari skenario yang mirip soal PK yang sudah ada, termasuk gelombang 2 (PK-MCQ-001 s.d. 075, PK-ESA-001 s.d. 020, PK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 12. PK-B33 (case)
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B33
Tipe: case | Jumlah: 2 | ID mulai: PK-KAS-024
Sebaran topik: PK-KAS-024 T07, T09, T13; PK-KAS-025 T05, T10, T11
Sebaran kesulitan: sulit 2
Ukuran kasus: komprehensif
Level kognitif: C4-C6
Catatan khusus:
- PK-KAS-024: emiten properti dengan obligasi USD jatuh tempo saat penjualan melambat (tema 1, 2, 11). Isu: restrukturisasi utang sebagai modifikasi atau penghentian liabilitas keuangan, selisih kurs, aset pajak tangguhan atas rugi, dan red flags pengakuan penjualan.
- PK-KAS-025: pengembang pembangkit listrik tenaga surya membeli proyek dan membentuk ventura bersama (tema 12). Isu: akuisisi aset vs kombinasi bisnis (uji konsentrasi), metode ekuitas, provisi pembongkaran, dan penurunan nilai.
- caseData konsisten; total skor tiap kasus 20; rujukan kriteria menyebut bagiannya.
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; jangan memakai standar atau amendemen yang belum efektif.
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md.
- Tulis PSAK dengan nomor baru dan nomor lama, mis. "PSAK 116 (73)". Untuk ISAK, cukup nomor baru bila ragu.
- Nilai uang dalam Rupiah; sebut satuan (ribu/juta/miliar) dan aturan pembulatan di stem.
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi. Tanpa kategori lama PSAK 55.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian.
- Hindari skenario yang mirip soal PK yang sudah ada, termasuk gelombang 2 (PK-MCQ-001 s.d. 075, PK-ESA-001 s.d. 020, PK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 13. PK-B34 (case)
```
FORMULIR BATCH
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B34
Tipe: case | Jumlah: 2 | ID mulai: PK-KAS-026
Sebaran topik: PK-KAS-026 T10, T03, T09, T07; PK-KAS-027 T04, T05, T08, T02, T14
Sebaran kesulitan: sangat_sulit 2
Ukuran kasus: komprehensif
Level kognitif: C5-C6
Catatan khusus:
- Tingkat sangat sulit: beberapa isu saling memengaruhi, menuntut pertimbangan profesional dan evaluasi alternatif, serta perhitungan bertingkat.
- PK-KAS-026: grup manufaktur memindahkan sebagian produksi ke entitas anak di luar negeri karena tarif dagang, lalu melepas sebagian kepemilikan entitas anak lain (tema 2, 3, 9). Isu: penjabaran dan konsolidasi, pelepasan dengan dan tanpa kehilangan pengendalian, reklasifikasi selisih kurs dari OCI, pinjaman antarperusahaan valas, dan pengecualian pajak tangguhan Pilar Dua (grup memenuhi ambang EUR 750 juta yang dinyatakan di soal).
- PK-KAS-027: produsen semen atau smelter yang mempensiunkan dini pembangkit captive batu bara (tema 6, 12). Isu: aset dikuasai untuk dijual vs ditinggalkan, penurunan nilai, provisi restorasi, kelangsungan usaha, tekanan manajemen menunda pengakuan kerugian, sikap etis akuntan, dan pengungkapan keberlanjutan.
- caseData memuat neraca saldo dan data transaksi; semua total konsisten. Total skor tiap kasus 20; rujukan kriteria menyebut bagiannya.
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; jangan memakai standar atau amendemen yang belum efektif.
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md.
- Tulis PSAK dengan nomor baru dan nomor lama, mis. "PSAK 116 (73)". Untuk ISAK, cukup nomor baru bila ragu.
- Nilai uang dalam Rupiah; sebut satuan (ribu/juta/miliar) dan aturan pembulatan di stem.
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi. Tanpa kategori lama PSAK 55.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian.
- Hindari skenario yang mirip soal PK yang sudah ada, termasuk gelombang 2 (PK-MCQ-001 s.d. 075, PK-ESA-001 s.d. 020, PK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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
