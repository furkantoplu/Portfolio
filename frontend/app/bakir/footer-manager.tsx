'use client';
import {useState,type FormEvent} from 'react';
import {Link2,LoaderCircle,Save} from 'lucide-react';
import {directusRequest} from './admin-api';
import type {ManagedSitePage} from './page-manager';
import {footerSocialOptions,footerMenuOptions,readFooterSettings,safeFooterUrl,type FooterSettings} from '../lib/footer-links';
import {VisibilityField} from './section-visibility';
export function FooterManager({page,onChanged}:{page?:ManagedSitePage;onChanged:()=>Promise<void>}) {
  const [draft,setDraft]=useState<FooterSettings>(()=>readFooterSettings(page?.content));
  const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
  async function save(event:FormEvent){
    event.preventDefault();if(!page)return;
    for(const {key,label} of footerSocialOptions){if(draft.socials[key].url.trim()&&!safeFooterUrl(draft.socials[key].url)){setMessage(`${label} için kullanıcı adı/parola içermeyen geçerli bir https:// adresi girin.`);return}}
    const normalized=readFooterSettings(draft);setBusy(true);setMessage('');
    try{await directusRequest(`/items/site_pages/${page.id}`,{method:'PATCH',body:JSON.stringify({content:normalized})});setDraft(normalized);await onChanged();setMessage('Footer bağlantıları tüm diller için kaydedildi.')}
    catch(error){setMessage(error instanceof Error?error.message:'Footer kaydedilemedi.')}
    finally{setBusy(false)}
  }
  return <section className="admin-content-manager" aria-labelledby="footer-manager-title">
    <div className="admin-content-manager__heading"><div><p className="admin-eyebrow"><Link2 size={17}/> Footer</p><h2 id="footer-manager-title">Alt menü ve<br/><em>sosyal bağlantılar.</em></h2></div></div>
    <form className="admin-post-editor" onSubmit={save}>
      <p className="admin-visibility-note">Adresler ve görünürlük tüm dillerde ortaktır. Boş adresler gösterilmez; Kaydet ile uygulanır. Site içi adresler dile göre otomatik eşleşir.</p>
      <div className="admin-editor-grid">
        {footerSocialOptions.map(({key,label})=><VisibilityField key={key} label={`${label} adresi`} section={key} className="admin-field--wide" disabled={busy} visibility={Object.fromEntries(footerSocialOptions.map(option=>[option.key,draft.socials[option.key].visible]))} onChange={values=>setDraft(state=>({...state,socials:{...state.socials,[key]:{...state.socials[key],visible:values[key]!==false}}}))}>
          <input type="url" maxLength={2048} placeholder="https://..." value={draft.socials[key].url} disabled={busy} onChange={event=>setDraft(state=>({...state,socials:{...state.socials,[key]:{...state.socials[key],url:event.target.value}}}))}/>
        </VisibilityField>)}
        <div className="admin-field--wide"><strong>Footer menüsünde göster</strong></div>
        {footerMenuOptions.map(({key,label})=><label className="admin-check" key={key}><input type="checkbox" disabled={busy} checked={draft.menu[key]} onChange={event=>setDraft(state=>({...state,menu:{...state.menu,[key]:event.target.checked}}))}/><span>{label}</span></label>)}
      </div>
      <div className="admin-post-editor__footer"><p role="status">{message||(!page?'Footer kaydı bulunamadı; içerik migrasyonunu çalıştırın.':'Değişiklikler kaydedilene kadar site etkilenmez.')}</p><button type="submit" disabled={busy||!page}>{busy?<LoaderCircle className="admin-spinner" size={18}/>:<Save size={18}/>} Footer’ı kaydet</button></div>
    </form>
  </section>;
}
