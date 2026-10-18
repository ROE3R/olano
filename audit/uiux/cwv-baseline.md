# CWV + Lighthouse BEFORE Baseline — Gelombang Fix UI/UX (index.html + app/kasir.html)

Tanggal: 2026-10-18 · Branch: `fix/ui-ux-audit-2026-10` (HEAD 91b15fa) · Runner: `audit/uiux/run-baseline-cwv.py` (konvensi disalin 1:1 dari `audit/tools/lh.py`)

**Metode (WAJIB dipakai identik untuk after-state):** Lighthouse 13.5.0, mobile form-factor, `--throttling-method=simulate`, `--headless=new --no-sandbox`, CHROME_PATH=/usr/bin/google-chrome, kategori perf+a11y+BP+SEO, retry 3x dengan validasi JSON tanpa runtimeError.

- **LOCAL** (semua metrik kecuali LCP): `OLANO_BASE=http://localhost:8903` — python http.server, TTFB root doc 1–4 ms (bukan bottleneck), tapi LCP/TTI **INFLATED** oleh throttling simulasi + overhead server → jangan bandingkan LCP lokal.
- **PROD** (LCP real + skor gate): `OLANO_BASE=https://olano.vercel.app` — LCP gate dinilai dari sini.
- **Perbandingan before/after:** skor kategori + CLS + TBT/TTI dari LOCAL (metode sama), LCP dari PROD (metode sama). LCP lokal hanya sebagai sanity, bukan gate.

## (a) Skor BEFORE (Lighthouse mobile)

### index.html (landing)

| Metrik | Local (:8903) | Prod (vercel) | Gate | Pass? |
|---|---|---|---|---|
| Performance | 92 | **99** | ≥90 | ✅ |
| Accessibility | 100 | **100** | =100 | ✅ |
| Best Practices | 100 | 100 | (pantau) | ✅ |
| SEO | 100 | 100 | (pantau) | ✅ |
| LCP | 3.1 s (inflated) | **2.0 s** | ≤2.5 s | ✅ |
| CLS | 0 | **0** | <0.05 | ✅ |
| TTI (proxy INP lab) | 3.1 s | 2.0 s | INP≤200 ms → lihat catatan | ✅* |
| FCP / SI / TBT | 2.0 s / 2.0 s / 0 ms | 1.5 s / 2.2 s / 0 ms | — | — |

### app/kasir.html (POS)

| Metrik | Local (:8903) | Prod (vercel) | Gate | Pass? |
|---|---|---|---|---|
| Performance | 92 | **100** | ≥90 | ✅ |
| Accessibility | 100 | **100** | =100 | ✅ |
| Best Practices | 100 | 100 | (pantau) | ✅ |
| SEO | 63 | **63** | (pantau) | ⚠️ by-design |
| LCP | 2.7 s (inflated) | **1.4 s** | ≤2.5 s | ✅ |
| CLS | 0.015 | **0** | <0.05 | ✅ |
| TTI (proxy INP lab) | 2.7 s | 1.4 s | INP≤200 ms → lihat catatan | ✅* |
| FCP / TBT | 2.7 s / 0 ms | 1.1 s / 0 ms | — | — |

**Catatan:**
1. **SEO kasir 63 = by design**: satu audit gagal, `is-crawlable` ("Page is blocked from indexing") karena `<meta name="robots" content="noindex,follow">` di app/kasir.html (halaman app memang tidak diindeks). Bukan regresi; jangan "diperbaiki".
2. **INP tidak tersedia di lab Lighthouse 13** (audit `inp` / `interaction-to-next-paint` tidak ada di JSON). Proxy lab: **TTI + TBT**. TBT = 0 ms di kedua halaman (lokal & prod) → tidak ada long task yang memblokir; INP≤200 ms praktis aman. Untuk after-state: bandingkan TTI/TBT metode sama; klaim INP sesungguhnya butuh RUM/CrUX, bukan lab.
3. CLS lokal kasir 0.015 vs prod 0 = variasi run lokal (font swap saat throttling). Gate tetap dinilai dari angka yang sama metodenya; margin ke 0.05 masih 3.3×.
4. TTFB root doc: lokal 1–4 ms, prod 3 ms — server bukan faktor; inflasi LCP lokal murni dari python http.server + throttling simulasi (artefak yang diketahui).

Raw JSON: `audit/uiux/baseline/cwv/lh-m-{local,prod}-{index,app-kasir}.html.json` · CSV: `audit/uiux/baseline-cwv-{local,prod}.csv`

## (b) Audit bobot aset hero landing (index.html)

Semua aset visual hero direferensikan via `<img>`/`<picture>` di index.html — **main.css tidak punya `url()` gambar sama sekali** (hanya 5 `url()` font woff2). Tidak ada aset dari design-ref/ yang dipakai halaman hidup.

| Aset | On-disk | Tipe | Peran | LCP? | Flag (>80 KB?) |
|---|---|---|---|---|---|
| assets/daydream/sky-hero-m.webp | 4.1 KB | webp | bg langit mobile (`<picture>` ≤759px, `fetchpriority` default) | no | ✅ |
| assets/daydream/sky-hero.webp | 21.1 KB | webp | bg langit desktop | no (mobile run) | ✅ |
| assets/daydream/grid-overlay.svg | 0.8 KB | svg | overlay grid `data-parallax` | no | ✅ |
| assets/daydream/cloud-1.webp | 41.5 KB | webp | awan dekoratif, `fetchpriority="low"` | no | ✅ |
| assets/img/produk-kasir-mobile.webp | 19.3 KB | webp | hero-visual 1x (≤759px) | no (DPR>1) | ✅ |
| **assets/img/produk-kasir-mobile-2x.webp** | **47.4 KB** (xfer prod **47.6 KB**) | webp | hero-visual 2x — **elemen LCP mobile** (kandidat transfer terbesar; xfer terbesar di run prod) | **YA (mobile)** | ✅ |
| assets/img/produk-kasir.webp | 23.2 KB | webp | hero-visual 1x desktop | no | ✅ |
| assets/img/produk-kasir-2x.webp | 60.0 KB | webp | hero-visual 2x desktop | no (mobile run) | ✅ |
| og-image.jpg (root) | 104.8 KB | jpg | OG/twitter meta SAJA — tidak dirender | no | ✅ (bukan above-fold render) |

Tidak dipakai index.html: `cloud-2.webp` (33.1 KB), `lightleap→lightleak.webp` (8.3 KB) — jangan ikut diubah saat fix landing.

**Status atribut LCP:** elemen LCP (`.hero-visual img`, index.html:120) sudah punya `width`/`height` (1180×962, no-CLS), `fetchpriority="high"`, `srcset` 1x/2x + `<picture>` mobile/desktop, format webp. `lcp-lazy-loaded` tidak menandai lazy pada LCP. → **Tidak ada flag >80 KB dan tidak ada pekerjaan LCP yang tersisa di hero.** Aturan untuk fix wave: gambar baru above-fold WAJIB ≤80 KB, webp, width/height eksplisit, `fetchpriority="high"` hanya untuk satu elemen LCP.

**Total transfer landing (prod, mobile):** CSS 21.6 KB (81 KB on-disk) + 5 font woff2 ≈ 90 KB (Aspekta 450/500/600 21.7–21.6 KB ×3, 650 13.3 KB, instrument-serif-italic 12.1 KB) + gambar hero ≈ 90 KB. CSS 81 KB on-disk di atas 80 KB — bukan gambar, tapi jangan ditambah blok besar tanpa perlu; taruh CSS POS baru di blok berkomentar.

## (c) Inventaris design token yang WAJIB dipakai ulang (main.css `:root`, JANGAN mengarang token baru)

| Kelompok | Token | Nilai |
|---|---|---|
| **Primary** | `--blue-600` (= PRIMARY #2453EB) | hover `--blue-700` #1C40D8, aksen gelap `--blue-800` #1D35AF |
| Skala biru | `--blue-50…950` | 11 step lengkap (#EFF5FF → #0E1A4A) |
| Netral (8 step) | `--white`, `--gray-25 #FAFBFD`, `--gray-50 #F4F6FA`, `--gray-100 #E8ECF3`, `--gray-300 #C3CBD9`, `--gray-500 #4E586B`, `--gray-700 #343C4F`, `--ink #0B1220` | ⚠️ 8 step, bukan 9 — tidak ada gray-200/400/600/800/900; kalau butuh tingkat di antara, diskusikan dulu, jangan tambah diam-diam |
| Semantik (sudah AA) | `--success #0E7A3D` + `--success-bg #E7F6EE`; `--warning #8A5400` + `--warning-bg #FFF4DC`; `--danger #A3211F` + `--danger-bg #FDEBEC` | pakai pasangan fg+bg-nya, jangan mix |
| Spacing (4pt) | `--sp-1/2/3/4/6/8/12/16/24/32` | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px |
| Radius | `--r-sm 8` · `--r-md 12` · `--r-lg 16` · `--r-xl 24` · `--r-full 9999` | skala 12/16/24 ✅ sesuai brief |
| Shadow | `--sh-sm`, `--sh-md`, `--sh-lg`, `--sh-card`, `--sh-lift` | depth dari shadow+ring (Cal.com), bukan border tebal |
| Motion | dur `--dur-instant 100/fast 180/base 280/slow 480/story 800 ms`; ease `--ease-standard`, `--ease-emphasized` (expo-out `.16,1,.3,1`), `--ease-exit` | gerakan premium = emphasized |
| Tipografi | `--font-display/sans` = Aspekta; `--font-serif` = Instrument Serif (aksen italic); `--fs-display/h1` clamp, `--fs-h2 1.8125rem`, `--fs-h3 1.25rem`, `--fs-body 1rem`; `--ls-h1 -.04em`, `--ls-h2 -.02em` | H1 87/600 @1440, body 16 w450 (ukur ref B) |
| Layout | `--container 1200px`, `--gutter 24px` | |
| Gradien | `--grad-hero`, `--grad-brand` (#2453EB→#6094FA), `--grad-navy` | |

**Dark mode: TIDAK ADA.** Tidak ada `color-scheme` dan tidak ada `@media (prefers-color-scheme)` di main.css. Satu-satunya "dark" adalah permukaan hardcode `.section-dark`/`.callout` (rgba putih transparan di atas navy) dan body POS. Konsekuensi: (1) fix wave jangan mengasumsikan token dark tersedia; (2) kalau fix wave menambah dark mode, itu keputusan lintas-halaman — token baru masuk `:root` lewat SATU owner, bukan dua-duanya.

**A11y komponen nav yang sudah ada di shared.js — PAKAI ULANG polanya (jangan reinvent):** dropdown `.dd` sudah lengkap: toggle `aria-expanded` pada trigger, tutup via klik-luar / **Escape (fokus balik ke trigger)** / klik link / `focusout`, roving focus **ArrowUp/ArrowDown/Home/End** pada menu (shared.js §dropdown, ±baris 216–290), scope selector `.nav-links` saja. Burger: toggle `aria-expanded` + tutup saat link diklik. Skip-link ada di kedua halaman (`.skip`). A11y=100 kedua halaman membuktikan polanya sah — komponen baru (sheet POS, dialog, dsb.) harus mengikuti pola Escape+fokus-kembali yang sama.

## (d) Pembagian kepemilikan file shared (anti tabrakan git)

| File | Landing (index.html) | POS (app/kasir.html) | Aturan fix wave |
|---|---|---|---|
| `index.html` | ✅ owner penuh | — | bebas edit |
| `app/kasir.html` | — | ✅ owner penuh | bebas edit (ada 29 inline `style=`, 0 blok `<style>`; script-nya inline module + config.js; **tidak load shared.js**) |
| `assets/css/main.css` | blok landing: `.ticker` (33), `.nav*` 122–151, `.hero*`/`.h-*` 237–283, `.picker`/`.modrow`, `.tlist`, `.tax-grid2`, `.price*` 332–341, `.tst*`, `.foot*` 354+ | blok POS: `.pos-*`, `.sheet`, `.panel`, `.backdrop`, `.toast`, `.sld*`, `.thumb`, `.t-*`, `.sum`, `.stock`, `.r-line`, `.grip` | **:root (baris 1–~102) = zona kuning**: hanya SATU owner boleh menambah token, dan wajib append (tidak rename/tambah tengah file). Landing edit di blok landing, POS edit/append di blok POS — jangan saling sentuh selector |
| `assets/js/shared.js` | ✅ owner (satu-satunya user: landing) | tidak dimuat → aman | perubahan dropdown/burger hanya efek landing; tetap jangan ubah fungsi yang dipakai banyak halaman (ticker, reveal) tanpa cek halaman lain |
| `assets/js/config.js` | load (baris 353) | load (baris 118) | dua-duanya konsumen. Jangan edit kecuali ubah angka bisnis (versi wajib naik). Perubahan UI tidak perlu sentuh ini |
| `assets/js/motion.js` | load (landing) | tidak dimuat | owner landing |
| `assets/js/qrcode.js` | tidak dimuat | load | owner POS |
| `sw.js` | — | — | kalau ada file aset di-rename/hapus → wajib update precache list (koordinasi) |

Rekomendasi split commit: landing team = `index.html` + blok landing main.css (+shared.js/motion.js bila perlu); POS team = `app/kasir.html` + blok POS main.css (+qrcode.js). Konflik hanya mungkin di main.css dan :root — makanya :root dilock ke satu owner per gelombang.

## (e) Perintah persis untuk re-measure after-state (identik)

```bash
# server lokal (biarkan jalan di port 8903)
cd /root/olano && python3 -m http.server 8903   # cek: curl -o /dev/null -w '%{http_code}' localhost:8903/index.html → 200

# LOCAL — skor + CLS + TTI/TBT (baseline before sudah di baseline-cwv-local.csv)
cd /root/olano/audit/uiux && OLANO_BASE=http://localhost:8903 python3 run-baseline-cwv.py local

# PROD — LCP real + skor gate
cd /root/olano/audit/uiux && OLANO_BASE=https://olano.vercel.app python3 run-baseline-cwv.py prod
```

Runner: `audit/uiux/run-baseline-cwv.py` (flags sama dengan audit/tools/lh.py: `--form-factor=mobile --throttling-method=simulate --chrome-flags='--headless=new --no-sandbox' --only-categories=performance,accessibility,best-practices,seo`, CHROME_PATH=/usr/bin/google-chrome, 3x retry, tolak runtimeError). After-state dibandingkan: **skor & CLS & TBT/TTI = LOCAL, LCP = PROD** (baris yang sama di CSV, tag `local` vs `prod`).

**Angka yang harus dipertahankan setelah fix:** Perf ≥90 (baseline lokal 92/92, prod 99/100) · A11y =100 (76 audit LH) · CLS <0.05 (baseline 0 / 0.015-lokal) · LCP prod ≤2.5 s (baseline 2.0 s / 1.4 s) · TBT 0 ms · SEO index 100, kasir 63 (noindex by design).
