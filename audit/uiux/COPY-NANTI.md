# COPY-NANTI.md (SERAHAN E) — log perubahan teks selama gelombang UI/UX

## Cara pakai
1. **Kata & kalimat DIBEKUKAN** selama gelombang UI/UX (brief §11). UI dikerjakan dulu, teks dirapikan belakangan.
2. Pengecualian: bila UI **memaksa** teks berubah (harus dipendekkan agar muat di 360px, label jujur K1 "nomor menyusul", dll.) → catat SATU baris di tabel log di bawah, lalu lanjutkan. Jangan buka perdebatan copy di gelombang ini.
3. **Isi** FAQ, testimoni, judul baru = DITUNDA ke tahap kata. Komponen boleh dibuat dengan placeholder berlabel "isi menyusul" — jangan fiksasi isinya.
4. Setiap baris wajib menyebut `file:baris` (atau `file:selektor`) agar tahap kata bisa menemukan lokasinya.

## Tabel log (MULAI KOSONG — diisi subagent perbaikan saat UI memaksa perubahan teks)

| # | teks lama | teks baru | alasan | file:lokasi | oleh |
|---|---|---|---|---|---|
| 1 | `Method: TUNAI` | `Metode: TUNAI` | konsistensi istilah ID (audit F pos-scores §F: campur EN/ID) | `app/kasir.html` receiptHTML() | pos-fix |
| 2 | tombol `Transfer`, `Lainnya` (tampil, panel kosong) | disembunyikan (`hidden`) | kejujuran: panel mati tanpa aksi = jalan buntu (audit D7) | `app/kasir.html` #pay-methods | pos-fix |
| 3 | (tombol scan tanpa fungsi, tampak) | disembunyikan (`hidden`) | kejujuran: tombol mati tanpa tanda (audit B12) | `app/kasir.html` .pos-scan | pos-fix |
| 4 | (tanpa petunjuk) | `Ketuk produk untuk menjual` (hilang setelah ketukan pertama) | wajib brief 5.2.A; teks dari spesifikasi brief, bukan copy baru | `app/kasir.html` #pos-hint | pos-fix |
| 5 | `stok 0` | `habis` | label manusiawi utk stok 0 (P0.2 oversell guard) | `app/kasir.html` render() | pos-fix |
| 6 | (banner SW tanpa teks) | `Ada versi baru aplikasi.` + `Muat ulang` | komponen baru wajib brief 5.2.J; teks minimal deskriptif | `app/kasir.html` #pos-sw-banner | pos-fix |
| 7 | `Uang kurang Rp17.000` (contoh) | `Uang kurang Rp17.000 — tambahkan uang atau kurangi item.` | pesan galat + cara pulih (rubrik 6) | `app/kasir.html` #cash-err | pos-fix |
| 8 | `Keripik` chip = kategori produk | label chip tetap `Keripik` (kategori data) — tanpa perubahan teks, hanya perilaku filter | dicatat agar tahap kata tahu chip ini beneran memfilter sekarang | `app/kasir.html` #quick-tabs | pos-fix |
| 9 | `Sudah jalan` (badge pada modul 01-05, 5×) | (badge dihapus dari tampilan landing; halaman tujuan tetap) | L16: 5 badge status normal = kebisingan; badge hanya utk pengecualian ('Segera hadir'). Kata F14 tak diubah — baris 01-05 tak lagi menampilkannya | `index.html` §modul `.mmeta` baris 01-05 | landing-fix (L16) |
| 10 | `AI harga, foto (60 foto/outlet/bulan), dan Tanya AI` (1 butir) | 3 butir: `AI harga` · `Foto` + sub `60 foto/outlet/bulan` · `Tanya AI` | L28: 1 butir = 1 hal; angka batas jadi teks sekunder 12px; konjungsi 'dan' gugur karena pecah daftar, kata lain utuh | `index.html` §harga `.price-list` kartu Pro | landing-fix (L28) |

---

## BEKU — penundaan fakta (DO-NOT-TOUCH sekarang)

Rujuk brief audit F1-F11 + brief UIUX §11. **Gelombang UI/UX DILARANG mengubah** teks/angka berikut — walau tampak keliru — karena itu fakta pajak/QRIS yang dikoreksi di **tahap kata** (SETELAH UI stabil). Tugas UI hanya: pastikan tidak rusak secara layout (tak terpotong, tak bungkus jelek, kontras cukup); bungkus yang buruk dicatat sebagai temuan L (bukan diedit).

| Ref | Teks/fakta dibekukan | Lokasi diketahui (probe 18 Okt 2026) | Kenapa ditunda |
|---|---|---|---|
| F1 | satuan "/bln" pada harga | `index.html` §harga; `config.js` → `pricing.proPerOutlet` | angka+harga = tahap kata (K12: single source of truth) |
| F2 | angka Rp91.667 (hasil kalkulator pajak) | `index.html` widget pajak; `config.js` → `tax.rate` | angka faktual pajak — bukan ranah UI |
| F3 | "maksimal 4 tahun" (koperasi, PP 20/2026) | `index.html` widget pajak; `config.js` → `tax.koperasiMaxYears` | angka faktual pajak |
| F8 | "QRIS dinamis" | `index.html` bar pengumuman/hero; `config.js` → `qrisMDR` | fakta QRIS = tahap kata |
| F12 | "terenkripsi" (klaim keamanan) | `index.html` ±baris 263 (sub seksi harga); `kebijakan-privasi.html` | klaim keamanan = tahap kata |
| F14 | label "Sudah jalan" pada kartu Website | `index.html` §modul (lencana status) | L16 memindahkan lencana hanya untuk pengecualian, tapi PENAMAAN label tetap keputusan tahap kata |

Catatan sinkronisasi: F8 "QRIS dinamis" terkait K3 ("QRIS, nominal terisi otomatis" — DIKONFIRMASI owner) — K3 mengubah UI/label layar pembayaran di `app/kasir.html`, BUKAN teks landing yang dibekukan F8. Jangan tertukar.
