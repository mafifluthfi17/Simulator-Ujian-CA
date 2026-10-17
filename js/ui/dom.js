// Pembuat elemen yang aman: semua teks masuk sebagai text node (textContent),
// tidak pernah lewat innerHTML (SPEC 10). Modul ini tidak menyentuh DOM saat
// diimpor sehingga modul tipe soal tetap dapat diimpor di Node.

const PROPERTIES = new Set(['value', 'checked', 'disabled', 'hidden', 'selected', 'open', 'multiple']);

export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'text') el.textContent = value;
    else if (key === 'dataset') Object.assign(el.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (PROPERTIES.has(key)) el[key] = value;
    else el.setAttribute(key, value === true ? '' : String(value));
  }
  append(el, children);
  return el;
}

export function append(el, children) {
  for (const child of [children].flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

export function clear(el) {
  el.replaceChildren();
  return el;
}

// Teks multi-baris dari soal/jawaban: tetap textContent, baris baru dipertahankan CSS (white-space: pre-wrap).
export function textBlock(text, className = 'prose') {
  return h('div', { class: className, text: text || '' });
}

let dialogCounter = 0;

// Dialog konfirmasi. Hasil: Promise<boolean>.
export function confirmDialog({ title, body = [], confirmLabel = 'Ya', cancelLabel = 'Batal', danger = false }) {
  return new Promise((resolve) => {
    const id = `dlg-title-${++dialogCounter}`;
    const dialog = h('dialog', { class: 'dialog', 'aria-labelledby': id },
      h('h2', { id, text: title }),
      h('div', { class: 'dialog-body' }, [body].flat().map((b) => (typeof b === 'string' ? h('p', { text: b }) : b))),
      h('div', { class: 'dialog-actions' },
        cancelLabel ? h('button', { type: 'button', class: 'btn', onclick: () => close(false) }, cancelLabel) : null,
        h('button', { type: 'button', class: danger ? 'btn btn-danger' : 'btn btn-primary', onclick: () => close(true) }, confirmLabel)));
    function close(result) {
      dialog.close();
      dialog.remove();
      resolve(result);
    }
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      if (cancelLabel) close(false);
    });
    document.body.append(dialog);
    dialog.showModal();
  });
}

export function alertDialog(title, body) {
  return confirmDialog({ title, body, confirmLabel: 'Tutup', cancelLabel: null });
}

let toastTimer = null;

export function toast(message, { assertive = false } = {}) {
  let region = document.getElementById('toast');
  if (!region) {
    region = h('div', { id: 'toast', class: 'toast', role: 'status' });
    document.body.append(region);
  }
  region.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
  region.textContent = message;
  region.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => region.classList.remove('show'), 5000);
}
