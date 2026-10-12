import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const allowed = ["image/jpeg", "image/png", "image/webp"];

for (const composeFile of ["compose.yaml", "compose.vps.yaml"]) {
  test(`${composeFile} limits Directus uploads to site image MIME types`, () => {
    const source = readFileSync(new URL(`../../${composeFile}`, import.meta.url), "utf8");
    const configured = source.match(/^\s+FILES_MIME_TYPE_ALLOW_LIST:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1];

    assert.ok(configured, "Directus needs a global upload MIME allowlist");
    assert.deepEqual(configured.split(","), allowed);
    assert.doesNotMatch(configured, /\*/);
  });
}
