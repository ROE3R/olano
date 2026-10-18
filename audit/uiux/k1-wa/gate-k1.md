# GATE K1-CLOSE — Nomor WA live 6285111044407 (dikonfirmasi owner 18 Okt 2026)

Tanggal: 18 Okt 2026 · Branch: fix/ui-ux-audit-2026-10 · Deploy prod: `vercel deploy --prod` → READY → alias **https://olano.vercel.app** aktif.

## Perubahan sumber
| File | Perubahan |
|---|---|
| `assets/js/config.js` | `wa.pajak` + `wa.website` = `"6285111044407"` (satu nomor utk semua layanan); comment TODO diganti "nomor 6285111044407 (dikonfirmasi owner 18 Okt 2026)"; `version` 2.1.0 → **2.2.0**. Guard truthiness di `pajak.html`/`naik-kelas.html`/`website.html` otomatis aktif (href wa.me diisi config). |
| `sw.js` | Cache `olano-v30` → **`olano-v31`** (config.js ada di CORE pre-cache; bump agar PWA lama mengambil config baru). |
| `index.html` | `#wa-btn`: `<button>` → **`<a class="btn btn-wa" href="https://wa.me/6285111044407?text=Halo%20Olano%2C%20saya%20mau%20tanya%20soal%20layanan%20untuk%20warung%20saya" target="_blank" rel="noopener">`**; span `.wa-soon` "nomor menyusul" DIHAPUS (frase = 0 di seluruh index). JS: href disinkronkan ulang dari `config.js` saat runtime; **guard config-kosong tetap non-dead** — bila `wa.pajak`/`wa.website` kosong, tautan ditukar kembali jadi `<button type="button">` + toggle `#wa-note` (perilaku lama utuh). |
| `COPY-NANTI.md` (root) | Baris #4: label WA + teks pesan WA default (bisa diganti owner). |

## Bukti DOM lokal (server :8923 dari /root/olano)
- Tag = **A** (bukan button), `href=https://wa.me/6285111044407?text=Halo%20Olano%2C%20saya%20mau%20tanya%20soal%20layanan%20untuk%20warung%20saya`, `target=_blank`, `rel=noopener`, label "WhatsApp".
- `.wa-soon` = **tidak ada**; `#wa-note` tetap `hidden` (fallback).
- Klik test: event klik tercatat pada #wa-btn (atribut tervalidasi, tanpa membuka WA).
- Render: visible, 152×48px, `min-height:48px`, border rgb(191,228,208) = token `.btn-wa`. (`dom-proof.json`, `k1-wa-btn-link-8923.png`)

## Lighthouse lokal (1 run, index, mobile simulate — http://localhost:8923)
| Metrik | Nilai | Gate | Status |
|---|---|---|---|
| Performance | **92** | tak jatuh >10 dari 92 lokal | LULUS (0 jatuh) |
| Accessibility | **100** | 100 | LULUS |
| CLS | **0** | <0.05 | LULUS |
| LCP | 3.2 s | (informasi; gate perf = skor) | — |
| Best-practices / SEO | 100 / 100 | — | — |

## Deploy + validasi prod (https://olano.vercel.app)
- `vercel deploy --prod --yes` → **● Ready (Production)** `olano-7o0bkpg5u-riks-projects-d8012af8.vercel.app` (4s) → alias olano.vercel.app 200.
- Prod `index.html`: grep `wa.me/6285111044407` = **1**, `nomor menyusul` = **0**.
- Prod `assets/js/config.js`: `version "2.2.0"` + kedua nomor `"6285111044407"` tersaji; `sw.js` = `olano-v31`.
- Catatan: `olano.xyz` tak terjangkau dari box kerja ini (curl 000) — gate memakai olano.vercel.app, sama seperti gate-final.md sebelumnya.

## Lighthouse prod (1 run, index, mobile simulate)
| Metrik | Nilai | Gate | Status |
|---|---|---|---|
| Performance | **96** | (baseline prod 96 — no regresi) | LULUS (=baseline) |
| Accessibility | **100** | 100 | LULUS |
| LCP | **2.1 s** | ≤2.5 s | LULUS |
| CLS | **0** | (baseline 0) | LULUS |
| Best-practices / SEO | 100 / 100 | — | — |

## No-regresi vs baseline
- Index: perf 96=96, a11y 100=100, LCP 2.1s (baseline 2.0s), CLS 0=0 (gate-final.md / baseline-cwv-prod.csv).
- Kasir & halaman lain: tidak disentuh (hanya config.js + index.html + sw.js cache-bump).

## Catatan
- Aturan CSS `.wa-row .wa-soon` (main.css:942) kini inert — dibiarkan agar diff UI minimal; dirapikan di tahap kata bila perlu.
- Commit: d4c7826 (config+sw) → 3c4207f (index+COPY-NANTI) → commit ini (audit+keputusan).
