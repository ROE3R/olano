# Olano v2 — Rekap Referensi & Spec Implementasi

Diukur live 2026-10-18 dengan Playwright (computed style, DOM asli) di 1440×900 dan 390×844.
Sumber data mentah: `design-ref/v2/raw-measure.json`. Screenshot: `design-ref/v2/*.png`.

---

## 1. Rekap semua referensi

### A. Referensi struktural & visual (dikirim owner)

| URL | Peran (kutipan owner) | Status ukur |
|---|---|---|
| sokudo.dev | "dasar struktur halaman, grid fitur, komponen" | ✅ diukur |
| thedaydream.studio | "karakter visual" | ✅ diukur |
| oyenza.com | "bangunnya rapih dan jelas ui/ux" | ⚠️ 403 Forbidden (Cloudflare) — tidak bisa diukur |
| open-design.ai | "penempatan cto bagus, pricing bagus" | ✅ diukur |
| designeer.xyz | "tempat cari ide", bukan bulk-scrape | ✅ dipakai sebagai katalog |
| bencho.dev | "daftar ini dan gunakan yang bisa dipakai" | registry blok (belum dieksekusi) |

### B. Katalog motion 60fps.design (dibuka satu-satu, sesuai instruksi owner)

Taksonomi situsnya: **Gestures** (drag, flick, hold, pan, pinch, pull, scroll, scrub, slide, swipe, tap, typing),
**Patterns** (intro, loading, success state, empty state, carousel, card stack, pricing, onboarding, reward),
**Effects** (blur, bounce, confetti, draw, fade, glow, grow, morph, orbit, parallax, particles, pulse, reveal,
sequence, shimmer, spring physics, stagger, ticker, zoom).

Contoh yang pernah dijadikan acuan:
- `zomato-no-internet-offline-game-interaction` — fisika + counter real-time + particle saat gagal
- `cred-no-internet-snake-game` — fallback offline jadi momen, bukan error
- `platen-typewriter-intro-how-to-interaction` — intro mengetik
- `apple-mac-mini-hero-intro-logo-text-animation` — hero intro logo satu momen
- `x-money-card-envelop-reveal-animation` — reveal kartu

**Pelajaran untuk Olano:** yang dipinjam bukan efeknya, tapi **pola pikirnya** — gerakan dipakai
untuk memberi tahu *apa yang baru terjadi* (state change), bukan untuk menghias halaman.

---

## 2. Angka ukur (bukan tebakan)

### sokudo.dev — acuan struktur
| Properti | 1440 | 390 |
|---|---|---|
| H1 | 48px / lh 64 / w700 / center | 28px / lh 36 / w700 |
| H2 | 40px w600 | 28px w600 |
| Font | Figtree (1 family, semua peran) | sama |
| Nav | h 80, bg transparan, **tanpa blur** | h 68 |
| Padding seksi | hero 120/80, lain 80/80 | hero 32/48, lain 64/64 |
| Radius | kartu 16, visual 14, pill 9999 | sama |
| Shadow | **8 dari 315 elemen (2.5%)** | sama |
| Keyframes | **0** (nol animasi CSS) | 0 |
| Transisi | 0.15–0.2s, hanya `all`/`color` | sama |

### thedaydream.studio — acuan atmosfer
- Font: **Aspekta** (sudah dipakai Olano) + Inter Tight fallback
- Nav: h 28 desktop (!), posisi absolute, transparan
- Keyframes: **2 saja** — `cloud-drift` (9 elemen), `comet-fly` (17 elemen)
- Radius: pill 75px, kecil 6–9.75px
- Shadow: 18/380 (4.7%)
- Section padding: 0 — komposisi full-bleed, bukan grid berpadding

### open-design.ai — acuan skala & pricing
- Font: Albert Sans
- H1: **72px** desktop / 32px mobile, w700, center
- H2: 32px w800 (mobile 25.6)
- Nav: 54px desktop, **sticky** di mobile
- Padding seksi: hero 62/8, lain **130/130** desktop; 56/56 mobile
- Keyframes: 4 — `blurTextIn`(6 el), `breathe`, `sheen`, `logo-scroll`
- Radius campuran: 999 pill, 24, 22, 16, 8, 6
- Shadow: 62/971 (6.4%)
- Tombol: 44px, pill 999

---

## 3. Kesimpulan yang mengikat (aturan Olano v2)

Ini yang **wajib** diikuti, diturunkan dari angka di atas:

1. **Animasi maksimal 2 keyframes untuk seluruh halaman.** sokudo 0, daydream 2, open-design 4.
   Olano sekarang punya **5** (`devIn`, `devFloat`, `islandPulse`, `cloud-drift`, `heroIn`, + reveal per section). → potong.
2. **Satu momen motion saat load**, sisanya transisi 0.15–0.2s pada elemen interaktif saja.
3. **Tanpa hover-lift pada kartu.** Tidak ada referensi yang melakukannya; kartu hanya berubah border/warna.
4. **Shadow maksimal ~5% elemen.** Olano sekarang men-shadow hampir semua kartu + CTA + perangkat.
5. **Satu keluarga font** (Aspekta sudah benar). Tidak menambah font kedua.
6. **Radius konsisten**: satu nilai kartu (16px), satu nilai visual (14px), pill 9999 untuk tombol.
   Tidak ada 46/52/36/26/28 campur.
7. **Padding seksi dari ukur**: desktop 80/80 (hero 120/80), mobile 64/64 (hero 32/48).
8. **Hero = satu visual fokus**, bukan dua perangkat bertumpuk (sokudo: 1 visual 1185×687).
9. **Nav transparan tanpa blur**, tinggi 80/68.
10. **H1 48/64 desktop, 28/36 mobile** — bukan lebih besar.

---

## 4. Yang harus diperbaiki di Olano

| # | Sekarang | Target (dari ukur) |
|---|---|---|
| 1 | 5 keyframes (devIn+devFloat+islandPulse+cloud-drift+heroIn) | **1** keyframes load + transisi 0.15s |
| 2 | Dua perangkat bertumpuk di hero | **satu** visual fokus (iPad saja, atau iPhone saja) |
| 3 | `hover:translateY(-2px)` di kartu | border-color saja |
| 4 | Shadow di semua kartu/CTA/perangkat | shadow hanya di visual hero + 1 CTA |
| 5 | Radius 46/52/36/26/28/14/12 campur | 16 kartu / 14 visual / 9999 pill |
| 6 | Padding seksi tidak seragam | 80/80 desktop, 64/64 mobile |
| 7 | Nav ada blur/backdrop | transparan, tanpa blur |
| 8 | H1 clamp besar | 48/64 desktop, 28/36 mobile |

---

## 5. Keputusan implementasi

Ikuti angka, bukan selera. Urutan kerja:
1. Token dulu (`:root`): radius, shadow, padding, font-size scale.
2. Hapus motion berlebih → sisakan satu momen.
3. Hero: satu visual fokus.
4. Kartu: hapus hover-lift & shadow.
5. Ukur ulang: CLS, L35, kontras, touch target.
