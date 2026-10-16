PRD.md
0. Meta Dokumen
Item	Isi
Produk	web3min (nama kerja)
Versi	PRD v2.0 — Full Release (semua fitur rilis bersamaan)
Status	Siap dieksekusi oleh AI agent
Bahasa UI	Bahasa Indonesia (id-ID)
Dokumen pendamping	DESIGN.md


Instruksi untuk AI agent:

Baca PRD.md, lalu DESIGN.md.
Semua fitur di §5 wajib selesai dalam satu rilis, tanpa fase atau MVP parsial.
Kerjakan secara paralel sesuai jalur di §16.
Kalau ada konflik, PRD menang untuk perilaku produk dan DESIGN menang untuk tampilan.
Angka pajak, tarif MDR, kuota, dan harga disimpan sebagai config berversi, tidak boleh hardcode.
Kalau ada hal yang belum diputuskan, pakai nilai di §17 tanpa berhenti untuk bertanya.
1. Ringkasan Produk
Ini aplikasi web (PWA) all-in-one untuk UMKM Indonesia. Isinya kasir offline, QRIS statis, website toko dari 50 template, AI untuk harga, foto produk, dan tanya-jawab, skor kesehatan bisnis, scan produk tanpa barcode, rekap pajak bulanan, dan Mode Naik Kelas untuk usaha yang sedang tumbuh.

Positioning: "Kasir, website, dan pajak usahamu — beres di satu tempat. Tetap jalan walau internet mati."

2. Masalah dan Peluang
UMKM pakai banyak alat yang terpisah: kasir, katalog WhatsApp, buku catatan, pajak dikerjakan belakangan.
Internet tidak stabil, sehingga kasir yang wajib online gagal tepat saat ramai pembeli.
Pemilik usaha tidak tahu harga jualnya masih untung setelah bahan baku naik.
Status pajak membingungkan, terutama setelah PP 20/2026.
QRIS sudah dipakai secara massal. Sampai Juni 2026 ada 65,77 juta pengguna dan 44,86 juta merchant, 96,68% di antaranya UMKM.

3. Strategi Bisnis: Pancingan + Reverse Thinking



LAPIS 1 — PANCINGAN (volume)
POS offline + QRIS gratis → viral, adopsi massal
        ↓
LAPIS 2 — LANGGANAN (retensi)
Pro Rp50rb/bulan per outlet → AI, website, skor, rekap pajak
        ↓
LAPIS 3 — NAIK KELAS (reverse thinking, MRR tinggi)
Data usaha memicu kebutuhan layanan bernilai tinggi:
  • Rekap & konsultasi pajak (termasuk skema umum PT/CV)
  • Website custom premium
  • Multi-outlet → MRR naik otomatis per outlet
Prinsip reverse thinking:

Rancang produk seolah-olah untuk bisnis besar (multi-outlet, peran staf, audit, ekspor akuntan), lalu kemas sesederhana mungkin untuk warung.
Hasilnya: UMKM kecil masuk dengan mudah, dan saat mereka tumbuh tidak perlu pindah aplikasi.
Pendapatan bertambah dari layanan dan jumlah outlet, bukan dari kenaikan harga.
Sumber pendapatan:

Utama: layanan pajak dan website custom.
Pendukung: langganan Pro per outlet.
Pemicu upsell otomatis (dari data):

Jenis WP PT/CV
Omzet ≥ 80% dari Rp500jt atau Rp4,8M
Outlet kedua ditambahkan
Website aktif lebih dari 30 hari dengan trafik naik
Skor pajak rendah
4. Persona
Persona	Konteks	Kebutuhan	Fitur kunci
Bu Sari, warung makan	Android, sinyal naik-turun	Kasir cepat, QRIS, tahu untung	POS offline, QRIS, AI harga
Dimas, toko fashion	Offline + Instagram	Foto bagus, website	AI foto, template website
Rina, affiliate	Banyak link produk	Link-in-bio rapi	Template affiliate, AI image
Pak Hendra, CV 3 cabang	Bingung pajak, butuh kontrol cabang	Kepastian pajak, laporan per outlet	Naik Kelas, konsultasi pajak


5. Scope v1.0 (semua wajib)
Dibangun sekarang:

POS offline (PWA)
QRIS statis
Scan produk tanpa barcode
50 template website yang bisa diedit
AI generate dan edit foto produk
AI saran harga dan monitor bahan baku
Skor kesehatan bisnis + saran AI
AI tanya-jawab
Rekap pajak bulanan
Laporan via email
CTA layanan WhatsApp
Billing
Admin console
Situs marketing SEO-first + 3 alat gratis
Mode Naik Kelas (multi-outlet, peran staf, tutup shift, ekspor akuntan, akses admin pajak)
Tidak dibangun:

Scraping Shopee/TikTok untuk affiliate
Laporan via WhatsApp
Jasa foto produk
QRIS dinamis atau integrasi PJP
Integrasi langsung Coretax
Aplikasi native
Payroll
API publik
6. Paket dan Harga
Paket	Harga	Isi
Gratis	Rp0	POS offline, QRIS statis, 1 outlet, maks. 50 produk, ringkasan harian via email
Pro	Rp50.000/bulan per outlet	Semua fitur, produk tanpa batas, Mode Naik Kelas, kuota AI
Layanan	Penawaran via WhatsApp	Rekap/konsultasi pajak bulanan, website custom


Trial Pro 14 hari tanpa kartu.
Kuota AI per outlet per bulan (config): 60 operasi foto, 300 pesan Tanya AI, saran harga tanpa batas wajar.
Target biaya AI ≤ Rp12.500 per outlet per bulan, dengan metering wajib.
7. Arsitektur Informasi



Marketing (publik, SEO)
/                 Homepage — pemilih: UMKM | Pajak (+ link Website)
/umkm             Halaman UMKM
/pajak            Halaman pajak
/website          Halaman website (template + custom via WA)
/naik-kelas       Untuk usaha multi-outlet / PT-CV
/template, /template/[slug]
/harga
/alat/kalkulator-pph-final-umkm
/alat/kalkulator-hpp-harga-jual
/alat/kalkulator-biaya-qris
/blog, /blog/[slug], /tentang, /kebijakan-privasi, /syarat-ketentuan

App (login, noindex)
/app/kasir  /app/produk  /app/laporan  /app/skor  /app/harga-bahan
/app/tanya  /app/pajak   /app/website  /app/outlet  /app/staf
/app/shift  /app/pengaturan

Tenant site: {slug}.web3min.id (custom domain = layanan)
8. Spesifikasi Fitur
F1 — Onboarding (transaksi pertama ≤ 3 menit)
Alurnya:

Daftar dengan Google atau magic link email. Email wajib, karena semua laporan dikirim ke sana.
Isi nama usaha dan kategori.
Pilih jenis WP: OP, PT Perorangan, Koperasi, PT, CV/Firma, atau Belum tahu.
Unggah QRIS.
Tambah 3 produk.
Lakukan transaksi uji.
Semua langkah bisa dilewati kecuali email. Pilihan "Belum tahu" memicu kartu edukasi + CTA konsultasi pajak.

F2 — POS Offline
App shell dan katalog di-cache, sehingga POS 100% bisa dipakai offline setelah login pertama.
Transaksi disimpan di IndexedDB dengan client_uuid (ULID) sebagai idempotency key. Sync memakai pola outbox dengan backoff, tanpa duplikasi.
Stok dihitung sebagai ledger event append-only, supaya multi-perangkat dan multi-outlet aman.
Indikator status: Online, Offline (n menunggu), atau Menyinkron.
Metode bayar Tunai (dengan kembalian), QRIS, Transfer, Lainnya. Ada diskon item/transaksi, catatan, dan void dengan alasan (tercatat di audit).
Pencarian kurang dari 100 ms untuk 2.000 produk. Cetak ESC/POS via Web Bluetooth (Chrome Android). Di iOS fallback ke berbagi gambar struk.
Edge cases:
Selisih jam perangkat lebih dari 5 menit: peringatan.
Penyimpanan 80%: peringatan.
Logout dengan antrian: diblokir.
F3 — QRIS Statis
Alur:

Unggah QRIS dari PJP.
Sistem decode EMVCo + validasi CRC16, lalu pengguna mengonfirmasi nama merchant.
QR dirender ulang tajam di POS, dengan nominal besar di samping.
Kasir menekan "Sudah dibayar" setelah cek notifikasi PJP.
UI harus jelas menyatakan bahwa konfirmasi dilakukan manual. Feature flag qris_amount_injection OFF.

Laporan menampilkan estimasi biaya MDR sesuai kategori merchant (config berversi):

Kategori	Nominal	MDR
Usaha Mikro	≤ Rp500.000	0%
Usaha Mikro	> Rp500.000	0,3%
Usaha Kecil/Menengah/Besar	≤ Rp100.000	0%
Usaha Kecil/Menengah/Besar	> Rp100.000	0,7%


Tarif ini berlaku sejak 1 Oktober 2026. MDR ditanggung merchant dan tidak boleh dibebankan ke konsumen.

F4 — Scan Produk Tanpa Barcode
Kamera menampilkan 3 kandidat teratas, kasir tap untuk menambah ke keranjang.
Model embedding gambar ringan dijalankan di perangkat (ONNX Runtime Web), dengan pencarian kNN ke embedding katalog lokal. Fitur ini jalan offline.
Setiap produk butuh 1–5 foto, termasuk foto hasil F6.
Target: akurasi top-3 ≥ 90% (katalog uji 100 produk), latensi ≤ 500 ms di Android kelas menengah. Kalau kemiripan rendah, beralih ke pencarian teks.
F5 — Website Builder (50 Template)
50 = 10 keluarga layout × 5 varian industri/tema. Keluarga layout: Katalog, Menu Resto, Landing Produk Tunggal, Link-in-bio (affiliate), Jasa/Booking, Portofolio, Toko Grid, Promo/Event, Profil Usaha, Cerita Brand.
Editor blok berbasis skema JSON: hero, produk, galeri, testimoni, peta, jam buka, FAQ, tombol WhatsApp toko. Pengguna bisa mengubah teks, foto, warna aksen, font kurasi, urutan, dan visibilitas blok.
Produk tersinkron dari POS (harga, stok habis). Multi-outlet bisa menampilkan daftar cabang.
Render memakai SSG/ISR. Meta, OG, dan schema LocalBusiness/Product dibuat otomatis. Lighthouse SEO ≥ 95.
Banner upsell "Website custom / domain sendiri" mengarah ke WhatsApp admin.
F6 — AI Foto Produk
Fungsinya: hapus latar, ganti latar (studio putih, marmer, kayu, gradasi biru), perbaiki cahaya, dan generate foto gaya katalog.

Output: thumbnail POS 1:1 512 px WebP, aset website 4:5 dan 16:9.
Kuota terlihat, foto asli disimpan, dan proses bisa di-undo.
Prompt sistem: "jangan ubah bentuk produk".
F7 — AI Saran Harga dan Monitor Bahan Baku
Resep/BOM menghitung HPP otomatis.
Saran harga memberi 3 opsi (Aman, Kompetitif, Premium) beserta alasan dalam bahasa sederhana.
Sumber harga bahan:
Harga beli yang dicatat pengguna (sumber utama).
Panel harga pangan pemerintah (kandidat: PIHPS BI, Panel Harga Badan Pangan). Agent memverifikasi akses data sebelum integrasi.
Alert via email: bahan naik ≥ 10% (config) atau margin di bawah target, maksimal 1 email per hari.
F8 — Skor Kesehatan Bisnis (0–100)
Komponen	Bobot	Metrik
Profitabilitas	25	Margin kotor vs target
Tren penjualan	20	4 minggu terakhir vs sebelumnya
Arus kas	20	Pemasukan – pengeluaran
Kesehatan stok	15	% stok mati >30 hari, stockout
Konsistensi pencatatan	10	Hari aktif per 30 hari
Kesiapan pajak	10	Jenis WP, rekap lengkap, posisi ambang


Grade: 80+ Sehat, 60–79 Cukup, 40–59 Perlu perhatian, di bawah 40 Kritis.
Dihitung ulang tiap malam, tersedia per outlet dan gabungan.
AI memberi maksimal 3 saran dengan tombol aksi.
Data kurang dari 14 hari: tampil sebagai "Skor sementara".
F9 — AI Tanya-Jawab
Pertanyaan tentang data sendiri dijawab lewat tool calling ke query yang sudah ditentukan dan dibatasi tenant_id/outlet_id. Dilarang membuat SQL bebas.
Pertanyaan bisnis dan pajak umum dijawab dari RAG knowledge base kurasi, dengan sumber.
Pertanyaan pajak spesifik ditutup dengan disclaimer + CTA WhatsApp.
AI tidak boleh mengarang angka.
F10 — Rekap Pajak Bulanan
Mesin pajak (packages/tax-engine, berversi, ada unit test) mengikuti PP 20/2026:

Jenis WP	Perlakuan
Orang Pribadi	PPh Final 0,5% atas omzet kumulatif setahun di atas Rp500jt. Omzet s.d. Rp500jt bebas. Tanpa batas waktu
PT Perorangan	PPh Final 0,5% atas omzet. Tanpa batas waktu
Koperasi	PPh Final 0,5%, maks. 4 tahun sejak terdaftar
PT, CV, Firma	Tidak bisa PPh Final. Skema umum berbasis laba, langsung CTA konsultasi
Semua	Omzet setahun > Rp4,8M → peringatan keluar skema final


Dasar aturan di atas: PP 20/2026 membatasi PPh Final 0,5% untuk OP, PT perorangan, dan koperasi dengan omzet sampai Rp4,8M. OP bebas PPh untuk omzet sampai Rp500jt. OP dan PT perorangan tidak dibatasi waktu, koperasi 4 tahun, sedangkan PT/CV pindah ke skema berbasis laba.

Output:
Omzet per bulan (POS + input manual) per outlet dan gabungan
Omzet kumulatif setahun
Estimasi PPh
Progress ke Rp500jt dan Rp4,8M
Checklist setor/lapor (tanggal dari config)
PDF dikirim via email tanggal 1, dengan disclaimer: "Estimasi, bukan nasihat pajak."
Upsell: "Biar admin yang urus rekap & lapor pajak bulan ini" mengarah ke WhatsApp.
F11 — Layanan via WhatsApp
CTA membuka wa.me/{nomor}?text=... dengan pesan yang sudah terisi beserta konteksnya (nama, usaha, ID, jenis WP, jumlah outlet).
Lead dicatat sebelum redirect (halaman, layanan, user/anonim, UTM).
Hanya 2 layanan: pajak_rekap dan website_custom. Konsultasi pertama gratis, pembahasan berikutnya lewat chat pribadi klien–admin di WhatsApp.
Pipeline lead di admin console: Baru, Dihubungi, Proposal, Menang, Kalah, dengan nilai deal.
F12 — Laporan Email (satu-satunya kanal laporan)
Laporan	Jadwal	Plan
Ringkasan harian	21.00 waktu lokal (bisa diatur)	Gratis & Pro
Mingguan + skor	Senin 07.00	Pro
Rekap pajak bulanan (PDF)	Tanggal 1	Pro
Alert bahan baku/margin	Saat terpicu, maks. 1/hari	Pro
Ringkasan semua outlet	Harian & mingguan	Pro (≥ 2 outlet)


Memakai React Email, gaya putih-biru, dengan unsubscribe per jenis laporan.

F13 — Billing
Langganan per outlet via Xendit (default, diabstraksi di packages/billing): QRIS, VA, e-wallet, kartu.
Status: trial, active, past_due (grace 3 hari), canceled.
Kalau turun plan, data tetap tersimpan dan fitur dikunci. Invoice via email.
Jumlah tagihan otomatis menyesuaikan jumlah outlet aktif, prorata.
F14 — Admin Console (internal)
Berisi: tenant, langganan, pemakaian AI, pipeline lead, editor config pajak/MDR/kuota (berversi + audit log), feature flags, impersonate read-only dengan audit, dan antrian klien layanan pajak (lihat F15).

F15 — Mode Naik Kelas (reverse thinking)
Kemampuan	Detail
Multi-outlet	Tambah outlet, katalog bisa pusat atau per outlet, harga per outlet, transfer stok antar outlet (ledger)
Peran staf	Owner, Manajer outlet, Kasir, Keuangan. Izin granular (void, diskon, lihat laporan)
Login kasir cepat	PIN 6 digit per staf di perangkat bersama, tetap jalan offline
Tutup shift	Kas awal, kas akhir, selisih, ringkasan per metode bayar, dikirim via email ke owner
Ekspor akuntan	CSV/XLSX penjualan, pengeluaran, stok, rekap pajak per periode
Akses admin pajak	Owner memberi izin read-only berbatas waktu ke tim admin web3min untuk mengerjakan layanan rekap. Bisa dicabut kapan saja, tercatat di audit
Dashboard gabungan	KPI dan skor semua outlet, dengan ranking outlet
Halaman /naik-kelas	Funnel khusus PT/CV dan multi-outlet, dengan CTA WhatsApp layanan


Mode ini aktif otomatis saat outlet kedua ditambahkan atau jenis WP PT/CV dipilih. UI tetap sederhana untuk pengguna 1 outlet karena menu Naik Kelas disembunyikan.

9. Kebutuhan Non-Fungsional
Area	Target
Marketing	LCP < 2,0 s (4G), INP < 200 ms, CLS < 0,05, JS awal < 120 KB gzip
POS	Buka offline < 1,5 s, tambah item < 50 ms, checkout < 300 ms
Ketersediaan	99,5%
Perangkat	Android 9+ Chrome, iOS Safari 16+, desktop modern, minimal 360 px
Aksesibilitas	WCAG 2.2 AA
Lokalisasi	id-ID, Rp 1.234.567, WIB/WITA/WIT per outlet
Skala	10.000 tenant / 25.000 outlet tanpa ubah arsitektur


10. Arsitektur Teknis
Prinsip: monolit modular, offline-first, tenancy ketat (tenant_id + outlet_id), biaya AI terukur, aturan bisnis sebagai config berversi.




Monorepo (Turborepo, pnpm, TypeScript strict)
apps/
  web/        Next.js 15 App Router — marketing (SSG) + app (/app, PWA)
  sites/      Renderer website tenant (wildcard subdomain, ISR)
packages/
  ui/  db/  sync/  qris/  tax-engine/  ai/  email/  billing/  auth-rbac/
Lapisan	Pilihan
Database	PostgreSQL (Supabase, region Singapura) + RLS per tenant_id/outlet_id
Auth	Supabase Auth (Google + magic link) + PIN staf (auth-rbac)
Storage	Cloudflare R2 + CDN, WebP/AVIF
Offline	Serwist + Dexie
Jobs	Trigger.dev (skor, email, alert, ISR, tagihan)
Email	Resend + React Email, SPF/DKIM/DMARC
Billing	Xendit
Analitik	PostHog + cookie consent
Observability	Sentry + log terstruktur
Hosting	Vercel, wildcard *.web3min.id


Kontrak sync:

POST /api/sync/push dengan body {client_uuid, type, payload, device_id, outlet_id, staff_id, device_ts}, direspons {accepted[], rejected[]}.
GET /api/sync/pull?since=cursor untuk katalog, harga, config, dan staf.
11. Model Data
Grup	Tabel
Tenant & akses	tenants, outlets, users, memberships (role, outlet scope), staff_pins, devices, access_grants (admin pajak)
Profil	business_profile (kategori, jenis WP, kategori merchant QRIS, tgl terdaftar koperasi)
Katalog	products, outlet_prices, product_images, product_embeddings
Bahan	ingredients, recipes, ingredient_prices
Transaksi	sales, sale_items, payments, stock_events, stock_transfers, expenses, shifts
QRIS	qris_profiles (per outlet)
Pajak & skor	tax_rules (versi), tax_monthly_summaries, health_scores
Website	sites, site_pages, templates
AI	ai_usage, ai_conversations
Bisnis	subscriptions, subscription_items (per outlet), invoices, leads, email_preferences, audit_logs, feature_flags


12. Keamanan dan Kepatuhan
Patuh UU PDP: kebijakan privasi, consent, ekspor dan hapus data, catatan pemrosesan.
TLS in-transit, enkripsi at-rest, secret di vault, audit log untuk akses admin dan access_grants.
Test otomatis RLS antar tenant dan antar outlet. Rate limit AI dan auth. Guard prompt-injection.
Disclaimer di semua output pajak.
13. Analitik dan Metrik
North Star: jumlah outlet yang bertransaksi dalam 7 hari terakhir (Weekly Transacting Outlets).

Tahap	Metrik
Akuisisi	Visitor ke signup, % organik, signup dari alat gratis
Aktivasi	% transaksi pertama ≤ 24 jam
Retensi	Retensi D7/D30, % transaksi offline yang tersinkron
Monetisasi	Trial ke Pro, MRR, outlet per tenant, churn, biaya AI per outlet
Naik Kelas	% tenant ≥ 2 outlet, % PT/CV, akses admin pajak diberikan
Layanan	Klik WA ke lead ke deal, pendapatan layanan per bulan


Event wajib: signup, onboarding_step, first_sale, sale_created{offline}, qris_uploaded, ai_used{type}, site_published, tax_recap_viewed, outlet_added, staff_added, shift_closed, access_granted, wa_cta_clicked{service,page}, subscription_*.

14. SEO dan Growth
Klaster	Kata kunci	Halaman
Kasir	aplikasi kasir gratis, kasir offline, kasir warung, kasir multi cabang	/umkm, /naik-kelas
QRIS	QRIS untuk UMKM, biaya QRIS 2026	/umkm, /alat/kalkulator-biaya-qris
Pajak	PPh final UMKM 2026, PP 20/2026, pajak CV/PT kecil, rekap pajak bulanan	/pajak, kalkulator
Website	jasa pembuatan website UMKM, template website toko	/website, /template
Harga	menentukan harga jual, menghitung HPP	/alat/kalkulator-hpp-harga-jual


3 alat gratis tanpa login, dengan hasil bisa dikirim ke email (lead).
SEO terprogram: 50 halaman /template/[slug] dan halaman /umkm/kasir-[kategori] dengan konten unik.
Loop viral: "Dibuat dengan web3min" di website tenant (bisa dihapus di Pro) dan di struk digital.
15. Definition of Done
Fitur dianggap selesai kalau:

Semua kriteria penerimaan lulus.
Unit test hijau (wajib untuk sync, qris, tax-engine, auth-rbac).
E2E Playwright untuk alur utama.
Lighthouse: Performance ≥ 90, SEO 100, Accessibility ≥ 95.
Event analitik terkirim.
Tampil benar di 360 px dan 1440 px, dengan copy Bahasa Indonesia.
16. Jalur Kerja Paralel (satu rilis)
Semua jalur jalan bersamaan. Ketergantungannya hanya pada fondasi.

Jalur	Isi
A. Fondasi (paling awal)	Monorepo, packages/ui + token DESIGN.md, auth, tenancy + RLS, auth-rbac, CI/CD, Sentry, PostHog
B. Kasir	POS offline, sync, QRIS, scan tanpa barcode, multi-outlet, shift, PIN staf
C. AI	Gateway + metering, AI foto, AI harga + alert, Tanya AI, saran skor
D. Pajak & Data	Tax engine, rekap bulanan, skor kesehatan, ekspor akuntan, access grants
E. Website	Builder, 50 template, renderer tenant, custom domain flow
F. Marketing & SEO	Homepage, /umkm, /pajak, /website, /naik-kelas, /harga, /template, 3 alat, blog, JSON-LD, sitemap
G. Bisnis	Billing per outlet, laporan email, CTA WhatsApp + lead, admin console


Rilis dilakukan saat semua jalur memenuhi §15.

17. Nilai Default (dipakai agent tanpa menunggu)
Item	Default
Paket	Gratis (POS + QRIS) + Pro Rp50rb/outlet
Payment gateway	Xendit
Domain	web3min.id (placeholder di env)
Nomor WhatsApp	NEXT_PUBLIC_WA_PAJAK, NEXT_PUBLIC_WA_WEBSITE di env
Jatuh tempo pajak	Config tax_rules.deadlines, diisi admin


DESIGN.md
0. Prinsip Desain
Jelas dulu, baru indah. Pemilik warung harus paham dalam 5 detik.
Putih yang lega, biru yang yakin. Putih sekitar 80% permukaan, biru untuk aksi dan identitas.
Motion yang bercerita. Setiap animasi menjelaskan sesuatu, tidak ada yang cuma hiasan.
Cepat di HP murah. Animasi tidak boleh mengorbankan LCP atau INP.
Kelas startup besar: grid rapi, tipografi berkarakter, detail mikro konsisten. Terasa global, hangat, dan lokal.
1. Kepribadian Brand
Terpercaya, modern, membumi, optimis. Kalimat pendek, kata kerja aktif, tanpa jargon. Gunakan "kamu" di marketing dan "Anda" di dokumen pajak dan invoice.

2. Warna
css


:root {
  --blue-50:  #EFF5FF;  --blue-100: #DBE8FE;  --blue-200: #BFD5FE;
  --blue-300: #93B8FD;  --blue-400: #6094FA;  --blue-500: #3B6FF6;
  --blue-600: #2453EB;  /* PRIMARY — kontras vs putih ±6:1 (AA) */
  --blue-700: #1C40D8;  --blue-800: #1D35AF;  --blue-900: #1E328A;
  --blue-950: #0E1A4A;  /* section gelap */

  --white: #FFFFFF;  --gray-25: #FAFBFD;  --gray-50: #F4F6FA;
  --gray-100: #E8ECF3;  --gray-300: #C3CBD9;  --gray-500: #6B7489;
  --gray-700: #343C4F;  --ink: #0B1220;

  --success: #12A150;  --warning: #E8A100;  --danger: #E5484D;

  --grad-hero:  radial-gradient(60% 60% at 70% 20%, #DBE8FE 0%, rgba(255,255,255,0) 70%);
  --grad-brand: linear-gradient(135deg, #2453EB 0%, #3B6FF6 50%, #6094FA 100%);
  --grad-navy:  linear-gradient(180deg, #0E1A4A 0%, #1E328A 100%);
}
Aturan:

Teks body selalu --ink atau --gray-700. Biru 400 ke bawah tidak boleh untuk teks.
Satu tombol primary per viewport.
Section gelap maksimal 2 per halaman.
Marketing tanpa dark mode.
3. Tipografi (baru)
Peran	Font	Kenapa
Display / Heading	Bricolage Grotesque (variable, 600–800)	Grotesk berkarakter dengan ink trap dan sumbu optical size. Terasa editorial dan premium di ukuran besar, tetapi tetap tenang. Tidak pasaran
Body / UI	Geist (400–600)	Didesain untuk antarmuka, sangat terbaca di layar kecil. DNA "big startup"
Angka & label teknis	Geist Mono (500)	Harga, nominal QRIS, skor, eyebrow. Angka sejajar dan terasa presisi


Ketiganya gratis untuk komersial (OFL) dan tersedia lewat next/font/google (Bricolage_Grotesque, Geist, Geist_Mono). Self-host, display: swap, subset latin, preload hanya Bricolage 700 + Geist 400.

Pengaturan khusus Bricolage:

Hanya untuk heading ≥ 24 px. Di bawah itu pakai Geist 600.
font-optical-sizing: auto. Di display, set font-variation-settings: "wdth" 92 agar lebih padat dan tegas.
Tracking: display -0.035em, h1 -0.03em, h2 -0.02em.
Alternatif (kalau mau ganti, cukup ubah token --font-display):

Opsi	Display	Body	Rasa
B	Instrument Sans + aksen Instrument Serif Italic (1–2 kata di headline)	Geist	Elegan, gaya startup AI modern
C (berbayar)	PP Neue Montreal / Aeonik	Geist	Paling "Silicon Valley", perlu lisensi


Skala fluid:

Token	Font	Ukuran	LH
display	Bricolage 800	clamp(2.75rem, 5.5vw + 1rem, 5rem)	1.0
h1	Bricolage 700	clamp(2.125rem, 3vw + 1rem, 3.5rem)	1.05
h2	Bricolage 700	clamp(1.75rem, 2vw + 1rem, 2.625rem)	1.12
h3	Bricolage 600	1.5rem	1.25
body-lg	Geist 400	1.1875rem (19px)	1.6
body	Geist 400	1.0625rem (17px)	1.65
small	Geist 400	0.9375rem	1.5
eyebrow	Geist Mono 500, uppercase	0.8125rem	1.4, tracking 0.06em
price	Geist Mono 500	sesuai konteks	tnum


Aturan keterbacaan:

Paragraf maksimal 65ch.
Maksimal 3 ukuran per section.
Heading maksimal 2 baris di mobile.
Gradien teks hanya untuk 1–3 kata.
Tidak ada teks di atas foto tanpa overlay.
4. Layout, Spacing, Bentuk
Grid: 12 kolom, container 1200 px / 1320 px (visual lebar), gutter 24 px / 16 px.
Spacing (4 pt): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Jarak antar section: 128 px desktop, 80 px mobile.
Radius: 8 / 12 / 16 / 24 / full.
Shadow:
sm 0 1px 2px rgba(14,26,74,.06)
md 0 8px 24px -8px rgba(14,26,74,.12)
lg 0 24px 64px -16px rgba(36,83,235,.22)
Border: 1 px --gray-100. Kartu aktif memakai border --blue-200 + ring 4 px --blue-50.
5. Ikon, Ilustrasi, Motion Graphics
Ikon: Lucide, stroke 1.75, ukuran 20/24.
Ilustrasi: mockup UI produk asli + bentuk geometris biru (grid titik, orbit, lingkaran).
Motion graphics:
Rive untuk yang interaktif (status offline/online, gauge skor, peta outlet).
dotLottie untuk ikon kecil.
Video WebM < 600 KB khusus demo foto AI, dimuat lazy.
Foto: UMKM Indonesia asli, grading sedikit dingin.
6. Sistem Motion
Library:

Motion (Framer Motion) untuk micro-interaction.
GSAP + ScrollTrigger + SplitText untuk scroll storytelling.
Lenis untuk smooth scroll, desktop saja.
Semua di-lazy-load setelah idle. Hero tampil tanpa JS.

css


:root {
  --dur-instant: 100ms; --dur-fast: 180ms; --dur-base: 280ms;
  --dur-slow: 480ms;    --dur-story: 800ms;
  --ease-standard:   cubic-bezier(0.2, 0, 0, 1);
  --ease-emphasized: cubic-bezier(0.3, 0, 0, 1);
  --ease-exit:       cubic-bezier(0.4, 0, 1, 1);
}
/* Spring default: { type:"spring", stiffness: 380, damping: 32 } */
Pola	Spesifikasi
Reveal	opacity 0 → 1, Y 16 px → 0, 480 ms, stagger 60 ms, sekali
Headline	Per kata, stagger 40 ms, maks. 12 kata. Ditambah animasi wdth Bricolage 100 → 92 saat masuk (khas brand)
Count-up	900 ms, format Rp, Geist Mono tnum
Hover kartu	Y -4 px + shadow-lg, spotlight radial mengikuti kursor
Tombol	Tekan scale 0.98, panah bergeser 4 px
Pin scroll	Maks. 1 per halaman, ≤ 150vh
Marquee	40 s/loop, berhenti saat hover/focus
Transisi halaman	View Transitions API, fade + slide 8 px


Aturan wajib:

Hanya animasikan transform/opacity. Animasi sumbu variable font hanya untuk headline.
prefers-reduced-motion: reveal jadi instan, pin dan marquee mati, count-up langsung ke nilai akhir.
Animasi di luar viewport dijeda.
Budget JS motion ≤ 45 KB gzip awal, 60 fps di Android kelas menengah.
7. Komponen Inti (packages/ui)
Komponen	Spesifikasi
Button	primary (blue-600), secondary (putih, border), ghost, whatsapp (putih + ikon WA, khusus CTA layanan). 44/52 px, radius 12, label Geist 600
Eyebrow badge	Pill blue-50, Geist Mono blue-700, titik live beranimasi
Card / Bento	Radius 16–24, hover §6
Chooser card	Pemilih UMKM/Pajak di hero
Stat	Angka Bricolage 700 / Geist Mono + label gray-500
Status pill POS	Online / Offline (n) / Sync, dengan ikon + teks
Outlet switcher	Dropdown di topbar app, badge jumlah outlet
Gauge skor	Rive 0–100
Input	48 px, radius 12, focus ring 4 px blue-100 + border blue-600
FAQ	grid-template-rows 0fr → 1fr


8. Homepage /
Navbar (sticky 64 px):

Isi: logo, lalu UMKM · Pajak · Website · Naik Kelas · Harga · Alat Gratis, lalu "Masuk" dan "Coba Gratis".
Saat di-scroll: putih 80% + blur 12 px + border bawah.
S1 — Hero
Eyebrow: "BARU · QRIS s.d. Rp500rb kini 0% untuk usaha mikro". Memakai aturan MDR baru sejak 1 Oktober 2026.
Display: "Kasir, website, dan pajak usahamu — beres di satu tempat."
Sub: "Jualan tetap jalan walau internet mati. AI bantu atur harga, percantik foto produk, dan rekap pajak tiap bulan. Mulai gratis."
Chooser:
🏪 "Saya punya usaha", mengarah ke /umkm.
🧾 "Saya mau urus pajak", mengarah ke /pajak.
Link teks di bawahnya: "Butuh website toko? Lihat 50 template →".
Trust line: "Gratis untuk mulai · Tanpa kartu kredit · Data terenkripsi".
Visual: mockup HP POS + 3 kartu mengambang ("QRIS diterima Rp35.000", "Offline · 3 transaksi aman", "Skor bisnis 82 · Sehat").
Motion: headline per kata + animasi wdth (CSS), kartu melayang ±6 px dalam loop 6 s, spotlight di chooser. LCP = teks H1.
S2 — Strip kepercayaan
Hanya data atau logo yang terverifikasi. Sebelum ada data, gunakan "Dirancang untuk warung, kafe, butik, dan affiliate di seluruh Indonesia".

S3 — Masalah ke solusi (pin 1×)
Tiga panel: "Internet mati, antrian panjang", lalu "Bahan naik, untung hilang", lalu "Pajak bikin pusing". Setiap masalah berubah menjadi UI solusinya.

S4 — Bento fitur
Kartu	Ukuran	Visual
Kasir offline	2×2	Toggle Wi-Fi, antrian, sync
QRIS	1×1	QR tergambar garis demi garis
Scan tanpa barcode	1×1	Bingkai kamera mengunci produk
AI foto	2×1	Slider sebelum/sesudah
AI harga	1×1	Garis harga naik, muncul kartu saran
Skor	1×1	Gauge naik ke 82
Tanya AI	1×1	Bubble mengetik
Rekap pajak	1×1	Progress menuju Rp500jt
50 template	2×1	Thumbnail bergeser


S5 — Demo "Coba matikan internet"
Toggle OFF: latar redup, pill amber, tap 3 produk sampai muncul "3 transaksi aman". Toggle ON: partikel terbang ke cloud, lalu centang hijau. Bisa dioperasikan keyboard, dengan pengumuman aria-live.

S6 — Foto AI
Slider drag, 3 produk lokal (kopi susu, keripik, kemeja batik).

S7 — Galeri template
Dua baris marquee berlawanan arah + chip kategori. CTA ke /template, dan link sekunder "Desain custom? Chat kami".

S8 — Naik Kelas (reverse thinking)
Headline: "Mulai dari satu warung. Siap sampai sepuluh cabang."
Visual Rive: satu titik outlet bercabang menjadi peta beberapa outlet, dengan KPI gabungan dan count-up.
Tiga poin: Multi-outlet & staf · Tutup shift & ekspor akuntan · Pajak PT/CV dibantu admin.
CTA ke /naik-kelas + tombol WhatsApp "Konsultasi bisnis".
S9 — Band Pajak (gelap)
Headline: "Aturan pajak UMKM berubah di 2026. Kami bantu kamu tetap aman."
Mini kalkulator: pilih jenis usaha, isi omzet, lalu estimasi muncul dengan count-up. Kalau memilih PT/CV, muncul "Tidak bisa PPh Final 0,5% sejak PP 20/2026" + CTA WhatsApp. Memakai tax-engine yang sama dengan app.
Disclaimer kecil di bawah kalkulator.
S10 — Harga
Kartu Gratis + kartu Pro "Rp50rb/outlet/bulan" (border gradien animasi pelan 8 s).
Di bawahnya 2 kartu layanan (Pajak, Website Custom) dengan tombol WhatsApp.
S11 — FAQ
8 pertanyaan + schema FAQPage: offline, QRIS bank apa saja, AI vs konsultan pajak, keamanan data, berhenti kapan saja, laporan via email, multi-outlet, cara upgrade.

S12 — CTA akhir (gelap)
"Mulai jualan lebih rapi hari ini." dengan tombol "Coba Gratis" dan "Chat Admin". Orb gradien bergerak 20 s.

Footer
Kolom Produk, Alat Gratis, Perusahaan, Legal. WhatsApp hanya di konteks layanan, tanpa tombol mengambang global.

9. Halaman Turunan
Halaman	H1	Struktur
/umkm	"Kasir yang tetap jalan walau internet mati."	Demo offline, fitur zig-zag, skor, harga, FAQ
/pajak	"Rekap pajak UMKM tiap bulan, sesuai aturan terbaru."	Tabel PP 20/2026 per jenis WP, kalkulator penuh, alur layanan, CTA WA, FAQ
/website	"Website toko siap dalam 10 menit."	Galeri 50 template, alur edit 3 langkah, Template vs Custom (WA)
/naik-kelas	"Satu aplikasi dari warung pertama sampai cabang kesepuluh."	Peta outlet Rive, peran staf, shift, ekspor akuntan, pajak PT/CV, CTA WA
/template/[slug]	"Template {Nama} untuk {Kategori}"	Preview iframe, blok, "Pakai template ini"
/alat/*	Nama alat	Alat di atas lipatan, cara hitung, FAQ, CTA daftar


10. UI Aplikasi
Motion hemat: maksimal 180 ms, kecuali momen sukses.
POS mobile:
Search + tombol scan di atas.
Grid produk 2–3 kolom: foto 1:1, nama Geist 500 2 baris, harga Geist Mono.
Keranjang sebagai bottom sheet, tombol "Bayar Rp…" setinggi 56 px.
PIN staf memakai keypad besar.
Layar QRIS: QR besar, nominal Geist Mono 40 px, nama merchant, pengingat cek notifikasi, tombol "Sudah dibayar".
Sukses: centang stroke-draw 400 ms + navigator.vibrate(30).
Dashboard:
Sidebar 240 px, outlet switcher di topbar.
Kartu KPI dengan angka Bricolage.
Chart garis blue-600 + area blue-50 (Recharts).
Kartu "3 saran AI".
Empty state memakai ilustrasi geometris + 1 aksi. Loading memakai skeleton shimmer blue-50.
11. SEO On-Page
Render: marketing memakai SSG, blog/template ISR. Konten ada di HTML tanpa JS.
Metadata: title ≤ 60 karakter, description 140–160, canonical, lang="id", og:locale=id_ID. OG image dinamis via next/og (Bricolage + putih-biru).
JSON-LD: Organization, WebSite, SoftwareApplication (offers 0 dan 50000 IDR), FAQPage, BreadcrumbList, Article, HowTo (alat).
Teknis:
Sitemap per tipe, /app noindex, 1 H1 per halaman.
Internal link antar klaster, breadcrumb.
Alt text Bahasa Indonesia, next/image AVIF/WebP.
AI search: llms.txt + paragraf definisi singkat di awal setiap halaman.
Animasi vs SEO: konten tidak disembunyikan di SSR. Reveal dipicu class dari JS, jadi kalau JS gagal konten tetap terlihat.
12. Aksesibilitas
Kontras AA. Focus ring selalu terlihat.
Target sentuh ≥ 44 px. Demo interaktif bisa dioperasikan keyboard.
Reduced motion dihormati penuh.
Status tidak hanya disampaikan lewat warna.
13. Budget Performa Homepage
Item	Budget
HTML + CSS kritis	< 50 KB
JS awal	< 120 KB gzip
Font	Preload 2 file, total < 90 KB (variable subset)
Hero	LCP berupa teks, mockup SVG/WebP < 60 KB
Rive/Lottie	< 150 KB total, dimuat saat terlihat
Target	LCP < 2,0 s · INP < 200 ms · CLS < 0,05 (Android kelas menengah, 4G)


14. Catatan Implementasi



apps/web/
  app/(marketing)/page.tsx                 Homepage S1–S12
  app/(marketing)/umkm|pajak|website|naik-kelas|harga|template|alat|blog
  app/(app)/app/...                         App PWA
  components/marketing/sections/*           Hero, Bento, OfflineDemo, BeforeAfter,
                                            TemplateMarquee, NaikKelas, TaxBand,
                                            Pricing, Faq, FinalCta
  components/motion/*                       Reveal, SplitHeadline, CountUp, Marquee,
                                            Spotlight (semua cek reduced-motion)
  lib/seo/*                                 metadata builder, JSON-LD
packages/ui/tokens.css                      Sumber tunggal token §2–§6
Tailwind v4 @theme memetakan token: --font-display: "Bricolage Grotesque", --font-sans: "Geist", --font-mono: "Geist Mono".
Copy disimpan di content/id/*.ts.
Setiap section punya Storybook story + screenshot test Playwright di 360 px dan 1440 px.
Saya ambil tiga keputusan sendiri, jadi silakan dicek:

Harga Pro dihitung per outlet (Rp50rb/outlet). Tujuannya supaya MRR ikut naik saat usaha klien bertambah cabang, tanpa menaikkan harga.
Fitur "Akses admin pajak": pemilik usaha memberi tim Anda akses baca-saja yang bisa dicabut kapan saja. Ini yang memungkinkan layanan rekap pajak berjalan langsung dari data aplikasi.
Halaman /naik-kelas saya tambahkan sebagai halaman khusus untuk usaha multi-outlet dan PT/CV.