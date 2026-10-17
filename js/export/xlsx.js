// Penulis .xlsx minimal (SPEC 11): workbook, styles, satu worksheet per sheet
// dengan sel teks inlineStr, header tebal, freeze pane baris pertama, lebar kolom,
// dan angka sebagai number. Semua teks di-escape.
//
// sheet: { name, columns: [{ header, width, kind }], rows: [[nilai]] }
//   kind: 'text' (rata atas), 'wrap' (teks panjang dibungkus), 'number' (0,00), 'int' (0)
//   nilai: string -> teks; number -> angka; boolean -> "Ya"/"Tidak"; null/undefined -> kosong.

import { zipStore } from './zip.js';
import { corePropsXml, rootRelsXml } from './docx.js';
import { XML_HEADER, cleanText, escapeXml } from './xml.js';

const MAIN_NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const R_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const REL_NS = 'http://schemas.openxmlformats.org/package/2006/relationships';
// Batas Excel untuk satu sel teks.
export const MAX_CELL_CHARS = 32767;
const TRUNCATED = ' … [dipotong: batas 32.767 karakter per sel Excel; teks utuh ada di laporan Word/HTML]';

export const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// Indeks gaya sel di cellXfs.
const STYLE = { header: 1, number: 2, wrap: 3, int: 4, text: 5 };

export function columnLetter(index) {
  let n = index + 1;
  let s = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

// Nama sheet: maks 31 karakter, tanpa : \ / ? * [ ], unik.
export function sheetNames(names) {
  const used = new Set();
  return names.map((raw) => {
    const base = (cleanText(raw).replace(/[:\\/?*[\]]/g, ' ').trim() || 'Sheet').slice(0, 31);
    let name = base;
    for (let i = 2; used.has(name.toLowerCase()); i++) name = `${base.slice(0, 31 - String(i).length - 1)} ${i}`;
    used.add(name.toLowerCase());
    return name;
  });
}

function cellXml(ref, value, kind) {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '';
    const style = kind === 'int' ? STYLE.int : STYLE.number;
    return `<c r="${ref}" s="${style}"><v>${value}</v></c>`;
  }
  let text = typeof value === 'boolean' ? (value ? 'Ya' : 'Tidak') : cleanText(value);
  if (text.length > MAX_CELL_CHARS) text = text.slice(0, MAX_CELL_CHARS - TRUNCATED.length) + TRUNCATED;
  const style = kind === 'wrap' ? STYLE.wrap : STYLE.text;
  return `<c r="${ref}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(text)}</t></is></c>`;
}

export function worksheetXml(sheet, selected) {
  const cols = sheet.columns;
  const lastCol = columnLetter(Math.max(0, cols.length - 1));
  const lastRow = sheet.rows.length + 1;
  const header = `<row r="1">${cols.map((c, i) => {
    const ref = `${columnLetter(i)}1`;
    return `<c r="${ref}" s="${STYLE.header}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(c.header)}</t></is></c>`;
  }).join('')}</row>`;
  const body = sheet.rows.map((row, r) => {
    const n = r + 2;
    return `<row r="${n}">${cols.map((c, i) => cellXml(`${columnLetter(i)}${n}`, row[i], c.kind)).join('')}</row>`;
  }).join('');
  return `${XML_HEADER}<worksheet xmlns="${MAIN_NS}" xmlns:r="${R_NS}">`
    + `<dimension ref="A1:${lastCol}${lastRow}"/>`
    + `<sheetViews><sheetView workbookViewId="0"${selected ? ' tabSelected="1"' : ''}>`
    + '<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>'
    + '<selection pane="bottomLeft" activeCell="A2" sqref="A2"/></sheetView></sheetViews>'
    + '<sheetFormatPr defaultRowHeight="15"/>'
    + `<cols>${cols.map((c, i) => `<col min="${i + 1}" max="${i + 1}" width="${c.width || 12}" customWidth="1"/>`).join('')}</cols>`
    + `<sheetData>${header}${body}</sheetData>`
    + '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>'
    + '</worksheet>';
}

export function stylesXml() {
  const thin = (side) => `<${side} style="thin"><color rgb="FF8C96A3"/></${side}>`;
  return `${XML_HEADER}<styleSheet xmlns="${MAIN_NS}">`
    + '<fonts count="2"><font><sz val="11"/><name val="Calibri"/><family val="2"/></font>'
    + '<font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font></fonts>'
    + '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>'
    + '<fill><patternFill patternType="solid"><fgColor rgb="FFE7ECF3"/><bgColor indexed="64"/></patternFill></fill></fills>'
    + `<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border>${['left', 'right', 'top', 'bottom'].map(thin).join('')}<diagonal/></border></borders>`
    + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
    + '<cellXfs count="6">'
    + '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
    + '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>'
    + '<xf numFmtId="2" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment vertical="top"/></xf>'
    + '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>'
    + '<xf numFmtId="1" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment vertical="top"/></xf>'
    + '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top"/></xf>'
    + '</cellXfs>'
    + '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
    + '</styleSheet>';
}

export function xlsxFiles(sheets, { title, created } = {}) {
  const names = sheetNames(sheets.map((s) => s.name));
  const files = [
    {
      name: '[Content_Types].xml',
      data: `${XML_HEADER}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`
        + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        + '<Default Extension="xml" ContentType="application/xml"/>'
        + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
        + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
        + sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')
        + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
        + '</Types>',
    },
    { name: '_rels/.rels', data: rootRelsXml('xl/workbook.xml') },
    {
      name: 'xl/workbook.xml',
      data: `${XML_HEADER}<workbook xmlns="${MAIN_NS}" xmlns:r="${R_NS}"><bookViews><workbookView activeTab="0"/></bookViews><sheets>`
        + names.map((n, i) => `<sheet name="${escapeXml(n)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')
        + '</sheets></workbook>',
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      data: `${XML_HEADER}<Relationships xmlns="${REL_NS}">`
        + sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="${R_NS}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')
        + `<Relationship Id="rId${sheets.length + 1}" Type="${R_NS}/styles" Target="styles.xml"/>`
        + '</Relationships>',
    },
    { name: 'xl/styles.xml', data: stylesXml() },
    ...sheets.map((s, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, data: worksheetXml(s, i === 0) })),
    { name: 'docProps/core.xml', data: corePropsXml({ title, created }) },
  ];
  return files;
}

export function xlsxParts(sheetCount) {
  return ['[Content_Types].xml', '_rels/.rels', 'xl/workbook.xml', 'xl/_rels/workbook.xml.rels', 'xl/styles.xml',
    ...Array.from({ length: sheetCount }, (_, i) => `xl/worksheets/sheet${i + 1}.xml`), 'docProps/core.xml'];
}

export function buildXlsx(sheets, options = {}) {
  return zipStore(xlsxFiles(sheets, options), options.created);
}
