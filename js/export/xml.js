// Escape teks untuk XML/HTML. Karakter yang tidak sah di XML 1.0 (kontrol,
// surrogate tunggal, U+FFFE/U+FFFF) dibuang agar berkas Office tetap well-formed
// walau jawaban berisi karakter aneh. Tanpa regex lookbehind (Safari < 16.4).

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g;

export function cleanText(value) {
  const s = String(value ?? '').replace(CONTROL, '').replace(/\r\n?/g, '\n');
  if (!/[\uD800-\uDFFF]/.test(s)) return s;
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff) {
      const next = s.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        out += s[i] + s[i + 1];
        i++;
      }
    } else if (c < 0xdc00 || c > 0xdfff) {
      out += s[i];
    }
  }
  return out;
}

export function escapeXml(value) {
  return cleanText(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// HTML memakai &#39; (bukan &apos;) agar aman di HTML lama yang dibaca Word sebagai .doc.
export function escapeHtml(value) {
  return escapeXml(value).replace(/&apos;/g, '&#39;');
}

export const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
