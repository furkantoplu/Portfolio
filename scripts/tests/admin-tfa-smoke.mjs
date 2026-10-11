// Creates only owned random test accounts. Never reads/changes real TFA secrets or credentials.
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {randomBytes} from 'node:crypto';
const base=process.env.TEST_SITE_URL || 'http://localhost:8080';
const container=process.env.TEST_DIRECTUS_CONTAINER || 'fizyoterapi-directus-1';
const tag=randomBytes(9).toString('hex');
const created=[];
function internal(code){
  const source=`import dbFactory from '/directus/node_modules/@directus/api/dist/database/index.js'; import {getSchema} from '/directus/node_modules/@directus/api/dist/utils/get-schema.js'; import {UsersService} from '/directus/node_modules/@directus/api/dist/services/users.js'; import {createRequire} from 'node:module'; const db=dbFactory(); try {console.log('__RESULT__'+JSON.stringify(await (async()=>{${code}})()));}catch(error){console.log('__ERROR__'+JSON.stringify({name:error.name,code:error.code,field:error.extensions?.field}));process.exitCode=1;}finally{await db.destroy();}`;
  const result=spawnSync('docker',['exec','-i',container,'node','--input-type=module'],{input:source,encoding:'utf8',timeout:45000});
  if(result.status!==0) throw new Error('Private test helper failed: '+(result.stdout.split(/\r?\n/).find(value=>value.startsWith('__ERROR__')) || 'sensitive output suppressed'));
  const line=result.stdout.split(/\r?\n/).find(value=>value.startsWith('__RESULT__'));
  if(!line)throw new Error('Private test helper returned no result.');
  return JSON.parse(line.slice(10));
}
async function api(path,credential,body,method=body===undefined?'GET':'POST'){
  if(process.env.TEST_API_CONTAINER){
    const source=`const response=await fetch(${JSON.stringify(base+'/bakir-api'+path)},${JSON.stringify({method,headers:{...(credential?.cookie?{Cookie:credential.cookie}:credential?.token?{Authorization:'Bearer '+credential.token}:{}),...(body===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)})})});const data=response.status===204?null:await response.json().catch(()=>null);console.log('__RESULT__'+JSON.stringify({status:response.status,data,cookie:response.headers.get('set-cookie')?.split(';')[0]}));`;
    const result=spawnSync('docker',['exec','-i',process.env.TEST_API_CONTAINER,'node','--input-type=module'],{input:source,encoding:'utf8',timeout:30000});
    if(result.status!==0)throw new Error('Private fixture HTTP failed; sensitive output suppressed.');
    return JSON.parse(result.stdout.split(/\r?\n/).find(line=>line.startsWith('__RESULT__')).slice(10));
  }
  const response=await fetch(base+'/bakir-api'+path,{method,headers:{...(credential?.cookie?{Cookie:credential.cookie}:credential?.token?{Authorization:'Bearer '+credential.token}:{}),...(body===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)})});
  const data=response.status===204?null:await response.json().catch(()=>null);
  return {status:response.status,data,cookie:response.headers.get('set-cookie')?.split(';')[0]};
}
async function login(person,mode='session',otp){const response=await api('/auth/login',null,{email:person.email,password:person.password,otp,mode});return {...response,token:response.data?.data?.access_token,refresh:response.data?.data?.refresh_token};}
function otp(secret){return internal(`const root=createRequire('/directus/node_modules/directus/package.json');const req=createRequire(root.resolve('@directus/api/package.json'));const {authenticator}=req('otplib');return authenticator.generate(${JSON.stringify(secret)});`);}
const original=internal(`return {users:await db('directus_users').select('id').orderBy('id'),content:await db('blog_posts').select('id').orderBy('id')};`);
try{
  for(let i=0;i<1;i++){
    const person={email:`tfa-${tag}-${i}@example.com`,password:'Qa#'+randomBytes(24).toString('hex')};
    person.id=internal(`const role=await db('directus_access as a').join('directus_policies as p','p.id','a.policy').where('p.admin_access',true).whereNotNull('a.role').first('a.role');if(!role)throw Error('No role');return new UsersService({schema:await getSchema(),accountability:null}).createOne({role:role.role,status:'active',first_name:'QA',last_name:'TFA',email:${JSON.stringify(person.email)},password:${JSON.stringify(person.password)}});`);
    created.push(person);
  }
  const pending=await login(created[0]);assert.equal(pending.status,200);
  const weakJwt=await login(created[0],'json');assert.equal(weakJwt.status,200);
  if(process.argv.includes('--expect-unprotected')){
    assert.equal((await api('/items/blog_posts',pending)).status,200);
    console.log('REPRODUCED: newly created password-only admin can read private content before enrollment.');
  }else{
    for(const credential of [pending,weakJwt])for(const [method,path] of [['GET','/items/blog_posts'],['GET','/website-content/admin-team'],['POST','/website-content/admin-team'],['POST','/files'],['PATCH','/items/practice_areas/999999999'],['POST','/website-content/media-discard/12345678-1234-4234-8234-123456789abc']]) assert.equal((await api(path,credential,method==='GET'?undefined:{},method)).status,403,path);
    const account=await api('/website-content/admin-account',pending);assert.equal(account.status,200);assert.equal(account.data.data.tfa_enabled,false);assert.equal(account.data.data.tfa_session_verified,false);
    const generated=await api('/users/me/tfa/generate',pending,{password:created[0].password});assert.equal(generated.status,200);
    const secret=generated.data.data.secret;
    assert.equal((await api('/users/me/tfa/enable',pending,{secret,otp:'not-a-code'})).status,400);
    // Pre-setup static token is invalidated atomically on enrollment too.
    const weakStatic=randomBytes(24).toString('hex');internal(`await db('directus_users').where('id',${JSON.stringify(created[0].id)}).update({token:${JSON.stringify(weakStatic)}});return true;`);
    assert.equal((await api('/items/blog_posts',{token:weakStatic})).status,403);
    assert.equal((await api('/users/me/tfa/enable',pending,{secret,otp:otp(secret)})).status,204);
    assert.equal((await api('/items/blog_posts',weakJwt)).status,403);
    assert.equal((await api('/items/blog_posts',pending)).status,401);
    assert.equal((await api('/items/blog_posts',{token:weakStatic})).status,401);
    assert.notEqual((await api('/auth/refresh',null,{refresh_token:weakJwt.refresh,mode:'json'})).status,200);
    assert.notEqual((await login(created[0])).status,200);
    const verified=await login(created[0],'session',otp(secret));assert.equal(verified.status,200);
    assert.equal((await api('/items/blog_posts',verified)).status,200);
    assert.equal((await api('/website-content/admin-team',verified)).status,200);
    assert.equal((await api('/website-content/admin-account',verified)).data.data.tfa_session_verified,true);
    const refreshed=await api('/auth/refresh',verified,{mode:'session'});assert.equal(refreshed.status,200);
    const active=refreshed.cookie?{cookie:refreshed.cookie}:verified;
    assert.equal((await api('/items/blog_posts',active)).status,200);
    const body={first_name:'QA',last_name:'Pending',email:`tfa-${tag}-new@example.com`,password:'Qa#'+randomBytes(24).toString('hex')};
    const newMember=await api('/website-content/admin-team',active,body);assert.equal(newMember.status,201);created.push({...body,id:newMember.data.data.id});
    assert.equal((await api('/items/blog_posts',await login(body))).status,403);
    // A different administrator still needs their own Authenticator.
    const second=await login(created[1]);const secondSetup=await api('/users/me/tfa/generate',second,{password:created[1].password});assert.equal(secondSetup.status,200);
    const secondSecret=secondSetup.data.data.secret;
    assert.equal((await api('/users/me/tfa/enable',second,{secret:secondSecret,otp:otp(secondSecret)})).status,204);
    const secondReady=await login(created[1],'session',otp(secondSecret));assert.equal(secondReady.status,200);
    assert.equal((await api('/website-content/account-settings',secondReady,{first_name:'QA Verified',current_password:created[1].password,otp:otp(secondSecret)},'PATCH')).status,200);
    const automation=randomBytes(24).toString('hex');internal(`await db('directus_users').where('id',${JSON.stringify(created[1].id)}).update({token:${JSON.stringify(automation)}});return true;`);
    assert.equal((await api('/items/blog_posts',{token:automation})).status,200);
    // A TFA version cannot be restored to an older JWT epoch by a direct field update.
    internal(`const old=await db('directus_users').where('id',${JSON.stringify(created[1].id)}).first('website_tfa_epoch');await db('directus_users').where('id',${JSON.stringify(created[1].id)}).update({website_tfa_epoch:'00000000-0000-4000-8000-000000000001'});const current=await db('directus_users').where('id',${JSON.stringify(created[1].id)}).first('website_tfa_epoch');if(current.website_tfa_epoch===old.website_tfa_epoch||current.website_tfa_epoch==='00000000-0000-4000-8000-000000000001')throw Error('Epoch rollback');return true;`);
    assert.equal((await api('/items/blog_posts',secondReady)).status,401);
    assert.equal((await api('/items/blog_posts',{token:automation})).status,401);
    console.log('PASS mandatory onboarding, native/custom/upload denial, stale cookie/JWT/static/refresh rejection, OTP login, refresh, two admins, self-profile and enrolled automation.');
  }
}finally{
  const emptyOwnedFixture=original.users.length===0 && /^fizyoterapi-tfa-[a-f0-9]{8}-directus-1$/.test(container);
  for(const person of created.reverse())internal(`const person=await db('directus_users').where('id',${JSON.stringify(person.id)}).first('email');if(person&&person.email.startsWith(${JSON.stringify('tfa-'+tag+'-')})){${emptyOwnedFixture ? `await db('directus_sessions').where('user',${JSON.stringify(person.id)}).delete();await db('directus_users').where('id',${JSON.stringify(person.id)}).delete();` : `await new UsersService({schema:await getSchema(),accountability:null}).deleteOne(${JSON.stringify(person.id)});`}}return true;`);
  assert.deepEqual(internal(`return {users:await db('directus_users').select('id').orderBy('id'),content:await db('blog_posts').select('id').orderBy('id')};`),original);
  console.log('PASS owned test accounts removed; original users/content identities unchanged.');
}
