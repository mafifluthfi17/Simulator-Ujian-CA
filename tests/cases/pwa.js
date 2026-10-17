// PWA, iOS, SEB, versi satu berkas (SPEC 2, 3). Service worker ASLI dijalankan
// dengan self/caches/fetch tiruan untuk TS-20 (offline) dan TS-21 (pembaruan).
import * as assert from './assert.js';
import { loadBytes, loadJson, loadText, isNode } from './env.js';
import { PNG_ICONS, iconSvg, pngRows, rasterIcon } from '../../tools/icons.mjs';
import { buildOfflineHtml, buildServiceWorker, moduleGraph } from '../../tools/pwa-build.mjs';
import { crc32 } from '../../js/export/zip.js';
import { updateDecision } from '../../js/platform/pwa.js';
import { isIOS, isStandalone, shouldShowInstallPrompt, INSTALL_SNOOZE_MS } from '../../js/platform/ios.js';
import { isSEB } from '../../js/platform/seb.js';

const ORIGIN = 'https://contoh.test/simulator/';

// Lingkungan service worker tiruan. network(url) -> Response | null (null = offline).
function swHarness(source, network) {
  const listeners = {};
  const store = new Map();
  const cacheOf = (name) => {
    if (!store.has(name)) store.set(name, new Map());
    const m = store.get(name);
    const key = (r) => (typeof r === 'string' ? r : r.url);
    return {
      addAll: async (reqs) => {
        for (const r of reqs) {
          const res = await network(key(r));
          if (!res) throw new Error(`gagal mengambil ${key(r)}`);
          m.set(key(r), res);
        }
      },
      put: async (r, res) => { m.set(key(r), res); },
      match: async (r, opts) => {
        let url = key(r);
        if (opts && opts.ignoreSearch) url = url.split('?')[0];
        const hit = m.get(url);
        return hit ? hit.clone() : undefined;
      },
      delete: async (r) => m.delete(key(r)),
    };
  };
  const caches = {
    open: async (name) => cacheOf(name),
    has: async (name) => store.has(name),
    keys: async () => [...store.keys()],
    delete: async (name) => store.delete(name),
  };
  const self = {
    location: new URL('service-worker.js', ORIGIN),
    skipped: false,
    addEventListener: (type, fn) => { listeners[type] = fn; },
    skipWaiting: () => { self.skipped = true; },
    clients: { claim: async () => {} },
  };
  const fetchFn = async (req) => {
    const res = await network(typeof req === 'string' ? req : req.url);
    if (!res) throw new TypeError('Failed to fetch (offline)');
    return res;
  };
  new Function('self', 'caches', 'fetch', source)(self, caches, fetchFn);
  async function dispatch(type, init = {}) {
    const waits = [];
    let response = null;
    listeners[type]({ ...init, waitUntil: (p) => waits.push(p), respondWith: (p) => { response = p; } });
    await Promise.all(waits);
    return response ? response : null;
  }
  return { self, store, dispatch, caches };
}

// Server tiruan: isi tiap aset diberi penanda versi.
const server = (tag, online = { on: true }) => async (url) => (online.on ? new Response(`${tag}:${url.replace(ORIGIN, '')}`) : null);
const get = (url, mode = 'cors') => ({ request: { url: new URL(url, ORIGIN).href, method: 'GET', mode } });

export default {
  name: 'PWA dan platform',
  cases: [
    {
      name: 'ikon buatan sendiri: PNG valid 192/512/180 sinkron dengan tools/icons.mjs; manifest dan index.html lengkap',
      run: async () => {
        assert.equal(await loadText('icons/icon.svg'), iconSvg(), 'icons/icon.svg tidak sinkron; jalankan node tools/build-icons.mjs');
        for (const [path, size] of PNG_ICONS) {
          const bytes = await loadBytes(path);
          assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], `${path}: tanda tangan PNG`);
          const view = new DataView(bytes.buffer, bytes.byteOffset);
          assert.equal(view.getUint32(16), size, `${path}: lebar`);
          assert.equal(view.getUint32(20), size, `${path}: tinggi`);
          assert.ok(bytes.length < 60000, `${path}: ${bytes.length} byte, terlalu besar`);
          const idat = [];
          for (let p = 8; p < bytes.length;) {
            const len = view.getUint32(p);
            const type = String.fromCharCode(...bytes.subarray(p + 4, p + 8));
            assert.equal(crc32(bytes.subarray(p + 4, p + 8 + len)), view.getUint32(p + 8 + len), `${path}: CRC ${type}`);
            if (type === 'IDAT') idat.push(bytes.subarray(p + 8, p + 8 + len));
            p += 12 + len;
          }
          // Piksel hasil dekompresi = rasterisasi tools/icons.mjs (byte zlib boleh berbeda antar-mesin).
          const stream = new Blob(idat).stream().pipeThrough(new DecompressionStream('deflate'));
          const rows = new Uint8Array(await new Response(stream).arrayBuffer());
          const expected = pngRows(size, rasterIcon(size));
          assert.equal(rows.length, expected.length, `${path}: ukuran data piksel`);
          assert.ok(rows.every((b, i) => b === expected[i]), `${path} tidak sinkron; jalankan node tools/build-icons.mjs`);
        }
        const m = await loadJson('manifest.webmanifest');
        assert.equal(m.start_url, './');
        assert.equal(m.scope, './');
        assert.equal(m.display, 'standalone');
        assert.ok(m.name && m.short_name && m.theme_color && m.background_color);
        const sizes = m.icons.filter((i) => i.type === 'image/png').map((i) => `${i.sizes}:${i.purpose}`);
        for (const s of ['192x192:any', '512x512:any', '512x512:maskable']) assert.ok(sizes.includes(s), s);
        const html = await loadText('index.html');
        for (const needle of ['rel="manifest"', 'rel="apple-touch-icon" href="icons/apple-touch-icon.png"', 'name="theme-color"', 'viewport-fit=cover', 'apple-mobile-web-app-capable']) {
          assert.ok(html.includes(needle), needle);
        }
      },
    },
    {
      name: 'service-worker.js sinkron; semua modul, pack, CSS, dan ikon ada di cache',
      run: async () => {
        const built = await buildServiceWorker(loadText);
        assert.equal(await loadText('service-worker.js'), built.source, 'service-worker.js tidak sinkron; jalankan node tools/build-sw.mjs');
        const { order } = await moduleGraph(loadText);
        for (const p of [...order, './', 'index.html', 'css/app.css', 'css/print.css', 'manifest.webmanifest', 'icons/icon-192.png', 'packs/demo/pack.json']) {
          assert.ok(built.assets.includes(p), `${p} tidak di-cache`);
        }
        assert.ok(order.includes('js/platform/pwa.js') && order.includes('js/ui/bank-manager.js'));
        assert.ok(!built.assets.some((a) => a.startsWith('tests/') || a === 'js/selftest.js'), 'berkas tes tidak ikut cache');
        assert.ok(/^casim-\d+\.\d+\.\d+-[0-9a-f]{12}$/.test(built.version), built.version);
      },
    },
    {
      id: 'TS-20',
      name: 'muat ulang offline setelah kunjungan pertama: aplikasi terbuka dari cache',
      run: async () => {
        const { source, assets } = await buildServiceWorker(loadText);
        const online = { on: true };
        const sw = swHarness(source, server('v1', online));
        await sw.dispatch('install');
        await sw.dispatch('activate');
        online.on = false; // jaringan putus
        const page = await sw.dispatch('fetch', get('./', 'navigate'));
        assert.equal(await page.text(), 'v1:index.html', 'navigasi ke akar dilayani index.html dari cache');
        const withQuery = await sw.dispatch('fetch', get('index.html?selftest', 'navigate'));
        assert.equal(await withQuery.text(), 'v1:index.html');
        for (const a of assets.filter((x) => x !== './')) {
          const res = await sw.dispatch('fetch', get(a));
          assert.equal(await res.text(), `v1:${a}`, `${a} tidak tersedia offline`);
        }
        const pack = await sw.dispatch('fetch', get('packs/demo/pack.json?x=1'));
        assert.equal(await pack.text(), 'v1:packs/demo/pack.json');
        await assert.rejects(() => sw.dispatch('fetch', get('docs/SPEC.md')), /offline/, 'berkas di luar cache tetap butuh jaringan');
        assert.equal(await sw.dispatch('fetch', { request: { url: 'https://cdn.lain.test/x.js', method: 'GET', mode: 'cors' } }), null, 'permintaan origin lain tidak disentuh');
      },
    },
    {
      id: 'TS-21',
      name: 'versi baru saat sesi berjalan: tidak diperbarui sampai sesi selesai',
      run: async () => {
        // Sisi halaman: tawaran "Versi baru tersedia" tidak tampil selama ada sesi aktif atau di ruang ujian.
        assert.equal(updateDecision({ waiting: true, activeSession: true, screen: 'home' }).show, false);
        assert.equal(updateDecision({ waiting: true, activeSession: false, screen: 'exam' }).show, false);
        assert.equal(updateDecision({ waiting: false, activeSession: false, screen: 'home' }).show, false);
        assert.equal(updateDecision({ waiting: true, activeSession: false, screen: 'results' }).show, true);

        // Sisi service worker: versi baru tidak memaksa diri aktif (tanpa skipWaiting saat install).
        const { source } = await buildServiceWorker(loadText);
        const v2source = source.replace(/const VERSION = "([^"]+)";/, 'const VERSION = "$1-baru";');
        const shared = { on: true };
        const sw1 = swHarness(source, server('v1', shared));
        await sw1.dispatch('install');
        await sw1.dispatch('activate');
        // Ujian dimulai: halaman mengunci versi yang sedang melayani.
        await sw1.dispatch('message', { data: { type: 'SESSION_LOCK' } });

        // Versi baru dipasang dan (misalnya karena aplikasi ditutup) menjadi aktif.
        const sw2 = swHarness(v2source, server('v2', shared));
        sw2.store.clear();
        for (const [k, v] of sw1.store) sw2.store.set(k, v); // cache bersama satu origin
        await sw2.dispatch('install');
        assert.equal(sw2.self.skipped, false, 'versi baru tidak boleh skipWaiting sendiri');
        await sw2.dispatch('activate');
        const during = await sw2.dispatch('fetch', get('js/main.js'));
        assert.equal(await during.text(), 'v1:js/main.js', 'selama sesi, versi lama tetap dilayani');
        assert.ok(await sw2.caches.has(source.match(/const VERSION = "([^"]+)"/)[1]), 'cache versi lama dipertahankan');

        // Ujian selesai: kunci dilepas, versi baru dipakai, cache lama dibuang.
        await sw2.dispatch('message', { data: { type: 'SESSION_UNLOCK' } });
        const after = await sw2.dispatch('fetch', get('js/main.js'));
        assert.equal(await after.text(), 'v2:js/main.js');
        assert.ok(!(await sw2.caches.has(source.match(/const VERSION = "([^"]+)"/)[1])), 'cache lama dihapus');
        // Pembaruan atas pilihan pengguna (di luar ujian).
        await sw2.dispatch('message', { data: { type: 'SKIP_WAITING' } });
        assert.equal(sw2.self.skipped, true);
      },
    },
    {
      name: 'deteksi iOS/iPadOS, Layar Utama, ajakan pemasangan, dan SEB',
      run: () => {
        const iphone = { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1', platform: 'iPhone', maxTouchPoints: 5 };
        const ipad = { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.5 Safari/605.1.15', platform: 'MacIntel', maxTouchPoints: 5 };
        const mac = { ...ipad, maxTouchPoints: 0 };
        const win = { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0 Safari/537.36', platform: 'Win32', maxTouchPoints: 0 };
        assert.deepEqual([iphone, ipad, mac, win].map((n) => isIOS(n)), [true, true, false, false]);
        assert.equal(isStandalone({ matchMedia: () => ({ matches: false }), navigator: { standalone: true } }), true);
        assert.equal(isStandalone({ matchMedia: () => ({ matches: true }), navigator: {} }), true);
        assert.equal(isStandalone({ matchMedia: () => ({ matches: false }), navigator: {} }), false);
        const now = Date.parse('2026-10-17T00:00:00Z');
        assert.equal(shouldShowInstallPrompt({ ios: true, standalone: false, dismissedAt: null, now }), true);
        assert.equal(shouldShowInstallPrompt({ ios: true, standalone: true, dismissedAt: null, now }), false);
        assert.equal(shouldShowInstallPrompt({ ios: false, standalone: false, dismissedAt: null, now }), false);
        assert.equal(shouldShowInstallPrompt({ ios: true, standalone: false, dismissedAt: now - 1000, now }), false);
        assert.equal(shouldShowInstallPrompt({ ios: true, standalone: false, dismissedAt: now - INSTALL_SNOOZE_MS - 1, now }), true);
        assert.equal(isSEB(`${win.userAgent} SEB/3.8.0`), true);
        assert.equal(isSEB(`${iphone.userAgent} SEB/3.4`), true);
        assert.equal(isSEB(win.userAgent), false);
        assert.equal(isSEB('Mozilla/5.0 SEBASTIAN'), false);
      },
    },
    {
      name: 'dist/simulator-offline.html sinkron, satu berkas tanpa modul atau aset luar',
      run: async () => {
        const html = await buildOfflineHtml(loadText);
        assert.equal(await loadText('dist/simulator-offline.html'), html, 'dist tidak sinkron; jalankan node tools/build-offline.mjs');
        assert.ok(!/<script[^>]+src=/i.test(html) && !/<link[^>]+stylesheet/i.test(html) && !/type="module"/.test(html), 'tidak boleh memuat berkas luar');
        assert.ok(html.includes('window.CA_SIM_PACKS["demo"]'), 'pack tertanam');
        const { order } = await moduleGraph(loadText);
        for (const p of order) assert.ok(html.includes(`__define(${JSON.stringify(p)}`), `${p} tidak tergabung`);
        const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
        for (const s of scripts) assert.ok(!/^\s*(import|export)\s/m.test(s), 'masih ada import/export');
        if (isNode) new Function(scripts.at(-1).replace("__require('js/main.js');", '')); // sintaks valid
      },
    },
    {
      browserOnly: true,
      name: 'versi satu berkas berjalan: beranda tampil dengan pack tertanam (iframe)',
      run: async () => {
        const html = await loadText('dist/simulator-offline.html');
        const frame = document.createElement('iframe');
        frame.style.cssText = 'position:absolute;left:-9999px;width:800px;height:600px';
        frame.srcdoc = html;
        document.body.append(frame);
        try {
          let text = '';
          for (let i = 0; i < 40 && !text.includes('MULAI'); i++) {
            await new Promise((r) => setTimeout(r, 100));
            text = frame.contentDocument && frame.contentDocument.body ? frame.contentDocument.body.innerText : '';
          }
          assert.ok(text.includes('MULAI') && text.includes('Training 1 (Demo)'), `beranda tidak tampil: ${text.slice(0, 200)}`);
        } finally {
          frame.remove();
        }
      },
    },
  ],
};
