// Penulis ZIP minimal (metode STORE, tanpa kompresi) + CRC-32 dalam JavaScript
// murni (SPEC 11). Dipakai untuk .docx dan .xlsx. readZip() membaca kembali
// arsip buatan sendiri untuk tes (memeriksa tanda tangan, CRC, dan daftar entri).

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

const encoder = new TextEncoder();
export const toBytes = (data) => (typeof data === 'string' ? encoder.encode(data) : data);

// Tanggal/waktu format DOS (waktu lokal), sesuai yang diharapkan pembaca ZIP.
function dosDateTime(date) {
  const year = Math.max(1980, date.getFullYear());
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

// files: [{ name, data: string | Uint8Array }] -> Uint8Array. Nama berkas UTF-8 (flag bit 11).
export function zipStore(files, date = new Date()) {
  const { time, date: day } = dosDateTime(date);
  const entries = files.map((f) => {
    const name = encoder.encode(f.name);
    const data = toBytes(f.data);
    return { name, data, crc: crc32(data) };
  });
  const localSize = entries.reduce((n, e) => n + 30 + e.name.length + e.data.length, 0);
  const centralSize = entries.reduce((n, e) => n + 46 + e.name.length, 0);
  const out = new Uint8Array(localSize + centralSize + 22);
  const view = new DataView(out.buffer);
  let p = 0;
  const offsets = [];
  for (const e of entries) {
    offsets.push(p);
    view.setUint32(p, 0x04034b50, true);
    view.setUint16(p + 4, 20, true); // versi yang dibutuhkan
    view.setUint16(p + 6, 0x0800, true); // nama UTF-8
    view.setUint16(p + 8, 0, true); // STORE
    view.setUint16(p + 10, time, true);
    view.setUint16(p + 12, day, true);
    view.setUint32(p + 14, e.crc, true);
    view.setUint32(p + 18, e.data.length, true);
    view.setUint32(p + 22, e.data.length, true);
    view.setUint16(p + 26, e.name.length, true);
    view.setUint16(p + 28, 0, true);
    out.set(e.name, p + 30);
    out.set(e.data, p + 30 + e.name.length);
    p += 30 + e.name.length + e.data.length;
  }
  const centralStart = p;
  entries.forEach((e, i) => {
    view.setUint32(p, 0x02014b50, true);
    view.setUint16(p + 4, 20, true); // dibuat oleh
    view.setUint16(p + 6, 20, true);
    view.setUint16(p + 8, 0x0800, true);
    view.setUint16(p + 10, 0, true);
    view.setUint16(p + 12, time, true);
    view.setUint16(p + 14, day, true);
    view.setUint32(p + 16, e.crc, true);
    view.setUint32(p + 20, e.data.length, true);
    view.setUint32(p + 24, e.data.length, true);
    view.setUint16(p + 28, e.name.length, true);
    // komentar, disk, atribut internal/eksternal = 0
    view.setUint32(p + 42, offsets[i], true);
    out.set(e.name, p + 46);
    p += 46 + e.name.length;
  });
  view.setUint32(p, 0x06054b50, true);
  view.setUint16(p + 8, entries.length, true);
  view.setUint16(p + 10, entries.length, true);
  view.setUint32(p + 12, p - centralStart, true);
  view.setUint32(p + 16, centralStart, true);
  return out;
}

// Membaca arsip STORE: { entries: [{ name, data }] }. Melempar Error bila struktur atau CRC salah.
export function readZip(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const decoder = new TextDecoder('utf-8', { fatal: true });
  const eocd = bytes.length - 22;
  if (eocd < 0 || view.getUint32(eocd, true) !== 0x06054b50) throw new Error('akhir direktori pusat ZIP tidak ditemukan');
  const count = view.getUint16(eocd + 10, true);
  const centralSize = view.getUint32(eocd + 12, true);
  let p = view.getUint32(eocd + 16, true);
  if (p + centralSize !== eocd) throw new Error('ukuran direktori pusat tidak cocok');
  const entries = [];
  for (let i = 0; i < count; i++) {
    if (view.getUint32(p, true) !== 0x02014b50) throw new Error(`entri pusat ${i} rusak`);
    const method = view.getUint16(p + 10, true);
    const crc = view.getUint32(p + 16, true);
    const size = view.getUint32(p + 20, true);
    const nameLen = view.getUint16(p + 28, true);
    const extraLen = view.getUint16(p + 30, true);
    const commentLen = view.getUint16(p + 32, true);
    const offset = view.getUint32(p + 42, true);
    const name = decoder.decode(bytes.subarray(p + 46, p + 46 + nameLen));
    if (method !== 0) throw new Error(`${name}: metode kompresi ${method} tidak didukung`);
    if (view.getUint32(offset, true) !== 0x04034b50) throw new Error(`${name}: header lokal rusak`);
    if (view.getUint32(offset + 14, true) !== crc) throw new Error(`${name}: CRC header lokal berbeda`);
    const localName = view.getUint16(offset + 26, true);
    const localExtra = view.getUint16(offset + 28, true);
    const start = offset + 30 + localName + localExtra;
    const data = bytes.subarray(start, start + size);
    if (crc32(data) !== crc) throw new Error(`${name}: CRC-32 tidak cocok`);
    entries.push({ name, data });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return { entries };
}
