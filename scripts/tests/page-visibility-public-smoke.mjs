// Read-only public checks, except one deliberately unauthenticated write denial.
import assert from 'node:assert/strict';
const base=process.env.TEST_SITE_URL||'http://localhost:8080';
const routes={home:['/','/en','/de'],about:['/hakkimda','/en/about','/de/ueber-mich'],areas:['/calisma-alanlari','/en/practice-areas','/de/behandlungsbereiche'],blog:['/blog','/en/blog','/de/blog'],contact:['/iletisim','/en/contact','/de/kontakt'],privacy:['/gizlilik'],kvkk:['/kvkk-aydinlatma-metni']};
const response=await fetch(base+'/bakir-api/website-content/page-visibility');
assert.equal(response.status,200);assert.ok(response.headers.get('cache-control')?.includes('no-store'));
const {data:visibility}=await response.json();
assert.equal(visibility.home,true);for(const key of Object.keys(routes))assert.equal(typeof visibility[key],'boolean');
const mapResponse=await fetch(base+'/sitemap.xml');assert.equal(mapResponse.status,200);const map=await mapResponse.text();
const sitemapUrls=[...map.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
for(const [key,paths] of Object.entries(routes)){
  for(const [index,path] of paths.entries()){
    let expected=visibility[key]?200:404;
    if(visibility[key]&&!['home','privacy','kvkk'].includes(key)){
      const content=await fetch(base+'/bakir-api/website-content/pages/'+key+'?language='+['tr','en','de'][index]);
      assert.ok([200,404].includes(content.status));expected=content.status;
    }
    assert.equal((await fetch(base+path)).status,expected,path);
    if(!visibility[key])assert.ok(!sitemapUrls.some(url=>{const candidate=new URL(url).pathname;return candidate===path||candidate.startsWith(path+'/')}),key+' sitemap');
  }
  console.log('PASS '+key+': '+(visibility[key]?'open':'hidden')+'; localized direct routes and sitemap.');
}
for(const path of routes.home){
  const html=await(await fetch(base+path)).text();
  for(const [key,paths] of Object.entries(routes))if(!visibility[key])for(const hidden of paths)assert.ok(!html.includes(`href="${hidden}"`),path+' links '+hidden);
  if(!visibility.contact){assert.ok(!html.includes('class="header-cta"'));assert.ok(!html.includes('class="mobile-nav__cta"'))}
}
for(const url of sitemapUrls){assert.equal(new URL(url).origin,new URL(base).origin);assert.equal((await fetch(url)).status,200,url)}
const denied=await fetch(base+'/bakir-api/website-content/page-visibility/contact',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({visible:false})});
assert.equal(denied.status,401);
console.log(`PASS home never hidden, no disabled navigation/appointment links, anonymous write denied, ${sitemapUrls.length} current sitemap URLs 200.`);
