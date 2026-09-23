import { BrandMark } from "./brand-mark";
import { navItems } from "./navigation";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <a className="brand brand--footer" href="/" aria-label="Ana sayfaya dön">
          <BrandMark />
          <span className="brand__copy">
            <strong>Fzt. Furkan Toplu</strong>
            <span>Harekete alan açın</span>
          </span>
        </a>

        <nav className="site-footer__nav" aria-label="Alt menü">
          {navItems.slice(1).map((item) => (
            <a href={item.href} key={item.key}>{item.label}</a>
          ))}
        </nav>

        <a className="site-footer__social" href="#" aria-label="Instagram profili">
          <span aria-hidden="true">@</span>
          Instagram
        </a>
      </div>

      <div className="site-footer__bottom">
        <p>© 2026 Fzt. Furkan Toplu. Tüm hakları saklıdır.</p>
        <p>Bu web sitesindeki içerikler genel bilgilendirme amaçlıdır.</p>
        <div>
          <a href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</a>
          <a href="/gizlilik">Gizlilik</a>
        </div>
      </div>
    </footer>
  );
}
