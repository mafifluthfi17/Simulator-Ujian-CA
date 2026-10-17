// Daftar suite tes bersama: dijalankan oleh node --test (tests/run.test.mjs)
// dan oleh index.html?selftest (js/selftest.js).
import contract from './contract.js';
import core from './core.js';
import grading from './grading.js';
import exportSuite from './export.js';
import exportQa from './export-qa.js';
import bank from './bank.js';
import pwa from './pwa.js';
import ui from './ui.js';

export default [contract, core, grading, exportSuite, exportQa, bank, pwa, ui];
