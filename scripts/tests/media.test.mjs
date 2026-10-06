import { test } from "node:test";
import assert from "node:assert/strict";
import { Readable, Writable } from "node:stream";
import { finished } from "node:stream/promises";
import { isPublicImage, imageTypes, registerMedia } from "../../directus/extensions/directus-extension-website-content/src/media.js";
const id = "12345678-1234-4234-8234-123456789abc";
const path = `/site-media/${id}`;
function database(tables) {
  return name => {
    let rows = [...(tables[name] || [])];
    const query = {
      where(filter, value) {
        if (typeof filter === "function") {
          const conditions = [];
          filter({ orWhereRaw(_sql, [key, value]) { conditions.push(row => row.content?.[key] === value); } });
          rows = rows.filter(row => conditions.some(condition => condition(row)));
        } else if (typeof filter === "string") rows = rows.filter(row => row[filter] === value);
        else rows = rows.filter(row => Object.entries(filter).every(([key, value]) => row[key] === value));
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

async function serveMedia(tables) {
  let handler, calls = 0, error;
  const chunks = [];
  const response = new Writable({ write(chunk, _encoding, callback) { chunks.push(Buffer.from(chunk)); callback(); } });
  response.statusCode = 200;
  response.headers = {};
  response.status = code => { response.statusCode = code; return response; };
  response.set = headers => { response.headers = { ...response.headers, ...headers }; return response; };
  response.json = () => response.end();
  const services = { AssetsService: class {
    async getAsset(assetId, options) {
      calls++;
      assert.equal(assetId, id);
      // Mirrors Directus 12's resolvePreset contract; the old {} call fails here.
      assert.deepEqual(options, { transformationParams: {} });
      return { stream: Readable.from(Buffer.from("image-bytes")), file: { type: "image/png" } };
    }
  } };
  registerMedia({ get(_path, callback) { handler = callback; } }, { database: database(tables), services, getSchema: async () => ({}) });
  await handler({ params: { id } }, response, err => { error = err; });
  if (error) throw error;
  await finished(response);
  return { calls, status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks).toString() };
}
test("Public referenced image streams successfully using the Directus transformation contract", async () => {
  const result = await serveMedia({ blog_posts: [{ status: "published", cover_path: path }], directus_files: [{ id, type: "image/png" }] });
  assert.equal(result.status, 200);
  assert.equal(result.calls, 1);
  assert.equal(result.body, "image-bytes");
  assert.equal(result.headers["Content-Type"], "image/png");
});
test("The streaming endpoint never invokes privileged AssetsService for private or unsafe files", async () => {
  for (const tables of [{ directus_files: [{ id, type: "image/png" }] }, { blog_posts: [{ status: "published", cover_path: path }], directus_files: [{ id, type: "image/svg+xml" }] }]) {
    const result = await serveMedia(tables);
    assert.equal(result.status, 404);
    assert.equal(result.calls, 0);
  }
});
