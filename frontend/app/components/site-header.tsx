"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CalendarDays, ChevronDown, Menu, X } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { NativeLink } from "./native-link";
import { navItems, type NavigationKey } from "./navigation";
import { getTranslator, locales, languageNames, localizeHref, routes, type Locale } from "../lib/i18n";

type SiteHeaderProps = {
  active?: NavigationKey;
  locale?: Locale;
  languageLinks?: Partial<Record<Locale, string>>;
};

export function SiteHeader({ active, locale = "tr", languageLinks }: SiteHeaderProps) {
  const t = getTranslator(locale);
  const languageUrls = languageLinks ?? routes[active || "home"];
  const navigation = navItems.map(item => ({ ...item, label: t(item.label), href: localizeHref(item.href, locale) }));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!languageRef.current?.contains(event.target as Node)) setIsLanguageOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsLanguageOpen(false);
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
        <NativeLink className="brand" href={routes.home[locale]} aria-label={t("Ana sayfa")}>
          <BrandMark />
          <span className="brand__copy">
            <strong>Fzt. Furkan Toplu</strong>
            <span>{t("Harekete alan açın")}</span>
          </span>
        </NativeLink>

        <nav className="desktop-nav" aria-label={t("Ana menü")}>
          {navigation.map((item) => (
            <NativeLink
              href={item.href}
              className={item.key === active ? "is-active" : undefined}
              key={item.key}
            >
              {item.label}
            </NativeLink>
          ))}
        </nav>

        <div className="header-actions">
        <NativeLink className="header-cta" href={routes.contact[locale]}>
          <CalendarDays aria-hidden="true" size={18} strokeWidth={1.8} />
          <span>{t("Randevu Bilgisi")}</span>
        </NativeLink>

        <button
          className={`mobile-menu${isMenuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={t(isMenuOpen ? "Menüyü kapat" : "Menüyü aç")}
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
        <div className="language-dropdown" ref={languageRef}>
        <button type="button" className="language-dropdown__trigger" aria-expanded={isLanguageOpen} aria-controls="language-options" onClick={() => setIsLanguageOpen(open => !open)}>{languageNames[locale]}<ChevronDown size={15} aria-hidden="true" /></button>
        {isLanguageOpen && <nav id="language-options" className="language-dropdown__options" aria-label={locale === "tr" ? "Dil seçimi" : locale === "en" ? "Language selection" : "Sprachauswahl"}>
          {locales.map(language => languageUrls[language] ? (
            <NativeLink key={language} href={languageUrls[language]!} lang={language} hrefLang={language} aria-current={language === locale ? "page" : undefined}>{languageNames[language]}</NativeLink>
          ) : <span key={language} aria-disabled="true" title={locale === "tr" ? "Çeviri henüz yayımlanmadı" : locale === "en" ? "Translation not published yet" : "Übersetzung noch nicht veröffentlicht"}>{languageNames[language]}</span>)}
        </nav>}
        </div>
        </div>
      </header>

      <div
        className={`mobile-nav${isMenuOpen ? " is-open" : ""}`}
        aria-hidden={!isMenuOpen}
      >
        <button
          className="mobile-nav__backdrop"
          type="button"
          aria-label={t("Menüyü kapat")}
          tabIndex={isMenuOpen ? 0 : -1}
          onClick={closeMenu}
        />

        <nav
          className="mobile-nav__panel"
          id="mobile-navigation"
          aria-label={t("Mobil menü")}
        >
          <div className="mobile-nav__eyebrow">
            <span>{t("Menü")}</span>
            <span>Fzt. Furkan Toplu</span>
          </div>

          <div className="mobile-nav__links">
            {navigation.map((item, index) => (
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
            href={routes.contact[locale]}
            tabIndex={isMenuOpen ? 0 : -1}
            onClick={closeMenu}
          >
            <CalendarDays aria-hidden="true" size={18} strokeWidth={1.8} />
            {t("Randevu bilgisi alın")}
            <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.7} />
          </NativeLink>

          <p className="mobile-nav__meta">{t("İstanbul · Yüz yüze görüşme")}</p>
        </nav>
      </div>
    </>
  );
}
