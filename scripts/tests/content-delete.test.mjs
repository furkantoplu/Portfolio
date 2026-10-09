import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import {registerTranslations} from '../../directus/extensions/directus-extension-website-content/src/translations.js';
const requireFrontend = createRequire(new URL('../../frontend/package.json', import.meta.url));
const {build} = requireFrontend('esbuild');
const bundled = await build({
  stdin:{contents:`
    import React from 'react';
    import {renderToStaticMarkup} from 'react-dom/server';
    import {ContentDeleteControl} from './app/bakir/content-delete-control';
    import {BlogManager} from './app/bakir/blog-manager';
    import {PracticeManager} from './app/bakir/practice-manager';
    export {deletionConfirmed,deleteContentItem} from './app/bakir/content-delete';
    export const dialog = renderToStaticMarkup(<ContentDeleteControl collection="blog_posts" id={12} title={'Title <unsafe>'} disabled={false} onBusyChange={()=>{}} onDeleted={async()=>{}}/>);
    export const blockedDialog = renderToStaticMarkup(<ContentDeleteControl collection="practice_areas" id={12} title="Area" disabled onBusyChange={()=>{}} onDeleted={async()=>{}}/>);
    export const blog = renderToStaticMarkup(<BlogManager posts={[{id:1,status:'draft',title:'Test post',category:'Test',reading_minutes:1}]} onChanged={async()=>{}}/>);
    export const practice = renderToStaticMarkup(<PracticeManager areas={[{id:1,status:'hidden',title:'Test area',show_on_homepage:false}]} onChanged={async()=>{}}/>);
  `, resolveDir:fileURLToPath(new URL('../../frontend/',import.meta.url)),loader:'tsx'},
  bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',
  external:['react','react/jsx-runtime','react-dom/server','lucide-react'],
  plugins:[{name:'test-image',setup(builder){
    builder.onResolve({filter:/^next\/image$/},()=>({path:'image',namespace:'test-image'}));
    builder.onLoad({filter:/.*/,namespace:'test-image'},()=>({contents:'export default function Image(){return null}',loader:'js'}));
  }}],
});
const module={exports:{}};
new Function('require','module','exports',bundled.outputFiles[0].text)(requireFrontend,module,module.exports);
const {deletionConfirmed,deleteContentItem,dialog,blockedDialog,blog,practice}=module.exports;
test('Only deliberate SIL confirmation is accepted, including Turkish keyboard casing',()=>{
  for(const input of ['SIL','SİL','sil','Sil',' SİL ']) assert.equal(deletionConfirmed(input),true,input);
  for(const input of ['','yes','evet','SI','sil bunu','kaldır']) assert.equal(deletionConfirmed(input),false,input);
});
test('Delete uses exactly one allowlisted record and sends no bulk/filter payload',async()=>{
  const calls=[];
  await deleteContentItem('blog_posts',123,'SIL',async(...args)=>{calls.push(args)});
  await deleteContentItem('practice_areas',42,'sil',async(...args)=>{calls.push(args)});
  assert.deepEqual(calls,[['/items/blog_posts/123',{method:'DELETE'}],['/items/practice_areas/42',{method:'DELETE'}]]);
  let requests=0;const forbidden=async()=>{requests++};
  for(const [collection,id,confirmation] of [['site_pages',1,'SIL'],['directus_users',1,'SIL'],['blog_posts',0,'SIL'],['blog_posts',-1,'SIL'],['blog_posts',1.5,'SIL'],['blog_posts',1,''],['blog_posts','1,2','SIL']]) await assert.rejects(deleteContentItem(collection,id,confirmation,forbidden));
  assert.equal(requests,0);
});
test('API deletion failures propagate without pretending the record is removed',async()=>{
  await assert.rejects(deleteContentItem('blog_posts',1,'SIL',async()=>{throw new Error('network failed')}),/network failed/);
});
test('Both managers expose visible Sil and accessible closed confirmation dialogs',()=>{
  for(const html of [blog,practice]) {assert.ok(html.includes('>Sil</span>'));assert.ok(html.includes('role="alertdialog"'));assert.ok(html.includes('İngilizce/Almanca'));assert.ok(html.includes('Başka içerikte kullanılan fotoğraflar korunur'));}
  assert.ok(!dialog.includes('<unsafe>'));assert.ok(dialog.includes('&lt;unsafe&gt;'));
  assert.ok(!dialog.includes('<dialog open'));
  assert.match(dialog,/class="admin-delete-dialog__confirm"[^>]*disabled/);
  assert.match(blockedDialog,/class="admin-content-delete__trigger"[^>]*disabled/);
});
test('Modal protects against double-submit and closes only after delete succeeds; selected drafts reset',()=>{
  const control=readFileSync(new URL('../../frontend/app/bakir/content-delete-control.tsx',import.meta.url),'utf8');
  assert.match(control,/inFlight\.current \|\| !deletionConfirmed/);
  assert.ok(control.indexOf('await deleteContentItem')<control.indexOf('dialog.current?.close();'));
  assert.match(control,/if \(inFlight.current\) event.preventDefault/);
  for(const manager of ['blog-manager','practice-manager']){
    const source=readFileSync(new URL(`../../frontend/app/bakir/${manager}.tsx`,import.meta.url),'utf8');
    assert.match(source,/if \(selectedIdRef.current === id\) startNew\(\)/);
    assert.match(source,/deletedIds.includes/);
    assert.match(source,/silindi; liste yenilenemedi/);
    assert.match(source,/onBusyChange=\{setBusy\}/);
    assert.match(source,/onBusyChange=\{setTranslationBusy\}/);
    assert.match(source,/const locked = busy \|\| translationBusy/);
  }
});

test('Translation writes racing with deletion return a sanitized 404 and source/runtime agree',async()=>{
  const routes={};const router={get(){},patch(path,handler){routes[path]=handler}};
  const database=()=>({where(){return this},forUpdate(){return this},async first(){return {id:1}},insert(){return this},onConflict(){return this},merge(){return this},async returning(){throw Object.assign(new Error('private SQL details'),{code:'23503'})}});
  database.transaction=async callback=>callback(database);
  registerTranslations(router,database,async()=>({status:'active',is_admin:true}));
  let status,payload,nextCalled=false;
  const response={status(value){status=value;return this},json(value){payload=value;return this}};
  await routes['/translations/:collection/:parentId/:language']({accountability:{user:'test'},params:{collection:'blog_posts',parentId:'1',language:'en'},body:{status:'draft',slug:'example',content:{title:'Test',summary:'Summary'}}},response,()=>{nextCalled=true});
  assert.equal(status,404);assert.equal(nextCalled,false);assert.ok(!JSON.stringify(payload).includes('private SQL'));
  assert.equal(readFileSync(new URL('../../directus/extensions/directus-extension-website-content/src/translations.js',import.meta.url),'utf8'),readFileSync(new URL('../../directus/extensions/directus-extension-website-content/dist/translations.js',import.meta.url),'utf8'));
});
test('Proxy delete route accepts numeric single IDs only, not static pages/users/files or bulk',()=>{
  const caddy=readFileSync(new URL('../../deploy/Caddyfile',import.meta.url),'utf8');
  assert.match(caddy,/@deleteContent \{\s+method DELETE/);
  const matcher=new RegExp(caddy.match(/path_regexp contentDelete (.+)/)[1]);
  for(const path of ['/items/blog_posts/1','/items/practice_areas/245']) assert.ok(matcher.test(path));
  for(const path of ['/items/blog_posts','/items/blog_posts/1,2','/items/blog_posts/0','/items/site_pages/1','/users/1','/files/1','/items/blog_posts/1/nested']) assert.ok(!matcher.test(path),path);
});
