/**
 * GET /api/restore?deviceId=... - ambil kembali semua transaksi tersimpan untuk perangkat.
 *
 * Dipakai layar "Data & cadangan" -> "Pulihkan dari cloud": unduh semua transaksi yang
 * pernah tersinkron, untuk dipulihkan setelah HP hilang / ganti perangkat.
 *
 * Kontrak:
 *   Query: deviceId (wajib, 8-64 char charset aman)
 *   Header: x-olano-store-key (wajib bila env OLANO_SYNC_KEY diset)
 *   Res:   200 { ok, deviceId, count, sales: Sale[] }
 *
 * Guard: origin sama seperti /api/sync; batas 5000 transaksi per permintaan.
 */
const { get, list } = require("@vercel/blob");
const { rateLimit, clientIp } = require("./_ratelimit");

const MAX_DEVICE_ID = 64;
const MIN_DEVICE_ID = 8;
const MAX_SALES = 5000;

function bad(res, code, msg) {
  res.status(code).json({ ok: false, error: msg });
}

function originAllowed(req) {
  const self = String(req.headers.host || "");
  const refRaw = req.headers.origin || req.headers.referer || "";
  if (!refRaw) return true;
  try {
    const host = new URL(refRaw).host;
    if (!host) return false;
    if (host === self) return true;
    return /\.vercel\.app$/.test(host) || host === "olano.xyz" || host === "www.olano.xyz";
  } catch {
    return false;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return bad(res, 405, "method_not_allowed");
  }
  // Rate limit restore: 20/menit per IP (operasi berat: baca banyak blob).
  const rl = rateLimit(`restore:${clientIp(req)}`, 20, 60_000);
  res.setHeader("X-RateLimit-Remaining", String(rl.remaining));
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    return bad(res, 429, "rate_limited");
  }

  if (!originAllowed(req)) return bad(res, 403, "origin_not_allowed");

  const requiredKey = process.env.OLANO_SYNC_KEY;
  if (requiredKey) {
    const got = String(req.headers["x-olano-store-key"] || "");
    if (got !== requiredKey) return bad(res, 401, "unauthorized");
  }

  const deviceId = String((req.query && req.query.deviceId) || "").trim().slice(0, MAX_DEVICE_ID);
  if (deviceId.length < MIN_DEVICE_ID || !/^[A-Za-z0-9._:-]+$/.test(deviceId)) {
    return bad(res, 400, "invalid_device_id");
  }

  const prefix = `sync/${deviceId}/`;
  let blobs = [];
  try {
    let cursor;
    do {
      const page = await list({ prefix, limit: 1000, cursor });
      blobs = blobs.concat(page.blobs);
      cursor = page.cursor;
      if (blobs.length >= MAX_SALES) break;
    } while (cursor);
  } catch {
    return bad(res, 500, "storage_unavailable");
  }

  blobs = blobs.slice(0, MAX_SALES);

  const sales = [];
  // Baca paralel terbatas (8 sekaligus) supaya tidak membanjiri storage.
  for (let i = 0; i < blobs.length; i += 8) {
    const chunk = blobs.slice(i, i + 8);
    const results = await Promise.all(
      chunk.map(async (b) => {
        try {
          const r = await get(b.pathname, { access: "private" });
          if (!r || !r.stream) return null;
          const text = await new Response(r.stream).text();
          return JSON.parse(text);
        } catch {
          return null;
        }
      })
    );
    for (const s of results) if (s && s.uuid) sales.push(s);
  }

  sales.sort((a, b) => (a.ts || 0) - (b.ts || 0));

  return res.status(200).json({
    ok: true,
    deviceId,
    count: sales.length,
    sales,
  });
};
