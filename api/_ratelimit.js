/**
 * Rate limit in-memory per instance (sliding window).
 *
 * Keterbatasan yang harus jujur: serverless Vercel menjalankan banyak instance
 * dan instance bisa tidur, jadi batas ini PER-INSTANCE, bukan global. Untuk
 * penjaga awal (mencegah satu klien membanjiri satu instance) ini cukup dan
 * tanpa dependensi eksternal. Kalau nanti butuh batas global yang tegas,
 * pindah ke Vercel KV/Upstash (butuh store tambahan).
 *
 * Dipakai: POST /api/sync, GET /api/restore.
 */

const buckets = new Map();
const MAX_KEYS = 5000;

/**
 * @param {string} key   pengenal (mis. `sync:1.2.3.4`)
 * @param {number} limit jumlah maksimum permintaan dalam jendela
 * @param {number} windowMs panjang jendela (ms)
 * @returns {{ok: boolean, remaining: number, retryAfter: number}}
 */
function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  let b = buckets.get(key);

  if (!b || now - b.start >= windowMs) {
    b = { start: now, count: 0 };
    buckets.set(key, b);
  }

  b.count += 1;

  // jaga memori: buang entri yang jendelanya sudah lewat kalau map membesar
  if (buckets.size > MAX_KEYS) {
    for (const [k, v] of buckets) {
      if (now - v.start >= windowMs) buckets.delete(k);
      if (buckets.size <= MAX_KEYS) break;
    }
  }

  const ok = b.count <= limit;
  const retryAfter = ok ? 0 : Math.ceil((windowMs - (now - b.start)) / 1000);
  return { ok, remaining: Math.max(0, limit - b.count), retryAfter };
}

/** IP klien dari header proxy Vercel. */
function clientIp(req) {
  const xff = String(req.headers["x-forwarded-for"] || "");
  if (xff) return xff.split(",")[0].trim();
  return String(req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown");
}

module.exports = { rateLimit, clientIp };
