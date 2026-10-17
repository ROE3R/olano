#!/usr/bin/env python3
"""Diff before/after Lighthouse scores for /root/olano; gate-check perf/a11y/CLS/LCP."""
import csv, json, glob, re

BASE = "/root/olano/audit"

def load_scores(p):
    with open(p, newline="") as f:
        return {r["file"]: r for r in csv.DictReader(f)}

before = load_scores(f"{BASE}/before/lh-scores.csv")
after = load_scores(f"{BASE}/after/lh-scores.csv")

def flt(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return None

def secs(v):  # "2.5 s" -> 2500.0 ms ; bare number -> as-is (already ms)
    if v is None:
        return None
    m = re.match(r"\s*([\d.]+)\s*s?\s*$", str(v))
    return None if not m else float(m.group(1)) * 1000.0

def row_metrics(row):
    return (flt(row.get("perf")), flt(row.get("a11y")),
            flt(row.get("cls")), secs(row.get("lcp") or row.get("inp")))

# after JSONs: validate perf score present, get exact LCP
after_json = {}
lcp_audit_refs = {}
for path in sorted(glob.glob(f"{BASE}/after/lh/lh-m-*.json")):
    page = path.split("lh-m-")[-1].removesuffix(".json")
    with open(path) as f:
        d = json.load(f)
    perf = flt(d.get("categories", {}).get("performance", {}).get("score"))
    err = d.get("runtimeError")
    audits = d.get("audits", {})
    lcp_id = next((k for k in audits if "largest-contentful" in k), None)
    lcp = audits.get(lcp_id, {}).get("numericValue") if lcp_id else None
    refs = [r.get("id") for r in d.get("categories", {}).get("accessibility", {}).get("auditRefs", [])]
    lcp_audit_refs[page] = set(refs)
    after_json[page] = {"perf": perf, "err": err, "lcp": lcp, "a11y_refs": set(refs)}

pages = sorted(set(before) | set(after))
hdr = f"{'page':<38} {'perfB':>5} {'perfA':>5} {'a11yB':>5} {'a11yA':>5} {'clsB':>6} {'clsA':>6} {'lcpB':>7} {'lcpA':>7}  flags"
print(hdr); print("-" * len(hdr))
regressions, gates = [], []
for p in pages:
    pb, ab, cb, lb = row_metrics(before.get(p, {}))
    pa, aa, ca, la = row_metrics(after.get(p, {}))
    if la is None:
        la = after_json.get(p, {}).get("lcp")
    flags = []
    if pb is not None and pa is not None and pa < pb: flags.append(f"PERF-REG(-{pb-pa:.0f})")
    if ab is not None and aa is not None and aa < ab: flags.append(f"A11Y-REG(-{ab-aa:.0f})")
    if pa is not None and pa < 90: flags.append("GATE:perf<90")
    if aa is not None and aa < 100: flags.append("GATE:a11y<100")
    if ca is not None and ca > 0.05: flags.append("GATE:cls>0.05")
    if la is not None and la > 2500: flags.append("GATE:lcp>2.5s")
    for x in flags:
        (regressions if "REG" in x else gates).append(f"{p}: {x}")
    def s(v, nd=0, unit=""):
        return "n/a" if v is None else f"{v:.{nd}f}{unit}"
    print(f"{p:<38} {s(pb):>5} {s(pa):>5} {s(ab):>5} {s(aa):>5} {s(cb,3):>6} {s(ca,3):>6} "
          f"{s(lb,0,'ms'):>7} {s(la,0,'ms'):>7}  {' '.join(flags)}")

print()
print("AFTER-JSON VALIDATION: real perf score =", sum(1 for v in after_json.values() if v["perf"] is not None),
      "/", len(after_json), "| runtimeErrors =", sum(1 for v in after_json.values() if v["err"]))
print()
print("REGRESSIONS:", len(regressions))
for r in regressions: print("  -", r)
print("GATE FAILURES:", len(gates))
for g in gates: print("  -", g)

print()
print("=== A11Y <100 DETAIL (after JSONs, accessibility-category audits only) ===")
for p in pages:
    aa = flt(after.get(p, {}).get("a11y"))
    if aa is None or aa >= 100:
        continue
    with open(f"{BASE}/after/lh/lh-m-{p}.json") as fh:
        d = json.load(fh)
    refs = after_json[p]["a11y_refs"]
    print(f"\n--- {p} (a11y={aa:.0f})")
    any_fail = False
    for aid, aud in sorted(d.get("audits", {}).items()):
        if aid not in refs:
            continue
        if aud.get("score") is not None and aud["score"] < 1 and aud.get("scoreDisplayMode") not in ("notApplicable", "informative", "manual"):
            any_fail = True
            details = aud.get("details") or {}
            items = details.get("items") if isinstance(details, dict) else None
            items = items if isinstance(items, list) else []
            print(f"  FAIL {aid} (weight={aud.get('weight')}): {aud.get('title')}")
            for it in items[:6]:
                node = it.get("node") or {}
                sel = node.get("selector") or node.get("path") or ""
                snip = (node.get("nodeLabel") or node.get("explanation") or "").strip().replace("\n", " ")[:90]
                print(f"      node: {sel} | {snip}")
            if len(items) > 6:
                print(f"      ... +{len(items)-6} more nodes")
    if not any_fail:
        print("  (no failing weighted audits found in category refs — check manual/informative)")

print()
print("=== index.html AFTER: CLS + LCP forensics ===")
with open(f"{BASE}/after/lh/lh-m-index.html.json") as f:
    d = json.load(f)
audits = d["audits"]
for k in ("layout-shifts", "largest-contentful-paint-element", "prioritize-lcp-image", "lcp-lazy-loaded"):
    aud = audits.get(k)
    if not aud:
        continue
    det = aud.get("details") or {}
    items = det.get("items") if isinstance(det, dict) else []
    items = items if isinstance(items, list) else []
    print(f"\n{k}: score={aud.get('score')} items={len(items)}")
    for it in items[:8]:
        print("  ", json.dumps(it)[:400])
perf_items = {}
for k in ("first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "speed-index", "cumulative-layout-shift"):
    if k in audits:
        perf_items[k] = audits[k].get("numericValue")
print("\nkey metric numericValues (after index):", perf_items)
