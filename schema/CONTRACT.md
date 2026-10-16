# KONTRAK DATA — Simulator Ujian CA (v4.1)

Ringkasan untuk AI chat (penyusun, reviewer, penilai). Diturunkan dari
`schema/*.schema.json`; bila ada perbedaan, **skema yang berlaku**. Aplikasi
menolak data yang tidak sesuai dan menyebut field yang salah.

## A. Aturan umum
- Keluarkan JSON valid: tanda kutip ganda, tanpa koma di akhir, tanpa komentar.
- Nama field persis seperti di bawah (huruf besar-kecil berpengaruh).
  **Field yang tidak tercantum ditolak.**
- Angka memakai titik desimal (`7.5`, bukan `7,5`). Skor kelipatan 0,5.
- Tanggal `YYYY-MM-DD`; waktu ISO 8601 `YYYY-MM-DDTHH:MM:SS+07:00`
  (zona waktu boleh dihilangkan).
- `contentHash` dan `answersChecksum` **tidak pernah dihitung AI**: soal baru
  memakai `""`; reviewer dan penilai menyalin nilai dari input persis.

## B. Kode yang dipakai
| Field | Nilai yang diizinkan |
|---|---|
| type | `mcq`, `essay`, `case`, `numeric` |
| caseSize | `mini`, `komprehensif` (hanya `case`) |
| difficulty | `mudah`, `sedang`, `sulit`, `sangat_sulit` |
| cognitiveLevel | `C2`, `C3`, `C4`, `C5`, `C6` |
| ID soal | `<SUBJEK>-<TIPE>-<nomor 3 digit+>`, mis. `MSK-MCQ-001` (prefiks tipe: lihat formulir) |
| topicIds / competencyIds | `T01`..`T99` / `K01`..`K99`, harus ada di taksonomi pack |
| criterionId | `C1`, `C2`, ... |
| id sub-pertanyaan | `a`, `b`, `c`, ... |
| lifecycle.status | `DRAFT`, `AI_REVIEWED`, `APPROVED`, `LIVE`, `NEEDS_REVISION`, `REJECTED`, `RETIRED`, `CALIBRATION` |
| nama dimensi review | `keyCorrectness`, `singleBestAnswer`, `stemClarity`, `distractorQuality`, `rubricQuality`, `dataConsistency`, `alignment`, `timeEstimate`, `originality`, `fairness` |
| severity | `kritis`, `mayor`, `minor` |
| verdict | `APPROVE`, `REVISE`, `REJECT` |
| confidence | `tinggi`, `sedang`, `rendah` |

## C. Soal (`question.schema.json`)
Wajib untuk semua tipe: `id`, `type`, `topicIds` (min 1), `competencyIds`
(min 1), `difficulty`, `cognitiveLevel`, `estimatedMinutes` (> 0),
`maxScore`, `stem`, `lifecycle`, `authoring`. Opsional: `references`
(daftar konsep/teori; jangan mengarang judul buku atau nomor halaman).

| Field | mcq | numeric | essay | case |
|---|---|---|---|---|
| maxScore | 1 | 1 | 10 | 20 |
| options (tepat 4, kunci A-D masing-masing sekali) | wajib | — | — | — |
| answerKey | wajib | — | — | — |
| distractorRationale (tepat opsi selain kunci) | wajib | — | — | — |
| numericAnswer `{value, unit, tolerance:{type, value}}` | — | wajib | — | — |
| explanation | wajib | wajib | opsional | opsional |
| modelAnswer | opsional | opsional | wajib | opsional |
| rubric (3-6 kriteria) | — | — | wajib | — |
| caseSize, caseNarrative, subQuestions | — | — | — | wajib |
| caseData | — | — | — | opsional |
| acceptableAlternatives | opsional | opsional | wajib | wajib |

"—" berarti field **tidak boleh ada** untuk tipe tersebut.

- Kriteria rubrik: `{criterionId, description, maxScore, full, partial, zero}`.
- Sub-pertanyaan: `{id, prompt, maxScore, modelAnswer, rubric}`.
- Tabel kasus: `{title, columns: [teks], rows: [[teks atau angka]]}`;
  jumlah sel setiap baris = jumlah kolom.
- `numericAnswer.tolerance`: `absolute` = selisih maksimum dalam satuan
  jawaban; `relative` = pecahan (`0.01` = 1%).
- `lifecycle` dari AI: `{"status": "DRAFT", "contentHash": "", "review": null,
  "approvedBy": null, "approvedAt": null}`.
- `authoring` dari AI: `{"createdBy": "AI", "model": "<nama model>",
  "createdAt": "YYYY-MM-DD", "revision": 1, "notes": ""}`. Revisi menaikkan
  `revision`.
- `calibration` hanya pada soal berstatus `CALIBRATION`:
  `{defectDimension (nama dimensi), defectDescription, expectedVerdict:
  "REVISE" | "REJECT"}`.

### Aturan konsistensi (diperiksa aplikasi)
1. essay: jumlah `rubric[].maxScore` = `maxScore` (10).
2. case: jumlah `subQuestions[].maxScore` = 20; jumlah rubrik tiap
   sub-pertanyaan = `maxScore` sub tersebut.
3. `criterionId` unik dalam satu rubrik; `id` sub-pertanyaan unik.
4. ID soal unik dalam batch dan pack.
5. Data kasus konsisten secara aritmetika (total, rasio, persentase).

## D. Batch dari penyusun (`batch.schema.json`)
```json
{"batchType": "soal", "schemaVersion": "4.1", "subjectId": "msk",
 "batchId": "MSK-B07", "items": [ ...1-10 soal... ]}
```
Setiap soal berstatus `DRAFT` (atau `CALIBRATION` untuk soal kalibrasi),
`contentHash` = `""`, `review`/`approvedBy`/`approvedAt` = `null`.

## E. Hasil review (`review-result.schema.json`)
Satu objek per paket review; `items` berisi satu elemen per `reviewKey` input.
- `dimensionScores`: kesepuluh dimensi **wajib ada**, bilangan bulat 1-5.
  `null` hanya untuk `singleBestAnswer`, `distractorQuality`,
  `rubricQuality`, `dataConsistency` bila tidak berlaku.
- `findings[]`: `{severity, dimension (salah satu nama dimensi), issue,
  suggestedFix}`; boleh kosong.
- Field lain: `reviewKey`, `contentHash` (salin persis), `independentAnswer`,
  `keyAgreement` (`setuju` | `tidak_setuju` | `sebagian`),
  `suggestedDifficulty`, `verdict`, `confidence`, `summary`.
- Tingkat atas: `reviewVersion: "4.1"`, `batchId`, `reviewerModel`,
  `reviewedAt`, `items`, `batchNotes`.

## F. Hasil penilaian (`grading-result.schema.json`)
```json
{"gradingVersion": "4.1", "sessionId": "salin", "answersChecksum": "salin",
 "graderModel": "...", "evaluatedQuestionIds": ["..."],
 "scores": [{"questionId": "...", "maxScore": 10, "awardedScore": 7.5,
   "criteriaScores": [{"criterionId": "C1", "maxScore": 4,
                       "awardedScore": 3, "justification": "..."}],
   "subQuestionScores": [],
   "strengths": "...", "weaknesses": "...", "improvement": "...",
   "confidence": "sedang"}],
 "reviewFlags": [{"questionId": "...", "type": "jawaban_kosong", "note": "..."}],
 "overallFeedback": "..."}
```
- Kasus: `criteriaScores` tingkat soal = `[]`; isi `subQuestionScores`
  dengan `{"subId": "a", "maxScore": 8, "awardedScore": 6, "criteriaScores": [...]}`.
- `reviewFlags[].type`: `jawaban_kosong`, `soal_bermasalah`,
  `ketidakpastian_tinggi`, `instruksi_dalam_jawaban`.
- Skor dalam skala asli, kelipatan 0,5, 0 <= skor <= maks;
  `awardedScore` = jumlah komponennya.

## G. Data yang dibuat aplikasi (bukan oleh AI)
`pack.schema.json` (Subject Pack), `review-export.schema.json` (paket review:
soal tanpa `id`/`lifecycle`/`authoring`/`calibration`, ditambah `reviewKey` dan
`contentHash`), `grading-export.schema.json` (paket penilaian; jawaban kasus
digabung dengan label `[a]`, `[b]`, ...), `session.schema.json` (sesi dan
cadangan sesi). Contoh lengkap setiap struktur: `schema/examples/`.
