# Keselarasan Prompt B/C/D dengan skema (Fase A0)

Prompt **belum diubah** (sesuai instruksi A0). Kolom "Usulan" menunggu
persetujuan pemilik; setiap perubahan prompt nanti dicatat di CHANGELOG.md.

Catatan umum: Prompt B dan C merujuk ke CONTRACT.md lewat pengetahuan Project,
sehingga field yang tidak disebut di prompt tetap terlindungi **asalkan
schema/CONTRACT.md diunggah ke Project Claude (penyusun) dan Project ChatGPT
(reviewer)**. Prompt D tidak membawa CONTRACT.md (disalin aplikasi bersama
data), jadi bentuk keluarannya harus lengkap di dalam prompt itu sendiri.

| No | Prompt | Field / bagian | Isi prompt sekarang | Kontrak (skema) | Dampak | Usulan |
|---|---|---|---|---|---|---|
| B-1 | Penyusun | `authoring.createdAt`, `authoring.revision` | Hanya `createdBy` dan `model` yang disebut; `revision` hanya muncul di bagian Revisi | Keduanya wajib; `revision` = 1 untuk soal baru | Batch ditolak bila AI tidak mengisinya | Tambah: `authoring.createdAt = tanggal hari ini (YYYY-MM-DD), revision = 1, notes = ""` |
| B-2 | Penyusun | `lifecycle.review`, `approvedBy`, `approvedAt` | Hanya `status` dan `contentHash` disebut | Ketiganya wajib bernilai `null` | Batch ditolak bila dihilangkan | Tambah: `lifecycle.review/approvedBy/approvedAt = null` |
| B-3 | Penyusun | Prefiks ID esai/kasus | "Ikuti ... ID awal di formulir" | Pola umum; prefiks belum ditetapkan (D-05) | Prefiks bisa berbeda antar-batch | Tetapkan MCQ/ESA/KAS/NUM di formulir dan prompt |
| B-4 | Penyusun | Field wajib per tipe | Tidak menyebut `modelAnswer`, `explanation`, `estimatedMinutes`, `cognitiveLevel`, `competencyIds`, `subQuestions[].modelAnswer` | Wajib sesuai CONTRACT.md bagian C | Aman bila CONTRACT.md ada di Project; bila tidak, batch ditolak | Tambah satu baris: "Field wajib per tipe: lihat CONTRACT.md bagian C" |
| B-5 | Penyusun | Field tambahan | Tidak melarang field lain | `additionalProperties: false` (D-03) | Field karangan AI membuat batch ditolak | Tambah: "Jangan menambah field di luar CONTRACT.md" |
| B-6 | Penyusun | Format keluaran | JSON dalam blok kode + maks 5 baris "Catatan penyusun" | Impor membaca objek JSON | Aplikasi harus mengambil JSON dari blok kode (A3) | Tidak perlu ubah prompt; impor A3 menangani blok kode |
| B-7 | Penyusun | Tipe `numeric` | Skala menyebut numeric 1, formulir hanya `mcq | essay | case` | `numericAnswer` wajib untuk numeric | Tidak berdampak untuk MSK | Tidak perlu ubah (MSK tidak memakai numeric) |
| C-1 | Reviewer | `findings[].dimension` | `"dimension": "..."` (bebas) | Salah satu dari 10 nama dimensi | Teks bebas ditolak; deteksi kalibrasi butuh nama persis | Tambah: "dimension wajib salah satu kunci dimensionScores" |
| C-2 | Reviewer | `dimensionScores` bernilai `null` | Langkah 8: "null bila tidak berlaku" untuk semua dimensi | `null` hanya untuk singleBestAnswer, distractorQuality, rubricQuality, dataConsistency (SPEC 5.4) | `keyCorrectness: null` pada esai/kasus akan ditolak | Pilih: (a) tambah ke prompt "keyCorrectness untuk esai/kasus = kebenaran jawaban ideal dan data; hanya 4 dimensi tsb. boleh null" (selaras SPEC, D-19), atau (b) izinkan null untuk keyCorrectness di skema |
| C-3 | Reviewer | `reviewedAt` | "ISO 8601" | date-time, zona opsional (D-08) | Selaras | — |
| C-4 | Reviewer | `independentAnswer` untuk esai/kasus | Tidak dijelaskan bentuknya | Teks tidak kosong | Selaras | — |
| D-1 | Penilai | `subQuestionScores[]` | Contoh hanya `"subQuestionScores": []`; bentuk elemen tidak ditulis | `{subId, maxScore, awardedScore, criteriaScores}` wajib | AI dapat memakai nama field lain → impor kasus ditolak | Tambah contoh elemen: `{"subId": "a", "maxScore": 8, "awardedScore": 6, "criteriaScores": [...]}` |
| D-2 | Penilai | `reviewFlags[]` | `"reviewFlags": []`; tipe disebut di aturan tanpa bentuk objek | `{questionId, type, note}` wajib | Flag tanpa bentuk tetap ditolak | Tambah contoh: `{"questionId": "...", "type": "jawaban_kosong", "note": "..."}` |
| D-3 | Penilai | Tipe flag `ketidakpastian_tinggi` | Tidak disebut | Ada di enum SPEC 5.5 | AI tidak pernah memakainya | Tambah: "Bila confidence rendah, beri reviewFlags ketidakpastian_tinggi" |
| D-4 | Penilai | Jawaban kasus | "jawaban asli peserta" | `answer` = satu teks berlabel `[a]`, `[b]` (D-13) | AI perlu tahu cara memetakan bagian jawaban | Tambah: "Jawaban kasus berlabel [a], [b], ... sesuai id sub-pertanyaan" |
| D-5 | Penilai | Skala dan kelipatan | "skala asli, kelipatan 0,5" | `multipleOf 0.5`, `minimum 0` | Selaras | — |
