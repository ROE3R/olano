/**
 * POST /api/sync - terima transaksi offline dari klien (outbox drain).
 *
 * Kontrak:
 *   Header: x-olano-store-key (wajib bila env OLANO_SYNC_KEY diset)
 *   Body:   { deviceId: string, sales: Sale[] }
 *   Sale:   { uuid, items:[{id,name,qty,price}], total, method, ts }
 *   Res:    200 { ok, accepted[], duplicates[], failed[], stored }
 *
 * Guard:
 *   - Method POST saja (405 lainnya).
 *   - Ukuran body <= 256KB (413 bila lebih).
 *   - deviceId 8-64 char charset aman (400 bila tidak).
 *   - sales maks 500/request, tiap sale divalidasi + disanitasi + di-clamp.
 *   - Origin/referer harus dari host Olano sendiri (403 bila bukan) — mencegah
 *     endpoint dipakai dari situs pihak ketiga.
 *   - Optional shared key via env OLANO_SYNC_KEY (401 bila tidak cocok).
 *
 * Storage: SATU BLOB PER TRANSAKSI (sync/<deviceId>/<uuid>.json), allowOverwrite:false.
 *   - Idempoten alami: kiriman ulang -> blob sudah ada -> "duplicate", bukan galat.
 *   - Tanpa read-modify-write (tidak ada race antar tab/perangkat).
 *   - Akses Blob via OIDC (BLOB_STORE_ID), tanpa kredensial statis.
 */
const { put, list } = require("@vercel/blob");

const MAX_SALES_PER_REQUEST = 500;
const MAX_BODY_BYTES = 256 * 1024;
const MAX_DEVICE_ID = 64;
const MIN_DEVICE_ID = 8;
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

  if (!originAllowed(req)) return bad(res, 403, "origin_not_allowed");

  const clen = Number(req.headers["content-length"] || 0);
  if (clen > MAX_BODY_BYTES) return bad(res, 413, "payload_too_large");

  const requiredKey = process.env.OLANO_SYNC_KEY;
  if (requiredKey) {
    const got = String(req.headers["x-olano-store-key"] || "");
    if (got !== requiredKey) return bad(res, 401, "unauthorized");
  }

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

  const deviceId = String(body.deviceId || "").trim().slice(0, MAX_DEVICE_ID);
  if (deviceId.length < MIN_DEVICE_ID || !/^[A-Za-z0-9._:-]+$/.test(deviceId)) {
    return bad(res, 400, "invalid_device_id");
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

  for (const sale of clean) {
    const path = `sync/${deviceId}/${sale.uuid}.json`;
    try {
      await put(path, JSON.stringify(sale), {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: false,
      });
      accepted.push(sale.uuid);
    } catch (err) {
      if (isAlreadyExists(err)) duplicates.push(sale.uuid);
      else failed.push(sale.uuid);
    }
  }

  // Hitung total tersimpan hanya kalau ada yang diterima (biaya list minimal).
  let stored = null;
  if (accepted.length > 0) {
    try {
      let cursor;
      let n = 0;
      do {
        const page = await list({ prefix: `sync/${deviceId}/`, limit: 1000, cursor });
        n += page.blobs.length;
        cursor = page.cursor;
      } while (cursor);
      stored = n;
    } catch {
      stored = null;
    }
  }

  return res.status(200).json({
    ok: failed.length === 0,
    accepted,
    duplicates,
    failed,
    stored,
  });
};
