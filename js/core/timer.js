// Peringatan waktu dan deteksi lompatan jam (SPEC 9).

export const WARNING_MINUTES = [15, 5, 1];
export const CLOCK_JUMP_THRESHOLD_MS = 60000;

// Detail event: "15 menit" (ditampilkan) atau "15 menit (terlewati)".
const warningDetail = (m) => `${m} menit`;
const skippedDetail = (m) => `${m} menit (terlewati)`;

// Peringatan yang jatuh tempo. Hanya ambang yang lebih kecil dari durasi ujian
// yang berlaku; bila beberapa ambang terlewati sekaligus (mis. aplikasi dibuka
// kembali), hanya ambang terkecil yang ditampilkan dan sisanya dicatat terlewati.
// Riwayat dibaca dari log event sehingga tidak terulang setelah muat ulang.
// Hasil: null atau { minutes, events: [detail, ...] } — semua detail dicatat sebagai event warning.
export function dueWarning(session, remaining) {
  const fired = new Set(session.events.filter((e) => e.type === 'warning').map((e) => parseInt(e.detail, 10)));
  const crossed = WARNING_MINUTES.filter((m) => session.config.durationMinutes > m
    && remaining <= m * 60000 && !fired.has(m));
  if (!crossed.length) return null;
  const minutes = Math.min(...crossed);
  const events = crossed.filter((m) => m !== minutes).map(skippedDetail);
  events.push(warningDetail(minutes));
  return { minutes, events };
}

// Membandingkan kemajuan Date.now() dengan performance.now(). Selisih besar berarti
// jam perangkat diubah (deteksi tidak sempurna: perangkat tidur dapat memicunya).
export class ClockWatch {
  constructor(wall = () => Date.now(), mono = () => globalThis.performance.now()) {
    this.wall = wall;
    this.mono = mono;
    this.reset();
  }

  reset() {
    this.lastWall = this.wall();
    this.lastMono = this.mono();
  }

  // Mengembalikan selisih (ms) bila melebihi ambang, selain itu 0.
  check() {
    const wall = this.wall();
    const mono = this.mono();
    const drift = (wall - this.lastWall) - (mono - this.lastMono);
    this.lastWall = wall;
    this.lastMono = mono;
    return Math.abs(drift) > CLOCK_JUMP_THRESHOLD_MS ? Math.round(drift) : 0;
  }
}
