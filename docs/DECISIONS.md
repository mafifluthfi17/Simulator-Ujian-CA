# DECISIONS — keputusan desain di luar SPEC

Status: **DISETUJUI** (oleh pemilik), **USULAN** (menunggu persetujuan),
**TEKNIS** (detail implementasi; dapat diubah tanpa persetujuan bila dicatat).

## Fase A0

| ID | Keputusan | Alasan | Status |
|---|---|---|---|
| D-01 | Validator JSON Schema ditulis sendiri (`js/core/jsonschema.js`, subset draft 2020-12), tanpa Ajv. `devDependencies` kosong. | Aplikasi tidak boleh memuat library; satu validator yang sama dipakai browser dan `tools/validate.mjs`, jadi aturan tidak bisa berbeda. Kata kunci di luar subset ditolak saat skema dimuat. | TEKNIS |
| D-02 | `package.json` memakai `"type": "module"`, Node >= 20. | Modul `js/core/*.js` dapat diimpor langsung oleh tes Node. | TEKNIS |
| D-03 | Semua objek memakai `additionalProperties: false`: field yang tidak dikenal ditolak. | Menangkap salah ketik dan field karangan AI sejak impor. Konsekuensi: keluaran AI dengan field tambahan harus diperbaiki sebelum diimpor. | DISETUJUI (2026-10-16) |
| D-04 | `maxScore` dikunci per tipe: mcq 1, numeric 1, essay 10, case 20. | SPEC 5.2 dan Prompt B menetapkan skala asli; skala paket diatur faktor skala. | TEKNIS |
| D-05 | Pola ID soal `^[A-Z][A-Z0-9]*-[A-Z]+-[0-9]{3,}$`. Usulan prefiks tipe: **MCQ**, **ESA** (esai), **KAS** (kasus), **NUM** (numeric), mis. `MSK-ESA-001`. | SPEC hanya memberi contoh `MSK-MCQ-001`; prefiks esai/kasus perlu ditetapkan agar formulir batch konsisten. | DISETUJUI (2026-10-16) |
| D-06 | Field wajib per tipe: `explanation` wajib untuk mcq dan numeric; `modelAnswer` dan `rubric` wajib untuk essay; `acceptableAlternatives` wajib untuk essay dan case; `references` opsional. Field milik tipe lain dilarang. | SPEC 5.2 menandai field per tipe tetapi tidak menyatakan wajib/opsional; diturunkan dari Prompt B dan kebutuhan laporan (SPEC 11). | DISETUJUI (2026-10-16) |
| D-07 | `authoring.createdAt` menerima tanggal atau tanggal-waktu; `revision` wajib (>= 1); `model` wajib bila `createdBy` = `AI`. | AI sering hanya tahu tanggal; revisi diperlukan untuk alur Revisi Prompt B. | TEKNIS |
| D-08 | Format date-time menerima ISO 8601 dengan atau tanpa zona waktu. | Keluaran AI kerap tanpa zona; menolak hal ini tidak menambah mutu data. | TEKNIS |
| D-09 | `lifecycle.history` (opsional): daftar transisi `{from, to, at, by, reason}`. Tidak boleh ada di batch dari AI. | SPEC 8 mewajibkan alasan tertulis saat REJECT dibatalkan; perlu tempat menyimpannya. | DISETUJUI (2026-10-16) |
| D-10 | `lifecycle.review` = `{batchId, reviewerModel, reviewedAt, result}`, dengan `result` = satu item hasil review. | SPEC 5.2 hanya menulis `"review": null`. | TEKNIS |
| D-11 | Blueprint paket di pack: `{id, name, durationMinutes, strictMode, sections[{type, count, caseSize?, weight, itemScores?}], suggestedMinutes, difficultyTarget{levels, minScoreShare}, coverage{minTopics, maxTopicScoreShare}}`. Bobot bagian menjumlah 100; `itemScores` untuk skor tak rata (SIM kasus 16 dan 17). | SPEC 6 berupa tabel; struktur ini menyimpannya di pack sehingga core tetap generik. | DISETUJUI (2026-10-16) |
| D-12 | Struktur sesi (`session.schema.json`): jawaban mcq disimpan sebagai **kunci asli**; `optionOrder[i]` = kunci asli yang tampil di posisi ke-i. Status penilaian disimpan sebagai kode `MENUNGGU_PENILAIAN_URAIAN`, `PENILAIAN_SEBAGIAN`, `FINAL`. | Penilaian tidak bergantung pada urutan tampil (TS-05); kode tanpa spasi lebih aman. | TEKNIS |
| D-13 | Paket penilaian: `answer` soal kasus = satu teks berisi jawaban tiap sub-pertanyaan dengan label `[a]`, `[b]`, … | SPEC 5.5 menetapkan `answer` sebagai teks; sesi menyimpan jawaban kasus per sub-pertanyaan. | DISETUJUI (2026-10-16) |
| D-14 | `answersChecksum` = SHA-256 (heks huruf kecil) atas UTF-8 dari `JSON.stringify([[questionId, answer], …])`, terurut `questionId` (urutan code point), `answer` = teks yang diekspor (kosong = `""`). | SPEC 5.5 tidak merinci serialisasi. | TEKNIS |
| D-15 | Serialisasi kanonik `contentHash`: ambil field SPEC 8 yang ada; kunci objek diurutkan rekursif; setiap teks di-trim dan spasi beruntun dijadikan satu; `JSON.stringify` tanpa spasi; SHA-256 heks huruf kecil. Diimplementasikan di A1 (`hash.js`). | SPEC 8 menyebut "kunci diurutkan, spasi dinormalisasi" tanpa detail. | TEKNIS |
| D-16 | `calibration` hanya boleh ada bila status `CALIBRATION`, dan wajib ada pada status itu. `defectDimension` = salah satu dari 10 nama dimensi review. | Pencocokan tangkapan kalibrasi (SPEC 8) membutuhkan nama dimensi yang sama persis. | TEKNIS |
| D-17 | Paket review maksimal 11 item (10 soal + 1 kalibrasi). | SPEC 8: maks 10 PG per batch + 1 soal kalibrasi. | TEKNIS |
| D-18 | Contoh di `schema/examples/` memakai `subjectId` `contoh`, ID `CTH-*`, stem berawalan `[CONTOH]`, dan hash tiruan (bukan SHA-256 sungguhan). Soal demo (A1) akan diberi awalan stem `[DEMO]`. | Memisahkan contoh dari bank MSK (CLAUDE.md). | TEKNIS |
| D-19 | `keyCorrectness`, `stemClarity`, `alignment`, `timeEstimate`, `originality`, `fairness` tidak boleh `null` (mengikuti SPEC 5.4). Untuk esai/kasus, `keyCorrectness` diartikan kebenaran jawaban ideal dan data. | SPEC 5.4 vs Prompt C berbeda (lihat PROMPT_ALIGNMENT.md, C-2). | DISETUJUI (2026-10-16) |
| D-20 | Node.js belum terpasang di komputer pengembangan saat A0. Validator diverifikasi lewat browser bawaan dengan modul yang sama; gerbang `node tools/validate.mjs` dijalankan setelah Node terpasang. | Keterbatasan lingkungan. | TEKNIS |

## Fase A1

| ID | Keputusan | Alasan | Status |
|---|---|---|---|
| D-21 | Daftar pack bawaan: `packs/index.json` (fetch saat http/https) dan `packs/index.js` (cadangan `<script>` untuk file://), keduanya dibuat `tools/build-pack.mjs`. Pack impor disimpan di `caSim:<subjectId>:pack` dan menggantikan pack bawaan dengan subjectId sama. Impor pack ditolak selama ada sesi aktif untuk mata ujian itu. | Aplikasi tidak dapat membaca isi folder; SPEC 2 melarang pembaruan saat sesi berjalan. | TEKNIS |
| D-22 | Pemilihan soal paket: hingga 400 percobaan acak, berselang-seling mendahulukan soal bertingkat kesulitan target; skor soal dibagi rata ke topik-topiknya untuk aturan "maks 25% per topik". Bila aturan kesulitan/cakupan tidak terpenuhi, paket **tidak dapat dimulai** dan aplikasi menyebut aturan yang gagal. | Integritas paket di atas kemudahan; bank yang kurang variasi terlihat sejak awal. | USULAN |
| D-23 | Urutan tampil dikelompokkan per bagian (PG, numerik, esai, kasus) dan diacak di dalam bagian. Paket T1/T2/SIM selalu mengacak soal dan opsi; Kustom dapat memilih. | Peserta mengerjakan per bagian seperti ujian tertulis. | TEKNIS |
| D-24 | MULAI saat masih ada sesi aktif: dialog konfirmasi, lalu sesi lama **dikumpulkan apa adanya** (MANUAL), tidak dihapus. | SPEC 4 melarang menghapus data diam-diam; satu sesi aktif per mata ujian (SPEC 9). | USULAN |
| D-25 | Event `answer_changed` dicatat paling sering sekali per soal per menit, tanpa isi jawaban. | Mengetik esai tidak membuat log membengkak. | TEKNIS |
| D-26 | `focus_lost` dicatat bila meninggalkan layar >= 1 detik saat sesi berjalan (blur dan halaman tersembunyi digabung sebagai satu kejadian). | Menghindari hitungan ganda dan kedipan fokus. | TEKNIS |
| D-27 | Bila beberapa ambang peringatan (15/5/1 menit) terlewati sekaligus, hanya ambang terkecil yang ditampilkan; sisanya dicatat sebagai "(terlewati)". | Tidak membanjiri peserta saat aplikasi dibuka kembali. | TEKNIS |
| D-28 | Input numerik: koma = desimal; titik = ribuan hanya bila berpola ribuan (1.200), selain itu desimal (47.8); hasil pembacaan ditampilkan ("Terbaca: 47,8 Rp miliar"). | Gaya penulisan angka Indonesia tanpa salah tafsir diam-diam. | TEKNIS |
| D-29 | Cadangan sesi: `{backupVersion, subjectId, exportedAt, sessions}`. Impor memvalidasi/memigrasi tiap sesi, menolak sesi aktif kedua, dan meminta konfirmasi sebelum menimpa ID yang sama. | SPEC 9 (ekspor/impor cadangan). | TEKNIS |
| D-30 | Menu Pengelola Bank Soal belum ditampilkan sampai fase A3. | Definition of Done melarang tombol inert. | TEKNIS |
| D-31 | Sesi merujuk soal lewat ID dan contentHash; isi soal tidak disalin ke sesi. Bila pack diganti dan soal hilang, ruang ujian menampilkan pemberitahuan pada soal itu. **Perlu keputusan sebelum A2:** salin isi soal ke sesi (laporan selalu lengkap, data lebih besar) atau tetap merujuk pack (laporan sesi lama bergantung pada pack yang masih memuat soal). | Laporan A2 membutuhkan isi soal. | USULAN |
| D-32 | Tes ditulis sekali di `tests/cases/` dan dijalankan oleh `node --test` (tests/run.test.mjs) maupun `index.html?selftest`. Berkas turunan (`js/core/schemas.js`, `packs/*/pack.js`, `packs/index.*`) diperiksa tes sinkronisasi. | SPEC 13: self-test menjalankan tes yang sama. | TEKNIS |
| D-33 | Soal kasus dihitung "dijawab" bila minimal satu sub-pertanyaan terisi. | Ringkasan kumpul tidak menyesatkan untuk jawaban sebagian. | TEKNIS |
| D-34 | Node.js masih belum terpasang saat A1. `js/core/schemas.js` dan `packs/demo/pack.js` dibuat dengan fungsi generator yang sama (`tools/generate.mjs`) yang dijalankan di browser bawaan; contentHash pack demo dihitung dengan `js/core/hash.js`. | Keterbatasan lingkungan; tes sinkronisasi akan menangkap selisih saat `node --test` dijalankan. | TEKNIS |
