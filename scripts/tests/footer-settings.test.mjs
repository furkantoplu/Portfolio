import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {readFile} from 'node:fs/promises';
import {readFooterSettings as backend,safeFooterUrl as backendUrl} from '../../directus/extensions/directus-extension-website-content/src/footer.js';
const requireFrontend=createRequire(new URL('../../frontend/package.json',import.meta.url));
const root=fileURLToPath(new URL('../../frontend/',import.meta.url));
const {build}=requireFrontend('esbuild');
const result=await build({stdin:{contents:`
  import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
  import {SiteFooter} from './app/components/site-footer';
  import {FooterManager} from './app/bakir/footer-manager';
  export {readFooterSettings,safeFooterUrl} from './app/lib/footer-links';
  export async function render(config,locale='tr'){globalThis.footerFixture={config,locale};return renderToStaticMarkup(await SiteFooter())}
  export const editor=renderToStaticMarkup(<FooterManager page={{id:1,page_key:'footer',content:{},seo_title:null,seo_description:null}} onChanged={async()=>{}}/>);
`,loader:'tsx',resolveDir:root},write:false,bundle:true,format:'cjs',platform:'node',jsx:'automatic',external:['react','react/jsx-runtime','react-dom/server','lucide-react'],plugins:[{name:'fixtures',setup(builder){
  builder.onResolve({filter:/(?:i18n-server|\/directus)$/},args=>({path:args.path,namespace:'footer-fixture'}));
  builder.onLoad({filter:/.*/,namespace:'footer-fixture'},({path})=>({contents:path.endsWith('i18n-server')?`import {getTranslator,localizeHref} from './app/lib/i18n';export async function getPageTools(){const locale=globalThis.footerFixture.locale;return {t:getTranslator(locale),href:href=>localizeHref(href,locale)}}`:`export async function getFooterSettings(){return globalThis.footerFixture.config}`,loader:'js',resolveDir:root}));
}}]});
const module={exports:{}};new Function('require','module','exports',result.outputFiles[0].text)(requireFrontend,module,module.exports);
const {readFooterSettings,safeFooterUrl,render,editor}=module.exports;
test('Empty footer omits fake social profiles and keeps default internal/legal links',async()=>{
  const html=await render({});assert.ok(!html.includes('href="#"'));assert.ok(!html.includes('site-footer__social-links'));assert.ok(html.includes('href="/blog"'));assert.ok(html.includes('href="/gizlilik"'));
});
test('Only valid HTTPS URLs without credentials become public links; parsers agree',()=>{
  for(const value of ['',null,undefined,'#','javascript:alert(1)','data:text/html,x','http://example.test','//example.test','https://user:pass@example.test', 'https://example.test/'+ 'x'.repeat(2050)]){assert.equal(safeFooterUrl(value),'');assert.equal(backendUrl(value),'')}
  for(const value of ['https://www.instagram.com/example',' https://example.test/profile '])assert.equal(safeFooterUrl(value),backendUrl(value));
  const malformed={socials:{instagram:{url:'javascript:alert(1)',visible:true}},menu:{blog:false,privacy:false}};
  assert.deepEqual(readFooterSettings(malformed),backend(malformed));assert.equal(backend(malformed).socials.instagram.url,'');assert.equal(backend(malformed).menu.blog,false);
});
test('Shared footer links and visibility work in all languages, internal routes stay localized',async()=>{
  const settings={socials:{instagram:{url:'https://www.instagram.com/example/',visible:true},youtube:{url:'https://www.youtube.com/example',visible:false}},menu:{blog:false,kvkk:false}};
  for(const locale of ['tr','en','de']){
    const html=await render(settings,locale);assert.ok(html.includes('href="https://www.instagram.com/example/"'));assert.ok(html.includes('target="_blank" rel="noopener noreferrer"'));assert.ok(!html.includes('www.youtube.com/example'));assert.ok(!html.includes('kvkk-aydinlatma-metni'));
    const blogPath={tr:'/blog',en:'/en/blog',de:'/de/blog'}[locale];assert.ok(!html.includes(`href="${blogPath}"`));
    const aboutPath={tr:'/hakkimda',en:'/en/about',de:'/de/ueber-mich'}[locale];assert.ok(html.includes(`href="${aboutPath}"`));
  }
});
test('Footer editor exposes URLs, visibility and menus without translation/account controls',()=>{
  for(const label of ['Instagram adresi','YouTube adresi','LinkedIn adresi','Footer menüsünde göster','Footer’ı kaydet'])assert.ok(editor.includes(label),label);
  assert.ok(editor.includes('role="switch"'));assert.ok(editor.includes('type="url"'));assert.ok(!editor.includes('admin-language-tabs'));assert.ok(!editor.includes('type="password"'));
});
test('Frontend and Directus footer definitions match',async()=>{
  assert.equal(await readFile(new URL('../../frontend/app/lib/footer-options.json',import.meta.url),'utf8'),await readFile(new URL('../../directus/extensions/directus-extension-website-content/src/footer-options.json',import.meta.url),'utf8'));
});
