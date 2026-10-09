import { getPageTools } from "./lib/i18n-server";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Compass, SearchX } from "lucide-react";
import { NativeLink } from "./components/native-link";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getPageTools();
  return { title: locale === "en" ? "Page not found | Furkan Toplu" : locale === "de" ? "Seite nicht gefunden | Furkan Toplu" : "Sayfa Bulunamadı | Fzt. Furkan Toplu", robots: { index: false, follow: false } };
}

export default async function NotFound() {
  const { locale, t, href: localHref } = await getPageTools();
  return (
    <main className="site-shell not-found-page">
      <SiteHeader locale={locale} />

      <section className="not-found-hero" aria-labelledby="not-found-title">
        <div className="not-found-hero__copy">
          <p className="eyebrow"><span aria-hidden="true" />{t("404 · Sayfa bulunamadı")}</p>
          <h1 id="not-found-title">{t("Aradığınız sayfa")}<br /><em>{" "}{t("burada görünmüyor.")}</em></h1>
          <p>{t("Bağlantı değişmiş, içerik kaldırılmış veya adres yanlış yazılmış olabilir. Buradan güvenli bir şekilde siteye geri dönebilirsiniz.")}</p>

          <div className="not-found-hero__actions">
            <NativeLink className="primary-button" href={localHref("/")}>
              <ArrowLeft aria-hidden="true" size={18} />{t("Ana sayfaya dön")}</NativeLink>
            <NativeLink className="text-link" href={localHref("/calisma-alanlari")}>{t("Çalışma alanlarını incele")}<ArrowUpRight aria-hidden="true" size={18} />
            </NativeLink>
          </div>

          <nav className="not-found-quick-links" aria-label={t("Yardımcı bağlantılar")}>
            <span>{t("Aradığınız içerik için")}</span>
            <NativeLink href={localHref("/blog")}>{t("Blog")}</NativeLink>
            <NativeLink href={localHref("/hakkimda")}>{t("Hakkımda")}</NativeLink>
            <NativeLink href={localHref("/iletisim")}>{t("İletişim")}</NativeLink>
          </nav>
        </div>

        <div className="not-found-hero__visual" aria-hidden="true">
          <SearchX size={42} strokeWidth={1.25} />
          <strong>404</strong>
          <div className="not-found-hero__note">
            <Compass size={18} strokeWidth={1.5} />
            <span>{t("Yolunuzu birlikte yeniden bulalım.")}</span>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
