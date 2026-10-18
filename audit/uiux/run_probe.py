#!/usr/bin/env python3
# Verifikasi L1-L37 landing olano — headless Chrome via harness iframe (probe di-inject ke iframe).
import json, subprocess, os

BASE = "http://localhost:8902/audit/uiux/harness.html"
CHROME = ["/usr/bin/google-chrome", "--headless=new", "--no-sandbox",
          "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
          "--user-data-dir=/tmp/chrome-probe", "--disable-extensions"]
OUT = "/root/olano/audit/uiux/baseline/landing"
os.makedirs(OUT, exist_ok=True)
results = {}

def run(width, height, shot=None, wait=6.0):
    prof = f"/tmp/chrome-probe-{os.getpid()}-{width}x{height}"
    cmd = CHROME[:] + [f"--user-data-dir={prof}", f"--window-size={width},{height}",
                       f"--virtual-time-budget={int(wait*1000)}"]
    if shot:
        cmd.append(f"--screenshot={shot}")
    cmd.append(BASE)
    dump = f"/tmp/dump-{os.getpid()}-{width}x{height}.html"
    with open(dump, "w") as fh, open(dump + ".err", "w") as fe:
        subprocess.run(cmd + ["--dump-dom"], stdout=fh, stderr=fe, timeout=180)
    html = open(dump, encoding="utf-8", errors="replace").read()
    if shot:
        print(f"  shot {shot} ({os.path.exists(shot) and os.path.getsize(shot)} B)")
    marker = "PROBE_START{"
    res = {}
    if marker in html:
        raw = "{" + html.split(marker, 1)[1]
        end = raw.find("PROBE_END")
        raw = raw[:end] if end >= 0 else raw
        try:
            res = json.loads(raw)
        except Exception as e:
            res = {"_parse_error": str(e), "_raw_head": raw[:400]}
    else:
        tail = ""
        if "PROBE_FAIL" in html:
            idx = html.find("PROBE_FAIL")
            tail = html[idx:idx+200]
        elif "PROBE_FETCH_ERR" in html:
            idx = html.find("PROBE_FETCH_ERR")
            tail = html[idx:idx+200]
        res = {"_no_probe": True, "_tail": tail}
    return res

# Urutan: 360 ticker-on, 360 ticker-closed (sessionStorage sama profil), 390, 768, 1280
results["360"] = run(360, 800)
results["360_closed"] = run(360, 800)
results["390"] = run(390, 844)
results["768"] = run(768, 900)
results["1280"] = run(1280, 900)

with open("/root/olano/audit/uiux/probe-results.json", "w") as f:
    json.dump(results, f, indent=1, ensure_ascii=False)

for vp, d in results.items():
    print(f"== {vp} ==")
    if not isinstance(d, dict) or "_no_probe" in d:
        print("  NO PROBE:", str(d)[:300]); continue
    print("  scrollH:", d.get("scrollHeight"), "hOverflow:", d.get("hOverflow"))
    print("  ticker:", {k: v for k, v in (d.get("ticker") or {}).items() if k != 'text'})
    print("  tickerClose:", d.get("tickerClose"))
    h1 = d.get("h1") or {}
    print("  H1:", h1.get("fontSize"), "x", h1.get("lineHeight"), "lines:", h1.get("lines"),
          "boxH:", (h1.get("box") or {}).get("h"), "words:", h1.get("words"))
    print("  heroCta:", d.get("heroCta"))
    print("  heroStruk:", d.get("heroStruk"))
    print("  fnote:", d.get("fnote"))
    print("  headerButtons:", d.get("headerButtons"), "burger:", d.get("burgerVisible"))
    print("  desktopNav:", json.dumps(d.get("desktopNav"), ensure_ascii=False)[:400])
    print("  mobileNav:", json.dumps(d.get("mobileNav"), ensure_ascii=False)[:600])
    print("  mobileLinkHeights:", d.get("mobileLinkHeights"))
    print("  sky:", d.get("sky"))
    print("  cloudAnim:", d.get("cloudAnim"))
    print("  gridParallax:", d.get("gridParallax"))
    print("  heroVisualLink:", d.get("heroVisualLink"))
    print("  modules:", json.dumps(d.get("modules"), ensure_ascii=False)[:1600])
    print("  calculators:", json.dumps(d.get("calculators"), ensure_ascii=False)[:600])
    print("  sections:", json.dumps(d.get("sections"), ensure_ascii=False)[:600])
    print("  pajak:", d.get("pajak"))
    print("  taxWidget:", json.dumps(d.get("taxWidget"), ensure_ascii=False)[:600])
    print("  pricing:", json.dumps(d.get("pricing"), ensure_ascii=False)[:1000])
    print("  sectionOrder:", d.get("sectionOrder"))
    print("  footer:", d.get("footer"))
    print("  absentBlocks:", d.get("absentBlocks"))
    print("  skipLink:", d.get("skipLink"), "backToTop:", d.get("backToTopCount"), "logo:", d.get("logoHref"))
    print("  anchorTest:", d.get("anchorTest"))
print("DONE")
