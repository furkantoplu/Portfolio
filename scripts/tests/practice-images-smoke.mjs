import assert from "node:assert/strict";
const base = process.env.TEST_SITE_URL || "http://localhost:8080";
const response = await fetch(`${base}/bakir-api/website-content/practice-areas?language=tr`);
assert.equal(response.status, 200);
const { data: areas } = await response.json();
assert.ok(areas.length, "Yayında bir çalışma alanı gerekli");
for (const area of areas) {
  const hasImage = Boolean(area.image_path) && area.section_visibility?.image !== false;
  const detail = await fetch(`${base}/calisma-alanlari/${encodeURIComponent(area.slug)}`);
  assert.equal(detail.status, 200);
  const html = await detail.text();
  const title = area.title.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
  assert.ok(html.includes(`<h1 id="detail-title">${title}</h1>`), `${area.slug}: ana başlık alan adıyla aynı olmalı`);
  assert.equal(html.includes('class="detail-hero__visual"'), hasImage, `${area.slug}: detay görseli kayıtla eşleşmeli`);
  assert.equal(html.includes("detail-hero--text-only"), !hasImage, `${area.slug}: görselsiz detay tek kolon olmalı`);
  if (hasImage) assert.ok(html.includes("object-fit:contain"), "Detay görseli kırpılmadan sığmalı");
  else assert.ok(!html.includes("hero-physiotherapy-v1.png"), "Görselsiz detay örnek fotoğraf kullanmamalı");
  console.log(`PASS practice detail ${area.slug}: ${area.image_path ? "contained image" : "no image"}`);
}
const listing = await fetch(base + "/calisma-alanlari");
assert.equal(listing.status, 200);
const listingHtml = await listing.text();
const page = await (await fetch(base + '/bakir-api/website-content/pages/areas')).json();
const visibleAreas = page.data.content.section_visibility?.listing === false ? [] : areas;
const withImages = visibleAreas.filter(area => Boolean(area.image_path) && area.section_visibility?.image !== false).length;
assert.equal((listingHtml.match(/class="content-card-image practice-card-image"/g) || []).length, withImages);
assert.equal((listingHtml.match(/<article class="practice-directory-card practice-directory-card--text-only"/g) || []).length, visibleAreas.length - withImages);
console.log("PASS practice directory: image-free cards have no media slot");
