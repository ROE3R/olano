# GATE AFTER — Setelah Merge POS (R3–R7) + Landing (L0–L37) ke fix/ui-ux-audit-2026-10

Tanggal: 2026-10-18 · Branch: `fix/ui-ux-audit-2026-10` (HEAD **3239eed** = merge commit landing; +26 commit dari 91b15fa: 16 POS + 9 landing + 1 merge) · Runner: `audit/uiux/run-baseline-cwv.py` + `audit/uiux/gate_after_smoke.py` (CDP) — metode identik dengan `cwv-baseline.md`.

**Merge:** `fix/pos-r3-r7` (fast-forward → 24cf727) lalu `fix/landing-l0-l37` (merge commit ort 3239eed). **Konflik: 0** — zona main.css disjoint seperti perkiraan: zona POS L423+ dan zona landing L783+ tetap ada dua-duanya di merged tree (diverifikasi grep).

Server gate: `cd /root/olano && python3 -m http.server 8913` (merged tree). Lighthouse 13.5.0, mobile, simulate, headless=new, 4 kategori, retry 3x — flags sama persis dengan baseline.

## (a) Skor AFTER vs BEFORE (Lighthouse mobile, LOCAL :8913)

### index.html (landing)

| Metrik | Baseline local (before, :8903) | After local (:8913) | Gate | Pass? |
|---|---|---|---|---|
| Performance | 92 | **92** | tidak jatuh >10 poin dari 92 | ✅ (delta 0) |
| Accessibility | 100 | **100** | =100 | ✅ |
| Best Practices | 100 | **100** | tidak turun | ✅ |
| SEO | 100 | **100** | tidak turun | ✅ |
| CLS | 0 | **0** | <0.05 | ✅ |
| LCP (lokal, sanity) | 3.1 s (inflated) | 3.1 s (inflated) | — (gate LCP = prod post-deploy) | ⏳ |
| TTI / TBT | 3.1 s / 0 ms | 3.1 s / 0 ms | TBT 0 | ✅ |

### app/kasir.html (POS)

| Metrik | Baseline local (before, :8903) | After local (:8913) | Gate | Pass? |
|---|---|---|---|---|
| Performance | 92 | **91** | tidak jatuh >10 poin dari 92 | ✅ (delta −1, jitter run lokal) |
| Accessibility | 100 | **100** | =100 | ✅ |
| Best Practices | 100 | **100** | tidak turun | ✅ |
| SEO | 63 | **63** | by-design noindex, tidak turun | ✅ ⚠️ by-design |
| CLS | 0.015 | **0.001** | <0.05 | ✅ (lebih baik) |
| LCP (lokal, sanity) | 2.7 s (inflated) | 2.9 s (inflated) | — (gate LCP = prod post-deploy) | ⏳ |
| TTI / TBT | 2.7 s / 0 ms | 2.9 s / 0 ms | TBT 0 | ✅ |

## (b) Smoke fungsional (CDP headless 360px, gate_after_smoke.py → gate-after-smoke.json)

| Check | Hasil | Bukti |
|---|---|---|
| C3 — CTA utama terlihat tanpa scroll, fold efektif 360×560 | ✅ PASS | `.hero a.btn-primary` "Coba demo kasir", top 370 / bottom 414 px (< 560) |
| L35 — scrollHeight ≤ 9 layar @360×800 | ✅ PASS | 7103 px = **8.88 layar** (baseline 6983 px / 8.73; +120 px, masih di bawah 7200), tanpa hscroll |
| JS errors index.html | ✅ PASS | 0 console error / exception / log error |
| JS errors app/kasir.html#demo | ✅ PASS | 0 (termasuk selama interaksi sheet/rekap) |
| POS: blok "uang kurang" masih aktif | ✅ PASS | cash 5000 vs total Rp22.000 → `#cash-err` tampil "Uang kurang Rp17.000 — tambahkan uang atau kurangi item.", `#sld.class.short` + `aria-disabled="true"` (slide nonaktif) |
| POS: rekap harian masih render | ✅ PASS | sheet-menu → #menu-rekap → sheet-rekap open, `#rekap-stats` 3 kartu (OMZET Rp0 / TRANSAKSI 0 / ITEM TERJUAL 0), list: "Belum ada transaksi pada rentang ini." (kosong = benar, belum ada penjualan di sesi demo segar) |
| POS: grid produk demo render | ✅ PASS | 8 .pos-item |

## (c) Verdict

**GATE = PASS** (lokal). A11y 100/100, CLS 0 / 0.001, perf 92/91 (≥ batas 82), BP 100/100, SEO 100 / 63-by-design, JS errors 0/0, C3 ✅, L35 8.88≤9 ✅, uang-kurang + rekap ✅. Tidak ada fix tambahan yang diperlukan di merged tree — 0 commit fix.

**Tersisa post-deploy (di luar scope gate ini):** LCP prod ≤2.5 s via `OLANO_BASE=https://olano.vercel.app python3 run-baseline-cwv.py prod` SETELAH deploy (baseline prod: index 2.0 s, kasir 1.4 s).

Raw JSON LH: `audit/uiux/baseline/cwv/lh-m-after-local-{index,app-kasir}.html.json` · CSV: `audit/uiux/baseline-cwv-after-local.csv` · Smoke: `audit/uiux/gate-after-smoke.json`
