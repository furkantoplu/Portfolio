// Read-only responsive fixture: no CMS writes, no public listener, no credentials.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {Readable} from 'node:stream';
const requireFrontend = createRequire(new URL('../../frontend/package.json',import.meta.url));
const {build} = requireFrontend('esbuild');
const photo = process.argv[2];
if (!/^\/site-media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(photo || '')) {
  throw Error('Supply an existing published /site-media/<UUID> image path as the first argument');
}
const result = await build({
  stdin:{contents:`
    import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server';
    import Areas from './app/calisma-alanlari/page';
    import {PracticeDetail} from './app/components/practice-detail';
    export async function render(detail){return renderToStaticMarkup(detail
      ? await PracticeDetail({content:{slug:'preview',index:'01',title:'Fotoğraf yerleşimi önizlemesi',titleAccent:'',lead:'Bu yalnızca veri değiştirmeyen yerel testtir.',image:'${photo}',imageAlt:'Yerleşim test fotoğrafı',overviewTitle:'Önizleme',overviewAccent:'',overviewDescription:'',evaluationTopics:[],processSteps:[],questions:[]},relatedAreas:[]})
      : await Areas());}
  `,resolveDir:fileURLToPath(new URL('../../frontend/',import.meta.url)),loader:'tsx'},
  bundle:true,write:false,format:'cjs',platform:'node',jsx:'automatic',
  external:['react','react/jsx-runtime','react-dom','react-dom/server','lucide-react'],
  plugins:[{name:'readonly-fixtures',setup(builder){
    builder.onResolve({filter:/^next\/image$/},()=>({path:fileURLToPath(new URL('../../frontend/node_modules/vinext/dist/shims/image.js',import.meta.url))}));
    builder.onResolve({filter:/(?:i18n-server|\/directus|site-header|site-footer)$/},args=>({path:args.path,namespace:'fixture'}));
    builder.onLoad({filter:/.*/,namespace:'fixture'},({path})=>{
      if(path.endsWith('i18n-server'))return {contents:'export async function getPageTools(){return {locale:"tr",t:v=>v,href:v=>v}}',loader:'js'};
      if(path.endsWith('/directus'))return {contents:`
        export async function getEditablePage(){return {content:{hero_title:'Fotoğraflı çalışma alanı testi',hero_accent:'',hero_image_alt:'Yerel önizleme',hero_description:'Gerçek kayıtlar değiştirilmez.'}}}
        export async function getPracticeAreas(){return [1,2].map(id=>({id,slug:'preview',title:'Önizleme '+id,summary:'Kart ölçüsü ve kırpmasız fotoğraf yerleşimi kontrolü.',image_path:'${photo}',image_alt:'Test fotoğrafı'}))}
      `,loader:'js'};
      return {contents:'import {createElement} from "react"; export const SiteHeader=()=>createElement("nav",null,"Yerel fotoğraf testi");export const SiteFooter=()=>null;',loader:'js'};
    });
  }}],
});
const module={exports:{}};
new Function('require','module','exports',result.outputFiles[0].text)(requireFrontend,module,module.exports);
const localHtml=await(await fetch('http://localhost:8080/')).text();
const stylesheet=localHtml.match(/<link[^>]*href="([^"]+\.css)"[^>]*>/)?.[1];
if(!stylesheet)throw Error('Running local frontend stylesheet required');
const server=createServer(async(req,res)=>{
  try{
    if(req.url===photo){
      const image=await fetch('https://furkantoplu.com'+photo);
      res.writeHead(image.status,{'Content-Type':image.headers.get('content-type')||'application/octet-stream','Cache-Control':'no-store'});
      Readable.fromWeb(image.body).pipe(res);return;
    }
    if(!['/','/preview'].includes(req.url)){res.writeHead(404);res.end();return;}
    const html=await module.exports.render(req.url==='/preview');
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
    res.end('<!doctype html><html lang="tr"><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="'+new URL(stylesheet,'http://localhost:8080').href+'"></head><body>'+html+'</body></html>');
  }catch(error){res.writeHead(500);res.end('Fixture unavailable');console.error(error.message);}
});
server.listen(9123,'127.0.0.1',()=>console.log('Read-only fixture: http://localhost:9123/ (directory), /preview (detail)'));
process.on('SIGINT',()=>server.close(()=>process.exit(0)));
