// Penulis .docx minimal (SPEC 11): [Content_Types].xml, _rels/.rels,
// word/document.xml, word/styles.xml (Heading 1-3, tabel ber-border),
// word/_rels/document.xml.rels (relasi ke styles), docProps/core.xml.
// Masukan berupa daftar blok sederhana; semua teks di-escape.
//
// Blok: { type: 'title' | 'subtitle' | 'heading' (level 1-3) | 'paragraph' | 'bullets'
//         | 'table' | 'pageBreak', ... }
//   paragraph: { text } atau { runs: [{ text, bold, italic, color }] }, opsi bold/italic/small/muted
//   bullets:   { items: [teks] }
//   table:     { columns: [{ header, width }], rows: [[sel]] }; sel = teks/angka atau
//              { text, bold, fill }. width = bobot relatif.

import { zipStore } from './zip.js';
import { XML_HEADER, cleanText, escapeXml } from './xml.js';

const W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const R_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const PAGE_WIDTH_TWIPS = 9638; // A4 dengan margin 2 cm
const MUTED = '555E6B';

export const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

function run({ text, bold, italic, color, size }) {
  const props = [
    bold ? '<w:b/><w:bCs/>' : '',
    italic ? '<w:i/><w:iCs/>' : '',
    color ? `<w:color w:val="${color}"/>` : '',
    size ? `<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>` : '',
  ].join('');
  const rPr = props ? `<w:rPr>${props}</w:rPr>` : '';
  const lines = cleanText(text).split('\n');
  const body = lines.map((line, i) => `${i ? '<w:br/>' : ''}${line.split('\t')
    .map((part) => `<w:t xml:space="preserve">${escapeXml(part)}</w:t>`).join('<w:tab/>')}`).join('');
  return `<w:r>${rPr}${body}</w:r>`;
}

function paragraph(runs, { style, keepNext, spacingAfter } = {}) {
  const pPr = [
    style ? `<w:pStyle w:val="${style}"/>` : '',
    keepNext ? '<w:keepNext/>' : '',
    spacingAfter !== undefined ? `<w:spacing w:after="${spacingAfter}"/>` : '',
  ].join('');
  return `<w:p>${pPr ? `<w:pPr>${pPr}</w:pPr>` : ''}${runs.map(run).join('')}</w:p>`;
}

const TABLE_TEXT_SIZE = 19; // 9,5 pt

function cellXml(cell, width, header, keepNext) {
  const c = cell !== null && typeof cell === 'object' ? cell : { text: cell };
  const text = c.text === null || c.text === undefined ? '' : String(c.text);
  const fill = header ? 'E7ECF3' : c.fill;
  const tcPr = `<w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${fill ? `<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/>` : ''}</w:tcPr>`;
  return `<w:tc>${tcPr}${paragraph([{ text, bold: header || c.bold, color: c.color, size: TABLE_TEXT_SIZE }], { spacingAfter: 0, keepNext })}</w:tc>`;
}

// Lebar kolom (twips) sebanding bobot, tetapi tidak lebih sempit dari kata terpanjang
// pada judul kolom (judul seperti "Sebelum" tidak terpotong menjadi "Sebelu/m").
export function columnWidths(columns, total = PAGE_WIDTH_TWIPS) {
  const weights = columns.map((c) => c.width || 1);
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const min = columns.map((c) => Math.max(600, ...String(c.header).split(/\s+/).map((w) => w.length * 115 + 260)));
  let widths = weights.map((w) => (w / weightSum) * total);
  for (let pass = 0; pass < 6; pass++) {
    const deficit = widths.reduce((n, w, i) => n + Math.max(0, min[i] - w), 0);
    if (deficit < 1) break;
    const spare = widths.map((w, i) => Math.max(0, w - min[i]));
    const spareSum = spare.reduce((a, b) => a + b, 0);
    if (spareSum <= 0) break;
    widths = widths.map((w, i) => (w < min[i] ? min[i] : w - (deficit * spare[i]) / spareSum));
  }
  return widths.map((w) => Math.floor(w));
}

// keepTogether: setiap baris (kecuali terakhir) "keep with next" agar tabel pendek
// seperti opsi A-D dan rubrik tidak terbelah antarhalaman (cantSplit saja tidak cukup).
function table({ columns, rows, keepTogether = false }) {
  const widths = columnWidths(columns);
  const border = (side) => `<w:${side} w:val="single" w:sz="4" w:space="0" w:color="8C96A3"/>`;
  const tblPr = '<w:tblPr><w:tblStyle w:val="TableGrid"/>'
    + `<w:tblW w:w="${widths.reduce((a, b) => a + b, 0)}" w:type="dxa"/>`
    + `<w:tblBorders>${['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(border).join('')}</w:tblBorders>`
    + '<w:tblLayout w:type="fixed"/>'
    + '<w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>'
    + '</w:tblPr>';
  const grid = `<w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>`;
  // Baris judul selalu ditahan bersama baris pertama agar tidak tertinggal sendirian di akhir halaman.
  const head = `<w:tr><w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>${columns.map((c, i) => cellXml(c.header, widths[i], true, rows.length > 0)).join('')}</w:tr>`;
  const body = rows.map((row, r) => {
    const keep = keepTogether && r < rows.length - 1;
    return `<w:tr><w:trPr><w:cantSplit/></w:trPr>${columns.map((_, i) => cellXml(row[i] ?? '', widths[i], false, keep)).join('')}</w:tr>`;
  }).join('');
  // Paragraf kosong setelah tabel: tabel berurutan tidak menyatu dan dokumen tidak berakhir dengan tabel.
  return `<w:tbl>${tblPr}${grid}${head}${body}</w:tbl>${paragraph([], { spacingAfter: 120 })}`;
}

function blockXml(block) {
  switch (block.type) {
    case 'title': return paragraph([{ text: block.text }], { style: 'Title' });
    case 'subtitle': return paragraph([{ text: block.text }], { style: 'Subtitle' });
    case 'heading': return paragraph([{ text: block.text }], { style: `Heading${block.level || 1}` });
    case 'paragraph': {
      const runs = block.runs || [{ text: block.text, bold: block.bold, italic: block.italic }];
      const style = block.small ? 'Kecil' : undefined;
      return paragraph(runs.map((r) => ({ ...r, color: r.color || (block.muted ? MUTED : undefined) })), { style, keepNext: block.keepNext });
    }
    case 'bullets': return block.items.map((item) => paragraph([{ text: `•\t${item}` }], { style: 'Butir' })).join('');
    case 'table': return table(block);
    case 'pageBreak': return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
    default: throw new Error(`Blok docx tidak dikenal: ${block.type}`);
  }
}

export function documentXml(blocks, { footer = false } = {}) {
  return `${XML_HEADER}<w:document xmlns:w="${W_NS}" xmlns:r="${R_NS}"><w:body>${blocks.map(blockXml).join('')}`
    + `<w:sectPr>${footer ? '<w:footerReference w:type="default" r:id="rId2"/>' : ''}<w:pgSz w:w="11906" w:h="16838"/>`
    + '<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/>'
    + '</w:sectPr></w:body></w:document>';
}

function heading(id, name, level, size, color, before) {
  return `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/>`
    + '<w:uiPriority w:val="9"/><w:qFormat/>'
    + `<w:pPr><w:keepNext/><w:keepLines/><w:spacing w:before="${before}" w:after="120"/><w:outlineLvl w:val="${level - 1}"/></w:pPr>`
    + `<w:rPr><w:b/><w:bCs/><w:color w:val="${color}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr></w:style>`;
}

export function stylesXml() {
  const border = (side) => `<w:${side} w:val="single" w:sz="4" w:space="0" w:color="8C96A3"/>`;
  return `${XML_HEADER}<w:styles xmlns:w="${W_NS}">`
    + '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Calibri" w:cs="Calibri"/>'
    + '<w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="id-ID" w:eastAsia="en-US" w:bidi="ar-SA"/></w:rPr></w:rPrDefault>'
    + '<w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>'
    + '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>'
    + '<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="10"/><w:qFormat/>'
    + '<w:pPr><w:spacing w:before="2400" w:after="240"/></w:pPr><w:rPr><w:b/><w:bCs/><w:color w:val="1D4ED8"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr></w:style>'
    + '<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="11"/><w:qFormat/>'
    + '<w:pPr><w:spacing w:after="360"/></w:pPr><w:rPr><w:color w:val="555E6B"/><w:sz w:val="30"/><w:szCs w:val="30"/></w:rPr></w:style>'
    + heading('Heading1', 'heading 1', 1, 32, '1D4ED8', 360)
    + heading('Heading2', 'heading 2', 2, 27, '1B1F24', 280)
    + heading('Heading3', 'heading 3', 3, 23, '1B1F24', 200)
    + '<w:style w:type="paragraph" w:customStyle="1" w:styleId="Kecil"><w:name w:val="Kecil"/><w:basedOn w:val="Normal"/><w:qFormat/>'
    + '<w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style>'
    + '<w:style w:type="paragraph" w:customStyle="1" w:styleId="Butir"><w:name w:val="Butir"/><w:basedOn w:val="Normal"/><w:qFormat/>'
    + '<w:pPr><w:tabs><w:tab w:val="left" w:pos="360"/></w:tabs><w:spacing w:after="60"/><w:ind w:left="360" w:hanging="360"/></w:pPr></w:style>'
    + '<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/>'
    + '<w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/>'
    + '<w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>'
    + '<w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:basedOn w:val="TableNormal"/><w:uiPriority w:val="39"/>'
    + '<w:pPr><w:spacing w:before="40" w:after="40" w:line="240" w:lineRule="auto"/></w:pPr>'
    + `<w:tblPr><w:tblBorders>${['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(border).join('')}</w:tblBorders></w:tblPr></w:style>`
    + '</w:styles>';
}

export function corePropsXml({ title, created }) {
  const at = (created || new Date()).toISOString().replace(/\.\d{3}Z$/, 'Z');
  return `${XML_HEADER}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" `
    + 'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" '
    + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
    + `<dc:title>${escapeXml(title || '')}</dc:title><dc:creator>Simulator Ujian CA</dc:creator><dc:language>id-ID</dc:language>`
    + `<dcterms:created xsi:type="dcterms:W3CDTF">${at}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${at}</dcterms:modified>`
    + '</cp:coreProperties>';
}

const REL_NS = 'http://schemas.openxmlformats.org/package/2006/relationships';
const REL_TYPE = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

export function rootRelsXml(mainPart) {
  return `${XML_HEADER}<Relationships xmlns="${REL_NS}">`
    + `<Relationship Id="rId1" Type="${REL_TYPE}/officeDocument" Target="${mainPart}"/>`
    + '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
    + '</Relationships>';
}

// Daftar entri wajib (dipakai tes TS-15).
export const DOCX_PARTS = ['[Content_Types].xml', '_rels/.rels', 'word/document.xml', 'word/styles.xml', 'word/_rels/document.xml.rels', 'docProps/core.xml'];

// Footer: teks bebas lalu "Halaman X dari Y" (field PAGE dan NUMPAGES).
export function footerXml(text) {
  const r = (t) => `<w:r><w:rPr><w:color w:val="${MUTED}"/><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr><w:t xml:space="preserve">${escapeXml(t)}</w:t></w:r>`;
  const field = (instr) => `<w:fldSimple w:instr=" ${instr} ">${r('1')}</w:fldSimple>`;
  return `${XML_HEADER}<w:ftr xmlns:w="${W_NS}" xmlns:r="${R_NS}"><w:p><w:pPr><w:jc w:val="center"/></w:pPr>`
    + `${r(`${text ? `${text} · ` : ''}Halaman `)}${field('PAGE')}${r(' dari ')}${field('NUMPAGES')}</w:p></w:ftr>`;
}

// options.footer: teks footer (mis. judul dan ID sesi); bila diisi, word/footer1.xml dibuat.
export function docxFiles(blocks, { title, created, footer } = {}) {
  const hasFooter = typeof footer === 'string';
  return [
    {
      name: '[Content_Types].xml',
      data: `${XML_HEADER}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`
        + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        + '<Default Extension="xml" ContentType="application/xml"/>'
        + '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
        + '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
        + (hasFooter ? '<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>' : '')
        + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
        + '</Types>',
    },
    { name: '_rels/.rels', data: rootRelsXml('word/document.xml') },
    { name: 'word/document.xml', data: documentXml(blocks, { footer: hasFooter }) },
    { name: 'word/styles.xml', data: stylesXml() },
    ...(hasFooter ? [{ name: 'word/footer1.xml', data: footerXml(footer) }] : []),
    {
      name: 'word/_rels/document.xml.rels',
      data: `${XML_HEADER}<Relationships xmlns="${REL_NS}"><Relationship Id="rId1" Type="${REL_TYPE}/styles" Target="styles.xml"/>`
        + `${hasFooter ? `<Relationship Id="rId2" Type="${REL_TYPE}/footer" Target="footer1.xml"/>` : ''}</Relationships>`,
    },
    { name: 'docProps/core.xml', data: corePropsXml({ title, created }) },
  ];
}

export function buildDocx(blocks, options = {}) {
  return zipStore(docxFiles(blocks, options), options.created);
}
