/**
 * Auth server Olano — akun nyata, bukan localStorage.
 *
 * MASALAH YANG DIPERBAIKI
 * 1. Password di-hash FNV-1a 32-bit di browser. Itu bukan hash: 4 miliar
 *    kemungkinan, dan dengan salt 8 hex karakternya bahkan lebih kecil.
 *    Siapa pun yang menyalin localStorage bisa memecahkannya dalam hitungan detik.
 * 2. Tidak ada server. Ganti HP = akun hilang. Tidak ada reset password.
 *    Tidak mungkin menagih langganan karena tidak ada identitas.
 *
 * SOLUSI
 * - Password di-hash di server dengan scrypt (N=16384, r=8, p=1) + salt 16 byte.
 * - Sesi = cookie HttpOnly + SameSite=Lax, token acak 32 byte, disimpan sebagai
 *   hash SHA-256 di KV (token asli tidak pernah tersimpan).
 * - Akun disimpan di Vercel KV (Redis) bila tersedia; bila tidak, 503 jujur,
 *   bukan diam-diam kembali ke localStorage.
 */
const crypto = require("crypto");
const { rateLimit, clientIp } = require("./_ratelimit");

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };
const SESSION_TTL_MS = 30 * 24 * 3600 * 1000; // 30 hari
const COOKIE = "olano_session";

/* ---------- KV: pakai Upstash REST (Vercel KV) bila ada ---------- */
function kv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const tok = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !tok) return null;
  return { url, tok };
}
function kvConfigured() {
  return !!kv();
}
async function kvCmd(cmd) {
  const c = kv();
  if (!c) throw new Error("kv_not_configured");
  const r = await fetch(c.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${c.tok}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error("kv_http_" + r.status);
  const j = await r.json();
  return j.result;
}

/* ---------- password ---------- */
function scryptAsync(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p }, (err, dk) =>
      err ? reject(err) : resolve(dk)
    );
  });
}
async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const dk = await scryptAsync(password, salt);
  return `scrypt$${salt.toString("base64")}$${dk.toString("base64")}`;
}
async function verifyPassword(password, stored) {
  const p = String(stored || "").split("$");
  if (p.length !== 3 || p[0] !== "scrypt") return false;
  const salt = Buffer.from(p[1], "base64");
  const want = Buffer.from(p[2], "base64");
  const got = await scryptAsync(password, salt);
  if (got.length !== want.length) return false;
  return crypto.timingSafeEqual(got, want);
}

/* ---------- sesi ---------- */
function newSessionToken() {
  return crypto.randomBytes(32).toString("base64url");
}
function tokenHash(t) {
  return crypto.createHash("sha256").update(t).digest("hex");
}
function parseCookies(req) {
  const raw = String(req.headers.cookie || "");
  const out = {};
  raw.split(/;\s*/).forEach((kvp) => {
    const i = kvp.indexOf("=");
    if (i > 0) out[kvp.slice(0, i)] = decodeURIComponent(kvp.slice(i + 1));
  });
  return out;
}
function cookieHeader(token, maxAgeSec) {
  const parts = [
    `${COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${maxAgeSec}`,
  ];
  return parts.join("; ");
}
function clearCookieHeader() {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function normalizeUser(u) {
  return String(u || "").trim().toLowerCase();
}

module.exports = {
  kvConfigured,
  kvCmd,
  hashPassword,
  verifyPassword,
  newSessionToken,
  tokenHash,
  parseCookies,
  cookieHeader,
  clearCookieHeader,
  normalizeUser,
  SESSION_TTL_MS,
  COOKIE,
  rateLimit,
  clientIp,
};
