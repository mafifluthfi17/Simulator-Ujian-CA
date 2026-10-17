// Siklus hidup sesi ujian (SPEC 9) sebagai fungsi murni dengan waktu `now`
// (milidetik) dari pemanggil, sehingga dapat dites tanpa menunggu jam.

import { SCHEMA_VERSION, APP_VERSION } from './version.js';
import { randomHex, shuffle } from './random.js';
import { scoreSubmission } from './scoring.js';

const OPTION_KEYS = ['A', 'B', 'C', 'D'];
// answer_changed dicatat paling sering sekali per soal per menit agar log tidak membengkak.
const ANSWER_EVENT_INTERVAL_MS = 60000;

export class SessionLockedError extends Error {
  constructor() {
    super('Sesi sudah dikumpulkan dan terkunci.');
    this.name = 'SessionLockedError';
  }
}

const iso = (ms) => new Date(ms).toISOString();

// Tanggal di ID = tanggal mulai menurut jam perangkat (sama dengan yang tampil di laporan).
export function makeSessionId(subjectId, now, rng) {
  const d = new Date(now);
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `${subjectId}-${stamp}-${randomHex(8, rng)}`;
}

// Salinan isi soal untuk sesi (D-31): laporan tetap lengkap walau pack berubah.
// Riwayat review dan transisi status tidak disalin agar sesi tetap ringkas.
export function snapshotQuestion(question) {
  const copy = JSON.parse(JSON.stringify(question));
  copy.lifecycle.review = null;
  delete copy.lifecycle.history;
  return copy;
}

// items: [{ question, points }] dalam urutan tampil.
// config: { durationMinutes, passingGrade, shuffleQuestions, shuffleOptions, sectionWeights, filters? }
export function createSession({ pack, packageId, packageName, mode, config, items, rng, now }) {
  const session = {
    schemaVersion: SCHEMA_VERSION,
    sessionId: makeSessionId(pack.subjectId, now, rng),
    appVersion: APP_VERSION,
    subjectId: pack.subjectId,
    packVersion: pack.packVersion,
    packageId,
    packageName,
    mode,
    config,
    status: 'ACTIVE',
    startedAt: iso(now),
    deadline: iso(now + config.durationMinutes * 60000),
    remainingMsAtPause: null,
    pauses: [],
    totalPausedMs: 0,
    items: items.map(({ question, points }) => {
      const item = {
        questionId: question.id,
        type: question.type,
        contentHash: question.lifecycle.contentHash,
        originalMaxScore: question.maxScore,
        points,
        scaleFactor: points / question.maxScore,
        question: snapshotQuestion(question),
      };
      if (question.type === 'mcq') {
        item.optionOrder = config.shuffleOptions ? shuffle(OPTION_KEYS, rng) : OPTION_KEYS.slice();
      }
      return item;
    }),
    answers: {},
    events: [{ type: 'start', at: iso(now) }],
    submittedAt: null,
    submittedReason: null,
  };
  for (const { question } of items) {
    session.answers[question.id] = { value: null, flagged: false, updatedAt: null };
  }
  return session;
}

export function isOpen(session) {
  return session.status === 'ACTIVE' || session.status === 'PAUSED';
}

function assertOpen(session) {
  if (!isOpen(session)) throw new SessionLockedError();
}

export function remainingMs(session, now) {
  if (session.status === 'PAUSED') return session.remainingMsAtPause;
  if (session.status !== 'ACTIVE') return 0;
  return Math.max(0, Date.parse(session.deadline) - now);
}

export function logEvent(session, type, now, extra = {}) {
  session.events.push({ type, at: iso(now), ...extra });
}

// Mengembalikan true bila nilai berubah.
export function setAnswer(session, questionId, value, now) {
  assertOpen(session);
  const answer = session.answers[questionId];
  if (!answer) throw new Error(`Soal ${questionId} bukan bagian dari sesi ini.`);
  if (JSON.stringify(answer.value) === JSON.stringify(value)) return false;
  answer.value = value;
  answer.updatedAt = iso(now);
  const last = [...session.events].reverse().find((e) => e.type === 'answer_changed' && e.questionId === questionId);
  if (!last || now - Date.parse(last.at) >= ANSWER_EVENT_INTERVAL_MS) {
    logEvent(session, 'answer_changed', now, { questionId });
  }
  return true;
}

export function toggleFlag(session, questionId, now) {
  assertOpen(session);
  const answer = session.answers[questionId];
  answer.flagged = !answer.flagged;
  logEvent(session, 'flag', now, { questionId, detail: answer.flagged ? 'ditandai' : 'tanda dihapus' });
  return answer.flagged;
}

export function pause(session, now) {
  if (session.mode !== 'latihan') throw new Error('Jeda hanya tersedia di mode latihan.');
  if (session.status !== 'ACTIVE') return;
  const remaining = remainingMs(session, now);
  session.status = 'PAUSED';
  session.remainingMsAtPause = remaining;
  session.pauses.push({ pausedAt: iso(now), resumedAt: null, remainingMs: remaining });
  logEvent(session, 'pause', now);
}

export function resume(session, now) {
  if (session.status !== 'PAUSED') return;
  const last = session.pauses[session.pauses.length - 1];
  last.resumedAt = iso(now);
  session.totalPausedMs += Math.max(0, now - Date.parse(last.pausedAt));
  session.deadline = iso(now + session.remainingMsAtPause);
  session.remainingMsAtPause = null;
  session.status = 'ACTIVE';
  logEvent(session, 'resume', now);
}

// reason: MANUAL | TIME_UP | EXPIRED_ON_REOPEN. Dinilai dari salinan soal di sesi.
export function submit(session, reason, now) {
  assertOpen(session);
  if (session.status === 'PAUSED') {
    const last = session.pauses[session.pauses.length - 1];
    last.resumedAt = iso(now);
    session.totalPausedMs += Math.max(0, now - Date.parse(last.pausedAt));
  }
  session.status = 'SUBMITTED';
  session.remainingMsAtPause = null;
  session.submittedAt = iso(now);
  session.submittedReason = reason;
  logEvent(session, 'submit', now, { detail: reason });
  session.grading = scoreSubmission(session);
  return session;
}

// Dipanggil saat aplikasi dibuka: sesi aktif yang tenggatnya lewat dikunci
// dan dikumpulkan (SPEC 9, TS-06). Sesi yang dijeda tidak kedaluwarsa.
export function recoverOnOpen(session, now) {
  if (session.status === 'ACTIVE' && now >= Date.parse(session.deadline)) {
    submit(session, 'EXPIRED_ON_REOPEN', now);
    return { session, expired: true };
  }
  return { session, expired: false };
}

export function answerSummary(session, isAnswered) {
  let answered = 0;
  let flagged = 0;
  for (const item of session.items) {
    const a = session.answers[item.questionId];
    if (isAnswered(item, a.value)) answered++;
    if (a.flagged) flagged++;
  }
  return { answered, unanswered: session.items.length - answered, flagged, total: session.items.length };
}

export function focusLostStats(session) {
  const events = session.events.filter((e) => e.type === 'focus_lost');
  return { count: events.length, totalMs: events.reduce((n, e) => n + (e.durationMs || 0), 0) };
}
