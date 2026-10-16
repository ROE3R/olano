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
