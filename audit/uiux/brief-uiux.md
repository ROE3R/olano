# OLANO - BRIEF UI/UX (MOBILE-FIRST) UNTUK AGENT
Target   : https://olano.vercel.app  (aplikasi: kasir.html, demo: kasir.html#demo)
Tanggal  : 18 Oktober 2026
Lingkup  : HANYA UI/UX. Kata & kalimat DIBEKUKAN (lihat bagian 11).
Gaya     : kritik blak-blakan. Tujuannya produk selamat, bukan perasaan enak.

## R-CHAIN (reverse dari hasil akhir)
HASIL AKHIR: "Pemilik warung, satu tangan, HP Android murah, di bawah matahari, sinyal jelek, menyelesaikan penjualan pertamanya tanpa bertanya siapa pun, dan besoknya membuka lagi."
R7  Besok dibuka lagi          <- hasil transaksi terasa BERES (kembalian jelas, struk, rekap harian)
R6  Transaksi selesai          <- layar sukses: kembalian raksasa, 2 tombol jelas, tak ada ragu "tersimpan?"
R5  Bayar tidak salah tekan    <- tombol Bayar besar, total selalu terlihat, konfirmasi hanya bila berisiko
R4  Keranjang terbaca sekilas  <- item, qty, subtotal; ubah qty tanpa membidik target kecil
R3  Tambah produk 1 ketukan    <- grid produk besar; ada produk contoh (tak mulai dari kosong)
R2  Aplikasi terbuka cepat     <- <3 dtk di 3G; tak ada layar "login" yang menghalangi demo
R1  CTA ditekan & tahu akibatnya <- label & tujuan jujur; tombol terlihat tanpa scroll di 360x640
R0  Percaya dalam 5 detik     <- hero: apa ini, untuk siapa, bukti apa. Satu pesan, satu tombol.
Urutan kerja: perbaiki dari R7 -> R0 (dari ujung produk ke pintu depan). Pintu depan yang indah menuju ruangan berantakan = pengunjung merasa ditipu.

Angka sasaran (harus terukur):
C1. Penjualan 1 item tunai uang pas: MAKSIMAL 4 ketukan (produk -> Bayar -> Uang pas -> Selesai).
C2. Dari ketukan CTA beranda sampai produk pertama masuk keranjang: <= 10 detik di 3G (demo berisi data).
C3. Tombol CTA utama beranda terlihat TANPA scroll pada 360x640 (efektif ~360x560 setelah bar browser).

## PRE-MORTEM UI - "KENAPA ORANG PERGI DI DETIK KE-N"
Detik 0-3  : halaman putih/lompat (CLS), bar atas menggeser konten, hero berat di 3G.
Detik 3-8  : bingung ini apa (enam produk), angka sana-sini, CTA di bawah lipatan.
Detik 8-20 : scroll tak berujung kartu; kartu-tautan raksasa tersentuh tak sengaja saat scroll.
Detik 20+  : menekan CTA -> tak tahu sedang di demo atau akun asli; layar kasir kosong; tombol kecil; keyboard menutup input; salah tekan; keluar.
Hari ke-2  : data hilang/layar terasa "tak aman"; tak ada rasa selesai. Tidak kembali.

## KRITIK DETAIL - LANDING (ID | tingkat | tanda | masalah | tuntutan perbaikan)
Tingkat: K = kritis (rusak pengalaman), T = tinggi, S = sedang, R = ringan. [S]=terbukti dari teks, [H]=hipotesis (wajib dibuktikan di layar sungguhan; kalau terbukti salah catat "tidak terjadi"), [N]=norma/standar.
Catatan hitungan owner: teks putih di atas biru merek #2453EB (theme-color) = kontras ~6,0:1 (lulus AA 4,5:1, tidak lulus AAA 7:1).

### 4.1 Bar pengumuman
L1 | K | [S][H] Satu baris berisi 4 fakta dipisah "·" (offline-first · QRIS dinamis MDR 0% · PPh final 0,5% (PP 20/2026) · PWA v24) + tombol "x". Di 360px pasti membungkus 2-3 baris atau terpotong. Isinya MENGULANG hero. Tuntutan: hapus bar atau jadikan 1 pesan 1 baris. Bila ada tombol tutup: target >= 44x44, animasi tinggi->0 tanpa melompatkan konten di bawah fold (CLS), status tutup diingat, aria-label.
L2 | T | [S] "PWA v24" adalah nomor versi internal. Tidak berguna bagi pengguna. Elemen ini harus hilang dari bar.

### 4.2 Header & navigasi
L3 | T | [S] Dua tombol berdampingan "Masuk" dan "Coba kasir gratis" menuju halaman yang sama (beda #demo). Di HP sempit dua tombol + logo + hamburger = sesak. Tuntutan: SATU tombol utama di header (mobile), sisanya di dalam menu.
L4 | T | [S][H] Dua daftar tautan menu terbaca di teks (kemungkinan desktop vs mobile). Daftar kedua memuat "Kasir UMKM" (umkm.html) yang tidak ada di daftar pertama. Verifikasi: isi menu desktop = menu mobile? Jika beda, itu bug informasi.
L5 | T | [H] Menu mobile: baris tautan minimal 48px tinggi, jarak 0-8px, tombol CTA utama ditempel di dasar panel (jangkauan jempol), tombol tutup jelas, Esc/Back menutup, fokus terkunci, scroll body terkunci, tidak ada scroll-bleed, animasi < 200ms, mendukung prefers-reduced-motion.
L6 | S | [H] Header sticky + tautan jangkar (#modul, #alat, #pajak, #harga): tanpa scroll-padding-top / scroll-margin-top judul seksi akan tertutup header. Uji tiap jangkar di 360px.
L7 | R | [S] Logo menaut ke /index.html, bukan "/". Efek: URL ganda. Rapikan.

### 4.3 Hero
L8 | K | [H] Judul H1 panjang (~14 kata) + huruf miring pada "mati". Di 360px pada 32px bisa 5-6 baris -> tombol CTA terdorong keluar layar pertama. Tuntutan: H1 maksimal 4 baris di 360px; CTA terlihat tanpa scroll; text-wrap: balance; ukuran H1 mobile 28-32px.
L9 | K | [S][H] Tiga kartu angka melayang di hero (QRIS Rp40.000 / Omzet Rp60.000.000 / PPh Rp91.667) + catatan "Basis: ...". Di HP salah satu dari: (a) bertumpuk dan mendorong CTA, (b) menimpa judul, (c) mengecil jadi tak terbaca. Catatan "Basis" kemungkinan huruf kecil abu-abu di atas gambar = tak terbaca. Tuntutan: di mobile SEMBUNYIKAN kartu angka dari hero (pindahkan ke bagian bawah) atau satu kartu saja DI BAWAH CTA. Teks catatan >= 12px, kontras >= 4,5:1, bukan di atas gambar langsung.
L10 | K | [S] Aset hero = langit/awan/grid (folder "daydream": sky-hero, cloud-1, grid-overlay). Visual menceritakan kebalikan dari janji "tetap jalan saat internet mati" (awan = cloud). Tuntutan: ganti dengan visual yang membuktikan produk: foto/ilustrasi HP kasir dengan layar nyata, dalam bingkai HP, bertema warung. Berat gambar hero di HP <= 60-80KB (webp/avif, srcset, fetchpriority="high" hanya untuk LCP). (Gaya foto/ilustrasi = keputusan owner, daftarkan ke "Butuh keputusan pemilik" dengan 2-3 opsi + rekomendasi.)
L11 | S | [H] Lapisan dekoratif (grid-overlay.svg, awan) kemungkinan beranimasi/parallax -> jank di HP murah dan boros baterai. Tuntutan: matikan animasi di mobile atau saat prefers-reduced-motion; tidak ada scroll-jacking; will-change dipakai hemat.
L12 | S | [S] Hanya satu tombol di hero (bagus - pertahankan). JANGAN tambah tombol kedua ("Lihat fitur"), memecah keputusan.

### 4.4 Blok tangkapan layar produk
L13 | K | [S][H] Seluruh tangkapan layar + keterangan dibungkus SATU tautan; teks tautan = alt panjang + "Data contoh..." + "Buka demo kasir langsung ->". Di HP: gambar layar kasir (tata letak lebar) dikecilkan ke ~340px = tak terbaca. Tuntutan: potret layar MOBILE (rasio ~9:19) dalam bingkai HP, dipotong pada bagian berguna (grid produk + total + tombol Bayar). Pisahkan gambar dari tautan; tombol teks terpisah 48px. alt singkat (<= 125 karakter). Jika layar yang ditampilkan bukan layar yang dilihat pengguna di HP, itu menyesatkan.

### 4.5 Seksi "Modul"
L14 | K | [S][H] Enam kartu, tiap kartu = tautan penuh berisi nomor, judul, deskripsi, baris "contoh · ...", lencana status. Bahaya: kartu besar-sebagai-tautan -> sentuhan tak sengaja saat scroll; nama aksesibel sangat panjang. 6 kartu bertumpuk di HP = ~6 layar. Tuntutan: kartu ringkas (ikon + judul + 1 baris) 72-96px; detail "contoh" disembunyikan (accordion/sheet) atau dihapus di mobile; atau carousel horizontal dengan scroll-snap + indikator + bayangan tepi. Kartu tak boleh memicu navigasi saat jari menyeret (uji drag vs tap).
L15 | T | [S] Baris "contoh" berbentuk rumus satu-baris: "Rp50.000 - komisi 30% - promo Rp3.000 - HPP Rp20.000 -> laba Rp12.000". Operator memutus baris secara acak di layar sempit. Tuntutan: tata letak berstruktur (label kiri, nilai kanan, tabular-nums, total tebal) ATAU jangan tampilkan di kartu sama sekali.
L16 | T | [S] Lencana "Sudah jalan" x5 = kebisingan. Tampilkan lencana HANYA untuk pengecualian ("Segera hadir"/"Beta"); yang normal tanpa label. Lencana teks >= 12px, kontras >= 4,5:1.
L17 | S | [S] Penghitung "05 aktif · 01 segera hadir" adalah info untuk pendiri, bukan pengguna. Hapus dari UI.
L18 | T | [S] Kartu "Automation" (belum dibuka) tampil sama persis dengan kartu aktif dan tetap bisa ditekan -> jalan buntu yang disengaja. Tuntutan: tampil redup, tanpa tautan navigasi; aksi "Daftar tunggu" (WhatsApp/email) sebagai satu-satunya yang bisa ditekan.
L19 | S | [S] Nomor 01-06 berkesan urutan/peringkat. Jika bukan peringkat sungguhan, hilangkan.

### 4.6 Seksi kalkulator
L20 | S | [S] Empat tautan kalkulator berbentuk daftar polos + teaser "contoh: ..." tanpa konteks. Ini umpan lead terbaik, tampilannya paling tak dipedulikan. Tuntutan: 4 ubin 2x2 dengan ikon, judul, 1 baris hasil contoh berlabel jelas, target >= 48px, tanpa efek hover-saja.
L21 | S | [S] Tiga seksi berturut-turut bernuansa "produk" (modul, kalkulator, pajak) dengan gaya kartu serupa. Tuntutan: beri ritme: ganti latar seksi (netral/biru muda/putih), variasikan komponen (satu daftar, satu widget, satu tabel), jarak antar seksi >= 64px mobile.

### 4.7 Seksi Pajak (widget di beranda)
L22 | K | [S] Urutan: judul -> paragraf tebal panjang ("Aturan 2026: ...") -> tautan panduan -> BARU widget. Tembok teks di depan elemen interaktif. Di HP orang tidak membaca; mereka mencolek. Tuntutan: widget DULU, aturan di accordion "Lihat aturannya" di bawahnya.
L23 | T | [S][H] Pilihan "Jenis usaha" memuat 5 opsi (Orang Pribadi, PT Perorangan, Koperasi, PT, CV/Firma). Jika deretan radio = 5 x 48px = 240px vertikal; jika dropdown kustom, rawan bug di HP. Tuntutan: <select> asli di mobile (pemilih native) ATAU segmented chips yang bisa digulir; opsi default = Orang Pribadi (mayoritas).
L24 | K | [H] Input "Omzet per bulan (Rp)": wajib (a) awalan "Rp" tetap di dalam kolom, (b) pemisah ribuan langsung saat mengetik tanpa kursor melompat, (c) keypad angka (inputmode="numeric"/"decimal", bukan type=number yang menghasilkan spinner dan menerima "e"), (d) tombol cepat (10 jt, 30 jt, 60 jt, 100 jt), (e) tombol hapus (x), (f) hasil LIVE tanpa tombol "Hitung".
L25 | K | [H] Saat keyboard terbuka, hasil ("Rp91.667 per bulan") kemungkinan tertutup keyboard. Tuntutan: hasil tampil di atas kolom atau sticky di bawah keyboard; scrollIntoView otomatis; area hasil aria-live="polite".
L26 | S | [S] Kartu hasil harus punya hierarki: angka besar (>= 32px, tabular-nums), satu baris penjelas, lalu detail ("Omzet tahunan ...") di ukuran lebih kecil. Saat ini terbaca sebagai dua kalimat tebal yang bersaing. (Soal ketepatan angka: brief audit F2 - JANGAN perbaiki, tunda.)

### 4.8 Seksi Harga
L27 | K | [S][H] Dua kartu bertumpuk di mobile: Gratis di atas, Pro di bawah. Paket yang ingin dijual (Pro) tersembunyi di layar kedua dan tak ada tanda "paling populer". Tuntutan: di mobile, Pro lebih dulu atau toggle segmented (Gratis | Pro) yang menukar isi kartu; beri penanda visual pada paket utama; baris pembeda ("Semua fitur Gratis, plus:") agar bisa dibandingkan.
L28 | T | [S] Butir fitur Pro bersifat gabungan: "AI harga, foto (60 foto/outlet/bulan), dan Tanya AI". Satu butir = tiga hal + angka. Tuntutan UI: satu hal per butir, angka batas sebagai teks sekunder abu-abu di baris kedua, ikon centang konsisten, jarak 12px.
L29 | T | [H] Harga "Rp50rb/outlet/bulan": satuan panjang akan membungkus ke baris baru dan berbeda ukuran. Tuntutan: angka harga 36-40px tebal; "/outlet/bln" 14-16px abu-abu, SATU baris (nowrap); "Rp" dan angka tak boleh terpisah (no-break space).
L30 | K | [S] "Layanan pajak dan website custom tersedia per penawaran lewat WhatsApp" = teks polos tanpa tombol terlihat di teks. Jalur pendapatan berkontak-manusia justru tak punya tombol. Tuntutan: tombol hijau WhatsApp 48-52px dengan ikon, pesan terisi otomatis (wa.me + teks), di bawah kartu harga. (Owner: belum ada nomor WA nyata -> tombol struktur dipasang tapi label jujur "nomor menyusul", non-dead: menampilkan modal/informasi jelas, bukan link mati.)
L31 | S | [S] Dua CTA harga (Mulai gratis, Coba Pro) menuju tujuan identik. Tuntutan UI: tombol primer (biru solid) untuk paket utama, sekunder (outline) untuk lainnya; tinggi 52px; lebar penuh di mobile.

### 4.9 CTA penutup, testimoni, footer
L32 | K | [S] Urutan: Bukti sosial -> Harga -> (FAQ) -> CTA penutup -> footer. CTA penutup adalah elemen TERAKHIR sebelum footer. Sembunyikan seluruh seksi testimoni sampai ada isi nyata (jangan tampilkan stempel "CONTOH" di produksi).
L33 | T | [H] Footer 3 kolom (Produk/Kalkulator/Perusahaan) + paragraf hukum panjang. Di mobile: tautan teks 14px jarak rapat = target sentuh sempit. Tuntutan: tiap tautan footer tinggi >= 44px, kolom jadi akordeon atau 1 kolom dengan pemisah; paragraf hukum <= 4 baris atau dilipat.

### 4.10 Global landing
L34 | T | [S] Tidak ada blok FAQ / "Cara mulai" / "Keamanan data" - tiga ketakutan utama pemilik warung (rumit? data hilang? mahal?) tak terjawab secara visual. Tuntutan UI (struktur, bukan kata): tambah komponen accordion FAQ dan 3 langkah berikon sebelum CTA penutup. Isi dikerjakan saat tahap kata (siapkan komponen dengan placeholder labeled "isi menyusul", jangan fiksikan isi).
L35 | T | [H] Hitung total tinggi halaman di 360x800: target <= 9 layar. Lebih dari itu = potong.
L36 | S | [H] Tidak ada "kembali ke atas", tidak ada indikator posisi; untuk halaman 9+ layar tambahkan tombol kecil mengambang yang muncul setelah scroll jauh (jangan menimpa tombol WhatsApp/CTA).
L37 | S | [S] Satu-satunya tautan skip ("Langsung ke isi") ada - pertahankan; pastikan terlihat saat fokus dan fokus pindah ke #main.

## 5. APLIKASI KASIR (kasir.html) - SPESIFIKASI WAJIB
Spesifikasi yang harus dipenuhi + rubrik untuk mengkritik layar nyata. Setiap pelanggaran = bug UX.
### 5.1 Prinsip
P1. Satu tangan (jempol), portrait, kanan-kidal-kiri. Aksi utama di 40% layar bawah.
P2. Total & tombol Bayar SELALU terlihat (sticky bawah) selama berjualan.
P3. Terbaca di bawah matahari: angka kunci kontras >= 7:1; jangan pakai abu muda untuk angka.
P4. Tak pernah kehilangan konteks: reload/keluar tak menghapus keranjang tanpa peringatan.
P5. Setiap aksi punya umpan balik < 100 ms (efek tekan, getar halus Android, perubahan state).
P6. Salah itu murah: Undo, bukan "Apakah Anda yakin?" di tiap langkah (konfirmasi hanya untuk aksi merusak yang tak bisa dibatalkan).
P7. Mode demo SELALU jelas (pita tetap "Mode demo - data tidak tersimpan permanen" atau sesuai kenyataan) + jalur naik ke akun nyata TANPA kehilangan data.

### 5.2 Layar & spesifikasi
A. Pembukaan pertama (#demo) - Tanpa layar daftar/login yang menghalangi. Demo terisi 8-12 produk contoh (foto/emoji besar). Satu petunjuk singkat tertanam ("Ketuk produk untuk menjual") yang hilang setelah ketukan pertama; BUKAN tur 6 langkah modal.
B. Layar jual (utama) - Bilah atas: nama usaha kecil, pencarian (ikon -> bidang), indikator online/offline (pil kecil). Kategori: chips gulir horizontal tinggi 40px, target >= 44px, bayangan tepi sebagai petunjuk gulir, chip aktif kontras jelas (bukan hanya warna). Grid produk: 2 kolom (lebar < 400px), 3 kolom (>= 600px). Kartu produk >= 152x112px, nama maks 2 baris (ellipsis), harga tabular-nums tebal, foto/inisial. Seluruh kartu = target. Badge jumlah di kartu saat sudah di keranjang; stok rendah = penanda, bukan hanya warna. Bilah bawah sticky (64-72px + safe-area): "N item | Rp total | [Bayar]" - tombol Bayar >= 52px tinggi, lebar >= 40% bilah. Mengetuk bilah (di luar Bayar) membuka keranjang (sheet).
C. Keranjang (bottom sheet) - Tampil "peek" 72px; tarik ke atas penuh; tutup dengan tarik ke bawah/tombol/area gelap. Baris item: nama, harga satuan, stepper [-] qty [+] masing-masing 44-48px, jarak >= 8px; ketuk angka qty membuka input numerik; geser untuk hapus + Snackbar "Urungkan" 5 dtk. Subtotal/diskon/total: total 28-32px tebal; diskon di sheet terpisah. overscroll-behavior: contain; scroll body terkunci; tidak melompat saat keyboard muncul.
D. Pembayaran - Pilihan metode: Tunai / QRIS / (lainnya) berupa tombol besar 56px, bukan dropdown. Tunai: tombol "Uang pas" paling menonjol; chip nominal cepat (50rb, 100rb, ...) dihitung dari total; keypad numerik tersendiri (tombol 56px) ATAU keypad native; kembalian dihitung LIVE dan ditampilkan raksasa (>= 36px). Uang kurang = merah + teks, tombol Selesai nonaktif dengan alasan terbaca. QRIS: kode di tengah, kecerahan layar dinaikkan bila memungkinkan, total terlihat, tombol "Sudah dibayar" jelas berbeda dari "Batal"; tidak ada auto-lock layar saat menunggu.
E. Layar sukses - Centang animasi singkat (<= 400 ms, hormati reduced-motion), KEMBALIAN raksasa (dibacakan kasir ke pelanggan), 2 tombol: [Struk] (sekunder) dan [Transaksi baru] (primer, 56px); keranjang otomatis kosong; fokus kembali ke layar jual.
F. Struk - Pratinjau lebar 58mm; tombol Cetak/WhatsApp/Simpan sama besar; gagal cetak = pesan jelas + cara ulang, bukan hilang diam-diam.
G. Produk (tambah/ubah) - Formulir satu kolom; label di atas input (bukan placeholder-sebagai-label); harga dengan awalan "Rp" dan pemisah ribuan; keypad numerik; "Simpan" sticky bawah; simpan & tambah lagi. Foto: ambil/pilih, pratinjau, kompres otomatis, batas ukuran tampil jelas.
H. Laporan/rekap - Angka ringkas di atas (Omzet, Jumlah transaksi, Laba) 28px; daftar transaksi di bawah dengan header sticky per hari; ekspor sebagai aksi sekunder; filter tanggal berupa chips (Hari ini, 7 hari, Bulan ini).
I. Pengaturan & data - Tempatkan "Cadangkan data" menonjol dan tampilkan "Terakhir dicadangkan: ..." (bukan tersembunyi di submenu).
J. Kondisi sistem - Offline: pil permanen kecil + perilaku normal (jangan modal yang menghalangi). Memuat: kerangka (skeleton), bukan layar putih/spinner penuh. Kosong: ilustrasi kecil + SATU aksi ("Tambah produk pertama"). Galat: pesan manusiawi + aksi ulang; tidak pernah kode galat mentah. Pembaruan aplikasi: banner non-modal "Ada versi baru - Muat ulang" yang TIDAK memaksa muat ulang saat ada keranjang aktif.

### 5.3 Rubrik kritik per layar (agent beri nilai 0/1/2 setiap kriteria, tulis bukti)
1 Hierarki 2 Target sentuh (>= 48px utama, >= 44px lain, jarak >= 8px) 3 Jangkauan jempol (aksi utama di 40% bawah) 4 Keterbacaan (font >= 16px isi, >= 12px terkecil, kontras angka kunci >= 7:1 di kasir) 5 Umpan balik (<100 ms) 6 Pencegahan & pemulihan galat (Undo, validasi inline, pesan jelas) 7 Keadaan (kosong, memuat, galat, offline, penuh, izin ditolak) 8 Keyboard & input (keypad, enterkeyhint, tak menutupi aksi, tak melompat) 9 Konsistensi (komponen, ikon, istilah, posisi tombol sama di semua layar) 10 Kecepatan terasa (skeleton, optimistic UI, tak ada layar penghalang) 11 Aksesibilitas (label, fokus, kontras, dukungan teks 200%) 12 Kejujuran (label sesuai akibat; tak ada tombol palsu; demo vs nyata jelas).
Skor < 18/24 per layar = BELUM BOLEH rilis. Target selesai: semua layar >= 20/24, tidak ada kriteria bernilai 0.

## 6. HALAMAN LAIN - KRITERIA MINIMUM
Kalkulator (/alat/*): satu kolom; hasil LIVE; angka hasil 32px+; keypad numerik; tombol "Bagikan hasil" (WhatsApp) 48px; penjelasan rumus dilipat; tidak ada iklan/pop-up menutupi.
Halaman produk (pajak/website/delivery/ai/automation/naik-kelas/umkm): satu tujuan per halaman, satu CTA utama, struktur identik (hero singkat -> bukti -> cara kerja -> harga -> CTA). Periksa kasir.html vs umkm.html (L4/L15): tentukan satu halaman kasir sebagai kanonik.
Halaman legal: tipografi nyaman (16-18px, lebar baris <= 70ch, daftar isi lompat), bukan dinding teks.
404: tombol ke beranda & ke kasir, ringan.

## 7. SISTEM DESAIN - ATURAN KONKRET
Token (ukur dulu apa yang sudah ada, jangan menimpa tanpa alasan): Spasi kelipatan 4 (4,8,12,16,24,32,48,64). Gutter mobile 16px (20px di >= 390px). Tipografi mobile: caption 13/18 (min mutlak 12), isi 16/24, lead 18/28, H3 20/28, H2 26/32, H1 30/36 (desktop 44-52). Uang: tabular-nums, bobot 600-700. Pengecualian: input teks >= 16px (cegah auto-zoom iOS). Radius: 12 (kontrol), 16 (kartu), 24 (sheet). Elevasi: 2 tingkat saja. Tombol: primer 52px mobile, sekunder 44-48px; padding horizontal 20px; ikon 20-24px; jarak antar 12px. Warna: primer #2453EB (putih di atasnya ~6,0:1), sukses/warning/bahaya, netral 9 langkah. Setiap pasangan teks/latar WAJIB >= 4,5:1; angka kunci kasir >= 7:1. Info tak boleh hanya warna. Motion: 120-200 ms mikro, 250-300 ms sheet; easing konsisten; hormati prefers-reduced-motion. Mode gelap: token terpisah (color-scheme + prefers-color-scheme), uji kontras ulang. Komponen konsisten di seluruh situs & aplikasi: Tombol (4 varian x 3 status), Input uang, Stepper, Chip, Kartu, Sheet, Dialog, Snackbar, Pil status, Accordion, Segmented control, Skeleton, Empty state, Toast galat.

## 8. DAFTAR "HAL TERKECIL" (centang satu per satu)
Meta & viewport: [ ] meta viewport TETAP width=device-width, initial-scale=1, viewport-fit=cover (JANGAN menambah maximum-scale / user-scalable=no di kasir.html - itu melarang zoom, melanggar aksesibilitas) [ ] touch-action: manipulation pada tombol/kontrol [ ] meta format-detection telephone=no [ ] theme-color sesuai mode; ikon apple-touch 180px; manifest ikon maskable [ ] lang="id"; hyphens: auto + overflow-wrap; text-wrap: balance (judul), pretty (isi)
Angka & mata uang: [ ] "Rp" dan angka tak pernah terpisah baris (no-break space / nowrap pada span uang) [ ] satuan ("/bln", "/outlet/bulan") tak yatim di baris sendiri [ ] semua angka uang: tabular-nums, rata kanan di tabel/daftar, pemisah titik konsisten [ ] tanda minus "-" tipografis + teks (bukan hanya merah) [ ] angka sangat besar (Rp 9.999.999.999) tak menjebol kartu/hero/struk (uji ellipsis/shrink)
Sentuh & gestur: [ ] semua target >= 44x44 (utama 48-52), jarak >= 8px; ikon-sanya punya area sentuh diperluas [ ] :active state terlihat pada SETIAP tombol/kartu; -webkit-tap-highlight-color diset sengaja [ ] user-select: none pada tombol POS; teks struk/harga tetap bisa disalin [ ] tidak ada tombol hanya-hover; tooltip diganti tekan-lama atau teks tetap [ ] kartu-tautan tak terpicu saat menyeret/scroll; carousel scroll-snap tanpa menghalangi gestur Back [ ] pull-to-refresh/overscroll tidak mereset keranjang [ ] gestur Back sistem menutup sheet/menu dahulu, bukan keluar aplikasi
Layout & viewport: [ ] tanpa scroll horizontal di 320px (termasuk tabel & kode) [ ] 100vh -> 100dvh/svh; bilah alamat HP tak memotong bilah bawah [ ] safe-area: padding env(safe-area-inset-bottom) pada bilah sticky; env(top) pada header [ ] bilah sticky tak menutupi fokus/jangkar (scroll-padding/margin) [ ] landscape 640x360: kasir tetap bisa dipakai (grid + keranjang berdampingan) [ ] teks sistem 130-150% dan zoom 200%: tak terpotong
Input & keyboard: [ ] type/inputmode benar (numeric/decimal/tel/email/search); enterkeyhint [ ] autocomplete/autocapitalize/spellcheck sesuai [ ] keyboard tak menutup bidang aktif/tombol aksi (visualViewport); tombol Selesai tetap terjangkau [ ] font input >= 16px (iOS tak zoom); kursor tak melompat saat format ribuan [ ] paste "Rp 60.000.000" dibersihkan; huruf ditolak; negatif ditolak; nol di depan dibereskan [ ] label di atas input; error inline di bawah input + fokus pindah ke error pertama
Umpan balik & status: [ ] tombol yang memicu proses: nonaktif + spinner + teks berubah; tak bisa diketuk dua kali [ ] toast/snackbar: di atas bilah bawah, auto-hide 4-5 dtk, ada Urungkan, aria-live [ ] indikator online/offline permanen kecil; perubahan status diumumkan halus [ ] skeleton untuk daftar/gambar; tidak ada layar putih >300 ms tanpa isyarat [ ] halaman offline kustom; galat jaringan ramah + aksi ulang
Tipografi & warna: [ ] tidak ada teks < 12px; isi >= 16px; tinggi baris >= 1,4; lebar baris <= 70ch [ ] teks di atas gambar punya gradien/scrim; kontras diukur di titik terburuk [ ] tautan dalam teks isi dapat dibedakan tanpa warna (garis bawah) [ ] :focus-visible 2px kontras di semua kontrol; urutan Tab logis [ ] mode gelap: gambar/ikon tidak "bocor"
Performa terasa: [ ] LCP < 2,5 dtk, CLS < 0,1, INP < 200 ms pada 4G lambat + HP menengah - ukur, jangan tebak [ ] font: preload 1-2 berkas, font-display: swap, fallback bermetrik mirip [ ] JS tak memblokir render; widget kalkulator dimuat malas; aset dekoratif tak mengganggu LCP [ ] animasi hanya transform/opacity; berhenti saat tab tak aktif; hormati reduced-motion
Aksesibilitas: [ ] satu H1; heading berurutan; landmark (header/nav/main/footer); skip link berfungsi [ ] nama aksesibel tombol/kartu singkat & unik [ ] gambar dekoratif alt=""; ikon-sanya punya aria-label [ ] hasil kalkulator & toast memakai aria-live; dialog/sheet menjebak fokus & mengembalikannya [ ] TalkBack/VoiceOver: alur jual penuh lulus
Konsistensi: [ ] istilah & ikon sama di semua halaman (Bayar vs Selesaikan, Struk vs Nota) [ ] posisi tombol utama sama di semua layar [ ] urutan tombol: aksi utama kanan/atas, batal kiri/bawah [ ] ikon satu keluarga, satu ketebalan, ukuran 20/24

## 9. MATRIKS UJI
Lebar CSS px: 320, 360, 375, 390, 412, 430, 600, 768, 1024, 1280, 1440. Tinggi efektif mobile: 568, 640, 667, 740, 800+. Orientasi portrait + landscape (640x360). Perangkat/engine: Android Chrome, Samsung Internet, iPhone Safari (SE & Pro), in-app browser WA/IG/FB, PWA standalone. Kondisi: 3G lambat + CPU 4-6x, offline, hemat data, mode gelap, reduced-motion, teks 130/150%, zoom 200%/400%, kecerahan maksimum (filter), simulasi buta warna. Ritual: screenshot SEBELUM & SESUDAH tiap halaman/layar penting pada 360x800 dan 390x844 (+ 768 & 1280 untuk landing).

## 10. URUTAN KERJA (R7 -> R0)
Fase 0  Baseline: screenshot semua layar + ukur Lighthouse/CWV. Verifikasi setiap [H]. Tulis "terbukti / tidak terjadi". JANGAN memperbaiki sebelum terbukti.
Fase 1  Aplikasi kasir (R7-R3): layar sukses, pembayaran, keranjang, grid produk, bilah bawah, keadaan, pita mode demo, input uang. Rubrik >= 18/24 (target 20/24).
Fase 2  Pintu masuk demo (R2): #demo berisi data, tanpa penghalang, cepat di 3G; jalur demo -> akun tanpa kehilangan data.
Fase 3  Landing atas (R1-R0): bar atas, header, hero (H1 <= 4 baris, CTA di layar pertama), aset hero baru, bingkai HP, satu tombol utama.
Fase 4  Harga & CTA: urutan, toggle/penanda paket utama, tombol WhatsApp, label+tujuan jujur.
Fase 5  Modul/kalkulator/pajak: kartu ringkas, widget dulu aturan belakangan, ritme seksi.
Fase 6  Footer, FAQ/langkah mulai (komponen), tombol ke atas, polesan global, daftar bagian 8.
Fase 7  Halaman lain (bagian 6), mode gelap, landscape, aksesibilitas penuh, regresi akhir.

ATURAN AGENT:
- Jangan ubah kata/kalimat. Bila terpaksa memendekkan agar muat di UI, catat di COPY-NANTI.md (teks lama -> teks baru -> alasan).
- Kesalahan fakta pajak/QRIS: JANGAN perbaiki; catat saja (rujuk brief audit F1-F11).
- Jangan menambah fitur/halaman baru, kecuali komponen struktur yang disebut di sini (FAQ, langkah mulai, tombol WhatsApp, toggle paket) - isi teksnya ditunda.
- Tidak menambah pustaka UI baru; utamakan CSS native (scroll-snap, :has, dvh, text-wrap, inputmode).
- Satu perubahan = satu commit kecil; sertakan screenshot sebelum/sesudah di deskripsi.
- Setiap [H] wajib diverifikasi di perangkat/emulator nyata; sertakan bukti.
- Keputusan visual yang butuh pemilik (gaya foto, ilustrasi hero, nama paket, warna) -> daftar "Butuh keputusan pemilik" + 2-3 opsi + rekomendasi.
- Jangan mengurangi aksesibilitas demi estetika.

SERAHAN: A. ui-ux-findings.md (ID | halaman/layar | perangkat | bukti [H terbukti?] | tingkat | perbaikan | status) B. Screenshot sebelum/sesudah (matriks bagian 9) dalam folder terstruktur C. Skor rubrik 24-poin per layar kasir (sebelum & sesudah) D. Laporan Lighthouse + CWV mobile sebelum/sesudah E. COPY-NANTI.md F. Daftar "Butuh keputusan pemilik".

DEFINISI SELESAI (angka, bukan perasaan):
[ ] CTA utama beranda terlihat tanpa scroll di 360x640; H1 <= 4 baris di 360px
[ ] Penjualan 1 item tunai uang pas <= 4 ketukan; terukur & direkam
[ ] Semua target sentuh utama >= 48px, lainnya >= 44px, jarak >= 8px (audit otomatis + manual)
[ ] Tidak ada scroll horizontal di 320px; tidak ada teks < 12px; isi >= 16px
[ ] Kontras: semua teks >= 4,5:1; angka kunci kasir >= 7:1
[ ] CLS < 0,1; LCP < 2,5 dtk; INP < 200 ms pada profil 4G lambat + HP menengah
[ ] Semua layar kasir skor >= 20/24; tidak ada kriteria bernilai 0
[ ] Mode demo selalu jelas; jalur demo -> akun tanpa kehilangan data teruji
[ ] Bar atas hilang/1 baris; tidak ada seksi testimoni "CONTOH"; urutan seksi sesuai L32
[ ] Setiap [H] berstatus "terbukti & diperbaiki" atau "tidak terjadi"
[ ] Uji TalkBack/VoiceOver alur jual penuh: lulus

## 11. SENGAJA DITUNDA (JANGAN DISENTUH SEKARANG)
Seluruh kata & kalimat, termasuk kesalahan fakta pajak/QRIS yang sudah tercatat (F1 satuan "/bln", F2 angka Rp91.667, F3 "maksimal 4 tahun", F8 "QRIS dinamis", F12 "terenkripsi", F14 label "Sudah jalan" pada Website). Tahap kata dikerjakan SETELAH UI/UX stabil.
Fungsi/rumus/backend/pembayaran/keamanan (brief audit).
Isi FAQ, isi testimoni, judul baru - cukup siapkan komponennya.

### Keputusan owner (konfirmasi, JANGAN ditanya ulang)
K1. WhatsApp: belum ada nomor nyata -> struktur tombol dipasang, label jujur "nomor menyusul" (non-dead control).
K3. QRIS: "QRIS, nominal terisi otomatis".
K5. Testimoni: keep labeled "Contoh" (tapi per L32: sembunyikan seksi di produksi sampai isi nyata - ikuti L32).
K7. Pronouns: "Anda" untuk legal, "kamu" untuk semua yang lain.
K10. CTA utama: "Coba demo kasir" (tanpa trial signup).
K12. Pricing: single source of truth (jangan bikin angka baru).
Preserve anchors: #main #modul #alat #pajak #harga #demo. Anti-slop, light mode, #2453EB.
