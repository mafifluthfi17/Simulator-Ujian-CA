# Panduan Menambah Mata Ujian (Subject Pack)

Mesin ujian bersifat generik. Mata ujian baru cukup ditambahkan sebagai
**Subject Pack**: satu berkas `packs/<subjectId>/pack.json` berisi taksonomi,
blueprint paket, passing grade, bank soal, dan rubrik. Kode aplikasi tidak perlu
diubah. Kontrak lengkap ada di `schema/pack.schema.json` dan `schema/CONTRACT.md`;
bila ada perbedaan, **skema yang berlaku**.

Pembuatan isi soal dilakukan di luar Claude Code (Prompt B dan C). Pack demo
`packs/demo/` hanya untuk pengujian.

---

## 1. Salin template

1. Pilih `subjectId`: huruf kecil, angka, `-` atau `_`, 2-32 karakter, diawali
   huruf (mis. `akm`, `pajak`). Nama folder harus sama dengan `subjectId`.
2. Salin `packs/demo/pack.json` ke `packs/<subjectId>/pack.json`, atau mulai dari
   `schema/examples/pack.example.json`.
3. Ubah bagian kepala:

```json
{
  "schemaVersion": "4.1",
  "subjectId": "akm",
  "subjectName": "Akuntansi Manajemen",
  "packVersion": "1.0.0",
  "language": "id",
  "passingGrade": 70,
  "changelog": [{ "version": "1.0.0", "date": "2026-11-01", "notes": "Rilis awal." }]
}
```

   `changelog` wajib memuat entri untuk `packVersion` yang berlaku.
4. Kosongkan `questions` (`[]`) bila bank soal akan diisi lewat Pengelola Bank
   Soal (bagian 5).

## 2. Isi taksonomi

```json
"topics": [
  { "id": "T01", "name": "Biaya dan perilaku biaya" },
  { "id": "T02", "name": "Penganggaran" }
],
"competencies": [
  { "id": "K01", "name": "Menganalisis informasi biaya untuk keputusan" }
]
```

- ID topik `T01`..`T99`; ID kompetensi `K01`..`K99`; tidak boleh ganda.
- Setiap soal wajib merujuk ke ID yang ada di sini. Bila tidak, pack dan batch
  ditolak dengan pesan yang menyebut ID soal.

## 3. Susun blueprint paket

Setiap paket (`packages[]`) menjadi satu kartu di beranda:

```json
{
  "id": "T1",
  "name": "Training 1",
  "durationMinutes": 60,
  "strictMode": false,
  "sections": [
    { "type": "mcq", "count": 10, "weight": 20 },
    { "type": "essay", "count": 4, "weight": 40 },
    { "type": "case", "count": 2, "caseSize": "mini", "weight": 40 }
  ],
  "suggestedMinutes": { "mcq": 15, "essay": 20, "case": 25 },
  "difficultyTarget": { "levels": ["mudah", "sedang"], "minScoreShare": 0.6 },
  "coverage": { "minTopics": 6, "maxTopicScoreShare": 0.25 }
}
```

| Field | Arti |
|---|---|
| `id` | Huruf besar/angka (mis. `T1`, `SIM`) |
| `durationMinutes` | Durasi ujian (menit) |
| `strictMode` | `true` = mode ketat tanpa jeda (Simulasi) |
| `sections[].type` | `mcq`, `numeric`, `essay`, atau `case` |
| `sections[].count` | Jumlah soal bagian itu |
| `sections[].caseSize` | Wajib untuk `case`: `mini` atau `komprehensif` |
| `sections[].weight` | Total skor bagian (skala 100). Jumlah semua bagian **tepat 100** |
| `sections[].itemScores` | Opsional, skor per butir bila tidak dibagi rata (mis. `[16, 17]`); jumlahnya = `weight` |
| `difficultyTarget` | Bobot skor minimal (`minScoreShare`, 0-1) dari soal ber-`levels` tertentu |
| `coverage` | Minimal jumlah topik dan porsi skor maksimal satu topik |

- Skor per soal = `weight` dibagi rata (pembulatan 0,01 metode largest
  remainder), kecuali bila `itemScores` diisi. Faktor skala tiap soal = skor di
  paket ÷ skor asli soal.
- Soal diambil acak dari status **LIVE**. Bila jumlah atau aturan kesulitan dan
  cakupan tidak terpenuhi, paket tidak dapat dimulai dan aplikasi menyebut
  kekurangannya (mis. "butuh 17 PG, tersedia 12 yang sesuai").
- Mode **Kustom** selalu tersedia tanpa perlu ditulis di pack.

## 4. Tipe soal

Skala asli: mcq 1, numeric 1, essay 10, case 20. Field wajib per tipe: lihat
`schema/CONTRACT.md` bagian C.

### Tipe `numeric` (dinilai aplikasi)

```json
{
  "id": "AKM-NUM-001",
  "type": "numeric",
  "topicIds": ["T01"], "competencyIds": ["K01"],
  "difficulty": "sedang", "cognitiveLevel": "C3", "estimatedMinutes": 3,
  "maxScore": 1,
  "stem": "Hitung titik impas dalam unit ...",
  "numericAnswer": { "value": 12500, "unit": "unit", "tolerance": { "type": "absolute", "value": 0 } },
  "explanation": "Titik impas = biaya tetap ÷ margin kontribusi per unit = ...",
  "lifecycle": { "status": "DRAFT", "contentHash": "", "review": null, "approvedBy": null, "approvedAt": null },
  "authoring": { "createdBy": "manusia", "createdAt": "2026-11-01", "revision": 1, "notes": "" }
}
```

- `tolerance.type`: `absolute` = selisih maksimum dalam satuan jawaban;
  `relative` = pecahan (`0.01` = 1%).
- Peserta boleh menulis koma desimal (`47,8`) atau titik ribuan (`12.500`).
- Agar soal numerik muncul di paket, tambahkan bagian `{ "type": "numeric", ... }`
  di blueprint.

### Esai dan kasus
- Esai: 3-6 kriteria rubrik; jumlah `maxScore` kriteria = 10.
- Kasus: jumlah `maxScore` sub-pertanyaan = 20; rubrik tiap sub-pertanyaan
  menjumlah ke skor sub-pertanyaan itu. Rujukan kriteria di
  `acceptableAlternatives` wajib menyebut bagiannya, mis. `(b) C3`.
- Semua skor kelipatan 0,5.

## 5. Mengisi bank soal (alur bank soal)

1. **Pasang pack awal** (taksonomi + blueprint, `questions` boleh kosong):
   - untuk pengembangan, simpan di `packs/<subjectId>/pack.json` lalu jalankan
     perintah build (bagian 6); atau
   - di aplikasi: **⋯ › Pengaturan › IMPOR SUBJECT PACK**.
2. **Penyusunan**: unggah `schema/CONTRACT.md` dan
   `prompts/prompt_penyusun_soal.md` ke Project Claude, isi formulir batch
   (prefiks ID `<SUBJEK>-MCQ/ESA/KAS/NUM-nnn`), dan minta batch JSON.
3. **Impor Batch**: **⋯ › Pengelola Bank Soal** (PIN), tab Impor Batch. Tempel
   keluaran AI. Soal yang lolos pemeriksaan masuk sebagai **Draf** dan
   `contentHash` dihitung aplikasi.
4. **Soal kalibrasi**: buat 1 batch tersendiri berisi soal bercacat sengaja
   (status `CALIBRATION` + objek `calibration`). Soal ini tidak pernah tayang.
5. **Review**: pilih soal Draf (maks 10 PG/numerik, 5 esai, atau 2 kasus), centang
   **Sisipkan soal kalibrasi**, buat paket review, **Salin Prompt + Data**, lalu
   tempel ke Project ChatGPT yang memuat `prompts/prompt_reviewer_soal.md` dan
   `CONTRACT.md`.
6. **Impor hasil review**: APPROVE tanpa temuan kritis → *Lolos review AI*;
   REVISE atau temuan kritis → *Perlu revisi*; REJECT → *Ditolak*. Bila soal
   kalibrasi lolos tanpa temuan, seluruh hasil batch ditolak. Statistik tangkapan
   tercatat per reviewer.
7. **Revisi**: buka pratinjau soal *Perlu revisi* (atau pilih beberapa soal di
   Daftar Soal), tekan **Salin untuk penyusun**, lalu tempel ke Project
   penyusun. Teks itu memuat temuan reviewer dan JSON soal. Impor ulang
   hasilnya dengan ID yang sama. Soal *Perlu revisi* kembali menjadi Draf
   bila ada isi yang berubah, termasuk pembahasan, alasan distraktor, atau
   kesulitan. Bila revisi sudah diimpor tetapi status belum berubah, atau Anda
   tidak setuju dengan temuan reviewer, tekan **Kembalikan ke Draf** di
   pratinjau soal (inisial dan alasan wajib).
8. **Setujui**: periksa pratinjau, lalu Setujui dengan inisial → *Disetujui*.
   Review ganda opsional: impor hasil reviewer kedua untuk paket yang sama. Bila
   pendapat berbeda, putuskan sendiri dengan alasan.
9. **Publikasikan**: soal Disetujui menjadi **LIVE**, versi pack naik minor
   (1.0.0 → 1.1.0), changelog diperbarui, dan ujian di perangkat itu memakai
   pack baru.
10. **Ekspor Pack**: unduh `pack.json` lengkap lalu simpan ke
    `packs/<subjectId>/pack.json` di repositori.
11. **Taksonomi berubah**: bank soal dan pack hasil publikasi menyimpan
    salinan daftar topik dan kompetensi sendiri. Bila daftar itu diubah di
    repositori dan aplikasi diperbarui, Pengelola Bank Soal menampilkan
    pemberitahuan dengan tombol **Perbarui daftar topik dan kompetensi**.
    Soal, status, dan versi pack tidak berubah. Pembaruan ditolak bila ada soal
    yang memakai kode yang tidak ada lagi di daftar baru.

Target bank, misalnya jumlah soal per topik atau posisi kunci PG maksimal 35%
per huruf, dapat dipantau di tab **Statistik**.

## 6. Membangun dan menerbitkan

Dengan Node.js 20+, dari folder proyek:

```bash
node tools/validate.mjs
```

```bash
node tools/build-pack.mjs
```

```bash
node tools/build-sw.mjs
```

```bash
node tools/build-offline.mjs
```

```bash
node --test
```

- `build-pack.mjs` memvalidasi pack, memeriksa `contentHash` soal
  AI_REVIEWED/APPROVED/LIVE, lalu membuat `packs/<id>/pack.js` dan
  `packs/index.json`/`index.js`.
- `build-sw.mjs` dan `build-offline.mjs` memasukkan pack baru ke cache offline
  dan ke versi satu berkas.
- Commit, lalu push ke GitHub. Pengguna akan melihat **Versi baru tersedia** di
  luar sesi ujian.

Bila ada lebih dari satu pack, beranda menampilkan pemilih mata ujian.
Penyimpanan, riwayat, dan bank soal terpisah per `subjectId`.
