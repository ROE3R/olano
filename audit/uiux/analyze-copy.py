#!/usr/bin/env python3
"""
Analisis karakter copy Olano vs karakter pasar UMKM Indonesia.
Ukur: jargon teknis, istilah asing, panjang kalimat, tingkat formalitas,
kata kerja aksi vs kata sifat pemasaran.
"""
import re, json, sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "https://olano.vercel.app"
PAGES = ["index.html","umkm.html","pajak.html","website.html","ai.html",
         "automation.html","naik-kelas.html","analisa-delivery.html","tentang.html"]

# Jargon teknis yang tidak dipakai pemilik warung
JARGON = [
 "PWA","IndexedDB","API","endpoint","deploy","server","cloud","backend","frontend",
 "layout","responsive","render","cache","service worker","manifest","JSON","CSV","XLSX",
 "MDR","PPN","PPh","PP 20/2026","RLS","tenant","multi-tenant","AI","LLM","prompt",
 "enkripsi","enkripsi at-rest","TLS","OAuth","webhook","sinkronisasi","outbox",
 "onboarding","dashboard","analytics","KPI","ROI","funnel","conversion","lead",
 "bundling","scalable","enterprise","SaaS","fitur","modul","integrasi","ekosistem",
]
# Istilah asing yang punya padanan Indonesia
ASING = ["offline","online","real-time","update","download","upload","install","setting",
         "share","print","scan","checkout","stok","margin","omzet","profit","cash flow",
         "insight","boost","engage","upgrade","trial","free","premium"]

def analyze(text):
    t = text.lower()
    words = re.findall(r"[a-zA-ZÀ-ÿ']+", text)
    sents = [s.strip() for s in re.split(r"[.!?\n]+", text) if len(s.strip()) > 12]
    jarg = {j: t.count(j.lower()) for j in JARGON if t.count(j.lower()) > 0}
    asing = {a: t.count(a) for a in ASING if t.count(a) > 0}
    avg_sent = sum(len(s.split()) for s in sents) / max(1, len(sents))
    long_sents = [s for s in sents if len(s.split()) > 25]
    return {
        "kata": len(words),
        "kalimat": len(sents),
        "rata2_kata_per_kalimat": round(avg_sent, 1),
        "kalimat_panjang_>25kata": len(long_sents),
        "contoh_kalimat_panjang": [s[:110] for s in long_sents[:3]],
        "jargon": dict(sorted(jarg.items(), key=lambda x: -x[1])[:12]),
        "total_jargon": sum(jarg.values()),
        "istilah_asing": dict(sorted(asing.items(), key=lambda x: -x[1])[:10]),
    }

out = {}
with sync_playwright() as p:
    b = p.chromium.launch(args=["--no-sandbox"])
    for path in PAGES:
        pg = b.new_page(viewport={"width":390,"height":844})
        pg.goto(f"{BASE}/{path}", wait_until="load", timeout=40000)
        pg.wait_for_timeout(1200)
        text = pg.evaluate("document.body.innerText")
        out[path] = analyze(text)
        pg.close()
    b.close()

print(f"{'halaman':24} {'kata':>6} {'rata2/klmt':>10} {'>25kata':>8} {'jargon':>7} {'asing':>6}")
for p, r in out.items():
    print(f"{p:24} {r['kata']:6} {r['rata2_kata_per_kalimat']:>10} "
          f"{r['kalimat_panjang_>25kata']:>8} {r['total_jargon']:>7} {sum(r['istilah_asing'].values()):>6}")

print("\n=== JARGON TERBANYAK (semua halaman) ===")
agg = {}
for r in out.values():
    for k, v in r["jargon"].items(): agg[k] = agg.get(k, 0) + v
for k, v in sorted(agg.items(), key=lambda x: -x[1])[:15]:
    print(f"  {k:22} {v}x")

print("\n=== KALIMAT PANJANG (contoh nyata) ===")
for p, r in out.items():
    for c in r["contoh_kalimat_panjang"][:2]:
        print(f"  {p:20} …{c}")

json.dump(out, open("/root/olano/audit/uiux/copy-analysis.json","w"), indent=1, ensure_ascii=False)
print("\n-> audit/uiux/copy-analysis.json")
