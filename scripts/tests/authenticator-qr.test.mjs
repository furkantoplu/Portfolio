import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createAuthenticatorQr } from "../../frontend/app/bakir/authenticator-qr-code.ts";
const requireFrontend = createRequire(new URL("../../frontend/package.json", import.meta.url));
const { PNG } = requireFrontend("pngjs");
const jsQR = requireFrontend("jsqr");
// Test-only values, never an actual account's authenticator secret.
const secret = "JBSWY3DPEHPK3PXP";
const uri = `otpauth://totp/Test%20Site:test%40example.test?secret=${secret}&issuer=Test%20Site&algorithm=SHA1&digits=6&period=30`;

test("Authenticator QR is a locally generated PNG that decodes to the exact setup URI", async () => {
  const dataUrl = await createAuthenticatorQr(secret, uri);
  assert.match(dataUrl, /^data:image\/png;base64,/);
  const png = PNG.sync.read(Buffer.from(dataUrl.split(",")[1], "base64"));
  const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  assert.ok(decoded, "QR must be readable");
  assert.equal(decoded.data, uri);
  assert.equal(png.width, 240);
});
test("External URLs, other OTP types and mismatching secrets are rejected", async () => {
  for (const value of ["https://example.test/?secret=" + secret, uri.replace("totp", "hotp"), uri.replace(secret, "DIFFERENT")]) {
    await assert.rejects(createAuthenticatorQr(secret, value), /kurulum bağlantısı geçersiz/);
  }
});
