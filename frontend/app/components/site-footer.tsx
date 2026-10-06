import { getPageTools } from "../lib/i18n-server";
import { BrandMark } from "./brand-mark";
import { navItems } from "./navigation";

export async function SiteFooter() {
  const { t, href: localHref } = await getPageTools();
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

        <nav className="site-footer__nav" aria-label={t("Alt menü")}>
          {navItems.slice(1).map((item) => (
            <a href={localHref(item.href)} key={item.key}>{t(item.label)}</a>
          ))}
        </nav>

        <a className="site-footer__social" href="#" aria-label={t("Instagram profili")}>
          <span aria-hidden="true">@</span>{t("Instagram")}</a>
      </div>

      <div className="site-footer__bottom">
        <p>{t("© 2026 Fzt. Furkan Toplu. Tüm hakları saklıdır.")}</p>
        <p>{t("Bu web sitesindeki içerikler genel bilgilendirme amaçlıdır.")}</p>
        <div>
          <a href={localHref("/kvkk-aydinlatma-metni")}>{t("KVKK Aydınlatma Metni")}</a>
          <a href={localHref("/gizlilik")}>{t("Gizlilik")}</a>
        </div>
      </div>
    </footer>
  );
}
