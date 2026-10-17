// Pengaturan: suara, IMPOR SUBJECT PACK (wajib di semua platform, SPEC 2),
// cadangan sesi (ekspor/impor, SPEC 9), dan masalah pemuatan data.

import { h, confirmDialog, alertDialog, toast } from './dom.js';
import { disclaimer, header } from './layout.js';
import { removeImportedPack, saveImportedPack, validatePackText } from '../core/pack-loader.js';
import { applyBackupImport, loadActiveSession, makeBackup, planBackupImport } from '../core/session-store.js';
import { parseJsonText } from '../core/contract.js';

export function renderSettings(app) {
  const el = h('div', { class: 'screen' }, header(app, { title: 'Pengaturan' }));

  el.append(h('div', { class: 'card' },
    h('h2', { style: 'margin-top:0', text: 'Suara' }),
    h('label', { class: 'check' },
      h('input', { type: 'checkbox', checked: app.settings.sound, onchange: (e) => app.saveSettings({ sound: e.target.checked }) }),
      'Bunyi peringatan sisa waktu (15, 5, dan 1 menit)'),
    h('p', { class: 'hint', text: 'Di iPhone/iPad, suara aktif setelah Anda mengetuk MULAI.' })));

  const packInput = h('input', { type: 'file', accept: '.json,application/json', hidden: true, onchange: () => importPack(packInput) });
  el.append(h('div', { class: 'card' },
    h('h2', { style: 'margin-top:0', text: 'Subject Pack' }),
    app.packs.length ? h('ul', {}, app.packs.map(({ pack, source }) => h('li', {},
      `${pack.subjectName} — versi ${pack.packVersion}, ${pack.questions.length} soal (${source}) `,
      source === 'impor' ? h('button', { type: 'button', class: 'btn btn-link', onclick: () => removePack(pack) }, 'Hapus pack impor') : null)))
      : h('p', { text: 'Belum ada pack.' }),
    h('button', { type: 'button', class: 'btn btn-primary', onclick: () => packInput.click() }, 'IMPOR SUBJECT PACK'),
    packInput,
    h('p', { class: 'hint', text: 'Pack impor menggantikan pack bawaan dengan mata ujian yang sama dan disimpan di perangkat ini.' })));

  if (app.pack) {
    const backupInput = h('input', { type: 'file', accept: '.json,application/json', hidden: true, onchange: () => importBackup(backupInput) });
    el.append(h('div', { class: 'card' },
      h('h2', { style: 'margin-top:0', text: 'Cadangan sesi' }),
      h('p', { text: `Mata ujian: ${app.pack.subjectName}. Data hanya tersimpan di perangkat ini; buat cadangan secara berkala.` }),
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn', onclick: exportBackup }, 'Ekspor cadangan'),
        h('button', { type: 'button', class: 'btn', onclick: () => backupInput.click() }, 'Impor cadangan')),
      backupInput));
  }

  if (app.problems.length) {
    el.append(h('div', { class: 'card' },
      h('h2', { style: 'margin-top:0', text: 'Data yang tidak dapat dimuat' }),
      app.problems.map((p) => h('div', {},
        h('p', {}, h('strong', { text: p.source })),
        h('ul', { class: 'error-list' }, p.errors.slice(0, 20).map((e) => h('li', { text: `${e.path}: ${e.message}` })))))));
  }
  el.append(disclaimer());

  async function importPack(input) {
    const file = input.files[0];
    input.value = '';
    if (!file) return;
    const result = validatePackText(await file.text());
    if (!result.ok) {
      await alertDialog('Pack ditolak', result.errors.slice(0, 15).map((e) => `${e.path}: ${e.message}`));
      return;
    }
    const pack = result.data;
    const active = loadActiveSession(app.store, pack.subjectId);
    if (active) {
      await alertDialog('Ada ujian yang sedang berjalan', ['Pack tidak diperbarui selama sesi berjalan. Selesaikan atau kumpulkan ujian lebih dulu.']);
      return;
    }
    const existing = app.packFor(pack.subjectId);
    if (existing) {
      const ok = await confirmDialog({
        title: 'Ganti pack?',
        body: [`Pack "${existing.subjectName}" versi ${existing.packVersion} akan diganti dengan versi ${pack.packVersion}.`],
        confirmLabel: 'Ganti',
      });
      if (!ok) return;
    }
    try {
      saveImportedPack(app.store, pack);
    } catch (e) {
      await alertDialog('Gagal menyimpan pack', [e.message]);
      return;
    }
    await app.reloadPacks();
    app.selectSubject(pack.subjectId);
    toast(`Pack ${pack.subjectName} versi ${pack.packVersion} berhasil diimpor.`);
    app.show('settings');
  }

  async function removePack(pack) {
    const ok = await confirmDialog({
      title: 'Hapus pack impor?',
      body: [`Pack "${pack.subjectName}" hasil impor dihapus dari perangkat. Riwayat sesi tidak ikut terhapus.`],
      confirmLabel: 'Hapus', danger: true,
    });
    if (!ok) return;
    removeImportedPack(app.store, pack.subjectId);
    await app.reloadPacks();
    app.show('settings');
  }

  function exportBackup() {
    const backup = makeBackup(app.store, app.pack.subjectId, Date.now());
    const stamp = new Date().toISOString().slice(0, 10);
    app.download(`cadangan-sesi-${app.pack.subjectId}-${stamp}.json`, JSON.stringify(backup, null, 2));
    toast(`${backup.sessions.length} sesi diekspor.`);
  }

  async function importBackup(input) {
    const file = input.files[0];
    input.value = '';
    if (!file) return;
    const parsed = parseJsonText(await file.text());
    if (!parsed.ok) {
      await alertDialog('Cadangan ditolak', parsed.errors.map((e) => e.message));
      return;
    }
    const plan = planBackupImport(app.store, app.pack.subjectId, parsed.data);
    if (!plan.ok) {
      await alertDialog('Cadangan ditolak', [plan.message]);
      return;
    }
    const body = [`${plan.accepted.length} sesi dapat diimpor.`];
    if (plan.replaced.length) body.push(`${plan.replaced.length} sesi dengan ID yang sama akan DITIMPA.`);
    for (const r of plan.rejected) body.push(`Ditolak ${r.sessionId}: ${r.message}`);
    if (!plan.accepted.length) {
      await alertDialog('Tidak ada sesi yang dapat diimpor', body);
      return;
    }
    const ok = await confirmDialog({ title: 'Impor cadangan sesi?', body, confirmLabel: 'Impor', danger: plan.replaced.length > 0 });
    if (!ok) return;
    try {
      applyBackupImport(app.store, plan);
      toast(`${plan.accepted.length} sesi diimpor.`);
    } catch (e) {
      await alertDialog('Gagal mengimpor', [e.message]);
    }
  }

  return { el };
}
