# GATE PROD — Setelah Deploy Prod (alias https://olano.vercel.app)

Tanggal: 2026-10-18 · Branch: `fix/ui-ux-audit-2026-10` (HEAD **3239eed**) · Deploy: `vercel deploy --prod` dari merged tree, READY dpl_9Vh5XAhAXan5tNbiBAd7DwLiYR5s → alias `https://olano.vercel.app` aktif.

**Validasi build baru:** HTTP 200 di `/index.html` (alias prod) + `grep -c 'sheet-rekap'` di `app/kasir.html` prod = **2** (fitur rekap POS ada → build baru, bukan cache build lama).

**Metode:** `OLANO_BASE=https://olano.vercel.app python3 audit/uiux/run-baseline-cwv.py prod` — Lighthouse 13.5.0, mobile, simulate, headless=new, 4 kategori, retry 3x, flags identik dengan `cwv-baseline.md` (baseline prod before diambil dengan metode yang sama persis).

## (a) Skor PROD AFTER vs PROD BASELINE (Lighthouse mobile, https://olano.vercel.app)

### index.html (landing)

| Metrik | Baseline prod (before) | After prod | Gate | Pass? |
|---|---|---|---|---|
| Performance | 99 | **95** | jangan turun >10 poin dari 99 | ✅ (delta −4) |
| Accessibility | 100 | **100** | =100 | ✅ |
| Best Practices | 100 | **100** | tidak turun | ✅ |
| SEO | 100 | **100** | tidak turun | ✅ |
| LCP | 2.0 s | **2.2 s** | ≤2.5 s | ✅ |
| CLS | 0 | **0** | <0.05 | ✅ |
| TTI (proxy INP lab) | 2.0 s | 2.3 s | TBT gate (lihat catatan) | ✅* |

### app/kasir.html (POS)

| Metrik | Baseline prod (before) | After prod | Gate | Pass? |
|---|---|---|---|---|
| Performance | 100 | **100** | jangan turun >10 poin dari 100 | ✅ (delta 0) |
| Accessibility | 100 | **100** | =100 | ✅ |
| Best Practices | 100 | **100** | tidak turun | ✅ |
| SEO | 63 | **63** | by-design noindex, tidak turun | ✅ ⚠️ by-design |
| LCP | 1.4 s | **1.5 s** | ≤2.5 s | ✅ |
| CLS | 0 | **0.001** | <0.05 | ✅ |
| TTI (proxy INP lab) | 1.4 s | 1.5 s | TBT gate (lihat catatan) | ✅* |

## (b) Verdict gerbang prod

**GATE PROD = PASS.**

- index: perf 95 (≥89 batas turun-10 dari 99), a11y 100, LCP 2.2 s ≤2.5 s, CLS 0 <0.05 — ✅✅✅✅
- kasir: perf 100 (delta 0), a11y 100, LCP 1.5 s ≤2.5 s, CLS 0.001 <0.05 — ✅✅✅✅
- SEO kasir 63 = by design (noindex `<meta robots>`), bukan regresi (catatan 1 `cwv-baseline.md`).
- TBT 0 ms kedua halaman (CSV runner); TTI naik 0.1–0.3 s tapi tetap bukan gate — LCP+CLS+a11y yang dinilai di gerbang prod, INP butuh RUM/CrUX (catatan 2 `cwv-baseline.md`).
- Tidak ada metrik yang melewati batas; tidak perlu fix tambahan pasca-deploy.

Raw JSON LH: `audit/uiux/baseline/cwv/lh-m-prod-{index,app-kasir}.html.json` (ditimpa run after-prod) · CSV: `audit/uiux/baseline-cwv-prod.csv` (baris `prod` before + after). Bukti gerbang lokal sebelum deploy: `audit/uiux/gate-after.md`.
