# QA Ekspor Simulator CA — sesi demo-20261017-99d81897

Saya sudah memeriksa semua file ekspor: laporan (HTML, DOCX, fallback .doc), data hasil (XLSX dan fallback CSV), lembar belajar (DOCX), serta PDF hasil cetak dari Word dan Excel.
Semua perhitungan sudah dicek ulang dan BENAR: total 69,50, skor per kriteria, skala uraian (×3 dan ×2), capaian K01/K02/T01–T03 (skor soal multi-tag dibagi rata), toleransi EVA, dan margin segmen.
Isi kelima format konsisten satu sama lain. Daftar di bawah berisi perbaikan yang perlu dikerjakan, diurutkan dari prioritas tertinggi.

## P1 — Bug data/logika

1. **ID sesi di Riwayat tidak cocok dengan tanggal.** Pada sheet `Riwayat` (XLSX/CSV), sesi yang dikumpulkan pada *16 Oktober 2026* memakai ID `demo-20261017-3919b7e3`. Periksa generator ID sesi (dan data demo): tanggal dalam ID harus sama dengan tanggal mulai sesi.
2. **Konsep remedial terduplikasi.** "Pelajari ulang konsep: Balanced scorecard dan strategy map; Balanced scorecard" muncul di HTML, DOCX, XLSX, dan CSV, baik pada T02 maupun K01. Lakukan deduplikasi konsep, setidaknya secara case-insensitive. Lebih baik lagi, deduplikasi berdasarkan ID konsep, karena "Balanced scorecard" adalah bagian dari "Balanced scorecard dan strategy map".
3. **Ada celah pada batas kategori capaian.** Teks aturannya berbunyi "kuat ≥ 80%, cukup 70–79%, lemah < 70%", sehingga nilai seperti 79,5% tidak masuk kategori mana pun. Ubah teks menjadi "cukup 70% ≤ x < 80%" dan pastikan kodenya memakai batas yang sama.

## P2 — Tata letak cetak

4. **XLSX tercetak menjadi 24 halaman.** Tidak ada page setup, sehingga kolom terpecah ke banyak halaman (ukuran Letter, potret). Untuk setiap sheet, atur: `orientation=landscape`, `paperSize=A4`, `fitToPage=true`, `fitToWidth=1`, `fitToHeight=0`, `print_title_rows='1:1'`.
5. **Tabel opsi PG terpotong antarhalaman di DOCX.** Di Lembar Belajar, opsi A–B Soal 2 berada di halaman 1, sedangkan C–D di halaman 2. Tambahkan `keepNext` pada paragraf di setiap baris tabel, kecuali baris terakhir, dan pada paragraf soal sebelum tabel. `cantSplit` saja tidak cukup.
6. **Kolom sempit pada tabel rubrik DOCX.** Header terpotong menjadi "Bagia/n", "Kriter/ia", "Sebelu/m", dan "Sesud/ah". Sel koreksi manual "2,00 (AI 1,50) DIKOREKSI MANUAL" juga terlipat per kata. Lebarkan kolom Bagian/Kriteria/Sebelum/Sesudah (≥ 1,6 cm), atau singkat label penanda menjadi "2,00*" dan beri catatan kaki "*dikoreksi manual (AI 1,50)".
7. **DOCX tidak memiliki footer.** Tambahkan nomor halaman (field PAGE / NUMPAGES) dan ID sesi di footer pada Laporan dan Lembar Belajar.
8. **Fallback .doc (HTML) di Word:** `hr.page` tidak menghasilkan page break di Word, dan `white-space:pre-wrap` tidak didukung sehingga baris kosong di jawaban esai bisa hilang. Untuk versi .doc, ganti page break dengan `<br clear=all style="page-break-before:always">` dan pecah jawaban per paragraf (`<p>` per baris). Perlu diuji langsung di Word.

## P3 — Format dan konsistensi

9. **Format angka XLSX:** hitungan seperti "Meninggalkan layar (kali)" dan "Koreksi manual (berlaku)" tampil sebagai `1,00`, jadi ubah format menjadi `0`. Kolom "Capaian (%)" sebaiknya disimpan sebagai pecahan (0,657) dengan format `0.00%`. Sebaliknya, nilai saat ini (65,714286) tampil tanpa tanda %.
10. **Tanggal di XLSX berupa teks** ("17 Oktober 2026 pukul 08.00"), sehingga Riwayat tidak bisa diurutkan atau dibuat grafik. Simpan sebagai datetime asli dengan format tampilan `d mmmm yyyy hh.mm`. Teks boleh tetap dipakai di CSV.
11. **Label sub-jawaban tidak konsisten:** jawaban peserta memakai `[a]`/`[b]`, sedangkan jawaban ideal dan rubrik memakai `(a)`/`(b)` (sheet Uraian / CSV). Samakan semuanya menjadi `(a)`.
12. **"Alternatif yang dapat diterima" pada Soal 5 bisa ambigu:** "nilai penuh pada C3" tidak menyebut bagiannya, padahal C3 ada di bagian (a) maupun (b). Tulis "(b) C3". Lebih baik lagi, validasi di pack loader bahwa setiap rujukan kriteria pada soal multi-bagian mencantumkan bagiannya.
13. **Alasan penilai pada kriteria yang dikoreksi manual** masih menampilkan alasan AI. Tambahkan alasan koreksi manual di sel yang sama atau di bawahnya, misalnya "Koreksi: keempat ukuran relevan…", supaya pembaca tidak perlu membuka Lampiran B.
14. **Hierarki heading DOCX melompat** dari Heading 1 langsung ke Heading 3 ("Skor per komponen", Soal 1–3, dan judul remedial). Gunakan Heading 2 agar navigation pane dan daftar isi rapi.
15. **Lebar kolom sheet Uraian:** teks kolom `Penilai` meluber ke kolom berikutnya saat dicetak. Aktifkan `wrap_text` untuk semua kolom teks di sheet Uraian dan Rubrik.

## Tidak perlu diubah (sudah baik)

- CSV: memakai BOM UTF-8, pemisah `;`, dan desimal koma, sehingga cocok untuk Excel dengan locale Indonesia. Field multi-baris sudah di-quote dengan benar.
- Header tabel DOCX berulang di halaman berikutnya (`tblHeader`), freeze pane baris 1 di semua sheet sudah ada, dan disclaimer IAI muncul di semua format.
- Lembar Belajar benar-benar tidak memuat jawaban maupun nilai peserta.

## Catatan data demo (bukan bug kode, tapi cek di penilai sungguhan)

- Teks Kekuatan, Kelemahan, dan Saran identik untuk Soal 4 dan 5, dan "Membaca data" tidak relevan untuk esai tanpa data. Pastikan umpan balik hasil impor AI benar-benar dipetakan per soal, bukan disalin dari satu soal ke soal lain.
