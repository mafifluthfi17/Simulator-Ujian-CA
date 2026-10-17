// Penanganan iOS (SPEC 2a-e): deteksi, ajakan "Tambahkan ke Layar Utama" (Safari
// dapat menghapus data situs yang lama tidak dibuka kecuali aplikasi dipasang),
// dan pengingat cadangan. Fungsi deteksi menerima parameter agar dapat dites.

import { h } from '../ui/dom.js';

export const INSTALL_SNOOZE_MS = 14 * 24 * 3600 * 1000;

export function isIOS(nav = globalThis.navigator) {
  if (!nav) return false;
  const ua = nav.userAgent || '';
  // iPadOS 13+ mengaku "Macintosh"; dibedakan dari layar sentuh.
  return /iPad|iPhone|iPod/.test(ua) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1);
}

export function isIPhone(nav = globalThis.navigator) {
  return Boolean(nav) && /iPhone|iPod/.test(nav.userAgent || '');
}

export function isStandalone(win = globalThis.window) {
  if (!win) return false;
  const mq = win.matchMedia && win.matchMedia('(display-mode: standalone)');
  return Boolean((mq && mq.matches) || win.navigator.standalone === true);
}

export function shouldShowInstallPrompt({ ios, standalone, dismissedAt, now }) {
  if (!ios || standalone) return false;
  return !dismissedAt || now - dismissedAt > INSTALL_SNOOZE_MS;
}

// Kartu ajakan di beranda. onDismiss dipanggil saat pengguna memilih "Nanti".
export function installCard({ onDismiss }) {
  return h('div', { class: 'card install-card', role: 'note' },
    h('h2', { style: 'margin-top:0', text: 'Pasang ke Layar Utama' }),
    h('p', { text: 'Di iPhone/iPad, Safari dapat menghapus data aplikasi (termasuk riwayat ujian) bila lama tidak dibuka. Agar data lebih aman dan ujian tampil penuh tanpa bilah browser:' }),
    h('ol', {},
      h('li', { text: 'Ketuk ikon Bagikan (kotak dengan panah ke atas) di Safari.' }),
      h('li', { text: 'Pilih "Tambahkan ke Layar Utama", lalu ketuk Tambah.' }),
      h('li', { text: 'Buka aplikasi dari ikon "Simulator CA" di Layar Utama.' })),
    h('p', { class: 'hint', text: 'Tetap buat cadangan sesi secara berkala di Pengaturan › Cadangan sesi.' }),
    h('button', { type: 'button', class: 'btn', onclick: onDismiss }, 'Nanti'));
}
