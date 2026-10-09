import assert from 'node:assert/strict';
const base=process.env.TEST_SITE_URL||'http://localhost:8080';
const retiredClasses=['practice-section__footnote','blog-section__note','practice-directory-note','article-disclaimer','detail-hero__notice','detail-hero__text-notice'];
async function check(path){
  const response=await fetch(base+path);assert.equal(response.status,200,path);
  const html=await response.text();
  for(const name of retiredClasses)assert.ok(!html.includes(`class="${name}"`),`${path}: retired ${name}`);
  const footer=html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0];assert.ok(footer,path);
  assert.ok(!footer.includes('genel bilgilendirme amaçlıdır'));
  console.log('PASS public note removal '+path);
}
for(const [language,paths,areaPath,blogPath] of [
  ['tr',['/','/hakkimda','/iletisim','/calisma-alanlari','/blog'],'/calisma-alanlari','/blog'],
  ['en',['/en','/en/about','/en/contact','/en/practice-areas','/en/blog'],'/en/practice-areas','/en/blog'],
  ['de',['/de','/de/ueber-mich','/de/kontakt','/de/behandlungsbereiche','/de/blog'],'/de/behandlungsbereiche','/de/blog'],
]){
  for(const path of paths)await check(path);
  for(const [endpoint,prefix] of [['practice-areas',areaPath],['blog-posts',blogPath]]){
    const response=await fetch(`${base}/bakir-api/website-content/${endpoint}?language=${language}`);assert.equal(response.status,200);
    for(const row of (await response.json()).data)await check(prefix+'/'+encodeURIComponent(row.slug));
  }
}
