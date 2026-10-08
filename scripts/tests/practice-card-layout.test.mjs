import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const requireFrontend=createRequire(new URL('../../frontend/package.json',import.meta.url));
const postcss=requireFrontend('postcss');
const css=postcss.parse(await readFile(new URL('../../frontend/app/globals.css',import.meta.url),'utf8'));
function declarations(selector){
  const values={};
  css.walkRules(selector,rule=>{
    // Base rules only; responsive column-count changes do not undo row equalization.
    if(rule.parent.type==='root') rule.walkDecls(decl=>{values[decl.prop]=decl.value});
  });
  return values;
}
test('Home and directory grids stretch every card and equalize all rows',()=>{
  for(const selector of ['.practice-grid','.practice-directory-grid']){
    const rules=declarations(selector);
    assert.equal(rules['grid-auto-rows'],'1fr',selector);
    assert.equal(rules['align-items'],'stretch',selector);
    assert.ok(rules['grid-template-columns'].includes('minmax(0, 1fr)'),selector);
  }
});
test('Every practice footer is pinned to bottom, including image-grid directory cards',()=>{
  assert.equal(declarations('.practice-card__link')['margin-top'],'auto');
  assert.equal(declarations('.practice-directory-grid .practice-directory-card__link').margin,'auto 0 0');
  assert.equal(declarations('.practice-directory-grid .practice-directory-card--with-image')['grid-template-rows'],'auto 1fr auto');
});
test('Text can grow without cropping and both image variants share sizing',()=>{
  assert.equal(declarations('.practice-grid .practice-card')['min-height'],'360px');
  assert.equal(declarations('.practice-directory-grid .practice-directory-card')['min-height'],'360px');
  for(const selector of ['.practice-card h3','.practice-card p','.practice-directory-grid .practice-directory-card h2','.practice-directory-card__body p']){
    const rules=declarations(selector);
    assert.equal(rules['overflow-wrap'],'anywhere',selector);
    assert.equal(rules['-webkit-line-clamp'],undefined,selector);
    assert.equal(rules.height,undefined,selector);
  }
  // No fake image element or reserved media slot is introduced for text-only cards.
  assert.equal(declarations('.practice-card--text-only .practice-card__body').flex,'1');
  assert.equal(declarations('.practice-directory-card--text-only .practice-directory-card__body')['margin-block'],'auto');
});
