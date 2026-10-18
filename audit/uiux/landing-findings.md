# Landing Olano — Findings Fase 0 (verifikasi L1–L37, read-only)

Tanggal: 18 Okt 2026 · Server ukur: `python3 -m http.server 8902` (MASIH JALAN, background `proc_0e4687b692da`).
Metode: headless Chrome (`--headless=new`) + probe JS di-inject via harness iframe same-origin
(`audit/uiux/harness.html`, `harness360.html`) — pengukuran 360px ASLI dilakukan di iframe 360×800
karena `--window-size` Chrome headless di box ini ter-clamp ke min. 500px untuk dump-dom
(ikuti catatan di bawah bila membaca ulang angka `probe-results.json`).
Sumber: `index.html` (401 baris), `assets/css/main.css` (1275), `assets/js/shared.js` (449), `assets/js/motion.js`, `assets/js/config.js`.
Bukti gambar: `audit/uiux/baseline/landing/*.png` (daftar di bagian d).

Catatan kalibrasi penting: angka di `probe-results.json` (500/768/1280) valid untuk 768 & 1280;
angka "360"/"390" di file itu = viewport 500px. Angka 360 yang benar ada di `probe-results-360fix.json`
dan dikutip di tabel ini.

---

## a. Tabel L1–L37

| ID | Status | Level | Bukti (line# + file/ukur) | Perbaikan yang dituntut (1 baris) |
|----|--------|-------|---------------------------|-----------------------------------|
| L1 | TERBUKTI (sebagian) — 3 fakta, bukan 4; bukan "PWA v24" | K | index.html:35 — teks = "Kasir tetap jalan saat internet mati · QRIS dengan nominal terisi otomatis · PPh final 0,5% (PP 20/2026)" (3 fakta, 0 × "PWA v24" — brief usang). Di 360px: 3 baris, tinggi 64.8px, font 11.5px (landing-360x800.png). Tutup ×: 28×28 (di bawah 44px). | Pangkas jadi 1 pesan 1 baris; tombol tutup ≥44×44. |
| L2 | TIDAK TERJADI | T | grep "PWA v24" = 0 hasil di index.html/config.js/manifest; probe render: `pwaV24: null`. | Tidak ada yang perlu dihapus — anggap brief usang. |
| L3 | TERBUKTI (tujuan beda) / TIDAK TERJADI (sesak) | T | Dua tombol ada (index.html:68–69) tapi tujuan BEDA: `app/login.html` vs `app/kasir.html#demo` — klaim "sama halaman beda #" SALAH. Di 360 kedua tombol `display:none` (hanya burger, probe `visible:false`); tidak ada sesak. | Tak ada masalah sesak di mobile; opsi rapikan: sembunyikan "Masuk" juga di desktop-ish breakpoint (1080px gate terlalu tinggi). |
| L4 | TIDAK TERJADI (menu sama) | T | Probe: desktop dd-Produk = [umkm, pajak, website, analisa-delivery, ai, automation, naik-kelas] = isi `.nav-mobile` persis (index.html:46–53 vs 74–81); "Kasir UMKM" ada di KEDUA daftar. | Tidak ada bug informasi; brief usang. |
| L5 | TERBUKTI (lulus sebagian besar) | T | Menu dibuka (probe): baris tautan 54.4px (≥48 ✓), jarak 0 (dalam toleransi brief 0–8px), panel 872px mengikuti halaman, CTA demo + Masuk di dalam menu ✓, tutup via klik tautan ✓. | Yang belum ada: Esc menutup, fokus terkunci (focus-trap), scroll body terkunci saat menu terbuka — tidak ditemukan di shared.js (initNav hanya toggle class). |
| L6 | TIDAK TERJADI (praktis lolos) | S | Jump ke #harga (probe anchorTest): top seksi setelah jump = 0.1–0.4px; heading mulai di 64.1px @360 (padding seksi 64px) vs header sticky 65px → hanya ~0.9px graze; @768/1280 heading jauh di bawah header (96/120px padding). Flag `coveredByStickyNav` di probe = kotak SEKSI (termasuk padding), bukan heading. | Tidak perlu fix mendesak; opsional `scroll-margin-top: 72px` sebagai jaring pengaman bila padding seksi berubah. |
| L7 | TERBUKTI | R | index.html:42 & 315: `href="index.html"` (bukan "/"). | Ganti ke `/`. |
| L8 | TIDAK TERJADI (5–6 baris) — nyata 3 baris | K | Probe 360 asli: H1 32px/34.56 lh, **3 baris**, tinggi 104.6px (landing-360x800.png). | Brief terpenuhi; tidak perlu dipotong lagi. |
| L9 | TIDAK TERJADI (bukan kartu melayang) — struk 3-baris DI BAWAH CTA, tidak menimpa | K | Probe: CTA di top 312.6 (bottom 356.6), struk 3 baris di top 382.6 (h 120.3) = DI BAWAH CTA ✓; angka = QRIS Rp40.000 / Omzet Rp75jt / PPh Rp166.667 (bukan versi brief Rp60jt/Rp91.667). fnote "Basis: …" 11px (di bawah 12px), warna gray-500 di atas gradasi terang — kontras perlu diukur; tidak di atas gambar. | Turunkan CTA? tidak; hanya besarkan fnote ≥12px + cek kontras. |
| L10 | TERBUKTI | K | assets/daydream/: sky-hero.webp 21.6KB / sky-hero-m.webp 4.2KB (mobile, 780×568), grid-overlay.svg 0.8KB, cloud-1.webp 42.5KB, cloud-2.webp 33.9KB (tak terpakai?), lightleak 8.5KB, star-dots 13.5KB (referensi CSS saja). Total hero mobile ≈ sky-m 4.2 + cloud 42.5 + grid 0.8 ≈ 47.5KB → di bawah anggaran 60–80KB. | Visual tetap "langit/awan" (klaim gaya brief benar); bobot aman; ganti visual = keputusan owner. |
| L11 | TERBUKTI | S | CSS `.h-cloud-1{animation:cloud-drift 9s linear infinite alternate}` (main.css:808) + `.h-grid[data-parallax="0.10"]` (index.html:100) di-handle motion.js (translate 0.1×scroll) + smooth-scroll spring (wheel preventDefault!) + xfade veil. Guard reduced-motion ADA (main.css:924, motion.js listener). | Matikan cloud-drift + parallax di mobile/reduced-motion (sudah sebagian); hindari wheel-hijack di landing. |
| L12 | TERBUKTI (sesuai brief: pertahankan) | S | Hanya 1 tombol hero (index.html:108). | Pertahankan. |
| L13 | TERBUKTI | K | `.hero-visual-link` membungkus gambar+figcaption+hint (index.html:115–125); mobile = produk-kasir-mobile.webp **390×844 (9:19.5 potret)** dirender 244×528 — bukan desktop-shot dikecilkan (klaim brief usang); teks link = alt 95 char + caption + "Coba demo kasir →" — nama aksesibel panjang ✓. | Pisahkan tautan dari gambar (tombol 48px terpisah); alt singkat. |
| L14 | TERBUKTI | K | 6 `.modrow` semua `<a>` (probe allAreLinks:true), tinggi 176–195px (total 1088px ≈ 1.4 layar), chip "contoh ·" 2–3 baris, nama aksesibel panjang. | Ringkas kartu/accordion; cegah navigasi saat drag. |
| L15 | TERBUKTI | T | Chip rumus 1 baris: "contoh · Rp45.000 − komisi 29% − promo Rp3.000 − HPP Rp18.000 → laba Rp10.950" (index.html:176), 3 baris di 360. | Layout berstruktur label-kiri/nilai-kanan atau hapus. |
| L16 | TERBUKTI | T | 5 × "Sudah jalan" (probe sudahJalanCount=5) + 1 "Segera hadir". | Tampilkan badge hanya untuk pengecualian. |
| L17 | TERBUKTI (di desktop) / TIDAK TERJADI (mobile disembunyikan) | S | "05 aktif · 01 segera hadir" (index.html:139); probe: `pickCountVisible` = false @360, true @768/1280 (CSS `.pick-count{display:none}` @≤759px, main.css:1209). | Sudah disembunyikan di mobile; pertimbangkan hapus total (desktop). |
| L18 | TIDAK TERJADI (dim tapi link jalan) | T | Row 06 dim (opacity .62, main.css:879) TETAPI tetap `<a href="automation.html">` dan halaman ada (9.8KB). | Keputusan desain sadar (komentar CSS "dim tapi link-nya tetap jalan"); sesuai brief L18: ganti aksi jadi "Daftar tunggu" bila mau konsisten. |
| L19 | TERBUKTI (ada) | S | Nomor 01–06 di tiap baris (index.html:143–189). | Nomor bukan peringkat → pertimbangkan hapus. |
| L20 | TERBUKTI | S | 4 `.trow` list polos, tinggi 56px (≥48 ✓), teaser "contoh: …" kanan (index.html:212–217). | Ubin 2×2 + ikon bila mau lebih menonjol; target sentuh sudah aman. |
| L21 | TERBUKTI (sebagian) | S | Modul = putih, alat = transparan, pajak = navy (sections probe) — latar sudah bervariasi; jarak antar seksi 96px mobile (≥64 ✓). Gaya kartu mirip di modul/alat. | Ritme sudah ok; variasikan komponen (widget vs daftar sudah beda). |
| L22 | TERBUKTI (desktop) / TIDAK TERJADI (mobile) | K | DOM: H2 → callout aturan → tombol panduan → widget (index.html:227–253); probe 360: teks col 269px, widget mulai offset 381px dari atas seksi → widget di bawah teks di desktop; di mobile grid 1 kolom = teks dulu. | Pindahkan widget dulu di mobile (order) atau accordion aturan. |
| L23 | TIDAK TERJADI (bukan radio) — `<select>` native ✓ | T | `<select id="tax-wp">` 5 opsi (index.html:236–242), default "Orang Pribadi" ✓. | Sudah sesuai tuntutan. |
| L24 | TERBUKTI (gagal sebagian besar) | K | Input `type=number` + inputmode numeric (index.html:245): TANPA prefix "Rp" dalam kolom, TANPA pemisah ribuan (value "75000000" mentah), TANPA chip cepat (0), TANPA tombol clear, hasil LIVE ✓ (aria-live=polite, tanpa tombol Hitung ✓). | Tambah prefix Rp, format ribuan, chip 10/30/60/100 jt, tombol clear; jaga type≠number. |
| L25 | TERBUKTI (secara struktur) | K | `#tax-out` (hasil) berada DI BAWAH input (resultBelowInput:true; resultTopVsInputTop=64) → saat keyboard terbuka, hasil tersembunyi; tidak ada scrollIntoView. | Pindahkan hasil ke atas input atau sticky; scrollIntoView otomatis. |
| L26 | TERBUKTI (sebagian) | S | Hasil 28px @360 (min brief 32px), tabular-nums ✓; dua blok bersaing (out-hero + callout). | Besarkan ≥32px; tata hierarki (angka besar → penjelas → detail). |
| L27 | TIDAK TERJADI (Pro ditandai) | K | Probe: Pro `.price-card.active` dengan marker ::before "PALING LARIS" (main.css:1036–1042); stacked mobile ✓ (klaim brief "Gratis di atas Pro" benar — hanya itu). | Urutan tetap Gratis-dulu; penanda sudah ada — cukup pertimbangkan Pro-dulu di mobile. |
| L28 | TERBUKTI | T | Butir gabungan: "AI harga, foto (60 foto/outlet/bulan), dan Tanya AI" (index.html:282). | Pecah 1 butir = 1 hal; angka batas jadi teks sekunder. |
| L29 | TIDAK TERJADI (sudah nowrap) | T | "Rp50rb" 30.4px + "/outlet/bulan" span kecil di baris berbeda tapi `white-space:nowrap` (main.css:944 `.tval`-style? — cek `.price-val .small` line-height); probe spansSameLine=false karena span jatuh ke baris kedua secara terkendali (bukan yatim acak). | Sudah aman dari wrap acak; cek ulang setelah rebuild harga. |
| L30 | TERBUKTI | K | "Layanan pajak dan website custom tersedia per penawaran lewat WhatsApp." (index.html:287) — probe `hasButtonInside:false` → teks polos tanpa tombol. | Tambah tombol WA 48–52px, label jujur "nomor menyusul" (K1). |
| L31 | TERBUKTI (tujuan hampir sama) | S | Gratis CTA → `kasir.html#demo` (redirect ke app/kasir.html); Pro CTA → `app/kasir.html#demo` — tujuan akhir SAMA (kasir demo), label sama "Coba demo kasir" (index.html:275,286). | Primer vs sekunder visual; label tujuan dibedakan bila perlu. |
| L32 | TERBUKTI | K | Probe: closing CTA top 5185 < testimoni top 5293 → testimoni SESUDAH CTA penutup ✓; label "CONTOH - tiga cerita…" tampil ✓ (index.html:300–307); 3 kartu render dari config.js. | Sembunyikan seksi sampai isi nyata (K5/L32). |
| L33 | TERBUKTI | T | 3 kolom nav (Produk/Kalkulator/Perusahaan) + brand; link 13px, tinggi 18px, gap 7px @360 (di bawah 44px target); paragraf hukum 147 char; body paragraf kecil. | Link footer ≥44px, kolom jadi akordeon/1 kolom. |
| L34 | TIDAK TERJADI (tidak ada FAQ) — tapi brief minta DITAMBAH | T | Probe absentClean: faq 0, "Cara mulai" tidak ada, "Keamanan data" tidak ada (teks di brief ternyata false positive dari teks meta description "Data terenkripsi di perangkatmu." — bukan seksi). | Sesuai tuntutan L34: tambah komponen FAQ + 3 langkah (isi menyusul). |
| L35 | TERBUKTI (di bawah target) | T | scrollHeight @360×800 = **6983px → 8.73 layar** (target ≤9 ✓, mepet). | Jaga ≤9 saat menambah FAQ/langkah mulai (L34) — ada ruang ~0.27 layar saja. |
| L36 | TERBUKTI (tidak ada) | S | Probe backToTopCount=0; tidak ada tombol "ke atas". | Tambah tombol kecil muncul setelah scroll jauh. |
| L37 | TERBUKTI (ada & berfungsi) | S | `.skip` fokus → left:0 terlihat (probe skipLink), href="#main", target ada (index.html:31, main#main:93). | Pertahankan. |

Legenda status: TERBUKTI = klaim/temuan benar di render nyata; TIDAK TERJADI = klaim brief salah di render nyata
(bisa berarti halaman sudah diperbaiki, atau brief usang); sebagian = benar sebagian, salah sebagian.

---

## b. C3 + L35 — angka pengukuran

### C3: CTA utama tanpa scroll di 360×640 (efektif 360×560)
| Ukuran | Ticker | H1 lines | CTA top (doc) | CTA bottom | Terlihat tanpa scroll? |
|--------|--------|----------|----------------|------------|------------------------|
| 360×800 (iframe 360) | ADA | 3 | **312.6px** | 356.6px | **YA** di 560 (312.6+44=356.6 < 560) |
| 360×800 tanpa ticker (estimasi) | tidak | 3 | ~247.8px | ~291.8px | YA, makin lega |
| 390×844 (500px clamp render) | ADA | 3 | 323.4 | 367.4 | YA |
| 768×900 | ADA | 3 | 449.8 | 493.8 | YA di 757 vh |

Kesimpulan C3: **LULUS** — CTA utama (bottom 356.6px) jauh di atas fold efektif 560px,
dengan ticker 3 baris pun (64.8px) masih terlihat tanpa scroll. Bahkan dengan ticker +
H1 3 baris + struk + fnote (515–551px) semua muat sebelum 560.

### L35: tinggi halaman di 360×800
- `document.scrollHeight` = **6983px** → **8.73 layar** dari 800px → **LULUS** (target ≤9), nyaris mentok.
- Per-banding: 768×900 = 7391px (8.2 layar), 1280×900 = 7214px (8.0 layar).
- Peringatan: menambah seksi FAQ + 3 langkah (L34) dengan padding 64px × 2 seksi ≈ +600–800px
  → langsung >9 layar. Buat komponen ringkas atau pangkas seksi lain dulu.

### CLS saat tutup ticker (L1 tambahan)
- Konten geser **47.5px seketika** (transition 0s), `hidden` toggled — CLS kecil tapi nyata;
  sessionStorage `olano-ticker-dismissed` diingat (shared.js:429–439) ✓.
- Tinggi ticker @360 = 64.8px (3 baris 11.5px); @1280 tetap 2 baris 47.5px.

---

## c. Prioritas perbaikan landing (P0/P1/P2)

**P0 (blok pengalaman, kerjakan dulu)**
1. **L24** Input omzet: prefix "Rp", pemisah ribuan live, chip cepat 10/30/60/100 jt, tombol clear — tetap hindari `type=number`.
2. **L25** Hasil kalkulator di bawah input → tertutup keyboard: pindahkan hasil DI ATAS input (atau sticky) + scrollIntoView.
3. **L30** Jalur WhatsApp tanpa tombol: tambah tombol WA 48–52px (label jujur "nomor menyusul", K1).
4. **L14/L15** Kartu modul 6 × 176–195px full-link + chip rumus pecah baris: ringkas jadi baris 72–96px / accordion; cegah nav saat drag.
5. **L22** Urutan pajak mobile: widget dulu, teks aturan jadi accordion di bawah.

**P1 (nyata tapi tak memblokir)**
6. **L1** Ticker 3 baris @360 (64.8px) + tombol tutup 28px: pangkas ke 1 baris; tutup ≥44×44; animasikan tinggi→0 (CLS).
7. **L6** (opsional) `scroll-margin-top` sebagai jaring pengaman jangkar — praktis sudah lolos (graze 0.9px).
8. **L16** 5 badge "Sudah jalan" = kebisingan: badge hanya untuk "Segera hadir".
9. **L28** Butir Pro gabungan "AI harga, foto (60 foto/outlet/bulan), dan Tanya AI": pecah per butir.
10. **L13** Link raksasa gambar+caption+hint: pisahkan tombol CTA 48px dari gambar; alt ≤125 char.
11. **L26** Angka hasil 28px @360 → ≥32px; rapikan hierarki out-hero vs callout.
12. **L33** Footer link 13px/18px tinggi, gap 7px: tinggi ≥44px, kolom akordeon di mobile.
13. **L11** Cloud drift infinite + parallax grid + smooth-scroll wheel-hijack di landing: matikan di mobile/reduced-motion (guard sudah ada sebagian).
14. **L9** fnote "Basis…" 11px → ≥12px + verifikasi kontras di atas gradasi.

**P2 (pole, keputusan owner)**
15. **L34** Tambah komponen FAQ + 3 langkah "cara mulai" (isi "menyusul") — PERHATIAN: anggaran tinggi tinggal 0.27 layar (L35).
16. **L36** Tombol "kembali ke atas" kecil setelah scroll jauh.
17. **L18** Automation: pertimbangkan "Daftar tunggu" sebagai satu-satunya aksi (sekarang dim tapi tetap link).
18. **L19** Nomor 01–06 bukan peringkat → hapus atau pertahankan sebagai identitas editorial.
19. **L7** Logo `index.html` → `/`.
20. **L31** Bedakan visual CTA Gratis vs Pro (primer vs outline).
21. **L27** (opsional) Pro-dulu di mobile; penanda "PALING LARIS" sudah ada.
22. **L17** Hapus "05 aktif · 01 segera hadir" di desktop juga (mobile sudah disembunyikan).
23. **L32** Sembunyikan seksi testimoni sampai ada isi nyata (K5 — keputusan owner).

**Yang TIDAK perlu diperbaiki (TIDAK TERJADI di render nyata):**
L2 (PWA v24 tidak ada), L3 sesak (tombol header hidden di mobile), L4 (menu identik),
L8 (H1 sudah 3 baris), L9 tumpukan (struk sudah di bawah CTA), L23 (select native),
L27 penanda (sudah ada "PALING LARIS"), L29 (nowrap terpasang), L37 (skip link berfungsi).
Angka di brief (Rp60jt/Rp91.667, "PWA v24", 4 fakta) sudah usang — halaman sekarang memakai
Rp75jt/Rp166.667 dan 3 fakta; verifikasi angka pajak tetap ditunda ke brief audit F2.

---

## d. Screenshot & artefak

Semua di `/root/olano/audit/uiux/baseline/landing/`:
- `landing-360x800.png` (184 KB) — full-page mobile 360 (ticker terlihat)
- `landing-390x844.png` (196 KB) — mobile 390
- `landing-768x900.png` (381 KB) — tablet
- `landing-1280x900.png` (580 KB) — desktop
- `landing-fold-360x560.png` (123 KB) — fold C3 (CTA terlihat tanpa scroll)

Artefak ukur:
- `audit/uiux/probe.js` — probe JS (di-inject via harness iframe)
- `audit/uiux/harness.html` / `harness360.html` — harness iframe same-origin
- `audit/uiux/run_probe.py` → `probe-results.json` (500/768/1280)
- `audit/uiux/run_360fix.py` → `probe-results-360fix.json` (360 asli via iframe)

**Catatan reproduksi:** `--window-size` Chrome headless di box ini di-clamp ke min 500px saat
`--dump-dom` (screenshot TIDAK ter-clamp). Untuk pengukuran 360 asli: pakai harness iframe
fixed-size (harness360.html) — sudah dilakukan.

Tidak ada file source yang diubah. Server 8902 masih jalan (background `proc_0e4687b692da`).
