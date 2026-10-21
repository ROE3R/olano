# DESIGN.md — Olano Premium (v2 arah desain)

Disusun 2026-10-19 setelah owner instruction: "rombak semua, banyak salah kaprah,
tidak sesuai, pelajari semua contoh, UI harus lebih mewah, homepage masih terasa
biasa aja. Standar: designer Porsche/Apple enterprise B2B. Skill antislop semua
dipakai (core + ui + copywriting + human + layoutmobile)."

Dua contoh baru = **acuan ISI jasa, BUKAN desain** (instruksi owner 2026-10-19):
- pajakumkm.id/jasa-perpajakan-umkm -> struktur jasa pajak per tier omzet + jasa SPT/konsultasi
- booster.delivery/id -> struktur jasa delivery (persona, 6 scope kerja, 3 tahap, pricing 10% omzet, CTA zero-friction)
Desain tetap dari 6 referensi lama (sokudo/daydream/oyenza/open-design/designeer/bencho)
+ upgrade energi ke standar luxury enterprise di bawah.

## 1. Posisi produk (perbaikan salah kaprah utama)

Olano **bukan aplikasi kasir**. Olano = platform semua kebutuhan usaha mikro/kecil:
menjual (kasir+QRIS), menghitung (pajak, HPP, margin), menjaga (AI margin, stok),
menjangkau (website, delivery), dan dikerjakan tim kami (jasa pajak, jasa delivery,
jasa website). Kalimat pemegang identitas:

> "Semua kebutuhan usahamu. Satu tempat."

Setiap keputusan copy/layout harus menguji: apakah halaman ini dibaca sebagai
PLATFORM, bukan sebagai "aplikasi kasir yang kebetulan punya fitur lain"?

## 2. Design Read (dial, diikat sampai halaman terakhir)

Reading this as: B2B SaaS platform UMKM premium, untuk owner usaha + tim Olano,
bahasa visual = enterprise luxury (Porsche/Apple keynote), dial **ENERGY 2 / RHYTHM 3 / MOTION 2**.

- ENERGY 2 (Stripe/Vercel, bukan Awwwards): percaya diri, kontras tinggi, bukan heboh.
- RHYTHM 3: setiap section komposisi berbeda (split, editorial list, band gelap, statistik)
  sesuai konten; tidak ada 2 section berurutan dengan pola yang sama.
- MOTION 2: reveal-on-scroll subtle (opacity+8px, 450ms) + state-change (kalkulator live,
  count-up pajak sekali). Tanpa loop tanpa alasan. Anggaran keras dari spec v2:
  maks 2 keyframe per halaman, transisi 150-220ms, hover-lift kartu = 0.
- reduced-motion: semua reveal off, konten tetap tampil penuh.

## 3. Sistem token (mewah = monokrom kontras + satu aksen)

### Palet (2 core + 1 aksen, R-29)
| Token | Nilai | Peran |
|---|---|---|
| ink | #0B1220 | teks utama di light; |
| ink-deep | #060A14 | band gelap (hero/CTA penutup), latar "keynote" |
| white | #FFFFFF | |
| gray-25..700 | #FAFBFD #F4F6FA #E8ECF3 #C3CBD9 #6B7489 #343C4F | surface/tekstur/teks |
| accent | #2453EB (blue-600) | SATU aksen, hanya di momen penting: CTA primer, angka hasil kalkulator, satu kata aksen di headline |

Alasan (R-31): aksen biru = identitas Olano yang sudah berjalan (config, app, PWA);
monokrom ink/white = bahasa Porsche/Apple (kontras tinggi, tenang); aksen dipakai
sparing (1 CTA per layar, 1 angka highlight per band) supaya tiap kemunculannya berarti.

### Tipografi (Alasan: 1 keluarga = disiplin luxury, dari ukur ref B thedaydream)
- Keluarga tunggal: **Aspekta** (450/500/600 + range 650-800 utk display), self-host woff2 sudah ada.
- Aksen kursif: **Instrument Serif italic**, 1 kata per headline (from ref B, signature;
  alasan: memberi "napas" mewah pada headline monokrom).
- Skala display (upgrade dari ukur: luxury = headline lebih besar dari H1 48px ref A):
  - H1 hero: clamp(40px -> 84px), w650, ls -0.04em, lh 1.02 (di 84px w650, 1-2 baris)
  - H2 section: clamp(28px -> 44px), w600, ls -0.02em
  - Eyebrow: mono/Aspekta 11px uppercase ls 0.14em, color gray-500
  - Body: 16px/1.6 w450; lede 18-20px
- Angka besar (stat, hasil kalkulator): Aspekta w700 tabular-nums, 40-56px.

### Bentuk & ruang
- Kartu: radius 16, border 1px hairline (gray-100 di light / white/12 di band gelap), TANPA shadow (ref A ukur: 2.5% saja).
- Visual/gambar: radius 14, 1px border.
- Tombol: pill, h48 desktop / 44 min mobile (tap 44px), 1px border; CTA primer = solid blue + glow kecil 0 8px 24px blue/30 (1 per layar, alasan: fokus aksi).
- Section padding: 96/96 desktop, 64/64 mobile; band gelap padding 112/64.
- Container 1180px, gutter 24.

### Band gelap (alat "keynote")
Dipakai maksimal 2x per halaman (hero + penutup): latar ink-deep, teks white/gray-300,
aksen blue, hairline white/12. Alasan (R-01): kontras dramatis = kemewahan; hanya di
momen naratif (pembuka, penutup), bukan sembarangan.

## 4. Peta konten homepage (RHYTHM 3, konten-driving, C-3)

| # | Section | Komposisi | Konten |
|---|---|---|---|
| 1 | HERO (gelap) | split 7/5: kiri statement 2 baris + sub + 1 CTA + mikro trust; kanan = 3 panel modul (kasir/QRIS/pajak) hairline | "Semua kebutuhan usahamu. Satu tempat." CTA: "Coba Olano gratis" -> app demo. Mikro: "Gratis mulai · QRIS · PPh final 0,5% otomatis" (angka dari config) |
| 2 | KEMAMPUAN (light) | editorial: 1 flagship (Kasir, 2 kolom text+visual) + grid 2x2 modul lain (Pajak, Website, Analisa Delivery, AI) + 1 baris Automation (coming soon, label jujur) | setiap modul: 1 kalimat konkret + contoh angka jujur dari mchip deck v31 |
| 3 | PAJAX (light, kalkulator) | split 5/7: kiri 3 aturan 2026 pendek + tier omzet (dari isi pajakumkm: Mikro s.d 4,8M / Kecil 4,8-10M / Menengah 10-20M, PPh final 0,5% + bebas OP 500jt); kanan kalkulator live (mesin config.js, count-up sekali) | CTA: "Lihat panduan lengkap" |
| 4 | DELIVERY (band gelap #2) | kiri: "Laba bersih di GoFood & GrabFood, bukan tebakan." + 6 scope dari booster (rating, promo, menu/harga, profil, tim, analytics) 2 kolom hairline; kanan: 3 tahap cara kerja + pricing transparan (10% omzet, tanpa biaya di depan - angka dari config/penawaran Olano yang ada di halaman analisa-delivery; JANGAN ngarang selain yang sudah di situs) | CTA zero-friction: "Periksa listingmu gratis" -> analisa-delivery.html#kelola / kalkulator margin |
| 5 | AI (light) | split: kiri copy "Bahan naik 10%. Harganya sudah terurus." + contoh skenario (HPP +10% -> 3 usul harga, angka dari HppScene); kanan: panel demo live kalau `OLANO_CONFIG.ai.apiKey` terisi, kalau kosong state "Menunggu terhubung" (honest, R-27) | pemilik: slot api key di config |
| 6 | HARGA (light, ritme rapat ala open-design) | 2 kartu (Gratis / Pro 50rb/outlet/bln) + band jasa 3 kartu (Pajak 600rb+/bln, Delivery Boost 10% omzet, Website Custom 500rb+) + 1 CTA WA | tidak ada 3 kolom; highlight Pro karena paket utama (alasan: produk inti) |
| 7 | CTA PENUTUP (gelap) | statement 1 baris + 1 CTA | "Mulai hari ini. Gratis." |

Nav: [Produk ▾ (6 modul), Jasa ▾ (3 jasa), Kalkulator ▾, Harga] + [Masuk] [Coba Olano gratis].
Semua link hidup (R-24) ke halaman yang ada; Automation = chip "Segera hadir" (R-26 honest).

Footer: 3 kolom (Produk / Kalkulator / Perusahaan) + disclaimer pajak + © 2026.

## 5. Peta konten jasa (dari 2 contoh, ISI)

Jasa Pajak (pajakumkm.id):
- Tier omzet: Mikro (s.d Rp4,8M/tahun) / Kecil (4,8-10M) / Menengah (10-20M) -> layanan pajak+pembukuan per tier
- Jasa: lapor SPT, konsultasi bulanan, pajak OP profesional
- Harga Olano (sudah di situs, pakai ini): mulai Rp600rb/bln, paket lengkap 1.329.000 selesai 3 hari
Delivery Boost (booster.delivery):
- 6 scope: rating & review, promo & ads, menu & harga, profil toko, tim (training), analytics/laporan
- 3 tahap: periksa -> rencana -> iterasi mingguan
- Persona: owner, GM, marketing, ghost kitchen
- Pricing: 10% omzet, tanpa di depan (sama dengan yang sudah dipajang Olano)
- CTA: periksa listing gratis (zero login/payment)
AI (slot owner, menyusul api key):
- Use case sudah ada di situs: usul harga saat bahan naik, foto produk, tanya AI (quota 300 msg/bln, ceiling Rp12,5rb/outlet/bln dari config)

## 6. Aturan copy (antislop-copywriting, mengikat)

- Bahasa Indonesia, tegas, B2B premium. Tanpa buzzword (seamless, revolusioner, cutting-edge,
  "AI-powered" sebagai decak). Angka hanya yang ada di config.js/situs (R-17/R-36/R-38).
- Tanpa em dash (R-02). CTA spesifik (R-15): "Coba Olano gratis", "Periksa listingmu gratis",
  "Hitung pajakmu" (bukan "Get Started"/"Learn More").
- Testimoni: pemilik memutuskan tampil tanpa label CONTOH (18 Okt) -> tetap render dari
  config.testimonials, jangan tambah angka/klaim baru.
- Satu aktor per kalimat; hindari rule-of-three buatan.

## 7. Human/layout (antislop-human + layoutmobile, mengikat)

- Kontras AA: teks normal 4.5:1, besar 3:1. Di band gelap: white/gray-300 on ink-deep OK;
  teks gray-500 DILARANG di band gelap (pakai #C3CBD9+).
- Keyboard: semua interaksi (dropdown nav, filter modul, accordion, kalkulator) reachable
  Tab/Enter/Escape, focus-visible hairline 2px blue (di band gelap: white).
- Mobile 390: nav burger self-scrolling (fix v39 tetap), tap 44px, overflow-x 0,
  grid editorial collapse ke 1 kolom dengan urutan konten benar, zoom 200% tidak clip.
- State: kalkulator (empty/loading/error sudah ada), panel AI (menunggu key = empty state
  bernama + aksi "Tanya tim kami"), list jasa semua link hidup.

## 8. Kinerja (tetap dari spec lama, tidak boleh regression)

Lighthouse mobile: Perf >= 90, A11y 100, CLS < 0.05, LCP <= 2.5s. Band gelap = CSS hanya
(tanpa foto berat); panel modul hero pakai aset webp yang sudah ada (f-kasir/f-qris/produk-struk).

## 9. Checklist delivery (sebelum ship)

Delivery Gate antislop (4 blok) + checklist UI/Copy/Human/Layout semua YA; verifikasi
Playwright 1440 & 390: overflow 0, reveal ngejalan, 0 console error, semua link hidup,
kalkulator benar, kontras spot-check band gelap.

---

# 10. Bahasa visual aplikasi (v3, acuan: Payer)

Sumber arah: screenshot Payer (SaaS finance, 2026-10-21) — owner: "jadikan ini design md,
olano bakal jadi SaaS bisnis lengkap, perbaiki sampai dashboard dll".

## 10.1 Kenapa Payer, dan apa yang TIDAK diambil

Yang diambil: **struktur produk-nya**, bukan brand-nya. Payer memakai pola yang sudah
terbukti untuk SaaS finansial: satu angka besar (saldo/omzet) → dua baris arus masuk-keluar
→ kartu target dengan tab → grafik batang → kartu fitur dengan mockup UI asli di dalamnya.
Pola itu yang dipakai untuk dashboard Olano.

Yang **tidak** diambil (R-30, jangan klon): logo, nama, maskot, foto tangan memegang ponsel,
dan deretan logo klien palsu (Slack/Netflix/Coinbase/Airbnb/Stripe di bawah "Trusted by
6,500 companies" — itu klaim tanpa bukti, R-36/R-17). Olano tidak punya 6.500 pelanggan,
jadi tidak ada baris logo. Tidak ada juga badge "12K+" atau "Secure Payment" yang tidak
bisa dibuktikan.

## 10.2 Token tambahan (dari ukur warna screenshot)

| Token | Nilai | Peran | Alasan (R-31) |
|---|---|---|---|
| `--surface` | `#F6F7F9` | latar aplikasi (bukan putih) | memisahkan shell dari kartu putih tanpa butuh shadow |
| `--accent-warm` | `#FF9705` | **satu** seri data: batang "hari ini" di grafik + satu kata highlight | pembeda series tanpa menambah warna palet; dipakai maks 2 tempat per layar |
| `--ok` | `#1B9E5A` | angka naik, status aman | kontras 4.6:1 di putih |
| `--warn` | `#B26B00` | stok menipis, di atas ambang | kontras 4.5:1 |
| `--danger` | `#C0392B` | angka turun, hapus | kontras 4.7:1 |

Palet inti tetap 2 + 1 aksen (R-29): ink `#0B1220`, putih, biru `#2453EB`.
Warm dan status **bukan** warna brand — hanya penanda data. Kalau dipakai di luar grafik
atau status, itu penyimpangan.

Alasan biru Olano dipertahankan meski Payer `#2756E2`: selisih ΔE < 2, dan biru lama sudah
hidup di PWA ikon, manifest, dan seluruh halaman marketing. Ganti biru = ganti identitas
tanpa alasan.

## 10.3 Bentuk (beda dari halaman marketing)

- **Kartu**: radius 14, border 1px `--gray-100`, **tanpa shadow** di light. Di atas `--surface`
  kartu putih terbaca tanpa bayangan; shadow hanya di sheet/dialog (elevasi nyata).
- **Tombol**: pill (sama dengan marketing), h44 mobile / h40 di dalam tabel.
- **Baris data**: tinggi 52, hairline bawah, angka rata kanan `tabular-nums`.
- **Grafik batang**: lebar batang 28-40, radius atas 6, gap 8-14; batang hari ini `--accent-warm`,
  sisanya `--blue-600` pada 28% opacity + garis dasar `--gray-100`. Tidak ada gridline vertikal.
- **Navigasi kiri**: lebar 248 desktop, rail 64 pada ≤1080, sheet bawah pada ≤760.
  Item aktif = latar `--blue-50` + teks `--blue-700` + bar 2px di kiri. Bukan pill.

## 10.4 Shell aplikasi (RHYTHM 2 / MOTION 1)

```
┌────────────┬──────────────────────────────────────────────┐
│ brand      │ topbar: judul halaman · toko · [cari] [akun] │
│ ─────────  ├──────────────────────────────────────────────┤
│ Ringkasan  │  konten halaman (max 1180, gutter 24)        │
│ Kasir      │                                              │
│ Produk     │                                              │
│ Transaksi  │                                              │
│ Pajak      │                                              │
│ Pengaturan │                                              │
└────────────┴──────────────────────────────────────────────┘
```

- MOTION turun dari 2 ke **1**: aplikasi dipakai puluhan kali sehari, jadi hanya hover/focus
  state dan transisi 150ms. Reveal-on-scroll dimatikan di dalam shell (alasan sama dengan
  catatan `slide-confirm`: performa bukan tempatnya di alat kerja).
- Setiap halaman wajib punya **empty state bernama** (R-27) dan **error state** kalau
  penyimpanan gagal; bukan tabel kosong tanpa penjelasan.

## 10.5 Peta halaman dashboard

| # | Blok | Isi | Sumber angka |
|---|---|---|---|
| 1 | Saldo/Omzet hari ini | angka besar + delta vs kemarin + label "hari ini" | `sales` IndexedDB difilter `startOfDay` |
| 2 | Arus | Omzet hari ini, Transaksi hari ini, Rata-rata per transaksi | agregasi `sales` |
| 3 | Target | kartu target bulanan: progres, sisa, status on-track | target disimpan di `olano-settings` (default 10 juta) |
| 4 | Grafik 7 hari | 7 batang, hari ini warm | `daySeries(7)` |
| 5 | Produk terlaris | 5 baris: nama, qty, omzet | `topProducts(5)` |
| 6 | Stok menipis | ≤3 stok, tautan ke Produk | `lowStock(3)` |
| 7 | Transaksi terakhir | 5 baris: waktu, item, metode, total | `sales` sortir desc |

## 10.6 Halaman lain (semua fungsional, bukan mockup)

- **Kasir** (sudah ada): POS offline, keranjang, QRIS, struk, sinkron.
- **Produk**: tabel CRUD (tambah/edit/hapus), filter kategori, cari, indikator stok.
- **Transaksi**: daftar penjualan, filter 7/30 hari, cari, ekspor CSV, ringkasan.
- **Pajak**: PPh final 0,5% dihitung dari omzet nyata per bulan + proyeksi tahunan,
  memakai `OLANO_CONFIG.tax` (bukan hardcode).
- **Pengaturan**: nama toko, target bulanan, tarif PPh, ekspor/impor cadangan JSON, reset.

## 10.7 Aturan copy di dalam aplikasi

- Bahasa Indonesia, sapaan "Anda", angka pakai `Rp` + pemisah titik (helper `OLANO.rp`).
- Tanpa em dash (R-02). Tanpa "seamless/powerful".
- Label tombol menyebut aksinya: "Tambah produk", "Ekspor CSV", "Simpan pengaturan".
- Angka kosong ditulis "Belum ada transaksi", bukan "0" yang menyamar jadi data.


---

# 11. Homepage v50 (rombak total dari v41)

Alasan rombak: v41 menjual "kasir gratis" padahal produknya sekarang aplikasi enam
halaman. Pengunjung melihat janji kasir, padahal yang dibangun adalah dashboard,
stok, transaksi, dan pajak. Homepage harus menjual hal yang benar.

## 11.1 Perubahan struktur

| v41 | v50 | Alasan |
|---|---|---|
| hero "Kasir gratis yang tetap jalan saat internet mati" | hero "Satu aplikasi untuk kasir, stok, dan pajak" | posisi produk berubah, judul harus ikut |
| hero kanan = mockup ponsel (gambar) | hero = tangkapan layar dashboard asli dalam bingkai | bukti pertama harus produknya, bukan ilustrasi |
| 6 modul dalam index bernomor | 4 baris pekerjaan editorial | pekerjaan lebih mudah dipahami daripada daftar modul |
| section "Bukan janji" berisi kartu produk | dua panel split dengan screenshot Produk dan Pajak | screenshot menjawab "isinya apa" tanpa perlu dibayangkan |
| harga 2 kartu + band jasa 3 kartu | 2 kartu sejajar + 4 baris jasa padat | band jasa 3 kartu terlalu ramai untuk 4 layanan |
| navbar 6 item dengan dropdown | 5 tautan datar + dua tombol aksi | dropdown menambah klik tanpa menambah info |

## 11.2 Yang dipertahankan

- Tipografi: Aspekta + Instrument Serif italic untuk satu kata per headline.
- Palet: biru `#2453EB` sebagai satu-satunya aksen; netral gray-25..700.
- Ritme section: hero terang, strip fakta abu, section putih, section tint, putih,
  tint, penutup gelap. Tidak ada dua section berturut-turut dengan latar sama.
- Aturan copy: tanpa em dash, tanpa buzzword, CTA menyebut aksinya.

## 11.3 Bukti di halaman

Semua gambar adalah tangkapan layar aplikasi (`assets/img/app/*.webp`, dibuat dari
`app/dashboard.html`, `produk.html`, `pajak.html` dengan data contoh). Tidak ada
ilustrasi 3D, tidak ada foto stok, tidak ada logo klien.

Angka di halaman hanya tiga jenis:
1. dari `OLANO_CONFIG` (harga Pro, masa coba),
2. dari aturan pajak yang dipakai aplikasi (0,5%, PP 20/2026),
3. dari jumlah halaman yang benar-benar ada (6).

Tidak ada "10.000 pengguna" atau "99,9% uptime" karena tidak ada sumbernya.

## 11.4 Ukuran

- 7 section, tinggi total 6309 px di 1440 (layar 1000px: ~6,3 layar).
- 20 tautan footer, 48 tautan total, semuanya menunjuk berkas yang ada.
- Mobile 390: tanpa overflow, semua target sentuh >= 44px.
