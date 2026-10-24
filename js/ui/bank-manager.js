// Pengelola Bank Soal (SPEC 8): PIN lokal (pencegah salah tekan, BUKAN fitur
// keamanan), daftar soal dengan filter dan pratinjau, impor batch, paket review
// (+ soal kalibrasi tersembunyi), impor hasil review, review ganda, persetujuan,
// publikasi, ekspor pack, dan statistik cakupan. Semua teks lewat textContent.

import { h, append, clear, confirmDialog, alertDialog, formDialog, toast } from './dom.js';
import { disclaimer, header } from './layout.js';
import { getType } from '../types/registry.js';
import {
  BankError, STATUS_LABELS, STATUS_ORDER, adoptBuiltInLive, applyBatchImport, approve, bankStats, builtInLiveDiff, createBank, exportPackText,
  filterQuestions, findQuestion, loadBank, previewNeighbors, pendingPublication, planBatchImport, publish, resolveConflict,
  retire, returnToDraft, saveBank, taxonomyDiff, undoReject, updateTaxonomy, withTaxonomy, KEY_SHARE_LIMIT,
} from '../core/bank.js';
import {
  REVIEWABLE, applyReviewResult, buildReviewPackage, calibrationTable, checkReviewSelection,
  reviewPromptText, revisionRequestText, validateReviewResult,
} from '../core/review-io.js';
import { DIFFICULTY_LABELS } from '../core/report.js';
import { packageTimeEstimate } from '../core/blueprint.js';
import { timeStandardIssues } from '../core/time-standard.js';
import { formatErrors, loadActiveSession } from '../core/session-store.js';
import { saveImportedPack } from '../core/pack-loader.js';
import { sha256Hex } from '../core/hash.js';
import { PROMPTS } from '../core/prompts.js';
import { formatDateTime, formatNumber } from '../core/format.js';
import { saveFile } from '../export/download.js';
import { keys } from '../core/storage.js';

const REVIEW_PROMPT = 'prompt_reviewer_soal.md';
const TYPE_LABELS = { mcq: 'PG', numeric: 'Numerik', essay: 'Esai', case: 'Kasus' };
const TABS = [['soal', 'Daftar Soal'], ['impor', 'Impor Batch'], ['review', 'Review'], ['publikasi', 'Publikasi'], ['statistik', 'Statistik'], ['catatan', 'Catatan']];
const PIN_SALT = 'caSim-bank-pin:';

const pinHash = (pin) => sha256Hex(`${PIN_SALT}${pin}`);

export function renderBank(app) {
  const el = h('div', { class: 'screen bank-screen' });
  const state = { tab: 'soal', filters: {}, selected: new Set(), preview: null, batchPlan: null, batchText: '', batchErrors: [], reviewText: '', reviewCheck: null, lastPackage: null, statsScope: 'LIVE', builtInLive: null };
  let bank = null;
  start();

  async function start() {
    clear(el);
    el.append(header(app, { title: 'Pengelola Bank Soal' }));
    if (!app.pack) {
      el.append(h('p', { text: 'Belum ada Subject Pack.' }), disclaimer());
      return;
    }
    if (!app.bankUnlocked) {
      el.append(await pinGate());
      return;
    }
    const loaded = loadBank(app.store, app.pack.subjectId);
    if (loaded && !loaded.ok) {
      el.append(h('div', { class: 'notice' },
        h('p', { text: 'Data bank soal tersimpan tidak dapat dibaca:' }),
        h('ul', { class: 'error-list' }, formatErrors(loaded.errors, 10).map((t) => h('li', { text: t }))),
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn', onclick: downloadRawBank }, 'Unduh data bank lama'),
          h('button', { type: 'button', class: 'btn btn-danger', onclick: restartBank }, 'Mulai ulang dari pack'))));
      return;
    }
    bank = loaded ? loaded.bank : await createBank(app.pack, Date.now());
    if (!loaded) persist();
    await refreshBuiltInLive();
    render();
  }

  async function refreshBuiltInLive() {
    state.builtInLive = await builtInLiveDiff(bank, app.builtInPacks && app.builtInPacks[bank.subjectId]);
  }

  // ---------- PIN ----------
  async function pinGate() {
    const saved = app.settings.bankPin;
    const input = h('input', { type: 'password', inputmode: 'numeric', autocomplete: 'off', id: 'bank-pin', maxlength: 8 });
    const again = saved ? null : h('input', { type: 'password', inputmode: 'numeric', autocomplete: 'off', id: 'bank-pin2', maxlength: 8 });
    const msg = h('p', { class: 'error-list', role: 'alert' });
    const form = h('form', { class: 'card pin-card', novalidate: true },
      h('h2', { style: 'margin-top:0', text: saved ? 'Masukkan PIN' : 'Buat PIN Pengelola Bank Soal' }),
      h('p', { class: 'hint', text: 'PIN ini hanya mencegah salah tekan oleh peserta. Ini bukan fitur keamanan: kunci jawaban tetap dapat dilihat di kode sumber.' }),
      h('div', { class: 'field' }, h('label', { for: 'bank-pin', text: 'PIN (4-8 angka)' }), input),
      again ? h('div', { class: 'field' }, h('label', { for: 'bank-pin2', text: 'Ulangi PIN' }), again) : null,
      msg,
      h('div', { class: 'row' },
        h('button', { type: 'submit', class: 'btn btn-primary' }, saved ? 'Buka' : 'Simpan PIN'),
        saved ? h('button', { type: 'button', class: 'btn btn-link', onclick: resetPin }, 'Lupa PIN?') : null));
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pin = input.value.trim();
      if (!/^\d{4,8}$/.test(pin)) {
        msg.textContent = 'PIN harus 4-8 angka.';
        return;
      }
      if (!saved) {
        if (pin !== again.value.trim()) {
          msg.textContent = 'Kedua PIN tidak sama.';
          return;
        }
        app.saveSettings({ bankPin: await pinHash(pin) });
      } else if ((await pinHash(pin)) !== saved) {
        msg.textContent = 'PIN salah.';
        input.value = '';
        return;
      }
      app.bankUnlocked = true;
      start();
    });
    setTimeout(() => input.focus(), 0);
    return form;
  }

  async function resetPin() {
    const ok = await confirmDialog({
      title: 'Setel ulang PIN?',
      body: ['PIN lama dihapus dan Anda diminta membuat PIN baru. Data bank soal tidak berubah.', 'PIN hanya pencegah salah tekan, bukan pengaman data.'],
      confirmLabel: 'Setel ulang',
    });
    if (!ok) return;
    app.saveSettings({ bankPin: null });
    start();
  }

  // ---------- Penyimpanan ----------
  function persist() {
    try {
      saveBank(app.store, bank);
      return true;
    } catch (e) {
      alertDialog('Bank soal gagal disimpan', [e.message, 'Ekspor pack di tab Publikasi agar perubahan tidak hilang.']);
      return false;
    }
  }

  function downloadRawBank() {
    const raw = app.store.backend.getItem(keys.bank(app.pack.subjectId));
    saveFile({ filename: `bank-lama-${app.pack.subjectId}.json`, mime: 'application/json', data: raw || '' });
  }

  async function restartBank() {
    const ok = await confirmDialog({
      title: 'Mulai ulang bank dari pack?',
      body: [`Bank soal diganti salinan pack yang dipakai ujian sekarang (versi ${app.pack.packVersion}). Data bank lama DITIMPA; unduh lebih dulu bila masih diperlukan.`],
      confirmLabel: 'Mulai ulang', danger: true,
    });
    if (!ok) return;
    bank = await createBank(app.pack, Date.now());
    persist();
    state.selected.clear();
    await refreshBuiltInLive();
    render();
  }

  // ---------- Kerangka layar ----------
  function render() {
    const y = window.scrollY;
    clear(el);
    const differs = bank.pack.packVersion !== app.pack.packVersion;
    append(el, [
      header(app, { title: 'Pengelola Bank Soal' }),
      h('p', { class: 'hint', text: `${bank.pack.subjectName} · bank versi ${bank.pack.packVersion} · ${bank.pack.questions.length} soal · pack ujian versi ${app.pack.packVersion}` }),
      differs ? h('p', { class: 'notice', text: `Pack yang dipakai ujian (versi ${app.pack.packVersion}) berbeda dengan bank (versi ${bank.pack.packVersion}). Perubahan bank baru berlaku untuk ujian setelah Publikasikan.` }) : null,
      taxonomyNotice(),
      builtInLiveNotice(),
      h('div', { class: 'tabs', role: 'tablist' }, TABS.map(([id, label]) => h('button', {
        type: 'button', role: 'tab', 'aria-selected': String(state.tab === id), class: state.tab === id ? 'tab active' : 'tab',
        onclick: () => { state.tab = id; render(); },
      }, label))),
      { soal: soalTab, impor: imporTab, review: reviewTab, publikasi: publikasiTab, statistik: statistikTab, catatan: catatanTab }[state.tab](),
      disclaimer(),
    ]);
    if (y) window.scrollTo(0, y);
  }

  // Daftar topik/kompetensi bawaan aplikasi berubah (mis. setelah pembaruan) tetapi
  // bank dan pack ujian di perangkat masih memakai daftar lama (D-87).
  function taxonomyNotice() {
    const source = app.builtInPacks && app.builtInPacks[bank.subjectId];
    const diff = taxonomyDiff(bank, source);
    if (!diff) return null;
    const what = [diff.topics ? 'topik' : null, diff.competencies ? 'kompetensi' : null, diff.packages ? 'paket ujian' : null].filter(Boolean).join(', ').replace(/, ([^,]*)$/, ' dan $1');
    return h('div', { class: 'notice' },
      h('p', { text: `Daftar ${what} di bank soal berbeda dengan versi terbaru aplikasi (${source.topics.length} topik, ${source.competencies.length} kompetensi, paket ${source.packages.map((p) => p.name).join(', ')}). Bank, statistik, dan ujian di perangkat ini memakai daftar lama sampai diperbarui.` }),
      h('button', { type: 'button', class: 'btn', onclick: () => doUpdateTaxonomy(source) }, `Perbarui daftar ${what}`));
  }

  async function doUpdateTaxonomy(source) {
    const diff = taxonomyDiff(bank, source);
    if (!diff) return;
    if (diff.missing.length) {
      alertDialog('Daftar belum dapat diperbarui', [
        'Soal berikut memakai kode yang tidak ada di daftar terbaru. Revisi soalnya lebih dulu:',
        ...diff.missing.slice(0, 10).map((m) => `${m.questionId}: ${m.code}`),
      ]);
      return;
    }
    if (loadActiveSession(app.store, bank.subjectId)) {
      alertDialog('Ada ujian yang sedang berjalan', ['Pembaruan menunggu sampai ujian dikumpulkan.']);
      return;
    }
    const ok = await confirmDialog({
      title: 'Perbarui topik, kompetensi, dan paket?',
      body: [
        `Bank soal dan pack ujian di perangkat ini memakai ${source.topics.length} topik, ${source.competencies.length} kompetensi, dan paket ${source.packages.map((p) => p.name).join(', ')} dari versi terbaru aplikasi.`,
        'Soal, status, kode topik soal, dan versi pack tidak berubah.',
      ],
      confirmLabel: 'Perbarui',
    });
    if (!ok) return;
    const entry = app.packs.find((p) => p.pack.subjectId === bank.subjectId);
    try {
      updateTaxonomy(bank, source, Date.now());
      if (entry && entry.source === 'impor') saveImportedPack(app.store, withTaxonomy(entry.pack, source));
    } catch (e) {
      alertDialog('Pembaruan gagal', [e.message]);
      return;
    }
    persist();
    await app.reloadPacks();
    toast('Topik, kompetensi, dan paket diperbarui.');
    render();
  }

  // Soal tayang di pack bawaan aplikasi yang belum ada di bank perangkat ini,
  // mis. soal bank lama yang digabung ke repositori (D-89, D-90).
  function builtInLiveNotice() {
    const diff = state.builtInLive;
    if (!diff || !diff.add.length) return null;
    const source = app.builtInPacks[bank.subjectId];
    const ids = diff.add.map((q) => q.id);
    return h('div', { class: 'notice' },
      h('p', { text: `Versi terbaru aplikasi (pack versi ${source.packVersion}) memuat ${ids.length} soal tayang yang belum ada di bank soal perangkat ini: ${ids.length > 12 ? `${ids.slice(0, 12).join(', ')}, dan ${ids.length - 12} lainnya` : ids.join(', ')}.` }),
      diff.skipped.length ? h('p', { class: 'hint', text: `Tidak diambil: ${diff.skipped.map((s) => `${s.id} (${s.reason})`).join('; ')}.` }) : null,
      h('button', { type: 'button', class: 'btn', onclick: doAdoptBuiltInLive }, `Ambil ${ids.length} soal ke bank`));
  }

  async function doAdoptBuiltInLive() {
    const source = app.builtInPacks[bank.subjectId];
    const diff = await builtInLiveDiff(bank, source);
    if (!diff || !diff.add.length) {
      await refreshBuiltInLive();
      render();
      return;
    }
    if (diff.missing.length) {
      alertDialog('Soal belum dapat diambil', [
        'Soal berikut memakai kode topik atau kompetensi yang tidak ada di bank. Perbarui daftar topik lebih dulu:',
        ...diff.missing.slice(0, 10).map((m) => `${m.questionId}: ${m.code}`),
      ]);
      return;
    }
    if (loadActiveSession(app.store, bank.subjectId)) {
      alertDialog('Ada ujian yang sedang berjalan', ['Pengambilan soal menunggu sampai ujian dikumpulkan.']);
      return;
    }
    const ok = await confirmDialog({
      title: `Ambil ${diff.add.length} soal ke bank?`,
      body: [
        `Soal masuk ke bank dengan status ${STATUS_LABELS.LIVE} dan langsung dapat muncul di ujian perangkat ini. Versi pack naik satu tingkat.`,
        'Soal yang sudah ada di bank tidak diubah. Setelah itu, Ekspor Pack sudah memuat semua soal.',
      ],
      confirmLabel: 'Ambil soal',
    });
    if (!ok) return;
    let result;
    try {
      result = await adoptBuiltInLive(bank, source, Date.now());
      saveImportedPack(app.store, result.pack);
    } catch (e) {
      alertDialog('Pengambilan gagal', [e.message]);
      return;
    }
    persist();
    await app.reloadPacks();
    await refreshBuiltInLive();
    toast(`${result.added.length} soal diambil ke bank. Versi ${result.version}.`);
    render();
  }

  const statusBadge = (s) => h('span', { class: `badge status-${s.toLowerCase()}`, text: STATUS_LABELS[s] });
  const select = (id, label, value, options, onchange) => h('div', { class: 'field' },
    h('label', { for: id, text: label }),
    h('select', { id, onchange: (e) => onchange(e.target.value) },
      h('option', { value: '', selected: !value }, 'Semua'),
      options.map(([v, t]) => h('option', { value: v, selected: value === v }, t))));

  // ---------- Tab: Daftar Soal ----------
  function soalTab() {
    const f = state.filters;
    const list = filterQuestions(bank, f);
    const setFilter = (key) => (v) => { f[key] = v || undefined; render(); };
    const rows = list.map((q) => h('tr', { class: state.preview === q.id ? 'selected-row' : null },
      h('td', {}, h('input', {
        type: 'checkbox', checked: state.selected.has(q.id), 'aria-label': `Pilih ${q.id}`,
        onchange: (e) => { if (e.target.checked) state.selected.add(q.id); else state.selected.delete(q.id); render(); },
      })),
      h('td', {}, h('button', { type: 'button', class: 'btn-link', onclick: () => showPreview(q.id) }, q.id)),
      h('td', { text: TYPE_LABELS[q.type] + (q.caseSize ? ` ${q.caseSize}` : '') }),
      h('td', { text: q.topicIds.join(', ') }),
      h('td', { text: DIFFICULTY_LABELS[q.difficulty] }),
      h('td', {}, statusBadge(q.lifecycle.status), bank.conflicts[q.id] ? h('span', { class: 'badge badge-wait', text: 'Review berbeda' }) : null)));
    const selected = [...state.selected].filter((id) => findQuestion(bank, id));
    const shown = list.filter((q) => state.selected.has(q.id)).length;
    const selectShown = (on) => { for (const q of list) { if (on) state.selected.add(q.id); else state.selected.delete(q.id); } render(); };
    const allBox = h('input', {
      type: 'checkbox', checked: list.length > 0 && shown === list.length, disabled: !list.length,
      'aria-label': 'Pilih semua soal yang ditampilkan', onchange: (e) => selectShown(e.target.checked),
    });
    allBox.indeterminate = shown > 0 && shown < list.length;
    return h('div', {},
      h('div', { class: 'form-grid' },
        select('f-status', 'Status', f.status, STATUS_ORDER.map((s) => [s, STATUS_LABELS[s]]), setFilter('status')),
        select('f-topic', 'Topik', f.topicId, bank.pack.topics.map((t) => [t.id, `${t.id} ${t.name}`]), setFilter('topicId')),
        select('f-type', 'Tipe', f.type, Object.entries(TYPE_LABELS), setFilter('type')),
        select('f-diff', 'Kesulitan', f.difficulty, Object.entries(DIFFICULTY_LABELS), setFilter('difficulty'))),
      h('p', { class: 'hint', text: `${list.length} soal ditampilkan · ${selected.length} dipilih` }),
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn', disabled: !list.length || shown === list.length, onclick: () => selectShown(true) }, `Pilih semua (${list.length})`),
        h('button', { type: 'button', class: 'btn', disabled: !selected.length, onclick: approveSelected }, 'Setujui terpilih'),
        h('button', { type: 'button', class: 'btn', disabled: !selected.length, onclick: () => { state.tab = 'review'; render(); } }, 'Buat paket review dari terpilih'),
        h('button', { type: 'button', class: 'btn', disabled: !selected.length, onclick: () => copyRevision(selected) }, 'Salin untuk penyusun'),
        h('button', { type: 'button', class: 'btn btn-link', disabled: !selected.length, onclick: () => { state.selected.clear(); render(); } }, 'Kosongkan pilihan')),
      h('div', { class: 'table-wrap' }, h('table', { class: 'data-table bank-table' },
        h('thead', {}, h('tr', {}, h('th', {}, allBox), ['ID', 'Tipe', 'Topik', 'Kesulitan', 'Status'].map((t) => h('th', { text: t })))),
        h('tbody', {}, rows))),
      list.length ? null : h('p', { class: 'hint', text: 'Tidak ada soal yang cocok dengan filter.' }),
      state.preview && findQuestion(bank, state.preview) ? previewCard(findQuestion(bank, state.preview), list) : null);
  }

  function showPreview(id) {
    state.preview = id;
    render();
    el.querySelector('.preview-card')?.scrollIntoView({ block: 'start' });
  }

  // Sebelumnya/Berikutnya mengikuti urutan dan filter daftar soal (D-96).
  function previewNav(q, list) {
    const nav = previewNeighbors(list.map((x) => x.id), q.id);
    return h('div', { class: 'row preview-nav' },
      h('button', { type: 'button', class: 'btn', disabled: !nav.prev, onclick: () => showPreview(nav.prev) }, '‹ Sebelumnya'),
      h('span', { class: 'hint', style: 'flex:1;text-align:center', text: nav.index >= 0 ? `Soal ${nav.index + 1} dari ${nav.total}` : 'Soal ini tidak termasuk filter yang dipilih' }),
      h('button', { type: 'button', class: 'btn', disabled: !nav.next, onclick: () => showPreview(nav.next) }, 'Berikutnya ›'));
  }

  function previewCard(q, list) {
    const item = { questionId: q.id, type: q.type, optionOrder: ['A', 'B', 'C', 'D'] };
    const view = getType(q.type).render(q, { item, value: null, readOnly: true, onChange: () => {} });
    const s = q.lifecycle.status;
    const review = q.lifecycle.review;
    const actions = [];
    if (s === 'AI_REVIEWED' && !bank.conflicts[q.id]) actions.push(h('button', { type: 'button', class: 'btn btn-primary', onclick: () => approveIds([q.id]) }, 'Setujui'));
    if (bank.conflicts[q.id]) actions.push(h('button', { type: 'button', class: 'btn btn-primary', onclick: () => decideConflict(q.id) }, 'Putuskan hasil review'));
    if (review && s !== 'CALIBRATION') actions.push(h('button', { type: 'button', class: s === 'NEEDS_REVISION' ? 'btn btn-primary' : 'btn', onclick: () => copyRevision([q.id]) }, 'Salin untuk penyusun'));
    if (s === 'NEEDS_REVISION') actions.push(h('button', { type: 'button', class: 'btn', onclick: () => withReason(q.id, 'Kembalikan ke Draf', returnToDraft) }, 'Kembalikan ke Draf'));
    if (s === 'REJECTED') actions.push(h('button', { type: 'button', class: 'btn', onclick: () => withReason(q.id, 'Batalkan penolakan', undoReject) }, 'Batalkan penolakan'));
    if (s === 'LIVE') actions.push(h('button', { type: 'button', class: 'btn', onclick: () => withReason(q.id, 'Pensiunkan soal', retire) }, 'Pensiunkan'));
    return h('div', { class: 'card preview-card' },
      previewNav(q, list),
      h('div', { class: 'row' }, h('h2', { style: 'margin:0;flex:1', text: `Pratinjau ${q.id}` }), statusBadge(s),
        h('button', { type: 'button', class: 'btn btn-icon', 'aria-label': 'Tutup pratinjau', onclick: () => { state.preview = null; render(); } }, '×')),
      h('p', { class: 'hint', text: `${TYPE_LABELS[q.type]} · ${q.topicIds.join(', ')} · ${q.competencyIds.join(', ')} · ${DIFFICULTY_LABELS[q.difficulty]} · ${q.cognitiveLevel} · ${formatNumber(q.estimatedMinutes)} menit` }),
      timeStandardNotice(q),
      h('div', { class: 'preview-view' }, view),
      h('details', { open: true }, h('summary', { text: 'Kunci, pembahasan, dan rubrik' }), answerKeyView(q)),
      review ? h('details', {}, h('summary', { text: `Hasil review terakhir: ${review.result.verdict} (${review.reviewerModel})` }), reviewView(review.result)) : null,
      bank.conflicts[q.id] ? h('div', { class: 'notice' }, h('p', { text: 'Dua review berbeda pendapat; wajib keputusan manusia:' }),
        h('ul', {}, bank.conflicts[q.id].decisions.map((d) => h('li', { text: `${d.reviewerModel}: ${d.verdict} → ${STATUS_LABELS[d.decision]} (${d.batchId})` })))) : null,
      q.lifecycle.history && q.lifecycle.history.length ? h('details', {}, h('summary', { text: 'Riwayat status' }),
        h('ul', {}, q.lifecycle.history.map((x) => h('li', { text: `${formatDateTime(x.at)}: ${STATUS_LABELS[x.from]} → ${STATUS_LABELS[x.to]}${x.by ? ` oleh ${x.by}` : ''}${x.reason ? ` — ${x.reason}` : ''}` })))) : null,
      q.calibration ? h('p', { class: 'notice', text: `Soal kalibrasi: cacat sengaja pada ${q.calibration.defectDimension} — ${q.calibration.defectDescription} (verdict yang diharapkan ${q.calibration.expectedVerdict}).` }) : null,
      actions.length ? h('div', { class: 'row' }, actions) : null);
  }

  function answerKeyView(q) {
    const lines = [];
    if (q.type === 'mcq') {
      lines.push(h('p', {}, h('strong', { text: 'Kunci: ' }), `${q.answerKey}. ${q.options.find((o) => o.key === q.answerKey).text}`));
      lines.push(h('ul', {}, Object.entries(q.distractorRationale).map(([k, t]) => h('li', { text: `${k}: ${t}` }))));
    }
    if (q.type === 'numeric') {
      const na = q.numericAnswer;
      lines.push(h('p', {}, h('strong', { text: 'Kunci: ' }), `${formatNumber(na.value)} ${na.unit} (toleransi ${na.tolerance.type === 'relative' ? `${formatNumber(na.tolerance.value * 100)}%` : formatNumber(na.tolerance.value)})`));
    }
    if (q.explanation) lines.push(h('p', { class: 'prose' }, h('strong', { text: 'Pembahasan: ' }), q.explanation));
    if (q.modelAnswer) lines.push(h('p', { class: 'prose' }, h('strong', { text: 'Jawaban ideal: ' }), q.modelAnswer));
    const rubricRows = (rubric, sub) => rubric.map((c) => h('tr', {}, h('td', { text: sub || '—' }), h('td', { text: c.criterionId }), h('td', { text: c.description }), h('td', { class: 'num', text: formatNumber(c.maxScore) })));
    if (q.rubric || q.subQuestions) {
      if (q.subQuestions) q.subQuestions.forEach((s) => lines.push(h('p', { class: 'prose' }, h('strong', { text: `(${s.id}) Jawaban ideal: ` }), s.modelAnswer)));
      lines.push(h('div', { class: 'table-wrap' }, h('table', { class: 'data-table' },
        h('thead', {}, h('tr', {}, ['Bagian', 'Kriteria', 'Deskripsi', 'Maks'].map((t) => h('th', { text: t })))),
        h('tbody', {}, q.rubric ? rubricRows(q.rubric) : q.subQuestions.flatMap((s) => rubricRows(s.rubric, `(${s.id})`))))));
    }
    if (q.acceptableAlternatives) lines.push(h('p', { class: 'prose' }, h('strong', { text: 'Alternatif yang diterima: ' }), q.acceptableAlternatives));
    return h('div', {}, lines);
  }

  function reviewView(r) {
    return h('div', {},
      h('p', { text: `Kesepakatan kunci: ${r.keyAgreement} · keyakinan ${r.confidence} · kesulitan disarankan ${DIFFICULTY_LABELS[r.suggestedDifficulty]}` }),
      h('p', { class: 'prose', text: r.summary }),
      h('p', { class: 'prose' }, h('strong', { text: 'Jawaban independen reviewer: ' }), r.independentAnswer),
      h('p', { text: Object.entries(r.dimensionScores).map(([k, v]) => `${k} ${v ?? '—'}`).join(' · ') }),
      r.findings.length ? h('ul', {}, r.findings.map((f) => h('li', { text: `[${f.severity}] ${f.dimension}: ${f.issue}${f.suggestedFix ? ` — Saran: ${f.suggestedFix}` : ''}` }))) : h('p', { class: 'hint', text: 'Tanpa temuan.' }));
  }

  async function askInitials(title, body) {
    const input = h('input', { type: 'text', id: 'initials', autocomplete: 'off', maxlength: 15 });
    let value = '';
    const ok = await formDialog({
      title, confirmLabel: 'Setujui',
      body: [...body.map((b) => h('p', { text: b })), h('div', { class: 'field' }, h('label', { for: 'initials', text: 'Inisial penyetuju' }), input)],
      validate: () => {
        value = input.value.trim();
        return /^[A-Za-z][A-Za-z. ]{0,14}$/.test(value) ? null : 'Isi inisial (huruf, maks 15 karakter).';
      },
    });
    return ok ? value : null;
  }

  async function approveIds(ids) {
    const initials = await askInitials(`Setujui ${ids.length} soal?`, [`Soal: ${ids.join(', ')}.`, 'Dengan menyetujui, Anda menyatakan sudah membaca soal, kunci, dan hasil review.']);
    if (!initials) return;
    try {
      approve(bank, ids, initials, Date.now());
    } catch (e) {
      alertDialog('Belum dapat disetujui', [e.message]);
      return;
    }
    if (persist()) toast(`${ids.length} soal disetujui. Publikasikan agar tayang di ujian.`);
    state.selected.clear();
    render();
  }

  function approveSelected() {
    approveIds([...state.selected].filter((id) => findQuestion(bank, id)));
  }

  async function withReason(id, title, action) {
    const reason = h('textarea', { id: 'reason', class: 'answer-text', rows: 3 });
    const by = h('input', { type: 'text', id: 'by', maxlength: 15 });
    const ok = await formDialog({
      title: `${title} ${id}`, confirmLabel: title,
      body: [h('div', { class: 'field' }, h('label', { for: 'by', text: 'Inisial' }), by), h('div', { class: 'field' }, h('label', { for: 'reason', text: 'Alasan (wajib)' }), reason)],
      validate: () => { action(bank, id, { by: by.value, reason: reason.value }, Date.now()); return null; },
    });
    if (!ok) return;
    if (persist()) toast('Tersimpan.');
    render();
  }

  async function decideConflict(id) {
    const c = bank.conflicts[id];
    const choice = h('select', { id: 'decision' }, [...new Set(c.decisions.map((d) => d.decision))].map((d) => h('option', { value: d }, STATUS_LABELS[d])));
    const reason = h('textarea', { id: 'reason', class: 'answer-text', rows: 3 });
    const by = h('input', { type: 'text', id: 'by', maxlength: 15 });
    const ok = await formDialog({
      title: `Putuskan review ${id}`, confirmLabel: 'Simpan keputusan',
      body: [
        h('ul', {}, c.decisions.map((d) => h('li', { text: `${d.reviewerModel}: ${d.verdict}` }))),
        h('div', { class: 'field' }, h('label', { for: 'decision', text: 'Keputusan' }), choice),
        h('div', { class: 'field' }, h('label', { for: 'by', text: 'Inisial' }), by),
        h('div', { class: 'field' }, h('label', { for: 'reason', text: 'Alasan (wajib)' }), reason),
      ],
      validate: () => { resolveConflict(bank, id, choice.value, { by: by.value, reason: reason.value }, Date.now()); return null; },
    });
    if (!ok) return;
    if (persist()) toast('Keputusan tersimpan.');
    render();
  }

  // ---------- Tab: Impor Batch ----------
  function imporTab() {
    const area = h('textarea', { class: 'answer-text paste-area', rows: 10, spellcheck: 'false', 'aria-label': 'Tempel batch soal dari penyusun', placeholder: 'Tempel seluruh keluaran AI penyusun (blok JSON dan Catatan penyusun).', oninput: () => { state.batchText = area.value; state.batchPlan = null; } });
    area.value = state.batchText;
    const file = h('input', { type: 'file', accept: '.json,.txt,application/json,text/plain', hidden: true, onchange: async () => { const f = file.files[0]; file.value = ''; if (f) { state.batchText = await f.text(); await checkBatch(); } } });
    const plan = state.batchPlan;
    return h('div', { class: 'card' },
      h('h2', { style: 'margin-top:0', text: 'Impor batch soal' }),
      h('p', { class: 'hint', text: 'Soal baru masuk sebagai Draf. Soal dengan ID yang sudah ada dianggap revisi: bila isinya berubah, statusnya kembali Draf dan perlu review ulang. Batch soal kalibrasi (status CALIBRATION) diimpor terpisah.' }),
      area,
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn btn-primary', onclick: checkBatch }, 'Periksa batch'),
        h('button', { type: 'button', class: 'btn', onclick: () => file.click() }, 'Ambil dari berkas'), file),
      state.batchErrors.length ? h('div', { class: 'notice import-errors', role: 'alert' },
        h('p', {}, h('strong', { text: 'Batch ditolak.' }), ' Tidak ada soal yang diimpor. Perbaiki hal berikut (atau minta AI penyusun memperbaikinya):'),
        h('ul', { class: 'error-list' }, formatErrors(state.batchErrors, 30).map((t) => h('li', { text: t })))) : null,
      plan ? h('div', {},
        h('h3', { text: `Batch ${plan.batch.batchId}${plan.calibration ? ' (kalibrasi)' : ''}: ${plan.entries.length} soal lolos lint` }),
        h('div', { class: 'table-wrap' }, h('table', { class: 'data-table' },
          h('thead', {}, h('tr', {}, ['ID', 'Tipe', 'Tindakan', 'Status sesudah impor'].map((t) => h('th', { text: t })))),
          h('tbody', {}, plan.entries.map((e) => h('tr', {},
            h('td', { text: e.question.id }), h('td', { text: TYPE_LABELS[e.question.type] }),
            h('td', { text: e.action === 'baru' ? 'Soal baru' : e.action === 'revisi' ? `Revisi (isi berubah; sebelumnya ${STATUS_LABELS[e.previousStatus]})` : e.previousStatus === 'NEEDS_REVISION' ? 'Tidak ada perubahan (tetap Perlu revisi)' : 'Isi sama (status tetap)' }),
            h('td', { text: STATUS_LABELS[e.action === 'sama' ? e.previousStatus : plan.calibration ? 'CALIBRATION' : 'DRAFT'] })))))),
        timeWarningsNotice(plan.entries),
        plan.notes ? h('p', { class: 'prose hint', text: plan.notes }) : null,
        h('button', { type: 'button', class: 'btn btn-primary', onclick: doImportBatch }, 'Impor ke bank')) : null);
  }

  function timeStandardNotice(q) {
    const issues = timeStandardIssues(q);
    return issues.length ? h('p', { class: 'notice', text: `Tidak sesuai standar waktu: ${issues.join('; ')}.` }) : null;
  }

  // Peringatan standar waktu (SPEC 6.2, D-100): batch tetap dapat diimpor.
  function timeWarningsNotice(entries) {
    const flagged = entries.filter((e) => e.warnings && e.warnings.length);
    if (!flagged.length) return h('p', { class: 'hint', text: 'Semua soal sesuai standar waktu dan batas panjang tingkat kesulitannya.' });
    return h('div', { class: 'notice' },
      h('p', { text: `${flagged.length} soal tidak sesuai standar waktu (batch tetap dapat diimpor). Kirim daftar ini ke penyusun bila perlu diperbaiki:` }),
      h('ul', {}, flagged.map((e) => h('li', { text: `${e.question.id}: ${e.warnings.join('; ')}` }))));
  }

  async function checkBatch() {
    state.batchPlan = null;
    const plan = await planBatchImport(bank, state.batchText);
    state.batchErrors = plan.ok ? [] : plan.errors;
    state.batchPlan = plan.ok ? plan : null;
    render();
  }

  async function doImportBatch() {
    const plan = state.batchPlan;
    const revised = plan.entries.filter((e) => e.action === 'revisi' && !['DRAFT', 'NEEDS_REVISION', 'CALIBRATION'].includes(e.previousStatus));
    if (revised.length) {
      const ok = await confirmDialog({
        title: 'Ada soal yang kembali ke Draf',
        body: [`Isi soal berikut berubah sehingga status, hasil review, dan persetujuannya dikosongkan: ${revised.map((e) => `${e.question.id} (${STATUS_LABELS[e.previousStatus]})`).join(', ')}.`, 'Soal LIVE yang direvisi tidak lagi tayang setelah publikasi berikutnya.'],
        confirmLabel: 'Impor', danger: true,
      });
      if (!ok) return;
    }
    const counts = applyBatchImport(bank, plan, Date.now());
    if (persist()) toast(`Batch diimpor: ${counts.baru} baru, ${counts.revisi} revisi, ${counts.sama} tanpa perubahan isi.`);
    state.batchPlan = null;
    state.batchText = '';
    render();
  }

  // ---------- Tab: Review ----------
  function reviewTab() {
    const selected = [...state.selected].filter((id) => findQuestion(bank, id));
    const problems = selected.length ? checkReviewSelection(bank, selected) : [];
    const calibrations = bank.pack.questions.filter((q) => q.lifecycle.status === 'CALIBRATION').length;
    const withCal = h('input', { type: 'checkbox', id: 'with-cal', checked: calibrations > 0, disabled: calibrations === 0 });
    const area = h('textarea', { class: 'answer-text paste-area', rows: 8, spellcheck: 'false', 'aria-label': 'Tempel hasil review dari AI', placeholder: 'Tempel seluruh jawaban AI reviewer (diawali { dan diakhiri }).', oninput: () => { state.reviewText = area.value; state.reviewCheck = null; } });
    area.value = state.reviewText;
    const file = h('input', { type: 'file', accept: '.json,.txt,application/json,text/plain', hidden: true, onchange: async () => { const f = file.files[0]; file.value = ''; if (f) { state.reviewText = await f.text(); checkReview(); } } });
    const v = state.reviewCheck;
    const reviewable = bank.pack.questions.filter((q) => REVIEWABLE.includes(q.lifecycle.status)).length;
    return h('div', {},
      h('div', { class: 'card' },
        h('h2', { style: 'margin-top:0', text: 'Langkah 1 — Ekspor paket review' }),
        h('p', { class: 'hint', text: `Pilih soal Draf (atau Lolos review AI untuk review ganda) di tab Daftar Soal. Satu paket: maks 10 PG/numerik, 5 esai, atau 2 kasus. Tersedia ${reviewable} soal yang dapat direview.` }),
        h('p', { text: selected.length ? `Dipilih: ${selected.join(', ')}` : 'Belum ada soal dipilih.' }),
        problems.length ? h('ul', { class: 'error-list' }, problems.map((p) => h('li', { text: p }))) : null,
        h('label', { class: 'check' }, withCal, `Sisipkan soal kalibrasi (${calibrations} tersedia)`),
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn btn-primary', disabled: !selected.length || problems.length > 0, onclick: () => makePackage(withCal.checked) }, 'Buat paket review'),
          h('button', { type: 'button', class: 'btn', onclick: () => { state.filters = { status: 'DRAFT' }; state.tab = 'soal'; render(); } }, 'Pilih soal Draf'))),
      pendingCard(),
      h('div', { class: 'card' },
        h('h2', { style: 'margin-top:0', text: 'Langkah 2 — Impor hasil review' }),
        area,
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn btn-primary', onclick: checkReview }, 'Periksa hasil'),
          h('button', { type: 'button', class: 'btn', onclick: () => file.click() }, 'Ambil dari berkas'), file),
        v && !v.ok ? h('div', { class: 'notice import-errors', role: 'alert' },
          h('p', {}, h('strong', { text: 'Hasil review ditolak.' }), ' Tidak ada yang disimpan. Perbaiki hal berikut:'),
          h('ul', { class: 'error-list' }, formatErrors(v.errors, 25).map((t) => h('li', { text: t })))) : null,
        v && v.ok ? reviewSummary(v) : null),
      calibrationCard(),
      conflictsCard());
  }

  function pendingCard() {
    const list = [...bank.pendingReviews].reverse().slice(0, 8);
    if (!list.length) return null;
    return h('div', { class: 'card' },
      h('h3', { style: 'margin-top:0', text: 'Paket review' }),
      h('ul', { class: 'pending-list' }, list.map((p) => h('li', {},
        h('span', { text: `${p.batchId} · ${formatDateTime(p.exportedAt)} · ${Object.keys(p.keyMap).length} soal · ${p.imports.length ? p.imports.map((i) => `${i.reviewerModel}: ${i.outcome === 'DITERAPKAN' ? 'diterapkan' : 'ditolak (kalibrasi)'}`).join('; ') : 'menunggu hasil'}` }),
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn btn-small', onclick: () => copyPackage(p.package) }, 'Salin Prompt + Data'),
          h('button', { type: 'button', class: 'btn btn-small', onclick: () => saveFile({ filename: `paket-review-${p.batchId}.txt`, mime: 'text/plain;charset=utf-8', data: reviewPromptText(PROMPTS[REVIEW_PROMPT], p.package) }) }, 'Unduh teks'),
          h('button', { type: 'button', class: 'btn btn-small', onclick: () => saveFile({ filename: `paket-review-${p.batchId}.json`, mime: 'application/json', data: JSON.stringify(p.package, null, 2) }) }, 'Unduh JSON'))))));
  }

  async function makePackage(includeCalibration) {
    const ids = [...state.selected].filter((id) => findQuestion(bank, id));
    let pkg;
    try {
      pkg = await buildReviewPackage(bank, ids, { includeCalibration, now: Date.now() });
    } catch (e) {
      alertDialog('Paket review belum dapat dibuat', [e.message]);
      return;
    }
    if (!persist()) return;
    state.selected.clear();
    toast(`Paket ${pkg.batchId} dibuat (${pkg.items.length} soal). Salin Prompt + Data lalu tempel ke AI reviewer.`);
    render();
  }

  function copyPackage(pkg) {
    return copyText(reviewPromptText(PROMPTS[REVIEW_PROMPT], pkg), 'Prompt + data tersalin. Tempel ke percakapan baru di AI reviewer.', 'Prompt dan paket review');
  }

  function copyRevision(ids) {
    let text;
    try {
      text = revisionRequestText(bank, ids);
    } catch (e) {
      alertDialog('Tidak dapat menyalin', [e.message]);
      return;
    }
    copyText(text, `Temuan dan soal ${ids.join(', ')} tersalin. Tempel ke Project penyusun.`, 'Permintaan revisi untuk penyusun');
  }

  async function copyText(text, okMessage, label) {
    try {
      await navigator.clipboard.writeText(text);
      toast(okMessage);
    } catch {
      const box = h('textarea', { class: 'answer-text', rows: 10, readonly: true, 'aria-label': label });
      box.value = text;
      alertDialog('Salin secara manual', ['Papan klip tidak dapat diakses otomatis. Pilih semua teks di bawah lalu salin.', box]);
      setTimeout(() => { box.focus(); box.select(); }, 50);
    }
  }

  function checkReview() {
    state.reviewCheck = validateReviewResult(bank, state.reviewText);
    render();
  }

  function reviewSummary(v) {
    const rows = v.result.items.filter((i) => i.reviewKey !== v.pending.calibrationKey).map((i) => {
      const q = findQuestion(bank, v.pending.keyMap[i.reviewKey].questionId);
      return h('tr', {}, h('td', { text: q.id }), h('td', { text: i.verdict }), h('td', { text: String(i.findings.length) }), h('td', { text: i.summary }));
    });
    return h('div', {},
      h('h3', { text: `${v.result.batchId} · reviewer ${v.result.reviewerModel}` }),
      v.calibration ? h('p', { class: v.calibration.caught ? 'notice notice-info' : 'notice', text: v.calibration.caught
        ? 'Soal kalibrasi tertangkap reviewer. Hasil dapat diterapkan.'
        : 'Soal kalibrasi TIDAK tertangkap reviewer. Bila disimpan, SELURUH hasil batch ini ditolak dan hanya dicatat; status soal tidak berubah.' }) : h('p', { class: 'hint', text: 'Paket ini tanpa soal kalibrasi.' }),
      h('div', { class: 'table-wrap' }, h('table', { class: 'data-table' },
        h('thead', {}, h('tr', {}, ['Soal', 'Verdict', 'Temuan', 'Ringkasan'].map((t) => h('th', { text: t })))), h('tbody', {}, rows))),
      v.warnings.length ? h('ul', { class: 'hint' }, v.warnings.map((w) => h('li', { text: w }))) : null,
      h('button', { type: 'button', class: 'btn btn-primary', onclick: doApplyReview }, v.calibration && !v.calibration.caught ? 'Catat penolakan' : 'Terapkan hasil review'));
  }

  function doApplyReview() {
    const outcome = applyReviewResult(bank, state.reviewCheck, Date.now());
    if (!persist()) return;
    state.reviewCheck = null;
    state.reviewText = '';
    if (outcome.rejectedByCalibration) {
      alertDialog('Hasil review ditolak', ['Soal kalibrasi tidak tertangkap, jadi seluruh hasil batch ditolak. Kejadian ini dicatat di statistik kalibrasi. Soal tetap Draf; ulangi review dengan reviewer lain.']);
    } else {
      const conflicts = outcome.decisions.filter((d) => d.conflict).length;
      toast(`Hasil review diterapkan pada ${outcome.decisions.length} soal${conflicts ? `; ${conflicts} soal perlu keputusan Anda` : ''}.`);
    }
    render();
  }

  function calibrationCard() {
    const table = calibrationTable(bank);
    return h('div', { class: 'card' },
      h('h3', { style: 'margin-top:0', text: 'Statistik tangkapan kalibrasi per reviewer' }),
      table.length ? h('div', { class: 'table-wrap' }, h('table', { class: 'data-table' },
        h('thead', {}, h('tr', {}, ['Reviewer', 'Tertangkap', 'Lolos', 'Tingkat tangkap', 'Terakhir'].map((t) => h('th', { text: t })))),
        h('tbody', {}, table.map((r) => h('tr', {}, h('td', { text: r.model }), h('td', { class: 'num', text: String(r.caught) }), h('td', { class: 'num', text: String(r.missed) }),
          h('td', { class: 'num', text: r.rate === null ? '—' : `${formatNumber(Math.round(r.rate * 1000) / 10)}%` }), h('td', { text: r.lastAt ? formatDateTime(r.lastAt) : '—' }))))))
        : h('p', { class: 'hint', text: 'Belum ada hasil review dengan soal kalibrasi.' }));
  }

  function conflictsCard() {
    const ids = Object.keys(bank.conflicts);
    if (!ids.length) return null;
    return h('div', { class: 'card' },
      h('h3', { style: 'margin-top:0', text: 'Review ganda berbeda pendapat' }),
      h('ul', {}, ids.map((id) => h('li', {}, `${id}: ${bank.conflicts[id].decisions.map((d) => `${d.reviewerModel} ${d.verdict}`).join(' vs ')} `,
        h('button', { type: 'button', class: 'btn btn-small', onclick: () => decideConflict(id) }, 'Putuskan')))));
  }

  // ---------- Tab: Publikasi ----------
  function publikasiTab() {
    const pending = pendingPublication(bank, app.pack);
    const notes = h('textarea', { id: 'pub-notes', class: 'answer-text', rows: 2, placeholder: 'Catatan changelog (opsional; bila kosong dibuat otomatis)' });
    const active = loadActiveSession(app.store, bank.subjectId);
    return h('div', {},
      h('div', { class: 'card' },
        h('h2', { style: 'margin-top:0', text: 'Publikasikan' }),
        h('p', { text: `Akan tayang: ${pending.approved.length ? pending.approved.join(', ') : 'tidak ada (setujui soal lebih dulu)'}` }),
        pending.leaving.length ? h('p', { text: `Tidak lagi tayang: ${pending.leaving.join(', ')}` }) : null,
        h('p', { class: 'hint', text: `Versi pack naik dari ${bank.pack.packVersion} ke versi minor berikutnya dan changelog diperbarui. Ujian memakai pack baru ini mulai sesi berikutnya.` }),
        active ? h('p', { class: 'notice', text: 'Ada ujian yang sedang berjalan. Publikasi menunggu sampai ujian dikumpulkan.' }) : null,
        h('div', { class: 'field' }, h('label', { for: 'pub-notes', text: 'Catatan changelog' }), notes),
        h('button', { type: 'button', class: 'btn btn-primary', disabled: Boolean(active) || (!pending.approved.length && !pending.leaving.length), onclick: () => doPublish(notes.value) }, 'Publikasikan')),
      h('div', { class: 'card' },
        h('h2', { style: 'margin-top:0', text: 'Ekspor Pack' }),
        h('p', { class: 'hint', text: 'Mengunduh pack.json lengkap (semua status soal) untuk disimpan ke repositori, lalu jalankan tools/build-pack.mjs.' }),
        h('button', { type: 'button', class: 'btn', onclick: doExportPack }, 'Ekspor Pack (pack.json)')),
      h('div', { class: 'card' },
        h('h3', { style: 'margin-top:0', text: 'Changelog' }),
        h('ul', {}, [...bank.pack.changelog].reverse().map((c) => h('li', { text: `${c.version} (${c.date}): ${c.notes}` })))));
  }

  async function doPublish(notes) {
    const pending = pendingPublication(bank, app.pack);
    const ok = await confirmDialog({
      title: 'Publikasikan perubahan?',
      body: [`${pending.approved.length} soal akan tayang${pending.leaving.length ? ` dan ${pending.leaving.length} soal tidak lagi tayang` : ''}.`, 'Pack yang dipakai ujian di perangkat ini akan diganti versi baru.'],
      confirmLabel: 'Publikasikan',
    });
    if (!ok) return;
    if (loadActiveSession(app.store, bank.subjectId)) {
      alertDialog('Ada ujian yang sedang berjalan', ['Publikasi menunggu sampai ujian dikumpulkan.']);
      return;
    }
    let result;
    try {
      result = publish(bank, Date.now(), { notes, publishedPack: app.pack });
    } catch (e) {
      alertDialog('Publikasi gagal', [e.message]);
      return;
    }
    try {
      saveImportedPack(app.store, result.pack);
    } catch (e) {
      alertDialog('Pack gagal disimpan', [e.message]);
      return;
    }
    persist();
    await app.reloadPacks();
    toast(`Versi ${result.version} dipublikasikan.`);
    render();
  }

  function doExportPack() {
    try {
      saveFile({ filename: 'pack.json', mime: 'application/json', data: exportPackText(bank) });
    } catch (e) {
      alertDialog('Pack tidak dapat diekspor', [e.message]);
    }
  }

  // ---------- Tab: Statistik ----------
  function statistikTab() {
    const scopes = { LIVE: ['LIVE'], AKTIF: ['DRAFT', 'AI_REVIEWED', 'APPROVED', 'LIVE', 'NEEDS_REVISION'] };
    const s = bankStats(bank, scopes[state.statsScope]);
    const scopeSel = h('select', { id: 'stat-scope', onchange: (e) => { state.statsScope = e.target.value; render(); } },
      h('option', { value: 'LIVE', selected: state.statsScope === 'LIVE' }, 'Soal tayang (LIVE)'),
      h('option', { value: 'AKTIF', selected: state.statsScope === 'AKTIF' }, 'Semua kecuali Ditolak, Dipensiunkan, Kalibrasi'));
    const table = (head, rows) => h('div', { class: 'table-wrap' }, h('table', { class: 'data-table' },
      h('thead', {}, h('tr', {}, head.map((t) => h('th', { text: t })))), h('tbody', {}, rows)));
    const num = (n) => h('td', { class: 'num', text: String(n) });
    // Perkiraan waktu paket dibanding durasinya (D-98).
    const scoped = bank.pack.questions.filter((q) => scopes[state.statsScope].includes(q.lifecycle.status));
    const times = bank.pack.packages.map((p) => ({ p, t: packageTimeEstimate(scoped, p) }));
    const over = times.filter(({ t }) => t.over);
    const sectionText = (x) => `${x.count} ${x.label}: ${x.minutes === null ? 'belum ada soal' : `±${x.minutes} mnt`}${x.suggested !== null ? ` (saran ${x.suggested})` : ''}`;
    return h('div', {},
      h('div', { class: 'card' },
        h('h3', { style: 'margin-top:0', text: 'Jumlah soal per status' }),
        table(['Status', 'Jumlah'], STATUS_ORDER.map((st) => h('tr', {}, h('td', { text: STATUS_LABELS[st] }), num(s.byStatus[st]))))),
      h('div', { class: 'card' },
        h('div', { class: 'field' }, h('label', { for: 'stat-scope', text: 'Hitung untuk' }), scopeSel),
        h('h3', { text: 'Perkiraan waktu paket' }),
        over.length
          ? h('p', { class: 'notice', text: `Perkiraan waktu mengerjakan melebihi durasi pada paket ${over.map(({ p, t }) => `${p.name} (±${t.minutes} dari ${t.durationMinutes} menit)`).join(', ')}. Peserta kemungkinan tidak sempat menyelesaikan semua soal. Periksa perkiraan waktu soal atau durasi paket.` })
          : h('p', { class: 'hint', text: 'Perkiraan waktu semua paket masih dalam durasinya.' }),
        table(['Paket', 'Durasi', 'Perkiraan', 'Rincian'], times.map(({ p, t }) => h('tr', { class: t.over ? 'warn-row' : null },
          h('td', { text: p.name }), num(`${t.durationMinutes} mnt`), num(`±${t.minutes} mnt${t.incomplete ? '*' : ''}`),
          h('td', { text: t.sections.map(sectionText).join('; ') })))),
        h('p', { class: 'hint', text: 'Perkiraan = jumlah soal × rata-rata perkiraan waktu soal yang dapat dipilih untuk bagian itu. Tanda * berarti ada bagian yang belum punya soal.' }),
        h('h3', { text: `Cakupan topik (${s.total} soal)` }),
        table(['Topik', 'PG', 'Numerik', 'Esai', 'Kasus', 'Total'], s.topics.map((t) => h('tr', {},
          h('td', { text: `${t.id} ${t.name}` }), num(t.mcq), num(t.numeric), num(t.essay), num(t.case), num(t.total)))),
        h('p', { class: 'hint', text: `Kasus mini ${s.caseSizes.mini}, komprehensif ${s.caseSizes.komprehensif}.` }),
        h('h3', { text: 'Kesulitan per tipe' }),
        table(['Tipe', ...Object.values(DIFFICULTY_LABELS)], Object.entries(s.difficulty).map(([type, d]) => h('tr', {},
          h('td', { text: TYPE_LABELS[type] }), ...Object.keys(DIFFICULTY_LABELS).map((k) => num(d[k]))))),
        h('h3', { text: 'Posisi kunci PG' }),
        table(['Kunci', 'Jumlah', 'Persentase'], Object.entries(s.keyCounts).map(([k, n]) => h('tr', { class: s.overKey.includes(k) ? 'warn-row' : null },
          h('td', { text: k }), num(n), h('td', { class: 'num', text: `${formatNumber(Math.round(s.keyShares[k] * 1000) / 10)}%` })))),
        s.overKey.length ? h('p', { class: 'notice', text: `Kunci ${s.overKey.join(', ')} melebihi ${KEY_SHARE_LIMIT * 100}% dari seluruh PG (SPEC 7).` }) : h('p', { class: 'hint', text: `Tidak ada huruf kunci di atas ${KEY_SHARE_LIMIT * 100}%.` })));
  }

  // ---------- Tab: Catatan ----------
  function catatanTab() {
    return h('div', { class: 'card' },
      h('h2', { style: 'margin-top:0', text: 'Catatan aktivitas bank' }),
      h('ul', { class: 'log-list' }, [...bank.log].reverse().slice(0, 200).map((l) => h('li', { text: `${formatDateTime(l.at)} — ${l.message}` }))));
  }

  return {
    el,
    destroy() {},
  };
}

