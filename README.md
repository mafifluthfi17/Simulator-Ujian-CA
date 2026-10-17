# Simulator Ujian CA Indonesia

Aplikasi latihan ujian CA (PWA statis, tanpa backend). Simulator belajar, bukan
ujian resmi, dan tidak berafiliasi dengan IAI. Spesifikasi: `docs/SPEC.md`.

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
