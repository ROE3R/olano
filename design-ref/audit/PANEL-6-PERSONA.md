# Audit Panel 6 Persona

Target: https://olano.vercel.app/

Metode: 6 persona diminta mengkritik halaman yang sama, masing-masing dengan
brief berisi data terukur Playwright (tinggi section, jumlah CTA, teks lengkap).
Model: claude-opus-5.5. Total keluaran: 36054 karakter.

---

## Desainer Produk Senior (Apple / Porsche Design / Stripe)

# Audit olano.vercel.app

**Yang bagus, singkat aja:** grid 12 kolom dengan header asimetris (eyebrow col 1-3, H2 col 4-11) itu benar. Tanpa shadow, radius 6px, border 8% juga benar. Masalahnya, semua itu cuma kebersihan dasar, dan halaman lu berhenti di situ. Reviewer yang kasih 8/10 itu ngecek kerapian. Yang ga lu punya: **pendirian**. Halaman ini rapi tapi ga berani bilang apa-apa.

## 1. H1 lu janji semuanya, jadi kedengeran kosong

"Apa pun bisnis Anda butuhkan, kami urus." Tata bahasanya juga cacat, harusnya "Apa pun **yang** bisnis Anda butuhkan". Kalimat begini bisa dipasang di website agensi mana aja. Brand mewah itu kelihatan dari apa yang dia **tolak**. Porsche ga jualan "apa pun kendaraan yang Anda butuhkan."

**Fix:** H1 jadi satu klaim yang bisa dibuktikan: **"Kasir gratis yang tetap jalan saat internet mati."** Ukuran 80px -> 72px, lh 1.02, tracking -0.03em. Sub cukup satu kalimat: "QRIS terisi sendiri, pajak terhitung dari transaksi."

## 2. Daftar layanan yang sama muncul tiga kali

Dropdown nav (6 link), hero (01-06), section 2 (7 baris). Halaman lu cuma 462 kata, dan sebagian besarnya dipakai ngulang daftar yang sama. Ini yang bikin owner ngerasa "penempatannya asal": isinya diulang, bukan disusun.

**Fix:** Hapus daftar 01-06 dari hero. Sisanya cukup ada di section 2.

## 3. Hero tanpa produk, padahal demo lu aset terbaik

Hero setinggi 523px di layar 900px, dan isinya cuma teks. Padahal hal paling kuat yang lu punya, "Buka demo kasir. Tanpa daftar. Langsung jalan di browser.", malah ketimbun di section 3, sekitar 2.600px ke bawah.

**Fix:** Hero jadi 100vh (min 760px). Teks di col 1-5, screenshot kasir besar di col 6-12 dibiarkan bleed ke kanan. CTA utama: **"Coba kasirnya sekarang"**. CTA kedua dalam bentuk text link: "Ceritakan kebutuhan Anda".

## 4. Lu punya 8 CTA dan ga ada yang jadi pemimpin

Ceritakan kebutuhan, Hitung pajak dulu, tanya lewat WhatsApp, Buka demo kasir, Mulai gratis, Pakai Pro, Konsultasi layanan, Lihat paket. Lu nyuruh pengunjung milih delapan arah. Yang ada mereka ga milih apa-apa.

**Fix:** Cukup 2 aksi di seluruh halaman: **Coba kasir** (primary, satu-satunya elemen biru solid) dan **Konsultasi gratis** (secondary, text link). Tombol nav "Lihat paket" ganti jadi "Coba kasir".

## 5. H2 section 2 kebaca sebaliknya

"Yang kami urus makan waktu Anda." Dibaca cepat artinya *Olano yang makan waktu Anda*. Lu sendiri yang nulis kalimat yang nyerang produk lu.

**Fix:** "Yang biasanya makan waktu Anda, kami ambil alih."

## 6. Kolom tag di section 2 isinya campur aduk

Satu kolom isinya harga (Mulai Rp600rb), model bagi hasil (10% omzet), status (Tahap uji), dan kalimat (Belum ada di daftar). Empat jenis data di satu kolom, dan inilah "asal" yang dirasain owner tapi ga bisa dia namain.

**Fix:**
- Kolom tag khusus harga.
- Baris 6 (Otomasi, "Tahap uji") **dihapus dari halaman ini**. Lu lagi jualan barang yang belum jadi di halaman produksi.
- Baris 7 dipindah keluar tabel, jadi satu kalimat kecil di bawahnya.
- Hasilnya 5 baris. Tinggi section dari 1168px turun ke target sekitar 800px.

## 7. Showcase berantakan karena isinya memang ga beda

Dari 6 gambar, 3 di antaranya screenshot kasir yang sama. Lalu di section 3 ada tiga frame 4:5 dengan ukuran identik, persis "kartu identik" yang lu benci. Mata pengunjung ga dapet hierarki dan ga dapet hal baru.

**Fix:** Satu frame dominan (col 4-9, 4:5), dua frame pendukung (col 10-12) ditumpuk dengan rasio 1:1 dan isinya **crop close-up**: layar QRIS dan angka rekap pajak. **Butuh dari lu:** screenshot asli layar QRIS dan rekap. Jangan dipalsuin.

## 8. Section harga ga nyebut harga

Harga Pro ga ada di brief. Tabel 2 cuma kasih unit ("/bulan", "sekali bayar", "omzet tambahan") tanpa angka. Angkanya justru ada di section 2 (Rp600rb, Rp500rb). Di tabel itu juga masih ada baris "belum dibuka", dan di mobile tingginya 1299px.

**Fix:**
- Angka dipindah ke tabel harga, section 2 cukup "Mulai dari" atau tanpa harga.
- Hapus baris printer/WhatsApp.
- Kalau harga Pro belum fix, **bilang ke gw**. Tabel tanpa angka bikin pengunjung curiga.

## 9. Mobile

H1 dipecah jadi 12 span per kata. Itu persiapan animasi stagger, gimmick AI paling generik tahun ini, dan screen reader bisa membacanya terpotong-potong.

**Fix:** H1 jadi satu node teks. Animasinya cukup fade 0 -> 1, 400ms, ease-out, sekali aja. Menu hamburger 12 link dipangkas jadi 5: Produk, Harga, Kalkulator, Masuk, Coba kasir.

## 10. Ga ada bukti apa pun, padahal ini inti rasa "mewah"

Ga ada jumlah outlet, ga ada testimoni, ga ada wajah. Tagline "Satu tim yang kenal bisnis Anda" juga ga didukung apa-apa. Kemewahan itu datang dari kepercayaan diri yang dibuktikan, bukan dari font serif italic. Biru #2453EB plus Instrument Serif italic itu template startup 2024, dan ga ada yang khas Olano di situ.

**Fix:**
- Warna dominan ganti ke ink #0A0C14 dan off-white #F6F5F1. Biru cuma buat satu tombol primary.
- Instrument Serif dipakai maksimal 1x per layar.
- **Butuh dari lu:** data nyata (jumlah pengguna, satu testimoni dengan nama warung) untuk closing. Closing yang sekarang setinggi 351px itu penutup yang loyo.

---

## 3 prioritas

**1 jam:** ganti H1 dan H2 section 2 pakai teks di atas. Hapus Otomasi dan "belum dibuka". Satukan H1 jadi satu node teks. Nav CTA jadi "Coba kasir".

**1 hari:** bangun ulang hero (100vh, screenshot bleed, demo jadi primary). Hapus daftar 01-06 dari hero. Pangkas jadi 2 CTA. Pindahkan semua harga ke satu tabel.

**1 minggu:** ambil screenshot baru untuk QRIS dan rekap, lalu susun showcase dengan hierarki 1+2. Jalankan sistem warna ink + off-white. Kumpulkan bukti nyata untuk closing.

Halaman lu ga jelek karena kurang rapi. Halaman lu ga terasa mewah karena **takut memilih**. Pilih satu janji: kasir yang tetap jalan saat internet mati. Sisanya ikut di belakang.

---

## Pemilik Warung Kopi di Bandung, 34 tahun

# Gw buka Olano sambil berdiri di warung

Gw Asep, punya warung kopi di Bandung, omzet 25 juta sebulan. Buka dari HP Android sejutaan, sinyal lagi jelek, dan ada pelanggan yang nunggu kembalian.

---

## Detik 1-5: "Ini jualan apa sih?"

Yang pertama gw liat: **"Apa pun bisnis Anda butuhkan, kami urus."** Hurufnya gede banget, sampai satu layar HP penuh cuma buat kalimat itu.

Masalahnya, "apa pun" itu bahasanya calo. Tukang servis di depan pasar juga bilang "apa aja bisa, A". Gw jadi ga percaya. Gw juga belum tau ini aplikasi, jasa pembukuan, atau agensi website.

**Yang gw mau:** kasih tau dalam satu kalimat apa yang bisa gw pake hari ini.
- H1 ganti jadi: **"Kasir gratis buat warung. Tetap jalan walau internet mati."**
- Sub ganti jadi: **"QRIS terisi sendiri, rekap harian langsung ada di HP. Pajak dan GoFood bisa diurus tim kami kalau perlu."**

Kata "gratis" sama "tanpa internet" itu yang bikin gw berhenti scroll. Sekarang dua-duanya malah nyumput di baris pertama section 2.

---

## Detik 5-15: tombolnya bikin gw ragu

Di atas cuma ada satu tombol, **"Ceritakan kebutuhan Anda"**. Gw aja ga tau kebutuhan gw apa. Kalau gw pencet, nanti disuruh ngisi form panjang? Terus ditelpon sales? Gw ga mau pencet.

Padahal di bawah ada **"Buka demo kasir. Tanpa daftar. Langsung jalan di browser."** Itu kalimat paling bagus di seluruh halaman, tapi ditaruh di ujung section 3, setelah gw scroll 3 layar.

**Yang gw mau:**
- Tombol utama: **"Coba kasirnya sekarang"**, langsung buka demo Kopi Senja.
- Tombol kedua: **"Tanya lewat WhatsApp"**.
- "Ceritakan kebutuhan Anda" dibuang dari hero.

---

## Pas scroll: daftar yang sama, tiga kali

Di hero ada daftar 01-06 (Kasir, Pembukuan, Pajak...). Scroll dikit, muncul lagi 7 baris isinya sama. Di menu garis tiga, daftar itu muncul lagi. Gw berasa dibacain menu yang sama tiga kali sama pelayan.

Judul **"Yang kami urus makan waktu Anda."** gw baca dua kali. Yang makan waktu gw siapa? Olano-nya? Kedengerannya kebalik.

**Yang gw mau:**
- Daftar 01-06 di hero **dihapus**. Ganti satu screenshot kasir.
- H2 ganti jadi: **"Urusan yang biasanya bikin Anda pulang malam."**

---

## Harga: di sini gw paling curiga

- **"Mulai Rp600rb"** buat Pembukuan sama Pajak. Itu per bulan? Sekali bayar? Dua-duanya Rp600rb, jadi Rp1,2 juta? Buat warung gw, angka segitu ga kecil. Kalau ga jelas, gw tutup.
- **"10% omzet"** buat GrabFood. Gw kaget. 10% dari 25 juta itu 2,5 juta! Baru di tabel harga ditulis "omzet tambahan". Kenapa di atas ga ditulis dari awal?
- Paket **Pro**: gw ga nemu harganya di teks. Ada tombol "Pakai Pro", tapi gw ga tau bayar berapa. Ga mungkin gw pencet.
- Tabel kedua isinya cuma "/bulan", "sekali bayar", "belum dibuka". Angkanya mana? Ini tabel harga apa tabel rahasia?

**Yang gw mau:**
- Semua harga ditulis lengkap: **"Rp600rb/bulan"**.
- GrabFood: **"10% dari omzet tambahan. Kalau omzet ga naik, ga bayar."** (Itu juga kalau memang begitu aturannya. Owner harus pastiin dulu.)
- Harga Pro ditaruh gede di sebelah Rp0.
- Baris "belum dibuka" **dihapus** dari tabel harga.

---

## Yang bikin gw ga percaya

1. **"Otomasi (tahap uji)"** muncul di menu, di daftar layanan, di tag, di tabel. Empat kali kalian bilang "ini belum jadi". Buat apa? Jadi kesannya proyek setengah jadi. **Hapus dari menu sama hero**, cukup satu baris kecil di bawah: "Segera: rekap otomatis ke WhatsApp."
2. **Gambar kasirnya sama, tiga kali.** Gw kira HP gw nge-lag. Ganti jadi tiga layar yang beda beneran: keranjang, QRIS di layar, sama rekap harian.
3. **Ga ada manusianya.** Siapa yang punya? Warung mana yang udah pake? Di mana kantornya? Ga ada satu pun. Gw lebih percaya tukang kasir di Shopee yang ada fotonya. **Perlu data dari owner:** nama dan foto owner, nomor WA asli, sama nama warung yang udah pake (kalau ada). Jangan dikarang. Kalau belum ada pengguna, tulis jujur: "Dibuat oleh [nama], di [kota]."
4. Bahasanya **"Anda"** terus, kaku kayak surat dari bank. Gw ga minta pake "lu", tapi "Kasir & QRIS" ditaruh di sebelah "siap dibaca akuntan" itu kerasa bukan buat warung.

---

## Menu garis tiga

12 link. Gw cuma butuh tiga: **Coba kasir, Harga, WhatsApp.** Sisanya ga pernah gw pencet.

---

## Buat yang ngerjain (gw ga ngerti istilahnya, tapi ini titipan)

1. **Urutan section mobile:** Hero (H1 baru + screenshot + 2 tombol) > Produk (3 layar beda) > Harga app (Gratis vs Pro, angka lengkap) > Layanan tim (Pajak, Pembukuan, GoFood, Website, harga lengkap) > Siapa kami + WhatsApp. Target tinggi halaman turun dari 5037px ke sekitar 3600px.
2. **H1 mobile:** 40px jadi 34px, line-height 1.1, maksimal 3 baris. Jangan dipecah jadi 12 span per kata. Alasannya, layar pertama harus muat H1, sub, sama tombol tanpa scroll di tinggi 844px.
3. **Tombol hero:** tinggi 52px, lebar penuh di mobile, "Coba kasirnya sekarang" warna biru #2453EB, WhatsApp pakai border aja. Alasannya, jempol gw nyari tombol gede di bawah layar.
4. **Tabel harga mobile (1299px):** jangan bentuk tabel. Bikin dua blok ditumpuk, Gratis dulu baru Pro, harga di atas, maksimal 5 baris fitur. Alasannya, tabel dua kolom di 390px bikin gw harus geser-geser mata.
5. **Closing 351px:** isinya ga ada di brief yang gw terima. Kirim teksnya kalau mau gw nilai.

Terakhir, ini yang paling nyakitin. Halaman kalian rapi, tapi rapinya kayak kantor yang ga ada orangnya. Gw ga butuh mewah. Gw butuh ngerti dalam 5 detik, bisa nyoba dalam 1 pencetan, dan tau harganya sebelum gw ngobrol sama siapa pun. Sekarang ketiganya belum ada.

---

## Kritikus Copywriting dan Positioning

# Audit Copy Olano: halaman ini jualan lima hal sekaligus, jadi tidak ada satu pun yang kejual

## Diagnosis utama

Lu bilang "kurang mewah". Masalahnya bukan di font atau grid. Copy lu teriak "kami bisa semua", padahal brand mewah justru menahan diri dan cuma ngomong **satu hal**. Coba hitung ide yang lu jual: aplikasi kasir, jasa pembukuan, jasa pajak, konsultan GrabFood, agency website, dan otomasi. Itu enam. Pengunjung pulang tanpa ingat satu pun.

Senjata terkuat lu ada dua: kasir **gratis** yang **jalan tanpa internet**, dan demo yang bisa langsung dibuka **tanpa daftar**. Dua-duanya malah lu kubur di baris 1 section 2 dan di bawah screenshot section 3.

---

## 1. H1: salah grammar dan janjinya kosong

**"Apa pun bisnis Anda butuhkan, kami urus."**
- Kalimat ini cacat: kurang "yang". Harusnya "Apa pun **yang** bisnis Anda butuhkan". Ini H1 80px, salah grammar di ukuran segitu gak bisa dimaafin.
- "Apa pun" itu klaim yang mustahil dibuktiin. Ini nada agency serabutan, bukan produk.

**Ganti:** H1 "Kasir gratis. Tetap jalan saat internet mati."
Sub: "QRIS terisi sendiri, rekap pajak tersusun dari transaksi. Saat usaha tumbuh, tim kami yang urus pembukuan dan pajaknya."

## 2. "Satu tim yang kenal bisnis Anda"

Dari brief, owner-nya satu orang. Kalau "tim" itu belum beneran ada, klaim ini bisa balik nyerang lu begitu ada klien yang nanya. Kalaupun ada, "kenal bisnis Anda" itu kata kosong. Kenal dari mana?
**Solusi:** hapus. Kalau timnya ada, gw butuh angkanya (berapa orang, sudah pegang berapa outlet), lalu tulis faktanya. Contoh: "[missing: jumlah] usaha sudah kami urus pajaknya."

## 3. Sembilan CTA, sembilan kata kerja

Ceritakan kebutuhan / Lihat paket / lihat semua layanan / Hitung pajak dulu / tanya lewat WhatsApp / Buka demo kasir / Mulai gratis / Pakai Pro / Konsultasi layanan.
"Ceritakan kebutuhan Anda" itu CTA paling berat yang bisa lu pilih: pengunjung disuruh mikir dan ngetik sebelum dia percaya sama lu.

**Solusi:**
- Primary di mana-mana: **"Coba kasir sekarang"**, langsung ke demo.
- Secondary: **"Lihat harga"**.
- WhatsApp cukup di closing.
- Hapus "lihat semua layanan" dan "Hitung pajak dulu" dari body.

## 4. H2 section 2 bisa dibaca terbalik

**"Yang kami urus makan waktu Anda."** Kalimat ini kebaca "hal yang kami urus itu bikin waktu Anda habis". Lu nulis bahwa lu buang waktu klien.
**Ganti:** "Pekerjaan yang makan waktu Anda, kami ambil alih." Atau hapus section ini dan pindahin ke Harga (lihat urutan di bawah).

## 5. Tujuh baris layanan, tiga yang bocor

- **"kemungkinan tetap bisa kami kerjakan"** (baris 7): kata "kemungkinan" itu ngaku ragu di depan calon pembeli. **Hapus baris 7 seluruhnya.**
- **Otomasi "Tahap uji"** muncul di nav, di daftar hero 06, di baris 6, dan di tabel harga ("belum dibuka"). Barang yang belum ada lu pamerin empat kali. **Hapus dari hero dan nav**, sisain satu baris "Segera" di tabel harga.
- **"Untung di GrabFood dan GoFood"** itu janji hasil tanpa bukti. Tag "10% omzet" bikin orang ngira lu ambil 10% dari seluruh omzet. Di tabel harga ternyata "omzet tambahan". **Ganti tag:** "10% dari omzet tambahan". **Ganti headline:** "Audit menu dan promo GrabFood/GoFood". Klaim "untung" baru boleh dipakai kalau ada data sebelum/sesudah dari klien nyata.
- **Pola headline gak konsisten:** ada yang pertanyaan ("Pajak bulan ini, siapa urus?"), ada yang pernyataan. Pilih satu: semua pernyataan.

## 6. Harga: halaman Harga yang tidak menyebut harga

- **Harga Pro tidak ada.** "Gratis (Rp0/outlet/bln) vs Pro", terus CTA "Pakai Pro" tanpa angka. Ini dosa terbesar di seluruh halaman. **Butuh data: harga Pro per outlet per bulan.**
- **Tabel 2 tidak menyebut nama layanan maupun angkanya.** Baris "Reguler 3 hari, ngebut 1 hari | /bulan": layanan apa? Berapa? Padahal section 2 sudah bilang "Mulai Rp600rb". **Solusi:** kolom 1 nama layanan (Pembukuan, Pajak, GrabFood/GoFood, Website), kolom 2 angka (Rp600rb/bln, Rp600rb/bln, 10% omzet tambahan, Rp500rb sekali bayar), kolom 3 SLA.
- **"Pembukuan Rp600rb" dan "Pajak Rp600rb"** angkanya kembar. Paket terpisah atau satu paket? Kalau satu, gabung jadi satu baris.
- **"porsinya berbeda tiap usaha"**: "porsi" itu salah kata. **Ganti:** "Harga layanan tim tergantung jumlah transaksi dan outlet. Konsultasi pertama gratis."
- **"AI cek untung"**: AI-nya ngapain? **Ganti:** "Untung per menu, dihitung otomatis" (sesuai nama link di nav "Cek untung per menu").

## 7. Section 3: judul malas, lede defensif

- **"Produknya"** itu judul placeholder. **Ganti:** "Yang Anda pakai tiap hari."
- **"Tampilan asli dari aplikasi Olano."** Gak ada yang nanya. Kalimat ini malah nanem curiga bahwa biasanya tampilan lu palsu. **Hapus.**
- **Caption 3: "Rekap otomatis | Pajak dihitung dari transaksi"**: labelnya ngomong rekap, captionnya ngomong pajak. **Ganti caption:** "Omzet, untung, dan pajak bulan ini dalam satu layar."
- "Jalan tanpa internet" muncul **4 kali** (baris 1, lede S3, frame 1, tabel harga). Dengan total cuma 462 kata, pengulangan segini kebaca sebagai kehabisan ide. Cukup sekali di hero dan sekali di tabel.

## 8. Nav: nama yang beda untuk barang yang sama

"Kalkulator" di nav, "Hitung pajak dulu" di body. "Untung di GrabFood dan GoFood" di nav dan headline, "Jualan online" di label. **Solusi:** satu nama per barang. Nav jadi 4 item: **Kasir, Layanan tim, Harga, Masuk** + tombol "Coba kasir". Dropdown 6 link dihapus.

---

## Urutan halaman baru

1. **Hero:** kasir gratis offline + CTA demo
2. **Produk:** 3 screenshot dengan caption yang sudah diperbaiki
3. **Harga aplikasi:** Gratis vs Pro, **dengan angka**
4. **Layanan tim:** Pembukuan, Pajak, GrabFood/GoFood, Website. Section 2 lama dilebur ke sini sebagai tabel.
5. **Closing:** "Coba dulu. Tanpa daftar, langsung di browser." + WhatsApp

Satu halaman, satu ide: **kasirnya gratis, jasanya bayar saat lu butuh.**

## Data yang gw butuh dari lu

- Harga Pro
- Teks closing (tidak ada di brief, jadi belum bisa gw audit)
- Apakah "tim" itu memang ada, dan berapa orang
- Data hasil klien GrabFood/GoFood, kalau mau tetap pakai kata "untung"

---

## Konsultan Conversion Rate Optimization

# Audit funnel olano.vercel.app

Langsung aja: halaman lu nggak punya funnel. Yang ada cuma daftar menu. Owner bilang "kurang mewah", padahal masalahnya bukan di situ. Pengunjung nggak tahu harus ngapain, dan nggak punya alasan buat percaya. Desain semahal apa pun nggak bakal nolong dua hal itu.

**Hitungan CTA:** di halaman 462 kata ini gw hitung ada **9 aksi berbeda**: Ceritakan kebutuhan Anda, Lihat paket, Masuk, Hitung pajak dulu, tanya lewat WhatsApp, Buka demo kasir, Mulai gratis, Pakai Pro, Konsultasi layanan. Itu belum termasuk "lihat semua layanan". Ada 3 funnel yang saling rebutan: aplikasi self-serve, jasa tim, dan demo. Nggak ada satu pun yang jadi CTA utama.

---

## 1. CTA hero lu ngarahin orang ke langkah paling berat (paling mahal)

**Bukti:** Satu-satunya CTA di hero adalah "Ceritakan kebutuhan Anda". Itu minta orang ngarang kebutuhannya sendiri ke orang asing. Di sisi lain, aksi yang paling ringan, "Buka demo kasir. Tanpa daftar. Langsung jalan di browser.", malah lu kubur di akhir section 3: sekitar px 1700+ di desktop, layar ke-3 di mobile. Sebagian besar pengunjung nggak pernah scroll sampai sana. Di nav, CTA-nya "Lihat paket", beda lagi sama hero. Jadi dua tombol paling kelihatan di halaman ngajak ke dua arah berbeda.

**Fix:**
- CTA primary hero: **"Coba kasir gratis"**, langsung ke app/kasir.html. Microcopy di bawahnya: "Tanpa daftar. Jalan di browser HP Anda."
- CTA secondary hero berupa text link: **"Tanya lewat WhatsApp"**.
- Nav CTA "Lihat paket" ganti jadi **"Coba gratis"**, tujuannya sama dengan hero.
- Hapus "Hitung pajak dulu" dan "tanya lewat WhatsApp" dari section 2. Section itu tugasnya menjelaskan, bukan jualan.
- "Ceritakan kebutuhan Anda" pindah ke closing, khusus buat orang yang sudah yakin.

Alasannya: produk gratis tanpa daftar itu senjata konversi terkuat lu, dan sekarang lu sembunyiin.

## 2. Nol alasan untuk percaya, padahal yang lu minta itu data pajak

**Bukti:** Di 462 kata itu nggak ada testimoni, jumlah pengguna, nama orang, foto founder, atau kredensial siapa yang ngurus pajak. Lu minta UMKM nyerahin pajak dan pembukuan ("Dihitung, disisihkan, dan dilaporkan tim kami") ke brand tanpa wajah. Ditambah lagi ada **sinyal anti-trust** yang lu pasang sendiri:
- "Otomasi (tahap uji)" nongol di nav, di section 2, dan di pricing ("belum dibuka").
- "kemungkinan tetap bisa kami kerjakan": kata "kemungkinan" itu ragu-ragu, persis di tempat lu harusnya meyakinkan.
- "Satu tim yang kenal bisnis Anda", padahal owner-nya satu orang. Kalau ada yang nanya "timnya siapa?", lu ketahuan.

**Fix:**
- Tambah proof strip langsung di bawah hero, maksimal 120px tinggi. **Gw butuh data dari lu:** jumlah outlet aktif, 1–2 testimoni (nama, usaha, kota), dan siapa yang pegang laporan pajak beserta kredensialnya.
- Kalau datanya belum ada, jangan dikarang. Jadikan satu-orang itu kekuatan: bikin section founder dengan foto asli, nama, dan kalimat seperti "Saya [nama], saya sendiri yang cek rekap pajak Anda tiap bulan." Itu lebih dipercaya daripada "tim" yang nggak punya wajah.
- Hapus Otomasi dari nav dan pricing. Taruh 1 baris saja di section 2: "Segera: otomasi pesanan dan rekap WhatsApp."
- Ganti "kemungkinan tetap bisa kami kerjakan" jadi **"Ceritakan, kami jawab bisa atau tidak dalam [missing: jam] jam."**

## 3. Value prop kosong, dan H2 section 2 secara harfiah bilang kebalikannya

**Bukti:** H1 "Apa pun bisnis Anda butuhkan, kami urus." Kata "apa pun" itu artinya buat siapa saja, jadi ujungnya nggak buat siapa-siapa. Nggak ada kata warung, kafe, kasir, atau gratis. Lalu H2 "Yang kami urus makan waktu Anda." kebaca sebagai "yang kami urus menghabiskan waktu Anda". Itu bug copy, bukan gaya. Daftar 6 layanan juga diulang 3 kali (nav dropdown, hero 01–06, section 2), padahal halamannya cuma 462 kata.

**Fix:**
- H1: **"Kasir gratis yang jalan tanpa internet."**
- Sub: **"Untuk warung, kafe, dan toko. Pembukuan dan pajaknya bisa kami urus sekalian."**
- H2 section 2: **"Yang biasanya makan waktu Anda, kami ambil alih."**
- Hapus daftar 01–06 dari hero dan ganti dengan 1 screenshot kasir. Daftar lengkap cukup muncul di section 2.

Alasannya: orang beli hal spesifik. Kasir offline gratis bisa dipahami dalam 3 detik.

## 4. Harga kelihatan, terus hilang, terus ambigu

**Bukti:**
- Di section 2 ada angka (Rp600rb, Rp500rb, 10% omzet). Di tabel 2 Harga, angkanya justru hilang dan cuma tersisa "/bulan", "omzet tambahan", "sekali bayar". Section harga malah lebih nggak jelas daripada section sebelumnya.
- "10% omzet" vs "omzet tambahan": 10% dari total omzet atau 10% dari kenaikannya? Selisihnya bisa jutaan, dan orang yang ragu nggak bakal nanya, dia langsung pergi.
- Pembukuan dan Pajak sama-sama "Mulai Rp600rb". Bayar terpisah atau satu paket?
- Di data yang lu kasih, harga Pro **nggak muncul**, padahal ada tombol "Pakai Pro". Kalau memang nggak tampil di halaman, itu friction besar.

**Fix:** Tampilkan angka di setiap baris tabel 2. Tulis definisi persis: "10% dari kenaikan omzet di atas rata-rata 3 bulan terakhir" (**ini perlu lu konfirmasi**). Taruh harga Pro di atas tombolnya. Tambah 1 baris syarat seperti "Tanpa kontrak, berhenti kapan saja", tapi **hanya kalau itu benar**.

## 5. Nggak jelas apa yang terjadi setelah klik, dan keberatan dibiarkan

**Bukti:** "Ceritakan kebutuhan Anda", "Konsultasi layanan", dan "Pakai Pro" sama sekali nggak punya microcopy. Ini buka form? WhatsApp? Harus bayar dulu? Juga nggak ada FAQ. Keberatan standar UMKM nggak dijawab: data aman di mana, HP rusak datanya hilang atau nggak, perlu printer apa, bisa pindah dari kasir lama atau nggak. Closing yang cuma 351px juga nggak mengulang satu CTA yang jelas.

**Fix:**
- Microcopy 13px di bawah setiap CTA, contohnya "Buka WhatsApp, dibalas [missing: jam] jam" dan "Bayar setelah uji coba" (kalau memang begitu).
- Tambah FAQ 5 pertanyaan sebelum closing, dengan 4 keberatan di atas plus "kalau berhenti, data saya bagaimana?".
- Closing: H2 "Coba kasirnya sekarang. Gratis." dengan 1 tombol primary yang sama persis dengan hero.

---

## Urutan eksekusi
1. Copy H1, sub, dan H2 section 2 (#3): 30 menit, efeknya paling besar per menit.
2. Ubah CTA hero dan nav ke demo, hapus CTA dari section 2 (#1).
3. Angka di tabel harga dan definisi 10% (#4).
4.

---

## Founder Produk POS/Accounting UMKM Indonesia

# Audit Olano: kenapa halaman ini kalah di meja perbandingan

Gw langsung ke intinya. Lu nggak punya masalah "kurang mewah". Masalah lu: **halaman ini nggak jelas jualan apa**. Owner warung buka Moka, Majoo, BukuWarung dan Olano di empat tab. Tiga tab pertama langsung bilang "ini aplikasi kasir". Tab lu bilang "apa pun, kami urus". Itu kalimat agency, dan warung nggak lagi cari agency. Reviewer yang kasih 8/10 cuma menilai grid, padahal yang harus dinilai itu konversi.

---

## 1. H1 lu nggak bisa dicari dan nggak bisa dibandingkan

**Bukti:** H1 80px "Apa pun bisnis Anda butuhkan, kami urus."
**Masalah:** Kalimat ini bisa dipakai jasa web, konsultan, atau EO. Pemain besar selalu membuka dengan kategori ("aplikasi kasir"), karena itu kata yang diketik orang di Google. Senjata lu yang paling tajam malah nggak muncul: **kasirnya gratis, terus pajaknya dikerjakan tim**. Moka dan Majoo cuma kasih software, pembukuan tetap lu kerjakan sendiri. Ini satu-satunya keunggulan lu, dan lu sembunyikan di baris ke-3 section 2.
**Solusi:**
- H1: **"Kasir gratis yang jalan tanpa internet. Pajaknya kami yang urus."**
- 80px terlalu besar untuk 11 kata. Pakai 64px, line-height 1.05, max-width 11 kolom.
- Sub: "Catat transaksi di kasir, tim kami yang menyusun pembukuan dan melaporkan pajak bulanan Anda."

## 2. CTA hero salah fungsi

**Bukti:** Hero cuma punya satu CTA, "Ceritakan kebutuhan Anda". Demo tanpa daftar baru muncul di section 3.
**Masalah:** Orang yang cari POS mau mencoba dulu, bukan curhat. Pemain besar selalu menaruh "Coba gratis" di atas lipatan. Lu punya aset yang lebih kuat dari mereka (demo langsung jalan di browser, tanpa daftar), tapi lu kubur di 1.700px ke bawah.
**Solusi:** Primary: **"Coba kasir sekarang"** ke app/kasir.html. Secondary berupa text link: "Hitung pajak usaha Anda". "Ceritakan kebutuhan" pindah ke closing.

## 3. Konten yang sama diulang tiga kali dalam 462 kata

**Bukti:** Nav berisi 6 produk, hero punya daftar 01–06, section 2 punya 7 baris dengan isi yang sama.
**Masalah:** Halaman setipis ini malah menghabiskan sepertiga ruangnya untuk mengulang. Calon pembeli nggak akan menganggap ini kaya isi, mereka akan menganggapnya kosong.
**Solusi:** Hapus daftar 01–06 di hero. Isi ruang itu dengan screenshot kasir dalam frame tablet (col 7–12). Daftar layanan cukup muncul di section 2.

## 4. H2 section 2 secara harfiah bilang "kami buang waktu Anda"

**Bukti:** "Yang kami urus makan waktu Anda."
**Masalah:** Kalimat ini terbaca sebagai "hal yang kami urus itu makan waktu Anda". Ini kesalahan copy, bukan sekadar soal gaya.
**Solusi:** **"Yang biasanya makan waktu Anda, kami ambil alih."**

## 5. Halaman harga yang nggak menyebut harga

**Bukti:** Tabel Gratis vs Pro tanpa angka untuk Pro. Tabel layanan cuma bilang "/bulan", "sekali bayar", "omzet tambahan". Padahal section 2 menyebut Rp600rb, Rp500rb, 10% omzet.
**Masalah:** Ini titik kalah lu yang paling telak. Pemain besar menampilkan harga per tier secara terbuka. Begitu harga lu disembunyikan, pembeli menganggap mahal lalu menutup tab. Lebih parah lagi, "10% omzet" di section 2 dan "omzet tambahan" di tabel saling bertabrakan: ini 10% dari total omzet atau dari omzet tambahan? Selisihnya bisa jutaan, dan owner kafe akan langsung kabur.
**Solusi:**
- Tulis harga Pro per outlet per bulan. **Gw butuh angkanya dari lu.**
- Angka di tabel layanan harus sama persis dengan section 2.
- Jelaskan: "10% dari kenaikan omzet di GrabFood/GoFood, dihitung dari bulan ke-[x]". **Gw butuh detail skemanya.**
- Untuk "Mulai Rp600rb" pajak, sebutkan apa saja yang termasuk (berapa transaksi, lapor apa). Tanpa itu, angkanya nggak bisa dibandingkan dengan aplikasi pembukuan yang gratis.

## 6. Nol bukti bahwa lu nyata

**Bukti:** Ada 6 gambar, tiga di antaranya screenshot kasir yang sama. Nggak ada jumlah merchant, testimoni, foto outlet, rating aplikasi, atau nama orang di balik "tim".
**Masalah:** Semua pemain besar menjual pakai bukti sosial. Lu menjual pajak, yang artinya lu minta akses ke data keuangan. Tanpa wajah dan kredensial, "Satu tim yang kenal bisnis Anda" cuma terdengar seperti janji kosong.
**Solusi (pakai yang benar-benar ada, jangan dikarang):**
- Satu strip di bawah hero: jumlah outlet aktif, kota, dan satu kutipan pemilik usaha. **Butuh data.**
- Siapa yang mengerjakan pajak? Kalau ada konsultan bersertifikat, tulis nama dan sertifikasinya. **Butuh data.**
- Ganti 2 dari 3 screenshot dengan foto kasir di meja kafe sungguhan, lengkap dengan printer dan struk.

## 7. Pertanyaan pembeli POS nggak dijawab

**Masalah:** Dengan 462 kata, halaman ini diam soal hal-hal yang selalu dijawab kompetitor: bisa di HP Android atau harus tablet? Printer apa yang didukung? Data aman kalau HP hilang? Bisa pindah dari Moka atau Majoo?
**Solusi:** Tambah section FAQ dengan 6 pertanyaan sebelum closing, format accordion, 1 kolom di col 4–11. Kalau lu sanggup, tambahkan satu baris: "Pindah dari aplikasi lain? Data produk Anda kami input." Ini cara merebut pelanggan kompetitor.

## 8. Jangan jualan barang yang belum jadi

**Bukti:** "Otomasi (tahap uji)" ada di nav, "Tahap uji" di section 2, "belum dibuka" di tabel harga.
**Masalah:** Ini muncul tiga kali dan semuanya bilang "kami belum siap". Kesannya produk kecil yang setengah jadi.
**Solusi:** Hapus dari nav dan tabel harga. Sisakan satu baris kecil di section 2: "Segera: otomasi pesanan dan rekap WhatsApp. Daftar antre." Baris "Butuh yang lain?" juga dihapus, karena itu nada agency lagi.

## 9. Eksekusi visual yang memang bermasalah

- **Mobile H1 dipecah jadi 12 span:** screen reader membacanya kata per kata. Satukan jadi satu node, animasikan per baris kalau perlu.
- **Harga di mobile 1.299px:** dua tabel jadi kepanjangan. Tabel 1 ubah jadi 2 kartu yang ditumpuk, Pro di atas. Tabel 2 jadi list biasa. Target di bawah 900px.
- **Section 2 setinggi 1.168px untuk 7 baris:** padding per baris dipotong dari kira-kira 160 ke 112px.

---

## Urutan eksekusi

1. Copy: H1, sub, H2 section 2 (poin 1 dan 4)
2. CTA hero diganti ke demo (poin 2)
3. Hapus daftar di hero, ganti screenshot dalam frame tablet (poin 3)
4. Isi semua angka harga, perjelas skema 10% (poin 5) **← tunggu data dari owner**
5. Hapus semua penyebutan "tahap uji" (poin 8)
6. Strip bukti sosial plus foto outlet sungguhan (poin 6) **← tunggu data**
7. FAQ (poin 7)
8. Perbaikan mobile (poin 9)

Poin 1, 2 dan 5 akan menggerakkan konversi lebih banyak daripada gabungan semua revisi grid yang sudah lu kerjakan. Jangan sentuh radius, font, atau warna sebelum tiga poin itu beres.

---

## Brand Strategist (Aesop / Bang & Olufsen / Rimowa)

# Kenapa Olano terasa murah walau grid-nya rapi

Grid 12 kolom, radius 6px, tanpa shadow, screenshot asli. Semua itu cuma kebersihan dasar, belum karakter. Reviewer yang kasih 8/10 menilai "rapi atau tidak". Owner lu menilai "mahal atau tidak", dan itu pertanyaan lain. Halaman ini rapi, tapi tidak punya pendirian.

## Diagnosis: katalog yang menyamar jadi brand

**1. Daftar yang sama muncul 4 kali.** Enam layanan ada di nav dropdown, lalu di hero (01-06), di Section 2 (jadi 7 baris), lalu di tabel Harga 2. Totalnya cuma 462 kata, dan sebagian besar mengulang daftar yang sama. Brand mahal bilang satu hal sekali, dengan yakin. Template murah mengulang karena takut user melewatkannya.

**2. H1-nya janji untuk semua orang.** "Apa pun bisnis Anda butuhkan, kami urus." itu kalimat agensi serba-bisa. Rimowa tidak bilang "apa pun yang mau lu bawa". Mereka bilang aluminium. Begitu klaimnya "apa pun", tidak ada yang spesial lagi.

**3. Lu jualan barang yang belum jadi.** Nav ada "Otomasi (tahap uji)". Section 2 baris 6 ada tag "Tahap uji". Tabel harga ada "belum dibuka". Baris 7 bilang "kemungkinan tetap bisa kami kerjakan". Kata "kemungkinan" di landing page itu energi freelancer yang takut kehilangan klien. Brand mahal kelihatan dari apa yang mereka tolak.

**4. Ritmenya terbalik.** Section: hero 523, kebutuhan 1168, produk 975, harga 817, closing 351. Hero lebih pendek dari viewport 900, padahal H1 80px. Section terpanjang malah list teks. Produk asli, satu-satunya bukti nyata, kalah panjang dari daftar janji. Closing 351px berarti halaman berakhir tanpa klimaks. Ritme mahal itu kontras skala: satu momen yang sangat besar dan sunyi, diapit bagian yang padat. Di sini semuanya sedang-sedang saja.

**5. Header asimetris dipakai seragam.** Eyebrow col 1-3, H2 col 4-11, konten col 4-12, diulang di setiap section. Masalahnya sama dengan "kartu identik", cuma pindah ke level section. Pola yang diulang terus tanpa variasi jadi wallpaper.

**6. Aset terkuat lu dikubur.** "Buka demo kasir. Tanpa daftar. Langsung jalan di browser." Itu kalimat paling percaya diri di seluruh halaman, tapi ditaruh di bawah Section 3. CTA hero malah "Ceritakan kebutuhan Anda", yang artinya user disuruh kerja duluan. Di Harga CTA-nya "Mulai gratis". Jadi ada tiga aksi utama yang saling berebut.

**7. Copy yang salah arti.** "Yang kami urus makan waktu Anda." Kalau dibaca literal, artinya Olano yang makan waktu user. Ini bukan masalah selera, kalimatnya memang salah.

**8. Klaim tanpa bukti.** "Satu tim yang kenal bisnis Anda" tapi tidak ada nama, wajah, atau angka. Mahal itu soal spesifik. Gw butuh data nyata: jumlah outlet aktif, satu testimoni dengan nama warungnya, wajah owner. Jangan dikarang.

## Yang bikin brand terasa mahal secara struktural

- **Satu ide per layar.** Kepadatan rendah di momen penting, kepadatan tinggi di detail.
- **Kontras skala.** Ada satu elemen yang ukurannya berlebihan dengan sengaja.
- **Narasi, bukan katalog.** Satu protagonis, satu hari, satu alur.
- **Berani menghapus.** Yang belum siap tidak ditampilkan.
- **Harga ditulis terang.** Menyembunyikan angka di balik "konsultasi" itu sinyal tawar-menawar.

## 5 eksekusi konkret (urut)

**1. Bangun ulang hero: satu klaim, satu bukti, satu aksi.**
- Hapus daftar 01-06 dan link "lihat semua layanan".
- H1 baru: "Kasir yang tetap jalan saat internet mati." Desktop 80px -> 72px, lh 1.04, maks 2 baris. Mobile tetap 40px, tapi hapus pemecahan 12 span per kata, karena stagger per kata itu trik template.
- Sub: "Pembukuan dan pajak ikut tercatat dari setiap transaksi."
- CTA primer: "Coba kasirnya sekarang" -> demo. Sekunder berupa text link: "Lihat harga".
- Hero min-height 100svh (sekitar 900px), dengan satu screenshot kasir besar di col 6-12 yang keluar sedikit dari margin kanan. Alasannya: produk nyata adalah klaim yang tidak bisa ditiru kompetitor.

**2. Hapus semua yang belum jadi.**
- Buang Otomasi dari nav, Section 2 baris 6, dan tabel harga baris 4.
- Buang baris 7 "Butuh yang lain?".
- Gabungkan Pajak dan Pembukuan jadi satu baris, karena tag-nya sama "Mulai Rp600rb" dan produknya pun sama (rekap dari transaksi).
- Hasilnya 7 baris jadi 4, dan Section 2 turun dari 1168 ke sekitar 640px.
- Ganti H2 jadi "Yang makan waktu Anda, kami urus." Alasannya: lebih sedikit janji, lebih kuat kesannya.

**3. Ubah Section 3 jadi cerita satu hari di "Kopi Senja".**
- Ganti 3 frame 4:5 yang setara dengan satu alur kronologis, misalnya: buka (kasir offline) -> siang (QRIS dari keranjang) -> tutup (rekap + pajak).
- Frame pertama full col 1-12 dengan rasio 16:10. Dua berikutnya col 1-6 dan col 7-12, rasio 4:5.
- Label pakai jam, bukan nama fitur: "07.00", "12.30", "21.00". Angka transaksi di layarnya ambil dari data demo, [isi dari data demo], jangan dikarang.
- Ini juga jawaban buat keluhan "showcase berantakan". Masalahnya bukan layout, tapi tiga screenshot kasir yang hampir sama dijejerkan sejajar tanpa hierarki.

**4. Harga: tulis angka atau hapus barisnya.**
- Di tabel 1, harga Pro tidak ada di brief. Gw butuh angkanya, dan angka itu wajib tampil sebesar "Rp0".
- Di tabel 2, setiap baris wajib punya nominal: "/bulan" doang itu bukan harga. Kalau memang tidak bisa dipatok, tulis satu angka "Mulai RpX" dan hapus kolom satuan.
- Ganti CTA "Konsultasi layanan" dengan text link. CTA utama di section ini cukup satu: "Mulai gratis".

**5. Nav dipangkas, closing dijadikan klimaks.**
- Nav dari 5 item + dropdown 6 link jadi: Produk, Harga, Masuk, ditambah tombol "Coba kasir".
- Hapus Kalkulator dan Tentang dari nav, pindahkan ke footer.
- Menu mobile dari 12 link jadi 4, tanpa accordion. Masalah "overlay 3 garis berantakan" bukan soal teknis, tapi karena isinya kebanyakan.
- Closing dari 351 jadi sekitar 720px: satu kalimat "Buka kasirnya. Tanpa daftar." di 72px, satu tombol, dan tidak ada yang lain.

Halaman ini terasa murah bukan karena desainnya jelek.

---

## Data yang masih dibutuhkan dari owner

1. Harga Pro per outlet per bulan (belum ada di halaman, CTA 'Pakai Pro' tanpa angka).
2. Jumlah orang di balik kata 'tim' (halaman mengklaim 'satu tim yang kenal bisnis Anda').
3. Satu testimoni nyata dengan nama usaha + jumlah outlet aktif.
