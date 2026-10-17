// Mode Kustom (SPEC 6.1): durasi 15-240 menit, jumlah dan bobot per bagian
// (bulat, total tepat 100), filter kesulitan/topik, acak urutan/opsi, mode.

import { h, append, clear } from './dom.js';
import { disclaimer, header } from './layout.js';
import { TYPE_ORDER, buildCustom, customPool, isLive, validateCustom, CUSTOM_LIMITS } from '../core/blueprint.js';

const TYPE_TITLES = { mcq: 'Pilihan ganda', numeric: 'Numerik', essay: 'Esai', case: 'Studi kasus' };
const LEVELS = [['mudah', 'Mudah'], ['sedang', 'Sedang'], ['sulit', 'Sulit'], ['sangat_sulit', 'Sangat sulit']];

export function renderCustom(app) {
  const pack = app.pack;
  // Hanya tipe yang memiliki soal LIVE di pack ini.
  const types = TYPE_ORDER.filter((t) => pack.questions.some((q) => q.type === t && isLive(q)));
  const state = {
    durationMinutes: 60,
    mode: 'latihan',
    counts: Object.fromEntries(types.map((t) => [t, 0])),
    weights: Object.fromEntries(types.map((t) => [t, 0])),
    difficulty: [],
    topicIds: [],
    shuffleQuestions: true,
    shuffleOptions: true,
  };

  const messages = h('div', { 'aria-live': 'polite' });
  const startBtn = h('button', { type: 'button', class: 'btn btn-primary btn-big', onclick: start }, 'MULAI');
  const availability = new Map();

  const numberInput = (id, value, min, max, onInput) => h('input', {
    type: 'number', id, inputmode: 'numeric', min, max, step: 1, value: String(value),
    oninput: (e) => { onInput(e.target.value === '' ? NaN : Number(e.target.value)); refresh(); },
  });

  const sectionRows = types.map((t) => {
    const avail = h('td', { class: 'hint' });
    availability.set(t, avail);
    return h('tr', {},
      h('th', { scope: 'row', text: TYPE_TITLES[t] }),
      h('td', {}, numberInput(`count-${t}`, 0, 0, 999, (v) => { state.counts[t] = v; })),
      h('td', {}, numberInput(`weight-${t}`, 0, 0, 100, (v) => { state.weights[t] = v; })),
      avail);
  });

  const checkGroup = (legend, options, list) => h('fieldset', { style: 'border:0;padding:0;margin:8px 0' },
    h('legend', { class: 'label', text: legend }),
    options.map(([value, text]) => h('label', { class: 'check' },
      h('input', {
        type: 'checkbox', value,
        onchange: (e) => {
          const i = list.indexOf(value);
          if (e.target.checked && i < 0) list.push(value);
          if (!e.target.checked && i >= 0) list.splice(i, 1);
          refresh();
        },
      }), text)),
    h('p', { class: 'hint', text: 'Tidak memilih apa pun berarti semua.' }));

  const toggle = (key, text) => h('label', { class: 'check' },
    h('input', { type: 'checkbox', checked: state[key], onchange: (e) => { state[key] = e.target.checked; } }), text);

  const el = h('div', { class: 'screen' },
    header(app, { title: 'Mode Kustom' }),
    h('div', { class: 'card' },
      h('div', { class: 'form-grid' },
        h('div', { class: 'field' },
          h('label', { for: 'duration', text: `Durasi (${CUSTOM_LIMITS.minDuration}-${CUSTOM_LIMITS.maxDuration} menit)` }),
          numberInput('duration', state.durationMinutes, CUSTOM_LIMITS.minDuration, CUSTOM_LIMITS.maxDuration, (v) => { state.durationMinutes = v; })),
        h('fieldset', { class: 'field', style: 'border:0;padding:0;margin:0' },
          h('legend', { class: 'label', text: 'Mode' }),
          h('label', { class: 'check' }, h('input', { type: 'radio', name: 'mode', value: 'latihan', checked: true, onchange: () => { state.mode = 'latihan'; } }), 'Latihan (boleh jeda)'),
          h('label', { class: 'check' }, h('input', { type: 'radio', name: 'mode', value: 'ketat', onchange: () => { state.mode = 'ketat'; } }), 'Ketat (tanpa jeda)'))),
      h('h2', { text: 'Bagian soal' }),
      h('table', { class: 'section-table' },
        h('thead', {}, h('tr', {}, h('th', { text: 'Bagian' }), h('th', { text: 'Jumlah soal' }), h('th', { text: 'Bobot' }), h('th', { text: 'Tersedia' }))),
        h('tbody', {}, sectionRows)),
      h('p', { class: 'hint', text: 'Bobot bilangan bulat dengan total tepat 100. Bagian tanpa soal berbobot 0. Skor per soal = bobot bagian dibagi rata.' }),
      h('h2', { text: 'Filter' }),
      checkGroup('Kesulitan', LEVELS, state.difficulty),
      checkGroup('Topik', pack.topics.map((t) => [t.id, `${t.id} ${t.name}`]), state.topicIds),
      h('h2', { text: 'Pengacakan' }),
      toggle('shuffleQuestions', 'Acak urutan soal'),
      toggle('shuffleOptions', 'Acak urutan opsi PG')),
    messages,
    startBtn,
    disclaimer());

  function custom() {
    return {
      durationMinutes: state.durationMinutes,
      counts: state.counts,
      weights: state.weights,
      difficulty: state.difficulty,
      topicIds: state.topicIds,
    };
  }

  function refresh() {
    for (const t of types) availability.get(t).textContent = `${customPool(pack, custom(), t).length} soal`;
    const check = validateCustom(pack, custom());
    append(clear(messages), [
      check.errors.length ? h('ul', { class: 'error-list' }, check.errors.map((e) => h('li', { text: e }))) : null,
      check.warnings.map((w) => h('p', { class: 'notice', text: w })),
      check.ok && check.estimateMinutes ? h('p', { class: 'hint', text: `Perkiraan waktu pengerjaan: ${check.estimateMinutes} menit.` }) : null,
    ]);
    startBtn.disabled = !check.ok;
  }

  function start() {
    const c = custom();
    if (!validateCustom(pack, c).ok) return;
    const weights = {};
    for (const t of types) if (c.weights[t]) weights[t] = c.weights[t];
    const filters = {};
    if (c.difficulty.length) filters.difficulty = c.difficulty.slice();
    if (c.topicIds.length) filters.topicIds = c.topicIds.slice();
    app.beginSession({
      packageId: 'KUSTOM',
      packageName: 'Kustom',
      mode: state.mode,
      config: {
        durationMinutes: c.durationMinutes,
        passingGrade: pack.passingGrade,
        shuffleQuestions: state.shuffleQuestions,
        shuffleOptions: state.shuffleOptions,
        sectionWeights: weights,
        ...(Object.keys(filters).length ? { filters } : {}),
      },
      build: (rng) => buildCustom(pack, c, rng),
    });
  }

  refresh();
  return { el };
}
