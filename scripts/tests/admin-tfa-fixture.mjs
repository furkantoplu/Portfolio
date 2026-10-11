import {spawn,spawnSync} from 'node:child_process';
import {pipeline} from 'node:stream/promises';
import {randomBytes} from 'node:crypto';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const project='fizyoterapi-tfa-'+randomBytes(4).toString('hex');
const env={...process.env,TEST_PG_PASSWORD:randomBytes(32).toString('hex'),TEST_APP_SECRET:randomBytes(32).toString('hex')};
const base=['compose','-p',project,'-f','deploy/vps/tfa-test.compose.yaml'];
const enforced=[...base,'-f','deploy/vps/tfa-test-enforced.compose.yaml'];
function command(args,input){const result=spawnSync('docker',args,{cwd:root,env,input,encoding:'utf8',timeout:180000});if(result.status!==0)throw new Error('Fixture command failed; private output suppressed.');return result.stdout;}
function pg(sql){return command([...base,'exec','-T','database','psql','-X','-v','ON_ERROR_STOP=1','-U','tfa_fixture','-d','tfa_fixture','-At'],sql);}
function exitCode(child){return new Promise(resolve=>{child.on('error',()=>resolve(-1));child.on('exit',code=>resolve(code));});}
async function copyDatabase(){
 const producer=spawn('docker',['exec','fizyoterapi-database-1','sh','-c','exec pg_dump -Fc --no-owner --no-acl -U "$POSTGRES_USER" -d "$POSTGRES_DB"'],{cwd:root,env,stdio:['ignore','pipe','pipe']});
 const consumer=spawn('docker',[...base,'exec','-T','database','pg_restore','--exit-on-error','--single-transaction','--no-owner','--no-acl','-U','tfa_fixture','-d','tfa_fixture'],{cwd:root,env,stdio:['pipe','ignore','pipe']});
 producer.stderr.resume();consumer.stderr.resume();
 const results=Promise.all([exitCode(producer),exitCode(consumer)]);
 await pipeline(producer.stdout,consumer.stdin);
 assert.deepEqual(await results,[0,0],'Private source-to-isolated-DB restore failed');
}
function smoke(unprotected){const result=spawnSync(process.execPath,['scripts/tests/admin-tfa-smoke.mjs',...(unprotected?['--expect-unprotected']:[])],{cwd:root,env:{...env,TEST_SITE_URL:'http://proxy',TEST_API_CONTAINER:project+'-directus-1',TEST_DIRECTUS_CONTAINER:project+'-directus-1'},encoding:'utf8',timeout:240000});process.stdout.write(result.stdout);if(result.status!==0)throw new Error('Isolated API smoke failed: '+result.stderr);}
try{
 assert.equal(command(['ps','-aq','--filter','label=com.docker.compose.project='+project]).trim(),'');
 command([...base,'up','-d','--wait','database']);
 assert.equal(pg("SELECT count(*) FROM pg_tables WHERE schemaname='public';\n").trim(),'0');
 await copyDatabase();
 // ONLY this newly-created private copy: remove copied credentials before starting the API.
 // No original DB SQL, real account changes, license bypass or outbound network access.
 const id=command([...base,'ps','-q','database']).trim();
 assert.notEqual(id,command(['inspect','--format','{{.Id}}','fizyoterapi-database-1']).trim());
 assert.equal(command(['inspect','--format','{{index .Config.Labels "com.docker.compose.project"}}',id]).trim(),project);
 pg('BEGIN; DELETE FROM directus_sessions; DELETE FROM directus_users; UPDATE directus_policies SET enforce_tfa=false WHERE admin_access; COMMIT;\n');
 command([...base,'up','-d','--wait','directus','proxy']);
 smoke(true);
 pg(readFileSync(new URL('scripts/migrations/012-admin-tfa-enforcement.sql',root),'utf8'));
 command([...enforced,'up','-d','--wait','directus']);
 smoke(false);
 console.log('PASS isolated original-trigger reproduction followed by fixed native API verification.');
}finally{
 const ids=command(['ps','-aq','--filter','label=com.docker.compose.project='+project]).trim().split(/\s+/).filter(Boolean);
 for(const id of ids)assert.equal(command(['inspect','--format','{{index .Config.Labels "com.docker.compose.project"}}',id]).trim(),project);
 command([...enforced,'down']); // Only owned fixture containers/network; no named volumes exist.
 console.log('PASS isolated test database/copies/containers/network removed; original local services preserved.');
}
