// Run inside the existing Directus container. Creates/deletes ONLY synthetic
// cleanup-test images and posts, never changes real accounts or site content.
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {getStorage} from '@directus/api/storage/index';
import getDatabase from '@directus/api/database/index';
import {getSchema} from '@directus/api/utils/get-schema';
import {FilesService} from '@directus/api/services/files';
import {adoptTaggedUploads,cleanupImage,managedTable,uploadMarker} from '../../directus-extension-website-content/src/media-cleanup.js';
const database=getDatabase(),files=[],posts=[];
const schema=await getSchema({bypassCache:true});
const context={database,getSchema:async()=>schema,services:{FilesService}};
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64');
const native=new FilesService({schema,knex:database,accountability:null});
async function upload(){const id=await native.uploadOne(Readable.from(png),{filename_download:'cleanup-test-only.png',type:'image/png',storage:'local',description:uploadMarker});files.push(id);await adoptTaggedUploads(database);return id}
async function post(image,status='draft'){const [row]=await database('blog_posts').insert({title:'Cleanup test only',slug:'cleanup-test-'+crypto.randomUUID(),category:'Test',summary:'Synthetic cleanup test',status,cover_path:'/site-media/'+image}).returning('id');posts.push(row.id);return row.id}
async function fileExists(id){const row=await database('directus_files').where('id',id).first();if(!row)return false;return (await getStorage()).location(row.storage).exists(row.filename_disk)}
try {
  const first=await upload();assert.equal(await cleanupImage(context,first),'pending');assert.ok(await fileExists(first));
  const one=await post(first),two=await post(first,'hidden');
  const diskRow=await database('directus_files').where('id',first).first();
  const disk=(await getStorage()).location(diskRow.storage);
  const variant=first+'__cleanup_test_thumb.png';await disk.write(variant,Readable.from(png),'image/png');
  assert.equal(await cleanupImage(context,first),'referenced');
  await database('blog_posts').where('id',one).update({cover_path:null});assert.equal(await cleanupImage(context,first),'referenced');
  await database('blog_posts').where('id',two).update({cover_path:null});
  assert.equal(await cleanupImage(context,first),'deleted');assert.equal(await database('directus_files').where('id',first).first(),undefined);
  assert.equal(await (await getStorage()).location(diskRow.storage).exists(diskRow.filename_disk),false);
  assert.equal(await disk.exists(variant),false);
  assert.equal(await database(managedTable).where('file_id',first).first(),undefined);
  console.log('PASS shared draft/hidden image preserved; last reference removal deletes original, variant and DB');

  const pending=await upload();await database(managedTable).where('file_id',pending).update({cleanup_after:new Date(0)});assert.equal(await cleanupImage(context,pending),'deleted');
  console.log('PASS expired abandoned upload deleted');

  const rollback=await upload();const trx=await database.transaction();await trx('blog_posts').where('id',one).update({cover_path:'/site-media/'+rollback});await trx.rollback();
  assert.equal((await database(managedTable).where('file_id',rollback).first()).previously_referenced,false);
  assert.equal(await cleanupImage(context,rollback),'pending');
  console.log('PASS failed/rolled-back save never retires active upload');

  const attached=await upload();const holding=await database.transaction();await holding('blog_posts').where('id',one).update({cover_path:'/site-media/'+attached});
  const waiting=cleanupImage(context,attached);await new Promise(resolve=>setTimeout(resolve,50));await holding.commit();assert.equal(await waiting,'referenced');
  await database('blog_posts').where('id',one).update({cover_path:null});
  let release,start;const gate=new Promise(resolve=>release=resolve),entered=new Promise(resolve=>start=resolve);
  const lockedContext={...context,services:{FilesService:class extends FilesService{async deleteOne(key){start();await gate;return super.deleteOne(key)}}}};
  const deleting=cleanupImage(lockedContext,attached);await entered;
  const attaching=database('blog_posts').where('id',one).update({cover_path:'/site-media/'+attached}).then(()=>null,error=>error.code);
  await new Promise(resolve=>setTimeout(resolve,50));release();assert.equal(await deleting,'deleted');assert.equal(await attaching,'23514');
  assert.equal((await database('blog_posts').where('id',one).first()).cover_path,null);
  console.log('PASS concurrent attachment and deletion serialize; no dangling media reference');

  const retry=await upload();await database(managedTable).where('file_id',retry).update({previously_referenced:true});
  const failing={...context,services:{FilesService:class{constructor(options){this.db=options.knex}async deleteOne(key){await this.db('directus_files').where('id',key).delete();throw new Error('synthetic storage failure')}}}};
  await assert.rejects(cleanupImage(failing,retry));assert.ok(await fileExists(retry));assert.ok((await database(managedTable).where('file_id',retry).first()).retired_at);
  await assert.rejects(database('blog_posts').where('id',one).update({cover_path:'/site-media/'+retry}),error=>error.code==='23514');
  assert.equal(await cleanupImage(context,retry),'deleted');
  console.log('PASS storage failure keeps retryable DB/registry state');
} finally {
  // Exact IDs created by this test only; no glob/path deletion or user-data sweep.
  if(posts.length)await database('blog_posts').whereIn('id',posts).delete();
  for(const id of files){if(await database('directus_files').where('id',id).first()){await database(managedTable).where('file_id',id).update({cleanup_after:new Date(0)});assert.equal(await cleanupImage(context,id),'deleted')}}
  await database.destroy();
}
