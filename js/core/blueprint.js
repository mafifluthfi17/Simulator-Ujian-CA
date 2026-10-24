// Pembentuk paket (SPEC 6 dan 6.1): memilih soal LIVE sesuai blueprint pack
// atau pengaturan Mode Kustom, menghitung skor per butir (largest remainder),
// dan memeriksa aturan kesulitan dan cakupan topik.

import { shuffle } from './random.js';

export const TYPE_ORDER = ['mcq', 'numeric', 'essay', 'case'];
export const TYPE_NAMES = { mcq: 'PG', numeric: 'soal numerik', essay: 'esai', case: 'kasus' };
const CASE_SIZE_NAMES = { mini: 'mini', komprehensif: 'komprehensif' };

const DEFAULT_ATTEMPTS = 400;
const EPS = 1e-9;

// Membagi `weight` ke `count` butir dalam kelipatan 0,01 sehingga jumlahnya
// tepat `weight` (largest remainder; sisa sen diberikan ke butir pertama).
export function allocatePoints(weight, count) {
  if (count <= 0) return [];
  const cents = Math.round(weight * 100);
  const base = Math.floor(cents / count);
  const remainder = cents - base * count;
  return Array.from({ length: count }, (_, i) => (base + (i < remainder ? 1 : 0)) / 100);
}

export function sumCents(points) {
  return points.reduce((n, p) => n + Math.round(p * 100), 0);
}

export function isLive(q) {
  return q.lifecycle && q.lifecycle.status === 'LIVE';
}

function sectionLabel(section) {
  const base = TYPE_NAMES[section.type] || section.type;
  return section.caseSize ? `${base} ${CASE_SIZE_NAMES[section.caseSize]}` : base;
}

export function shortageMessage(label, needed, available) {
  return `butuh ${needed} ${label}, tersedia ${available} yang sesuai`;
}

export function packageQuestionCount(pkg) {
  return pkg.sections.reduce((n, s) => n + s.count, 0);
}

// Perkiraan waktu paket (D-98): per bagian, jumlah soal × rata-rata estimatedMinutes
// soal yang memenuhi bagian itu (tipe dan ukuran kasus) dari `questions`.
// Hasil: { sections: [{ label, count, available, minutes, suggested }], minutes,
// durationMinutes, over, incomplete }. minutes bagian null bila tidak ada soal.
export function packageTimeEstimate(questions, pkg) {
  const sections = pkg.sections.map((s) => {
    const pool = questions.filter((q) => q.type === s.type && (!s.caseSize || q.caseSize === s.caseSize));
    const avg = pool.length ? pool.reduce((n, q) => n + q.estimatedMinutes, 0) / pool.length : null;
    return {
      label: sectionLabel(s),
      count: s.count,
      available: pool.length,
      minutes: avg === null ? null : Math.round(s.count * avg),
      suggested: pkg.suggestedMinutes ? pkg.suggestedMinutes[s.type] ?? null : null,
    };
  });
  const minutes = sections.reduce((n, s) => n + (s.minutes || 0), 0);
  return {
    sections,
    minutes,
    durationMinutes: pkg.durationMinutes,
    over: minutes > pkg.durationMinutes,
    incomplete: sections.some((s) => s.minutes === null),
  };
}

// ---------- Paket dari blueprint pack (T1, T2, SIM, ...) ----------

export function buildFromPackage(pack, pkg, rng, { attempts = DEFAULT_ATTEMPTS } = {}) {
  const live = pack.questions.filter(isLive);
  const sections = pkg.sections.map((s) => ({
    ...s,
    points: s.itemScores ? s.itemScores.slice() : allocatePoints(s.weight, s.count),
    pool: live.filter((q) => q.type === s.type && (!s.caseSize || q.caseSize === s.caseSize)),
  }));

  const problems = sections
    .filter((s) => s.pool.length < s.count)
    .map((s) => shortageMessage(sectionLabel(s), s.count, s.pool.length));
  if (problems.length) return { ok: false, problems };

  const targetLevels = new Set(pkg.difficultyTarget.levels);
  const cap = pkg.coverage.maxTopicScoreShare * 100;
  let best = null;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const preferTarget = attempt % 2 === 0;
    const picked = pickSections(sections, rng, { preferTarget, targetLevels, cap });
    if (!picked) continue;
    const evaluation = evaluatePackage(picked, pkg);
    if (evaluation.unmet.length === 0) return { ok: true, items: picked };
    if (!best || evaluation.unmet.length < best.unmet.length) best = evaluation;
  }
  const unmet = best ? best.unmet : ['soal tidak dapat dipilih tanpa duplikasi'];
  return { ok: false, problems: unmet.map((u) => `aturan paket tidak terpenuhi: ${u}`) };
}

function pickSections(sections, rng, { preferTarget, targetLevels, cap }) {
  const picked = [];
  const used = new Set();
  const topicPoints = new Map();
  for (const s of sections) {
    let order = shuffle(s.pool, rng);
    if (preferTarget) {
      order = [...order.filter((q) => targetLevels.has(q.difficulty)), ...order.filter((q) => !targetLevels.has(q.difficulty))];
    }
    let k = 0;
    // Putaran pertama menghormati batas skor per topik; putaran kedua mengisi sisa.
    for (const respectCap of [true, false]) {
      for (const q of order) {
        if (k >= s.count) break;
        if (used.has(q.id)) continue;
        const pts = s.points[k];
        if (respectCap && exceedsCap(q, pts, topicPoints, cap)) continue;
        used.add(q.id);
        addTopicPoints(q, pts, topicPoints);
        picked.push({ question: q, points: pts });
        k++;
      }
    }
    if (k < s.count) return null;
  }
  return picked;
}

// Skor soal dibagi rata ke topik-topiknya.
function addTopicPoints(q, pts, topicPoints) {
  const share = pts / q.topicIds.length;
  for (const t of q.topicIds) topicPoints.set(t, (topicPoints.get(t) || 0) + share);
}

function exceedsCap(q, pts, topicPoints, cap) {
  const share = pts / q.topicIds.length;
  return q.topicIds.some((t) => (topicPoints.get(t) || 0) + share > cap + EPS);
}

export function evaluatePackage(items, pkg) {
  const total = items.reduce((n, it) => n + it.points, 0);
  const unmet = [];
  const target = new Set(pkg.difficultyTarget.levels);
  const targetPoints = items.filter((it) => target.has(it.question.difficulty)).reduce((n, it) => n + it.points, 0);
  const share = total > 0 ? targetPoints / total : 0;
  if (share + EPS < pkg.difficultyTarget.minScoreShare) {
    unmet.push(`porsi skor ${[...target].join('/')} ${Math.round(share * 100)}%, minimal ${Math.round(pkg.difficultyTarget.minScoreShare * 100)}%`);
  }
  const topicPoints = new Map();
  for (const it of items) addTopicPoints(it.question, it.points, topicPoints);
  if (topicPoints.size < pkg.coverage.minTopics) {
    unmet.push(`hanya ${topicPoints.size} topik, minimal ${pkg.coverage.minTopics}`);
  }
  for (const [topic, pts] of topicPoints) {
    if (total > 0 && pts / total > pkg.coverage.maxTopicScoreShare + EPS) {
      unmet.push(`topik ${topic} ${Math.round((pts / total) * 100)}% skor, maksimal ${Math.round(pkg.coverage.maxTopicScoreShare * 100)}%`);
    }
  }
  return { unmet, total };
}

// ---------- Mode Kustom (SPEC 6.1) ----------

export const CUSTOM_LIMITS = { minDuration: 15, maxDuration: 240 };

export function customPool(pack, custom, type) {
  const levels = custom.difficulty && custom.difficulty.length ? new Set(custom.difficulty) : null;
  const topics = custom.topicIds && custom.topicIds.length ? new Set(custom.topicIds) : null;
  return pack.questions.filter((q) => isLive(q) && q.type === type
    && (!levels || levels.has(q.difficulty))
    && (!topics || q.topicIds.some((t) => topics.has(t))));
}

// custom: { durationMinutes, counts: {type: n}, weights: {type: n}, difficulty: [], topicIds: [] }
// Hasil: { ok, errors: [], warnings: [], estimateMinutes }.
export function validateCustom(pack, custom) {
  const errors = [];
  const warnings = [];
  const d = custom.durationMinutes;
  if (!Number.isInteger(d) || d < CUSTOM_LIMITS.minDuration || d > CUSTOM_LIMITS.maxDuration) {
    errors.push(`Durasi harus bilangan bulat ${CUSTOM_LIMITS.minDuration}-${CUSTOM_LIMITS.maxDuration} menit.`);
  }
  let totalCount = 0;
  let totalWeight = 0;
  let estimate = 0;
  for (const type of TYPE_ORDER) {
    const count = custom.counts[type] || 0;
    const weight = custom.weights[type] || 0;
    const name = TYPE_NAMES[type];
    if (!Number.isInteger(count) || count < 0) errors.push(`Jumlah ${name} harus bilangan bulat 0 atau lebih.`);
    if (!Number.isInteger(weight) || weight < 0) errors.push(`Bobot ${name} harus bilangan bulat 0 atau lebih.`);
    if (count === 0 && weight !== 0) errors.push(`Bobot ${name} harus 0 karena tidak ada soal ${name}.`);
    if (count > 0 && weight === 0) errors.push(`Bobot ${name} harus lebih dari 0 karena ada soal ${name}.`);
    totalCount += count;
    totalWeight += weight;
    if (count > 0) {
      const pool = customPool(pack, custom, type);
      if (pool.length < count) errors.push(capitalize(shortageMessage(name, count, pool.length)) + '.');
      if (pool.length) estimate += count * (pool.reduce((n, q) => n + q.estimatedMinutes, 0) / pool.length);
    }
  }
  if (totalCount === 0) errors.push('Pilih minimal satu soal.');
  if (totalWeight !== 100) errors.push(`Total bobot bagian ${totalWeight}, harus tepat 100.`);
  const estimateMinutes = Math.round(estimate);
  if (!errors.length && estimateMinutes > 0) {
    if (d < 0.8 * estimateMinutes) warnings.push(`Durasi kurang dari 80% perkiraan waktu (${estimateMinutes} menit).`);
    if (d > 2 * estimateMinutes) warnings.push(`Durasi lebih dari 2 kali perkiraan waktu (${estimateMinutes} menit).`);
  }
  return { ok: errors.length === 0, errors, warnings, estimateMinutes };
}

export function buildCustom(pack, custom, rng) {
  const check = validateCustom(pack, custom);
  if (!check.ok) return { ok: false, problems: check.errors };
  const items = [];
  for (const type of TYPE_ORDER) {
    const count = custom.counts[type] || 0;
    if (!count) continue;
    const points = allocatePoints(custom.weights[type], count);
    shuffle(customPool(pack, custom, type), rng).slice(0, count)
      .forEach((question, i) => items.push({ question, points: points[i] }));
  }
  return { ok: true, items };
}

// Urutan tampil: per bagian sesuai urutan tipe; diacak di dalam bagian bila diminta.
export function orderItems(items, shuffleQuestions, rng) {
  const groups = TYPE_ORDER.map((type) => items.filter((it) => it.question.type === type));
  return groups.flatMap((g) => (shuffleQuestions ? shuffle(g, rng) : g.slice().sort((a, b) => a.question.id.localeCompare(b.question.id))));
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
