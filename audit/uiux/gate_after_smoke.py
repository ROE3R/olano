#!/usr/bin/env python3
"""Smoke gate after merge (fix/ui-ux-audit-2026-10 @ merged tree) — port 8913.
C3 fold 360x560 (CTA terlihat) · L35 scrollHeight <=9 layar @360x800 ·
JS page errors=0 (index + kasir) · POS: uang kurang block + rekap render."""
import base64, json, subprocess, time, urllib.request, urllib.parse, websocket

CHROME = "/usr/bin/google-chrome"
PORT = 9441
BASE = "http://localhost:8913"
OUT = "/root/olano/audit/uiux/gate-after-smoke.json"

def launch():
    p = subprocess.Popen([CHROME, "--headless=new", "--no-sandbox", "--disable-gpu",
                          "--remote-debugging-port=%d" % PORT, "--remote-allow-origins=*",
                          "--user-data-dir=/tmp/chrome-gate-after", "--window-size=360,800",
                          "--hide-scrollbars", "about:blank"],
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(60):
        try:
            with urllib.request.urlopen("http://127.0.0.1:%d/json/version" % PORT, timeout=1) as r:
                json.loads(r.read())
            return p
        except Exception:
            time.sleep(0.5)
    raise RuntimeError("chrome not ready")

class Tab:
    def __init__(self, url, w, h):
        # /json/new?url= kadang menghasilkan tab about:blank -> cek & retry (pola cdp_pos.py)
        for attempt in range(6):
            req = urllib.request.Request("http://127.0.0.1:%d/json/new?%s" % (PORT, urllib.parse.quote(url)), method="PUT")
            with urllib.request.urlopen(req) as r:
                t = json.loads(r.read())
            self.ws = websocket.create_connection(t["webSocketDebuggerUrl"], timeout=30)
            self.i = 0
            self.errors = []
            self.send("Runtime.enable")
            self.send("Log.enable")
            self.send("Emulation.setDeviceMetricsOverride", width=w, height=h, deviceScaleFactor=2, mobile=True)
            t0 = time.time()
            ok = False
            while time.time() - t0 < 8:
                try:
                    if url.split("#")[0] in (self.js("location.href") or ""):
                        ok = True
                        break
                except Exception:
                    pass
                time.sleep(0.15)
            if ok:
                break
            try:
                self.ws.close()
                urllib.request.urlopen("http://127.0.0.1:%d/json/close/%s" % (PORT, t["id"]))
            except Exception:
                pass
        else:
            raise RuntimeError("tab tidak kunjung navigasi ke " + url)
        time.sleep(1.0)  # beri waktu SW/motion settle

    def send(self, method, **kw):
        self.i += 1
        self.ws.send(json.dumps({"id": self.i, "method": method, "params": kw}))
        while True:
            m = json.loads(self.ws.recv())
            if m.get("method") in ("Runtime.consoleAPICalled",) and m["params"].get("type") == "error":
                self.errors.append("console: " + json.dumps(m["params"].get("args", []))[:300])
            elif m.get("method") == "Runtime.exceptionThrown":
                d = m["params"].get("exceptionDetails", {})
                self.errors.append("exception: " + (d.get("exception", {}).get("description") or d.get("text", ""))[:300])
            elif m.get("method") == "Log.entryAdded":
                e = m["params"].get("entry", {})
                if e.get("level") == "error":
                    self.errors.append("log: " + (e.get("text", ""))[:300])
            if m.get("id") == self.i:
                if "error" in m:
                    raise RuntimeError(method + ": " + json.dumps(m["error"]))
                return m.get("result", {})

    def js(self, expr):
        r = self.send("Runtime.evaluate", expression=expr, returnByValue=True, awaitPromise=True)
        return r.get("result", {}).get("value")

    def wait(self, cond, tmax=8):
        t0 = time.time()
        while time.time() - t0 < tmax:
            try:
                if self.js(cond):
                    return True
            except Exception:
                pass
            time.sleep(0.15)
        return False

    def tap(self, sel, idx=0):
        return self.js("""(() => { const e = document.querySelectorAll(%s)[%d] || document.querySelector(%s);
            if (!e) return false; e.click(); return true; })()""" % (json.dumps(sel), idx, json.dumps(sel)))

res = {"base": BASE, "checks": []}
def check(name, ok, detail):
    res["checks"].append({"check": name, "pass": bool(ok), "detail": detail})
    print(("[PASS] " if ok else "[FAIL] ") + name + " :: " + str(detail), flush=True)

proc = launch()
try:
    # ---------- INDEX: C3 fold 360x560 + L35 360x800 + JS errors ----------
    ti = Tab(BASE + "/index.html", 360, 560)
    cta = ti.js("""(() => {
      const e = document.querySelector('.hero a.btn-primary, .hero .btn-primary');
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return {text: (e.innerText||'').trim().slice(0,40), top: Math.round(r.top), bottom: Math.round(r.bottom),
              visible: r.width > 0 && r.height > 0,
              aboveFold: r.bottom <= 560 && r.top >= 0};
    })()""")
    check("C3-fold-360x560-CTA-visible", bool(cta and cta["visible"] and cta["aboveFold"]), cta)

    ti.send("Emulation.setDeviceMetricsOverride", width=360, height=800, deviceScaleFactor=2, mobile=True)
    time.sleep(0.6)
    l35 = json.loads(ti.js("""JSON.stringify({sh: document.documentElement.scrollHeight, vh: 800,
        screens: +(document.documentElement.scrollHeight/800).toFixed(2),
        hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth})"""))
    check("L35-scrollHeight<=9-layar-360x800", l35["screens"] <= 9.0 and not l35["hscroll"], l35)
    check("index-JS-errors=0", len(ti.errors) == 0, ti.errors[:5])
    ti.send("Page.enable")
    idx_errors_snapshot = list(ti.errors)

    # ---------- KASIR: JS errors + uang kurang block + rekap ----------
    tk = Tab(BASE + "/app/kasir.html#demo", 360, 800)
    ok_items = tk.wait("document.querySelectorAll('.pos-item').length > 0", 10)
    check("kasir-demo-items-render", ok_items, {"items": tk.js("document.querySelectorAll('.pos-item').length")})

    # 1 item -> Bayar -> cash 5000 (kurang)
    tk.tap(".pos-item", 0)
    time.sleep(0.25)
    cnt = tk.js("document.getElementById('bar-count').textContent")
    tk.tap("#pay", 0)
    time.sleep(0.4)
    sheet_open = tk.js("document.getElementById('sheet').classList.contains('open')")
    tk.js("""const c = document.getElementById('cash'); c.value = '5000';
             c.dispatchEvent(new Event('input', {bubbles:true}));""")
    time.sleep(0.4)
    uk = json.loads(tk.js("""JSON.stringify({
        errShown: getComputedStyle(document.getElementById('cash-err')).display !== 'none',
        errText: document.getElementById('cash-err').textContent.trim().slice(0,60),
        sldShort: document.getElementById('sld').classList.contains('short'),
        sldAriaDisabled: document.getElementById('sld').getAttribute('aria-disabled'),
        total: document.getElementById('sheet-sum').textContent})"""))
    check("POS-uang-kurang-block-active", sheet_open and uk["errShown"] and uk["sldShort"] and uk["sldAriaDisabled"] == "true", {"cart": cnt, **uk})

    # tutup sheet -> menu -> rekap
    tk.js("""document.querySelector('#sheet .backdrop[data-close]').click()""")
    time.sleep(0.4)
    tk.tap("#menu-btn", 0)
    time.sleep(0.4)
    menu_open = tk.js("document.getElementById('sheet-menu').classList.contains('open')")
    tk.tap("#menu-rekap", 0)
    time.sleep(1.0)
    rk = json.loads(tk.js("""JSON.stringify({
        rekapOpen: document.getElementById('sheet-rekap').classList.contains('open'),
        statsChildren: document.getElementById('rekap-stats').children.length,
        statsText: document.getElementById('rekap-stats').innerText.replace(/\\n/g,' | ').slice(0,120),
        listText: document.getElementById('rekap-list').innerText.slice(0,80)})"""))
    check("POS-rekap-renders", menu_open and rk["rekapOpen"] and rk["statsChildren"] > 0, {"menu_open": menu_open, **rk})
    check("kasir-JS-errors=0", len(tk.errors) == 0, tk.errors[:5])

    proc.terminate()
finally:
    try:
        proc.terminate()
    except Exception:
        pass

res["all_pass"] = all(c["pass"] for c in res["checks"])
with open(OUT, "w") as f:
    json.dump(res, f, indent=2, ensure_ascii=False)
print("ALL_PASS =", res["all_pass"], "->", OUT, flush=True)
