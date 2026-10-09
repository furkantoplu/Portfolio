import assert from 'node:assert/strict';
import {catalogue,localizedContent} from '../content/practice-catalogue.mjs';
const base=process.env.TEST_SITE_URL||'http://localhost:8080';
const roots={tr:'/calisma-alanlari',en:'/en/practice-areas',de:'/de/behandlungsbereiche'};
const sitemap=await(await fetch(base+'/sitemap.xml')).text();
for(const language of ['tr','en','de']){
  const response=await fetch(`${base}/bakir-api/website-content/practice-areas?language=${language}`);assert.equal(response.status,200);
  const {data}=await response.json();assert.equal(data.length,6,language);
  for(const item of catalogue){
    const copy=localizedContent(item,language),row=data.find(row=>row.title===copy.title);assert.ok(row,copy.title);
    assert.equal(row.image_path,null);assert.ok(row.language_slugs.en);assert.ok(row.language_slugs.de);
    const path=roots[language]+'/'+row.slug;
    const detail=await fetch(base+path);assert.equal(detail.status,200,path);const html=await detail.text();
    assert.ok(html.includes(copy.title));assert.ok(html.includes('detail-hero--text-only'));assert.ok(!html.includes('class="detail-hero__visual"'));
    assert.ok(sitemap.includes(path),path);
  }
  const directory=await fetch(base+roots[language]);assert.equal(directory.status,200);
  console.log(`PASS ${language}: six published services, complete detail pages, no photos, sitemap and language links`);
}
const home=await(await fetch(base+'/')).text();assert.ok(home.includes('practice-grid--six'));
console.log('PASS homepage uses balanced six-card layout');
