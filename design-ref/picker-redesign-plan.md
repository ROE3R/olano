# Redesign Plan: Modul Picker "Pilih modulmu" (index.html)

Sumber bukti: screenshot user (mobile, img_a09e66c9ac75.jpg, dianalisis via vision model gemini-3.8-flash),
screenshot internal `olano-v9-picker-1440.png` + `v9-fullpage-800.png` (vision), source `index.html` +
`assets/css/main.css` (blok `.modlist`/`.modrow`/`.mmeta`/`.mchip`, baris 897–941), `motion.js` v16,
scan designeer.xyz (katalog 422 tools, "Design Galleries" 78 entri; desuigner.xyz tidak resolve — DNS mati),
galeri pola sections.wtf (kategori terverifikasi: hero 189, index 70, pricing 51, features 45, cta 88, stats 20),
dan token design system Stripe/Linear/Notion/Wise dari skill popular-web-designs.

Constraint tetap: no new dependency, CLS < 0.1, Lighthouse mobile Perf ≥ 90 / A11y ≥ 95,
1 file CSS (main.css) + 1 JS vanilla (motion.js boleh extend), offline PWA, hairline + mono numeral + biru #2453EB + Instrument Serif Italic.

---

## A. ANALISIS SCREENSHOT (vision, mobile viewport)

### Apa yang tampak
- **Atas (hero, terpotong sebagian di frame):** headline besar "Sistem jualan untuk UMKM yang tetap jalan saat internet mati." (kata "mati" Instrument Serif Italic biru-800), sub 1 paragraf, satu CTA pill biru "Coba kasir gratis", produk screenshot aplikasi kasir.
- **Bawah (section picker):** eyebrow mono biru "MODUL", H2 "Enam modul. Satu aplikasi." + paragraf kecil abu di kanan/bawah head. Lalu 6 baris (01 Kasir, 02 Pajak, 03 Website, 04 Analisa Delivery, 05 AI Jaga Margin, 06 Automation) dipisah hairline 1px. Tiap baris: nomor mono kiri (01 biru = flagship, 02–05 abu terang, 06 dim), judul display bold, deskripsi 2 baris abu, chip mono berisi "contoh · [perhitungan angka]" (chip 01 solid biru putih; 02–05 tint biru muda; 06 abu dim), status "Sudah jalan →" / "Segera hadir →" (di mobile jatuh ke bawah konten, bukan kolom kanan).

### 5 kritik penataan konkret (vision + verifikasi source)
1. **Chip flagship terbaca sebagai "terpilih/klik", bukan aksen disengaja.** Row 01 chip solid biru vs row 02+ tint muda — bobot visual row 01 terlihat seperti state aktif yang tidak sengaja, bukan hierarchy. (Kontras juga jadi satu-satunya pembeda flagship; ukuran judul 1.5rem vs 1.3125rem nyaris tak terasa di mobile.)
2. **Garis scan vertikal patah.** Nomor di kolom kiri, tapi deskripsi/chip wrap full-width di bawah judul — mata harus "lompat" tiap baris; tidak ada satu garis lurus kedua untuk desc+chip. Di mobile grid 40px/1fr membuat desc rata dengan judul, nomor menggantung sendirian.
3. **Chip lebih keras daripada copy inti.** Chip mono berisi perhitungan (Rp50.000 − komisi 30% − … → laba Rp12.000) memakan tinggi baris (wrap 2 baris <560px) dan kontrasnya mengalahkan deskripsi — data contoh jadi bintang, penjelasan modul jadi footnote. Rag panjang chip juga tidak konsisten antar baris (ellipsis di ≥560px memotong angka).
4. **Status affordance lemah.** "Sudah jalan →" abu kecil, di mobile jatuh ke bawah chip — ambigu apakah itu link, tag, atau copy sekunder; panah yang sama muncul di row "Segera hadir" (row tidak-klik-dulu) sehingga affordance panah tidak membedakan apa pun.
5. **Ritme monoton, rasa "changelog/spec sheet".** 6 stack identik (teks-box-link) dengan padding vertikal sama + hairline sama = terasa dokumen release notes, bukan produk. Di desktop (1440) satu kolom teks memanjang melintasi kontainer lebar → dead space di kanan-tengah, baris ke-5 dan ke-6 terasa copy-paste row pertama.

(Desktop, dari CSS + capture 1440: kolom meta kanan cuma 132px sehingga status + panah mepet; chip duduk di bawah desc menambah tinggi baris tanpa memberi struktur kolom; tidak ada elemen yang mengisi sisi kiri/kanan section head — head kiri kosong ke kanan.)

---

## B. SCAN POLA KOMPOSISI (designeer.xyz → galeri & design system startup besar)

Fokus: cara site startup besar menampilkan daftar fitur/produk (bukan motion). Kategori digali dari katalog designeer.xyz (Design Galleries: sections.wtf, browse.cool, Mobbin, SiteInspire, Land-book, SEESAW "organized by page section") + token nyata Stripe/Linear/Notion/Wise/Apple dari repo template. Dari sana diabstrak 5 pola komposisi yang bisa dipakai untuk 6–7 item dalam budget:

### P1 — "Split Ledger": head sticky kiri + daftar kanan
**Referensi:** Stripe products index (nav kiri sticky, konten kanan scroll), Linear changelog (tahun sticky kiri, entri kanan), Apple Tech Specs; galeri: sections.wtf kategori "index" (70 entri terverifikasi di HTML), Land-book industri SaaS.
**Implementasi:** section picker jadi grid 2 kolom di ≥1000px: `grid-template-columns: 340px 1fr; gap: 56px`. Kolom kiri = head (eyebrow, H2, paragraf intro, baris mono kecil "04 aktif · 02 segera hadir") dengan `position: sticky; top: 96px; align-self: start`. Kolom kanan = `.modlist` apa adanya (6 baris hairline). Head tidak lagi 2-kolom lebar; paragraf intro tidak lagi menggantung di kanan head.
**Trade-off:** CLS 0 (CSS murni, tidak ada konten late-load); perf aman (sticky = compositor-friendly, tidak ada JS baru); a11y aman (urutan DOM tetap rail → list, heading order utuh, tidak ada fokus trap). Mobile <1000px rail jadi head normal. Risiko: sticky di iOS dengan address-bar resize → pakai top terukur + tanpa `height: 100vh` apa pun.

### P2 — "Flagship Expanded Row": row pertama dibuka default
**Referensi:** Linear feature/changelog rows (entri terbaru expand, sisanya ringkas), Stripe expandable product rows, Apple accordion spec rows; galeri: browse.cool (tactile lists), Mobbin (list + hero row).
**Implementasi:** Row 01 Kasir dirender lebih tinggi & kaya: judul 1.625rem, desc max-width 52ch, chip solid biru (sudah ada), plus SATU elemen ekstra: angka utama mono besar di kolom meta (mis. "MDR 0%" / "0 offline tx lost") atau mini-thumb produk `f-kasir.webp` 96×64 `border-radius 8` di kolom meta desktop. Row 02–06 tetap ringkas. TANPA toggle/accordion (static default) — klik = navigasi.
**Trade-off:** CLS 0 jika elemen ekstra statis & berukuran tetap (width/height eksplisit, bukan lazy); perf 0 (satu <img> kecil, `loading="eager"` karena above-the-fold-ish, atau SVG inline); a11y aman asal thumb `alt=""` dekoratif dan tetap satu link per row. Risiko terkecil dari semua pola, dampak hierarchy paling besar.

### P3 — "Number Ledger": chip data pindah ke kolomnya sendiri
**Referensi:** Stripe pricing/usage rows (angka di kolom kanan, tabular), Linear table metadata (kolom kanan mono), Wise rate rows; galeri: sections.wtf kategori "pricing" (51) & "stats" (20).
**Implementasi:** di ≥1000px `.modrow` grid jadi 4 kolom: `56px 1fr minmax(240px, 320px) 132px`; kolom 3 = `.mchip` (align-self center, `white-space: normal`, tanpa ellipsis — angka contoh harus terbaca utuh), kolom 4 = `.mmeta` status+panah. Deskripsi max-width 46ch. Dengan begini setiap baris punya dua garis scan: teks kiri, angka kanan — dan chip "dari kalkulator Olano" naik kelas jadi kolom data, bukan tempelan.
**Trade-off:** CLS 0 (CSS saja, DOM sama); perf 0; a11y: urutan baca mobile tetap (chip tetap setelah desc di DOM), kontras chip sudah lolos (blue-700 di blue-50; putih di #2453EB ≈ 7:1). Mobile <760px: chip kembali di bawah desc (perilaku sekarang, tanpa ellipsis).

### P4 — "Row Slide" hover (extend motion.js)
**Referensi:** hoverstat.es rows, details.so list interactions, browse.cool "tactile" selection; sejalan dengan magnetic yang sudah ada di motion.js (`.btn-primary, a.modrow`).
**Implementasi:** pointerenter pada `a.modrow` → `translateX(6px)` pada `.mcont` (transform saja, bukan padding) + nomor fill biru + panah geser (sudah ada). pointer:fine + !reduced-motion only, will-change scoped saat hover. Keluar → reset. Tidak menambah listener scroll; reuse handler magnetic yang sudah dipasang di elemen yang sama.
**Trade-off:** transform = tanpa CLS; biaya CPU nol saat idle; a11y tidak terpengaruh (dekoratif, reduced-motion dimatikan).

### P5 — "Ghost Numeral" section head
**Referensi:** Linear changelog "2026" oversized markers, Stripe section indices, SiteInspire editorial heads.
**Implementasi:** di rail (P1) tambah numeral mono raksasa redup ("01–06" atau "06") `font-size clamp(64px,8vw,96px)`, color var(--gray-100), `aria-hidden="true"`, absolute/inline di atas eyebrow, `user-select:none`. Memberi section head titik fokus non-teks tanpa gambar.
**Trade-off:** CLS 0 (ukuran tetap, bukan font baru); perf 0; a11y 0 risiko (aria-hidden). Paling kosmetik — hanya masuk akal jika rail sticky (P1) dibangun.

### Pola yang DITOLAK (alasan)
- **Bento grid 6 kartu** (Landingfolio/SaaSFrame umum): justru kembali ke flat "template card grid" yang sudah dibuang di v9→v10; CLS/perf lebih berat (gambar per kartu).
- **Zebra striping row** (Apple spec sheet): menambah pola visual yang bersaing dengan hairline + nomor; terasa spreadsheet.
- **Carousel/tab modul**: butuh JS state + a11y tambahan (roving tabindex), melanggar budget offline & A11y ≥95 dengan effort tinggi.

### Ranking untuk 6 modul + flagship Kasir + chip angka
1. **P1 Split Ledger** — memperbaiki komposisi section secara keseluruhan (dead space, head menggantung, monoton), pola paling khas startup besar, biaya nol.
2. **P3 Number Ledger** — menyelamatkan chip data angka (aset unik Olano) dari jadi tempelan; dua garis scan per baris.
3. **P2 Flagship Expanded Row** — momen hierarchy untuk Kasir tanpa grid kartu.
4. **P4 Row Slide** — polish tactile, extend motion.js yang sudah menyentuh `a.modrow`.
5. **P5 Ghost Numeral** — garnish; hanya dengan P1.

---

## REKOMENDASI 1: "Editorial Ledger" (P1 + P3 + P2, garnish P4/P5 opsional)

Satu sistem: rail sticky kiri (P1) + baris 4-kolom dengan kolom angka (P3) + row flagship expand (P2). Copy & motion TIDAK diubah.

### Spesifikasi HTML (index.html, section `.picker` saja)
```html
<section class="picker" aria-label="Pilih modul">
  <div class="container">
    <div class="pick-grid">
      <div class="pick-rail">
        <span class="pick-ghost" aria-hidden="true">06</span>   <!-- P5 opsional -->
        <div class="eyebrow">Modul</div>
        <h2>Enam modul. Satu aplikasi.</h2>
        <p class="small">Diurutkan dari modul yang paling sering dipakai. Angka di tiap baris keluar dari kalkulator Olano, bukan klaim.</p>
        <p class="pick-count" aria-hidden="true">05 aktif &middot; 01 segera hadir</p>  <!-- mono kecil -->
      </div>
      <div class="modlist stagger" data-reveal>
        <!-- baris 01 (flagship, P2): tambah SATU span meta-angka -->
        <a class="modrow fg" href="kasir.html">
          <span class="no">01</span>
          <span class="mcont">
            <b>Kasir</b>
            <span class="mdesc">…(tetap)</span>
            <span class="mchip">contoh · QRIS Rp40.000 → MDR 0% untuk usaha mikro</span>
          </span>
          <span class="mnum" aria-hidden="true">MDR&nbsp;0%</span>   <!-- P2, kolom angka flagship -->
          <span class="mmeta">…</span>
        </a>
        <!-- baris 02–06: struktur sama, TANPA .mnum -->
      </div>
    </div>
  </div>
</section>
```
Catatan: hapus inline style `margin-bottom:36px` dan head 2-kolom `.nlist-head` — head pindah ke rail. DOM `.modlist`/`.modrow` lain TIDAK berubah (chip tetap anak `.mcont` → urutan baca mobile aman).

### Spesifikasi CSS (main.css — tambah/ubah di blok picker 897–941)
```css
/* -- Editorial Ledger (P1+P3+P2): ganti blok head & grid kolom -- */
.pick-grid{display:grid; gap:var(--sp-8)}
@media(min-width:1000px){
  .pick-grid{grid-template-columns:340px 1fr; gap:56px; align-items:start}
  .pick-rail{position:sticky; top:96px}          /* P1 */
}
.pick-rail h2{font-size:var(--fs-h2); font-weight:450; letter-spacing:var(--ls-h2); margin:10px 0 16px}
.pick-rail .small{max-width:30ch}
.pick-count{font-family:var(--font-mono); font-size:12px; letter-spacing:.06em; color:var(--gray-400); margin-top:16px}
.pick-ghost{display:block; font-family:var(--font-mono); font-weight:600; line-height:1;
  font-size:clamp(64px,7vw,96px); color:var(--gray-100); user-select:none; margin-bottom:8px}  /* P5 opsional */

/* baris: 4 kolom di desktop (P3) */
.modrow{grid-template-columns:56px 1fr 132px}                       /* default (mobile 40px 1fr tetap) */
@media(min-width:1000px){
  .modrow{grid-template-columns:56px minmax(0,1fr) minmax(240px,300px) 132px; align-items:center}
  .modrow .mcont{max-width:52ch}
  .mchip{white-space:normal; text-overflow:clip; align-self:center; max-width:100%}
}
/* flagship expand (P2) */
.modrow.fg b{font-size:clamp(1.5rem,2vw,1.625rem)}
.modrow.fg .mdesc{max-width:48ch}
.mnum{display:none; font-family:var(--font-mono); font-weight:600; font-size:clamp(1.4rem,2vw,1.75rem);
  color:var(--blue-600); font-variant-numeric:tabular-nums; letter-spacing:-.02em}
@media(min-width:1000px){ .modrow.fg .mnum{display:block} }
/* mobile: chip tanpa ellipsis, jarak rapat */
@media(max-width:559px){ .mchip{white-space:normal; text-overflow:clip} }
```
Di ≥1000px baris 02–06 memakai kolom 3 untuk chip; baris 01 flagship menaruh `.mnum` di kolom 3 posisi sama dan chip flagship tetap mengikuti `.mcont` (baris flagship sengaja "tumpang tindih" kaya — satu momen aksen).

### Struktur kolom final (P3, satu kebenaran — tanpa `display:contents`)
- **DOM per row:** `<span class="no">` → `<span class="mcont">` (b + mdesc) → `<span class="mchip">` **jadi anak langsung `.modrow`** (keluar dari `.mcont`) → `<span class="mmeta">`. Row flagship menambah `<span class="mnum">` setelah `.mchip`.
- **Mobile <760px:** grid `40px 1fr`; rule `.mchip{grid-column:2}` menempatkan chip kembali tepat di bawah deskripsi — urutan baca visual identik dengan sekarang, perubahan DOM tidak terlihat.
- **760–999px:** grid `48px 1fr 116px`; chip di kolom 2 bawah mdesc (`.mchip{grid-column:2}`), meta kanan.
- **≥1000px:** grid `56px minmax(0,1fr) minmax(240px,300px) 132px`; `.mchip` otomatis di kolom 3 (`grid-column:auto`, `align-self:center`, `white-space:normal`, tanpa ellipsis), `.mmeta` kolom 4, `.mnum` mengisi kolom 3 di baris flagship (chip flagship `.modrow.fg .mchip{grid-column:2; justify-self:start}` — chip kecil di bawah desc, angka besar di kolom data).
Ini perubahan DOM 1-baris per row, aman, dan urutan tab/layar pembaca tetap `no → title → desc → chip → status`.

### Interaksi motion.js (extend, ~15 baris)
- Reuse handler magnetic yang sudah terpasang di `a.modrow`: tambah efek "row slide" — pada pointerenter set `row.style.setProperty('--slide','6px')`, pointerleave `''`; CSS: `@media(hover:hover) and (pointer:fine){ .mcont{transform:translateX(var(--slide,0)); transition:transform var(--dur-base) var(--ease-emphasized)} }`. Transform saja → tanpa CLS.
- Biarkan `.stagger[data-reveal]` dan IntersectionObserver yang ada jalan seperti sekarang (rail ikut kelas reveal section, tanpa stagger sendiri).
- TIDAK menambah: observer baru, listener scroll, parallax di picker.

### JANGAN disentuh (demi CLS/perf/a11y)
1. `assets/js/motion.js` bagian smooth-scroll spring, xfade veil, parallax `[data-parallax]` — tidak ada kaitannya dengan picker; regref suka merusak 60fps & keyboard scroll.
2. `<head>`/font/preload/`sw.js`/`manifest.json` — tidak ada perubahan font/asset baru; jangan tambah `<img>` tanpa `width/height` eksplisit (mini-thumb P2: pakai SVG inline atau `f-kasir.webp` dengan width/height + `loading="eager"`).
3. `.modlist.stagger>*{opacity:0; transform:…}` — jangan diubah timing-nya (reveal sudah aman); jangan pernah reveal via `height`/`max-height`.
4. Urutan DOM baris & satu-link-per-row (`<a>` wrapper) — jangan pecah jadi kolom terpisah (kebutuhan screen reader & tap target 48px).
5. `position:sticky` TIDAK di mobile (<1000px) — hindari repaint + address-bar jump iOS.
6. Tidak ada animasi `padding/margin/width` pada `.modrow` (row slide via transform saja).
7. Chip: pertahankan kontras (putih di #2453EB ≈ 7:1; blue-700 di blue-50); jangan turunkan ke gray di aktif-row demi "kesan tenang".

### Acceptance check (untuk eksekutor)
- Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, CLS < 0.1 (ukur: sticky + grid tidak menambah layout shift; font tetap).
- Keyboard: Tab berurutan 01→06, `:focus-visible` outline biru masih muncul (rule lama `outline-offset:-2px` tetap).
- Mobile 390px: chip terbaca utuh (tanpa ellipsis), status inline dengan panah, tanpa horizontal scroll.
- Desktop 1440px: rail diam saat list scroll (sticky), kolom angka & status sejajar vertikal antar baris.
