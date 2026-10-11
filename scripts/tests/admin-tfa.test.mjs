import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AsyncLocalStorage } from 'node:async_hooks';
import { createJwtFilter, createTfaMiddleware, verifiedState } from '../../directus/extensions/directus-extension-admin-tfa/src/index.js';
const user = { id:'test-user', status:'active', website_tfa_epoch:'epoch-one', tfa_enabled:true, static_match:false };
const token = (epoch, id=user.id) => 'header.'+Buffer.from(JSON.stringify({id,website_tfa_epoch:epoch})).toString('base64url')+'.signature';
function database(row) { const db=()=>({select(){return this;},where(){return this;},whereRaw(){return this;},async first(){return row;}}); db.raw=()=>({}); return db; }
async function gate(path, method='GET', options={}) {
  const row={...user,...options.row};
  const request={path,method,token:options.token ?? token(user.website_tfa_epoch),body:options.body,
    accountability:{user:user.id,admin:true,...options.account}};
  let error;
  await createTfaMiddleware(database(row))(request,{},value=>{error=value;});
  return {error,request};
}
test('Pending administrators cannot use native or custom management routes',async()=>{
  for(const [method,path] of [['GET','/items/blog_posts'],['PATCH','/items/practice_areas/1'],['POST','/files'],['DELETE','/items/blog_posts/1'],['GET','/website-content/admin-team'],['POST','/website-content/admin-team'],['PATCH','/website-content/account-settings'],['PATCH','/website-content/translations/blog_posts/1'],['POST','/website-content/media-discard/x'],['POST','/graphql']]) {
    const {error}=await gate(path,method,{row:{tfa_enabled:false}});assert.equal(error.code,'TFA_SETUP_REQUIRED',path);
  }
});
test('Only exact method/path setup routes, including native case/trailing slash variants, remain available',async()=>{
  for(const [method,path] of [['GET','/website-content/admin-account'],['HEAD','/website-content/admin-account/'],['POST','/USERS/ME/TFA/GENERATE/'],['POST','/users/me/tfa/enable'],['POST','/auth/logout'],['POST','/auth/refresh']]) assert.equal((await gate(path,method,{row:{tfa_enabled:false}})).error,undefined,path);
  for(const [method,path] of [['PATCH','/website-content/admin-account'],['POST','/users/other/tfa/enable'],['POST','/users/me/tfa/disable'],['POST','/users/me/tfa/enable/extra']]) assert.equal((await gate(path,method,{row:{tfa_enabled:false}})).error.code,'TFA_SETUP_REQUIRED');
});
test('Pre-setup/legacy/foreign/stale JWTs never become privileged when enrollment is completed',async()=>{
  for(const value of [token(null),token('old-epoch'),token(user.website_tfa_epoch,'other'),'bad-token']) assert.equal((await gate('/items/blog_posts','GET',{token:value})).error.code,'TFA_LOGIN_REQUIRED');
  assert.equal(verifiedState({user:user.id},token(user.website_tfa_epoch),user),true);
  assert.equal(verifiedState({user:user.id},token(user.website_tfa_epoch),{...user,tfa_enabled:false}),false);
});
test('Enrolled administrator automation remains supported only for a current native-validated static token',async()=>{
  assert.equal((await gate('/items/blog_posts','GET',{token:'temporary-native-token',row:{static_match:true}})).error,undefined);
  assert.equal((await gate('/items/blog_posts','GET',{token:'temporary-native-token',row:{static_match:true,tfa_enabled:false}})).error.code,'TFA_SETUP_REQUIRED');
});
test('Anonymous and non-administrator access is not turned into a setup requirement',async()=>{
  assert.equal((await gate('/website-content/blog-posts','GET',{account:{admin:false,user:undefined}})).error,undefined);
});
test('JWT proof requires unchanged pre-login enrollment, or an already verified same-user refresh',async()=>{
  let scope={login:{...user}};
  const filter=createJwtFilter(database(user),()=>scope);
  const payload={id:user.id,admin_access:true};
  const meta={user:user.id,type:'login'};
  assert.equal((await filter(payload,meta)).website_tfa_epoch,user.website_tfa_epoch);
  for(const login of [null,{...user,tfa_enabled:false},{...user,website_tfa_epoch:'old'},{...user,id:'other'}]) {scope={login};await assert.rejects(filter(payload,meta),error=>error.code==='TFA_LOGIN_REQUIRED');}
  scope={user:user.id,epoch:user.website_tfa_epoch};
  assert.equal((await filter(payload,{...meta,type:'refresh'})).website_tfa_epoch,user.website_tfa_epoch);
  scope={user:'other',epoch:user.website_tfa_epoch};
  await assert.rejects(filter(payload,{...meta,type:'refresh'}));
  scope=undefined;await assert.rejects(filter(payload,{...meta,type:'refresh'}));
  const pending=createJwtFilter(database({...user,tfa_enabled:false}));
  assert.equal((await pending(payload,meta,{})).website_tfa_epoch,null);
});
test('Per-request proof survives fresh native accountability objects and concurrent requests remain isolated',async()=>{
  const storage=new AsyncLocalStorage();
  const observed=[];
  await Promise.all([1,2].map(async n=>{
    const row={...user,id:'user-'+n,website_tfa_epoch:'epoch-'+n};
    const request={path:'/items/blog_posts',method:'GET',token:token(row.website_tfa_epoch,row.id),accountability:{user:row.id,admin:true}};
    await createTfaMiddleware(database(row),storage)(request,{},async error=>{
      if(error)throw error;
      await new Promise(resolve=>setTimeout(resolve,n===1?15:1));
      const claims=await createJwtFilter(database(row),()=>storage.getStore())({id:row.id,admin_access:true},{user:row.id,type:'refresh'},{accountability:{}});
      observed.push(claims.website_tfa_epoch);
    });
  }));
  assert.deepEqual(observed.sort(),['epoch-1','epoch-2']);
  assert.equal(storage.getStore(),undefined);
});
test('Runtime hook mirrors source; client checks account before loading content and enforces setup-only UI',()=>{
  const root=new URL('../../',import.meta.url);
  assert.equal(readFileSync(new URL('directus/extensions/directus-extension-admin-tfa/src/index.js',root),'utf8'),readFileSync(new URL('directus/extensions/directus-extension-admin-tfa/dist/index.js',root),'utf8'));
  const client=readFileSync(new URL('frontend/app/bakir/admin-client.tsx',root),'utf8');
  assert.ok(client.indexOf('if (!currentUser.tfa_enabled)')<client.indexOf('const [{ data: members }'));
  assert.match(client,/if \(!user\?\.tfa_enabled\) \{[\s\S]*?securityPanel[\s\S]*?return|if \(!user\?\.tfa_enabled\) \{[\s\S]*?securityPanel[\s\S]*?\n  \}/);
  const sql=readFileSync(new URL('scripts/migrations/012-admin-tfa-enforcement.sql',root),'utf8');
  assert.match(sql,/NEW\.website_tfa_epoch := gen_random_uuid/);
  assert.match(sql,/NEW\.token := NULL/);
  assert.match(sql,/DELETE FROM directus_sessions/);
  for (const file of ['compose.yaml','compose.vps.yaml','deploy/vps/tfa-test.compose.yaml']) {
    const config=readFileSync(new URL(file,root),'utf8');
    assert.match(config,/CACHE_ENABLED:\s*["']false["']/);
    assert.match(config,/WEBSOCKETS_ENABLED:\s*["']false["']/);
  }
  const rollout=readFileSync(new URL('deploy/vps/rollout-admin-tfa.sh',root),'utf8');
  assert.ok(rollout.indexOf('install -d -m 755 "$app/directus/extensions/directus-extension-admin-tfa"')
    < rollout.indexOf('"${compose[@]}" up -d --no-deps --wait directus'));
});
