#!/usr/bin/env python3
"""Olano Lighthouse matrix runner. Usage: python3 lh.py <out_dir> [mobile|desktop|both]"""
import subprocess, json, glob, csv, os, sys, time

OUT = sys.argv[1] if len(sys.argv) > 1 else "audit/after"
MODE = sys.argv[2] if len(sys.argv) > 2 else "mobile"
BASE = os.environ.get("OLANO_BASE", "https://olano.vercel.app")
os.makedirs(f"{OUT}/lh", exist_ok=True)

MOB = ["index.html","kasir.html","app/kasir.html","umkm.html","pajak.html","website.html",
       "templates/katalog.html","analisa-delivery.html","ai.html","automation.html","naik-kelas.html",
       "tentang.html","kebijakan-privasi.html","syarat-ketentuan.html",
       "alat/kalkulator-pph-final-umkm.html","alat/kalkulator-hpp-harga-jual.html",
       "alat/kalkulator-biaya-qris.html","alat/kalkulator-margin-delivery.html"]
DESK = ["index.html","umkm.html","pajak.html","website.html","analisa-delivery.html","ai.html",
        "automation.html","naik-kelas.html","tentang.html","kebijakan-privasi.html",
        "syarat-ketentuan.html","alat/kalkulator-pph-final-umkm.html","alat/kalkulator-hpp-harga-jual.html"]

def run(url, factor, cat, outp):
    cmd = ["npx","-y","lighthouse",url,
           "--output=json","--output-path="+outp,
           "--chrome-flags=--headless=new --no-sandbox",
           "--throttling-method=simulate",
           "--form-factor="+factor,
           "--only-categories="+cat,"--quiet"]
    env = dict(os.environ, CHROME_PATH="/usr/bin/google-chrome")
    for attempt in range(3):
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=300, env=env)
        if valid(outp, cat):
            return True
        time.sleep(5)
    return False

def valid(outp, cat):
    # file harus JSON valid, TANPA runtimeError, dan punya skor utk category utama
    if not (os.path.exists(outp) and os.path.getsize(outp) > 1000):
        return False
    try:
        d = json.load(open(outp))
        if d.get("runtimeError"):
            return False
        return d["categories"]["performance"]["score"] is not None
    except Exception:
        return False

tasks = []
if MODE in ("mobile","both"):
    for p in MOB:
        f = p.replace("/","-")
        tasks.append((f"mobile {p}", f"{BASE}/{p}", "mobile", "performance,accessibility,best-practices,seo", f"{OUT}/lh/lh-m-{f}.json"))
if MODE in ("desktop","both"):
    for p in DESK:
        f = p.replace("/","-")
        tasks.append((f"desktop {p}", f"{BASE}/{p}", "desktop", "performance,accessibility", f"{OUT}/lh/lh-d-{f}.json"))

ok=fail=0
for label,url,factor,cat,outp in tasks:
    good = run(url, factor, cat, outp)
    if good:
        ok+=1
        try:
            d=json.load(open(outp)); c=d.get("categories",{})
            sc=", ".join(f"{k}={round(v['score']*100)}" for k,v in c.items())
            print(f"[OK]   {label:42s} {sc}", flush=True)
        except Exception as e:
            print(f"[warn] {label} json {e}", flush=True)
    else:
        fail+=1
        print(f"[FAIL] {label} (no json after 3 tries)", flush=True)

# parse all
rows=[]
for p in ("m","d"):
    for f in sorted(glob.glob(f"{OUT}/lh/lh-{p}-*.json")):
        try:
            d=json.load(open(f)); c=d.get("categories",{}); a=d.get("audits",{})
            def g(k):
                v=c.get(k)
                return round(v["score"]*100) if v and v.get("score") is not None else None
            rows.append([f.replace(f"{OUT}/lh/lh-{p}-","").replace(".json",""),
                         g("performance"),g("accessibility"),g("best-practices"),g("seo"),
                         a.get("first-contentful-paint",{}).get("displayValue",""),
                         a.get("cumulative-layout-shift",{}).get("displayValue",""),
                         a.get("interactive",{}).get("displayValue","")])
        except Exception:
            pass
with open(f"{OUT}/lh-scores.csv","w",newline="") as fh:
    w=csv.writer(fh); w.writerow(["file","perf","a11y","bp","seo","fcp","cls","inp"]); w.writerows(rows)
print(f"\n{OUT}: {ok} ok / {fail} fail; scores -> {OUT}/lh-scores.csv ({len(rows)} rows)")
