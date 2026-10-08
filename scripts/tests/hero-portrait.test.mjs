import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
const requireFrontend = createRequire(new URL('../../frontend/package.json',import.meta.url));
const { PNG } = requireFrontend('pngjs');
const portrait='/furkan-toplu-hero-white-coat-v1.png';
test('White-coat portrait has actual transparent background and softened alpha edges',async()=>{
  const bytes=await readFile(new URL('../../frontend/public'+portrait,import.meta.url));
  const png=PNG.sync.read(bytes);
  let transparent=0,opaque=0,partial=0;
  // The generator's solid subject is alpha 252–253 (99% opacity), not always 255.
  for(let i=3;i<png.data.length;i+=4){const a=png.data[i];if(a===0)transparent++;else if(a>=250)opaque++;else partial++}
  const pixels=png.width*png.height;
  assert.ok(png.height>png.width,'Upright waist-up framing');
  assert.ok(png.width>=700,'Enough resolution for homepage');
  assert.ok(transparent/pixels>0.15,'Not an opaque photo rectangle');
  assert.ok(opaque/pixels>0.25,'Subject remains opaque');
  assert.ok(partial>100,'Alpha edge smoothing retained');
  for(const [x,y] of [[0,0],[png.width-1,0],[0,png.height-1],[png.width-1,png.height-1]]) assert.equal(png.data[(y*png.width+x)*4+3],0);
  console.log(`Portrait ${png.width}x${png.height}; transparent ${Math.round(100*transparent/pixels)}%; size ${bytes.length} bytes`);
});
test('Homepage default and fallback agree; existing depth/fade/navbar layering stays intact',async()=>{
  const config=JSON.parse(await readFile(new URL('../../frontend/app/lib/page-content-config.json',import.meta.url),'utf8'));
  assert.equal(config.home.fields.find(f=>f.key==='hero_image').default,portrait);
  const source=await readFile(new URL('../../frontend/app/page.tsx',import.meta.url),'utf8');
  assert.ok(source.includes(`content.hero_image || "${portrait}"`));
  const css=await readFile(new URL('../../frontend/app/globals.css',import.meta.url),'utf8');
  for(const rule of ['z-index: 120','perspective: 1200px','drop-shadow','mask-image: linear-gradient','translate3d']) assert.ok(css.includes(rule),rule);
});
