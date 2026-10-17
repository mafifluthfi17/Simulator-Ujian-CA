# CHANGELOG

Catatan perubahan prompt (`prompts/*.md`) dan kontrak data. Setiap
perubahan prompt dirujuk ke docs/PROMPT_ALIGNMENT.md.

## 2026-10-16 — Penyelarasan prompt dengan kontrak v4.1 (Fase A0)
Disetujui pemilik. Hanya bagian format data yang diubah; peran, aturan
substansi, dan langkah kerja tidak berubah.

### prompts/prompt_penyusun_soal.md (Prompt B)
- Menetapkan pola ID dan prefiks tipe MCQ/ESA/KAS/NUM (B-3, D-05).
- Menambah rujukan field wajib per tipe ke CONTRACT.md bagian C dan larangan
  field di luar kontrak (B-4, B-5).
- Menuliskan objek `lifecycle` lengkap dengan `review`, `approvedBy`,
  `approvedAt` = null (B-2).
- Menuliskan objek `authoring` lengkap dengan `createdAt` dan
  `revision` = 1 (B-1).

### prompts/prompt_reviewer_soal.md (Prompt C)
- Langkah 8: skor bulat 1-5 untuk kesepuluh dimensi; hanya
  singleBestAnswer, distractorQuality, rubricQuality, dataConsistency yang
  boleh null; keyCorrectness untuk esai/kasus = kebenaran jawaban ideal dan
  data (C-2 opsi a, D-19).
- `findings[].dimension` wajib salah satu nama dimensi (C-1).

### prompts/prompt_penilai_ai.md (Prompt D)
- Bentuk elemen `subQuestionScores` dan aturan esai = [] (D-1).
- Bentuk elemen `reviewFlags` beserta keempat tipenya (D-2).
- Aturan flag `ketidakpastian_tinggi` saat confidence rendah (D-3).
- Cara membaca jawaban kasus berlabel [a], [b], ... (D-4, D-13).

### schema/CONTRACT.md
- Prefiks tipe ID soal ditetapkan (MCQ/ESA/KAS/NUM).

### Tindakan di luar repositori
- Unggah ulang `schema/CONTRACT.md` dan Prompt B ke Project Claude, serta
  CONTRACT.md dan Prompt C ke Project ChatGPT.
- Formulir Permintaan Batch (dokumen Word, bagian 6.2): gunakan prefiks
  ESA/KAS untuk ID mulai esai dan kasus.

## 2026-10-17 — Aturan rujukan kriteria pada soal kasus (perbaikan QA A2)
Disetujui pemilik. Hanya bagian format data yang diubah.

### prompts/prompt_penyusun_soal.md (Prompt B)
- Butir baru di "Aturan wajib": rujukan kriteria pada soal kasus wajib menyebut
  bagiannya, mis. "(b) C3" (B-8, D-56).

### schema/CONTRACT.md
- Aturan konsistensi 6: pada soal `case`, rujukan kriteria di
  `acceptableAlternatives` (dan `modelAnswer` tingkat soal) wajib menyebut
  bagiannya, mis. `(b) C3`. Ditegakkan `js/core/consistency.js` untuk soal, batch,
  dan pack.

### Data
- `packs/demo/pack.json`, `schema/examples/question.case.json`,
  `schema/examples/session.example.json`: "nilai penuh pada C3" menjadi
  "nilai penuh pada (b) C3". `contentHash` tidak berubah (field ini tidak ikut hash).

### Tindakan di luar repositori
- Unggah ulang `schema/CONTRACT.md` ke Project Claude dan ChatGPT, serta Prompt B
  ke Project Claude.

## 2026-10-17 — Pemeriksaan keselarasan prompt (Fase A5)
Hanya bagian format data yang diubah.

### prompts/prompt_reviewer_soal.md (Prompt C)
- Format output: `"batchId": "salin persis dari input"`, dan pemeriksaan sebelum
  mengirim menyebut batchId (C-5). Aplikasi menolak hasil review yang batchId-nya
  tidak cocok dengan paket review (D-59).

### Tanpa perubahan
- Prompt B (batch) dan Prompt D (hasil penilaian) diperiksa terhadap
  `batch.schema.json` dan `grading-result.schema.json`; tidak ada selisih.

### Tindakan di luar repositori
- Unggah ulang Prompt C ke Project ChatGPT.
