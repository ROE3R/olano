#!/usr/bin/env python3
# Ukuran 360px ASLI via harness360 (iframe fixed) + screenshot baseline 4 breakpoint + fold.
import json, subprocess, os, glob

BASE = "http://localhost:8902/audit/uiux/harness360.html"
OUT = "/root/olano/audit/uiux/baseline/landing"
os.makedirs(OUT, exist_ok=True)

def chrome(args):
    prof = f"/tmp/chrome-run-{os.getpid()}-{abs(hash(tuple(args)))%99999}"
    return ["/usr/bin/google-chrome", "--headless=new", "--no-sandbox", "--disable-gpu",
            "--hide-scrollbars", "--force-device-scale-factor=1", "--disable-extensions",
            f"--user-data-dir={prof}"] + args

def run_dump(width, height, wait=6.0):
    dump = f"/tmp/fx-dump-{width}x{height}.html"
    with open(dump, "w") as fh, open(dump + ".err", "w") as fe:
        subprocess.run(chrome([f"--window-size={width},{height}",
                               f"--virtual-time-budget={int(wait*1000)}", "--dump-dom",
                               "http://localhost:8902/audit/uiux/harness360.html"]),
                       stdout=fh, stderr=fe, timeout=180)
    html = open(dump, encoding="utf-8", errors="replace").read()
    marker = 'PROBE_START{"viewport"'
    if marker not in html:
        return {"_no_probe": True, "_tail": html[html.find("PROBE_FAIL"):][:150] if "PROBE_FAIL" in html else "none"}
    raw = '{"viewport"' + html.split(marker, 1)[1]
    raw = raw[:raw.find("PROBE_END")]
    return json.loads(raw)

def shot(url, width, height, name):
    path = f"{OUT}/{name}"
    subprocess.run(chrome([f"--window-size={width},{height}",
                           "--virtual-time-budget=6000", f"--screenshot={path}", url]),
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=180)
    print(f"  {name}: {os.path.exists(path) and os.path.getsize(path)} B")

d360 = run_dump(1000, 900)
with open("/root/olano/audit/uiux/probe-results-360fix.json", "w") as f:
    json.dump(d360, f, indent=1, ensure_ascii=False)
print("== 360 REAL (iframe fixed) ==")
for k in ["viewport", "scrollHeight", "screenfuls800", "hOverflow"]:
    print(" ", k, d360.get(k))
print("  ticker:", d360.get("ticker"))
print("  H1:", d360.get("h1"))
print("  heroCta:", d360.get("heroCta"))
print("  heroStruk:", d360.get("heroStruk"))
print("  fnote:", d360.get("fnote"))
print("  menuOpen:", d360.get("menuOpen"))
print("  mobileLinkHeights:", d360.get("mobileLinkHeights"))
print("  absentClean:", d360.get("absentClean"))
print("  tstGrid:", d360.get("tstGrid"))
print("  heroVisualLink:", d360.get("heroVisualLink"))
print("  anchorTest:", d360.get("anchorTest"))
print("  footer:", d360.get("footer"))
print("  modules.count:", (d360.get("modules") or {}).get("count"),
      "pickCountVisible:", (d360.get("modules") or {}).get("pickCountVisible"))

U = "http://localhost:8902/index.html"
print("== screenshots ==")
shot(U, 360, 800, "landing-360x800.png")
shot(U, 390, 844, "landing-390x844.png")
shot(U, 768, 900, "landing-768x900.png")
shot(U, 1280, 900, "landing-1280x900.png")
shot(U, 360, 560, "landing-fold-360x560.png")
print("DONE")
