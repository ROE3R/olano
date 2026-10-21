/* ============================================================================
   Olano — interactions.js
   Port vanilla dari blok Bencho PRO (sumber /root/bencho-farm/src/*.tsx,
   diambil lewat /api/block-source 2026-10-21). Tanpa dependency.
   ----------------------------------------------------------------------------
   • rolling-counter -> OlanoQty    (stepper qty di keranjang kasir)
   • label-input     -> OlanoField  (label mengambang di form login/daftar)
   • magnet-select   -> OlanoMagnet (opsi tertarik pointer, segmen kalkulator)
   Angka spring & aturan pembulatan diambil apa adanya dari sumber TSX-nya.
   ========================================================================== */
(function () {
  "use strict";

  /* ── spring bersama (identik dengan `springOf` Bencho) ─────────────────────
     k: 0.08..0.24 (kekakuan), d: 0.62..0.82 (sisa kecepatan per frame).
     d DIPANGKATKAN dt, bukan dikali: frame drop tidak mengubah perilaku. */
  function springOf(tune) {
    return { k: 0.08 + (tune / 100) * 0.16, d: 0.62 + (tune / 100) * 0.2 };
  }
  function stillness() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ══════════════════════════════════════════════════════════════════════════
     1. ROLLING COUNTER — OlanoQty
     Tiap kolom targetnya JUMLAH PULUHAN dari nilai, bukan digitnya:
     1284 → kolom 0 target 1284, kolom 1 target 128, kolom 2 target 12.
     9→10 = kolom satuan maju satu langkah (9→0 di strip 0..9,0), puluhan maju
     satu. Strip tidak pernah mundur 8 digit.
     ══════════════════════════════════════════════════════════════════════════ */
  var CELL = 30;   /* tinggi jendela satu digit, px */
  var PX = 12;     /* satu langkah drag, px */
  var MAXQ = 999;

  function OlanoQty(host, opts) {
    if (!host) return null;
    if (host.__qty) return host.__qty;
    opts = opts || {};
    var still = stillness();
    var bounce = opts.bounce == null ? 45 : opts.bounce;   /* 0..100 */
    var stagger = opts.stagger == null ? 45 : opts.stagger; /* ms antar kolom */
    var blurKnob = opts.blur == null ? 50 : opts.blur;
    var onChange = opts.onChange || function () {};
    /* Di keranjang, satu geser = satu/lebih langkah diskret dan TIDAK ada
       coast sesudah lepas: angka qty tidak boleh terus berjalan sendiri.
       Fling tetap tersedia kalau host memang mau (coast: true). */
    var coast = opts.coast === true;

    var val = clamp(Number(opts.value) || 0, 0, MAXQ);
    var cols = [], strips = [], raf = 0, prevT = 0;

    host.className = "rct";
    host.innerHTML =
      '<button type="button" class="rct-btn" data-d="-1" aria-label="' + (opts.decLabel || "Kurangi") + '">\u2212</button>' +
      '<div class="rct-win" role="spinbutton" tabindex="0" aria-valuemin="0" aria-valuemax="' + MAXQ + '">' +
        '<div class="rct-strip"></div>' +
      '</div>' +
      '<button type="button" class="rct-btn" data-d="1" aria-label="' + (opts.incLabel || "Tambah") + '">+</button>';

    var win = host.querySelector(".rct-win");
    var strip = host.querySelector(".rct-strip");

    function syncAria() {
      win.setAttribute("aria-valuenow", String(val));
      win.setAttribute("aria-valuetext", String(val));
      win.setAttribute("aria-label", (opts.label || "Jumlah") + ": " + val);
    }

    function colEls() {
      var shown = Math.max(1, String(val).length);
      for (var p = shown - 1; p >= 0; p--) {
        var cell = document.createElement("span");
        cell.className = "rct-cell";
        cell.style.height = CELL + "px";
        var s = document.createElement("span");
        s.className = "rct-strip";
        for (var i = 0; i <= 10; i++) {
          var d = document.createElement("span");
          d.className = "rct-d";
          d.textContent = String(i % 10);
          s.appendChild(d);
        }
        cell.appendChild(s);
        strip.appendChild(cell);
        strips.push(s);
        var n = Math.floor(val / Math.pow(10, p));
        cols.push({ pos: n, vel: 0, target: n, due: [], next: [] });
      }
    }

    function paint() {
      var k = cols.length;
      for (var i = 0; i < k; i++) {
        var c = cols[i], el = strips[k - 1 - i];
        if (!el) continue;
        var m = ((c.pos % 10) + 10) % 10;
        var smear = Math.min(3, Math.abs(c.vel) * 2.4) * (blurKnob / 50);
        el.style.transform = "translateY(" + (-m * CELL) + "px)";
        el.style.filter = smear > 0.15 ? "blur(" + smear.toFixed(2) + "px)" : "";
      }
    }

    function tick(t) {
      var dt = prevT ? clamp((t - prevT) / 16.67, 0, 2.5) : 1;
      prevT = t;
      var sp = springOf(bounce), now = performance.now(), busy = false;
      for (var i = 0; i < cols.length; i++) {
        var c = cols[i];
        while (c.due.length && c.due[0] <= now) { c.due.shift(); c.target = c.next.shift(); }
        if (c.due.length) busy = true;
        var gap = c.target - c.pos;
        if (Math.abs(gap) > 24) c.pos += Math.round((gap - Math.sign(gap) * 24) / 10) * 10;
        c.vel += (c.target - c.pos) * sp.k * dt;
        c.vel *= Math.pow(sp.d, dt);
        c.pos += c.vel * dt;
        if (Math.abs(c.target - c.pos) < 0.004 && Math.abs(c.vel) < 0.004) { c.pos = c.target; c.vel = 0; }
        else busy = true;
      }
      paint();
      raf = busy ? requestAnimationFrame(tick) : 0;
    }

    function run() {
      if (raf) return;
      prevT = 0;
      raf = requestAnimationFrame(tick);
    }

    function rebuild() {
      strip.innerHTML = "";
      strips = [];
      cols = [];
      colEls();
      paint();
    }

    function bump(n) {
      var next = clamp(val + n, 0, MAXQ);
      if (next === val) { syncAria(); return; }
      var crossing = String(next).length !== String(val).length;
      val = next;
      syncAria();
      if (crossing) { rebuild(); onChange(val); return; }
      var now = performance.now();
      for (var i = 0; i < cols.length; i++) {
        var c = cols[i], to = Math.floor(val / Math.pow(10, i));
        if (still) { c.pos = c.target = to; c.vel = 0; c.due = []; c.next = []; continue; }
        c.due.push(now + i * stagger);
        c.next.push(to);
      }
      if (still) paint(); else run();
      onChange(val);
    }

    /* tekan & tahan: satu langkah langsung, lalu ulang pada 380ms, kemudian
       tiap 90ms; setelah 1,5 dtk tiap ulangan jadi 10 langkah */
    var holdT = 0, holdSince = 0;
    function stopHold() { clearTimeout(holdT); holdT = 0; }
    function press(dir) {
      stopHold();
      bump(dir);                          /* satu langkah langsung */
      holdSince = performance.now();
      holdT = setTimeout(function tickHold() {
        var held = performance.now() - holdSince;
        bump(dir * (held > 1500 ? 10 : 1));
        holdT = setTimeout(tickHold, held > 900 ? 55 : 90);
      }, 380);
    }

    /* drag jendela: 12px = satu langkah; lepas saat masih bergerak = coast */
    var drag = null, fling = 0;
    function steps(acc) {
      var n = acc > 0 ? Math.floor(acc / PX) : Math.ceil(acc / PX);
      if (n) bump(n);
      return acc - n * PX;
    }
    win.addEventListener("pointerdown", function (e) {
      cancelAnimationFrame(fling);
      try { win.setPointerCapture(e.pointerId); } catch (err) { /* pointer sintetis */ }
      drag = { y: e.clientY, acc: 0, v: 0, t: performance.now() };
    });
    win.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var now = performance.now(), dy = drag.y - e.clientY;
      drag.y = e.clientY;
      var dtms = Math.max(1, now - drag.t);
      drag.t = now;
      drag.v = drag.v * 0.6 + (dy / dtms) * 0.4;
      drag.acc = steps(drag.acc + dy);
    });
    function endDrag(e) {
      if (!drag) return;
      var g = drag; drag = null;
      try { win.releasePointerCapture(e.pointerId); } catch (err) { /* tak pernah di-capture */ }
      if (still || !coast) return;      /* keranjang: satu geser = langkah, tanpa lemparan */
      var v = performance.now() - g.t > 90 ? 0 : g.v * 16.67;
      if (Math.abs(v) < 2) return;
      /* batas keras: pointer sintetis/gerakan 1ms bisa menghasilkan vel raksasa,
         dan di keranjang itu berarti +30 item dalam satu frame */
      v = clamp(v, -24, 24);
      var acc = g.acc, thrown = 0;
      (function coastFrame() {
        acc = steps(acc + v);
        v *= 0.94;
        thrown += 1;
        if (Math.abs(v) > 0.4 && thrown < 12) fling = requestAnimationFrame(coastFrame);
      })();
    }
    win.addEventListener("pointerup", endDrag);
    win.addEventListener("pointercancel", endDrag);

    /* keyboard: panah atas/bawah = satu langkah, PageUp/Down = sepuluh */
    win.addEventListener("keydown", function (e) {
      var k = e.key;
      if (k === "ArrowUp" || k === "ArrowRight") { e.preventDefault(); bump(1); }
      else if (k === "ArrowDown" || k === "ArrowLeft") { e.preventDefault(); bump(-1); }
      else if (k === "PageUp") { e.preventDefault(); bump(10); }
      else if (k === "PageDown") { e.preventDefault(); bump(-10); }
    });

    host.querySelectorAll(".rct-btn").forEach(function (b) {
      var dir = Number(b.dataset.d);
      b.addEventListener("pointerdown", function (e) { e.preventDefault(); press(dir); });
      b.addEventListener("pointerup", stopHold);
      b.addEventListener("pointerleave", stopHold);
      b.addEventListener("pointercancel", stopHold);
      b.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); bump(dir); }
      });
    });

    rebuild();
    syncAria();

    var api = {
      el: host,
      get: function () { return val; },
      set: function (n) { bump(clamp(Number(n) || 0, 0, MAXQ) - val); },
      destroy: function () { stopHold(); cancelAnimationFrame(raf); cancelAnimationFrame(fling); delete host.__qty; }
    };
    host.__qty = api;
    return api;
  }

  /* ══════════════════════════════════════════════════════════════════════════
     2. LABEL INPUT — OlanoField
     Satu <input> asli (bukan input palsu): paste, autofill, dan screen reader
     jalan tanpa kode. Yang bergerak hanya labelnya — naik ke tepi atas saat
     fokus atau saat sudah ada isi. Tidak menggambar ulang outline.
     ══════════════════════════════════════════════════════════════════════════ */
  function OlanoField(input) {
    if (!input || input.__field) return input && input.__field;
    var wrap = input.closest(".lbi") || input.parentNode;
    var label = wrap.querySelector("label");
    if (!label) return null;
    if (!wrap.classList.contains("lbi")) wrap.classList.add("lbi");
    label.classList.add("lbi-label");
    input.classList.add("lbi-field");

    function sync() {
      var on = document.activeElement === input || String(input.value || "").length > 0;
      wrap.dataset.float = on ? "1" : "0";
    }
    input.addEventListener("focus", sync);
    input.addEventListener("blur", sync);
    input.addEventListener("input", sync);
    sync();

    var api = { el: input, sync: sync };
    input.__field = api;
    return api;
  }

  /* ══════════════════════════════════════════════════════════════════════════
     3. MAGNET SELECT — OlanoMagnet
     Tiap opsi tertarik ke pointer sebanding kedekatan, dibatasi `pull` px,
     lalu kembali dengan spring. Batasnya kecil (4px) supaya kandidat tidak
     pernah bergerak menjauh dari jari yang menekannya.
     ══════════════════════════════════════════════════════════════════════════ */
  function OlanoMagnet(box, opts) {
    if (!box || box.__magnet) return box && box.__magnet;
    opts = opts || {};
    var pull = opts.pull == null ? 4 : opts.pull;      /* px */
    var reach = opts.reach == null ? 56 : opts.reach;  /* px radius */
    var still = stillness();
    var items = Array.prototype.slice.call(
      box.querySelectorAll(opts.itemSelector || ".msel-opt, .seg label")
    );
    if (!items.length) return null;
    var state = items.map(function () { return { x: 0, y: 0, tx: 0, ty: 0 }; });
    var raf = 0;

    function loop() {
      var busy = false;
      for (var i = 0; i < items.length; i++) {
        var s = state[i];
        s.x += (s.tx - s.x) * 0.22;
        s.y += (s.ty - s.y) * 0.22;
        if (Math.abs(s.tx - s.x) > 0.05 || Math.abs(s.ty - s.y) > 0.05) busy = true;
        else { s.x = s.tx; s.y = s.ty; }
        items[i].style.translate = (s.x || s.y) ? s.x.toFixed(2) + "px " + s.y.toFixed(2) + "px" : "";
      }
      raf = busy ? requestAnimationFrame(loop) : 0;
    }

    box.addEventListener("pointermove", function (e) {
      if (still || e.pointerType === "touch") return;
      for (var i = 0; i < items.length; i++) {
        var r = items[i].getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > reach || dist === 0) { state[i].tx = 0; state[i].ty = 0; continue; }
        /* tarikan sebanding kedekatan, dibatasi `pull` supaya tidak menjauh dari jari */
        var f = (1 - dist / reach) * pull / dist;
        state[i].tx = clamp(dx * f, -pull, pull);
        state[i].ty = clamp(dy * f, -pull, pull);
      }
      if (!raf) raf = requestAnimationFrame(loop);
    });
    box.addEventListener("pointerleave", function () {
      for (var i = 0; i < state.length; i++) { state[i].tx = 0; state[i].ty = 0; }
      if (!raf) raf = requestAnimationFrame(loop);
    });

    var api = { el: box, items: items };
    box.__magnet = api;
    return api;
  }

  window.OlanoQty = OlanoQty;
  window.OlanoField = OlanoField;
  window.OlanoMagnet = OlanoMagnet;
})();
