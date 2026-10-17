// Ruang ujian gaya SEB (SPEC 3 dan 9): bilah atas tipis (nama paket, timer,
// Daftar Soal, KUMPULKAN), tanpa menu lain. Timer dihitung dari deadline;
// jawaban tersimpan otomatis (debounce < 1 detik); focus_lost dan clock_anomaly dicatat.

import { h, confirmDialog, toast } from './dom.js';
import { getType, isItemAnswered } from '../types/registry.js';
import {
  answerSummary, logEvent, pause, remainingMs, resume, setAnswer, submit, toggleFlag,
} from '../core/session.js';
import { ClockWatch, dueWarning } from '../core/timer.js';
import { formatClockTime, formatDuration, formatScore } from '../core/format.js';

const TICK_MS = 500;
const SAVE_DEBOUNCE_MS = 600;
const FOCUS_LOST_MIN_MS = 1000;
const LOW_TIME_MS = 5 * 60000;

export function renderExam(app, { session }) {
  const pack = app.packFor(session.subjectId);
  const questions = app.questionsById(session.subjectId);
  const firstOpen = session.items.findIndex((it) => !isItemAnswered(it, session.answers[it.questionId].value));
  let index = firstOpen >= 0 ? firstOpen : 0;
  let saveTimer = null;
  let dirty = false;
  let finished = false;
  let awayStart = null;
  const clock = new ClockWatch();

  // ---------- Bilah atas ----------
  const timerEl = h('span', { class: 'timer', role: 'timer', 'aria-label': 'Sisa waktu' });
  const pauseBtn = session.mode === 'latihan'
    ? h('button', { type: 'button', class: 'btn', onclick: doPause }, 'Jeda') : null;
  const canFullscreen = Boolean(document.fullscreenEnabled && document.documentElement.requestFullscreen);
  const fullBtn = canFullscreen
    ? h('button', { type: 'button', class: 'btn', 'aria-label': 'Layar penuh', onclick: toggleFullscreen }, '⛶') : null;
  const bar = h('div', { class: 'exam-bar' },
    h('span', { class: 'exam-title', text: session.packageName }),
    timerEl,
    pauseBtn,
    fullBtn,
    h('button', { type: 'button', class: 'btn', onclick: openList }, 'Daftar', h('span', { class: 'label-long', text: ' Soal' })),
    h('button', { type: 'button', class: 'btn btn-primary', onclick: confirmSubmit }, 'KUMPULKAN'));

  // ---------- Isi soal ----------
  const head = h('div', { class: 'q-head' });
  const host = h('div', { class: 'q-host' });
  const savedEl = h('span', { class: 'saved', 'aria-live': 'off' });
  const prevBtn = h('button', { type: 'button', class: 'btn', onclick: () => go(index - 1) }, '‹ Sebelumnya');
  const nextBtn = h('button', { type: 'button', class: 'btn', onclick: () => go(index + 1) }, 'Berikutnya ›');
  const main = h('div', { class: 'exam-main' }, head, host, h('div', { class: 'exam-nav' }, prevBtn, savedEl, nextBtn));
  const pausedOverlay = h('div', { class: 'overlay', hidden: true },
    h('div', {},
      h('h2', { text: 'Ujian dijeda' }),
      h('p', { class: 'paused-remaining' }),
      h('p', { class: 'hint', text: 'Soal disembunyikan selama jeda. Waktu tidak berjalan.' }),
      h('button', { type: 'button', class: 'btn btn-primary btn-big', onclick: doResume }, 'LANJUTKAN')));
  const el = h('div', { class: 'exam' }, bar, main, pausedOverlay);

  function renderQuestion() {
    const item = session.items[index];
    const question = questions.get(item.questionId);
    const answer = session.answers[item.questionId];
    const type = getType(item.type);
    const flagBtn = h('button', {
      type: 'button', class: 'btn btn-flag', 'aria-pressed': String(answer.flagged),
      onclick: () => {
        const flagged = toggleFlag(session, item.questionId, Date.now());
        flagBtn.setAttribute('aria-pressed', String(flagged));
        flagBtn.textContent = flagged ? '⚑ Ditandai' : '⚐ Tandai';
        scheduleSave();
      },
    }, answer.flagged ? '⚑ Ditandai' : '⚐ Tandai');
    head.replaceChildren(
      h('span', { class: 'q-no', text: `Soal ${index + 1} dari ${session.items.length}` }),
      h('span', { class: 'q-meta', text: `${type.label} · bobot ${formatScore(item.points)}` }),
      flagBtn);
    if (!question) {
      host.replaceChildren(h('p', { class: 'notice', text: `Soal ${item.questionId} tidak ada di pack versi ini. Lanjutkan ke soal lain.` }));
    } else {
      host.replaceChildren(type.render(question, {
        item,
        value: answer.value,
        readOnly: false,
        onChange: (value) => {
          if (setAnswer(session, item.questionId, value, Date.now())) scheduleSave();
        },
      }));
    }
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === session.items.length - 1;
  }

  function go(i) {
    if (i < 0 || i >= session.items.length) return;
    flushSave();
    index = i;
    renderQuestion();
    window.scrollTo(0, 0);
    head.querySelector('.q-no').focus?.();
  }

  // ---------- Penyimpanan ----------
  function scheduleSave() {
    dirty = true;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flushSave, SAVE_DEBOUNCE_MS);
  }

  function flushSave() {
    clearTimeout(saveTimer);
    if (!dirty) return;
    if (app.persist(session)) {
      dirty = false;
      savedEl.textContent = `Tersimpan ${formatClockTime(new Date())}`;
    }
  }

  // ---------- Timer ----------
  function tick() {
    if (finished) return;
    const now = Date.now();
    const drift = clock.check();
    if (drift) {
      logEvent(session, 'clock_anomaly', now, { detail: `jam perangkat bergeser ${Math.round(drift / 1000)} detik` });
      scheduleSave();
    }
    if (session.status === 'PAUSED') {
      timerEl.textContent = formatDuration(session.remainingMsAtPause);
      pausedOverlay.querySelector('.paused-remaining').textContent = `Sisa waktu ${formatDuration(session.remainingMsAtPause)}`;
      return;
    }
    const remaining = remainingMs(session, now);
    timerEl.textContent = formatDuration(remaining);
    timerEl.classList.toggle('low', remaining <= LOW_TIME_MS);
    const warning = dueWarning(session, remaining);
    if (warning) {
      for (const detail of warning.events) logEvent(session, 'warning', now, { detail });
      toast(`Sisa waktu ${warning.minutes} menit.`, { assertive: true });
      app.beep();
      scheduleSave();
    }
    if (remaining <= 0) finish('TIME_UP');
  }

  function finish(reason) {
    if (finished) return;
    finished = true;
    endAway();
    submit(session, reason, Date.now(), questions, pack.passingGrade);
    dirty = true;
    flushSave();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    app.show('results', { session, justSubmitted: true });
  }

  // ---------- Jeda ----------
  function doPause() {
    flushSave();
    pause(session, Date.now());
    dirty = true;
    flushSave();
    showPaused();
  }

  function doResume() {
    resume(session, Date.now());
    clock.reset();
    dirty = true;
    flushSave();
    showPaused();
    tick();
  }

  function showPaused() {
    const paused = session.status === 'PAUSED';
    pausedOverlay.hidden = !paused;
    main.hidden = paused;
    if (pauseBtn) pauseBtn.disabled = paused;
    tick();
  }

  // ---------- Kumpulkan ----------
  async function confirmSubmit() {
    flushSave();
    const s = answerSummary(session, isItemAnswered);
    const ok = await confirmDialog({
      title: 'Kumpulkan ujian?',
      body: [
        h('div', { class: 'summary-grid' },
          h('div', {}, h('strong', { text: String(s.answered) }), 'Dijawab'),
          h('div', {}, h('strong', { text: String(s.unanswered) }), 'Belum'),
          h('div', {}, h('strong', { text: String(s.flagged) }), 'Ditandai')),
        s.unanswered ? `Masih ada ${s.unanswered} soal yang belum dijawab.` : 'Semua soal sudah dijawab.',
        'Setelah dikumpulkan, jawaban tidak dapat diubah.',
      ],
      confirmLabel: 'Ya, kumpulkan',
      cancelLabel: 'Kembali ke soal',
    });
    if (ok && !finished) finish('MANUAL');
  }

  // ---------- Daftar soal ----------
  function openList() {
    const close = () => { backdrop.remove(); panel.remove(); };
    const backdrop = h('div', { class: 'panel-backdrop', onclick: close });
    const panel = h('div', { class: 'panel', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Daftar soal' },
      h('div', { class: 'row', style: 'justify-content:space-between' },
        h('h2', { style: 'margin:0', text: 'Daftar soal' }),
        h('button', { type: 'button', class: 'btn', onclick: close }, 'Tutup')),
      h('div', { class: 'q-grid' }, session.items.map((item, i) => {
        const a = session.answers[item.questionId];
        const classes = [isItemAnswered(item, a.value) ? 'answered' : '', a.flagged ? 'flagged' : '', i === index ? 'current' : ''].join(' ').trim();
        const state = `${isItemAnswered(item, a.value) ? 'dijawab' : 'belum dijawab'}${a.flagged ? ', ditandai' : ''}`;
        return h('button', { type: 'button', class: classes, 'aria-label': `Soal ${i + 1}, ${state}`, onclick: () => { close(); go(i); } }, String(i + 1));
      })),
      h('div', { class: 'legend' },
        h('span', { text: '■ biru = dijawab' }), h('span', { text: '⚑ = ditandai' }), h('span', { text: '□ = belum dijawab' })));
    panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    document.body.append(backdrop, panel);
    panel.querySelector('.q-grid button.current')?.focus();
  }

  // ---------- Fokus dan layar penuh ----------
  function startAway() {
    if (awayStart === null && session.status === 'ACTIVE') awayStart = Date.now();
    flushSave();
  }

  function endAway() {
    if (awayStart === null) return;
    const duration = Date.now() - awayStart;
    awayStart = null;
    if (duration >= FOCUS_LOST_MIN_MS && session.status === 'ACTIVE') {
      logEvent(session, 'focus_lost', Date.now(), { durationMs: duration });
      scheduleSave();
    }
  }

  function onVisibility() {
    if (document.visibilityState === 'hidden') startAway();
    else { endAway(); tick(); }
  }
  const onBlur = () => startAway();
  const onFocus = () => { endAway(); tick(); };
  // iOS dapat membekukan halaman di latar belakang: hitung ulang waktu saat kembali.
  const onPageShow = () => tick();
  const onBeforeUnload = (e) => {
    flushSave();
    e.preventDefault();
    e.returnValue = '';
  };

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => toast('Layar penuh tidak tersedia di perangkat ini.'));
  }

  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('blur', onBlur);
  window.addEventListener('focus', onFocus);
  window.addEventListener('pageshow', onPageShow);
  window.addEventListener('beforeunload', onBeforeUnload);
  const interval = setInterval(tick, TICK_MS);

  renderQuestion();
  showPaused();

  return {
    el,
    destroy() {
      clearInterval(interval);
      flushSave();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.querySelectorAll('.panel, .panel-backdrop').forEach((n) => n.remove());
    },
  };
}
