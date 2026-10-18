#!/usr/bin/env python3
"""Test item 3: skeleton loading — grid (saat dependency lambat) + rekap (sinkron saat klik)."""
import json, sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8921"
OUT = "/root/olano/audit/uiux/pos-after2"
results = {}
errors = []
def check(name, cond, extra=""):
    results[name] = ("LULUS" if cond else "GAGAL") + ((" · " + str(extra)) if extra else "")
    if not cond: errors.append(name)

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--headless=new", "--no-sandbox"])
    ctx = browser.new_context(viewport={"width": 360, "height": 800}, device_scale_factor=2)
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append("pageerror: " + str(e)[:200]))

    # delay config.js 1200ms (simulasi 3G lambat): skeleton grid harus terlihat >=300ms
    def delay_config(route):
        page.wait_for_timeout(1200)
        route.continue_()
    ctx.route("**/assets/js/config.js", delay_config)

    page.goto(f"{BASE}/app/kasir.html#demo", wait_until="commit")
    page.wait_for_selector("#produk .pos-skel-card", state="attached", timeout=8000)
    page.wait_for_timeout(300)  # CSS sudah masuk, config masih tertunda -> skeleton ter-styling
    n_skel = page.locator("#produk .pos-skel-card").count()
    busy = page.get_attribute("#produk", "aria-busy")
    check("skeleton_grid_tampil", n_skel == 8, f"cards={n_skel}")
    check("aria_busy_true", busy == "true", f"aria-busy={busy}")
    check("belum_produk", page.locator("#produk .pos-item").count() == 0)
    page.screenshot(path=f"{OUT}/after-J-skeleton-grid-360x800.png")

    page.wait_for_selector("#produk .pos-item", timeout=8000)
    check("skeleton_diganti_produk", page.locator("#produk .pos-item").count() == 8
          and page.locator("#produk .pos-skel-card").count() == 0)
    busy2 = page.get_attribute("#produk", "aria-busy")
    check("aria_busy_dilepas", busy2 is None, f"aria-busy={busy2}")

    # rekap: skeleton muncul sinkron saat klik (sebelum IDB selesai)
    ctx.unroute("**/assets/js/config.js")
    n = page.evaluate("""() => {
      document.getElementById('menu-rekap').click();
      return {
        rows: document.querySelectorAll('#rekap-list .skel-row').length,
        stats: document.querySelectorAll('#rekap-stats .skel-line').length,
        sheetOpen: document.getElementById('sheet-rekap').classList.contains('open')
      };
    }""")
    check("skeleton_rekap_sinkron", n["rows"] >= 3 and n["stats"] >= 3, str(n))
    check("sheet_rekap_langsung_buka", n["sheetOpen"])
    page.wait_for_selector("#rekap-stats .rk b", timeout=4000)
    check("rekap_selesai_ganti_konten", page.locator("#rekap-list .skel-row").count() == 0)
    page.screenshot(path=f"{OUT}/after-J-rekap-terisi-360x800.png")

    browser.close()

print(json.dumps(results, ensure_ascii=False, indent=1))
pe = [e for e in errors if e.startswith("pageerror")]
print("PAGEERRORS:", pe if pe else "none")
sys.exit(1 if (pe or any(v.startswith("GAGAL") for v in results.values())) else 0)
