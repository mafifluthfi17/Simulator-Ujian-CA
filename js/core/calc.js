// Mesin kalkulator: penghitung ekspresi aman (tanpa eval). Angka memakai titik
// desimal; tampilan ke peserta memakai format Indonesia (1.234,56).
// Operator: + - * / ( ) dan % di belakang angka (50% = 0,5).

export class CalcError extends Error {}

function tokenize(src) {
  const tokens = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === ' ') { i += 1; continue; }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9.]/.test(src[j])) j += 1;
      const text = src.slice(i, j);
      if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) throw new CalcError('Angka tidak valid');
      tokens.push({ t: 'num', v: Number(text) });
      i = j;
    } else if ('+-*/()%'.includes(c)) {
      tokens.push({ t: c });
      i += 1;
    } else {
      throw new CalcError('Karakter tidak dikenal');
    }
  }
  return tokens;
}

// Menghitung ekspresi. Melempar CalcError bila tidak valid atau hasil bukan angka.
export function evaluate(src) {
  const tokens = tokenize(src);
  let pos = 0;
  const peek = () => (pos < tokens.length ? tokens[pos].t : null);

  function expr() {
    let v = term();
    while (peek() === '+' || peek() === '-') {
      const op = tokens[pos++].t;
      const r = term();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  }
  function term() {
    let v = unary();
    while (peek() === '*' || peek() === '/') {
      const op = tokens[pos++].t;
      const r = unary();
      if (op === '/' && r === 0) throw new CalcError('Tidak bisa dibagi nol');
      v = op === '*' ? v * r : v / r;
    }
    return v;
  }
  function unary() {
    if (peek() === '-') { pos += 1; return -unary(); }
    if (peek() === '+') { pos += 1; return unary(); }
    return postfix();
  }
  function postfix() {
    let v = primary();
    while (peek() === '%') { pos += 1; v /= 100; }
    return v;
  }
  function primary() {
    const tok = tokens[pos];
    if (!tok) throw new CalcError('Perhitungan belum lengkap');
    if (tok.t === 'num') { pos += 1; return tok.v; }
    if (tok.t === '(') {
      pos += 1;
      const v = expr();
      if (peek() !== ')') throw new CalcError('Kurung belum ditutup');
      pos += 1;
      return v;
    }
    throw new CalcError('Perhitungan tidak valid');
  }

  if (!tokens.length) throw new CalcError('Perhitungan kosong');
  const result = expr();
  if (pos < tokens.length) throw new CalcError('Perhitungan tidak valid');
  if (!Number.isFinite(result)) throw new CalcError('Hasil terlalu besar');
  // Buang sisa kesalahan pecahan biner (0,1 + 0,2).
  return Number(result.toPrecision(14));
}

// Angka -> teks Indonesia: titik ribuan, koma desimal, maksimal 6 desimal.
export function formatNumber(n) {
  const [int, frac] = Math.abs(n).toFixed(6).replace(/0+$/, '').replace(/\.$/, '').split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const sign = n < 0 && (Number(int) !== 0 || frac) ? '-' : '';
  return `${sign}${grouped}${frac ? `,${frac}` : ''}`;
}

// Ekspresi internal -> tampilan (× ÷ − dan koma desimal).
export function displayExpression(src) {
  return src.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−').replace(/\./g, ',');
}

// Hasil -> teks ekspresi bertitik desimal (untuk lanjut menghitung dari hasil).
export function resultToExpression(n) {
  return n < 0 ? `(${Number(n.toFixed(6))})` : String(Number(n.toFixed(6)));
}
