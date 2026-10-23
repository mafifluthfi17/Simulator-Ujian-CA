# Simulator Ujian CA Indonesia

Aplikasi latihan ujian CA (PWA statis, tanpa backend). Simulator belajar, bukan
ujian resmi, dan tidak berafiliasi dengan IAI. Spesifikasi: `docs/SPEC.md`.

**Aplikasi:** https://tryoutca.github.io/ (GitHub Pages; dapat dipasang sebagai aplikasi dan berjalan
offline setelah kunjungan pertama).

Panduan: `docs/panduan_penggunaan.md` (pengguna), `docs/panduan_menambah_mata_ujian.md`
(mata ujian baru), `docs/seb/panduan_seb.md` (Safe Exam Browser). Hasil uji:
`docs/TEST_REPORT.md`.

## Menjalankan di komputer (pengembangan)

Aplikasi memakai modul JavaScript, sehingga harus dibuka lewat server lokal
(http://), bukan dengan klik ganda index.html. Versi satu-berkas untuk
`file://` dibuat pada fase A4.

Dengan Node.js terpasang, dari folder proyek:

```bash
npx --yes http-server -p 8080 -c-1
```

Lalu buka `http://localhost:8080` di Edge atau Chrome.

## Tes

```bash
node --test
node tools/validate.mjs
```

Tes yang sama di browser: `http://localhost:8080/index.html?selftest`.

## Setelah mengubah skema atau pack

```bash
node tools/build-schemas.mjs
node tools/build-pack.mjs
```

Setelah mengubah `prompts/*.md`:

```bash
node tools/build-prompts.mjs
```

## Contoh laporan

```bash
node tools/sample-report.mjs
```

Menulis contoh .docx, Lembar Belajar, .xlsx, HTML, dan fallback .doc/.csv dari
sesi demo ke `tests/output/`. Penilaian uraian di contoh ini fiktif (bukan AI).

## Berkas turunan (wajib dibangun ulang setelah mengubah aplikasi)

```bash
node tools/build-icons.mjs
```

```bash
node tools/build-sw.mjs
```

```bash
node tools/build-offline.mjs
```

`service-worker.js` memuat daftar aset dan versi cache; `dist/simulator-offline.html`
adalah versi satu berkas yang dapat dibuka langsung (klik ganda) tanpa server.
Tes sinkronisasi gagal bila salah satu berkas ini lupa dibangun ulang.

## Safe Exam Browser

Lihat `docs/seb/panduan_seb.md` dan `docs/seb/contoh-pengaturan-seb.xml`.
