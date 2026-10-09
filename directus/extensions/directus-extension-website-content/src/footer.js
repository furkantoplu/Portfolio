import definitions from './footer-options.json' with {type:'json'};
export function safeFooterUrl(value) {
  if(typeof value!=='string'||value.length>2048||!value.trim())return '';
  try{const url=new URL(value.trim());return url.protocol==='https:'&&!url.username&&!url.password?url.href:''}catch{return ''}
}
export function readFooterSettings(value) {
  const raw=value&&typeof value==='object'?value:{};
  return {
    socials:Object.fromEntries(definitions.socials.map(({key})=>[key,{url:safeFooterUrl(raw.socials?.[key]?.url),visible:typeof raw.socials?.[key]?.visible==='boolean'?raw.socials[key].visible:true}])),
    menu:Object.fromEntries(definitions.menu.map(({key})=>[key,typeof raw.menu?.[key]==='boolean'?raw.menu[key]:true])),
  };
}
