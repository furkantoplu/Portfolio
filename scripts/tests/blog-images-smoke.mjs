import assert from "node:assert/strict";
const base = process.env.TEST_SITE_URL || "http://localhost:8080";
const response = await fetch(base + "/bakir-api/website-content/blog-posts?language=tr");
assert.equal(response.status, 200);
const { data: posts } = await response.json();
assert.ok(posts.length > 0, "En az bir yayınlanmış yazı gerekli");
for (const post of posts) {
  const detail = await fetch(`${base}/blog/${encodeURIComponent(post.slug)}`);
  assert.equal(detail.status, 200);
  const html = await detail.text();
  assert.equal(html.includes('class="article-cover"'), Boolean(post.cover_path) && post.section_visibility?.image !== false, `Kapak alanı admin kaydıyla eşleşmeli: ${post.slug}`);
  console.log(`PASS ${post.cover_path ? "with image" : "without image"}: ${post.slug}`);
}
const listing = await fetch(base + "/blog");
assert.equal(listing.status, 200);
const html = await listing.text();
const page = await (await fetch(base + '/bakir-api/website-content/pages/blog')).json();
const featured = page.data.content.section_visibility?.featured !== false;
const hasImage = Boolean(posts[0].cover_path) && posts[0].section_visibility?.image !== false;
assert.equal(html.includes('class="featured-article__image"'), featured && hasImage, "Öne çıkan kartta yalnızca görünür kayıtlı görsel gösterilmeli");
assert.equal(html.includes("featured-article--text-only"), featured && !hasImage, "Görselsiz öne çıkan kart tek kolon olmalı");
console.log("PASS featured article image visibility");
