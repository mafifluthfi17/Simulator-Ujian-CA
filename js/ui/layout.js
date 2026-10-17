// Komponen bersama layar non-ujian: kepala layar, menu sekunder, disclaimer.

import { h } from './dom.js';
import { DISCLAIMER } from '../core/report.js';

export { DISCLAIMER };

export function disclaimer() {
  return h('p', { class: 'disclaimer', text: DISCLAIMER });
}

// options: { title, back: true | false, menu: true | false }
export function header(app, { title, back = true, menu = false }) {
  return h('header', { class: 'app-header' },
    back ? h('button', { type: 'button', class: 'btn btn-icon', 'aria-label': 'Kembali ke beranda', onclick: () => app.show('home') }, '‹') : null,
    h('h1', { text: title }),
    menu ? secondaryMenu(app) : null);
}

// Menu ⋯ (SPEC 3): Riwayat, Pengelola Bank Soal (PIN lokal), Pengaturan, Panduan.
function secondaryMenu(app) {
  const items = [
    ['Riwayat', 'history'],
    ['Pengelola Bank Soal', 'bank'],
    ['Pengaturan', 'settings'],
    ['Panduan', 'guide'],
  ];
  const menu = h('div', { class: 'menu', role: 'menu', hidden: true },
    items.map(([label, screen]) => h('button', { type: 'button', role: 'menuitem', onclick: () => app.show(screen) }, label)));
  const toggle = h('button', {
    type: 'button', class: 'btn btn-icon', 'aria-label': 'Menu lainnya', 'aria-haspopup': 'menu', 'aria-expanded': 'false',
    onclick: (e) => {
      e.stopPropagation();
      setOpen(menu.hidden);
    },
  }, '⋯');
  function setOpen(open) {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      menu.querySelector('button').focus();
      document.addEventListener('click', onOutside);
      document.addEventListener('keydown', onKey);
    } else {
      document.removeEventListener('click', onOutside);
      document.removeEventListener('keydown', onKey);
    }
  }
  function onOutside(e) {
    if (!menu.contains(e.target)) setOpen(false);
  }
  function onKey(e) {
    if (e.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    }
  }
  return h('div', { class: 'menu-wrap' }, toggle, menu);
}
