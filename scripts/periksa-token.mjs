// Pemeriksa token Pedaree: kelengkapan status, kesesuaian nama dengan openapi, dan kontras WCAG.
// Jalankan: npm run periksa  (keluar kode 1 bila ada pelanggaran).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const akar = join(dirname(fileURLToPath(import.meta.url)), '..');

// Enum openapi backend (StatusKedaluwarsa / StatusStok), dalam kebab-case token.
export const STATUS_KEDALUWARSA = ['aman', 'waspada', 'segera', 'hari-ini', 'kedaluwarsa'];
export const STATUS_STOK = ['aman', 'menipis', 'habis'];

export function luminansi(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export function kontras(a, b) {
  const x = luminansi(a), y = luminansi(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// Selesaikan referensi {a.b.c} pada pohon token DTCG, kembalikan peta datar nama -> nilai.
export function ratakan(pohon) {
  const datar = {};
  const jalan = (n, jejak) => {
    if (n && typeof n === 'object' && '$value' in n) { datar[jejak.join('.')] = n.$value; return; }
    for (const [k, v] of Object.entries(n ?? {})) if (!k.startsWith('$')) jalan(v, [...jejak, k]);
  };
  jalan(pohon, []);
  for (const k of Object.keys(datar)) {
    let v = datar[k], guard = 0;
    while (typeof v === 'string' && /^\{.+\}$/.test(v) && guard++ < 10) v = datar[v.slice(1, -1)];
    datar[k] = v;
  }
  return datar;
}

export function periksa(datar, tema) {
  const galat = [];
  const ada = (k) => { if (!(k in datar)) { galat.push(`${tema}: token hilang ${k}`); return false; } return true; };
  const halaman = datar['warna.permukaan.halaman'];
  for (const k of ['halaman', 'teks', 'teks-redup']) ada(`warna.permukaan.${k}`);
  if (galat.length) return galat;
  for (const [ranah, daftar] of [['kedaluwarsa', STATUS_KEDALUWARSA], ['stok', STATUS_STOK]]) {
    for (const s of daftar) {
      const dasar = `warna.${ranah}.${s}`;
      const t = ['teks', 'latar', 'penanda'].map((x) => ada(`${dasar}.${x}`));
      if (t.includes(false)) continue;
      const [teks, latar, penanda] = ['teks', 'latar', 'penanda'].map((x) => datar[`${dasar}.${x}`]);
      const cek = (nama, rasio, min) => { if (rasio < min) galat.push(`${tema}: ${dasar} ${nama} ${rasio.toFixed(2)} < ${min}`); };
      cek('teks/latar', kontras(teks, latar), 4.5);
      cek('teks/halaman', kontras(teks, halaman), 4.5);
      cek('penanda/halaman (grafis, WCAG 1.4.11)', kontras(penanda, halaman), 3);
    }
  }
  for (const k of ['teks', 'teks-redup']) {
    const r = kontras(datar[`warna.permukaan.${k}`], halaman);
    if (r < 4.5) galat.push(`${tema}: permukaan.${k}/halaman ${r.toFixed(2)} < 4.5`);
  }
  // Lima status kedaluwarsa harus berbeda satu sama lain (penanda dan latar unik).
  for (const x of ['penanda', 'latar']) {
    const nilai = STATUS_KEDALUWARSA.map((s) => datar[`warna.kedaluwarsa.${s}.${x}`]);
    if (new Set(nilai).size !== nilai.length) galat.push(`${tema}: ${x} status kedaluwarsa ada yang kembar`);
  }
  return galat;
}

export function jalankan() {
  const muat = (f) => JSON.parse(readFileSync(join(akar, 'tokens', f), 'utf8'));
  const semua = [
    ...periksa(ratakan(muat('warna.json')), 'terang'),
    ...periksa(ratakan(muat('warna-gelap.json')), 'gelap'),
  ];
  const kunciTerang = Object.keys(ratakan(muat('warna.json'))).sort().join();
  const kunciGelap = Object.keys(ratakan(muat('warna-gelap.json'))).sort().join();
  if (kunciTerang !== kunciGelap) semua.push('tema terang dan gelap tidak memiliki himpunan token yang sama');
  return semua;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const galat = jalankan();
  if (galat.length) { console.error(galat.join('\n')); process.exit(1); }
  console.log('Token OK: 5 status kedaluwarsa + 3 status stok, kontras terang & gelap memenuhi WCAG AA.');
}
