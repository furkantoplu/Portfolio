import {spawnSync} from 'node:child_process';
import {catalogue,catalogueKey,localizedContent,turkishRecord} from './content/practice-catalogue.mjs';
// Manual, one-time owner-approved import. Never attached to compose/bootstrap.
const batch=catalogue.map((item,index)=>({key:item.key,tr:turkishRecord(item,index),en:localizedContent(item,'en'),de:localizedContent(item,'de')}));
const script=`
import getDatabase from '/directus/node_modules/@directus/api/dist/database/index.js';
import {getSchema} from '/directus/node_modules/@directus/api/dist/utils/get-schema.js';
import {ItemsService} from '/directus/node_modules/@directus/api/dist/services/items.js';
import {practiceSlug} from '/directus/extensions/directus-extension-website-content/src/practice-urls.js';
const db=getDatabase();const batch=${JSON.stringify(batch)};const key=${JSON.stringify(catalogueKey)};
try {
 const schema=await getSchema();
 const result=await db.transaction(async trx=>{
  await trx.raw('SELECT pg_advisory_xact_lock(hashtextextended(?,0))',['website-import:'+key]);
  if(!await trx.schema.hasTable('website_content_imports'))await trx.schema.createTable('website_content_imports',table=>{
    table.text('key').primary();table.jsonb('records').notNullable();table.timestamp('created_at',{useTz:true}).notNullable().defaultTo(trx.fn.now());
  });
  const previous=await trx('website_content_imports').where('key',key).first();
  if(previous)return {result:'already-applied',records:previous.records};
  const count=await trx('practice_areas').count('* as n').first();
  if(Number(count.n)!==0)throw new Error('Çalışma alanları artık boş değil. Mevcut kayıtların üzerine yazılmadı.');
  const service=new ItemsService('practice_areas',{knex:trx,schema,accountability:null});
  const records=[];
  for(const item of batch){
    const id=Number(await service.createOne({...item.tr,slug:practiceSlug(item.tr.title)}));
    if(!Number.isSafeInteger(id)||id<=0)throw new Error('Invalid created record ID');
    const parent=await trx('practice_areas').where('id',id).first('slug');
    const slugs={tr:parent.slug};
    for(const language of ['en','de']){
      const [version]=await trx('website_content_translations').insert({collection:'practice_areas',parent_id:id,language,status:'published',slug:practiceSlug(item[language].title),content:JSON.stringify(item[language])}).returning(['slug']);
      slugs[language]=version.slug;
    }
    records.push({key:item.key,id,slugs});
  }
  await trx('website_content_imports').insert({key,records:JSON.stringify(records)});
  return {result:'created',records};
 });
 console.log(JSON.stringify(result));
} finally {await db.destroy();}
`;
const result=spawnSync('docker',['compose','exec','-T','directus','node','--input-type=module'],{cwd:new URL('../',import.meta.url),input:script,encoding:'utf8',timeout:90000});
if(result.status!==0){console.error(result.stderr || 'Catalogue import failed');process.exit(1);}
const line=result.stdout.split(/\r?\n/).find(line=>line.startsWith('{"result":'));
if(!line)throw new Error('Catalogue import returned no result');
const report=JSON.parse(line);
if(report.result==='created'){
  console.log(`Çalışma alanı kataloğu: ${report.records.length} kayıt oluşturuldu; TR/EN/DE; fotoğrafsız.`);
  for(const record of report.records)console.log(`${record.id}: /calisma-alanlari/${record.slugs.tr}`);
} else console.log('Bu katalog daha önce uygulandı. Kayıtlar yeniden oluşturulmadı; admin düzenlemeleri ve silmeleri korunur.');
