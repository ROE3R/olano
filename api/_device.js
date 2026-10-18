/**
 * Identitas perangkat bertanda tangan (HMAC) — PENGGANTI deviceId bebas.
 *
 * MASALAH YANG DIPERBAIKI
 * Sebelumnya deviceId adalah string acak yang dikirim klien apa adanya.
 * Siapa pun yang tahu/nebak deviceId bisa membaca seluruh transaksi warung
 * lewat GET /api/restore?deviceId=... — kebocoran data dagangan antar-pedagang.
 *
 * SOLUSI
 * Klien mendaftar sekali ke POST /api/device (mendapat deviceId + token).
 * Token = HMAC-SHA256(deviceId, OLANO_DEVICE_SECRET). Untuk sync/restore,
 * klien mengirim `Authorization: Bearer <deviceId>.<token>`.
 * Server memverifikasi HMAC dengan perbandingan waktu-konstan, lalu memakai
 * deviceId dari token — bukan dari parameter yang bisa dikarang.
 *
 * Tanpa OLANO_DEVICE_SECRET, semua endpoint menolak (503), bukan diam-diam
 * terbuka seperti perilaku OLANO_SYNC_KEY sebelumnya.
 */
const crypto = require("crypto");

const DEVICE_ID_RE = /^[A-Za-z0-9_-]{16,64}$/;

function secret() {
  return process.env.OLANO_DEVICE_SECRET || "";
}

function configured() {
  return secret().length >= 32;
}

function newDeviceId() {
  return "d-" + crypto.randomBytes(16).toString("base64url");
}

function sign(deviceId) {
  const s = secret();
  return crypto.createHmac("sha256", s).update(deviceId).digest("base64url");
}

function tokenFor(deviceId) {
  return deviceId + "." + sign(deviceId);
}

/** Verifikasi header Authorization. Mengembalikan deviceId atau null. */
function verify(req) {
  const raw = String(req.headers.authorization || "");
  const m = /^Bearer\s+(\S+)$/.exec(raw);
  if (!m) return null;
  const parts = m[1].split(".");
  if (parts.length !== 2) return null;
  const [deviceId, token] = parts;
  if (!DEVICE_ID_RE.test(deviceId)) return null;

  const expect = sign(deviceId);
  const a = Buffer.from(token);
  const b = Buffer.from(expect);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;
  return deviceId;
}

function bearerFor(bodyDeviceId) {
  // dipakai klien: bentuk header yang harus dikirim
  return "Bearer " + tokenFor(bodyDeviceId);
}

module.exports = {
  DEVICE_ID_RE,
  configured,
  newDeviceId,
  sign,
  tokenFor,
  verify,
  bearerFor,
};
