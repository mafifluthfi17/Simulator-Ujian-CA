// Riwayat sesi mata ujian terpilih (grafik tren menyusul pada fase A2).

import { h } from './dom.js';
import { disclaimer, header } from './layout.js';
import { listSessions } from '../core/session-store.js';
import { isOpen } from '../core/session.js';
import { formatDateTime, formatScore } from '../core/format.js';

export function renderHistory(app) {
  const el = h('div', { class: 'screen' }, header(app, { title: 'Riwayat' }));
  if (!app.pack) {
    el.append(h('p', { text: 'Belum ada Subject Pack.' }));
    return { el };
  }
  const { sessions, failures } = listSessions(app.store, app.pack.subjectId);
  if (!sessions.length) el.append(h('p', { class: 'hint', text: 'Belum ada sesi ujian.' }));
  el.append(h('div', { class: 'history-list' }, sessions.map((s) => {
    const status = isOpen(s) ? 'Belum selesai'
      : s.grading.status === 'FINAL' ? `Nilai ${formatScore(s.grading.finalScore)} · ${s.grading.passed ? 'LULUS' : 'TIDAK LULUS'}`
        : 'Menunggu penilaian uraian';
    return h('button', {
      type: 'button', class: 'btn history-item',
      onclick: () => app.show(isOpen(s) ? 'exam' : 'results', { session: s }),
    }, h('strong', { text: `${s.packageName} · ${formatDateTime(s.startedAt)}` }), h('span', { class: 'hint', text: status }));
  })));
  for (const f of failures) {
    el.append(h('p', { class: 'notice', text: `Sesi ${f.sessionId} tidak dapat dimuat: ${f.errors.map((e) => e.message).join(' ')}` }));
  }
  el.append(disclaimer());
  return { el };
}
