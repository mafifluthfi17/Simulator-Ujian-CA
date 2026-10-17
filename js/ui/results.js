// Layar hasil (sementara pada fase A1): skor PG dan numerik dinilai aplikasi;
// esai dan kasus berstatus MENUNGGU PENILAIAN URAIAN sampai fase A2.

import { h } from './dom.js';
import { disclaimer, header } from './layout.js';
import { componentSummary } from '../core/scoring.js';
import { focusLostStats } from '../core/session.js';
import { formatDateTime, formatMinutes, formatScore } from '../core/format.js';

const STATUS = {
  MENUNGGU_PENILAIAN_URAIAN: ['MENUNGGU PENILAIAN URAIAN', 'badge-wait'],
  PENILAIAN_SEBAGIAN: ['PENILAIAN SEBAGIAN', 'badge-wait'],
  FINAL: ['FINAL', ''],
};
const REASONS = {
  MANUAL: 'Dikumpulkan peserta',
  TIME_UP: 'Waktu habis (dikumpulkan otomatis)',
  EXPIRED_ON_REOPEN: 'Tenggat lewat saat aplikasi ditutup (dikumpulkan otomatis saat dibuka)',
};
const TYPE_TITLES = { mcq: 'Pilihan ganda', numeric: 'Numerik', essay: 'Esai', case: 'Studi kasus' };

export function renderResults(app, { session }) {
  const g = session.grading;
  const [statusText, statusClass] = STATUS[g.status];
  const rows = componentSummary(session);
  const used = Date.parse(session.submittedAt) - Date.parse(session.startedAt) - session.totalPausedMs;
  const focus = focusLostStats(session);
  const anomalies = session.events.filter((e) => e.type === 'clock_anomaly').length;
  const pack = app.packFor(session.subjectId);
  const passingGrade = session.config.passingGrade;

  const finalBlock = g.status === 'FINAL'
    ? h('div', { class: 'card' },
      h('p', {}, 'Nilai akhir'),
      h('p', { class: 'big-score', text: formatScore(g.finalScore) }),
      h('p', { text: `Passing grade ${passingGrade} · selisih ${g.finalScore - passingGrade >= 0 ? '+' : ''}${formatScore(g.finalScore - passingGrade)}` }),
      h('span', { class: `badge ${g.passed ? 'badge-pass' : 'badge-fail'}`, text: g.passed ? 'LULUS' : 'TIDAK LULUS' }))
    : h('p', { class: 'notice notice-info', text: 'Nilai akhir dan status LULUS/TIDAK LULUS tersedia setelah jawaban esai dan kasus dinilai. Penilaian uraian dengan AI hadir pada pembaruan berikutnya.' });

  const el = h('div', { class: 'screen' },
    header(app, { title: 'Hasil Ujian' }),
    h('p', { class: 'hint', text: `${pack ? pack.subjectName : session.subjectId} · ${session.packageName} · ${formatDateTime(session.startedAt)}` }),
    h('span', { class: `badge ${statusClass}`, text: statusText }),
    session.submittedReason !== 'MANUAL' ? h('p', { class: 'notice', text: REASONS[session.submittedReason] }) : null,
    h('div', { class: 'card' },
      h('table', { class: 'score-table' },
        h('thead', {}, h('tr', {},
          h('th', { text: 'Komponen' }), h('th', { class: 'num', text: 'Soal' }),
          h('th', { class: 'num', text: 'Skor' }), h('th', { class: 'num', text: 'Maks' }))),
        h('tbody', {}, rows.map((r) => h('tr', {},
          h('td', { text: TYPE_TITLES[r.type] || r.type }),
          h('td', { class: 'num', text: String(r.count) }),
          h('td', { class: 'num', text: r.pending ? 'menunggu' : formatScore(r.score) }),
          h('td', { class: 'num', text: formatScore(r.max) })))))),
    finalBlock,
    h('div', { class: 'card' },
      h('h2', { style: 'margin-top:0', text: 'Catatan sesi' }),
      h('p', { text: `Cara pengumpulan: ${REASONS[session.submittedReason]}` }),
      h('p', { text: `Waktu pengerjaan: ${formatMinutes(Math.max(0, used))}${session.totalPausedMs ? ` (jeda ${formatMinutes(session.totalPausedMs)})` : ''}` }),
      h('p', { text: `Meninggalkan layar ujian: ${focus.count} kali, total ${formatMinutes(focus.totalMs)} (informasi, bukan hukuman)` }),
      anomalies ? h('p', { text: `Perubahan jam perangkat terdeteksi: ${anomalies} kali (deteksi tidak sempurna)` }) : null),
    h('div', { class: 'row' },
      h('button', { type: 'button', class: 'btn btn-primary', onclick: () => app.show('home') }, 'Ke Beranda'),
      h('button', { type: 'button', class: 'btn', onclick: () => app.show('history') }, 'Riwayat')),
    disclaimer());
  return { el };
}
