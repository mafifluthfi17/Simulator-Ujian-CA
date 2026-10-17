// Laporan dan ekspor (SPEC 11): model laporan, ZIP + CRC-32, .docx, .xlsx,
// HTML, CSV, fallback, tren riwayat.
import * as assert from './assert.js';
import { loadJson, isNode } from './env.js';
import { crc32, readZip, zipStore } from '../../js/export/zip.js';
import { buildDocx, DOCX_PARTS } from '../../js/export/docx.js';
import { buildXlsx, columnLetter, sheetNames, xlsxParts } from '../../js/export/xlsx.js';
import { reportBlocks, studySheetBlocks } from '../../js/export/report-blocks.js';
import { reportSheets } from '../../js/export/report-sheets.js';
import { htmlDocument } from '../../js/export/html-report.js';
import { sheetsToCsv } from '../../js/export/csv.js';
import { reportFile } from '../../js/export/report-files.js';
import { cleanText, escapeXml } from '../../js/export/xml.js';
import { buildReport, levelFor, trendSeries } from '../../js/core/report.js';
import { applyGradingResult, validateGradingResult } from '../../js/core/grading-io.js';
import { checkXml } from '../fixtures/xml-check.js';
import { CASE_ANSWER, ESSAY_ANSWER, T0, MIN, sampleResult, submittedDemo } from '../fixtures/demo-graded.js';

const dec = new TextDecoder();
const XSS = '<script>alert(1)</script> & "kutip" \u0001';

async function finalDemo({ seed = 11, mutateAnswers } = {}) {
  const pack = await loadJson('packs/demo/pack.json');
  const session = submittedDemo(pack, { seed });
  if (mutateAnswers) mutateAnswers(session);
  const v = await validateGradingResult(session, await sampleResult(session));
  if (!v.ok) throw new Error(v.errors.map((e) => e.message).join('; '));
  await applyGradingResult(session, v, T0 + 30 * MIN);
  return { pack, session, report: buildReport(session, { pack, history: [session], now: T0 + 31 * MIN }) };
}

function assertWellFormed(name, text) {
  try {
    checkXml(text);
  } catch (e) {
    throw new assert.AssertionError(`${name} tidak well-formed: ${e.message}`);
  }
  if (!isNode) {
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    assert.equal(doc.getElementsByTagName('parsererror').length, 0, `${name}: DOMParser menolak XML`);
  }
}

// TS-15: ZIP valid, entri lengkap, XML well-formed, setiap part terdaftar di [Content_Types].xml.
function checkPackage(bytes, required) {
  const { entries } = readZip(bytes);
  const names = entries.map((e) => e.name);
  for (const part of required) assert.ok(names.includes(part), `entri ${part} tidak ada`);
  assert.equal(new Set(names).size, names.length, 'nama entri ganda');
  const texts = {};
  for (const e of entries) {
    texts[e.name] = dec.decode(e.data);
    assertWellFormed(e.name, texts[e.name]);
  }
  const types = texts['[Content_Types].xml'];
  for (const name of names.filter((n) => !n.endsWith('.rels') && n !== '[Content_Types].xml')) {
    assert.ok(types.includes(`PartName="/${name}"`), `${name} tidak terdaftar di [Content_Types].xml`);
  }
  return texts;
}

export default {
  name: 'Ekspor',
  cases: [
    {
      name: 'CRC-32 vektor standar; ZIP STORE terbaca ulang; kerusakan terdeteksi',
      run: async () => {
        const enc = new TextEncoder();
        assert.equal(crc32(enc.encode('123456789')), 0xcbf43926);
        assert.equal(crc32(new Uint8Array(0)), 0);
        const zip = zipStore([{ name: 'a.txt', data: 'halo' }, { name: 'folder/ü.xml', data: '<a/>' }], new Date(2026, 9, 17, 10, 30, 0));
        assert.equal(new DataView(zip.buffer).getUint32(0, true), 0x04034b50, 'tanda tangan PK\\3\\4');
        const { entries } = readZip(zip);
        assert.deepEqual(entries.map((e) => [e.name, dec.decode(e.data)]), [['a.txt', 'halo'], ['folder/ü.xml', '<a/>']]);
        const broken = zip.slice();
        broken[31 + 'a.txt'.length] ^= 0xff; // ubah 1 byte isi a.txt
        await assert.rejects(() => readZip(broken), /CRC/);
      },
    },
    {
      name: 'escape XML: tag, kutip, ampersand, karakter kontrol dan surrogate tunggal',
      run: () => {
        assert.equal(escapeXml(XSS), '&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;kutip&quot; ');
        assert.equal(cleanText('a\uD800b😀c\r\nd'), 'ab😀c\nd');
        assert.equal(columnLetter(0), 'A');
        assert.equal(columnLetter(27), 'AB');
        assert.deepEqual(sheetNames(['Data/Hasil', 'data/hasil', 'x'.repeat(40)]), ['Data Hasil', 'data hasil 2', 'x'.repeat(31)]);
      },
    },
    {
      name: 'model laporan: rekap, PG, uraian, analisis kompetensi/topik, remedial, log',
      run: async () => {
        const { report, session } = await finalDemo();
        const r = report.recap;
        assert.equal(r.status, 'FINAL');
        assert.equal(r.finalScore, session.grading.finalScore);
        assert.equal(report.objective.length + report.written.length, session.items.length);
        const mcq = report.objective.filter((o) => o.type === 'mcq');
        assert.deepEqual(mcq.map((m) => m.status).sort(), ['BENAR', 'SALAH']);
        assert.ok(mcq.every((m) => m.options.length === 4 && m.distractors.length === 3 && m.explanation));
        const essay = report.written.find((w) => w.type === 'essay');
        assert.equal(essay.answer, ESSAY_ANSWER, 'jawaban asli utuh');
        assert.ok(essay.rubricRows.every((c) => c.justification && c.awardedScore !== null));
        const kasus = report.written.find((w) => w.type === 'case');
        assert.deepEqual(kasus.subQuestions.map((s) => s.answer), [CASE_ANSWER.a, CASE_ANSWER.b]);
        for (const a of [...report.topics, ...report.competencies]) {
          assert.ok(a.pct >= 0 && a.pct <= 100);
          assert.equal(a.level, levelFor(a.pct));
        }
        const totalMax = report.topics.reduce((n, a) => n + a.max, 0);
        assert.ok(Math.abs(totalMax - 100) < 1e-6, 'skor dibagi rata ke topik: total maks 100');
        assert.equal(levelFor(80), 'Kuat');
        assert.equal(levelFor(79.99), 'Cukup');
        assert.equal(levelFor(69.99), 'Lemah');
        assert.equal(report.remedial.items.length, [...report.topics, ...report.competencies].filter((a) => a.level === 'Lemah').length);
        assert.equal(report.log.focusLostCount, 1);
        assert.ok(report.limitations.length >= 6 && report.disclaimer.includes('IAI'));
      },
    },
    {
      id: 'TS-15',
      name: 'ekspor .docx dan .xlsx: ZIP valid, entri lengkap, XML well-formed',
      run: async () => {
        const { report } = await finalDemo();
        const docx = buildDocx(reportBlocks(report), { title: 'Laporan', created: new Date(T0) });
        const d = checkPackage(docx, DOCX_PARTS);
        const body = d['word/document.xml'];
        for (const style of ['Heading1', 'Heading2', 'Heading3']) assert.ok(d['word/styles.xml'].includes(`w:styleId="${style}"`), style);
        assert.ok(d['word/styles.xml'].includes('w:val="single"'), 'tabel ber-border');
        assert.ok(body.includes('<w:tbl>') && body.includes('<w:tblHeader/>'));
        for (const heading of ['Rekap Nilai', 'Analisis Kompetensi', 'Pembahasan Pilihan Ganda', 'Pembahasan Esai dan Kasus', 'Rencana Remedial', 'Lampiran']) {
          assert.ok(body.includes(heading), `bagian "${heading}" tidak ada`);
        }
        assert.ok(d['word/_rels/document.xml.rels'].includes('Target="styles.xml"'));

        const sheets = reportSheets(report);
        assert.deepEqual(sheets.map((s) => s.name), ['Ringkasan', 'PG', 'Uraian', 'Rubrik', 'Kompetensi', 'Remedial', 'Riwayat']);
        const xlsx = buildXlsx(sheets, { title: 'Data Hasil', created: new Date(T0) });
        const x = checkPackage(xlsx, xlsxParts(sheets.length));
        const wb = x['xl/workbook.xml'];
        sheets.forEach((s, i) => assert.ok(wb.includes(`name="${s.name}" sheetId="${i + 1}"`), `sheet ${s.name}`));
        const pg = x['xl/worksheets/sheet2.xml'];
        assert.ok(pg.includes('state="frozen"') && pg.includes('<cols>') && pg.includes('t="inlineStr"'));
        assert.ok(/<c r="A1" s="1" t="inlineStr">/.test(pg), 'header memakai gaya tebal');
        assert.ok(/<c r="P2" s="2"><v>[0-9.]+<\/v><\/c>/.test(pg), 'skor tersimpan sebagai angka');
        assert.ok(x['xl/styles.xml'].includes('<b/>'));
        const riwayat = x['xl/worksheets/sheet7.xml'];
        assert.ok(riwayat.includes(report.recap.sessionId), 'sheet Riwayat memuat sesi FINAL');
      },
    },
    {
      name: 'Lembar Belajar: soal, kunci, pembahasan tanpa jawaban dan nilai peserta',
      run: async () => {
        const { report } = await finalDemo();
        const bytes = buildDocx(studySheetBlocks(report), { title: 'Lembar Belajar' });
        const body = dec.decode(readZip(bytes).entries.find((e) => e.name === 'word/document.xml').data);
        assert.ok(body.includes('Lembar Belajar') && body.includes('Kunci') && body.includes('Pembahasan'));
        const answerSnippet = ESSAY_ANSWER.slice(0, 40);
        assert.ok(!body.includes(escapeXml(answerSnippet)), 'jawaban esai peserta tidak boleh ada');
        assert.ok(!body.includes(escapeXml(CASE_ANSWER.a.slice(0, 30))), 'jawaban kasus peserta tidak boleh ada');
        assert.ok(!body.includes('Jawaban Anda'), 'tidak ada label jawaban peserta');
      },
    },
    {
      name: 'teks peserta berbahaya tetap teks di .docx, .xlsx, HTML, CSV',
      run: async () => {
        const { report } = await finalDemo({
          mutateAnswers: (s) => {
            const essay = s.items.find((it) => it.type === 'essay');
            s.answers[essay.questionId].value = XSS;
          },
        });
        const docBody = dec.decode(readZip(buildDocx(reportBlocks(report))).entries.find((e) => e.name === 'word/document.xml').data);
        assertWellFormed('document.xml', docBody);
        assert.ok(docBody.includes('&lt;script&gt;') && !docBody.includes('<script>'));
        const xEntries = readZip(buildXlsx(reportSheets(report))).entries;
        for (const e of xEntries) assertWellFormed(e.name, dec.decode(e.data));
        const html = htmlDocument(reportBlocks(report), { title: XSS });
        assert.ok(!html.includes('<script>'), 'HTML tidak boleh berisi tag skrip');
        assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
        if (!isNode) {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          assert.equal(doc.querySelectorAll('script, img').length, 0);
        }
        const csv = sheetsToCsv(reportSheets(report));
        assert.ok(csv.startsWith('﻿'), 'CSV diawali BOM');
        assert.ok(csv.includes('"<script>alert(1)</script> & ""kutip"" "'), 'sel berkutip dan kutip digandakan');
      },
    },
    {
      name: 'CSV fallback: BOM, titik koma, koma desimal; HTML/.doc satu berkas; JSON dapat diimpor ulang',
      run: async () => {
        const { report, session } = await finalDemo();
        const csv = sheetsToCsv([{ name: 'S', columns: [{ header: 'a' }, { header: 'b' }], rows: [['x;y', 12.5], ['baris\nbaru', null]] }]);
        assert.equal(csv, '﻿a;b\r\n"x;y";12,5\r\n"baris\nbaru";\r\n');
        const doc = reportFile('doc', { report, session });
        assert.equal(doc.mime, 'application/msword');
        assert.ok(doc.filename.endsWith('.doc') && doc.data.includes('urn:schemas-microsoft-com:office:word'));
        const html = reportFile('html', { report, session });
        assert.ok(!/<(script|link|img)\b/i.test(html.data), 'HTML satu berkas tanpa aset luar/skrip');
        const json = JSON.parse(reportFile('json', { report, session }).data);
        assert.equal(json.sessions[0].sessionId, session.sessionId);
        assert.equal(json.backupVersion, '4.1');
        for (const kind of ['docx', 'study', 'xlsx', 'csv', 'study-doc']) {
          const f = reportFile(kind, { report, session });
          assert.ok(f.data.length > 500 && !f.fallbackMessage, kind);
        }
      },
    },
    {
      name: 'fallback otomatis: .docx gagal -> .doc, .xlsx gagal -> .csv, dengan pesan',
      run: async () => {
        const { report, session } = await finalDemo();
        // Penulis ZIP dibuat gagal (TextEncoder dilempar); .doc dan .csv tidak memerlukannya.
        let docx;
        let xlsx;
        const original = TextEncoder.prototype.encode;
        TextEncoder.prototype.encode = function encode() { throw new Error('uji gagal'); };
        try {
          docx = reportFile('docx', { report, session });
          xlsx = reportFile('xlsx', { report, session });
        } finally {
          TextEncoder.prototype.encode = original;
        }
        assert.ok(docx.filename.endsWith('.doc') && /\.doc yang tetap dapat dibuka/.test(docx.fallbackMessage), docx.filename);
        assert.ok(xlsx.filename.endsWith('.csv') && /\.csv/.test(xlsx.fallbackMessage), xlsx.filename);
      },
    },
    {
      name: 'riwayat dan tren: hanya sesi FINAL, terurut waktu kumpul, per paket',
      run: async () => {
        const a = (await finalDemo({ seed: 11 })).session;
        const b = (await finalDemo({ seed: 12 })).session;
        b.submittedAt = new Date(Date.parse(a.submittedAt) + MIN).toISOString();
        const pending = submittedDemo(await loadJson('packs/demo/pack.json'), { seed: 13 });
        const series = trendSeries([b, pending, a]);
        assert.equal(series.length, 1);
        assert.deepEqual(series[0].points.map((p) => p.sessionId), [a.sessionId, b.sessionId]);
        const report = buildReport(a, { history: [b, pending, a] });
        assert.deepEqual(report.history.map((h) => h.sessionId), [a.sessionId, b.sessionId]);
      },
    },
  ],
};
