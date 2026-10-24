# Usulan: standar waktu pengerjaan per tingkat kesulitan dan paket Level 1-4

Status: DISETUJUI pemilik 2026-10-24 (D-99), Simulasi pilihan B. Tahap 1 (aturan)
sudah diterapkan; tahap 2 dan 3 belum.

## 1. Masalah

- Prompt B (penyusun) tidak memuat aturan `estimatedMinutes`, sehingga angka
  itu ditebak penyusun. Prompt C hanya menilai "estimasi waktu wajar".
- Perkiraan waktu soal LIVE MSK dan PK mencapai 164-292% dari durasi
  T1/T2/SIM (D-98). Kelebihan terbesar ada di esai dan kasus.
- Pendorong utamanya adalah panjang jawaban ideal. Rata-rata soal LIVE saat
  ini:

| Tipe | Mudah | Sedang | Sulit | Sangat sulit |
|---|---|---|---|---|
| PG: kata stem + opsi | 110 | 133 | 149 | 180 |
| Esai: kata jawaban ideal | 232 | 327 | 404 | 435 |
| Kasus mini: kata jawaban ideal | - | 519 | 698 | - |
| Kasus komprehensif: kata jawaban ideal | - | 771 | 793 | 899 |

- Bagian paket belum dapat disaring per tingkat kesulitan
  (`difficultyTarget` hanya porsi skor minimal), sehingga paket "khusus soal
  mudah" belum bisa dibuat.

## 2. Prinsip

1. `estimatedMinutes` tidak lagi bebas. Nilainya **sama dengan standar** di
   tabel 3 untuk tipe dan tingkat kesulitan soal itu.
2. Tingkat kesulitan dipilih dari **kriteria yang dapat diukur**: tingkat
   kognitif, jumlah langkah, panjang bacaan, dan panjang jawaban ideal.
   Soal yang melebihi batas kriteria harus dipendekkan atau dinaikkan
   tingkat kesulitannya.
3. Rumus pemeriksa:
   `waktu ≈ kata bacaan ÷ 150 + kata jawaban ideal ÷ 20 + menit hitung`.
   Ini asumsi kecepatan baca teks teknis 150 kata/menit dan menulis jawaban
   (termasuk berpikir) 20 kata/menit. Angka ini perlu diuji oleh pemilik.
4. Durasi paket = jumlah standar waktu soal di dalamnya, dibulatkan ke 5
   menit. Karena tiap soal punya waktu tetap, durasi selalu terukur.

## 3. Standar waktu dan kriteria (usulan)

Standar waktu dalam menit:

| Tipe | Mudah | Sedang | Sulit | Sangat sulit |
|---|---|---|---|---|
| PG | 1 | 1,5 | 2,5 | 3,5 |
| Esai | 6 | 10 | 15 | 20 |
| Kasus mini | 15 | 20 | - | - |
| Kasus komprehensif | - | - | 40 | 45 |

Usulan: ukuran kasus mengikuti tingkat kesulitan. Kasus **mini** hanya mudah
atau sedang, dan kasus **komprehensif** hanya sulit atau sangat sulit.

Kriteria per sel (batas atas):

| Tipe | Mudah | Sedang | Sulit | Sangat sulit |
|---|---|---|---|---|
| PG | C2-C3, satu konsep, stem+opsi ≤ 90 kata, tanpa hitungan | C3, penerapan pada situasi, ≤ 120 kata, maks 1 langkah hitung | C4, analisis, ≤ 160 kata atau tabel kecil, 2-3 langkah | C5-C6, integrasi ≥ 2 konsep, ≤ 200 kata, ≥ 3 langkah atau data kuantitatif |
| Esai | 1 perintah (jelaskan/identifikasi), stem ≤ 120 kata, jawaban ideal ≤ 100 kata | 2 perintah, penerapan, stem ≤ 150 kata, jawaban ideal ≤ 170 kata | 2-3 perintah, analisis + rekomendasi, stem ≤ 200 kata, jawaban ideal ≤ 250 kata | 3 perintah, evaluasi alternatif/sintesis, stem ≤ 250 kata, jawaban ideal ≤ 330 kata |
| Kasus | Mini: narasi+data ≤ 300 kata, 2 sub, jawaban ideal total ≤ 230 kata | Mini: narasi+data ≤ 400 kata, 2-3 sub, jawaban ideal total ≤ 320 kata | Komprehensif: narasi+data ≤ 700 kata, 4 sub, jawaban ideal total ≤ 600 kata, hitung ≤ 5 menit | Komprehensif: narasi+data ≤ 900 kata, 4 sub, jawaban ideal total ≤ 650 kata, hitung ≤ 5 menit |

Jawaban ideal adalah jawaban yang cukup untuk nilai penuh, bukan jawaban
selengkap mungkin. Penjelasan tambahan untuk peserta ditaruh di pembahasan,
yang tidak dihitung.

## 4. Paket (usulan)

Bobot skor tetap PG/esai/kasus = 20/40/40 untuk Level 1-4. Setiap level hanya
memakai soal satu tingkat kesulitan.

| Paket | Kesulitan | PG | Esai | Kasus | Perhitungan | Durasi |
|---|---|---|---|---|---|---|
| Level 1 | mudah | 10 | 3 | 1 mini | 10 + 18 + 15 = 43 | 45 menit |
| Level 2 | sedang | 10 | 3 | 1 mini | 15 + 30 + 20 = 65 | 65 menit |
| Level 3 | sulit | 10 | 3 | 1 komprehensif | 25 + 45 + 40 = 110 | 110 menit |
| Level 4 | sangat sulit | 10 | 3 | 1 komprehensif | 35 + 60 + 45 = 140 | 140 menit |

Simulasi Ujian (Advanced Level) adalah campuran keempat tingkat. Ada dua
pilihan:

| Pilihan | PG (m/s/su/ss) | Esai (s/su/ss) | Kasus komprehensif | Perhitungan | Durasi | Porsi skor sulit+sangat sulit |
|---|---|---|---|---|---|---|
| A: komposisi SPEC sekarang | 17 (2/4/7/4) | 5 (1/2/2) | 2 (sulit 1, sangat sulit 1) | 39,5 + 80 + 85 | 205 menit | 84% |
| B: tetap 180 menit | 15 (2/3/6/4) | 4 (1/2/1) | 2 (sulit 1, sangat sulit 1) | 35,5 + 60 + 85 | 180 menit | 82% |

Bobot SIM tetap 17/50/33 (SPEC 6). Komposisi per tingkat menjadi aturan
pemilihan soal, bukan sekadar porsi skor minimal.

## 5. Dampak pada bank soal sekarang (163 soal LIVE MSK + PK)

Rasio estimasi sekarang terhadap standar usulan:

| Tipe | ≤ 125% | 125-150% | 150-200% | > 200% |
|---|---|---|---|---|
| PG | 57 | 37 | 10 | 1 |
| Esai | 1 | 13 | 19 | 2 |
| Kasus mini | 0 | 1 | 7 | 3 |
| Kasus komprehensif | 2 | 2 | 8 | 0 |

- PG: sebagian besar cukup diberi angka standar tanpa mengubah isi.
- Esai dan kasus: jawaban ideal perlu dipendekkan, atau tingkat kesulitannya
  dinaikkan. Jawaban ideal dan rubrik termasuk `contentHash`, sehingga soal
  yang dipendekkan kembali menjadi Draf dan perlu direview ulang.
- `estimatedMinutes` dan `difficulty` di luar `contentHash`. Soal yang hanya
  berubah angka itu tetap LIVE (D-63).
- Kekurangan stok untuk Level 1 dan 2. Sebaran soal LIVE per tingkat
  (mudah/sedang/sulit/sangat sulit):
  - MSK: PG 5/11/11/3, esai 1/4/7/3, kasus mini 0/1/2/0, komprehensif
    0/0/1/3.
  - PK: PG 12/28/28/7, esai 0/7/8/5, kasus mini 0/4/4/0, komprehensif
    0/2/3/3.
  - Kasus mini sulit (6 soal) dan komprehensif sedang (2 soal) melanggar
    aturan ukuran kasus usulan dan perlu diklasifikasi ulang.
  - Agar setiap level cukup bervariasi, sasaran stok per mata ujian per
    tingkat adalah minimal 30 PG, 9 esai, dan 3 kasus.

## 6. Tahapan bila disetujui

1. **Aturan:** SPEC 6 dan 8, CONTRACT, Prompt B (bagian aturan penyusunan:
   tabel standar dan kriteria), dan Prompt C (dimensi timeEstimate
   dibandingkan dengan standar). Perubahan prompt dicatat di CHANGELOG.md.
2. **Aplikasi:**
   - Bagian paket boleh punya filter `difficulty` (skema pack).
   - Lint impor batch memberi peringatan bila `estimatedMinutes` tidak sama
     dengan standar atau panjang jawaban ideal melebihi batas.
   - Paket Level 1-4 dan SIM baru di pack MSK dan PK.
   - Tab Statistik menampilkan stok per tingkat terhadap sasaran.
3. **Bank soal:**
   - Alat untuk menyetel `estimatedMinutes` = standar, tetap LIVE.
   - Daftar soal yang perlu dipendekkan atau diklasifikasi ulang.
   - Formulir gelombang berikutnya mengisi kekurangan stok Level 1-2.

## 7. Keputusan yang dibutuhkan

1. Angka standar waktu (tabel 3), atau angka lain setelah Anda menguji
   beberapa soal sendiri.
2. Ukuran kasus mengikuti tingkat kesulitan (mini = mudah/sedang,
   komprehensif = sulit/sangat sulit): ya atau tidak.
3. Komposisi Level 1-4: 10 PG, 3 esai, 1 kasus.
4. Simulasi: pilihan A (205 menit) atau B (180 menit).
5. Nama paket T1, T2, dan SIM lama: diganti Level 1-4 + Simulasi, atau tetap
   dipertahankan berdampingan.
