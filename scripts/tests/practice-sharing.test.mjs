import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {practiceSharingMetadata} from '../../frontend/app/lib/practice-sharing.ts';

const base='https://furkantoplu.com';
const area={title:'Kas ve Eklem Ağrıları',summary:'Anlaşılır açıklama.',lead:'Giriş.',seo_title:null,seo_description:null,image_path:'/site-media/12345678-1234-4234-8234-123456789abc',image_alt:'Hareket değerlendirmesi'};
const metadata=(changes={},locale='tr',url=base+'/calisma-alanlari/kas-ve-eklem-agrilari')=>practiceSharingMetadata({...area,...changes},base,url,locale);
const fallback={url:base+'/furkan-toplu-share-v1.jpg',alt:'Furkan Toplu',width:600,height:600,type:'image/jpeg'};

test('Practice detail describes a website, not an article or a medical claim, with its own public image',()=>{
  const result=metadata();
  assert.equal(result.title,area.title+' | Fzt. Furkan Toplu');assert.equal(result.description,area.summary);
  assert.equal(result.openGraph.type,'website');assert.equal(result.openGraph.siteName,'Furkan Toplu');
  assert.equal(result.openGraph.url,base+'/calisma-alanlari/kas-ve-eklem-agrilari');
  assert.deepEqual(result.openGraph.images,[{url:base+area.image_path,alt:area.image_alt}]);
  assert.equal(result.twitter.card,'summary_large_image');assert.equal(result.twitter.title,result.openGraph.title);
  assert.equal(result.twitter.description,result.openGraph.description);assert.deepEqual(result.twitter.images,result.openGraph.images);
  for(const key of ['publishedTime','modifiedTime','section','authors'])assert.ok(!(key in result.openGraph));
});

test('Existing admin SEO values win; empty/whitespace descriptions fall back to same-language summary and lead',()=>{
  const result=metadata({seo_title:' Özel başlık ',seo_description:' Özel açıklama '});
  assert.equal(result.title,'Özel başlık');assert.equal(result.description,'Özel açıklama');
  assert.equal(metadata({seo_description:' '}).description,area.summary);
  assert.equal(metadata({seo_description:null,summary:' '}).description,area.lead);
  assert.equal(metadata({seo_description:null,summary:' ',lead:null}).description,undefined);
});

test('Three locales use the supplied real translated URL, title and description',()=>{
  for(const [locale,ogLocale,title,path] of [['tr','tr_TR','Kas ve Eklem','/calisma-alanlari/kas-ve-eklem'],['en','en_GB','Muscles and Joints','/en/practice-areas/muscles-and-joints'],['de','de_DE','Muskeln und Gelenke','/de/behandlungsbereiche/muskeln-und-gelenke']]){
    const result=metadata({title,summary:title+' summary'},locale,base+path);
    assert.equal(result.openGraph.locale,ogLocale);assert.equal(result.openGraph.url,base+path);
    assert.equal(result.openGraph.title,title+' | Fzt. Furkan Toplu');assert.equal(result.openGraph.description,title+' summary');
  }
});

test('Hidden, absent, invalid or external images fall back to the compact public portrait without leaking their alt text',()=>{
  for(const changes of [{image_path:null},{image_path:' '},{section_visibility:{image:false}},{image_path:'//other.example/photo.jpg'},{image_path:'/\\other.example/photo.jpg'},{image_path:'https://other.example/photo.jpg'},{image_path:'/furkan-toplu-hero-white-coat-v1.png'}]){
    const result=metadata(changes);assert.deepEqual(result.openGraph.images,[fallback]);assert.equal(result.twitter.images[0].url,fallback.url);
  }
  assert.equal(metadata({section_visibility:{image:true},image_alt:' '}).openGraph.images[0].alt,area.title);
  assert.equal(metadata({section_visibility:{lead:false}}).openGraph.images[0].url,base+area.image_path);
});

test('Metadata integration preserves missing-page and renamed-slug redirect behavior and real localized slugs',async()=>{
  const source=await readFile(new URL('../../frontend/app/calisma-alanlari/[slug]/page.tsx',import.meta.url),'utf8');
  assert.ok(source.includes('practiceSharingMetadata(area, base, url, locale)'));
  assert.ok(source.indexOf('if (!area)')<source.indexOf('practiceSharingMetadata(area,'));
  assert.ok(source.includes('[locale]: area.slug'));
  assert.ok(source.includes('if (area.redirect_slug) permanentRedirect('));
  const localized=await readFile(new URL('../../frontend/app/[locale]/[[...path]]/page.tsx',import.meta.url),'utf8');
  assert.ok(localized.includes('areaMetadata({ params: { slug } })'));
});
