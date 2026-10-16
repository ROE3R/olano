# Bug Report v15 — QA menyeluruh olano.xyz (localhost:8897)

Tanggal audit: 17 Okt 2026, 05:40–06:20 WIB. Audit murni (tidak ada kode diubah oleh auditor).
Metode: audit file (regex anchor/img/src/config/sw.js) + browser headless (error-capture via
addScriptToEvaluateOnNewDocument, klik nyata burger/produk/tombol, verifikasi matematis output
kalkulator vs hitungan independen, pengukuran transfer via Performance API dengan cache disabled).

> **CATATAN PENTING — PERBAIKAN PARALEL SELAMA AUDIT.** File berubah di tengah audit:
> 05:58 (12 subpage di-rewrite), 06:03 (index.html + sw.js), 06:03–06:06 (4 halaman baru:
> ai.html, automation.html, ugc.html, analisa-delivery.html). Semua temuan di bawah sudah
> diverifikasi ulang terhadap **kondisi final** (setelah 06:06). Temuan yang sudah diperbaiki
> parent saat audit didokumentasikan di bagian "FIXED SAAT AUDIT (oleh parent)".

---

## BUG (kondisi final)

**Tidak ada P0** — tidak ditemukan fitur mati, error console, resource 404, atau halaman rusak.

- [P1] app/kasir.html (inline JS, fungsi sldUpdateAmount) — angka pada slide-to-confirm `#sld-amt` tampil **"Rp0"** padahal total belanja non-nol; `#sheet-sum` benar (Rp22.000/Rp40.000). — Repro: buka /app/kasir.html, klik 1 produk, klik "Bayar" → sheet terbuka, `#sld-amt` = "Rp0" sementara `#sheet-sum` = total. Terverifikasi 2× (file versi lama & baru). Label hanya ter-update saat event `input` di `#cash` atau `focus` di `#sld`, tidak saat `openSheet('sheet')` dari klik `#pay`. — Fix: panggil `sldUpdateAmount()` di handler klik `#pay` (setelah openSheet) atau di dalam `openSheet('sheet')`.
- [P1] assets/js/config.js (`wa.pajak`, `wa.website`) — 6 kontrol WhatsApp menuju nomor placeholder `6281200000000` (TODO NEXT_PUBLIC_WA_PAJAK/WEBSITE); user yang klik CTA akan chat ke nomor mati. — Repro (runtime, terverifikasi): /pajak.html → `#wa-pajak` & `#wa-pajak-2` href = `https://wa.me/6281200000000?text=...`; /website.html & /naik-kelas.html pakai builder `C.wa.website` / `C.wa.pajak` sama. (Regex file hanya melihat `https://wa.me/` kosong karena URL dibangun runtime dari config.) — Fix: isi nomor WA asli di config.js (dari env di production).
- [P2] index.html — 2 img dekoratif tanpa atribut width/height (risiko CLS): `assets/daydream/cloud-1.webp`, `assets/daydream/cloud-2.webp`. Semua img lain di index sudah berdimensi. — Repro: grep `<img` index.html. — Fix: tambahkan width/height intrinsik.
- [P2] umkm.html — 6 img before/after foto AI tanpa width/height (risiko CLS): `assets/img/food/foto-ai-{kopi,keripik,batik}-{before,after}.webp`. — Repro: grep `<img` umkm.html. — Fix: tambahkan width/height intrinsik.
- [P2] sw.js (var CORE, cache olano-v15) — `tentang.html`, `kebijakan-privasi.html`, `syarat-ketentuan.html` tidak masuk CORE; offline pertama (jaringan mati, halaman belum pernah dibuka) fallback ke app/kasir.html alih-alih halaman legal. — Repro: bandingkan CORE vs daftar halaman yang dilink index (ketiganya dilink dari nav/footer). — Fix: tambahkan 3 URL ke CORE (atau dokumentasikan sebagai keputusan bahwa legal page tak wajib offline).

## VERIFIKASI YANG PASS (tidak perlu aksi)

- 0 error/unhandledrejection/console.error di console untuk SEMUA 18 halaman (14 scope awal + 4 halaman baru).
- Semua anchor internal resolve: file target ada + fragment id ada (termasuk `#fitur #alat #pajak #harga` di index — id-nya lengkap). 0 broken.
- Semua src img ada di disk dan ter-load (naturalWidth>0) kecuali yang tercantum sebagai artifact tooling di bawah.
- Mobile burger: `.nav-burger` klik → `.nav-mobile` none→flex, klik link menutup menu kembali ke none, aria-expanded ikut berubah. PASS di semua halaman ber-nav (termasuk 4 halaman baru).
- 4 kalkulator PASS matematis (output vs hitungan independen):
  - QRIS: MIKRO 750rb×100 → Rp2.250/txn, Rp225.000/bln, Rp2.700.000/thn; MIKRO 300rb → Rp0 (MDR 0%); KMB 150rb×50 → Rp1.050 (0,7% sesuai config qrisMDR). PASS.
  - HPP: 2×10.000 + 1×5.000 + overhead 5.000 = HPP Rp30.000; harga jual = HPP/(1−margin): Aman Rp42.857 (30%), Kompetitif Rp37.500 (20%), Premium Rp54.545 (45%). PASS.
  - Margin delivery: harga 50.000, HPP 20.000, komisi 30%, promo 3.000 → net Rp32.000, laba Rp12.000, margin 24%, saran harga Rp51.500 (= round5k((3000+20000)/(1−0,3−0,25))). PASS.
  - PPh final: OP 20jt/bln → bebas (base 240jt < 500jt, pajak Rp0); OP 60jt → dasar Rp220jt, Rp1.100.000/thn, Rp91.667/bln; PT → "n/a" + verdict skema umum; OP 20jt+keluarga 10jt → base 360jt bebas. PASS. (Retest awal "gagal" karena prefill `#omzet-12b`=900jt — formula benar: (900jt−500jt)×0,5% = Rp2.000.000/thn.)
- Kasir PWA: klik 2 produk → bar "2 item / Rp40.000" benar; sheet Bayar → `#sheet-sum` Rp40.000; cash 50.000 → kembalian "Rp10.000" benar; cash 30.000 → kembalian tersembunyi benar; sheet QRIS nominal Rp40.000 benar; stok berkurang (4→3). PASS (kecuali bug #sld-amt di atas).
- SW: cache name `olano-v15` (v14 saat audit awal, di-bump parent), 43 entri CORE **semua ada di disk**. Register di /alat/ & /app/ pakai `../sw.js` scope `../` — benar.
- Halaman baru ai/automation/ugc/analisa-delivery: title, nav, burger, img, error — semua bersih; sudah didaftarkan di CORE + dilink dari index.
- index.html mobile 390px: tanpa horizontal overflow (scrollW = clientW = 390).
- Total transfer index.html first-visit mobile (SW off, cache off): **≈352 KB** — komposisi terbesar: main.css 63,5 KB · produk-kasir-mobile-2x.webp 48,9 KB · cloud-1 42,8 KB · cloud-2 34,2 KB · 5 file font ≈93 KB · shared.js+config.js ≈18,7 KB · star-dots.svg 13,8 KB · lainnya kecil.

## FIXED SAAT AUDIT (oleh parent, bukan auditor — didokumentasikan agar tidak di-escallate ulang)

- Google Fonts eksternal (Bricolage Grotesque/Geist/Geist Mono) + preconnect fonts.googleapis/gstatic di **12 subpage** (umkm, pajak, website, naik-kelas, tentang, kebijakan-privasi, syarat-ketentuan, app/kasir, 4× alat/) — terkonfirmasi memuat saat audit awal (link ada di file & DOM). Dibersihkan parent 05:58; kondisi final: **0 halaman** memuat GF, `document.styleSheets` hanya main.css, `document.fonts` hanya Aspekta×4 (+Instrument Serif unloaded), 0 request ke fonts.googleapis/gstatic.
- SW cache `olano-v14` → `olano-v15` + CORE bertambah (4 halaman baru) — parent, 06:03.

## PALSU-TAPI-BUKAN-BUG (artifact tooling / by design — JANGAN di-fix)

- **Judul dokumen runtime ber-prefix emoji kuda (`🐴`/(`💨` dsb))** — ARTIFACT BROWSER TOOLING, bukan kode site. Bukti: (1) grep 64 file: 0 kemunculan emoji kuda, kata "kuda", atau `document.title` write — semua tag `<title>` bersih; (2) prefix muncul juga di halaman uji `data:` URL buatan sendiri dan `about:blank`; (3) `?no-sw=1` vs tanpa parameter → identik berprefix, jadi SW bukan sumber; (4) varian emoji berubah-ubah antar tab → konsisten dengan injeksi overlay per-tab oleh driver headless (UA: HeadlessChrome/145). Judul di file source bersih semua.
- **img `loading="lazy"` tampak "gagal load" (naturalWidth=0) di audit** (f-kasir/f-qris/f-scan16/f-foto-ai di index; grid-overlay.svg di subpage) — artifact headless tooling: lazy loader tidak pernah ISSUE request (0 resource entry; menghapus atribut `loading` runtime → fetch langsung sukses; load manual `new Image()` → OK 1180×659). File ada di disk & di CORE. Browser sungguhan tidak terdampak.
- **transferSize 0 B di pengukuran pertama** — cache disk browser; setelah `Network.setCacheDisabled` + `clearBrowserCache` + unregister SW, angka real terukur (≈352 KB, di atas).
- **Reveal-on-scroll tidak jalan di audit** (`data-reveal` tak pernah dapat class `in` walau discroll) — artifact headless (IntersectionObserver tidak memicu di driver ini); kode shared.js benar dan punya fallback reduced-motion/no-IO.
- **`wa.me` polos di regex file** (`https://wa.me/` tanpa nomor) — bukan link kosong di HTML; URL dibangun runtime dari `OLANO_CONFIG` (bug sebenarnya adalah nomor placeholder-nya, lihat P1 di atas).
- **`kasir.html` tanpa nav/burger** — redirect page by design (meta refresh 0 → app/kasir.html); redirect terverifikasi jalan.
- **`.nav-burger{display:none}` muncul 2× di main.css** — yang kedua berada di dalam `@media(min-width:1080px)`; hide-desktop by design. Burger mobile berfungsi (tes klik PASS).
- **Prefill `#omzet-12b` = 900.000.000 di kalkulator PPh** — nilai contoh sengaja; bukan bug (lihat verifikasi PPh di atas).

## Rekomendasi prioritas eksekusi (untuk parent)

1. Fix `#sld-amt` (P1, 1 baris: panggil `sldUpdateAmount()` saat buka sheet Bayar).
2. Isi nomor WA asli di `assets/js/config.js` → otomatis membetulkan 6 CTA di 3 halaman.
3. Tambah width/height untuk 8 img (index 2, umkm 6).
4. (Opsional) masukkan 3 halaman legal ke SW CORE.
