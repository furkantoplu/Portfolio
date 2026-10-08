import assert from 'node:assert/strict';
const base=process.env.TEST_SITE_URL||'http://localhost:8080';
for(const [language,path] of [['tr','/'],['en','/en'],['de','/de']]){
  const response=await fetch(`${base}/bakir-api/website-content/pages/home?language=${language}`);
  assert.equal(response.status,200);
  const {data}=await response.json();
  const page=await fetch(base+path);assert.equal(page.status,200);
  const html=await page.text();
  if(data.content.section_visibility?.image!==false) assert.ok(html.includes(encodeURIComponent(data.content.hero_image)),`${language}: current CMS image is rendered`);
  console.log(`PASS ${language} hero: ${data.content.hero_image}`);
}
const response=await fetch(base+'/furkan-toplu-hero-white-coat-v1.png');
assert.equal(response.status,200);assert.ok(response.headers.get('content-type').includes('image/png'));
assert.ok((await response.arrayBuffer()).byteLength>1000);
console.log('PASS bundled transparent white-coat portrait served');
