# GATE FINAL — Merge wave akhir (POS polish + landing polish + sw v30) → deploy prod

Tanggal: 2026-10-18 · Branch: `fix/ui-ux-audit-2026-10` · Runner: `audit/uiux/run-baseline-cwv.py` + `audit/uiux/gate_final_smoke.py` (CDP) — metode identik `cwv-baseline.md` / `gate-after.md` / `gate-prod.md`.

**Merge (0 konflik, terverifikasi `git merge-tree` sebelum merge, keduanya 0 marker):**
- `fix/pos-polish` → merge commit **6803a2c** (app/kasir.html + main.css; swipe-hapus+Undo, impor cadangan, skeleton loading, qrcode dynamic-import).
- `fix/landing-polish` → merge commit **9681196** (index.html, shared.js prefetch C2, motion.js, main.css, hero-phone-warung*.webp baru, FAQ L34, dll).
- Zona main.css tetap dua-duanya di merged tree (POS swipe/skeleton ~L520-575, landing hero/footer ~L860+) — disjoint seperti perkiraan.

**SW v30 (commit e911b94 `sw: cache v30 (hero-phone-warung + qrcode lazy)`):** `CACHE = "olano-v30"`; aset hero BARU didaftarkan sebagai **`assets/img/hero-phone-warung-1x.webp` + `assets/img/hero-phone-warung.webp`** (nama file aktual di repo — TIDAK ada `hero-phone-warung-2x.webp`; `-1x` = 1x srcset, `hero-phone-warung.webp` = 2x, cek `index.html` srcset L116); **`assets/js/qrcode.js` dikeluarkan dari CORE** (sekarang lazy via dynamic import saat QRIS pertama — SW tetap runtime-cache file itu setelah dipakai, offline tetap aman).

**Fix 1 commit (5ad1ca6):** BP index turun 96 (audit `image-aspect-ratio` pada hero baru: rendered 195×434 vs natural 390×844 — `padding:5px` border-box di `<img>` mengubah rasio render). Fix: bezel ponsel dipindah ke wrapper `picture`, `img` exact 390/844. BP kembali 100 lokal & prod.

Server gate lokal: `python3 -m http.server 8923` (merged tree). Lighthouse 13.5.0, mobile, simulate, headless=new, retry 3x.

## (a) Skor AFTER LOKAL (:8923) vs baseline lokal

### index.html (landing)

| Metrik | Baseline local (before) | After final (:8923) | Gate | Pass? |
|---|---|---|---|---|
| Performance | 92 | **94** | tak jatuh >10 dari 92 | ✅ (delta +2) |
| Accessibility | 100 | **100** | =100 | ✅ |
| Best Practices | 100 | 96 → **100** | tak turun | ✅ (setelah fix 5ad1ca6) |
| SEO | 100 | **100** | tak turun | ✅ |
| CLS | 0 | **0** | <0.05 | ✅ |
| LCP (lokal, inflated) | 2.9 s | 2.9 s | — (gate LCP = prod) | ⏳ |

### app/kasir.html (POS)

| Metrik | Baseline local (before) | After final (:8923) | Gate | Pass? |
|---|---|---|---|---|
| Performance | 91 | **91** | tak jatuh >10 dari 91 | ✅ (delta 0) |
| Accessibility | 100 | **100** | =100 | ✅ |
| Best Practices | 100 | **100** | tak turun | ✅ |
| SEO | 63 | **63** | by-design noindex | ✅ |
| CLS | 0.001 | **0.0002** | <0.05 | ✅ |
| LCP (lokal, inflated) | 2.9 s | 2.9 s | — (gate LCP = prod) | ⏳ |

## (b) Smoke fungsional (CDP 360px, gate_final_smoke.py → gate-final-smoke.json) — 9/9 PASS

| Check | Hasil | Bukti |
|---|---|---|
| C3 — CTA fold (bottom < 560px @360×800) | ✅ | `.hero .cta-row a[href*='kasir']` top 370 / bottom 414 |
| L35 — scrollHeight ≤ 9 layar (≤7200px) | ✅ | 6963 px = **8.70 layar** (baseline 8.73 — FAQ+prefetch tetap muat) |
| Prefetch 2 link setelah CTA di viewport | ✅ | `link[rel=prefetch]`: `/app/kasir.html` + `/assets/js/config.js` |
| JS errors index.html | ✅ | 0 console error / exception / log error |
| JS errors app/kasir.html#demo | ✅ | 0 (termasuk swipe, impor, rekap, QRIS) |
| POS skeleton render | ✅ | aria-busy terisi lalu dicabut; 8 `.pos-item`; 0 skel tersisa |
| POS swipe-hapus + Snackbar Urungkan | ✅ | 2→1 baris (swipe -280px ≥40%), toast "1 produk dihapus" + Undo → 2 baris, total kembali Rp40.000 |
| POS impor cadangan JSON | ✅ | DataTransfer File → validasi → konfirmasi → "Berhasil: 1 transaksi dipulihkan" (var --success) |
| POS QRIS (dynamic import) | ✅ | `typeof QRCode` terisi via import; payload 136 char `000201…`, **CRC16-CCITT valid**, TLV 51 nominal = 40000 (= 2 item Rp40.000), QR box + full ter-render, sheet terbuka |

Rekap harian juga render (3 kartu skel → konten; list terisi 1 baris dari transaksi hasil impor). Uang-kurang & grid demo tidak diulang (sudah di gate-after.md, kode tak berubah).

## (c) Deploy prod

`vercel deploy --prod` dari merged tree → READY **dpl_mhbC7Hs8MfDVNKKbgpESYGpNZNkW** → alias **https://olano.vercel.app** aktif (200).

Validasi build baru:
- `sw.js` prod: `CACHE = "olano-v30"` ✅ · `grep -c '"assets/js/qrcode.js"'` = **0** (tidak lagi cache awal) ✅ · `hero-phone-warung-1x.webp` + `hero-phone-warung.webp` di CORE ✅
- `assets/js/shared.js` prod: kode prefetch C2 ada (5 match) ✅
- `app/kasir.html` prod: `QR_CODE_SRC` ada (dynamic import) ✅
- `/assets/img/hero-phone-warung-1x.webp` → 200, `/assets/img/hero-phone-warung.webp` → 200 ✅

## (d) Skor PROD AFTER vs prod baseline (Lighthouse mobile, https://olano.vercel.app)

### index.html (landing)

| Metrik | Baseline prod (before) | After prod | Gate | Pass? |
|---|---|---|---|---|
| Performance | 95 | **96** | tak jatuh >10 dari 95 | ✅ (delta +1) |
| Accessibility | 100 | **100** | =100 | ✅ |
| Best Practices | 100 | **100** | tak turun | ✅ |
| SEO | 100 | **100** | tak turun | ✅ |
| LCP | 2.24 s | **2.03 s** | ≤2.5 s | ✅ |
| CLS | 0 | **0** | <0.05 | ✅ |

### app/kasir.html (POS)

| Metrik | Baseline prod (before) | After prod | Gate | Pass? |
|---|---|---|---|---|
| Performance | 100 | **99** | tak jatuh >10 dari 100 | ✅ (delta −1) |
| Accessibility | 100 | **100** | =100 | ✅ |
| Best Practices | 100 | **100** | tak turun | ✅ |
| SEO | 63 | **63** | by-design noindex | ✅ |
| LCP | 1.51 s | **1.66 s** | ≤2.5 s | ✅ |
| CLS | 0.001 | **0.0003** | <0.05 | ✅ |

## (e) Verdict

**GATE FINAL = PASS (lokal + prod).** TBT 0 ms kedua halaman (lokal & prod). Tidak ada metrik di bawah gate; satu fix kecil (image-aspect-ratio hero) sudah masuk sebelum deploy. SEO kasir 63 = by design (noindex).

Raw JSON LH: `audit/uiux/baseline/cwv/lh-m-final-local-*.json` + `lh-m-prod-*.json` (baris before/after di CSV) · CSV: `baseline-cwv-final-local.csv`, `baseline-cwv-prod.csv` · Smoke: `gate-final-smoke.json` · Script: `gate_final_smoke.py`.
