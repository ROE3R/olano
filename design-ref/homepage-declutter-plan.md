# Declutter Plan: Homepage index.html — "terlalu numpuk" (audit scope: seluruh halaman)

Lingkup: struktur & susunan homepage secara keseluruhan. Copy TIDAK diubah (sudah register
Stripe/Linear; plan ini hanya pindah/hapus/satukan/spasi). Plan picker (modlist) tetap
berlaku terpisah: lihat `picker-redesign-plan.md` — plan ini TIDAK menggantikannya.

Constraint tetap: zero dependency, CLS < 0.1, Lighthouse mobile Perf ≥ 90 / A11y ≥ 95,
1 CSS + vanilla JS, offline PWA, tidak mengubah file apa pun selain implementasi yang
disetujui user (plan ini hanya dokumen).

---

## METODE & KETERBATASAN (transparan)

- Olano diukur live via CDP di `http://localhost:8897/index.html` (mobile 390×844, desktop
  1440×900): scrollHeight, top/height per section, jumlah element/img/svg/link per section,
  computed padding, census elemen dekoratif hero. `curl` index.html == file repo (md5 sama,
  tidak ada file yang berubah saat audit).
- 5 homepage startup diukur dengan cara sama (CDP, dua viewport 1440×900 dan 1440×577
  karena A/B rotasi), plus full-page & fold screenshot (JPEG) diarsipkan untuk review
  visual manual:
  - `/mnt/data/.hermes/fold_stripe.jpg`, `fold_linear.jpg`, `fold_supabase.jpg`,
    `fold_vercel.jpg`, `fold_framer.jpg`
  - `/mnt/data/.hermes/full_stripe.jpg`, `full_linear.jpg`, `full_supabase.jpg`,
    `full_vercel.jpg`, `full_framer.jpg`
  - `/mnt/data/.hermes/full_olano-m390.jpg`, `full_olano-d1440.jpg`
- **Vision backend down sepanjang audit**: relay vision (apinex) menolak dengan
  `402 daily check-in required` (countdown reset terus; tidak bisa diotomasi — perlu
  check-in manual oleh manusia di apinex.bond). Tidak ada VLM lokal (ollama off, port
  20128 mengembalikan 0 model). Karena itu analisis visual per-site DIGANTI dengan
  pengukuran struktural objektif per-DOM (lebih presisi dari estimasi screenshot): posisi
  fold, pad antar band, deteksi grid kartu, census nav/footer. Kesimpulan di plan ini
  bertumpu pada angka terukur, bukan citra. Screenshot tetap diarsipkan; kalau relay
  pulih, bagian B bisa diverifikasi ulang visual tanpa mengubah struktur plan.
- Data verbatim copy per site sudah ada dari riset sebelumnya: `copy-research-bigstartup.md`
  (10 site, 17 Okt 2026) — dipakai sebagai bukti pendukung apa yang mereka taruh di mana.

---

## A. INVENTARI index.html (ukur CDP live)

### A.1 Peta section + tinggi render

MOBILE 390×844 — total scrollHeight **10.626px ≈ 12,6 layar**

| # | Section | top | tinggi | elemen | img | svg | link |
|---|---------|-----|--------|--------|-----|-----|------|
| 0 | nav (header) | 0 | 65 | 23 | 0 | 0 | 14 |
| 1 | hero | 65 | 1.401 | 33 | 7 | 1 | 1 |
| 2 | picker (6 modul) | 1.466 | 1.621 | 67 | 0 | 6 | 6 |
| 3 | fitur (6 kartu) | 3.086 | **2.657** | 63 | 4 | 2 | 6 |
| 4 | alat (4 kalkulator) | 5.743 | 1.244 | 33 | 0 | 4 | 4 |
| 5 | pajak (3 poin + kalkulator) | 6.987 | 1.201 | 43 | 0 | 3 | 1 |
| 6 | harga (2 kartu) | 8.188 | 1.280 | 44 | 0 | 8 | 2 |
| 7 | cta2 penutup | 9.468 | 467 | 6 | 0 | 0 | 1 |
| 8 | footer | 9.935 | 691 | 42 | 0 | 0 | 14 |

DESKTOP 1440×900 — total scrollHeight **7.848px ≈ 8,7 layar**

| # | Section | top | tinggi |
|---|---------|-----|--------|
| 0 | nav | 0 | 65 |
| 1 | hero | 65 | 1.809 |
| 2 | picker | 1.874 | 1.132 |
| 3 | fitur | 3.006 | **1.798** |
| 4 | alat | 4.804 | 723 |
| 5 | pajak | 5.526 | 606 |
| 6 | harga | 6.132 | 822 |
| 7 | cta2 | 6.954 | 447 |
| 8 | footer | 7.401 | 447 |

Padding vertikal per band (computed):
- Desktop: hero 120/80, picker **44/12**, fitur/alat/pajak/harga 80/80, cta2 96/88, foot 96/32.
- Mobile: hero 48/48, picker **32/4**, section lain 64/64, cta2 64/64, foot 96/32.

Isi per section (dari source):
1. **hero** — 1 lapis dekorasi `hero-sky` berisi **11 node dekoratif** (sky webp, veil,
   grid overlay, 2 awan, lightleak, star-dots, scrim, 3 komet animasi) + teks
   (tagline-pill, H1, sub) + 1 CTA + product screenshot + figcaption.
2. **picker** — head 2-kolom (eyebrow + H2 + paragraf samping) + 6 baris modul hairline.
3. **fitur** — H2 + sub + **6 kartu** (4 dengan gambar ilustrasi webp, 2 dengan SVG inline
   berat: AI penjaga harga, Skor kesehatan) — semua kartu link ke umkm.html / ai.html /
   naik-kelas.html.
4. **alat** — H2 + sub + 4 kartu kalkulator (semua sudah punya halaman sendiri; 4 link
   yang sama juga ada di footer).
5. **pajak** — H2 + 3 bullet aturan pajak 2026 + 1 paragraf + CTA panduan + kalkulator
   pajak interaktif (2 field + output).
6. **harga** — H2 + sub + 2 kartu harga, masing-masing dengan tombol CTA.
7. **cta2** — kicker + H2 + sub + 1 CTA (CTA ke-3 dengan copy sama di halaman).
8. **footer** — 4 kolom, 14 link, disclaimer.

### A.2 Fold pertama — elemen yang competing for attention

**Mobile 390 (0–844px):** nav 65px + 779px atas hero. Tampak: pill tagline
("Kasir. QRIS. Pajak. Website. Satu aplikasi.") + H1 (dengan aksen serif italic) + sub +
CTA pill biru + tepi atas product screenshot. **1 section** di fold. Kepadatan fold
sebenarnya wajar — masalahnya DI DALAM band hero sendiri ada 4 lapis pesan bersaing:
- 11 node dekorasi langit (3 komet animasi + bintang + 2 awan + grid + lightleak
  bergerak parallax) — bidang paling "hidup" di fold justru dekorasi, bukan produk;
- tagline-pill ber-borders biru + ikon spark — menyaingi H1 padahal isinya duplikat
  (daftar modul = isi picker; klaim "satu aplikasi" = sudah di H1);
- CTA pill;
- product screenshot menyodok dari bawah fold (potongan setengah badan tanpa caption).
Total fold: 2 teks aksen + 1 CTA + 4 grup dekorasi + 1 gambar = **9 kandidat titik fokus**
untuk 844px. Banding: Stripe fold-1 = H1 + 1 subline + 2 CTA + 1 counter; Linear = H1 64px
+ sub + visual; Vercel = H1 + sub + visual besar; Framer = badge + H1 + visual.
**Semua 5 site: nol elemen tambahan di luar hero-content.**

**Desktop 1440 (0–900px):** komposisi sama, ditambah head picker tidak terlihat (bagus);
kontribusi dekorasi relatif lebih besar (viewport lebar, sky memenuhi latar).

**Kesimpulan kepadatan fold:** bukan "terlalu banyak section" di fold, tapi fold tidak
punya SATU titik fokus: dekorasi + pill + H1 + CTA berebut. Di bawah fold, halaman jadi
numpuk karena **dua daftar fitur paralel** (picker 6 baris + fitur 6 kartu menyampaikan
hal yang sama dua kali dalam 2 layar berurutan: 1.466–3.086 dan 3.086–5.743 di mobile =
**4.277px tanpa informasi baru**), ditambah 3 band lagi yang masing-masing punya head
sendiri (alat, pajak, harga) dan CTA penutup yang mengulang CTA hero.

### A.3 Panjang halaman & background

- 8 band konten + footer, dengan **6 perlakuan background berbeda** (foto sky → putih →
  tint `alt` → putih → tint gelap `alt-deep` → putih → warna CTA → abu footer) — ganti
  suasana tiap ~1.200px di mobile. Banding Stripe: selang-seling white/dark tapi tiap
  band 2.000–4.500px; Linear: 4 band identik 128/128.
- Total 10.626px mobile bukan yang terpanjang (Stripe 14.613, Framer 10.742, Linear
  9.960 @900) — yang numpuk adalah **densitas per layar**: Olano menjejalkan 6 baris + 6
  kartu + 4 kartu + kalkulator + 2 kartu harga dalam 8 band, sementara kelima site besar
  menaruh 1 pesan per band dan mengulang info maksimal 2× di seluruh halaman.

---

## B. DATA KOMPARASI 5 HOMEPAGE STARTUP BESAR (CDP, desktop)

Format: (1) section di fold pertama, (2) total band, (3) di mana TIDAK ada kartu,
(4) apa yang dipindah ke halaman lain, (5) prinsip whitespace terukur.

### B.1 Stripe — scrollH 14.613px (@900)
1. **Fold-1: 1 section** (hero 685px: H1 35px + 1 subline + 2 CTA + counter GDP live).
   Band kartu pertama mulai ~761px — tepat di bawah lipatan.
2. **8 band** utama: hero → band putih 2.196px (logo + 4 kartu produk) → band 560 →
   stats 977 → business-sizes 4.530 (3 story-row + carousel startup) → band gelap 2.341 →
   band putih 1.766 → CTA 380. Footer 1.102.
3. **Tanpa kartu:** hero, band stats (angka polos), 3 band story, CTA. Kartu hanya untuk
   koleksi produk (4) dan stat (4) — tidak pernah dua daftar yang isinya sama.
4. **Di halaman terpisah:** semua produk (Payments, Billing, Connect, … masing-masing
   punya domain/halaman), pricing, customers, docs. Nav terlihat cuma 4–8 item
   (Pricing, Sign in, Start now, Contact sales) + mega-menu. Footer 86 link.
5. **Whitespace:** pad diukur di wrapper luar 0 — spacing dibawa komponen dalam; efektif
   antar grup konten ~96–128px; tiap band menyediakan 1.700–4.500px untuk 1–3 grup
   pesan (≈ 1.500px per pesan). Fold 685px untuk 4 elemen.

### B.2 Linear — scrollH 9.960px (@900)
1. **Fold-1: 1 section** (hero: H1 64px + 1 sub + product visual; CTA di nav).
2. **6 band**: hero + **4 band produk identik ~1.220–1.232px** (padT/B **128/128**
   terukur di semua band) + prefooter 228. Footer 494.
3. **Tanpa kartu: SELURUH halaman tidak punya grid kartu.** 4 fitur utama diceritakan
   sebagai 4 band editorial (heading + copy + visual), deteksi kartu 0 di semua band
   (maks 5 di wrapper dalam, bukan grid).
4. **Di halaman terpisah:** Customers, Pricing, Changelog ("Now"), Docs, tiap area
   produk. Nav: 5 link + 2 CTA. Footer 42 link.
5. **Whitespace:** 128px pad atas-bawah setiap band, konsisten absolut — ritme paling
   ketat dari kelima site. 1 band = 1 fitur = ~1.230px.

### B.3 Supabase — scrollH 3.619px (@900) — TERPENDEK
1. **Fold-1: 1 section** (hero "Build in a weekend / Scale to millions" + sub + 2 CTA +
   product shot).
2. **~7 band pendek** dalam satu wrapper 2.316px + footer 1.057: hero 949 → strip 270 →
   band hairline 854 → 696 → band fitur 898 (**12 kartu**, satu-satunya grid, posisinya
   band ke-5) → 812 → 909 → 373.
3. **Tanpa kartu:** hero, 3 band story/hairline, CTA. Kartu hanya di band koleksi fitur.
4. **Di halaman terpisah:** semua detail produk → /docs & /products; homepage cuma
   3.619px — paling ringkas dari kelima, karena detail teknis tidak pernah naik ke
   homepage. Footer 66 link.
5. **Whitespace:** pemisah antar band = hairline 1px + pad ~64–96; band 270–950px per
   pesan. Prinsip: halaman pendek, divider tipis, detail di docs.

### B.4 Vercel — scrollH 4.861px (@900)
1. **Fold-1: 1 section** (H1 54px "Agentic Infrastructure" + sub rotasi + visual besar;
   2 strip tipis logo 90/154px di bawahnya — bukan kartu).
2. **5–6 band**: header + 3 strip tipis + satu stack editorial 3.462px (produk
   diceritakan bergantian full-bleed dengan caption bukti per-customer) + footer 846.
3. **Tanpa kartu: seluruh homepage 0 grid kartu** (deteksi 0). Produk = potret story
   berurutan, bukan kartu.
4. **Di halaman terpisah / mega-menu:** 25+ item produk & fitur semua hidup di nav
   (AI SDK, Fluid, Observability, Workflows, …) dan halaman masing-masing; homepage hanya
   menceritakan 5–6 di antaranya. Footer 81 link.
5. **Whitespace:** band editorial ~800–1.200px per produk; strip logo cuma 90–154px —
   variasi tinggi band dipakai sebagai ritme (besar-kecil-besar), bukan spacing seragam.

### B.5 Framer — scrollH 10.742px
1. **Fold-1: 1 section** (hero 982px: badge + H1 54px + visual).
2. **7 band**: hero 982 → spacer 336 → showcase 3.017 (satu-satunya area 8-kartu —
   galeri komunitas, bukan daftar fitur) → 4 band produk/agent **1.217–1.817px** →
   footer 611.
3. **Tanpa kartu:** hero + 4 band produk (pad 120/120 semua) + CTA. Grid kartu hanya
   untuk showcase komunitas.
4. **Di halaman terpisah:** tiap kemampuan (Design agent, CMS, Code, Connect) halaman
   sendiri; pricing, templates, community terpisah. Footer 103 link.
5. **Whitespace:** **120px pad atas-bawah di setiap band produk, tanpa kecuali** —
   sama konsisten dengan Linear (128px).

### B.6 ABSTRAKSI — 5 ATURAN KONKRET untuk homepage UMKM Indonesia

1. **FOLD-1 = SATU PESAN, NOL ELEMEN TAMBAHAN.** Kelima site menampilkan hanya hero
   (H1 + maks 1 sub + ≤2 CTA + visual produk) sebelum scroll pertama. Tidak ada chip
   tagline, tidak ada dekorasi animasi yang menyaingi produk, tidak ada daftar apapun.
   → UMKM: fold harus bisa dibaca dalam 3 detik sebagai "aplikasi apa, untuk siapa".
2. **MAKS 6–8 BAND, SATU PESAN PER BAND, JANGAN DUA DAFTAR FITUR.** Linear 4 band = 4
   fitur (0 grid kartu); Vercel 0 kartu; Stripe/Supabase/Framer hanya 1 grid kartu per
   halaman dan selalu untuk koleksi (produk/stat/komunitas), bukan pengulangan daftar
   yang sama. Dua daftar berisi info sama di satu homepage = pola yang tidak dipakai
   satu pun dari kelima site.
3. **RITME PADDING KONSISTEN 96–128px (desktop), tidak pernah <96 antar band.** Linear
   128/128 di semua band; Framer 120/120 di semua band. Olano sekarang 80/80 dengan
   picker 44/12 — di bawah standar DAN patah ritme (band paling padat justru paling
   sempit paddynya).
4. **DETAIL SELALU DI HALAMAN TERPISAH; HOMEPAGE = SATU REPRESENTASI PER TOPIK.**
   Supabase bisa pendek (3.619px) karena detail → docs; Vercel menaruh 25+ produk di
   mega-menu, bukan di band; Stripe 86 link di footer. Info yang sama maksimal muncul
   di 1 tempat di homepage + 1 di nav/footer.
5. **NAV RINGAN (≤8 item), FOOTER BOLEH BERAT (42–103 link), BAND TENGAH EDITORIAL.**
   Berat navigasi ditaruh di nav/footer — bukan dibalikkan ke badan halaman. Band band
   cerita dibuat sebagai narasi (heading + copy + visual), bukan kumpulan kotak.

---

## C. REKOMENDASI PER SECTION (TETAP / PINDAH / HAPUS / SATUKAN / SPASI)

Semua keputusan tied ke data bagian A+B; opsi konservatif disertakan kalau ada trade-off
SEO. Copy tidak diubah; hanya pindah/hapus container-nya.

### 1. NAV — TETAP
4 link + Masuk + CTA = setara Linear (5+2). Mobile menu TETAP.

### 2. HERO — TETAP struktur, HAPUS 2 grup pengganggu, SPASI
- **HAPUS tagline-pill** ("Kasir. QRIS. Pajak. Website. Satu aplikasi."): isinya duplikat
  H1 ("satu aplikasi") + isi picker baris 01–03. Kelima site fold-1 tanpa chip tambahan
  (aturan B6-1). Menghapus 1 dari 4 kandidat fokus di fold.
- **HAPUS dari hero-sky: 3 komet + star-dots + 1 awan** (9 node → 4: sky, veil, grid,
  1 awan; scrim/leak ikut dikurangi bila tidak terlihat di 390px). Alasan: 11 node
  dekorasi adalah grup elemen terbesar yang competing di fold (A.2), dan 3 di antaranya
  beranimasi. Sisakan sky + grid + 1 awan cukup untuk kesan "daydream" tanpa mencuri
  fokus dari product screenshot.
- **SPASI:** mobile padT 48→64; desktop padB 80→120 (menyamai ritme Linear/Framer).
- Product screenshot + figcaption **TETAP** (kelima site menampilkan visual produk di/tepat
  setelah hero — Stripe/Supabase/Vercel/Framer; ini bukan penyebab numpuk).
- Perhatian LCP: komet/star adalah img/svg dekoratif `fetchpriority=low` — menghapusnya
  memperkecil kompetisi bandwidth awal, mendukung Perf ≥ 90.

### 3. PICKER (6 modul) — TETAP (satu-satunya daftar fitur), SPASI
- **TETAP sebagai daftar fitur tunggal homepage** — inilah "kartu koleksi" versi Olano;
  picker-redesign-plan.md menangani komposisi internalnya (P1 split ledger dkk).
- **SPASI:** pad 44/12 → **120/120** desktop, 32/4 → 96/96 mobile. Data: pad picker
  sekarang paling kecil di seluruh halaman padahal band-nya terpenting kedua setelah
  hero; Linear/Framer memakai 128/120 seragam.
- Head 2-kolom → ikut skema rail picker-redesign-plan (jangan double-handle di sini).

### 4. FITUR (6 kartu) — HAPUS dari homepage (duplikat picker), PINDAH asetnya
- **Bukti duplikasi** (mapping 1:1, dari source): Kasir offline = modul 01; QRIS statis ⊂
  modul 01 (chip "QRIS Rp40.000 → MDR 0%"); Scan tanpa barcode ⊂ 01; AI foto produk ⊂
  modul 03 Website; AI penjaga harga = modul 05; Skor kesehatan = fitur Pro di harga +
  naik-kelas. Semua kartu bahkan link ke umkm.html/ai.html/naik-kelas.html — halaman
  tujuannya SUDAH ADA, info tidak hilang, hanya berhenti ditampilkan dua kali.
- **Bukti komparasi:** tidak ada satu pun dari 5 site yang punya 2 daftar fitur paralel
  di homepage (aturan B6-2). Linear bahkan 0 grid kartu. Di Olano, picker (1.466) dan
  fitur (3.086) berdampingan = 4.277px mobile berisi satu topik yang sama.
- **Efek:** −2.657px mobile, −1.798px desktop; section terpanjang halaman hilang.
- **PINDAH aset, jangan buang:** 2 SVG inline bagus (AI penjaga harga, Skor kesehatan) →
  pindahkan ke ai.html dan naik-kelas.html (halaman tujuan kartunya sudah demikian).
  3 klausul fitur yang tidak tercakup chip picker (scan tanpa barcode, AI foto, skor
  kesehatan) → opsional dilekatkan 1 frasa ke mdesc/modul terkait ATAU dibiarkan di
  umkm.html yang sudah menampungnya (sub section fitur sekarang pun bilang: "Rincian
  tiap kemampuan ada di halaman Kasir UMKM").
- **Wajib menyertakan:** nav link `#fitur` di-retarget ke picker (id `#modul` atau
  `#alat`) — jangan tinggalkan anchor mati (A11y).
- **Opsi konservatif** (kalau SEO on-page 6 keyword fitur dirasa perlu): ganti 6 kartu
  dengan 1 paragraf index 2 baris (pola index list sections.wtf, ala Supabase hairline
  band): H2 tetap + 6 istilah sebagai teks ber-link, tinggi ~200px. Tetap jangan kartu.

### 5. ALAT (4 kalkulator) — SATUKAN jadi satu strip link (bukan 4 kartu)
- **Bukti duplikasi:** 4 kalkulator punya halaman sendiri DAN 4 link yang sama sudah ada
  di footer kolom "Kalkulator" — info tampil 3× di satu halaman (band + footer + konteks
  pajak). Vercel menaruh 25+ produk sebagai menu, bukan kartu di band (aturan B6-4/B6-5).
- **Bentuk baru:** H2 tetap ("Hitung dulu, baru bayar.") + sub + 4 item jadi baris/link
  mono inline dengan hairline pemisah (ala index list; satu baris per kalkulator di
  mobile), tinggi band ~200–260px vs 1.244px sekarang.
- **Efek:** −1.000px mobile, −500px desktop.
- **Opsi konservatif** (kalkulator = magnet SEO, mau dipertahankan sebagai kartu):
  TETAP sebagai band tapi SPASI 80/80→96/96 dan jadikan band kedua-terakhir (setelah
  pajak) — urutan cerita: produk → harga → bukti (kalkulator) → penutup.

### 6. PAJAK (3 bullet + kalkulator) — SATUKAN dengan ALAT; PILIH kalkulator, PINDAH bullet
- **Bukti:** 3 bullet aturan PP 20/2026 = isi inti pajak.html (band 1.201px mobile
  menyampaikan detail yang menurut pola kelima site hidup di halaman detail — Supabase
  3.619px total karena detail → docs; aturan B6-4). Kalkulator interaktif adalah aset
  unik ("memakai mesin pajak yang sama dengan aplikasi") — Stripe menaruh angka/bukti di
  homepage, bukan penjelasan regulasi.
- **Bentuk baru:** band pajak tinggal kalkulator + 1 baris callout + CTA "panduan
  lengkap" → pajak.html. 3 bullet dihapus dari homepage (sudah ada utuh di pajak.html).
- **Efek:** −250–400px mobile, −150–200px desktop; band turun dari 1.201 → ~700px mobile.
- Kalau opsi konservatif ALAT dipilih (kalkulator kartu tetap), maka band pajak kalkulator
  mini MALAH DIGABUNG ke band itu: satu band "angka" (kalkulator pajak + strip link 4
  kalkulator), satu band "harga". Band pajak lama dibongkar.

### 7. HARGA (2 kartu) — TETAP, SPASI
- **Catatan data jujur:** kelima site menaruh pricing di halaman terpisah dan hanya
  me-link dari nav. TAPI untuk audiens UMKM, kartu "Rp0 / Rp50rb" di homepage adalah
  penghapus keraguan (trust) yang tidak dibutuhkan pembeli Stripe. Keputusan struktur:
  **TETAP** 2 kartu (info ini tidak diduplikasi di band lain; satu-satunya tempat harga
  di homepage).
- **SPASI:** 80/80 → 120/120 desktop (ritme).
- SATUKAN dengan CTA penutup (lihat #8): kartu Pro sudah punya CTA; kicker+H2 cta2
  dipindah jadi 1 baris penutup di bawah grid harga, atau sebaliknya — pilih satu lokasi
  CTA akhir.

### 8. CTA PENUTUP (cta2) — SATUKAN ke HARGA (atau gandeng Linear-style prefooter)
- **Bukti duplikasi:** CTA "Coba kasir gratis" muncul 5× di satu halaman (nav, hero,
  kartu Gratis, kartu Pro, cta2). Linear menyelesaikan halaman dengan prefooter 228px
  (1 H2 + 1 CTA); Olano mengulang 467px setelah 2 CTA pricing.
- **Bentuk:** hapus cta2 sebagai band; kicker "Mulai sekarang" + H2 "Mulai jualan lebih
  rapi hari ini." + sub jadi blok penutup band harga (1 baris + 1 CTA di bawah grid),
  ATAU keep prefooter mungil (~230px) dan hapus tombol CTA di kartu Gratis (tinggal 1
  CTA utama + 1 CTA Pro). Jangan keduanya.
- **Efek:** −237…−467px mobile.

### 9. FOOTER — TETAP (malah jadi rumah baru bagian yang dipindah)
691px mobile / 447 desktop, 14 link — jauh lebih ringan dari standar besar (42–103
link). Kalau FITUR/ALAT dibongkar, pastikan footer tetap memuat: 4 kalkulator (sudah),
6 modul (sudah via kolom Produk), umkm.html/naik-kelas.html (sudah). Tidak ada perubahan
perlu kecuali menambah link umkm.html bila dirasa perlu.

### C.tamb Struktur band hasil rekomendasi

| Sekarang (9 band) | Usulan (6 band) |
|---|---|
| hero (berat dekorasi + pill) | hero (bersih, 1 pesan + produk) |
| picker 6 modul | picker 6 modul (rail sticky) |
| fitur 6 kartu ← duplikat | ~~dihapus~~ (aset pindah ke halaman modul) |
| alat 4 kartu | strip link kalkulator (1 band "alat") |
| pajak 3 bullet + kalkulator | kalkulator pajak + callout (band "angka") |
| harga 2 kartu | harga 2 kartu + penutup CTA (satukan cta2) |
| cta2 ← duplikat CTA | ~~disatukan~~ |
| footer | footer |

### C.tamb Estimasi scrollHeight setelah dirapikan

Mobile 390:
- 10.626 − fitur 2.657 − alat 1.000 (1.244→~244) − pajak 300 (bullet+pad) − cta2 467
- tambahan padding ritme (hero +16, picker +160, harga +120, alat/pajak +96) ≈ +390
- **≈ 6.540px (−38%)** — dengan opsi konservatif (alat tetap kartu, cta2 jadi prefooter
  230px): **≈ 7.900px (−26%)**.

Desktop 1440:
- 7.848 − fitur 1.798 − alat 500 − pajak 180 − cta2 447 + padding ritme ≈ +480
- **≈ 5.400px (−31%)** — opsi konservatif: **≈ 6.300px (−20%)**.

Hasil: 12,6 → ~7,8 layar mobile; 8,7 → ~6 layar desktop. Semua band berpad 96–128,
satu daftar fitur, satu lokasi CTA per konteks, anchor nav diperbarui.

### C.tamb Yang TIDAK boleh disentuh saat implementasi
1. Copy semua section yang dipertahankan (rewrite baru saja dilakukan; plan ini hanya
   memindah container).
2. `picker-redesign-plan.md` — spec kolom/sticky/chip picker tetap sumber kebenaran untuk
   band picker; plan ini hanya menambah padding ritmenya.
3. CLS: semua perubahan = menghapus DOM statis + mengubah padding via CSS — tidak ada
   konten late-load, tidak ada perubahan font/ukuran gambar; jangan menambah `<img>`
   baru tanpa width/height eksplisit saat memindahkan SVG ke halaman modul.
4. A11y: nav `#fitur` wajib di-retarget (anchor hilang = Temuan lighthouse
   "broken anchor" + pembaca layar kebingungan); heading order tetap h1→h2→h3;
   kalkulator pajak tetap `aria-live="polite"`.
5. Perf: penghapusan node dekoratif hero justru mengurangi beban awal; jangan ganti
   dengan animasi/apapun. LCP tetap product screenshot.
6. `sw.js`/manifest/preload tidak berubah (tidak ada aset baru; aset yang hilang dari
   index boleh tetap di-cache untuk halaman modul).

### Acceptance check (untuk eksekutor)
- [ ] Tidak ada dua daftar berisi topik sama di homepage (grep: `feat-grid2` habis dari
  index.html; aset SVG pindah utuh ke ai.html/naik-kelas.html).
- [ ] CTA "Coba kasir gratis" ≤ 2 di seluruh halaman (1 utama + 1 pricing).
- [ ] Pad antar band desktop seragam 120±8px; mobile ≥ 96.
- [ ] Nav 4 link tanpa anchor mati; semua `href="#"...` resolve ke id yang ada.
- [ ] Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, CLS < 0.1 (harus membaik: DOM −25%,
  3 img dekoratif kuran).
- [ ] scrollHeight final mobile ≤ ~8.000px / desktop ≤ ~6.500px (opsi konservatif) —
  ukur ulang dengan skrip CDP yang sama.
