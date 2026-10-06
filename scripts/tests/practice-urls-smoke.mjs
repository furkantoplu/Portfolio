import assert from "node:assert/strict";
import { practiceSlug } from "../../frontend/app/lib/practice-slug.ts";
const base = process.env.TEST_SITE_URL || "http://localhost:8080";
const response = await fetch(`${base}/bakir-api/website-content/practice-areas?language=tr`);
assert.equal(response.status, 200);
const { data: areas } = await response.json();
for (const area of areas) {
  const derived = practiceSlug(area.title);
  assert.ok(area.slug === derived || area.slug.startsWith(`${derived}-${area.id}`), `URL alan adından türemeli: ${area.slug}`);
}
console.log("PASS public practice URLs are derived from the record names");
for (const oldSlug of process.argv.slice(2)) {
  const api = await fetch(`${base}/bakir-api/website-content/practice-areas/${encodeURIComponent(oldSlug)}?language=tr`);
  assert.equal(api.status, 200);
  const { data } = await api.json();
  const redirect = await fetch(`${base}/calisma-alanlari/${encodeURIComponent(oldSlug)}`, { redirect: "manual" });
  assert.equal(redirect.status, data.redirect_slug ? 308 : 200);
  if (data.redirect_slug) assert.equal(redirect.headers.get("location"), `/calisma-alanlari/${data.slug}`);
  console.log(`PASS old practice URL ${oldSlug}: ${redirect.status}`);
}
