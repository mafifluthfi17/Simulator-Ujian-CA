// Model data laporan (SPEC 11) dari satu sesi: rekap, ekstraksi PG/numerik,
// ekstraksi esai/kasus, analisis kompetensi dan topik, rencana remedial, log
// sesi, koreksi manual, keterbatasan. Dipakai layar hasil, .docx, .xlsx, HTML.
// Teks generik saja (SPEC 4); nama topik/kompetensi diambil dari pack bila ada.

import { getType } from '../types/registry.js';
import { displayLetterForKey } from '../types/mcq.js';
import { AI_GRADED, componentSummary, currentTotal, effectiveEvaluations } from './scoring.js';
import { focusLostStats } from './session.js';
import { formatNumber, roundScore } from './format.js';

export const DISCLAIMER = 'Simulator belajar, bukan ujian resmi, dan tidak berafiliasi dengan IAI. '
  + 'Passing grade 70 adalah standar latihan internal, bukan ketentuan resmi IAI.';

// SPEC 12: keterbatasan yang wajib diungkapkan (Panduan, Tentang, dan laporan).
export const LIMITATIONS = [
  'Kunci jawaban dapat dilihat oleh siapa pun yang membuka kode sumber aplikasi.',
  'Aplikasi tidak mengunci perangkat. Gunakan Safe Exam Browser (SEB) bila perlu.',
  'JavaScript tidak berjalan saat aplikasi ditutup; tenggat waktu diperiksa saat aplikasi dibuka kembali.',
  'Deteksi perubahan jam perangkat tidak sempurna.',
  'Data hanya tersimpan di perangkat ini dan dapat hilang bila data browser dibersihkan. Buat cadangan sesi secara berkala di Pengaturan.',
  'Penilaian uraian bergantung pada layanan AI pihak ketiga pilihan Anda.',
];

export const STATUS_LABELS = {
  MENUNGGU_PENILAIAN_URAIAN: 'MENUNGGU PENILAIAN URAIAN',
  PENILAIAN_SEBAGIAN: 'PENILAIAN SEBAGIAN',
  FINAL: 'FINAL',
};

export const REASON_LABELS = {
  MANUAL: 'Dikumpulkan peserta',
  TIME_UP: 'Waktu habis (dikumpulkan otomatis)',
  EXPIRED_ON_REOPEN: 'Tenggat lewat saat aplikasi ditutup (dikumpulkan otomatis saat dibuka)',
};

const EVENT_LABELS = {
  start: 'Mulai',
  answer_changed: 'Jawaban diubah',
  flag: 'Tanda soal',
  pause: 'Jeda',
  resume: 'Lanjut',
  warning: 'Peringatan sisa waktu',
  focus_lost: 'Meninggalkan layar ujian',
  clock_anomaly: 'Perubahan jam perangkat terdeteksi',
  submit: 'Dikumpulkan',
};

const FLAG_LABELS = {
  jawaban_kosong: 'Jawaban kosong',
  soal_bermasalah: 'Soal bermasalah',
  ketidakpastian_tinggi: 'Ketidakpastian tinggi',
  instruksi_dalam_jawaban: 'Instruksi di dalam jawaban',
};

export const DIFFICULTY_LABELS = { mudah: 'Mudah', sedang: 'Sedang', sulit: 'Sulit', sangat_sulit: 'Sangat sulit' };

export const LEVEL_RULE = 'kuat ≥ 80%, cukup 70% ≤ capaian < 80%, lemah < 70%';

// Kategori dihitung dari capaian yang DITAMPILKAN (2 desimal), sehingga angka dan
// kategori di laporan selalu sejalan (mis. 79,996% tampil 80,00% dan berkategori kuat).
export function levelFor(pct) {
  if (pct === null) return '—';
  const shown = Math.round(pct * 100) / 100;
  if (shown >= 80) return 'Kuat';
  if (shown >= 70) return 'Cukup';
  return 'Lemah';
}

export const typeLabel = (type) => getType(type).label;

// options: { pack, history: [sesi], now }
export function buildReport(session, { pack = null, history = [], now = Date.now() } = {}) {
  const g = session.grading;
  const evaluations = effectiveEvaluations(session);
  const auto = new Map(g.autoScores.map((s) => [s.questionId, s]));
  const essay = new Map(g.essayScores.map((s) => [s.questionId, s]));
  const topicNames = new Map((pack ? pack.topics : []).map((t) => [t.id, t.name]));
  const competencyNames = new Map((pack ? pack.competencies : []).map((c) => [c.id, c.name]));

  const objective = [];
  const written = [];
  session.items.forEach((item, index) => {
    const no = index + 1;
    const value = session.answers[item.questionId].value;
    if (AI_GRADED.has(item.type)) written.push(writtenItem(item, no, value, evaluations.get(item.questionId), essay.get(item.questionId)));
    else objective.push(objectiveItem(item, no, value, auto.get(item.questionId)));
  });

  const scored = [...objective, ...written].filter((r) => r.scaledScore !== null);
  const topics = analysis(scored, 'topicIds', topicNames);
  const competencies = analysis(scored, 'competencyIds', competencyNames);
  const usedMs = Math.max(0, Date.parse(session.submittedAt) - Date.parse(session.startedAt) - session.totalPausedMs);
  const interim = currentTotal(session);
  const isFinal = g.status === 'FINAL';
  const passingGrade = session.config.passingGrade;

  return {
    generatedAt: new Date(now).toISOString(),
    disclaimer: DISCLAIMER,
    limitations: LIMITATIONS,
    recap: {
      subjectId: session.subjectId,
      subjectName: pack ? pack.subjectName : session.subjectId,
      packVersion: session.packVersion,
      appVersion: session.appVersion,
      packageId: session.packageId,
      packageName: session.packageName,
      sessionId: session.sessionId,
      mode: session.mode === 'ketat' ? 'Mode ketat (tanpa jeda)' : 'Mode latihan (boleh jeda)',
      startedAt: session.startedAt,
      submittedAt: session.submittedAt,
      submittedReason: REASON_LABELS[session.submittedReason] || session.submittedReason,
      durationMinutes: session.config.durationMinutes,
      usedMs,
      pausedMs: session.totalPausedMs,
      status: g.status,
      statusLabel: STATUS_LABELS[g.status],
      isFinal,
      passingGrade,
      finalScore: isFinal ? g.finalScore : null,
      interimScore: interim,
      difference: isFinal ? roundScore(g.finalScore - passingGrade) : null,
      passed: isFinal ? g.passed : null,
      components: componentSummary(session).map((c) => ({ ...c, label: typeLabel(c.type) })),
      questionCount: session.items.length,
      gradedCount: scored.length,
    },
    objective,
    written,
    topics,
    competencies,
    remedial: remedialPlan(topics, competencies, [...objective, ...written], isFinal),
    log: sessionLog(session),
    corrections: correctionList(session, evaluations),
    grader: graderInfo(session),
    history: historyRows(history),
  };
}

function objectiveItem(item, no, value, score) {
  const q = item.question;
  const base = {
    no, questionId: item.questionId, type: item.type, typeLabel: typeLabel(item.type), stem: q.stem,
    topicIds: q.topicIds, competencyIds: q.competencyIds, difficulty: q.difficulty,
    points: item.points, rawScore: score ? score.rawScore : null, scaledScore: score ? score.scaledScore : null,
    maxScore: q.maxScore, explanation: q.explanation || '', references: q.references || [],
  };
  if (item.type === 'mcq') {
    const order = item.optionOrder;
    const textByKey = new Map(q.options.map((o) => [o.key, o.text]));
    const answer = typeof value === 'string' ? displayLetterForKey(order, value) : null;
    const key = displayLetterForKey(order, q.answerKey);
    return {
      ...base,
      options: order.map((orig, i) => ({ letter: 'ABCD'[i], text: textByKey.get(orig), isKey: orig === q.answerKey, isChosen: orig === value })),
      answer,
      key,
      answerText: answer ? `${answer}. ${textByKey.get(value)}` : '(kosong)',
      keyText: `${key}. ${textByKey.get(q.answerKey)}`,
      status: answer === null ? 'KOSONG' : value === q.answerKey ? 'BENAR' : 'SALAH',
      distractors: order.filter((orig) => orig !== q.answerKey)
        .map((orig) => ({ letter: displayLetterForKey(order, orig), text: q.distractorRationale[orig] })),
    };
  }
  const na = q.numericAnswer;
  const unit = na.unit ? ` ${na.unit}` : '';
  const tol = na.tolerance.type === 'relative' ? `±${formatNumber(na.tolerance.value * 100)}%` : `±${formatNumber(na.tolerance.value)}${unit}`;
  const answered = getType('numeric').isAnswered(value);
  return {
    ...base,
    options: [],
    answer: answered ? formatNumber(value) : null,
    key: formatNumber(na.value),
    answerText: answered ? `${formatNumber(value)}${unit}` : '(kosong)',
    keyText: `${formatNumber(na.value)}${unit} (toleransi ${tol})`,
    status: !answered ? 'KOSONG' : score && score.rawScore > 0 ? 'BENAR' : 'SALAH',
    distractors: [],
  };
}

function writtenItem(item, no, value, ev, essayScore) {
  const q = item.question;
  const exported = getType(item.type).exportForGrading(q, value);
  const rubricFor = (subId) => (subId ? q.subQuestions.find((s) => s.id === subId).rubric : q.rubric);
  const rubricRows = ev
    ? ev.criteria.map((c) => {
      const ref = rubricFor(c.subId).find((r) => r.criterionId === c.criterionId);
      return { ...c, description: ref ? ref.description : '' };
    })
    : (item.type === 'essay' ? [{ subId: null, rubric: q.rubric }] : q.subQuestions.map((s) => ({ subId: s.id, rubric: s.rubric })))
      .flatMap(({ subId, rubric }) => rubric.map((r) => ({
        subId, criterionId: r.criterionId, description: r.description, maxScore: r.maxScore,
        aiScore: null, awardedScore: null, justification: '', corrected: false,
      })));
  const subTotals = item.type === 'case'
    ? q.subQuestions.map((s) => ({
      subId: s.id,
      maxScore: s.maxScore,
      awardedScore: ev ? roundScore(rubricRows.filter((r) => r.subId === s.id).reduce((n, r) => n + r.awardedScore, 0)) : null,
    }))
    : [];
  return {
    no,
    questionId: item.questionId,
    type: item.type,
    typeLabel: typeLabel(item.type),
    caseSize: q.caseSize || null,
    stem: q.stem,
    caseNarrative: q.caseNarrative || '',
    caseData: q.caseData || [],
    subQuestions: (q.subQuestions || []).map((s) => ({
      id: s.id, prompt: s.prompt, maxScore: s.maxScore, modelAnswer: s.modelAnswer,
      answer: value && typeof value[s.id] === 'string' ? value[s.id] : '',
    })),
    topicIds: q.topicIds,
    competencyIds: q.competencyIds,
    difficulty: q.difficulty,
    answer: exported.answer,
    isBlank: exported.isBlank,
    modelAnswer: q.modelAnswer || '',
    acceptableAlternatives: q.acceptableAlternatives || '',
    references: q.references || [],
    graded: Boolean(ev),
    rubricRows,
    subTotals,
    maxScore: q.maxScore,
    rawScore: ev ? ev.rawScore : null,
    aiAwardedScore: ev ? ev.aiAwardedScore : null,
    points: item.points,
    scaledScore: essayScore ? essayScore.scaledScore : null,
    strengths: ev ? ev.score.strengths : '',
    weaknesses: ev ? ev.score.weaknesses : '',
    improvement: ev ? ev.score.improvement : '',
    confidence: ev ? ev.score.confidence : null,
    sumMismatch: ev ? ev.sumMismatch : false,
    mismatches: ev ? ev.mismatches : [],
    manuallyCorrected: ev ? ev.manuallyCorrected : false,
    flags: ev ? ev.flags.map((f) => ({ ...f, label: FLAG_LABELS[f.type] || f.type })) : [],
    graderModel: ev ? ev.graderModel : null,
    importedAt: ev ? ev.importedAt : null,
  };
}

// Skor tiap soal dibagi rata ke topik/kompetensinya (sama dengan aturan cakupan, D-22).
function analysis(rows, field, names) {
  const acc = new Map();
  for (const r of rows) {
    const ids = r[field];
    for (const id of ids) {
      const a = acc.get(id) || { id, name: names.get(id) || id, earned: 0, max: 0, questions: [] };
      a.earned += r.scaledScore / ids.length;
      a.max += r.points / ids.length;
      a.questions.push(r.no);
      acc.set(id, a);
    }
  }
  return [...acc.values()].sort((a, b) => a.id.localeCompare(b.id)).map((a) => {
    const earned = roundScore(a.earned);
    const max = roundScore(a.max);
    const pct = max > 0 ? roundScore((earned / max) * 100) : null;
    return { id: a.id, name: a.name, earned, max, pct, level: levelFor(pct), questions: a.questions };
  });
}

// Konsep acuan tanpa duplikat (tanpa memedulikan huruf besar-kecil dan spasi);
// konsep yang sudah tercakup konsep lain yang lebih panjang (sebagai frasa utuh)
// dibuang: "Balanced scorecard" tercakup "Balanced scorecard dan strategy map".
export function dedupeConcepts(list) {
  const norm = (s) => ` ${String(s).toLowerCase().replace(/\s+/g, ' ').trim()} `;
  const unique = [];
  for (const item of list) {
    if (!String(item).trim()) continue;
    if (!unique.some((u) => norm(u) === norm(item))) unique.push(String(item).trim());
  }
  return unique.filter((item) => !unique.some((other) => other !== item
    && norm(other).length > norm(item).length && norm(other).includes(norm(item))));
}

function remedialPlan(topics, competencies, rows, isFinal) {
  const plan = [];
  const missed = (r) => r.scaledScore !== null && r.scaledScore < r.points - 1e-9;
  for (const [kind, list, field] of [['Topik', topics, 'topicIds'], ['Kompetensi', competencies, 'competencyIds']]) {
    for (const a of list.filter((x) => x.level === 'Lemah')) {
      const related = rows.filter((r) => r[field].includes(a.id) && missed(r));
      const refs = dedupeConcepts(related.flatMap((r) => r.references));
      const actions = [];
      if (refs.length) actions.push(`Pelajari ulang konsep: ${refs.join('; ')}.`);
      if (related.length) actions.push(`Baca kembali pembahasan ${related.map((r) => `Soal ${r.no} (${r.questionId})`).join(', ')}.`);
      for (const r of related) {
        if (r.improvement) actions.push(`Saran penilai untuk Soal ${r.no}: ${r.improvement}`);
      }
      if (kind === 'Topik') actions.push(`Berlatih lagi dengan Mode Kustom, filter topik ${a.id}.`);
      plan.push({ kind, id: a.id, name: a.name, pct: a.pct, level: a.level, actions });
    }
  }
  const notes = [];
  if (!isFinal) notes.push('Penilaian uraian belum lengkap; analisis dan rencana ini hanya memakai soal yang sudah dinilai.');
  if (!plan.length) notes.push('Tidak ada topik atau kompetensi berkategori lemah (< 70%). Pertahankan dengan berlatih Simulasi Ujian secara berkala.');
  return { items: plan, notes };
}

function sessionLog(session) {
  const noById = new Map(session.items.map((it, i) => [it.questionId, i + 1]));
  const focus = focusLostStats(session);
  return {
    events: session.events.map((e) => ({
      at: e.at,
      type: e.type,
      label: EVENT_LABELS[e.type] || e.type,
      question: e.questionId ? `Soal ${noById.get(e.questionId) || '?'} (${e.questionId})` : '',
      detail: [e.detail || '', e.durationMs ? `${Math.round(e.durationMs / 1000)} detik` : ''].filter(Boolean).join(' · '),
    })),
    focusLostCount: focus.count,
    focusLostMs: focus.totalMs,
    clockAnomalies: session.events.filter((e) => e.type === 'clock_anomaly').length,
    pauses: session.pauses.length,
  };
}

function correctionList(session, evaluations) {
  const noById = new Map(session.items.map((it, i) => [it.questionId, i + 1]));
  return session.grading.manualCorrections.map((c) => {
    const ev = evaluations.get(c.questionId);
    const active = Boolean(ev && ev.corrections.includes(c));
    return {
      ...c,
      no: noById.get(c.questionId),
      target: `Soal ${noById.get(c.questionId)} (${c.questionId})${c.subId ? ` bagian (${c.subId})` : ''} kriteria ${c.criterionId}`,
      active,
      statusLabel: active ? 'Berlaku' : 'Tidak berlaku lagi (soal dinilai ulang sesudahnya)',
    };
  });
}

function graderInfo(session) {
  return session.grading.aiImports.map((imp, i) => ({
    no: i + 1,
    importedAt: imp.importedAt,
    graderModel: imp.result.graderModel,
    questionIds: imp.result.scores.map((s) => s.questionId),
    overallFeedback: imp.result.overallFeedback,
    warnings: imp.warnings || [],
  }));
}

function historyRows(sessions) {
  return finalSessions(sessions).map((s) => ({
    sessionId: s.sessionId,
    packageId: s.packageId,
    packageName: s.packageName,
    startedAt: s.startedAt,
    submittedAt: s.submittedAt,
    finalScore: s.grading.finalScore,
    passingGrade: s.config.passingGrade,
    passed: s.grading.passed,
  }));
}

export function finalSessions(sessions) {
  return sessions
    .filter((s) => s.status === 'SUBMITTED' && s.grading && s.grading.status === 'FINAL')
    .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
}

// Deret tren nilai per paket (Riwayat): [{ packageId, packageName, points: [{ at, score, passed, sessionId }] }].
export function trendSeries(sessions) {
  const byPackage = new Map();
  for (const s of finalSessions(sessions)) {
    const series = byPackage.get(s.packageId) || { packageId: s.packageId, packageName: s.packageName, points: [] };
    series.points.push({ at: s.submittedAt, score: s.grading.finalScore, passed: s.grading.passed, sessionId: s.sessionId, passingGrade: s.config.passingGrade });
    byPackage.set(s.packageId, series);
  }
  return [...byPackage.values()];
}
