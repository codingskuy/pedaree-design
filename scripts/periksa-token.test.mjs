import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kontras, ratakan, periksa, jalankan } from './periksa-token.mjs';

test('kontras hitam-putih = 21', () => {
  assert.equal(Math.round(kontras('#000000', '#ffffff')), 21);
});

test('ratakan menyelesaikan referensi', () => {
  const d = ratakan({ a: { x: { $value: '#111111' } }, b: { $value: '{a.x}' } });
  assert.equal(d.b, '#111111');
});

test('token repo lulus semua pemeriksaan', () => {
  assert.deepEqual(jalankan(), []);
});

test('kontras rendah terdeteksi (merah)', () => {
  const d = {
    'warna.permukaan.halaman': '#ffffff', 'warna.permukaan.teks': '#000000', 'warna.permukaan.teks-redup': '#000000',
  };
  for (const r of ['kedaluwarsa', 'stok'])
    for (const s of r === 'stok' ? ['aman', 'menipis', 'habis'] : ['aman', 'waspada', 'segera', 'hari-ini', 'kedaluwarsa'])
      Object.assign(d, { [`warna.${r}.${s}.teks`]: '#000000', [`warna.${r}.${s}.latar`]: '#ffffff', [`warna.${r}.${s}.penanda`]: '#000000' });
  d['warna.kedaluwarsa.waspada.teks'] = '#ffee00';
  const galat = periksa(d, 'uji');
  assert.ok(galat.some((g) => g.includes('waspada teks/latar')));
});

test('token hilang dilaporkan', () => {
  assert.ok(periksa({ 'warna.permukaan.halaman': '#fff', 'warna.permukaan.teks': '#000', 'warna.permukaan.teks-redup': '#000' }, 'uji').length > 0);
});
