/**
 * POST /api/sync - terima transaksi offline dari klien (outbox drain).
 *
 * Kontrak:
 *   Body: { deviceId: string, sales: Sale[] }
 *   Sale: { uuid, items:[{id,name,qty,price}], total, method, ts }
 *   Res:  200 { ok:true, accepted:[uuid], duplicates:[uuid], stored:n }
 *
 * Desain: SATU BLOB PER TRANSAKSI (sync/<deviceId>/<uuid>.json), allowOverwrite:false.
 *   - Idempoten alami: kiriman ulang -> blob sudah ada -> dihitung "duplicate", bukan galat.
 *   - Tanpa read-modify-write (tidak ada race antar dua perangkat / dua tab).
 *   - Akses Blob via OIDC (BLOB_STORE_ID), tanpa kredensial statis.
 */
const { put, list } = require("@vercel/blob");

const MAX_SALES_PER_REQUEST = 500;
const MAX_DEVICE_ID = 64;

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
      qty: Math.max(0, Number(i.qty) || 0),
      price: Math.max(0, Number(i.price) || 0),
    }));
  return {
    uuid: sale.uuid.slice(0, 64),
    items: items.slice(0, 100),
    total: Math.round(sale.total),
    method: String(sale.method || "TUNAI").slice(0, 16),
    ts: Number(sale.ts) || Date.now(),
    receivedAt: Date.now(),
  };
}

function isAlreadyExists(err) {
  const msg = String((err && (err.message || err.code)) || "").toLowerCase();
  return msg.includes("already exists") || msg.includes("already_exists") || msg.includes("blob_already_exists");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return bad(res, 405, "method_not_allowed");
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return bad(res, 400, "invalid_json");
    }
  }
  if (!body || typeof body !== "object") return bad(res, 400, "invalid_body");

  const deviceId = String(body.deviceId || "").trim().slice(0, MAX_DEVICE_ID);
  if (!deviceId || !/^[A-Za-z0-9._:-]+$/.test(deviceId)) {
    return bad(res, 400, "invalid_device_id");
  }

  const incoming = Array.isArray(body.sales) ? body.sales.slice(0, MAX_SALES_PER_REQUEST) : [];
  if (incoming.length === 0) {
    return res.status(200).json({ ok: true, accepted: [], duplicates: [], stored: 0 });
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
