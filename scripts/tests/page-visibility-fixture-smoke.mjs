// Only a new, credential-scrubbed, private tmpfs copy. Never use with production DB.
import assert from 'node:assert/strict';
import { randomBytes, createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { realpathSync } from 'node:fs';
import dbFactory from '/directus/node_modules/@directus/api/dist/database/index.js';
import { getSchema } from '/directus/node_modules/@directus/api/dist/utils/get-schema.js';
import { UsersService } from '/directus/node_modules/@directus/api/dist/services/users.js';
assert.equal(process.env.TEST_PAGE_VISIBILITY_FIXTURE,'1');
assert.equal(process.env.DB_DATABASE,'node_runtime_fixture');assert.equal(process.env.DB_HOST,'database');
const db=dbFactory();
assert.equal((await db.raw('select current_database() as name')).rows[0].name,'node_runtime_fixture');
assert.equal(Number((await db('directus_users').whereRaw("status <> 'suspended' OR email IS NOT NULL OR password IS NOT NULL OR tfa_secret IS NOT NULL OR token IS NOT NULL").count('* as n').first()).n),0);
const require=createRequire(realpathSync('/directus/node_modules/@directus/api/package.json'));
const {authenticator}=require('otplib');
const base='http://proxy';
const owned=[];
const originalVisibility=await db('site_pages').where('page_key','visibility').first();
async function contentHash(){
  const data=await Promise.all(['site_pages','blog_posts','practice_areas','website_content_translations'].map(table=>{
    const query=db(table).select('*').orderBy('id');if(table==='site_pages')query.whereNot('page_key','visibility');return query;
  }));
  return createHash('sha256').update(JSON.stringify(data)).digest('hex');
}
const before=await contentHash();
async function api(path,cookie,body,method=body===undefined?'GET':'POST'){
  const response=await fetch(base+'/bakir-api'+path,{method,headers:{...(cookie?{Cookie:cookie}:{}),...(body===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)})});
  return {status:response.status,data:response.status===204?null:await response.json().catch(()=>null),cookie:response.headers.get('set-cookie')?.split(';')[0]};
}
async function page(path,status=200){const response=await fetch(base+path);assert.equal(response.status,status,path);return response.text()}
const routes={home:['/','/en','/de'],about:['/hakkimda','/en/about','/de/ueber-mich'],areas:['/calisma-alanlari','/en/practice-areas','/de/behandlungsbereiche'],blog:['/blog','/en/blog','/de/blog'],contact:['/iletisim','/en/contact','/de/kontakt'],privacy:['/gizlilik'],kvkk:['/kvkk-aydinlatma-metni']};
try{
  // Start open only in the disposable copy, without altering real page/translation content.
  if(originalVisibility)await db('site_pages').where('id',originalVisibility.id).update({content:JSON.stringify({})});
  assert.equal((await api('/website-content/page-visibility/contact',null,{visible:false},'PATCH')).status,401);
  const role=await db('directus_access as a').join('directus_policies as p','p.id','a.policy').where('p.admin_access',true).whereNotNull('a.role').first('a.role');assert.ok(role);
  async function admin(){
    const email='visibility-'+randomBytes(9).toString('hex')+'@example.com',password='Qa#'+randomBytes(24).toString('hex');
    const id=await new UsersService({schema:await getSchema(),accountability:null}).createOne({role:role.role,status:'active',email,password});owned.push({id,email});
    const setupLogin=await api('/auth/login',null,{email,password,mode:'session'});assert.equal(setupLogin.status,200);
    assert.equal((await api('/website-content/page-visibility/contact',setupLogin.cookie,{visible:false},'PATCH')).status,403);
    const setup=await api('/users/me/tfa/generate',setupLogin.cookie,{password});assert.equal(setup.status,200);const secret=setup.data.data.secret;
    assert.equal((await api('/users/me/tfa/enable',setupLogin.cookie,{secret,otp:authenticator.generate(secret)})).status,204);
    const login=await api('/auth/login',null,{email,password,otp:authenticator.generate(secret),mode:'session'});assert.equal(login.status,200);return login.cookie;
  }
  const first=await admin(),second=await admin();
  async function toggle(key,visible,cookie=first){const result=await api('/website-content/page-visibility/'+key,cookie,{visible},'PATCH');assert.equal(result.status,200,key);return result.data.data}
  assert.equal((await api('/website-content/page-visibility/home',first,{visible:false},'PATCH')).status,400);
  await toggle('about',false);assert.equal((await toggle('contact',false,second)).about,false);await toggle('about',true);await toggle('contact',true);
  for(const key of Object.keys(routes).filter(key=>key!=='home')){
    const nested=[];
    if(key==='blog'||key==='areas'){
      for(const [index,language] of ['tr','en','de'].entries()){
        const endpoint=key==='blog'?'blog-posts':'practice-areas';const result=await api('/website-content/'+endpoint+'?language='+language);assert.equal(result.status,200);
        const item=result.data.data[0];if(item)nested.push({path:routes[key][index]+'/'+item.slug,api:'/website-content/'+endpoint+'/'+item.slug+'?language='+language});
      }
    }
    await toggle(key,false);
    for(const path of routes[key])await page(path,404);
    for(const item of nested){await page(item.path,404);assert.equal((await api(item.api)).status,404)}
    if(key==='areas'||key==='blog')for(const language of ['tr','en','de'])assert.deepEqual((await api('/website-content/'+(key==='blog'?'blog-posts':'practice-areas')+'?homepage=true&language='+language)).data.data,[]);
    for(const path of routes.home){const html=await page(path);for(const hiddenPath of routes[key])assert.ok(!html.includes(`href="${hiddenPath}"`),path+' links '+hiddenPath);if(key==='contact'){assert.ok(!html.includes('class="header-cta"'));assert.ok(!html.includes('class="mobile-nav__cta"'))}}
    const map=await page('/sitemap.xml');for(const path of routes[key])assert.ok(!map.includes('https://furkantoplu.com'+path+'</loc>'),path+' sitemap');
    for(const item of nested)assert.ok(!map.includes('https://furkantoplu.com'+item.path+'</loc>'));
    if(key==='contact')for(const path of routes.about){const html=await page(path);for(const hiddenPath of routes.contact)assert.ok(!html.includes(`href="${hiddenPath}"`))}
    await toggle(key,true,second);
    for(const path of routes[key])await page(path);
    for(const item of nested)await page(item.path);
    console.log('PASS hide/reopen '+key+': native TFA-protected write, all languages, home/navigation/CTA, direct URLs and sitemap.');
  }
  assert.equal(await contentHash(),before,'page content, media references, posts, areas and translations must remain byte-identical');
  console.log('PASS two administrators preserve each other\'s flags; home immutable; content and translations unchanged.');
}finally{
  try{
    for(const {id,email} of owned){assert.equal((await db('directus_users').where('id',id).first('email')).email,email);await db('directus_sessions').where('user',id).delete();await db('directus_users').where('id',id).delete()}
    if(originalVisibility)await db('site_pages').where('id',originalVisibility.id).update({content:JSON.stringify(originalVisibility.content)});
    else await db('site_pages').where('page_key','visibility').delete();
  }finally{await db.destroy()}
}
