#!/usr/bin/env python3
"""Olano: sinkronisasi header + footer kanonis ke semua halaman pemasaran.
Sesuai brief P1-01/P1-03: satu komponen, satu sumber, dipasang ke semua halaman
pemasaran (kecuali aplikasi app/*, perantara kasir.html, dan demo template
templates/katalog.html). Ubah template di sini, jalankan --apply. Jangan edit
markup header/footer per halaman.

Pengecek: audit/tools/check_chrome.py (header antar halaman harus identik,
kecuali atribut aria-current + prefix path)."""
import re, os, sys

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(BASE)

# (halaman, prefix path, slug aktif untuk aria-current)
PAGES = [
    ("index.html",                 "",  None),
    ("umkm.html",                  "",  "umkm"),
    ("pajak.html",                 "",  "pajak"),
    ("website.html",               "",  "website"),
    ("analisa-delivery.html",      "",  "analisa-delivery"),
    ("ai.html",                    "",  "ai"),
    ("automation.html",            "",  "automation"),
    ("naik-kelas.html",            "",  "naik-kelas"),
    ("tentang.html",               "",  None),
    ("kebijakan-privasi.html",     "",  None),
    ("syarat-ketentuan.html",      "",  None),
    ("alat/kalkulator-pph-final-umkm.html",  "..", "pph"),
    ("alat/kalkulator-hpp-harga-jual.html",  "..", "hpp"),
    ("alat/kalkulator-biaya-qris.html",       "..", "qris"),
    ("alat/kalkulator-margin-delivery.html",  "..", "margin"),
]

# (href relatif ke root, label, slug, chip "Segera hadir"?)
PRODUK = [
    ("umkm.html",             "Kasir UMKM",       "umkm",  False),
    ("pajak.html",            "Pajak",            "pajak", False),
    ("website.html",          "Website",          "website", False),
    ("analisa-delivery.html", "Analisa Delivery", "analisa-delivery", False),
    ("ai.html",               "AI Jaga Margin",   "ai",    False),
    ("automation.html",       "Automation",       "automation", True),
    ("naik-kelas.html",       "Naik Kelas",       "naik-kelas", False),
]
KALC = [
    ("alat/kalkulator-pph-final-umkm.html", "PPh Final UMKM",     "pph", False),
    ("alat/kalkulator-hpp-harga-jual.html", "HPP & Harga Jual",  "hpp", False),
    ("alat/kalkulator-biaya-qris.html",     "Biaya QRIS",        "qris", False),
    ("alat/kalkulator-margin-delivery.html","Margin Delivery",   "margin", False),
]
DOK = [("tentang.html", "Tentang"), ("kebijakan-privasi.html", "Kebijakan Privasi"),
       ("syarat-ketentuan.html", "Syarat & Ketentuan")]

CTA_LABEL  = "Coba demo kasir"    # K10: jujur, tanpa klaim trial
CTA_HREF   = "app/kasir.html#demo"  # anchor #demo di area pos-search
LOGIN_HREF = "app/login.html"     # halaman login beneran

def ac(active, slug):
    return f' aria-current="page"' if active == slug else ""

def _href(prefix, rel):
    # ".." adalah prefix direktori: butuh pemisah "/" ("../umkm.html"),
    # prefix "" (root) tidak boleh jadi "../app/...".
    if prefix and not prefix.endswith("/"):
        prefix += "/"
    return prefix + rel

def header(page, pfx, active):
    A = lambda rel: _href(pfx, rel)
    # Harga: anchor lokal HANYA di index; halaman lain -> index.html#harga
    h2 = "#harga" if page == "index.html" else (A("index.html#harga") if pfx else "index.html#harga")

    # -- dropdown desktop --
    dd = []
    dd.append('      <div class="dd">')
    dd.append('        <button type="button" class="dd-trigger" aria-expanded="false" aria-haspopup="true">Produk<span class="dd-caret" aria-hidden="true"></span></button>')
    dd.append('        <div class="dd-menu">')
    for rel, label, slug, chip in PRODUK:
        c = '<span class="dd-chip">Segera hadir</span>' if chip else ""
        dd.append(f'          <a href="{A(rel)}"{ac(active, slug)}>{label}{c}</a>')
    dd.append('        </div>')
    dd.append('      </div>')
    dd.append('      <div class="dd">')
    dd.append('        <button type="button" class="dd-trigger" aria-expanded="false" aria-haspopup="true">Kalkulator<span class="dd-caret" aria-hidden="true"></span></button>')
    dd.append('        <div class="dd-menu">')
    for rel, label, slug, chip in KALC:
        dd.append(f'          <a href="{A(rel)}"{ac(active, slug)}>{label}</a>')
    dd.append('        </div>')
    dd.append('      </div>')

    # -- panel mobile (daftar & urutan sama, datar) --
    mm = ['    <p class="mgrp">Produk</p>']
    for rel, label, slug, chip in PRODUK:
        c = ' <span class="dd-chip">Segera hadir</span>' if chip else ""
        mm.append(f'    <a href="{A(rel)}"{ac(active, slug)}>{label}{c}</a>')
    mm.append('    <p class="mgrp">Kalkulator</p>')
    for rel, label, slug, chip in KALC:
        mm.append(f'    <a href="{A(rel)}"{ac(active, slug)}>{label}</a>')

    return f'''<header class="nav" id="nav">
  <div class="container nav-inner">
    <a class="logo" href="{A("index.html")}"><span class="mark">O</span>Olano</a>
    <nav class="nav-links" aria-label="Menu utama">
{chr(10).join(dd)}
      <a href="{h2}">Harga</a>
    </nav>
    <div class="nav-cta">
      <a class="nav-login" href="{A(LOGIN_HREF)}">Masuk</a>
      <a class="btn btn-primary pill" href="{A(CTA_HREF)}">{CTA_LABEL}</a>
    </div>
    <button class="nav-burger" aria-label="Buka menu" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
  <nav class="nav-mobile" aria-label="Menu seluler">
{chr(10).join(mm)}
    <a href="{h2}">Harga</a>
    <a class="nav-login" href="{A(LOGIN_HREF)}">Masuk</a>
    <a class="btn btn-primary pill" style="margin:10px var(--gutter)" href="{A(CTA_HREF)}">{CTA_LABEL}</a>
  </nav>
</header>'''

def footer(pfx):
    A = lambda rel: _href(pfx, rel)
    def col(title, items):
        lis = "\n".join(f'          <li><a href="{A(rel)}">{lab}</a></li>' for rel, lab in items)
        return f'      <nav aria-label="{title}">\n        <h3 class="foot-h">{title}</h3>\n        <ul>\n{lis}\n        </ul>\n      </nav>'
    pro_items = [(r, l) for r, l, s, c in PRODUK]
    kal_items = [(r, l) for r, l, s, c in KALC]
    return f'''<footer class="foot" id="foot">
  <div class="container">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="logo" href="{A("index.html")}" style="color:var(--ink)"><span class="mark">O</span>Olano</a>
        <p class="legal">Kasir, website, dan pajak UMKM di satu tempat. Tetap jalan walau internet mati.</p>
      </div>
{col("Produk", pro_items)}
{col("Kalkulator", kal_items)}
{col("Perusahaan", DOK)}
    </div>
    <p class="small">Olano membantu menghitung dan menyiapkan rekap pajak. Pelaporan sebagai kuasa wajib pajak dikerjakan mitra berizin. Bukan nasihat hukum atau pajak.</p>
    <p class="small">&copy; 2026 Olano</p>
  </div>
</footer>'''

def apply(dry=True):
    report = []
    for page, pfx, active in PAGES:
        raw = open(page, encoding="utf-8").read()
        new_h = header(page, pfx, active)
        new_f = footer(pfx)
        h1, n1 = re.subn(r'<header class="nav"[^>]*>[\s\S]*?</header>', new_h, raw, count=1)
        h2, n2 = re.subn(r'<footer[\s\S]*?</footer>', new_f, h1, count=1)
        ok = (n1 == 1 and n2 == 1)
        if not dry:
            open(page, "w", encoding="utf-8").write(h2)
        report.append(f"{page:42s} header={n1} footer={n2} {'OK' if ok else '!! CHECK MANUAL'}")
    print("\n".join(report))
    if not dry:
        print(f"\nSINKRON {len(PAGES)} halaman.")

if __name__ == "__main__":
    apply(dry="--apply" not in sys.argv)
