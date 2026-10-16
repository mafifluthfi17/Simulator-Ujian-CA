// Validator JSON Schema (subset draft 2020-12) tanpa dependensi.
// Dipakai aplikasi di browser dan tools/validate.mjs di Node, sehingga satu
// sumber aturan berlaku di kedua tempat. Kata kunci di luar SUPPORTED ditolak
// saat skema didaftarkan agar skema tidak diam-diam memakai aturan yang
// tidak ditegakkan.

const SUPPORTED = new Set([
  '$schema', '$id', '$ref', '$defs', '$comment', 'title', 'description', 'default', 'examples',
  'type', 'enum', 'const',
  'properties', 'required', 'additionalProperties', 'propertyNames', 'minProperties', 'maxProperties',
  'items', 'minItems', 'maxItems', 'uniqueItems',
  'minLength', 'maxLength', 'pattern', 'format',
  'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'multipleOf',
  'allOf', 'anyOf', 'oneOf', 'not', 'if', 'then', 'else',
]);

const SUBSCHEMA_MAPS = ['properties', '$defs'];
const SUBSCHEMA_SINGLE = ['items', 'additionalProperties', 'propertyNames', 'not', 'if', 'then', 'else'];
const SUBSCHEMA_LISTS = ['allOf', 'anyOf', 'oneOf'];

const FORMATS = {
  date: (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && isValidDate(s),
  // Zona waktu opsional agar keluaran AI "2026-10-16T10:00:00" tetap diterima.
  'date-time': (s) => {
    const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})?$/.exec(s);
    return Boolean(m) && isValidDate(m[1]) && Number(m[2]) < 24 && Number(m[3]) < 60
      && (m[4] === undefined || Number(m[4]) < 60);
  },
};

const MULTIPLE_EPSILON = 1e-9;
const regexCache = new Map();

export class SchemaRegistry {
  constructor() {
    this.schemas = new Map();
    this.refs = new Map();
  }

  add(schema) {
    if (!isPlainObject(schema) || typeof schema.$id !== 'string') {
      throw new Error('Skema wajib berupa objek dengan $id.');
    }
    const problems = [];
    const refs = [];
    walkSchema(schema, '#', problems, refs);
    if (problems.length) {
      throw new Error(`Skema ${schema.$id} tidak didukung validator: ${problems.join('; ')}`);
    }
    this.schemas.set(schema.$id, schema);
    this.refs.set(schema.$id, refs);
  }

  has(id) {
    return this.schemas.has(id);
  }

  // Mengembalikan daftar $ref yang tidak dapat di-resolve di semua skema terdaftar.
  findBrokenRefs() {
    const broken = [];
    for (const [id, refs] of this.refs) {
      const root = this.schemas.get(id);
      for (const { loc, ref } of refs) {
        try {
          this.resolveRef(ref, root);
        } catch (e) {
          broken.push(`${id} ${loc}: ${e.message}`);
        }
      }
    }
    return broken;
  }

  resolveRef(ref, root) {
    const hash = ref.indexOf('#');
    const file = hash === -1 ? ref : ref.slice(0, hash);
    const pointer = hash === -1 ? '' : ref.slice(hash + 1);
    const target = file ? this.schemas.get(file) : root;
    if (!target) throw new Error(`$ref tidak ditemukan: ${ref}`);
    let node = target;
    if (pointer) {
      for (const raw of pointer.split('/').slice(1)) {
        const part = raw.replace(/~1/g, '/').replace(/~0/g, '~');
        if (node === null || typeof node !== 'object' || !hasOwn(node, part)) {
          throw new Error(`$ref tidak ditemukan: ${ref}`);
        }
        node = node[part];
      }
    }
    return { node, root: target };
  }

  // Hasil: { valid, errors: [{ path, message }] }. path memakai notasi $.a.b[0].
  validate(schemaId, data) {
    const root = this.schemas.get(schemaId);
    if (!root) throw new Error(`Skema tidak dikenal: ${schemaId}`);
    const errors = [];
    validateNode(this, root, root, data, '$', errors);
    return { valid: errors.length === 0, errors };
  }
}

export function formatErrors(errors) {
  return errors.map((e) => `${e.path}: ${e.message}`);
}

export function joinPath(path, key) {
  if (typeof key === 'number') return `${path}[${key}]`;
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`;
}

export function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => hasOwn(b, k) && deepEqual(a[k], b[k]));
}

function walkSchema(node, loc, problems, refs) {
  if (typeof node === 'boolean') return;
  if (!isPlainObject(node)) {
    problems.push(`${loc} bukan objek skema`);
    return;
  }
  for (const key of Object.keys(node)) {
    if (!SUPPORTED.has(key)) problems.push(`${loc}/${key} (kata kunci tidak didukung)`);
  }
  if (node.format !== undefined && !hasOwn(FORMATS, node.format)) {
    problems.push(`${loc}/format "${node.format}" tidak dikenal`);
  }
  if (typeof node.$ref === 'string') refs.push({ loc, ref: node.$ref });
  for (const k of SUBSCHEMA_MAPS) {
    if (isPlainObject(node[k])) {
      for (const [name, sub] of Object.entries(node[k])) walkSchema(sub, `${loc}/${k}/${name}`, problems, refs);
    }
  }
  for (const k of SUBSCHEMA_SINGLE) {
    if (hasOwn(node, k)) walkSchema(node[k], `${loc}/${k}`, problems, refs);
  }
  for (const k of SUBSCHEMA_LISTS) {
    if (Array.isArray(node[k])) node[k].forEach((sub, i) => walkSchema(sub, `${loc}/${k}/${i}`, problems, refs));
  }
}

function validateNode(reg, root, node, data, path, errors) {
  if (node === true) return;
  if (node === false) {
    errors.push(err(path, 'field ini tidak boleh ada di sini'));
    return;
  }

  if (node.$ref !== undefined) {
    const target = reg.resolveRef(node.$ref, root);
    validateNode(reg, target.root, target.node, data, path, errors);
  }

  if (node.type !== undefined) {
    const types = Array.isArray(node.type) ? node.type : [node.type];
    if (!types.some((t) => matchesType(t, data))) {
      errors.push(err(path, `tipe harus ${types.join(' atau ')}, ditemukan ${typeName(data)}`));
      return;
    }
  }
  if (node.const !== undefined && !deepEqual(node.const, data)) {
    errors.push(err(path, `nilai harus ${JSON.stringify(node.const)}, ditemukan ${preview(data)}`));
  }
  if (Array.isArray(node.enum) && !node.enum.some((v) => deepEqual(v, data))) {
    errors.push(err(path, `nilai harus salah satu dari ${node.enum.map((v) => JSON.stringify(v)).join(', ')}; ditemukan ${preview(data)}`));
  }

  if (typeof data === 'string') checkString(node, data, path, errors);
  else if (typeof data === 'number') checkNumber(node, data, path, errors);
  else if (Array.isArray(data)) checkArray(reg, root, node, data, path, errors);
  else if (isPlainObject(data)) checkObject(reg, root, node, data, path, errors);

  if (Array.isArray(node.allOf)) {
    for (const sub of node.allOf) validateNode(reg, root, sub, data, path, errors);
  }
  if (Array.isArray(node.anyOf)) {
    const branches = node.anyOf.map((sub) => collect(reg, root, sub, data, path));
    if (!branches.some((b) => b.length === 0)) {
      errors.push(err(path, 'tidak cocok dengan bentuk mana pun yang diizinkan'), ...fewest(branches));
    }
  }
  if (Array.isArray(node.oneOf)) {
    const branches = node.oneOf.map((sub) => collect(reg, root, sub, data, path));
    const passed = branches.filter((b) => b.length === 0).length;
    if (passed === 0) errors.push(err(path, 'tidak cocok dengan bentuk mana pun yang diizinkan'), ...fewest(branches));
    else if (passed > 1) errors.push(err(path, 'cocok dengan lebih dari satu bentuk; harus tepat satu'));
  }
  if (node.not !== undefined && collect(reg, root, node.not, data, path).length === 0) {
    errors.push(err(path, 'nilai ini tidak diizinkan'));
  }
  if (node.if !== undefined) {
    const ifPassed = collect(reg, root, node.if, data, path).length === 0;
    if (ifPassed && node.then !== undefined) validateNode(reg, root, node.then, data, path, errors);
    if (!ifPassed && node.else !== undefined) validateNode(reg, root, node.else, data, path, errors);
  }
}

function collect(reg, root, node, data, path) {
  const errors = [];
  validateNode(reg, root, node, data, path, errors);
  return errors;
}

function fewest(branches) {
  return branches.reduce((best, b) => (b.length < best.length ? b : best));
}

function checkString(node, data, path, errors) {
  const length = [...data].length;
  if (node.minLength !== undefined && length < node.minLength) {
    errors.push(err(path, node.minLength === 1 ? 'tidak boleh kosong' : `panjang minimal ${node.minLength} karakter`));
  }
  if (node.maxLength !== undefined && length > node.maxLength) {
    errors.push(err(path, `panjang maksimal ${node.maxLength} karakter`));
  }
  if (node.pattern !== undefined && !getRegex(node.pattern).test(data)) {
    errors.push(err(path, `format tidak sesuai pola ${node.pattern}; ditemukan ${preview(data)}`));
  }
  if (node.format !== undefined && !FORMATS[node.format](data)) {
    errors.push(err(path, `format ${node.format} tidak valid; ditemukan ${preview(data)}`));
  }
}

function checkNumber(node, data, path, errors) {
  if (node.minimum !== undefined && data < node.minimum) errors.push(err(path, `minimal ${node.minimum}, ditemukan ${data}`));
  if (node.maximum !== undefined && data > node.maximum) errors.push(err(path, `maksimal ${node.maximum}, ditemukan ${data}`));
  if (node.exclusiveMinimum !== undefined && data <= node.exclusiveMinimum) {
    errors.push(err(path, `harus lebih besar dari ${node.exclusiveMinimum}, ditemukan ${data}`));
  }
  if (node.exclusiveMaximum !== undefined && data >= node.exclusiveMaximum) {
    errors.push(err(path, `harus lebih kecil dari ${node.exclusiveMaximum}, ditemukan ${data}`));
  }
  if (node.multipleOf !== undefined) {
    const q = data / node.multipleOf;
    if (Math.abs(q - Math.round(q)) > MULTIPLE_EPSILON) {
      errors.push(err(path, `harus kelipatan ${node.multipleOf}, ditemukan ${data}`));
    }
  }
}

function checkArray(reg, root, node, data, path, errors) {
  if (node.minItems !== undefined && data.length < node.minItems) {
    errors.push(err(path, `minimal ${node.minItems} elemen, ditemukan ${data.length}`));
  }
  if (node.maxItems !== undefined && data.length > node.maxItems) {
    errors.push(err(path, `maksimal ${node.maxItems} elemen, ditemukan ${data.length}`));
  }
  if (node.uniqueItems === true) {
    for (let j = 1; j < data.length; j++) {
      for (let i = 0; i < j; i++) {
        if (deepEqual(data[i], data[j])) {
          errors.push(err(joinPath(path, j), `duplikat dengan elemen [${i}]`));
          break;
        }
      }
    }
  }
  if (node.items !== undefined) {
    data.forEach((v, i) => validateNode(reg, root, node.items, v, joinPath(path, i), errors));
  }
}

function checkObject(reg, root, node, data, path, errors) {
  if (Array.isArray(node.required)) {
    for (const key of node.required) {
      if (!hasOwn(data, key)) errors.push(err(joinPath(path, key), 'field wajib tidak ada'));
    }
  }
  const keys = Object.keys(data);
  if (node.minProperties !== undefined && keys.length < node.minProperties) {
    errors.push(err(path, `minimal ${node.minProperties} field, ditemukan ${keys.length}`));
  }
  if (node.maxProperties !== undefined && keys.length > node.maxProperties) {
    errors.push(err(path, `maksimal ${node.maxProperties} field, ditemukan ${keys.length}`));
  }
  for (const key of keys) {
    const child = joinPath(path, key);
    if (node.propertyNames !== undefined && collect(reg, root, node.propertyNames, key, child).length) {
      errors.push(err(child, `nama field "${key}" tidak diizinkan`));
    }
    if (isPlainObject(node.properties) && hasOwn(node.properties, key)) {
      validateNode(reg, root, node.properties[key], data[key], child, errors);
    } else if (node.additionalProperties === false) {
      errors.push(err(child, 'field tidak dikenal (tidak ada di kontrak)'));
    } else if (node.additionalProperties !== undefined) {
      validateNode(reg, root, node.additionalProperties, data[key], child, errors);
    }
  }
}

function matchesType(type, v) {
  switch (type) {
    case 'null': return v === null;
    case 'boolean': return typeof v === 'boolean';
    case 'string': return typeof v === 'string';
    case 'number': return typeof v === 'number' && Number.isFinite(v);
    case 'integer': return Number.isInteger(v);
    case 'array': return Array.isArray(v);
    case 'object': return isPlainObject(v);
    default: return false;
  }
}

function typeName(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (typeof v === 'number' && Number.isInteger(v)) return 'integer';
  return typeof v;
}

function preview(v) {
  const s = JSON.stringify(v);
  return s && s.length > 60 ? `${s.slice(0, 57)}...` : String(s);
}

function getRegex(pattern) {
  let re = regexCache.get(pattern);
  if (!re) {
    re = new RegExp(pattern, 'u');
    regexCache.set(pattern, re);
  }
  return re;
}

function isValidDate(s) {
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function err(path, message) {
  return { path, message };
}
