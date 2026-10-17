// Riwayat sesi mata ujian terpilih dan grafik tren nilai per paket (SPEC 11),
// SVG buatan sendiri: satu grafik garis per paket (sesi FINAL saja), garis
// passing grade putus-putus, keterangan titik saat disentuh/diarahkan, dan tabel
// sebagai tampilan alternatif.

import { h, svg } from './dom.js';
import { disclaimer, header } from './layout.js';
import { formatErrors, listSessions } from '../core/session-store.js';
import { isOpen } from '../core/session.js';
import { finalSessions, STATUS_LABELS, trendSeries } from '../core/report.js';
import { formatDateTime, formatScore } from '../core/format.js';

const W = 640;
const H = 220;
const PAD = { left: 40, right: 28, top: 22, bottom: 30 };

export function renderHistory(app) {
  const el = h('div', { class: 'screen' }, header(app, { title: 'Riwayat' }));
  if (!app.pack) {
    el.append(h('p', { text: 'Belum ada Subject Pack.' }));
    return { el };
  }
  const { sessions, failures } = listSessions(app.store, app.pack.subjectId);
  const finals = finalSessions(sessions);

  el.append(h('h2', { text: 'Tren nilai' }));
  if (!finals.length) {
    el.append(h('p', { class: 'hint', text: 'Grafik tampil setelah ada sesi berstatus FINAL (semua soal sudah dinilai).' }));
  }
  for (const series of trendSeries(sessions)) el.append(trendCard(series));

  el.append(h('h2', { text: 'Semua sesi' }));
  if (!sessions.length) el.append(h('p', { class: 'hint', text: 'Belum ada sesi ujian.' }));
  el.append(h('div', { class: 'history-list' }, sessions.map((s) => {
    const status = isOpen(s) ? 'Belum selesai'
      : s.grading.status === 'FINAL' ? `Nilai ${formatScore(s.grading.finalScore)} · ${s.grading.passed ? 'LULUS' : 'TIDAK LULUS'}`
        : STATUS_LABELS[s.grading.status];
    return h('button', {
      type: 'button', class: 'btn history-item',
      onclick: () => app.show(isOpen(s) ? 'exam' : 'results', { session: s }),
    }, h('strong', { text: `${s.packageName} · ${formatDateTime(s.startedAt)}` }), h('span', { class: 'hint', text: status }));
  })));
  for (const f of failures) {
    el.append(h('p', { class: 'notice', text: `Sesi ${f.sessionId} tidak dapat dimuat (${formatErrors(f.errors, 3).join('; ')}). Datanya tetap tersimpan dan ikut ekspor cadangan.` }));
  }
  el.append(disclaimer());
  return { el };
}

function trendCard(series) {
  const pts = series.points;
  const passing = pts[pts.length - 1].passingGrade;
  const x = (i) => (pts.length === 1 ? (PAD.left + W - PAD.right) / 2 : PAD.left + (i * (W - PAD.left - PAD.right)) / (pts.length - 1));
  const y = (v) => PAD.top + ((100 - v) * (H - PAD.top - PAD.bottom)) / 100;
  const tip = h('p', { class: 'trend-tip hint', 'aria-live': 'polite', text: 'Arahkan atau ketuk titik untuk melihat nilainya.' });
  const show = (p, i) => {
    tip.textContent = `Sesi ${i + 1} · ${formatDateTime(p.at)} · nilai ${formatScore(p.score)} · ${p.passed ? 'LULUS' : 'TIDAK LULUS'}`;
  };

  const grid = [0, 25, 50, 75, 100].map((v) => [
    svg('line', { x1: PAD.left, x2: W - PAD.right, y1: y(v), y2: y(v), class: 'trend-grid' }),
    svg('text', { x: PAD.left - 6, y: y(v) + 4, 'text-anchor': 'end', class: 'trend-axis', text: String(v) }),
  ]);
  const passLine = [
    svg('line', { x1: PAD.left, x2: W - PAD.right, y1: y(passing), y2: y(passing), class: 'trend-pass' }),
    svg('text', { x: PAD.left + 6, y: y(passing) + 15, 'text-anchor': 'start', class: 'trend-axis', text: `passing grade ${passing}` }),
  ];
  const path = pts.length > 1
    ? svg('polyline', { points: pts.map((p, i) => `${x(i)},${y(p.score)}`).join(' '), class: 'trend-line' })
    : null;
  const marks = pts.map((p, i) => svg('g', {
    class: 'trend-point', tabindex: '0', role: 'img',
    'aria-label': `Sesi ${i + 1}, ${formatDateTime(p.at)}, nilai ${formatScore(p.score)}`,
  },
  svg('circle', { cx: x(i), cy: y(p.score), r: 14, class: 'trend-hit' }),
  svg('circle', { cx: x(i), cy: y(p.score), r: 4.5, class: p.passed ? 'trend-dot' : 'trend-dot trend-dot-fail' }),
  svg('title', { text: `${formatDateTime(p.at)}: ${formatScore(p.score)}` })));
  marks.forEach((m, i) => {
    m.addEventListener('mouseenter', () => show(pts[i], i));
    m.addEventListener('focus', () => show(pts[i], i));
    m.addEventListener('click', () => show(pts[i], i));
  });
  const last = pts[pts.length - 1];
  const label = svg('text', { x: Math.min(x(pts.length - 1) + 8, W - PAD.right), y: y(last.score) - 8, 'text-anchor': pts.length > 1 ? 'end' : 'start', class: 'trend-value', text: formatScore(last.score) });
  const xLabels = pts.map((_, i) => svg('text', { x: x(i), y: H - 10, 'text-anchor': 'middle', class: 'trend-axis', text: String(i + 1) }));

  const chart = svg('svg', {
    viewBox: `0 0 ${W} ${H}`, class: 'trend-chart', role: 'group',
    'aria-label': `Tren nilai ${series.packageName}: ${pts.length} sesi, terakhir ${formatScore(last.score)}`,
  }, grid, passLine, path, marks, label, xLabels);

  const table = h('details', {},
    h('summary', { text: 'Tampilkan sebagai tabel' }),
    h('div', { class: 'table-wrap' }, h('table', { class: 'data-table' },
      h('thead', {}, h('tr', {}, ['Sesi', 'Dikumpulkan', 'Nilai', 'Status'].map((t) => h('th', { text: t })))),
      h('tbody', {}, pts.map((p, i) => h('tr', {},
        h('td', { text: String(i + 1) }), h('td', { text: formatDateTime(p.at) }),
        h('td', { class: 'num', text: formatScore(p.score) }), h('td', { text: p.passed ? 'LULUS' : 'TIDAK LULUS' })))))));

  return h('div', { class: 'card' },
    h('h3', { style: 'margin-top:0', text: series.packageName }),
    h('p', { class: 'hint', text: `${pts.length} sesi FINAL · sumbu datar = urutan sesi, sumbu tegak = nilai (0–100)` }),
    chart, tip, table);
}
