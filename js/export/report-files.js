// Membuat berkas ekspor laporan (SPEC 11) tanpa DOM: .docx, Lembar Belajar,
// .xlsx, HTML satu berkas, JSON (cadangan sesi yang dapat diimpor ulang),
// serta fallback .doc (HTML) dan .csv. Bila .docx/.xlsx gagal dibuat, hasilnya
// otomatis diganti fallback dan `fallbackMessage` diisi.

import { buildDocx, DOCX_MIME } from './docx.js';
import { buildXlsx, XLSX_MIME } from './xlsx.js';
import { reportBlocks, studySheetBlocks } from './report-blocks.js';
import { reportSheets } from './report-sheets.js';
import { htmlDocument } from './html-report.js';
import { sheetsToCsv } from './csv.js';
import { SCHEMA_VERSION } from '../core/version.js';

export const EXPORT_KINDS = ['docx', 'study', 'xlsx', 'html', 'json', 'doc', 'study-doc', 'csv'];

const TITLES = { report: 'Laporan & Pembahasan', study: 'Lembar Belajar' };

function base(report, prefix) {
  return `${prefix}-${report.recap.sessionId}`;
}

// Hasil: { filename, mime, data (string | Uint8Array), fallbackMessage? }
export function reportFile(kind, { report, session, now = Date.now() }) {
  const created = new Date(now);
  switch (kind) {
    case 'docx':
      return withFallback(() => ({
        filename: `${base(report, 'laporan')}.docx`, mime: DOCX_MIME,
        data: buildDocx(reportBlocks(report), { title: TITLES.report, created }),
      }), () => reportFile('doc', { report, session, now }), 'Berkas Word (.docx)', '.doc');
    case 'study':
      return withFallback(() => ({
        filename: `${base(report, 'lembar-belajar')}.docx`, mime: DOCX_MIME,
        data: buildDocx(studySheetBlocks(report), { title: TITLES.study, created }),
      }), () => reportFile('study-doc', { report, session, now }), 'Lembar Belajar (.docx)', '.doc');
    case 'xlsx':
      return withFallback(() => ({
        filename: `${base(report, 'data-hasil')}.xlsx`, mime: XLSX_MIME,
        data: buildXlsx(reportSheets(report), { title: 'Data Hasil', created }),
      }), () => reportFile('csv', { report, session, now }), 'Berkas Excel (.xlsx)', '.csv');
    case 'html':
      return { filename: `${base(report, 'laporan')}.html`, mime: 'text/html;charset=utf-8', data: htmlDocument(reportBlocks(report), { title: TITLES.report }) };
    case 'doc':
      return { filename: `${base(report, 'laporan')}.doc`, mime: 'application/msword', data: htmlDocument(reportBlocks(report), { title: TITLES.report, forWord: true }) };
    case 'study-doc':
      return { filename: `${base(report, 'lembar-belajar')}.doc`, mime: 'application/msword', data: htmlDocument(studySheetBlocks(report), { title: TITLES.study, forWord: true }) };
    case 'csv':
      return { filename: `${base(report, 'data-hasil')}.csv`, mime: 'text/csv;charset=utf-8', data: sheetsToCsv(reportSheets(report)) };
    case 'json':
      // Format cadangan sesi (DECISIONS D-29) agar dapat diimpor ulang lewat Pengaturan.
      return {
        filename: `sesi-${report.recap.sessionId}.json`, mime: 'application/json',
        data: JSON.stringify({ backupVersion: SCHEMA_VERSION, subjectId: session.subjectId, exportedAt: created.toISOString(), sessions: [session] }, null, 2),
      };
    default:
      throw new Error(`Jenis ekspor tidak dikenal: ${kind}`);
  }
}

function withFallback(make, fallback, label, ext) {
  try {
    return make();
  } catch (e) {
    return { ...fallback(), fallbackMessage: `${label} gagal dibuat (${e.message}). Sebagai gantinya disediakan berkas ${ext} yang tetap dapat dibuka.` };
  }
}
