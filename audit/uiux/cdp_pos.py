"""Fase 0 POS baseline: CDP driver - real taps, screenshots, C1 tap measurement.
Setiap fase = tab BARU (hindari dead-zone input setelah reload).
Real tap = Input.dispatchMouseEvent; bila efek tak terjadi -> fallback JS click,
dicatat jujur sebagai JS-FALLBACK.
Run: python3 cdp_pos.py
"""
import base64, json, subprocess, time, urllib.request, urllib.parse, websocket, os

CHROME = "/usr/bin/google-chrome"
OUT = "/root/olano/audit/uiux/baseline/pos"
PORT = 9333

def launch():
    p = subprocess.Popen([
        CHROME, "--headless=new", "--no-sandbox", "--disable-gpu",
        "--remote-debugging-port=%d" % PORT, "--remote-allow-origins=*",
        "--user-data-dir=/tmp/chrome-pos-probe", "--window-size=360,800",
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
        # /json/new?url= kadang menghasilkan tab about:blank -> cek & retry
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
                    href = self.js("location.href")
                    if href and url.split("#")[0] in href:
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

    def shot(self, name):
        path = os.path.join(OUT, name)
        d = self.send("Page.captureScreenshot", format="png")
        open(path, "wb").write(base64.b64decode(d["data"]))
        print("SHOT", path)

    def rect(self, sel, idx=None):
        return self.js("""
        (() => { const e = %s;
          if (!e) return null;
          const r = e.getBoundingClientRect();
          return {x:r.x, y:r.y, w:r.width, h:r.height}; })()
        """ % ("document.querySelector(%s)" % json.dumps(sel) if idx is None
               else "document.querySelectorAll(%s)[%d]" % (json.dumps(sel), idx)))

    def real_tap(self, sel, idx=None):
        """Tap nyata via Input.dispatchMouseEvent. Return True bila koordinat valid."""
        self.send("Page.bringToFront")
        r = self.rect(sel, idx)
        if not r or r["w"] <= 0:
            return False
        x, y = r["x"] + r["w"]/2, r["y"] + r["h"]/2
        for t in ("mousePressed", "mouseReleased"):
            self.send("Input.dispatchMouseEvent", type=t, x=x, y=y, button="left", clickCount=1)
        time.sleep(0.2)
        return True

    def tap(self, sel, idx=None, expect=None, label=None):
        """Real tap dulu; verifikasi `expect` (JS boolean). Gagal -> JS click fallback."""
        name = label or sel
        if self.real_tap(sel, idx) and (expect is None or self.js(expect)):
            print("TAP-OK(real)", name)
            return "real"
        if expect is not None and self.js(expect):
            print("TAP-OK(real)", name)
            return "real"
        self.js("(document.querySelectorAll(%s)[%d]||document.querySelector(%s)).click()"
                % (json.dumps(sel), idx if idx is not None else 0, json.dumps(sel)))
        time.sleep(0.2)
        ok = expect is None or self.js(expect)
        print("TAP", name, "->", "JS-FALLBACK" if ok else "GAGAL-JUGA")
        return "js"

    def drag(self, sel_from, dx):
        r = self.rect(sel_from)
        x0, y0 = r["x"] + r["w"]/2, r["y"] + r["h"]/2
        self.send("Input.dispatchMouseEvent", type="mousePressed", x=x0, y=y0, button="left", clickCount=1)
        for s in range(1, 9):
            self.send("Input.dispatchMouseEvent", type="mouseMoved",
                      x=x0 + dx*s/8, y=y0, button="left", buttons=1)
            time.sleep(0.03)
        self.send("Input.dispatchMouseEvent", type="mouseReleased", x=x0+dx, y=y0, button="left")
        time.sleep(0.2)

def bar_json():
    return """JSON.stringify({
      barCount: document.getElementById('bar-count').textContent,
      barSum: document.getElementById('bar-sum').textContent,
      payDisabled: document.getElementById('pay').disabled,
      status: document.getElementById('status').textContent,
      demoChip: !document.getElementById('demo-chip').hidden,
      hash: location.hash, url: location.pathname,
      items: document.querySelectorAll('.pos-item').length,
      lowItems: document.querySelectorAll('.pos-item.low').length,
      viewH: innerHeight, docH: document.documentElement.clientHeight, viewW: innerWidth,
      barTop: Math.round(document.getElementById('bar').getBoundingClientRect().top),
      hintOnPage: document.body.innerText.includes('Ketuk produk untuk menjual'),
    })"""

def main():
    os.makedirs(OUT, exist_ok=True)
    proc = launch()
    try:
        # ================= FASE 1 (tab segar): C1 + A/D/E/F, SEMUA REAL TAP =================
        t = Tab("http://localhost:8901/app/kasir.html#demo")
        t.wait("document.querySelectorAll('.pos-item').length > 0")
        time.sleep(1.2)
        print("A-STATE", t.js(bar_json()))
        t.shot("01-A-pembukaan-demo-360x800.png")

        # ketukan 1: produk pertama (Es Kopi Susu Rp22.000)
        t.tap(".pos-item", 0, expect="document.getElementById('bar-count').textContent==='1 item'", label="produk#1")
        time.sleep(0.25)
        print("A-AFTER-TAP1", t.js(bar_json()))

        # ketukan 2: Bayar
        t.tap("#pay", expect="document.getElementById('sheet').classList.contains('open')", label="Bayar")
        time.sleep(0.35)
        t.shot("03-D-sheet-pembayaran-tunai-360x800.png")
        print("D-STATE", t.js("""JSON.stringify({
          open: document.getElementById('sheet').classList.contains('open'),
          sum: document.getElementById('sheet-sum').textContent,
          sldAmt: document.getElementById('sld-amt').textContent,
          payMethods: [...document.querySelectorAll('#pay-methods button')].map(b=>({m:b.dataset.m,h:Math.round(b.getBoundingClientRect().height)})),
          cashRect: (()=>{const r=document.getElementById('cash').getBoundingClientRect();return {y:Math.round(r.y),h:Math.round(r.height)};})(),
          sldRect: (()=>{const r=document.getElementById('sld').getBoundingClientRect();return {y:Math.round(r.y),h:Math.round(r.height)};})(),
          uangPasBtn: /uang pas/i.test(document.body.innerText),
          chipNominal: [...document.querySelectorAll('#sheet .panel button')].map(b=>b.textContent.trim()).filter(t=>/rb|000/.test(t))
        })"""))

        # ketukan 3 TIDAK ADA: cek 'uang pas'/chip nominal -> langsung ketukan 4 = geser knob
        t.drag("#sld .sld-knob", 320)
        time.sleep(0.8)
        print("C1-AFTER-DRAG", t.js(bar_json()))
        print("OK-OPEN", t.js("document.getElementById('sheet-ok').classList.contains('open')"))
        t.shot("04-E-layar-sukses-360x800.png")
        print("E-STATE", t.js("""JSON.stringify({
          kembaliShown: document.getElementById('kembali').style.display,
          receiptTxt: (document.getElementById('receipt')||{innerText:''}).innerText.slice(0,180),
          btns: [...document.querySelectorAll('#sheet-ok button')].map(b=>({txt:b.textContent.trim(),h:Math.round(b.getBoundingClientRect().height),w:Math.round(b.getBoundingClientRect().width)})),
          cartCount: document.getElementById('bar-count').textContent
        })"""))

        # F: struk via printToPDF 58mm + tombol Cetak (JS click; print dialog tak bisa dibuka headless)
        pdf = t.send("Page.printToPDF", printBackground=True, paperWidth=2.3, paperHeight=8.3,
                     marginTop=0, marginBottom=0, marginLeft=0, marginRight=0, scale=0.9)
        open(os.path.join(OUT, "05-F-struk-printToPDF-58mm.pdf"), "wb").write(base64.b64decode(pdf["data"]))
        print("SHOT-PDF 05-F-struk-printToPDF-58mm.pdf")
        t.shot("05-F-struk-receipt-zoom-360x800.png")

        # F-state offline/online (JS event, tanpa tap)
        t.send("Network.enable")
        t.send("Network.emulateNetworkConditions", offline=True, latency=0, downloadThroughput=-1, uploadThroughput=-1)
        t.js("window.dispatchEvent(new Event('offline'))")
        time.sleep(0.6)
        print("F-OFFLINE", t.js(bar_json()))
        t.shot("02-F-offline-360x800.png")
        t.send("Network.emulateNetworkConditions", offline=False, latency=0, downloadThroughput=-1, uploadThroughput=-1)
        t.js("window.dispatchEvent(new Event('online'))")
        time.sleep(1.2)
        print("F-ONLINE-AGAIN", t.js(bar_json()))

        # ================= FASE 2 (tab segar): B + C + D-variant =================
        t2 = Tab("http://localhost:8901/app/kasir.html#demo")
        t2.wait("document.querySelectorAll('.pos-item').length > 0")
        time.sleep(1.2)
        t2.shot("06-B-layar-jual-360x800.png")
        print("B-STATE", t2.js("""JSON.stringify({
          h1: document.querySelector('.pos-top h1').textContent.trim(),
          status: document.getElementById('status').textContent,
          chips: [...document.querySelectorAll('#quick-tabs .btn')].map(b=>({t:b.textContent.trim(),h:Math.round(b.getBoundingClientRect().height)})),
          chipActive: (()=>{const c=document.querySelector('#quick-tabs .on');const cs=getComputedStyle(c);return {bg:cs.color? getComputedStyle(c).backgroundColor:cs.backgroundColor,color:cs.color};})(),
          itemW: Math.round(document.querySelector('.pos-item').getBoundingClientRect().width),
          itemH: Math.round(document.querySelector('.pos-item').getBoundingClientRect().height),
          gridCols: getComputedStyle(document.getElementById('produk')).gridTemplateColumns,
          searchH: Math.round(document.getElementById('q').getBoundingClientRect().height),
          scanH: Math.round(document.querySelector('.pos-scan').getBoundingClientRect().height),
          badgeDiKartu: document.querySelectorAll('.pos-item [class*=badge]').length,
          catBtns: document.querySelectorAll('#quick-tabs .btn[data-cat]').length,
          headBtns: [...document.querySelectorAll('.pos-top .btn')].map(b=>({t:b.textContent.trim(),h:Math.round(b.getBoundingClientRect().height)}))
        })"""))

        # pencarian: set nilai + event input asli
        t2.js("""const q=document.getElementById('q'); q.value='kopi'; q.dispatchEvent(new Event('input',{bubbles:true}));""")
        time.sleep(0.3)
        print("B-SEARCH", t2.js("[...document.querySelectorAll('.pos-item .name')].map(n=>n.textContent).join(', ') || '(kosong)'"))
        t2.js("""const q=document.getElementById('q'); q.value=''; q.dispatchEvent(new Event('input',{bubbles:true}));""")

        # kategori chip filter
        t2.js("""document.querySelector('[data-cat="KEREK"]').click()""")
        time.sleep(0.3)
        print("B-CAT-KEREK", t2.js("[...document.querySelectorAll('.pos-item .name')].map(n=>n.textContent).join(', ')"))
        t2.js("""document.querySelector('[data-cat="SEMUA"]').click()""")

        # C: keranjang - tap bar di luar Bayar (real dulu)
        t2.tap(".pos-item", 0, expect="document.getElementById('bar-count').textContent==='1 item'", label="produk#1")
        t2.tap(".pos-item", 1, expect="document.getElementById('bar-count').textContent==='2 item'", label="produk#2")
        time.sleep(0.3)
        print("B-CART2", t2.js(bar_json()))
        t2.tap("#bar .small", expect="!!document.querySelector('.sheet.open')", label="bar(nBayar)")
        print("C-BAR-TAP", t2.js("""JSON.stringify({
          anySheetOpen: !!document.querySelector('.sheet.open'),
          cartRows: document.querySelectorAll('.cart-row').length,
          qtyStepper: document.querySelectorAll('.qty-ctrl button').length,
          jumlahSheet: document.querySelectorAll('.sheet').length
        })"""))
        t2.shot("07-C-tap-bar-tanpa-sheet-keranjang-360x800.png")
        print("C-STEPPER-ADA:", t2.js("document.querySelectorAll('.qty-ctrl').length"))

        # D-variant: uang kurang & uang pas (set nilai + event input asli)
        t2.tap("#pay", expect="document.getElementById('sheet').classList.contains('open')", label="Bayar")
        time.sleep(0.35)
        t2.js("""const c=document.getElementById('cash'); c.value='5000'; c.dispatchEvent(new Event('input',{bubbles:true}));""")
        time.sleep(0.3)
        print("D2-UANG-KURANG", t2.js("""JSON.stringify({
          total: document.getElementById('sheet-sum').textContent,
          kembaliShown: document.getElementById('kembali').style.display,
          sldState: document.getElementById('sld').className,
          sldDisabled: document.getElementById('sld').disabled,
          catatan: 'slide aktif walau uang kurang?'
        })"""))
        t2.shot("08-D-uang-kurang-slide-masih-aktif-360x800.png")
        t2.js("""const c=document.getElementById('cash'); c.value='40000'; c.dispatchEvent(new Event('input',{bubbles:true}));""")
        time.sleep(0.3)
        print("D2-UANG-PAS-40RB", t2.js("""JSON.stringify({
          kembaliShown: document.getElementById('kembali').style.display,
          sldAmt: document.getElementById('sld-amt').textContent
        })"""))

        # D-QRIS: ganti metode
        t2.js("""document.querySelector('#pay-methods button[data-m="QRIS"]').click()""")
        time.sleep(0.4)
        print("D2-QRIS", t2.js("""JSON.stringify({
          qrisVis: document.getElementById('qris-area').style.display,
          amt: document.getElementById('qris-amt').textContent,
          payloadLen: (document.getElementById('qris-box').dataset.payload||'').length,
          payloadHead: (document.getElementById('qris-box').dataset.payload||'').slice(0,40),
          wakelock: 'wakeLock' in navigator
        })"""))
        t2.shot("09-D-qris-dalam-sheet-360x800.png")

        # QRIS layar penuh dari tombol header
        t2.js("""document.querySelector('[data-qr]').click()""")
        time.sleep(0.5)
        t2.shot("10-D2-qris-layar-penuh-360x800.png")
        print("QRIS-FULL", t2.js("""JSON.stringify({
          paidTxt: document.getElementById('qris-paid').textContent,
          paidH: Math.round(document.getElementById('qris-paid').getBoundingClientRect().height),
          tutupTxt: document.querySelector('#sheet-qris [data-close]').textContent
        })"""))

        # G/H/I: keberadaan layar lain
        print("GHI-EXISTENCE", t2.js("""JSON.stringify({
          formProduk: !!document.querySelector('form'),
          tambahProduk: /tambah produk/i.test(document.body.innerText),
          rekapLaporan: /rekap|harian|omzet|laba|laporan/i.test(document.body.innerText),
          pengaturanCadangkan: /pengaturan|cadangkan|backup/i.test(document.body.innerText),
          navHeader: [...document.querySelectorAll('.pos-top a')].map(a=>a.getAttribute('href')),
          stokLowClass: (()=>{const b=[...document.querySelectorAll('.pos-item')].find(x=>x.classList.contains('low')); return b? b.className : null;})()
        })"""))

        # aksesibilitas cepat
        print("A11Y", t2.js("""JSON.stringify({
          skipLink: !!document.querySelector('.skip'),
          ariaLiveGrid: document.getElementById('produk').getAttribute('aria-live'),
          toastLive: document.getElementById('toast').getAttribute('aria-live'),
          sheetFocus: (()=>{document.querySelector('[data-qr]').click(); return document.activeElement.tagName + '.' + document.activeElement.className;})(),
          fokusTrap: 'tidak ada trap fokus eksplisit di kode sheet',
          htmlLang: document.documentElement.lang,
          viewport: document.querySelector('meta[name=viewport]').content,
          userScalable: /user-scalable=no|maximum-scale/.test(document.querySelector('meta[name=viewport]').content)
        })"""))
        t2.js("""document.querySelector('#sheet-qris [data-close]').click()""")

        # ================= FASE 3 (tab segar 390x844) =================
        t3 = Tab("http://localhost:8901/app/kasir.html#demo", w=390, h=844)
        t3.wait("document.querySelectorAll('.pos-item').length > 0")
        time.sleep(1.2)
        t3.shot("11-B-layar-jual-390x844.png")
        t3.tap(".pos-item", 0, expect="document.getElementById('bar-count').textContent==='1 item'", label="produk#1@390")
        t3.tap("#pay", expect="document.getElementById('sheet').classList.contains('open')", label="Bayar@390")
        time.sleep(0.35)
        t3.shot("12-D-pembayaran-tunai-390x844.png")
        t3.drag("#sld .sld-knob", 330)
        time.sleep(0.8)
        t3.shot("13-E-sukses-390x844.png")
        print("T3-OK", t3.js("document.getElementById('sheet-ok').classList.contains('open')"))

        # performa
        print("PERF", t3.js("""JSON.stringify({
          dcl: Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd),
          load: Math.round(performance.getEntriesByType('navigation')[0].loadEventEnd),
          res: performance.getEntriesByType('resource').map(r=>({n:r.name.split('/').pop(),ms:Math.round(r.duration),kb:Math.round(r.transferSize/1024)}))
        })"""))

        proc.terminate()
    finally:
        try:
            proc.terminate()
        except Exception:
            pass

if __name__ == "__main__":
    main()
