// Pembuat berkas turunan fase A4 (fungsi murni; berkas dibaca lewat `load(path)`):
//   - service-worker.js: daftar aset + versi cache dari hash isi aset (SPEC 2);
//   - dist/simulator-offline.html: satu berkas untuk file:// (modul ES digabung).
// Dipakai tools/build-sw.mjs, tools/build-offline.mjs, dan tes sinkronisasi.

import { sha256Hex } from '../js/core/hash.js';
import { APP_VERSION } from '../js/core/version.js';

const BANNER = 'Dibuat otomatis oleh';

function resolvePath(from, spec) {
  const parts = from.split('/').slice(0, -1);
  for (const seg of spec.split('/')) {
    if (seg === '.' || seg === '') continue;
    if (seg === '..') parts.pop();
    else parts.push(seg);
  }
  return parts.join('/');
}

// Satu pernyataan impor statis di awal baris (tidak melewati ';').
const STATIC_IMPORT = /^import\s+(?:[^;]*?\s+from\s+)?'([^']+)';?/gm;

// Modul yang dimuat statis dari js/main.js, urutan pasca-urut (dependensi lebih dulu).
export async function moduleGraph(load, entry = 'js/main.js') {
  const order = [];
  const seen = new Set();
  const sources = {};
  async function visit(path) {
    if (seen.has(path)) return;
    seen.add(path);
    const src = await load(path);
    sources[path] = src;
    for (const m of src.matchAll(STATIC_IMPORT)) await visit(resolvePath(path, m[1]));
    order.push(path);
  }
  await visit(entry);
  return { order, sources };
}

const SHELL = [
  'index.html', 'manifest.webmanifest', 'css/app.css', 'css/print.css',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  'packs/index.json', 'packs/index.js',
];
const BINARY = /\.png$/;

// Daftar aset yang di-cache service worker. './' melayani index.html.
export async function collectAssets(load) {
  const { order } = await moduleGraph(load);
  const packIds = JSON.parse(await load('packs/index.json'));
  const packs = packIds.flatMap((id) => [`packs/${id}/pack.json`, `packs/${id}/pack.js`]);
  return ['./', ...SHELL, ...packs, ...order.slice().sort()];
}

// Versi cache = versi aplikasi + 12 heks pertama SHA-256 isi aset teks (ikon PNG lewat path saja).
export async function assetVersion(load, assets) {
  const parts = [];
  for (const a of assets) {
    if (a === './') continue;
    parts.push(`${a}\n${BINARY.test(a) ? '' : (await load(a)).replace(/\r\n/g, '\n')}`);
  }
  return `casim-${APP_VERSION}-${(await sha256Hex(parts.join('\n\u0000\n'))).slice(0, 12)}`;
}

// Isi service worker (tanpa VERSION/ASSETS). Dapat dijalankan dengan self/caches/fetch tiruan di tes.
export const SW_BODY = `
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
`;

export function serviceWorkerSource({ version, assets }) {
  return `// ${BANNER} tools/build-sw.mjs. Jangan diedit langsung.\n`
    + '// Service worker Simulator Ujian CA: cache berversi, aplikasi berjalan offline setelah kunjungan pertama.\n'
    + `const VERSION = ${JSON.stringify(version)};\n`
    + `const ASSETS = ${JSON.stringify(assets, null, 2)};\n${SW_BODY}`;
}

export async function buildServiceWorker(load) {
  const assets = await collectAssets(load);
  const version = await assetVersion(load, assets);
  return { version, assets, source: serviceWorkerSource({ version, assets }) };
}

// ---------- Versi satu berkas (file://) ----------

// Mengubah satu modul ES menjadi fungsi pabrik dengan __require/__exports.
export function transformModule(path, src) {
  const exported = [];
  let out = src.replace(/^import\s+([^;]*?)\s+from\s+'([^']+)';?/gm, (m, clause, spec) => {
    const target = `__require(${JSON.stringify(resolvePath(path, spec))})`;
    const c = clause.trim();
    if (c.startsWith('* as ')) return `const ${c.slice(5).trim()} = ${target};`;
    if (c.startsWith('{')) return `const ${c.replace(/\s+as\s+/g, ': ')} = ${target};`;
    throw new Error(`${path}: bentuk impor tidak didukung: ${m.split('\n')[0]}`);
  });
  out = out.replace(/^export\s+\{([^}]*)\};?/gm, (m, list) => {
    for (const item of list.split(',').map((s) => s.trim()).filter(Boolean)) {
      const [local, alias] = item.split(/\s+as\s+/);
      exported.push([alias || local, local]);
    }
    return '';
  });
  out = out.replace(/^export\s+(async\s+function|function|class|const|let)\s+([A-Za-z_$][\w$]*)/gm, (m, kw, name) => {
    exported.push([name, name]);
    return `${kw} ${name}`;
  });
  if (/^export\s/m.test(out)) throw new Error(`${path}: bentuk ekspor tidak didukung`);
  out = out.replace(/import\((['"])\.\/selftest\.js\1\)/g, "Promise.reject(new Error('Self-test hanya tersedia lewat http(s), bukan versi satu berkas.'))");
  if (/\bimport\(/.test(out)) throw new Error(`${path}: impor dinamis tidak didukung`);
  const getters = exported.map(([name, local]) => `${JSON.stringify(name)}: { enumerable: true, get: () => ${local} }`).join(',\n  ');
  return `__define(${JSON.stringify(path)}, function (__exports, __require) {\n'use strict';\nObject.defineProperties(__exports, {\n  ${getters}\n});\n${out}\n});`;
}

// Teks JS di dalam <script> tidak boleh memuat "</script".
const safeScript = (js) => js.replace(/<\/(script)/gi, '<\\/$1');
const safeStyle = (css) => css.replace(/<\/(style)/gi, '<\\/$1');

export async function buildOfflineHtml(load) {
  const { order, sources } = await moduleGraph(load);
  const packIds = JSON.parse(await load('packs/index.json'));
  const packScripts = [await load('packs/index.js'), ...await Promise.all(packIds.map((id) => load(`packs/${id}/pack.js`)))];
  const icon = `data:image/svg+xml,${encodeURIComponent((await load('icons/icon.svg')).trim())}`;
  const runtime = 'const __factories = {};\nconst __cache = {};\n'
    + 'function __define(path, factory) { __factories[path] = factory; }\n'
    + 'function __require(path) {\n  if (__cache[path]) return __cache[path];\n  const exports = {};\n  __cache[path] = exports;\n'
    + '  if (!__factories[path]) throw new Error(`Modul tidak ditemukan: ${path}`);\n  __factories[path](exports, __require);\n  return exports;\n}\n';
  const modules = order.map((p) => transformModule(p, sources[p])).join('\n\n');
  return `<!doctype html>\n<!-- ${BANNER} tools/build-offline.mjs. Jangan diedit langsung. Versi satu berkas untuk dibuka dari file://. -->\n`
    + '<html lang="id">\n<head>\n<meta charset="utf-8">\n'
    + '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    + '<meta name="color-scheme" content="light dark">\n'
    + `<title>Simulator Ujian CA (offline)</title>\n<link rel="icon" href="${icon}">\n`
    + `<style>\n${safeStyle(await load('css/app.css'))}\n</style>\n`
    + `<style media="print">\n${safeStyle(await load('css/print.css'))}\n</style>\n`
    + '</head>\n<body>\n<main id="app">\n<noscript>Aplikasi ini membutuhkan JavaScript.</noscript>\n<p class="screen">Memuat aplikasi…</p>\n</main>\n'
    + packScripts.map((s) => `<script>\n${safeScript(s)}</script>\n`).join('')
    + `<script>\n(function () {\n'use strict';\n${safeScript(runtime)}\n${safeScript(modules)}\n__require('js/main.js');\n})();\n</script>\n`
    + '</body>\n</html>\n';
}
