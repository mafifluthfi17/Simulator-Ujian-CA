// Pengendali aplikasi: memuat pack dan sesi, berpindah layar, menyimpan data.

import { h, clear, confirmDialog, alertDialog, toast } from './dom.js';
import { Store, StorageFullError, keys, memoryBackend } from '../core/storage.js';
import { loadAllPacks } from '../core/pack-loader.js';
import { formatErrors, loadActiveSession, releaseActive, saveSession } from '../core/session-store.js';
import { createSession, recoverOnOpen, submit } from '../core/session.js';
import { createRng, randomSeed } from '../core/random.js';
import { orderItems } from '../core/blueprint.js';
import { renderHome } from './home.js';
import { renderCustom } from './custom.js';
import { renderExam } from './exam-room.js';
import { renderResults } from './results.js';
import { renderHistory } from './history.js';
import { renderSettings } from './settings.js';
import { renderGuide } from './guide.js';
import { renderBank } from './bank-manager.js';
import { saveFile } from '../export/download.js';
import { registerServiceWorker, updateDecision } from '../platform/pwa.js';

const SCREENS = {
  home: renderHome,
  custom: renderCustom,
  exam: renderExam,
  results: renderResults,
  history: renderHistory,
  settings: renderSettings,
  guide: renderGuide,
  bank: renderBank,
};

export class App {
  constructor(root) {
    this.root = root;
    this.current = null;
    this.packs = [];
    this.problems = [];
    this.notices = [];
    this.audio = null;
  }

  async start() {
    this.store = createStore(this.notices);
    this.settings = { sound: false, lastSubjectId: null, ...(this.store.getJson(keys.settings) || {}) };
    // SPEC 2a: minta penyimpanan permanen (mengurangi risiko data dihapus Safari).
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then((ok) => { this.storagePersisted = ok; }).catch(() => {});
    }
    this.pwa = registerServiceWorker({ onWaiting: () => { this.updateWaiting = true; this.syncPlatform(); } });
    await this.reloadPacks();
    const expired = this.recoverSessions();
    this.show('home');
    if (expired) {
      await alertDialog('Waktu ujian sudah habis', [
        'Aplikasi ditutup saat ujian berjalan dan tenggat waktu sudah lewat.',
        'Jawaban yang tersimpan telah dikumpulkan otomatis.',
      ]);
      this.show('results', { session: expired });
    }
  }

  async reloadPacks() {
    const { packs, problems } = await loadAllPacks({ store: this.store });
    this.packs = packs;
    this.problems = problems;
    const ids = packs.map((p) => p.pack.subjectId);
    this.subjectId = ids.includes(this.subjectId) ? this.subjectId
      : ids.includes(this.settings.lastSubjectId) ? this.settings.lastSubjectId : ids[0] || null;
  }

  // Sesi aktif yang tenggatnya lewat dikunci (EXPIRED_ON_REOPEN). Mengembalikan
  // sesi kedaluwarsa milik mata ujian terpilih (bila ada) untuk ditampilkan.
  recoverSessions() {
    let shown = null;
    for (const { pack } of this.packs) {
      const active = loadActiveSession(this.store, pack.subjectId);
      if (!active) continue;
      if (!active.ok) {
        this.problems.push({ source: `sesi aktif ${active.sessionId}`, errors: active.errors });
        continue;
      }
      const { session, expired } = recoverOnOpen(active.session, Date.now());
      if (expired) {
        this.persist(session);
        if (pack.subjectId === this.subjectId) shown = session;
      }
    }
    return shown;
  }

  get pack() {
    const entry = this.packs.find((p) => p.pack.subjectId === this.subjectId);
    return entry ? entry.pack : null;
  }

  packFor(subjectId) {
    const entry = this.packs.find((p) => p.pack.subjectId === subjectId);
    return entry ? entry.pack : null;
  }

  selectSubject(subjectId) {
    this.subjectId = subjectId;
    this.saveSettings({ lastSubjectId: subjectId });
  }

  saveSettings(patch) {
    Object.assign(this.settings, patch);
    try {
      this.store.setJson(keys.settings, this.settings);
    } catch (e) {
      toast(e.message);
    }
  }

  show(name, params = {}) {
    if (this.current && this.current.destroy) this.current.destroy();
    clear(this.root);
    const screen = SCREENS[name](this, params);
    this.current = screen;
    this.root.append(screen.el);
    window.scrollTo(0, 0);
    if (screen.focus) screen.focus();
    this.screenName = name;
    this.syncPlatform();
  }

  hasActiveSession() {
    return this.packs.some(({ pack }) => Boolean(loadActiveSession(this.store, pack.subjectId)));
  }

  // Setiap pindah layar: kunci sesi ke service worker dan spanduk "Versi baru tersedia"
  // yang tidak pernah tampil selama ada ujian berjalan (SPEC 2, TS-21).
  syncPlatform() {
    if (!this.screenName) return; // belum ada layar (pack masih dimuat)
    const active = this.hasActiveSession();
    if (this.pwa && this.sessionLocked !== active) {
      this.sessionLocked = active;
      this.pwa.setSessionLock(active);
    }
    const decision = updateDecision({ waiting: Boolean(this.updateWaiting), activeSession: active, screen: this.screenName });
    let banner = document.getElementById('update-banner');
    if (!decision.show || this.updateDismissed) {
      if (banner) banner.remove();
      return;
    }
    if (banner) return;
    banner = h('div', { id: 'update-banner', class: 'update-banner', role: 'status' },
      h('span', { text: 'Versi baru tersedia.' }),
      h('button', { type: 'button', class: 'btn btn-primary', onclick: () => this.applyUpdate() }, 'Muat Ulang'),
      h('button', { type: 'button', class: 'btn', onclick: () => { this.updateDismissed = true; this.syncPlatform(); } }, 'Nanti'));
    document.body.append(banner);
  }

  applyUpdate() {
    if (this.hasActiveSession()) {
      alertDialog('Ada ujian yang sedang berjalan', ['Pembaruan dipasang setelah ujian dikumpulkan.']);
      this.syncPlatform();
      return;
    }
    if (!this.pwa || !this.pwa.applyUpdate()) window.location.reload();
  }

  // Menyimpan sesi. Hasil true bila berhasil; bila penyimpanan penuh, pengguna
  // ditawari mengunduh cadangan sesi agar jawaban tidak hilang.
  persist(session) {
    try {
      saveSession(this.store, session);
      return true;
    } catch (e) {
      const full = e instanceof StorageFullError;
      confirmDialog({
        title: full ? 'Penyimpanan penuh' : 'Gagal menyimpan',
        body: [e.message, 'Unduh cadangan sesi ini agar jawaban tidak hilang.'],
        confirmLabel: 'Unduh cadangan sesi',
        cancelLabel: 'Tutup',
      }).then((ok) => {
        if (ok) this.download(`cadangan-${session.sessionId}.json`, JSON.stringify({ backupVersion: '4.1', subjectId: session.subjectId, exportedAt: new Date().toISOString(), sessions: [session] }, null, 2));
      });
      return false;
    }
  }

  // Memulai sesi baru. build(rng) -> { ok, items, problems }.
  async beginSession({ packageId, packageName, mode, config, build }) {
    const pack = this.pack;
    const rng = createRng(randomSeed());
    const built = build(rng);
    if (!built.ok) {
      await alertDialog('Paket belum dapat dimulai', built.problems.map((p) => `• ${p}`));
      return;
    }
    const active = loadActiveSession(this.store, pack.subjectId);
    if (active && !active.ok) {
      const release = await confirmDialog({
        title: 'Sesi aktif tidak dapat dimuat',
        body: [
          'Ada sesi aktif yang tidak dapat dibaca aplikasi versi ini:',
          ...formatErrors(active.errors, 5),
          'Lepaskan sesi tersebut untuk memulai ujian baru. Datanya tidak dihapus: tetap tercatat di Riwayat dan ikut dalam ekspor cadangan di Pengaturan.',
        ],
        confirmLabel: 'Lepaskan & mulai baru',
      });
      if (!release) return;
      releaseActive(this.store, pack.subjectId);
    }
    if (active && active.ok) {
      const ok = await confirmDialog({
        title: 'Masih ada ujian yang belum selesai',
        body: [`Paket "${active.session.packageName}" masih berjalan.`, 'Memulai ujian baru akan MENGUMPULKAN ujian tersebut apa adanya.'],
        confirmLabel: 'Kumpulkan & mulai baru',
        danger: true,
      });
      if (!ok) return;
      submit(active.session, 'MANUAL', Date.now());
      if (!this.persist(active.session)) return;
    }
    const items = orderItems(built.items, config.shuffleQuestions, rng);
    const session = createSession({ pack, packageId, packageName, mode, config, items, rng, now: Date.now() });
    // Sesi disimpan SEBELUM timer berjalan (SPEC 9).
    if (!this.persist(session)) return;
    this.unlockAudio();
    this.show('exam', { session });
  }

  unlockAudio() {
    if (!this.settings.sound || this.audio) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) this.audio = new Ctx();
  }

  beep() {
    if (!this.settings.sound || !this.audio) return;
    const osc = this.audio.createOscillator();
    const gain = this.audio.createGain();
    osc.frequency.value = 880;
    gain.gain.value = 0.15;
    osc.connect(gain).connect(this.audio.destination);
    osc.start();
    osc.stop(this.audio.currentTime + 0.35);
  }

  download(filename, data, mime = 'application/json') {
    saveFile({ filename, mime, data });
  }
}

function createStore(notices) {
  try {
    const probe = '__caSim_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return new Store(window.localStorage);
  } catch {
    notices.push('Penyimpanan perangkat tidak tersedia (mode privat?). Data hanya bertahan selama halaman terbuka.');
    return new Store(memoryBackend());
  }
}
