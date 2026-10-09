import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {catalogue,localizedContent,turkishRecord} from '../content/practice-catalogue.mjs';
import {practiceSlug} from '../../directus/extensions/directus-extension-website-content/src/practice-urls.js';
test('Six confirmed services have complete plain-language content in all three languages without photos',()=>{
  assert.equal(catalogue.length,6);assert.equal(new Set(catalogue.map(item=>item.key)).size,6);
  for(const language of ['tr','en','de']){
    const slugs=new Set();
    for(const item of catalogue){
      const copy=localizedContent(item,language);
      for(const key of ['title','summary','lead','overview_title','overview','seo_title','seo_description'])assert.ok(copy[key]?.trim(),`${item.key}/${language}/${key}`);
      assert.ok(copy.title.length<=160);assert.ok(copy.seo_description.length<=180);
      assert.equal(copy.assessment_points.length,3);assert.equal(copy.process_steps.length,3);assert.equal(copy.faqs.length,2);
      const slug=practiceSlug(copy.title);assert.ok(!slugs.has(slug));slugs.add(slug);
      assert.ok(!('image_path' in copy));
    }
  }
  for(const [index,item] of catalogue.entries()){
    const row=turkishRecord(item,index);assert.equal(row.image_path,null);assert.equal(row.image_alt,null);assert.equal(row.status,'published');assert.equal(row.sort,index+1);assert.equal(row.show_on_homepage,true);
    assert.ok(!/rehabilitasyon|kardiyopulmoner|geriatrik|pediatrik/i.test(row.title));
  }
});
test('Manual import is atomic, tracked once, and does not overwrite or resurrect deleted records on boot',()=>{
  const source=readFileSync(new URL('../import-practice-catalogue.mjs',import.meta.url),'utf8');
  assert.match(source,/db.transaction/);assert.match(source,/pg_advisory_xact_lock/);assert.match(source,/already-applied/);assert.match(source,/Number\(count.n\)!==0/);
  assert.doesNotMatch(source,/deleteMany|deleteOne|truncate|\.merge\(/);
  const compose=readFileSync(new URL('../../compose.yaml',import.meta.url),'utf8');assert.ok(!compose.includes('import-practice-catalogue'));
});
