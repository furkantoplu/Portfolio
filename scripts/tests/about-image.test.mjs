import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const requireFrontend=createRequire(new URL('../../frontend/package.json',import.meta.url));
const {build}=requireFrontend('esbuild');
const result=await build({
  stdin:{contents:`
    import React from 'react';
    import {renderToStaticMarkup} from 'react-dom/server';
    import About from './app/hakkimda/page';
    export async function render(content){globalThis.__aboutImageContent=content;return renderToStaticMarkup(await About())}
  `,resolveDir:fileURLToPath(new URL('../../frontend/',import.meta.url)),loader:'tsx'},
  bundle:true,write:false,format:'cjs',platform:'node',jsx:'automatic',
  external:['react','react/jsx-runtime','react-dom','react-dom/server','lucide-react'],
  plugins:[{name:'actual-image-fixtures',setup(builder){
    // Use the real shim: an img stub would miss its default inline cover style.
    builder.onResolve({filter:/^next\/image$/},()=>({path:fileURLToPath(new URL('../../frontend/node_modules/vinext/dist/shims/image.js',import.meta.url))}));
    builder.onResolve({filter:/(?:i18n-server|\/directus|site-header|site-footer|native-link)$/},args=>({path:args.path,namespace:'fixtures'}));
    builder.onLoad({filter:/.*/,namespace:'fixtures'},({path})=>{
      if(path.endsWith('i18n-server'))return {contents:'export async function getPageTools(){return {locale:"tr",t:v=>v,href:v=>v}}',loader:'js'};
      if(path.endsWith('/directus'))return {contents:'export async function getSitePage(){return {content:globalThis.__aboutImageContent}}',loader:'js'};
      return {contents:'import {createElement} from "react"; export const SiteHeader=()=>null;export const SiteFooter=()=>null;export const NativeLink=props=>createElement("a",props);',loader:'js'};
    });
  }}],
});
const module={exports:{}};
new Function('require','module','exports',result.outputFiles[0].text)(requireFrontend,module,module.exports);
const content={hero_title:'Test',hero_accent:'',hero_description:'Test',story_title:'Test',story_accent:'',story_lead:'',story_paragraphs:[],principles_title:'Test',principles:[],professional_note:''};
test('About portrait uses inline contain with the real framework renderer, including uploaded images',async()=>{
  for(const image_path of [undefined,'/site-media/12345678-1234-4234-8234-123456789abc']){
    const html=await module.exports.render({...content,image_path});
    const image=html.match(/class="about-page-hero__photo"[^>]*>\s*(<img\b[^>]*>)/)?.[1];
    assert.ok(image);assert.ok(image.includes('object-fit:contain'));assert.ok(!image.includes('object-fit:cover'));
    assert.ok(image.includes('position:absolute'));assert.ok(image.includes('height:100%'));
    assert.ok(html.includes(image_path?'site-media':'furkan-toplu-hero-white-coat-v1.png'));
  }
});
test('About image visibility still removes both photo and its frame',async()=>{
  const html=await module.exports.render({...content,section_visibility:{image:false}});
  assert.ok(!html.includes('about-page-hero__photo'));assert.ok(html.includes('about-page-hero--text-only'));
});
