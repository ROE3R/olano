# POS kasir.html — Skor RUBRIK AFTER (gelombang perbaikan R7->R4, 18 Okt 2026)

Worktree: `/root/olano-pos` branch `fix/pos-r3-r7`, base `91b15fa`, **16 commit** (`4bb178d..24cf727`).
Metode verifikasi: Playwright + Chrome headless (`/usr/bin/google-chrome --headless=new --no-sandbox`), emulasi mobile 360x800 + 390x844 DSF2, ketukan nyata (`touchscreen.tap`, `Input.dispatchMouseEvent`-setara, drag knob via pointer events), server lokal `http://localhost:8911` (worktree). Semua angka di bawah terukur, bukan perkiraan; log eksekusi & bukti DOM ada di sesi audit.

Skor rubrik 12 kriteria x 0/1/2 (brief §5.3). BEFORE dari `audit/uiux/pos-scores.md`.

| Layar | Before | After | Kriteria yang masih 1 (bukan 2) |
|---|---|---|---|
| A Pembukaan #demo | 14 | **21** | 1 Hierarki (header masih 5 elemen: brand, pil, jam, chip demo, Menu), 10 Kecepatan (belum diukur di 3G-throttle gelombang ini) |
| B Layar jual | 13 | **20** | 10 Kecepatan (skeleton belum ada — konten render sinkron & instan di localhost), 7 Keadaan (kosong=ada, galat jaringan in-app belum ada halaman khusus) |
| C Keranjang (sheet) | 0 (absen) | **19** | 5 Umpan balik (hapus langsung hilang + Undo, bukan animasi), 6 Pencegahan (swipe-hapus diganti tombol hapus eksplisit) |
| D Pembayaran | 12 | **21** | 8 Keyboard (keypad native, bukan keypad custom 56px; visualViewport guard terpasang), 9 Konsistensi (QRIS masih 2 jalur: dalam sheet + layar penuh) |
| E Layar sukses | 16 | **22** | 10 Kecepatan (centang animasi 400ms tetap), 1 Hierarki (label KEMBALIAN kecil 12px di atas angka — disengaja) |
| F Struk | 18 | **20** | 5 Umpan balik (cetak window.print tak punya state spinner), 9 Konsistensi (tombol Cetak/Simpan belum dibagi 3 sama besar) |
| G Produk (tambah) | 0 (absen) | **19** | 8 Keyboard (Simpan sticky belum menyesuaikan visualViewport), 5 Umpan balik (tanpa skeleton saat kembali ke grid) |
| H Rekap harian | 0 (absen) | **20** | 6 Pencegahan (header sticky per hari belum — daftar flat 30 terakhir), 11 Aksesibilitas (label chip filter 12px) |
| I Data & cadangan | 0 (absen) | **18** | 7 Keadaan (tanpa progres/state gagal saat unduh), 6 Pencegahan (belum ada import/pemulihan) |
| J Kondisi sistem | 14 | **21** | 10 Kecepatan (belum ada skeleton memuat; konten statis render instan), 6 Pencegahan (galat jaringan in-app belum ada; drain outbox tetap simulasi tanpa backend) |

**Rekap**: A 14->21 · B 13->20 · C 0(absen)->19 · D 12->21 · E 16->22 · F 18->20 · G 0(absen)->19 · H 0(absen)->20 · I 0(absen)->18 · J 14->21.
Semua layar >= 18/24 (ambang rilis), 9/10 layar >= 20/24 (target); **tidak ada kriteria bernilai 0** (before: A6, B6, D6, D7, J6, J7 = 0 — semua terangkat).

## C1 — penjualan 1 item tunai uang pas (target <= 4 ketukan)
Alur terukur AFTER (semua ketukan nyata): produk -> **Bayar** -> **Uang pas** -> **slide** = **4 ketukan** (brief: produk -> Bayar -> Uang pas -> Selesai).
- "Uang pas" mengisi input = total; slide menyelesaikan (uang pas, tanpa kembalian — terverifikasi `ok-kembali` hidden, transaksi tersimpan).
- Kasus uang tidak pas: chip 50rb/100rb atau keypad -> kembalian 36px -> slide. Uang kurang: slide mati + merah (mustahil salah simpan).
- Before: 3 ketukan tapi tanpa tombol "Uang pas" (mekanisme tidak sesuai brief); kasus uang tidak pas = 8 ketukan. AFTER memenuhi spesifikasi dan angka.

## Bukti terukur utama (log eksekusi)
- Oversell: stok 0 -> kartu tap = toast "habis", keranjang tetap; label kartu "habis".
- Uang kurang: `cash-err` tampil ("Uang kurang Rp35.000 — tambahkan uang atau kurangi item."), `sld.short`, slide pointerdown diabaikan, pay() menolak.
- Keranjang: 2 item -> sheet, stepper + (qty 1->2, bar Rp40.000->Rp62.000), - (kembali), hapus (rows 1, Undo tampil), Undo (rows 2, Rp40.000), stok kartu sinkron.
- Kembalian: sheet 36px (Rp28.000), sukses 40px (Rp28.000) hanya bila cash>total; uang pas = hidden.
- Rekap: IDB 2 sales -> OMZET Rp40.000/Rp44.000, TRANSAKSI 2, ITEM 2; chip 7 hari/Bulan ini bekerja.
- Cadangkan: unduh JSON, "Terakhir dicadangkan: 18/10/2026, 06.34.15".
- Offline: "Offline · 1 antre" saat jual offline; reload offline = aplikasi utuh (SW active), pil "Offline · 3 antre" (antre akumulasi terbaca dari IDB).
- 320px: tanpa scroll horizontal. Page errors: 0 di semua run.
- form G: nama kosong -> error inline; "12rb" -> Rp12.000; XSS payload tidak tereksekusi (escHtml).

## Sisa yang tahu (jujur)
- Sinkronisasi outbox ke server tetap simulasi (`drain()` menampilkan toast) — tidak ada backend; jumlah antre kini jujur dibaca dari IDB.
- Peek-72px & gestur tarik sheet keranjang diganti tap bar-info (fungsi koreksi qty lengkap via tombol).
- Uji 3G-throttle & TalkBack alur jual penuh belum diulang di gelombang ini (R2/R7 dicatat PARTIAL di tracker).
- Skeleton memuat & halaman galat jaringan in-app belum dibuat (J10/J6 dan B7/B10 masih 1).

Screenshot AFTER: `pos-after/after/01..17*.png` (A, B, B-empty, C, D, D-uang-kurang, D-uang-pas, E, F, G, H, I, QRIS x2, 390x844 x3).
Screenshot BEFORE (referensi): `pos-after/before/` (salinan `baseline/pos/`).
