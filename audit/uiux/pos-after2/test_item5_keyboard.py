#!/usr/bin/env python3
"""Test item 5: alur jual penuh keyboard-only (substitusi TalkBack) via CDP keyboard.
Tahapan: fokus masuk grid -> Enter produk (+1) -> Tab ke Bayar -> Enter -> Tab ke
Uang pas -> Enter -> Tab ke slide konfirmasi -> Enter (transaksi) -> Tab ke Selesai -> Enter.
Lulus = C1 tercapai tanpa mouse. Screenshot per tahap.
"""
import json, sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8921"
OUT = "/root/olano/audit/uiux/pos-after2"
results = {}
errors = []
steps = []
def check(name, cond, extra=""):
    results[name] = ("LULUS" if cond else "GAGAL") + ((" · " + str(extra)) if extra else "")
    if not cond: errors.append(name)
def log(s): steps.append(s); print("STEP:", s)

def tab_until(page, sel, max_tabs=30, shot=None):
    """Tekan Tab sampai elemen aktif cocok sel; balikkan jumlah Tab (None kalau tak sampai)."""
    for i in range(1, max_tabs + 1):
        page.keyboard.press("Tab")
        ae = page.evaluate("document.activeElement && (document.activeElement.id || document.activeElement.className || document.activeElement.tagName)")
        match = page.evaluate(f"document.activeElement && document.activeElement.closest({json.dumps(sel)}) === document.activeElement")
        if match:
            if shot: page.screenshot(path=shot)
            return i, ae
    return None, page.evaluate("document.activeElement && (document.activeElement.id || document.activeElement.className)")

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--headless=new", "--no-sandbox"])
    ctx = browser.new_context(viewport={"width": 360, "height": 800}, device_scale_factor=2, service_workers="block")
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append("pageerror: " + str(e)[:200]))
    page.goto(f"{BASE}/app/kasir.html#demo", wait_until="networkidle")
    page.wait_for_selector("#produk .pos-item")

    # TAHAP 1: Tab dari awal halaman sampai fokus masuk grid produk
    n, ae = tab_until(page, ".pos-item", 30, shot=f"{OUT}/after-KB-1-fokus-grid-360x800.png")
    check("tahap1_fokus_grid", n is not None, f"{n} Tab -> {ae}")
    log(f"Tab x{n} -> fokus kartu produk pertama ({ae})")

    # TAHAP 2: Enter = +1 ke keranjang
    page.keyboard.press("Enter")
    page.wait_for_function("document.getElementById('bar-count').textContent.indexOf('1 item') > -1", timeout=5000)
    check("tahap2_enter_tambah", True, page.locator("#bar-count").inner_text())
    log("Enter -> 1 item di keranjang (bar: %s · %s)" % (page.locator("#bar-count").inner_text(), page.locator("#bar-sum").inner_text()))
    page.screenshot(path=f"{OUT}/after-KB-2-produk-masuk-360x800.png")

    # TAHAP 3: Tab ke tombol Bayar -> Enter (sheet pembayaran terbuka)
    n, ae = tab_until(page, "#pay", 30)
    check("tahap3_fokus_bayar", n is not None, f"{n} Tab -> {ae}")
    log(f"Tab x{n} -> tombol Bayar")
    page.keyboard.press("Enter")
    page.wait_for_selector("#sheet.open", timeout=5000)
    ae = page.evaluate("document.activeElement && document.activeElement.textContent.trim().slice(0,15)")
    check("tahap3_sheet_terbuka", True, f"fokus awal: {ae}")
    log("Enter -> sheet Pembayaran terbuka, fokus di: %s" % ae)
    page.screenshot(path=f"{OUT}/after-KB-3-sheet-bayar-360x800.png")

    # TAHAP 4: Tab ke chip 'Uang pas' -> Enter (isi cash = total)
    n, ae = tab_until(page, '.cash-chip[data-cash="pas"]', 12)
    check("tahap4_fokus_uang_pas", n is not None, f"{n} Tab -> {ae}")
    log(f"Tab x{n} -> chip Uang pas")
    page.keyboard.press("Enter")
    page.wait_for_timeout(250)
    cash_val = page.input_value("#cash")
    err_shown = page.evaluate("getComputedStyle(document.getElementById('cash-err')).display") != "none"
    check("tahap4_uang_pas_isi", cash_val == "22000" and not err_shown, f"cash={cash_val} err={err_shown}")
    log("Enter -> cash terisi %s (uang pas), tidak ada peringatan kurang" % cash_val)
    page.screenshot(path=f"{OUT}/after-KB-4-uang-pas-360x800.png")

    # TAHAP 5: Tab ke slide-to-confirm -> Enter (konfirmasi keyboard = jalur resmi)
    n, ae = tab_until(page, "#sld", 12)
    check("tahap5_fokus_slide", n is not None, f"{n} Tab -> {ae}")
    log(f"Tab x{n} -> slide konfirmasi")
    page.keyboard.press("Enter")
    page.wait_for_selector("#sheet-ok.open", timeout=5000)
    check("tahap5_sukses", True, "layar sukses terbuka")
    log("Enter -> transaksi tersimpan, layar sukses")
    page.screenshot(path=f"{OUT}/after-KB-5-sukses-360x800.png")

    # TAHAP 6: Tab ke 'Selesai' -> Enter (kembali ke layar jual)
    n, ae = tab_until(page, '#sheet-ok button[data-close]', 12)
    check("tahap6_fokus_selesai", n is not None, f"{n} Tab -> {ae}")
    log(f"Tab x{n} -> tombol Selesai")
    page.keyboard.press("Enter")
    page.wait_for_timeout(400)
    bar = page.locator("#bar-count").inner_text()
    grid_visible = page.evaluate("document.getElementById('produk').getBoundingClientRect().height > 0")
    ok_closed = page.evaluate("!document.getElementById('sheet-ok').classList.contains('open')")
    check("tahap6_selesai_kembali", ok_closed and grid_visible and bar == "0 item", f"bar={bar} sheetClosed={ok_closed}")
    log("Enter -> Selesai; keranjang kosong (%s), kembali ke layar jual" % bar)
    page.screenshot(path=f"{OUT}/after-KB-6-selesai-360x800.png")

    browser.close()

res = {"alur": "keyboard-only penuh (tanpa mouse): grid -> +1 -> Bayar -> Uang pas -> konfirmasi -> Selesai",
       "tahapan": steps, "hasil": results, "pageerrors": errors}
with open(f"{OUT}/keyboard-flow-result.json", "w") as f:
    json.dump(res, f, ensure_ascii=False, indent=1)
print(json.dumps(results, ensure_ascii=False, indent=1))
print("PAGEERRORS:", errors if errors else "none")
sys.exit(1 if (errors or any(v.startswith("GAGAL") for v in results.values())) else 0)
