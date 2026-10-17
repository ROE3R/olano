# OLANO — Homepage Elevation Plan: dari "clean generik" ke jati diri
Tanggal: 2026-10-17 · Untuk: /root/olano/index.html + assets/css/main.css · Eksekutor: subagent berikutnya
Batas keras: PWA offline-first, zero dependensi baru (vanilla JS/CSS, token :root existing), CLS 0,
Lighthouse mobile Perf ≥90 / A11y ≥95, struktur section picker "Editorial Ledger" TIDAK dirombak,
copy register startup TIDAK diubah (visual/komposisi/mood saja).

---

## FONDASI: 8 REFERENSI (diamati SATU-SATU, live)

Sumber: designeer.xyz → tiga bagian berbeda (60fps collection, App Sites, Portfolios, Finds).
Vision backend 503 sepanjang sesi (wall daily check-in) → observasi via DOM/struktur + deskripsi
motion resmi halaman shot. Semua deskripsi di bawah dari pengamatan langsung halaman live.

### Dari koleksi 60fps (60fps.design, via designeer.xyz/inspiration/60fps)

**R1. Zomato — "No Internet Offline Game"** (`60fps.design/shots/zomato-no-internet-offline-game-interaction`)
Offline state bukan warning mati — dia jadi momen BRANDED yang bisa dimainkan ("Breaking Bread":
paddle roti memantulkan bola tomat, skor real-time, splatter saat gagal). Tag resmi: Empty State,
Gamification, Easter Egg. Pola: **keterbatasan (offline) diubah jadi karakter brand**, bukan disembunyikan.
→ Apply-ke-OLANO: janji #1 Olano adalah "tetap jalan walau internet mati" — homepage tidak pernah
memperlihatkan kondisi offline itu. Ada ruang untuk satu momen "offline" yang dibanggakan.

**R2. CRED — "No Internet Snake Game"** (`60fps.design/shots/cred-no-internet-snake-game`)
Keluarga sama dengan R1: offline screen retro pixel + game snake playable. Pola tambahan: treatment
**retro/pixel dibolehkan untuk satu state saja** sebagai easter egg, tanpa meracuni sisa halaman.

**R3. Platen — "Typewriter Intro"** (`60fps.design/shots/platen-typewriter-intro-how-to-interaction`)
Hold-to-reveal: menahan platen mesin tik memproyeksikan beam cahaya ke teks ketikan di atas kertas,
lalu tema berubah. Pola: **metafora fisik (mesin) sebagai kontrol UI** + reveal yang butuh iktiar
kecil pengguna. Kertas + ketikan = grammar visual yang kuat dan murah di-CSS (dashed rules, mono).

### Dari koleksi App Sites (landing page)

**R4. Apple Mac Mini — hero intro** (`60fps.design/appsites/apple-mac-mini-hero-intro-logo-text-animation`)
On load: glyph/grafik ber-siklus me-morph jadi teks "mini"; hand keluar frame; teks sekunder + CTA
pill + HARGA masuk dengan stagger. Pola: **hero punya satu momen entrance ter-choreografi** dan
harga diperlihatkan dekat CTA, bukan disembunyikan di bawah.

**R5. X Money — card envelope reveal** (3D unbox)
Tidak portable (butuh 3D/WebGL), tapi polanya: **objek utama brand di-unveil dengan satu gerakan**,
copy menyusul di bawahnya. Untuk Olano versi murahnya: struk/kartu harga yang "tercetak" (mask-reveal
satu kali), bukan fade generik.

### Dari Portfolios designeer.xyz (situs live)

**R6. emilkowal.ski (Emil Kowalski, Linear/Vercel)** — diukur langsung: bg `rgb(253,253,252)` (paper
hangat), ink `rgb(33,32,28)`, body 16/24, daftar proyek/tulisan = **list index murni tanpa kartu**
(judul + deskripsi satu baris + tanggal), motion minim tapi presisi. Identitas datang dari
**tipografi + ritme list, bukan dekorasi**. Prinsipnya literal "Friction as a Feature".

**R7. rauno.me (Rauno Freiberg, Vercel)** — bg `rgb(237,237,237)`, NOL gambar, h1 32px/500, identitas
dari **manifesto satu frasa per baris** ("Make it fast. Make it beautiful. Make it consistent. …")
+ label meta kecil (tahun, kategori). Pola: **satu blok teks berirama jadi logo hidup**.

### Dari Finds designeer.xyz

**R8. Corca — spesimen font matematika sans-serif** (`designeer.xyz/finds/corca-math-…`)
"Kontroversial karena orang terbiasa serif matematika" — identitas = **BERANI punya satu konvensi
tipografi sendiri**. Untuk Olano: angka mono tabular (Geist Mono) harus jadi "font kebenaran" di
seluruh halaman, bukan aksen lokal di picker saja.

### Anchor mood startup nyata (untuk kalibrasi, tidak di-scrape)
Linear (satu dark band sebagai ritme break), Stripe (index editorial baris bernomor + hairline),
Cal.com (struk/mono + angka besar line-height 1), Resend (restraint: satu ide per section).

---

## A. DIAGNOSA — kenapa homepage olano terasa "general"
(berdasarkan pembacaan index.html + main.css aktual, bukan opini)

1. **Hero = mood, bukan identitas.** Ada 5 layer dekoratif (sky foto, veil, grid-overlay, cloud,
   scrim — main.css 786–800) tapi NOL sinyal produk di fold pertama: tidak ada angka transaksi,
   tidak ada struk, tidak ada indikasi "kasir". Sky-nya bagus tapi anonim — bisa jadi hero SaaS
   Indonesia mana pun. Screenshot aplikasi (satu-satunya bukti produk) duduk di bawah CTA seperti
   template SaaS standar.
2. **Perangkat identitas ada tapi tidak diulang.** Nomor mono `01–06` + `mnum "MDR 0%"` di picker
   adalah ide terbaik halaman ini, tapi hero/alat/pajak/harga tidak memakai bahasa yang sama — jadi
   terbaca sebagai ornamen lokal, bukan sistem. (R8: konvensi harus di-semua-halaman atau bukan
   konvensi.)
3. **Skala tipografi datar.** H2 fix 28.9px (`--fs-h2`) di SEMUA section (picker, alat, pajak,
   harga); tidak ada satu pun momen angka/tipografi besar setelah H1. Editorial reference
   (Stripe/Cal) punya minimal satu "gesture" tipografis per layar.
4. **Ritme band monoton.** `body.home .section` = 120/120px seragam, permukaan hanya white /
   gray-25 / gray-50 (range nilai terlalu dekat), dan **tidak ada satu pun dark band** — padahal
   token `--blue-950` + `.section-dark` sudah ada di sistem dan TIDAK pernah dipakai di homepage.
5. **Aset terkuat dikubur.** Mesin pajak PP 20/2026 jalan nyata di dalam halaman (JS 286–314) tapi
   hasilnya (`Rp91.667`) dirender kecil sebagai form biasa. Kalkulator seharusnya jadi panggung,
   bukan pelengkap.
6. **Strip alat hampir siap tapi setengah jadi.** `.trow` sudah hairline + `tval` mono — tapi tanpa
   nomor baris, tanpa align kolom, `tval` gray kecil: kalah kuat dibanding `.modrow` di sebelah
   atasnya. Dua sistem list bersebelahan dengan tingkat keberanian berbeda = terasa tak sengaja.
7. **Harga = section paling template.** Dua kartu check-list standar; nol metafora struk/line-item
   padahal produknya KASIR — objek paling dikenal pemilik UMKM (struk) tidak dipakai sama sekali.
8. **Sinyal sistem absen.** Aplikasi POS punya `pos-status` (chips OFFLINE/SINKRON), tapi homepage
   tidak menampilkan satu pun status readout, padahal cerita offline-first adalah diferensiator
   utama brand. Scroll cue, penanda section, detail hover di luar perubahan warna: tidak ada.

---

## B. TIGA CONCEPT

### Concept 1 — "Struk Ledger"
**Mood:** seluruh halaman berbicara dalam tata bahasa struk kasir: angka mono tabular sebagai
"font kebenaran", garis putus-putus (dash) sebagai tear-line struk, alignment line-item
(nama kiri · nilai kanan), garis TOTAL tebal sebagai penutup, dan satu "cap" (stamp) miring.
**Detail konkret (5):**
1. Strip "struk" mini di hero: 3 baris mono (QRIS Rp40.000 · MDR 0% / Omzet Rp60.000.000/bln /
   PPh final Rp91.667) dalam border dashed + garis total — semua angka sudah ada di halaman.
2. `counter()` CSS memberi nomor `01…04` di strip alat → bahasa nomor picker menyebar.
3. Semua hairline pemisah di band harga/footer jadi `dashed` (tear line), garis TOTAL solid 2px ink.
4. Cap miring "PRO" (rotate 6deg, border 2px) di kartu harga aktif.
5. Readout mono berulang: `.tval` (alat), `.mnum` (picker), struk hero, hasil kalkulator — satu
   ukuran/keluarga, jadi motif.
**Effort:** Sedang (~140 baris CSS + ~12 baris HTML, 0 JS baru). **Risiko:** Rendah — semua
perubahan warna/border/pseudo-element (box model tak berubah → CLS 0); tanpa asset baru; kontras
aman (angka tetap ink/gray-700 di putih). **UMKM trust:** Tinggi — struk adalah objek yang dipahami
semua pemilik warung; angka nyata dari kalkulator = kejujuran brand ("angka keluar dari kalkulator,
bukan klaim").

### Concept 2 — "Layar Kasir"
**Mood:** homepage meniru chrome mesin kasir: baris status (● OFFLINE-READY / SINKRON 09:41),
CTA ber-keycap, picker jadi daftar PLU, headline seperti layar till, dark band sebagai "laporan
tutup buku" malam.
**Detail konkret (5):** status chips di tiap section head; H1 dengan caret berkedip satu kali;
keycap style (border-bottom tebal) pada tombol; picker kolom "PLU" angka 4 digit; harga sebagai
"closing report" mono besar.
**Effort:** Tinggi (banyak CSS baru + beberapa elemen baru per section). **Risiko:** Menengah-tinggi
— mudah jadi gimmick yang menenggelamkan konten; chip bertaburan = noise (kembali "numpuk");
butuh kawalan a11y ekstra. **UMKM trust:** Menengah — playful/techie, bisa terasa "aplikasi orang
kota" ketimbang alat warung.

### Concept 3 — "Paper Manifesto"
**Mood:** Emil/rauno: kertas + tinta + tipografi telanjang; manifesto satu frasa per baris; nomor
section ghost raksasa; dekorasi sky dikurangi drastis; biarkan Aspekta + Instrument Serif bicara.
**Detail konkret (5):** hero H1 dipecah jadi 3 baris manifesto dengan serif italic di kata kunci;
nomor ghost clamp(64–96px) gray-100 di rail picker; sky foto diganti gradasi statis; list index
murni ala emilkowal di semua section; footer jadi colophon.
**Effort:** Menengah-tinggi (hero dibangun ulang). **Risiko:** Menengah — mengubah hero berisiko
ke LCP (sky = fetchpriority high) & CLS; menghapus sky bisa mengubah mood terlalu "agency studio"
untuk pemilik UMKM; gradasi murni tanpa foto lebih generik, bukan kurang.
**UMKM trust:** Menengah — elegan tapi bisa terasa jauh dari dunia warung.

---

## C. REKOMENDASI: **Concept 1 — "Struk Ledger"** + SPEC EKSEKUSI

Alasan singkat: satu-satunya concept yang mengambil aset brand yang SUDAH dimiliki dan SUDAH
terbukti di halaman (angka kalkulator, MDR 0%, PP 20/2026, bahasa modul bernomor) lalu
mensistematisasinya — bukan menambah karakter dari luar. Risiko teknisnya terendah dari ketiganya
(nol layout shift, nol dependensi, nol JS baru), dan bahasa struk adalah jati diri yang dipahami
target pasar tanpa penjelasan.

**Gesture signature yang diulang di TIAP section:** pasangan `label-mono kecil uppercase + nilai
mono tabular` di atas garis dashed. Muncul sebagai: struk hero, nomor baris alat, status chip
picker, hasil kalkulator, line-item harga, colophon footer.

Semua CSS di bawah ditambahkan di AKHIR main.css di bawah banner:
`/* ==================== STRUK LEDGER ELEVATION v24 (homepage, body.home-scoped) ==================== */`
Perkiraan +140 baris. Perubahan HTML: hanya 2 lokasi kecil (hero, pajak class) — tanpa mengubah
satu kata copy.

### C.1 Token tambahan (main.css :root tidak diubah; pakai alias di blok baru)
```
--struk-dash: 1px dashed var(--gray-300);
--struk-num: var(--font-mono);
```
(Cukup 2 var di blok baru, bukan :root — supaya blok elevation satu kesatuan dan bisa dihapus
per-sendiri.)

### C.2 GLOBAL — nomor section (page-wide identity device)
Perubahan HTML: TIDAK ADA (pakai CSS counter di .container tiap section).
```css
body.home main{counter-reset:sec}
body.home main>section>.container{position:relative}
body.home main>section>.container::before{
  counter-increment:sec;
  content:"0" counter(sec) / "";
  position:absolute; top:-34px; left:24px;
  font-family:var(--struk-num); font-size:12px; font-weight:500;
  letter-spacing:.08em; color:var(--gray-300); font-variant-numeric:tabular-nums;
}
body.home #pajak>.container::before{color:rgba(255,255,255,.34)}
```
- `content:"01" / ""` (alt-empty) → tidak dibacakan screen reader. Section hero tanpa .container::before
  konflik: hero `.container` ada → dapat nomor 01 otomatis. Aman.
- 0 layout shift (absolute, pseudo). Kontras gray-300 di putih = dekoratif & tak diumumkan → lolos
  A11y (bukan teks informatif; informasi tetap via heading).

### C.3 HERO — struk readout + scroll cue
Perubahan HTML (index.html, setelah `.cta-row`, sebelum `.hero-visual`):
```html
<div class="hero-struk" aria-hidden="true">
  <span class="hs-row"><span>QRIS Rp40.000</span><span>MDR 0%</span></span>
  <span class="hs-row"><span>Omzet Rp60.000.000/bln</span><span>PPh final</span></span>
  <span class="hs-row hs-total"><span>PPh final 0,5%</span><span>Rp91.667</span></span>
</div>
```
- `aria-hidden="true"`: angka sama persis sudah dibacakan dari picker + kalkulator; ini kanal visual.
- Angka terverifikasi: 60jt/bln → 720jt/thn − 500jt bebas = 220jt × 0,5% = 1,1jt/thn ÷ 12 = Rp91.667/bln
  (sama dengan default kalkulator di halaman — R-38 aman).
```css
.hero-struk{
  width:min(420px,88%); margin:36px auto 0; padding:14px 18px;
  border:var(--struk-dash); border-radius:var(--r-md); background:rgba(255,255,255,.66);
  backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
  display:flex; flex-direction:column; gap:8px;
}
.hs-row{display:flex; justify-content:space-between; gap:16px;
  font-family:var(--struk-num); font-size:13px; color:var(--gray-700);
  font-variant-numeric:tabular-nums; letter-spacing:.01em}
.hs-total{border-top:1px solid var(--ink); padding-top:9px; color:var(--ink); font-weight:600}
.hs-total span:last-child{color:var(--blue-700)}
.hero-struk{opacity:0; transform:translateY(8px);
  transition:opacity .6s var(--ease-emphasized) .35s, transform .6s var(--ease-emphasized) .35s}
.hero-struk.in{opacity:1; transform:none}
```
- Entry one-shot via `IntersectionObserver` yang SUDAH ADA (`[data-reveal]` di shared/motion): cukup
  tambah `data-reveal` pada div → handler existing memberi class `.in`; transition di atas override
  default reveal. TANPA JS baru. (Kalau ingin 100% tanpa menyentuh JS: hapus dua rule transition
  dan biarkan reveal bawaan.)
- CLS: div statis tinggi tetap konten (3 baris + padding ≈ 108px), tidak ada konten async, tidak
  menggeser `.hero-visual` karena bagian dari flow yang sudah dirender di HTML awal.
- LCP tidak tersentuh (sky image tetap elemen LCP, fetchpriority high tetap).
- Latar struk putih .66 + blur → teks ink/gray-700 di atasnya AA (worst-case di atas sky terang;
  scrim radial putih .72 sudah menutupi zona tengah).

Scroll cue (HTML: 1 div sebelum penutup `.hero`):
```html
<div class="hero-cue" aria-hidden="true"></div>
```
```css
.hero-cue{position:absolute; left:50%; bottom:22px; width:1px; height:44px;
  background:linear-gradient(180deg, var(--blue-600), transparent); opacity:.55;
  transform-origin:top; animation:cueDrop 2.2s var(--ease-emphasized) 1s 2 both}
@keyframes cueDrop{0%{transform:scaleY(0)}55%{transform:scaleY(1)}100%{transform:scaleY(1);opacity:0}}
@media (prefers-reduced-motion:reduce){.hero-cue{animation:none; opacity:.35}}
```
(scaleY transform-only, 2 iterasi lalu berhenti — bukan loop abadi.)

### C.4 PICKER "Editorial Ledger" — refinement AMAN saja (struktur tidak disentuh)
Tidak ada perubahan HTML. Tiga sentuhan:
```css
/* nomor baris picker dapat tick hairline: motif "ledger" */
body.home .modrow .no{position:relative; padding-top:8px}
/* status = bahasa POS app (dot) — reuse --success */
body.home .mst{display:inline-flex; align-items:center; gap:6px}
body.home .mst::before{content:""; width:6px; height:6px; border-radius:50%;
  background:var(--success); flex:none}
body.home .modrow.soon .mst::before{background:var(--gray-300)}
/* hover: tepi kiri biru tanpa layout shift */
@media(hover:hover){body.home .modrow:hover{box-shadow:inset 2px 0 0 var(--blue-600)}}
/* flagship MDR 0% sedikit lebih besar (tetap clamp) */
body.home .mnum{font-size:clamp(1.6rem,2.2vw,1.9rem)}
```
- Dot 6px di dalam `.mst` inline-flex: line-height tak berubah → CLS 0.
- `.mst` "Segera hadir" + dot abu: status readout pertama di halaman — sinyal sistem (R-diagnosa #8).

### C.5 ALAT — nomor baris counter + kolom nilai lebih tegas
Tidak ada perubahan HTML.
```css
body.home .tlist{counter-reset:tl}
body.home .trow::before{
  counter-increment:tl;
  content:"0" counter(tl) / "";
  font-family:var(--struk-num); font-size:13px; font-weight:500;
  color:var(--gray-300); min-width:28px; flex:none;
  font-variant-numeric:tabular-nums; letter-spacing:.05em;
}
body.home .trow:hover::before{color:var(--blue-600)}
body.home .trow b{min-width:0}
```
- Counter = nomor `01–04` menyatu dengan bahasa picker. Pseudo-element flex item: menggeser isi
  baris ke kanan 28px pada SEMUA viewport sekaligus dan dirender di first paint → CLS 0.
- Mobile ≤559px: `.trow b` sudah ellipsis; nomor tetap muat (min-width 28px). Kontras gray-300
  dekoratif (nomor juga tak informatif-murni, urutan tetap terbaca urutan DOM) — aman; opsional
  naikkan ke gray-500 bila ingin lebih tegas.

### C.6 PAJAK — SATU dark band (ritme break terbesar di seluruh plan)
Perubahan HTML (2 token class, 0 kata):
- `<section class="section alt-deep" id="pajak">` → `<section class="section section-dark" id="pajak">`
- `<div class="callout light" style="margin-top:20px">` → `<div class="callout" style="margin-top:20px">`
CSS tambahan:
```css
body.home #pajak{background:var(--blue-950)}
body.home #pajak h2{color:#fff; max-width:26ch}
body.home #pajak .callout{margin-top:20px}
body.home #pajak .hint{color:var(--gray-300)}
body.home #pajak .calc-card{box-shadow:0 24px 64px -16px rgba(0,0,0,.45)}
body.home #pajak .calc-out-box b{font-variant-numeric:tabular-nums}
```
- `.section-dark` sudah menangani h2 putih + `.small` #9FB0DA (kontras di #0E1A4A: putih 15,9:1,
  #9FB0DA ≈ 7:1 — AA/AAA). `.callout` versi dark (glass) sudah ada. `.calc-card` tetap putih di
  atas navy → kalkulator jadi panggung (diagosa #5).
- Latar berubah, geometri nol → CLS 0. Tanpa gradient baru; token existing.
- Hasil `Rp91.667` di kartu tetap ink-on-white. Ditambah: label hasil besar via existing
  `.out-hero b` (clamp 1.75–2.25rem) — cukup, jangan lebih.

### C.7 HARGA — line-item struk + cap
Tidak ada perubahan HTML.
```css
body.home .price-list li{border-bottom:1px dashed var(--gray-100); padding-bottom:10px}
body.home .price-list{gap:12px}
body.home .price-card.active{position:relative; overflow:hidden}
body.home .price-card.active::after{
  content:"PRO"; position:absolute; top:18px; right:18px;
  font-family:var(--struk-num); font-size:12px; font-weight:600;
  letter-spacing:.14em; color:var(--blue-600);
  border:2px solid var(--blue-600); border-radius:8px; padding:3px 10px;
  transform:rotate(6deg); opacity:.85; background:rgba(255,255,255,.55);
}
body.home .price-close{border-top:var(--struk-dash); padding-top:72px}
body.home .price-close h2{font-size:var(--fs-h1); font-weight:600; letter-spacing:var(--ls-h1);
  line-height:1.1; max-width:18ch; margin:0 auto}
```
- Stamp = pseudo, absolute → 0 shift. Kata "PRO" = ulang kata yang sudah ada di kartu (bukan copy
  baru; dekorasi visual cap). Di bg blue-50 kartu aktif, border/cap biru #2453EB kontras 4,6:1
  terhadap #DBE8FE… hitung: #2453EB vs #EFF5FF ≈ 5,4:1 → AA untuk teks 12px bold (teks kecil butuh
  4,5:1) ✓; plus ini duplikat dekoratif dari judul kartu.
- `.price-close` H2 naik ke skala H1 = gesture tipografis penutup (diagosa #3) tanpa kata baru.
- Line-item dashed + gap 12 = ritme struk; check icon tetap.

### C.8 FOOTER — colophon tear
```css
body.home .foot{border-top:1px dashed var(--gray-300)}
body.home .foot .legal{font-family:var(--struk-num); font-size:12px; letter-spacing:.01em}
```
Footer terakhir = kertas terakhir struk. (Dashed bukan solid: same box-model, 0 shift.)

### C.9 Detail kecil global (semua CSS, tanpa HTML baru)
```css
/* fokus inset konsisten di semua row-link (pola .modrow/.trow yang sudah ada) */
body.home a:focus-visible{outline-offset:-2px}
/* selection + scrollbar sudah ada; cukup 1 sentuhan: angka di semua konteks pakai tnum */
body.home .small b{font-variant-numeric:tabular-nums}
/* reduced-motion guard blok baru */
@media (prefers-reduced-motion:reduce){
  body.home .hero-struk{transition:none; opacity:1; transform:none}
}
```

### C.10 CHECKLIST VALIDASI (untuk subagent eksekutor)
- [ ] CLS 0: semua elemen baru = static HTML awal / absolute / pseudo; tidak ada img baru; jalankan
      Lighthouse mobile sebelum & sesudah, tulis angkanya di laporan.
- [ ] Perf: nol request baru, nol JS baru; CSS +~140 baris (gzip <1KB).
- [ ] A11y: kontras terburuk = gray-700 #343C4F di rgba(255,255,255,.66) di atas sky terang —
      dijamin oleh scrim putih .72; white di #0E1A4A 15,9:1; #9FB0DA di #0E1A4A ≈7:1; pseudo
      dekoratif pakai `content:"…" / ""` (alt kosong).
- [ ] Motion: hanya transform/opacity; entrance one-shot; loop TIDAK ADA (cue 2x lalu berhenti);
      guard reduced-motion untuk tiap animasi baru.
- [ ] Copy: `git diff index.html` hanya boleh menunjukkan: +div.hero-struk (3 baris angka yang
      sudah ada di halaman), +div.hero-cue, class swap `alt-deep→section-dark`,
      `callout light→callout`. TIDAK ada perubahan kata lain.
- [ ] Picker: `git diff` pada markup modlist = NOL (hanya CSS).
- [ ] PWA/service worker tidak tersentuh; manifest tidak berubah.

---

## D. RANKING

1. **Struk Ledger** ← PILIH. Identitas dari kejujuran angka + objek yang dipahami pasar (struk);
   aset sudah ada tinggal disistemkan; risiko teknis terendah (CLS 0 by construction); satu dark
   band memberi ritme; bahasa nomor menyebar page-wide. Kontras dengan "template startup" paling
   tajam: tidak ada startup AI generik yang berani berbahasa struk.
2. **Layar Kasir** — kuat dan sangat "kasir", tapi butuh lebih banyak elemen baru per section
   (noise risk tinggi, kembali ke keluhan "numpuk"), effort terbesar, dan gimmick bisa menua cepat.
   Beberapa idenya (status dot, bahasa POS) sudah diserap ke Struk Ledger.
3. **Paper Manifesto** — paling elegan secara studio, tapi paling jauh dari trust UMKM dan paling
   berisiko pada hero (LCP/CLS); menghapus sky justru menghilangkan satu-satunya aset mood yang
   sudah unik milik Olano.

## LAMPIRAN — referensi yang dianalisis (path/URL)
- https://60fps.design/shots/zomato-no-internet-offline-game-interaction (via designeer.xyz/inspiration/60fps)
- https://60fps.design/shots/cred-no-internet-snake-game
- https://60fps.design/shots/platen-typewriter-intro-how-to-interaction
- https://60fps.design/appsites/apple-mac-mini-hero-intro-logo-text-animation
- https://60fps.design/appsites/x-money-card-envelop-reveal-animation
- https://emilkowal.ski/ (via designeer.xyz/portfolios/emil-kowalski)
- https://rauno.me/ (via designeer.xyz/portfolios/rauno-freiberg)
- https://designeer.xyz/finds/corca-math-2111149658294951962
Catatan metode: vision backend 503 sepanjang sesi → analisis via DOM live + computed style +
deskripsi resmi motion tiap shot (lebih presisi untuk intent motion daripada tebakan piksel).
Screenshot tersimpan: /mnt/data/.hermes/profiles/tg-agent/cache/scratch/ref-corca.png,
ref-zomato-offline.png, ref-emilkowal.png (fallback dokumentasi).
