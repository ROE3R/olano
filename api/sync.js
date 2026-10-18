/**
 * POST /api/sync - terima transaksi offline dari klien (outbox drain).
 *
 * Kontrak:
 *   Header: Authorization: Bearer <deviceId>.<token> (WAJIB, HMAC)
 *   Body:   { deviceId: string, sales: Sale[] }
 *   Sale:   { uuid, items:[{id,name,qty,price}], total, method, ts }
 *   Res:    200 { ok, accepted[], duplicates[], failed[] }
 *
 * Guard:
 *   - Method POST saja (405 lainnya).
 *   - Ukuran body <= 256KB (413 bila lebih).
 *   - deviceId 8-64 char charset aman (400 bila tidak).
 *   - sales maks 500/request, tiap sale divalidasi + disanitasi + di-clamp.
 *   - Origin/referer harus dari host Olano sendiri (403 bila bukan) — mencegah
 *     endpoint dipakai dari situs pihak ketiga.
 *   - deviceId diambil dari token terverifikasi, bukan dari body (403 device_mismatch).
 *
 * Storage: SATU BLOB PER TRANSAKSI (sync/<deviceId>/<uuid>.json), allowOverwrite:false.
 *   - Idempoten alami: kiriman ulang -> blob sudah ada -> "duplicate", bukan galat.
 *   - Tanpa read-modify-write (tidak ada race antar tab/perangkat).
 *   - Akses Blob via OIDC (BLOB_STORE_ID), tanpa kredensial statis.
 */
const { put } = require("@vercel/blob");
const { rateLimit, clientIp } = require("./_ratelimit");
const dev = require("./_device");

const MAX_SALES_PER_REQUEST = 500;
const MAX_BODY_BYTES = 256 * 1024;
const MAX_ABS = 1e12;

function bad(res, code, msg) {
  res.status(code).json({ ok: false, error: msg });
}

function sanitize(sale) {
  if (!sale || typeof sale !== "object") return null;
  if (typeof sale.uuid !== "string" || !sale.uuid.trim()) return null;
  if (typeof sale.total !== "number" || !isFinite(sale.total) || sale.total < 0) return null;
  if (!Array.isArray(sale.items)) return null;
  const items = sale.items
    .filter((i) => i && typeof i === "object")
    .map((i) => ({
      id: String(i.id || "").slice(0, 64),
      name: String(i.name || "").slice(0, 120),
      qty: Math.max(0, Math.min(100000, Number(i.qty) || 0)),
      price: Math.max(0, Math.min(MAX_ABS, Number(i.price) || 0)),
    }));
  return {
    uuid: sale.uuid.slice(0, 64),
    items: items.slice(0, 100),
    total: Math.max(0, Math.min(MAX_ABS, Math.round(sale.total))),
    method: String(sale.method || "TUNAI").slice(0, 16),
    ts: Number(sale.ts) || Date.now(),
    receivedAt: Date.now(),
  };
}

function isAlreadyExists(err) {
  const msg = String((err && (err.message || err.code)) || "").toLowerCase();
  return (
    msg.includes("already exists") ||
    msg.includes("already_exists") ||
    msg.includes("blob_already_exists") ||
    msg.includes("precondition")
  );
}

/** Hanya boleh dipanggil dari halaman Olano sendiri. */
function originAllowed(req) {
  const self = String(req.headers.host || "");
  const refRaw = req.headers.origin || req.headers.referer || "";
  if (!refRaw) return true; // non-browser (curl/tes) — dilindungi kunci bila env diset
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
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return bad(res, 405, "method_not_allowed");
  }

  // Rate limit: 60 sync / menit per IP. Batch 100 transaksi -> 6000 tx/menit,
  // jauh di atas kebutuhan warung, tapi menahan klien rusak/abuse.
  const rl = rateLimit(`sync:${clientIp(req)}`, 60, 60_000);
  res.setHeader("X-RateLimit-Remaining", String(rl.remaining));
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    return bad(res, 429, "rate_limited");
  }

  if (!originAllowed(req)) return bad(res, 403, "origin_not_allowed");

  const clen = Number(req.headers["content-length"] || 0);
  if (clen > MAX_BODY_BYTES) return bad(res, 413, "payload_too_large");

  /* [SECURITY] deviceId TIDAK lagi dipercaya dari body. Harus terbukti
     lewat HMAC token. Gagal-tertutup bila secret belum diset. */
  if (!dev.configured()) return bad(res, 503, "device_secret_not_configured");
  const authedDevice = dev.verify(req);
  if (!authedDevice) return bad(res, 401, "unauthorized");

  let body = req.body;
  if (typeof body === "string") {
    if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) return bad(res, 413, "payload_too_large");
    try {
      body = JSON.parse(body);
    } catch {
      return bad(res, 400, "invalid_json");
    }
  }
  if (!body || typeof body !== "object") return bad(res, 400, "invalid_body");

  /* deviceId yang dipakai = dari token terverifikasi.
     Bila body menyebut deviceId lain, tolak (bukan abaikan diam-diam). */
  const deviceId = authedDevice;
  if (body.deviceId && String(body.deviceId) !== deviceId) {
    return bad(res, 403, "device_mismatch");
  }

  const incoming = Array.isArray(body.sales) ? body.sales.slice(0, MAX_SALES_PER_REQUEST) : [];
  if (incoming.length === 0) {
    return res.status(200).json({ ok: true, accepted: [], duplicates: [], failed: [], stored: 0 });
  }

  const clean = [];
  for (const s of incoming) {
    const v = sanitize(s);
    if (v) clean.push(v);
  }
  if (clean.length === 0) return bad(res, 400, "no_valid_sales");

  const accepted = [];
  const duplicates = [];
  const failed = [];

  /* Tulis paralel berbatas (8 sekaligus). Sebelumnya berurutan: 200 transaksi =
     puluhan detik dan bisa timeout di klien. */
  const CONCURRENCY = 8;
  for (let i = 0; i < clean.length; i += CONCURRENCY) {
    const chunk = clean.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      chunk.map(async (sale) => {
        const path = `sync/${deviceId}/${sale.uuid}.json`;
        try {
          await put(path, JSON.stringify(sale), {
            access: "private",
            contentType: "application/json",
            addRandomSuffix: false,
            allowOverwrite: false,
          });
          return { ok: true, uuid: sale.uuid };
        } catch (err) {
          return { ok: false, uuid: sale.uuid, dup: isAlreadyExists(err) };
        }
      })
    );
    for (const r of results) {
      if (r.ok) accepted.push(r.uuid);
      else if (r.dup) duplicates.push(r.uuid);
      else failed.push(r.uuid);
    }
  }

  return res.status(200).json({
    ok: failed.length === 0,
    accepted,
    duplicates,
    failed,
  });
};
