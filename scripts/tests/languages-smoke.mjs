import assert from "node:assert/strict";
const base = process.env.TEST_SITE_URL || "http://localhost:8080";
const pages = {
  tr: ["/", "/hakkimda", "/iletisim", "/blog", "/calisma-alanlari", "/bakir"],
  en: ["/en", "/en/about", "/en/contact", "/en/blog", "/en/practice-areas"],
  de: ["/de", "/de/ueber-mich", "/de/kontakt", "/de/blog", "/de/behandlungsbereiche"],
};
for (const [locale, paths] of Object.entries(pages)) {
  for (const path of paths) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, new RegExp(`<html[^>]+lang="${locale}"`), path);
    if (path !== "/bakir") {
      assert.match(html, /hrefLang|hreflang/, `${path}: language alternatives`);
      assert.match(html, /rel="canonical"/, `${path}: canonical`);
      assert.match(html, /class="language-dropdown__trigger"/, `${path}: language selection`);
    }
    console.log(`PASS ${locale} ${path}`);
  }
}
for (const [path, expected] of [["/en/not-a-page", 404], ["/de/blog/not-a-post", 404], ["/bakir-api/website-content/translations/practice_areas/1/en", 401], ["/bakir-api/website-content/practice-areas?language=fr", 400], ["/site-media/invalid", 404], ["/site-media/12345678-1234-4234-8234-123456789abc", 404]]) {
  const response = await fetch(base + path);
  assert.equal(response.status, expected, path);
  console.log(`PASS ${expected} ${path}`);
}
const sitemap = await fetch(base + "/sitemap.xml");
assert.equal(sitemap.status, 200);
const xml = await sitemap.text();
assert.match(xml, /\/en\/about/);
assert.match(xml, /\/de\/ueber-mich/);
assert.match(xml, /hreflang="en"/);
assert.match(xml, /hreflang="de"/);
console.log("PASS sitemap language alternatives");
