// Uji render tipe soal di DOM nyata (hanya browser: index.html?selftest).
import * as assert from './assert.js';
import { loadJson } from './env.js';
import { getType } from '../../js/types/registry.js';

const XSS = '<script>window.__xss = 1</script><img src=x onerror="window.__xss = 2">';

function sandbox() {
  const box = document.createElement('div');
  box.hidden = true;
  document.body.append(box);
  return box;
}

export default {
  name: 'Tampilan',
  cases: [
    {
      id: 'TS-16',
      browserOnly: true,
      name: 'jawaban dan soal berisi <script> tampil sebagai teks',
      run: async () => {
        const pack = await loadJson('packs/demo/pack.json');
        const box = sandbox();
        try {
          window.__xss = 0;
          for (const q of pack.questions) {
            const evil = { ...q, stem: XSS, caseNarrative: q.caseNarrative ? XSS : undefined };
            if (evil.options) evil.options = evil.options.map((o) => ({ ...o, text: XSS }));
            const value = { mcq: q.answerKey, numeric: 48, essay: XSS, case: { a: XSS, b: XSS } }[q.type];
            const item = { questionId: q.id, type: q.type, optionOrder: ['A', 'B', 'C', 'D'] };
            const el = getType(q.type).render(evil, { item, value, readOnly: false, onChange: () => {} });
            box.append(el);
            assert.equal(el.querySelectorAll('script, img').length, 0, `${q.type}: elemen dari teks tersisip`);
            assert.ok(el.textContent.includes('<script>'), `${q.type}: teks harus tampil apa adanya`);
            const report = getType(q.type).renderReport(evil, value, item);
            assert.equal(report.querySelectorAll('script, img').length, 0, `${q.type}: laporan menyisipkan elemen`);
          }
          await new Promise((r) => setTimeout(r, 50));
          assert.equal(window.__xss, 0, 'skrip sisipan sempat berjalan');
        } finally {
          box.remove();
        }
      },
    },
    {
      browserOnly: true,
      name: 'render dan getAnswer setiap tipe soal',
      run: async () => {
        const pack = await loadJson('packs/demo/pack.json');
        const box = sandbox();
        try {
          for (const q of pack.questions) {
            const changes = [];
            const item = { questionId: q.id, type: q.type, optionOrder: ['C', 'A', 'D', 'B'] };
            const type = getType(q.type);
            const el = type.render(q, { item, value: null, readOnly: false, onChange: (v) => changes.push(v) });
            box.append(el);
            if (q.type === 'mcq') {
              const firstShown = el.querySelector('input[type=radio]');
              assert.equal(firstShown.value, 'C', 'posisi tampil pertama harus opsi asli C');
              assert.equal(el.querySelector('.option-letter').textContent, 'A');
              firstShown.click();
              assert.equal(type.getAnswer(el), 'C');
              assert.equal(changes.at(-1), 'C');
            } else if (q.type === 'numeric') {
              const input = el.querySelector('input');
              input.value = '47,8';
              input.dispatchEvent(new Event('input'));
              assert.equal(changes.at(-1), 47.8);
              assert.ok(el.textContent.includes('Terbaca: 47,8'));
            } else if (q.type === 'essay') {
              const area = el.querySelector('textarea');
              area.value = 'tiga kata saja';
              area.dispatchEvent(new Event('input'));
              assert.equal(changes.at(-1), 'tiga kata saja');
              assert.ok(el.textContent.includes('3 kata'));
            } else {
              const areas = el.querySelectorAll('textarea[data-sub]');
              assert.equal(areas.length, 2);
              areas[1].value = 'jawaban b';
              areas[1].dispatchEvent(new Event('input'));
              assert.deepEqual(changes.at(-1), { a: '', b: 'jawaban b' });
              assert.ok(type.isAnswered(changes.at(-1)));
              assert.equal(type.exportForGrading(q, changes.at(-1)).answer, '[a]\n\n[b] jawaban b');
              assert.equal(el.querySelector('td.num').textContent, '820');
            }
          }
        } finally {
          box.remove();
        }
      },
    },
  ],
};
