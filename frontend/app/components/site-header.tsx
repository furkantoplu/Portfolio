import { CalendarDays, Menu } from "lucide-react";

export const navItems = [
  { key: "home", label: "Ana Sayfa", href: "/" },
  { key: "about", label: "Hakkımda", href: "/#hakkimda" },
  { key: "areas", label: "Çalışma Alanları", href: "/#calisma-alanlari" },
  { key: "blog", label: "Blog", href: "/blog" },
  { key: "contact", label: "İletişim", href: "/#iletisim" },
];

export function BrandMark() {
  return (
    <span aria-hidden="true" className="brand-mark">
      <span className="brand-mark__leaf brand-mark__leaf--left" />
      <span className="brand-mark__leaf brand-mark__leaf--right" />
      <span className="brand-mark__stem" />
    </span>
  );
}

type SiteHeaderProps = {
  active?: "home" | "about" | "areas" | "blog" | "contact";
};

export function SiteHeader({ active = "home" }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Ana sayfa">
        <BrandMark />
        <span className="brand__copy">
          <strong>Fzt. Deniz Yılmaz</strong>
          <span>Harekete alan açın</span>
        </span>
      </a>

      <nav className="desktop-nav" aria-label="Ana menü">
        {navItems.map((item) => (
          <a
            href={item.href}
            className={item.key === active ? "is-active" : undefined}
            key={item.key}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-cta" href="/#iletisim">
        <CalendarDays aria-hidden="true" size={18} strokeWidth={1.8} />
        <span>Randevu Bilgisi</span>
      </a>

      <button className="mobile-menu" type="button" aria-label="Menüyü aç">
        <Menu aria-hidden="true" size={24} />
      </button>
    </header>
  );
}
