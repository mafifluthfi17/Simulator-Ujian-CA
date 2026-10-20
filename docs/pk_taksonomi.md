# Taksonomi Pack PK — Pelaporan Korporat

> **STATUS: DISETUJUI PEMILIK (D-80, 2026-10-20).** Topik mengikuti daftar isi
> Modul CA Pelaporan Korporat IAI (cetakan 8, Oktober 2025). Setelah soal pertama
> diimpor, kode topik dan kompetensi tidak diubah lagi.

Berkas pack: `packs/pk/pack.json` (versi 1.0.0). Setelah disetujui, unggah
dokumen ini ke pengetahuan Project Claude (penyusun) dan Project ChatGPT
(reviewer) bersama `schema/CONTRACT.md`. Kode di bawah adalah satu-satunya kode
yang boleh dipakai di `topicIds` dan `competencyIds` soal PK.

Prefiks ID soal: `PK-MCQ-nnn`, `PK-NUM-nnn`, `PK-ESA-nnn`, `PK-KAS-nnn`.

## Topik (14 = 14 bab modul)

| Kode | Topik | Subbab modul | Standar utama (nomor baru, nomor lama) | Kompetensi utama |
|---|---|---|---|---|
| T01 | Standar pelaporan keuangan, konvergensi IFRS, dan kerangka konseptual | 1.1-1.5 | Kerangka Konseptual Pelaporan Keuangan | K01 |
| T02 | Etika dan tata kelola perusahaan | 2.1-2.2 | Kode Etik Profesi; pedoman tata kelola | K05 |
| T03 | Penyajian laporan keuangan: kebijakan akuntansi, estimasi, kesalahan, mata uang fungsional, pihak berelasi, laba per saham, peristiwa setelah periode pelaporan, dan laporan interim | 3.1-3.9 | 201 (1), 208 (25), 221 (10), 224 (7), 233 (56), 210 (8), 234 (3) | K01, K02 |
| T04 | Aset lancar: persediaan dan aset tidak lancar dikuasai untuk dijual | 4.1-4.3 | 202 (14), 105 (58) | K01 |
| T05 | Aset tidak lancar: properti investasi, aset tetap, aset takberwujud, aset biologis, aset tambang, hibah pemerintah, aset dari pelanggan, dan penurunan nilai | 5.1-5.9 | 240 (13), 216 (16), 238 (19), 241 (69), 106 (64), 220 (61), 236 (48) | K01, K04 |
| T06 | Sewa | 6.1-6.2 | 116 (73) | K01, K04 |
| T07 | Instrumen keuangan | 7.1-7.9 | 232 (50), 109 (71), 107 (60) | K01, K04 |
| T08 | Imbalan kerja, provisi, dan kontinjensi | 8.1-8.9 | 219 (24), 237 (57) | K01 |
| T09 | Pajak penghasilan | 9.1-9.3 | 212 (46) | K01, K02 |
| T10 | Kombinasi bisnis dan konsolidasi | 10.1-10.5 | 103 (22), 110 (65) | K02 |
| T11 | Investasi pada entitas lain: entitas asosiasi, ventura bersama, dan pengaturan bersama | 11.1-11.4 | 228 (15), 111 (66), 227 (4) | K02, K04 |
| T12 | Pendapatan dari kontrak dengan pelanggan | 12.1-12.2 | 115 (72) | K01, K04 |
| T13 | Analisis laporan keuangan: financial shenanigans dan deteksi fraud | 13.1-13.6 | Analisis rasio | K03 |
| T14 | Pelaporan keberlanjutan dan pelaporan terintegrasi | 14.1-14.3 | Pelaporan keberlanjutan; kerangka pelaporan terintegrasi | K05 |

### Aturan penomoran PSAK
- Sejak 1 Januari 2024 berlaku penomoran baru: standar setara IAS *n* menjadi
  PSAK 200+*n*, dan standar setara IFRS *n* menjadi PSAK 100+*n*.
- **Wajib** di soal: tulis nomor baru dengan nomor lama dalam kurung,
  mis. "PSAK 228 (15)". Format ini sama dengan slide kuliah FEB Untar PPAk 2026
  di folder materi.
- Nomor di tabel di atas disusun dari aturan tersebut. Nomor yang tercantum di
  judul slide (201, 202, 207, 221, 224, 228, 237, 240) cocok dengan tabel; nomor
  lainnya **perlu dicek pemilik**.

### Catatan cakupan
- **Laporan arus kas** (PSAK 207 (2)) ada di slide materi tetapi tidak menjadi
  subbab tersendiri di daftar isi modul. Usulan: masukkan soal arus kas ke T03.
- Contoh ujian 2015 dan 2016-2017 memuat soal **akuntansi syariah** (LKS,
  BPRS, bank syariah) dan **sektor publik** (SATKER, pemerintah daerah). Topik
  ini tidak ada di modul 2025 sehingga **tidak dimasukkan** ke taksonomi.
  Penyusun soal tidak boleh membuat soal dengan topik tersebut.
- Contoh ujian lama juga memakai istilah PSAK 55 dan kategori "pinjaman yang
  diberikan dan piutang" yang sudah diganti. Soal baru wajib mengikuti PSAK 109 (71).

## Kompetensi (5)

| Kode | Kompetensi |
|---|---|
| K01 | Menerapkan kerangka konseptual dan standar akuntansi keuangan untuk pengakuan, pengukuran, penyajian, dan pengungkapan transaksi |
| K02 | Menyusun laporan keuangan entitas tunggal dan konsolidasian |
| K03 | Menganalisis laporan keuangan, termasuk mendeteksi rekayasa akuntansi dan indikasi fraud |
| K04 | Mengevaluasi perlakuan akuntansi alternatif dan pertimbangan profesional beserta dampaknya pada laporan keuangan |
| K05 | Menerapkan prinsip etika, tata kelola, serta pelaporan keberlanjutan dan terintegrasi |

Kompetensi disusun tanpa RPS/CPMK dan sudah disetujui pemilik.

## Sumber
- Modul CA Pelaporan Korporat, IAI, cetakan 8 (Oktober 2025): daftar isi dan
  foto bab di `Materi Pelaporan Korposat/`. Bab 5, 7, dan 8 belum lengkap.
- Slide kuliah Pelaporan Korporat FEB Untar PPAk (PPTX di folder yang sama).
- Contoh ujian CA Pelaporan Korporat 2015 dan 2016-2017 (PDF, folder `Contoh Soal`).

Materi ini berhak cipta dan dipakai hanya sebagai rujukan cakupan. Isinya tidak
disalin ke repositori. Folder materi tidak di-commit.
