import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {randomBytes} from 'node:crypto';
const base=process.env.TEST_SITE_URL || 'http://localhost:8080';
const tag=randomBytes(10).toString('hex');
const state={user:null,token:null,file:null,diskName:null,created:[]};
function internal(code) {
  const source=`
import getDatabase from '/directus/node_modules/@directus/api/dist/database/index.js';
import {getSchema} from '/directus/node_modules/@directus/api/dist/utils/get-schema.js';
import {UsersService} from '/directus/node_modules/@directus/api/dist/services/users.js';
const db=getDatabase();
try {const result=await (async()=>{${code}})();console.log('__RESULT__'+JSON.stringify(result));}
finally {await db.destroy();}
`;
  const result=spawnSync('docker',['compose','exec','-T','directus','node','--input-type=module'],{input:source,encoding:'utf8',cwd:new URL('../../',import.meta.url),timeout:45000});
  assert.equal(result.status,0,result.stderr);
  const line=result.stdout.split(/\r?\n/).find(line=>line.startsWith('__RESULT__'));
  assert.ok(line,'Internal test helper returned no result');return JSON.parse(line.slice(10));
}
async function api(path,init={}) {
  const response=await fetch(base+'/bakir-api'+path,{...init,headers:{Authorization:'Bearer '+state.token,...(init.body instanceof FormData?{}:{'Content-Type':'application/json'}),...init.headers}});
  if(!response.ok){const error=await response.json().catch(()=>null);assert.fail(`API ${init.method||'GET'} ${path}: ${response.status} / ${(error?.errors||[]).map(item=>item.extensions?.code+':'+(item.extensions?.field||'')).join(',')}`);}
  return response.status===204?null:(await response.json()).data;
}
async function filePresent() {return internal(`return Boolean(await db('directus_files').where('id',${JSON.stringify(state.file)}).first());`)}
async function waitUntil(check,label) {
  for(let n=0;n<20;n++){if(await check())return;await new Promise(resolve=>setTimeout(resolve,250));}
  assert.fail(label);
}
const original=internal(`
return {users:await db('directus_users').count('* as n').first(),blog:await db('blog_posts').select('id').orderBy('id'),areas:await db('practice_areas').select('id').orderBy('id')};
`);
try {
  // Temporary account/token only; no real credentials, accounts or TFA change.
  const identity=internal(`
const role=await db('directus_roles as r').join('directus_access as a','a.role','r.id').join('directus_policies as p','p.id','a.policy').where('p.admin_access',true).first('r.id');
if(!role)throw new Error('No existing admin role');
const token=${JSON.stringify(randomBytes(32).toString('hex'))};
const service=new UsersService({knex:db,schema:await getSchema(),accountability:null});
const id=await service.createOne({email:${JSON.stringify(`codex-delete-${tag}@example.com`)},status:'active',role:role.id,token});
return {id,token};
`);
  state.user=identity.id;state.token=identity.token;
  const upload=new FormData();upload.append('description','fizyoterapi-site-image:v1');
  upload.append('file',new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a4x8AAAAASUVORK5CYII=','base64')],{type:'image/png'}),`codex-delete-${tag}.png`);
  const uploaded=await api('/files',{method:'POST',body:upload});
  state.file=uploaded.id;state.diskName=uploaded.filename_disk;
  assert.match(state.diskName,/^[0-9a-f-]{36}\.png$/i);
  const image='/site-media/'+state.file;
  const blog=await api('/items/blog_posts',{method:'POST',body:JSON.stringify({status:'published',title:'Geçici silme testi '+tag,slug:'codex-delete-'+tag,category:'Geçici test',summary:'Yalnız otomatik doğrulama için oluşturulmuş geçici kayıt.',reading_minutes:1,featured:false,cover_path:image,published_at:'2026-10-09'})});
  state.created.push({collection:'blog_posts',id:blog.id});
  const area=await api('/items/practice_areas',{method:'POST',body:JSON.stringify({status:'published',title:'Geçici alan silme testi '+tag,slug:'codex-area-delete-'+tag,summary:'Yalnız otomatik doğrulama için oluşturulmuş geçici kayıt.',show_on_homepage:false,image_path:image})});
  state.created.push({collection:'practice_areas',id:area.id});
  const translated=[];
  for(const record of [blog,area])for(const language of ['en','de']){
    const collection=record===blog?'blog_posts':'practice_areas';
    const version=await api(`/website-content/translations/${collection}/${record.id}/${language}`,{method:'PATCH',body:JSON.stringify({status:'published',slug:`codex-${language}-${tag}`,content:{title:`Deletion check ${language} ${tag}`,summary:'Temporary automated test record.'}})});
    translated.push({collection,language,slug:version.slug});
  }
  const renamed=await api('/items/practice_areas/'+area.id,{method:'PATCH',body:JSON.stringify({title:'Yeniden adlandırılan silme testi '+tag})});
  assert.notEqual(renamed.slug,area.slug);
  const directories={blog_posts:{en:'/en/blog',de:'/de/blog'},practice_areas:{en:'/en/practice-areas',de:'/de/behandlungsbereiche'}};
  const paths=[`/blog/${blog.slug}`,`/calisma-alanlari/${renamed.slug}`,...translated.map(item=>`${directories[item.collection][item.language]}/${item.slug}`)];
  for(const path of paths) assert.equal((await fetch(base+path)).status,200,path);
  const denied=await fetch(base+'/bakir-api/items/blog_posts/'+blog.id,{method:'DELETE'});assert.equal(denied.status,403);
  await api('/items/blog_posts/'+blog.id,{method:'DELETE'});
  assert.equal(await filePresent(),true,'Shared photo removed too early');
  const remaining=internal(`return await db('website_content_translations').where({collection:'blog_posts',parent_id:${blog.id}}).count('* as n').first();`);assert.equal(Number(remaining.n),0);
  for(const path of paths.filter(path=>path.includes('/blog/')))assert.equal((await fetch(base+path)).status,404,path);
  await api('/items/practice_areas/'+area.id,{method:'DELETE'});
  await waitUntil(async()=>!(await filePresent()),'Unreferenced test photo was not cleaned');
  const metadata=internal(`return {translations:await db('website_content_translations').where({collection:'practice_areas',parent_id:${area.id}}).count('* as n').first(),aliases:await db('website_practice_slug_aliases').where('parent_id',${area.id}).count('* as n').first(),media:await db('website_media_assets').where('file_id',${JSON.stringify(state.file)}).count('* as n').first()};`);
  for(const row of Object.values(metadata))assert.equal(Number(row.n),0);
  const originalFileGone=internal(`const {access}=await import('node:fs/promises');try{await access(${JSON.stringify('/directus/uploads/'+state.diskName)});return false;}catch{return true;}`);
  assert.equal(originalFileGone,true,'Deleted test photo remained in physical storage');
  for(const path of paths)assert.equal((await fetch(base+path)).status,404,path);
  assert.equal((await fetch(base+'/calisma-alanlari/'+area.slug)).status,404,'Old alias survived deletion');
  const sitemap=await(await fetch(base+'/sitemap.xml')).text();for(const path of paths)assert.ok(!sitemap.includes(path));
  console.log('PASS native admin deletion, anonymous deny, TR/EN/DE 404, old alias, sitemap, translation cascade, shared photo retention and final cleanup');
} finally {
  if(state.token){
    for(const record of state.created){
      const exists=await api(`/items/${record.collection}?filter[id][_eq]=${record.id}`);
      if(exists.length)await api(`/items/${record.collection}/${record.id}`,{method:'DELETE'});
    }
    if(state.file && await filePresent())await api('/website-content/media-discard/'+state.file,{method:'POST'});
  }
  if(state.user)internal(`const service=new UsersService({knex:db,schema:await getSchema(),accountability:null});await service.deleteOne(${JSON.stringify(state.user)});return true;`);
}
const after=internal(`return {users:await db('directus_users').count('* as n').first(),blog:await db('blog_posts').select('id').orderBy('id'),areas:await db('practice_areas').select('id').orderBy('id')};`);
assert.deepEqual(after,original,'Real account/content inventory changed');
console.log('PASS temporary test account/content removed; real account count/content IDs preserved');
