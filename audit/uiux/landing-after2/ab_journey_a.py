#!/usr/bin/env python3
"""A/B jalur A saja (goto -> CTA -> produk masuk keranjang), n run per arm.
Dipakai untuk before (shared.js lama) vs after (prefetch) di server & tree sama."""
import json, time, sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8922"
LABEL = sys.argv[1]
N = int(sys.argv[2]) if len(sys.argv) > 2 else 3
runs = []

def one(pw):
    browser = pw.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--headless=new", "--no-sandbox"])
    ctx = browser.new_context(viewport={"width": 360, "height": 800}, device_scale_factor=2, service_workers="block")
    page = ctx.new_page()
    cdp = ctx.new_cdp_session(page)
    cdp.send("Network.enable")
    cdp.send("Network.emulateNetworkConditions", {"offline": False, "latency": 150,
        "downloadThroughput": 400 * 1024 / 8, "uploadThroughput": 15 * 1024 / 8})
    cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4})
    t0 = time.perf_counter()
    page.goto(f"{BASE}/", wait_until="commit")
    cta = page.locator(".hero .cta-row a[href*='kasir.html']").first
    cta.wait_for(state="visible", timeout=30000)
    cta.click(timeout=30000)
    click = time.perf_counter() - t0
    page.wait_for_selector("#produk .pos-item", state="visible", timeout=60000)
    grid = time.perf_counter() - t0
    page.locator("#produk .pos-item").first.click(timeout=15000)
    page.wait_for_function("document.getElementById('bar-count').textContent.indexOf('1 item') > -1", timeout=15000)
    cart = time.perf_counter() - t0
    browser.close()
    return {"cta_clicked_s": round(click, 2), "grid_ready_s": round(grid, 2), "cart_1_item_s": round(cart, 2)}

with sync_playwright() as pw:
    for i in range(N):
        runs.append(one(pw))

carts = sorted(r["cart_1_item_s"] for r in runs)
med = carts[len(carts) // 2]
out = {"arm": LABEL, "runs": runs, "median_cart_s": med}
print(json.dumps(out, indent=1))
with open(f"/root/olano/audit/uiux/landing-after2/ab-{LABEL}.json", "w") as f:
    json.dump(out, f, indent=1)
