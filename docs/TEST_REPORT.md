# TEST REPORT — Simulator Ujian CA (Fase A5, 2026-10-17)

Status: **DIUJI-LULUS** = dijalankan dan lulus; **DIUJI-GAGAL** = dijalankan dan
gagal; **BELUM DIVERIFIKASI** = belum dijalankan atau tidak dapat dijalankan di
lingkungan ini. Tidak ada klaim lulus tanpa uji yang benar-benar dijalankan.

## Lingkungan uji

| Pelari | Keterangan |
|---|---|
| Self-test browser bawaan | `index.html?selftest` di Chromium 152 (browser pane aplikasi Claude), server statis lokal: **87/87 PASS** |
| Self-test Microsoft Edge | Suite yang sama di Edge headless (Chromium) lewat DevTools Protocol, profil sementara: **87/87 PASS, 0 dilewati** |
| Uji alur Edge | Skrip DevTools Protocol: alur T1 penuh, penilaian, ekspor, Kustom, Pengaturan, Panduan, bank soal; error konsol dan exception dicatat |
| Microsoft Word dan Excel | Otomasi COM (tersembunyi, peringatan aktif, batas waktu) untuk membuka contoh .docx/.xlsx dan mengekspor PDF |
| `node --test`, `node tools/validate.mjs` | **Tidak dijalankan**: Node.js tidak terpasang di komputer pengembangan. Suite tesnya sama dengan self-test (D-32) |
| Playwright (chromium/webkit) | **Tidak tersedia** (butuh Node.js) |
| Lighthouse | **Tidak tersedia** (butuh Node.js); diganti pemeriksaan installability Chromium |

## Skenario wajib SPEC 13

| ID | Skenario | Cara uji | Hasil | Status |
|---|---|---|---|---|
| TS-01 | Muat pack demo | Self-test "pack demo valid, 0 error, hash cocok, T1 demo dapat dibentuk" | 0 error, contentHash 5 soal cocok | DIUJI-LULUS |
| TS-02 | Pack dengan jumlah rubrik salah | Self-test Bank soal: rubrik esai dijumlah 11; rubrik sub (b) kasus salah di batch | Ditolak; pesan menyebut `DEMO-ESA-001` / ID soal dan path `rubric` | DIUJI-LULUS |
| TS-03 | Bangun SIM dari pack uji 60/15/10 | Self-test, 10 seed | 17/5/2 soal, total 100,00, kasus 16 dan 17 komprehensif | DIUJI-LULUS |
| TS-04 | Kustom 7/3/1 bobot 30/40/30 | Self-test | Total 100,00; tiap bagian = bobotnya | DIUJI-LULUS |
| TS-05 | Opsi diacak, pilih kunci asli | Self-test, 20 seed | Dinilai benar; huruf lain dinilai salah | DIUJI-LULUS |
| TS-06 | Dibuka ulang setelah deadline | Self-test `recoverOnOpen` | Terkunci, `EXPIRED_ON_REOPEN`, sesi valid skema | DIUJI-LULUS |
| TS-07 | Jeda 2 menit mode latihan | Self-test | Sisa waktu sama; deadline bergeser 2 menit | DIUJI-LULUS |
| TS-08 | Impor penilaian checksum salah | Self-test + uji layar (A2) | Ditolak; `$.answersChecksum: tidak cocok…`; tidak ada yang tersimpan | DIUJI-LULUS |
| TS-09 | Impor skor > maks | Self-test (kriteria, soal, sub) + uji layar | Ditolak; path mis. `$.scores[0].criteriaScores[1].awardedScore` | DIUJI-LULUS |
| TS-10 | Kriteria tidak menjumlah | Self-test | Diterima; skor = jumlah kriteria; `sumMismatch` + peringatan | DIUJI-LULUS |
| TS-11 | Nilai 69,996 | Self-test lewat impor nyata (esai 8,5 × 11,76/10) | TIDAK LULUS, tampil `69,9960` | DIUJI-LULUS |
| TS-12 | Nilai 70,00 | Self-test lewat impor nyata | LULUS, tampil `70,0000` | DIUJI-LULUS |
| TS-13 | Ubah stem soal APPROVED | Self-test (edit langsung + impor batch revisi soal LIVE) | Kembali DRAFT, hash berubah, persetujuan dikosongkan, riwayat tetap | DIUJI-LULUS |
| TS-14 | 50 kali generate paket | Self-test T1/T2/SIM/Kustom × 50 | 0 soal non-LIVE (> 2.000 soal diperiksa) | DIUJI-LULUS |
| TS-15 | Ekspor .docx dan .xlsx | Self-test (ZIP, CRC, entri wajib, XML well-formed) + Word/Excel membuka contoh `tests/output/` dan ekspor PDF | ZIP valid, XML valid; Word 8 halaman, Excel 7 sheet, tanpa dialog perbaikan | DIUJI-LULUS |
| TS-16 | Jawaban berisi `<script>` | Self-test DOM: render soal, laporan di layar; HTML/.docx/.xlsx/CSV | Tampil sebagai teks; 0 elemen sisipan; skrip tidak berjalan | DIUJI-LULUS |
| TS-17 | numeric toleransi 1%, kunci 100 | Self-test | 99,2 benar; 98 salah | DIUJI-LULUS |
| TS-18 | Sesi schemaVersion lama | Self-test | Ditolak dengan pesan versi; data tidak dihapus; dapat dilepas | DIUJI-LULUS |
| TS-19 | Kalibrasi di-APPROVE reviewer | Self-test + uji layar (A3) | Seluruh hasil batch ditolak, soal tetap DRAFT, statistik "lolos" +1 | DIUJI-LULUS |
| TS-20 | Muat ulang offline setelah kunjungan pertama | (1) Self-test: service worker asli di lingkungan tiruan; (2) Edge nyata: kunjungan pertama, **server dimatikan**, muat ulang | 65 aset ter-cache; beranda dan pack demo terbuka tanpa server | DIUJI-LULUS |
| TS-21 | Versi baru saat sesi berjalan | (1) Self-test lingkungan tiruan; (2) Edge nyata: mulai ujian → `service-worker.js` diubah → muat ulang di tengah ujian → kumpulkan → Muat Ulang | Selama ujian: versi baru menunggu, spanduk tidak tampil, versi lama tetap dilayani. Setelah dikumpulkan: spanduk tampil; Muat Ulang memasang versi baru dan cache lama dihapus | DIUJI-LULUS |

## Uji tambahan

| ID | Skenario | Cara uji | Hasil | Status |
|---|---|---|---|---|
| UT-01 | Alur T1 tanpa error konsol (Definition of Done) | Edge: T1 (jawab 5 soal, tandai, Daftar Soal, jeda/lanjut, Fokus, kumpulkan) → Salin Prompt + Data → impor hasil → koreksi manual → 12 unduhan → Riwayat → Kustom → Pengaturan → Panduan → bank soal sampai publikasi | Semua langkah berhasil; **0 error/peringatan konsol, 0 exception** | DIUJI-LULUS |
| UT-02 | Tombol inert | Pemeriksaan kode semua `h('button')` + penjelajahan layar | Semua tombol punya aksi; MULAI Kustom nonaktif dengan alasan tertulis | DIUJI-LULUS |
| UT-03 | Teks teknis di layar peserta | Penjelajahan layar (beranda, pengaturan, panduan, riwayat, kustom, ujian, hasil) mencari JSON/HTML/null/undefined/[object…] | "(JSON)", "(HTML)", "pack.json" diganti bahasa awam di A5; tidak ada null/undefined | DIUJI-LULUS |
| UT-04 | Versi satu berkas dari file:// | Edge membuka `dist/simulator-offline.html` dari `file://`, menjalankan T1 sampai Hasil | Beranda, ujian, hasil tampil; 0 error | DIUJI-LULUS |
| UT-05 | Kelayakan instalasi PWA | Edge `Page.getInstallabilityErrors`, `Page.getAppManifest` | 0 error installability, 0 error manifest; ikon 192/512/180 terbaca | DIUJI-LULUS |
| UT-06 | Lebar ponsel 375 px | Emulasi viewport: hasil, riwayat, bank soal | Tanpa geser horizontal | DIUJI-LULUS |
| UT-07 | Fallback .doc di Word | Word membuka salinan `laporan-demo-fallback.doc` (A2 QA) | 10 halaman, 453 paragraf, PDF terekspor | DIUJI-LULUS |
| UT-08 | Perbaikan QA ekspor pemilik (15 butir) | Suite "Ekspor (QA A2)" + Word/Excel (A4 lanskap, judul berulang, tanggal Excel, footer, tabel tidak terbelah) | Semua butir lulus; lihat `docs/qa/qa-ekspor-a2.md` | DIUJI-LULUS |
| UT-09 | Sinkronisasi berkas turunan | Self-test: schemas.js, prompts.js, pack.js, ikon (piksel), service-worker.js, dist | Semua sinkron | DIUJI-LULUS |
| UT-10 | Keselarasan prompt dengan skema | Pemeriksaan manual Prompt B/C/D terhadap batch/review-result/grading-result | Prompt C diperbaiki (batchId disalin persis); B dan D selaras | DIUJI-LULUS |

## Uji manual SPEC 13 dan hal yang belum diverifikasi

| ID | Skenario | Status | Catatan |
|---|---|---|---|
| UM-01 | Alur T1 penuh di iPhone nyata | BELUM DIVERIFIKASI | Deteksi iOS, ajakan Layar Utama, mode Fokus, safe-area hanya dites dengan user agent tiruan |
| UM-02 | Alur T1 penuh di iPad nyata | BELUM DIVERIFIKASI | |
| UM-03 | Alur T1 penuh di Windows (Edge/Chrome, pengguna nyata) | BELUM DIVERIFIKASI | Diuji otomatis di Edge headless (UT-01), belum oleh pengguna |
| UM-04 | Buka .docx/.xlsx di Word/Excel | DIUJI-LULUS | Otomasi Word/Excel + pemeriksaan pemilik (`docs/qa/qa-ekspor-a2.md`); perbaikan diterapkan |
| UM-05 | Buka .docx/.xlsx di aplikasi Files iOS | BELUM DIVERIFIKASI | |
| UM-06 | Satu putaran penilaian dengan AI nyata | BELUM DIVERIFIKASI | Semua hasil penilaian di tes adalah data sintetis |
| UM-07 | Satu putaran review dengan AI nyata (Prompt C) | BELUM DIVERIFIKASI | Semua batch dan hasil review di tes adalah data sintetis |
| UM-08 | Aplikasi di Safe Exam Browser | BELUM DIVERIFIKASI | Lencana diuji dengan user agent tiruan; pengaturan contoh belum dicoba |
| UM-09 | `node --test` dan `node tools/validate.mjs` | BELUM DIVERIFIKASI | Node.js tidak terpasang |
| UM-10 | Playwright webkit (pendekatan Safari) | BELUM DIVERIFIKASI | Tidak tersedia |
| UM-11 | Lighthouse PWA | BELUM DIVERIFIKASI | Diganti UT-05 |
| UM-12 | Aplikasi tayang di GitHub Pages (HTTPS) | BELUM DIVERIFIKASI | Menunggu repositori GitHub dibuat pemilik |
| UM-13 | Cetak PDF dari aplikasi (`window.print`) | BELUM DIVERIFIKASI | CSS cetak ada; dialog cetak tidak dapat diuji otomatis |
| UM-14 | Salin otomatis ke papan klip | BELUM DIVERIFIKASI | Ditolak di browser uji (klik sintetis); jalur "Salin secara manual" lulus |

Tidak ada skenario berstatus DIUJI-GAGAL pada akhir Fase A5.

---

## Fungsi yang benar-benar terimplementasi

**Ujian**
- Beranda: pemilih mata ujian (bila > 1 pack), kartu T1/T2/SIM/Kustom dengan durasi, jumlah soal, passing grade; satu tombol MULAI; kartu Lanjutkan Ujian; menu ⋯ (Riwayat, Pengelola Bank Soal, Pengaturan, Panduan).
- Pembentuk paket: soal LIVE saja, acak soal/opsi, largest remainder, faktor skala, aturan kesulitan dan cakupan, pesan kekurangan soal; Mode Kustom (durasi 15-240, jumlah, filter kesulitan/topik, bobot total 100, peringatan estimasi waktu).
- Sesi: disimpan sebelum timer berjalan; deadline; mode ketat/latihan dengan jeda; peringatan 15/5/1 menit (suara opsional); kumpul otomatis; EXPIRED_ON_REOPEN; deteksi lompatan jam; log (start, answer_changed tanpa isi, flag, pause, resume, warning, focus_lost, clock_anomaly, submit); satu sesi aktif per mata ujian; peringatan beforeunload.
- Ruang ujian gaya SEB: bilah tipis, Daftar Soal (panel bawah di ponsel), tanda soal, penghitung kata, "Tersimpan HH:MM:SS", tab Kasus | Jawaban di ponsel, layar penuh (Windows/iPad) atau mode Fokus (iPhone).
- Tipe soal mcq, essay, case, numeric (toleransi absolut/relatif, koma desimal).

**Penilaian dan laporan**
- PG/numerik otomatis; esai/kasus lewat ekspor-impor AI: pemberitahuan privasi, Salin Prompt + Data (Prompt D tertanam), unduh teks/berkas data, validasi impor lengkap SPEC 10, status MENUNGGU → SEBAGIAN → FINAL, nilai dihitung aplikasi, koreksi manual beralasan.
- Laporan di layar dan ekspor .docx (sampul, rekap, analisis, pembahasan, remedial, lampiran, footer), Lembar Belajar, .xlsx (7 sheet), PDF (cetak), berkas data sesi (dapat diimpor ulang), HTML satu berkas, fallback .doc dan .csv; penulis ZIP + CRC-32 sendiri.
- Riwayat dengan grafik tren SVG per paket.

**Bank soal**
- PIN lokal; impor batch dengan lint per ID/field; contentHash; siklus status ditegakkan; daftar, filter, pratinjau, statistik (topik, kesulitan, posisi kunci); paket review dengan reviewKey dan kalibrasi tersembunyi; impor hasil review, keputusan otomatis, pemeriksaan kalibrasi, statistik per reviewer; review ganda dengan keputusan manusia; Setujui (inisial), Publikasikan (versi minor, changelog), Ekspor Pack; impor soal kalibrasi.

**Platform**
- PWA: manifest, ikon, service worker berversi (offline), notifikasi pembaruan di luar ujian, kunci sesi; versi satu berkas untuk file://; iOS: ajakan Layar Utama, storage.persist, petunjuk unduhan, safe-area; lencana SEB; Pengaturan: impor Subject Pack, cadangan sesi ekspor/impor, status penyimpanan.
- Kontrak data: JSON Schema + validator sendiri, migrasi/penolakan versi, aturan konsistensi.

## Keterbatasan (diungkapkan juga di Panduan dan laporan)

- Kunci jawaban dapat dilihat oleh siapa pun yang membuka kode sumber.
- Aplikasi tidak mengunci perangkat; gunakan SEB. Deteksi SEB lewat user agent.
- JavaScript tidak berjalan saat aplikasi ditutup; tenggat diperiksa saat dibuka kembali.
- Deteksi perubahan jam perangkat tidak sempurna (selisih > 60 detik saja).
- Data hanya di perangkat ini; dapat hilang bila data browser dibersihkan atau Safari menghapusnya. Cadangan wajib manual.
- Penilaian uraian bergantung pada layanan AI pihak ketiga; aplikasi memvalidasi bentuk dan batas skor, bukan kebenaran isi penilaian.
- PIN Pengelola Bank Soal bukan fitur keamanan.
- Bank soal MSK belum ada; hanya pack DEMO (5 soal) yang terpasang.
- Pengujian di perangkat Apple, SEB, AI nyata, dan Node.js belum dilakukan (lihat tabel di atas).
