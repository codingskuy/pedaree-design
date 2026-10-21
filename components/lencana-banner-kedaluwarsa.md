# Lencana, banner, dan push kedaluwarsa (PDR-DSG-004)

Sumber: `notifikasi/10-sop-kedaluwarsa.md` bab 2, 3, 4, 6 (3.3 = kanal Varian 1). Menggantikan `BilahKedaluwarsa` 3 status di `components/inventori.md` (komponen itu kini merujuk 5 status).
Token dan ikon: `docs/TOKEN.md`.

## Kanal Varian 1

| Platform | Push | Lencana | Banner |
|---|---|---|---|
| Mobile KMP | FCM (jam 06:30-20:00 WIB; di luar jam antre sampai 06:30) | lencana status per batch + lencana ANGKA di tab Dapur | banner di detail item |
| Web (Bun/SvelteKit) | TIDAK ada (tanpa push browser Varian 1) | lencana status per batch | banner di halaman detail/daftar |
| SMS/email/WhatsApp | tidak ada Varian 1 | - | - |

## LencanaKedaluwarsa

Properti: `status` (`AMAN | WASPADA | SEGERA | HARI_INI | KEDALUWARSA`), `sisaHari` (integer, boleh negatif), `beku` (boolean, bahan FREEZER).

| Status | Label | Ikon | Token |
|---|---|---|---|
| AMAN | tidak tampil di daftar padat; `Aman` di detail | lingkaran-centang | `warna.kedaluwarsa.aman.*` |
| WASPADA | `H-7` .. `H-4` (`H-{sisaHari}`) | jam | `warna.kedaluwarsa.waspada.*` |
| SEGERA | `H-3` .. `H-1` | segitiga-peringatan | `warna.kedaluwarsa.segera.*` |
| HARI_INI | `Pakai hari ini` | segi-delapan-seru | `warna.kedaluwarsa.hari-ini.*` |
| KEDALUWARSA | `Kedaluwarsa` | silang-lingkaran | `warna.kedaluwarsa.kedaluwarsa.*` |

- Bentuk: teks `teks` di atas `latar`, garis tepi 1 dp/px `penanda`, lencana bukan kontrol sehingga tidak butuh area ketuk 48; ikon + teks selalu bersama, ikon `aria-hidden`/`contentDescription = null` karena teks sudah memberi arti.
- Daftar utama: hanya batch TERDEKAT per item (agregasi SOP 3.1).
- Bahan beku: tambah teks `beku` setelah label (`H-2 · beku`); ambang tidak berubah.
- Kategori SISA: umur default 2 hari dan langsung `SEGERA` sejak H+1 (SOP bab 6); label tetap `H-n`.
- Batch tanpa tanggal (`null`, mis. garam, gula): tidak ada lencana (di luar SOP).

## LencanaAngka (mobile, tab Dapur)

- Angka = jumlah item yang batch terdekatnya berstatus `SEGERA`, `HARI_INI`, atau `KEDALUWARSA`. ASUMSI: SOP hanya menyebut "badge angka di tab Dapur" tanpa definisi; definisi ini perlu dikonfirmasi.
- Warna: mengikuti status paling mendesak di antara yang terhitung, urutan prioritas `HARI_INI` > `KEDALUWARSA` > `SEGERA` (ASUMSI; `HARI_INI` masih bisa diselamatkan, `KEDALUWARSA` tinggal dibuang). Angka tetap teks, tidak pernah hanya titik berwarna.
- Maks `99+`; deskripsi aksesibilitas `{n} bahan perlu tindakan`.

## BannerKedaluwarsa

Properti: `status` (WASPADA ke atas), `nama`, `sisa`, `tanggal`, `sisaHari`. Tidak ditampilkan untuk AMAN.

| Status | Teks (template SOP 3.2) | Aksi (SOP bab 4) |
|---|---|---|
| WASPADA | `[{nama}] sisa {sisa} - kedaluwarsa {tanggal}. Cocok dimasak minggu ini.` | `Lihat resep` |
| SEGERA | `[{nama}] sisa {sisa} - tinggal {n} hari. Lihat resep Pawonee atau catat pakai.` | `Lihat resep` + `Catat pakai` |
| HARI_INI | `[{nama}] sisa {sisa} - pakai hari ini atau buang dan catat.` | `Catat pakai` + `Buang` |
| KEDALUWARSA | `[{nama}] {sisa} kedaluwarsa {tanggal}. Buang dan catat agar metrik waste akurat.` | hanya `Buang dan catat` |

(`-` pengganti tanda pisah panjang di sini; tampilan memakai teks persis SOP.)

- Anatomi: ikon status + teks + deretan tombol aksi; wadah `latar` + garis tepi kiri 4 dp/px `penanda`; teks `teks`.
- Tombol aksi: target >= 48; urutan: aksi utama pertama. `Catat pakai` membuka Alur B (prefill bahan), `Buang`/`Buang dan catat` membuka Alur E, `Lihat resep` membuka rekomendasi Pawonee dengan bahan ini.
- `KEDALUWARSA`: item TIDAK dapat dipilih di `Catat pakai`; batch terkunci dari FEFO (tampilkan batch dengan gaya coret dan teks `terkunci`).
- Dapat ditutup? TIDAK: banner mencerminkan keadaan data, hilang saat status berubah (batch dipakai/dibuang). Banner di daftar memadatkan banyak item menjadi satu baris `{n} bahan perlu tindakan` yang bisa dibuka.
- Aksesibilitas: wadah `role="status"` (web) / `liveRegion = Polite` (Compose) agar perubahan dibacakan tanpa merebut fokus; tidak memakai `role="alert"` kecuali galat. Pesan tidak bergantung warna.

## Push (mobile saja)

- Dikirim server (job `expiry-sweep` 06:00 WIB) hanya untuk TRANSISI NAIK tingkat (AMAN -> WASPADA -> SEGERA -> HARI_INI -> KEDALUWARSA), maks 1 push per item per hari, jam 06:30-20:00 WIB.
- Isi = template yang sama dengan banner di atas (satu sumber teks, dihasilkan server).
- Ketuk push membuka detail item dengan banner (alamat dalam aplikasi, bukan tautan web).
- Desain visual push dibatasi ikon aplikasi + judul `Pedaree` + isi template (komponen sistem OS; tidak memakai token warna).

## `testTag`/`id` (Maestro siklus 2)

`kedaluwarsa/lencana-{status}`, `kedaluwarsa/banner-{status}`, `kedaluwarsa/aksi-{lihat-resep|catat-pakai|buang}`, `dapur/lencana-angka` (status huruf kecil berstrip: `hari-ini`).
