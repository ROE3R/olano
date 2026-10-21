/* ============================================================================
   Olano: app shell (navigasi + komponen dasar dashboard)
   Dipakai semua halaman di app/ kecuali login. Vanilla, tanpa dependency.
   Token, radius, dan ritme mengikuti DESIGN.md §10.
   ========================================================================== */
(function () {
  "use strict";

  var PAGES = [
    { key: "dashboard", label: "Ringkasan", href: "dashboard.html", icon: "grid" },
    { key: "kasir", label: "Kasir", href: "kasir.html", icon: "cart" },
    { key: "produk", label: "Produk", href: "produk.html", icon: "box" },
    { key: "transaksi", label: "Transaksi", href: "transaksi.html", icon: "list" },
    { key: "pajak", label: "Pajak", href: "pajak.html", icon: "doc" },
    { key: "pengaturan", label: "Pengaturan", href: "pengaturan.html", icon: "gear" }
  ];

  var ICONS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    cart: '<path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M6 6L5 3H2"/>',
    box: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/>',
    doc: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9L5.3 5.3"/>'
  };

  function icon(name, size) {
    var d = ICONS[name] || ICONS.grid;
    return '<svg class="ico" width="' + (size || 18) + '" height="' + (size || 18) +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>";
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function rp(n) {
    var v = Math.round(Number(n) || 0);
    return "Rp" + v.toLocaleString("id-ID");
  }

  /* ---------- tanggal ---------- */
  var DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  function timeHM(ts) {
    var d = new Date(ts);
    return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }
  function dateShort(ts) {
    var d = new Date(ts);
    return d.getDate() + " " + MONTHS[d.getMonth()];
  }
  function dayLabel(ts) { return DAYS[new Date(ts).getDay()]; }

  /* ---------- shell ---------- */
  function mount(opts) {
    opts = opts || {};
    var active = opts.active || "";
    var title = opts.title || "";
    var sub = opts.sub || "";

    var store = window.OlanoStore ? window.OlanoStore.settings() : { store: "Kopi Senja" };
    var nav = PAGES.map(function (p) {
      var on = p.key === active;
      return '<a class="sh-nav__item' + (on ? " is-on" : "") + '" href="' + p.href + '"' +
        (on ? ' aria-current="page"' : "") + '>' + icon(p.icon) +
        '<span>' + p.label + "</span></a>";
    }).join("");

    var root = document.getElementById("app-shell");
    if (!root) return;

    root.innerHTML =
      '<aside class="sh-side" id="shSide">' +
        '<a class="sh-brand" href="../index.html"><span class="sh-mark" aria-hidden="true">O</span>' +
          '<span class="sh-brand__t">Olano</span></a>' +
        '<nav class="sh-nav" aria-label="Navigasi aplikasi">' + nav + "</nav>" +
        '<div class="sh-side__foot">' +
          '<span class="sh-store" title="Toko aktif">' + esc(store.store) + "</span>" +
          '<a class="sh-out" href="login.html">Keluar</a>' +
        "</div>" +
      "</aside>" +
      '<div class="sh-main">' +
        '<header class="sh-top">' +
          '<button type="button" class="sh-burger" id="shBurger" aria-label="Buka menu" aria-expanded="false" aria-controls="shSide">' +
            '<span></span><span></span><span></span></button>' +
          '<div class="sh-title"><h1>' + esc(title) + "</h1>" +
            (sub ? '<p class="sh-sub">' + esc(sub) + "</p>" : "") + "</div>" +
          '<div class="sh-actions">' +
            '<span class="sh-pill" id="shStatus" aria-live="polite">' +
              '<i class="sh-dot" aria-hidden="true"></i><span id="shStatusT">Siap</span></span>' +
            '<a class="btn btn-primary btn-sm" href="kasir.html">Buka kasir</a>' +
          "</div>" +
        "</header>" +
        '<main class="sh-body" id="shBody"></main>' +
      "</div>" +
      '<div class="sh-scrim" id="shScrim" hidden></div>';

    var body = document.getElementById("shBody");
    if (opts.mount) opts.mount(body);

    var side = document.getElementById("shSide");
    var burger = document.getElementById("shBurger");
    var scrim = document.getElementById("shScrim");
    function closeNav() {
      side.classList.remove("is-open"); scrim.hidden = true;
      burger.setAttribute("aria-expanded", "false");
    }
    burger.addEventListener("click", function () {
      var open = side.classList.toggle("is-open");
      scrim.hidden = !open;
      burger.setAttribute("aria-expanded", String(open));
    });
    scrim.addEventListener("click", closeNav);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && side.classList.contains("is-open")) { closeNav(); burger.focus(); }
    });

    /* status sinkron: membaca antrean outbox kalau ada */
    var st = document.getElementById("shStatusT");
    function paintStatus() {
      if (st) st.textContent = navigator.onLine ? "Tersambung" : "Offline";
      var pill = document.getElementById("shStatus");
      if (pill) pill.dataset.off = navigator.onLine ? "0" : "1";
    }
    paintStatus();
    window.addEventListener("online", paintStatus);
    window.addEventListener("offline", paintStatus);
  }

  window.OlanoApp = {
    mount: mount, icon: icon, esc: esc, rp: rp,
    timeHM: timeHM, dateShort: dateShort, dayLabel: dayLabel,
    PAGES: PAGES
  };
})();
