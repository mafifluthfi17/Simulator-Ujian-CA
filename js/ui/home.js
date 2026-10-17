// Beranda (SPEC 3): pemilih mata ujian, kartu paket + Kustom, tombol MULAI,
// kartu "Lanjutkan Ujian" bila ada sesi belum selesai.

import { h } from './dom.js';
import { disclaimer, header } from './layout.js';
import { formatErrors, loadActiveSession } from '../core/session-store.js';
import { remainingMs } from '../core/session.js';
import { buildFromPackage, packageQuestionCount } from '../core/blueprint.js';
import { formatDuration, formatMinutes } from '../core/format.js';

const CUSTOM = '__custom__';

export function renderHome(app) {
  const el = h('div', { class: 'screen' }, header(app, { title: 'Simulator Ujian CA', back: false, menu: true }));

  for (const notice of app.notices) el.append(h('p', { class: 'notice', text: notice }));

  if (!app.pack) {
    el.append(
      h('div', { class: 'card' },
        h('h2', { text: 'Belum ada Subject Pack' }),
        h('p', { text: 'Impor berkas Subject Pack (.json) untuk mulai berlatih.' }),
        h('button', { type: 'button', class: 'btn btn-primary', onclick: () => app.show('settings') }, 'IMPOR SUBJECT PACK')),
      disclaimer());
    return { el };
  }

  if (app.packs.length > 1) {
    const select = h('select', {
      id: 'subject', onchange: () => { app.selectSubject(select.value); app.show('home'); },
    }, app.packs.map(({ pack }) => h('option', { value: pack.subjectId, selected: pack.subjectId === app.subjectId }, pack.subjectName)));
    el.append(h('div', { class: 'field' }, h('label', { for: 'subject', text: 'Mata ujian' }), select));
  } else {
    el.append(h('p', { class: 'hint', text: app.pack.subjectName }));
  }

  const active = loadActiveSession(app.store, app.pack.subjectId);
  if (active && active.ok) {
    const s = active.session;
    const status = s.status === 'PAUSED' ? 'Dijeda' : 'Berjalan';
    el.append(h('div', { class: 'card resume-card' },
      h('h2', { text: 'Lanjutkan Ujian' }),
      h('p', { text: `${s.packageName} · ${status} · sisa waktu ${formatDuration(remainingMs(s, Date.now()))}` }),
      h('button', { type: 'button', class: 'btn btn-primary', onclick: () => app.show('exam', { session: s }) }, 'LANJUTKAN')));
  } else if (active && !active.ok) {
    el.append(h('p', { class: 'notice', text: `Sesi aktif tidak dapat dimuat (${formatErrors(active.errors, 3).join('; ')}). Ketuk MULAI untuk melepasnya dan memulai ujian baru; datanya tetap tersimpan.` }));
  }

  const pack = app.pack;
  let selected = pack.packages[0] ? pack.packages[0].id : CUSTOM;
  const cards = pack.packages.map((pkg) => packageCard(pkg.id, pkg.name, [
    formatMinutes(pkg.durationMinutes * 60000),
    `${packageQuestionCount(pkg)} soal`,
    `Passing grade ${pack.passingGrade}`,
    pkg.strictMode ? 'Mode ketat (tanpa jeda)' : 'Mode latihan (boleh jeda)',
  ]));
  cards.push(packageCard(CUSTOM, 'Kustom', ['Atur durasi, jumlah soal, topik, dan bobot sendiri']));

  function packageCard(id, name, lines) {
    return h('label', { class: 'package-card' },
      h('input', { type: 'radio', name: 'package', value: id, checked: id === selected, onchange: () => { selected = id; } }),
      h('span', { class: 'name', text: name }),
      lines.map((line) => h('span', { class: 'meta', text: line })));
  }

  el.append(
    h('fieldset', { class: 'package-list', style: 'border:0;padding:0;margin:12px 0 16px' },
      h('legend', { class: 'hint', text: 'Pilih paket' }), cards),
    h('button', { type: 'button', class: 'btn btn-primary btn-big', onclick: start }, 'MULAI'),
    disclaimer());

  function start() {
    if (selected === CUSTOM) {
      app.show('custom');
      return;
    }
    const pkg = pack.packages.find((p) => p.id === selected);
    const weights = {};
    for (const s of pkg.sections) weights[s.type] = (weights[s.type] || 0) + s.weight;
    app.beginSession({
      packageId: pkg.id,
      packageName: pkg.name,
      mode: pkg.strictMode ? 'ketat' : 'latihan',
      config: {
        durationMinutes: pkg.durationMinutes,
        passingGrade: pack.passingGrade,
        shuffleQuestions: true,
        shuffleOptions: true,
        sectionWeights: weights,
      },
      build: (rng) => buildFromPackage(pack, pkg, rng),
    });
  }

  return { el };
}
