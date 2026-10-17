# Panduan Safe Exam Browser (SEB) — Simulator Ujian CA

> **Status: BELUM DIVERIFIKASI.** Langkah dan pengaturan di bawah disusun dari
> dokumentasi umum SEB dan belum diuji di SEB nyata (Windows maupun iOS). Uji
> dulu dengan satu sesi Training sebelum dipakai untuk simulasi.

Simulator ini **tidak mengunci perangkat**. Penguncian (layar penuh, pemblokiran
aplikasi lain, pintasan keyboard) dilakukan oleh Safe Exam Browser. Aplikasi
hanya menampilkan lencana **"Berjalan di SEB"** bila user agent browser memuat
`SEB/<versi>`; lencana itu informasi, bukan bukti keamanan.

## 1. Yang perlu disiapkan

- Alamat aplikasi (GitHub Pages): `https://mafifluthfi17.github.io/Simulator-Ujian-CA/`.
- Buka alamat itu sekali di browser biasa agar terlihat berfungsi.
- Berkas contoh pengaturan: [`contoh-pengaturan-seb.xml`](contoh-pengaturan-seb.xml).

## 2. Windows 10/11

1. Unduh SEB untuk Windows dari situs resmi `safeexambrowser.org` (bagian
   Download). Pasang dengan akun administrator.
2. Buka **SEB Configuration Tool** (terpasang bersama SEB).
3. Tab **General**: isi **Start URL** dengan alamat aplikasi. Kosongkan atau isi
   **Quit/Unlock password** sesuai kebutuhan (simpan di tempat aman).
4. Tab **Browser**: pilih **Allow downloads** (agar laporan Word/Excel dan
   cadangan sesi dapat diunduh) dan tentukan folder unduhan.
5. Tab **Exam** / **Browser**: matikan pembersihan data saat mulai/selesai bila
   tersedia (mis. *Clear session cookies/browser data on start/end*). SEB dapat
   menghapus data browser, termasuk riwayat ujian di aplikasi ini; selalu
   **unduh cadangan sesi** di Pengaturan sebelum dan sesudah ujian.
6. Tab **Appearance**: pilih tampilan layar penuh (*Full screen*).
7. Simpan sebagai berkas `.seb` (tanpa enkripsi untuk latihan, atau dengan sandi
   pengaturan bila dibagikan).
8. Klik ganda berkas `.seb` untuk memulai SEB. Aplikasi terbuka di layar penuh;
   lencana **Berjalan di SEB** tampil di beranda dan di bilah ruang ujian.

## 3. iPhone dan iPad

1. Pasang **SafeExamBrowser** dari App Store.
2. Buka SEB, pilih pengaturan dengan memindai QR code atau membuka tautan/berkas
   `.seb` (dari Windows: simpan berkas `.seb` di iCloud Drive lalu buka di
   aplikasi Files dan pilih "Bagikan › SEB").
3. Di iPad, aktifkan **Mode Akses Terpandu (Guided Access)** atau **AAC
   (Automatic Assessment Configuration)** bila SEB menawarkannya.
4. Start URL dan pengaturan unduhan mengikuti bagian Windows di atas.
5. Catatan: data aplikasi di SEB iOS terpisah dari Safari dan dari ikon di
   Layar Utama. Sesi yang dimulai di SEB hanya terlihat di SEB.

## 4. Menjalankan aplikasi sebagai halaman awal

- Start URL harus alamat **https** aplikasi (bukan `file://`). Versi satu berkas
  `dist/simulator-offline.html` tidak disarankan untuk SEB.
- Setelah SEB terbuka, pilih paket dan tekan MULAI seperti biasa. Tombol
  Layar Penuh di aplikasi tidak diperlukan karena SEB sudah layar penuh.
- Untuk keluar: kumpulkan ujian, unduh laporan/cadangan, lalu tutup SEB dengan
  tombol Keluar SEB (dan sandi keluar bila diatur).

## 5. Keterbatasan

- Aplikasi tidak mengunci perangkat; tanpa SEB peserta dapat berpindah aplikasi.
  Aplikasi hanya mencatat kejadian "meninggalkan layar ujian" sebagai informasi.
- Deteksi SEB lewat user agent dapat dipalsukan dan dapat tidak muncul bila
  pengaturan SEB mengubah user agent.
- Kunci jawaban tetap dapat dilihat oleh siapa pun yang membuka kode sumber.
