import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {blogSharingMetadata} from '../../frontend/app/lib/blog-sharing.ts';

const base='https://furkantoplu.com';
const post={title:'Hareket molaları',summary:'Kısa ve anlaşılır özet.',lead:'Giriş',seo_title:null,seo_description:null,cover_path:'/site-media/12345678-1234-4234-8234-123456789abc',cover_alt:'Kapak fotoğrafı',category:'Günlük yaşam'};
const metadata=(changes={},locale='tr',url=base+'/blog/hareket-molalari')=>blogSharingMetadata({...post,...changes},base,url,locale);

test('Blog sharing uses actual title, description, canonical URL, article type and public cover',()=>{
  const result=metadata();
  assert.equal(result.title,post.title+' | Fzt. Furkan Toplu');
  assert.equal(result.description,post.summary);
  assert.equal(result.openGraph.type,'article');
  assert.equal(result.openGraph.url,base+'/blog/hareket-molalari');
  assert.equal(result.openGraph.section,post.category);
  assert.deepEqual(result.openGraph.images,[{url:base+post.cover_path,alt:post.cover_alt}]);
  assert.equal(result.twitter.card,'summary_large_image');
  assert.equal(result.twitter.title,result.openGraph.title);
  assert.equal(result.twitter.description,result.openGraph.description);
  assert.deepEqual(result.twitter.images,result.openGraph.images);
  assert.ok(!('publishedTime' in result.openGraph));
});

test('SEO overrides trim whitespace and empty values fall back to the same-language summary/lead',()=>{
  const result=metadata({seo_title:'  Özel SEO  ',seo_description:'  Özel açıklama  '});
  assert.equal(result.title,'Özel SEO');assert.equal(result.description,'Özel açıklama');
  assert.equal(metadata({seo_title:' ',seo_description:' '}).description,post.summary);
  assert.equal(metadata({seo_description:' ',summary:' '}).description,post.lead);
});

test('TR/EN/DE retain translated content and URL without translating slugs heuristically',()=>{
  for(const [locale,ogLocale,title,path] of [['tr','tr_TR','Hareket','/blog/hareket'],['en','en_GB','Movement','/en/blog/movement'],['de','de_DE','Bewegung','/de/blog/bewegung']]){
    const result=metadata({title,summary:title+' summary'},locale,base+path);
    assert.equal(result.openGraph.locale,ogLocale);assert.equal(result.openGraph.url,base+path);
    assert.equal(result.openGraph.title,title+' | Fzt. Furkan Toplu');
    assert.equal(result.openGraph.description,title+' summary');
  }
});

test('Missing, hidden, external or invalid covers use compact bundled JPEG, not hidden cover text',()=>{
  for(const changes of [{cover_path:null},{cover_path:' '},{section_visibility:{image:false}},{cover_path:'//other.example/photo.jpg'},{cover_path:'/\\other.example/photo.jpg'},{cover_path:'https://other.example/photo.jpg'},{cover_path:'/furkan-toplu-hero-white-coat-v1.png'}]){
    const result=metadata(changes);
    assert.deepEqual(result.openGraph.images,[{url:base+'/furkan-toplu-share-v1.jpg',alt:'Furkan Toplu',width:600,height:600,type:'image/jpeg'}]);
    assert.equal(result.twitter.images[0].url,result.openGraph.images[0].url);
  }
  assert.equal(metadata({section_visibility:{image:true},cover_alt:''}).openGraph.images[0].alt,post.title);
});

test('Page wires real CMS metadata; missing posts cannot inherit a generic article card',async()=>{
  const source=await readFile(new URL('../../frontend/app/blog/[slug]/page.tsx',import.meta.url),'utf8');
  assert.ok(source.includes('blogSharingMetadata(post, base, url, locale)'));
  assert.ok(source.indexOf('if (!post) return')<source.indexOf('blogSharingMetadata(post,'));
  assert.ok(source.includes('[locale]: post.slug'));
  const localized=await readFile(new URL('../../frontend/app/[locale]/[[...path]]/page.tsx',import.meta.url),'utf8');
  assert.ok(localized.includes('postMetadata({ params: { slug } })'));
});
