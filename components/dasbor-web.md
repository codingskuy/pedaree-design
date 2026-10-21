# Dasbor web `/dasbor` (PDR-DSG-004)

Sumber: `metrik/10-stockout-dan-waste.md` bab 5; BRD `30-demand-metrik.md` BR-306. Platform: `pedaree-web` (Bun + Svelte 5 + SvelteKit 2, SSR). Kode React lama TIDAK dipakai sebagai acuan. Token: `docs/TOKEN.md` (variabel CSS `--pdr-*`).
Kontrak data: `GET /web/dashboard` di openapi PR pedaree-backend-service#9; kekurangannya dilacak di tiket backend #12 (PDR-BE-006).

Status kesiapan data tiap elemen:

| Elemen | Status kontrak |
|---|---|
| Enam angka ringkasan | ADA di kontrak (`DasborWeb`) |
| Grafik garis stockoutRate 90 hari | MENUNGGU KONTRAK (backend #12) |
| Tabel waste per kategori | MENUNGGU KONTRAK (backend #12) |
| Daftar 10 item paling sering habis | MENUNGGU KONTRAK (backend #12) |
| Tombol `Naikkan minimum` | MENUNGGU KONTRAK: kontrak tidak punya endpoint ubah `stokMinimum` (hanya `GET`/`POST` pada `/pantry/items`); bukan bagian #12, perlu tiket backend terpisah |
| Banner kedaluwarsa | mengikuti `lencana-banner-kedaluwarsa.md`; sumber `GET /pantry/expiring` |

Desain elemen "menunggu kontrak" dikunci pada tingkat tata letak dan perilaku; bentuk data final mengikuti kontrak yang terbit.

## Tata letak (lebar >= 1024 px; di bawahnya satu kolom)

1. Baris atas: judul `Dasbor`, pemilih periode (`Bulan ini` + 2 bulan sebelumnya, mengikuti `metrik/10` bab 1), banner kedaluwarsa bila ada.
2. Enam kartu angka (grid 3 x 2; 2 x 3 pada 600-1023 px; 1 kolom di bawah 600 px).
3. Grafik garis stockoutRate 90 hari (lebar penuh).
4. Dua kolom: tabel waste per kategori (kiri), 10 item paling sering habis (kanan); tumpuk vertikal di bawah 1024 px.

Tidak ada layar daftar/registrasi; dasbor hanya dapat dicapai setelah masuk (akun dari operator).

## 1. Enam angka (ADA di kontrak)

| Field `DasborWeb` | Label | Token | Ikon | Catatan |
|---|---|---|---|---|
| `totalItemAktif` | `Item aktif` | netral (`warna.permukaan.*`) | kotak-daftar | pembagi stockoutRate |
| `menipis` | `Menipis` | `warna.stok.menipis.*` | batang-setengah | |
| `habis` | `Habis` | `warna.stok.habis.*` | lingkaran-kosong | subteks `{persen}% dari item aktif`, dihitung di klien dari dua angka dari server (pembagian tampilan saja; bukan logika stok/FEFO) |
| `segeraKedaluwarsa3Hari` | `Segera kedaluwarsa (3 hari)` | `warna.kedaluwarsa.segera.*` | segitiga-peringatan | |
| `wasteBulanGram` | `Waste bulan ini` | netral; bilah target 1.500 g (aman -> `warna.stok.aman.penanda`; lewat -> `warna.stok.habis.penanda` + teks `Melewati target`) | tempat-sampah | format `1.200 g`; rupiah tidak tersedia di kontrak |
| `sinyalTerkirim7Hari` | `Sinyal ke TitipO (7 hari)` | netral | panah-kirim | subteks tetap `anjuran restock, bukan pesanan` |

Setiap kartu: ikon + label + angka tabular; seluruh kartu satu elemen `<a>` bila punya halaman daftar terfilter (menipis/habis/segera), selain itu `<div>`. Fokus terlihat (garis 2 px kontras >= 3:1 terhadap latar). Nilai `0`: tampilkan `0` dengan teks positif (`Tidak ada`).

## 2. Grafik stockoutRate 90 hari (MENUNGGU KONTRAK)

- Data: deret harian `stockoutRate` (%) 90 hari terakhir (rumus `metrik/10` bab 2: 100 x item HABIS / item aktif, dihitung 23:59 WIB). Bentuk respons ditunggu dari backend #12 (harian vs mingguan belum ditetapkan).
- Jenis: grafik garis satu seri. Garis seri memakai `warna.stok.habis.penanda`; garis acuan target 8% putus-putus netral dengan label langsung `Target 8%` di ujung garis (bukan hanya legenda).
- Sumbu: X tanggal (label tiap ~2 minggu), Y 0 sampai maks(data, 12)%, label `%`; garis kisi tipis netral.
- Aksesibilitas (wajib): `<figure>` dengan `aria-label` ringkas (`Stockout 90 hari: rata-rata {x}%, target 8%`); tombol `Lihat sebagai tabel` menampilkan tabel data (tanggal, %) sebagai padanan penuh; titik data dapat difokus dengan keyboard (panah kiri/kanan) dan nilai muncul di teks `aria-live=polite`; arti tidak bergantung warna karena garis acuan putus-putus + label teks.
- Ringkasan di atas grafik: rata-rata 90 hari dan status terhadap target (`Di bawah target` / `Di atas target` + ikon).
- Keadaan: memuat (kerangka), data kosong (`Belum ada data stockout`), galat (`Gagal memuat` + `Coba lagi`).

## 3. Tabel waste per kategori (MENUNGGU KONTRAK)

- Baris: 8 kategori (`SAYUR, BUMBU, BUAH, PROTEIN, KERING, CAIR, BEKU, SISA`, enum openapi `Kategori`) untuk periode terpilih.
- Kolom: `Kategori`, `Waste (g)`, `Porsi dari total (%)`. Kolom `Waste (Rp)` ditambahkan HANYA bila kontrak menyediakan `wasteRupiah` (rumus `metrik/10` bab 2 butuh harga acuan); saat ini tidak ada.
- Satuan: gram (ml dikonversi seperti `metrik/10`); format `1.500` dengan titik ribuan, rata kanan, angka tabular.
- Urut default menurun menurut waste; header kolom dapat diurut (`<button>` di `<th scope="col" aria-sort>`); baris total di `<tfoot>`.
- Bilah kecil di sel porsi memakai `warna.permukaan.teks-redup`, bukan warna status (kategori bukan status); angka tetap tertulis.
- Keadaan kosong: `Tidak ada waste pada periode ini` (positif).

## 4. 10 item paling sering habis + `Naikkan minimum` (MENUNGGU KONTRAK)

- Baris (maks 10, urut jumlah kejadian habis menurun): peringkat, nama bahan, jumlah kali habis pada periode, `stokMinimum` sekarang, tombol `Naikkan minimum`.
- Tombol: target >= 44 x 44 px, teks tetap `Naikkan minimum`; membuka dialog kecil (modal dengan fokus terkunci, `Esc` menutup) berisi input minimum baru dalam satuan tampil item, ringkasan perubahan `minimum 200 g -> 300 g`, tombol `Simpan` dan `Batal`. Sebelum simpan, ringkasan wajib tampil (selaras Aturan Umum).
- Kenaikan minimum hanya naik; nilai <= minimum lama ditolak dengan pesan.
- Perubahan ini butuh endpoint ubah item (tidak ada di kontrak sekarang); sampai tersedia, tombol TIDAK ditampilkan (jangan tombol mati yang membingungkan), daftar tampil baca-saja.
- Dampak: menaikkan minimum dapat memicu sinyal demand `stok.menipis` (debounce BR-301); dialog menyebut `dapat menambah anjuran restock`.

## Keadaan dan aksesibilitas umum

- SSR: dasbor dirender server-ke-server (kontrak `/web/dashboard` memakai service key); halaman tidak berisi token pengguna. Setelah masuk, galat 401 membawa kembali ke Masuk.
- Mode gelap: `data-tema="gelap"` mengganti variabel `--pdr-*`; semua pasangan kontras sudah diperiksa `npm run periksa`.
- Tab keyboard berurutan: filter periode, kartu, grafik, tabel, daftar; pintasan `Lewati ke isi utama`.
- Judul bagian memakai `h2`; kartu angka dalam daftar (`ul`) agar jumlahnya terbaca pembaca layar.
- Responsif: tidak ada informasi yang hanya tersedia di lebar besar; grafik mempertahankan rasio dengan tinggi min 200 px.
- `id` uji: `dasbor/kartu-{field}`, `dasbor/grafik-stockout`, `dasbor/tabel-waste`, `dasbor/top-habis`, `dasbor/naikkan-minimum-{itemId}`.

## Asumsi

1. Pembagian `habis / totalItemAktif` untuk subteks adalah presentasi, bukan logika bisnis; angka resmi stockoutRate tetap dari server.
2. Ikon dan tata letak adalah rancangan desain (tidak ada di requirement); hanya jumlah elemen dan isinya dikunci BR-306.
3. Urutan, label bahasa, dan ambang bilah waste 100% target diusulkan, perlu persetujuan produk.
