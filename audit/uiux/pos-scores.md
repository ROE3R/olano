# POS kasir.html — Baseline Fase 0: Skor Rubrik 12-Kriteria + Verifikasi [H]/R-Chain

Tanggal: 18 Oktober 2026 · Auditor: agent UI/UX (read-only, Fase 0) · Branch: `fix/ui-ux-audit-2026-10`
Sumber: `app/kasir.html` (528 baris), `assets/css/main.css`, `assets/js/config.js`
Metode: Chrome headless 154 (CDP, emulasi mobile 360x800 + 390x844, DSF 2) di server lokal `http://localhost:8901` (masih berjalan, port 8901, PID tercatat sebagai proses background `proc_90f1868aa61c`).

**Catatan kejujuran metode** (wajib dibaca sebelum memakai bukti):
- Ketukan diukur dengan `Input.dispatchMouseEvent` (koordinat pusat elemen) = tap nyata, bukan `element.click()`. Tap produk & grid terbukti 100% real. Tap tombol **Bayar** (y≈811, di bawah layout-viewport emulasi 800px) flaky di antara run karena quirk hit-test emulasi Chrome (bukan bug aplikasi); di run pertama Bayar real berfungsi (sheet terbuka), di run artefak dipakai fallback JS click — semua sudah ditandai di log. Geser-konfirmasi (drag knob) real di 2 run (transaksi tereksekusi: keranjang 0 item, `sheet-ok` open). Artefak E/F terakhir memakai jalur keyboard Enter (`kasir.html:484-486`) = jalur aksesibilitas resmi.
- Angka kontras dihitung dari token warna CSS (WCAG relative luminance), bukan tangkapan piksel.

---

## (a) Skor per layar — rubrik 12 kriteria, 0/1/2 tiap kriteria (maks 24)

Skor < 18 = belum boleh rilis (rubrik 5.3). **Semua layar yang ada < 20 target; tidak ada layar yang lolos penuh.**

| Layar | Ada? | Skor /24 | Kriteria gagal (bukti) |
|---|---|---|---|
| **A Pembukaan #demo** | ADA | **14** | 6 Pencegahan **0**: stok 0 masih bisa ditambah (oversell terukur: "stok 0" tetap `disabled:false`, keranjang 3 item Rp18.000 — `kasir.html:329-334` tanpa guard); logout tanpa konfirmasi. 4 Keterbacaan 1: nama produk 13px (`main.css:448`), stok 11px (`main.css:451`) < minimum 12px. 2 Target 1: chips kategori 38px (render `headBtns`/`chips` h=38) < 44px. 1 Hierarki 1: header 6+ elemen (brand, pil status, jam, chip demo, Buat akun, Keluar, Beranda — `kasir.html:17-28`). 5 Umpan balik 1: tak ada `:active` pada `.pos-item` (hanya `.btn:active`, `main.css:173`). 7 Keadaan 1: stok 0 tak tertangani. 8 Keyboard 1: `cash` `type=number` + tanpa `enterkeyhint` (`kasir.html:66`). 9 Konsistensi 1, 11 Aksesibilitas 1 (teks 11px, fokus sukses ke skip-link). +: petunjuk "Ketuk produk untuk menjual" **tidak ada** (`hintOnPage:false`; brief 5.2.A mewajibkan) — dihitung di 1 Hierarki. Screenshot: `01-A-pembukaan-demo-360x800.png` |
| **B Layar jual** | ADA | **13** | 6 Pencegahan **0**: oversell (di atas) + tidak ada cara menghapus/mengurangi item keranjang sama sekali + chip kategori **bohong** (klik "Keripik" → chip aktif tapi 8 produk semua tetap tampil; `render()` di `kasir.html:345` memanggil `render()` tanpa argumen sehingga `activeCat` diabaikan — terukur: `chipOn:"Keripik"`, names = 8 semua). 12 Kejujuran 1: tombol pindai **mati tanpa tanda** (`.pos-scan` tanpa handler, `kasir.html:32`), chip kategori palsu. 4 Keterbacaan 1: 13px/11px. 2 Target 1: chips 38px. 5 Umpan balik 1: badge jumlah di kartu **tidak ada** (`badgeDiKartu:0`; brief 5.2.B). 8 Keyboard 1: input cari 15px (`main.css:431`) → iOS auto-zoom; tanpa `enterkeyhint`. 1 Hierarki 1, 9 Konsistensi 1, 11 Aks 1. +: pencarian berfungsi ("kopi" → 2 item ✓), grid 2 kolom 150px ✓, bar sticky total 20px tabular kontras 18.7:1 ✓. Screenshot: `06-B-layar-jual-360x800.png`, `11-B-layar-jual-390x844.png`, `07-C-tap-bar-tanpa-sheet-keranjang-360x800.png` |
| **C Keranjang (sheet)** | **TIDAK ADA** | — (0) | Tap bilah bawah di luar Bayar (real + JS click) → **tidak ada sheet, tidak ada baris item, tidak ada stepper** (`anySheetOpen:false, cartRows:0, qtyStepper:0`; DOM hanya 3 sheet: bayar/sukses/qris). Brief 5.2.C seluruhnya absen: peek 72px, stepper 44-48px, geser-hapus + Snackbar Urungkan, subtotal/diskon/total 28-32px. Satu-satunya tempat melihat item = struk SETELAH bayar. Screenshot: `07-C-tap-bar-tanpa-sheet-keranjang-360x800.png` |
| **D Pembayaran** | ADA | **12** | 6 Pencegahan **0**: **uang kurang diterima diam-diam** — total Rp40.000, ketik 5.000 → tidak ada merah/teks/blokir; slide tetap aktif (`kembaliShown:"none", sldState:"sld"` tanpa disabled; `updateKembali` `kasir.html:391-396` hanya menangani c>t; brief 5.2.D: "Uang kurang = merah + teks, tombol Selesai nonaktif"). 7 Keadaan **0**: metode **Transfer/Lainnya = panel kosong tanpa aksi** (cash none, qris none, 0 tombol aksi — screenshot `14-D-metode-transfer-keadaan-kosong-360x800.png`). 4 Keterbacaan 1: kembalian hidup **14px** (terukur `font:"14px"`; brief: raksasa ≥36px). 2 Target 1: tombol metode 44px (brief minta 56px); **tidak ada tombol "Uang pas"** (`uangPasBtn:false`) dan **tidak ada chip nominal cepat** (`chipNominal:[]`). 5 Umpan balik 1, 8 Keyboard 1 (`type=number`, tanpa `enterkeyhint`; slide di dasar sheet berpotensi tertutup keyboard — tak ada visualViewport), 9 Konsistensi 1 (dua jalur QRIS), 11 Aks 1 (fokus tak ter-trap). +: QRIS dinamis valid (payload EMVCo 136 char, `000201010212…`), kembalian LIVE ✓, slide punya aria-label + Enter ✓. Screenshot: `03-D-sheet-pembayaran-tunai-360x800.png`, `03b-D-kembalian-hidup-360x800.png`, `08-D-uang-kurang-slide-masih-aktif-360x800.png`, `09-D-qris-dalam-sheet-360x800.png`, `10-D2-qris-layar-penuh-360x800.png` |
| **E Layar sukses** | ADA | **16** | 1 Hierarki 1: **kembalian tidak tampil sama sekali di layar sukses** (terukur `kembalianDiSukses:false` pada transaksi tunai; brief 5.2.E: "KEMBALIAN raksasa"). 4 Keterbacaan 1 (angka kunci pasca-transaksi absen). 9 Konsistensi 1: tombol primer justru "Cetak / Bagikan struk" (335px) dan "Selesai" (101px, secondary) — brief minta [Struk] sekunder + [Transaksi baru] primer. 11 Aks 1: fokus mendarat di **skip-link** setelah sukses (terukur `focusEl:"Langsung ke kasir"`), bukan kembali ke layar jual. 2 Target 1: tombol 48px (brief primer 56px). 6 Pencegahan 1: keranjang auto-kosong ✓ tapi tanpa kembalian kasir harus hitung sendiri. +: centang animasi 400ms + vibrate 30ms ✓, struk + uuid ✓, "Pembayaran tercatat" jujur ✓. Screenshot: `04-E-layar-sukses-360x800.png`, `13-E-sukses-390x844.png` |
| **F Struk** | ADA (di dalam sukses) | **18** | Layar terbaik. Gagal tipis: 5 Umpan balik 1 + 6 Pencegahan 1: gagal share/cetak **diam-diam** — `.catch(function(){})` (`kasir.html:501`; brief 5.2.F: "gagal cetak = pesan jelas + cara ulang"). 9 Konsistensi 1: "Method: TUNAI" campur EN/ID (`kasir.html:497`). +: pratinjau mono rapi, rata kanan, kontras 18.7:1, teks tetap bisa disalin, PDF 58mm berhasil dirender (`Page.printToPDF`). Bukti: `05-F-struk-printToPDF-58mm.pdf`, `05-F-struk-receipt-zoom-360x800.png` |
| **G Produk (tambah/ubah)** | **TIDAK ADA** | — | Tidak ada formulir (`formProduk:false`), tidak ada "Tambah produk" (`tambahProduk:false`). 8 produk demo hardcoded di `kasir.html:230-239`. Brief 5.2.G (form 1 kolom, Rp + ribuan, Simpan sticky, foto+kompres) seluruhnya absen. |
| **H Laporan/rekap** | **TIDAK ADA** | — | Terkonfirmasi hipotesis R7: **0 kemunculan** kata rekap/harian/omzet/laba/laporan di seluruh markup & innerText aplikasi ter-render (`rekapLaporan:false`; grep repo hanya kena komentar `config.js:26-27,93`). Tidak ada angka ringkas, daftar transaksi, filter tanggal, ekspor. |
| **I Pengaturan & data** | **TIDAK ADA** | — | Tidak ada "Pengaturan", "Cadangkan data", "Terakhir dicadangkan" (`pengaturanCadangkan:false`). Header hanya: Buat akun / Keluar / Beranda (`kasir.html:25-27`). |
| **J Kondisi sistem** | SEBAGIAN | **14** | 7 Keadaan **0**: hanya offline+sync yang ada; **kosong** (hasil pencarian 0 = area kosong tanpa pesan), **galat**, **pembaruan** (tidak ada banner; service worker **tidak terdaftar** di kasir.html — `scripts:["../assets/js/config.js"]`, `controller:false`; SW hanya di `shared.js` yang tidak dimuat) semua absen. Reload saat offline = **layar error Chrome** (terukur di probe: navigasi offline gagal dimuat). 6 Pencegahan **0**: galat diam-diam (oversell, uang kurang, cetak). 12 Kejujuran 1: copy "dikirim otomatis saat online" (`kasir.html:34,81`) **tidak pernah benar-benar terjadi** — `drain()` (`kasir.html:307-316`) hanya mengganti teks status + toast, tidak pernah membaca/mengirim outbox; antrean IDB tidak dibaca saat load (`pending=0` di `kasir.html:302`) sehingga "Offline · N antre" setelah reload selalu 0. +: pil offline non-modal ✓ (brief 5.2.J), transisi online/offline smooth ✓. Screenshot: `02-F-offline-360x800.png`, `15-F-offline-pil-warning-360x800.png` |

**Rekap**: A 14 · B 13 · C 0 (absen) · D 12 · E 16 · F 18 · G 0 (absen) · H 0 (absen) · I 0 (absen) · J 14.
Kriteria bernilai 0: A6, B6, D6, D7, J6, J7 → pelanggaran langsung "DEFINISI SELESAI: tidak ada kriteria bernilai 0".

Kontras (positif, layak dipertahankan): angka kunci total/harga 18.72:1, kembalian 7.24:1, stok low 7.51:1, Bayar 5.98:1 (AA ✓), semua teks ≥ 4.86:1 → tidak ada pelanggaran kontras di kasir; masalah keterbacaan murni **ukuran font** (13/12/11px).

---

## (b) Verifikasi [H] & R-chain — TERBUKTI / TIDAK TERJADI

| ID | Klaim | Status | Bukti | Screenshot |
|---|---|---|---|---|
| R3 | Tambah produk 1 ketukan (grid besar, produk contoh) | **TERBUKTI** (dengan caveat) | Tap real produk#1 → barCount "1 item" Rp22.000 dalam <300ms; 8 produk contoh seeded; grid 2 kolom kartu 150x219px. Caveat: stok 0 masih bisa ditambah; tanpa badge qty di kartu; tanpa petunjuk pertama. | `01-A-pembukaan-demo-360x800.png` |
| R4 | Keranjang terbaca sekilas (item/qty/subtotal, stepper qty) | **TIDAK TERJADI** | Sheet keranjang tidak eksis; tap bilah (real + JS) tak membuka apa pun; `qty-ctrl` 0 node di seluruh sesi. Qty tak bisa dikoreksi sebelum bayar. | `07-C-tap-bar-tanpa-sheet-keranjang-360x800.png` |
| R5 | Bayar tidak salah tekan (Bayar besar, total selalu terlihat, konfirmasi hanya bila berisiko, tombol "uang pas") | **SEBAGIAN** | Tombol Bayar 56px & 76% lebar bilah ✓ (terukur `payW:293/barW:383`); total sticky di bar + sheet ✓. TAPI: konfirmasi = **slide-to-confirm di SETIAP transaksi** (bukan "hanya bila berisiko"); **"Uang pas" tidak ada** (`uangPasBtn:false`); chip nominal tidak ada; dan justru kasus berisiko (uang kurang) **tidak diblokir**. | `03-D-…png`, `08-D-uang-kurang-slide-masih-aktif-360x800.png` |
| R6 | Layar sukses: kembalian raksasa, 2 tombol jelas, tak ada ragu "tersimpan?" | **SEBAGIAN** | Layar ada, 2 tombol jelas (48px), keranjang auto-kosong ✓, "Pembayaran tercatat" + struk + uuid ✓. TAPI **kembalian tidak muncul** di layar sukses (transaksi tunai Rp30.000/total Rp22.000 → `kembalianDiSukses:false`); kembalian hanya di sheet pembayaran dengan font **14px**. | `04-E-layar-sukses-360x800.png`, `03b-D-kembalian-hidup-360x800.png` |
| R7 | Hasil terasa beres: rekap harian, struk, kembalian jelas | **TIDAK TERJADI** (rekap) | Layar H tidak ada; 0 kata rekap/omzet/laba di app. Struk ✓ (F cukup baik). Sinkronisasi outbox = **simulasi** (`drain()` tak pernah mengirim; klaim "terkirim otomatis" tak kunjungan nyata). | — (grep + probe DOM) |
| R2 (turunan) | Demo terbuka tanpa penghalang, berisi data | **TERBUKTI** | `#demo` → sesi demo lokal langsung ke POS (kasir.html:155-177); tanpa login; DCL 88ms, load 89ms (localhost; uji 3G belum dilakukan — jujur: belum terukur di throttle jaringan). | `01-A-…png`, `06-B-…png` |
| Spec 5.2.B | Kategori chips memfilter | **TIDAK TERJADI** | Klik chip "Keripik" → aktif secara visual tapi daftar tetap 8 produk (bug `render()` tanpa argumen, `kasir.html:345`). | log `B-CAT-KEREK` |
| Spec 5.2.B | Badge jumlah di kartu | **TIDAK TERJADI** | `badgeDiKartu:0`. | `06-B-…png` |
| Spec 5.2.B | Mengetuk bilah (di luar Bayar) membuka keranjang | **TIDAK TERJADI** | Real tap `#bar .small` + JS click → tidak ada sheet. | `07-C-…png` |
| Spec 5.2.D | Keypair: "Uang pas" paling menonjol + chip nominal | **TIDAK TERJADI** | Tidak ada elemen; satu-satunya input = `#cash` type=number kecil. | `03-D-…png` |
| Spec 5.2.D | Kembalian LIVE raksasa (≥36px) | **SEBAGIAN** | LIVE ✓ (event input, Rp8.000 muncul seketika), ukuran **14px** ✗. | `03b-D-…png` |
| Spec 5.2.D | Uang kurang = merah + blokir | **TIDAK TERJADI** | 5.000 < 40.000 → tanpa warna/teks/blokir; slide tetap bisa menyelesaikan transaksi. | `08-D-…png` |
| Spec 5.2.D | QRIS: nominal otomatis, 2 tombol jelas | **TERBUKTI** | Payload 136 char (`000201010212…`, tag 51 nominal), "Sudah dibayar" 48px vs "Tutup" terpisah ✓; nominal Rp40.000 ditampilkan 40px. Catatan: tidak ada penanganan kecerahan layar/wake lock (API wakeLock tersedia tapi tak dipakai). | `09-D-…png`, `10-D2-…png` |
| Spec 5.2.J | Offline: pil permanen, perilaku normal | **TERBUKTI** | Pil "Offline · 0 antre" (warning-bg) muncul seketika saat event offline; app tetap berfungsi; transaksi dicatat offline. Reload offline = error dino (SW tidak terdaftar) — keadaan pemulihan gagal. | `02-F-…png`, `15-F-offline-pil-warning-360x800.png` |
| Spec 5.2.A | Petunjuk tertanam "Ketuk produk untuk menjual" yang hilang setelah ketukan pertama | **TIDAK TERJADI** | String tidak ada di DOM (`hintOnPage:false`). | `01-A-…png` |

---

## (c) C1 — Penjualan 1 item tunai uang pas: target ≤ 4 ketukan

**Alur terukur hari ini** (run dengan input real penuh, transaksi sukses):
1. Ketuk kartu produk (real tap → "1 item · Rp22.000")
2. Ketuk **Bayar** (sheet terbuka, slide langsung fokus dengan label nominal)
3. **Geser** knob slide-to-confirm (drag ~320px; juga bisa Enter via keyboard) → transaksi tersimpan, layar sukses, keranjang kosong.

**= 3 interaksi untuk uang pas — lulus angka C1 (≤4)**, tetapi dengan catatan penting:
- Ia lulus **karena input uang bisa dilewati total** — bukan karena ada tombol "Uang pas". Tombol itu **tidak eksis**. Brief mendefinisikan C1 = produk → Bayar → **Uang pas** → Selesai; langkah 3 versi brief tidak ada, digantikan slide.
- **Uang TIDAK pas** (kasus warung paling umum): harus mengetik manual di `#cash` type=number kecil (y≈690) — keypad native = 1 ketukan per digit. Bayar Rp50.000 untuk Rp22.000 ≈ 3 + 5 ketukan keypad = **8 ketukan** → gagal target. Tidak ada chip 50rb/100rb.
- Slide = gestur drag (lebih berat dari tap, tapi memang anti salah tekan). Setiap transaksi tanpa kecuali menuntut slide — kebalikan dari P6 "konfirmasi hanya bila berisiko", sementara yang benar-benar berisiko (uang kurang) justru lolos tanpa konfirmasi.
- Tanpa petunjuk pertama, pengguna baru harus menemukan sendiri bahwa knob harus digeser (label "Geser untuk konfirmasi" ada, jadi discovery masih oke).

**Verdict C1**: 3 ketukan (uang pas, setelah demo diketahui) — angka lulus, mekanisme tidak sesuai spesifikasi; kasus uang tidak pas gagal total.

---

## (d) Daftar perbaikan prioritas (POS saja)

**P0 — blocker rilis (rusak uang/kepercayaan):**
1. **Blokir uang kurang**: di `updateKembali`/slide — cash < total saat TUNAI → slide disabled + pesan merah ("Kurang Rp17.000"). (D6)
2. **Oversell stok 0**: guard di handler grid (`kasir.html:329`) — stok 0 → kartu disabled/label "habis". (A6/B6)
3. **Sheet keranjang (C)**: peek + daftar item + stepper ± (≥44px) + hapus dengan Undo. Tanpa ini salah ketuk tak bisa dikoreksi sebelum bayar. (R4)
4. **Chip kategori memfilter**: `render()` harus menerima filter `activeCat` (`kasir.html:342-347`). (B12)
5. **Kembalian di layar sukses**: tampilkan raksasa (≥36px, tabular-nums) saat TUNAI & cash > total. (E1/E4)
6. **Kembalian di sheet pembayaran ≥36px** (sekarang 14px). (D4)

**P1 — wajib sebelum target 20/24:**
7. Layar **H rekap harian** (Omzet/Jumlah transaksi header sticky, filter chips) + **G form produk** + **I cadangkan data** (tiga layar absen = R7 tak akan terasa beres).
8. Tombol **"Uang pas"** + chip nominal cepat (50rb/100rb dihitung dari total) di sheet pembayaran.
9. `#cash`: ganti `type=number` → `inputmode="numeric"` + `enterkeyhint="done"` (brief 8: bukan type=number).
10. Chips kategori & tombol header 38-40px → ≥44px; `.pos-search input` 15px → 16px (anti auto-zoom iOS).
11. Metode **Transfer/Lainnya**: sembunyikan sampai didukung (lebih jujur daripada panel kosong).
12. `:active` state pada `.pos-item` + badge qty di kartu; empty state pencarian ("Tidak ada produk…" + 1 aksi).
13. Manajemen fokus sheet: trap fokus + kembalikan fokus ke grid/`#pay` setelah sukses (sekarang mendarat di skip-link).
14. Pesan gagal cetak/share (ganti `.catch(function(){})`, `kasir.html:501`).
15. Guard visualViewport: pastikan slide/tombol aksi tetap terjangkau saat keyboard cash terbuka.

**P2 — polesan:**
16. Daftarkan service worker di kasir.html (reload offline = layar dino sekarang) + banner pembaruan non-modal.
17. Sinkronisasi outbox nyata ATAU ubah copy "dikirim otomatis saat online" sesuai kenyataan (sekarang klaim palsu — `drain()` simulasi).
18. Petunjuk pertama "Ketuk produk untuk menjual" yang hilang setelah ketukan pertama.
19. Ringkas header (3 tombol akun → menu), "Method:" → "Metode:", aria-live untuk perubahan status online/offline, keluarga ikon konsisten.

---

## Lampiran — semua artefak bukti (`/root/olano/audit/uiux/baseline/pos/`)

| File | Layar | Kondisi |
|---|---|---|
| `01-A-pembukaan-demo-360x800.png` | A | #demo segar, 8 produk, header penuh |
| `06-B-layar-jual-360x800.png` / `11-B-layar-jual-390x844.png` | B | 360 & 390 |
| `07-C-tap-bar-tanpa-sheet-keranjang-360x800.png` | C | bukti tap bilah = tidak terjadi apa pun |
| `03-D-sheet-pembayaran-tunai-360x800.png` / `12-D-pembayaran-tunai-390x844.png` | D | slide + cash 48px + metode 44px |
| `03b-D-kembalian-hidup-360x800.png` | D | kembalian Rp8.000 tampil, font 14px |
| `08-D-uang-kurang-slide-masih-aktif-360x800.png` | D | cash 5.000 < 40.000, tanpa error |
| `09-D-qris-dalam-sheet-360x800.png` / `10-D2-qris-layar-penuh-360x800.png` | D | QRIS dinamis |
| `14-D-metode-transfer-keadaan-kosong-360x800.png` | D | Transfer = panel mati |
| `04-E-layar-sukses-360x800.png` / `13-E-sukses-390x844.png` | E | tanpa kembalian |
| `05-F-struk-printToPDF-58mm.pdf` + `05-F-struk-receipt-zoom-360x800.png` | F | struk 58mm (pdf) + zoom |
| `02-F-offline-360x800.png` / `15-F-offline-pil-warning-360x800.png` | J | pil offline |
| `15-F-reload-offline-tanpa-sw-360x800.png`* | J | *dari run probe (terhapus saat re-shoot; bukti teks: judul & "Offline · 0 antre" terlog; error dino terverifikasi via probe navigasi offline) |

Skrip audit: `audit/uiux/cdp_pos.py` (driver CDP) + `probe_final.py` — read-only terhadap source (tidak ada file .html/.css/.js diubah, tidak ada commit).

**Server**: http.server port **8901 dibiarkan berjalan** (background, PID 1490583) sesuai instruksi — sibling bisa memakainya.
