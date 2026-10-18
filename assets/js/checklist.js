/* ============================================================================
   Checklist onboarding — dipakai umkm.html, pajak.html, analisa-delivery.html.
   Blok `checklist` bencho.dev (MIT), vanilla.
   Satu data-attribute `data-key`, satu localStorage key per halaman,
   supaya progres tiap layanan tidak saling menimpa.
   ========================================================================== */
(function () {
  "use strict";
  var NS = "key"; /* dataset.key = atribut data-key; dataset["data-key"] selalu undefined */
  var boxes = document.querySelectorAll("[data-checklist]");
  if (!boxes.length) return;

  function store(box) {
    return "olano.checklist." + (box.dataset.checklist || "default");
  }
  function read(box) {
    try { return JSON.parse(localStorage.getItem(store(box)) || "{}") || {}; }
    catch (e) { return {}; }
  }
  function write(box, data) {
    try { localStorage.setItem(store(box), JSON.stringify(data)); } catch (e) {}
  }

  boxes.forEach(function (box) {
    var saved = read(box);

    function paint() {
      box.querySelectorAll(".check-row").forEach(function (r) {
        var done = saved[r.dataset[NS]] ? "1" : "0";
        r.dataset.done = done;
        r.setAttribute("aria-pressed", done === "1" ? "true" : "false");
      });
    }

    box.addEventListener("click", function (e) {
      var row = e.target.closest(".check-row");
      if (!row) return;
      var k = row.dataset[NS];
      saved[k] = !saved[k];
      write(box, saved);
      paint();
    });

    /* keyboard: Enter/Space sudah ditangani <button>, tapi pastikan tidak dobel */
    box.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var row = e.target.closest(".check-row");
      if (row && e.target === row) e.preventDefault();
    });

    paint();
  });
})();
