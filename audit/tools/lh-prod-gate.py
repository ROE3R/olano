#!/usr/bin/env python3
"""Prod LCP gate: 6 halaman at-risk di olano.vercel.app, mobile simulated-throttle."""
import subprocess, json, os, time, sys

BASE = os.environ.get("OLANO_BASE", "https://olano.vercel.app")
PAGES = ["index.html", "umkm.html", "kasir.html", "app/kasir.html", "ai.html",
         "alat/kalkulator-pph-final-umkm.html"]
OUT = "audit/after/lh-prod"
os.makedirs(OUT, exist_ok=True)

def run(p):
    outp = f"{OUT}/{p.replace('/', '-')}.json"
    cmd = ["npx", "-y", "lighthouse", f"{BASE}/{p}",
           "--output=json", "--output-path=" + outp,
           "--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage",
           "--form-factor=mobile", "--only-categories=performance,accessibility", "--quiet"]
    env = dict(os.environ, CHROME_PATH="/usr/bin/google-chrome")
    for _ in range(2):
        subprocess.run(cmd, capture_output=True, text=True, timeout=300, env=env)
        if os.path.exists(outp) and os.path.getsize(outp) > 1000:
            d = json.load(open(outp))
            if not d.get("runtimeError"):
                return d
    return None

rows = []
for p in PAGES:
    d = run(p)
    if not d:
        print(f"[FAIL] {p} (no valid json)", flush=True)
        continue
    c = d["categories"]
    perf = round(c["performance"]["score"] * 100)
    a11y = round(c["accessibility"]["score"] * 100)
    lcpv = d["audits"]["largest-contentful-paint"]["displayValue"]
    clsv = d["audits"]["cumulative-layout-shift"]["displayValue"]
    try:
        lcpf = float(lcpv.split()[0])
    except ValueError:
        lcpf = 99.0
    clsf = float(clsv.replace("pts", ""))
    ok = perf >= 90 and a11y == 100 and lcpf <= 2.5
    rows.append((p, perf, a11y, lcpv, clsv, ok))
    print(f"[{ 'OK' if ok else 'CHECK' }] {p:34s} perf={perf} a11y={a11y} LCP={lcpv:6s} CLS={clsv} "
          f"{'GATE PASS' if ok else 'GATE FAIL'}", flush=True)

fail = [r for r in rows if not r[5]]
print(f"\nprod LCP gate: {len(rows)-len(fail)}/{len(rows)} PASS"
      + (f" | CHECK pages: {[r[0] for r in fail]}" if fail else " | all pass"))
