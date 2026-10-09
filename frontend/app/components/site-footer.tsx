import { getPageTools } from "../lib/i18n-server";
import { BrandMark } from "./brand-mark";
import { navItems } from "./navigation";
import {getFooterSettings} from '../lib/directus';
import {footerSocialOptions,readFooterSettings} from '../lib/footer-links';

export async function SiteFooter() {
  const { t, href: localHref } = await getPageTools();
  const settings=readFooterSettings(await getFooterSettings());
  const socialLinks=footerSocialOptions.filter(({key})=>settings.socials[key].visible&&settings.socials[key].url);
  const menuItems=navItems.filter(item=>item.key!=="home"&&settings.menu[item.key]);
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <a className="brand brand--footer" href={localHref("/")} aria-label={t("Ana sayfaya dön")}>
          <BrandMark />
          <span className="brand__copy">
            <strong>{t("Fzt. Furkan Toplu")}</strong>
            <span>{t("Harekete alan açın")}</span>
          </span>
        </a>

        {menuItems.length>0&&<nav className="site-footer__nav" aria-label={t("Alt menü")}>
          {menuItems.map((item) => (
            <a href={localHref(item.href)} key={item.key}>{t(item.label)}</a>
          ))}
        </nav>}

        {socialLinks.length>0&&<nav className="site-footer__social-links" aria-label={t("Sosyal bağlantılar")}>
          {socialLinks.map(({key,label,mark})=><a key={key} className="site-footer__social" href={settings.socials[key].url} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">{mark}</span>{t(label)}</a>)}
        </nav>}
      </div>

      <div className="site-footer__bottom">
        <p>{t("© 2026 Fzt. Furkan Toplu. Tüm hakları saklıdır.")}</p>
        <p>{t("Bu web sitesindeki içerikler genel bilgilendirme amaçlıdır.")}</p>
        {(settings.menu.kvkk||settings.menu.privacy)&&<div>
          {settings.menu.kvkk&&<a href={localHref("/kvkk-aydinlatma-metni")}>{t("KVKK Aydınlatma Metni")}</a>}
          {settings.menu.privacy&&<a href={localHref("/gizlilik")}>{t("Gizlilik")}</a>}
        </div>}
      </div>
    </footer>
  );
}
