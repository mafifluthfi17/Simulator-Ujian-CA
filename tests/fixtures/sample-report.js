// Contoh laporan dari sesi demo (soal DEMO, penilaian uraian FIKTIF) untuk
// tests/output/. Fungsi murni: dipakai tools/sample-report.mjs (Node) dan dapat
// dijalankan di browser. Hasil: [{ name, data: string | Uint8Array }].

import { buildReport } from '../../js/core/report.js';
import { applyGradingResult, applyManualCorrection, validateGradingResult } from '../../js/core/grading-io.js';
import { reportFile } from '../../js/export/report-files.js';
import { MIN, T0, sampleResult, submittedDemo } from './demo-graded.js';

export async function sampleReportFiles(pack) {
  // Sesi lama untuk sheet Riwayat dan sesi utama yang dilaporkan.
  const older = submittedDemo(pack, { seed: 5 });
  await grade(older, T0 + 30 * MIN);
  const session = submittedDemo(pack, { seed: 11 });
  await grade(session, T0 + 30 * MIN);
  const essay = session.items.find((it) => it.type === 'essay');
  applyManualCorrection(session, {
    questionId: essay.questionId, subId: null, criterionId: 'C3', after: 2,
    reason: 'Contoh koreksi: keempat ukuran relevan untuk agribisnis.',
  }, T0 + 35 * MIN);
  older.submittedAt = new Date(Date.parse(session.submittedAt) - 24 * 60 * MIN).toISOString();

  const now = T0 + 40 * MIN;
  const report = buildReport(session, { pack, history: [older, session], now });
  const out = [];
  for (const [kind, name] of [
    ['docx', 'laporan-demo.docx'], ['study', 'lembar-belajar-demo.docx'], ['xlsx', 'data-hasil-demo.xlsx'],
    ['html', 'laporan-demo.html'], ['doc', 'laporan-demo-fallback.doc'], ['csv', 'data-hasil-demo-fallback.csv'],
  ]) {
    const file = reportFile(kind, { report, session, now });
    if (file.fallbackMessage) throw new Error(file.fallbackMessage);
    out.push({ name, data: file.data });
  }
  return out;
}

async function grade(session, now) {
  const v = await validateGradingResult(session, await sampleResult(session));
  if (!v.ok) throw new Error(v.errors.map((e) => `${e.path}: ${e.message}`).join('; '));
  await applyGradingResult(session, v, now);
}
