/* Olano service worker: offline-first (PRD F2: POS 100% offline setelah login pertama) */
var CACHE = "olano-v5";
var CORE = [
  "./", "index.html", "manifest.json",
  "assets/css/main.css", "assets/js/config.js", "assets/js/shared.js",
  "app/kasir.html",
  "umkm.html", "pajak.html", "website.html", "naik-kelas.html",
  "alat/kalkulator-pph-final-umkm.html",
  "alat/kalkulator-hpp-harga-jual.html",
  "alat/kalkulator-biaya-qris.html",
  "alat/kalkulator-margin-delivery.html"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(CORE.map(function (u) {
      return c.add(u).catch(function () {}); // jangan gagal total kalau satu asset 404
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// Strategy: runtime cache-first untuk asset statis, network-first untuk HTML (agar update tetap masuk)
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === "navigate" || /text\/html/.test(req.headers.get("accept") || "")) {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
        return res;
      }).catch(function () {
        return caches.match(req).then(function (m) { return m || caches.match("./app/kasir.html"); });
      })
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
        }
        return res;
      });
    })
  );
});
