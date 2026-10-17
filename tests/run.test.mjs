// node --test: menjalankan suite bersama di tests/cases/. Kasus browserOnly
// (butuh DOM) dilewati di sini dan dijalankan oleh index.html?selftest.
import { test } from 'node:test';
import suites from './cases/index.js';

for (const suite of suites) {
  for (const c of suite.cases) {
    const title = `${c.id ? `${c.id} ` : ''}[${suite.name}] ${c.name}`;
    test(title, { skip: c.browserOnly ? 'butuh DOM browser; dijalankan di index.html?selftest' : false }, () => c.run());
  }
}
