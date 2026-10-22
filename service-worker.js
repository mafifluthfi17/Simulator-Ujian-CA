// Dibuat otomatis oleh tools/build-sw.mjs. Jangan diedit langsung.
// Service worker Simulator Ujian CA: cache berversi, aplikasi berjalan offline setelah kunjungan pertama.
const VERSION = "casim-0.1.0-52f78732088a";
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/app.css",
  "css/print.css",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "packs/index.json",
  "packs/index.js",
  "packs/demo/pack.json",
  "packs/demo/pack.js",
  "packs/msk/pack.json",
  "packs/msk/pack.js",
  "packs/pk/pack.json",
  "packs/pk/pack.js",
  "js/core/bank.js",
  "js/core/blueprint.js",
  "js/core/calc.js",
  "js/core/consistency.js",
  "js/core/contract.js",
  "js/core/format.js",
  "js/core/grader-contact.js",
  "js/core/grading-io.js",
  "js/core/hash.js",
  "js/core/jsonschema.js",
  "js/core/migrate.js",
  "js/core/pack-loader.js",
  "js/core/prompts.js",
  "js/core/random.js",
  "js/core/report.js",
  "js/core/review-io.js",
  "js/core/schemas.js",
  "js/core/scoring.js",
  "js/core/session-store.js",
  "js/core/session.js",
  "js/core/storage.js",
  "js/core/timer.js",
  "js/core/version.js",
  "js/export/csv.js",
  "js/export/docx.js",
  "js/export/download.js",
  "js/export/html-report.js",
  "js/export/report-blocks.js",
  "js/export/report-files.js",
  "js/export/report-sheets.js",
  "js/export/xlsx.js",
  "js/export/xml.js",
  "js/export/zip.js",
  "js/main.js",
  "js/platform/ios.js",
  "js/platform/pwa.js",
  "js/platform/seb.js",
  "js/types/case.js",
  "js/types/essay.js",
  "js/types/mcq.js",
  "js/types/numeric.js",
  "js/types/registry.js",
  "js/ui/app.js",
  "js/ui/bank-manager.js",
  "js/ui/calculator.js",
  "js/ui/custom.js",
  "js/ui/dom.js",
  "js/ui/exam-room.js",
  "js/ui/guide.js",
  "js/ui/history.js",
  "js/ui/home.js",
  "js/ui/layout.js",
  "js/ui/report-view.js",
  "js/ui/results.js",
  "js/ui/settings.js"
];

// Kunci sesi: selama ujian berjalan halaman mengirim SESSION_LOCK; versi yang
// sedang melayani dicatat dan tetap dipakai walau versi baru aktif (mis. aplikasi
// ditutup lalu dibuka lagi), sampai halaman mengirim SESSION_UNLOCK (SPEC 2).
const LOCK_CACHE = 'casim-lock';
const LOCK_URL = new URL('__session-lock.json', self.location).href;

async function readLock() {
  const cache = await caches.open(LOCK_CACHE);
  const res = await cache.match(LOCK_URL);
  return res ? res.json() : null;
}

async function cleanup(keepVersion) {
  const keep = new Set([VERSION, LOCK_CACHE, keepVersion].filter(Boolean));
  for (const key of await caches.keys()) {
    if (key.startsWith('casim-') && !keep.has(key)) await caches.delete(key);
  }
}

async function servingCache() {
  const lock = await readLock();
  if (lock && lock.version !== VERSION && (await caches.has(lock.version))) return caches.open(lock.version);
  return caches.open(VERSION);
}

self.addEventListener('install', (event) => {
  // Tidak memanggil skipWaiting: versi baru menunggu sampai pengguna memilih
  // "Muat Ulang" di luar sesi ujian.
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(
    ASSETS.map((a) => new Request(new URL(a, self.location).href, { cache: 'reload' })),
  )));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const lock = await readLock();
    await cleanup(lock ? lock.version : null);
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  const type = event.data && event.data.type;
  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (type === 'SESSION_LOCK') {
    event.waitUntil((async () => {
      if (await readLock()) return;
      const cache = await caches.open(LOCK_CACHE);
      await cache.put(LOCK_URL, new Response(JSON.stringify({ version: VERSION, at: Date.now() }), { headers: { 'Content-Type': 'application/json' } }));
    })());
  } else if (type === 'SESSION_UNLOCK') {
    event.waitUntil((async () => {
      const cache = await caches.open(LOCK_CACHE);
      await cache.delete(LOCK_URL);
      await cleanup(null);
    })());
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const scope = new URL('./', self.location).href;
  const path = url.href.split('?')[0].split('#')[0];
  const isShell = req.mode === 'navigate' && (path === scope || path === new URL('index.html', self.location).href);
  event.respondWith((async () => {
    const cache = await servingCache();
    const hit = isShell
      ? await cache.match(new URL('index.html', self.location).href)
      : await cache.match(req, { ignoreSearch: true });
    return hit || fetch(req);
  })());
});
