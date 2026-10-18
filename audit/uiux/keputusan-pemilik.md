# BUTUH KEPUTUSAN PEMILIK (SERAHAN F) — olano.xyz UI/UX

Tanggal dibuat: 18 Okt 2026 (sumber: brief-uiux.md §10 ATURAN AGENT + §11).
Aturan main: item **DIKONFIRMASI** JANGAN ditanya ulang — langsung jadi dasar perbaikan. Item **MASIH DIBUKA** menunggu jawaban pemilik; subagent boleh menyiapkan struktur kode untuk opsi mana pun, tapi TIDAK memfiksasi visual sampai dipilih.

---

## A. DIKONFIRMASI (final — jangan re-ask)

| Ref | Keputusan | Konsekuensi untuk perbaikan |
|---|---|---|
| K1 | WhatsApp: belum ada nomor nyata → tombol struktur dipasang dengan label JUJUR **"nomor menyusul"** sebagai **non-dead control** (menampilkan modal/informasi jelas, BUKAN link wa.me mati) | L30: tombol hijau WA 48-52px + ikon tetap dibuat, tapi perilaku = buka info/modal, bukan href wa.me. Sinkron dengan `config.js` → `wa: { pajak: "", website: "" }` (builder JS guard truthiness — tidak jadi link hidup). Jangan isi nomor palsu. |
| K3 | QRIS: **"QRIS, nominal terisi otomatis"** | Layar pembayaran D `app/kasir.html`: label/flow QRIS memakai frasa ini; nominal per transaksi (payload EMVCo + CRC16, flag `qrisMDR.featureFlag_qrisAmountInjection`). HANYA label/UI — angka & fakta MDR tetap dibekukan (F8/F3, lihat COPY-NANTI.md). |
| K5 | Testimoni: tetap berlabel "Contoh" di config, NAMUN per L32 **sembunyikan seluruh seksi testimoni di produksi** sampai ada isi nyata | L32: section `#testimoni` di `index.html` tidak dirender (atau disembunyikan total) di produksi; data `config.js` → `testimonials` tetap utuh sebagai satu tempat swap. Jangan tampilkan stempel "CONTOH" di produksi. |
| K7 | Pronomina: **"Anda"** untuk dokumen legal, **"kamu"** untuk semua yang lain | Berlaku di tahap kata (teks dibekukan sekarang). Untuk gelombang UI: komponen baru/placeholder memakai "kamu"; dokumen legal (kebijakan-privasi, syarat-ketentuan) JANGAN disentuh. |
| K10 | CTA utama: **"Coba demo kasir"** (tanpa trial signup) | Semua CTA primer landing (header, hero, CTA penutup) menuju `app/kasir.html#demo`; label demo = jalur utama. Tidak ada flow signup/trial di CTA. |
| K12 | Pricing: **single source of truth — jangan bikin angka baru** | Angka harga hanya dari `assets/js/config.js` → `pricing` (gratis 0, pro Rp50.000/outlet, trialDays 14, jasaPajak Rp250rb). L27-L31 mengerjakan URUTAN/hierarki/penanda visual, BUKAN angka. |

Preserved: anchors `#main #modul #alat #pajak #harga #demo`; light mode; warna primer `#2453EB` (putih di atasnya ~6,0:1 — lulus AA); anti-slop.

---

## B. MASIH DIBUKA (perlu jawaban pemilik — opsi + rekomendasi sudah disiapkan)

### O-1. Gaya visual hero (dari L10) — *item utama yang masih terbuka*
Masalah: aset hero sekarang = langit/awan/grid (folder "daydream") — bercerita KEBALIKAN dari janji "tetap jalan saat internet mati". Tuntutan brief: visual yang MEMBUKTIKAN produk (HP kasir layar nyata dalam bingkai HP, bertema warung), berat ≤ 60-80KB (webp/avif, srcset).

| Opsi | Deskripsi | Pro | Kontra |
|---|---|---|---|
| 1 (REKOMENDASI) | **Foto asli warung + HP** — foto sungguhan pemilik warung memegang HP dengan layar kasir (bisa composite: layar = screenshot asli app) | paling meyakinkan, membuktikan konteks nyata, "percaya dalam 5 detik" (R0) terkuat | butuh sesi foto/produksi aset; ada risiko foto stok generik kalau tidak hati-hati |
| 2 | **Ilustrasi flat vektor bertema warung** — HP bingkai + produk warung digambar, palet #2453EB | cepat dibuat, konsisten dengan design system, ringan (<60KB mudah) | less proof — ilustrasi tidak membuktikan produk nyata; rawan kesan "template" |
| 3 | **Mockup HP fotorealistik + screenshot app** (tanpa manusia) — bingkai HP murni berisi screenshot kasir sungguhan | paling jujur (apa yang dilihat = apa yang didapat), tidak butuh sesi foto, bisa pakai screenshot mobile 9:19 yang memang diminta L13 | kurang hangat/kontekstual dibanding opsi 1 |

Rekomendasi: **Opsi 3 dulu** (cepat, jujur, nol produksi foto) lalu upgrade ke **Opsi 1** saat ada sesi foto. Hindari Opsi 2 kecuali terpaksa — ilustrasi melemahkan bukti. Apa pun pilihannya: tampilkan layar MOBILE asli app (screenshot 9:19 dari `app/kasir.html`), bukan mockup desktop yang diperkecil.

Placeholder aman sampai dipilih: pertahankan mockup/produkt-frame yang ada (main.css zona `HERO: PRODUCT FRAME`) — jangan hias-hias dengan awan lagi.

### O-2. Nama paket harga (dari L27/L31)
Masalah: kartu "Gratis" dan "Pro" perlu urutan/penanda "utama" di mobile — tapi pemakaian NAMA di luar itu (mis. "Pro" vs "Bisnis" vs "Warung") menentukan copy tombol & penanda.

| Opsi | Deskripsi |
|---|---|
| 1 (REKOMENDASI) | **Tetap "Gratis" + "Pro"** — sudah ada di config (`pricing.gratis`, `proPerOutlet`), nol perubahan copy |
| 2 | "Gratis" + "Warung Pro" — lebih kontekstual untuk target pemilik warung, tapi mengubah copy di beberapa titik |
| 3 | "Mulai" + "Tumbuh" — naratif growth, tapi paling banyak menyentuh teks (melanggar pembekuan kata paling dalam) |

Rekomendasi: Opsi 1. Pembekuan kata membuat penggantian nama = kerja tahap kata; gelombang UI cukup mengerjakan urutan + penanda visual dengan nama yang ada sekarang.

### O-3. Warna aksen di luar #2453EB (dari §7 design system)
Masalah: primer sudah final (#2453EB). Yang belum diputuskan pemilik: warna sukses/warning/bahaya + netral 9-langkah (dipakai tombol WA hijau L30, status offline POS, stok rendah, uang kurang merah).

| Opsi | Deskripsi |
|---|---|
| 1 (REKOMENDASI) | Netral hangat + hijau/kuning/merah standar aksesibel (pilih pasangan ≥4,5:1, angka kasir ≥7:1) — aman, tanpa keputusan estetika besar |
| 2 | Aksen hangat khas UMKM (oranye/terakota) untuk sukses/warning — lebih "warung", tapi butuh verifikasi kontras lebih hati-hati |
| 3 | Monokrom ketat: warna hanya #2453EB + merah bahaya — paling disiplin, tapi kehilangan semantik sukses/warning |

Rekomendasi: Opsi 1 sebagai default; kalau pemilik mau identitas lebih hangat, naik ke Opsi 2 dengan syarat kontras terukur.

---

## C. Protokol keputusan baru
Bila saat verifikasi/perbaikan muncul keputusan visual yang TIDAK ada di daftar ini (mis. gaya ikon, ilustrasi empty-state):
1. Tandai baris findings terkait `status: DELEGATED` + tambahkan entri di bagian B dengan 2-3 opsi + rekomendasi.
2. Jangan memfiksasi visual — siapkan struktur yang bisa menerima opsi mana pun.
3. Yang bisa berjalan tanpa jawaban: lanjutkan dengan nilai default paling aman (kontras lulus, tanpa ornamen baru — anti-slop).
