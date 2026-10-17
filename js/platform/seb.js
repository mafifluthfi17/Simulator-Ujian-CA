// Deteksi Safe Exam Browser (SPEC 3) lewat user agent. SEB Windows dan iOS
// menambahkan "SEB/<versi>" ke user agent secara bawaan. Deteksi ini hanya untuk
// lencana informasi; aplikasi TIDAK mengunci perangkat. BELUM DIVERIFIKASI di SEB nyata.

import { h } from '../ui/dom.js';

export function isSEB(ua = globalThis.navigator ? globalThis.navigator.userAgent : '') {
  return /\bSEB\/\d|SafeExamBrowser/i.test(ua || '');
}

export function sebBadge() {
  return isSEB() ? h('span', { class: 'badge badge-seb', title: 'Terdeteksi dari user agent. Aplikasi tidak mengunci perangkat; penguncian dilakukan oleh SEB.', text: 'Berjalan di SEB' }) : null;
}
