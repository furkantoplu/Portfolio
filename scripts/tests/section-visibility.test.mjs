import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { validateVisibility, sharedVisibility, saveSharedVisibility } from '../../directus/extensions/directus-extension-website-content/src/section-visibility.js';
import { translateItems, translatePage, registerTranslations } from '../../directus/extensions/directus-extension-website-content/src/translations.js';

const requireFrontend = createRequire(new URL('../../frontend/package.json', import.meta.url));
const { build } = requireFrontend('esbuild');
const result = await build({
  stdin: { contents: `
    import React from 'react';
    import { renderToStaticMarkup } from 'react-dom/server';
    import Home from './app/page';
    import About from './app/hakkimda/page';
    import Contact from './app/iletisim/page';
    import Areas from './app/calisma-alanlari/page';
    import Blog from './app/blog/page';
    import Post from './app/blog/[slug]/page';
    import { PracticeDetail } from './app/components/practice-detail';
    import { VisibilitySwitch, VisibilityField } from './app/bakir/section-visibility';
    export { isSectionVisible, readSectionVisibility } from './app/lib/section-visibility';
    export { VisibilitySwitch };
    export const field = renderToStaticMarkup(<VisibilityField label="Sık sorulan sorular" section="faqs" visibility={{faqs:false}} onChange={()=>{}}><><textarea defaultValue="Korunan içerik" /><small>Yardım</small></></VisibilityField>);
    export async function render(page, fixture) {
      globalThis.__sectionFixture = fixture;
      const components = {home:Home,about:About,contact:Contact,areas:Areas,blog:Blog};
      const tree = page === 'post' ? await Post({params:{slug:'test'}}) : page === 'practice' ? await PracticeDetail({content:fixture.practice, relatedAreas:[]}) : await components[page]();
      return renderToStaticMarkup(tree);
    }
  `, resolveDir: fileURLToPath(new URL('../../frontend/', import.meta.url)), loader: 'tsx' },
  write: false, bundle: true, format: 'cjs', platform: 'node', jsx: 'automatic',
  external: ['react', 'react/jsx-runtime', 'react-dom/server', 'lucide-react'],
  plugins: [{name:'fixtures',setup(builder) {
    builder.onResolve({filter: /(?:i18n-server|\/directus|site-header|site-footer|native-link|^next\/image|^next\/navigation)$/}, args => ({path:args.path,namespace:'fixtures'}));
    builder.onLoad({filter:/.*/,namespace:'fixtures'}, ({path}) => {
      if (path.endsWith('i18n-server')) return {contents:`export async function getPageTools(){return {locale:'tr',t:v=>v,href:v=>v}}`,loader:'js'};
      if (path.endsWith('/directus')) return {contents:`
        export async function getEditablePage(){return {content:globalThis.__sectionFixture.content}}
        export const getSitePage=getEditablePage, getHomeContact=getEditablePage;
        export async function getPracticeAreas(){return globalThis.__sectionFixture.areas||[]}
        export async function getBlogPosts(){return globalThis.__sectionFixture.posts||[]}
        export async function getBlogPost(){return globalThis.__sectionFixture.post}
      `,loader:'js'};
      if (path === 'next/navigation') return {contents:`export function notFound(){throw new Error('not found')}`,loader:'js'};
      if (path === 'next/image') return {contents:`import {createElement} from 'react';export default function Image({src,alt}){return createElement('img',{src,alt})}`,loader:'js'};
      return {contents:`import {createElement} from 'react';export const SiteHeader=()=>createElement('nav',null,'Navbar');export const SiteFooter=()=>createElement('footer',null,'Footer');export const NativeLink=props=>createElement('a',props);`,loader:'js'};
    });
  }}],
});
const module = {exports:{}};
new Function('require','module','exports',result.outputFiles[0].text)(requireFrontend,module,module.exports);
const {render,isSectionVisible,readSectionVisibility,field,VisibilitySwitch} = module.exports;
const content = {hero_title:'Korunan başlık',hero_accent:'',hero_description:'Giriş',hero_image:'/test.png',image_path:'/test.png',story_paragraphs:[],principles:[],flow_steps:[],phone_display:'555',whatsapp_value:'555',email:'test@example.test',address_title:'Adres',working_days:'Saat'};
const post = {id:1,title:'İlk yazı',slug:'ilk',category:'Kategori',summary:'Özet',published_at:'2026-10-07',reading_minutes:3,cover_path:'/test.png',lead:'Giriş',body_paragraphs:[{text:'Paragraf'}],quote:'Alıntı',tips:[{title:'Öneri',text:'Adım'}],closing_body:'Kapanış'};
const practice = {slug:'test',index:'01',title:'Alan başlığı',subtitle:'Alt başlık',titleAccent:'',lead:'Giriş',image:'/test.png',imageAlt:'Görsel',overviewTitle:'Değerlendirme',overviewAccent:'',overviewDescription:'Açıklama',evaluationTopics:['Madde'],processSteps:[{title:'Adım',description:'Açıklama'}],questions:[{question:'Soru',answer:'Cevap'}]};
const off = scope => Object.fromEntries(scope.map(key=>[key,false]));

test('Missing flags stay visible; only boolean false hides; input normalization is safe',()=>{
  for (const value of [undefined,null,{},[],{faqs:true},{faqs:'false'},{faqs:0}]) assert.equal(isSectionVisible(value,'faqs'),true);
  assert.equal(isSectionVisible({faqs:false},'faqs'),false);
  assert.deepEqual(readSectionVisibility({faqs:false,bad:'false'}),{faqs:false});
  assert.deepEqual(readSectionVisibility([]),{});
});
test('Visibility switch sits beside the field label and preserves editable content',()=>{
  assert.ok(field.includes('role="switch" aria-checked="false"'));
  assert.ok(field.includes('Sık sorulan sorular görünürlüğü'));
  assert.ok(field.includes('Korunan içerik'));
  const id=field.match(/for="([^"]+)"/)[1];
  assert.ok(field.includes(`textarea id="${id}"`));
  let changed;
  VisibilitySwitch({section:'faqs',label:'SSS',visibility:{faqs:false,process:false},onChange:v=>changed=v}).props.onClick();
  assert.deepEqual(changed,{faqs:true,process:false});
});
test('All public page kinds omit hidden sections from DOM while retaining H1/navigation',async()=>{
  for (const [page,keys,classes] of [
    ['home',['intro','image','facts','practices','about','blog','contact'],['hero__visual','hero__facts','practice-section','about-section','blog-section','contact-section']],
    ['about',['intro','image','story','principles','cta'],['about-page-hero__portrait','about-story','about-principles','about-page-cta']],
    ['areas',['intro','image','listing','note'],['managed-page-image','practice-directory-grid','practice-directory-note']],
    ['contact',['intro','phone','whatsapp','email','address','hours','flow'],['contact-methods','contact-visit-details','contact-flow']],
    ['blog',['intro','image','featured','archive','note'],['managed-page-image','featured-article','article-archive']],
  ]) {
    const html=await render(page,{content:{...content,section_visibility:off(keys)},posts:[post]});
    for(const css of classes) assert.ok(!html.includes(`class="${css}`),`${page}: ${css}`);
    assert.ok(html.includes('<h1'),page); assert.ok(html.includes('Navbar'),page);
  }
});
test('Practice FAQ/process/assessment/image can be hidden and restored without deleting text',async()=>{
  const hidden=await render('practice',{practice:{...practice,section_visibility:off(['faqs','process','overview','image','lead','subtitle','related','cta'])}});
  for(const css of ['detail-faq','detail-process','detail-overview','detail-hero__visual','detail-hero__lead','detail-related','detail-cta']) assert.ok(!hidden.includes(`class="${css}`),css);
  assert.ok(hidden.includes('detail-hero--text-only'));
  const visible=await render('practice',{practice});
  assert.ok(visible.includes('Soru')); assert.ok(visible.includes('Cevap')); assert.ok(visible.includes('detail-faq'));
});
test('Blog hidden content never leaves dangling TOC links or an empty cover column',async()=>{
  const html=await render('post',{post:{...post,section_visibility:off(['summary','image','meta','lead','body','quote','tips','closing','cta'])}});
  for(const css of ['article-cover','article-header__meta','article-toc','article-end']) assert.ok(!html.includes(`class="${css}`),css);
  for(const text of ['Özet','Paragraf','Alıntı','Kapanış','href="#']) assert.ok(!html.includes(text),text);
  assert.ok(html.includes('article-layout--no-toc'));
  assert.ok(html.includes('genel bilgilendirme amaçlıdır'));
});
test('Contact independently shows address or hours, including the address-only case',async()=>{
  const html=await render('contact',{content:{...content,section_visibility:{hours:false}}});
  assert.ok(html.includes('contact-visit-details')); assert.ok(html.includes('Adres'));
  assert.ok(!html.includes('Çalışma saatleri')); assert.ok(html.includes('contact-details__cards--single'));
});
test('Hiding featured blog section moves the first post to archive instead of dropping it',async()=>{
  const html=await render('blog',{content:{...content,section_visibility:{featured:false}},posts:[post,{...post,id:2,title:'İkinci yazı',slug:'ikinci'}]});
  assert.ok(!html.includes('class="featured-article')); assert.ok(html.includes('İlk yazı')); assert.ok(html.includes('İkinci yazı'));
});
test('Record image flags apply consistently to home and list cards',async()=>{
  const areas=[{...practice,id:1,summary:'Özet',image_path:'/test.png',section_visibility:{image:false,summary:false}}];
  const posts=[{...post,section_visibility:{image:false,summary:false,meta:false}}];
  for(const page of ['home','areas','blog']){
    const html=await render(page,{content:{...content,section_visibility:{image:false,about:false}},areas,posts});
    assert.ok(!html.includes('<img'),page); assert.ok(!html.includes('Özet'),page);
  }
});
test('Server accepts only configured boolean visibility keys and frontend/backend config stays aligned',async()=>{
  assert.deepEqual(validateVisibility('practice_areas',{faqs:false}),{faqs:false});
  for(const [scope,value] of [['unknown',{}],['home',{faqs:false}],['home',{intro:'false'}],['home',[]]]) assert.throws(()=>validateVisibility(scope,value));
  assert.equal(await readFile(new URL('../../frontend/app/lib/section-config.json',import.meta.url),'utf8'),await readFile(new URL('../../directus/extensions/directus-extension-website-content/src/section-config.json',import.meta.url),'utf8'));
  assert.deepEqual(sharedVisibility('site_pages',{content:{section_visibility:{flow:false}}}),{flow:false});
  let update;
  const db=()=>({where(){return this},async update(v){update=v}});
  await saveSharedVisibility(db,'blog_posts',1,{image:false});
  assert.deepEqual(JSON.parse(update.section_visibility),{image:false});
});
test('Published translations inherit the shared visibility and cannot override it through text content',async()=>{
  const row={language:'en',parent_id:1,slug:'english',content:{title:'English',section_visibility:{faqs:true}},status:'published'};
  const db=()=>({where(){return this},whereIn(){return this},async first(){return row},then(resolve){return Promise.resolve([row]).then(resolve)}});
  const [translated]=await translateItems(db,'practice_areas',[{id:1,slug:'turkce',section_visibility:{faqs:false}}],'en');
  assert.deepEqual(translated.section_visibility,{faqs:false});
  const translatedPage=await translatePage(db,{id:1,content:{section_visibility:{intro:false}}},'en');
  assert.deepEqual(translatedPage.content.section_visibility,{intro:false});
});
test('Translation visibility saves with text in one transaction, validates keys and updates only the page JSON path',async()=>{
  for(const collection of ['practice_areas','site_pages']) {
    const handlers={}, writes=[];
    let transactions=0;
    const parent=collection==='site_pages'?{id:1,page_key:'home',content:{hero_title:'Keep me',section_visibility:{intro:false}}}:{id:1,section_visibility:{faqs:false}};
    const db=name=>({where(){return this},async first(){return name==='website_content_translations'?null:parent},insert(record){writes.push({name,record});return this},onConflict(){return this},merge(){return this},async returning(){return [{id:1,status:'draft',content:{}}]},async update(record){writes.push({name,record})}});
    db.transaction=async fn=>{transactions++;return fn(db)};
    db.raw=(sql,bindings)=>({sql,bindings});
    registerTranslations({get(path,fn){handlers.get=fn},patch(path,fn){handlers.patch=fn}},db,async()=>({status:'active',is_admin:true}));
    let status=200,payload;
    const response={status(v){status=v;return this},set(){return this},json(v){payload=v;return this}};
    const params={collection,parentId:'1',language:'en'};
    await handlers.get({params,accountability:{user:'fake'}},response,error=>{throw error});
    assert.deepEqual(payload.data.section_visibility,collection==='site_pages'?{intro:false}:{faqs:false});
    const visibility=collection==='site_pages'?{intro:true}:{faqs:true};
    await handlers.patch({params,accountability:{user:'fake'},body:{status:'draft',slug:'test',content:{title:'Test'},section_visibility:visibility}},response,error=>{throw error});
    assert.equal(status,200);assert.equal(transactions,1);assert.equal(writes.length,2);assert.deepEqual(payload.data.section_visibility,visibility);
    if(collection==='site_pages'){
      assert.ok(writes[1].record.content.sql.includes("jsonb_set(content::jsonb, '{section_visibility}'"));
      assert.deepEqual(JSON.parse(writes[1].record.content.bindings[0]),visibility);
    }
    await handlers.patch({params,accountability:{user:'fake'},body:{status:'draft',slug:'test',content:{title:'Test'},section_visibility:{unknown:false}}},response,error=>{throw error});
    assert.equal(status,400);assert.equal(transactions,1);assert.equal(writes.length,2);
  }
});
