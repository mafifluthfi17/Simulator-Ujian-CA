// Pemeriksa XML well-formed minimal untuk tes (Node tidak punya DOMParser):
// satu elemen akar, tag berpasangan, atribut berkutip dan tidak ganda, entitas sah,
// tanpa karakter kontrol terlarang. Melempar Error dengan posisi bila gagal.

const NAME = /[A-Za-z_:][\w:.-]*/y;
const ATTR = /\s+([A-Za-z_:][\w:.-]*)\s*=\s*(?:"([^"<]*)"|'([^'<]*)')/y;
// eslint-disable-next-line no-control-regex
const BAD_CHAR = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/;

function checkEntities(text, at) {
  const re = /&([^;\s]*);?/g;
  let m;
  while ((m = re.exec(text))) {
    const ok = m[0].endsWith(';') && /^(amp|lt|gt|quot|apos|#[0-9]+|#x[0-9A-Fa-f]+)$/.test(m[1]);
    if (!ok) throw new Error(`entitas tidak sah "${m[0].slice(0, 12)}" dekat posisi ${at + m.index}`);
  }
}

export function checkXml(xml) {
  if (BAD_CHAR.test(xml)) throw new Error('mengandung karakter kontrol yang tidak sah di XML');
  let i = 0;
  if (xml.startsWith('<?xml')) {
    i = xml.indexOf('?>') + 2;
    if (i < 2) throw new Error('deklarasi XML tidak ditutup');
  }
  const stack = [];
  let roots = 0;
  while (i < xml.length) {
    const lt = xml.indexOf('<', i);
    const text = xml.slice(i, lt === -1 ? xml.length : lt);
    checkEntities(text, i);
    if (!stack.length && text.trim()) throw new Error(`teks di luar elemen akar dekat posisi ${i}`);
    if (lt === -1) break;
    i = lt;
    if (xml.startsWith('<!--', i)) {
      const end = xml.indexOf('-->', i);
      if (end === -1) throw new Error('komentar tidak ditutup');
      i = end + 3;
    } else if (xml.startsWith('<![CDATA[', i)) {
      const end = xml.indexOf(']]>', i);
      if (end === -1) throw new Error('CDATA tidak ditutup');
      i = end + 3;
    } else if (xml.startsWith('<?', i)) {
      const end = xml.indexOf('?>', i);
      if (end === -1) throw new Error('instruksi pemrosesan tidak ditutup');
      i = end + 2;
    } else if (xml.startsWith('</', i)) {
      NAME.lastIndex = i + 2;
      const m = NAME.exec(xml);
      if (!m) throw new Error(`tag penutup rusak di posisi ${i}`);
      const close = xml.indexOf('>', NAME.lastIndex);
      if (close === -1 || xml.slice(NAME.lastIndex, close).trim()) throw new Error(`tag penutup </${m[0]}> rusak`);
      const open = stack.pop();
      if (open !== m[0]) throw new Error(`</${m[0]}> tidak cocok dengan <${open}> di posisi ${i}`);
      i = close + 1;
    } else {
      NAME.lastIndex = i + 1;
      const m = NAME.exec(xml);
      if (!m) throw new Error(`tag pembuka rusak di posisi ${i}`);
      let p = NAME.lastIndex;
      const seen = new Set();
      for (;;) {
        ATTR.lastIndex = p;
        const a = ATTR.exec(xml);
        if (!a) break;
        if (seen.has(a[1])) throw new Error(`atribut ${a[1]} ganda pada <${m[0]}>`);
        seen.add(a[1]);
        checkEntities(a[2] ?? a[3], p);
        p = ATTR.lastIndex;
      }
      const rest = /\s*(\/?)>/y;
      rest.lastIndex = p;
      const r = rest.exec(xml);
      if (!r) throw new Error(`tag <${m[0]}> rusak di posisi ${i} ("${xml.slice(p, p + 20)}")`);
      if (!stack.length) roots++;
      if (roots > 1) throw new Error('lebih dari satu elemen akar');
      if (!r[1]) stack.push(m[0]);
      i = rest.lastIndex;
    }
  }
  if (stack.length) throw new Error(`elemen tidak ditutup: <${stack.join('> <')}>`);
  if (roots !== 1) throw new Error('tidak ada elemen akar');
  return true;
}
