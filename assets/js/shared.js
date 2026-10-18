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
      /* [landing-fix] L5 (2026-10-18): menu mobile a11y lengkap —
         Esc & tombol Back menutup, fokus terkunci di panel (focus trap),
         scroll body terkunci selama terbuka, fokus kembali ke pemicu.
         Animasi panel <200ms + reduced-motion dihormati (main.css + guard global). */
      var lastFocus = null;
      var MENU_FLAG = "olanoMenu";
      function setScrollLock(on) {
        document.body.style.overflow = on ? "hidden" : "";
      }
      function focusables() {
        var list = [burger].concat(Array.prototype.slice.call(mobile.querySelectorAll("a[href], button")));
        return list.filter(function (el) { return el.offsetParent !== null; });
      }
      function teardown() {
        if (!mobile.classList.contains("open")) return;
        mobile.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Buka menu");
        setScrollLock(false);
        document.removeEventListener("keydown", onKey);
      }
      function openMenu() {
        if (mobile.classList.contains("open")) return;
        lastFocus = document.activeElement;
        mobile.classList.add("open");
        burger.setAttribute("aria-expanded", "true");
        burger.setAttribute("aria-label", "Tutup menu");
        setScrollLock(true);
        try { history.pushState({ olanoMenu: 1 }, ""); } catch (e) {}
        document.addEventListener("keydown", onKey);
        requestAnimationFrame(function () {
          var f = mobile.querySelector("a[href], button");
          if (f) f.focus();
        });
      }
      function closeMenu(opts) {
        if (!mobile.classList.contains("open")) return;
        teardown();
        var refocus = !(opts && opts.noRefocus);
        if (refocus && lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
        if (!(opts && opts.viaPop)) {
          try { if (history.state && history.state[MENU_FLAG]) history.back(); } catch (e) {}
        }
      }
      function onKey(e) {
        if (e.key === "Escape") { e.preventDefault(); closeMenu(); return; }
        if (e.key !== "Tab") return;
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      burger.addEventListener("click", function () {
        mobile.classList.contains("open") ? closeMenu() : openMenu();
      });
      mobile.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { closeMenu({ viaPop: true, noRefocus: true }); });
      });
      window.addEventListener("popstate", function () {
        /* tombol Back / gestur Back Android menutup menu, bukan keluar halaman */
        if (mobile.classList.contains("open")) closeMenu({ viaPop: true });
      });
      window.addEventListener("hashchange", function () { closeMenu({ viaPop: true, noRefocus: true }); });
    }
  }

  /* ---------- dropdown nav desktop (.dd) ----------
     State = atribut aria-open pada .dd (dibaca CSS). Satu menu terbuka pada satu waktu;
     tutup via klik di luar, Escape (fokus balik ke trigger), klik link, atau fokus keluar.
     Scope selector .nav-links -> panel mobile (.nav-mobile) tidak tersentuh. */
  function initNavDropdowns() {
    var dds = document.querySelectorAll(".nav-links .dd");
    if (!dds.length) return;
    function close(dd) {
      dd.setAttribute("aria-open", "false");
      var t = dd.querySelector(".dd-trigger");
      if (t) t.setAttribute("aria-expanded", "false");
    }
    function open(dd) {
      dds.forEach(function (o) { if (o !== dd) close(o); });
      dd.setAttribute("aria-open", "true");
      var t = dd.querySelector(".dd-trigger");
      if (t) t.setAttribute("aria-expanded", "true");
    }
    function items(dd) {
      return Array.prototype.filter.call(dd.querySelectorAll(".dd-menu a"), function (a) {
        return a.offsetParent !== null;
      });
    }
    function focusAt(list, idx) {
      if (!list.length) return;
      list[((idx % list.length) + list.length) % list.length].focus();
    }
    dds.forEach(function (dd) {
      var trigger = dd.querySelector(".dd-trigger");
      var menu = dd.querySelector(".dd-menu");
      if (!trigger || !menu) return;
      trigger.addEventListener("click", function () {
        if (dd.getAttribute("aria-open") === "true") close(dd);
        else open(dd);
      });
      trigger.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
        e.preventDefault();
        if (dd.getAttribute("aria-open") !== "true") open(dd);
        var list = items(dd);
        focusAt(list, e.key === "ArrowDown" ? 0 : list.length - 1);
      });
      menu.addEventListener("keydown", function (e) {
        var list = items(dd);
        if (!list.length) return;
        var cur = list.indexOf(document.activeElement);
        if (e.key === "ArrowDown") { e.preventDefault(); focusAt(list, cur + 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); focusAt(list, cur - 1); }
        else if (e.key === "Home") { e.preventDefault(); focusAt(list, 0); }
        else if (e.key === "End") { e.preventDefault(); focusAt(list, list.length - 1); }
      });
      menu.addEventListener("click", function (e) {
        if (e.target.closest("a")) close(dd);
      });
      dd.addEventListener("focusout", function (e) {
        if (dd.getAttribute("aria-open") !== "true") return;
        if (!e.relatedTarget || !dd.contains(e.relatedTarget)) close(dd);
      });
    });
    document.addEventListener("click", function (e) {
      dds.forEach(function (dd) {
        if (dd.getAttribute("aria-open") === "true" && !dd.contains(e.target)) close(dd);
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      dds.forEach(function (dd) {
        if (dd.getAttribute("aria-open") !== "true") return;
        close(dd);
        if (dd.contains(document.activeElement)) {
          var t = dd.querySelector(".dd-trigger");
          if (t) t.focus();
        }
      });
    });
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

  /* ---------- bencho blocks: progress ring (skor usaha) ---------- */
  function initRings() {
    var C = 2 * Math.PI * 28; // r=28
    document.querySelectorAll("[data-pring]").forEach(function (el) {
      var val = Math.min(100, Math.max(0, parseInt(el.getAttribute("data-pring"), 10) || 0));
      var fg = el.querySelector(".fg");
      if (fg) { fg.style.strokeDasharray = C; fg.style.strokeDashoffset = C; }
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (fg) fg.style.strokeDashoffset = C * (1 - val / 100);
        });
      });
    });
  }

  /* ---------- DECK LAYANAN (#modul): tumpukan kartu 3D auto-rotasi 01->09 ----------
     Default CSS = daftar kartu vertikal statis (tanpa JS / reduced-motion: semua link
     tetap valid, aksesibilitas terjaga). Saat JS normal, section diberi .deck-live:
     kartu numpuk di stage 3D (perspective), kartu aktif di depan, 2 kartu belakang
     mengintip; tiap advance kartu aktif "fly-out" rotasi ke kanan, kartu belakang
     naik. Controls: prev/next, dots 01-09, swipe horizontal, filter tabs
     Semua/Aplikasi/Jasa. Transisi transform/opacity saja (budget motion spec v2:
     0 keyframe baru). Auto-advance dihentikan saat hover/fokus/tab tersembunyi,
     dan tidak berjalan sama sekali pada prefers-reduced-motion. */
  function initCardDeck() {
    var sec = document.getElementById("modul");
    if (!sec) return;
    var deck = sec.querySelector(".mdeck");
    var live = sec.querySelector(".dk-live");
    var pills = Array.prototype.slice.call(sec.querySelectorAll(".svc-pill"));
    var prevB = sec.querySelector("#dk-prev");
    var nextB = sec.querySelector("#dk-next");
    var dotsWrap = sec.querySelector(".dk-dots");
    var cards = Array.prototype.slice.call(deck.querySelectorAll(".mcard"));
    if (!cards.length) return;

    var N = cards.length;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var AUTO = 3800; // ms antar kartu (auto-advance)
    var i = 0;            // indeks kartu aktif di dalam "shown"
    var filter = "all";
    var shown = cards.slice();
    var timer = 0, hovering = 0, focusing = 0;

    // Dots dibuat dari kartu (nomor = teks .no), agar selaras dengan konten.
    var dots = cards.map(function (c, n) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dk-dot";
      b.dataset.i = String(n);
      var num = (c.querySelector(".no") || {}).textContent || String(n + 1);
      var title = (c.querySelector("b") || {}).textContent || ("Kartu " + num);
      b.setAttribute("aria-label", title + " (kartu " + num + ")");
      b.textContent = num;
      b.addEventListener("click", function () { jumpToCard(n); });
      dotsWrap.appendChild(b);
      return b;
    });

    function posOf(card) {
      var idx = shown.indexOf(card);
      if (idx < 0) return -1;
      var len = shown.length;
      return ((idx - i) % len + len) % len; // 0 aktif, 1 berikutnya...
    }

    function apply(card, p, len, instant) {
      var t, o, z;
      if (p === 0) { t = "translate(-50%,-50%)"; o = 1; z = 4; }
      else if (p === 1) { t = "translate(-50%,calc(-50% + 16px)) scale(.95)"; o = 0.5; z = 3; }
      else if (p === 2) { t = "translate(-50%,calc(-50% + 30px)) scale(.9)"; o = 0.22; z = 2; }
      else { t = "translate(-50%,calc(-50% + 44px)) scale(.85)"; o = 0; z = 1; }
      card.style.zIndex = z;
      card.style.opacity = o;
      card.style.transform = t;
      card.classList.toggle("is-active", p === 0);
      card.classList.toggle("is-far", p >= 3);
      // a11y: kartu jauh tidak boleh jadi target fokus (tidak terlihat)
      if (p >= 3) { card.tabIndex = -1; card.setAttribute("aria-hidden", "true"); }
      else { card.tabIndex = 0; card.removeAttribute("aria-hidden"); }
      if (document.activeElement === card && p >= 3) card.blur();
      if (instant) { card.classList.add("no-t"); }
    }

    function layout(instant) {
      var len = shown.length;
      // bersihkan is-active dari semua kartu dulu, biar hanya satu kartu
      // yang benar jadi aktif (mencegah kartu ter-filter yang masih nyimpen
      // class is-active lama). Kartu sedang fly-out tidak di-reset transform-nya.
      cards.forEach(function (c) { c.classList.remove("is-active"); });
      shown.forEach(function (card) {
        if (card.classList.contains("is-out")) return; // sedang fly-out: jangan timpa transform
        apply(card, posOf(card), len, instant);
      });
      cards.forEach(function (c) {
        if (shown.indexOf(c) < 0) { c.classList.add("is-hidden"); c.classList.remove("is-active", "is-far"); }
        else c.classList.remove("is-hidden");
      });
      if (instant) {
        requestAnimationFrame(function () {
          cards.forEach(function (c) { c.classList.remove("no-t"); });
        });
      }
    }

    // Fly-out kartu aktif saat maju: rotasi ke kanan (kartu "berputar" keluar).
    function flyOut(card, dir) {
      card.classList.remove("is-far", "no-t");
      card.style.zIndex = 5;
      card.style.transform = dir > 0
        ? "translate(-50%,-50%) translateX(300px) rotateY(-70deg)"
        : "translate(-50%,-50%) translateX(-300px) rotateY(70deg)";
      card.style.opacity = "0";
      card.classList.add("is-out");
      setTimeout(function () {
        card.classList.remove("is-out");
        apply(card, posOf(card), shown.length, true);
        requestAnimationFrame(function () { card.classList.remove("no-t"); });
      }, 480);
    }

    function announce() {
      if (!live) return;
      var cur = shown[i];
      if (!cur) return;
      var num = (cur.querySelector(".no") || {}).textContent || String(i + 1);
      var title = (cur.querySelector("b") || {}).textContent || "";
      live.textContent = title + " (" + num + " dari " + shown.length + ")";
    }

    function syncUI() {
      dots.forEach(function (d, n) {
        var card = cards[n];
        var inShown = filter === "all" || card.getAttribute("data-kind") === filter;
        d.classList.toggle("is-off", !inShown);
        if (inShown) d.classList.toggle("is-on", card === shown[i]);
      });
      var cnt = sec.querySelector(".dk-count");
      if (cnt) cnt.textContent = String(i + 1).padStart(2, "0") + "/" + String(shown.length).padStart(2, "0");
      announce();
    }

    function arm() {
      clearTimeout(timer);
      if (reduce || shown.length < 2) return;
      timer = setTimeout(function () {
        if (hovering || focusing || document.hidden) { arm(); return; }
        step(1);
      }, AUTO);
    }

    function step(dir) {
      var len = shown.length;
      if (!len) return;
      var cur = shown[i];
      i = (i + dir + len) % len;
      var isLive3d = sec.classList.contains("deck-live") && !reduce;
      if (isLive3d && cur) {
        if (dir === 1) { flyOut(cur, 1); layout(false); }
        else { layout(false); } // mundur: kartu aktif mundur, kartu belakang naik
      } else {
        layout(false);
      }
      syncUI();
      arm();
    }

    function jumpToCard(cardIdx) {
      var card = cards[cardIdx];
      var si = shown.indexOf(card);
      if (si < 0 || si === i) { syncUI(); return; }
      var dir = si > i ? 1 : -1;
      var cur = shown[i];
      i = si;
      if (sec.classList.contains("deck-live") && !reduce && cur) {
        flyOut(cur, dir);
      }
      layout(dir === 0);
      syncUI();
      arm();
    }

    if (reduce) {
      sec.classList.add("deck-static");
      if (prevB) prevB.hidden = true;
      if (nextB) nextB.hidden = true;
      if (dotsWrap) dotsWrap.hidden = true;
      if (live) live.hidden = true;
      // Tanpa 3D: daftar vertikal statis, semua kartu tampil. Filter tabs
      // tetap berfungsi lewat display:none (bukan transform/opacity).
      shown = cards.slice(); i = 0;
      pills.forEach(function (p) {
        p.addEventListener("click", function () {
          var k = p.getAttribute("data-kind");
          cards.forEach(function (c) {
            c.classList.toggle("is-hidden", k !== "all" && c.getAttribute("data-kind") !== k);
          });
        });
      });
    } else {
      sec.classList.add("deck-live");
      pills.forEach(function (p) {
        p.addEventListener("click", function () {
          filter = p.getAttribute("data-kind");
          pills.forEach(function (q) { q.classList.toggle("is-on", q === p); });
          shown = filter === "all" ? cards.slice() : cards.filter(function (c) {
            return c.getAttribute("data-kind") === filter;
          });
          i = 0;
          layout(true);
          syncUI();
          arm();
        });
      });
      if (prevB) prevB.addEventListener("click", function () { step(-1); });
      if (nextB) nextB.addEventListener("click", function () { step(1); });
      // Pause auto-advance saat hover / fokus / tab tersembunyi
      sec.addEventListener("mouseenter", function () { hovering++; });
      sec.addEventListener("mouseleave", function () { hovering = Math.max(0, hovering - 1); });
      sec.addEventListener("focusin", function () { focusing++; });
      sec.addEventListener("focusout", function () { focusing = Math.max(0, focusing - 1); });
      document.addEventListener("visibilitychange", arm);
      // Swipe horizontal di stage (touch/pen; mouse pakai tombol prev/next)
      var px = 0, py = 0, swiping = false;
      deck.addEventListener("pointerdown", function (e) {
        if (e.pointerType === "mouse") return;
        swiping = true; px = e.clientX; py = e.clientY;
      }, { passive: true });
      deck.addEventListener("pointerup", function (e) {
        if (!swiping || e.pointerType === "mouse") return;
        swiping = false;
        var dx = e.clientX - px, dy = e.clientY - py;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
      }, { passive: true });
      deck.addEventListener("pointercancel", function () { swiping = false; }, { passive: true });
      layout(true);
      syncUI();
      arm();
    }
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

  /* ---------- prefetch app kasir saat CTA hero terlihat (C2) ----------
     C2: ketukan CTA beranda -> produk pertama masuk keranjang <= 10 dtk di 3G.
     App demo (app/kasir.html + assets/js/config.js) di-prefetch HANYA saat CTA
     utama hero masuk viewport (IntersectionObserver, sekali -> unobserve):
     pengunjung yang tidak sampai CTA tidak membayar kuota app. rel=prefetch
     (bukan preload) = hanya mengisi cache HTTP, tidak dieksekusi di halaman ini.
     Idempoten: link prefetch untuk URL yang sudah ada tidak diduplikat. */
  function initCtaPrefetch() {
    var cta = document.querySelector(".hero .cta-row a[href*='kasir.html']");
    if (!cta || !("IntersectionObserver" in window)) return;
    var done = false;
    var urls = ["/app/kasir.html", "/assets/js/config.js"];
    function add(url) {
      if (document.querySelector("link[rel~='prefetch'][href='" + url + "']")) return;
      var l = document.createElement("link");
      l.rel = "prefetch";
      l.href = url;
      l.as = /\.html$/.test(url) ? "document" : "script";
      document.head.appendChild(l);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || done) return;
        done = true;
        io.unobserve(e.target);
        urls.forEach(add);
      });
    }, { threshold: 0.1 });
    io.observe(cta);
  }

  function registerSW() {
    if (!("serviceWorker" in navigator)) return;
    if (new URLSearchParams(location.search).has("no-sw")) return;
    window.addEventListener("load", function () {
      var sub = location.pathname.indexOf("/") >= 1 && /\/(alat|app)\/?/.test(location.pathname);
      var rel = sub ? "../sw.js" : "sw.js";
      var scope = sub ? "../" : "/";
      navigator.serviceWorker.register(rel, { scope: scope, updateViaCache: "none" }).then(function (reg) {
        // check byte sw.js di SETIAP navigasi (default Chrome = 24 jam -> ini bug "nggak ada bedanya")
        reg.update().catch(function () {});
      }).catch(function () {});
      // SW baru aktif -> tawarin reload, tapi HANYA kalau user bukan di-install pertama
      // (marker localStorage: controllerchange pertama = install baru, jangan ganggu)
      window.addEventListener("controllerchange", function () {
        var returning = false;
        try { returning = localStorage.getItem("olano-sw-was") === "1"; localStorage.setItem("olano-sw-was", "1"); } catch (e) {}
        if (!returning) return;
        var d = document.createElement("div");
        d.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);bottom:16px;z-index:9999;" +
          "display:flex;gap:10px;align-items:center;max-width:92%;width:fit-content;" +
          "background:#0B1B3A;color:#fff;font:600 13px/1.4 system-ui,-apple-system,sans-serif;" +
          "padding:12px 16px;border-radius:12px;box-shadow:0 8px 24px rgba(11,27,58,.35);";
        var t = document.createElement("span");
        t.textContent = "Versi baru Olano tersedia.";
        var b = document.createElement("button");
        b.textContent = "Muat ulang";
        b.style.cssText = "background:#2453EB;color:#fff;border:0;border-radius:8px;" +
          "padding:8px 14px;font:600 13px system-ui;cursor:pointer;";
        b.onclick = function () { location.reload(); };
        var x = document.createElement("button");
        x.textContent = "\u00d7";
        x.style.cssText = "background:none;border:0;color:rgba(255,255,255,.6);font:600 16px system-ui;cursor:pointer;padding:4px;";
        x.onclick = function () { d.remove(); };
        d.appendChild(t); d.appendChild(b); d.appendChild(x);
        document.body.appendChild(d);
        setTimeout(function () { if (d.parentNode) d.remove(); }, 30000);
      });
    });
  }

  function init() {

  /* Ticker dismiss (homepage v24, sessionStorage olano-ticker-dismissed) */
  function initTicker(){
    var t = document.getElementById("ticker");
    if(!t) return;
    try{ if(sessionStorage.getItem("olano-ticker-dismissed")){ t.hidden = true; return; } }catch(e){}
    var x = document.getElementById("ticker-x");
    if(x) x.addEventListener("click", function(){
      t.hidden = true;
      try{ sessionStorage.setItem("olano-ticker-dismissed", "1"); }catch(e){}
    });
  }

    initNav(); initNavDropdowns(); initReveal(); initCountUp(); initFaq();
    initSpotlight(); initSlideNum(); initHeroScenes();
    initOfflineDemo(); initMarquee(); initBeforeAfter(); initRings();
    initCardDeck();
    initCtaPrefetch();
    initTicker();
    registerSW();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
