// Tipe soal studi kasus: jawaban per sub-pertanyaan {a: teks, b: teks}; dinilai AI.
// Ponsel: tab "Kasus | Jawaban"; layar lebar: berdampingan (diatur CSS).

import { h, textBlock } from '../ui/dom.js';
import { countWords, formatNumber } from '../core/format.js';

export const label = 'Studi kasus';

export function isAnswered(value) {
  return value !== null && typeof value === 'object' && Object.values(value).some((t) => typeof t === 'string' && t.trim() !== '');
}

// DECISIONS D-13: satu teks berlabel [a], [b], ... sesuai urutan sub-pertanyaan.
export function exportForGrading(question, value) {
  const parts = question.subQuestions.map((s) => {
    const text = value && typeof value[s.id] === 'string' ? value[s.id].trim() : '';
    return `[${s.id}] ${text}`.trimEnd();
  });
  return { answer: parts.join('\n\n'), isBlank: !isAnswered(value) };
}

export function render(question, ctx) {
  const value = ctx.value && typeof ctx.value === 'object' ? ctx.value : {};
  const casePane = h('section', { class: 'case-pane', id: `case-${question.id}`, 'aria-label': 'Kasus' },
    textBlock(question.stem, 'prose stem'),
    textBlock(question.caseNarrative, 'prose'),
    (question.caseData || []).map(renderTable));
  const answerPane = h('section', { class: 'answer-pane', id: `ans-${question.id}`, 'aria-label': 'Jawaban' },
    question.subQuestions.map((s) => {
      const counter = h('p', { class: 'hint word-count' });
      const area = h('textarea', {
        class: 'answer-text', rows: 8, dataset: { sub: s.id }, disabled: ctx.readOnly,
        'aria-label': `Jawaban bagian ${s.id}`,
        oninput: () => {
          counter.textContent = `${countWords(area.value)} kata`;
          ctx.onChange(getAnswer(root));
        },
      });
      area.value = typeof value[s.id] === 'string' ? value[s.id] : '';
      counter.textContent = `${countWords(area.value)} kata`;
      return h('div', { class: 'sub-question' },
        h('p', { class: 'sub-prompt' }, h('strong', { text: `(${s.id}) ` }), s.prompt),
        area, counter);
    }));

  const tabCase = h('button', { type: 'button', role: 'tab', 'aria-selected': 'true', 'aria-controls': casePane.id, onclick: () => select('case') }, 'Kasus');
  const tabAnswer = h('button', { type: 'button', role: 'tab', 'aria-selected': 'false', 'aria-controls': answerPane.id, onclick: () => select('answer') }, 'Jawaban');
  const root = h('div', { class: 'q-case', dataset: { tab: 'case' } },
    h('div', { class: 'case-tabs', role: 'tablist' }, tabCase, tabAnswer),
    h('div', { class: 'case-layout' }, casePane, answerPane));
  function select(tab) {
    root.dataset.tab = tab;
    tabCase.setAttribute('aria-selected', String(tab === 'case'));
    tabAnswer.setAttribute('aria-selected', String(tab === 'answer'));
  }
  return root;
}

function renderTable(table) {
  return h('div', { class: 'table-wrap' },
    h('table', { class: 'data-table' },
      h('caption', { text: table.title }),
      h('thead', {}, h('tr', {}, table.columns.map((c) => h('th', { scope: 'col', text: c })))),
      h('tbody', {}, table.rows.map((row) => h('tr', {},
        row.map((cell) => h('td', { class: typeof cell === 'number' ? 'num' : null, text: typeof cell === 'number' ? formatNumber(cell) : cell })))))));
}

export function getAnswer(root) {
  const value = {};
  let any = false;
  for (const area of root.querySelectorAll('textarea[data-sub]')) {
    value[area.dataset.sub] = area.value;
    if (area.value !== '') any = true;
  }
  return any ? value : null;
}

export function renderReport(question, value) {
  return h('div', { class: 'report-item' },
    textBlock(question.stem, 'prose stem'),
    question.subQuestions.map((s) => h('div', {},
      h('h4', { text: `(${s.id}) ${s.prompt}` }),
      textBlock(value && value[s.id] ? value[s.id] : '(kosong)'))));
}
