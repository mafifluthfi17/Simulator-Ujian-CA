# Panduan Penggunaan — Simulator Ujian CA

Simulator ini untuk **latihan** ujian CA Indonesia (awalnya mata ujian Manajemen
Stratejik dan Kepemimpinan). Ini **bukan ujian resmi** dan **tidak berafiliasi
dengan IAI**. Passing grade 70 adalah standar latihan, bukan ketentuan resmi.

Alamat aplikasi: **https://mafifluthfi17.github.io/Simulator-Ujian-CA/**

---

## 1. Memasang dan membuka aplikasi

### Windows (Edge atau Chrome)
1. Buka alamat aplikasi di Edge atau Chrome.
2. Agar muncul sebagai aplikasi sendiri (disarankan): di bilah alamat klik ikon
   **Pasang aplikasi** (gambar monitor dengan panah), atau menu **⋯ › Aplikasi ›
   Pasang situs ini sebagai aplikasi**.
3. Setelah dibuka sekali saat online, aplikasi tetap bisa dibuka **tanpa
   internet**.
4. Tanpa internet sama sekali dan belum pernah membuka alamatnya? Pakai berkas
   `dist/simulator-offline.html` dari folder proyek: klik ganda, aplikasi
   terbuka di browser. Data di berkas ini terpisah dari versi online.

### iPhone dan iPad (Safari)
1. Buka alamat aplikasi di **Safari** (bukan Chrome).
2. Ketuk ikon **Bagikan** (kotak dengan panah ke atas) › **Tambahkan ke Layar
   Utama** › **Tambah**.
3. Selalu buka aplikasi dari ikon **Simulator CA** di Layar Utama. Dengan cara
   ini:
   - tampilan ujian penuh tanpa bilah Safari;
   - data latihan lebih aman. Safari dapat menghapus data situs yang lama tidak
     dibuka, kecuali situs itu dipasang ke Layar Utama.
4. Beranda menampilkan kartu **Pasang ke Layar Utama** sampai aplikasi dipasang.
   Ketuk **Nanti** untuk menyembunyikannya selama 14 hari.

---

## 2. Mengerjakan ujian

1. Di beranda pilih paket: **Training 1**, **Training 2**, **Simulasi Ujian**,
   atau **Kustom**. Kartu paket menyebut durasi, jumlah soal, dan passing grade.
2. Ketuk **MULAI**. Waktu berjalan sejak saat itu.
3. Di ruang ujian:
   - Bilah atas berisi nama paket, sisa waktu, **Daftar Soal**, dan **KUMPULKAN**.
   - **Daftar Soal** menunjukkan soal yang sudah dijawab dan yang ditandai (⚑).
   - **⚐ Tandai** untuk menandai soal yang ingin diperiksa lagi.
   - Jawaban tersimpan otomatis; lihat tulisan **Tersimpan HH:MM:SS**.
   - Soal kasus di ponsel: pindah antara tab **Kasus** dan **Jawaban**.
   - Soal numerik: pakai koma untuk desimal (mis. `47,8`). Aplikasi menampilkan
     angka yang terbaca.
   - **Jeda** hanya ada di mode latihan. Simulasi Ujian tidak dapat dijeda.
   - Windows/iPad: tombol **⛶** untuk layar penuh. iPhone: tombol **Fokus**
     menyembunyikan unsur yang tidak perlu.
4. Peringatan muncul saat sisa waktu 15, 5, dan 1 menit. Bunyi dapat dinyalakan
   di Pengaturan.
5. Ketuk **KUMPULKAN** bila selesai. Saat waktu habis, ujian dikumpulkan
   otomatis.
6. Bila aplikasi tertutup di tengah ujian, buka lagi dan ketuk **LANJUTKAN** di
   beranda. Bila waktunya sudah lewat, jawaban yang tersimpan dikumpulkan
   otomatis.
7. Meninggalkan layar ujian (pindah aplikasi/tab) dicatat di laporan sebagai
   informasi, bukan hukuman.

---

## 3. Menilai esai dan kasus dengan AI

Pilihan ganda dan numerik langsung dinilai. Esai dan kasus dinilai dengan
layanan AI pilihan Anda (mis. ChatGPT, Claude, Gemini). Aplikasi tidak punya AI
sendiri dan tidak mengirim data ke mana pun; Anda sendiri yang menyalin dan
menempel.

1. Di layar **Hasil Ujian**, bagian **Penilaian esai dan kasus**, ketuk
   **Salin Prompt + Data**. Baca pemberitahuan lalu ketuk **Saya mengerti, salin**.
   - Bila muncul kotak "Salin secara manual", pilih semua teks di kotak itu lalu
     salin.
2. Buka percakapan **baru** di layanan AI, tempel, lalu kirim.
3. Salin **seluruh** jawaban AI (diawali `{` dan diakhiri `}`).
4. Kembali ke aplikasi, tempel di kotak **Langkah 2** lalu ketuk
   **Periksa & Simpan Nilai**.
5. Bila ditolak, aplikasi menyebut bagian yang salah. Contoh: jawaban AI untuk
   sesi lain, skor melebihi maksimum, atau kriteria yang belum dinilai. Kirim
   pesan itu ke AI dan minta diperbaiki, lalu tempel lagi.
6. Status berubah dari **MENUNGGU PENILAIAN URAIAN** ke **PENILAIAN SEBAGIAN**
   (bila baru sebagian soal dinilai) dan akhirnya **FINAL**. Nilai akhir dan
   **LULUS/TIDAK LULUS** hanya tampil saat FINAL. Nilai dihitung aplikasi dari
   skor per kriteria, bukan dari total yang ditulis AI.
7. Tidak setuju dengan skor suatu kriteria? Di laporan bagian **4. Pembahasan
   Esai dan Kasus** ketuk **Koreksi skor kriteria**, isi skor baru dan alasan.
   Koreksi ditandai **DIKOREKSI MANUAL** di laporan.

---

## 4. Laporan dan unduhan

Di layar Hasil Ujian, bagian **Unduh laporan**:

| Tombol | Isi |
|---|---|
| **Word (.docx)** | Laporan & Pembahasan lengkap: rekap nilai, analisis kompetensi dan topik, pembahasan PG, esai, kasus, rencana remedial, lampiran |
| **Excel (.xlsx)** | Data hasil: Ringkasan, PG, Uraian, Rubrik, Kompetensi, Remedial, Riwayat |
| **PDF (cetak)** | Membuka dialog cetak; pilih "Simpan sebagai PDF" |
| **Lembar Belajar (.docx)** | Soal, kunci, pembahasan, dan rubrik tanpa jawaban Anda |
| **Halaman web** | Laporan dalam satu berkas yang dapat dibuka di browser |
| **Berkas data sesi** | Data lengkap sesi; dapat diimpor kembali (mis. ke perangkat lain) |

Bila berkas Word atau Excel tidak dapat dibuka, pakai **Format cadangan**: Word
sederhana (.doc) dan Tabel (.csv).

Di iPhone/iPad, setelah mengetuk tombol unduh pilih **Unduh** atau ikon
**Bagikan**, lalu **Simpan ke File**. Berkas dapat dibuka di aplikasi Files,
Word, atau Excel.

**Riwayat** (menu ⋯) menampilkan semua sesi dan grafik tren nilai per paket
untuk sesi yang sudah FINAL.

---

## 5. Cadangan data (penting)

Data hanya tersimpan di perangkat dan browser yang Anda pakai. Data dapat hilang
bila data browser dibersihkan, bila Safari menghapusnya, atau bila perangkat
rusak.

1. Menu **⋯ › Pengaturan › Cadangan sesi › Ekspor cadangan**: menyimpan semua
   sesi ke satu berkas. Lakukan secara berkala, misalnya setiap selesai latihan.
2. Untuk memulihkan atau memindahkan ke perangkat lain: **Impor cadangan**, lalu
   pilih berkasnya. Aplikasi meminta konfirmasi bila ada sesi yang akan ditimpa.
3. Pengaturan juga menunjukkan apakah browser memberi **penyimpanan permanen**.

---

## 6. Memperbarui aplikasi

Bila ada versi baru, muncul tulisan **Versi baru tersedia — Muat Ulang**.
Tulisan ini tidak pernah muncul selama ujian berjalan, dan aplikasi tidak
berganti versi di tengah ujian. Ketuk **Muat Ulang** saat tidak sedang ujian.

---

## 7. Keterbatasan

- Kunci jawaban dapat dilihat oleh siapa pun yang membuka kode sumber aplikasi.
- Aplikasi tidak mengunci perangkat. Untuk suasana ujian yang terkunci, pakai
  Safe Exam Browser (lihat `docs/seb/panduan_seb.md`).
- Aplikasi tidak berjalan saat ditutup; tenggat waktu diperiksa saat dibuka
  kembali.
- Deteksi perubahan jam perangkat tidak sempurna.
- Data hanya ada di perangkat ini dan dapat hilang bila data browser dibersihkan.
- Penilaian esai dan kasus bergantung pada layanan AI pihak ketiga pilihan Anda.
  Hasilnya dapat keliru; periksa alasannya dan koreksi bila perlu.
- Pengelola Bank Soal dilindungi PIN hanya untuk mencegah salah tekan. PIN
  bukan fitur keamanan.
