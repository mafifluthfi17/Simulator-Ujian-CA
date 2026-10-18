# Taksonomi Pack PK — Pelaporan Korporat

> **STATUS: USULAN SEMENTARA (D-80), belum disetujui pemilik.** Kode di bawah
> disusun dari pengetahuan umum cakupan pelaporan korporat (SAK Indonesia),
> **bukan** dari RPS/silabus resmi. Wajib dicocokkan dengan RPS dan modul PK
> sebelum batch soal pertama dibuat; setelah soal pertama diimpor, kode topik
> sebaiknya tidak diubah lagi.

Berkas pack: `packs/pk/pack.json` (versi 1.0.0). Setelah disetujui, unggah
dokumen ini ke pengetahuan Project Claude (penyusun) dan Project ChatGPT
(reviewer) bersama `schema/CONTRACT.md`. Kode di bawah adalah satu-satunya kode
yang boleh dipakai di `topicIds` dan `competencyIds` soal PK.

Prefiks ID soal: `PK-MCQ-nnn`, `PK-NUM-nnn`, `PK-ESA-nnn`, `PK-KAS-nnn`.

## Topik (12)

| Kode | Topik | Kompetensi utama | Rujukan standar (perlu dicek pemilik) |
|---|---|---|---|
| T01 | Kerangka konseptual, penyajian laporan keuangan, kebijakan akuntansi, estimasi, kesalahan, dan peristiwa setelah periode pelaporan | K01, K02 | Kerangka Konseptual; penyajian LK; kebijakan akuntansi; peristiwa setelah periode pelaporan |
| T02 | Pendapatan dari kontrak dengan pelanggan | K01, K04 | Pendapatan dari kontrak dengan pelanggan |
| T03 | Persediaan, aset tetap, properti investasi, dan aset takberwujud | K01 | Persediaan; aset tetap; properti investasi; aset takberwujud |
| T04 | Penurunan nilai aset, aset dimiliki untuk dijual, dan operasi dihentikan | K01, K04 | Penurunan nilai aset; aset tidak lancar dimiliki untuk dijual |
| T05 | Sewa | K01, K04 | Sewa |
| T06 | Instrumen keuangan | K01, K04 | Instrumen keuangan: penyajian, pengakuan dan pengukuran, pengungkapan |
| T07 | Liabilitas, provisi, kontinjensi, dan imbalan kerja | K01 | Provisi, liabilitas dan aset kontinjensi; imbalan kerja |
| T08 | Pajak penghasilan | K01, K02 | Pajak penghasilan (pajak kini dan tangguhan) |
| T09 | Kombinasi bisnis dan laporan keuangan konsolidasian | K02 | Kombinasi bisnis; laporan keuangan konsolidasian |
| T10 | Investasi pada entitas asosiasi dan ventura bersama, serta pengaruh perubahan kurs valuta asing | K02, K04 | Entitas asosiasi dan ventura bersama; pengaturan bersama; perubahan kurs valuta asing |
| T11 | Laporan arus kas, laba per saham, segmen operasi, pihak berelasi, dan pengungkapan | K02, K03 | Laporan arus kas; laba per saham; segmen operasi; pihak berelasi |
| T12 | Pelaporan keberlanjutan, tata kelola pelaporan, dan analisis laporan keuangan | K03, K05 | Pelaporan keberlanjutan; tata kelola; analisis rasio |

Catatan penomoran: sejak 1 Januari 2024 SAK Indonesia memakai penomoran PSAK
baru (seri 100/200/300). Soal sebaiknya menyebut **nama** standar, atau nomor
baru dan lama sekaligus, agar tidak membingungkan. Penomoran yang dipakai ditetapkan pemilik.

## Kompetensi (5)

| Kode | Kompetensi |
|---|---|
| K01 | Menerapkan kerangka konseptual dan standar akuntansi keuangan untuk pengakuan, pengukuran, penyajian, dan pengungkapan transaksi |
| K02 | Menyusun laporan keuangan entitas tunggal dan konsolidasian |
| K03 | Menganalisis dan menginterpretasikan laporan keuangan untuk pengambilan keputusan |
| K04 | Mengevaluasi perlakuan akuntansi alternatif dan pertimbangan profesional beserta dampaknya pada laporan keuangan |
| K05 | Menjelaskan pelaporan keberlanjutan, tata kelola, dan isu etika dalam pelaporan korporat |

Bila RPS PK memuat CPMK, ganti K01-K05 dengan CPMK tersebut (seperti pack MSK,
D-78) sebelum batch pertama.
