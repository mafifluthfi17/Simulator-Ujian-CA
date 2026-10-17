// Titik masuk. index.html?selftest menjalankan tes logika di browser.
import { App } from './ui/app.js';

const root = document.getElementById('app');

if (new URLSearchParams(location.search).has('selftest')) {
  import('./selftest.js').then((m) => m.runSelftest(root));
} else {
  new App(root).start().catch((e) => {
    root.textContent = `Aplikasi gagal dimuat: ${e.message}`;
    console.error(e);
  });
}
