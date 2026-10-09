import definitions from './footer-options.json';
export type SocialKey='instagram'|'facebook'|'linkedin'|'youtube'|'x'|'tiktok'|'website';
export type FooterMenuKey='about'|'areas'|'blog'|'contact'|'kvkk'|'privacy';
export type FooterSettings={socials:Record<SocialKey,{url:string;visible:boolean}>;menu:Record<FooterMenuKey,boolean>};
export const footerSocialOptions=definitions.socials as Array<{key:SocialKey;label:string;mark:string}>;
export const footerMenuOptions=definitions.menu as Array<{key:FooterMenuKey;label:string}>;
export function safeFooterUrl(value:unknown):string {
  if(typeof value!=='string'||value.length>2048||!value.trim())return '';
  try{const url=new URL(value.trim());return url.protocol==='https:'&&!url.username&&!url.password?url.href:''}catch{return ''}
}
export function readFooterSettings(value:unknown):FooterSettings {
  const raw=value&&typeof value==='object'?value as Partial<FooterSettings>:{};
  return {
    socials:Object.fromEntries(footerSocialOptions.map(({key})=>[key,{url:safeFooterUrl(raw.socials?.[key]?.url),visible:typeof raw.socials?.[key]?.visible==='boolean'?raw.socials[key].visible:true}])) as FooterSettings['socials'],
    menu:Object.fromEntries(footerMenuOptions.map(({key})=>[key,typeof raw.menu?.[key]==='boolean'?raw.menu[key]:true])) as FooterSettings['menu'],
  };
}
