"""landing-fix verifier: CDP driver untuk verifikasi & screenshot L-item landing.
Pola dari cdp_pos.py (Fase 0). Run: python3 audit/tools/landing_verify.py <cmd>
  l24     - verifikasi fungsional kalkulator omzet (chip/clear/format) + shot seksi
  top     - viewport shot 360x800 + fold 360x560 (C3)
  sizes   - viewport shot 390x844 + 768x900
  measure - scrollHeight (L35) + posisi CTA (C3) @360
"""
import base64, json, subprocess, time, urllib.request, urllib.parse, websocket, os, sys

CHROME = "/usr/bin/google-chrome"
PORT = 9343
BASE = "http://localhost:8912/index.html"
OUT = "/root/olano/audit/uiux/landing-after"
os.makedirs(OUT, exist_ok=True)

def launch():
    p = subprocess.Popen([
        CHROME, "--headless=new", "--no-sandbox", "--disable-gpu",
        "--remote-debugging-port=%d" % PORT, "--remote-allow-origins=*",
        "--user-data-dir=/tmp/chrome-landing-fix", "--window-size=500,900",
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
    def __init__(self, url, w=360, h=800):
        for attempt in range(6):
            req = urllib.request.Request("http://127.0.0.1:%d/json/new?%s" % (PORT, urllib.parse.quote(url)), method="PUT")
            with urllib.request.urlopen(req) as r:
                t = json.loads(r.read())
            self.ws = websocket.create_connection(t["webSocketDebuggerUrl"], timeout=30)
            self.i = 0
            self.w, self.h = w, h
            self.send("Emulation.setDeviceMetricsOverride", width=w, height=h, deviceScaleFactor=2, mobile=True)
            t0 = time.time()
            ok = False
            while time.time() - t0 < 8:
                try:
                    if self.js("location.href") and url.split("#")[0] in self.js("location.href"):
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
        # tunggu render stabil
        self.wait("document.readyState === 'complete'", 10)
        time.sleep(0.4)

    def send(self, method, **kw):
        self.i += 1
        self.ws.send(json.dumps({"id": self.i, "method": method, "params": kw}))
        while True:
            m = json.loads(self.ws.recv())
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

    def rect(self, sel):
        return self.js("""
        (() => { const e = document.querySelector(%s);
          if (!e) return null;
          const r = e.getBoundingClientRect();
          return {x:r.x, y:r.y, w:r.width, h:r.height, top:r.top+window.scrollY, bottom:r.bottom+window.scrollY}; })()
        """ % json.dumps(sel))

    def shot(self, name, clip=None):
        path = os.path.join(OUT, name)
        kw = {"format": "png"}
        if clip:
            kw["clip"] = clip
            kw["captureBeyondViewport"] = True
        d = self.send("Page.captureScreenshot", **kw)
        open(path, "wb").write(base64.b64decode(d["data"]))
        print("SHOT", path)
        return path

    def shot_full(self, name):
        """Full-page: scroll dulu biar IntersectionObserver reveal semua, lalu capture. """
        sh = self.js("document.documentElement.scrollHeight")
        y = 0
        while y < sh:
            self.js("window.scrollTo(0,%d)" % y)
            time.sleep(0.12)
            y += 600
        self.js("window.scrollTo(0,0)")
        time.sleep(0.35)
        return self.shot(name, clip={"x": 0, "y": 0, "width": self.w, "height": sh, "scale": 1})

    def clip_of(self, name, sel, pad=12):
        r = self.rect(sel)
        if not r:
            print("NOEL", sel)
            return None
        c = {"x": 0, "y": max(0, r["top"] - pad), "width": self.w,
             "height": min(self.js("document.documentElement.scrollHeight") - max(0, r["top"] - pad), r["h"] + 2 * pad), "scale": 1}
        return self.shot(name, clip=c)

    def insert_text(self, txt):
        self.send("Input.insertText", text=txt)

    def close(self):
        try:
            self.ws.close()
        except Exception:
            pass

def cmd_l24():
    p = launch()
    try:
        t = Tab(BASE, 360, 800)
        checks = {}
        checks["value_awal"] = t.js("document.getElementById('tax-omzet').value")
        checks["prefix"] = t.js("(document.querySelector('.omzet-prefix')||{}).textContent")
        checks["n_chips"] = t.js("document.querySelectorAll('.omzet-chips button').length")
        checks["has_clear"] = t.js("!!document.getElementById('omzet-clear')")
        # chip 10 jt (real tap)
        t.send("Page.bringToFront")
        r = t.rect(".omzet-chips button")
        t.send("Input.dispatchMouseEvent", type="mousePressed", x=r["x"]+r["w"]/2, y=r["y"]+r["h"]/2, button="left", clickCount=1)
        t.send("Input.dispatchMouseEvent", type="mouseReleased", x=r["x"]+r["w"]/2, y=r["y"]+r["h"]/2, button="left", clickCount=1)
        time.sleep(0.2)
        checks["chip10_value"] = t.js("document.getElementById('tax-omzet').value")
        checks["chip10_result"] = t.js("document.getElementById('tax-result').textContent")
        checks["chip10_on"] = t.js("document.querySelector('.omzet-chips button').classList.contains('on')")
        # chip 100 jt -> hasil non-nol
        t.js("document.querySelectorAll('.omzet-chips button')[3].click()")
        time.sleep(0.15)
        checks["chip100_value"] = t.js("document.getElementById('tax-omzet').value")
        checks["chip100_result"] = t.js("document.getElementById('tax-result').textContent")
        # clear
        t.js("document.getElementById('omzet-clear').click()")
        checks["cleared_value"] = t.js("document.getElementById('tax-omzet').value")
        # ketik nyata: insertText "8500000" -> format live + caret di akhir
        t.js("document.getElementById('tax-omzet').focus()")
        t.insert_text("8500000")
        time.sleep(0.15)
        checks["typed_value"] = t.js("document.getElementById('tax-omzet').value")
        checks["caret_at_end"] = t.js("var i=document.getElementById('tax-omzet'); i.selectionStart===i.value.length && i.value.length>0")
        # paste kotor "Rp 60.000.000"
        t.js("document.getElementById('tax-omzet').select()")
        t.insert_text("Rp 60.000.000")
        time.sleep(0.15)
        checks["pasted_value"] = t.js("document.getElementById('tax-omzet').value")
        checks["type_not_number"] = t.js("document.getElementById('tax-omzet').type")
        checks["inputmode"] = t.js("document.getElementById('tax-omzet').getAttribute('inputmode')")
        for k, v in checks.items():
            print("CHECK", k, "=", v)
        # scroll ke seksi pajak biar IO jalan, lalu shot
        t.js("document.getElementById('pajak').scrollIntoView({block:'start'})")
        time.sleep(0.6)
        t.clip_of("after-L24-calc-360.png", "#pajak .calc-card", pad=16)
        t.close()
    finally:
        p.terminate()

def cmd_top():
    p = launch()
    try:
        t = Tab(BASE, 360, 800)
        t.shot("after-360x800.png")
        t.send("Emulation.setDeviceMetricsOverride", width=360, height=560, deviceScaleFactor=2, mobile=True)
        time.sleep(0.4)
        t.shot("after-fold-360x560.png")
        t.close()
        # 768
        t2 = Tab(BASE, 768, 900)
        t2.shot("after-768x900.png")
        t2.close()
        # 390
        t3 = Tab(BASE, 390, 844)
        t3.shot("after-390x844.png")
        t3.close()
    finally:
        p.terminate()

def cmd_l25():
    p = launch()
    try:
        t = Tab(BASE, 360, 800)
        checks = {}
        checks["result_above_input"] = t.js("document.getElementById('tax-out').getBoundingClientRect().top + window.scrollY < document.getElementById('tax-omzet').getBoundingClientRect().top + window.scrollY")
        checks["aria_live"] = t.js("document.getElementById('tax-out').getAttribute('aria-live')")
        checks["dom_order_ok"] = t.js("var c=document.querySelector('.calc-card'); Array.prototype.indexOf.call(c.children, document.getElementById('tax-out')) < Array.prototype.indexOf.call(c.children, document.getElementById('tax-omzet').closest('.field'))")
        # simulasi mengetik -> scrollIntoView harus menjaga hasil dalam viewport
        t.js("document.getElementById('pajak').scrollIntoView({block:'start'})")
        time.sleep(0.4)
        t.js("document.getElementById('tax-omzet').focus()")
        t.insert_text("50000000")
        time.sleep(0.6)
        checks["result_in_viewport_after_type"] = t.js("var r=document.getElementById('tax-out').getBoundingClientRect(); r.top >= 0 && r.bottom <= window.innerHeight")
        checks["result_text"] = t.js("document.getElementById('tax-result').textContent")
        for k, v in checks.items():
            print("CHECK", k, "=", v)
        t.js("document.getElementById('pajak').scrollIntoView({block:'start'})")
        time.sleep(0.6)
        t.clip_of("after-L25-calc-360.png", "#pajak .calc-card", pad=16)
        t.close()
    finally:
        p.terminate()

def cmd_full():
    p = launch()
    try:
        t = Tab(BASE, 360, 800)
        t.shot_full("after-full-360.png")
        print("scrollHeight@360 =", t.js("document.documentElement.scrollHeight"))
        t.close()
    finally:
        p.terminate()

def cmd_measure():
    p = launch()
    try:
        t = Tab(BASE, 360, 800)
        m = {}
        m["scrollHeight"] = t.js("document.documentElement.scrollHeight")
        m["screens_800"] = round(m["scrollHeight"] / 800.0, 2)
        m["ticker_h"] = t.js("(document.querySelector('.ticker')||{getBoundingClientRect(){return{height:null}}}).getBoundingClientRect().height")
        m["ticker_lines"] = t.js("var p=document.querySelector('.ticker-text'); Math.round(p.getBoundingClientRect().height / parseFloat(getComputedStyle(p).lineHeight))")
        m["cta_top_doc"] = t.js("var a=document.querySelector('.hero .cta-row a'); a.getBoundingClientRect().top + window.scrollY")
        m["cta_bottom_doc"] = t.js("var a=document.querySelector('.hero .cta-row a'); a.getBoundingClientRect().bottom + window.scrollY")
        m["cta_h"] = t.js("var a=document.querySelector('.hero .cta-row a'); a.getBoundingClientRect().height")
        m["h1_lines"] = t.js("var h=document.querySelector('.hero h1'); Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight))")
        m["hscroll_320"] = t.js("document.documentElement.scrollWidth > document.documentElement.clientWidth")
        for k, v in m.items():
            print("M", k, "=", v)
        t.close()
    finally:
        p.terminate()

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "measure"
    {"l24": cmd_l24, "l25": cmd_l25, "top": cmd_top, "full": cmd_full, "measure": cmd_measure}[cmd]()
