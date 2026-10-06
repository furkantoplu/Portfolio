import assert from "node:assert/strict";
const base = process.env.TEST_SITE_URL || "http://localhost:8080";
const suppliedIds = process.argv.slice(2);
const ids = new Set(suppliedIds);
if (!suppliedIds.length) {
  const paths = ["practice-areas", "blog-posts", ...["home", "about", "contact", "areas", "blog"].map(key => "pages/" + key)];
  for (const path of paths) {
    const response = await fetch(`${base}/bakir-api/website-content/${path}?language=tr`);
    assert.equal(response.status, 200, path);
    const { data } = await response.json();
    const rows = Array.isArray(data) ? data : [data.content];
    for (const row of rows) for (const key of ["image_path", "cover_path", "hero_image", "about_image"]) {
      const value = row[key];
      if (typeof value === "string" && /^\/site-media\/[0-9a-f-]{36}$/i.test(value)) ids.add(value.split("/").pop());
    }
  }
}
function assertImage(bytes, type) {
  assert.ok(bytes.length > 20, "Görsel boş olmamalı");
  if (type === "image/png") assert.deepEqual(bytes.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  else if (type === "image/jpeg") assert.deepEqual(bytes.subarray(0, 3), Buffer.from([255, 216, 255]));
  else if (type === "image/webp") { assert.equal(bytes.toString("ascii", 0, 4), "RIFF"); assert.equal(bytes.toString("ascii", 8, 12), "WEBP"); }
  else assert.fail(`Beklenmeyen görsel tipi: ${type}`);
}
for (const id of ids) {
  const upstream = await fetch(`${base}/bakir-api/website-content/media/${id}`);
  assert.equal(upstream.status, 200, `Directus ${id}`);
  const original = Buffer.from(await upstream.arrayBuffer());
  const type = upstream.headers.get("content-type").split(";")[0];
  assertImage(original, type);
  const publicImage = await fetch(`${base}/site-media/${id}`);
  assert.equal(publicImage.status, 200, `Public ${id}`);
  const publicBytes = Buffer.from(await publicImage.arrayBuffer());
  assert.deepEqual(publicBytes, original, "Proxy gerçek dosyanın tüm baytlarını iletmeli");
  assertImage(publicBytes, publicImage.headers.get("content-type").split(";")[0]);
  const optimized = await fetch(`${base}/_next/image?url=${encodeURIComponent(`/site-media/${id}`)}&w=640&q=75`);
  assert.equal(optimized.status, 200, `Image component ${id}`);
  assertImage(Buffer.from(await optimized.arrayBuffer()), optimized.headers.get("content-type").split(";")[0]);
  console.log(`PASS uploaded media ${id}: Directus, public proxy and Image component`);
}
if (!ids.size) console.log("No published uploaded images found; streaming contract is covered by media.test.mjs.");
