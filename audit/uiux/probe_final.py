"""Probe verifikasi akhir: chip kategori, oversell stok, SW, metode Transfer."""
import json, subprocess, time, urllib.request, urllib.parse, websocket, os, sys
sys.path.insert(0, "/root/olano/audit/uiux")
from cdp_pos import launch, Tab

proc = launch()
try:
    t = Tab("http://localhost:8901/app/kasir.html#demo")
    t.wait("document.querySelectorAll('.pos-item').length > 0")
    time.sleep(1.0)

    # 1) chip kategori: klik KEREK via JS click (handler resmi), cek hasil render
    t.js("document.querySelector('[data-cat=\"KEREK\"]').click()")
    time.sleep(0.3)
    print("PROBE-CHIP-KEREK:", t.js("""JSON.stringify({
      names: [...document.querySelectorAll('.pos-item .name')].map(n=>n.textContent),
      chipOn: document.querySelector('#quick-tabs .on').textContent
    })"""))

    # 2) oversell: Keripik Singkong stok 1 (index 6) -> tap 3x
    for i in range(3):
        t.js("[...document.querySelectorAll('.pos-item')][6].click()")
        time.sleep(0.15)
    print("PROBE-OVERSELL:", t.js("""JSON.stringify({
      stokLabel: [...document.querySelectorAll('.pos-item .stock')][6].textContent,
      barCount: document.getElementById('bar-count').textContent,
      barSum: document.getElementById('bar-sum').textContent,
      masihBisaDitekan: ![...document.querySelectorAll('.pos-item')][6].disabled
    })"""))

    # 3) SW terdaftar?
    print("PROBE-SW:", t.js("""JSON.stringify({
      swReady: 'serviceWorker' in navigator,
      registrasi: navigator.serviceWorker.controller ? 'ADA controller' : 'TIDAK ADA controller',
      tagShared: [...document.querySelectorAll('script[src]')].map(s=>s.getAttribute('src'))
    })"""))

    # 4) metode TRANSFER: apa yang tampak?
    t.js("document.getElementById('pay').click()")
    time.sleep(0.3)
    t.js("document.querySelector('#pay-methods button[data-m=\"TRANSFER\"]').click()")
    time.sleep(0.3)
    print("PROBE-TRANSFER:", t.js("""JSON.stringify({
      cashArea: document.getElementById('cash-area').style.display,
      qrisArea: document.getElementById('qris-area').style.display,
      teksPanel: document.querySelector('#sheet .panel').innerText.replace(/\\n+/g,' | ').slice(0,220)
    })"""))
    t.shot("14-D-metode-transfer-keadaan-kosong-360x800.png")

    # 5) posisi tombol Bayar vs 40% bilah
    print("PROBE-BAYAR-WIDTH:", t.js("""JSON.stringify((()=>{const b=document.getElementById('pay').getBoundingClientRect();const bar=document.getElementById('bar').getBoundingClientRect();return {payW:Math.round(b.width),barW:Math.round(bar.width),persen:Math.round(100*b.width/bar.width)};})())"""))
finally:
    proc.terminate()
