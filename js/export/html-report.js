// Blok dokumen -> HTML satu berkas (CSS di dalam, tanpa skrip, tanpa aset luar).
// Dipakai untuk ekspor HTML (SPEC 11) dan fallback .doc berbasis HTML bila .docx gagal.
// Semua teks di-escape; tidak ada isi peserta/AI yang menjadi markup.
//
// Mode forWord (fallback .doc): Word tidak mendukung white-space: pre-wrap dan
// hr sebagai pemisah halaman, jadi setiap baris teks menjadi paragraf/<br> sendiri
// (baris kosong dipertahankan) dan pemisah halaman memakai page-break-before.

import { escapeHtml } from './xml.js';

const CSS = `
body{font:15px/1.55 Calibri,"Segoe UI",system-ui,-apple-system,Arial,sans-serif;color:#1b1f24;max-width:880px;margin:0 auto;padding:24px 16px 48px;background:#fff}
h1{font-size:1.55em;color:#1d4ed8;margin:1.6em 0 .5em;border-bottom:2px solid #dbe6ff;padding-bottom:.2em}
h2{font-size:1.25em;margin:1.3em 0 .4em}
h3{font-size:1.08em;margin:1.1em 0 .3em}
p{margin:.35em 0;white-space:pre-wrap;overflow-wrap:anywhere}
.title{font-size:2.2em;font-weight:700;color:#1d4ed8;margin:1.2em 0 .2em}
.subtitle{font-size:1.25em;color:#555e6b;margin:0 0 1em}
.small{font-size:.85em}.muted{color:#555e6b}
table{border-collapse:collapse;width:100%;margin:.4em 0 1em;font-size:.95em}
th,td{border:1px solid #8c96a3;padding:4px 6px;text-align:left;vertical-align:top;white-space:pre-wrap;overflow-wrap:anywhere}
th{background:#e7ecf3}
ul{margin:.3em 0 .8em;padding-left:1.4em}
li{white-space:pre-wrap}
hr.page{border:0;border-top:1px dashed #c9d0da;margin:2em 0}
@media print{body{padding:0;max-width:none}hr.page{break-after:page;border:0;margin:0}h1,h2,h3{break-after:avoid}tr{break-inside:avoid}}
`;

const WORD_PAGE_BREAK = '<br clear=all style="page-break-before:always">';

// Teks multi-baris: biasa apa adanya (CSS pre-wrap); untuk Word baris baru -> <br>.
function text(value, forWord) {
  const s = escapeHtml(value ?? '');
  return forWord ? s.split('\n').join('<br>') : s;
}

function inline(runs, forWord) {
  return runs.map((r) => {
    let s = text(r.text, forWord);
    if (r.bold) s = `<strong>${s}</strong>`;
    if (r.italic) s = `<em>${s}</em>`;
    return s;
  }).join('');
}

function cell(tag, value, forWord) {
  const c = value !== null && typeof value === 'object' ? value : { text: value };
  const body = text(c.text, forWord);
  const style = c.fill ? ` style="background:#${c.fill}"` : '';
  return `<${tag}${style}>${c.bold ? `<strong>${body}</strong>` : body}</${tag}>`;
}

// Paragraf untuk Word: satu <p> per baris; baris kosong menjadi <p>&nbsp;</p>.
function wordParagraphs(block, cls) {
  if (block.runs) return `<p${cls}>${inline(block.runs, true)}</p>`;
  const wrap = (s) => (block.bold ? `<strong>${s}</strong>` : s);
  const em = (s) => (block.italic ? `<em>${s}</em>` : s);
  return String(block.text ?? '').split('\n')
    .map((line) => `<p${cls}>${line.trim() ? em(wrap(escapeHtml(line))) : '&nbsp;'}</p>`).join('');
}

export function blockHtml(block, { forWord = false } = {}) {
  switch (block.type) {
    case 'title': return `<p class="title">${escapeHtml(block.text)}</p>`;
    case 'subtitle': return `<p class="subtitle">${escapeHtml(block.text)}</p>`;
    case 'heading': return `<h${block.level}>${escapeHtml(block.text)}</h${block.level}>`;
    case 'paragraph': {
      const cls = [block.small ? 'small' : '', block.muted ? 'muted' : ''].filter(Boolean).join(' ');
      const attr = cls ? ` class="${cls}"` : '';
      if (forWord) return wordParagraphs(block, attr);
      const runs = block.runs || [{ text: block.text, bold: block.bold, italic: block.italic }];
      return `<p${attr}>${inline(runs, false)}</p>`;
    }
    case 'bullets': return `<ul>${block.items.map((i) => `<li>${text(i, forWord)}</li>`).join('')}</ul>`;
    case 'table': return `<table><thead><tr>${block.columns.map((c) => cell('th', c.header, forWord)).join('')}</tr></thead>`
      + `<tbody>${block.rows.map((row) => `<tr>${block.columns.map((_, i) => cell('td', row[i] ?? '', forWord)).join('')}</tr>`).join('')}</tbody></table>`;
    case 'pageBreak': return forWord ? WORD_PAGE_BREAK : '<hr class="page">';
    default: throw new Error(`Blok tidak dikenal: ${block.type}`);
  }
}

// forWord: menambah penanda agar Word membuka berkas sebagai dokumen (fallback .doc).
export function htmlDocument(blocks, { title, forWord = false } = {}) {
  const wordNs = forWord ? ' xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"' : '';
  // Word membaca encoding dari meta http-equiv (bukan <meta charset>); tanpanya Word
  // dapat menampilkan dialog pilihan encoding saat membuka .doc.
  const charset = forWord ? '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n' : '<meta charset="utf-8">\n';
  return `<!doctype html>\n<html lang="id"${wordNs}>\n<head>\n${charset}`
    + '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    + `<title>${escapeHtml(title || 'Laporan')}</title>\n<style>${CSS}</style>\n</head>\n<body>\n`
    + `${blocks.map((b) => blockHtml(b, { forWord })).join('\n')}\n</body>\n</html>\n`;
}
