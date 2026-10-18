# UI/UX FINDINGS — MASTER TRACKER (SERAHAN A)

Brief sumber: `audit/uiux/brief-uiux.md` (18 Okt 2026). Target: `index.html` (landing olano.xyz) + `app/kasir.html` (POS PWA, start_url manifest).
Status file ini: **SCAFFOLD**. Kolom `ID | halaman/layar | perangkat | tingkat` sudah diisi dari brief. Kolom `perbaikan` dan `status` **DISENGAJA KOSONG** — diisi subagent verifikasi miliknya masing-masing (lihat marker SECTION).

---

## Skema kolom (FIXED — jangan ubah urutan/nama kolom)

`ID | halaman/layar | perangkat | [H] terbukti? (TERBUKTI/TIDAK_TERJADI/-) | tingkat (K/T/S/R) | perbaikan (1 line) | status (TODO/IN_PROGRESS/DONE/DELEGATED)`

- **[H] terbukti?** — `-` = belum diverifikasi. Setiap baris bertanda `[H]` (hipotesis) WAJIB dibuktikan di layar sungguhan (perangkat/emulator + throttle) sebelum diperbaiki; bila tidak muncul, tulis `TIDAK_TERJADI`. `[S]` = sudah terbaca dari teks/source, tetap konfirmasi di layar nyata.
- **perbaikan** — SATU baris, kata kerja konkret + ukuran/target bila ada (contoh: "satu tombol 48px di header mobile, sisanya ke menu").
- **status** — `TODO → IN_PROGRESS → DONE` (DONE hanya bila bukti sebelum/sesudah menempel). Baris yang ternyata butuh keputusan owner BARU: tulis `DELEGATED` + daftarkan di `keputusan-pemilik.md` bagian MASIH DIBUKA.
- **Bukti** — screenshot ke `audit/uiux/screenshots/before|after/` (nama: `<ID>-<device>-<before|after>.webp`), rujuk nama file di kolom perbaikan bila relevan.

Legenda perangkat: `m360` = 360x640 portrait (efektif ±360x560 setelah bar browser); `l640` = 640x360 landscape; `360x800` = sesuai matriks uji brief §9.

---

## ATURAN SUBAGENT (wajib baca sebelum menulis baris)

1. **Edit HANYA blok SECTION milikmu** (marker komentar HTML di bawah). Jangan sentuh baris di blok lain.
2. Kata & kalimat DIBEKUKAN (brief §11). Teks yang terpaksa berubah demi muat di UI → catat `COPY-NANTI.md`. Fakta F1-F14 yang dibekukan DILARANG disentuh (daftar di `COPY-NANTI.md` bagian BEKU).
3. Keputusan yang sudah **DIKONFIRMASI owner** (K1, K3, K5, K7, K10, K12) **jangan ditanya ulang** — lihat `keputusan-pemilik.md`; langsung dipakai sebagai dasar perbaikan.
4. Preserved anchors: `#main #modul #alat #pajak #harga #demo` — jangan dihapus/diubah. Light mode; warna primer `#2453EB`; anti-slop (jangan tambah ornamen/pustaka UI baru; CSS native dulu).
5. Fase 0 (verifikasi): **read-only pada source** — catat temuan, JANGAN memperbaiki sebelum terbukti (brief §10).
6. Satu perubahan = satu commit kecil + screenshot sebelum/sesudah (berlaku di gelombang perbaikan; pembagian file di `DELEVEN.md`).

## PEMBAGIAN KEPEMILIKAN (ringkas — detail teknis di `DELEVEN.md`)

| Blok SECTION di file ini | Subagent findings | Subagent perbaikan | File yang boleh disentuh (gelombang perbaikan) |
|---|---|---|---|
| landing L1-L37 + R0-R2 | landing-findings | landing-fix | `index.html`, zona landing `main.css`, `motion.js` |
| POS A-J + R3-R7 | pos-findings | pos-fix | `app/kasir.html`, zona `/* POS APP */` `main.css` |
| C1-C3 (ukur) | perf-findings | — (hanya ukur + laporkan) | tidak mengubah source |
| token/main.css zona bersama + `shared.js` + `config.js` + `sw.js` + `manifest.json` | — (verifikasi lintas) | **shared-fix (SATU pemilik)** | zona token `main.css`, `assets/js/shared.js`, `assets/js/config.js`, `sw.js`, `manifest.json` |

Artefak lanjutan (dibuat oleh subagent bersangkutan, bukan file ini): skor rubrik 24-poin per layar kasir → `audit/uiux/rubrik-kasir.md` (pos-findings, SERAHAN C); Lighthouse + CWV mobile sebelum/sesudah → `audit/uiux/laporan-lighthouse.md` (perf-findings, SERAHAN D); screenshot terstruktur → `audit/uiux/screenshots/` (SERAHAN B).

---

<!-- SECTION: landing L1-L37 (owner: landing-findings subagent) -->

### Landing — bar pengumuman
| ID | halaman/layar | perangkat | [H] terbukti? | tingkat | perbaikan | status |
|---|---|---|---|---|---|---|
| L1 | bar pengumuman: 4 fakta + tombol x, membungkus/terpotong, mengulang hero | m360 | - | K | 1 pesan 1 baris di mobile (fakta ke-2/3 dibungkus .tk-x, disembunyikan <=759px; kata utuh di desktop), font 12px, tutup 44x44, tutup animasi max-height->0 tanpa CLS (sessionStorage tetap jalan) | DONE |
| L2 | "PWA v24" = versi internal, tak berguna pengguna | m360 | - | T | | |

### Landing — header & navigasi
| ID | halaman/layar | perangkat | [H] terbukti? | tingkat | perbaikan | status |
|---|---|---|---|---|---|---|
| L3 | dua tombol "Masuk" + "Coba kasir gratis" tujuan sama; sesak di HP | m360 | - | T | | |
| L4 | menu desktop vs mobile beda isi ("Kasir UMKM" hanya di salah satu) | m360 + desktop | - | T | | |
| L5 | menu mobile: tinggi baris, CTA dasar panel, Esc, fokus-lock, scroll-lock, reduced-motion | m360 | - | T | menu mobile: Esc/Back menutup, focus trap (Tab/Shift+Tab), scroll body terkunci (overflow hidden), tanpa scroll-bleed (overscroll contain), panel 160ms <200ms, fokus balik ke pemicu; reduced-motion guard global | DONE |
| L6 | jangkar #modul/#alat/#pajak/#harga tertutup header sticky (scroll-padding) | m360 | - | S | | |
| L7 | logo menaut ke /index.html, bukan "/" | semua | - | R | logo header & footer href='/' (bukan index.html) | DONE |

### Landing — hero
| ID | halaman/layar | perangkat | [H] terbukti? | tingkat | perbaikan | status |
|---|---|---|---|---|---|---|
| L8 | H1 ~14 kata → CTA terdorong keluar layar pertama | m360 | - | K | | |
| L9 | 3 kartu angka melayang + catatan "Basis" tak terbaca | m360 | - | K | fnote 11->12px; kontras gray-500 terukur: 7.16:1 putih / 6.13:1 E4EEFF / 5.24:1 C9DEFF — semua >=4.5:1 | DONE |
| L10 | aset hero langit/awan/grid = kebalikan janji "tetap jalan saat internet mati" | m360 + desktop | - | K | O-1 dieksekusi (Opsi 3): phone frame warung berisi screenshot kasir asli (aset hero-phone-warung 17.7+6.8KB, fetchpriority=high, w/h eksplisit); sky daydream keluar dari homepage (CSS di-scope body:not(.home), halaman alat tetap); keputusan-pemilik O-1 = DIPUTUSKAN, rollback via git revert | DONE |
| L11 | lapisan dekoratif beranimasi/parallax → jank & boros baterai | m360 | - | S | cloud-drift OFF @ (hover:none),(pointer:coarse); motion.js gate 'pointer halus' + maxTouchPoints==0 -> wheel-hijack/parallax/magnetic OFF di sentuh; verif l-cloud none/0s & wheel tak dicegah @360 touch | DONE |
| L12 | satu tombol di hero — PERTAHANKAN, jangan tambah tombol kedua | m360 | - | S | | |

### Landing — blok tangkapan layar produk
| ID | halaman/layar | perangkat | [H] terbukti? | tingkat | perbaikan | status |
|---|---|---|---|---|---|---|
| L13 | seluruh tangkapan layar + keterangan = 1 tautan raksasa; gambar landscape tak terbaca di HP | m360 | - | K | gambar hero bukan lagi tautan raksasa (figure aria-hidden, alt kosong) + tautan teks 'Buka demo kasir' 48px terpisah; COPY-NANTI #3 | DONE |

### Landing — seksi Modul
| ID | halaman/layar | perangkat | [H] terbukti? | tingkat | perbaikan | status |
|---|---|---|---|---|---|---|
| L14 | 6 kartu penuh-tautan: sentuh tak sengaja, nama aksesibel panjang, ~6 layar | m360 | - | K | baris modul ringkas mobile 118-131px (desc line-clamp 1), chip rumus disembunyikan <=759px, guard drag-vs-tap a.modrow di motion.js v18 (drag >=8px batal, ketukan jalan) | DONE |
| L15 | baris "contoh" rumus satu-baris pecah acak di layar sempit | m360 | - | T | rumus contoh disembunyikan di <=759px (utuh di desktop/tablet & halaman tujuan); layout label-kiri/nilai-kanan ditunda tahap kata | DONE |
| L16 | lencana "Sudah jalan" x5 = kebisingan (lihat F14 — label di tahap kata) | m360 | - | T | badge 'Sudah jalan' x5 dihapus dari modlist; 'Segera hadir' dipertahankan; log COPY-NANTI #1 (label F14 tak diubah) | DONE |
| L17 | penghitung "05 aktif · 01 segera hadir" = info pendiri, bukan pengguna | m360 | - | S | penghitung '05 aktif - 01 segera hadir' dihapus (desktop juga) + rule CSS-nya | DONE |
| L18 | kartu "Automation" tampil aktif & bisa ditekan = jalan buntu | m360 | - | T | | |
| L19 | nomor 01-06 kesan urutan/peringkat palsu | m360 | - | S | | |

### Landing — seksi kalkulator
| ID | halaman/layar | perangkat | [H] terbukti? | tingkat | perbaikan | status |
|---|---|---|---|---|---|---|
| L20 | 4 kalkulator = daftar polos + teaser tanpa konteks | m360 | - | S | | |
| L21 | 3 seksi berturut bernuansa serupa, tanpa ritme visual | m360 | - | S | | |

### Landing — seksi Pajak (widget di beranda)
| ID | halaman/layar | perangkat | [H] terbukti? | tingkat | perbaikan | status |
|---|---|---|---|---|---|---|
| L22 | tembok teks aturan sebelum widget interaktif | m360 | - | K | mobile: widget dulu (display:contents + order), tembok aturan jadi accordion 'Lihat aturannya' >=44px; desktop 2 kolom tak berubah; teks aturan utuh | DONE |
| L23 | "Jenis usaha" 5 opsi: radio memakan 240px vertikal / dropdown kustom rawan | m360 | - | T | | |
| L24 | input omzet: prefix Rp, ribuan live, inputmode, tombol cepat, hasil LIVE | m360 | - | K | prefix Rp dalam kolom, ribuan live (kursor stabil di akhir), chip 10/30/60/100 jt, tombol clear, type=text + inputmode=numeric, paste 'Rp 60.000.000' dibersihkan | DONE |
| L25 | hasil kalkulator tertutup keyboard saat mengetik | m360 | - | K | #tax-out dipindah DI ATAS input (DOM) + scrollIntoView block:nearest saat mengetik; aria-live=polite dipertahankan | DONE |
| L26 | kartu hasil: dua kalimat tebal bersaing, tanpa hierarki angka | m360 | - | S | hasil kalkulator: angka >=32px (clamp 2rem-2.5rem) kolom + label 1 baris + .out-sub penjelas 14/12.5px + detail callout kecil; tabular-nums | DONE |

### Landing — seksi Harga
| ID | halaman/layar | perangkat | [H] terbukti? | tingkat | perbaikan | status |
|---|---|---|---|---|---|---|
| L27 | paket Pro tersembunyi di layar kedua, tanpa penanda "utama" | m360 | - | K | | |
| L28 | butir fitur Pro gabungan (3 hal + angka dalam satu butir) | m360 | - | T | butir gabungan dipecah 3 butir (AI harga | Foto | Tanya AI); kuota '60 foto/outlet/bulan' jadi teks sekunder 12px; log COPY-NANTI #2 | DONE |
| L29 | "Rp50rb/outlet/bulan" satuan membungkus baris, ukuran tak konsisten | m360 | - | T | | |
| L30 | jalur WhatsApp tanpa tombol terlihat (lihat K1 — label "nomor menyusul", non-dead) | m360 | - | K | tombol WA 48px di #harga, label jujur 'nomor menyusul' (K1), non-dead: klik membuka info; TODO shared-fix wave 3: swap ke <a wa.me> saat config wa terisi | DONE |
| L31 | dua CTA harga menuju tujuan identik, tanpa hierarki primer/sekunder | m360 | - | S | CTA harga: Pro (utama) solid btn-primary, Gratis outline btn-secondary | DONE |

### Landing — CTA penutup, testimoni, footer
| ID | halaman/layar | perangkat | [H] terbukti? | tingkat | perbaikan | status |
|---|---|---|---|---|---|---|
| L32 | seksi testimoni "CONTOH" tampil di produksi; CTA penutup jadi elemen terakhir (lihat K5) | m360 | - | K | seksi testimoni CONTOH hidden di produksi (flag, bukan hapus; renderer skip; data config tetap utuh); halaman -0.9 layar | DONE |
| L33 | footer 3 kolom + paragraf hukum: target sentuh sempit | m360 | - | T | footer mobile: 1 kolom + pemisah dashed, semua tautan min-height 44px, legal 3 baris di 360px; desktop tak berubah | DONE |

### Landing — global
| ID | halaman/layar | perangkat | [H] terbukti? | tingkat | perbaikan | status |
|---|---|---|---|---|---|---|
| L34 | tak ada FAQ / cara mulai / keamanan data (komponen struktur boleh dibuat, isi ditunda) | m360 | - | T | komponen FAQ (3 accordion) + 3 langkah berikon SEBELUM CTA penutup, placeholder honest 'isi menyusul' (R-23/R-38); faqH 510px @360 | DONE |
| L35 | tinggi total halaman > 9 layar di 360x800 | 360x800 | - | T | final 6963px = 8.70 layar @360x800 (baseline gelombang 8.88) — <=9 LULUS meski +FAQ/L34 (L32 membebaskan ruang) | DONE |
| L36 | tak ada tombol kembali-ke-atas pada halaman panjang | m360 | - | S | tombol kembali-ke-atas 44px kiri-bawah (jauh dari WA/CTA kanan), muncul scroll>2 layar, safe-area, smooth scroll (auto saat reduced-motion); uji overlap footer = False | DONE |
| L37 | skip link "Langsung ke isi" — pertahankan; pastikan terlihat saat fokus | m360 + keyboard | - | S | | |

<!-- /SECTION: landing L1-L37 -->

<!-- SECTION: POS A-J (owner: pos-findings subagent) -->

Catatan: layar A-J dinilai dengan **rubrik 24-poin** (brief §5.3, skor 0/1/2 × 12 kriteria), bukan skala K/T/S. Skor per layar ditulis di `rubrik-kasir.md`. Kolom `tingkat` = `-`. Prinsip P1-P7 (satu tangan, total selalu terlihat, kontras ≥7:1 angka kunci, dsb.) adalah rubrik penilaian tiap layar.

| ID | halaman/layar | perangkat | [H] terbukti? | tingkat | perbaikan | status |
|---|---|---|---|---|---|---|
| A | pembukaan pertama #demo — tanpa layar penghalang, 8-12 produk contoh, petunjuk 1 kalimat (bukan tur 6 langkah) | m360 | TERBUKTI | - | oversell guard stok 0, petunjuk "Ketuk produk untuk menjual" (hilang setelah ketukan pertama), font kartu 14/16/12px, chips 44px, header diringkas jadi 1 tombol Menu, `:active` grid | DONE |
| B | layar jual (utama) — kategori chips, grid produk 2 kolom, bilah bawah sticky "N item \| Rp total \| Bayar" | m360 | TERBUKTI | - | chip kategori beneran memfilter (bug `render()`), badge qty di kartu, empty state pencarian + 1 aksi, scan mati disembunyikan, search 16px anti-zoom | DONE |
| C | keranjang (bottom sheet) — peek 72px, stepper qty 44-48px, geser-hapus + Undo | m360 | TERBUKTI (baru) | - | sheet keranjang baru: bar-info tap -> sheet, stepper ± 44px, tombol hapus + Snackbar Urungkan 5 dtk, stok sinkron dua arah | PARTIAL (peek/gestur tarik & geser-hapus diganti tap tombol; fungsi koreksi qty lengkap) |
| D | pembayaran — Tunai/QRIS tombol besar 56px, "Uang pas", chip nominal, kembalian LIVE raksasa | m360 | TERBUKTI | - | uang kurang = merah + slide nonaktif + guard kedua di pay(), "Uang pas" paling menonjol + chip 50rb/100rb, kembalian 36px, metode 56px, Transfer/Lainnya disembunyikan, cash inputmode+enterkeyhint | DONE |
| E | layar sukses — kembalian raksasa, [Struk] + [Transaksi baru], keranjang kosong otomatis | m360 | TERBUKTI | - | kembalian 40px tabular-nums saat TUNAI cash>total, urutan tombol dibalik (Selesai primer / Struk sekunder), fokus kembali ke layar jual | DONE |
| F | struk — pratinjau 58mm, Cetak/WhatsApp/Simpan, gagal cetak = pesan jelas | m360 | TERBUKTI | - | gagal share = toast pesan + coba lagi (bukan `.catch(){}`), "Method:" -> "Metode:" | DONE |
| G | produk (tambah/ubah) — form satu kolom, label di atas input, input uang, Simpan sticky | m360 | TERBUKTI (baru) | - | form Tambah produk baru via Menu: label di atas input, parse "12rb"=12.000, Simpan & tambah lagi, validasi inline, escHtml anti-XSS, tombol Simpan 52px | DONE |
| H | laporan/rekap — angka ringkas atas, header sticky per hari, filter chips | m360 | TERBUKTI (baru) | - | layar Rekap harian baru: Omzet/Transaksi/Item 24px, filter chips Hari ini/7 hari/Bulan ini, daftar transaksi terbaru, dibaca dari IDB nyata | DONE |
| I | pengaturan & data — "Cadangkan data" menonjol + "Terakhir dicadangkan: ..." | m360 | TERBUKTI (baru) | - | layar Data & cadangan baru: unduh JSON (produk+transaksi), "Terakhir dicadangkan: <timestamp>" | DONE |
| J | kondisi sistem — offline/memuat/kosong/galat/pembaruan (pil permanen, skeleton, banner non-modal) | m360 + l640 | TERBUKTI | - | SW terdaftar di kasir.html (reload offline = aplikasi, bukan dino), antre offline nyata dari IDB ("Offline · N antre" akurat setelah reload), banner pembaruan non-modal, empty state | DONE |

Semua layar uji juga di `l640` (landscape, keranjang & grid berdampingan) dan kondisi offline (brief §9).

<!-- /SECTION: POS A-J -->

<!-- SECTION: R0-R7 (owner: R7-R3 + R2 pos-findings; R1-R0 landing-findings) -->

R-chain = rantai sebab-akibat dari brief §R-CHAIN; diverifikasi per fase urutan kerja (Fase 1: R7-R3, Fase 2: R2, Fase 3: R1-R0).

| ID | halaman/layar | perangkat | [H] terbukti? | tingkat | perbaikan | status |
|---|---|---|---|---|---|---|
| R7 | besok dibuka lagi — hasil transaksi terasa BERES (kembalian jelas, struk, rekap harian) | m360 | SEBAGIAN -> SEBAGIAN BESAR TERBUKTI | - | rekap harian + cadangkan data + kembalian raksasa + struk: alur "beres" lengkap; sinkronisasi ke server tetap simulasi (tidak ada backend; klaim UI disesuaikan perilaku antre IDB) | PARTIAL |
| R6 | transaksi selesai — layar sukses tanpa ragu "tersimpan?" | m360 | TERBUKTI | - | kembalian raksasa di sukses, 2 tombol jelas (Selesai primer), keranjang kosong otomatis | DONE |
| R5 | bayar tidak salah tekan — tombol Bayar besar, total selalu terlihat | m360 | TERBUKTI | - | "Uang pas" + chip nominal, uang kurang diblokir merah, slide nonaktif saat short, konfirmasi risiko tepat sasaran | DONE |
| R4 | keranjang terbaca sekilas — item, qty, subtotal; ubah qty tanpa bidik target kecil | m360 | TERBUKTI | - | sheet keranjang: baris item + harga satuan + stepper ± 44px + subtotal 28px + hapus/Undo | DONE |
| R3 | tambah produk 1 ketukan — grid besar + produk contoh | m360 | TERBUKTI | - | grid kartu besar, 8 produk contoh, stok 0 diblokir + label habis, badge qty | DONE |
| R2 | aplikasi terbuka cepat — <3 dtk di 3G; tak ada layar login penghalang demo | m360, 3G lambat | TERBUKTI (localhost) | - | #demo tetap tanpa penghalang; SW v29 meng-cache aset kasir; uji throttle 3G belum diulang di gelombang ini | PARTIAL |
| R1 | CTA ditekan & tahu akibatnya — label & tujuan jujur, terlihat tanpa scroll | m360 | - | - | | |
| R0 | percaya dalam 5 detik — hero: apa ini, untuk siapa, bukti apa; satu pesan satu tombol | m360 | - | - | | |

<!-- /SECTION: R0-R7 -->

<!-- SECTION: C1-C3 (owner: perf-findings subagent) -->

Angka sasaran TERUKUR (brief §C). Hasil ukur (angka + kondisi throttle + screenshot/video) dicatat di kolom perbaikan; status DONE hanya bila angka tercapai dan terekam.

| ID | halaman/layar | perangkat | [H] terbukti? | tingkat | perbaikan | status |
|---|---|---|---|---|---|---|
| C1 | penjualan 1 item tunai uang pas: MAKSIMAL 4 ketukan (produk → Bayar → Uang pas → Selesai) | m360, POS | - | - | | |
| C2 | CTA beranda → produk pertama masuk keranjang: ≤ 10 detik di 3G (demo berisi data) | m360, 3G lambat + CPU 4x | - | - | | |
| C3 | CTA utama beranda terlihat TANPA scroll pada 360x640 (efektif ±360x560) | m360 | - | - | | |

C1-C3 = pula bagian dari DEFINISI SELESAI (brief §10 akhir) bersama: H1 ≤ 4 baris di 360px; target sentuh ≥48/44px; tanpa scroll horizontal 320px; teks ≥12px/isi ≥16px; kontras ≥4,5:1 (angka kasir ≥7:1); CLS<0,1 / LCP<2,5s / INP<200ms; semua layar kasir ≥20/24 tanpa kriteria 0; demo mode selalu jelas; bar atas hilang/1 baris; testimoni tak tampil; semua [H] berstatus final; TalkBack/VoiceOver alur jual lulus.

<!-- /SECTION: C1-C3 -->
