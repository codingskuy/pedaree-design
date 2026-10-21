# Komponen inventori Pedaree

## LencanaStok

Properti: `status` (aman, menipis, habis; sama dengan enum API `StatusStok`), `label` teks jumlah.
Contoh: `<LencanaStok status="menipis" label="200 ml" />`.
Warna mengikuti `warna.stok.*` (lihat `docs/TOKEN.md`); selalu disertai ikon dan label teks.

## BilahKedaluwarsa

Properti: `status` (aman, waspada, segera, hari-ini, kedaluwarsa; sama dengan enum API `StatusKedaluwarsa`), `sisaHari` angka.
Contoh: `<BilahKedaluwarsa status="segera" sisaHari="2" />`.

## KartuResep (dipakai ulang dari Pawonee)

Dipakai apa adanya; Pedaree menempelkan `LencanaStok` di sudut kartu.
Perubahan gaya kartu dikoordinasikan dengan Pawonee.
