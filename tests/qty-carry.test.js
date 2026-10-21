/* Uji logika murni dari port Bencho PRO: pembulatan kolom rolling counter.
   Jalankan: node tests/qty-carry.test.js
   Yang diuji cuma matematikanya (target per kolom = jumlah puluhan), karena
   itulah aturan yang membuat 9->10 tidak memutar balik 9 digit. */
const assert = require("assert");

/* salinan aturan dari assets/js/interactions.js `bump` */
const targetOf = (value, place) => Math.floor(value / Math.pow(10, place));

/* 1284 -> kolom 0 target 1284, kolom 1 target 128, kolom 2 target 12, kolom 3 target 1 */
const cols = (v) => [0, 1, 2, 3].map((p) => targetOf(v, p));
assert.deepStrictEqual(cols(1284), [1284, 128, 12, 1]);

/* 9 -> 10: satuan MAJU satu langkah (9->0 di strip 0..9,0), puluhan maju satu.
   Kedua target naik, tidak ada yang turun -> tidak ada strip berputar balik. */
const before = cols(9), after = cols(10);
assert.ok(after[0] > before[0], "satuan harus maju");
assert.ok(after[1] > 0, "puluhan harus mulai bergerak");
assert.strictEqual(after[0] - before[0], 1);

/* posisi strip = (target % 10) * CELL; 9 -> 0 harus +1 langkah, bukan -9 */
const posOf = (t) => ((t % 10) + 10) % 10;
assert.strictEqual(posOf(9), 9);
assert.strictEqual(posOf(10), 0);
const forward = (posOf(10) - posOf(9) + 10) % 10;
assert.strictEqual(forward, 1, "9->0 adalah satu langkah maju");

/* lompatan besar dipotong dulu dalam putaran penuh (aturan `gap > 24`) */
const shortcut = (from, to) => {
  const gap = to - from;
  return Math.abs(gap) > 24 ? from + Math.round((gap - Math.sign(gap) * 24) / 10) * 10 : from;
};
assert.strictEqual(shortcut(0, 1000) % 10, 0, "shortcut mendarat di puluhan yang sama");

/* clamp qty */
const MAXQ = 999;
const clampQ = (v, a, b) => Math.min(b, Math.max(a, v));
assert.strictEqual(clampQ(1200, 0, MAXQ), MAXQ);
assert.strictEqual(clampQ(-3, 0, MAXQ), 0);

console.log("qty-carry: 6 assertions OK");
