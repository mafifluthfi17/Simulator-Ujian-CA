# PK kalibrasi — siap tempel

Formulir soal kalibrasi Pelaporan Korporat untuk Prompt D v1.0 (`prompts/prompt_kalibrasi_soal.md`), disusun 2026-10-23.
Isi: 6 PG, 4 esai, 1 kasus mini, 1 kasus komprehensif (12 soal, 4 batch). Nomor 900-an dan batch B90-B93 dipakai agar tidak bentrok dengan soal biasa.

Cara pakai:
1. Pakai Project Claude "Penyusun Kalibrasi" (instruksi Project = isi Prompt D) dengan pengetahuan PK: taksonomi, docs/pk_rujukan_penyusun.md, materi, CONTRACT.md, schema/examples. Jangan memakai Project penyusun biasa.
2. Buka satu percakapan baru, lalu salin satu blok utuh per pesan, berurutan dari atas.
3. Impor setiap hasil di Pengelola Bank Soal (batch kalibrasi diimpor terpisah). Buka pratinjau tiap soal dan cocokkan cacatnya dengan catatan "Soal kalibrasi: cacat sengaja ...".
4. Formulir dan tabel "Kunci kalibrasi" jangan pernah ditempel ke Project reviewer.
5. Soal kalibrasi hanya disimpan di bank perangkat; jangan dipublikasikan ke pack.

| Batch | Tipe | Jumlah | ID | Cacat |
|---|---|---|---|---|
| PK-B90 | PG | 6 | PK-MCQ-901 s.d. 906 | KUNCI 2, GANDA 1, PENGECOH 1, PERIODE 1, LUAR 1 |
| PK-B91 | Esai | 4 | PK-ESA-901 s.d. 904 | IDEAL 2, RUBRIK 1, LUAR 1 |
| PK-B92 | Kasus mini | 1 | PK-KAS-901 | DATA 1 |
| PK-B93 | Kasus komprehensif | 1 | PK-KAS-902 | IDEAL 1 |

## 1. PK-B90 (mcq)
```
FORMULIR BATCH KALIBRASI
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B90
Tipe: mcq | Jumlah: 6 | ID mulai: PK-MCQ-901
Sebaran topik: T04 1, T06 1, T12 1, T07 1, T09 1, T08 1
Sebaran kesulitan: sedang 3, sulit 3
Ukuran kasus: -
Level kognitif: C3-C5
Sebaran cacat (urut ID):
- PK-MCQ-901 (T04, sedang): KUNCI. Nilai realisasi neto persediaan PSAK 202 (14) dengan data harga jual, biaya penyelesaian, dan biaya penjualan; kunci lupa mengurangkan biaya penjualan, opsi yang benar ada di antara distraktor.
- PK-MCQ-902 (T06, sulit): KUNCI. Pengukuran awal liabilitas sewa PSAK 116 (73) dengan pembayaran di muka atau di akhir periode; kunci memakai faktor anuitas yang salah, opsi yang benar ada di antara distraktor.
- PK-MCQ-903 (T12, sulit): GANDA. Prinsipal vs agen PSAK 115 (72) pada platform e-commerce; data di stem membuat satu distraktor sama-sama dapat dibenarkan.
- PK-MCQ-904 (T07, sedang): PENGECOH. Klasifikasi aset keuangan PSAK 109 (71); dua distraktor menyebut kategori yang tidak ada atau tidak berhubungan.
- PK-MCQ-905 (T09, sulit): PERIODE. Pengukuran pajak tangguhan saat tarif pajak berubah; stem tidak menyebut tanggal pelaporan atau kapan perubahan tarif disahkan, padahal tarif yang dipakai bergantung padanya.
- PK-MCQ-906 (T08, sedang): LUAR. Pengukuran liabilitas imbalan kerja atau provisi PSAK 237 (57); kunci memakai tingkat diskonto yang tidak diberikan di stem.
Catatan khusus:
- Semua soal berbentuk analisis dengan perusahaan Indonesia fiktif. Nilai uang dalam Rupiah; sebut satuan dan aturan pembulatan di stem.
- Sebaran kunci (huruf di answerKey): setiap huruf A-D paling banyak 2.
- Panjang stem dan opsi setara soal gelombang 3.
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; jangan memakai standar atau amendemen yang belum efektif (kecuali kekeliruan itu adalah cacat yang ditetapkan).
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md. Tulis PSAK dengan nomor baru dan nomor lama, mis. "PSAK 116 (73)".
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi. Tanpa kategori lama PSAK 55.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian. Hindari skenario yang mirip soal PK yang sudah ada (PK-MCQ-001 s.d. 115, PK-ESA-001 s.d. 035, PK-KAS-001 s.d. 027).
- Konteks ekonomi Indonesia dan global 2023-2026 seperti soal biasa: fakta terverifikasi boleh disebut dengan tanggal dan sumbernya; fakta yang tidak dapat dipastikan dijadikan skenario hipotetis; angka pasar ditulis "diasumsikan"; perusahaan dan tokoh fiktif. Semua informasi untuk menjawab ada di soal, KECUALI pada cacat LUAR dan PERIODE yang memang sengaja menghilangkannya.
- Tema pilihan: suku bunga tinggi lalu turun; pelemahan rupiah; tarif resiprokal Amerika Serikat (diumumkan 2 April 2025); PHK industri padat karya; hilirisasi mineral; normalisasi harga komoditas; restrukturisasi grup di bawah BPI Danantara (24 Februari 2025); ekonomi digital dan e-commerce; pajak minimum global (sejak 1 Januari 2025); daya beli kelas menengah melemah; salah saji dan gagal bayar emiten; transisi energi dan keberlanjutan.
```

## 2. PK-B91 (essay)
```
FORMULIR BATCH KALIBRASI
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B91
Tipe: essay | Jumlah: 4 | ID mulai: PK-ESA-901
Sebaran topik: T03 1, T10 1, T14 1, T05 1
Sebaran kesulitan: sedang 2, sulit 2
Ukuran kasus: -
Level kognitif: C3-C5
Sebaran cacat (urut ID):
- PK-ESA-901 (T03, sedang): IDEAL. Membedakan perubahan kebijakan akuntansi, perubahan estimasi, dan koreksi kesalahan PSAK 208 (25); modelAnswer memperlakukan perubahan estimasi umur manfaat secara retrospektif dan rubrik memberi skor penuh untuk itu.
- PK-ESA-902 (T10, sulit): IDEAL. Penilaian pengendalian PSAK 110 (65) atas investee dengan hak suara di bawah 50%; modelAnswer menyimpulkan pengendalian hanya dari kepemilikan mayoritas dewan tanpa menilai hak substantif pihak lain, dan rubrik memberi skor penuh untuk kesimpulan itu.
- PK-ESA-903 (T14, sedang): RUBRIK. Pelaporan keberlanjutan dan terintegrasi; dua kriteria rubrik tidak terukur ("menjelaskan dengan baik dan lengkap") tanpa pembeda full/partial/zero.
- PK-ESA-904 (T05, sulit): LUAR. Penurunan nilai aset tetap PSAK 236 (48); jawaban yang dinilai bergantung pada tingkat diskonto atau nilai wajar yang tidak ada di stem.
Catatan khusus:
- Esai berbentuk analisis: analisis situasi, evaluasi perlakuan alternatif, dan kesimpulan beralasan.
- 3-6 kriteria rubrik berjumlah 10; acceptableAlternatives wajib.
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; kekeliruan perlakuan hanya pada cacat IDEAL yang ditetapkan.
Catatan umum:
- Ikuti docs/pk_taksonomi.md (T01-T14, K01-K05) dan docs/pk_rujukan_penyusun.md. Tulis PSAK dengan nomor baru dan nomor lama.
- Tanpa akuntansi syariah, sektor publik, dan kontrak asuransi.
- Jangan menyalin angka, nama perusahaan, atau skenario dari materi dan contoh ujian. Hindari skenario yang mirip soal PK yang sudah ada (PK-MCQ-001 s.d. 115, PK-ESA-001 s.d. 035, PK-KAS-001 s.d. 027) dan batch sebelumnya di percakapan ini.
- Konteks ekonomi Indonesia 2023-2026 seperti soal biasa: angka pasar ditulis "diasumsikan"; perusahaan dan tokoh fiktif. Semua informasi untuk menjawab ada di soal, KECUALI pada cacat LUAR.
```

## 3. PK-B92 (case)
```
FORMULIR BATCH KALIBRASI
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B92
Tipe: case | Jumlah: 1 | ID mulai: PK-KAS-901
Sebaran topik: PK-KAS-901 T04, T12
Sebaran kesulitan: sedang 1
Ukuran kasus: mini
Level kognitif: C3-C5
Sebaran cacat:
- PK-KAS-901: DATA. Distributor barang konsumsi dengan program retur dan diskon saat daya beli melemah. Satu angka di caseData (mis. total persediaan akhir atau jumlah penjualan bersih) tidak sama dengan jumlah rinciannya atau berbeda dengan angka di narasi, dan selisih itu mengubah jawaban satu sub-pertanyaan. modelAnswer memakai salah satu angka tanpa menyinggung selisih.
Catatan khusus:
- Data lain konsisten. Nilai dalam Rupiah dengan satuan dan aturan pembulatan. Total skor 20; rujukan kriteria di acceptableAlternatives menyebut bagiannya.
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026.
Catatan umum:
- Ikuti docs/pk_taksonomi.md dan docs/pk_rujukan_penyusun.md; PSAK dengan nomor baru dan lama.
- Hindari skenario yang mirip soal PK yang sudah ada (PK-KAS-001 s.d. 027) dan batch sebelumnya di percakapan ini.
- Angka pasar ditulis "diasumsikan"; perusahaan dan tokoh fiktif; semua informasi untuk menjawab ada di kasus.
```

## 4. PK-B93 (case)
```
FORMULIR BATCH KALIBRASI
Mata ujian: Pelaporan Korporat (subjectId: pk)
Batch ID: PK-B93
Tipe: case | Jumlah: 1 | ID mulai: PK-KAS-902
Sebaran topik: PK-KAS-902 T05, T06, T08
Sebaran kesulitan: sulit 1
Ukuran kasus: komprehensif
Level kognitif: C4-C6
Sebaran cacat:
- PK-KAS-902: IDEAL. Perusahaan smelter fiktif dalam ekosistem hilirisasi nikel: aset tetap dan biaya pinjaman, sewa alat berat, dan kewajiban restorasi lokasi. Pada satu sub-pertanyaan (bukan yang pertama), modelAnswer menerapkan perlakuan yang keliru (mis. kewajiban restorasi dibebankan langsung, bukan dikapitalisasi ke aset tetap), dan rubrik sub itu memberi skor penuh untuk perlakuan keliru tersebut.
Catatan khusus:
- Kasus komprehensif mengintegrasikan 3 topik; caseData memuat ikhtisar angka; jumlah sel tiap baris = jumlah kolom; semua total konsisten.
- Total skor 20; rubrik tiap sub = maxScore sub; rujukan kriteria di acceptableAlternatives menyebut bagiannya.
Standar berlaku: SAK Indonesia yang efektif per 1 Januari 2026; kekeliruan perlakuan hanya pada cacat IDEAL yang ditetapkan.
Catatan umum:
- Ikuti docs/pk_taksonomi.md dan docs/pk_rujukan_penyusun.md; PSAK dengan nomor baru dan lama.
- Hindari skenario yang mirip soal PK yang sudah ada (PK-KAS-001 s.d. 027) dan batch sebelumnya di percakapan ini.
- Angka pasar ditulis "diasumsikan"; perusahaan dan tokoh fiktif; semua informasi untuk menjawab ada di kasus.
```
