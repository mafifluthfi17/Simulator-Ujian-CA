// Aturan konsistensi yang tidak dapat diungkapkan JSON Schema (SPEC 5.2, 6, 8).
// Dijalankan SETELAH data lolos skema. Setiap pesan menyebut ID soal dan field.

const SUM_EPSILON = 1e-9;
const OPTION_KEYS = ['A', 'B', 'C', 'D'];

export function checkConsistency(kind, data) {
  switch (kind) {
    case 'question': return checkQuestion(data, '$');
    case 'batch': return checkQuestionList(data.items, '$.items');
    case 'pack': return checkPack(data);
    default: return [];
  }
}

export function checkQuestion(q, path) {
  const errors = [];
  const label = q.id ? `Soal ${q.id}` : path;
  const add = (field, message) => errors.push({ path: `${path}.${field}`, message: `${label}: ${message}` });

  if (q.type === 'mcq') {
    const keys = q.options.map((o) => o.key);
    const missing = OPTION_KEYS.filter((k) => !keys.includes(k));
    if (missing.length) add('options', `opsi harus berkunci A, B, C, D masing-masing satu kali; tidak ada ${missing.join(', ')}`);
    const expected = OPTION_KEYS.filter((k) => k !== q.answerKey);
    const given = Object.keys(q.distractorRationale).sort();
    if (given.join() !== expected.join()) {
      add('distractorRationale', `harus berisi tepat opsi selain kunci (${expected.join(', ')}); ditemukan ${given.join(', ') || 'kosong'}`);
    }
  }

  if (q.type === 'essay') {
    checkRubric(q.rubric, q.maxScore, add, 'rubric');
  }

  if (q.type === 'case') {
    const subTotal = sum(q.subQuestions.map((s) => s.maxScore));
    if (!nearlyEqual(subTotal, q.maxScore)) {
      add('subQuestions', `jumlah maxScore sub-pertanyaan (${subTotal}) tidak sama dengan maxScore soal (${q.maxScore})`);
    }
    findDuplicates(q.subQuestions.map((s) => s.id)).forEach((id) => add('subQuestions', `id sub-pertanyaan "${id}" ganda`));
    q.subQuestions.forEach((s, i) => checkRubric(s.rubric, s.maxScore, add, `subQuestions[${i}].rubric`, `sub (${s.id})`));
    (q.caseData || []).forEach((table, t) => {
      table.rows.forEach((row, r) => {
        if (row.length !== table.columns.length) {
          add(`caseData[${t}].rows[${r}]`, `baris berisi ${row.length} sel, kolom ada ${table.columns.length}`);
        }
      });
    });
  }

  const status = q.lifecycle && q.lifecycle.status;
  if (status === 'CALIBRATION' && !q.calibration) add('calibration', 'wajib diisi untuk soal berstatus CALIBRATION');
  if (q.calibration && status !== undefined && status !== 'CALIBRATION') {
    add('calibration', `hanya boleh ada pada soal berstatus CALIBRATION (status: ${status})`);
  }
  return errors;
}

export function checkQuestionList(questions, path) {
  const errors = [];
  questions.forEach((q, i) => errors.push(...checkQuestion(q, `${path}[${i}]`)));
  findDuplicates(questions.map((q) => q.id)).forEach((id) => {
    errors.push({ path, message: `ID soal ${id} muncul lebih dari sekali` });
  });
  return errors;
}

export function checkPack(pack) {
  const errors = checkQuestionList(pack.questions, '$.questions');
  const topicIds = new Set(pack.topics.map((t) => t.id));
  const competencyIds = new Set(pack.competencies.map((c) => c.id));

  findDuplicates(pack.topics.map((t) => t.id)).forEach((id) => errors.push({ path: '$.topics', message: `ID topik ${id} ganda` }));
  findDuplicates(pack.competencies.map((c) => c.id)).forEach((id) => errors.push({ path: '$.competencies', message: `ID kompetensi ${id} ganda` }));

  pack.questions.forEach((q, i) => {
    q.topicIds.filter((id) => !topicIds.has(id)).forEach((id) => {
      errors.push({ path: `$.questions[${i}].topicIds`, message: `Soal ${q.id}: topik ${id} tidak ada di pack` });
    });
    q.competencyIds.filter((id) => !competencyIds.has(id)).forEach((id) => {
      errors.push({ path: `$.questions[${i}].competencyIds`, message: `Soal ${q.id}: kompetensi ${id} tidak ada di pack` });
    });
  });

  findDuplicates(pack.packages.map((p) => p.id)).forEach((id) => errors.push({ path: '$.packages', message: `ID paket ${id} ganda` }));
  pack.packages.forEach((p, i) => {
    const base = `$.packages[${i}]`;
    const total = sum(p.sections.map((s) => s.weight));
    if (!nearlyEqual(total, 100, 0.001)) {
      errors.push({ path: `${base}.sections`, message: `Paket ${p.id}: total bobot bagian ${round2(total)}, harus 100` });
    }
    p.sections.forEach((s, j) => {
      if (!s.itemScores) return;
      const at = `${base}.sections[${j}].itemScores`;
      if (s.itemScores.length !== s.count) {
        errors.push({ path: at, message: `Paket ${p.id}: itemScores berisi ${s.itemScores.length} angka, count ${s.count}` });
      }
      const itemTotal = sum(s.itemScores);
      if (!nearlyEqual(itemTotal, s.weight, 0.001)) {
        errors.push({ path: at, message: `Paket ${p.id}: jumlah itemScores ${round2(itemTotal)} tidak sama dengan weight ${s.weight}` });
      }
    });
  });

  if (!pack.changelog.some((c) => c.version === pack.packVersion)) {
    errors.push({ path: '$.changelog', message: `tidak ada entri changelog untuk packVersion ${pack.packVersion}` });
  }
  return errors;
}

function checkRubric(rubric, maxScore, add, field, owner = 'soal') {
  const total = sum(rubric.map((c) => c.maxScore));
  if (!nearlyEqual(total, maxScore)) {
    add(field, `jumlah maxScore rubrik (${total}) tidak sama dengan maxScore ${owner} (${maxScore})`);
  }
  findDuplicates(rubric.map((c) => c.criterionId)).forEach((id) => add(field, `criterionId ${id} ganda`));
}

function findDuplicates(values) {
  const seen = new Set();
  const dup = new Set();
  for (const v of values) {
    if (seen.has(v)) dup.add(v);
    seen.add(v);
  }
  return [...dup];
}

function sum(values) {
  return values.reduce((a, b) => a + b, 0);
}

function nearlyEqual(a, b, epsilon = SUM_EPSILON) {
  return Math.abs(a - b) <= epsilon;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
