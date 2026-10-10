import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createReadStream} from 'node:fs';
import {writeFile, stat} from 'node:fs/promises';
import {resolve} from 'node:path';
const destination=process.argv[2];
if(!/^C:[/\\]Users[/\\]Lenovo[/\\]AppData[/\\]Local[/\\]fizyoterapi-backups[/\\]20261010-[a-f0-9]{10}$/.test(destination||''))throw new Error('Unexpected private backup directory');
function run(program,args){const r=spawnSync(program,args,{stdio:'inherit'});if(r.status!==0)throw new Error(`${program} failed`);}
for(const name of ['source.tar.gz','frontend-image.tar','transfer.sha256']){
 try{await stat(resolve(destination,name));throw new Error(`Refusing to replace ${name}`)}catch(error){if(error.code!=='ENOENT')throw error;}
}
run('git',['-c','safe.directory=C:/Users/Lenovo/OneDrive/Desktop/fizyoterapi','archive','--format=tar.gz',`--output=${resolve(destination,'source.tar.gz')}`,'HEAD']);
run('docker',['image','save','--output',resolve(destination,'frontend-image.tar'),'fizyoterapist-frontend:vps-20261010']);
const names=['source.tar.gz','frontend-image.tar','database.dump','uploads.tar','uploads.sha256','inventory.json','secret.sha256','runtime.env'];
const lines=[];
for(const name of names){const hash=createHash('sha256');for await(const chunk of createReadStream(resolve(destination,name)))hash.update(chunk);lines.push(`${hash.digest('hex')}  ${name}`);}
await writeFile(resolve(destination,'transfer.sha256'),lines.join('\n')+'\n',{flag:'wx',mode:0o600});
console.log('Transfer bundle ready; no credentials printed.');
