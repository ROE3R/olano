# Sokudo.dev → Olano.xyz: Reference Teardown (diukur, bukan dari memori)

Diukur 2026-10-16 via headless Chrome (computed style + DOM + CSS aslinya).
Screenshot: `sokudo-1440-hero.png`, `sokudo-1440-features.png`, `sokudo-390-hero.png`.
Sebelum di-rebuild: `olano-before-1440.png`, `olano-before-390.png`.

## Stack sokudo
Astro + Tailwind (kelas `md:grid-cols-2`, `gap-6`), satu CSS bundle 64KB,
font tunggal **Figtree** (Google Fonts, gratis) untuk SEMUA peran: nav, H1, H2, H3,
body, tombol. Tidak ada font kedua, tidak ada mono.

## Tabel token (nilai ukur sokudo → nilai olano, light theme)

| Token | Sokudo (dark, ukur) | Olano (light, hasil) | Alasan konversi |
|---|---|---|---|
| bg | #000 | #FFFFFF | ekuivalen netral |
| surface | #141414 (white 4%) | #FAFBFD (gray-25) | 4% gelap on white |
| surface-2 | #0F0F0F (white 6%) | #F4F6FA (gray-50) | 6% gelap on white |
| border | rgba(255,255,255,.08) | #E8ECF3 (gray-100) | 8% gelap on white |
| teks | #FFFFFF | #0B1220 (ink) | |
| teks redup | rgb(183,183,183) | #6B7489 (gray-500) | 183/183/183 gagal AA di putih; padanan 4.68:1 |
| accent | rgb(0,145,255) | #2453EB (sesuai brief: hue Olano) | bentuk/intensitas dari ukur |
| font | Figtree 400/500/600/700 | Figtree self-host woff2 latin (11-12KB/weight) | persis, gratis, bukan font terlarang (Geist diganti) |
| H1 | 48px/64 w700, center, 2 baris | clamp 28→48, lh 1.3 | ukur 1440 + 390 (28px) |
| H2 | 40px/56 w600 | clamp 28→40, lh 1.35 | ukur |
| H3/kartu | 18px w600 | 18px w600 | ukur |
| body/sub | 18px/28 (14px mobile) | 15px→18px, lh 1.55 | mobile 14px sokudo, +7% utk AA & keterbacaan low-end |
| tagline badge | 16px w400 di glass pill, dot-dipisah titik | 14px w500, titik (bukan titik-tengah) | DNA sokudo |
| nav | tinggi 80, bg transparan (tanpa blur), link 16px, CTA pill 44px | tinggi 64→80, transparan + border on scroll | ukur; border on scroll = micro 0.15s |
| CTA pill | h44, pad 20px, radius 9999, border 1px white/16%, shadow 0 8px 40px rgba(0,0,0,.12) | h48 mobile (tap), radius 9999, glow 0 8px 40px rgba(36,83,235,.30) + border | glow shape ukur, hue biru |
| kartu | bg surface, radius 16, border 1px, TANPA shadow | bg white, radius 16, border 1px, tanpa shadow | persis |
| section padding | 80px desktop / 64px mobile (hero 120/80, mobile 32/48) | 80/64, hero 96/56 | persis |
| container | 1185px konten | 1200px | selisih 1.3% |
| grid fitur | 2 kolom, gap 24px, tinggi kartu bervariasi (474/474/560/560), isi: ilustrasi + H3 + 1 kalimat | 2 kolom gap 24, tinggi bervariasi via aspect ilustrasi (pendek/tinggi/pendek), isi: ilustrasi + H3 + 1 kalimat | persis pola |
| glow | radial corner-shine white di nav/CTA + glow besar di belakang visual hero (rasio ~1584x926) | radial-gradient(60% 50% at 50% 18%, rgba(36,83,235,.16), transparent 70%) | CSS-only, hue biru, bentuk & intensitas ukur |
| motion | 1 keyframes (spin badge), transisi 0.15-0.2s cubic-bezier(.4,0,.2,1) hanya di elemen interaktif | fade-in hero sekali saat load (0.5s), transisi warna/border 0.15-0.2s; TIDAK ada reveal per section, hover kartu, count-up | persis constraint brief |

### Font terlarang → pengganti
Geist (body lama olano) termasuk daftar terlarang. Figtree = font sokudo aslinya,
gratis di Google Fonts, self-host woff2 subset latin (5 weight, total 57KB),
`font-display: swap`. Skala typographi 1 family (sokudo juga 1 family),
angka Rp pakai `font-variant-numeric: tabular-nums`.

## Struktur hero sokudo (urutan DOM, 1440)
1. tagline pill (sparkle icon + "Plan. Assign. Review. Ship.") -- center
2. H1 2 baris center, 2 phrase dengan gradien accent
3. sub 1 paragraf center, max-width 780px
4. SATU CTA pill center
5. visual produk BESAR center (1185x687, radius 14, border, glow di belakang)

## Yang dibuang dari olano (audit + alasan)
| # | Elemen | Alasan |
|---|---|---|
| 1 | eyebrow di atas tiap H2 (.eyebrow Fitur/Alat/Harga/PP 20/2026/Estimasi cepat) | brief; sokudo tidak punya eyebrow di section |
| 2 | nomor 01-06 di daftar fitur | bukan urutan (sokudo = grid ilustrasi); brief |
| 3 | string dipisah titik-tengah (badge hero, pf-note, hero-note) | brief; pola sokudo = dipisah titik |
| 4 | stat band 100%/0%/0,5% | brief; sokudo tidak punya baris angka besar+label |
| 5 | hero ±10 widget mini (pframe 3 scene, tab, heat7, ring, mock row) | brief: SATU visual produk besar; sokudo = 1 visual |
| 6 | link "Detail" di tiap kartu/baris fitur | brief |
| 7 | font Geist + Bricolage Grotesque | Geist terlarang; Bricolage bukan font sokudo (1 family = Figtree) |
| 8 | h-roll word-mask, slide-number, count-up, scene cycle | brief: motion = satu momen load + respons aksi |
| 9 | hover lift/shadow di semua kartu (.feat:hover, .tool-card:hover, .spot) | brief: tanpa hover di tiap kartu |
| 10 | data-reveal fade-slide per section | brief: tanpa fade-slide per section |
| 11 | hero-note "Gratis untuk mulai · ..." di bawah tombol | brief: pindah ke pricing |
| 12 | band gelap navy pajak | sokudo = surface shift halus, bukan dark band; brief "jangan menambah gaya baru" |
| 13 | CTA ganda di hero ("Hitung pajakmu dulu") | brief: SATU CTA |
| 14 | tombol ganda di CTA penutup ("Kenali Olano dulu") | brief: satu tombol |

Fakta pajak, kalkulator JS, anchor, meta/SEO, urutan section, disclaimer: TIDAK DISentuh.

## Wireframe (desktop 1440)
```
NAV  [O Olano] ......... Fitur Alat Pajak Harga .... Masuk (teks)  [Coba Gratis]
HERO (bg white + glow radial biru di tengah)
      (sparkle) Kasir. QRIS. Pajak. Satu aplikasi.     <- tagline pill
      Jualanmu tetap jalan,                            <- H1 48/700 2 baris
      walau internet mati.
      Kasir offline untuk UMKM: jualan, QRIS, dan stok  <- sub max-780
      jalan tanpa internet. Pajak dihitung otomatis.
      [Coba Kasir Gratis]                                <- satu CTA pill
      +--------------------------------------------------+
      |  [screenshot kasir.html: grid + sheet bayar]     |  <- visual 1180px
      +--------------------------------------------------+
      Data contoh · Tampilan aplikasi Olano
FITUR  (surface #FAFBFD)
      Semua yang usahamu butuh.                        <- H2, tanpa eyebrow
      +------------------+ +------------------+
      | img f-kasir      | | img f-qris       |
      | Kasir offline     | | QRIS statis      |   <- kartu 2x3, ilustrasi
      | 1 kalimat         | | 1 kalimat        |     aspek bervariasi,
      +------------------+ +------------------+     tanpa nomor/tanpa Detail
      +------------------+ +------------------+
      | img f-scan       | | SVG: slider foto  |
      | Scan tanpa barcode| | AI foto produk    |
      +------------------+ +------------------+
      +------------------+ +------------------+
      | SVG: 3 chip harga | | SVG: ring 87/100 |
      | AI penjaga harga  | | Skor kesehatan   |
      +------------------+ +------------------+
ALAT   (white)
      Hitung dulu, baru bayar.
      +------------------+ +------------------+
      | ic Kalk PPh final| | ic HPP & harga   |
      +------------------+ +------------------+
      | ic Biaya QRIS    | | ic Margin delivery|
      +------------------+ +------------------+
PAJAK  (surface #F4F6FA + glow biru di balik kalkulator)
      Aturan pajak UMKM berubah di 2026.
      3 poin pendek + PP 20/2026   |  [kalkulator, JS lama utuh]
HARGA  (white)
      Gratis untuk mulai.  <- baris "tanpa kartu, data terenkripsi" pindah ke sini
      [Gratis Rp0]  [Pro Rp50rb]
CTA    (glow radial)
      Mulai  (label kecil)
      Mulai jualan lebih rapi hari ini.  <- H2
      Buka kasir, transaksi pertama dalam 3 menit.
      [Coba Kasir Gratis]
FOOTER (utuh)
```

## REFERENCE B: thedaydream.studio (diukur 2026-10-16, 1440 + 390)
Studio desain independen, tema "dreamy / floating ideas". Di render penuh (JS, 25 CSSAnimation infinite, durasi drift 6.1-9s).

### Token terukur B
| Peran | Nilai | Sumber |
|---|---|---|
| Display/body/nav (SEMUA peran) | **Aspekta** (OTF/woff2, OFL 1.1, Ivo Dolenc, repo github.com/ivodolenc/aspekta), weight 450/500/600 | ukur computed: h2/body/nav = Aspekta; file ASPEKTA-450/500/600.OTF + woff2 di network |
| Aksen (1 kata "magic") | **Instrument Serif italic** 400 (woff2 Google Fonts, OFL) | ukur: .about-magic = Instrument Serif, fs 31.9 |
| H1/hero title | Aspekta **87.07px / w600 / ls -3.48px (-0.04em) / lh normal** @1440; **52px** @390 | ukur: SVG text hero "Where your dream designs come true" |
| H2/section | Aspekta **28.894px / w450 / ls -0.578px (-0.02em) / lh 43.341 (1.5)** | ukur: .work-title, .contact-title |
| Body | Aspekta **16px / lh 18px / w450** | ukur: p, nav |
| Nav | 13.333px (0.833rem) | ukur |
| Background | **langit: rgb(13,123,246)** html bg + sky-hero.webp (1997x1456) + lightleak.webp (blend **screen**) + grid-overlay.svg + star-dots.svg (opacity .4) | ukur computed + network |
| Cloud | cloud-1.webp (1834x1139), cloud-2.webp (1940x1153), absolute, opacity 1, **drift transform 6.1-9s infinite alternate** | ukur getAnimations: 25x CSSAnimation |
| Radius kartu | 0 (studio airy, full-bleed; tidak ada kartu) | ukur |
| Motion library | **tidak ada** (bukan GSAP/Lenis/Framer/Three); semua CSS keyframe + WAAPI | ukur: 25 animation, 0 library global |

### PETA SUMBER (satu sumber per peran)
| Peran | Sumber | Alasan |
|---|---|---|
| Struktur halaman, grid fitur, komponen kartu | **A (sokudo)** | A punya kartu/grid nyata; B full-bleed tanpa kartu |
| Tipografi (family, weight, skala, letter-spacing) | **B** | Aspekta w450 + ls -0.02em jauh dari default generik (Figtree/Inter); B satu-satunya yang "paling khas" |
| Aksen serif italic 1 kata | **B** | Instrument Serif italic = signature B (1 kata "magic") |
| Atmosfer: langit, awan, glow bentuk & intensitas | **B** | html bg biru langit + lightleak screen + awan drift; diterjemahkan: hue tetap biru Olano, intensitas turun (tema terang) |
| Motion: satu momen load + drift lambat | **B** | 25 animasi drift 6-9s transform-only; diadaptasi: hanya 2-3 elemen, hormati reduced-motion, ringan utk Android kelas bawah |
| Radius, spacing, padding, grid | **A** | A terukur (16px, 80/64px, container 1265) |
| CTA pill + glow | **A** | ukur sokudo: h44, border light, glow 0 8px 40px |

### Keputusan khusus Olano
- **tnum (tabular-nums)**: Aspekta **tidak support** GSUB tnum (ukur: width '000' == '111' dengan/without tnum). CSS `font-variant-numeric:tabular-nums` tetap dipasang (no-op jika font tidak punya); selisih deviasi dicatat di laporan.
- **H1 mobile**: B = 52px, tapi brief mensyaratkan max 3 baris di mobile utk H1 40 karakter. clamp(42px mobile -> 87px desktop) dipilih; desktop = B persis, mobile = trade-off terdokumentasi.
- **Langit**: rgb(13,123,246) B terlalu gelap utk tema terang; diterjemahkan #C9DEFF->#E4EEFF->#FFF (hue sama, intensitas turun). Awan = CSS elips datar radial-gradient (bukan PNG), drift 9s/7.5s (durasi dari B).


## ATMOSPHERE SYSTEM v2: sky system thedaydream.studio (diadopsi 2026-10-16)

"Dreamy" daydream BUKAN dari bentuk awan CSS (olano v9 sudah punya elips datar) --
ia dari LAYER SYSTEM foto: langit fotografis + lightleak screen + bintang +
komet ambient. Motion = transform-only (cloud-drift 9s/7.5s alternate,
comet-fly 6.2/7.4/8.6s). Diukur di atas, diadopsi ke olano dengan 2 aturan:
(1) tema terang: langit foto opacity .42-.5 + veil white-gradient di atasnya
(basis tetap #C9DEFF->#E4EEFF->#FFF), (2) AA dijaga: veil + grad base bikin
teks #343C4F tetap AA di atas langit.

### Aset (assets/daydream/, download dari thedaydream.studio, dikompres)
| File | Ukuran akhir | Peran di olano |
|---|---|---|
| sky-hero.webp | 22KB | langit fotograferik 3840x2800 -> 2200x1604, op .5 hero / .42 tool-hero |
| cloud-1.webp | 67KB | awan foto 1 blur 4px, drift 9s alternate |
| cloud-2.webp | 54KB | awan foto 2 blur 2px, drift 7.5s alternate-reverse |
| lightleak.webp | 8KB | light-leak, mix-blend-mode:screen op .85 |
| grid-overlay.svg | 1KB | radar rings (bukan grid tabel; motif daydream), op .35-.45 |
| star-dots.svg | 14KB | bintik bintang, op .35 |
| selection.svg | 10KB | hover selection daydream -- TIDAK dipakai olano |

### Komposisi hero (index.html, .hero-sky, z-index 0 di bawah container z1)
Sky(photo .5) -> Veil(white grad 180deg .28->.55->.92->#FFF) -> Grid(.45) ->
Cloud1(.9) -> Cloud2(.9) -> Leak(screen .85) -> Stars(.35) ->
Comet x3 (c1 6.2s/delay0, c2 7.4s/delay1.1 --s:.6, c3 8.6s/delay2.2 --s:1.3).
Semua aria-hidden, pointer-events:none, alt="" (non-sensory).

### tool-hero (8 sub-halaman)
Variant LITE: sky .42 + veil + cloud1 drift + grid .35, tanpa comet/bintang/leak.
Sistem yang sama, beban lebih ringan (halaman tool fokus kalkulator, bukan atmosfer).

### Motion (diukur dari B, CSS-only, tanpa library -- B pun 0 library global)
cloud-drift: translateX(0)->translateX(-9vw) 9s linear infinite alternate
(olano; B pakai -8rem, diadaptasi vw biar konsisten mobile).
comet-fly: 0% op0 -> 2% op1 -> 35% op0 di (72vw,30vh) 22.6deg, 6.2-8.6s infinite;
body=grad white, head=dot+box-shadow (bentuk komposisinya diambil, angka diadaptasi).

### Aset foto produk (assets/img/food/, scrape Pexels 2026-10-16)
Slider before/after AI Foto Produk di umkm.html diganti SVG flat -> foto nyata
(subjek diverifikasi dari judul halaman Pexels, bukan tebak):
| Foto | ID Pexels | File |
|---|---|---|
| es kopi susu (before/after) | 7937425 "Iced Coffee Drink in a Glass" (Nicola Barts) | foto-ai-kopi-{before,after}.webp 768x960 |
| keripik/snack (before/after) | 9069272 "A Person Holding a Bowl of Chips" (Yan Krukau) | foto-ai-keripik-{before,after}.webp |
| batik/kain tenun (before/after) | 31853353 "Close-Up of Colorful Textile Fabric Weave" (Matheus Bertelli) | foto-ai-batik-{before,after}.webp |
"before" = crop off-center + brightness .92 + saturasi .55 + blur 4px (simulasi
foto HP amatir); "after" = crop center (simulasi hasil AI). Semuanya Pexels
lisensi (gratis, boleh komersial, atribusi opsional).

### Constraint yang tetap
Lighthouse (target): Perf >=90, A11y >=95, CLS <0.1 -- sky system menambah
~200KB aset (sudah di-cache SW v10; langit hero eager, sisanya lazy).
prefers-reduced-motion: semua drift/komet dimatikan + komet hidden.
SEO/fakta/kalkulator/anchor: tidak disentuh.

## v12-v14: harmonisasi warna + mockup tajam (2026-10-16, setelah "blm ok")

Root cause diukur, bukan feeling:
| Masalah | Ukur | Fix |
|---|---|---|
| Sky "pasted", ngga cocok sama blue olano | hue dominan sky ~200-210 (cyan-dreamy) vs #2453EB hue 226 | hue-rotate(30deg) saturate(1.12) di h-sky/l-sky/cloud via CSS filter (non-destruktif); veil diganti tint biru brand (bukan putih murni) |
| Lightleak neon/rainbow | streak oranye hue 10-15 di lightleak.webp, screen op .85 | saturate(.2) + op .16 -> jadi jejak halus |
| Font "ngga enak" | CSS minta Aspekta 700/800, file cuma 450/500/600 -> browser synthesize bold (blurry) | unduh ASPEKTA-650.OTF dari daydream, subset woff2 13KB, @font-face range 650-800 -> request 700/800 resolve ke file asli, sintesis mati |
| Mockup hero muddy/blur | aset lama 21KB 1180x962 + background layer sengaja blur | ganti dengan RENDER PWA ASLI (app/kasir.html 3 item, bar "3 item Rp62.000 Bayar") @2x desktop / @3x mobile tanpa sheet; desktop 1x 23KB LCP + 2x 60KB retina srcset; mobile 1x 19KB + 2x 47KB |
| Card "AI foto produk" placeholder SVG huruf A | | komposit 16:9 before/after foto kopi nyata (f-foto-ai.webp 38KB, label SEBELUM/SESUDAH) |
| Crop scan card patah (2.8:1 dipaksa 16:9) | | f-scan16.webp = crop tengah 16:9 (744x419, 8KB) |
| Bug app: "Rp Rp22.000" di swipe confirm | label statis "Rp" + R.rp() juga prefix "Rp" | static label tanpa Rp; span placeholder "Rp0" |
| Perf regresi 65 / CLS 0.877 (v13) | decode 4.5MP + clouds 122KB di mobile throttling | clouds ke 520px (74KB total), sky-hero-m.webp 780px (4KB) via <picture> di semua halaman, mockup mobile 1x 390px |

Hasil akhir (LH mobile devtools): **Perf 91 / A11y 100 / CLS 0 / LCP 3.3s / 430KB**.
SW -> olano-v14. Kontras banner Kembalian #0A5C36 on #E7F6EE = 7.24:1 (AA;
klaim "kontras jelek" dari vision model qwen gratis salah -- diverifikasi programatik).
