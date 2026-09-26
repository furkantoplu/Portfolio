"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, Menu, X } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { NativeLink } from "./native-link";
import { navItems, type NavigationKey } from "./navigation";

type SiteHeaderProps = {
  active?: NavigationKey;
};

export function SiteHeader({ active }: SiteHeaderProps) {
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
        <NativeLink className="brand" href="/" aria-label="Ana sayfa">
          <BrandMark />
          <span className="brand__copy">
            <strong>Fzt. Furkan Toplu</strong>
            <span>Harekete alan açın</span>
          </span>
        </NativeLink>

        <nav className="desktop-nav" aria-label="Ana menü">
          {navItems.map((item) => (
            <NativeLink
              href={item.href}
              className={item.key === active ? "is-active" : undefined}
              key={item.key}
            >
              {item.label}
            </NativeLink>
          ))}
        </nav>

        <NativeLink className="header-cta" href="/iletisim">
          <CalendarDays aria-hidden="true" size={18} strokeWidth={1.8} />
          <span>Randevu Bilgisi</span>
        </NativeLink>

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
            <span>Fzt. Furkan Toplu</span>
          </div>

          <div className="mobile-nav__links">
            {navItems.map((item, index) => (
              <NativeLink
                href={item.href}
                className={item.key === active ? "is-active" : undefined}
                key={item.key}
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={closeMenu}
              >
                <span>0{index + 1}</span>
                <strong>{item.label}</strong>
                <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.6} />
              </NativeLink>
            ))}
          </div>

          <NativeLink
            className="mobile-nav__cta"
            href="/iletisim"
            tabIndex={isMenuOpen ? 0 : -1}
            onClick={closeMenu}
          >
            <CalendarDays aria-hidden="true" size={18} strokeWidth={1.8} />
            Randevu bilgisi alın
            <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.7} />
          </NativeLink>

          <p className="mobile-nav__meta">İstanbul · Yüz yüze görüşme</p>
        </nav>
      </div>
    </>
  );
}
