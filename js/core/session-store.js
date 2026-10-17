// Penyimpanan sesi: satu sesi aktif per mata ujian, riwayat, cadangan (SPEC 9).
// Sesi yang gagal dimuat (versi lain atau rusak) tidak dihapus; dilaporkan saja.

import { keys } from './storage.js';
import { loadDocument } from './contract.js';
import { isOpen } from './session.js';
import { SCHEMA_VERSION } from './version.js';

export function saveSession(store, session) {
  const { subjectId, sessionId } = session;
  store.setJson(keys.session(subjectId, sessionId), session);
  const list = store.getJson(keys.sessionList(subjectId)) || [];
  if (!list.includes(sessionId)) {
    list.push(sessionId);
    store.setJson(keys.sessionList(subjectId), list);
  }
  if (isOpen(session)) store.setJson(keys.active(subjectId), sessionId);
  else if (store.getJson(keys.active(subjectId)) === sessionId) store.remove(keys.active(subjectId));
}

// Hasil: { ok: true, session } atau { ok: false, errors } (data tetap di penyimpanan).
export function loadSession(store, subjectId, sessionId) {
  const raw = store.getJson(keys.session(subjectId, sessionId));
  if (raw === null) return { ok: false, errors: [{ path: '$', message: `Sesi ${sessionId} tidak ditemukan.` }] };
  if (raw.__unreadable !== undefined) return { ok: false, errors: [{ path: '$', message: `Sesi ${sessionId} rusak (bukan JSON).` }] };
  const result = loadDocument('session', raw);
  return result.ok ? { ok: true, session: result.data, migrated: result.migrated } : result;
}

export function loadActiveSession(store, subjectId) {
  const id = store.getJson(keys.active(subjectId));
  if (!id) return null;
  return { sessionId: id, ...loadSession(store, subjectId, id) };
}

// Melepas penanda sesi aktif yang tidak dapat dimuat agar sesi baru dapat dimulai.
// Data sesinya TIDAK dihapus: tetap di riwayat (sebagai gagal dimuat) dan ikut cadangan.
export function releaseActive(store, subjectId) {
  store.remove(keys.active(subjectId));
}

export function formatErrors(errors, limit = 10) {
  const lines = errors.slice(0, limit).map((e) => (e.path && e.path !== '$' ? `${e.path}: ${e.message}` : e.message));
  if (errors.length > limit) lines.push(`… dan ${errors.length - limit} masalah lain`);
  return lines;
}

// Semua sesi mata ujian, terbaru dulu. Sesi yang gagal dimuat ikut dilaporkan.
export function listSessions(store, subjectId) {
  const ids = store.getJson(keys.sessionList(subjectId)) || [];
  const sessions = [];
  const failures = [];
  for (const id of ids) {
    const r = loadSession(store, subjectId, id);
    if (r.ok) sessions.push(r.session);
    else failures.push({ sessionId: id, errors: r.errors });
  }
  sessions.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  return { sessions, failures };
}

export function makeBackup(store, subjectId, now) {
  const ids = store.getJson(keys.sessionList(subjectId)) || [];
  const sessions = ids.map((id) => store.getJson(keys.session(subjectId, id))).filter((s) => s && !s.__unreadable);
  return { backupVersion: SCHEMA_VERSION, subjectId, exportedAt: new Date(now).toISOString(), sessions };
}

// Mengembalikan rencana impor tanpa menulis apa pun:
// { ok, accepted: [session], replaced: [sessionId], rejected: [{ sessionId, message }] }.
export function planBackupImport(store, subjectId, backup) {
  if (!backup || typeof backup !== 'object' || !Array.isArray(backup.sessions)) {
    return { ok: false, message: 'Berkas bukan cadangan sesi.' };
  }
  if (backup.subjectId !== subjectId) {
    return { ok: false, message: `Cadangan milik mata ujian "${backup.subjectId}", bukan "${subjectId}".` };
  }
  const existingIds = new Set(store.getJson(keys.sessionList(subjectId)) || []);
  const activeId = store.getJson(keys.active(subjectId));
  const accepted = [];
  const replaced = [];
  const rejected = [];
  let activeTaken = Boolean(activeId);
  for (const raw of backup.sessions) {
    const id = raw && raw.sessionId ? raw.sessionId : '(tanpa sessionId)';
    const result = loadDocument('session', raw);
    if (!result.ok) {
      rejected.push({ sessionId: id, message: result.errors.map((e) => `${e.path}: ${e.message}`).join('; ') });
      continue;
    }
    const session = result.data;
    if (session.subjectId !== subjectId) {
      rejected.push({ sessionId: id, message: 'mata ujian berbeda' });
      continue;
    }
    if (isOpen(session) && session.sessionId !== activeId) {
      if (activeTaken) {
        rejected.push({ sessionId: id, message: 'sudah ada sesi aktif; hanya satu sesi aktif per mata ujian' });
        continue;
      }
      activeTaken = true;
    }
    if (existingIds.has(session.sessionId)) replaced.push(session.sessionId);
    accepted.push(session);
  }
  return { ok: true, accepted, replaced, rejected };
}

export function applyBackupImport(store, plan) {
  for (const session of plan.accepted) saveSession(store, session);
}
