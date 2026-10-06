import { test } from "node:test";
import assert from "node:assert/strict";
import { registerAccountSettings } from "../../directus/extensions/directus-extension-website-content/src/account-settings.js";
import registerOwnership, { assertOwnUser } from "../../directus/extensions/directus-extension-account-ownership/src/index.js";
const owner = { id: "actor", status: "active", is_admin: true, role: "admin-role", email: "owner@example.test", first_name: "Test", last_name: "Owner", tfa_enabled: true };
const valid = { first_name: "New", last_name: "Owner", email: owner.email, current_password: "CurrentTest#2026", new_password: "", otp: "123456" };
async function request(body, options = {}) {
  let status = 200, result;
  const writes = [], clears = [], verifies = [], creates = [];
  const profile = options.account === null ? null : { ...owner, ...options.account };
  const handlers = {};
  const database = { transaction: async callback => callback(database) };
  const services = {
    AuthenticationService: class { async verifyPassword(id, password) { verifies.push(id); if (password !== valid.current_password) throw Object.assign(new Error("never echo private input"), { code: "INVALID_CREDENTIALS" }); } },
    TFAService: class { async verifyOTP(id, otp) { assert.equal(id, owner.id); return otp === "123456"; } },
    UsersService: class {
      async updateOne(id, payload) { if (options.failure) throw options.failure; assertOwnUser([id], { user: owner.id, admin: true }); writes.push({ id, payload }); for (const field of ["email", "first_name", "last_name"]) if (field in payload) profile[field] = payload[field]; }
      async clearUserSessions(ids) { clears.push(ids); }
      async createOne(payload) { creates.push(payload); return "new-user"; }
    },
  };
  registerAccountSettings({ patch(_path, handler) { handlers.patch = handler; }, post(_path, handler) { handlers.post = handler; } }, { database, services, getSchema: async () => ({}) }, async () => profile);
  const response = { status(value) { status = value; return response; }, set() { return response; }, json(value) { result = value; return response; } };
  await handlers[options.method || "patch"]({ body, accountability: { user: owner.id, admin: true } }, response);
  return { status, result, writes, clears, verifies, creates };
}
test("Own profile updates target the authenticated user and preserve the session", async () => {
  const response = await request(valid);
  assert.equal(response.status, 200);
  assert.equal(response.writes[0].id, owner.id);
  assert.deepEqual(response.writes[0].payload, { first_name: "New" });
  assert.equal(response.clears.length, 0);
  assert.equal(response.result.data.credentials_changed, false);
});
test("Own email/password changes require confirmation and revoke only that account's sessions", async () => {
  const response = await request({ ...valid, email: "new@example.test", new_password: "NewTestPass#2026" });
  assert.equal(response.status, 200);
  assert.equal(response.result.data.credentials_changed, true);
  assert.deepEqual(response.clears, [[owner.id]]);
  assert.ok(!JSON.stringify(response.result).includes("NewTestPass#2026"));
});
test("Foreign identity, privilege and 2FA fields cannot be supplied", async () => {
  for (const field of ["id", "user_id", "role", "status", "tfa_secret", "policies"]) {
    const response = await request({ ...valid, [field]: "other-user" });
    assert.equal(response.status, 400, field);
    assert.equal(response.writes.length, 0);
  }
});
test("Inactive sessions, wrong password and missing/incorrect OTP never update a profile", async () => {
  assert.equal((await request(valid, { account: null })).status, 401);
  assert.equal((await request(valid, { account: { status: "suspended" } })).status, 401);
  assert.equal((await request(valid, { account: { is_admin: false } })).status, 403);
  for (const [body, status] of [[{ ...valid, current_password: "wrong" }, 403], [{ ...valid, otp: "654321" }, 400], [{ ...valid, otp: "" }, 400], [{ ...valid, new_password: "weak" }, 400]]) {
    const response = await request(body);
    assert.equal(response.status, status);
    assert.equal(response.writes.length, 0);
  }
});
test("Service errors never return password data and email collisions are clear", async () => {
  const failure = Object.assign(new Error("private-password-data"), { code: "FAILED_VALIDATION", extensions: { value: "private-password-data" } });
  const response = await request(valid, { failure });
  assert.equal(response.status, 400);
  assert.ok(!JSON.stringify(response.result).includes("private-password-data"));
  assert.equal((await request(valid, { failure: { code: "RECORD_NOT_UNIQUE" } })).status, 409);
});
test("Account ownership is enforced for native service updates/deletes, even full admins", () => {
  const filters = {};
  registerOwnership({ filter(name, callback) { filters[name] = callback; } });
  assert.doesNotThrow(() => assertOwnUser([owner.id], { user: owner.id, admin: true }));
  for (const keys of [["other-user"], [owner.id, "other-user"], []]) assert.throws(() => assertOwnUser(keys, { user: owner.id, admin: true }), error => error.code === "FORBIDDEN" && error.status === 403);
  assert.throws(() => filters["users.update"]({}, { keys: ["other-user"] }, { accountability: { user: owner.id, admin: true } }));
  assert.throws(() => filters["users.delete"](["other-user"], {}, { accountability: { user: owner.id, admin: true } }));
  assert.doesNotThrow(() => assertOwnUser(["system-user"], null));
});
test("New manager creation cannot choose identity, role or status", async () => {
  const body = { first_name: "Test", last_name: "Manager", email: "new@example.test", password: "NewTestPass#2026" };
  const response = await request(body, { method: "post" });
  assert.equal(response.status, 201);
  assert.equal(response.creates[0].role, owner.role);
  assert.equal(response.creates[0].status, "active");
  assert.equal((await request({ ...body, id: "other-user" }, { method: "post" })).status, 400);
  assert.equal((await request({ ...body, role: "different-role" }, { method: "post" })).status, 400);
});
