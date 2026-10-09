import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {archiveIntroText} from '../../frontend/app/lib/public-copy.ts';
const requireFrontend=createRequire(new URL('../../frontend/package.json',import.meta.url));
const postcss=requireFrontend('postcss');
const sheet=postcss.parse(await readFile(new URL('../../frontend/app/public-design.css',import.meta.url),'utf8'));
function properties(selector,media=null){const found={};sheet.walkRules(selector,rule=>{if(media===null?rule.parent.type==='root':rule.parent.type==='atrule'&&rule.parent.params===media)rule.walkDecls(decl=>found[decl.prop]=decl.value)});return found}
test('Public theme cannot leak to admin; source has no halo, glass or remote font dependency',()=>{
  sheet.walkRules(rule=>assert.ok(rule.selector.startsWith('.site-shell'),rule.selector));
  sheet.walkDecls(decl=>{assert.ok(!decl.value.includes('radial-gradient'));assert.ok(!/blur\(/.test(decl.value))});
  assert.equal(properties('.site-shell .site-header')['backdrop-filter'],'none');
  assert.equal(properties('.site-shell .site-header')['box-shadow'],'none');
  sheet.walkAtRules('import',()=>assert.fail('No external theme imports'));
});
test('Portrait/captions stay in flow on mobile and hidden columns collapse',()=>{
  assert.equal(properties('.site-shell .hero__character').position,'relative');
  assert.equal(properties('.site-shell .hero__character').inset,'auto');
  assert.equal(properties('.site-shell .hero__character','(max-width: 860px)')['z-index'],'0');
  assert.equal(properties('.site-shell .hero__character','(max-width: 860px)').perspective,'none');
  assert.equal(properties('.site-shell .hero__character img, .site-shell .hero__visual:hover .hero__character img','(max-width: 860px)').transform,'none');
  for(const selector of ['.site-shell .hero__location','.site-shell .about-section__caption','.site-shell .article-cover__caption'])assert.equal(properties(selector).position,'static',selector);
  assert.equal(properties('.site-shell .about-page-hero__photo').inset,'auto');
  const variants='.site-shell .hero.hero--text-only, .site-shell .about-section.about-section--text-only, .site-shell .about-page-hero.about-page-hero--text-only, .site-shell .detail-hero.detail-hero--text-only';
  assert.equal(properties(variants)['grid-template-columns'],'minmax(0, 1fr)');
});
test('Blog counts and responsive widths preserve readable cards and full images',()=>{
  assert.equal(properties('.site-shell .blog-grid')['grid-auto-rows'],'1fr');
  assert.equal(properties('.site-shell .blog-grid.blog-grid--two')['grid-template-columns'],'repeat(2, minmax(0, 1fr))');
  assert.equal(properties('.site-shell .blog-grid, .site-shell .blog-grid.blog-grid--two','(max-width: 560px)')['grid-template-columns'],'1fr');
  assert.equal(properties('.site-shell .content-card-image img')['object-fit'],'contain');
  assert.equal(properties('.site-shell .article-cover img')['object-fit'],'contain');
});
test('Owner-requested portrait arch stays behind the subject, within mobile bounds, without glow or overlay cards',()=>{
  const stage=properties('.site-shell .hero__visual::before');
  assert.equal(stage.content,'""');assert.equal(stage['pointer-events'],'none');assert.equal(stage['z-index'],'0');assert.equal(stage.background,'#e2ebde');
  assert.equal(properties('.site-shell .hero__visual::before','(max-width: 860px)')['outline-offset'],'8px');
  assert.equal(properties('.site-shell .hero__character','(max-width: 860px)')['z-index'],'0');
  assert.equal(properties('.site-shell .practice-grid.practice-grid--six')['grid-template-columns'],'repeat(3, minmax(0, 1fr))');
  assert.equal(properties('.site-shell .practice-grid.practice-grid--six','(max-width: 860px)')['grid-template-columns'],'repeat(2, minmax(0, 1fr))');
  assert.equal(properties('.site-shell .practice-grid.practice-grid--six','(max-width: 560px)')['grid-template-columns'],'minmax(0, 1fr)');
});
test('Practitioner-first hero has a working contact CTA and no dummy decoration or random featured card',async()=>{
  const source=await readFile(new URL('../../frontend/app/page.tsx',import.meta.url),'utf8');
  assert.ok(source.includes('hero__identity'));assert.ok(source.includes('href={localHref("/iletisim")}>{t("Randevu bilgisi alın")}'));
  for(const name of ['hero__portrait-orbit','hero__portrait-floor','practice-card--featured','blog-card--featured','blog-card__icon'])assert.ok(!source.includes(name),name);
  const layout=await readFile(new URL('../../frontend/app/layout.tsx',import.meta.url),'utf8');
  assert.ok(layout.indexOf('import "./globals.css"')<layout.indexOf('import "./public-design.css"'));assert.ok(!layout.includes('codex-preview'));
});
function luminance(hex){const channels=hex.slice(1).match(/../g).map(value=>parseInt(value,16)/255).map(value=>value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4);return channels[0]*0.2126+channels[1]*0.7152+channels[2]*0.0722}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)}
test('Normal text colors have at least 4.5:1 contrast in the chosen palette',()=>{
  for(const pair of [['#173e34','#f7f5f0'],['#52665d','#f7f5f0'],['#8b4a33','#f7f5f0'],['#52665d','#f5f6ef'],['#fffefa','#173e34'],['#d7e2d9','#173e34'],['#e3c9ae','#173e34'],['#91a69d','#173e34']])assert.ok(contrast(...pair)>=4.5,`${pair}: ${contrast(...pair)}`);
});
test('Archive starter self-description is hidden, real editorial text is preserved',()=>{
  for(const value of ['Yeni içerikler yayınlandıkça bu alan otomatik olarak genişleyecek.','This section grows as new articles are published.','Dieser Bereich wächst mit jedem neuen Beitrag.'])assert.equal(archiveIntroText(value),'');
  assert.equal(archiveIntroText(' Gündelik hareket üzerine yazılar. '),'Gündelik hareket üzerine yazılar.');
});
