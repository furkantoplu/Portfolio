import assert from 'node:assert/strict';
const base=process.env.TEST_SITE_URL||'http://localhost:8080';
for(const [language,path,contact] of [['tr','/','/iletisim'],['en','/en','/en/contact'],['de','/de','/de/kontakt']]){
  const response=await fetch(base+path);assert.equal(response.status,200);const html=await response.text();
  assert.ok(html.includes('class="hero__identity"'));assert.ok(html.includes(`class="primary-button" href="${contact}"`));
  for(const retired of ['hero__portrait-orbit','hero__portrait-floor','blog-card--featured','practice-card--featured'])assert.ok(!html.includes(retired),retired);
  assert.ok(!html.includes('codex-preview'));
  const styles=[...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)].map(match=>match[1]);assert.ok(styles.length);
  let css='';for(const href of styles){const url=new URL(href,base);assert.equal(url.origin,new URL(base).origin);const sheet=await fetch(url);assert.equal(sheet.status,200);css+=await sheet.text()}
  assert.ok(css.includes('--public-paper'));assert.ok(css.includes('.site-shell .hero__identity'));
  console.log(`PASS ${language}: practitioner, contact CTA, real public stylesheet, no retired effects`);
}
for(const path of ['/hakkimda','/blog','/iletisim','/calisma-alanlari','/gizlilik','/kvkk-aydinlatma-metni']){assert.equal((await fetch(base+path)).status,200);console.log('PASS page '+path)}
for(const path of ['/hakkimda','/en/about','/de/ueber-mich']){
  const response=await fetch(base+path);assert.equal(response.status,200);const html=await response.text();
  const image=html.match(/class="about-page-hero__photo"[^>]*>\s*(<img\b[^>]*>)/)?.[1];
  if(image){assert.ok(image.includes('object-fit:contain'),path);assert.ok(!image.includes('object-fit:cover'),path);console.log('PASS uncropped about portrait '+path)}
  else {assert.ok(html.includes('about-page-hero--text-only'),path);console.log('PASS hidden about portrait '+path)}
}
const missing=await fetch(base+'/design-smoke-missing-page');assert.equal(missing.status,404);assert.ok((await missing.text()).includes('not-found-hero'));console.log('PASS styled 404');
