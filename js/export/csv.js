// Sheet -> CSV (fallback bila .xlsx gagal, SPEC 11): UTF-8 dengan BOM, pemisah
// titik koma, angka memakai koma desimal (Excel berlokal Indonesia membacanya
// sebagai angka). Beberapa sheet digabung menjadi bagian-bagian dalam satu berkas.

import { cleanText } from './xml.js';

function field(value) {
  if (value === null || value === undefined) return '';
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
    for (const row of sheet.rows) lines.push(sheet.columns.map((_, j) => field(row[j])).join(';'));
  });
  return `﻿${lines.join('\r\n')}\r\n`;
}
