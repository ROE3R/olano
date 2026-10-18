#!/usr/bin/env python3
"""Smoke gate FINAL (merged pos+landing+sw-v30) — port 8923.
C3 fold (CTA bottom<560) · L35 scrollHeight<=9 layar @360x800 · JS errors=0 ·
prefetch 2 link · POS: skeleton render, swipe-hapus+Undo, impor cadangan,
rekap render, QRIS payload EMVCo valid (CRC16) via dynamic import."""
import base64, json, subprocess, time, urllib.request, urllib.parse, websocket

CHROME = "/usr/bin/google-chrome"
PORT = 9442
BASE = "http://localhost:8923"
OUT = "/root/olano/audit/uiux/gate-final-smoke.json"

def launch():
    p = subprocess.Popen([CHROME, "--headless=new", "--no-sandbox", "--disable-gpu",
                          "--remote-debugging-port=%d" % PORT, "--remote-allow-origins=*",
                          "--user-data-dir=/tmp/chrome-gate-final", "--window-size=360,800",
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
        time.sleep(1.0)

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
        r = self.send("Runtime.evaluate", expression=expr, returnByValue=True, awaitPromise=False)
        return r.get("result", {}).get("value")

    def wait_js(self, expr, timeout=6):
        t0 = time.time()
        while time.time() - t0 < timeout:
            try:
                if self.js(expr):
                    return True
            except Exception:
                pass
            time.sleep(0.2)
        return False

def crc16ccitt(s):
    crc = 0xFFFF
    for ch in s:
        crc ^= ord(ch) << 8
        for _ in range(8):
            crc = ((crc << 1) ^ 0x1021) if (crc & 0x8000) else (crc << 1)
            crc &= 0xFFFF
    return crc

def main():
    res = {"checks": {}, "errors": {"index": [], "kasir": []}}
    ck = res["checks"]
    proc = launch()
    try:
        # ---------- index.html ----------
        ix = Tab(BASE + "/index.html?no-sw=1", 360, 800)
        time.sleep(2.0)
        rect = ix.js("(() => { var a = document.querySelector(\".hero .cta-row a[href*='kasir.html']\");"
                     " if(!a) return null; var r = a.getBoundingClientRect();"
                     " return {top: Math.round(r.top), bottom: Math.round(r.bottom)}; })()")
        ck["C3_fold"] = {"rect": rect, "pass": bool(rect and rect["bottom"] < 560)}
        sh = ix.js("Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)")
        ck["L35_scrollHeight"] = {"px": sh, "layar": round(sh / 800.0, 2), "pass": sh <= 7200}
        pf = ix.js("Array.from(document.querySelectorAll(\"link[rel~='prefetch']\")).map(function(l){return l.getAttribute('href')})") or []
        ck["prefetch_links"] = {"hrefs": pf, "pass": len(pf) >= 2 and any("kasir" in u for u in pf) and any("config" in u for u in pf)}
        res["errors"]["index"] = ix.errors
        # ---------- app/kasir.html ----------
        ka = Tab(BASE + "/app/kasir.html?no-sw=1#demo", 360, 800)
        seen_busy = ka.wait_js("!document.getElementById('produk').hasAttribute('aria-busy')", 6)
        n_items = ka.js("document.querySelectorAll('#produk .pos-item').length")
        n_skel_static = ka.js("document.querySelectorAll('#produk .pos-skel-card').length")
        ck["skeleton_render"] = {"aria_busy_cleared": seen_busy, "pos_items": n_items,
                                 "skel_cards_static": n_skel_static,
                                 "pass": bool(seen_busy and n_items == 8)}
        # tambah 2 produk -> buka keranjang
        ka.js("document.querySelector('.pos-item[data-id=p1]').click()")
        ka.js("document.querySelector('.pos-item[data-id=p2]').click()")
        time.sleep(0.4)
        ka.js("document.getElementById('bar-info').click()")
        time.sleep(0.4)
        rows_before = ka.js("document.querySelectorAll('#cart-rows .cart-row').length")
        total_before = ka.js("document.getElementById('cart-total').textContent")
        # swipe-kiri baris pertama (>=40% lebar)
        swp = ka.js("""
(() => {
  var row = document.querySelector('#cart-rows .cart-row');
  if(!row) return {ok:false};
  var r = row.getBoundingClientRect();
  var y = Math.round(r.top + r.height/2), x0 = 340, x1 = 60;
  var opt = {bubbles:true, cancelable:true, pointerId:1, isPrimary:true, pointerType:'touch', clientX:x0, clientY:y};
  row.dispatchEvent(new PointerEvent('pointerdown', opt));
  var m1 = Object.assign({}, opt, {clientX:x0-40}); row.dispatchEvent(new PointerEvent('pointermove', m1));
  var m2 = Object.assign({}, opt, {clientX:x1});   row.dispatchEvent(new PointerEvent('pointermove', m2));
  row.dispatchEvent(new PointerEvent('pointerup', Object.assign({}, opt, {clientX:x1})));
  return {ok:true, w: Math.round(r.width), dx: x1-x0};
})()""")
        time.sleep(0.6)
        rows_after = ka.js("document.querySelectorAll('#cart-rows .cart-row').length")
        toast_undo_shown = ka.js("!document.getElementById('toast-undo').hidden")
        toast_msg = ka.js("document.getElementById('toast-msg').textContent")
        ck["swipe_delete"] = {"before": rows_before, "after": rows_after, "swipe": swp,
                              "undo_visible": toast_undo_shown, "toast_msg": toast_msg,
                              "pass": bool(rows_before == 2 and rows_after == 1 and toast_undo_shown)}
        ka.js("document.getElementById('toast-undo').click()")
        time.sleep(0.3)
        rows_restored = ka.js("document.querySelectorAll('#cart-rows .cart-row').length")
        total_restored = ka.js("document.getElementById('cart-total').textContent")
        ck["swipe_undo"] = {"rows": rows_restored, "total": total_restored,
                            "pass": bool(rows_restored == 2 and total_restored == total_before)}
        ka.js("document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape', bubbles:true}))")
        time.sleep(0.3)
        # impor cadangan JSON (validasi + restore)
        sale = {"uuid": "TESTSMOKE01", "items": [{"id": "p1", "name": "Es Kopi Susu", "qty": 1, "price": 22000}],
                "total": 22000, "method": "TUNAI", "ts": int(time.time() * 1000), "synced": False}
        imp = ka.js("(() => { window.confirm = function(){ return true; };"
                    " var data = " + json.dumps({"app": "olano-pos", "at": "2026-10-18T02:00:00Z", "sales": [sale]}) + ";"
                    " var dt = new DataTransfer();"
                    " dt.items.add(new File([JSON.stringify(data)], 'cadangan.json', {type:'application/json'}));"
                    " var fi = document.getElementById('restore-file'); fi.files = dt.files;"
                    " fi.dispatchEvent(new Event('change', {bubbles:true})); return true; })()")
        time.sleep(0.8)
        rmsg = ka.js("(() => { var m = document.getElementById('restore-msg');"
                     " return {text: m.textContent, shown: m.style.display !== 'none', color: m.style.color}; })()")
        ck["import_backup"] = {"dispatched": imp, "msg": rmsg,
                               "pass": bool(rmsg and "Berhasil" in rmsg["text"] and rmsg["shown"])}
        # rekap (skeleton -> terisi)
        ka.js("document.getElementById('menu-btn').click()")
        time.sleep(0.2)
        ka.js("document.getElementById('menu-rekap').click()")
        time.sleep(1.0)
        rekap = ka.js("(() => { var s = document.getElementById('sheet-rekap');"
                      " return {open: s.classList.contains('open'),"
                      "  rk: document.querySelectorAll('#rekap-stats .rk').length,"
                      "  rows: document.querySelectorAll('#rekap-list > *').length}; })()")
        ck["rekap_render"] = {"state": rekap, "pass": bool(rekap and rekap["open"] and rekap["rk"] >= 1)}
        ka.js("document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape', bubbles:true}))")
        time.sleep(0.2)
        # QRIS via dynamic import
        ka.js("document.querySelector('[data-qr]').click()")
        qrcode_loaded = ka.wait_js("typeof QRCode !== 'undefined'", 6)
        time.sleep(0.6)
        qris = ka.js("(() => { var b = document.getElementById('qris-box'), f = document.getElementById('qris-full-box');"
                     " return {payload: b.dataset.payload || '', box_children: b.children.length,"
                     "  full_children: f.children.length, sheet_open: document.getElementById('sheet-qris').classList.contains('open')}; })()")
        payload = qris["payload"] if qris else ""
        ok_crc = False
        amt = None
        if payload.startswith("000201") and len(payload) >= 60:
            base = payload[:-4]
            ok_crc = payload[-4:].upper() == ("%04X" % crc16ccitt(base))
            k = payload.find("5109")
            if k >= 0:
                amt = int(payload[k + 4:k + 13])
        ck["qris_dynamic"] = {"qrcode_loaded": qrcode_loaded, "payload_len": len(payload),
                              "payload_head": payload[:20], "crc_valid": ok_crc, "amt_tlv51": amt,
                              "box_children": qris.get("box_children") if qris else 0,
                              "full_children": qris.get("full_children") if qris else 0,
                              "sheet_open": qris.get("sheet_open") if qris else False,
                              "pass": bool(qrcode_loaded and ok_crc and amt == 40000
                                           and qris.get("box_children", 0) > 0 and qris.get("full_children", 0) > 0)}
        res["errors"]["kasir"] = ka.errors
        for t in (ix, ka):
            try:
                t.ws.close()
            except Exception:
                pass
    finally:
        proc.terminate()
    res["all_pass"] = all(v.get("pass") for v in res["checks"].values()) and not res["errors"]["index"] and not res["errors"]["kasir"]
    with open(OUT, "w") as f:
        json.dump(res, f, indent=1, ensure_ascii=False)
    for k, v in res["checks"].items():
        print(("PASS " if v.get("pass") else "FAIL ") + k + " :: " + json.dumps(v, ensure_ascii=False)[:220])
    print("JS errors index:", len(res["errors"]["index"]), "| kasir:", len(res["errors"]["kasir"]))
    for e in (res["errors"]["index"] + res["errors"]["kasir"])[:5]:
        print("  ERR:", e)
    print("ALL_PASS" if res["all_pass"] else "SMOKE_FAIL")

if __name__ == "__main__":
    main()
