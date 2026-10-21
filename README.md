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

## Link Figma

> TODO (blocker): URL berkas Figma BELUM ADA. Tidak ada tautan Figma di repo ini, TownHall, maupun issue;
> sesi pengerjaan tidak punya akses Figma (konektor Figma belum terautentikasi), dan URL tidak boleh dikarang.
> Pemilik desain (manusia) perlu membuat berkas dan mengisi baris di bawah, lalu PR kecil memperbarui README.
> AGENTS.md mewajibkan link ini terisi; tiket PDR-DSG-004 belum dapat ditutup penuh sebelum itu.

| Berkas | URL | Pemilik | Status |
|---|---|---|---|
| Pedaree - sistem desain (token, komponen) | `BELUM-ADA (isi URL Figma)` | belum ditentukan | menunggu |
| Pedaree - flow 5 alur catat stok | `BELUM-ADA (isi URL Figma)` | belum ditentukan | menunggu |
| Pedaree - dasbor web + kartu ringkas | `BELUM-ADA (isi URL Figma)` | belum ditentukan | menunggu |

Spesifikasi sementara berupa Markdown: `docs/TOKEN.md`, `docs/FLOW-CATAT-STOK.md`, `components/`. Token di Figma harus memakai nama yang sama dengan `tokens/`.

## Isi

```text
tokens/            token desain (warna, tipografi, jarak)
components/       spesifikasi komponen (inventori, kartu ringkas, dasbor web, lencana/banner kedaluwarsa)
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
