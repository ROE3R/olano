# LOGIN ELEVATION PLAN — app/login.html (v1, 2026-10-17)

Tujuan: mengangkat halaman login olano dari "form generik putih + tombol biru" menjadi halaman
yang punya jati diri brand kuat — tanpa mengubah logika auth sedikit pun.

Batas keras (dari brief):
- Zero dependensi, mobile-first, PWA offline (file tetap self-contained, CSS pakai token main.css).
- A11y ≥95, kontras AA di semua kombinasi warna baru.
- ID input, handler submit, localStorage (`olano-auth-accounts` / `olano-auth-session`),
  hash FNV-1a, seed demo: TIDAK disentuh.
- CLS 0 saat load (semua elemen baru statis di HTML awal), motion transform/opacity saja.
- CSS baru ≤80 baris di `assets/css/main.css`; `<style>` inline login.html diganti class dari main.css.

---

## A. DIAGNOSA — kenapa login sekarang terasa generik
(berdasarkan markup aktual login.html + pengukuran computed style di browser)

1. **White void tanpa brand field.** Body putih polos; satu-satunya unsur brand adalah card
   kecil 400px. Tidak ada satupun permukaan berwarna brand. Referensi live yang kuat
   (Resend = black field penuh, fly.io = panel brand) memakai minimal satu bidang warna
   brand penuh sebagai panggung — login olano tidak punya.
2. **Header `pos-top` borrowed dari app, bukan milik auth.** Baris atas = logo kecil + tombol
   ghost "Beranda" — komponen kasir yang ditempel; memberi kesan halaman sisa, bukan gerbang.
3. **Hierarki tipografi datar.** H1 terukur hanya 20.8px/450 — lebih kecil dari body-large
   homepage (fs-body-lg = 24px). Eyebrow 11px inline style. Tidak ada satu elemen tipografi
   yang berani; tidak memakai `--fs-h2`/`--fs-h1`/serif accent yang jadi ciri situs.
4. **Tidak ada bukti produk/trust.** Janji inti olano (offline, data per perangkat, demo siap
   pakai) hanya ada di kalimat 14px abu-abu + note kecil. Bandingkan fly.io: panel samping
   berisi haiku brand; Supabase: quote social-proof. Form olano tidak menunjukkan apa-apa
   yang membuat pemilik warung percaya.
5. **Demo card tidak sepadan.** "Akun demo: demo / olano" = satu baris 13.5px dalam kotak
   blue-50 — padahal ini fitur onboarding paling kuat (bisa langsung coba). Tidak ada
   treatment mono/readout yang membuatnya terlihat seperti "kredensial siap pakai".
6. **Tab Masuk/Daftar = dua kotak border generik.** Pola seg-control paling dasar; state aktif
   hanya border biru. Tidak memakai pola `.badge`/pill yang sudah ada di design system.
7. **Detail mikro nol.** Tidak ada status readout, tidak ada nomor/label teknis, tidak ada
   texture — hal-hal kecil yang membuat login Linear (type restraint), Vercel (Geist mono),
   Supabase (label teknis) terasa "punya pemilik". Error state pun callout standar tanpa
   penempatan yang dipikirkan (muncul di atas field, menggeser konten ke bawah — fine, tapi
   tidak didesain).

---

## B. REFERENSI YANG DIANALISIS (diamati satu-satu)

### designeer.xyz (dibuka langsung, satu per satu)
Situs punya 5 bagian: **Finds** (grid demo live + modal detail), **Inspiration** (hub direktori:
60fps, Seesaw, Mobbin, Sombra dark-mode, Minimal Gallery, Curated Design, Details, Supahero…),
**Resources**, **Tools**, **Portfolios**. Modal detail tiap find memuat caption/teks konsep +
palet warna — 3 find terbaik untuk auth:

1. **sucodee — "Code input component" (bluma.design)** — tag Interface+Motion, bg krem #F6F4F0.
   Komponen input kode/OTP: kotak segmented, tipografi mono besar, focus state jelas.
   → Pola yang bisa dipinjam: **kredensial demo sebagai blok mono segmented/readout**, bukan
   catatan kaki.
2. **Corca — font matematika "built from the monospace fonts in code editors"** — palet hitam
   #000, abu #262527/#444, indigo #383A86. Demo menunjukkan mono yang dibangun jadi identitas
   numerik, bukan sekadar font kode.
   → Pola: **mono = suara angka/data** (Rp, jam, status), sans untuk kalimat. Sama dengan
   sistem olano (Geist Mono untuk angka di seluruh main.css).
3. **Sanni Ametu — "Systemic"** — palet #C0D7FF (light) → #75A6F3 → #1C5EC9 → #123978 →
   #081932 (navy). Sistem biru monokromatik dengan navy gelap sebagai anchor — hampir identik
   dengan token olano (blue-600 #2453EB, blue-950 #0E1A4A).
   → Pola: **brand field navy penuh + aksen biru terang** adalah bahasa visual yang sudah
   milik olano; tidak perlu hue baru.

Catatan proses: halaman detail designeer sering gagal (Cloudflare 1102, worker limits) dan
backend vision sedang tidak tersedia (402 provider eksternal), jadi warna diambil dari atribut
style DOM modal (nilai rgb asli) + tile CDN. Struktur situs dibaca dari nav DOM aktual.

### Login live startup (dibuka + computed style diukur)
4. **Linear /login** — putih, kolom tengah TANPA kartu, identity lewat tipografi saja
   (Inter 18px/500, tombol pill indigo #6D78D5 radius-full). Restraint total.
5. **Resend /login** — black field penuh, h1 28px ls-0.72px, input radius 16px + border 2px
   hairline oklab, teks putih. Identity = bidang warna gelap + mono detail.
6. **Vercel /login** — bg #FAFAFA, card putih, Geist 32/600, tombol hitam radius 8.
   Identity = font system + kontras hitam-putih.
7. **fly.io /app/sign-in** — form putih + panel brand ungu; panel berisi **haiku brand**
   ("Everywhere it goes / My servers, ever can fly…"). Identity = panel samping yang
   bercerita, bukan dekorasi.
8. **Supabase /dashboard/sign-in** — near-white, Manrope 28/600, label 13px teknis, quote
   social-proof di bawah. Identity = quiet technical + bukti.

### Token olano yang dipakai (nama terverifikasi di main.css)
`--blue-50/100/200/300/600/700/950`, `--gray-25/100/300/500/700`, `--ink`, `--white`,
`--font-display/-sans` (Aspekta), `--font-serif` (Instrument Serif italic), `--font-mono`
(Geist Mono), `--fs-h2/body/small/eyebrow`, `--ls-h1/h2/body`, `--sp-*`, `--r-md/lg/xl`,
`--grad-navy`, `--dur-*`, `--ease-emphasized`, class `.eyebrow .badge .field .btn-primary
.btn-pill .callout.light.warn .it-serif .skip .logo .mark .mono`, global `:focus-visible`,
guard `prefers-reduced-motion` global.

Kontras (dihitung): putih di atas #2453EB = 5.94:1 ✓AA; putih di atas #0E1A4A = 16.5:1 ✓;
`--blue-300` #93B8FD di atas blue-950 = 8.25:1 ✓; `--gray-500` di atas putih 7.2:1 ✓ dan di
atas blue-50 6.5:1 ✓; `--blue-700` di atas putih 7.6:1 ✓; ink di atas blue-50 ~15:1 ✓.
Semua kombinasi baru lolos AA (teks normal 4.5:1).

---

## C. TIGA CONCEPT

### 1. "Split Stance" ⭐ (rekomendasi)
Mood: gerbang brand dua-panel — kiri bidang navy penuh yang bercerita (fly.io haiku panel ×
Resend dark field × palet "Systemic"), kanan form putih tenang (Linear restraint).

Detail visual konkret:
- Kiri: `aside` grad-navy penuh tinggi; logo Olano putih; eyebrow mono biru-300;
  tagline besar Aspekta dengan aksen serif italic ("Kasir tetap jalan walau *internet mati.*");
  3 metrik mono raksasa (0 detik input transaksi · Rp0 biaya bulanan · 100% data milik toko);
  status readout mono di dasar panel: `PWA OFFLINE · SESI LOKAL · MODE DEMO: KOPI SENJA`
  dengan titik status hijau.
- Kanan: form kolom putih max-width 460 tanpa kartu tebal — card hanya hairline + shadow
  lembut (`--sh-card`), H1 naik ke ~28px/650, tab Masuk/Daftar jadi pill badge pair
  (pola `.badge`, aktif = biru-600 solid).
- Kredensial demo jadi blok readout mono: border-left 3px biru-600, bg blue-50,
  `demo / olano · Kopi Senja` dalam Geist Mono — terlihat seperti kredensial siap pakai.
- Mobile: brand panel jadi strip kompak di atas (logo + tagline 1 baris + readout mono
  1 baris; metrik disembunyikan), form tetap single column penuh di bawahnya.

Effort: sedang (~75 baris CSS + restruktur HTML bagian header/wrap; logika 0 baris).
Risiko: rendah — tidak ada gambar/font baru (grad-navy sudah ada), semua statis (CLS 0),
motion hanya entrance transform/opacity dengan guard reduced-motion; panel kiri overflow
terkendali (metrik `display:none` di <880px).
Fit UMKM trust: kuat — navy solid = yakin & aman (bukan warna main-main), angka mono
= jujur/transparan, demo menonjol = "coba dulu tanpa risiko".

### 2. "Terminal Kasir"
Mood: struk/printer kasir sebagai identitas — seluruh form bergaya struk thermor.

Detail visual: halaman bg gray-25; kartu putih border tebal 2px ink + radius kecil (8px);
semua label mono uppercase 11px ls .08em; input border-bottom saja (underline) mono;
header kartu = baris struk (`O LANO — STRUK MASUK — No. 0001`); demo account jadi blok
"barcode" mono besar; error = baris struk merah dengan prefix `!!`; tombol submit = hitam
ink (bukan biru). Status line bawah: `Lokal · Offline-ready · v23`.

Effort: sedang-tinggi (restyle semua input/label/tab; butuh disiplin agar tidak rusak `.field`
global — harus di-scope `.auth-*`).
Risiko: medium — mudah terlihat gimmick; mono untuk semua teks bisa menurunkan keterbacaan
form di layar kecil; lebih "developer" daripada "pemilik warung"; CLS aman.
Fit UMKM trust: sedang — struk familiar untuk pedagang, tapi tone-nya lebih teknis daripada
hangat; kurang cocok untuk audiens pemilik toko non-teknis.

### 3. "Editorial Ledger"
Mood: halaman majalah — tipografi besar, nomor section, hairline; kartu tengah seperti
halaman buku (pola .nrow/.modlist situs, Linear restraint dipecah serif).

Detail visual: bg putih; heading "Masuk." raksasa (fs-h1 clamp) dengan aksen serif italic
("Masuk. *Dengan tenang.*"); nomor section mono kecil `01 — Masuk` / `02 — Daftar` sebagai
pengganti tab; input underline hairline; demo card = baris ledger dengan nomor; footer note
dengan hairline top; tanpa kartu sama sekali (form langsung di halaman).

Effort: rendah-sedang (banyak menghapus, bukan menambah).
Risiko: medium — halaman jadi sangat polos; butuh konten panjang agar editorial terasa
(login isinya pendek → mudah jatuh kembali "generic white"); mobile perlu skala heading
dikecilkan manual; CLS aman.
Fit UMKM trust: sedang — elegan tapi kurang "kotak aman"; bukti trust lemah.

---

## D. RANKING + REKOMENDASI

1. **Split Stance** — identitas terkuat per effort: satu bidang navy langsung mematahkan
   kesan "form generik" (diagnosis A1) sementara form kanan tetap tenang dan familiar untuk
   pemilik warung; semua bahan sudah ada di token (grad-navy, mono, serif accent) → risiko
   teknis minimal; mobile fallback jelas; trust signals nyata (metrik + readout + demo
   menonjol). Ini gabungan pola terbaik: fly.io (panel bercerita) + Resend/palet Systemic
   (dark field biru) + Linear (form restraint) + sucodee (kredensial sebagai readout).
2. **Terminal Kasir** — ide kuat & sangat khas, tapi tone dev-tool; kurang pas untuk audiens
   UMKM non-teknis. Elemen terbaiknya (readout mono, label teknis) sudah diadopsi dalam
   Split Stance.
3. **Editorial Ledger** — paling aman tapi paling sedikit perubahan persepsi; polos-nya
   berisiko kembali ke "generic".

**CHOSEN: Split Stance.**

---

## E. SPEC EKSEKUSI — Split Stance (konkret)

### E.1 Struktur HTML login.html yang berubah
Hapus: `<header class="pos-top">…</header>` dan blok `<style>` inline (semua pindah main.css).
Baris 29 (skip link) TETAP. Struktur `<main>` baru:

```html
<main class="auth-shell" id="main">
  <aside class="auth-brand" aria-label="Tentang Olano">
    <a class="logo auth-logo" href="../index.html"><span class="mark">O</span>Olano</a>
    <div class="auth-brand-mid">
      <div class="eyebrow">Kasir Offline · per perangkat</div>
      <p class="auth-tagline">Kasir tetap jalan walau
        <em class="it-serif">internet mati.</em></p>
      <dl class="auth-metrics">
        <div><dt>Input transaksi</dt><dd><b>0</b> detik</dd></div>
        <div><dt>Biaya bulanan</dt><dd><b>Rp0</b></dd></div>
        <div><dt>Data toko</dt><dd><b>100%</b> di perangkatmu</dd></div>
      </dl>
    </div>
    <div class="auth-readout" role="note">
      <span class="auth-dot" aria-hidden="true"></span>PWA OFFLINE · SESI LOKAL ·
      MODE DEMO: KOPI SENJA<br>
      <a class="auth-home mono" href="../index.html">olano.xyz ↗</a>
    </div>
  </aside>
  <section class="auth-form-col">
    <div class="auth-card" id="auth-card">
      <!-- eyebrow DIHAPUS (pindah ke panel kiri); h1, tabs, kedua form, auth-demo,
           auth-note: SEMUA ID & URUTAN & atribut form TIDAK BERUBAH -->
      <h1>Masuk ke Kasir</h1>
      <p class="auth-sub">Kasir tetap jalan walau internet mati.</p>  <!-- boleh dihapus (duplikat tagline) -->
      <div class="auth-tabs" role="tablist" aria-label="Pilih masuk atau daftar">…id sama…</div>
      <form id="form-login" novalidate>…id & input sama persis…</form>
      <form id="form-reg" style="display:none" novalidate>…id & input sama persis…</form>
      <div class="auth-demo" id="auth-demo">Akun demo: <b>demo</b> / <b>olano</b> · Kopi Senja</div>
      <p class="auth-note">…sama…</p>
    </div>
  </section>
</main>
```
Larangan tetap: tidak ada `<script>` yang berubah; tidak ada id/handler yang berubah;
`h1` tunggal tetap di kartu; skip link & `#auth-card` target tetap.

### E.2 CSS baru di main.css (~78 baris, satuan 4pt, semua token ada)
```css
/* ===== LOGIN (auth) — Split Stance ===== */
.auth-shell{min-height:100svh;display:grid;grid-template-columns:1fr;background:var(--white)}
.auth-brand{background:var(--grad-navy);color:#fff;padding:var(--sp-6) var(--sp-6) var(--sp-6);
  display:flex;flex-direction:column;gap:var(--sp-6)}
.auth-logo{color:#fff}.auth-logo .mark{width:28px;height:28px}
.auth-brand .eyebrow{color:var(--blue-300);font-size:var(--fs-eyebrow)}
.auth-tagline{font-family:var(--font-display);font-size:clamp(1.75rem,4.5vw,2.375rem);
  font-weight:600;letter-spacing:var(--ls-h2);line-height:1.12;max-width:18ch;margin-top:var(--sp-3)}
.auth-metrics{display:none;gap:var(--sp-4);margin:var(--sp-6) 0 0}
.auth-metrics div{border-top:1px solid rgba(255,255,255,.16);padding-top:var(--sp-3)}
.auth-metrics dt{font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;
  text-transform:uppercase;color:var(--blue-300)}
.auth-metrics dd{margin:2px 0 0;font-size:var(--fs-small);color:var(--blue-200)}
.auth-metrics b{font-family:var(--font-mono);font-size:1.5rem;font-weight:700;color:#fff;
  font-variant-numeric:tabular-nums;letter-spacing:-.02em;margin-right:4px}
.auth-readout{margin-top:auto;font-family:var(--font-mono);font-size:11.5px;line-height:1.9;
  letter-spacing:.04em;color:var(--blue-300);border-top:1px solid rgba(255,255,255,.16);
  padding-top:var(--sp-3)}
.auth-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#5FE89A;
  margin-right:8px;vertical-align:1px}
.auth-home{color:var(--blue-200)}
@media(min-width:880px){
  .auth-shell{grid-template-columns:1.05fr 1fr}
  .auth-brand{padding:var(--sp-8)}
  .auth-metrics{display:grid}
}
.auth-form-col{display:flex;align-items:center;justify-content:center;padding:var(--sp-6) var(--gutter) var(--sp-12)}
.auth-card{width:100%;max-width:460px;background:#fff;border:1px solid var(--gray-100);
  border-radius:var(--r-xl);padding:var(--sp-6) var(--sp-6);box-shadow:var(--sh-card);
  animation:authIn var(--dur-slow) var(--ease-emphasized) both}
@keyframes authIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.auth-card h1{font-size:1.75rem;font-weight:650;letter-spacing:var(--ls-h2)}
.auth-sub{color:var(--gray-500);font-size:var(--fs-small);margin-top:6px}
.auth-tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:var(--sp-6) 0 var(--sp-4)}
.auth-tabs button{min-height:44px;border:1px solid var(--gray-300);border-radius:var(--r-full);
  background:#fff;font-weight:600;font-size:14px;color:var(--gray-500);
  transition:border-color var(--dur-fast),background var(--dur-fast),color var(--dur-fast)}
.auth-tabs button.on{border-color:var(--blue-600);background:var(--blue-600);color:#fff}
.auth-demo{margin-top:var(--sp-4);background:var(--blue-50);border:1px solid var(--blue-100);
  border-left:3px solid var(--blue-600);border-radius:var(--r-md);padding:12px 16px;
  font-family:var(--font-mono);font-size:13px;color:var(--gray-700)}
.auth-demo b{color:var(--blue-700);font-weight:700}
.auth-note{color:var(--gray-500);font-size:12px;line-height:1.55;margin-top:var(--sp-4);text-align:center}
.auth-note a{color:var(--blue-700);font-weight:600}
@media (prefers-reduced-motion:reduce){.auth-card{animation:none}}
```
(±78 baris — di bawah budget 80. `<style>` inline login.html dihapus; dua class lama yang
tidak dipakai lagi tidak menyisakan konflik karena nama sama di-cover definisi baru.)

### E.3 Treatment error state
- Markup & id tidak berubah: `<div class="callout light warn" id="login-error" role="alert" style="display:none;margin-bottom:14px">`.
- `showErr()` tetap mengisi textContent — callout.light.warn sudah AA (bg warning-bg, teks
  #7a4d00 ≥ 4.5:1) — tidak perlu warna baru.
- Satu penambahan visual murni CSS (di dalam E.2 budget): `.auth-card .callout{border-left:3px solid var(--warning)}` —
  konsisten dengan treatment border-left demo card, error jadi terbaca sebagai "baris status",
  bukan kotak kuning generik.

### E.4 Treatment demo card
Sudah di E.2: bg blue-50 + border-left 3px biru-600 + Geist Mono + kredensial bold biru-700
(kontras 6.9:1). Terlihat seperti "kartu kredensial siap pakai", bukan catatan kaki.
Teks & id `auth-demo` tidak berubah (tanpa JS auto-fill — logika tidak disentuh).

### E.5 Mobile behavior (≤879px)
- `grid-template-columns:1fr` — brand panel jadi strip atas: logo + tagline (clamp 1.75rem)
  + readout mono; **metrik `display:none`** agar form segera terlihat di atas-the-fold;
  padding panel 24px; tidak ada elemen dengan tinggi tetap → tidak ada overflow.
- Form column full width, card max-width 460 tetap (di 390px = full-bleed dengan gutter 24).
- Target sentuh: tab 44px, input 48px (dari `.field`), sudah memenuhi ≥44px.

### E.6 A11y
- Landmark: `aside[aria-label]` = complementary, `main#main` tetap, skip link tetap.
- Kontras: semua pasangan dihitung AA (lihat B). Titik status hijau dekoratif + `aria-hidden`,
  informasi status tetap ada sebagai teks.
- Focus: global `:focus-visible` (outline biru 2px offset 2) berlaku; input `.field` focus
  ring biru-100 4px sudah ada; tab pill aktif punya kontras teks putih-di-#2453EB 5.94:1.
- `role="tablist"/tab/aria-selected` & `role="alert"` tidak disentuh.
- Motion: satu animasi entrance 480ms transform/opacity, dimatikan oleh guard
  reduced-motion (baris eksplisit + guard global main.css).
- CLS: semua elemen baru statis di HTML awal; tanpa font/gambar baru; animasi transform-only
  (tidak memicu layout shift); panel kiri→atas di mobile murni perubahan grid statis.

### E.7 Yang TIDAK berubah (checklist)
- `<script>` blok auth 100% identik (hash FNV-1a, seed demo, session, submit handler).
- Semua id: `login-user login-pass form-login form-reg reg-store reg-user reg-pass
  login-error reg-error auth-demo auth-card tab-login tab-reg main`.
- `manifest.json`, `config.js`, PWA meta, theme-color #2453EB.
- File lain: hanya `app/login.html` + `assets/css/main.css` (append ~78 baris) yang disentuh.
