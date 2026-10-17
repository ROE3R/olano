#!/usr/bin/env python3
"""Olano: cek header + footer kanonis antar halaman pemasaran.

Pemeriksaan (exit 0 = PASS, 1 = FAIL):
1. Setiap halaman pemasaran punya tepat satu <header class="nav"> dan
   satu <footer>.
2. Semua header identik setelah normalisasi, semua footer identik.
   Normalisasi yang diizinkan (perbedaan by-design, bukan drift):
     - aria-current="page" dilepas (hanya halaman aktif yang punya).
     - prefix path "../" dilepas (halaman alat/ memakai "../", root tidak).
     - href="#harga" di index.html setara dengan href="index.html#harga"
       (anchor lokal vs. anchor di dokumen root yang sama).
3. Setiap href di header/footer resolve: file tujuan ada, dan bila
   membawa #anchor, anchor tersebut ada di file tujuan; href="#anchor"
   lokal harus punya anchor di halaman itu sendiri.

Pemakaian: python3 audit/tools/check_chrome.py
"""
import difflib
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(BASE)

PAGES = [
    "index.html",
    "umkm.html",
    "pajak.html",
    "website.html",
    "analisa-delivery.html",
    "ai.html",
    "automation.html",
    "naik-kelas.html",
    "tentang.html",
    "kebijakan-privasi.html",
    "syarat-ketentuan.html",
    "alat/kalkulator-pph-final-umkm.html",
    "alat/kalkulator-hpp-harga-jual.html",
    "alat/kalkulator-biaya-qris.html",
    "alat/kalkulator-margin-delivery.html",
]

HEADER_RE = re.compile(r'<header class="nav"[^>]*>[\s\S]*?</header>')
FOOTER_RE = re.compile(r'<footer[\s\S]*?</footer>')
HREF_RE = re.compile(r'<a\b[^>]*\bhref="([^"]*)"[^>]*>')
ID_RE = re.compile(r'id="([^"]+)"')
NAME_RE = re.compile(r'<a\b[^>]*\bname="([^"]+)"')


def norm(block):
    """Buang perbedaan by-design: aria-current, prefix '../', dan bentuk
    anchor-lokal #harga (index) -> index.html#harga (halaman lain)."""
    b = re.sub(r'\s+aria-current="page"', "", block)
    b = b.replace('href="#harga"', 'href="index.html#harga"')
    b = re.sub(r'(href=")\.\./', r"\1", b)
    return b


def has_anchor(text, anchor):
    return anchor in set(ID_RE.findall(text)) | set(NAME_RE.findall(text))


def check_links(page, block, failures):
    """Setiap href di block harus resolve ke file/anchor yang ada."""
    pagedir = os.path.dirname(page)
    html = open(page, encoding="utf-8").read()
    for href in HREF_RE.findall(block):
        if not href or href.startswith(("javascript:", "mailto:", "tel:", "http://", "https://")):
            continue
        target, _, frag = href.partition("#")
        if not target:  # anchor lokal di halaman ini
            if not has_anchor(html, frag):
                failures.append(f"{page}: anchor lokal #{frag} tidak ada")
            continue
        path = os.path.normpath(os.path.join(pagedir, target))
        if not os.path.isfile(path):
            failures.append(f"{page}: href={href!r} -> file '{path}' tidak ada")
        elif frag and not has_anchor(open(path, encoding="utf-8").read(), frag):
            failures.append(f"{page}: href={href!r} -> anchor #{frag} tidak ada di {path}")


def main():
    failures = []
    headers, footers = {}, {}
    for page in PAGES:
        try:
            html = open(page, encoding="utf-8").read()
        except OSError as e:
            failures.append(f"{page}: tidak bisa dibaca ({e})")
            continue
        h = HEADER_RE.findall(html)
        f = FOOTER_RE.findall(html)
        if len(h) != 1 or len(f) != 1:
            failures.append(f"{page}: header x{len(h)}, footer x{len(f)} (harus 1 dan 1)")
            continue
        headers[page] = norm(h[0])
        footers[page] = norm(f[0])
        check_links(page, h[0] + f[0], failures)

    def assert_same(kind, blocks):
        ref_page = next(iter(blocks))
        ref = blocks[ref_page]
        for page, block in blocks.items():
            if block != ref:
                diff = "\n".join(difflib.unified_diff(
                    ref.splitlines(), block.splitlines(),
                    fromfile=f"{kind}({ref_page})", tofile=f"{kind}({page})", lineterm=""))
                failures.append(f"{page}: {kind} beda dari {ref_page}\n{diff}")

    assert_same("header", headers)
    assert_same("footer", footers)

    checked = len(headers)
    print(f"Dicek {len(PAGES)} halaman pemasaran: {checked} header diekstrak, "
          f"{len(footers)} footer diekstrak.")
    if failures:
        print(f"\nFAIL ({len(failures)} masalah):")
        for msg in failures:
            print(f"  - {msg}")
        return 1
    print("header: 15/15 identik (setelah normalisasi aria-current + prefix path)")
    print("footer: 15/15 identik")
    print("link header/footer: semua resolve (file & #anchor ada)")
    print("PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
