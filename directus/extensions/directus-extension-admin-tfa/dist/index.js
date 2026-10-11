// Native authentication runs before routes.before; JWTs here are already verified by Directus.
import { AsyncLocalStorage } from "node:async_hooks";
const requestScope = new AsyncLocalStorage();
const epochClaim = "website_tfa_epoch";
const setupRoutes = new Set([
  "GET /website-content/admin-account", "HEAD /website-content/admin-account",
  "POST /users/me/tfa/generate", "POST /users/me/tfa/enable",
  "POST /auth/login", "POST /auth/logout",
]);
export function canonicalPath(path) { return String(path).toLowerCase().replace(/\/+$/, "") || "/"; }
export function proofFromToken(token, user) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    return payload.id === user && typeof payload[epochClaim] === "string" ? payload[epochClaim] : null;
  } catch { return null; }
}
function fail(code, message) {
  const error = new Error(message);
  error.name = "DirectusError"; error.code = code; error.status = 403; error.extensions = {};
  return error;
}
async function readUser(database, id, token = null) {
  return database("directus_users").select("id", "status", epochClaim,
    database.raw("tfa_secret IS NOT NULL AND tfa_secret <> '' AS tfa_enabled"),
    database.raw("token IS NOT NULL AND token = ? AS static_match", [token]))
    .where("id", id).first();
}
export function verifiedState(account, token, user) {
  return Boolean(user?.status === "active" && user.tfa_enabled && typeof user[epochClaim] === "string"
    && (user.static_match === true || proofFromToken(token || "", account.user) === user[epochClaim]));
}
export function createTfaMiddleware(database, scope = requestScope) {
  return async (request, _response, next) => {
    try {
      const account = request.accountability;
      if (!account) return next();
      const proceed = () => scope.run(Object.freeze({ user: account.user, epoch: account[epochClaim], login: account.website_tfa_login }), () => next());
      const route = `${request.method} ${canonicalPath(request.path)}`;
      // Capture the enrollment version BEFORE native login reads/verifies the user.
      // Comparing it at auth.jwt prevents password-only login/2FA-enrollment races.
      account.website_tfa_login = null;
      account[epochClaim] = null;
      if (route === "POST /auth/login" && typeof request.body?.email === "string" && request.body.email.length <= 128) {
        account.website_tfa_login = await database("directus_users").select("id", epochClaim,
          database.raw("tfa_secret IS NOT NULL AND tfa_secret <> '' AS tfa_enabled"))
          .whereRaw("LOWER(email) = ?", [request.body.email.trim().toLowerCase()]).first() || null;
      }
      if (!account.admin) return proceed();
      const user = await readUser(database, account.user, request.token || null);
      if (!user || user.status !== "active") throw fail("FORBIDDEN", "Yönetici oturumu geçerli değil.");
      const verified = verifiedState(account, request.token, user);
      account[epochClaim] = verified ? user[epochClaim] : null;
      if (verified || setupRoutes.has(route) || (!user.tfa_enabled && route === "POST /auth/refresh")) return proceed();
      throw fail(user.tfa_enabled ? "TFA_LOGIN_REQUIRED" : "TFA_SETUP_REQUIRED",
        user.tfa_enabled ? "Authenticator kodunuzla yeniden giriş yapın." : "İçerik yönetimi için Authenticator kurulumunu tamamlayın.");
    } catch (error) { next(error); }
  };
}
export function createJwtFilter(database, getScope = () => requestScope.getStore()) {
  return async (payload, meta) => {
    const claims = { ...payload, [epochClaim]: null };
    if (!payload.admin_access) return claims;
    const user = await readUser(database, meta.user);
    if (!user || user.status !== "active") throw fail("FORBIDDEN", "Yönetici oturumu geçerli değil.");
    if (!user.tfa_enabled) return claims; // Password-verified setup-only session.
    // Native login/refresh create a NEW accountability object, discarding req.accountability.
    // AsyncLocalStorage retains only server-verified evidence for this specific HTTP request.
    const scope = getScope();
    const login = scope?.login;
    const verified = meta.type === "login"
      ? login?.id === meta.user && login.tfa_enabled === true && login[epochClaim] === user[epochClaim]
      : meta.type === "refresh" && scope?.user === meta.user && scope.epoch === user[epochClaim];
    if (!verified) throw fail("TFA_LOGIN_REQUIRED", "Authenticator kodunuzla yeniden giriş yapın.");
    claims[epochClaim] = user[epochClaim];
    return claims;
  };
}
export default ({ init, filter }, { database }) => {
  init("routes.before", ({ app }) => app.use(createTfaMiddleware(database)));
  filter("auth.jwt", createJwtFilter(database));
};
