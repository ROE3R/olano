/* ============================================================================
   OTP — vanilla port dari bencho.dev `one-time-code` (MIT).
   ----------------------------------------------------------------------------
   IDE INTI YANG DIPINJAM (dari Otp.tsx):
   Enam <input> terpisah mematahkan paste, autofill SMS, backspace, dan
   screen reader. Jadi: SATU <input> tak terlihat menutupi seluruh baris,
   dan sel-sel di bawahnya hanya lukisan. Semua perilaku native browser
   (paste, autofill, backspace) jalan tanpa kode tambahan.

   Bedanya dengan aslinya: aslinya memakai filter goo SVG + spring framer-motion
   untuk "melebur" sel jadi kapsul. Olano tidak butuh efek lebur itu, jadi
   versi ini hanya memakai state warna + animasi digit per sel.

   Dipakai untuk: kode pemulihan cadangan (6 digit).
   ========================================================================== */
(function () {
  "use strict";

  var LEN = 6;

  function build(root, opts) {
    opts = opts || {};
    var len = opts.length || LEN;
    var field = document.createElement("input");
    field.className = "otp-field";
    field.type = "text";
    field.inputMode = "numeric";
    field.setAttribute("autocomplete", "one-time-code");
    field.maxLength = len;
    field.setAttribute("spellcheck", "false");
    field.setAttribute("aria-label", len + " digit kode pemulihan");

    var row = document.createElement("div");
    row.className = "otp-row";
    row.setAttribute("aria-hidden", "true");
    for (var i = 0; i < len; i++) {
      var c = document.createElement("span");
      c.className = "otp-cell";
      c.dataset.i = String(i);
      row.appendChild(c);
    }
    var caret = document.createElement("i");
    caret.className = "otp-caret";
    caret.dataset.on = "false";
    row.appendChild(caret);

    root.classList.add("otp");
    root.dataset.phase = "type";
    root.appendChild(row);
    root.appendChild(field);

    var onDone = opts.onDone || function () {};

    function paint() {
      var v = field.value.replace(/\D/g, "").slice(0, len);
      if (v !== field.value) field.value = v;
      var cells = row.querySelectorAll(".otp-cell");
      for (var i = 0; i < cells.length; i++) {
        var d = v.charAt(i);
        var cell = cells[i];
        if (cell.textContent !== d) {
          cell.textContent = d;
          if (d) {
            /* ulang animasi masuk untuk digit baru */
            var dig = document.createElement("span");
            dig.className = "otp-digit";
            dig.textContent = d;
            cell.textContent = "";
            cell.appendChild(dig);
          }
        }
        cell.dataset.filled = d ? "1" : "0";
      }
      /* caret di posisi digit berikutnya */
      var idx = Math.min(v.length, len - 1);
      var target = cells[idx];
      if (target && document.activeElement === field && v.length < len) {
        caret.dataset.on = "true";
        caret.style.left = (target.offsetLeft + target.offsetWidth / 2 - 1) + "px";
      } else {
        caret.dataset.on = "false";
      }
      return v;
    }

    field.addEventListener("input", function () {
      var v = paint();
      if (v.length === len) {
        root.dataset.phase = "ok";
        field.blur();
        onDone(v);
      } else {
        root.dataset.phase = "type";
      }
    });
    field.addEventListener("focus", paint);
    field.addEventListener("blur", function () { caret.dataset.on = "false"; });

    root.addEventListener("click", function () { field.focus(); });

    paint();

    return {
      value: function () { return field.value; },
      reset: function () { field.value = ""; root.dataset.phase = "type"; paint(); },
      reject: function () {
        root.dataset.phase = "no";
        setTimeout(function () {
          field.value = "";
          root.dataset.phase = "type";
          paint();
        }, 700);
      },
      focus: function () { field.focus(); }
    };
  }

  window.OlanoOtp = { build: build };
})();
