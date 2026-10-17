#!/bin/bash
# Olano audit Lighthouse matrix - baseline & after (18 URL mobile + 15 desktop)
cd /root/olano
BASE="https://olano.vercel.app"
OUT="audit/$1"   # before | after
mkdir -p "$OUT/lh"
MOB="index.html kasir.html app/kasir.html umkm.html pajak.html website.html templates/katalog.html analisa-delivery.html ai.html automation.html naik-kelas.html tentang.html kebijakan-privasi.html syarat-ketentuan.html alat/kalkulator-pph-final-umkm.html alat/kalkulator-hpp-harga-jual.html alat/kalkulator-biaya-qris.html alat/kalkulator-margin-delivery.html"
DESK="index.html umkm.html pajak.html website.html analisa-delivery.html ai.html automation.html naik-kelas.html tentang.html kebijakan-privasi.html syarat-ketentuan.html alat/kalkulator-pph-final-umkm.html alat/kalkulator-hpp-harga-jual.html"
for p in $MOB; do
  f=$(echo "$p" | tr '/' '-')
  echo "== mobile $p"
  CHROME_PATH=/usr/bin/google-chrome npx -y lighthouse "$BASE/$p" --output=json --output-path="$OUT/lh/lh-m-$f.json" --chrome-flags="--headless=new --no-sandbox" --form-factor=mobile --throttling-method=simulate --only-categories=performance,accessibility,bestpractices,seo >/dev/null 2>&1
done
for p in $DESK; do
  f=$(echo "$p" | tr '/' '-')
  echo "== desktop $p"
  CHROME_PATH=/usr/bin/google-chrome npx -y lighthouse "$BASE/$p" --output=json --output-path="$OUT/lh/lh-d-$f.json" --chrome-flags="--headless=new --no-sandbox" --form-factor=desktop --throttling-method=simulate --only-categories=performance,accessibility >/dev/null 2>&1
done
python3 - "$OUT" <<'PY'
import json, glob, csv, sys
out = sys.argv[1]
rows = []
for p in ['m','d']:
    for f in sorted(glob.glob(f'{out}/lh/lh-{p}-*.json')):
        try:
            d = json.load(open(f))
            c = d.get('categories', {})
            g = lambda k: round(c[k]['score']*100) if k in c else None
            a = d.get('audits', {})
            rows.append([f, g('performance'), g('accessibility'), g('bestpractices'), g('seo'),
                         a.get('first-contentful-paint',{}).get('displayValue',''),
                         a.get('cumulative-layout-shift',{}).get('displayValue',''),
                         a.get('interactive',{}).get('displayValue','')])
        except Exception as e:
            rows.append([f, 'ERR:'+str(e)])
with open(f'{out}/lh-scores.csv','w',newline='') as fh:
    w = csv.writer(fh); w.writerow(['file','perf','a11y','bp','seo','fcp','cls','inp']); w.writerows(rows)
print(f"scores -> {out}/lh-scores.csv ({len(rows)} rows)")
PY
echo "LH MATRIX DONE: $OUT"
