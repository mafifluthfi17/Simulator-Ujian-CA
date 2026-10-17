# ARSITEKTUR — Simulator Ujian CA Indonesia (V4.1)

Dokumen ini ditulis pada fase A0. Modul bertanda (A1)…(A5) dibuat pada fase
tersebut; nama boleh disesuaikan saat implementasi dengan mencatatnya di
DECISIONS.md.

## 1. Prinsip
- **Core generik, pack spesifik.** `js/core/` tidak berisi teks, topik, bobot,
  atau aturan satu mata ujian (SPEC 4). Semua itu ada di `packs/<subjectId>/`.
- **Logika murni terpisah dari DOM.** Modul di `js/core/`, `js/types/*` (bagian
  penilaian), dan `js/export/` tidak menyentuh `document`/`window`, sehingga
  dapat diuji dengan `node --test` dan `index.html?selftest` memakai kode yang sama.
- **Satu sumber kontrak.** `schema/*.schema.json` divalidasi oleh
  `js/core/jsonschema.js` di browser maupun Node; tidak ada validator kedua.
- **Teks dari luar selalu `textContent`.** Hanya `js/ui/dom.js` yang membuat
  elemen; tidak ada `innerHTML` untuk data peserta/impor (SPEC 10).

## 2. Struktur folder
```
index.html                 kerangka aplikasi, memuat js/main.js (modul ES)
manifest.webmanifest       PWA (A4)
service-worker.js          cache aset + pack, pembaruan aman (A4)
css/app.css, css/print.css tampilan layar dan cetak/PDF
icons/                     192, 512, apple-touch-icon (A4)
js/
  main.js                  bootstrap, router layar, pemuatan pack (A1)
  core/                    logika murni (tanpa DOM)
  types/                   registry tipe soal + modul per tipe
  ui/                      layar dan komponen (DOM)
  export/                  penulis ZIP, .docx, .xlsx, HTML, CSV
  platform/                iOS, SEB, PWA/pembaruan
packs/
  demo/pack.json, pack.js  5 soal DEMO (A1); pack.js dibuat tools/build-pack.mjs
  msk/                     bank MSK v1.0 (diisi di luar Claude Code)
schema/                    JSON Schema, CONTRACT.md, examples/
prompts/                   Prompt B, C, D (disalin oleh aplikasi)
tools/                     validate.mjs, build-pack.mjs (A1), build-offline.mjs (A4)
tests/                     *.test.mjs untuk node --test
dist/simulator-offline.html  satu berkas untuk file:// (A4)
docs/                      SPEC, ARCHITECTURE, DECISIONS, PROMPT_ALIGNMENT,
                           TEST_REPORT (A5), seb/panduan_seb.md (A4)
```

## 3. Modul JS dan tanggung jawabnya

### js/core/ (logika murni)
| Modul | Tanggung jawab | Fase |
|---|---|---|
| jsonschema.js | Validator subset JSON Schema 2020-12, pesan error ber-path | A0 |
| consistency.js | Aturan yang tak dapat diungkap skema: jumlah rubrik, opsi A-D, referensi topik, bobot paket, changelog, contentHash wajib untuk LIVE | A0/A1 |
| schemas.js | Skema tertanam (dibuat `tools/build-schemas.mjs`) agar validasi jalan tanpa fetch | A1 |
| contract.js | `validateDocument`/`loadDocument`: migrasi + skema + konsistensi | A1 |
| pack-loader.js | Muat pack (fetch pack.json, cadangan packs/*/pack.js, pack impor), validasi | A1 |
| migrate.js | Migrasi/penolakan data dengan schemaVersion berbeda; tidak menghapus data lama | A1 |
| storage.js | localStorage ber-namespace `caSim:<subjectId>:...`, StorageFullError, backend memori untuk tes | A1 |
| session-store.js | Simpan/muat sesi, satu sesi aktif, riwayat, cadangan sesi | A1 |
| blueprint.js | Bangun paket T1/T2/SIM/Kustom dari soal LIVE; largest remainder; aturan kesulitan/cakupan; validasi Kustom | A1 |
| scoring.js | Skor mcq/numeric × faktor skala, status penilaian, LULUS/TIDAK LULUS | A1/A2 |
| session.js | Buat sesi, jawaban, flag, jeda/lanjut, kumpul, EXPIRED_ON_REOPEN, log event | A1 |
| timer.js | Peringatan 15/5/1 menit, deteksi clock_anomaly (ClockWatch) | A1 |
| hash.js | Serialisasi kanonik + SHA-256 (crypto.subtle, cadangan JS murni) | A1 |
| random.js | RNG ber-seed (tes) dan pengacakan | A1 |
| version.js | APP_VERSION, SCHEMA_VERSION | A1 |
| grading-io.js | Ekspor paket penilaian, validasi impor hasil AI (SPEC 10), koreksi manual | A2 |
| report.js | Model data laporan: rekap, analisis kompetensi/topik, remedial | A2 |
| bank.js | Mesin status DRAFT→…→LIVE, lint, impor batch, publikasi, versi pack | A3 |
| review-io.js | Ekspor paket review (reviewKey, kalibrasi tersembunyi), impor hasil, statistik kalibrasi | A3 |
| format.js | Format angka id-ID (2/4 desimal), tanggal, durasi | A1 |

### js/types/ (registry tipe soal, SPEC 4)
`registry.js` memetakan `type` → modul. Setiap modul (`mcq.js`, `essay.js`,
`case.js`, `numeric.js`) mengekspor `render()`, `getAnswer()`,
`isAnswered()`, `autoScore()` (mcq, numeric), `exportForGrading()`
(essay, case), `renderReport()`. Bagian penilaian dan ekspor murni; bagian
render memakai `js/ui/dom.js`.

### js/ui/
| Modul | Layar | Fase |
|---|---|---|
| app.js | Pengendali: muat pack dan sesi, pemulihan, pindah layar, simpan, unduh | A1 |
| layout.js | Kepala layar, menu ⋯, disclaimer | A1 |
| dom.js | Pembuat elemen aman (textContent), dialog konfirmasi, toast | A1 |
| home.js | Beranda: pemilih mata ujian, 4 kartu paket, Lanjutkan Ujian, menu ⋯ | A1 |
| custom.js | Pengaturan Mode Kustom dan validasi bobot | A1 |
| exam-room.js | Ruang ujian gaya SEB: bilah atas, daftar soal, mode fokus, autosave | A1 |
| results.js | Hasil, status penilaian, impor penilaian, koreksi manual | A2 |
| history.js | Riwayat dan grafik tren SVG | A2 |
| bank-manager.js | Pengelola Bank Soal (PIN lokal) | A3 |
| settings.js, guide.js | Pengaturan, Panduan, Tentang (keterbatasan SPEC 12) | A1/A5 |

### js/export/
`zip.js` (STORE + CRC-32), `docx.js`, `xlsx.js`, `html-report.js`,
`csv.js` dan `doc-html.js` (fallback), `download.js` (unduh + petunjuk iOS). (A2)

### js/platform/
`ios.js` (ajakan Layar Utama, storage.persist, visibilitychange/pageshow),
`seb.js` (deteksi user agent, lencana), `pwa.js` (registrasi service worker,
"Versi baru tersedia", menunda pembaruan selama sesi). (A1/A4)

## 4. Alur data
```
packs/<id>/pack.json ──(fetch | pack.js | impor file)──► pack-loader
        │  validasi skema + konsistensi + migrasi
        ▼
   Pack di memori ──► blueprint: pilih soal LIVE, acak, hitung points/scaleFactor
        │
        ▼
   Sesi (session.schema.json, + salinan isi soal per item, D-31) disimpan SEBELUM timer berjalan
        │  jawaban (autosave ≤1 dtk), event log, jeda, focus_lost
        ▼
   KUMPULKAN / waktu habis / EXPIRED_ON_REOPEN
        │
        ├─► mcq & numeric: scoring.js (opsi acak → kunci asli) → autoScores
        │
        └─► essay & case: grading-io.exportPackage (+ answersChecksum)
                 │  "Salin Prompt + Data" = prompts/prompt_penilai_ai.md + JSON
                 ▼
             AI pilihan pengguna (di luar aplikasi)
                 │  hasil JSON ditempel/diimpor
                 ▼
             grading-io.importResult: validasi skema + aturan SPEC 10
                 → essayScores (skala asli × scaleFactor)
        ▼
   scoring.finalScore = autoScores + essayScores (bukan total dari AI)
        ▼
   report.js ──► layar hasil, .docx, .xlsx, PDF (print), JSON, HTML
```

Alur bank soal (A3):
```
Prompt B (Claude) ─► batch JSON ─► Impor Batch (skema + lint) ─► DRAFT
DRAFT ─► Ekspor Paket Review (+kalibrasi tersembunyi) ─► Prompt C (ChatGPT)
      ─► Impor Hasil Review ─► AI_REVIEWED / NEEDS_REVISION / REJECTED
AI_REVIEWED ─► Setujui (inisial) ─► APPROVED ─► Publikasikan ─► LIVE
      ─► Ekspor Pack (pack.json, packVersion naik minor, changelog)
```
