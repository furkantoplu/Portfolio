import { test } from "node:test";
import assert from "node:assert/strict";
import { language, translateItems, translatePage, registerTranslations } from "../../directus/extensions/directus-extension-website-content/src/translations.js";

function databaseFixture(tables) {
  return name => {
    let rows = [...(tables[name] || [])];
    const query = {
      where(key, value) { rows = rows.filter(row => typeof key === "object" ? Object.entries(key).every(([field, expected]) => row[field] === expected) : row[key] === value); return query; },
      whereIn(key, values) { rows = rows.filter(row => values.includes(row[key])); return query; },
      first() { return Promise.resolve(rows[0]); },
      then(resolve) { return Promise.resolve(rows).then(resolve); },
    };
    return query;
  };
}
const items = [{ id: 1, title: "Türkçe başlık", slug: "turkce", image_path: "/shared.png" }, { id: 2, title: "İkinci kayıt", slug: "ikinci" }];
const versions = [
  { collection: "practice_areas", parent_id: 1, language: "en", status: "published", slug: "english", content: { title: "English title", summary: "English summary", image_path: "/forbidden.png", status: "hidden" } },
  { collection: "practice_areas", parent_id: 1, language: "de", status: "draft", slug: "german", content: { title: "German draft" } },
  { collection: "practice_areas", parent_id: 2, language: "en", status: "hidden", slug: "hidden", content: { title: "Hidden translation" } },
];

test("Only supported visitor languages are accepted", () => {
  assert.equal(language({ query: {} }), "tr");
  assert.equal(language({ query: { language: "de" } }), "de");
  assert.equal(language({ query: { language: "fr" } }), null);
  assert.equal(language({ query: { language: ["en", "de"] } }), null);
});
test("Only published translations are public and shared fields cannot be overridden", async () => {
  const db = databaseFixture({ website_content_translations: versions });
  const english = await translateItems(db, "practice_areas", items, "en");
  assert.equal(english.length, 1);
  assert.equal(english[0].title, "English title");
  assert.equal(english[0].image_path, "/shared.png");
  assert.equal(english[0].status, undefined);
  assert.deepEqual(english[0].language_slugs, { tr: "turkce", en: "english" });
  assert.deepEqual(await translateItems(db, "practice_areas", items, "de"), []);
  assert.equal((await translateItems(db, "practice_areas", items, "tr")).length, 2);
});
test("An orphaned translation never creates a public item", async () => {
  assert.deepEqual(await translateItems(databaseFixture({ website_content_translations: versions }), "practice_areas", [], "en"), []);
});
test("Translated pages preserve phone and email from the shared record", async () => {
  const page = { id: 3, content: { phone_display: "+90 555", email: "shared@example.test" } };
  const db = databaseFixture({ website_content_translations: [{ collection: "site_pages", parent_id: 3, language: "en", status: "published", content: { hero_title: "Contact", phone_display: "forbidden", email: "forbidden" } }] });
  const result = await translatePage(db, page, "en");
  assert.equal(result.content.phone_display, "+90 555");
  assert.equal(result.content.email, "shared@example.test");
  assert.equal(result.content.hero_title, "Contact");
  assert.equal(await translatePage(db, page, "de"), null);
});

async function requestRoute(method, account, params, body) {
  const handlers = {};
  const router = { get(path, handler) { handlers.get = handler; }, patch(path, handler) { handlers.patch = handler; } };
  registerTranslations(router, databaseFixture({ practice_areas: [{ id: 1 }] }), async () => account);
  let status = 200, payload;
  const response = { status(value) { status = value; return response; }, set() { return response; }, json(value) { payload = value; return response; } };
  await handlers[method]({ accountability: { user: "test" }, params, body }, response, error => { throw error; });
  return { status, payload };
}
const params = { collection: "practice_areas", parentId: "1", language: "en" };
test("Translation reads and writes require an active administrator", async () => {
  for (const method of ["get", "patch"]) {
    assert.equal((await requestRoute(method, null, params)).status, 401);
    assert.equal((await requestRoute(method, { status: "suspended", is_admin: true }, params)).status, 401);
    assert.equal((await requestRoute(method, { status: "active", is_admin: false }, params)).status, 403);
  }
});
test("Published translations require complete basic fields and safe slugs", async () => {
  const account = { status: "active", is_admin: true };
  assert.equal((await requestRoute("patch", account, params, { status: "published", slug: "", content: {} })).status, 400);
  assert.equal((await requestRoute("patch", account, params, { status: "draft", slug: "../admin", content: {} })).status, 400);
  assert.equal((await requestRoute("patch", account, { ...params, collection: "directus_users" }, { status: "draft", content: {} })).status, 400);
});
