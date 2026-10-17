// Mengunduh berkas buatan aplikasi. Di iPhone/iPad unduhan masuk lewat lembar
// Bagikan/aplikasi Files, jadi ditampilkan petunjuk singkat (SPEC 2c).

import { toast } from '../ui/dom.js';
import { isIOS } from '../platform/ios.js';

export { isIOS };

// file: { filename, mime, data: string | Uint8Array }
export function saveFile({ filename, mime, data }) {
  const blob = new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  if (isIOS()) {
    toast(`Berkas ${filename} dibuat. Di iPhone/iPad: ketuk "Unduh" atau ikon Bagikan, lalu pilih "Simpan ke File".`);
  }
}
