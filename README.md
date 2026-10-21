# pedaree-design — Sistem Desain Inventori

Divisi **Pedaree (Smart Pantry)**, org **Coding-Skuy**. Opsi A.

TownHall: https://github.com/Coding-Skuy/Pedaree-TownHall

## Ringkasan

Sistem desain untuk seluruh permukaan Pedaree: aplikasi seluler, web, dan
notifikasi pengingat.Fokus pada keterbacaan inventori: status stok, label
kedaluwarsa, dan kecocokan resep.

## Modul pantry-resep

Kontrak lintas divisi (detail: `docs/MODUL-PANTRY-RESEP.md`):

- **Pemilik modul:** Pawonee (komponen kartu resep dan tampilan langkah masak).
- **Konsumen modul:** Pedaree (komponen lencana stok, bilah kedaluwarsa, dan
  penanda bahan kurang; kartu resep dipakai ulang dari Pawonee tanpa diubah
  gayanya).
- Perubahan pada kartu resep dikoordinasikan dengan repo desain Pawonee.

## Isi

```text
tokens/            token desain (warna, tipografi, jarak)
components/       spesifikasi komponen inventori
screens/          spesifikasi layar utama (stok, mutasi, resep hemat)
docs/              arsitektur dan kontrak modul
```

## Teknologi (versi dikunci)

- Node.js 22.14.0
- Style Dictionary 4.3.0
- Figma API versi 1 (ekspor token)

## Cara pakai

```bash
npm ci
npm run bangun-token
```

Hasil bangun tersedia di `dist/` (CSS, TS, Compose; tema terang dan gelap).
`npm run periksa` memeriksa kelengkapan status dan kontras WCAG; `npm run uji` menjalankan uji pemeriksa.
Petunjuk pemetaan: `docs/TOKEN.md`.
