// Layar Hasil Ujian (SPEC 10-11): status penilaian, alur penilaian uraian dengan
// AI pilihan pengguna (salin prompt + data, tempel hasil), koreksi manual,
// laporan lengkap, dan ekspor (.docx, Lembar Belajar, .xlsx, PDF, JSON, HTML,
// cadangan .doc/.csv). Semua teks peserta/AI masuk lewat textContent.

import { h, append, clear, confirmDialog, alertDialog, formDialog, toast } from './dom.js';
import { disclaimer, header } from './layout.js';
import { reportSections } from './report-view.js';
import { aiItems, needsAiGrading } from '../core/scoring.js';
import { buildReport, STATUS_LABELS } from '../core/report.js';
import {
  applyGradingResult, applyManualCorrection, buildGradingPackage, promptPlusData, validateGradingResult,
} from '../core/grading-io.js';
import { formatErrors, listSessions } from '../core/session-store.js';
import { PROMPTS } from '../core/prompts.js';
import { formatDateTime, formatFixed2, formatNumber, formatScore, parseDecimalInput } from '../core/format.js';
import { reportBlocks } from '../export/report-blocks.js';
import { reportFile } from '../export/report-files.js';
import { saveFile } from '../export/download.js';

const GRADING_PROMPT = 'prompt_penilai_ai.md';
const STATUS_CLASS = { MENUNGGU_PENILAIAN_URAIAN: 'badge-wait', PENILAIAN_SEBAGIAN: 'badge-wait', FINAL: '' };
const OPEN_SECTIONS = ['1. Rekap Nilai'];

export function renderResults(app, { session }) {
  const el = h('div', { class: 'screen report-screen' });
  let importErrors = [];
  let pasted = '';
  render();

  function render() {
    const y = window.scrollY;
    const openNow = [...el.querySelectorAll('details.report-section[open] .summary-title')].map((s) => s.textContent);
    clear(el);
    const pack = app.packFor(session.subjectId);
    const report = buildReport(session, { pack, history: listSessions(app.store, session.subjectId).sessions });
    append(el, [
      header(app, { title: 'Hasil Ujian' }),
      h('p', { class: 'hint', text: `${report.recap.subjectName} · ${session.packageName} · ${formatDateTime(session.startedAt)}` }),
      h('span', { class: `badge ${STATUS_CLASS[session.grading.status]}`, text: STATUS_LABELS[session.grading.status] }),
      session.submittedReason !== 'MANUAL' ? h('p', { class: 'notice', text: report.recap.submittedReason }) : null,
      scoreCard(report),
      needsAiGrading(session) ? gradingCard() : null,
      h('h2', { text: 'Laporan' }),
      reportSections(reportBlocks(report), {
        open: openNow.length ? openNow : OPEN_SECTIONS,
        hooks: { afterHeading: (block) => (block.questionId ? correctionButton(block.questionId) : null) },
      }),
      exportCard(report),
      h('div', { class: 'row no-print' },
        h('button', { type: 'button', class: 'btn btn-primary', onclick: () => app.show('home') }, 'Ke Beranda'),
        h('button', { type: 'button', class: 'btn', onclick: () => app.show('history') }, 'Riwayat')),
      disclaimer()]);
    if (y) window.scrollTo(0, y);
  }

  function scoreCard(report) {
    const r = report.recap;
    const rows = r.components.map((c) => h('tr', {},
      h('td', { text: c.label }),
      h('td', { class: 'num', text: String(c.count) }),
      h('td', { class: 'num', text: c.graded === 0 ? 'menunggu' : `${formatFixed2(c.score)}${c.pending ? ' (sebagian)' : ''}` }),
      h('td', { class: 'num', text: formatFixed2(c.max) })));
    const final = r.isFinal
      ? h('div', {},
        h('p', {}, 'Nilai akhir'),
        h('p', { class: 'big-score', text: formatScore(r.finalScore) }),
        h('p', { text: `Passing grade ${formatFixed2(r.passingGrade)} · selisih ${r.difference >= 0 ? '+' : ''}${formatFixed2(r.difference)}` }),
        h('span', { class: `badge ${r.passed ? 'badge-pass' : 'badge-fail'}`, text: r.passed ? 'LULUS' : 'TIDAK LULUS' }))
      : h('p', { class: 'notice notice-info', text: `Skor sementara ${formatScore(r.interimScore)} (soal yang sudah dinilai). Nilai akhir dan status LULUS/TIDAK LULUS tampil setelah semua jawaban esai dan kasus dinilai.` });
    return h('div', { class: 'card' },
      h('table', { class: 'score-table' },
        h('thead', {}, h('tr', {},
          h('th', { text: 'Komponen' }), h('th', { class: 'num', text: 'Soal' }),
          h('th', { class: 'num', text: 'Skor' }), h('th', { class: 'num', text: 'Maks' }))),
        h('tbody', {}, rows)),
      final);
  }

  // ---- Penilaian uraian dengan AI pilihan pengguna ----
  function gradingCard() {
    const graded = new Set(session.grading.essayScores.map((s) => s.questionId));
    const noById = new Map(session.items.map((it, i) => [it.questionId, i + 1]));
    const statusList = h('ul', { class: 'grade-status' }, aiItems(session).map((it) => {
      const s = session.grading.essayScores.find((e) => e.questionId === it.questionId);
      return h('li', {},
        h('span', { text: `Soal ${noById.get(it.questionId)} · ${it.type === 'essay' ? 'Esai' : 'Studi kasus'} · ${it.questionId}` }),
        h('span', { class: graded.has(it.questionId) ? 'pass' : 'hint', text: s ? `dinilai: ${formatNumber(s.rawScore)}/${formatNumber(it.originalMaxScore)}` : 'belum dinilai' }));
    }));
    const area = h('textarea', {
      class: 'answer-text paste-area', rows: 8, spellcheck: 'false', 'aria-label': 'Tempel hasil penilaian dari AI',
      placeholder: 'Tempel di sini seluruh jawaban AI (diawali tanda { dan diakhiri tanda }).',
      oninput: () => { pasted = area.value; },
    });
    area.value = pasted;
    const fileInput = h('input', { type: 'file', accept: '.json,.txt,application/json,text/plain', hidden: true, onchange: () => importFile(fileInput) });
    const done = graded.size === aiItems(session).length;
    return h('div', { class: 'card grading-card no-print' },
      h('h2', { style: 'margin-top:0', text: 'Penilaian esai dan kasus' }),
      h('p', { text: done
        ? 'Semua jawaban uraian sudah dinilai. Anda tetap dapat mengimpor penilaian ulang bila perlu.'
        : 'Jawaban esai dan kasus dinilai dengan layanan AI pilihan Anda. Aplikasi tidak memiliki AI bawaan dan tidak mengirim data sendiri.' }),
      statusList,
      h('h3', { text: 'Langkah 1 — Salin soal dan jawaban untuk AI' }),
      h('p', { class: 'hint', text: 'Tempel ke percakapan baru di layanan AI pilihan Anda (mis. ChatGPT, Claude, Gemini), lalu kirim.' }),
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn btn-primary', onclick: copyPackage }, 'Salin Prompt + Data'),
        h('button', { type: 'button', class: 'btn', onclick: () => downloadPackage('txt') }, 'Unduh sebagai teks'),
        h('button', { type: 'button', class: 'btn', onclick: () => downloadPackage('json') }, 'Unduh berkas data')),
      h('h3', { text: 'Langkah 2 — Tempel jawaban AI' }),
      area,
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn btn-primary', onclick: () => importText(area.value) }, 'Periksa & Simpan Nilai'),
        h('button', { type: 'button', class: 'btn', onclick: () => fileInput.click() }, 'Ambil dari berkas'),
        fileInput),
      importErrors.length ? h('div', { class: 'notice import-errors', role: 'alert' },
        h('p', {}, h('strong', { text: 'Hasil penilaian ditolak.' }), ' Tidak ada nilai yang disimpan. Perbaiki hal berikut (atau minta AI memperbaikinya), lalu tempel lagi:'),
        h('ul', { class: 'error-list' }, formatErrors(importErrors, 15).map((line) => h('li', { text: line })))) : null);
  }

  async function confirmPrivacy(action) {
    return confirmDialog({
      title: 'Jawaban akan dikirim ke layanan AI',
      body: [
        'Paket ini berisi soal, rubrik, dan jawaban esai/kasus Anda apa adanya.',
        'Anda sendiri yang menempelkannya ke layanan AI pilihan Anda; aplikasi tidak mengirim data ke mana pun.',
        'Data akan diproses oleh layanan tersebut sesuai kebijakan privasinya. Jangan menulis data pribadi di jawaban.',
      ],
      confirmLabel: action,
    });
  }

  async function copyPackage() {
    if (!(await confirmPrivacy('Saya mengerti, salin'))) return;
    const text = promptPlusData(PROMPTS[GRADING_PROMPT], await packageFor());
    try {
      await navigator.clipboard.writeText(text);
      toast('Prompt + data tersalin. Tempel ke layanan AI pilihan Anda.');
    } catch {
      manualCopy(text);
    }
  }

  // Cadangan bila papan klip tidak diizinkan (mis. dibuka dari berkas lokal).
  function manualCopy(text) {
    const box = h('textarea', { class: 'answer-text', rows: 10, readonly: true, 'aria-label': 'Prompt dan data penilaian' });
    box.value = text;
    alertDialog('Salin secara manual', [
      'Papan klip tidak dapat diakses otomatis. Pilih semua teks di bawah lalu salin (Ctrl+A lalu Ctrl+C, atau tekan lama lalu Pilih Semua dan Salin).',
      box,
    ]);
    setTimeout(() => { box.focus(); box.select(); }, 50);
  }

  async function packageFor() {
    const pkg = await buildGradingPackage(session);
    if (session.grading.answersChecksum !== pkg.answersChecksum) {
      session.grading.answersChecksum = pkg.answersChecksum;
      app.persist(session);
    }
    return pkg;
  }

  async function downloadPackage(kind) {
    if (!(await confirmPrivacy('Saya mengerti, unduh'))) return;
    const pkg = await packageFor();
    if (kind === 'json') saveFile({ filename: `paket-penilaian-${session.sessionId}.json`, mime: 'application/json', data: JSON.stringify(pkg, null, 2) });
    else saveFile({ filename: `prompt-penilaian-${session.sessionId}.txt`, mime: 'text/plain;charset=utf-8', data: promptPlusData(PROMPTS[GRADING_PROMPT], pkg) });
  }

  async function importFile(input) {
    const file = input.files[0];
    input.value = '';
    if (!file) return;
    pasted = await file.text();
    await importText(pasted);
  }

  async function importText(text) {
    pasted = text;
    const v = await validateGradingResult(session, text);
    if (!v.ok) {
      importErrors = v.errors;
      render();
      el.querySelector('.import-errors').scrollIntoView({ block: 'center' });
      return;
    }
    importErrors = [];
    const noById = new Map(session.items.map((it, i) => [it.questionId, i + 1]));
    const body = [`Penilai: ${v.result.graderModel}. Soal dinilai: ${v.questionIds.map((id) => `Soal ${noById.get(id)} (${id})`).join(', ')}.`];
    if (v.regraded.length) body.push(`Nilai sebelumnya untuk ${v.regraded.join(', ')} akan DIGANTI. Riwayat penilaian lama dan koreksi manual tetap tercatat di laporan.`);
    if (v.warnings.length) body.push('Catatan:', ...v.warnings.map((w) => `• ${w}`));
    const ok = await confirmDialog({ title: 'Simpan hasil penilaian?', body, confirmLabel: 'Simpan nilai', danger: v.regraded.length > 0 });
    if (!ok) {
      render();
      return;
    }
    await applyGradingResult(session, v, Date.now());
    pasted = '';
    if (app.persist(session)) toast(`Nilai tersimpan. Status: ${STATUS_LABELS[session.grading.status]}.`);
    render();
  }

  // ---- Koreksi manual per kriteria ----
  function correctionButton(questionId) {
    if (!session.grading.essayScores.some((s) => s.questionId === questionId)) return null;
    return h('button', { type: 'button', class: 'btn btn-small no-print', onclick: () => openCorrection(questionId) }, 'Koreksi skor kriteria');
  }

  async function openCorrection(questionId) {
    const report = buildReport(session, { pack: app.packFor(session.subjectId) });
    const item = report.written.find((w) => w.questionId === questionId);
    const select = h('select', { id: 'corr-criterion' }, item.rubricRows.map((c, i) => h('option', { value: String(i) },
      `${c.subId ? `(${c.subId}) ` : ''}${c.criterionId} — ${c.description} · skor ${formatNumber(c.awardedScore)} dari ${formatNumber(c.maxScore)}`)));
    const score = h('input', { type: 'text', id: 'corr-score', inputmode: 'decimal', autocomplete: 'off' });
    const reason = h('textarea', { id: 'corr-reason', class: 'answer-text', rows: 3 });
    const ok = await formDialog({
      title: `Koreksi skor — Soal ${item.no}`,
      body: [
        h('p', { class: 'hint', text: 'Ubah skor satu kriteria (skala asli, kelipatan 0,5). Koreksi dicatat dan ditandai DIKOREKSI MANUAL di laporan.' }),
        h('div', { class: 'field' }, h('label', { for: 'corr-criterion', text: 'Kriteria' }), select),
        h('div', { class: 'field' }, h('label', { for: 'corr-score', text: 'Skor baru' }), score),
        h('div', { class: 'field' }, h('label', { for: 'corr-reason', text: 'Alasan koreksi (wajib)' }), reason),
      ],
      confirmLabel: 'Simpan koreksi',
      validate: () => {
        const c = item.rubricRows[Number(select.value)];
        const after = parseDecimalInput(score.value);
        if (after === null) return 'Isi skor baru dengan angka, mis. 2 atau 2,5.';
        applyManualCorrection(session, { questionId, subId: c.subId, criterionId: c.criterionId, after, reason: reason.value }, Date.now());
        return null;
      },
    });
    if (!ok) return;
    if (app.persist(session)) toast('Koreksi tersimpan.');
    render();
  }

  // ---- Ekspor ----
  function exportCard(report) {
    const btn = (label, kind, primary) => h('button', { type: 'button', class: primary ? 'btn btn-primary' : 'btn', onclick: () => exportFile(kind) }, label);
    return h('div', { class: 'card no-print' },
      h('h2', { style: 'margin-top:0', text: 'Unduh laporan' }),
      report.recap.isFinal ? null : h('p', { class: 'hint', text: 'Penilaian belum final: laporan yang diunduh sekarang memuat status dan skor sementara.' }),
      h('div', { class: 'row' },
        btn('Word (.docx)', 'docx', true),
        btn('Excel (.xlsx)', 'xlsx', true),
        h('button', { type: 'button', class: 'btn', onclick: printReport }, 'PDF (cetak)'),
        btn('Lembar Belajar (.docx)', 'study'),
        btn('Halaman web', 'html'),
        btn('Berkas data sesi', 'json')),
      h('p', { class: 'hint', text: 'Berkas data sesi dapat diimpor kembali lewat Pengaturan › Cadangan sesi (mis. untuk memindahkan hasil ke perangkat lain).' }),
      h('details', {},
        h('summary', { text: 'Format cadangan bila berkas Word/Excel tidak dapat dibuka' }),
        h('div', { class: 'row' },
          btn('Word sederhana (.doc)', 'doc'),
          btn('Lembar Belajar (.doc)', 'study-doc'),
          btn('Tabel (.csv)', 'csv'))));
  }

  function exportFile(kind) {
    const pack = app.packFor(session.subjectId);
    const report = buildReport(session, { pack, history: listSessions(app.store, session.subjectId).sessions });
    let file;
    try {
      file = reportFile(kind, { report, session });
    } catch (e) {
      alertDialog('Berkas gagal dibuat', [e.message]);
      return;
    }
    saveFile(file);
    if (file.fallbackMessage) alertDialog('Berkas cadangan dipakai', [file.fallbackMessage]);
  }

  // PDF lewat dialog cetak browser (SPEC 11). Semua bagian dibuka agar ikut tercetak.
  function printReport() {
    const sections = [...el.querySelectorAll('details')];
    const wasOpen = sections.map((d) => d.open);
    sections.forEach((d) => { d.open = true; });
    const restore = () => {
      sections.forEach((d, i) => { d.open = wasOpen[i]; });
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    window.print();
  }

  return { el };
}
