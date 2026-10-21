# Kartu ringkas mobile (PDR-DSG-004)

Sumber: `metrik/10-stockout-dan-waste.md` bab 5; BRD `30-demand-metrik.md` BR-306 (3 kartu, dikunci). Token: `docs/TOKEN.md`. Kontrak data: openapi backend PR pedaree-backend-service#9.

Tiga kartu tampil di beranda tab Dapur, berurutan: Habis hari ini, Segera 3 hari, Buang bulan ini. Tidak boleh ditambah/dikurangi tanpa PRD/FSD baru (BR-306).

## Anatomi (semua kartu)

| Bagian | Spesifikasi |
|---|---|
| Wadah | `latar` token status, sudut membulat, garis tepi 1 dp `penanda`, seluruh kartu satu target sentuh >= `jarak.sentuh-min` (48 dp) |
| Ikon | bentuk berbeda per kartu (tabel di bawah), warna `teks` status |
| Angka | angka besar, angka tabular (lebar sama), warna `teks` status |
| Label | teks tetap (nama kartu), selalu tampil, tidak dipotong; membungkus ke baris berikut saat font diperbesar |
| Subteks | satu baris penjelasan/target; dapat membungkus |
| Aksi | ketuk kartu membuka daftar terfilter; peran semantik `button`, deskripsi `{label}: {angka}. Ketuk untuk melihat daftar` |

Tata letak: tiga kartu bertumpuk vertikal pada lebar < 600 dp; sejajar tiga kolom pada lebar >= 600 dp. Jarak antar kartu `jarak.besar`, padding dalam `jarak.besar`.
Tipografi: ASUMSI belum ada token tipografi; angka memakai gaya headline, label gaya label medium, subteks gaya body kecil (skala Material 3). Token tipografi menyusul di tiket terpisah.

## Kartu 1 - Habis hari ini

| Item | Spesifikasi |
|---|---|
| Token | `warna.stok.habis.*`; ikon lingkaran-kosong |
| Angka | jumlah item aktif berstatus `HABIS` saat ini |
| Subteks | `item perlu dibeli`; nol: `Tidak ada yang habis` (keadaan positif, memakai `warna.stok.aman.*` dan ikon lingkaran-centang) |
| Sumber data | `GET /pantry/items?statusStok=HABIS` (paginasi kursor). KONTRAK TIDAK memuat total: hitung dengan membaca semua halaman (maks 400 item aktif, `limit=100` = maks 4 panggilan) |
| Ketuk | daftar item terfilter `HABIS`, dengan aksi `Catat masuk` |

ASUMSI: "hari ini" dibaca sebagai keadaan saat ini (stok = 0 sekarang), karena kontrak tidak menyediakan data transisi per hari. Bila produk menginginkan "baru habis hari ini" perlu data transisi (menunggu kontrak).

## Kartu 2 - Segera 3 hari

| Item | Spesifikasi |
|---|---|
| Token | `warna.kedaluwarsa.segera.*`; ikon segitiga-peringatan |
| Angka | jumlah batch dengan sisa 0-3 hari (status `HARI_INI` dan `SEGERA`) |
| Subteks | `pakai atau masak dulu`; bila ada `HARI_INI`: `{n} pakai hari ini` ditambahkan dengan ikon segi-delapan-seru dan `warna.kedaluwarsa.hari-ini.teks` |
| Sumber data | `GET /pantry/expiring?dalamHari=3` (urut FEFO, tiap baris punya `status`) |
| Ketuk | daftar `BatchKedaluwarsa` urut FEFO, tiap baris punya aksi sesuai SOP bab 4 (`Lihat resep`, `Catat pakai`) |

ASUMSI untuk diverifikasi dengan backend: `dalamHari=3` memuat `HARI_INI` (0 hari) dan tidak memuat `KEDALUWARSA` (< 0). Batch `KEDALUWARSA` TIDAK dihitung di kartu ini; ia muncul lewat banner (lihat `lencana-banner-kedaluwarsa.md`).
Satuan hitung: batch, bukan item (satu item dapat punya beberapa batch); label di daftar menyebut nama bahan.

## Kartu 3 - Buang bulan ini

| Item | Spesifikasi |
|---|---|
| Token | wadah netral (`warna.permukaan.*`); isi bilah target memakai `warna.stok.aman.penanda`, melewati target memakai `warna.stok.habis.penanda` |
| Angka | `wasteGram` bulan kalender berjalan (WIB), format `1.200 g` |
| Subteks | `dari target 1.500 g` + bilah kemajuan; teks `Melewati target` + ikon segitiga-peringatan saat > 1.500 g (tidak bergantung warna) |
| Sumber data | MENUNGGU KONTRAK: openapi PR #9 hanya punya `wasteBulanGram` di `GET /web/dashboard` (SSR web, memakai service key, bukan token pengguna). Tidak ada endpoint mobile untuk agregat waste |
| Ketuk | riwayat buang bulan ini (juga menunggu kontrak: tidak ada endpoint daftar mutasi untuk mobile) |

Target Varian 1: waste <= 1.500 g dan <= Rp50.000 per rumah tangga per bulan. `wasteRupiah` tidak ada di kontrak, jadi kartu hanya menampilkan gram; baris rupiah ditambahkan setelah kontrak menyediakannya (menunggu kontrak).
ASUMSI visual: ambang warna bilah di 100% target (tidak ada ambang menengah di requirement).

## Keadaan semua kartu

| Keadaan | Tampilan |
|---|---|
| Memuat | kerangka (skeleton) seukuran kartu; tanpa angka palsu |
| Galat | ikon galat + `Gagal memuat` + tombol `Coba lagi`; kartu lain tetap tampil |
| Luring | angka terakhir yang tersimpan + `Terakhir diperbarui {jam}` (teks, bukan hanya warna redup) |
| Nol | pesan netral/positif tanpa merayakan berlebihan |
| Mode gelap | token tema gelap; diperiksa kontrasnya oleh `npm run periksa` |
| Aksesibilitas | urutan fokus 1-2-3; label dibaca `Habis hari ini, 3 item`; angka dan label tidak bergantung warna; target sentuh >= 48 dp; teks mengikuti skala font sistem hingga 200% tanpa terpotong |

`testTag`/`id` (Maestro siklus 2): `kartu/habis`, `kartu/segera`, `kartu/buang`.
