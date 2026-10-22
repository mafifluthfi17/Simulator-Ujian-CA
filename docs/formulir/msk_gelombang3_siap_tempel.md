# MSK gelombang 3 — siap tempel

Formulir gelombang 3 (konteks ekonomi tiga tahun terakhir, 2023-2026), disusun 2026-10-22 untuk Prompt B v4.2.
Melanjutkan gelombang 2 yang berakhir di MSK-B24 (MSK-MCQ-080, MSK-ESA-030, MSK-KAS-016). Isi: 40 PG, 15 esai, 5 kasus mini, 6 kasus komprehensif (66 soal, 13 batch).

Cara pakai: buka **satu percakapan baru** di Project Claude penyusun, lalu salin satu blok utuh per pesan, berurutan dari atas.
Impor setiap hasil ke Pengelola Bank Soal dan review dengan Prompt C. Bila Project melaporkan Batch ID atau rentang ID sudah terpakai, naikkan nomornya.

PG dan esai mencampur soal teori dan soal analisis (PG: 4 teori + 6 analisis per batch; esai: 2 teori + 3 analisis per batch). Kasus seluruhnya analisis.

| Batch | Tipe | Jumlah | ID | Kesulitan |
|---|---|---|---|---|
| MSK-B25 | PG | 10 | MSK-MCQ-081 s.d. 090 | mudah 2, sedang 4, sulit 3, sangat sulit 1 |
| MSK-B26 | PG | 10 | MSK-MCQ-091 s.d. 100 | mudah 2, sedang 4, sulit 3, sangat sulit 1 |
| MSK-B27 | PG | 10 | MSK-MCQ-101 s.d. 110 | mudah 2, sedang 4, sulit 3, sangat sulit 1 |
| MSK-B28 | PG | 10 | MSK-MCQ-111 s.d. 120 | mudah 2, sedang 4, sulit 3, sangat sulit 1 |
| MSK-B29 | Esai | 5 | MSK-ESA-031 s.d. 035 | mudah 1, sedang 2, sulit 1, sangat sulit 1 |
| MSK-B30 | Esai | 5 | MSK-ESA-036 s.d. 040 | mudah 1, sedang 2, sulit 1, sangat sulit 1 |
| MSK-B31 | Esai | 5 | MSK-ESA-041 s.d. 045 | mudah 1, sedang 2, sulit 1, sangat sulit 1 |
| MSK-B32 | Kasus mini | 2 | MSK-KAS-017 s.d. 018 | sedang 2 |
| MSK-B33 | Kasus mini | 2 | MSK-KAS-019 s.d. 020 | sulit 2 |
| MSK-B34 | Kasus mini | 1 | MSK-KAS-021 | sangat sulit 1 |
| MSK-B35 | Kasus komprehensif | 2 | MSK-KAS-022 s.d. 023 | sedang 2 |
| MSK-B36 | Kasus komprehensif | 2 | MSK-KAS-024 s.d. 025 | sulit 2 |
| MSK-B37 | Kasus komprehensif | 2 | MSK-KAS-026 s.d. 027 | sangat sulit 2 |

## 1. MSK-B25 (mcq)
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B25
Tipe: mcq | Jumlah: 10 | ID mulai: MSK-MCQ-081
Sebaran topik: T01 1, T02 1, T03 1, T04 1, T05 1, T06 1, T07 1, T08 1, T09 1, T10 1
Sebaran kesulitan: mudah 2, sedang 4, sulit 3, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C2-C6
Catatan khusus:
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- Bentuk: 4 soal teori dan 6 soal analisis. Kedua soal mudah berbentuk teori; soal sulit dan sangat sulit berbentuk analisis.
- Level kognitif C2 hanya untuk soal teori yang mudah.
- T01 (teori): hubungan visi, misi, nilai, dan tujuan stratejik.
- T05: strategi fungsional pemasaran saat daya beli kelas menengah melemah (tema 7).
- T09: pilihan struktur organisasi holding setelah konsolidasi anak usaha (tema 5).
- T10 (teori): kepemimpinan transformasional vs transaksional dalam krisis.
Catatan umum:
- Ikuti docs/msk_taksonomi.md (taksonomi 12 topik T01-T12 dan kompetensi K01-K06; bukan taksonomi lama T01-T16).
- Soal analisis memakai perusahaan Indonesia fiktif; soal teori menguji pemahaman konsep, bukan hafalan definisi.
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi.
- Hindari skenario yang mirip soal MSK yang sudah ada, termasuk gelombang 2 (MSK-MCQ-001 s.d. 080, MSK-ESA-001 s.d. 030, MSK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
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

## 2. MSK-B26 (mcq)
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B26
Tipe: mcq | Jumlah: 10 | ID mulai: MSK-MCQ-091
Sebaran topik: T01 1, T02 1, T03 1, T04 1, T06 1, T07 1, T08 1, T10 1, T11 1, T12 1
Sebaran kesulitan: mudah 2, sedang 4, sulit 3, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C2-C6
Catatan khusus:
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- Bentuk: 4 soal teori dan 6 soal analisis. Kedua soal mudah berbentuk teori; soal sulit dan sangat sulit berbentuk analisis.
- Level kognitif C2 hanya untuk soal teori yang mudah.
- T02 (teori): perbedaan fungsi PESTEL dan lima kekuatan Porter.
- T06: strategi transnasional vs multidomestik saat merelokasi pabrik karena tarif dagang (tema 3).
- T11: tahapan perubahan saat koperasi beralih ke layanan digital setelah krisis kepercayaan (tema 9, 11).
- T12 (teori): peran sistem informasi strategis dalam keunggulan bersaing.
Catatan umum:
- Ikuti docs/msk_taksonomi.md (taksonomi 12 topik T01-T12 dan kompetensi K01-K06; bukan taksonomi lama T01-T16).
- Soal analisis memakai perusahaan Indonesia fiktif; soal teori menguji pemahaman konsep, bukan hafalan definisi.
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi.
- Hindari skenario yang mirip soal MSK yang sudah ada, termasuk gelombang 2 (MSK-MCQ-001 s.d. 080, MSK-ESA-001 s.d. 030, MSK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
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

## 3. MSK-B27 (mcq)
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B27
Tipe: mcq | Jumlah: 10 | ID mulai: MSK-MCQ-101
Sebaran topik: T01 1, T02 1, T03 1, T04 1, T05 1, T06 1, T07 1, T09 1, T11 1, T12 1
Sebaran kesulitan: mudah 2, sedang 4, sulit 3, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C2-C6
Catatan khusus:
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- Bentuk: 4 soal teori dan 6 soal analisis. Kedua soal mudah berbentuk teori; soal sulit dan sangat sulit berbentuk analisis.
- Level kognitif C2 hanya untuk soal teori yang mudah.
- T03: analisis VRIO atas kapabilitas pengolahan mineral (tema 4).
- T07: diversifikasi terkait vs tidak terkait dan matriks portofolio pada grup BUMN fiktif (tema 5).
- T09 (teori): perspektif dan hubungan sebab-akibat dalam balanced scorecard.
- T12: risiko dan tata kelola penggunaan AI generatif dalam layanan pelanggan (tema 9).
Catatan umum:
- Ikuti docs/msk_taksonomi.md (taksonomi 12 topik T01-T12 dan kompetensi K01-K06; bukan taksonomi lama T01-T16).
- Soal analisis memakai perusahaan Indonesia fiktif; soal teori menguji pemahaman konsep, bukan hafalan definisi.
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi.
- Hindari skenario yang mirip soal MSK yang sudah ada, termasuk gelombang 2 (MSK-MCQ-001 s.d. 080, MSK-ESA-001 s.d. 030, MSK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
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

## 4. MSK-B28 (mcq)
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B28
Tipe: mcq | Jumlah: 10 | ID mulai: MSK-MCQ-111
Sebaran topik: T02 1, T03 1, T04 1, T05 1, T06 1, T07 1, T08 1, T09 1, T10 1, T12 1
Sebaran kesulitan: mudah 2, sedang 4, sulit 3, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C2-C6
Catatan khusus:
- Sebaran kunci: setiap huruf A-D paling banyak 3.
- Bentuk: 4 soal teori dan 6 soal analisis. Kedua soal mudah berbentuk teori; soal sulit dan sangat sulit berbentuk analisis.
- Level kognitif C2 hanya untuk soal teori yang mudah.
- T04 (teori): strategi generik, strategi hibrida, dan risiko terjebak di tengah.
- T06: aliansi ekspor untuk memanfaatkan perjanjian dagang; jangan menyebut isi perjanjian yang tidak dapat dipastikan (tema 3).
- T08: pemetaan pemangku kepentingan pada pemasok program pangan pemerintah (tema 6).
- T10: kepemimpinan situasional saat mengumumkan PHK (tema 8).
Catatan umum:
- Ikuti docs/msk_taksonomi.md (taksonomi 12 topik T01-T12 dan kompetensi K01-K06; bukan taksonomi lama T01-T16).
- Soal analisis memakai perusahaan Indonesia fiktif; soal teori menguji pemahaman konsep, bukan hafalan definisi.
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi.
- Hindari skenario yang mirip soal MSK yang sudah ada, termasuk gelombang 2 (MSK-MCQ-001 s.d. 080, MSK-ESA-001 s.d. 030, MSK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
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

## 5. MSK-B29 (essay)
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B29
Tipe: essay | Jumlah: 5 | ID mulai: MSK-ESA-031
Sebaran topik: T01 1, T02 1, T04 1, T07 1, T10 1
Sebaran kesulitan: mudah 1, sedang 2, sulit 1, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C2-C6
Catatan khusus:
- Esai teori meminta penjelasan konsep dengan contoh penerapan. Esai analisis menuntut analisis situasi, evaluasi minimal dua alternatif, dan rekomendasi yang beralasan.
- Bentuk: 2 esai teori dan 3 esai analisis (lihat tanda di setiap topik). Esai mudah berbentuk teori.
- Level kognitif C2 hanya untuk esai teori yang mudah.
- 3-6 kriteria rubrik berjumlah 10; acceptableAlternatives wajib.
- T01 (teori, mudah): peran visi dan nilai perusahaan dalam keputusan stratejik saat lingkungan berubah cepat (tema 10).
- T02 (analisis): perencanaan skenario bagi eksportir saat tarif dagang berubah selama negosiasi (tema 3).
- T04 (analisis): positioning merek fesyen lokal menghadapi produk impor murah dan daya beli melemah (tema 7).
- T07 (teori): logika penciptaan nilai di tingkat korporat (parenting advantage) pada holding (tema 5).
- T10 (analisis): kepemimpinan krisis di koperasi simpan pinjam yang gagal bayar (tema 11).
Catatan umum:
- Ikuti docs/msk_taksonomi.md (taksonomi 12 topik T01-T12 dan kompetensi K01-K06; bukan taksonomi lama T01-T16).
- Soal analisis memakai perusahaan Indonesia fiktif; soal teori menguji pemahaman konsep, bukan hafalan definisi.
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi.
- Hindari skenario yang mirip soal MSK yang sudah ada, termasuk gelombang 2 (MSK-MCQ-001 s.d. 080, MSK-ESA-001 s.d. 030, MSK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
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

## 6. MSK-B30 (essay)
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B30
Tipe: essay | Jumlah: 5 | ID mulai: MSK-ESA-036
Sebaran topik: T03 1, T05 1, T06 1, T08 1, T11 1
Sebaran kesulitan: mudah 1, sedang 2, sulit 1, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C2-C6
Catatan khusus:
- Esai teori meminta penjelasan konsep dengan contoh penerapan. Esai analisis menuntut analisis situasi, evaluasi minimal dua alternatif, dan rekomendasi yang beralasan.
- Bentuk: 2 esai teori dan 3 esai analisis (lihat tanda di setiap topik). Esai mudah berbentuk teori.
- Level kognitif C2 hanya untuk esai teori yang mudah.
- 3-6 kriteria rubrik berjumlah 10; acceptableAlternatives wajib.
- T03 (teori, mudah): sumber daya, kapabilitas, dan kompetensi inti sebagai dasar keunggulan bersaing.
- T05 (analisis): strategi operasi rantai dingin bagi UMKM pangan pemasok program pemerintah (tema 6).
- T06 (analisis): memilih usaha patungan, akuisisi, atau lisensi untuk masuk pasar ekspor baru (tema 3).
- T08 (teori): teori pemangku kepentingan vs pemegang saham dalam tuntutan ESG (tema 10).
- T11 (analisis): integrasi budaya setelah merger dua perusahaan teknologi finansial (tema 9).
Catatan umum:
- Ikuti docs/msk_taksonomi.md (taksonomi 12 topik T01-T12 dan kompetensi K01-K06; bukan taksonomi lama T01-T16).
- Soal analisis memakai perusahaan Indonesia fiktif; soal teori menguji pemahaman konsep, bukan hafalan definisi.
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi.
- Hindari skenario yang mirip soal MSK yang sudah ada, termasuk gelombang 2 (MSK-MCQ-001 s.d. 080, MSK-ESA-001 s.d. 030, MSK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
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

## 7. MSK-B31 (essay)
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B31
Tipe: essay | Jumlah: 5 | ID mulai: MSK-ESA-041
Sebaran topik: T01 1, T07 1, T09 1, T11 1, T12 1
Sebaran kesulitan: mudah 1, sedang 2, sulit 1, sangat_sulit 1
Ukuran kasus: -
Level kognitif: C2-C6
Catatan khusus:
- Esai teori meminta penjelasan konsep dengan contoh penerapan. Esai analisis menuntut analisis situasi, evaluasi minimal dua alternatif, dan rekomendasi yang beralasan.
- Bentuk: 2 esai teori dan 3 esai analisis (lihat tanda di setiap topik). Esai mudah berbentuk teori.
- Level kognitif C2 hanya untuk esai teori yang mudah.
- 3-6 kriteria rubrik berjumlah 10; acceptableAlternatives wajib.
- T01 (analisis): merumuskan tujuan stratejik yang terukur bagi bank perekonomian rakyat saat suku bunga turun (tema 1).
- T07 (analisis): divestasi unit bisnis batu bara pada grup energi (tema 10).
- T09 (analisis): merancang manajemen risiko perusahaan untuk rantai pasok (tema 12).
- T11 (teori, mudah): sumber resistensi terhadap perubahan dan cara mengatasinya (tema 8).
- T12 (teori): pengambilan keputusan berbasis data dan etika pemakaian AI (tema 9).
Catatan umum:
- Ikuti docs/msk_taksonomi.md (taksonomi 12 topik T01-T12 dan kompetensi K01-K06; bukan taksonomi lama T01-T16).
- Soal analisis memakai perusahaan Indonesia fiktif; soal teori menguji pemahaman konsep, bukan hafalan definisi.
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi.
- Hindari skenario yang mirip soal MSK yang sudah ada, termasuk gelombang 2 (MSK-MCQ-001 s.d. 080, MSK-ESA-001 s.d. 030, MSK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
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

## 8. MSK-B32 (case)
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B32
Tipe: case | Jumlah: 2 | ID mulai: MSK-KAS-017
Sebaran topik: MSK-KAS-017 T04, T05; MSK-KAS-018 T06, T09
Sebaran kesulitan: sedang 2
Ukuran kasus: mini
Level kognitif: C3-C5
Catatan khusus:
- MSK-KAS-017: waralaba kedai kopi lokal menghadapi kenaikan harga biji kopi dan daya beli melemah (tema 7). Strategi bersaing dan strategi fungsional.
- MSK-KAS-018: perusahaan ekspedisi menengah terdampak gangguan jalur pelayaran internasional (tema 12). Risiko rantai pasok dan pilihan rute atau mitra.
- Data pendukung di caseData (penjualan, margin, biaya); angka konsisten. Total skor tiap kasus 20; rujukan kriteria di acceptableAlternatives menyebut bagiannya, mis. "(b) C2".
Catatan umum:
- Ikuti docs/msk_taksonomi.md (taksonomi 12 topik T01-T12 dan kompetensi K01-K06; bukan taksonomi lama T01-T16).
- Soal analisis memakai perusahaan Indonesia fiktif; soal teori menguji pemahaman konsep, bukan hafalan definisi.
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi.
- Hindari skenario yang mirip soal MSK yang sudah ada, termasuk gelombang 2 (MSK-MCQ-001 s.d. 080, MSK-ESA-001 s.d. 030, MSK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 9. MSK-B33 (case)
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B33
Tipe: case | Jumlah: 2 | ID mulai: MSK-KAS-019
Sebaran topik: MSK-KAS-019 T03, T06; MSK-KAS-020 T09, T12
Sebaran kesulitan: sulit 2
Ukuran kasus: mini
Level kognitif: C4-C5
Catatan khusus:
- MSK-KAS-019: produsen kosmetik halal ingin masuk pasar ekspor saat rupiah melemah (tema 2, 3). Kapabilitas internal dan strategi masuk pasar.
- MSK-KAS-020: bank perekonomian rakyat dengan kredit bermasalah naik dan tekanan digitalisasi (tema 1, 11). Pengendalian, manajemen risiko, dan strategi data.
- Data pendukung di caseData; angka konsisten. Total skor tiap kasus 20; rujukan kriteria menyebut bagiannya.
Catatan umum:
- Ikuti docs/msk_taksonomi.md (taksonomi 12 topik T01-T12 dan kompetensi K01-K06; bukan taksonomi lama T01-T16).
- Soal analisis memakai perusahaan Indonesia fiktif; soal teori menguji pemahaman konsep, bukan hafalan definisi.
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi.
- Hindari skenario yang mirip soal MSK yang sudah ada, termasuk gelombang 2 (MSK-MCQ-001 s.d. 080, MSK-ESA-001 s.d. 030, MSK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 10. MSK-B34 (case)
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B34
Tipe: case | Jumlah: 1 | ID mulai: MSK-KAS-021
Sebaran topik: MSK-KAS-021 T10, T11, T08
Sebaran kesulitan: sangat_sulit 1
Ukuran kasus: mini
Level kognitif: C5-C6
Catatan khusus:
- Pabrik garmen memutuskan otomasi dan relokasi sebagian lini sehingga harus melakukan PHK (tema 3, 8). Dilema etika, gaya kepemimpinan, dan rencana perubahan yang saling bertentangan.
- Data pendukung di caseData; informasi sengaja tidak lengkap sehingga peserta perlu menyatakan asumsi. Total skor 20; rujukan kriteria menyebut bagiannya.
Catatan umum:
- Ikuti docs/msk_taksonomi.md (taksonomi 12 topik T01-T12 dan kompetensi K01-K06; bukan taksonomi lama T01-T16).
- Soal analisis memakai perusahaan Indonesia fiktif; soal teori menguji pemahaman konsep, bukan hafalan definisi.
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi.
- Hindari skenario yang mirip soal MSK yang sudah ada, termasuk gelombang 2 (MSK-MCQ-001 s.d. 080, MSK-ESA-001 s.d. 030, MSK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 11. MSK-B35 (case)
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B35
Tipe: case | Jumlah: 2 | ID mulai: MSK-KAS-022
Sebaran topik: MSK-KAS-022 T02, T05, T08; MSK-KAS-023 T03, T04, T07
Sebaran kesulitan: sedang 2
Ukuran kasus: komprehensif
Level kognitif: C3-C5
Catatan khusus:
- Tingkat sedang: data jelas, analisis memakai alat baku (PESTEL, lima kekuatan, VRIO, strategi generik, matriks portofolio), dan rekomendasi lugas.
- MSK-KAS-022: perusahaan perkebunan sawit menghadapi tuntutan keterlacakan dan ESG dari pembeli Eropa (tema 6, 10). Ketentuan pasar ekspor yang tidak dapat dipastikan disajikan sebagai asumsi.
- MSK-KAS-023: jaringan klinik kesehatan mempertimbangkan ekspansi saat suku bunga mulai turun (tema 1).
- Setiap kasus menuntut analisis, evaluasi alternatif, risiko, implikasi keuangan, dan rekomendasi.
- caseData memuat data keuangan dan operasional; jumlah sel tiap baris = jumlah kolom; semua total, rasio, dan persentase konsisten. Total skor tiap kasus 20.
Catatan umum:
- Ikuti docs/msk_taksonomi.md (taksonomi 12 topik T01-T12 dan kompetensi K01-K06; bukan taksonomi lama T01-T16).
- Soal analisis memakai perusahaan Indonesia fiktif; soal teori menguji pemahaman konsep, bukan hafalan definisi.
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi.
- Hindari skenario yang mirip soal MSK yang sudah ada, termasuk gelombang 2 (MSK-MCQ-001 s.d. 080, MSK-ESA-001 s.d. 030, MSK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 12. MSK-B36 (case)
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B36
Tipe: case | Jumlah: 2 | ID mulai: MSK-KAS-024
Sebaran topik: MSK-KAS-024 T02, T03, T07, T11; MSK-KAS-025 T09, T10, T12
Sebaran kesulitan: sulit 2
Ukuran kasus: komprehensif
Level kognitif: C4-C6
Catatan khusus:
- MSK-KAS-024: produsen komponen kendaraan bermesin bensin menghadapi pergeseran ke kendaraan listrik (tema 4, 9). Analisis industri, kapabilitas, pilihan portofolio, dan pengelolaan perubahan.
- MSK-KAS-025: perusahaan pembayaran digital yang tumbuh cepat menghadapi masalah tata kelola dan dominasi pendiri (tema 9, 11). Struktur, kepemimpinan, dan tata kelola data.
- caseData konsisten; total skor tiap kasus 20; rujukan kriteria menyebut bagiannya.
Catatan umum:
- Ikuti docs/msk_taksonomi.md (taksonomi 12 topik T01-T12 dan kompetensi K01-K06; bukan taksonomi lama T01-T16).
- Soal analisis memakai perusahaan Indonesia fiktif; soal teori menguji pemahaman konsep, bukan hafalan definisi.
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi.
- Hindari skenario yang mirip soal MSK yang sudah ada, termasuk gelombang 2 (MSK-MCQ-001 s.d. 080, MSK-ESA-001 s.d. 030, MSK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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

## 13. MSK-B37 (case)
```
FORMULIR BATCH
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B37
Tipe: case | Jumlah: 2 | ID mulai: MSK-KAS-026
Sebaran topik: MSK-KAS-026 T05, T07, T08, T09; MSK-KAS-027 T01, T04, T10, T11, T12
Sebaran kesulitan: sangat_sulit 2
Ukuran kasus: komprehensif
Level kognitif: C5-C6
Catatan khusus:
- Tingkat sangat sulit: beberapa isu saling bertentangan, informasi tidak lengkap sehingga perlu asumsi yang dinyatakan, dan tuntutan rekomendasi terintegrasi dengan urutan implementasi.
- MSK-KAS-026: BUMN pangan fiktif di bawah badan pengelola investasi negara menjadi pemasok program pangan pemerintah sambil menanggung bahan baku impor saat rupiah melemah (tema 2, 5, 6).
- MSK-KAS-027: grup ritel modern multiformat menghadapi social commerce, daya beli melemah, rencana PHK, dan tuntutan ESG (tema 7, 8, 9, 10).
- caseData memuat data keuangan beberapa tahun dan data pasar; semua angka konsisten. Total skor tiap kasus 20; rujukan kriteria menyebut bagiannya.
Catatan umum:
- Ikuti docs/msk_taksonomi.md (taksonomi 12 topik T01-T12 dan kompetensi K01-K06; bukan taksonomi lama T01-T16).
- Soal analisis memakai perusahaan Indonesia fiktif; soal teori menguji pemahaman konsep, bukan hafalan definisi.
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi.
- Hindari skenario yang mirip soal MSK yang sudah ada, termasuk gelombang 2 (MSK-MCQ-001 s.d. 080, MSK-ESA-001 s.d. 030, MSK-KAS-001 s.d. 016), dan batch sebelumnya di percakapan ini.
Konteks ekonomi (wajib):
- Kaitkan setiap soal dengan situasi perekonomian Indonesia dan global dalam tiga tahun terakhir (2023-2026) yang relevan dengan topiknya. Pilih tema yang paling cocok dari daftar di bawah; jangan memaksakan tema yang tidak relevan. Dalam satu batch, pakai tema yang beragam.
- Fakta ekonomi dipakai dengan tiga aturan:
  (a) Fakta yang terverifikasi boleh disebut sebagai peristiwa nyata dengan tanggal atau periodenya. Contoh: peluncuran BPI Danantara 24 Februari 2025 (UU 1/2025, PP 10/2025); pajak minimum global PMK 136/2024 (IIR dan DMTT mulai 1 Januari 2025, UTPR mulai 1 Januari 2026); tarif resiprokal Amerika Serikat yang diumumkan 2 April 2025. Tulis sumbernya (nama peraturan atau lembaga dan tanggal) di authoring.notes.
  (b) Fakta yang tidak dapat Anda pastikan disajikan sebagai skenario hipotetis yang dinyatakan jelas, mis. "Diasumsikan pemerintah negara X menetapkan ...". Fakta yang meragukan jangan disajikan sebagai kejadian nyata.
  (c) Fakta yang benar tetapi bukan kompetensi yang diuji tetap hanya latar. Semua informasi untuk menjawab (tarif, tanggal berlaku, produk yang terkena, kurs, suku bunga) wajib diberikan di stem atau caseData. Soal menguji pemahaman dan penerapan konsep, bukan hafalan berita. Untuk soal teori, konteks ekonomi cukup menjadi latar singkat di stem.
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
