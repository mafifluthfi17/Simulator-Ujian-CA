// Laporan -> sheet Excel "Data Hasil" (SPEC 11): Ringkasan, PG, Uraian, Rubrik,
// Kompetensi, Remedial, Riwayat (semua sesi FINAL). Skor disimpan sebagai angka,
// hitungan sebagai bilangan bulat, capaian sebagai pecahan berformat persen, dan
// tanggal sebagai tanggal Excel (dapat diurutkan dan dibuat grafik). Di CSV,
// persen dan tanggal ditulis sebagai teks Indonesia (lihat csv.js).

import { DIFFICULTY_LABELS } from '../core/report.js';
import { formatMinutes } from '../core/format.js';
import { passText } from './report-blocks.js';

const col = (header, width, kind = 'text') => ({ header, width, kind });
const num = (n) => (n === null || n === undefined ? null : n);
const int = (n) => ({ value: n, format: 'int' });
const date = (iso) => ({ value: iso, format: 'date' });
const percent = (pct) => (pct === null || pct === undefined ? null : { value: pct / 100, format: 'percent' });

// Jawaban kasus per bagian dengan label (a), (b) seperti di laporan Word/HTML.
function answerText(x) {
  if (x.type !== 'case') return x.isBlank ? '(kosong)' : x.answer;
  return x.subQuestions.map((s) => `(${s.id}) ${s.answer.trim() ? s.answer : '(kosong)'}`).join('\n\n');
}

export function reportSheets(report) {
  const r = report.recap;
  return [
    {
      name: 'Ringkasan',
      columns: [col('Keterangan', 32, 'wrap'), col('Nilai', 46, 'wrap'), col('Maks', 10, 'number')],
      rows: [
        ['Mata ujian', r.subjectName],
        ['Versi pack', r.packVersion],
        ['Paket', `${r.packageName} (${r.packageId})`],
        ['ID sesi', r.sessionId],
        ['Mode', r.mode],
        ['Mulai', date(r.startedAt)],
        ['Dikumpulkan', date(r.submittedAt)],
        ['Cara pengumpulan', r.submittedReason],
        ['Durasi paket', formatMinutes(r.durationMinutes * 60000)],
        ['Waktu pengerjaan', formatMinutes(r.usedMs)],
        ['Status penilaian', r.statusLabel],
        ...r.components.map((c) => [`Skor ${c.label} (${c.graded}/${c.count} dinilai)`, num(c.score), c.max]),
        ['Skor sementara (yang sudah dinilai)', r.interimScore, 100],
        ['Nilai akhir', r.isFinal ? r.finalScore : 'belum final', 100],
        ['Passing grade', r.passingGrade],
        ['Selisih terhadap passing grade', r.isFinal ? r.difference : '—'],
        ['Status kelulusan', passText(r)],
        ['Meninggalkan layar ujian (kali)', int(report.log.focusLostCount)],
        ['Koreksi manual (berlaku)', int(report.corrections.filter((c) => c.active).length)],
        ['Dibuat', date(report.generatedAt)],
        ['Catatan', report.disclaimer],
      ],
    },
    {
      name: 'PG',
      columns: [
        col('No', 6, 'int'), col('ID soal', 16), col('Tipe', 13), col('Topik', 10), col('Kompetensi', 12), col('Kesulitan', 12),
        col('Soal', 60, 'wrap'), col('Opsi A', 28, 'wrap'), col('Opsi B', 28, 'wrap'), col('Opsi C', 28, 'wrap'), col('Opsi D', 28, 'wrap'),
        col('Jawaban', 20, 'wrap'), col('Kunci', 20, 'wrap'), col('Status', 10), col('Skor asli', 10, 'number'), col('Skor', 10, 'number'),
        col('Maks', 10, 'number'), col('Pembahasan', 60, 'wrap'), col('Alasan pilihan lain salah', 60, 'wrap'),
      ],
      rows: report.objective.map((x) => [
        x.no, x.questionId, x.typeLabel, x.topicIds.join(', '), x.competencyIds.join(', '), DIFFICULTY_LABELS[x.difficulty] || x.difficulty,
        x.stem, ...[0, 1, 2, 3].map((i) => (x.options[i] ? x.options[i].text : '')),
        x.answerText, x.keyText, x.status, x.rawScore, x.scaledScore, x.points, x.explanation,
        x.distractors.map((d) => `${d.letter}: ${d.text}`).join('\n'),
      ]),
    },
    {
      name: 'Uraian',
      columns: [
        col('No', 6, 'int'), col('ID soal', 16, 'wrap'), col('Tipe', 12, 'wrap'), col('Topik', 10, 'wrap'), col('Kompetensi', 12, 'wrap'), col('Soal', 60, 'wrap'),
        col('Jawaban peserta (asli)', 70, 'wrap'), col('Jawaban ideal', 60, 'wrap'), col('Skor asli', 10, 'number'), col('Maks asli', 10, 'number'),
        col('Skor', 10, 'number'), col('Maks', 10, 'number'), col('Kekuatan', 45, 'wrap'), col('Kelemahan', 45, 'wrap'), col('Saran', 45, 'wrap'),
        col('Keyakinan', 11, 'wrap'), col('Tanda penilai', 30, 'wrap'), col('Dikoreksi manual', 12, 'wrap'), col('Jumlah AI tidak cocok', 14, 'wrap'), col('Penilai', 24, 'wrap'),
      ],
      rows: report.written.map((x) => [
        x.no, x.questionId, x.typeLabel, x.topicIds.join(', '), x.competencyIds.join(', '),
        [x.stem, x.caseNarrative, ...x.subQuestions.map((s) => `(${s.id}) ${s.prompt}`)].filter(Boolean).join('\n\n'),
        answerText(x),
        x.type === 'case' ? x.subQuestions.map((s) => `(${s.id}) ${s.modelAnswer}`).join('\n\n') : x.modelAnswer,
        x.rawScore, x.maxScore, x.scaledScore, x.points, x.strengths, x.weaknesses, x.improvement,
        x.confidence || (x.graded ? '' : 'belum dinilai'), x.flags.map((f) => `${f.label}: ${f.note}`).join('\n'),
        x.manuallyCorrected, x.sumMismatch, x.graderModel || '',
      ]),
    },
    {
      name: 'Rubrik',
      columns: [
        col('No', 6, 'int'), col('ID soal', 16, 'wrap'), col('Bagian', 8, 'wrap'), col('Kriteria', 9, 'wrap'), col('Deskripsi', 45, 'wrap'),
        col('Skor AI', 10, 'number'), col('Skor dipakai', 12, 'number'), col('Maks', 9, 'number'), col('Dikoreksi manual', 12, 'wrap'),
        col('Alasan penilai', 70, 'wrap'), col('Alasan koreksi manual', 45, 'wrap'),
      ],
      rows: report.written.flatMap((x) => x.rubricRows.map((c) => [
        x.no, x.questionId, c.subId ? `(${c.subId})` : '', c.criterionId, c.description,
        c.aiScore, c.awardedScore, c.maxScore, c.corrected, c.justification, c.correction ? c.correction.reason : '',
      ])),
    },
    {
      name: 'Kompetensi',
      columns: [col('Jenis', 12), col('ID', 8), col('Nama', 45, 'wrap'), col('Skor', 10, 'number'), col('Maks', 10, 'number'), col('Capaian', 12, 'percent'), col('Kategori', 10), col('Nomor soal', 18)],
      rows: [
        ...report.competencies.map((a) => ['Kompetensi', a.id, a.name, a.earned, a.max, percent(a.pct), a.level, a.questions.join(', ')]),
        ...report.topics.map((a) => ['Topik', a.id, a.name, a.earned, a.max, percent(a.pct), a.level, a.questions.join(', ')]),
      ],
    },
    {
      name: 'Remedial',
      columns: [col('Jenis', 12), col('ID', 8), col('Nama', 40, 'wrap'), col('Capaian', 12, 'percent'), col('Tindakan', 90, 'wrap')],
      rows: [
        ...report.remedial.items.flatMap((i) => i.actions.map((a) => [i.kind, i.id, i.name, percent(i.pct), a])),
        ...report.remedial.notes.map((n) => ['Catatan', '', '', null, n]),
      ],
    },
    {
      name: 'Riwayat',
      columns: [col('Dikumpulkan', 24, 'date'), col('Paket', 28), col('ID sesi', 30), col('Nilai', 10, 'number'), col('Passing grade', 13, 'number'), col('Status', 14)],
      rows: report.history.map((h) => [date(h.submittedAt), h.packageName, h.sessionId, h.finalScore, h.passingGrade, h.passed ? 'LULUS' : 'TIDAK LULUS']),
    },
  ];
}
