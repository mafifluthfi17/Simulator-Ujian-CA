// Memuat Subject Pack (SPEC 2): pack.json lewat fetch bila http(s), cadangan
// packs/<id>/pack.js lewat <script> (berfungsi di file://), serta pack hasil
// impor yang disimpan di perangkat. Semua pack divalidasi sebelum dipakai.

import { loadDocument, parseJsonText } from './contract.js';
import { keys } from './storage.js';

export function validatePack(data) {
  return loadDocument('pack', data);
}

export function validatePackText(text) {
  const parsed = parseJsonText(text);
  return parsed.ok ? validatePack(parsed.data) : parsed;
}

// Hasil: { packs: [{ pack, source }], problems: [{ source, errors }] }.
// Pack impor menggantikan pack bawaan dengan subjectId yang sama.
export async function loadAllPacks({ store, win = globalThis.window, baseUrl = 'packs/' } = {}) {
  const problems = [];
  const bySubject = new Map();

  for (const { data, source } of await loadBuiltIn(win, baseUrl, problems)) {
    const result = validatePack(data);
    if (result.ok) bySubject.set(result.data.subjectId, { pack: result.data, source });
    else problems.push({ source, errors: result.errors });
  }

  if (store) {
    for (const key of store.keysWithPrefix('caSim:')) {
      if (!key.endsWith(':pack')) continue;
      const data = store.getJson(key);
      const result = validatePack(data);
      if (result.ok) bySubject.set(result.data.subjectId, { pack: result.data, source: 'impor' });
      else problems.push({ source: `impor (${key})`, errors: result.errors });
    }
  }

  const packs = [...bySubject.values()].sort((a, b) => a.pack.subjectName.localeCompare(b.pack.subjectName, 'id'));
  return { packs, problems };
}

export function saveImportedPack(store, pack) {
  store.setJson(keys.importedPack(pack.subjectId), pack);
}

export function removeImportedPack(store, subjectId) {
  store.remove(keys.importedPack(subjectId));
}

async function loadBuiltIn(win, baseUrl, problems) {
  if (!win) return [];
  const isHttp = /^https?:$/.test(win.location.protocol);
  let ids = null;
  if (isHttp) ids = await fetchJson(`${baseUrl}index.json`);
  if (!Array.isArray(ids)) {
    await loadScript(win, `${baseUrl}index.js`);
    ids = Array.isArray(win.CA_SIM_PACK_INDEX) ? win.CA_SIM_PACK_INDEX : [];
  }
  const found = [];
  for (const id of ids) {
    let data = isHttp ? await fetchJson(`${baseUrl}${id}/pack.json`) : null;
    if (!data) {
      await loadScript(win, `${baseUrl}${id}/pack.js`);
      data = win.CA_SIM_PACKS ? win.CA_SIM_PACKS[id] : null;
    }
    if (data) found.push({ data, source: `bawaan (${id})` });
    else problems.push({ source: `bawaan (${id})`, errors: [{ path: '$', message: 'Berkas pack tidak dapat dimuat.' }] });
  }
  return found;
}

async function fetchJson(url) {
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) return null;
    const parsed = parseJsonText(await res.text());
    return parsed.ok ? parsed.data : null;
  } catch {
    return null;
  }
}

function loadScript(win, src) {
  return new Promise((resolve) => {
    const el = win.document.createElement('script');
    el.src = src;
    el.onload = () => resolve(true);
    el.onerror = () => resolve(false);
    win.document.head.append(el);
  });
}
