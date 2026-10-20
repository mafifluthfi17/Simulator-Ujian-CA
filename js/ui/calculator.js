// Kalkulator akuntansi mengambang: tombol di pojok kanan bawah membuka panel
// kecil; tombol × menutup panel dan tombol kalkulator tetap ada untuk membuka lagi.

import { h } from './dom.js';
import { CalcError, displayExpression, evaluate, formatNumber, resultToExpression } from '../core/calc.js';

const KEYS = [
  ['C', 'clear', 'fn'], ['(', '(', 'fn'], [')', ')', 'fn'], ['⌫', 'back', 'fn'],
  ['7', '7'], ['8', '8'], ['9', '9'], ['÷', '/', 'op'],
  ['4', '4'], ['5', '5'], ['6', '6'], ['×', '*', 'op'],
  ['1', '1'], ['2', '2'], ['3', '3'], ['−', '-', 'op'],
  ['0', '0'], [',', '.'], ['%', '%', 'fn'], ['+', '+', 'op'],
];

export function mountCalculator(parent = document.body) {
  let expr = '';
  let shown = null; // hasil terakhir (angka) setelah tombol =
  let error = '';

  const exprEl = h('div', { class: 'calc-expr', 'aria-hidden': 'true' });
  const resultEl = h('div', { class: 'calc-result', role: 'status', 'aria-live': 'polite' });
  const fab = h('button', {
    type: 'button', class: 'calc-fab', 'aria-label': 'Buka kalkulator', 'aria-expanded': 'false', title: 'Kalkulator',
    onclick: () => setOpen(true),
  }, h('span', { class: 'calc-fab-icon', 'aria-hidden': 'true' }, '🖩'), h('span', { class: 'calc-fab-label', text: 'Kalkulator' }));
  const panel = h('div', { class: 'calc-panel', role: 'dialog', 'aria-label': 'Kalkulator', hidden: true, tabindex: '-1' },
    h('div', { class: 'calc-head' },
      h('span', { class: 'calc-title' }, 'Kalkulator ', h('small', { text: '· tarik panel untuk geser' })),
      h('button', { type: 'button', class: 'calc-side', 'aria-label': 'Pindahkan kalkulator ke sisi seberang', title: 'Pindah kiri/kanan', onclick: flipSide }, '⇄'),
      h('button', { type: 'button', class: 'calc-close', 'aria-label': 'Tutup kalkulator', onclick: () => setOpen(false) }, '×')),
    h('div', { class: 'calc-screen' }, exprEl, resultEl),
    h('div', { class: 'calc-keys' },
      KEYS.map(([label, value, kind]) => h('button', {
        type: 'button', class: `calc-key ${kind || 'num'}`, dataset: { key: value }, onclick: () => press(value),
      }, label)),
      h('button', { type: 'button', class: 'calc-key eq', dataset: { key: '=' }, onclick: () => press('='), 'aria-label': 'Hitung' }, '=')));

  // Geser panel: tarik bagian kepala (mouse atau sentuh); posisi tetap dalam layar.
  function placePanel(left, top) {
    const r = panel.getBoundingClientRect();
    const x = Math.min(Math.max(0, left), window.innerWidth - r.width);
    const y = Math.min(Math.max(0, top), window.innerHeight - r.height);
    Object.assign(panel.style, { left: `${x}px`, top: `${y}px`, right: 'auto', bottom: 'auto' });
  }
  function flipSide() {
    const r = panel.getBoundingClientRect();
    placePanel(r.left < window.innerWidth / 2 ? window.innerWidth : 0, r.top);
  }
  let drag = null;
  const head = panel; // seluruh panel (selain tombol) dapat ditarik
  head.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    const r = panel.getBoundingClientRect();
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    head.setPointerCapture(e.pointerId);
  });
  head.addEventListener('pointermove', (e) => { if (drag) placePanel(e.clientX - drag.dx, e.clientY - drag.dy); });
  const endDrag = () => { drag = null; };
  head.addEventListener('pointerup', endDrag);
  head.addEventListener('pointercancel', endDrag);
  window.addEventListener('resize', () => {
    if (!panel.hidden && panel.style.left) { const r = panel.getBoundingClientRect(); placePanel(r.left, r.top); }
  });

  function setOpen(open) {
    panel.hidden = !open;
    fab.hidden = open;
    fab.setAttribute('aria-expanded', String(open));
    if (open) panel.focus();
    else fab.focus();
  }

  function render() {
    exprEl.textContent = displayExpression(expr) || '0';
    if (error) resultEl.textContent = error;
    else if (shown !== null) resultEl.textContent = formatNumber(shown);
    else {
      let preview = '';
      try { if (expr && /[0-9)%]$/.test(expr)) preview = formatNumber(evaluate(expr)); } catch (e) { /* belum lengkap */ }
      resultEl.textContent = preview;
    }
    resultEl.classList.toggle('error', Boolean(error));
  }

  function press(key) {
    if (error && key !== 'back') expr = ''; // setelah pesan salah, mulai hitungan baru
    error = '';
    const isOperator = '+-*/'.includes(key);
    if (shown !== null) {
      // Setelah "=": operator melanjutkan dari hasil, angka memulai hitungan baru.
      if (key !== '=' && key !== 'back' && key !== 'clear') expr = isOperator || key === '%' ? resultToExpression(shown) : '';
      shown = null;
    }
    if (key === 'clear') expr = '';
    else if (key === 'back') expr = expr.slice(0, -1);
    else if (key === '=') {
      if (expr) {
        try {
          shown = evaluate(expr);
          expr = resultToExpression(shown);
        } catch (e) {
          if (!(e instanceof CalcError)) throw e;
          error = e.message;
        }
      }
    } else if (isOperator && /[+*/-]$/.test(expr)) {
      expr = expr.slice(0, -1) + key; // ganti operator terakhir
    } else if (key === '.') {
      const lastNumber = expr.match(/[0-9.]*$/)[0];
      if (!lastNumber.includes('.')) expr += lastNumber ? '.' : '0.';
    } else expr += key;
    render();
  }

  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    let key = null;
    if (/^[0-9+\-*/()%]$/.test(e.key)) key = e.key;
    else if (e.key === '.' || e.key === ',') key = '.';
    else if (e.key === 'Enter' || e.key === '=') key = '=';
    else if (e.key === 'Backspace') key = 'back';
    else if (e.key === 'Delete') key = 'clear';
    if (key === null) return;
    // Enter pada tombol yang sedang fokus menekan tombol itu sendiri.
    if (e.key === 'Enter' && e.target.closest('button')) return;
    e.preventDefault();
    press(key);
  });

  render();
  parent.append(fab, panel);
  return { open: () => setOpen(true), close: () => setOpen(false), press, panel, fab };
}
