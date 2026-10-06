import { test } from "node:test";
import assert from "node:assert/strict";
import { isPublicImage, imageTypes } from "../../directus/extensions/directus-extension-website-content/src/media.js";
const id = "12345678-1234-4234-8234-123456789abc";
const path = `/site-media/${id}`;
function database(tables) {
  return name => {
    let rows = [...(tables[name] || [])];
    const query = {
      where(filter) {
        if (typeof filter === "function") {
          const conditions = [];
          filter({ orWhereRaw(_sql, [key, value]) { conditions.push(row => row.content?.[key] === value); } });
          rows = rows.filter(row => conditions.some(condition => condition(row)));
        } else rows = rows.filter(row => Object.entries(filter).every(([key, value]) => row[key] === value));
        return query;
      },
      whereIn(key, values) { rows = rows.filter(row => values.includes(row[key])); return query; },
      first() { return Promise.resolve(rows[0]); },
    };
    return query;
  };
}
test("Media requires a valid UUID and never exposes unreferenced files", async () => {
  assert.equal(await isPublicImage(() => { throw Error("Database must not be called"); }, "../private"), false);
  assert.equal(await isPublicImage(database({}), id), false);
});
test("Only published blog and practice images can be accessed publicly", async () => {
  for (const [collection, field] of [["blog_posts", "cover_path"], ["practice_areas", "image_path"]]) {
    for (const status of ["draft", "hidden"]) assert.equal(await isPublicImage(database({ [collection]: [{ id: 1, status, [field]: path }] }), id), false);
    assert.equal(await isPublicImage(database({ [collection]: [{ id: 1, status: "published", [field]: path }] }), id), true);
  }
});
test("Page assets must belong to known page keys and image fields", async () => {
  assert.equal(await isPublicImage(database({ site_pages: [{ page_key: "home", content: { hero_image: path } }] }), id), true);
  assert.equal(await isPublicImage(database({ site_pages: [{ page_key: "private", content: { hero_image: path } }] }), id), false);
  assert.equal(await isPublicImage(database({ site_pages: [{ page_key: "home", content: { arbitrary_file: path } }] }), id), false);
  assert.equal(imageTypes.has("image/svg+xml"), false);
});
