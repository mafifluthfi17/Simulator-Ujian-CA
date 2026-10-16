# Simulator Ujian CA Indonesia — aturan proyek

## Konteks
Aplikasi latihan ujian CA Indonesia, mata ujian awal Manajemen Stratejik dan
Kepemimpinan (MSK), dapat diperluas ke mata ujian lain lewat Subject Pack.
Spesifikasi lengkap: docs/SPEC.md. Baca bagian yang relevan sebelum mengubah kode.

## Aturan kerja
- Kerjakan hanya fase yang diminta. Berhenti di akhir fase dan laporkan.
- Laporan akhir fase: file dibuat/diubah, tes yang dijalankan beserta hasil,
  item BELUM DIVERIFIKASI, keputusan yang perlu persetujuan pemilik.
- Jangan pernah mengklaim tes lulus jika tes tidak dijalankan.
- Keputusan desain yang tidak diatur SPEC dicatat di docs/DECISIONS.md.
- Commit git di akhir setiap fase dengan pesan "Fase Ax: <ringkasan>".

## Teknologi
- HTML, CSS, JavaScript murni (ES2020). Tanpa framework, tanpa CDN, tanpa backend.
- Library hanya boleh untuk tooling/tes (devDependencies), tidak dimuat aplikasi.
- Target: Edge/Chrome di Windows 10/11 dan Safari iOS/iPadOS 16+.

## Batasan konten
- Jangan mengubah isi prompts/*.md kecuali bagian format data agar selaras
  dengan schema/. Setiap perubahan dicatat di CHANGELOG.md.
- Soal demo hanya di packs/demo/. Jangan menulis soal ke packs/msk/.
- Antarmuka peserta berbahasa Indonesia sederhana, tanpa istilah teknis.

## Perintah
- Tes logika: node --test
- Validasi skema dan pack: node tools/validate.mjs
- Self-test di browser: index.html?selftest
