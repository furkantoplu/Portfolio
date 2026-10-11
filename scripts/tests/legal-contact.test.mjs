import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = async path => readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("public legal pages identify the owner and do not display draft copy", async () => {
  const files = await Promise.all([
    "frontend/app/gizlilik/page.tsx",
    "frontend/app/kvkk-aydinlatma-metni/page.tsx",
    "frontend/app/components/legal-document.tsx",
  ].map(source));
  for (const content of files) assert.doesNotMatch(content, /taslak|yayın öncesinde/i);
  assert.match(files[0], /toplu\.furkan0220@gmail\.com/);
  assert.match(files[1], /Fizyoterapist Furkan Toplu/);
  assert.match(files[1], /Cloudflare/);
  assert.match(files[1], /Kanada/);
  assert.match(files[1], /5\/2\(f\)/);
});

test("verified contact migration preserves the user's visibility settings", async () => {
  const migration = await source("scripts/migrations/013-verified-contact-remote.sql");
  assert.match(migration, /\+905522903902/);
  assert.match(migration, /toplu\.furkan0220@gmail\.com/);
  assert.doesNotMatch(migration, /jsonb_build_object\([^)]*section_visibility/i);
  assert.match(migration, /Contact content has changed/);
});
