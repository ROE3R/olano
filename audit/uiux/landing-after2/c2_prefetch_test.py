#!/usr/bin/env python3
"""C2 ulang setelah prefetch-CTA (shared.js) di :8922 (worktree olano-landing2, fix/landing-polish).
Replikasi c2-3g-result.json (pos-after2/test_item4_c2.py) dengan 2 perbedaan:
  BASE = :8922 (root worktree landing), OUT = landing-after2.
  + verifikasi prefetch link (0 saat CTA belum terlihat di 360x110; 2 setelah terlihat).
Jalur A: loading beranda -> ketuk CTA hero 'Coba demo kasir' -> produk pertama masuk keranjang.
Jalur B (fallback): langsung app/kasir.html#demo.
Profil: 3G lambat 400 kbps down / 15 kbps up / RTT 150ms / CPU 4x / SW diblokir (kunjungan pertama).
"""
import json, time, sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8922"
OUT = "/root/olano/audit/uiux/landing-after2"
errors = []

def setup_throttle(cdp):
    cdp.send("Network.enable")
    cdp.send("Network.emulateNetworkConditions", {
        "offline": False,
        "latency": 150,                          # ms RTT
        "downloadThroughput": 400 * 1024 / 8,    # 400 kbps
        "uploadThroughput": 15 * 1024 / 8,       # 15 kbps
    })
    cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4})

def new_ctx(pw, w=360, h=800):
    browser = pw.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--headless=new", "--no-sandbox"])
    ctx = browser.new_context(viewport={"width": w, "height": h}, device_scale_factor=2,
                              service_workers="block")
    return browser, ctx

def journey_a(pw):
    """Landing -> CTA hero -> produk pertama masuk keranjang (360x800, CTA hero above the fold)."""
    browser, ctx = new_ctx(pw)
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append("A pageerror: " + str(e)[:200]))
    cdp = ctx.new_cdp_session(page)
    setup_throttle(cdp)
    marks = {}
    t0 = time.perf_counter()
    page.goto(f"{BASE}/", wait_until="commit")
    cta = page.locator(".hero .cta-row a[href*='kasir.html']").first
    cta.wait_for(state="visible", timeout=30000)
    cta.click(timeout=30000)
    marks["cta_clicked"] = time.perf_counter() - t0
    page.wait_for_selector("#produk .pos-item", state="visible", timeout=60000)
    marks["grid_ready"] = time.perf_counter() - t0
    page.locator("#produk .pos-item").first.click(timeout=15000)
    marks["product_tapped"] = time.perf_counter() - t0
    page.wait_for_function("document.getElementById('bar-count').textContent.indexOf('1 item') > -1", timeout=15000)
    marks["cart_1_item"] = time.perf_counter() - t0
    page.screenshot(path=f"{OUT}/after-C2-3G-prefetch-keranjang-1item-360x800.png")
    bar = page.locator("#bar-count").inner_text() + " · " + page.locator("#bar-sum").inner_text()
    browser.close()
    return marks, bar

def journey_b(pw):
    """Fallback: langsung app/kasir.html#demo."""
    browser, ctx = new_ctx(pw)
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

def verify_prefetch(pw):
    """Bukti gating: 360x110 (CTA di luar viewport) = 0 link; scroll CTA masuk = 2 link."""
    browser, ctx = new_ctx(pw, w=360, h=110)
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append("PF pageerror: " + str(e)[:200]))
    page.goto(f"{BASE}/", wait_until="load")
    page.wait_for_timeout(1500)
    r = page.evaluate("(a => (r => ({top: r.top, bottom: r.bottom, vh: innerHeight}))(a.getBoundingClientRect()))(document.querySelector('.hero .cta-row a[href*=\\'kasir.html\\']'))")
    before_links = page.evaluate("Array.from(document.querySelectorAll(\"link[rel~='prefetch']\")).map(l => l.getAttribute('href'))")
    page.screenshot(path=f"{OUT}/prefetch-0-cta-belum-terlihat-360x110.png")
    page.evaluate("document.querySelector('.hero .cta-row a[href*=\\'kasir.html\\']').scrollIntoView({block:'center'})")
    page.wait_for_timeout(1200)
    after_links = page.evaluate("Array.from(document.querySelectorAll(\"link[rel~='prefetch']\")).map(l => l.getAttribute('href'))")
    page.screenshot(path=f"{OUT}/prefetch-1-cta-terlihat-2-link-360x110.png")
    browser.close()
    cta_hidden = r["bottom"] > r["vh"] or r["top"] < 0
    return {
        "viewport": "360x110 (CTA hero pasti di luar viewport)",
        "cta_rect": r,
        "links_saat_cta_belum_terlihat": before_links,
        "links_setelah_cta_terlihat": after_links,
        "gating_ok": cta_hidden and not before_links and len(after_links) == 2,
    }

with sync_playwright() as pw:
    pf = verify_prefetch(pw)
    a, bar_a = journey_a(pw)
    b, bar_b = journey_b(pw)

res = {
    "profil": "3G lambat: 400 kbps down / 15 kbps up / RTT 150ms / CPU 4x / SW blokir (kunjungan pertama)",
    "prefetch": pf,
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
with open(f"{OUT}/c2-prefetch-result.json", "w") as f:
    json.dump(res, f, ensure_ascii=False, indent=1)
print(json.dumps(res, ensure_ascii=False, indent=1))
sys.exit(0 if res["target_lebih_besar_sama_10"] and res["prefetch"]["gating_ok"] and not errors else 1)
