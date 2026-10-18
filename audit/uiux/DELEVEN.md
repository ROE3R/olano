# DELEVEN.md — PEMBAGIAN FILE GELAMBANG PERBAIKAN (SERAHAN D / ownership note)

Tujuan: subagent perbaikan paralel tidak saling menimpa. Satu subagent = satu set file. **DILARANG menyentuh file di luar kuotamu.** Tracker temuan: `ui-ux-findings.md` (edit blok SECTION milikmu saja).

## Fakta struktur repo (dasar pemisahan — diprobe 18 Okt 2026)

- `index.html` (401 baris) — landing lengkap; TANPA blok `<style>` internal → semua style landing di `main.css`.
- `app/kasir.html` (528 baris) — POS kanonik (root `kasir.html` hanya redirect + `noindex`; manifest `start_url: app/kasir.html`). Juga TANPA blok `<style>` → style POS juga di `main.css`.
- `assets/css/main.css` (1275 baris) — SATU file berisi zona landing (RESET/TYPE/NAV/HERO/CARD/HARGA/FOOTER/TOOLS ≈ L1-L630) DAN zona `/* ===== POS APP ===== */` (baris ±423-489, plus sebagian FORMS/FAQ).
- `assets/js/shared.js` (449 baris) — helper `OLANO.rp/num/short` + widget landing: reveal, countUp, spotlight, slideNum, heroScenes.
- `assets/js/config.js` (159 baris) — single source of truth angka (pricing, pajak, QRIS, WA, testimoni).
- `assets/js/qrcode.js` — ES module, dipakai HANYA `app/kasir.html`. `assets/js/motion.js` (3 baris) — hanya `index.html`.
- `sw.js` — cache `olano-v29`; `manifest.json` — PWA.

Implikasi: main.css adalah titik tabrakan utama → dipisah per ZONA baris, bukan per file penuh.

---

## Kuota kepemilikan

| # | Subagent | File yang BOLEH diubah | DILARANG menyentuh |
|---|---|---|---|
| 1 | **pos-fix** (Fase 1-2, R7-R3, layar A-J, C1, C2) | `app/kasir.html`; zona `/* POS APP */` + `/* FORMS (general) */` di `main.css`; `assets/js/qrcode.js` (bila perlu); root `kasir.html` HANYA untuk redirect/noindex | `index.html`; zona landing `main.css`; `shared.js`; `config.js`; `motion.js`; `sw.js`; `manifest.json` |
| 2 | **landing-fix** (Fase 3-6, L1-L37, R1-R0, C3) | `index.html`; zona landing `main.css` (semua blok di LUAR `POS APP`/`FORMS`); `assets/js/motion.js` | `app/kasir.html`; zona POS `main.css`; `shared.js`; `config.js`; `qrcode.js`; `sw.js`; `manifest.json` |
| 3 | **shared-fix** (SATU pemilik zona bersama) | zona token `:root`/RESET/TYPE/BUTTON di `main.css`; `assets/js/shared.js`; `assets/js/config.js`; `sw.js`; `manifest.json`; `404.html`; halaman `alat/*` & halaman lain (bagian 6 brief) | `index.html` body; `app/kasir.html` body; zona baris milik #1/#2 di `main.css` |
| 4 | **perf-findings** (Fase 0 + C1-C3, Lighthouse/CWV) | TIDAK MENGUBAH SOURCE — hanya tulis laporan (`laporan-lighthouse.md`, bukti ukur, baris C1-C3 di tracker) | semua source |

## Aturan anti-tabrakan

1. **Zona main.css berdasar baris**: setiap subagent mencantumkan komentar penanda di atas edit (`/* [pos-fix] L-xxx <tanggal> */`). Rename class bersama (btn, card, pill) → MELALUI shared-fix saja.
2. **Edit berbasis patch kecil**, satu perubahan = satu commit (aturan brief §10). Jangan reformat ulang file utuh (memicu konflik merge dengan pemilik zona lain).
3. **Kebutuhan lintas kuota** (mis. landing butuh token baru, POS butuh helper shared.js baru): jangan edit langsung — catat baris TODO di tracker + ping shared-fix; shared-fix mengakomodasi lewat API/token yang sudah ada.
4. **config.js = read-only untuk #1/#2** — angka K12 tidak boleh berubah; kebutuhan perubahan dikirim ke shared-fix dengan alasan eksplisit.
5. **sw.js hanya shared-fix**: naikkan CACHE version (saat ini `olano-v29`) SETELAH batch perubahan aset, supaya PWA pengguna mengambil aset baru; jangan naikkan per commit kecil.
6. **Urutan aman**: Fase 0 (perf-findings, semua read-only) → Fase 1-2 (pos-fix) dan Fase 3-6 (landing-fix) boleh PARALEL selama zona file tidak silang → Fase 7 (shared-fix poles + sw/manifest) → regresi akhir bersama.
7. Semua subagent patuh: light mode, #2453EB, anti-slop (tanpa pustaka UI baru, CSS native), anchors `#main #modul #alat #pajak #harga #demo` tidak dihapus, fakta F1-F14 dibekukan (COPY-NANTI.md), keputusan K1/K3/K5/K7/K10/K12 dipakai jangan ditanya ulang (keputusan-pemilik.md).
