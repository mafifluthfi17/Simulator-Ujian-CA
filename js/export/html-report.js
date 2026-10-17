// Blok dokumen -> HTML satu berkas (CSS di dalam, tanpa skrip, tanpa aset luar).
// Dipakai untuk ekspor HTML (SPEC 11) dan fallback .doc berbasis HTML bila .docx gagal.
// Semua teks di-escape; tidak ada isi peserta/AI yang menjadi markup.

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

function inline(runs) {
  return runs.map((r) => {
    let s = escapeHtml(r.text);
    if (r.bold) s = `<strong>${s}</strong>`;
    if (r.italic) s = `<em>${s}</em>`;
    return s;
  }).join('');
}

function cell(tag, value) {
  const c = value !== null && typeof value === 'object' ? value : { text: value };
  const text = escapeHtml(c.text ?? '');
  const style = c.fill ? ` style="background:#${c.fill}"` : '';
  return `<${tag}${style}>${c.bold ? `<strong>${text}</strong>` : text}</${tag}>`;
}

export function blockHtml(block) {
  switch (block.type) {
    case 'title': return `<p class="title">${escapeHtml(block.text)}</p>`;
    case 'subtitle': return `<p class="subtitle">${escapeHtml(block.text)}</p>`;
    case 'heading': return `<h${block.level}>${escapeHtml(block.text)}</h${block.level}>`;
    case 'paragraph': {
      const cls = [block.small ? 'small' : '', block.muted ? 'muted' : ''].filter(Boolean).join(' ');
      const runs = block.runs || [{ text: block.text, bold: block.bold, italic: block.italic }];
      return `<p${cls ? ` class="${cls}"` : ''}>${inline(runs)}</p>`;
    }
    case 'bullets': return `<ul>${block.items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`;
    case 'table': return `<table><thead><tr>${block.columns.map((c) => cell('th', c.header)).join('')}</tr></thead>`
      + `<tbody>${block.rows.map((row) => `<tr>${block.columns.map((_, i) => cell('td', row[i] ?? '')).join('')}</tr>`).join('')}</tbody></table>`;
    case 'pageBreak': return '<hr class="page">';
    default: throw new Error(`Blok tidak dikenal: ${block.type}`);
  }
}

// forWord: menambah penanda agar Word membuka berkas sebagai dokumen (fallback .doc).
export function htmlDocument(blocks, { title, forWord = false } = {}) {
  const wordNs = forWord ? ' xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"' : '';
  return `<!doctype html>\n<html lang="id"${wordNs}>\n<head>\n<meta charset="utf-8">\n`
    + '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    + `<title>${escapeHtml(title || 'Laporan')}</title>\n<style>${CSS}</style>\n</head>\n<body>\n`
    + `${blocks.map(blockHtml).join('\n')}\n</body>\n</html>\n`;
}
