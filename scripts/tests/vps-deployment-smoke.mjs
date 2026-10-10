import assert from 'node:assert/strict';
const base=process.env.TEST_SITE_URL;
assert.ok(base,'Set TEST_SITE_URL to the forwarded VPS URL explicitly');
const response=await fetch(base+'/');
assert.equal(response.status,200);
assert.equal(response.headers.get('x-content-type-options'),'nosniff');
assert.equal(response.headers.get('x-frame-options'),'SAMEORIGIN');
const html=await response.text();
assert.match(html,/rel="canonical" href="https:\/\/furkantoplu\.com\/?"/);
console.log('PASS production canonical and proxy headers');
const admin=await fetch(base+'/bakir');assert.equal(admin.status,200);
assert.match(admin.headers.get('cache-control'),/no-store/);
assert.match(admin.headers.get('x-robots-tag'),/noindex/);
// The server emits a session-check shell; the login form is client-rendered.
assert.match(await admin.text(),/class="admin-shell/);
console.log('PASS admin shell served without caching or indexing');
const robots=await fetch(base+'/robots.txt');assert.equal(robots.status,200);
const text=await robots.text();assert.match(text,/Disallow: \/bakir/);assert.match(text,/Sitemap: https:\/\/furkantoplu\.com\/sitemap\.xml/);
console.log('PASS production robots and sitemap URL');
for(const path of ['/.env','/runtime.env','/database.dump','/.migration/20261010-a94723c2a8/runtime.env'])assert.equal((await fetch(base+path)).status,404,path);
console.log('PASS source/runtime/backup secrets are not served');
const image=await fetch(base+'/_next/image?url=%2Ffurkan-toplu-hero-white-coat-v1.png&w=640&q=75');
assert.equal(image.status,200);assert.match(image.headers.get('content-type'),/^image\//);assert.ok((await image.arrayBuffer()).byteLength>1000);
console.log('PASS production image optimization');
for(const port of [8055,8080]){
 await assert.rejects(fetch(`http://149.56.103.60:${port}/`,{signal:AbortSignal.timeout(3000)}));
 console.log(`PASS private VPS port ${port} inaccessible externally`);
}
