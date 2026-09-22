"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, Menu, X } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { navItems, type NavigationKey } from "./navigation";

type SiteHeaderProps = {
  active?: NavigationKey;
};

export function SiteHeader({ active = "home" }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
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

        <button
          className={`mobile-menu${isMenuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? (
            <X aria-hidden="true" size={23} strokeWidth={1.8} />
          ) : (
            <Menu aria-hidden="true" size={24} strokeWidth={1.8} />
          )}
        </button>
      </header>

      <div
        className={`mobile-nav${isMenuOpen ? " is-open" : ""}`}
        aria-hidden={!isMenuOpen}
      >
        <button
          className="mobile-nav__backdrop"
          type="button"
          aria-label="Menüyü kapat"
          tabIndex={isMenuOpen ? 0 : -1}
          onClick={closeMenu}
        />

        <nav
          className="mobile-nav__panel"
          id="mobile-navigation"
          aria-label="Mobil menü"
        >
          <div className="mobile-nav__eyebrow">
            <span>Menü</span>
            <span>Fzt. Deniz Yılmaz</span>
          </div>

          <div className="mobile-nav__links">
            {navItems.map((item, index) => (
              <a
                href={item.href}
                className={item.key === active ? "is-active" : undefined}
                key={item.key}
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={closeMenu}
              >
                <span>0{index + 1}</span>
                <strong>{item.label}</strong>
                <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.6} />
              </a>
            ))}
          </div>

          <a
            className="mobile-nav__cta"
            href="/#iletisim"
            tabIndex={isMenuOpen ? 0 : -1}
            onClick={closeMenu}
          >
            <CalendarDays aria-hidden="true" size={18} strokeWidth={1.8} />
            Randevu bilgisi alın
            <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.7} />
          </a>

          <p className="mobile-nav__meta">İstanbul · Yüz yüze görüşme</p>
        </nav>
      </div>
    </>
  );
}
