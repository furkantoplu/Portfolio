import { test } from "node:test";
import assert from "node:assert/strict";
import { practiceSlug as clientSlug } from "../../frontend/app/lib/practice-slug.ts";
import { practiceSlug, resolvePracticeUrl } from "../../directus/extensions/directus-extension-website-content/src/practice-urls.js";
test("Practice title consistently generates the URL in admin and backend", () => {
  for (const [title, slug] of [["Postür Analizi", "postur-analizi"], ["  BEL & BOYUN Sağlığı! ", "bel-boyun-sagligi"], ["Straße / Übungen", "strasse-ubungen"], ["İıI ÇĞÖŞÜ café", "iii-cgosu-cafe"], ["😀", "calisma-alani"]]) {
    assert.equal(practiceSlug(title), slug);
    assert.equal(clientSlug(title), slug);
  }
  assert.ok(practiceSlug("A".repeat(500)).length <= 200);
});
const current = [{ id: 1, slug: "postur-analizi", title: "Postür Analizi" }];
const db = aliases => () => ({ where({ language, slug }) { return { first: async () => aliases.find(row => row.language === language && row.slug === slug) }; } });
test("Old practice URL redirects directly to the current published version", async () => {
  const aliases = [{ language: "tr", slug: "eski-ad", parent_id: 1 }];
  assert.deepEqual(await resolvePracticeUrl(db(aliases), current, "postur-analizi", "tr"), current[0]);
  assert.equal((await resolvePracticeUrl(db(aliases), current, "eski-ad", "tr")).redirect_slug, "postur-analizi");
  assert.equal(await resolvePracticeUrl(db(aliases), [], "eski-ad", "tr"), null);
  assert.equal(await resolvePracticeUrl(db(aliases), current, "eski-ad", "de"), null);
});
