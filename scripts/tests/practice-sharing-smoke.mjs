import assert from 'node:assert/strict';

const base=process.env.TEST_SITE_URL||'http://localhost:8080';
const contentBase=process.env.TEST_CONTENT_URL||base+'/bakir-api/website-content';
const canonicalBase=process.env.TEST_CANONICAL_URL||base;
const decode=value=>value.replace(/&quot;/g,'"').replace(/&#x27;|&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
function tags(html){
  const values=new Map();
  for(const match of html.matchAll(/<meta\b[^>]*>/g)){
    const attrs=Object.fromEntries([...match[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(([,key,value])=>[key,decode(value)]));
    const key=attrs.property||attrs.name;if(key)values.set(key,[...(values.get(key)||[]),attrs.content]);
  }
  return key=>{assert.equal(values.get(key)?.length,1,'one '+key);return values.get(key)[0]};
}
const checkedImages=new Set();
let count=0;
for(const [language,prefix,ogLocale] of [['tr','/calisma-alanlari/','tr_TR'],['en','/en/practice-areas/','en_GB'],['de','/de/behandlungsbereiche/','de_DE']]){
  const response=await fetch(contentBase+'/practice-areas?language='+language);assert.equal(response.status,200);
  const {data:areas}=await response.json();assert.ok(areas.length,'published areas '+language);
  for(const area of areas){
    const path=prefix+encodeURIComponent(area.slug);
    for(const agent of ['WhatsApp/2.24','facebookexternalhit/1.1','Twitterbot/1.0']){
      const page=await fetch(base+path,{headers:{'User-Agent':agent}});assert.equal(page.status,200,path);
      const html=await page.text();const headEnd=html.indexOf('</head>');assert.ok(headEnd>0,'initial HTML head');const head=html.slice(0,headEnd);
      const get=tags(head);const title=area.seo_title?.trim()||area.title+' | Fzt. Furkan Toplu';
      const description=area.seo_description?.trim()||area.summary?.trim()||area.lead?.trim();
      assert.equal(get('og:type'),'website');assert.equal(get('og:title'),title);assert.equal(get('og:description'),description);
      assert.equal(get('og:url'),canonicalBase+path);assert.equal(get('og:locale'),ogLocale);assert.equal(get('og:site_name'),'Furkan Toplu');
      assert.equal(get('twitter:card'),'summary_large_image');assert.equal(get('twitter:title'),title);assert.equal(get('twitter:description'),description);
      const fallback=canonicalBase+'/furkan-toplu-share-v1.jpg';
      const image=area.image_path&&area.section_visibility?.image!==false?new URL(area.image_path,canonicalBase).href:fallback;
      const expected=image.endsWith('/furkan-toplu-hero-white-coat-v1.png')?fallback:image;
      assert.equal(get('og:image'),expected);assert.equal(get('twitter:image'),expected);assert.ok(get('og:image:alt'));
      if(!checkedImages.has(expected)){
        const media=await fetch(new URL(new URL(expected).pathname,base));assert.equal(media.status,200,expected);
        assert.match(media.headers.get('content-type'),/^image\//);assert.ok((await media.arrayBuffer()).byteLength);checkedImages.add(expected);
      }
    }
    count++;console.log('PASS three crawler heads, translated website card and public image: '+path);
  }
}
for(const path of ['/calisma-alanlari/sharing-smoke-nonexistent','/en/practice-areas/sharing-smoke-nonexistent','/de/behandlungsbereiche/sharing-smoke-nonexistent']){
  const missing=await fetch(base+path,{headers:{'User-Agent':'WhatsApp/2.24'}});assert.equal(missing.status,404);
  const html=await missing.text();assert.ok(!html.includes('property="og:image"'));console.log('PASS missing area has no sharing card: '+path);
}
console.log('PASS total '+count+' published practice routes');
