import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {readFile} from 'node:fs/promises';
const requireFrontend = createRequire(new URL('../../frontend/package.json', import.meta.url));
const {build} = requireFrontend('esbuild');
const result = await build({
  stdin: {contents: `
    import React from 'react';
    import {renderToStaticMarkup} from 'react-dom/server';
    import SiteImage from './app/components/site-image';
    export const render = props => renderToStaticMarkup(<SiteImage {...props} />);
  `, resolveDir: fileURLToPath(new URL('../../frontend/', import.meta.url)), loader: 'tsx'},
  bundle: true, write: false, format: 'cjs', platform: 'node', jsx: 'automatic',
  external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/server'],
  plugins: [{name: 'real-image', setup(builder) {
    builder.onResolve({filter: /^next\/image$/}, () => ({path: fileURLToPath(new URL('../../frontend/node_modules/vinext/dist/shims/image.js', import.meta.url))}));
  }}],
});
const module = {exports:{}};
new Function('require','module','exports', result.outputFiles[0].text)(requireFrontend,module,module.exports);
const path = '/site-media/12345678-1234-4234-8234-123456789abc';
const image = props => module.exports.render(props).match(/<img\b[^>]*>/)?.[0];

test('Managed uploads use the public media URL, even when optimization is explicitly requested', () => {
  for (const unoptimized of [undefined, false, true]) {
    const html = image({src:path,alt:'CMS photo',fill:true,unoptimized});
    assert.ok(html.includes(`src="${path}"`));
    assert.ok(!html.includes('/_next/image'));
    assert.ok(!html.includes('srcSet='));
  }
});

test('CMS photos retain fill/contain, priority, lazy loading, accessibility and styling', () => {
  const html = image({src:path,alt:'Photo description',fill:true,priority:true,className:'same-frame',style:{objectFit:'contain',objectPosition:'center'}});
  for (const value of ['alt="Photo description"','class="same-frame"','position:absolute','object-fit:contain','object-position:center','height:100%']) assert.ok(html.includes(value),value);
  assert.ok(!html.includes('loading="lazy"'));
  const lazy = image({src:path,alt:'Lazy photo',width:600,height:210});
  assert.ok(lazy.includes('loading="lazy"'));
  assert.ok(lazy.includes('width="600"')); assert.ok(lazy.includes('height="210"'));
});

test('Static portraits remain optimized; only exact managed UUID paths bypass it', () => {
  for (const src of ['/furkan-toplu-hero-white-coat-v1.png','/site-media/not-a-uuid','/site-media/12345678-1234-4234-8234-123456789abc/other.jpg','/another/image.jpg']) {
    const html = image({src,alt:'Static',fill:true});
    assert.ok(html.includes('/_next/image'),src);
  }
});

test('All public CMS photo surfaces use the shared component; private previews remain separate', async () => {
  for (const file of ['page.tsx','hakkimda/page.tsx','blog/page.tsx','blog/[slug]/page.tsx','calisma-alanlari/page.tsx','components/practice-detail.tsx']) {
    const source = await readFile(new URL('../../frontend/app/'+file,import.meta.url),'utf8');
    assert.match(source,/import Image from ".*site-image"/);
    assert.doesNotMatch(source,/import Image from "next\/image"/);
  }
  const preview = await readFile(new URL('../../frontend/app/bakir/image-field.tsx',import.meta.url),'utf8');
  assert.match(preview,/<Image unoptimized/);
  assert.ok(preview.includes('/bakir-api/assets/'));
});
