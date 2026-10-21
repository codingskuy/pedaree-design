# Changelog — pedaree-design

Format mengikuti Keep a Changelog; versi mengikuti TownHall.

## [Belum dirilis]

### Ditambahkan
- Token 5 status kedaluwarsa + 3 status stok (`teks`/`latar`/`penanda`), tema terang dan gelap, keluaran CSS/TS/Compose, pemeriksa kontras WCAG, `docs/TOKEN.md`, `.gitignore` graphify-out (PDR-DSG-002).
- Fondasi AI-dev v1.0.0: `AGENTS.md`, `CLAUDE.md`, ADR-0001, `docs/ARSITEKTUR-AI-DEV.md` (2026-10-14).

### Diubah
- BREAKING token: nama lama (`stok-tersedia`, `kedaluwarsa-lewat`, dll.) diganti struktur `warna.kedaluwarsa.*`/`warna.stok.*`; `jarak` kini `rem`. Belum ada konsumen (PDR-DSG-002).
