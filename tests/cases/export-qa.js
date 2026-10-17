// Perbaikan QA ekspor A2 (qa-ekspor-simulator-ca.md butir 1-15).
import * as assert from './assert.js';
import { loadJson } from './env.js';
import { readZip } from '../../js/export/zip.js';
import { buildDocx, columnWidths } from '../../js/export/docx.js';
import { buildXlsx, excelDate } from '../../js/export/xlsx.js';
import { reportBlocks, studySheetBlocks } from '../../js/export/report-blocks.js';
import { reportSheets } from '../../js/export/report-sheets.js';
import { reportFile } from '../../js/export/report-files.js';
import { sheetsToCsv } from '../../js/export/csv.js';
import { buildReport, dedupeConcepts, levelFor, LEVEL_RULE } from '../../js/core/report.js';
import { applyGradingResult, applyManualCorrection, validateGradingResult } from '../../js/core/grading-io.js';
import { makeSessionId } from '../../js/core/session.js';
import { createRng } from '../../js/core/random.js';
import { unscopedCriterionRefs } from '../../js/core/consistency.js';
import { validateDocument } from '../../js/core/contract.js';
import { MIN, T0, sampleResult, submittedDemo } from '../fixtures/demo-graded.js';

const dec = new TextDecoder();
const part = (bytes, name) => dec.decode(readZip(bytes).entries.find((e) => e.name === name).data);

async function correctedDemo() {
  const pack = await loadJson('packs/demo/pack.json');
  const session = submittedDemo(pack);
  await applyGradingResult(session, await validateGradingResult(session, await sampleResult(session)), T0 + 30 * MIN);
  const essay = session.items.find((it) => it.type === 'essay');
  applyManualCorrection(session, { questionId: essay.questionId, subId: null, criterionId: 'C3', after: 2, reason: 'Alasan koreksi uji.' }, T0 + 35 * MIN);
  return { pack, session, report: buildReport(session, { pack, history: [session], now: T0 + 40 * MIN }) };
}

export default {
  name: 'Ekspor (QA A2)',
  cases: [
    {
      name: '1: tanggal di ID sesi = tanggal mulai menurut jam perangkat',
      run: () => {
        for (const iso of ['2026-10-16T23:30:00Z', '2026-10-17T00:30:00Z', '2026-12-31T20:00:00Z']) {
          const t = Date.parse(iso);
          const d = new Date(t);
          const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
          assert.ok(makeSessionId('demo', t, createRng(1)).startsWith(`demo-${stamp}-`), iso);
        }
      },
    },
    {
      name: '2: konsep remedial tanpa duplikat (huruf besar-kecil, frasa tercakup)',
      run: () => {
        assert.deepEqual(dedupeConcepts(['Balanced scorecard dan strategy map', 'Balanced scorecard', 'balanced  SCORECARD', 'EVA']), ['Balanced scorecard dan strategy map', 'EVA']);
        assert.deepEqual(dedupeConcepts(['Model lima kekuatan Porter', 'Porter']), ['Model lima kekuatan Porter']);
        assert.deepEqual(dedupeConcepts(['Score', 'Balanced scorecard']), ['Score', 'Balanced scorecard'], 'bagian kata bukan frasa utuh');
      },
    },
    {
      name: '3: batas kategori tanpa celah; teks aturan = kode',
      run: () => {
        assert.equal(levelFor(79.5), 'Cukup');
        assert.equal(levelFor(79.994), 'Cukup');
        assert.equal(levelFor(79.996), 'Kuat', 'tampil 80,00% -> kuat');
        assert.equal(levelFor(70), 'Cukup');
        assert.equal(levelFor(69.994), 'Lemah');
        assert.ok(LEVEL_RULE.includes('cukup 70% ≤ capaian < 80%'));
      },
    },
    {
      name: '4, 9, 10: XLSX A4 lanskap muat lebar, judul berulang, hitungan 0, persen, tanggal asli',
      run: async () => {
        const { report } = await correctedDemo();
        const sheets = reportSheets(report);
        const bytes = buildXlsx(sheets);
        for (let i = 1; i <= sheets.length; i++) {
          const ws = part(bytes, `xl/worksheets/sheet${i}.xml`);
          assert.ok(ws.includes('<pageSetUpPr fitToPage="1"/>') && ws.includes('<pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/>'), `sheet${i}`);
        }
        const wb = part(bytes, 'xl/workbook.xml');
        assert.ok(wb.includes('<definedName name="_xlnm.Print_Titles" localSheetId="0">\'Ringkasan\'!$1:$1</definedName>'));
        const styles = part(bytes, 'xl/styles.xml');
        assert.ok(styles.includes('formatCode="[$-421]d mmmm yyyy hh.mm"') && styles.includes('numFmtId="10"'));
        const ringkasan = part(bytes, 'xl/worksheets/sheet1.xml');
        const focusRow = report.log.focusLostCount;
        assert.ok(new RegExp(`<c r="B\\d+" s="4"><v>${focusRow}</v></c>`).test(ringkasan), 'hitungan memakai format bilangan bulat');
        assert.ok(/<c r="B\d+" s="7"><v>\d+\.\d+<\/v><\/c>/.test(ringkasan), 'tanggal tersimpan sebagai nomor seri');
        const kompetensi = part(bytes, 'xl/worksheets/sheet5.xml');
        const pct = report.competencies[0].pct / 100;
        assert.ok(kompetensi.includes(`<c r="F2" s="6"><v>${pct}</v></c>`), 'capaian sebagai pecahan berformat persen');
        assert.ok(Math.abs(excelDate('2026-10-17T08:00:00') - (46312 + 8 / 24)) < 1e-9, 'nomor seri tanggal Excel');
        const csv = sheetsToCsv(sheets);
        assert.ok(csv.includes(`${String(Math.round(pct * 10000) / 100).replace('.', ',')}%`), 'CSV menulis persen');
        assert.ok(/Oktober 2026/.test(csv), 'CSV menulis tanggal sebagai teks');
      },
    },
    {
      name: '5, 6, 14: DOCX tabel opsi/rubrik tidak terbelah, kolom tidak terlalu sempit, heading tidak melompat',
      run: async () => {
        const { report } = await correctedDemo();
        for (const blocks of [reportBlocks(report), studySheetBlocks(report)]) {
          let prev = 0;
          for (const b of blocks.filter((x) => x.type === 'heading')) {
            assert.ok(b.level <= prev + 1, `heading melompat ke tingkat ${b.level}: ${b.text}`);
            prev = b.level;
          }
        }
        const doc = part(buildDocx(studySheetBlocks(report)), 'word/document.xml');
        const firstTable = doc.slice(doc.indexOf('<w:tbl>'), doc.indexOf('</w:tbl>'));
        const rows = firstTable.split('<w:tr>').slice(1);
        assert.equal(rows.length, 5, 'header + 4 opsi');
        rows.slice(0, -1).forEach((r, i) => assert.ok(r.includes('<w:keepNext/>'), `baris ${i} harus keepNext`));
        assert.ok(!rows.at(-1).includes('<w:keepNext/>'), 'baris terakhir tidak keepNext');
        const full = part(buildDocx(reportBlocks(report)), 'word/document.xml');
        for (const tbl of full.split('<w:tbl>').slice(1)) {
          const head = tbl.split('<w:tr>')[1];
          assert.ok(head.includes('<w:tblHeader/>') && head.includes('<w:keepNext/>'), 'baris judul setiap tabel ditahan bersama baris pertama');
        }
        const widths = columnWidths([{ header: 'Waktu', width: 2.5 }, { header: 'Skor yang dikoreksi', width: 3 }, { header: 'Sebelum', width: 1.6 }, { header: 'Sesudah', width: 1.6 }, { header: 'Alasan', width: 4 }, { header: 'Status', width: 2 }]);
        assert.ok(widths[2] >= 907 && widths[3] >= 907, `kolom Sebelum/Sesudah >= 1,6 cm: ${widths}`);
        const rubric = columnWidths([{ header: 'Bagian', width: 1 }, { header: 'Kriteria', width: 1 }, { header: 'Deskripsi', width: 3 }, { header: 'Skor', width: 1.1 }, { header: 'Maks', width: 1 }, { header: 'Alasan penilai', width: 5 }]);
        assert.ok(rubric[0] >= 907 && rubric[1] >= 907, `kolom Bagian/Kriteria >= 1,6 cm: ${rubric}`);
        assert.ok(rubric.reduce((a, b) => a + b, 0) <= 9638, 'total tidak melebihi lebar halaman');
      },
    },
    {
      name: '6, 13: skor dikoreksi bertanda * dengan catatan kaki; alasan koreksi di sel alasan',
      run: async () => {
        const { report } = await correctedDemo();
        const blocks = reportBlocks(report);
        const essay = report.written.find((w) => w.type === 'essay');
        const table = blocks.find((b) => b.type === 'table' && b.rows.some((r) => r[1] === 'C3' && typeof r[3] === 'object'));
        const row = table.rows.find((r) => r[1] === 'C3');
        assert.equal(row[3].text, '2,00*');
        assert.ok(row[5].includes('Koreksi manual (skor AI 1,50 → 2,00): Alasan koreksi uji.'), row[5]);
        assert.ok(blocks.some((b) => b.type === 'paragraph' && /^\* Dikoreksi manual — C3: AI 1,50 → 2,00/.test(b.text || '')));
        const rubrik = reportSheets(report).find((s) => s.name === 'Rubrik');
        assert.ok(rubrik.rows.some((r) => r[1] === essay.questionId && r[3] === 'C3' && r[10] === 'Alasan koreksi uji.'));
      },
    },
    {
      name: '7: footer DOCX berisi ID sesi dan nomor halaman (PAGE/NUMPAGES)',
      run: async () => {
        const { report, session } = await correctedDemo();
        for (const kind of ['docx', 'study']) {
          const { data } = reportFile(kind, { report, session });
          const footer = part(data, 'word/footer1.xml');
          assert.ok(footer.includes(report.recap.sessionId) && footer.includes('w:instr=" PAGE "') && footer.includes('w:instr=" NUMPAGES "'), kind);
          assert.ok(part(data, 'word/document.xml').includes('<w:footerReference w:type="default" r:id="rId2"/>'));
          assert.ok(part(data, 'word/_rels/document.xml.rels').includes('Target="footer1.xml"'));
          assert.ok(part(data, '[Content_Types].xml').includes('PartName="/word/footer1.xml"'));
        }
      },
    },
    {
      name: '8: fallback .doc memakai page-break Word dan satu paragraf per baris',
      run: async () => {
        const { report, session } = await correctedDemo();
        const doc = reportFile('doc', { report, session }).data;
        assert.ok(doc.includes('<br clear=all style="page-break-before:always">') && !doc.includes('<hr class="page">'));
        const essay = report.written.find((w) => w.type === 'essay');
        const [first, , second] = essay.answer.split('\n');
        assert.ok(doc.includes(`<p>${first}</p><p>&nbsp;</p><p>${second}</p>`), 'baris kosong di jawaban esai dipertahankan');
        const html = reportFile('html', { report, session }).data;
        assert.ok(html.includes('<hr class="page">'), 'HTML biasa tetap memakai pre-wrap');
      },
    },
    {
      name: '11: label sub-jawaban kasus (a)/(b) di sheet Uraian',
      run: async () => {
        const { report } = await correctedDemo();
        const uraian = reportSheets(report).find((s) => s.name === 'Uraian');
        const caseRow = uraian.rows.find((r) => r[2] === 'Studi kasus');
        assert.ok(caseRow[6].startsWith('(a) ') && caseRow[6].includes('\n\n(b) ') && !caseRow[6].includes('[a]'), caseRow[6].slice(0, 20));
      },
    },
    {
      name: '12: rujukan kriteria soal kasus wajib menyebut bagian',
      run: async () => {
        assert.deepEqual(unscopedCriterionRefs('nilai penuh pada C3 bila kuat'), ['C3']);
        assert.deepEqual(unscopedCriterionRefs('nilai penuh pada (b) C3; (a) kriteria C1 juga'), []);
        assert.deepEqual(unscopedCriterionRefs('pilihan (1) pada C2'), ['C2']);
        const pack = await loadJson('packs/demo/pack.json');
        const kasus = pack.questions.find((q) => q.type === 'case');
        assert.deepEqual(validateDocument('question', kasus), []);
        const bad = { ...kasus, acceptableAlternatives: 'Rekomendasi (1) dapat nilai penuh pada C3.' };
        const errors = validateDocument('question', bad);
        assert.ok(errors.some((e) => e.path === '$.acceptableAlternatives' && /\(b\) C3/.test(e.message)), JSON.stringify(errors));
        const essay = pack.questions.find((q) => q.type === 'essay');
        assert.deepEqual(validateDocument('question', { ...essay, acceptableAlternatives: 'C1 boleh lebih longgar.' }), [], 'esai tidak terkena aturan');
      },
    },
    {
      name: '15: semua kolom teks sheet Uraian dan Rubrik dibungkus',
      run: async () => {
        const { report } = await correctedDemo();
        for (const name of ['Uraian', 'Rubrik']) {
          const sheet = reportSheets(report).find((s) => s.name === name);
          for (const c of sheet.columns) assert.ok(['wrap', 'number', 'int'].includes(c.kind), `${name}.${c.header}: ${c.kind}`);
        }
      },
    },
  ],
};
