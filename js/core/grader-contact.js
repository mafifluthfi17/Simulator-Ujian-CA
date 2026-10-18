// Pilihan "Minta dinilai pengelola" (DECISIONS D-81): peserta mengunduh berkas
// prompt + data lalu mengirimnya lewat email miliknya sendiri. Aplikasi tidak
// mengirim apa pun. Fungsi murni tanpa DOM.

// Diisi pemilik aplikasi. Bila `email` kosong, pilihan ini tidak ditampilkan.
export const GRADER_CONTACT = {
  email: '',
  responseTime: 'biasanya dalam 1×24 jam',
};

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

export function graderContactEnabled(contact = GRADER_CONTACT) {
  return EMAIL_RE.test(String(contact.email ?? '').trim());
}

export function gradingRequestFilename(session) {
  return `prompt-penilaian-${session.sessionId}.txt`;
}

// Email permintaan penilaian: { to, subject, body, href (mailto:) }.
// Isi email tidak memuat jawaban; jawaban ada di lampiran.
export function gradingRequestEmail(session, { subjectName, contact = GRADER_CONTACT } = {}) {
  const to = String(contact.email ?? '').trim();
  const subject = `Permintaan penilaian ${subjectName || session.subjectId} · ${session.sessionId}`;
  const body = [
    'Yth. Pengelola Simulator Ujian CA,',
    '',
    'Mohon penilaian esai dan studi kasus untuk ujian berikut.',
    `Mata ujian: ${subjectName || session.subjectId}`,
    `Paket: ${session.packageName}`,
    `Kode sesi: ${session.sessionId}`,
    '',
    `Berkas jawaban terlampir: ${gradingRequestFilename(session)}`,
    '',
    'Terima kasih.',
  ].join('\n');
  const href = `mailto:${encodeURIComponent(to).replace(/%40/g, '@')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { to, subject, body, href };
}
