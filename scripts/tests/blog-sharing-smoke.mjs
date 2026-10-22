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
const fallback=canonicalBase+'/furkan-toplu-share-v1.jpg';
let count=0;
for(const [language,prefix,ogLocale] of [['tr','/blog/','tr_TR'],['en','/en/blog/','en_GB'],['de','/de/blog/','de_DE']]){
  const response=await fetch(contentBase+'/blog-posts?language='+language);assert.equal(response.status,200);
  const {data:posts}=await response.json();assert.ok(posts.length,'published posts '+language);
  for(const post of posts){
    const path=prefix+encodeURIComponent(post.slug);
    for(const agent of ['WhatsApp/2.24','facebookexternalhit/1.1','Twitterbot/1.0']){
      const page=await fetch(base+path,{headers:{'User-Agent':agent}});assert.equal(page.status,200,path);
      const html=await page.text();const headEnd=html.indexOf('</head>');assert.ok(headEnd>0,'initial HTML head');const head=html.slice(0,headEnd);
      const get=tags(head);const title=post.seo_title?.trim()||post.title+' | Fzt. Furkan Toplu';
      const description=post.seo_description?.trim()||post.summary?.trim()||post.lead?.trim();
      assert.equal(get('og:type'),'article');assert.equal(get('og:title'),title);assert.equal(get('og:description'),description);
      assert.equal(get('og:url'),canonicalBase+path);assert.equal(get('og:locale'),ogLocale);assert.equal(get('og:site_name'),'Furkan Toplu');
      assert.equal(get('twitter:card'),'summary_large_image');assert.equal(get('twitter:title'),title);assert.equal(get('twitter:description'),description);
      const image=post.cover_path&&post.section_visibility?.image!==false?new URL(post.cover_path,canonicalBase).href:fallback;
      const expected=image.endsWith('/furkan-toplu-hero-white-coat-v1.png')?fallback:image;
      assert.equal(get('og:image'),expected);assert.equal(get('twitter:image'),expected);
      assert.ok(get('og:image:alt'));
      if(agent==='WhatsApp/2.24'){
        const media=await fetch(new URL(new URL(expected).pathname,base));assert.equal(media.status,200,expected);
        assert.match(media.headers.get('content-type'),/^image\//);assert.ok((await media.arrayBuffer()).byteLength);
      }
    }
    count++;console.log('PASS three crawler heads, translated article card and image: '+path);
  }
}
const missing=await fetch(base+'/blog/sharing-smoke-nonexistent',{headers:{'User-Agent':'WhatsApp/2.24'}});
assert.equal(missing.status,404);assert.ok(!(await missing.text()).includes('property="og:type" content="article"'));
console.log('PASS missing blog remains 404 without article card; total '+count+' published routes');
