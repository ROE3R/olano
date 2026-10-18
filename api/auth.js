/**
 * POST /api/auth?action=register|login|logout  GET ?action=me
 *
 * Akun nyata di server. Password di-hash scrypt, sesi cookie HttpOnly.
 *
 * Res register/login: 200 { ok, user: { username, store } }  + Set-Cookie
 * Res me:             200 { ok, user }  atau  401 { ok:false, error:"no_session" }
 */
const A = require("./_auth");

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

const ACC = (u) => `olano:acc:${u}`;
const SESS = (h) => `olano:sess:${h}`;

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (!originAllowed(req)) return bad(res, 403, "origin_not_allowed");
  if (!A.kvConfigured()) return bad(res, 503, "auth_store_not_configured");

  const action = String((req.query && req.query.action) || "").toLowerCase();

  /* ---------------- me: siapa saya ---------------- */
  if (req.method === "GET" && action === "me") {
    const token = A.parseCookies(req)[A.COOKIE];
    if (!token) return bad(res, 401, "no_session");
    const raw = await A.kvCmd(["GET", SESS(A.tokenHash(token))]);
    if (!raw) return bad(res, 401, "session_expired");
    try {
      return res.status(200).json({ ok: true, user: JSON.parse(raw) });
    } catch {
      return bad(res, 401, "session_expired");
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return bad(res, 405, "method_not_allowed");
  }

  /* ---------------- logout ---------------- */
  if (action === "logout") {
    const token = A.parseCookies(req)[A.COOKIE];
    if (token) {
      try { await A.kvCmd(["DEL", SESS(A.tokenHash(token))]); } catch {}
    }
    res.setHeader("Set-Cookie", A.clearCookieHeader());
    return res.status(200).json({ ok: true });
  }

  /* ---------------- register / login ---------------- */
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return bad(res, 400, "invalid_json"); }
  }
  if (!body || typeof body !== "object") return bad(res, 400, "invalid_body");

  const username = A.normalizeUser(body.username);
  const password = String(body.password || "");
  const store = String(body.store || "").trim().slice(0, 60);

  const rl = A.rateLimit(`auth:${action}:${A.clientIp(req)}`, 12, 60_000);
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    return bad(res, 429, "rate_limited");
  }

  if (!/^[a-z0-9._-]{3,32}$/.test(username)) return bad(res, 400, "invalid_username");
  if (password.length < 8) return bad(res, 400, "password_too_short");

  if (action === "register") {
    const exists = await A.kvCmd(["EXISTS", ACC(username)]);
    if (exists) return bad(res, 409, "username_taken");

    const hash = await A.hashPassword(password);
    const rec = {
      username,
      store: store || "Toko Saya",
      hash,
      createdAt: Date.now(),
    };
    /* NX: dua pendaftaran bersamaan tidak boleh saling menimpa */
    const set = await A.kvCmd(["SET", ACC(username), JSON.stringify(rec), "NX"]);
    if (set === null) return bad(res, 409, "username_taken");

    const token = A.newSessionToken();
    await A.kvCmd(["SET", SESS(A.tokenHash(token)), JSON.stringify({ username, store: rec.store }), "PX", A.SESSION_TTL_MS]);
    res.setHeader("Set-Cookie", A.cookieHeader(token, Math.floor(A.SESSION_TTL_MS / 1000)));
    return res.status(200).json({ ok: true, user: { username, store: rec.store } });
  }

  if (action === "login") {
    const raw = await A.kvCmd(["GET", ACC(username)]);
    /* Selalu jalankan scrypt walau akun tidak ada, supaya waktu respons tidak
       membocorkan username mana yang terdaftar (timing enumeration). */
    const dummy = "scrypt$AAAAAAAAAAAAAAAAAAAAAA==$" + Buffer.alloc(64).toString("base64");
    const okPass = await A.verifyPassword(password, raw ? JSON.parse(raw).hash : dummy);
    if (!raw || !okPass) return bad(res, 401, "invalid_credentials");

    const rec = JSON.parse(raw);
    const token = A.newSessionToken();
    await A.kvCmd(["SET", SESS(A.tokenHash(token)), JSON.stringify({ username: rec.username, store: rec.store }), "PX", A.SESSION_TTL_MS]);
    res.setHeader("Set-Cookie", A.cookieHeader(token, Math.floor(A.SESSION_TTL_MS / 1000)));
    return res.status(200).json({ ok: true, user: { username: rec.username, store: rec.store } });
  }

  return bad(res, 400, "unknown_action");
};
