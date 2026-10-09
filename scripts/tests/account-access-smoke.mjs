import assert from "node:assert/strict";
const base = process.env.TEST_SITE_URL || "http://localhost:8080";
const cases = [
  ["GET", "/users", 403], ["POST", "/users", 403], ["PATCH", "/users/test-only-id", 403],
  ["PATCH", "/users/me", 403], ["POST", "/users/test-only-id/tfa/disable", 403],
  ["POST", "/graphql", 403], ["PATCH", "/roles/test-only-id", 403],
  ["PATCH", "/items/directus_users/test-only-id", 403],
  ["PATCH", "/website-content/account-settings", 401], ["POST", "/website-content/admin-team", 401],
  ["POST", "/website-content/media-discard/12345678-1234-4234-8234-123456789abc", 401],
  ["DELETE", "/files/12345678-1234-4234-8234-123456789abc", 403],
  ["POST", "/users/me/tfa/generate", 401], ["POST", "/users/me/tfa/enable", 401],
];
for (const [method, path, status] of cases) {
  const response = await fetch(base + "/bakir-api" + path, { method, ...(method === "GET" ? {} : { headers: { "Content-Type": "application/json" }, body: "{}" }) });
  assert.equal(response.status, status, `${method} ${path}`);
  console.log(`PASS ${method} ${path}: ${status}`);
}
const html = await (await fetch(base + "/iletisim")).text();
assert.ok(html.indexOf('class="header-cta"') < html.indexOf('class="language-dropdown"'));
assert.ok(html.indexOf('class="mobile-menu"') < html.indexOf('class="language-dropdown"'));
console.log("PASS header language selector is last");
