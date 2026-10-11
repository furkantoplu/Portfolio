import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { normalizeWhatsAppNumber, whatsAppHref } from "../../frontend/app/lib/contact.ts";

test("WhatsApp links use a full international number without a plus sign", () => {
  for (const input of ["0555 123 45 67", "5551234567", "+90 (555) 123-45-67", "0090 555 123 45 67"]) {
    assert.equal(normalizeWhatsAppNumber(input), "905551234567");
    assert.equal(whatsAppHref(input), "https://wa.me/905551234567");
  }
  assert.equal(whatsAppHref("+49 171 1234567"), "https://wa.me/491711234567");
  assert.equal(whatsAppHref("0049 171 1234567"), "https://wa.me/491711234567");
});

test("incomplete or malformed contact values never become public WhatsApp links", () => {
  for (const input of ["", "055111111", "0555", "000", "abc", "https://wa.me/905551234567", "+0 555 123 45 67"]) {
    assert.equal(whatsAppHref(input), null, input);
  }
});

test("home and contact pages use the validated link helper", async () => {
  for (const path of ["page.tsx", "iletisim/page.tsx"]) {
    const source = await readFile(new URL(`../../frontend/app/${path}`, import.meta.url), "utf8");
    assert.match(source, /whatsAppHref\(/, path);
    assert.doesNotMatch(source, /`https:\/\/wa\.me\/\$\{/, path);
  }
});
