/* Olano service worker: offline-first (PRD F2: POS 100% offline setelah login pertama) */
var CACHE = "olano-v50"; /* v50: homepage v50 (dashboard-first, screenshots asli). v45: SaaS shell (dashboard, produk, transaksi, pajak, pengaturan) + store.js. v42: bencho PRO ports (rolling counter qty, label-input, magnet-select, slide-confirm end-only). v41: home(v3) ui polish — scroll native (spring/magnetic/parallax mati), deck layanan statis (9 kartu + filter), hero kasir demote 860px. Sebelumnya v40: posfix owner-bugs */
var CORE = [
  "./", "index.html", "manifest.json", "robots.txt", "sitemap.xml", "llms.txt", "404.html",
  "assets/css/main.css", "assets/css/bencho.css", "assets/css/interactions.css", "assets/css/app.css",
  "assets/js/config.js", "assets/js/shared.js", "assets/js/motion.js", "assets/js/interactions.js",
  "assets/js/store.js", "assets/js/app-shell.js",
  "app/kasir.html", "app/login.html", "app/dashboard.html", "app/produk.html",
  "app/transaksi.html", "app/pajak.html", "app/pengaturan.html", /* qrcode.js: lazy via dynamic import saat QRIS pertama (runtime-cache), bukan cache awal */
  "assets/img/hero-phone-warung-1x.webp", "assets/img/hero-phone-warung.webp",
  "assets/img/app/dashboard-1440.webp", "assets/img/app/produk-1440.webp", "assets/img/app/pajak-1440.webp",
  "templates/katalog.html",
  "umkm.html", "pajak.html", "website.html", "naik-kelas.html",
  "tentang.html", "kebijakan-privasi.html", "syarat-ketentuan.html",
  "ai.html", "analisa-delivery.html", "automation.html",
  "alat/kalkulator-pph-final-umkm.html",
  "alat/kalkulator-hpp-harga-jual.html",
  "alat/kalkulator-biaya-qris.html",
  "alat/kalkulator-margin-delivery.html",
  "assets/daydream/sky-hero.webp",
  "assets/daydream/sky-hero-m.webp",
  "assets/daydream/grid-overlay.svg",
  "assets/daydream/cloud-1.webp",
  "assets/daydream/cloud-2.webp",
  "assets/daydream/lightleak.webp",
  "assets/daydream/star-dots.svg",
  "assets/fonts/Aspekta-450.woff2",
  "assets/fonts/Aspekta-500.woff2",
  "assets/fonts/Aspekta-600.woff2",
  "assets/fonts/Aspekta-650.woff2",
  "assets/fonts/instrument-serif-400-italic-latin.woff2",
  "assets/img/produk-kasir.webp",
  "assets/img/produk-kasir-2x.webp",
  "assets/img/produk-kasir-mobile.webp",
  "assets/img/f-kasir.webp", "assets/img/f-qris.webp", "assets/img/produk-struk.webp", /* v31: hero proof strip */
  "assets/img/produk-kasir-mobile-2x.webp",
  "assets/img/f-foto-ai.webp",
  "assets/img/f-scan16.webp",
  "assets/img/food/foto-ai-kopi-before.webp",
  "assets/img/food/foto-ai-kopi-after.webp",
  "assets/img/food/foto-ai-keripik-before.webp",
  "assets/img/food/foto-ai-keripik-after.webp",
  "assets/img/food/foto-ai-batik-before.webp",
  "assets/img/food/foto-ai-batik-after.webp",
  "assets/img/food/tkopi.webp",
  "assets/img/food/tkeripik.webp",
  "assets/img/food/tbatik.webp"
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
  /* Asset statis: stale-while-revalidate.
     Cache-first murni (versi lama) membuat setiap edit CSS/JS tidak terlihat
     sampai CACHE dibump manual — sudah dua kali menipu pengujian. SWR menyajikan
     salinan cache SEKARANG dan memperbaruinya di latar, jadi halaman berikutnya
     sudah memakai versi baru tanpa menyentuh konstanta CACHE.
     Offline tetap jalan: kalau jaringan gagal, cache yang menjawab. */
  e.respondWith(
    caches.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
        }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    })
  );
});
