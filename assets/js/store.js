/* ============================================================================
   Olano: store.js
   Satu sumber kebenaran untuk katalog, pengaturan, dan pembacaan penjualan.
   Dipakai oleh: app/kasir.html, app/dashboard.html, app/produk.html,
   app/transaksi.html, app/pajak.html, app/pengaturan.html.
   ----------------------------------------------------------------------------
   Kenapa ada: katalog dulu hardcode di kasir.html (PRODUCTS p1..p32), jadi
   dashboard tidak punya apa pun untuk dibaca. Sekarang kasir memuat katalog
   dari sini dan menyimpannya balik setiap render; halaman lain membaca katalog
   yang sama. Penjualan tetap di IndexedDB "olano-pos"/"sales", DB yang sudah
   dibuat kasir, supaya tidak ada dua tempat menyimpan transaksi.
   Tanpa dependency, ES5, aman untuk file:// (localStorage bisa gagal -> memori).
   ========================================================================== */
(function () {
  "use strict";

  var P_KEY = "olano-catalog";
  var S_KEY = "olano-settings";
  var FALLBACK_SALES = "olano-sales-fallback";   /* IDB diblokir -> tetap ada rekap */
  var DB_NAME = "olano-pos";

  function mem() {
    var m = {};
    return {
      getItem: function (k) { return k in m ? m[k] : null; },
      setItem: function (k, v) { m[k] = String(v); },
      removeItem: function (k) { delete m[k]; }
    };
  }
  var LS = (function () {
    try {
      localStorage.setItem("olano-t", "1");
      localStorage.removeItem("olano-t");
      return localStorage;
    } catch (e) { return mem(); }
  })();

  function jget(k, d) {
    try { var v = LS.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; }
  }
  function jset(k, v) {
    try { LS.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; }
  }

  /* Katalog awal = 32 item demo Kopi Senja yang dulu hardcode di kasir.
     Dipakai hanya saat belum ada katalog tersimpan. */
  var SEED = [
    {id:"p1",  name:"Es Kopi Susu",      cat:"MINUM",   price:22000, stock:4},
    {id:"p2",  name:"Kopi Hitam",        cat:"MINUM",   price:18000, stock:40},
    {id:"p3",  name:"Matcha Latte",      cat:"MINUM",   price:32000, stock:3},
    {id:"p4",  name:"Cokelat Panas",     cat:"MINUM",   price:25000, stock:12},
    {id:"p5",  name:"Es Cokelat",        cat:"MINUM",   price:24000, stock:8},
    {id:"p6",  name:"Americano",         cat:"MINUM",   price:28000, stock:15},
    {id:"p7",  name:"Cappuccino",        cat:"MINUM",   price:30000, stock:0},
    {id:"p8",  name:"Oat Latte",         cat:"MINUM",   price:33000, stock:6},
    {id:"p9",  name:"Es Teh Lemon",      cat:"MINUM",   price:15000, stock:25},
    {id:"p10", name:"Es Jeruk",          cat:"MINUM",   price:16000, stock:10},
    {id:"p11", name:"Air Mineral",       cat:"MINUM",   price:5000,  stock:48},
    {id:"p12", name:"Lemon Tea",         cat:"MINUM",   price:14000, stock:0},
    {id:"p13", name:"Croissant",         cat:"MAKANAN", price:18000, stock:12},
    {id:"p14", name:"Donat Cokelat",     cat:"MAKANAN", price:15000, stock:2},
    {id:"p15", name:"Roti Cokelat",      cat:"MAKANAN", price:12000, stock:8},
    {id:"p16", name:"Pancake",           cat:"MAKANAN", price:25000, stock:5},
    {id:"p17", name:"Sandwich",          cat:"MAKANAN", price:22000, stock:7},
    {id:"p18", name:"Muffin",            cat:"MAKANAN", price:18000, stock:0},
    {id:"p19", name:"Puff Isi",          cat:"MAKANAN", price:10000, stock:14},
    {id:"p20", name:"Brownies",          cat:"MAKANAN", price:15000, stock:3},
    {id:"p21", name:"Tart Apel",         cat:"MAKANAN", price:20000, stock:6},
    {id:"p22", name:"Keripik Kentang",   cat:"KEREK",   price:8000,  stock:25},
    {id:"p23", name:"Keripik Singkong",  cat:"KEREK",   price:6000,  stock:1},
    {id:"p24", name:"Kentang Goreng",    cat:"KEREK",   price:15000, stock:9},
    {id:"p25", name:"Nugget",            cat:"KEREK",   price:18000, stock:4},
    {id:"p26", name:"Kentang Sambal",    cat:"KEREK",   price:12000, stock:7},
    {id:"p27", name:"Kacang Panggang",   cat:"KEREK",   price:10000, stock:11},
    {id:"p28", name:"Gelas + Sedotan",   cat:"LAIN",    price:2000,  stock:99},
    {id:"p29", name:"Kapsul Kopi",       cat:"LAIN",    price:12000, stock:20},
    {id:"p30", name:"Botol Reusable",    cat:"LAIN",    price:45000, stock:3},
    {id:"p31", name:"Stiker Olano",      cat:"LAIN",    price:5000,  stock:30},
    {id:"p32", name:"Tas Kanvas",        cat:"LAIN",    price:55000, stock:2}
  ];

  var DEFAULTS = {
    store: "Kopi Senja",
    outlet: "Outlet utama",
    pphRate: 0.5,          /* persen, PPh final UMKM */
    pphThreshold: 500000000,
    pphCeiling: 4800000000,
    currency: "IDR",
    updatedAt: 0
  };

  function products() {
    var list = jget(P_KEY, null);
    if (!list || !list.length) {
      list = SEED.map(function (p) { return Object.assign({}, p); });
      jset(P_KEY, list);
    }
    return list;
  }
  function saveProducts(list) {
    jset(P_KEY, list.map(function (p) {
      return { id: p.id, name: p.name, cat: p.cat, price: p.price, stock: p.stock };
    }));
    return list;
  }
  function addProduct(p) {
    var list = products();
    var item = {
      id: "u" + Date.now(),
      name: String(p.name || "Produk baru"),
      cat: p.cat || "LAIN",
      price: Math.max(0, Number(p.price) || 0),
      stock: Math.max(0, Number(p.stock) || 0)
    };
    list.push(item);
    jset(P_KEY, list);
    return item;
  }
  function updateProduct(id, patch) {
    var list = products();
    var i = list.findIndex(function (p) { return p.id === id; });
    if (i < 0) return null;
    list[i] = Object.assign({}, list[i], patch);
    jset(P_KEY, list);
    return list[i];
  }
  function removeProduct(id) {
    var list = products().filter(function (p) { return p.id !== id; });
    jset(P_KEY, list);
    return list;
  }

  function settings() { return Object.assign({}, DEFAULTS, jget(S_KEY, {})); }
  function saveSettings(patch) {
    var s = Object.assign(settings(), patch, { updatedAt: Date.now() });
    jset(S_KEY, s);
    return s;
  }

  /* ---------- penjualan ---------- */
  var dbp = null;

  /* Watchdog: `indexedDB.open` bisa TIDAK memanggil callback sama sekali
     (koneksi lain menahan versi, atau storage diblokir profil browser).
     Tanpa batas waktu, dashboard berputar di "Membaca transaksi…" selamanya.
     Kalau 1800ms lewat, anggap IDB tak tersedia dan pakai cadangan localStorage. */
  function openDB() {
    if (dbp) return dbp;
    if (typeof indexedDB === "undefined") { dbp = Promise.resolve(null); return dbp; }
    dbp = new Promise(function (res) {
      var done = false;
      function finish(db) { if (done) return; done = true; res(db); }
      var watchdog = setTimeout(function () { finish(null); }, 1800);
      var r;
      try { r = indexedDB.open(DB_NAME, 1); }
      catch (e) { clearTimeout(watchdog); return finish(null); }
      r.onupgradeneeded = function (e) {
        var d = e.target.result;
        if (!d.objectStoreNames.contains("sales")) d.createObjectStore("sales", { keyPath: "uuid" });
        if (!d.objectStoreNames.contains("outbox")) d.createObjectStore("outbox", { keyPath: "seq", autoIncrement: true });
      };
      r.onsuccess = function () { clearTimeout(watchdog); finish(r.result); };
      r.onerror = function () { clearTimeout(watchdog); finish(null); };
      r.onblocked = function () { clearTimeout(watchdog); finish(null); };
    });
    return dbp;
  }

  function sales() {
    return openDB().then(function (db) {
      if (!db) return jget(FALLBACK_SALES, []);
      return new Promise(function (res) {
        var tx, rq;
        try { tx = db.transaction("sales", "readonly"); } catch (e) { return res(jget(FALLBACK_SALES, [])); }
        rq = tx.objectStore("sales").getAll();
        rq.onsuccess = function () {
          var list = rq.result || [];
          var fb = jget(FALLBACK_SALES, []);
          /* gabung cadangan yang mungkin ditulis saat IDB gagal, tanpa duplikat */
          var seen = {};
          list.forEach(function (s) { seen[s.uuid] = 1; });
          fb.forEach(function (s) { if (!seen[s.uuid]) list.push(s); });
          res(list);
        };
        rq.onerror = function () { res(jget(FALLBACK_SALES, [])); };
      });
    });
  }

  /* kasir tidak bisa menulis IDB (mode privat/quota) -> simpan di localStorage */
  function addFallbackSale(sale) {
    var list = jget(FALLBACK_SALES, []);
    if (list.some(function (s) { return s.uuid === sale.uuid; })) return;
    list.push(sale);
    jset(FALLBACK_SALES, list);
  }

  /* Tutup koneksi yang dipegang modul ini.
     Penting sebelum `deleteDatabase`: IDB menolak menghapus selama ada koneksi
     terbuka, dan penolakan itu (blocked) membuat `open` berikutnya menggantung
     tanpa callback. Itu yang membuat "Hapus semua data" tampak berhasil tapi
     dashboard tetap kosong selamanya. */
  function closeDB() {
    if (!dbp) return Promise.resolve();
    return dbp.then(function (db) {
      try { if (db && db.close) db.close(); } catch (e) { /* sudah tertutup */ }
      dbp = null;
    });
  }

  /* Hapus seluruh penyimpanan Olano: katalog, pengaturan, cadangan, dan DB.
     Mengembalikan hasil yang jujur: "ok", "blocked" (ada tab lain memegang DB),
     atau "unsupported". */
  function resetAll() {
    jset(P_KEY, []);
    try { LS.removeItem(FALLBACK_SALES); } catch (e) { /* privat */ }
    jset(S_KEY, {});
    if (typeof indexedDB === "undefined") return Promise.resolve("unsupported");
    return closeDB().then(function () {
      return new Promise(function (res) {
        var settled = false;
        var req;
        try { req = indexedDB.deleteDatabase(DB_NAME); }
        catch (e) { return res("unsupported"); }
        var wd = setTimeout(function () { if (!settled) { settled = true; res("blocked"); } }, 2500);
        req.onsuccess = function () { if (!settled) { settled = true; clearTimeout(wd); res("ok"); } };
        req.onerror = function () { if (!settled) { settled = true; clearTimeout(wd); res("error"); } };
        req.onblocked = function () { if (!settled) { settled = true; clearTimeout(wd); res("blocked"); } };
      });
    });
  }

  /* ---------- agregasi ---------- */
  function startOfDay(ts) { var d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }

  function inRange(list, from, to) {
    return list.filter(function (s) { return s.ts >= from && s.ts < to; });
  }
  function sum(list) {
    return list.reduce(function (a, s) { return a + (Number(s.total) || 0); }, 0);
  }
  function itemCount(list) {
    return list.reduce(function (a, s) {
      return a + (s.items || []).reduce(function (b, i) { return b + (Number(i.qty) || 0); }, 0);
    }, 0);
  }
  /* 7 hari terakhir, hari ini di ujung kanan */
  function daySeries(list, days) {
    days = days || 7;
    var today = startOfDay(Date.now());
    var out = [];
    for (var i = days - 1; i >= 0; i--) {
      var from = today - i * 86400000, to = from + 86400000;
      var rows = inRange(list, from, to);
      out.push({ from: from, to: to, total: sum(rows), count: rows.length });
    }
    return out;
  }
  function topProducts(list, limit) {
    var agg = {};
    list.forEach(function (s) {
      (s.items || []).forEach(function (i) {
        var k = i.name || i.id;
        if (!agg[k]) agg[k] = { name: k, qty: 0, revenue: 0 };
        agg[k].qty += Number(i.qty) || 0;
        agg[k].revenue += (Number(i.qty) || 0) * (Number(i.price) || 0);
      });
    });
    return Object.keys(agg).map(function (k) { return agg[k]; })
      .sort(function (a, b) { return b.qty - a.qty; })
      .slice(0, limit || 5);
  }
  function lowStock(list, threshold) {
    threshold = threshold == null ? 3 : threshold;
    return (list || products()).filter(function (p) { return p.stock <= threshold; })
      .sort(function (a, b) { return a.stock - b.stock; });
  }

  function exportAll() {
    return sales().then(function (list) {
      return {
        v: 1, at: Date.now(),
        settings: settings(),
        products: products(),
        sales: list
      };
    });
  }
  function importAll(obj) {
    if (!obj || !obj.v) throw new Error("Berkas bukan cadangan Olano.");
    if (Array.isArray(obj.products)) jset(P_KEY, obj.products);
    if (obj.settings) jset(S_KEY, obj.settings);
    if (Array.isArray(obj.sales)) jset(FALLBACK_SALES, obj.sales);
    return true;
  }

  window.OlanoStore = {
    products: products, saveProducts: saveProducts, addProduct: addProduct,
    updateProduct: updateProduct, removeProduct: removeProduct,
    settings: settings, saveSettings: saveSettings,
    sales: sales, addFallbackSale: addFallbackSale,
    sum: sum, itemCount: itemCount, daySeries: daySeries,
    topProducts: topProducts, lowStock: lowStock,
    startOfDay: startOfDay,
    exportAll: exportAll, importAll: importAll,
    openDB: openDB, closeDB: closeDB, resetAll: resetAll
  };
})();
