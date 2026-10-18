#!/usr/bin/env python3
"""Test item 4: C2 terukur 3G (400kbps down / 15kbps up, latency 150ms, CPU 4x).
Jalur A: loading beranda -> ketuk CTA 'Coba demo kasir' -> produk pertama masuk keranjang.
Jalur B (fallback): langsung kasir.html#demo -> produk pertama masuk keranjang.
SW diblokir = skenario kunjungan pertama (cache dingin, konsisten).
"""
import json, time, sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8921"
OUT = "/root/olano/audit/uiux/pos-after2"
errors = []

def setup_throttle(cdp):
    cdp.send("Network.enable")
    cdp.send("Network.emulateNetworkConditions", {
        "offline": False,
        "latency": 150,                          # ms RTT
        "downloadThroughput": 400 * 1024 / 8,    # 400 kbps -> 50.000 B/s
        "uploadThroughput": 15 * 1024 / 8,       # 15 kbps -> 1.875 B/s
    })
    cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4})

def journey_a(pw):
    """Landing -> CTA -> produk masuk keranjang."""
    browser = pw.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--headless=new", "--no-sandbox"])
    ctx = browser.new_context(viewport={"width": 360, "height": 800}, device_scale_factor=2,
                              service_workers="block")
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append("A pageerror: " + str(e)[:200]))
    cdp = ctx.new_cdp_session(page)
    setup_throttle(cdp)
    marks = {}
    t0 = time.perf_counter()
    page.goto(f"{BASE}/", wait_until="commit")
    # ketuk CTA segera begitu actionable (Playwright: visible+stable+receives events = pengguna nyata)
    cta = page.locator('a.btn-lg[href*="kasir.html#demo"]').first
    cta.wait_for(state="visible", timeout=30000)
    cta.click(timeout=30000)
    marks["cta_clicked"] = time.perf_counter() - t0
    # tunggu grid produk kasir interaktif
    page.wait_for_selector("#produk .pos-item", state="visible", timeout=60000)
    marks["grid_ready"] = time.perf_counter() - t0
    # ketuk produk pertama (klik real di koordinat pusat)
    page.locator("#produk .pos-item").first.click(timeout=15000)
    marks["product_tapped"] = time.perf_counter() - t0
    page.wait_for_function("document.getElementById('bar-count').textContent.indexOf('1 item') > -1", timeout=15000)
    marks["cart_1_item"] = time.perf_counter() - t0
    page.screenshot(path=f"{OUT}/after-C2-3G-keranjang-1item-360x800.png")
    bar = page.locator("#bar-count").inner_text() + " · " + page.locator("#bar-sum").inner_text()
    browser.close()
    return marks, bar

def journey_b(pw):
    """Fallback: langsung kasir.html#demo -> produk masuk keranjang."""
    browser = pw.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--headless=new", "--no-sandbox"])
    ctx = browser.new_context(viewport={"width": 360, "height": 800}, device_scale_factor=2,
                              service_workers="block")
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append("B pageerror: " + str(e)[:200]))
    cdp = ctx.new_cdp_session(page)
    setup_throttle(cdp)
    marks = {}
    t0 = time.perf_counter()
    page.goto(f"{BASE}/app/kasir.html#demo", wait_until="commit")
    page.wait_for_selector("#produk .pos-item", state="visible", timeout=60000)
    marks["grid_ready"] = time.perf_counter() - t0
    page.locator("#produk .pos-item").first.click(timeout=15000)
    marks["product_tapped"] = time.perf_counter() - t0
    page.wait_for_function("document.getElementById('bar-count').textContent.indexOf('1 item') > -1", timeout=15000)
    marks["cart_1_item"] = time.perf_counter() - t0
    bar = page.locator("#bar-count").inner_text() + " · " + page.locator("#bar-sum").inner_text()
    browser.close()
    return marks, bar

with sync_playwright() as pw:
    a, bar_a = journey_a(pw)
    b, bar_b = journey_b(pw)

res = {
    "profil": "3G lambat: 400 kbps down / 15 kbps up / RTT 150ms / CPU 4x / SW blokir (kunjungan pertama)",
    "jalur_A_landing_ke_keranjang": {
        "cta_clicked_s": round(a["cta_clicked"], 2),
        "grid_ready_s": round(a["grid_ready"], 2),
        "product_tapped_s": round(a["product_tapped"], 2),
        "cart_1_item_s": round(a["cart_1_item"], 2),
        "total_s": round(a["cart_1_item"], 2),
        "bar": bar_a,
    },
    "jalur_B_kasir_langsung": {
        "grid_ready_s": round(b["grid_ready"], 2),
        "cart_1_item_s": round(b["cart_1_item"], 2),
        "total_s": round(b["cart_1_item"], 2),
        "bar": bar_b,
    },
    "target_lebih_besar_sama_10": a["cart_1_item"] <= 10,
    "pageerrors": errors,
}
with open(f"{OUT}/c2-3g-result.json", "w") as f:
    json.dump(res, f, ensure_ascii=False, indent=1)
print(json.dumps(res, ensure_ascii=False, indent=1))
sys.exit(0 if res["target_lebih_besar_sama_10"] and not errors else 1)
