# Token desain Pedaree (PDR-DSG-002)

Sumber: `tokens/*.json` (format DTCG, Style Dictionary 4.3.0). Hasil bangun (`npm run bangun-token`) ke `dist/` (diabaikan git):

| Berkas sumber | Keluaran | Konsumen |
|---|---|---|
| `tokens/warna.json` + `tokens/jarak.json` (tema terang) | `dist/css/tokens-terang.css`, `dist/ts/tokens-terang.{js,d.ts}`, `dist/compose/PedareeTokenTerang.kt` | `pedaree-web` (SvelteKit), `pedaree-app-kmp` |
| `tokens/warna-gelap.json` (tema gelap) | `dist/css/tokens-gelap.css`, `dist/ts/tokens-gelap.{js,d.ts}`, `dist/compose/PedareeTokenGelap.kt` | idem |

Pemeriksaan: `npm run periksa` (kelengkapan + kontras WCAG) dan `npm run uji` (uji unit pemeriksa).

## Nama status = enum openapi backend

Nama token mengikuti enum `StatusKedaluwarsa` dan `StatusStok` di `docs/api/openapi.yaml` backend
(cabang `feat/pdr-be-004-endpoint-stok`, PR pedaree-backend-service#9). Klien memetakan nilai API ke token
dengan huruf kecil dan `_` menjadi `-` (`HARI_INI` -> `hari-ini`). Status stok memakai nama API (`AMAN`, `MENIPIS`, `HABIS`);
nama lama `tersedia` dan `lewat` DIHAPUS.

| API | Token | Ambang (SOP `notifikasi/10` bab 2) | Warna | Label wajib | Ikon (bentuk, bukan warna) |
|---|---|---|---|---|---|
| `AMAN` | `warna.kedaluwarsa.aman` | > 7 hari | hijau | `Aman` (boleh disembunyikan di daftar padat, wajib di detail) | lingkaran-centang |
| `WASPADA` | `warna.kedaluwarsa.waspada` | 4-7 hari | kuning | `H-7` .. `H-4` | jam |
| `SEGERA` | `warna.kedaluwarsa.segera` | 1-3 hari | oranye | `H-3` .. `H-1` | segitiga-peringatan |
| `HARI_INI` | `warna.kedaluwarsa.hari-ini` | 0 hari | merah | `Pakai hari ini` | segi-delapan-seru |
| `KEDALUWARSA` | `warna.kedaluwarsa.kedaluwarsa` | < 0 | abu-merah | `Kedaluwarsa` | silang-lingkaran |

| API | Token | Syarat (`metrik/10` bab 1) | Warna | Label wajib | Ikon |
|---|---|---|---|---|---|
| `AMAN` | `warna.stok.aman` | `stokTampil > stokMinimum` | hijau | `Aman` + jumlah | lingkaran-centang |
| `MENIPIS` | `warna.stok.menipis` | `0 < stokTampil <= stokMinimum` | kuning-ambar | `Menipis` + jumlah | batang-setengah |
| `HABIS` | `warna.stok.habis` | `stokTampil = 0` | merah | `Habis` | lingkaran-kosong |

`warna.stok.*` adalah ALIAS: `aman` -> `kedaluwarsa.aman`, `menipis` -> `kedaluwarsa.waspada`, `habis` -> `kedaluwarsa.hari-ini`.
Hijau/kuning/merah dibuat satu agar pengguna tidak belajar dua palet; nilai keluaran tetap terpisah per nama.
Bila kelak ingin dipisah, ubah alias di sumber (tidak mengubah nama token).

## Struktur tiap status: `teks`, `latar`, `penanda`

- `teks`: warna teks/ikon di atas `latar` (lencana, banner) dan di atas `permukaan.halaman` (teks langsung di halaman).
- `latar`: warna isi lencana/banner.
- `penanda`: warna grafis non-teks (titik, bilah, garis tepi, batang grafik); minimal 3:1 terhadap halaman.

Aturan pakai:
1. Warna TIDAK PERNAH jadi satu-satunya penanda (WCAG 1.4.1): setiap status selalu tampil bersama label teks dan ikon berbentuk beda (tabel di atas).
2. Teks status selalu `teks` di atas `latar` (>= 4.5:1). Jangan memakai `penanda` untuk teks.
3. `KEDALUWARSA` ditambah gaya coret pada nama batch dan tidak menawarkan aksi selain `Buang dan catat` (SOP bab 4); status ini lebih redup, bukan lebih terang, dari `HARI_INI`.
4. Mode gelap dipilih lewat `prefers-color-scheme` (Compose: `isSystemInDarkTheme()`); web menurunkannya ke `:root[data-tema="gelap"]`.

## Kontras terukur (WCAG 2.x, `scripts/periksa-token.mjs`)

Terang: teks/latar, teks/halaman, penanda/halaman. Ambang: 4,5 / 4,5 / 3,0.

| Status | teks/latar | teks/halaman | penanda/halaman |
|---|---|---|---|
| aman | 4,6 | 5,1 | 5,1 |
| waspada | 6,1 | 6,7 | 3,1 |
| segera | 5,0 | 6,1 | 4,1 |
| hari-ini | 5,6 | 6,9 | 5,4 |
| kedaluwarsa | 6,0 | 7,7 | 4,8 |

Gelap: semua >= 7,3 untuk teks dan >= 5,6 untuk penanda. Pemeriksa gagal (kode keluar 1) bila ada pasangan di bawah ambang di salah satu tema.
Diverifikasi: perhitungan rasio kontras. TIDAK diverifikasi: uji kebutaan warna dengan simulator dan uji perangkat nyata (perlu Figma/penguji manusia).

## Pemetaan ke Compose (KMP)

`PedareeTokenTerang` / `PedareeTokenGelap` adalah `object` Kotlin (paket `id.chefgenie.pedaree.desain`, ASUMSI: paket final ditentukan `pedaree-app-kmp`).
Nama properti camelCase dari jalur token: `warna.kedaluwarsa.hari-ini.teks` -> `warnaKedaluwarsaHariIniTeks`.

```kotlin
// jembatan di pedaree-app-kmp (contoh, bukan bagian repo ini)
data class WarnaStatus(val teks: Color, val latar: Color, val penanda: Color)

fun StatusKedaluwarsa.warna(gelap: Boolean): WarnaStatus = if (gelap) when (this) {
    HARI_INI -> WarnaStatus(PedareeTokenGelap.warnaKedaluwarsaHariIniTeks, PedareeTokenGelap.warnaKedaluwarsaHariIniLatar, PedareeTokenGelap.warnaKedaluwarsaHariIniPenanda)
    // ... status lain serupa
} else when (this) { /* PedareeTokenTerang.* */ }
```

Jarak berupa `Dp` (`jarakSentuhMin = 48.dp`). Satuan sumber `rem` dengan 1rem = 16dp/16px (transformasi `compose` Style Dictionary).
Berkas `.kt` dihasilkan; salin ke modul desain `pedaree-app-kmp` lewat langkah build atau pembaruan manual berurutan (otomatisasi lintas-repo di luar tiket ini).

## Pemetaan ke CSS dan TS (SvelteKit)

```css
@import 'tokens-terang.css';
@import 'tokens-gelap.css';           /* aktif saat <html data-tema="gelap"> */
.lencana[data-status='hari-ini'] {
  color: var(--pdr-warna-kedaluwarsa-hari-ini-teks);
  background: var(--pdr-warna-kedaluwarsa-hari-ini-latar);
  border: 1px solid var(--pdr-warna-kedaluwarsa-hari-ini-penanda);
}
```

```ts
import * as terang from '@pedaree/desain/ts/tokens-terang.js'; // contoh impor; nama paket ditentukan pedaree-web
terang.WarnaKedaluwarsaHariIniTeks; // '#b3141c'
```

Variabel CSS berawalan `pdr-`. Komponen web membaca `data-status` dari nilai enum API (huruf kecil, `-`).
Tailwind tidak diwajibkan oleh repo desain; bila web memakainya, petakan variabel `--pdr-*` di konfigurasinya.

## Perubahan dari versi sebelumnya

- Hapus `stok-tersedia`, `stok-menipis`, `stok-habis`, `kedaluwarsa-aman`, `kedaluwarsa-segera`, `kedaluwarsa-lewat`, `latar`, `teks` (datar, 3 status).
- Ganti dengan struktur `warna.kedaluwarsa.{5 status}.{teks,latar,penanda}`, `warna.stok.{3 status}.{...}`, `warna.permukaan.*`.
- Nilai warna disetel ulang agar pasangan teks/latar lulus AA; `jarak` kini memakai `rem` dan ada `sentuh-min`.
- Belum ada konsumen di `pedaree-app-kmp`/`pedaree-web` (keduanya belum memakai token), jadi tidak ada migrasi klien.
