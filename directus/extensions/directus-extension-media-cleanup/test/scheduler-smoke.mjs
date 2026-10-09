// Verifies the live server's minute scheduler, without administrator credentials.
// Only the exact synthetic image/post created here may be changed or removed.
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import getDatabase from '@directus/api/database/index';
import {getSchema} from '@directus/api/utils/get-schema';
import {FilesService} from '@directus/api/services/files';
import {getStorage} from '@directus/api/storage/index';
import {cleanupImage,managedTable,uploadMarker} from '../../directus-extension-website-content/src/media-cleanup.js';
const database=getDatabase(),schema=await getSchema({bypassCache:true});
const context={database,getSchema:async()=>schema,services:{FilesService}};
let image,post,diskRow;
try {
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64');
  image=await new FilesService({schema,knex:database,accountability:null}).uploadOne(Readable.from(png),{storage:'local',type:'image/png',filename_download:'cleanup-scheduler-test-only.png',description:uploadMarker});
  diskRow=await database('directus_files').where('id',image).first();
  const [record]=await database('blog_posts').insert({title:'Cleanup scheduler test only',slug:'cleanup-scheduler-'+crypto.randomUUID(),category:'Test',summary:'Synthetic test',status:'draft',cover_path:'/site-media/'+image}).returning('id');post=record.id;
  await database('blog_posts').where('id',post).delete();post=null;
  console.log('Waiting for live server minute scheduler to delete the synthetic orphan');
  const until=Date.now()+75000;
  while(Date.now()<until && await database('directus_files').where('id',image).first()) await new Promise(resolve=>setTimeout(resolve,1000));
  assert.equal(await database('directus_files').where('id',image).first(),undefined);
  assert.equal(await database(managedTable).where('file_id',image).first(),undefined);
  assert.equal(await (await getStorage()).location(diskRow.storage).exists(diskRow.filename_disk),false);
  console.log('PASS live scheduler deleted only the synthetic orphan from disk and DB');
} finally {
  if(post)await database('blog_posts').where('id',post).delete();
  if(image && await database('directus_files').where('id',image).first())await cleanupImage(context,image);
  await database.destroy();
}
