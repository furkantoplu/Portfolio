import {spawn,spawnSync} from 'node:child_process';
import {randomBytes,createHash} from 'node:crypto';
import {mkdir,readFile,writeFile,stat} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {pipeline} from 'node:stream/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const id='20261010-'+randomBytes(5).toString('hex');
const privateRoot='C:/Users/Lenovo/AppData/Local/fizyoterapi-backups';
const destination=resolve(privateRoot,id);
function command(program,args,options={}){
 const result=spawnSync(program,args,{cwd:root,encoding:'utf8',...options});
 if(result.status!==0)throw new Error(`${program} failed: ${result.stderr || result.error || result.status}`);
 return result.stdout.trim();
}
async function binary(args,path){
 const child=spawn('docker',args,{cwd:root,stdio:['ignore','pipe','pipe']});let error='';child.stderr.on('data',part=>{error+=part.toString()});
 const finished=new Promise((done,reject)=>{child.on('error',reject);child.on('close',code=>code===0?done():reject(new Error(error||'Binary export failed')))});
 await Promise.all([pipeline(child.stdout,createWriteStream(path,{flags:'wx'})),finished]);
}
await mkdir(destination,{recursive:true});
const identity=command('whoami',[]);
command('icacls',[destination,'/inheritance:r','/grant:r',`${identity}:(OI)(CI)F`,'*S-1-5-18:(OI)(CI)F']);
const configOutput=command('docker',['compose','exec','-T','directus','node','-e','console.log(JSON.stringify({secret:process.env.SECRET,database:process.env.DB_DATABASE,user:process.env.DB_USER}))']);
const config=JSON.parse(configOutput);
if(typeof config.secret!=='string'||config.secret.length<32)throw new Error('Application key requires review; no secret was printed.');
for(const value of [config.database,config.user])if(!/^[a-z_][a-z0-9_]*$/i.test(value))throw new Error('Unexpected database identifier');
const container=command('docker',['compose','ps','-q','directus']);
const inspected=JSON.parse(command('docker',['inspect',container]));
const volume=inspected[0].Mounts.find(item=>item.Destination==='/directus/uploads'&&item.Type==='volume')?.Name;
if(!volume)throw new Error('Upload volume not found');
const quote=value=>"'"+String(value).replaceAll("'","\\'")+"'";
const environment={POSTGRES_DB:config.database,POSTGRES_USER:config.user,POSTGRES_PASSWORD:randomBytes(32).toString('base64url'),DIRECTUS_SECRET:config.secret,DIRECTUS_SESSION_COOKIE_SECURE:'false',FRONTEND_IMAGE:'fizyoterapist-frontend:vps-20261010'};
await writeFile(resolve(destination,'runtime.env'),Object.entries(environment).map(([key,value])=>`${key}=${quote(value)}`).join('\n')+'\n',{flag:'wx',mode:0o600});
// Warm the helper image before freezing source writes.
command('docker',['pull','alpine:3.22']);
let stopped=false;
try{
 stopped=true;command('docker',['compose','stop','proxy','directus']);
 const sql=await readFile(new URL('../deploy/vps/data-inventory.sql',import.meta.url),'utf8');
 const inventoryOutput=command('docker',['compose','exec','-T','database','sh','-c','exec psql -v ON_ERROR_STOP=1 -At -U "$POSTGRES_USER" -d "$POSTGRES_DB"'],{input:sql});
 const inventory=JSON.parse(inventoryOutput.split(/\r?\n/).find(line=>line.startsWith('{')));
 if(inventory.users.count<1||inventory.areas.count!==6)throw new Error('Source inventory needs review');
 await writeFile(resolve(destination,'inventory.json'),JSON.stringify(inventory),{flag:'wx',mode:0o600});
 await binary(['compose','exec','-T','database','sh','-c','exec pg_dump -Fc --no-owner --no-acl -U "$POSTGRES_USER" -d "$POSTGRES_DB"'],resolve(destination,'database.dump'));
 await binary(['run','--rm','--mount',`type=volume,source=${volume},target=/source,readonly`,'alpine:3.22','tar','-cf','-','-C','/source','.'],resolve(destination,'uploads.tar'));
 await binary(['run','--rm','--mount',`type=volume,source=${volume},target=/source,readonly`,'alpine:3.22','sh','-c','cd /source && find . -type f -print0 | sort -z | xargs -0 -r sha256sum'],resolve(destination,'uploads.sha256'));
 await writeFile(resolve(destination,'secret.sha256'),createHash('sha256').update(config.secret).digest('hex')+'\n',{flag:'wx',mode:0o600});
}finally{if(stopped)command('docker',['compose','start','directus','proxy']);}
for(const name of ['database.dump','uploads.tar'])if((await stat(resolve(destination,name))).size===0)throw new Error('Empty backup artifact');
const entries=command('tar',['-tf',resolve(destination,'uploads.tar')]).split(/\r?\n/);
if(entries.some(path=>path.startsWith('/')||path.split('/').includes('..')))throw new Error('Unsafe upload archive');
await writeFile(resolve(destination,'migration-id.txt'),id+'\n',{flag:'wx',mode:0o600});
console.log(`PRIVATE_BACKUP=${destination}`);
console.log('Consistent DB/upload snapshot complete; source services restarted; secrets not printed.');
