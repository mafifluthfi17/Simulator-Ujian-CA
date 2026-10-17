// index.html?selftest: menjalankan suite tes yang sama dengan node --test di browser.
// Membutuhkan http(s) (memuat berkas proyek lewat fetch).

import { h, clear } from './ui/dom.js';

export async function runSelftest(root) {
  clear(root);
  const status = h('p', { text: 'Menjalankan tes…' });
  const tbody = h('tbody');
  root.append(h('div', { class: 'screen' },
    h('h1', { text: 'Self-test' }), status,
    h('table', { class: 'selftest-table' }, tbody)));

  let suites;
  try {
    suites = (await import('../tests/cases/index.js')).default;
  } catch (e) {
    status.textContent = `Tes tidak dapat dimuat: ${e.message}. Buka lewat http(s), bukan file://.`;
    return;
  }
  const results = [];
  for (const suite of suites) {
    for (const c of suite.cases) {
      let outcome = 'PASS';
      let detail = '';
      const started = performance.now();
      try {
        await c.run();
      } catch (e) {
        outcome = 'FAIL';
        detail = e.message;
      }
      results.push({ id: c.id || '', suite: suite.name, name: c.name, outcome, detail, ms: Math.round(performance.now() - started) });
      tbody.append(h('tr', {},
        h('td', { class: outcome.toLowerCase(), text: outcome }),
        h('td', { text: c.id || '' }),
        h('td', { text: `[${suite.name}] ${c.name}` }),
        h('td', { class: 'hint', text: detail || `${results.at(-1).ms} ms` })));
    }
  }
  const failed = results.filter((r) => r.outcome === 'FAIL').length;
  status.textContent = failed ? `${failed} dari ${results.length} tes GAGAL.` : `Semua ${results.length} tes PASS.`;
  status.className = failed ? 'fail' : 'pass';
  window.__selftest = { failed, results };
}
