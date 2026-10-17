// Pembuat isi berkas turunan. Fungsi murni (tanpa fs) agar dipakai bersama oleh
// tools/build-*.mjs dan tes sinkronisasi, di Node maupun di browser.

const BANNER = 'Dibuat otomatis oleh';

export function packScript(pack) {
  return `// ${BANNER} tools/build-pack.mjs dari pack.json. Jangan diedit langsung.\n`
    + 'window.CA_SIM_PACKS = window.CA_SIM_PACKS || {};\n'
    + `window.CA_SIM_PACKS[${JSON.stringify(pack.subjectId)}] = ${JSON.stringify(pack)};\n`;
}

export function packIndexJson(ids) {
  return `${JSON.stringify(ids)}\n`;
}

export function packIndexScript(ids) {
  return `// ${BANNER} tools/build-pack.mjs. Jangan diedit langsung.\n`
    + `window.CA_SIM_PACK_INDEX = ${JSON.stringify(ids)};\n`;
}

// prompts: { "<nama>.md": teks }. Prompt ditanam agar tombol Salin Prompt + Data
// berjalan tanpa fetch (termasuk file://).
export function promptsModule(prompts) {
  const sorted = {};
  for (const name of Object.keys(prompts).sort()) sorted[name] = prompts[name].replace(/^﻿/, '').replace(/\r\n/g, '\n');
  return `// ${BANNER} tools/build-prompts.mjs dari prompts/*.md. Jangan diedit langsung.\n`
    + `export const PROMPTS = ${JSON.stringify(sorted, null, 2)};\n`;
}

// schemas: { "<nama>.schema.json": objek skema }
export function schemasModule(schemas) {
  const sorted = {};
  for (const name of Object.keys(schemas).sort()) sorted[name] = schemas[name];
  return `// ${BANNER} tools/build-schemas.mjs dari schema/*.schema.json. Jangan diedit langsung.\n`
    + `export const SCHEMAS = ${JSON.stringify(sorted, null, 2)};\n`;
}
