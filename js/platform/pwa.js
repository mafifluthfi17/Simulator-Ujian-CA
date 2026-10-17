// PWA (SPEC 2): registrasi service worker, notifikasi "Versi baru tersedia — Muat
// Ulang" yang TIDAK tampil selama ujian berjalan, dan kunci sesi agar versi baru
// tidak dipakai di tengah ujian walau aplikasi ditutup lalu dibuka lagi.

// Keputusan menampilkan tawaran pembaruan (dites TS-21).
export function updateDecision({ waiting, activeSession, screen }) {
  if (!waiting) return { show: false, reason: 'tidak ada versi baru' };
  if (activeSession) return { show: false, reason: 'ada ujian yang sedang berjalan' };
  if (screen === 'exam') return { show: false, reason: 'sedang di ruang ujian' };
  return { show: true, reason: null };
}

export function swSupported(win = globalThis.window) {
  return Boolean(win && win.navigator && 'serviceWorker' in win.navigator && /^https?:$/.test(win.location.protocol));
}

// onWaiting(registration) dipanggil saat versi baru sudah terpasang dan menunggu.
export function registerServiceWorker({ onWaiting, win = window } = {}) {
  if (!swSupported(win)) return null;
  const sw = win.navigator.serviceWorker;
  const state = { registration: null, reloadRequested: false };
  sw.register('service-worker.js').then((reg) => {
    state.registration = reg;
    const check = () => {
      // Versi baru hanya ditawarkan bila halaman sudah dikendalikan versi lama.
      if (reg.waiting && sw.controller) onWaiting(reg);
    };
    check();
    reg.addEventListener('updatefound', () => {
      const worker = reg.installing;
      if (worker) worker.addEventListener('statechange', () => { if (worker.state === 'installed') check(); });
    });
    const refresh = () => { if (win.document.visibilityState === 'visible') reg.update().catch(() => {}); };
    win.document.addEventListener('visibilitychange', refresh);
    win.setInterval(refresh, 30 * 60000);
  }).catch(() => {});
  sw.addEventListener('controllerchange', () => {
    if (state.reloadRequested) {
      state.reloadRequested = false;
      win.location.reload();
    }
  });
  return {
    state,
    applyUpdate() {
      const waiting = state.registration && state.registration.waiting;
      if (!waiting) return false;
      state.reloadRequested = true;
      waiting.postMessage({ type: 'SKIP_WAITING' });
      return true;
    },
    // Memberi tahu service worker apakah ada ujian berjalan.
    setSessionLock(locked) {
      sw.ready.then((reg) => {
        if (reg.active) reg.active.postMessage({ type: locked ? 'SESSION_LOCK' : 'SESSION_UNLOCK' });
      }).catch(() => {});
    },
  };
}
