#!/usr/bin/env python3
"""Test item 1: import cadangan di layar I (kasir.html#demo)."""
import json, time, sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8921"
OUT = "/root/olano/audit/uiux/pos-after2"
results = {}
errors = []
def check(name, cond, extra=""):
    results[name] = ("LULUS" if cond else "GAGAL") + ((" · " + str(extra)) if extra else "")
    if not cond: errors.append(name)

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path="/usr/bin/google-chrome",
                                 args=["--headless=new", "--no-sandbox"])
    ctx = browser.new_context(viewport={"width": 360, "height": 800}, device_scale_factor=2)
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append("pageerror: " + str(e)[:200]))
    page.goto(f"{BASE}/app/kasir.html#demo", wait_until="networkidle")
    page.wait_for_selector(".pos-item")

    # buat 2 transaksi supaya ada data di IDB
    for i in range(2):
        page.locator(".pos-item").first.click()
        page.wait_for_timeout(150)
    page.locator("#pay").click()
    page.wait_for_timeout(200)
    page.locator(".cash-chip.pas").click()
    page.locator("#sld").focus(); page.keyboard.press("Enter")
    page.wait_for_selector("#sheet-ok.open")
    page.locator("#sheet-ok button[data-close]").click()
    page.wait_for_timeout(300)
    n_idb = page.evaluate("""() => new Promise(res => {
      const r = indexedDB.open('olano-pos',1);
      r.onsuccess = () => { const db=r.result; const tx=db.transaction('sales','readonly');
        const q=tx.objectStore('sales').count(); q.onsuccess=()=>res(q.result); };
      r.onerror = () => res(-1);
    })""")
    check("idb_sebelum", n_idb >= 1, f"sales={n_idb}")

    # buka sheet data
    page.locator("#menu-btn").click()
    page.locator("#menu-data").click()
    page.wait_for_selector("#sheet-data.open", timeout=3000)
    page.screenshot(path=f"{OUT}/after-I-import-sheet-360x800.png")
    check("sheet_data_open", page.locator("#sheet-data.open").count() == 1)
    check("restore_btn_ada", page.locator("#restore-btn").count() == 1)
    check("file_input_hidden", page.locator("#restore-file[type=file]").count() == 1)

    # validasi: file bukan JSON
    bad = f"{OUT}/tmp-bad.json"
    open(bad, "w").write("ini bukan json{{{")
    page.set_input_files("#restore-file", bad)
    page.wait_for_timeout(400)
    msg = page.locator("#restore-msg").inner_text()
    check("galat_bukan_json", "bukan JSON valid" in msg, msg)

    # validasi: format tidak dikenali
    bad2 = f"{OUT}/tmp-wrong.json"
    open(bad2, "w").write(json.dumps({"app": "lain", "sales": []}))
    page.set_input_files("#restore-file", bad2)
    page.wait_for_timeout(400)
    msg = page.locator("#restore-msg").inner_text()
    check("galat_format", "tidak dikenali" in msg, msg)

    # sukses: buat cadangan via tombol Cadangkan (unduh), lalu impor kembali
    # (headless: tangkap event download untuk ambil isi file cadangan)
    with page.expect_download() as dl:
        page.locator("#backup-btn").click()
    dpath = f"{OUT}/tmp-backup.json"
    dl.value.save_as(dpath)
    page.wait_for_timeout(400)
    check("backup_ts", "Terakhir dicadangkan" in page.locator("#backup-last").inner_text())

    # hapus semua sales di IDB dulu, lalu impor -> harus terpulihkan
    page.evaluate("""() => new Promise(res => {
      const r = indexedDB.open('olano-pos',1);
      r.onsuccess = () => { const db=r.result; const tx=db.transaction('sales','readwrite');
        tx.objectStore('sales').clear(); tx.oncomplete=()=>res(1); };
    })""")
    n0 = page.evaluate("""() => new Promise(res => {
      const r = indexedDB.open('olano-pos',1);
      r.onsuccess = () => { const db=r.result; const tx=db.transaction('sales','readonly');
        const q=tx.objectStore('sales').count(); q.onsuccess=()=>res(q.result); };
    })""")
    check("idb_dikosongkan", n0 == 0, f"sales={n0}")

    # dialog konfirmasi: batal dulu (aksi merusak perlu konfirmasi) — lewat alur nyata: klik tombol -> file chooser
    page.once("dialog", lambda d: d.dismiss())
    with page.expect_file_chooser() as fc_info:
        page.locator("#restore-btn").click()
    fc_info.value.set_files(dpath)
    page.wait_for_timeout(400)
    msg = page.locator("#restore-msg").inner_text()
    check("batal_konfirmasi", "dibatalkan" in msg, msg)

    # terima konfirmasi -> restore
    def accept(d):
        results["konfirmasi_teks"] = d.message[:80].replace("\n", " ")
        d.accept()
    page.once("dialog", accept)
    with page.expect_file_chooser() as fc_info:
        page.locator("#restore-btn").click()
    fc_info.value.set_files(dpath)
    page.wait_for_timeout(600)
    msg = page.locator("#restore-msg").inner_text()
    check("sukses_restore", "dipulihkan" in msg and "Berhasil" in msg, msg)
    n1 = page.evaluate("""() => new Promise(res => {
      const r = indexedDB.open('olano-pos',1);
      r.onsuccess = () => { const db=r.result; const tx=db.transaction('sales','readonly');
        const q=tx.objectStore('sales').count(); q.onsuccess=()=>res(q.result); };
    })""")
    check("idb_setelah_restore", n1 == n_idb, f"sales={n1} (sebelum {n_idb})")
    page.screenshot(path=f"{OUT}/after-I-import-sukses-360x800.png")

    browser.close()

print(json.dumps(results, ensure_ascii=False, indent=1))
errs = [e for e in errors if not e.startswith("pageerror: AbortError")]
pe = [e for e in errors if e.startswith("pageerror")]
print("PAGEERRORS:", pe if pe else "none")
sys.exit(1 if (errs or pe or any(v.startswith("GAGAL") for v in results.values())) else 0)
