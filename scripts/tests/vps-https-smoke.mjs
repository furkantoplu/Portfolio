import assert from 'node:assert/strict';
const base = process.env.TEST_SITE_URL;
assert.equal(base, 'https://furkantoplu.com', 'Explicitly select the live HTTPS domain');
for (const path of ['/', '/bakir', '/calisma-alanlari?source=https-smoke']) {
  const response = await fetch('http://furkantoplu.com'+path, {redirect:'manual'});
  assert.equal(response.status, 308, path);
  assert.equal(response.headers.get('location'), base+path);
}
console.log('PASS HTTP redirects without serving application or admin');
const www = await fetch('https://www.furkantoplu.com/en?source=https-smoke', {redirect:'manual'});
assert.equal(www.status, 308);
assert.equal(www.headers.get('location'), base+'/en?source=https-smoke');
console.log('PASS valid www TLS and canonical redirect preserves path/query');
for (const [path, status] of [['/',200], ['/bakir',200], ['/bakir-api/website-content/translations/practice_areas/1/en',401], ['/bakir-api/users',403]]) {
  const response = await fetch(base+path);
  assert.equal(response.status, status, path);
  assert.ok(response.headers.get('cf-ray'), path+': Cloudflare proxy');
  assert.match(response.headers.get('cache-control'), /no-store/, path);
  assert.notEqual(response.headers.get('cf-cache-status'), 'HIT', path+': must not return cached private/dynamic response');
}
console.log('PASS live Cloudflare proxy, uncached dynamic pages, admin/API access boundaries');
