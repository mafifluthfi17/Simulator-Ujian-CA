# SPEC — Simulator Ujian CA Indonesia (V4.1)
Mata ujian awal: Manajemen Stratejik dan Kepemimpinan (MSK)

## 0. ATURAN BACA
- WAJIB = harus dipenuhi. SEBAIKNYA = dikerjakan bila memungkinkan; bila tidak,
  jelaskan alasannya. DILARANG = tidak boleh dilakukan.
- Prioritas bila bertentangan: (1) integritas penilaian dan kejujuran klaim,
  (2) fungsi inti berjalan di Windows dan iOS, (3) kesederhanaan antarmuka,
  (4) arsitektur multi-mata ujian, (5) tampilan.
- Simulator belajar, bukan ujian resmi, tidak berafiliasi dengan IAI.
  Disclaimer tampil di beranda dan di setiap laporan.
- Passing grade 70 adalah standar latihan internal, bukan ketentuan resmi IAI.

## 1. TUJUAN
1. Mesin ujian generik; mata ujian baru ditambahkan cukup dengan Subject Pack.
2. Bank soal hanya tayang setelah lint, review AI, dan persetujuan manusia.
3. Penilaian PG otomatis; esai dan kasus dinilai AI melalui ekspor-impor
   yang tervalidasi.
4. Laporan hasil dan pembahasan diekspor ke Word (.docx) dan Excel (.xlsx).

## 2. PLATFORM DAN TEKNOLOGI
- PWA statis: index.html, css/, js/ (modul ES), packs/, manifest.webmanifest,
  service-worker.js, ikon 192 dan 512 px, apple-touch-icon.
- Hosting utama: GitHub Pages (HTTPS). Service worker meng-cache seluruh aset
  sehingga aplikasi berjalan offline setelah kunjungan pertama.
- Cadangan Windows: index.html dibuka dari file:// tetap berfungsi tanpa
  service worker. Karena fetch() diblokir di file://, setiap pack juga tersedia
  sebagai packs/<subjectId>/pack.js (dibuat otomatis oleh tools/build-pack.mjs).
  Modul ES tidak dimuat dari file:// di sebagian browser; sediakan
  dist/simulator-offline.html (satu file, dibuat oleh tools/build-offline.mjs).
- Tombol IMPOR SUBJECT PACK (FileReader) WAJIB tersedia di semua platform.
- Batasan iOS yang WAJIB ditangani:
  a. Safari dapat menghapus data situs yang lama tidak dibuka kecuali aplikasi
     dipasang ke Layar Utama: tampilkan ajakan "Tambahkan ke Layar Utama"
     di iOS bila belum terpasang; panggil navigator.storage.persist() bila ada;
     ingatkan pengguna membuat cadangan sesi.
  b. iPhone tidak mendukung layar penuh halaman: gunakan mode fokus.
  c. Unduhan file lewat lembar Bagikan/Files: tampilkan petunjuk singkat.
  d. Suara hanya diaktifkan setelah ketukan pengguna.
  e. iOS menangguhkan halaman di latar belakang: hitung ulang waktu pada
     visibilitychange, pageshow, dan focus.
- Pembaruan: saat versi aplikasi atau pack baru tersedia, tampilkan
  "Versi baru tersedia — Muat Ulang". DILARANG memperbarui saat sesi berjalan.
- DILARANG menanam API key. Fungsi inti tanpa CDN, API berbayar, backend.

## 3. DESAIN ANTARMUKA (SEDERHANA, RAMAH, GAYA SEB)
- Beranda: pemilih mata ujian (hanya bila ada lebih dari satu pack), lalu
  empat kartu: Training 1, Training 2, Simulasi Ujian, Kustom. Kartu memuat
  durasi, jumlah soal, dan passing grade. Satu tombol besar MULAI.
- Bila ada sesi belum selesai, beranda menampilkan kartu "Lanjutkan Ujian".
- Menu sekunder (ikon ⋯): Riwayat, Pengelola Bank Soal, Pengaturan, Panduan.
  Pengelola Bank Soal dilindungi PIN lokal untuk mencegah salah tekan
  (bukan fitur keamanan; nyatakan demikian di panduan).
- Ruang ujian gaya SEB: bilah atas tipis berisi nama paket, timer, tombol
  Daftar Soal, dan KUMPULKAN. Tidak ada menu lain selama ujian.
  Tombol Layar Penuh di Windows dan iPad (Fullscreen API bila tersedia).
- Saat peserta meninggalkan layar ujian (visibilitychange/blur), catat
  event focus_lost beserta durasinya. Tampilkan jumlah dan total durasi
  di laporan sebagai informasi, bukan hukuman.
- Ukuran: teks 16 px, target sentuh minimal 44x44 px, kontras WCAG AA,
  mode gelap mengikuti sistem, maksimal dua warna aksen.
- Ponsel: daftar soal sebagai panel bawah; soal kasus memakai tab
  "Kasus | Jawaban". Laptop/iPad mendatar: kasus dan jawaban berdampingan.
- Penghitung kata pada esai dan kasus. Indikator "Tersimpan HH:MM:SS".
- Dialog konfirmasi untuk: kumpulkan, hapus sesi, mulai sesi baru saat ada
  sesi aktif, impor yang menimpa data.
- Integrasi SEB: buat docs/seb/panduan_seb.md (langkah memasang SEB di Windows
  dan iOS, menjalankan aplikasi sebagai halaman awal) dan contoh pengaturan.
  Deteksi SEB lewat user agent untuk menampilkan lencana "Berjalan di SEB";
  tandai BELUM DIVERIFIKASI sampai diuji di SEB nyata.
  DILARANG mengklaim aplikasi mengunci perangkat.

## 4. ARSITEKTUR MULTI-MATA UJIAN
- Core engine: sesi, timer, penyimpanan, navigasi, penilaian, ekspor, laporan.
  DILARANG berisi teks, topik, bobot, atau aturan satu mata ujian.
- Subject Pack: taksonomi topik dan kompetensi, blueprint paket, bobot,
  passing grade, bank soal, rubrik.
- Registry tipe soal: setiap tipe adalah modul dengan render(), getAnswer(),
  isAnswered(), autoScore() (opsional), exportForGrading(), renderReport().
- Tipe minimum: mcq (dinilai aplikasi), essay (AI), case (AI),
  numeric (dinilai aplikasi; toleransi absolut/relatif dan satuan).
  numeric WAJIB terimplementasi dan teruji walau pack MSK tidak memakainya.
- Data sesi, pack, penilaian, dan review menyimpan schemaVersion "4.1".
  Versi berbeda dimigrasi atau ditolak dengan pesan. DILARANG menghapus
  data lama secara diam-diam.
- Penyimpanan: localStorage ber-namespace caSim:<subjectId>:...; tangani
  QuotaExceededError dengan pesan jelas dan tawaran ekspor cadangan.

## 5. KONTRAK DATA (SUMBER TUNGGAL: folder schema/)
Fase A0 menulis JSON Schema untuk setiap struktur di bawah, contoh valid,
dan schema/CONTRACT.md (ringkasan untuk AI chat, diturunkan dari skema).
Nama field berikut WAJIB dipakai persis.

### 5.1 Subject Pack
{
  "schemaVersion": "4.1", "subjectId": "msk",
  "subjectName": "Manajemen Stratejik dan Kepemimpinan",
  "packVersion": "1.0.0", "language": "id", "passingGrade": 70,
  "topics": [{"id": "T01", "name": "..."}],
  "competencies": [{"id": "K01", "name": "..."}],
  "packages": [ blueprint, lihat bagian 6 ],
  "questions": [ soal, lihat 5.2 ],
  "changelog": [{"version": "1.0.0", "date": "YYYY-MM-DD", "notes": "..."}]
}

### 5.2 Soal
{
  "id": "MSK-MCQ-001",
  "type": "mcq | essay | case | numeric",
  "caseSize": "mini | komprehensif",            khusus case
  "topicIds": ["T02"], "competencyIds": ["K02"],
  "difficulty": "mudah | sedang | sulit | sangat_sulit",
  "cognitiveLevel": "C2 | C3 | C4 | C5 | C6",
  "estimatedMinutes": 1.5,
  "maxScore": 1,          skala asli: mcq 1, numeric 1, essay 10, case 20
  "stem": "...",
  "options": [{"key": "A", "text": "..."}],      mcq, tepat 4 (A-D)
  "answerKey": "C",                              mcq
  "distractorRationale": {"A": "...", "B": "...", "D": "..."},   mcq
  "numericAnswer": {"value": 0, "unit": "",
                    "tolerance": {"type": "absolute | relative", "value": 0}},
  "caseNarrative": "...",
  "caseData": [{"title": "...", "columns": ["..."], "rows": [["..."]]}],
  "subQuestions": [{"id": "a", "prompt": "...", "maxScore": 8,
                    "modelAnswer": "...", "rubric": [kriteria]}],    case
  "explanation": "...", "modelAnswer": "...",
  "rubric": [{"criterionId": "C1", "description": "...", "maxScore": 4,
              "full": "...", "partial": "...", "zero": "..."}],     essay
  "acceptableAlternatives": "...",
  "references": ["konsep/teori acuan"],
  "lifecycle": {"status": "DRAFT", "contentHash": "", "review": null,
                "approvedBy": null, "approvedAt": null},
  "authoring": {"createdBy": "AI | manusia", "model": "...",
                "createdAt": "...", "revision": 1, "notes": ""},
  "calibration": {"defectDimension": "...", "defectDescription": "...",
                  "expectedVerdict": "REVISE | REJECT"}   hanya soal kalibrasi
}
Aturan: jumlah rubric.maxScore = maxScore (essay); jumlah subQuestions.maxScore
= maxScore dan jumlah rubrik tiap sub = maxScore sub (case); skor kelipatan 0,5;
data kasus konsisten secara aritmetika.

### 5.3 Batch soal dari penyusun
{"batchType": "soal", "schemaVersion": "4.1", "subjectId": "msk",
 "batchId": "MSK-B01", "items": [soal]}

### 5.4 Paket review (ekspor aplikasi) dan hasil review (dari AI)
Ekspor: {"reviewVersion": "4.1", "batchId": "...", "subjectName": "...",
 "topics": [...], "competencies": [...],
 "items": [{"reviewKey": "R01", "contentHash": "...", ...soal tanpa id,
            lifecycle, authoring, calibration}]}
reviewKey sementara (R01, R02, ...) dipetakan aplikasi ke ID asli sehingga
reviewer tidak dapat membedakan soal kalibrasi.
Hasil: {"reviewVersion": "4.1", "batchId": "...", "reviewerModel": "...",
 "reviewedAt": "...", "items": [{"reviewKey": "R01", "contentHash": "...",
 "independentAnswer": "...", "keyAgreement": "setuju | tidak_setuju | sebagian",
 "dimensionScores": {"keyCorrectness": 1-5, "singleBestAnswer": 1-5|null,
   "stemClarity": 1-5, "distractorQuality": 1-5|null, "rubricQuality": 1-5|null,
   "dataConsistency": 1-5|null, "alignment": 1-5, "timeEstimate": 1-5,
   "originality": 1-5, "fairness": 1-5},
 "findings": [{"severity": "kritis | mayor | minor", "dimension": "...",
               "issue": "...", "suggestedFix": "..."}],
 "suggestedDifficulty": "...", "verdict": "APPROVE | REVISE | REJECT",
 "confidence": "tinggi | sedang | rendah", "summary": "..."}],
 "batchNotes": "..."}

### 5.5 Paket penilaian (ekspor) dan hasil penilaian (dari AI)
Ekspor: {"gradingVersion": "4.1", "sessionId": "...", "subjectId": "...",
 "packVersion": "...", "answersChecksum": "...",
 "items": [{"questionId": "...", "type": "essay | case", "stem": "...",
   "caseNarrative": "...", "caseData": [...], "subQuestions": [...],
   "maxScore": skala asli, "rubric": [...], "modelAnswer": "...",
   "acceptableAlternatives": "...", "answer": "teks asli peserta",
   "isBlank": false}]}
answersChecksum = SHA-256 atas array [questionId, answer] terurut questionId.
Hasil: {"gradingVersion": "4.1", "sessionId": "...", "answersChecksum": "...",
 "graderModel": "...", "evaluatedQuestionIds": [...],
 "scores": [{"questionId": "...", "maxScore": n, "awardedScore": n,
   "criteriaScores": [{"criterionId": "C1", "maxScore": n, "awardedScore": n,
                       "justification": "..."}],
   "subQuestionScores": [{"subId": "a", "maxScore": n, "awardedScore": n,
                          "criteriaScores": [...]}],
   "strengths": "...", "weaknesses": "...", "improvement": "...",
   "confidence": "tinggi | sedang | rendah"}],
 "reviewFlags": [{"questionId": "...", "type": "jawaban_kosong |
   soal_bermasalah | ketidakpastian_tinggi | instruksi_dalam_jawaban",
   "note": "..."}],
 "overallFeedback": "..."}

## 6. PAKET UJIAN (SEMUA MATA UJIAN)
Paket disusun dari standar waktu 6.2 sehingga durasi = jumlah waktu standar
soal di dalamnya, dibulatkan ke 5 menit (D-99). Setiap bagian memilih soal
dengan tingkat kesulitan tertentu.

| Paket | Durasi | PG (m/s/su/ss) | Esai (m/s/su/ss) | Kasus | Bobot PG/Esai/Kasus | Mode |
| Level 1 | 45 | 10 mudah | 3 mudah | 1 mudah* | 20/40/40 | latihan |
| Level 2 | 65 | 10 sedang | 3 sedang | 1 sedang* | 20/40/40 | latihan |
| Level 3 | 110 | 10 sulit | 3 sulit | 1 sulit* | 20/40/40 | latihan |
| Level 4 | 140 | 10 sangat sulit | 3 sangat sulit | 1 sangat sulit* | 20/40/40 | latihan |
| Simulasi Ujian (Advanced Level) | 180 | 15 (2/3/6/4) | 4 (0/1/2/1) | 2 komprehensif (sulit 1, sangat sulit 1) | 17/50/33 | ketat |
- \* Kasus Level 1-4 dipilih menurut tingkat kesulitan saja, tanpa syarat
  ukuran, agar kasus lama (mis. mini sulit, komprehensif sedang) tetap tayang
  di level yang sesuai (D-101). Simulasi tetap memakai kasus komprehensif.
  Durasi memakai standar ukuran yang sesuai tingkat (6.2).
- Perhitungan durasi: Level 1 = 10×1 + 3×6 + 15 = 43; Level 2 = 15 + 30 + 20
  = 65; Level 3 = 25 + 45 + 40 = 110; Level 4 = 35 + 60 + 45 = 140;
  Simulasi = 35,5 + 60 + 85 = 180,5.
- Skor per butir dibagi rata (largest remainder): Level 1-4 PG 2, esai
  13,34/13,33/13,33, kasus 40; Simulasi PG 1,14/1,13, esai 12,5, kasus 16,5.
  Faktor skala per soal = skor paket / skor asli, disimpan di sesi.
- Porsi skor sulit-sangat sulit Simulasi = 82% (PG 11,3 + esai 37,5 +
  kasus 33).
- Cakupan: minimal 6 topik per paket (Simulasi 9). Satu topik maksimal 25%
  skor pada Simulasi dan 40% pada Level 1-4, karena satu kasus Level bernilai
  40 dan kasus mini dapat bertopik tunggal (D-100).
- Mode ketat (tanpa jeda) untuk Simulasi; Level 1-4 mode latihan (boleh jeda).
- Soal diambil acak dari status LIVE sesuai tipe, ukuran kasus, dan tingkat
  kesulitan bagian. Bila kurang, paket tidak dapat dimulai dan aplikasi
  menyebut kekurangannya (contoh: "butuh 10 PG mudah, tersedia 6 yang
  sesuai").
- Paket T1, T2, dan SIM lama (60/120/180 menit) diganti paket di atas.

### 6.1 Mode Kustom
- Pengaturan: durasi 15-240 menit; jumlah PG/esai/kasus; filter kesulitan dan
  topik; acak urutan; acak opsi; mode ketat atau latihan (jeda); bobot bagian.
- Bobot bagian bilangan bulat, total tepat 100; bagian tanpa soal berbobot 0.
  Bila tidak valid, tombol MULAI nonaktif dengan pesan.
- Skor per soal = bobot bagian dibagi rata, dibulatkan 0,01 dengan metode
  largest remainder sehingga jumlahnya tepat sama dengan bobot bagian.
- Estimasi waktu = jumlah estimatedMinutes; peringatan bila durasi < 80% atau
  > 200% estimasi.

### 6.2 Standar waktu dan kriteria tingkat kesulitan (D-99)
- `estimatedMinutes` WAJIB sama dengan standar waktu untuk tipe, ukuran
  kasus, dan tingkat kesulitan soal. Penyusun tidak menebak waktu.
- Standar ini berlaku untuk soal baru. Soal yang sudah LIVE sebelum standar
  ini dipertahankan apa adanya (isi, perkiraan waktu, ukuran kasus) dan
  ditempatkan di paket menurut tingkat kesulitannya (D-101).

| Tipe | Mudah | Sedang | Sulit | Sangat sulit |
| PG | 1 | 1,5 | 2,5 | 3,5 |
| Esai | 6 | 10 | 15 | 20 |
| Kasus mini | 15 | 20 | — | — |
| Kasus komprehensif | — | — | 40 | 45 |

- Ukuran kasus mengikuti tingkat kesulitan: mini hanya mudah atau sedang;
  komprehensif hanya sulit atau sangat sulit.
- Tingkat kesulitan dipilih dari kriteria berikut. Semua batas adalah batas
  atas; soal yang melebihinya dipendekkan atau dinaikkan tingkatnya.

| Tipe | Mudah | Sedang | Sulit | Sangat sulit |
| PG | C2-C3, satu konsep, stem+opsi ≤ 90 kata, tanpa hitungan | C3, penerapan pada situasi, ≤ 120 kata, maks 1 langkah hitung | C4, analisis, ≤ 160 kata atau tabel kecil, 2-3 langkah | C5-C6, integrasi ≥ 2 konsep, ≤ 200 kata, ≥ 3 langkah atau data kuantitatif |
| Esai | 1 perintah (jelaskan/identifikasi), stem ≤ 120 kata, jawaban ideal ≤ 100 kata | 2 perintah, penerapan, stem ≤ 150 kata, jawaban ideal ≤ 170 kata | 2-3 perintah, analisis + rekomendasi, stem ≤ 200 kata, jawaban ideal ≤ 250 kata | 3 perintah, evaluasi alternatif/sintesis, stem ≤ 250 kata, jawaban ideal ≤ 330 kata |
| Kasus | Mini: narasi+data ≤ 300 kata, 2 sub, jawaban ideal total ≤ 230 kata | Mini: narasi+data ≤ 400 kata, 2-3 sub, jawaban ideal total ≤ 320 kata | Komprehensif: narasi+data ≤ 700 kata, 4 sub, jawaban ideal total ≤ 600 kata, hitung ≤ 5 menit | Komprehensif: narasi+data ≤ 900 kata, 4 sub, jawaban ideal total ≤ 650 kata, hitung ≤ 5 menit |

- Jawaban ideal = jawaban yang cukup untuk nilai penuh. Uraian tambahan untuk
  peserta ditaruh di pembahasan (explanation), yang tidak dihitung.
- Rumus pemeriksa: waktu ≈ kata bacaan ÷ 150 + kata jawaban ideal ÷ 20 +
  menit hitung (baca teks teknis 150 kata/menit; menulis jawaban termasuk
  berpikir 20 kata/menit). Standar di atas memenuhi rumus ini pada batas
  atas kriterianya.
- Numerik (belum dipakai paket): standar mengikuti PG.

## 7. TARGET BANK SOAL MSK v1.0 (DIBUAT DI LUAR CLAUDE CODE)
- >= 60 PG (>= 20 sulit/sangat sulit); >= 15 esai (>= 8 sulit/sangat sulit);
  >= 10 kasus (>= 4 mini, >= 6 komprehensif).
- Sasaran stok per mata ujian per tingkat kesulitan (D-99) agar paket Level
  1-4 bervariasi: >= 30 PG, >= 9 esai, >= 3 kasus (mini untuk mudah/sedang,
  komprehensif untuk sulit/sangat sulit).
- 12 topik masing-masing >= 4 PG dan >= 1 esai atau kasus.
- Posisi kunci PG maksimal 35% di satu huruf pada seluruh bank.
- Claude Code tidak membuat soal MSK. Untuk pengujian, buat packs/demo/
  berisi 5 soal demo (2 mcq, 1 essay, 1 case, 1 numeric) berlabel DEMO.

## 8. GERBANG KUALITAS BANK SOAL
- Status: DRAFT -> AI_REVIEWED -> APPROVED -> LIVE; cabang NEEDS_REVISION,
  REJECTED, RETIRED; status khusus CALIBRATION (tidak pernah LIVE).
  Transisi ditegakkan aplikasi. Hanya LIVE yang dapat masuk ujian.
- contentHash = SHA-256 (crypto.subtle) atas serialisasi kanonik: type,
  caseSize, stem, options, answerKey, numericAnswer, caseNarrative, caseData,
  subQuestions, modelAnswer, rubric, maxScore (kunci diurutkan, spasi
  dinormalisasi). Hash dihitung aplikasi, tidak pernah oleh AI.
  Konten berubah setelah review/persetujuan -> status kembali DRAFT.
- Lint sebelum review: field wajib; ID unik; jumlah rubrik; tepat 4 opsi;
  answerKey A-D; distractorRationale lengkap; topik/kompetensi ada di pack;
  skor kelipatan 0,5. Pesan lint menyebut ID dan field.
- Peringatan lint standar waktu (6.2, D-99): estimatedMinutes tidak sama
  dengan standar, ukuran kasus tidak sesuai tingkat kesulitan, atau panjang
  stem/narasi/jawaban ideal melebihi batas kriteria. Peringatan tidak menolak
  batch; reviewer menilai dimensi timeEstimate terhadap standar yang sama.
- Pengelola Bank Soal: Impor Batch; daftar soal dengan filter status/topik/tipe;
  pratinjau soal seperti tampilan peserta; Ekspor Paket Review (maks 10 soal
  PG, 5 esai, atau 2 kasus per batch) dengan tombol Salin Prompt + Data.
- Soal kalibrasi: opsi "Sisipkan soal kalibrasi" menambahkan 1 soal
  CALIBRATION secara acak ke paket review. Saat impor hasil review, kalibrasi
  dianggap tertangkap bila verdict bukan APPROVE DAN ada temuan kritis/mayor
  pada defectDimension. Jika tidak tertangkap, seluruh hasil review batch
  ditolak dan dicatat; soal tetap DRAFT. Simpan statistik tangkapan per
  reviewerModel.
- Keputusan otomatis: APPROVE tanpa temuan kritis -> AI_REVIEWED; REVISE atau
  ada temuan kritis -> NEEDS_REVISION; REJECT -> REJECTED (dapat dibatalkan
  manusia dengan alasan tertulis).
- SEBAIKNYA mendukung review ganda; bila dua verdict berbeda, wajib keputusan
  manusia.
- Persetujuan manusia: tombol Setujui dengan isian inisial -> APPROVED.
  Publikasikan -> LIVE; packVersion naik minor; changelog diperbarui.
- Ekspor Pack menghasilkan pack.json lengkap untuk disimpan ke repositori.

## 9. TIMER DAN SESI
- Saat MULAI: sessionId unik, startedAt, deadline, konfigurasi, urutan soal,
  mapping opsi, faktor skala disimpan sebelum timer berjalan.
- Sisa waktu = deadline - Date.now(), dirender setiap 250-1000 ms.
- Deteksi lompatan jam: bandingkan selisih Date.now() dan performance.now();
  lompatan > 60 detik dicatat clock_anomaly (deteksi tidak sempurna).
- Mode latihan: jeda menyimpan remainingMs; lanjut -> deadline baru;
  total jeda dicatat.
- Peringatan 15/5/1 menit bila durasi lebih besar dari ambang; suara opsional.
- Waktu habis -> kumpul otomatis tanpa konfirmasi. Dibuka ulang setelah
  deadline -> dikunci dan dikumpulkan, submittedReason EXPIRED_ON_REOPEN.
- Jawaban tersimpan otomatis setiap perubahan (debounce maks 1 detik).
- Satu sesi aktif per mata ujian. Ekspor/impor cadangan sesi.
- Log sesi: start, answer_changed (tanpa isi), flag, pause, resume, warning,
  focus_lost, clock_anomaly, submit.
- Peringatan beforeunload saat sesi aktif.

## 10. PENILAIAN
- mcq dan numeric dinilai aplikasi; mapping opsi acak dipakai untuk mencocokkan
  key asli. Kosong = 0.
- essay dan case dinilai AI lewat ekspor-impor. DILARANG mengklaim AI bawaan.
- Sebelum menyalin paket penilaian, tampilkan pemberitahuan bahwa jawaban akan
  dikirim ke layanan AI pilihan pengguna.
- Tombol Salin Prompt + Data menggabungkan prompts/prompt_penilai_ai.md dengan
  JSON paket penilaian.
- Validasi impor: gradingVersion, sessionId, answersChecksum cocok; questionId
  milik sesi; tanpa duplikat; lengkap; 0 <= awarded <= max di setiap level;
  kelipatan 0,5; awardedScore = jumlah criteriaScores (toleransi 0,01), bila
  berbeda pakai jumlah kriteria dan beri tanda. Pesan error menyebut field.
- Nilai akhir = skor PG aplikasi + skor uraian tervalidasi x faktor skala.
  DILARANG memakai total dari AI.
- Status: MENUNGGU PENILAIAN URAIAN -> PENILAIAN SEBAGIAN -> FINAL.
  LULUS/TIDAK LULUS hanya pada FINAL; LULUS bila nilai >= 70 sebelum pembulatan.
- Tampilan 2 desimal format id-ID; bila nilai di antara 69,995 dan 70,005,
  tampilkan 4 desimal. JSON memakai titik desimal.
- Koreksi manual skor kriteria dengan alasan wajib; dicatat dan ditandai
  DIKOREKSI MANUAL di laporan.
- Semua teks dari peserta atau impor ditampilkan sebagai teks (textContent).

## 11. LAPORAN DAN EKSPOR
- Laporan memuat: rekap (paket, tanggal, durasi, skor per komponen, total,
  passing grade, selisih, status); ekstraksi lengkap PG (soal, opsi A-D,
  jawaban, kunci, status, skor, pembahasan, alasan distraktor); ekstraksi
  lengkap esai/kasus (soal, jawaban asli utuh, jawaban ideal, rubrik dan skor
  per kriteria, kekuatan, kelemahan, saran); analisis kompetensi dan topik
  dihitung dari skor (% capaian; kuat >= 80, cukup 70-79, lemah < 70);
  rencana remedial; log sesi; koreksi manual; keterbatasan.
- Ekspor WAJIB: .docx, .xlsx, PDF (window.print + CSS print), JSON
  (dapat diimpor ulang), HTML satu file.
- .docx dan .xlsx dibangun di browser dengan penulis ZIP minimal (STORE) +
  CRC-32 dalam JavaScript murni. .docx: [Content_Types].xml, _rels/.rels,
  word/document.xml, word/styles.xml (Heading 1-3, tabel ber-border).
  .xlsx: workbook, styles, sheet dengan inlineStr, header tebal, freeze pane,
  lebar kolom, angka sebagai number.
- Struktur Word "Laporan & Pembahasan": sampul; rekap nilai; analisis
  kompetensi; pembahasan PG; pembahasan esai dan kasus; remedial; lampiran.
  Opsi "Lembar Belajar": soal, kunci, pembahasan tanpa jawaban peserta.
- Sheet Excel "Data Hasil": Ringkasan, PG, Uraian, Rubrik, Kompetensi,
  Remedial, Riwayat (semua sesi FINAL).
- Riwayat: grafik tren nilai per paket (SVG buatan sendiri).
- File WAJIB terbuka tanpa pesan "repair". Fallback bila gagal: .doc berbasis
  HTML dan .csv (UTF-8 BOM, pemisah titik koma) dengan pesan fallback.

## 12. KETERBATASAN YANG WAJIB DIUNGKAPKAN (panduan dan layar Tentang)
Kunci jawaban terlihat bagi yang membuka source code; aplikasi tidak mengunci
perangkat (gunakan SEB untuk itu); JavaScript tidak berjalan saat aplikasi
ditutup, tenggat diperiksa saat dibuka kembali; deteksi perubahan jam tidak
sempurna; data hanya di perangkat ini; data dapat hilang bila data browser
dibersihkan; penilaian uraian bergantung pada layanan AI pihak ketiga.

## 13. PENGUJIAN DAN DEFINITION OF DONE
- node --test untuk logika murni: validasi skema, penilaian, largest remainder,
  faktor skala, checksum, hash, penulis ZIP, migrasi.
- index.html?selftest menjalankan tes yang sama di browser.
- SEBAIKNYA Playwright (chromium dan webkit) untuk alur end-to-end; webkit
  adalah pendekatan, bukan pengganti uji iPhone nyata.
| ID | Skenario | Hasil yang diharapkan |
| TS-01 | Muat pack demo | valid, 0 error |
| TS-02 | Pack dengan jumlah rubrik salah | ditolak, error menyebut ID |
| TS-03 | Bangun SIM dari pack uji 60/15/10 | 17/5/2 soal, total maks 100,00 |
| TS-04 | Kustom 7/3/1, bobot 30/40/30 | total 100,00; tiap bagian = bobotnya |
| TS-05 | Opsi diacak, pilih kunci asli | dinilai benar |
| TS-06 | Dibuka ulang setelah deadline | terkunci, EXPIRED_ON_REOPEN |
| TS-07 | Jeda 2 menit mode latihan | sisa waktu sama |
| TS-08 | Impor penilaian checksum salah | ditolak |
| TS-09 | Impor skor > maks | ditolak, field disebut |
| TS-10 | Kriteria tidak menjumlah | diterima dengan jumlah kriteria + tanda |
| TS-11 | Nilai 69,996 | TIDAK LULUS, tampil 4 desimal |
| TS-12 | Nilai 70,00 | LULUS |
| TS-13 | Ubah stem soal APPROVED | kembali DRAFT, hash berubah |
| TS-14 | 50 kali generate paket | 0 soal non-LIVE |
| TS-15 | Ekspor .docx dan .xlsx | ZIP valid, entri lengkap, XML well-formed |
| TS-16 | Jawaban berisi <script> | tampil sebagai teks |
| TS-17 | numeric toleransi 1%, kunci 100 | 99,2 benar; 98 salah |
| TS-18 | Sesi schemaVersion lama | dimigrasi atau ditolak dengan pesan |
| TS-19 | Kalibrasi di-APPROVE reviewer | seluruh hasil batch ditolak |
| TS-20 | Muat ulang offline setelah kunjungan pertama | aplikasi terbuka (service worker) |
| TS-21 | Versi baru saat sesi berjalan | tidak diperbarui sampai sesi selesai |
- Uji manual (dicentang hanya bila dilakukan): alur T1 penuh di iPhone, iPad,
  dan Windows; buka .docx/.xlsx di Word/Excel dan aplikasi Files iOS; satu
  putaran penilaian dan review dengan AI nyata; aplikasi di SEB.
- Definition of Done: semua TS PASS; tanpa error konsol pada alur T1; tanpa
  tombol inert; TEST_REPORT.md memisahkan DIUJI-LULUS, DIUJI-GAGAL,
  BELUM DIVERIFIKASI.

## 14. FASE
A0 Arsitektur dan kontrak | A1 Core engine dan ruang ujian |
A2 Penilaian, laporan, ekspor | A3 Pengelola bank soal |
A4 PWA, hosting, iOS, SEB | A5 QA akhir dan dokumentasi.
