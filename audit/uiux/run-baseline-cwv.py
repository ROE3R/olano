#!/usr/bin/env python3
"""BEFORE-baseline CWV runner (UI/UX fix wave gate).

Conventions copied 1:1 from audit/tools/lh.py: mobile form-factor,
--throttling-method=simulate, --headless=new --no-sandbox, CHROME_PATH,
3 retries with JSON validity check (no runtimeError).

Usage:
  OLANO_BASE=http://localhost:8903  python3 run-baseline-cwv.py local
  OLANO_BASE=https://olano.vercel.app python3 run-baseline-cwv.py prod
Writes raw JSON to baseline/cwv/ and prints a one-line summary per page.
"""
import subprocess, json, os, sys, time, csv

TAG = sys.argv[1] if len(sys.argv) > 1 else "local"
BASE = os.environ.get("OLANO_BASE", "http://localhost:8903")
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = f"{HERE}/baseline/cwv"
os.makedirs(OUT, exist_ok=True)

PAGES = ["index.html", "app/kasir.html"]

def run(url, outp):
    cmd = ["npx", "-y", "lighthouse", url,
           "--output=json", "--output-path=" + outp,
           "--chrome-flags=--headless=new --no-sandbox",
           "--throttling-method=simulate",
           "--form-factor=mobile",
           "--only-categories=performance,accessibility,best-practices,seo",
           "--quiet"]
    env = dict(os.environ, CHROME_PATH="/usr/bin/google-chrome")
    for attempt in range(3):
        subprocess.run(cmd, capture_output=True, text=True, timeout=300, env=env)
        if valid(outp):
            return True
        time.sleep(5)
    return False

def valid(outp):
    if not (os.path.exists(outp) and os.path.getsize(outp) > 1000):
        return False
    try:
        d = json.load(open(outp))
        if d.get("runtimeError"):
            return False
        return d["categories"]["performance"]["score"] is not None
    except Exception:
        return False

def num(d, aid):
    a = d["audits"].get(aid, {})
    v = a.get("numericValue")
    return round(v, 1) if v is not None else None

rows = []
for p in PAGES:
    f = p.replace("/", "-")
    outp = f"{OUT}/lh-m-{TAG}-{f}.json"
    ok = run(f"{BASE}/{p}", outp)
    if not ok:
        print(f"[FAIL] {TAG} {p} (no valid json after 3 tries)", flush=True)
        continue
    d = json.load(open(outp))
    c = d["categories"]
    a = d["audits"]
    def g(k):
        v = c.get(k)
        return round(v["score"] * 100) if v and v.get("score") is not None else None
    # INP: Lighthouse 13 exposes audit 'interaction-to-next-paint' when present;
    # 'interactive' is TTI (lh.py's 'inp' csv column). Record both.
    inp_id = "interaction-to-next-paint" if "interaction-to-next-paint" in a else "inp" if "inp" in a else None
    row = {
        "tag": TAG, "base": BASE, "page": p,
        "perf": g("performance"), "a11y": g("accessibility"),
        "bp": g("best-practices"), "seo": g("seo"),
        "lcp_ms": num(d, "largest-contentful-paint"),
        "lcp_disp": a.get("largest-contentful-paint", {}).get("displayValue", ""),
        "cls": round(a.get("cumulative-layout-shift", {}).get("numericValue") or 0, 4),
        "cls_disp": a.get("cumulative-layout-shift", {}).get("displayValue", ""),
        "ttfba_ms": num(d, "server-response-time"),
        "fcp_ms": num(d, "first-contentful-paint"),
        "si_ms": num(d, "speed-index"),
        "tbt_ms": num(d, "total-blocking-time"),
        "tti_ms": num(d, "interactive"),
        "tti_disp": a.get("interactive", {}).get("displayValue", ""),
        "inp_ms": num(d, inp_id) if inp_id else None,
        "inp_id": inp_id or "n/a",
        "inp_disp": a.get(inp_id, {}).get("displayValue", "") if inp_id else "n/a",
    }
    rows.append(row)
    print(f"[OK] {TAG} {p:18s} perf={row['perf']} a11y={row['a11y']} bp={row['bp']} seo={row['seo']} "
          f"LCP={row['lcp_disp']} CLS={row['cls_disp']} TTI={row['tti_disp']} INP={row['inp_disp']}({row['inp_id']})", flush=True)

csvp = f"{HERE}/baseline-cwv-{TAG}.csv"
new = not os.path.exists(csvp)
with open(csvp, "a", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()) if rows else ["tag"])
    if new:
        w.writeheader()
    w.writerows(rows)
print(f"-> appended {len(rows)} rows to {csvp}", flush=True)
