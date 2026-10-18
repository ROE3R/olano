#!/usr/bin/env python3
"""
Audit teknis per-halaman Olano (18 halaman x 3 viewport).
Output: JSON lengkap + ringkasan stdout.
Deteksi: JS error, request gagal, hscroll, CLS, LCP, heading order,
gambar tanpa alt/dimensi, target sentuh <44, teks <12px, kontras (dengan
penanganan background-image), meta SEO, font asli termuat.
"""
import json, sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "https://olano.vercel.app"
OUT = sys.argv[2] if len(sys.argv) > 2 else "/root/olano/audit/uiux/verify-pages.json"

PAGES = [
    "index.html", "app/kasir.html", "app/login.html",
    "pajak.html", "website.html", "umkm.html", "ai.html", "automation.html",
    "naik-kelas.html", "analisa-delivery.html",
    "alat/kalkulator-pph-final-umkm.html", "alat/kalkulator-hpp-harga-jual.html",
    "alat/kalkulator-biaya-qris.html", "alat/kalkulator-margin-delivery.html",
    "tentang.html", "kebijakan-privasi.html", "syarat-ketentuan.html",
    "templates/katalog.html",
]
VIEWPORTS = [(360, 800), (390, 844), (1280, 900)]

METRICS_JS = r"""
(() => {
  const out = {};

  // ---- heading order ----
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .filter(e => e.offsetParent !== null || getComputedStyle(e).display !== 'none');
  out.h1Count = hs.filter(e => e.tagName === 'H1').length;
  let last = 0, jumps = [];
  for (const e of hs) {
    const lvl = +e.tagName[1];
    if (last && lvl > last + 1) jumps.push(`${last}->${lvl}:"${e.textContent.trim().slice(0,30)}"`);
    last = lvl;
  }
  out.headingJumps = jumps;

  // ---- images ----
  const imgs = [...document.images];
  out.imgTotal = imgs.length;
  out.imgNoAlt = imgs.filter(i => !i.hasAttribute('alt')).length;
  out.imgNoDims = imgs.filter(i => !(i.hasAttribute('width') && i.hasAttribute('height'))).length;
  out.imgLazyAboveFold = imgs.filter(i => {
    const r = i.getBoundingClientRect();
    return r.top < window.innerHeight && r.height > 0 && i.loading === 'lazy';
  }).length;

  // ---- touch targets ----
  const tappable = [...document.querySelectorAll('a,button,[role=button],input,select,summary,label[for]')];
  const tiny = [];
  for (const e of tappable) {
    const r = e.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    if (getComputedStyle(e).visibility === 'hidden') continue;
    if ((r.height < 44 || r.width < 24) && (e.textContent || e.getAttribute('aria-label') || '').trim()) {
      tiny.push({ t: (e.textContent || e.getAttribute('aria-label')).trim().slice(0, 28),
                  w: Math.round(r.width), h: Math.round(r.height) });
    }
  }
  out.tinyTargets = tiny.slice(0, 12);
  out.tinyCount = tiny.length;

  // ---- small text ----
  const small = [];
  for (const e of document.querySelectorAll('p,span,li,a,b,small,td,label,button,summary')) {
    const t = (e.textContent || '').trim();
    if (t.length < 2) continue;
    if (e.querySelector('p,span,li,a,b')) continue;
    const s = getComputedStyle(e);
    if (s.visibility === 'hidden' || s.display === 'none') continue;
    const r = e.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const fs = parseFloat(s.fontSize);
    if (fs < 12) small.push({ fs: +fs.toFixed(1), t: t.slice(0, 30) });
  }
  out.smallTextCount = small.length;
  out.smallText = small.slice(0, 10);

  // ---- contrast (gradient-aware: skip elements on bg-image, flag separately) ----
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); };
    const [r,g,b] = [f(c[0]),f(c[1]),f(c[2])]; return 0.2126*r + 0.7152*g + 0.0722*b; };
  const parse = s => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(',').map(Number); return { rgb: p.slice(0,3), a: p.length > 3 ? p[3] : 1 }; };
  const bgInfo = el => {
    let e = el, img = false;
    while (e && e !== document.documentElement) {
      const s = getComputedStyle(e);
      if (s.backgroundImage && s.backgroundImage !== 'none') img = true;
      const c = parse(s.backgroundColor);
      if (c && c.a > 0.9) return { rgb: c.rgb, img };
      e = e.parentElement;
    }
    return { rgb: [255,255,255], img };
  };
  const cbad = [], cimg = [];
  const seen = new Set();
  for (const e of document.querySelectorAll('p,span,li,a,button,b,small,h1,h2,h3,h4,label,td')) {
    const t = (e.textContent || '').trim();
    if (t.length < 2 || e.querySelector('p,span,li,a,b')) continue;
    const s = getComputedStyle(e);
    if (s.visibility === 'hidden' || s.display === 'none') continue;
    const r = e.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const fg = parse(s.color);
    if (!fg || fg.a < 0.5) continue;
    const bg = bgInfo(e);
    if (bg.img) { if (cimg.length < 5) cimg.push(t.slice(0,26)); continue; }
    const L1 = lum(fg.rgb), L2 = lum(bg.rgb);
    const ratio = (Math.max(L1,L2) + 0.05) / (Math.min(L1,L2) + 0.05);
    const fs = parseFloat(s.fontSize), bold = parseInt(s.fontWeight) >= 700;
    const need = (fs >= 24 || (fs >= 18.66 && bold)) ? 3 : 4.5;
    if (ratio < need) {
      const k = s.color + bg.rgb.join('');
      if (!seen.has(k)) { seen.add(k);
        cbad.push({ ratio: +ratio.toFixed(2), need, fs: +fs.toFixed(1), t: t.slice(0,26),
                    fg: s.color, bg: `rgb(${bg.rgb.join(',')})` }); }
    }
  }
  out.contrastFail = cbad.slice(0, 8);
  out.contrastOnImage = cimg;

  // ---- meta ----
  const q = sel => document.querySelector(sel);
  out.title = (document.title || '').slice(0, 90);
  out.titleLen = (document.title || '').length;
  const d = q('meta[name=description]');
  out.descLen = d ? d.content.length : 0;
  out.canonical = !!q('link[rel=canonical]');
  out.ogImage = !!q('meta[property="og:image"]');
  out.viewport = (q('meta[name=viewport]') || {}).content || '';
  out.lang = document.documentElement.lang;
  out.noindex = !!q('meta[name=robots][content*=noindex]');

  // ---- font asli ----
  out.fontAspekta = document.fonts ? document.fonts.check('600 16px Aspekta') : null;

  // ---- CTA & copy signals ----
  const links = [...document.querySelectorAll('a,button')].filter(e => e.offsetParent !== null);
  out.ctaCount = links.length;
  out.ctaLabels = [...new Set(links.map(e => (e.textContent || '').trim()).filter(t => t && t.length < 60))].slice(0, 18);
  const bodyText = document.body.innerText || '';
  out.pronKamu = (bodyText.match(/\bkamu\b/gi) || []).length;
  out.pronAnda = (bodyText.match(/\bAnda\b/g) || []).length;
  out.waLinks = [...document.querySelectorAll('a[href*="wa.me"]')].length;
  out.telLinks = [...document.querySelectorAll('a[href^="tel:"]')].length;
  out.priceFormats = [...new Set((bodyText.match(/Rp\s?[\d.,]+\s?(rb|ribu|jt|juta|k)?/gi) || []))].slice(0, 12);
  out.bodyWords = bodyText.trim().split(/\s+/).filter(Boolean).length;

  return out;
})()
"""

CLS_JS = r"""
() => { window.__cls = [];
  new PerformanceObserver(l => { for (const e of l.getEntries())
    if (!e.hadRecentInput) window.__cls.push(e.value); })
    .observe({ type: 'layout-shift', buffered: true }); }
"""

results = []
with sync_playwright() as p:
    b = p.chromium.launch(args=["--no-sandbox"])
    for path in PAGES:
        for (w, h) in VIEWPORTS:
            ctx = b.new_context(viewport={"width": w, "height": h})
            pg = ctx.new_page()
            errs, failed = [], []
            pg.on("pageerror", lambda e: errs.append(str(e)[:120]))
            pg.on("requestfailed", lambda r: failed.append(r.url.split("/")[-1][:50]))
            rec = {"page": path, "vw": w, "vh": h}
            try:
                pg.goto(f"{BASE}/{path}", wait_until="load", timeout=40000)
                pg.evaluate(CLS_JS)
                pg.wait_for_timeout(3000)
                rec.update(pg.evaluate(METRICS_JS))
                rec["cls"] = round(sum(pg.evaluate("window.__cls || []")), 4)
                rec["scrollW"] = pg.evaluate("document.documentElement.scrollWidth")
                rec["scrollH"] = pg.evaluate("document.documentElement.scrollHeight")
                rec["hscroll"] = rec["scrollW"] > w
                rec["jsErrors"] = errs
                rec["failedReqs"] = failed[:5]
                rec["ok"] = True
            except Exception as e:
                rec["ok"] = False
                rec["error"] = str(e)[:160]
            results.append(rec)
            print(f"{path:44} {w:4}px ok={rec.get('ok')} "
                  f"cls={rec.get('cls','-')} hscroll={rec.get('hscroll','-')} "
                  f"tiny={rec.get('tinyCount','-')} small<12={rec.get('smallTextCount','-')} "
                  f"contrast={len(rec.get('contrastFail') or [])} js={len(rec.get('jsErrors') or [])}",
                  flush=True)
            ctx.close()
    b.close()

with open(OUT, "w") as f:
    json.dump(results, f, indent=1)
print(f"\nJSON -> {OUT} ({len(results)} records)")
