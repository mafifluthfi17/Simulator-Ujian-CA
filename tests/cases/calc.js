// Kalkulator: penghitung ekspresi dan format angka Indonesia.
import * as assert from './assert.js';
import { CalcError, displayExpression, evaluate, formatNumber } from '../../js/core/calc.js';

export default {
  name: 'calc',
  cases: [
    { name: 'urutan operator dan kurung', run() {
      assert.equal(evaluate('2+3*4'), 14);
      assert.equal(evaluate('(2+3)*4'), 20);
      assert.equal(evaluate('10/4'), 2.5);
      assert.equal(evaluate('-5+2'), -3);
    } },
    { name: 'persen dan pecahan biner', run() {
      assert.equal(evaluate('50%'), 0.5);
      assert.equal(evaluate('200*15%'), 30);
      assert.equal(evaluate('0.1+0.2'), 0.3);
    } },
    { name: 'ekspresi tidak valid ditolak', run() {
      for (const bad of ['', '2+', '(2', '1/0', '2..3', 'abc', '2)']) {
        let err = null;
        try { evaluate(bad); } catch (e) { err = e; }
        assert.ok(err instanceof CalcError, `harus ditolak: ${bad}`);
      }
    } },
    { name: 'format Indonesia', run() {
      assert.equal(formatNumber(1234567.5), '1.234.567,5');
      assert.equal(formatNumber(-1000), '-1.000');
      assert.equal(formatNumber(0), '0');
      assert.equal(displayExpression('1.5*2-3/4'), '1,5×2−3÷4');
    } },
  ],
};
