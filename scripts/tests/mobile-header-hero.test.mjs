import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {validateVisibility} from '../../directus/extensions/directus-extension-website-content/src/section-visibility.js';
const requireFrontend=createRequire(new URL('../../frontend/package.json',import.meta.url));
const css=requireFrontend('postcss').parse(await readFile(new URL('../../frontend/app/globals.css',import.meta.url),'utf8'));
function mobile(selector){const result={};css.walkRules(selector,rule=>{if(rule.parent.type==='atrule'&&rule.parent.params==='(max-width: 860px)')rule.walkDecls(d=>result[d.prop]=d.value)});return result}
test('Mobile portrait is in flow, cannot escape its stack or translate over text',()=>{
  assert.equal(mobile('.hero__visual').isolation,'isolate');
  assert.equal(mobile('.hero__visual')['min-height'],'0');
  assert.equal(mobile('.hero__character').position,'relative');
  assert.equal(mobile('.hero__character').inset,'auto');
  assert.equal(mobile('.hero__character')['z-index'],'0');
  assert.equal(mobile('.hero__character').perspective,'none');
  assert.equal(mobile('.hero__character img, .hero__visual:hover .hero__character img').transform,'none');
  assert.equal(mobile('.hero__location').position,'static');
  css.walkRules(rule=>{if(rule.parent.type==='atrule'&&rule.parent.params==='(max-width: 560px)'&&rule.selector.includes('hero__character'))rule.walkDecls(d=>assert.ok(!d.value.includes('translate3d'),'Small-screen rules must not undo mobile fix'))});
});
test('Mobile language is abbreviated and minimum control size is retained',()=>{
  assert.equal(mobile('.language-name').display,'none');assert.equal(mobile('.language-code').display,'inline');
  assert.equal(mobile('.language-dropdown__trigger')['min-height'],'44px');
});
test('Portrait note has no public element or editor control; old saved flags stay compatible',async()=>{
  const home=await readFile(new URL('../../frontend/app/page.tsx',import.meta.url),'utf8');
  assert.ok(!home.includes('hero__note'));assert.ok(!home.includes('hero_note_title'));
  const config=JSON.parse(await readFile(new URL('../../frontend/app/lib/page-content-config.json',import.meta.url),'utf8'));
  assert.ok(!config.home.fields.some(f=>f.key.startsWith('hero_note')));
  assert.deepEqual(validateVisibility('home',{note:false,location:true}),{location:true});
});
