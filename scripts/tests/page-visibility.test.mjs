import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { readPageVisibility as backend, registerPageVisibility } from '../../directus/extensions/directus-extension-website-content/src/page-visibility.js';
const requireFrontend = createRequire(new URL('../../frontend/package.json', import.meta.url));
const root = fileURLToPath(new URL('../../frontend/', import.meta.url));
const { build } = requireFrontend('esbuild');
const bundle = await build({ stdin: { resolveDir: root, loader: 'tsx', contents: `
  import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
  import {SiteHeader} from './app/components/site-header';
  import {PageVisibilityManager} from './app/bakir/page-visibility-manager';
  import sitemap from './app/sitemap';
  export {readPageVisibility,pageForHref} from './app/lib/page-visibility';
  export {getPageVisibility,requireVisiblePage} from './app/lib/page-visibility-server';
  export const header=(visibility,locale)=>renderToStaticMarkup(<SiteHeader visibility={visibility} locale={locale}/>);
  export const editor=value=>renderToStaticMarkup(<PageVisibilityManager value={value} onChanged={async()=>{}}/>);
  export async function map(visibility){globalThis.pageVisibilityFixture=visibility;return sitemap()}
`, }, write: false, bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', external: ['react','react/jsx-runtime','react-dom/server','lucide-react'], plugins: [{ name: 'fixture', setup(builder) {
  builder.onResolve({ filter: /(?:\/directus|next\/navigation)$/ }, args => ({ path: args.path, namespace: 'fixture' }));
  builder.onLoad({ filter: /.*/, namespace: 'fixture' }, ({path}) => ({ loader: 'js', contents: path === 'next/navigation' ? `export function notFound(){throw new Error('NOT_FOUND')}` : `
    export async function getSitePage(key){if(key!=='home'&&globalThis.pageVisibilityFixture[key]===false)throw new Error('NOT_FOUND');return {content:{}}}
    export async function getPracticeAreas(){return [{slug:'alan',language_slugs:{tr:'alan',en:'area',de:'bereich'}}]}
    export async function getBlogPosts(){return [{slug:'yazi',language_slugs:{tr:'yazi',en:'post',de:'artikel'}}]}
  ` }));
} }] });
const module = { exports: {} };new Function('require','module','exports',bundle.outputFiles[0].text)(requireFrontend,module,module.exports);
const {readPageVisibility,pageForHref,header,editor,map,getPageVisibility,requireVisiblePage} = module.exports;
const allOff = Object.fromEntries(['home','about','areas','blog','contact','privacy','kvkk'].map(key=>[key,false]));
const originalFetch=globalThis.fetch;
function publicFetch(value,ok=true){globalThis.fetch=async()=>({ok,status:ok?200:503,json:async()=>({data:value})})}

test('Old/malformed settings keep defaults; home cannot be hidden; frontend/backend agree',()=>{
  for(const value of [null,undefined,[],{},allOff,{contact:'false',blog:0,bad:false}])assert.deepEqual(readPageVisibility(value),backend(value));
  assert.equal(readPageVisibility(allOff).home,true);assert.equal(readPageVisibility(allOff).contact,false);
  assert.equal(readPageVisibility({contact:'false'}).contact,true);
});
test('Hidden routes are recognized in every language without hiding external/hash/prefix lookalikes',()=>{
  for(const path of ['/iletisim','/en/contact?x=1','/de/kontakt/#x'])assert.equal(pageForHref(path),'contact');
  for(const path of ['/blog/abc','/en/blog/abc','/de/blog/abc'])assert.equal(pageForHref(path),'blog');
  assert.equal(pageForHref('/calisma-alanlari/abc'),'areas');assert.equal(pageForHref('/gizlilik'),'privacy');
  for(const path of ['#blog','//example.test/blog','https://example.test/blog','/blog-other'])assert.equal(pageForHref(path),undefined);
});
test('Desktop/mobile header omits every hidden navigation and both appointment CTAs; home stays',()=>{
  for(const locale of ['tr','en','de']){
    const html=header(readPageVisibility(allOff),locale);
    assert.ok(!html.includes('class="header-cta"'));assert.ok(!html.includes('class="mobile-nav__cta"'));
    for(const path of ['/iletisim','/en/contact','/de/kontakt','/hakkimda','/calisma-alanlari','/blog'])assert.ok(!html.includes(`href="${path}"`),path);
    assert.ok(html.includes(`href="${{tr:'/',en:'/en',de:'/de'}[locale]}"`));
    assert.ok(header(readPageVisibility({}),locale).includes('class="header-cta"'));
  }
});
test('Admin shows seven switches including an immutable home; changes are shared across languages',()=>{
  const html=editor(allOff);assert.equal((html.match(/role="switch"/g)||[]).length,7);
  assert.match(html,/aria-label="Ana sayfa sayfası görünürlüğü" disabled/);
  assert.ok(html.includes('Daima açık'));assert.ok(html.includes('İletişim sayfası görünürlüğü'));assert.ok(html.includes('İçerikler silinmez'));
});
test('Sitemap removes disabled list/detail/legal routes and preserves all three home URLs',async()=>{
  try{
    publicFetch(allOff);const hidden=await map(allOff);assert.equal(hidden.length,3);
    for(const item of hidden)assert.ok(['/','/en','/de'].includes(new URL(item.url).pathname));
    publicFetch({});const opened=await map({});assert.ok(opened.some(item=>new URL(item.url).pathname==='/iletisim'));assert.ok(opened.some(item=>new URL(item.url).pathname.startsWith('/blog/')));
  }finally{globalThis.fetch=originalFetch}
});
test('Server guards legal pages and degrades closed on a visibility-service failure without breaking home/404',async()=>{
  try{
    publicFetch(allOff);await assert.rejects(requireVisiblePage('privacy'),/NOT_FOUND/);assert.equal((await requireVisiblePage('home')).home,true);
    publicFetch({},false);const failed=await getPageVisibility();assert.equal(failed.home,true);assert.equal(failed.contact,false);
    publicFetch({});assert.equal((await requireVisiblePage('privacy')).privacy,true);
  }finally{globalThis.fetch=originalFetch}
});
function fixture(initial={}){
  let content={...initial},transactions=0,writes=0;
  const handlers={};const router={get(path,fn){handlers['GET '+path]=fn},patch(path,fn){handlers['PATCH '+path]=fn}};
  const db=table=>{assert.equal(table,'site_pages');return {where(key,value){assert.ok(key==='id'&&value===7||key==='page_key'&&value==='visibility');return this},forUpdate(){return this},async first(){return {id:7,content}},insert(){return {onConflict(key){assert.equal(key,'page_key');return {async ignore(){}}}}},async update(value){content=JSON.parse(value.content);writes++}}};
  db.transaction=async fn=>{transactions++;return fn(db)};
  registerPageVisibility(router,db,async(_db,id)=>id?{status:id==='inactive'?'suspended':'active',is_admin:id!=='ordinary'}:null);
  async function call(body,key='contact',user='admin',proof=true){let status=200,result;const response={status(value){status=value;return this},set(){return this},json(value){result=value;return this}};await handlers['PATCH /page-visibility/:pageKey']({params:{pageKey:key},body,accountability:{user,admin:user==='admin',website_tfa_epoch:proof?'test-proof':null}},response,error=>{throw error});return {status,result}}
  return {call,get:()=>content,counts:()=>({transactions,writes})};
}
test('Only an active TFA-verified admin can change visibility, with strict boolean and immutable home',async()=>{
  const f=fixture();for(const [user,proof,status] of [[null,false,401],['inactive',true,401],['ordinary',true,403],['admin',false,403]])assert.equal((await f.call({visible:false},'contact',user,proof)).status,status);
  for(const [key,body] of [['home',{visible:false}],['unknown',{visible:false}],['contact',{visible:'false'}],['contact',{visible:false,content:{}}]])assert.equal((await f.call(body,key)).status,400);
  assert.deepEqual(f.counts(),{transactions:0,writes:0});
});
test('Per-page transactional updates preserve another admin toggle and can restore without touching page content',async()=>{
  const f=fixture({about:false});assert.equal((await f.call({visible:false})).status,200);assert.equal(f.get().about,false);assert.equal(f.get().contact,false);
  await f.call({visible:true});assert.equal(f.get().contact,true);assert.equal(f.get().about,false);assert.equal(f.get().home,true);assert.deepEqual(f.counts(),{transactions:2,writes:2});
});
test('Production source/runtime endpoint mirrors match and new write path is allowlisted narrowly',()=>{
  const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
  for(const file of ['index.js','page-visibility.js'])assert.equal(read('directus/extensions/directus-extension-website-content/src/'+file),read('directus/extensions/directus-extension-website-content/dist/'+file));
  for(const file of ['deploy/Caddyfile','deploy/Caddyfile.vps'])assert.ok(read(file).includes("'/website-content/page-visibility/*'"));
});
