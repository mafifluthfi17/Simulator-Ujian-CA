// Laporan -> daftar blok dokumen (lihat docx.js). Blok yang sama dirender ke
// .docx (docx.js) dan ke HTML satu berkas / fallback .doc (html-report.js).
// Struktur Word "Laporan & Pembahasan" (SPEC 11): sampul; rekap nilai; analisis
// kompetensi; pembahasan PG; pembahasan esai dan kasus; remedial; lampiran.

import { DIFFICULTY_LABELS, LEVEL_RULE } from '../core/report.js';
import { formatDateTime, formatFixed2, formatMinutes, formatNumber, formatScore } from '../core/format.js';

const p = (text, opts = {}) => ({ type: 'paragraph', text, ...opts });
const h1 = (text) => ({ type: 'heading', level: 1, text });
const h2 = (text) => ({ type: 'heading', level: 2, text });
const h3 = (text) => ({ type: 'heading', level: 3, text });
const labelled = (label, value) => ({ type: 'paragraph', runs: [{ text: `${label}: `, bold: true }, { text: value }] });
const score = (n) => (n === null || n === undefined ? '—' : formatFixed2(n));
// Nilai total memakai aturan SPEC 10 (4 desimal di sekitar batas lulus 70).
const total = (n) => (n === null || n === undefined ? '—' : formatScore(n));
const pct = (n) => (n === null ? '—' : `${formatNumber(Math.round(n * 100) / 100)}%`);
const subLabel = (subId) => (subId ? `(${subId})` : '—');

export function passText(recap) {
  if (!recap.isFinal) return `Belum final (${recap.statusLabel})`;
  return recap.passed ? 'LULUS' : 'TIDAK LULUS';
}

function cover(report, title) {
  const r = report.recap;
  return [
    { type: 'title', text: title },
    { type: 'subtitle', text: `${r.subjectName} — ${r.packageName}` },
    labelled('Tanggal ujian', formatDateTime(r.startedAt)),
    labelled('ID sesi', r.sessionId),
    labelled('Status penilaian', r.statusLabel),
    labelled('Nilai akhir', r.isFinal ? `${formatScore(r.finalScore)} — ${passText(r)}` : 'belum tersedia sampai penilaian uraian lengkap'),
    labelled('Dibuat', formatDateTime(report.generatedAt)),
    p(report.disclaimer, { muted: true, italic: true }),
    { type: 'pageBreak' },
  ];
}

function recapBlocks(report) {
  const r = report.recap;
  const rows = [
    ['Mata ujian', `${r.subjectName} (pack versi ${r.packVersion})`],
    ['Paket', `${r.packageName} (${r.packageId})`],
    ['Mode', r.mode],
    ['Mulai', formatDateTime(r.startedAt)],
    ['Dikumpulkan', `${formatDateTime(r.submittedAt)} — ${r.submittedReason}`],
    ['Durasi paket', formatMinutes(r.durationMinutes * 60000)],
    ['Waktu pengerjaan', `${formatMinutes(r.usedMs)}${r.pausedMs ? ` (di luar jeda ${formatMinutes(r.pausedMs)})` : ''}`],
    ['Status penilaian', r.statusLabel],
    ['Passing grade', score(r.passingGrade)],
    ['Nilai akhir', r.isFinal ? total(r.finalScore) : `belum final (skor sementara ${total(r.interimScore)})`],
    ['Selisih terhadap passing grade', r.isFinal ? `${r.difference >= 0 ? '+' : ''}${score(r.difference)}` : '—'],
    ['Status kelulusan', passText(r)],
  ];
  return [
    h1('1. Rekap Nilai'),
    { type: 'table', columns: [{ header: 'Keterangan', width: 2 }, { header: 'Nilai', width: 5 }], rows },
    h2('Skor per komponen'),
    {
      type: 'table',
      columns: [{ header: 'Komponen', width: 3 }, { header: 'Soal', width: 1 }, { header: 'Sudah dinilai', width: 2 }, { header: 'Skor', width: 2 }, { header: 'Maks', width: 2 }],
      rows: [
        ...r.components.map((c) => [c.label, String(c.count), String(c.graded), score(c.score), score(c.max)]),
        [{ text: 'Total', bold: true }, String(r.questionCount), String(r.gradedCount), { text: total(r.isFinal ? r.finalScore : r.interimScore), bold: true }, { text: '100,00', bold: true }],
      ],
    },
    p('Nilai akhir dihitung aplikasi: skor pilihan ganda/numerik + skor uraian (jumlah skor kriteria × faktor skala paket). LULUS bila nilai ≥ passing grade sebelum pembulatan.', { small: true, muted: true }),
  ];
}

function analysisTable(list) {
  if (!list.length) return [p('Belum ada soal yang dinilai.')];
  return [{
    type: 'table',
    columns: [{ header: 'ID', width: 1 }, { header: 'Nama', width: 4 }, { header: 'Skor', width: 1.4 }, { header: 'Maks', width: 1.4 }, { header: 'Capaian', width: 1.4 }, { header: 'Kategori', width: 1.4 }],
    rows: list.map((a) => [a.id, a.name, score(a.earned), score(a.max), pct(a.pct), { text: a.level, bold: a.level === 'Lemah' }]),
  }];
}

function analysisBlocks(report) {
  return [
    h1('2. Analisis Kompetensi dan Topik'),
    p(`Capaian = skor diperoleh ÷ skor maksimum soal terkait (skor soal dengan beberapa topik/kompetensi dibagi rata). Kategori: ${LEVEL_RULE}.`, { small: true, muted: true }),
    ...(report.recap.isFinal ? [] : [p('Penilaian uraian belum lengkap; analisis hanya memakai soal yang sudah dinilai.', { italic: true })]),
    h2('Kompetensi'),
    ...analysisTable(report.competencies),
    h2('Topik'),
    ...analysisTable(report.topics),
  ];
}

function objectiveBlocks(r, { study }) {
  const blocks = [h2(`Soal ${r.no} · ${r.typeLabel} · ${r.questionId}`), p(r.stem, { keepNext: r.type === 'mcq' })];
  if (r.type === 'mcq') {
    blocks.push({
      type: 'table',
      keepTogether: true,
      columns: [{ header: 'Opsi', width: 1 }, { header: 'Teks', width: 7 }, { header: 'Keterangan', width: 2.5 }],
      rows: r.options.map((o) => [
        o.letter, o.text,
        [o.isKey ? 'Kunci' : '', !study && o.isChosen ? 'Jawaban Anda' : ''].filter(Boolean).join(' · '),
      ].map((text, i) => (i === 2 && o.isKey ? { text, bold: true, fill: 'DCF2E3' } : text))),
    });
  }
  if (study) blocks.push(labelled('Kunci', r.keyText));
  else {
    blocks.push(labelled('Jawaban Anda', r.answerText), labelled('Kunci', r.keyText));
    blocks.push(labelled('Status', `${r.status} · skor ${score(r.scaledScore)} dari ${score(r.points)}`));
  }
  blocks.push(labelled('Pembahasan', r.explanation || '—'));
  if (r.distractors.length) {
    blocks.push(p('Mengapa pilihan lain salah:', { bold: true }));
    blocks.push({ type: 'bullets', items: r.distractors.map((d) => `${d.letter} — ${d.text}`) });
  }
  return blocks;
}

function caseBlocks(r) {
  const blocks = [];
  if (r.caseNarrative) blocks.push(p(r.caseNarrative));
  for (const t of r.caseData) {
    blocks.push(p(t.title, { bold: true, keepNext: true }));
    blocks.push({
      type: 'table',
      keepTogether: true,
      columns: t.columns.map((c) => ({ header: c, width: 1 })),
      rows: t.rows.map((row) => row.map((cell) => (typeof cell === 'number' ? formatNumber(cell) : cell))),
    });
  }
  return blocks;
}

function rubricTable(r, { study }) {
  if (study) {
    return {
      type: 'table',
      keepTogether: true,
      columns: [{ header: 'Bagian', width: 1 }, { header: 'Kriteria', width: 1 }, { header: 'Deskripsi', width: 6 }, { header: 'Maks', width: 1 }],
      rows: r.rubricRows.map((c) => [subLabel(c.subId), c.criterionId, c.description, score(c.maxScore)]),
    };
  }
  return {
    type: 'table',
    keepTogether: true,
    columns: [{ header: 'Bagian', width: 1 }, { header: 'Kriteria', width: 1 }, { header: 'Deskripsi', width: 3 }, { header: 'Skor', width: 1.1 }, { header: 'Maks', width: 1 }, { header: 'Alasan penilai', width: 5 }],
    rows: r.rubricRows.map((c) => [
      subLabel(c.subId), c.criterionId, c.description,
      c.corrected ? { text: `${score(c.awardedScore)}*`, bold: true, fill: 'FDECD3' } : score(c.awardedScore),
      score(c.maxScore),
      c.corrected
        ? `${c.justification || '—'}\nKoreksi manual (skor AI ${score(c.aiScore)} → ${score(c.awardedScore)}): ${c.correction.reason}`
        : c.justification || '—',
    ]),
  };
}

// Catatan kaki untuk tanda * pada tabel rubrik.
function correctionNote(r) {
  const fixed = r.rubricRows.filter((c) => c.corrected);
  if (!fixed.length) return [];
  const list = fixed.map((c) => `${c.subId ? `(${c.subId}) ` : ''}${c.criterionId}: AI ${score(c.aiScore)} → ${score(c.awardedScore)}`).join('; ');
  return [p(`* Dikoreksi manual — ${list}. Rincian di Lampiran B.`, { small: true, italic: true })];
}

function writtenBlocks(r, { study }) {
  // questionId pada judul dipakai layar hasil untuk menaruh tombol koreksi; diabaikan Word/HTML.
  const blocks = [{ ...h2(`Soal ${r.no} · ${r.typeLabel}${r.caseSize ? ` ${r.caseSize}` : ''} · ${r.questionId}`), questionId: study ? undefined : r.questionId }];
  blocks.push(p(`Kesulitan: ${DIFFICULTY_LABELS[r.difficulty] || r.difficulty} · Topik: ${r.topicIds.join(', ')} · Kompetensi: ${r.competencyIds.join(', ')}`, { small: true, muted: true }));
  blocks.push(h3('Soal'), p(r.stem), ...caseBlocks(r));
  if (r.type === 'case') {
    for (const s of r.subQuestions) blocks.push(labelled(`(${s.id}) [maks ${score(s.maxScore)}]`, s.prompt));
  }
  if (!study) {
    blocks.push(h3('Jawaban Anda (asli, utuh)'));
    if (r.type === 'case') {
      for (const s of r.subQuestions) blocks.push(p(`(${s.id})`, { bold: true }), p(s.answer.trim() ? s.answer : '(kosong)'));
    } else {
      blocks.push(p(r.isBlank ? '(kosong)' : r.answer));
    }
  }
  blocks.push(h3('Jawaban ideal'));
  if (r.type === 'case') {
    for (const s of r.subQuestions) blocks.push(p(`(${s.id})`, { bold: true }), p(s.modelAnswer));
  } else {
    blocks.push(p(r.modelAnswer));
  }
  if (r.acceptableAlternatives) blocks.push(labelled('Alternatif yang dapat diterima', r.acceptableAlternatives));
  blocks.push(h3(study ? 'Rubrik' : 'Rubrik dan skor per kriteria'), rubricTable(r, { study }));
  if (!study) blocks.push(...correctionNote(r));
  if (study) return blocks;
  if (!r.graded) {
    blocks.push(p('Belum dinilai. Impor hasil penilaian AI di layar Hasil Ujian.', { italic: true }));
    return blocks;
  }
  const subs = r.subTotals.map((s) => `(${s.subId}) ${score(s.awardedScore)}/${score(s.maxScore)}`).join(' · ');
  blocks.push(labelled('Skor', `${score(r.rawScore)} dari ${score(r.maxScore)} (skala asli${subs ? `: ${subs}` : ''}) → ${score(r.scaledScore)} dari ${score(r.points)} poin`));
  if (r.sumMismatch) {
    blocks.push(p(`Catatan: awardedScore dari AI (${score(r.aiAwardedScore)}) tidak sama dengan jumlah skor kriteria; aplikasi memakai jumlah kriteria.`, { italic: true }));
  }
  if (r.manuallyCorrected) blocks.push(p('DIKOREKSI MANUAL: sebagian skor kriteria diubah manual (tanda * pada tabel rubrik).', { bold: true }));
  blocks.push(labelled('Kekuatan', r.strengths || '—'), labelled('Kelemahan', r.weaknesses || '—'), labelled('Saran perbaikan', r.improvement || '—'));
  blocks.push(p(`Keyakinan penilai: ${r.confidence} · Penilai: ${r.graderModel}`, { small: true, muted: true }));
  if (r.flags.length) {
    blocks.push(p('Tanda dari penilai:', { bold: true }), { type: 'bullets', items: r.flags.map((f) => `${f.label}: ${f.note}`) });
  }
  return blocks;
}

function remedialBlocks(report) {
  const blocks = [h1('5. Rencana Remedial')];
  for (const note of report.remedial.notes) blocks.push(p(note, { italic: true }));
  for (const item of report.remedial.items) {
    blocks.push(h2(`${item.kind} ${item.id} — ${item.name} (capaian ${pct(item.pct)})`), { type: 'bullets', items: item.actions });
  }
  return blocks;
}

function appendixBlocks(report) {
  const log = report.log;
  const blocks = [
    h1('Lampiran'),
    h2('A. Log sesi'),
    p(`Meninggalkan layar ujian: ${log.focusLostCount} kali, total ${formatMinutes(log.focusLostMs)} (informasi, bukan hukuman). Jeda: ${log.pauses} kali. Perubahan jam terdeteksi: ${log.clockAnomalies} kali (deteksi tidak sempurna).`),
    {
      type: 'table',
      columns: [{ header: 'Waktu', width: 3 }, { header: 'Kejadian', width: 3 }, { header: 'Soal', width: 3 }, { header: 'Keterangan', width: 3 }],
      rows: log.events.map((e) => [formatDateTime(e.at), e.label, e.question, e.detail]),
    },
    h2('B. Koreksi manual'),
  ];
  if (report.corrections.length) {
    blocks.push({
      type: 'table',
      keepTogether: report.corrections.length <= 6,
      columns: [{ header: 'Waktu', width: 2.5 }, { header: 'Skor yang dikoreksi', width: 3 }, { header: 'Sebelum', width: 1.6 }, { header: 'Sesudah', width: 1.6 }, { header: 'Alasan', width: 4 }, { header: 'Status', width: 2 }],
      rows: report.corrections.map((c) => [formatDateTime(c.at), c.target, score(c.before), score(c.after), c.reason, c.statusLabel]),
    });
  } else {
    blocks.push(p('Tidak ada koreksi manual.'));
  }
  blocks.push(h2('C. Penilaian uraian oleh AI'));
  if (report.grader.length) {
    for (const g of report.grader) {
      blocks.push(labelled(`Impor ${g.no}`, `${formatDateTime(g.importedAt)} · ${g.graderModel} · ${g.questionIds.join(', ')}`));
      if (g.overallFeedback) blocks.push(labelled('Umpan balik umum', g.overallFeedback));
      if (g.warnings.length) blocks.push({ type: 'bullets', items: g.warnings });
    }
    blocks.push(p('Skor uraian berasal dari layanan AI pilihan peserta, divalidasi aplikasi (checksum jawaban, batas skor, jumlah kriteria). Aplikasi tidak memiliki AI bawaan.', { small: true, muted: true }));
  } else {
    blocks.push(p('Belum ada hasil penilaian AI yang diimpor.'));
  }
  blocks.push(h2('D. Keterbatasan'), { type: 'bullets', items: report.limitations }, p(report.disclaimer, { italic: true, muted: true }));
  return blocks;
}

export function reportBlocks(report) {
  return [
    ...cover(report, 'Laporan & Pembahasan'),
    ...recapBlocks(report),
    ...analysisBlocks(report),
    h1('3. Pembahasan Pilihan Ganda dan Numerik'),
    ...(report.objective.length ? report.objective.flatMap((r) => objectiveBlocks(r, { study: false })) : [p('Tidak ada soal pilihan ganda atau numerik.')]),
    h1('4. Pembahasan Esai dan Kasus'),
    ...(report.written.length ? report.written.flatMap((r) => writtenBlocks(r, { study: false })) : [p('Tidak ada soal esai atau kasus.')]),
    ...remedialBlocks(report),
    ...appendixBlocks(report),
  ];
}

// Lembar Belajar: soal, kunci, pembahasan, rubrik; tanpa jawaban dan skor peserta.
export function studySheetBlocks(report) {
  const r = report.recap;
  return [
    { type: 'title', text: 'Lembar Belajar' },
    { type: 'subtitle', text: `${r.subjectName} — ${r.packageName}` },
    p(`Soal dari sesi ${formatDateTime(r.startedAt)} beserta kunci, pembahasan, jawaban ideal, dan rubrik. Tidak memuat jawaban maupun nilai peserta.`),
    p(report.disclaimer, { muted: true, italic: true }),
    h1('Pilihan Ganda dan Numerik'),
    ...(report.objective.length ? report.objective.flatMap((x) => objectiveBlocks(x, { study: true })) : [p('Tidak ada soal pilihan ganda atau numerik.')]),
    h1('Esai dan Kasus'),
    ...(report.written.length ? report.written.flatMap((x) => writtenBlocks(x, { study: true })) : [p('Tidak ada soal esai atau kasus.')]),
  ];
}
