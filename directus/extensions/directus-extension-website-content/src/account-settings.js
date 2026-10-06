const profileFields = new Set(["first_name", "last_name", "email", "new_password", "current_password", "otp"]);
const teamFields = new Set(["first_name", "last_name", "email", "password"]);
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/;
function fail(response, status, code, message) { return response.status(status).json({ errors: [{ message, extensions: { code } }] }); }
function validObject(body, allowed) { return body && typeof body === "object" && !Array.isArray(body) && Object.keys(body).every(key => allowed.has(key)); }
function safeServiceError(response, error) {
  if (error?.code === "RECORD_NOT_UNIQUE" || error?.code === "23505") return fail(response, 409, "RECORD_NOT_UNIQUE", "Bu e-posta adresi zaten kullanılıyor.");
  if (error?.code === "INVALID_CREDENTIALS") return fail(response, 403, error.code, "Mevcut parola doğru değil.");
  if (error?.code === "FORBIDDEN") return fail(response, 403, error.code, "Bu hesap için işlem yetkisi yok.");
  if (["FAILED_VALIDATION", "INVALID_PAYLOAD"].includes(error?.code)) return fail(response, 400, error.code, "E-posta ve parola kurallarını kontrol edin.");
  return fail(response, 500, "ACCOUNT_UPDATE_FAILED", "İşlem tamamlanamadı. Bağlantıyı kontrol edip tekrar deneyin.");
}
export function registerAccountSettings(router, context, adminAccount) {
  const { database, services, getSchema } = context;
  router.patch("/account-settings", async (request, response) => {
    try {
      const id = request.accountability?.user;
      const account = await adminAccount(database, id);
      if (!account || account.status !== "active") return fail(response, 401, "UNAUTHORIZED", "Oturum gerekli.");
      if (!account.is_admin) return fail(response, 403, "FORBIDDEN", "Yönetici yetkisi gerekli.");
      const body = request.body;
      if (!validObject(body, profileFields)) return fail(response, 400, "INVALID_PAYLOAD", "Yalnızca kendi profil alanlarınızı değiştirebilirsiniz.");
      if (typeof body.current_password !== "string" || !body.current_password || body.current_password.length > 1024) return fail(response, 400, "INVALID_PAYLOAD", "Mevcut parolanızı girin.");
      const payload = {};
      for (const field of ["first_name", "last_name"]) if (field in body) {
        if (typeof body[field] !== "string" || body[field].length > 50) return fail(response, 400, "INVALID_PAYLOAD", "Ad ve soyad en fazla 50 karakter olabilir.");
        if ((body[field].trim() || null) !== account[field]) payload[field] = body[field].trim() || null;
      }
      if ("email" in body) {
        if (typeof body.email !== "string" || body.email.length > 128 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) return fail(response, 400, "INVALID_PAYLOAD", "En fazla 128 karakterlik geçerli bir e-posta girin.");
        const email = body.email.trim().toLowerCase();
        if (email.length > 128) return fail(response, 400, "INVALID_PAYLOAD", "E-posta adresi en fazla 128 karakter olabilir.");
        if (email !== account.email.toLowerCase()) payload.email = email;
      }
      if ("new_password" in body && typeof body.new_password !== "string") return fail(response, 400, "INVALID_PAYLOAD", "Yeni parola metin olmalı.");
      if (body.new_password) {
        if (typeof body.new_password !== "string" || body.new_password.length > 128 || !strongPassword.test(body.new_password)) return fail(response, 400, "FAILED_VALIDATION", "Yeni parola 10–128 karakter; büyük/küçük harf, rakam ve sembol içermeli.");
        payload.password = body.new_password;
      }
      const options = { schema: await getSchema(), accountability: request.accountability, knex: database };
      await new services.AuthenticationService(options).verifyPassword(id, body.current_password);
      if (account.tfa_enabled && (typeof body.otp !== "string" || !/^\d{6}$/.test(body.otp) || !await new services.TFAService(options).verifyOTP(id, body.otp))) return fail(response, 400, "INVALID_OTP", "Güncel 6 haneli doğrulama kodunu girin.");
      const credentialsChanged = Boolean(payload.email || payload.password);
      if (Object.keys(payload).length) await database.transaction(async trx => {
        const users = new services.UsersService({ ...options, knex: trx });
        // Target is exclusively the authenticated session, never a caller-supplied ID.
        await users.updateOne(id, payload);
        if (credentialsChanged) await users.clearUserSessions([id]);
      });
      const updated = await adminAccount(database, id);
      response.set("Cache-Control", "no-store").json({ data: { account: updated, credentials_changed: credentialsChanged } });
    } catch (error) { safeServiceError(response, error); }
  });
  router.post("/admin-team", async (request, response) => {
    try {
      const account = await adminAccount(database, request.accountability?.user);
      if (!account || account.status !== "active") return fail(response, 401, "UNAUTHORIZED", "Oturum gerekli.");
      if (!account.is_admin || !account.role) return fail(response, 403, "FORBIDDEN", "Yönetici yetkisi gerekli.");
      const body = request.body;
      if (!validObject(body, teamFields) || typeof body.password !== "string" || body.password.length > 128 || !strongPassword.test(body.password)) return fail(response, 400, "INVALID_PAYLOAD", "Yeni yönetici bilgilerini ve parola kurallarını kontrol edin.");
      const payload = { role: account.role, status: "active", password: body.password };
      for (const key of ["first_name", "last_name", "email"]) {
        if (typeof body[key] !== "string" || !body[key].trim() || body[key].length > (key === "email" ? 128 : 50)) return fail(response, 400, "INVALID_PAYLOAD", "Ad/soyad en fazla 50, e-posta en fazla 128 karakter olmalı.");
        payload[key] = body[key].trim();
      }
      const users = new services.UsersService({ schema: await getSchema(), accountability: request.accountability, knex: database });
      const id = await users.createOne(payload);
      response.status(201).set("Cache-Control", "no-store").json({ data: { id } });
    } catch (error) { safeServiceError(response, error); }
  });
}
