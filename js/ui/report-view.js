// Merender blok laporan (js/export/report-blocks.js) ke DOM dengan h() (textContent),
// sehingga isi layar sama dengan berkas Word/HTML. Setiap judul tingkat 1 menjadi
// bagian <details> yang dapat dibuka-tutup.

import { h } from './dom.js';

function runs(block) {
  const list = block.runs || [{ text: block.text, bold: block.bold, italic: block.italic }];
  return list.map((r) => {
    if (r.bold) return h('strong', { text: r.text });
    if (r.italic) return h('em', { text: r.text });
    return r.text;
  });
}

function cell(tag, value) {
  const c = value !== null && typeof value === 'object' ? value : { text: value };
  return h(tag, { class: c.fill ? `fill-${c.fill.toLowerCase()}` : null }, c.bold ? h('strong', { text: String(c.text ?? '') }) : String(c.text ?? ''));
}

// hooks.afterHeading(block) -> elemen tambahan setelah judul (mis. tombol koreksi).
export function blockElement(block, hooks = {}) {
  switch (block.type) {
    case 'heading': {
      const el = h(`h${Math.min(block.level + 1, 4)}`, { text: block.text });
      const extra = hooks.afterHeading ? hooks.afterHeading(block) : null;
      return extra ? [el, extra] : el;
    }
    case 'paragraph': {
      const cls = ['prose', block.small ? 'small' : '', block.muted ? 'hint' : ''].filter(Boolean).join(' ');
      return h('p', { class: cls }, runs(block));
    }
    case 'bullets': return h('ul', { class: 'prose-list' }, block.items.map((i) => h('li', { text: i })));
    case 'table': return h('div', { class: 'table-wrap' },
      h('table', { class: 'data-table report-table' },
        h('thead', {}, h('tr', {}, block.columns.map((c) => cell('th', c.header)))),
        h('tbody', {}, block.rows.map((row) => h('tr', {}, block.columns.map((_, i) => cell('td', row[i] ?? '')))))));
    case 'title':
    case 'subtitle':
    case 'pageBreak':
      return null;
    default:
      throw new Error(`Blok tidak dikenal: ${block.type}`);
  }
}

// Mengelompokkan blok per judul tingkat 1 menjadi <details>.
export function reportSections(blocks, { open = [], hooks = {} } = {}) {
  const sections = [];
  let current = null;
  for (const block of blocks) {
    if (block.type === 'heading' && block.level === 1) {
      current = h('div', { class: 'section-body' });
      sections.push(h('details', { class: 'report-section card', open: open.includes(block.text) },
        h('summary', {}, h('span', { class: 'summary-title', text: block.text })), current));
      continue;
    }
    if (!current) continue; // sampul tidak ditampilkan di layar
    const el = blockElement(block, hooks);
    if (el) current.append(...[el].flat());
  }
  return sections;
}
