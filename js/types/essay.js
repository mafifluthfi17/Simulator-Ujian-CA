// Tipe soal esai: dinilai AI lewat ekspor-impor (fase A2).

import { h, textBlock } from '../ui/dom.js';
import { countWords } from '../core/format.js';

export const label = 'Esai';

export function isAnswered(value) {
  return typeof value === 'string' && value.trim() !== '';
}

export function exportForGrading(question, value) {
  const answer = typeof value === 'string' ? value : '';
  return { answer, isBlank: answer.trim() === '' };
}

export function render(question, ctx) {
  const counter = h('p', { class: 'hint word-count', 'aria-live': 'off' });
  const area = h('textarea', {
    class: 'answer-text', rows: 12, 'aria-label': 'Jawaban esai', disabled: ctx.readOnly,
    oninput: () => {
      updateCount();
      ctx.onChange(getAnswer(root));
    },
  });
  area.value = typeof ctx.value === 'string' ? ctx.value : '';
  function updateCount() {
    counter.textContent = `${countWords(area.value)} kata`;
  }
  updateCount();
  const root = h('div', { class: 'q-essay' }, textBlock(question.stem, 'prose stem'), area, counter);
  return root;
}

export function getAnswer(root) {
  const text = root.querySelector('textarea').value;
  return text === '' ? null : text;
}

export function renderReport(question, value) {
  return h('div', { class: 'report-item' },
    textBlock(question.stem, 'prose stem'),
    h('h4', { text: 'Jawaban peserta' }),
    textBlock(isAnswered(value) ? value : '(kosong)'));
}
