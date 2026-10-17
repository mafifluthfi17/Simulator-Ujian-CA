// Sheet -> CSV (fallback bila .xlsx gagal, SPEC 11): UTF-8 dengan BOM, pemisah
// titik koma, angka memakai koma desimal (Excel berlokal Indonesia membacanya
// sebagai angka). Beberapa sheet digabung menjadi bagian-bagian dalam satu berkas.

import { cleanText } from './xml.js';
import { formatDateTime } from '../core/format.js';

// Sel berformat dari report-sheets.js: persen dan tanggal ditulis sebagai teks Indonesia.
function field(raw, kind) {
  const cell = raw !== null && typeof raw === 'object' ? raw : { value: raw };
  const value = cell.value;
  const format = cell.format || kind;
  if (value === null || value === undefined) return '';
  if (format === 'percent' && typeof value === 'number') return `${String(Math.round(value * 10000) / 100).replace('.', ',')}%`;
  if (format === 'date' && typeof value === 'string') return plain(formatDateTime(value));
  return plain(value);
}

function plain(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? String(value).replace('.', ',') : '';
  if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak';
  const s = cleanText(value);
  return /[;"\n\r]/.test(s) || /^\s|\s$/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function sheetsToCsv(sheets) {
  const lines = [];
  sheets.forEach((sheet, i) => {
    if (i) lines.push('');
    if (sheets.length > 1) lines.push(field(`== ${sheet.name} ==`));
    lines.push(sheet.columns.map((c) => field(c.header)).join(';'));
    for (const row of sheet.rows) lines.push(sheet.columns.map((c, j) => field(row[j], c.kind)).join(';'));
  });
  return `﻿${lines.join('\r\n')}\r\n`;
}
