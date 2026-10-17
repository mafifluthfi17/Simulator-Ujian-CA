// Tipe soal pilihan ganda: dinilai aplikasi. Jawaban disimpan sebagai KUNCI ASLI;
// optionOrder di sesi menentukan urutan tampil (DECISIONS D-12).

import { h, textBlock } from '../ui/dom.js';

export const label = 'Pilihan ganda';
const LETTERS = ['A', 'B', 'C', 'D'];

export function displayLetter(index) {
  return LETTERS[index];
}

// Kunci asli dari huruf yang dilihat peserta.
export function originalKeyForDisplay(optionOrder, letter) {
  return optionOrder[LETTERS.indexOf(letter)];
}

export function displayLetterForKey(optionOrder, key) {
  return LETTERS[optionOrder.indexOf(key)];
}

export function isAnswered(value) {
  return typeof value === 'string' && LETTERS.includes(value);
}

export function autoScore(question, value) {
  return value === question.answerKey ? question.maxScore : 0;
}

export function exportForGrading() {
  return null;
}

// ctx: { item, value, onChange(value), readOnly }
export function render(question, ctx) {
  const name = `opt-${question.id}`;
  const order = ctx.item.optionOrder;
  const textByKey = new Map(question.options.map((o) => [o.key, o.text]));
  const list = h('div', { class: 'options', role: 'radiogroup', 'aria-label': 'Pilihan jawaban' },
    order.map((key, i) => {
      const input = h('input', {
        type: 'radio', name, value: key, checked: ctx.value === key, disabled: ctx.readOnly,
        onchange: () => ctx.onChange(getAnswer(root)),
      });
      return h('label', { class: 'option' }, input,
        h('span', { class: 'option-letter', text: displayLetter(i) }),
        h('span', { class: 'option-text', text: textByKey.get(key) }));
    }));
  const clearBtn = ctx.readOnly ? null : h('button', {
    type: 'button', class: 'btn btn-link',
    onclick: () => {
      for (const input of root.querySelectorAll('input[type=radio]')) input.checked = false;
      ctx.onChange(null);
    },
  }, 'Hapus pilihan');
  const root = h('div', { class: 'q-mcq' }, textBlock(question.stem, 'prose stem'), list, clearBtn);
  return root;
}

export function getAnswer(root) {
  const checked = root.querySelector('input[type=radio]:checked');
  return checked ? checked.value : null;
}

export function renderReport(question, value, item) {
  const chosen = value ? displayLetterForKey(item.optionOrder, value) : null;
  return h('div', { class: 'report-item' },
    textBlock(question.stem, 'prose stem'),
    h('p', { text: `Jawaban: ${chosen ? `${chosen} (opsi asli ${value})` : 'kosong'} · Kunci: ${displayLetterForKey(item.optionOrder, question.answerKey)}` }));
}
