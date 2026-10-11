// Run inside the existing Directus container with TEST_OWNED_ADMIN_SMOKE=1.
// Uses one temporary account, owns every write, and never prints credentials.
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {createRequire} from 'node:module';
import dbFactory from '/directus/node_modules/@directus/api/dist/database/index.js';
import {getSchema} from '/directus/node_modules/@directus/api/dist/utils/get-schema.js';
import {UsersService} from '/directus/node_modules/@directus/api/dist/services/users.js';

assert.equal(process.env.TEST_OWNED_ADMIN_SMOKE,'1');
const rootRequire=createRequire('/directus/node_modules/directus/package.json');
const nativeRequire=createRequire(rootRequire.resolve('@directus/api/package.json'));
const {authenticator}=nativeRequire('otplib');
const db=dbFactory();
const base='http://127.0.0.1:8055';
const tag=randomBytes(9).toString('hex');
const email=`tfa-${tag}@example.com`;
const password='Qa#'+randomBytes(24).toString('hex');
let ownedId=null;

async function request(path,cookie,body,method=body===undefined?'GET':'POST'){
  const response=await fetch(base+path,{method,headers:{...(cookie?{Cookie:cookie}:{}),...(body===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)})});
  return {status:response.status,data:response.status===204?null:await response.json().catch(()=>null),cookie:response.headers.get('set-cookie')?.split(';')[0]};
}
async function login(otp){return request('/auth/login',null,{email,password,mode:'session',...(otp?{otp}:{})});}

const original={
  users:await db('directus_users').select('id').orderBy('id'),
  blogs:await db('blog_posts').select('id').orderBy('id'),
};
try{
  const adminRole=await db('directus_access as a').join('directus_policies as p','p.id','a.policy').where('p.admin_access',true).whereNotNull('a.role').first('a.role');
  assert.ok(adminRole?.role);
  ownedId=await new UsersService({schema:await getSchema(),accountability:null}).createOne({
    role:adminRole.role,status:'active',first_name:'QA',last_name:'TFA',email,password,
  });
  const pending=await login();assert.equal(pending.status,200);
  assert.ok(pending.cookie);
  assert.equal((await request('/items/blog_posts',pending.cookie)).status,403);
  assert.equal((await request('/website-content/admin-team',pending.cookie)).status,403);
  const account=await request('/website-content/admin-account',pending.cookie);
  assert.equal(account.status,200);
  assert.equal(account.data?.data?.tfa_enabled,false);
  assert.equal(account.data?.data?.tfa_session_verified,false);
  const generated=await request('/users/me/tfa/generate',pending.cookie,{password});
  assert.equal(generated.status,200);
  const secret=generated.data?.data?.secret;assert.equal(typeof secret,'string');
  assert.equal((await request('/users/me/tfa/enable',pending.cookie,{secret,otp:authenticator.generate(secret)})).status,204);
  assert.notEqual((await request('/items/blog_posts',pending.cookie)).status,200);
  assert.notEqual((await login()).status,200);
  const ready=await login(authenticator.generate(secret));assert.equal(ready.status,200);
  assert.ok(ready.cookie);
  assert.equal((await request('/items/blog_posts',ready.cookie)).status,200);
  assert.equal((await request('/website-content/admin-team',ready.cookie)).status,200);
  const verified=await request('/website-content/admin-account',ready.cookie);
  assert.equal(verified.data?.data?.tfa_session_verified,true);
  console.log('PASS live native Directus onboarding, private-route denial, OTP login and enrolled access with one owned test account.');
}finally{
  try{
    if(ownedId){
      const row=await db('directus_users').where('id',ownedId).first('email');
      if(row?.email===email){
        await new UsersService({schema:await getSchema(),accountability:null}).deleteOne(ownedId);
      }
    }
    assert.deepEqual(await db('directus_users').select('id').orderBy('id'),original.users);
    assert.deepEqual(await db('blog_posts').select('id').orderBy('id'),original.blogs);
    console.log('PASS owned test account removed; original account and blog identities unchanged.');
  }finally{await db.destroy();}
}
