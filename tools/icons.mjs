// Ikon aplikasi buatan sendiri (SPEC 2): lembar soal putih dengan tanda centang di
// latar biru penuh (aman untuk ikon "maskable": isi berada di lingkaran 80% tengah).
// Rasterisasi dan encoder PNG dalam JavaScript murni (deflate STORE + CRC-32 +
// Adler-32), tanpa pustaka; dipakai tools/build-icons.mjs di Node maupun browser.

import { crc32 } from '../js/export/zip.js';

const BG = [29, 78, 216];
const PAPER = [255, 255, 255];
const LINE = [201, 208, 218];
const CHECK = [234, 138, 26];

const SHAPES = [
  { kind: 'roundRect', x0: 0.27, y0: 0.2, x1: 0.73, y1: 0.8, r: 0.05, color: PAPER },
  { kind: 'roundRect', x0: 0.34, y0: 0.29, x1: 0.58, y1: 0.325, r: 0.017, color: LINE },
  { kind: 'roundRect', x0: 0.34, y0: 0.37, x1: 0.66, y1: 0.405, r: 0.017, color: LINE },
  { kind: 'polyline', points: [[0.37, 0.6], [0.46, 0.69], [0.65, 0.48]], width: 0.065, color: CHECK },
];

function inRoundRect(x, y, s) {
  if (x < s.x0 || x > s.x1 || y < s.y0 || y > s.y1) return false;
  const cx = Math.min(Math.max(x, s.x0 + s.r), s.x1 - s.r);
  const cy = Math.min(Math.max(y, s.y0 + s.r), s.y1 - s.r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= s.r ** 2;
}

function distToSegment(x, y, [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
}

function inShape(x, y, s) {
  if (s.kind === 'roundRect') return inRoundRect(x, y, s);
  for (let i = 1; i < s.points.length; i++) {
    if (distToSegment(x, y, s.points[i - 1], s.points[i]) <= s.width / 2) return true;
  }
  return false;
}

// Piksel RGBA ukuran size x size dengan antialias 4x4 sampel per piksel.
export function rasterIcon(size) {
  const px = new Uint8Array(size * size * 4);
  const N = 4;
  for (let py = 0; py < size; py++) {
    for (let pxi = 0; pxi < size; pxi++) {
      const acc = [0, 0, 0];
      for (let sy = 0; sy < N; sy++) {
        for (let sx = 0; sx < N; sx++) {
          const x = (pxi + (sx + 0.5) / N) / size;
          const y = (py + (sy + 0.5) / N) / size;
          let color = BG;
          for (const s of SHAPES) if (inShape(x, y, s)) color = s.color;
          acc[0] += color[0]; acc[1] += color[1]; acc[2] += color[2];
        }
      }
      const o = (py * size + pxi) * 4;
      px[o] = Math.round(acc[0] / (N * N));
      px[o + 1] = Math.round(acc[1] / (N * N));
      px[o + 2] = Math.round(acc[2] / (N * N));
      px[o + 3] = 255;
    }
  }
  return px;
}

function adler32(bytes) {
  let a = 1;
  let b = 0;
  for (let i = 0; i < bytes.length; i++) {
    a = (a + bytes[i]) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}

// zlib tanpa kompresi (blok STORE maks 65535 byte); cadangan bila CompressionStream tidak ada.
function zlibStore(data) {
  const blocks = Math.max(1, Math.ceil(data.length / 65535));
  const out = new Uint8Array(2 + data.length + blocks * 5 + 4);
  out[0] = 0x78;
  out[1] = 0x01;
  let p = 2;
  for (let i = 0; i < blocks; i++) {
    const chunk = data.subarray(i * 65535, Math.min(data.length, (i + 1) * 65535));
    out[p] = i === blocks - 1 ? 1 : 0;
    out[p + 1] = chunk.length & 0xff;
    out[p + 2] = chunk.length >>> 8;
    out[p + 3] = ~chunk.length & 0xff;
    out[p + 4] = (~chunk.length >>> 8) & 0xff;
    out.set(chunk, p + 5);
    p += 5 + chunk.length;
  }
  new DataView(out.buffer).setUint32(p, adler32(data));
  return out;
}

function chunk(type, data) {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

// Data baris PNG (byte filter 0 + RGBA per baris), juga dipakai tes untuk membandingkan piksel.
export function pngRows(size, rgba) {
  const raw = new Uint8Array(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) raw.set(rgba.subarray(y * size * 4, (y + 1) * size * 4), y * (size * 4 + 1) + 1);
  return raw;
}

async function zlib(data) {
  if (typeof CompressionStream === 'undefined') return zlibStore(data);
  const stream = new Blob([data]).stream().pipeThrough(new CompressionStream('deflate'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function encodePng(size, rgba) {
  const raw = pngRows(size, rgba);
  const ihdr = new Uint8Array(13);
  const v = new DataView(ihdr.buffer);
  v.setUint32(0, size);
  v.setUint32(4, size);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const parts = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', await zlib(raw)), chunk('IEND', new Uint8Array(0))];
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

export async function iconPng(size) {
  return encodePng(size, rasterIcon(size));
}

const hex = (c) => `#${c.map((n) => n.toString(16).padStart(2, '0')).join('')}`;

// Versi SVG (favicon) dengan bentuk yang sama.
export function iconSvg() {
  const u = (n) => +(n * 100).toFixed(2);
  const parts = SHAPES.map((s) => (s.kind === 'roundRect'
    ? `<rect x="${u(s.x0)}" y="${u(s.y0)}" width="${u(s.x1 - s.x0)}" height="${u(s.y1 - s.y0)}" rx="${u(s.r)}" fill="${hex(s.color)}"/>`
    : `<polyline points="${s.points.map(([x, y]) => `${u(x)},${u(y)}`).join(' ')}" fill="none" stroke="${hex(s.color)}" stroke-width="${u(s.width)}" stroke-linecap="round" stroke-linejoin="round"/>`));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="${hex(BG)}"/>${parts.join('')}</svg>\n`;
}

// Berkas ikon yang dibuat: [{ path, data }].
export const PNG_ICONS = [['icons/icon-192.png', 192], ['icons/icon-512.png', 512], ['icons/apple-touch-icon.png', 180]];

export async function iconFiles() {
  return [
    ...await Promise.all(PNG_ICONS.map(async ([path, size]) => ({ path, data: await iconPng(size) }))),
    { path: 'icons/icon.svg', data: iconSvg() },
  ];
}
