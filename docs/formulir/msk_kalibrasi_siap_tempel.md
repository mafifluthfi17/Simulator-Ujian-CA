# MSK kalibrasi — siap tempel

Formulir soal kalibrasi MSK untuk Prompt D v1.0 (`prompts/prompt_kalibrasi_soal.md`), disusun 2026-10-23.
Isi: 6 PG, 4 esai, 1 kasus mini, 1 kasus komprehensif (12 soal, 4 batch). Nomor 900-an dan batch B90-B93 dipakai agar tidak bentrok dengan soal biasa.

Cara pakai:
1. Buat **Project Claude terpisah** "Penyusun Kalibrasi" dengan instruksi Project = isi Prompt D, dan pengetahuan yang sama dengan Project penyusun (taksonomi, materi, CONTRACT.md, schema/examples). Jangan memakai Project penyusun biasa, karena instruksi Prompt B bertentangan dengan Prompt D.
2. Buka satu percakapan baru, lalu salin satu blok utuh per pesan, berurutan dari atas.
3. Impor setiap hasil di Pengelola Bank Soal (batch kalibrasi diimpor terpisah). Buka pratinjau tiap soal dan cocokkan cacatnya dengan catatan "Soal kalibrasi: cacat sengaja ...".
4. Formulir dan tabel "Kunci kalibrasi" jangan pernah ditempel ke Project reviewer.
5. Soal kalibrasi hanya disimpan di bank perangkat; jangan dipublikasikan ke pack.

| Batch | Tipe | Jumlah | ID | Cacat |
|---|---|---|---|---|
| MSK-B90 | PG | 6 | MSK-MCQ-901 s.d. 906 | KUNCI 2, GANDA 1, PENGECOH 1, PERIODE 1, LUAR 1 |
| MSK-B91 | Esai | 4 | MSK-ESA-901 s.d. 904 | IDEAL 2, RUBRIK 1, LUAR 1 |
| MSK-B92 | Kasus mini | 1 | MSK-KAS-901 | DATA 1 |
| MSK-B93 | Kasus komprehensif | 1 | MSK-KAS-902 | IDEAL 1 |

## 1. MSK-B90 (mcq)
```
FORMULIR BATCH KALIBRASI
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B90
Tipe: mcq | Jumlah: 6 | ID mulai: MSK-MCQ-901
Sebaran topik: T03 1, T04 1, T09 1, T12 1, T06 1, T02 1
Sebaran kesulitan: sedang 3, sulit 3
Ukuran kasus: -
Level kognitif: C3-C5
Sebaran cacat (urut ID):
- MSK-MCQ-901 (T03, sedang): KUNCI. Analisis sumber daya dengan kerangka VRIO; kunci menunjuk sumber daya yang mudah ditiru, opsi yang benar adalah kapabilitas yang langka dan sulit ditiru.
- MSK-MCQ-902 (T04, sulit): KUNCI. Pilihan strategi generik dengan data harga, biaya, dan segmen; kunci memilih strategi yang tidak didukung data.
- MSK-MCQ-903 (T09, sulit): GANDA. Pilihan struktur organisasi setelah ekspansi lini produk; satu distraktor sama-sama dapat dibenarkan oleh data di stem.
- MSK-MCQ-904 (T12, sedang): PENGECOH. Pemanfaatan analisis data pelanggan; dua distraktor tidak berhubungan dengan konsep yang diuji.
- MSK-MCQ-905 (T06, sulit): PERIODE. Keputusan pasar ekspor saat tarif dagang berubah (tema 3); stem tidak menyebut periode tarif yang berlaku, padahal kunci bergantung padanya.
- MSK-MCQ-906 (T02, sedang): LUAR. Analisis lingkungan eksternal; kunci bergantung pada angka atau ketentuan kebijakan yang tidak diberikan di stem.
Catatan khusus:
- Semua soal berbentuk analisis dengan perusahaan Indonesia fiktif.
- Sebaran kunci (huruf di answerKey): setiap huruf A-D paling banyak 2.
- Panjang stem dan opsi setara soal gelombang 3.
Catatan umum:
- Ikuti docs/msk_taksonomi.md (T01-T12, K01-K06).
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi. Hindari skenario yang mirip soal MSK yang sudah ada (MSK-MCQ-001 s.d. 120, MSK-ESA-001 s.d. 045, MSK-KAS-001 s.d. 027).
- Konteks ekonomi Indonesia dan global 2023-2026 seperti soal biasa: fakta terverifikasi boleh disebut dengan tanggal dan sumbernya; fakta yang tidak dapat dipastikan dijadikan skenario hipotetis; angka pasar ditulis "diasumsikan"; perusahaan dan tokoh fiktif. Semua informasi untuk menjawab ada di soal, KECUALI pada cacat LUAR dan PERIODE yang memang sengaja menghilangkannya.
- Tema pilihan: suku bunga tinggi lalu turun; pelemahan rupiah; tarif resiprokal Amerika Serikat (diumumkan 2 April 2025) dan relokasi rantai pasok; hilirisasi dan baterai; restrukturisasi BUMN di bawah BPI Danantara (24 Februari 2025); daya beli kelas menengah melemah; PHK dan otomasi; ekonomi digital dan AI generatif; transisi energi dan ESG; gagal bayar lembaga keuangan nonbank; gangguan logistik dan geopolitik.
```

## 2. MSK-B91 (essay)
```
FORMULIR BATCH KALIBRASI
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B91
Tipe: essay | Jumlah: 4 | ID mulai: MSK-ESA-901
Sebaran topik: T01 1, T05 1, T07 1, T11 1
Sebaran kesulitan: sedang 2, sulit 2
Ukuran kasus: -
Level kognitif: C3-C5
Sebaran cacat (urut ID):
- MSK-ESA-901 (T01, sedang): IDEAL. Penyelarasan visi, misi, dan tujuan stratejik; modelAnswer mencampuradukkan misi dengan tujuan terukur dan rubrik memberi skor penuh untuk kekeliruan itu.
- MSK-ESA-902 (T07, sulit): IDEAL. Evaluasi diversifikasi terkait vs tidak terkait pada grup usaha; modelAnswer menyimpulkan sinergi dari diversifikasi yang tidak memiliki kecocokan stratejik.
- MSK-ESA-903 (T05, sedang): RUBRIK. Strategi fungsional pemasaran dan operasi; dua kriteria rubrik tidak terukur ("menjelaskan dengan baik dan lengkap") tanpa pembeda full/partial/zero.
- MSK-ESA-904 (T11, sulit): LUAR. Rencana perubahan organisasi saat otomasi; jawaban yang dinilai bergantung pada ketentuan atau angka yang tidak ada di stem.
Catatan khusus:
- Esai berbentuk analisis: analisis situasi, evaluasi minimal dua alternatif, rekomendasi beralasan.
- 3-6 kriteria rubrik berjumlah 10; acceptableAlternatives wajib.
Catatan umum:
- Ikuti docs/msk_taksonomi.md (T01-T12, K01-K06).
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi. Hindari skenario yang mirip soal MSK yang sudah ada (MSK-MCQ-001 s.d. 120, MSK-ESA-001 s.d. 045, MSK-KAS-001 s.d. 027) dan batch sebelumnya di percakapan ini.
- Konteks ekonomi Indonesia dan global 2023-2026 seperti soal biasa: fakta terverifikasi boleh disebut dengan tanggal dan sumbernya; fakta yang tidak dapat dipastikan dijadikan skenario hipotetis; angka pasar ditulis "diasumsikan"; perusahaan dan tokoh fiktif. Semua informasi untuk menjawab ada di soal, KECUALI pada cacat LUAR yang memang sengaja menghilangkannya.
- Tema pilihan: suku bunga tinggi lalu turun; pelemahan rupiah; tarif resiprokal Amerika Serikat (diumumkan 2 April 2025) dan relokasi rantai pasok; hilirisasi dan baterai; restrukturisasi BUMN di bawah BPI Danantara (24 Februari 2025); daya beli kelas menengah melemah; PHK dan otomasi; ekonomi digital dan AI generatif; transisi energi dan ESG; gagal bayar lembaga keuangan nonbank; gangguan logistik dan geopolitik.
```

## 3. MSK-B92 (case)
```
FORMULIR BATCH KALIBRASI
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B92
Tipe: case | Jumlah: 1 | ID mulai: MSK-KAS-901
Sebaran topik: MSK-KAS-901 T04, T05
Sebaran kesulitan: sedang 1
Ukuran kasus: mini
Level kognitif: C3-C5
Sebaran cacat:
- MSK-KAS-901: DATA. Jaringan ritel kebutuhan rumah tangga menghadapi daya beli melemah. Satu total di caseData (mis. total pendapatan per segmen) tidak sama dengan jumlah rinciannya, dan selisih itu mengubah rekomendasi pada satu sub-pertanyaan. modelAnswer memakai angka total tanpa menyinggung selisih.
Catatan khusus:
- Data lain di caseData konsisten. Total skor 20; rujukan kriteria di acceptableAlternatives menyebut bagiannya, mis. "(b) C2".
Catatan umum:
- Ikuti docs/msk_taksonomi.md (T01-T12, K01-K06).
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi. Hindari skenario yang mirip soal MSK yang sudah ada (MSK-KAS-001 s.d. 027) dan batch sebelumnya di percakapan ini.
- Konteks ekonomi Indonesia 2023-2026 seperti soal biasa: angka pasar ditulis "diasumsikan"; perusahaan dan tokoh fiktif; semua informasi untuk menjawab ada di kasus.
```

## 4. MSK-B93 (case)
```
FORMULIR BATCH KALIBRASI
Mata ujian: Manajemen Stratejik dan Kepemimpinan (subjectId: msk)
Batch ID: MSK-B93
Tipe: case | Jumlah: 1 | ID mulai: MSK-KAS-902
Sebaran topik: MSK-KAS-902 T02, T03, T07
Sebaran kesulitan: sulit 1
Ukuran kasus: komprehensif
Level kognitif: C4-C6
Sebaran cacat:
- MSK-KAS-902: IDEAL. Grup agribisnis fiktif menimbang integrasi vertikal ke hilir saat harga komoditas menurun dan suku bunga mulai turun. Pada satu sub-pertanyaan (bukan yang pertama), modelAnswer menarik kesimpulan yang keliru dari analisis yang benar (mis. menyimpulkan alternatif yang NPV atau kecocokan stratejiknya lebih rendah sebagai pilihan terbaik), dan rubrik sub itu memberi skor penuh untuk kesimpulan keliru tersebut.
Catatan khusus:
- Kasus komprehensif mengintegrasikan 3 topik dan menuntut analisis, evaluasi alternatif, risiko, implikasi keuangan, dan rekomendasi. Data di caseData konsisten.
- Total skor 20; rubrik tiap sub = maxScore sub; rujukan kriteria di acceptableAlternatives menyebut bagiannya.
Catatan umum:
- Ikuti docs/msk_taksonomi.md (T01-T12, K01-K06).
- Jangan menyalin contoh, nama perusahaan, atau angka dari modul dan soal resmi. Hindari skenario yang mirip soal MSK yang sudah ada (MSK-KAS-001 s.d. 027) dan batch sebelumnya di percakapan ini.
- Konteks ekonomi Indonesia 2023-2026 seperti soal biasa: angka pasar ditulis "diasumsikan"; perusahaan dan tokoh fiktif; semua informasi untuk menjawab ada di kasus.
```
