/**
 * POST /api/device - daftarkan perangkat baru, terima deviceId + token.
 *
 * Res: 200 { ok, deviceId, token }
 *
 * Token TIDAK disimpan di server (stateless HMAC). Klien menyimpannya di
 * localStorage dan mengirimnya sebagai `Authorization: Bearer <deviceId>.<token>`.
 *
 * Kenapa stateless: tidak butuh database, tidak ada baris yatim, dan token
 * tidak bisa ditebak tanpa OLANO_DEVICE_SECRET. Batasannya jujur: token tidak
 * bisa dicabut per perangkat. Kalau nanti butuh pencabutan, pindah ke KV.
 */
const crypto = require("crypto");
const { rateLimit, clientIp } = require("./_ratelimit");
const dev = require("./_device");

function bad(res, code, msg, extra) {
  res.status(code).json({ ok: false, error: msg, ...(extra || {}) });
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
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return bad(res, 405, "method_not_allowed");
  }

  const rl = rateLimit(`device:${clientIp(req)}`, 10, 60_000);
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    return bad(res, 429, "rate_limited");
  }

  if (!originAllowed(req)) return bad(res, 403, "origin_not_allowed");

  if (!dev.configured()) {
    // Gagal-tertutup, bukan gagal-terbuka.
    return bad(res, 503, "device_secret_not_configured");
  }

  const deviceId = dev.newDeviceId();
  return res.status(200).json({
    ok: true,
    deviceId,
    token: dev.tokenFor(deviceId),
    note: "Simpan token ini. Tanpa token, data perangkat ini tidak bisa diakses.",
  });
};
