// Strictly isolated cloned/scrubbed DB only. Never run against production.
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {createRequire} from 'node:module';
import {realpathSync,existsSync} from 'node:fs';
import dbFactory from '/directus/node_modules/@directus/api/dist/database/index.js';
import {getSchema} from '/directus/node_modules/@directus/api/dist/utils/get-schema.js';
import {UsersService} from '/directus/node_modules/@directus/api/dist/services/users.js';
import {FilesService} from '/directus/node_modules/@directus/api/dist/services/files.js';

assert.equal(process.env.TEST_NODE_RUNTIME_FIXTURE,'1');
assert.equal(process.env.DB_DATABASE,'node_runtime_fixture');
assert.equal(process.env.DB_HOST,'database');
assert.equal(process.versions.node,'22.23.4');
const db=dbFactory();
assert.equal((await db.raw('select current_database() as name')).rows[0].name,'node_runtime_fixture');
assert.equal(Number((await db('directus_users').whereRaw("status <> 'suspended' OR email IS NOT NULL OR password IS NOT NULL OR tfa_secret IS NOT NULL OR token IS NOT NULL").count('* as n').first()).n),0,'copied real accounts must be scrubbed before test');
const originalUsers=await db('directus_users').select('id').orderBy('id');
const require=createRequire(realpathSync('/directus/node_modules/@directus/api/package.json'));
const {authenticator}=require('otplib');const sharp=require('sharp');
const password='QA#'+randomBytes(24).toString('hex');
const email='node-'+randomBytes(9).toString('hex')+'@example.com';
const base='http://127.0.0.1:8055';
const originalContent=await db('blog_posts').select('id').orderBy('id');
let ownedUser;
const ownedFiles=[];
async function api(path,cookie,body,method=body===undefined?'GET':'POST',mime='application/json'){
  const response=await fetch(base+path,{method,headers:{...(cookie?{Cookie:cookie}:{}),...(body===undefined?{}:{'Content-Type':mime})},...(body===undefined?{}:{body:mime==='application/json'?JSON.stringify(body):body})});
  return {status:response.status,data:response.status===204?null:await response.json().catch(()=>null),cookie:response.headers.get('set-cookie')?.split(';')[0]};
}
try{
  const role=await db('directus_access as a').join('directus_policies as p','p.id','a.policy').where('p.admin_access',true).whereNotNull('a.role').first('a.role');assert.ok(role);
  ownedUser=await new UsersService({schema:await getSchema(),accountability:null}).createOne({role:role.role,status:'active',first_name:'Node QA',last_name:'Fixture',email,password});
  const pending=await api('/auth/login',null,{email,password,mode:'session'});assert.equal(pending.status,200);
  assert.equal((await api('/items/blog_posts',pending.cookie)).status,403);
  assert.equal((await api('/website-content/image-upload',pending.cookie,{},'POST')).status,403);
  const setup=await api('/users/me/tfa/generate',pending.cookie,{password});assert.equal(setup.status,200);
  const secret=setup.data.data.secret;
  assert.equal((await api('/users/me/tfa/enable',pending.cookie,{secret,otp:authenticator.generate(secret)})).status,204);
  assert.notEqual((await api('/items/blog_posts',pending.cookie)).status,200);
  assert.notEqual((await api('/auth/login',null,{email,password,mode:'session'})).status,200);
  const login=await api('/auth/login',null,{email,password,otp:authenticator.generate(secret),mode:'session'});assert.equal(login.status,200);
  assert.equal((await api('/items/blog_posts',login.cookie)).status,200);
  assert.equal((await api('/website-content/admin-team',login.cookie)).status,200);
  assert.equal((await api('/website-content/admin-account',login.cookie)).data.data.tfa_session_verified,true);
  const refreshed=await api('/auth/refresh',login.cookie,{mode:'session'});assert.equal(refreshed.status,200);
  const cookie=refreshed.cookie||login.cookie;
  assert.equal((await api('/items/blog_posts',cookie)).status,200);
  assert.equal((await api('/website-content/image-upload',cookie,Buffer.from('fake'),'POST','image/png')).status,400);
  for(const [format,mime] of [['jpeg','image/jpeg'],['png','image/png'],['webp','image/webp']]){
    const bytes=await sharp({create:{width:8,height:6,channels:3,background:'#336699'}}).toFormat(format).toBuffer();
    const uploaded=await api('/website-content/image-upload',cookie,bytes,'POST',mime);assert.equal(uploaded.status,201,format);
    const id=uploaded.data.data.id;ownedFiles.push(id);
    const file=await db('directus_files').where('id',id).first('filename_disk');assert.ok(file);
    const filePath='/directus/uploads/'+file.filename_disk;assert.ok(existsSync(filePath));
    assert.equal((await api('/website-content/media-discard/'+id,cookie,{})).status,200);
    assert.equal(await db('directus_files').where('id',id).first(),undefined);
    assert.equal(await db('website_media_assets').where('file_id',id).first(),undefined);
    assert.equal(existsSync(filePath),false);
  }
  assert.equal((await api('/auth/logout',cookie,{mode:'session'})).status,204);
  assert.notEqual((await api('/items/blog_posts',cookie)).status,200);
  assert.equal((await api('/website-content/blog-posts?language=tr')).status,200);
  console.log('PASS isolated native password/TOTP/login/refresh/logout, private denial, public content, image validation, upload and permanent file cleanup.');
}finally{
  // Raw cleanup is allowed only by the isolated database identity guards above.
  let cleanupFailed=false;
  try{
    for(const id of ownedFiles){
      try{
        const file=await db('directus_files').where('id',id).first('uploaded_by');
        if(file){assert.equal(file.uploaded_by,ownedUser);await new FilesService({schema:await getSchema(),knex:db,accountability:null}).deleteOne(id);}
      }catch{cleanupFailed=true;}
    }
    try{
      if(ownedUser){assert.equal((await db('directus_users').where('id',ownedUser).first('email')).email,email);await db('directus_sessions').where('user',ownedUser).delete();await db('directus_users').where('id',ownedUser).delete();}
      assert.deepEqual(await db('directus_users').select('id').orderBy('id'),originalUsers);
      assert.deepEqual(await db('blog_posts').select('id').orderBy('id'),originalContent);
    }catch{cleanupFailed=true;}
  }finally{await db.destroy();}
  assert.equal(cleanupFailed,false,'owned fixture cleanup failed');
  console.log('PASS owned fixture accounts/media removed; copied content identities preserved.');
}
