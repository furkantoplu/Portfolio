import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const requireFrontend = createRequire(new URL("../../frontend/package.json", import.meta.url));
const { build } = requireFrontend("esbuild");
const result = await build({
  stdin: { contents: `
    import React from 'react';
    import { renderToStaticMarkup } from 'react-dom/server';
    import { PageManager } from './app/bakir/page-manager';
    import { BlogManager } from './app/bakir/blog-manager';
    import { PracticeManager } from './app/bakir/practice-manager';
    import { AuthenticatorQr } from './app/bakir/authenticator-qr';
    import { AccountSettings } from './app/bakir/account-settings';
    import { SiteHeader } from './app/components/site-header';
    import config from './app/lib/page-content-config.json';
    const onChanged = async () => {};
    export const page = renderToStaticMarkup(<PageManager pages={[{ id: 1, page_key: 'home', content: Object.fromEntries(config.home.fields.map(f => [f.key, f.default])), seo_title: '', seo_description: '' }]} onChanged={onChanged} />);
    export const blog = renderToStaticMarkup(<BlogManager posts={[]} onChanged={onChanged} />);
    export const practice = renderToStaticMarkup(<PracticeManager areas={[]} onChanged={onChanged} />);
    export const qr = renderToStaticMarkup(<AuthenticatorQr qrDataUrl="data:image/png;base64,TEST_ONLY" secret="TEST_ONLY" />);
    export const manual = renderToStaticMarkup(<AuthenticatorQr qrDataUrl={null} secret="TEST_ONLY" />);
    export const account = renderToStaticMarkup(<AccountSettings user={{id:'test-only',first_name:'Test',last_name:'Owner',email:'test@example.test',tfa_enabled:true}} onSaved={async()=>{}} />);
    export const header = renderToStaticMarkup(<SiteHeader locale="tr" />);
  `, resolveDir: fileURLToPath(new URL("../../frontend/", import.meta.url)), loader: "tsx" },
  write: false, bundle: true, format: "cjs", platform: "node", jsx: "automatic",
  external: ["react", "react/jsx-runtime", "react-dom/server", "lucide-react"],
  plugins: [{ name: "test-image", setup(builder) {
    builder.onResolve({ filter: /^next\/image$/ }, () => ({ path: "image", namespace: "test-image" }));
    builder.onLoad({ filter: /.*/, namespace: "test-image" }, () => ({ contents: 'import {createElement} from "react"; export default function Image({src,alt}) { return createElement("img",{src,alt}); }', loader: "js" }));
  } }],
});
const module = { exports: {} };
// Image optimization is a framework concern; this test checks the editor controls.
new Function("require", "module", "exports", result.outputFiles[0].text)(requireFrontend, module, module.exports);
test("Page manager includes all five pages, homepage copy and image upload controls", () => {
  const html = module.exports.page;
  for (const label of ["Ana sayfa", "Hakkımda", "İletişim", "Çalışma alanları", "Blog", "Ana görsel / 3D karakter", "Hakkımda bölüm görseli", "Adım 3 açıklaması"]) assert.ok(html.includes(label), label);
  assert.ok(html.includes('type="file"'));
  assert.ok(html.includes("Hareketinize güven,"));
});
test("Blog and practice editors expose image upload and accessibility text", () => {
  for (const key of ["blog", "practice"]) {
    assert.ok(module.exports[key].includes('type="file"'), key);
    assert.ok(module.exports[key].includes("Görsel açıklaması"), key);
  }
});
test("Practice manager shows an automatic readonly URL and a single primary name", () => {
  assert.ok(module.exports.practice.includes("Çalışma alanı adı / sayfa başlığı"));
  assert.ok(module.exports.practice.includes("Otomatik URL adı"));
  assert.ok(module.exports.practice.includes('readOnly=""'));
  assert.ok(!module.exports.practice.includes("Detay sayfası başlığı"));
});
test("Authenticator displays a local QR plus manual fallback, opened if QR is unavailable", () => {
  assert.ok(module.exports.qr.includes('src="data:image/png;base64,TEST_ONLY"'));
  assert.ok(module.exports.qr.includes("QR kod tara"));
  assert.ok(module.exports.qr.includes("anahtarı elle gir"));
  assert.ok(module.exports.manual.includes('<details class="admin-authenticator-manual" open="">'));
  assert.ok(!module.exports.manual.includes("<img"));
});
test("Self account form has credential confirmations and no other-user selector", () => {
  for (const label of ["Giriş e-posta adresi", "Yeni parola", "Mevcut parola ile onaylayın", "Authenticator doğrulama kodu"]) assert.ok(module.exports.account.includes(label));
  assert.ok(!module.exports.account.includes("<select"));
});
test("Language selector is last in the header, after appointment and mobile menu", () => {
  const html = module.exports.header;
  assert.ok(html.indexOf('class="header-cta"') < html.indexOf('class="language-dropdown"'));
  assert.ok(html.indexOf('class="mobile-menu"') < html.indexOf('class="language-dropdown"'));
});
