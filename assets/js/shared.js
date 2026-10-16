/* OLANO shared.js: motion + interaktif global. Bebas dependensi.
   Semua animasi cuma transform/opacity. Honori prefers-reduced-motion. */
(function () {
  "use strict";
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- format ---------- */
  var OLANO = {
    rp: function (n, dec) {
      n = Number(n) || 0;
      dec = dec == null ? 0 : dec;
      return "Rp" + n.toLocaleString("id-ID", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    },
    num: function (n) { return Number(n || 0).toLocaleString("id-ID"); },
    short: function (n) {
      n = Number(n) || 0;
      if (n >= 1e9) return (n / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " M";
      if (n >= 1e6) return (n / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jt";
      if (n >= 1e3) return (n / 1e3).toLocaleString("id-ID", { maximumFractionDigits: 0 }) + " rb";
      return String(n);
    }
  };
  window.OLANO = OLANO;

  /* ---------- reveal on scroll ---------- */
  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (RM) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- count-up (hanya transform-friendly: ganti teks) ---------- */
  function initCountUp() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    if (RM) {
      els.forEach(function (el) {
        var target = parseFloat(el.getAttribute("data-count")) || 0;
        var pre = el.getAttribute("data-prefix") || "";
        var suf = el.getAttribute("data-suffix") || "";
        el.textContent = pre + OLANO.rp(target, 0).replace("Rp", "") + suf;
        el.setAttribute("data-done", "1");
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        var target = parseFloat(el.getAttribute("data-count")) || 0;
        var pre = el.getAttribute("data-prefix") || "";
        var suf = el.getAttribute("data-suffix") || "";
        var t0 = performance.now(), dur = 900;
        function tick(now) {
          var p = Math.min(1, (now - t0) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + OLANO.rp(target * eased, 0).replace("Rp", "") + suf;
          if (p < 1) requestAnimationFrame(tick);
          else el.setAttribute("data-done", "1");
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- spotlight hover (ref ibelick spotlight.tsx, port vanilla) ----------
     Hanya perangkat pointer:fine; set CSS var --mx/--my per elemen .spot. */
  function initSpotlight() {
    if (RM) return;
    var fine = window.matchMedia("(hover:hover) and (pointer:fine)");
    if (!fine.matches) return;
    document.querySelectorAll(".spot").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      }, { passive: true });
    });
  }

  /* ---------- sliding number (ref ibelick sliding-number.tsx, port vanilla) ----------
     Tiap digit = kolom 0-9 yang bergulir (CSS transition transform) ke angka tujuan.
     Format titik ribuan statis; gulir sekali lalu diam. Idempoten via _slideDone
     (scene tersembunyi dipicu oleh initHeroScenes, bukan IntersectionObserver). */
  function initSlideNum() {
    document.querySelectorAll("[data-slide-num]").forEach(function (el) {
      var raw = el.getAttribute("data-slide-num") || "0";
      var num = parseFloat(raw) || 0;
      var pre = el.getAttribute("data-prefix") || "";
      var suf = el.getAttribute("data-suffix") || "";
      var isInt = Number.isInteger(num);
      // integer: format id-ID (titik ribuan); desimal: koma satu digit ("0,5")
      var s = isInt ? num.toLocaleString("id-ID") : String(num).replace(".", ",");
      el._slideDone = false;
      if (RM) {
        el.textContent = pre + s + suf;
        el._slideDone = true;
        return;
      }
      var html = (pre ? '<span class="spref">' + pre + "</span>" : "");
      for (var i = 0; i < s.length; i++) {
        var c = s[i];
        if (c === "." || c === ",") { html += '<span class="sdot">' + c + "</span>"; continue; }
        html += '<span class="scol"><span class="sstack" data-final="' + c + '">' +
          "0123456789".split("").map(function (d) { return "<span>" + d + "</span>"; }).join("") +
          "</span></span>";
      }
      if (suf) html += '<span class="ssuf">' + suf + "</span>";
      el.classList.add("snum");
      el.innerHTML = html;
      var stacks = el.querySelectorAll(".sstack");
      function go() {
        if (el._slideDone) return;
        el._slideDone = true;
        stacks.forEach(function (st, idx) {
          var final = parseInt(st.getAttribute("data-final"), 10);
          // stagger kecil per posisi: terasa settling, bukan slot-machine
          st.style.transitionDelay = (idx * 40) + "ms";
          requestAnimationFrame(function () {
            st.style.transform = "translateY(-" + final + "em)";
          });
        });
      }
      el._goSlide = go;
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { go(); io.unobserve(e.target); }
          });
        }, { threshold: 0.4 });
        io.observe(el);
      } else { go(); }
    });
  }

  /* ---------- hero scene cycle (Kasir/QRIS/Pajak) ----------
     Tujuan (R-31, MOTION dial 2): product demo - satu loop berpurpose yang memutar
     3 janji produk; pause saat hover/focus di frame (user pegang kendali), off di
     perangkat touch (pakai tab manual) dan saat reduced motion. */
  function initHeroScenes() {
    var f = document.querySelector("[data-hero-scenes]");
    if (!f) return;
    var tabs = f.querySelectorAll(".scene-tab");
    var scenes = f.querySelectorAll(".scene");
    if (!tabs.length || !scenes.length) return;
    var i = 0, timer = null;
    var fine = window.matchMedia("(hover:hover) and (pointer:fine)");
    function activate(n) {
      i = ((n % scenes.length) + scenes.length) % scenes.length;
      scenes.forEach(function (s, k) { s.classList.toggle("active", k === i); });
      tabs.forEach(function (t, k) {
        t.classList.toggle("on", k === i);
        t.setAttribute("aria-selected", k === i ? "true" : "false");
      });
      var kpi = scenes[i].querySelector("[data-slide-num]");
      if (kpi && kpi._goSlide) kpi._goSlide();
    }
    tabs.forEach(function (t, k) {
      t.addEventListener("click", function () { activate(k); startCycle(); });
    });
    function stopCycle() { if (timer) { clearInterval(timer); timer = null; } }
    function startCycle() {
      stopCycle();
      if (RM || !fine.matches) return;
      timer = setInterval(function () { activate(i + 1); }, 5000);
    }
    f.addEventListener("mouseenter", stopCycle);
    f.addEventListener("mouseleave", startCycle);
    f.addEventListener("focusin", stopCycle);
    f.addEventListener("focusout", startCycle);
    activate(0);
    startCycle();
  }

  /* ---------- navbar scroll + mobile burger ---------- */
  function initNav() {
    var nav = document.querySelector(".nav");
    if (nav) {
      var onScroll = function () {
        nav.classList.toggle("scrolled", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    var burger = document.querySelector(".nav-burger");
    var mobile = document.querySelector(".nav-mobile");
    if (burger && mobile) {
      burger.addEventListener("click", function () {
        var open = mobile.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      mobile.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          mobile.classList.remove("open");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* ---------- detail/FAQ: tutup yang lain ---------- */
  function initFaq() {
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function (it) {
      it.addEventListener("toggle", function () {
        if (it.open) {
          items.forEach(function (o) { if (o !== it) o.open = false; });
        }
      });
    });
  }

  /* ---------- demo matikan internet (index S5) ---------- */
  function initOfflineDemo() {
    var demo = document.querySelector("[data-offline-demo]");
    if (!demo) return;
    var toggle = demo.querySelector("[data-toggle]");
    var stage = demo.querySelector("[data-stage]");
    var products = demo.querySelectorAll("[data-tap]");
    var safeCount = demo.querySelector("[data-safe-count]");
    var live = demo.querySelector("[data-live]");
    var tapped = 0;
    var online = true;
    function render() {
      stage.classList.toggle("is-offline", !online);
      if (toggle) {
        toggle.setAttribute("aria-pressed", online ? "false" : "true");
        toggle.querySelector("[data-toggle-label]").textContent = online ? "Internet: ON" : "Internet: OFF";
      }
      if (safeCount) safeCount.textContent = online ? "0" : String(tapped);
      if (live) {
        live.textContent = online
          ? "Mode online: semua transaksi langsung tersinkron."
          : (tapped > 0
            ? tapped + " transaksi aman di perangkat, otomatis tersinkron saat online."
            : "Mode offline: tap produk untuk jualan tetap jalan.");
      }
    }
    if (toggle) toggle.addEventListener("click", function () { online = !online; tapped = 0; render(); });
    products.forEach(function (p) {
      p.addEventListener("click", function () {
        if (online) return;
        p.classList.add("tapped");
        tapped++;
        render();
      });
    });
    render();
  }

  /* ---------- marquee template (index S7) ---------- */
  function initMarquee() {
    var tracks = document.querySelectorAll("[data-marquee] .mq-track");
    if (!tracks.length) return;
    if (RM) return; // reduced: tidak auto-scroll, tetap bisa di-scroll manual
    tracks.forEach(function (t) {
      // duplikasi isi agar loop mulus
      t.innerHTML += t.innerHTML;
      var speed = parseFloat(t.getAttribute("data-speed")) || 40; // detik/loop
      t.style.animation = "mqSlide " + speed + "s linear infinite";
    });
    document.querySelectorAll("[data-marquee]").forEach(function (m) {
      m.addEventListener("mouseenter", function () { m.querySelectorAll(".mq-track").forEach(function (t){ t.style.animationPlayState="paused"; }); });
      m.addEventListener("mouseleave", function () { m.querySelectorAll(".mq-track").forEach(function (t){ t.style.animationPlayState="running"; }); });
    });
  }

  /* ---------- before/after slider foto AI ---------- */
  function initBeforeAfter() {
    document.querySelectorAll("[data-before-after]").forEach(function (ba) {
      var range = ba.querySelector('input[type="range"]');
      var after = ba.querySelector("[data-after]");
      if (!range || !after) return;
      function set(v) { after.style.clipPath = "inset(0 " + (100 - v) + "% 0 0)"; range.setAttribute("aria-valuenow", v); }
      range.addEventListener("input", function () { set(range.value); });
      set(range.value || 50);
    });
  }

  function registerSW() {
    if (!("serviceWorker" in navigator)) return;
    if (new URLSearchParams(location.search).has("no-sw")) return;
    window.addEventListener("load", function () {
      var sub = location.pathname.indexOf("/") >= 1 && /\/(alat|app)\/?/.test(location.pathname);
      var rel = sub ? "../sw.js" : "sw.js";
      var scope = sub ? "../" : "/";
      navigator.serviceWorker.register(rel, { scope: scope }).catch(function () {});
    });
  }

  function init() {
    initNav(); initReveal(); initCountUp(); initFaq();
    initSpotlight(); initSlideNum(); initHeroScenes();
    initOfflineDemo(); initMarquee(); initBeforeAfter();
    registerSW();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
