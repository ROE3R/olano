# Olano v3: dari kasir ke aplikasi bisnis lengkap

Dokumen ini mencatat apa yang berubah, kenapa, dan bagaimana memverifikasinya.
Arah desain ada di `DESIGN.md` §10 (bahasa visual aplikasi, acuan Payer).

## Apa yang sekarang ada

| Halaman | Fungsi | Status |
|---|---|---|
| `app/dashboard.html` | omzet hari ini, target bulanan, grafik 7 hari, terlaris, stok menipis, transaksi terakhir | baru |
| `app/produk.html` | CRUD produk, filter kategori, cari, indikator stok | baru |
| `app/transaksi.html` | riwayat, filter 7/30/semua, cari, ekspor CSV | baru |
| `app/pajak.html` | PPh final dari omzet nyata, 6 bulan, status ambang | baru |
| `app/pengaturan.html` | nama toko, target, tarif PPh, ekspor/impor cadangan, reset | baru |
| `app/kasir.html` | POS offline, keranjang, QRIS, struk, sinkron | diperbarui |
| `app/login.html` | masuk/daftar, sekarang mengarah ke dashboard | diperbarui |

Katalog produk dipindah dari hardcode di `kasir.html` ke `assets/js/store.js`, jadi
kasir, dashboard, produk, transaksi, dan pajak membaca angka yang sama.

## Alur data (satu arah, tanpa duplikat)

```
kasir.html  --(jual)-->  IndexedDB olano-pos / sales
                              |
              assets/js/store.js  (satu koneksi, satu pembacaan)
                              |
    dashboard · transaksi · pajak  (baca)     produk · pengaturan (tulis katalog)
```

- **Satu koneksi IndexedDB.** Kasir dulu membuka koneksinya sendiri. Akibatnya
  `deleteDatabase` di Pengaturan selalu `blocked`, dan setelah blocked, `open`
  berikutnya menggantung tanpa callback: data tampak terhapus padahal tidak, dan
  dashboard berhenti memuat. Sekarang hanya `store.js` yang membuka DB, dan
  `resetAll()` menutup koneksi sebelum menghapus.
- **Watchdog 1800 ms.** `indexedDB.open` bisa tidak memanggil callback sama sekali
  (storage diblokir, versi ditahan). Tanpa batas waktu, layar berputar selamanya.
- **Cadangan localStorage.** Kalau IDB menolak, transaksi ditulis ke
  `olano-sales-fallback` supaya dashboard tetap punya angka. Saat membaca, kedua
  sumber digabung tanpa duplikat berdasarkan `uuid`.

## Angka pajak

PPh final dihitung dari transaksi nyata, bukan input manual:

- di bawah ambang bebas tahunan: **Rp0** (aturan Orang Pribadi)
- di atas ambang: `omzet bulan x tarif` (default 0,5% dari `OLANO_CONFIG.tax`)
- proyeksi setahun dipakai untuk memutuskan skema final vs umum

Tarif dan ambang bisa diubah di Pengaturan, tersimpan di `olano-settings`.

## Cara menjalankan

```bash
npm run serve          # http://127.0.0.1:8792
npm run test:unit      # matematika rolling counter
npm run test:e2e       # 20 pemeriksaan browser nyata
npm test               # keduanya
```

`test:e2e` memakai Chromium dari cache Playwright. Kalau letaknya lain, set
`PLAYWRIGHT_CHROMIUM=/path/ke/chrome`.

## Yang diuji (20 pemeriksaan, semua lewat browser)

1. lima halaman app + kasir memuat di 390 dan 1440 tanpa overflow
2. tidak ada tombol di bawah 44px pada 390
3. semua tautan internal menunjuk berkas yang ada
4. jual di kasir lalu buka dashboard: omzet bukan Rp0
5. grafik proporsional (bukan semua batang 3px)
6. produk: tambah lalu hapus benar-benar mengubah katalog bersama
7. pajak: Rp0 di bawah ambang, > 0 di atas ambang
8. ekspor cadangan menghasilkan JSON yang bisa dibaca
9. console bersih (404 `/api/*` di dev dihitung terpisah, karena endpoint
   serverless memang tidak ada di server statis)
10. kasir tetap jatuh ke mode demo saat backend tidak menjawab

## Regresi yang pernah lolos dan sudah ditutup

- **Service worker menyajikan CSS/JS lama.** Cache-first murni membuat setiap
  edit aset tidak terlihat sampai konstanta `CACHE` dibump manual. Dua kali
  menipu pengujian (tombol tetap 36px, `store.js` lama tanpa watchdog). Sekarang
  aset memakai stale-while-revalidate: versi cache disajikan sekarang, salinan
  baru diambil di latar.
- **Grafik runtuh.** `height:X%` di dalam trek bertinggi `auto` membuat semua
  batang jatuh ke `min-height: 3px`. Trek sekarang `flex: 1 1 auto` dengan
  tinggi pasti; ada assertion yang gagal kalau batang kembali rata.

## Yang belum dibangun (jujur)

- Sinkronisasi multi-perangkat: `api/sync.js` dan `api/restore.js` sudah ada,
  tapi dashboard membaca data perangkat. Angka antar perangkat belum digabung.
- Peran pengguna (kasir vs pemilik) belum dipisah; semua halaman terbuka.
- Halaman Pengaturan belum menyimpan profil pajak lengkap (NPWP, jenis WP).
