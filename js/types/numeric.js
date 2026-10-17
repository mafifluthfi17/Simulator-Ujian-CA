// Tipe soal numerik: dinilai aplikasi dengan toleransi absolut/relatif (SPEC 4).

import { h, textBlock } from '../ui/dom.js';
import { formatNumber, parseDecimalInput } from '../core/format.js';

export const label = 'Numerik';
const EPS = 1e-9;

export function isAnswered(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isWithinTolerance(numericAnswer, value) {
  const { value: key, tolerance } = numericAnswer;
  const allowed = tolerance.type === 'relative' ? Math.abs(key) * tolerance.value : tolerance.value;
  return Math.abs(value - key) <= allowed + EPS;
}

export function autoScore(question, value) {
  return isAnswered(value) && isWithinTolerance(question.numericAnswer, value) ? question.maxScore : 0;
}

export function exportForGrading() {
  return null;
}

export function render(question, ctx) {
  const unit = question.numericAnswer.unit;
  const feedback = h('p', { class: 'hint', 'aria-live': 'polite' });
  const input = h('input', {
    type: 'text', inputmode: 'decimal', autocomplete: 'off', class: 'input-number',
    'aria-label': unit ? `Jawaban dalam ${unit}` : 'Jawaban angka',
    value: isAnswered(ctx.value) ? formatNumber(ctx.value) : '',
    disabled: ctx.readOnly,
    oninput: () => {
      const parsed = getAnswer(root);
      showFeedback(parsed);
      ctx.onChange(parsed);
    },
  });
  function showFeedback(parsed) {
    if (!input.value.trim()) feedback.textContent = '';
    else if (parsed === null) feedback.textContent = 'Angka tidak terbaca. Gunakan koma untuk desimal, mis. 47,8.';
    else feedback.textContent = `Terbaca: ${formatNumber(parsed)}${unit ? ` ${unit}` : ''}`;
  }
  const root = h('div', { class: 'q-numeric' },
    textBlock(question.stem, 'prose stem'),
    h('div', { class: 'numeric-row' }, input, unit ? h('span', { class: 'unit', text: unit }) : null),
    feedback);
  return root;
}

export function getAnswer(root) {
  return parseDecimalInput(root.querySelector('input').value);
}

export function renderReport(question, value) {
  return h('div', { class: 'report-item' },
    textBlock(question.stem, 'prose stem'),
    h('p', { text: `Jawaban: ${isAnswered(value) ? formatNumber(value) : 'kosong'} · Kunci: ${formatNumber(question.numericAnswer.value)} ${question.numericAnswer.unit}` }));
}
