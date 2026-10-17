# V16 Motion Layer (from desuigner.xyz reference scan)

Status: RENCANA DISIMPAN, MENUNGGU EKSEKUSI. Semua vanilla JS, zero dependency eksternal,
tetap offline-first PWA, target Lighthouse mobile Perf >=90 / A11y >=95 / CLS <0.1.

## Hasil scan 48 referensi desuigner.xyz (fingerprint teknis)

| Teknik | Pembukti | Param / catatan |
|---|---|---|
| Spring physics (transform + rAF) | 60fps.design (Framer bundle) | stiffness 400-800, damping 30-60, mass 1 (dari bundle) |
| will-change targeted (14x, bukan everywhere) | 60fps.design | set saat aktif, hapus saat idle |
| Swup page transition (crossfade tanpa reload) | details.so (Astro+Swup) | fade out ~180-200ms, fetch, fade in |
| Autoplay video loop pendek (showcase motion) | 60fps.design (105 video, 4 autoplay), landing.love (54), navbar.gallery (13 auto) | cara mereka JUALAN motion, bukan struktur site |
| Three.js / WebGL 3D hero | godly, landing.love, codrops, seesaw | SKIP: berat, merusak budget PWA offline UMKM |
| Pointer-follow / magnetic hover | swiped.design (pointer events) | rAF lerp, pointer:fine only |
| Framer-motion spring + stagger | animations.dev, cta.gallery, sections.wtf, browse.cool | port ke vanilla (sudah ada data-reveal stagger di Olano) |

## 4 item motion layer yang dieksekusi (file baru: assets/js/motion.js, ~5-6KB, IIFE, no globals, no console)

1. Smooth scroll spring (Lenis-lite)
   - wheel-only lerp (factor ~0.12, rAF). Touch, prefers-reduced-motion, dan keyboard
     (PageUp/Down/End/Home/Space) -> native, tidak di-hijack. Hash anchor tetap native.
   - Alasan: ini param dominan "rasa 60fps" dari bundle 60fps.design (smoothScroll flag).
2. Magnetic CTA + row follow
   - .btn-primary + a.pick-row: pointermove -> translate lerp max 6px (rAF), reset on leave.
   - pointer:fine only; will-change:transform hanya saat hover.
   - Alasan: pola swiped.design/hoverstat.es; micro-interaction yang membedakan "template vs made".
3. Page transition xfade (Swup-lite)
   - intercept click <a> internal (same-origin, bukan target=_blank/modifier keys/hash-only/
     data-xfade-off, bukan right-click): fade veil 180ms (#xfade-veil di-inject motion.js +
     CSS-nya ikut, jadi tidak perlu sentuh main.css) lalu location.assign(href).
   - Navigation tetap REAL (SW offline tetap serve; tidak ada fetch-cache custom).
   - Alasan: pola details.so; crossfade antar halaman modul membuat suite terasa satu aplikasi.
4. Parallax hero + chart draw-in
   - [data-parallax] (l-cloud/l-grid di tool-hero): translateY = scrollY * factor (0.08-0.15),
     rAF-throttled, pointer:fine + !reduced-motion, will-change targeted.
   - [data-draw] (path/line): stroke-dasharray=totalLength, on IntersectionObserver reveal
     animate dashoffset -> 0 (transition 900ms ease-out). Untuk kalkulator (chart draw-in
     pas hitung).
   - Alasan: parallax = pola hero referensi; draw-in = "grafik hidup" tanpa library chart.

Guardrail global: semua modul no-op saat (a) coarse pointer (untuk 1,2,4-parallax) dan
(b) prefers-reduced-motion. xfade (3) boleh jalan di semua input type tapi tetap hormati
modifier keys. Tidak ada request network baru. File masuk CORE SW (bump v16).

## Redesign "Pilih modulmu" homepage (eksekusi parent, bukan subagent)

Root-cause (reverse thinking): yang terasa SLOP bukan kurang animasi, tapi KOMPOSISI:
7 kartu uniform (grid 3 kolom, sama besar, border+bg+chip sama semua) = copy-paste feature
cards (antislop R-14). Fix = struktur, bukan efek:

- Editorial numbered list 01-07 (hairline separators, num mono kecil, judul display,
  desc 1 baris, chip status + arrow di kanan). Hierarchy dari nomor+tipografi, bukan kartu
  sama (lever 3 startup-ui-depth: "swap uniform card grid for numbered list").
- Row 01 Kasir = flagship (judul 1.6rem, nomor aksen, sample chip).
- Sample-result chips dengan angka BENARAN dari config.js + kalkulasi terverifikasi QA:
  - Kasir:    QRIS Rp40.000 -> MDR 0,00% (qrisMDR.mikro <=Rp500rb 0%)
  - Pajak:    omzet <=Rp500jt/bln -> PPh Rp0,00 (bebas OP, PP 20/2026)
  - Website:  pilih template -> produk sinkron dari kasir (tanpa klaim jumlah)
  - Analisa:  Rp50.000 - 30% - HPP Rp20.000 -> laba Rp12.000 (formula terverifikasi QA)
  - AI:       HPP Rp25.000 +10% -> usul Premium Rp50.000 (27.500/0.55)
  (lever 6 startup-ui-depth: sample chips membuat tool terasa produk, bukan menu link)
- 2 modul segera hadir: row dim (opacity .55) + chip abu "Segera hadir" -- tetap link jujur
  ke halamannya (R-24: destination ada, label jujur).
- Hover state transform-only (bg tint + number color + arrow 4px) = aman 60fps (MOTION dial 2).
- Mobile: grid 2 kolom, tap target >=44px, chip full-width, tanpa overflow (R-03).

Reasons one-line (R-31):
- numbered list: hierarchy dari nomor+type, membunuh kopipaste-card (R-14)
- flagship Kasir: produk harian user = satu fokus utama (levers C-1)
- sample chips: nilai nyata dari config.js (R-17/R-38), tool terasa output-able
- dim rows: status "belum dibuka" tanpa menghapus jalur (R-24/R-38)
- parallax/magnetic/xfade: micro-motion bertarget sesuai dial, bukan wallpaper (R-19)

Dials: ENERGY 2 / RHYTHM 3 / MOTION 2 (landing untuk owner UMKM, design system
putih-biru Aspekta yang sudah ada; RHYTHM 3 karena section jadi bervariasi).

Wiring (parent, setelah subagent selesai): shared.js inject motion.js (1 edit, cover semua
halaman) + sw.js CORE append + bump olano-v16 + Lighthouse + click-through + commit + deploy.
