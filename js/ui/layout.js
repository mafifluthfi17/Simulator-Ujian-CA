// Komponen bersama layar non-ujian: kepala layar, menu sekunder, disclaimer.

import { h } from './dom.js';

export const DISCLAIMER = 'Simulator belajar, bukan ujian resmi, dan tidak berafiliasi dengan IAI. '
  + 'Passing grade 70 adalah standar latihan internal, bukan ketentuan resmi IAI.';

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

// Menu ⋯ (SPEC 3). Pengelola Bank Soal ditambahkan pada fase A3.
function secondaryMenu(app) {
  const items = [
    ['Riwayat', 'history'],
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
