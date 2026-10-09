import {test} from 'node:test';
import assert from 'node:assert/strict';
import {adoptTaggedUploads, cleanupImage, registerMediaCleanup, uploadMarker} from '../../directus/extensions/directus-extension-website-content/src/media-cleanup.js';
const id='12345678-1234-4234-8234-123456789abc';
const now=new Date('2026-10-09T12:00:00Z');
function fixture(extra={}) {
  let tables={directus_files:[{id,type:'image/png',filename_disk:id+'.png',description:uploadMarker,uploaded_by:'actor',uploaded_on:now.toISOString()}],website_media_assets:[{file_id:id,previously_referenced:true,cleanup_after:now.toISOString()}],...extra};
  const deleted=[],locks=[];
  function makeDb(getTables){
    const db=name=>{
      let rows=[...(getTables()[name]||[])];
      const q={
        where(key,value){rows=rows.filter(row=>row[key]===value);return q},
        whereIn(key,values){rows=rows.filter(row=>values.includes(row[key]));return q},
        whereNotNull(key){rows=rows.filter(row=>row[key]!=null);return q},
        whereRaw(_sql,bindings){const target=bindings.at(-1).replaceAll('%','').toLowerCase();rows=rows.filter(row=>JSON.stringify(row).toLowerCase().includes(target));return q},
        forUpdate(){locks.push(name);return q},
        async first(){return rows[0]},async select(){return rows},
        async update(payload){for(const row of rows)Object.assign(row,payload);return rows.length},
        insert(record){q.record=record;return q},onConflict(){return q},async ignore(){if(!(getTables()[name]||[]).some(row=>row.file_id===q.record.file_id))(getTables()[name]??=[]).push(q.record)},
      };return q;
    };
    db.transaction=async callback=>{const copy=structuredClone(getTables());const trx=makeDb(()=>copy);trx.testDelete=key=>{copy.directus_files=copy.directus_files.filter(file=>file.id!==key);copy.website_media_assets=copy.website_media_assets.filter(file=>file.file_id!==key)};const result=await callback(trx);tables=copy;return result};
    return db;
  }
  const context={database:makeDb(()=>tables),getSchema:async()=>({relations:extra.relations||[]}),services:{FilesService:class{
    constructor(options){this.db=options.knex;assert.equal(options.accountability,null)}
    async deleteOne(key){this.db.testDelete(key);if(extra.fail)throw new Error('storage unavailable');deleted.push(key)}
  }}};
  return {context,deleted,locks,tables:()=>tables};
}
test('Unused managed website image removes both service file and registry, with a row lock',async()=>{
  const f=fixture();assert.equal(await cleanupImage(f.context,id,{now}),'deleted');assert.deepEqual(f.deleted,[id]);assert.equal(f.tables().directus_files.length,0);assert.equal(f.tables().website_media_assets.length,0);assert.deepEqual(f.locks,['directus_files','directus_files']);
});
test('Draft, hidden, page JSON, translation and native file relations all preserve shared images',async()=>{
  for(const table of ['practice_areas','blog_posts','site_pages','website_content_translations']){
    const f=fixture({[table]:[{id:1,status:'draft',content:{photo:`/site-media/${id.toUpperCase()}`}}]});
    assert.equal(await cleanupImage(f.context,id,{now}),'referenced',table);assert.equal(f.deleted.length,0);
  }
  const f=fixture({relations:[{collection:'directus_users',field:'avatar',related_collection:'directus_files'}],directus_users:[{id:'other',avatar:id}]});
  assert.equal(await cleanupImage(f.context,id,{now}),'referenced');
});
test('Fresh unsaved uploads survive grace period; expired uploads and own discarded uploads are cleaned',async()=>{
  const asset={file_id:id,previously_referenced:false,cleanup_after:new Date(now.getTime()+86400000).toISOString()};
  const f=fixture({website_media_assets:[asset]});assert.equal(await cleanupImage(f.context,id,{now}),'pending');
  assert.equal(await cleanupImage(f.context,id,{now:new Date(now.getTime()+86400001)}),'deleted');
  const own=fixture({website_media_assets:[asset]});assert.equal(await cleanupImage(own.context,id,{now,discardUser:'actor'}),'deleted');
  const retired=fixture({website_media_assets:[{...asset,retired_at:now}]});assert.equal(await cleanupImage(retired.context,id,{now}),'deleted');
  const other=fixture({website_media_assets:[asset]});assert.equal(await cleanupImage(other.context,id,{now,discardUser:'someone-else'}),'forbidden');assert.equal(other.deleted.length,0);
});
test('Arbitrary, untracked, unsafe prefix and non-image files are never deleted',async()=>{
  assert.equal(await cleanupImage(fixture().context,'../uploads',{now}),'invalid');
  const untracked=fixture({website_media_assets:[]});assert.equal(await cleanupImage(untracked.context,id,{now}),'unmanaged');
  for(const changes of [{type:'image/svg+xml'},{filename_disk:'../something.png'},{filename_disk:'.png'}]){
    const f=fixture();Object.assign(f.tables().directus_files[0],changes);assert.equal(await cleanupImage(f.context,id,{now}),'unmanaged');assert.equal(f.deleted.length,0);
  }
});
test('Storage failure rolls back DB deletion for a later retry',async()=>{
  const f=fixture({fail:true});await assert.rejects(cleanupImage(f.context,id,{now}));assert.equal(f.tables().directus_files.length,1);assert.equal(f.tables().website_media_assets.length,1);assert.equal(+f.tables().website_media_assets[0].retired_at,+now);
});
test('Only tagged uploads are adopted, without overwriting an already referenced asset',async()=>{
  const f=fixture({website_media_assets:[]});await adoptTaggedUploads(f.context.database);assert.equal(f.tables().website_media_assets.length,1);assert.equal(f.tables().website_media_assets[0].previously_referenced,false);assert.equal(+f.tables().website_media_assets[0].cleanup_after,+now+86400000);
  f.tables().website_media_assets[0].previously_referenced=true;await adoptTaggedUploads(f.context.database);assert.equal(f.tables().website_media_assets[0].previously_referenced,true);
  const untagged=fixture({website_media_assets:[]});untagged.tables().directus_files[0].description=null;await adoptTaggedUploads(untagged.context.database);assert.equal(untagged.tables().website_media_assets.length,0);
});
test('Discard endpoint requires active admin, rejects malformed IDs and another uploader',async()=>{
  for(const [account,key,status] of [[null,id,401],[{status:'suspended',is_admin:true},id,401],[{status:'active',is_admin:false},id,403],[{status:'active',is_admin:true},'bad',400],[{status:'active',is_admin:true},id,403]]){
    const f=fixture();let handler,code=200;const response={status(value){code=value;return this},json(){return this}};
    registerMediaCleanup({post(_path,fn){handler=fn}},f.context,async()=>account);
    await handler({params:{id:key},accountability:{user:'not-uploader'}},response);assert.equal(code,status);assert.equal(f.deleted.length,0);
  }
});
test('Discard endpoint keeps a saved image and deletes an unused upload only for its uploader',async()=>{
  for(const referenced of [true,false]){
    const f=fixture(referenced?{blog_posts:[{id:1,cover_path:'/site-media/'+id}]}:{});let handler,code=200,payload;
    registerMediaCleanup({post(_path,fn){handler=fn}},f.context,async()=>({status:'active',is_admin:true}));
    const response={status(v){code=v;return this},json(v){payload=v;return this}};
    await handler({params:{id},accountability:{user:'actor'}},response);
    assert.equal(code,200);assert.equal(payload.data.result,referenced?'referenced':'deleted');assert.equal(f.deleted.length,referenced?0:1);
  }
});
