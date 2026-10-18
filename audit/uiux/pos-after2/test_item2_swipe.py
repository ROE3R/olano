#!/usr/bin/env python3
"""Test item 2: swipe-kiri-untuk-hapus di sheet keranjang + Undo + fallback tombol."""
import json, sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8921"
OUT = "/root/olano/audit/uiux/pos-after2"
results = {}
errors = []
def check(name, cond, extra=""):
    results[name] = ("LULUS" if cond else "GAGAL") + ((" · " + str(extra)) if extra else "")
    if not cond: errors.append(name)

def swipe(page, row, start_frac, dist, shot=None):
    bb = row.bounding_box()
    y1 = bb["y"] + bb["height"] / 2
    x1 = bb["x"] + bb["width"] * start_frac
    page.mouse.move(x1, y1)
    page.mouse.down()
    steps = max(3, int(abs(dist) / 9))
    for i in range(1, steps + 1):
        page.mouse.move(x1 + dist * i / steps, y1)
        page.wait_for_timeout(10)
    if shot:
        page.screenshot(path=shot)
    page.mouse.up()
    page.wait_for_timeout(450)

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--headless=new", "--no-sandbox"])
    ctx = browser.new_context(viewport={"width": 360, "height": 800}, device_scale_factor=2)
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append("pageerror: " + str(e)[:200]))
    page.goto(f"{BASE}/app/kasir.html#demo", wait_until="networkidle")
    page.wait_for_selector(".pos-item")

    # masukkan 2 produk: p1 x1, p2 x2
    page.locator('.pos-item[data-id="p1"]').click()
    page.wait_for_timeout(120)
    page.locator('.pos-item[data-id="p2"]').click()
    page.wait_for_timeout(120)
    page.locator('.pos-item[data-id="p2"]').click()
    page.wait_for_timeout(150)
    page.locator("#bar-info").click()
    page.wait_for_selector("#sheet-cart.open")
    page.wait_for_timeout(250)

    row1 = page.locator('.cart-row[data-id="p1"]')
    row2 = page.locator('.cart-row[data-id="p2"]')
    check("struktur_swipe", row1.locator(".swipe-front").count() == 1 and row1.locator(".swipe-under").count() == 1)
    check("fallback_del", row1.locator(".cart-del").count() == 1)

    # ---- swipe kecil 30px dari area nama -> snap balik, tidak terhapus, qty tetap
    swipe(page, row1, 0.15, -30)
    check("swipe_kecil_tetap", row1.count() == 1, "row masih ada")
    check("swipe_kecil_qty1", row1.locator(".c-qty").inner_text() == "1")

    # ---- swipe penuh >=40% dari area nama -> hapus + Undo muncul
    swipe(page, row1, 0.5, -140, shot=f"{OUT}/after-C-swipe-tengah-360x800.png")
    check("swipe_hapus", row1.count() == 0, f"rows p1={row1.count()}")
    check("toast_undo_muncul", page.locator("#toast.show #toast-undo:not([hidden])").count() == 1)
    page.screenshot(path=f"{OUT}/after-C-swipe-undo-360x800.png")

    # ---- Undo dalam 5 dtk -> item balik
    page.locator("#toast-undo").click()
    page.wait_for_timeout(300)
    check("undo_balik", row1.count() == 1, "p1 kembali")
    check("total_balik", page.locator("#cart-total").inner_text() == "Rp58.000",
          page.locator("#cart-total").inner_text())

    # ---- swipe mulai DI ATAS tombol + (row2 qty=2): >= threshold -> terhapus TANPA klik + lolos
    swipe(page, row2, 0.75, -160)
    check("swipe_di_tombol_hapus", row2.count() == 0, "p2 terhapus")
    page.locator("#toast-undo").click()
    page.wait_for_timeout(300)
    check("swipe_di_tombol_qty_utuh", page.locator('.cart-row[data-id="p2"] .c-qty').inner_text() == "2",
          "qty tidak berubah oleh klik +")

    # ---- fallback tap tombol hapus tetap jalan
    page.locator('.cart-row[data-id="p2"] .cart-del').click()
    page.wait_for_timeout(300)
    check("fallback_hapus", page.locator('.cart-row[data-id="p2"]').count() == 0)
    page.locator("#toast-undo").click()
    page.wait_for_timeout(250)

    # ---- regresi stepper: - pada qty 1 menghapus; + menambah (tap biasa tanpa geser)
    r1 = page.locator('.cart-row[data-id="p1"]')
    r1.locator('button[data-q="-1"]').click()
    page.wait_for_timeout(250)
    check("stepper_minus_hapus", r1.count() == 0)
    page.locator("#toast-undo").click()
    page.wait_for_timeout(250)
    r1 = page.locator('.cart-row[data-id="p1"]')
    r1.locator('button[data-q="1"]').click()
    page.wait_for_timeout(250)
    check("stepper_plus", r1.locator(".c-qty").inner_text() == "2")
    page.screenshot(path=f"{OUT}/after-C-swipe-sheet-final-360x800.png")

    browser.close()

print(json.dumps(results, ensure_ascii=False, indent=1))
pe = [e for e in errors if e.startswith("pageerror")]
print("PAGEERRORS:", pe if pe else "none")
sys.exit(1 if (pe or any(v.startswith("GAGAL") for v in results.values())) else 0)
