#!/usr/bin/env python3
"""Test item 6: PWA installable — CDP getInstallabilityErrors (kriteria Chrome install)
+ validasi manual manifest.json (name, short_name, start_url, display, icons 192+512, maskable)
+ service worker terdaftar & aktif."""
import json, sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8921"
OUT = "/root/olano/audit/uiux/pos-after2"
results = {}
def check(name, cond, extra=""):
    results[name] = ("LULUS" if cond else "GAGAL") + ((" · " + str(extra)) if extra else "")

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--headless=new", "--no-sandbox"])
    ctx = browser.new_context(viewport={"width": 360, "height": 800})
    page = ctx.new_page()
    cdp = ctx.new_cdp_session(page)
    cdp.send("Page.enable")
    page.goto(f"{BASE}/app/kasir.html#demo", wait_until="networkidle")
    page.wait_for_selector("#produk .pos-item")

    # 1) kriteria installability Chrome yang sebenarnya
    inst = cdp.send("Page.getInstallabilityErrors")
    errs = inst.get("installabilityErrors", [])
    err_ids = [e.get("errorId") for e in errs]
    check("cdp_installable", len(errs) == 0, "; ".join(f"{e.get('errorId')}: {e.get('errorMessage','')[:80]}" for e in errs) or "tanpa galat installability")

    # 2) service worker terdaftar + aktif + mengontrol halaman
    sw = page.evaluate("""() => navigator.serviceWorker.ready.then(reg => ({
      active: !!(reg.active && reg.active.state === 'activated'),
      scope: reg.scope,
      controlled: !!navigator.serviceWorker.controller,
    })).catch(e => ({active: false, scope: null, controlled: false, err: String(e)}))""")
    check("sw_aktif", sw.get("active") is True, f"scope={sw.get('scope')} controlled={sw.get('controlled')}")

    # 3) manifest valid + link tag benar
    man = page.evaluate("""() => fetch('/manifest.json').then(r => r.json())""")
    check("mf_name", bool(man.get("name")) and bool(man.get("short_name")), f"name={man.get('name')} short_name={man.get('short_name')}")
    check("mf_start_url", man.get("start_url") == "app/kasir.html", man.get("start_url"))
    check("mf_display", man.get("display") == "standalone", man.get("display"))
    icons = man.get("icons", [])
    sizes = {i.get("sizes") for i in icons}
    has192 = "192x192" in sizes
    has512 = "512x512" in sizes
    maskable = any("maskable" in (i.get("purpose") or "") for i in icons)
    check("mf_icons_192_512", has192 and has512, str(sorted(sizes)))
    check("mf_maskable", maskable, str([i.get("purpose") for i in icons]))
    # ikon benar-benar ada & 200
    ic192 = page.evaluate("fetch('/assets/icon-192.png').then(r => r.status)")
    ic512 = page.evaluate("fetch('/assets/icon-512.png').then(r => r.status)")
    check("ikon_http_200", ic192 == 200 and ic512 == 200, f"192={ic192} 512={ic512}")
    link_ok = page.evaluate("document.querySelector('link[rel=manifest]')?.getAttribute('href')") == "../manifest.json"
    check("link_manifest", link_ok)
    theme = man.get("theme_color")
    check("mf_theme_bg", bool(theme) and bool(man.get("background_color")), f"theme={theme} bg={man.get('background_color')}")

    browser.close()

res = {"cdp_errors": err_ids, "sw": sw, "manifest": {k: man.get(k) for k in ("name", "short_name", "start_url", "display", "scope", "theme_color", "background_color")},
       "icons": [{"sizes": i.get("sizes"), "purpose": i.get("purpose")} for i in icons],
       "hasil": results}
with open(f"{OUT}/pwa-installable-result.json", "w") as f:
    json.dump(res, f, ensure_ascii=False, indent=1)
print(json.dumps(results, ensure_ascii=False, indent=1))
sys.exit(1 if any(v.startswith("GAGAL") for v in results.values()) else 0)
