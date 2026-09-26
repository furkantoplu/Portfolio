import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Compass, SearchX } from "lucide-react";
import { NativeLink } from "./components/native-link";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı | Fzt. Furkan Toplu",
  description: "Aradığınız sayfa bulunamadı. Ana sayfaya veya çalışma alanlarına dönebilirsiniz.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="site-shell not-found-page">
      <SiteHeader />

      <section className="not-found-hero" aria-labelledby="not-found-title">
        <div className="not-found-hero__copy">
          <p className="eyebrow"><span aria-hidden="true" />404 · Sayfa bulunamadı</p>
          <h1 id="not-found-title">Aradığınız sayfa<br /><em>burada görünmüyor.</em></h1>
          <p>
            Bağlantı değişmiş, içerik kaldırılmış veya adres yanlış yazılmış olabilir.
            Buradan güvenli bir şekilde siteye geri dönebilirsiniz.
          </p>

          <div className="not-found-hero__actions">
            <NativeLink className="primary-button" href="/">
              <ArrowLeft aria-hidden="true" size={18} />
              Ana sayfaya dön
            </NativeLink>
            <NativeLink className="text-link" href="/calisma-alanlari">
              Çalışma alanlarını incele
              <ArrowUpRight aria-hidden="true" size={18} />
            </NativeLink>
          </div>

          <nav className="not-found-quick-links" aria-label="Yardımcı bağlantılar">
            <span>Aradığınız içerik için</span>
            <NativeLink href="/blog">Blog</NativeLink>
            <NativeLink href="/hakkimda">Hakkımda</NativeLink>
            <NativeLink href="/iletisim">İletişim</NativeLink>
          </nav>
        </div>

        <div className="not-found-hero__visual" aria-hidden="true">
          <div className="not-found-orbit not-found-orbit--outer" />
          <div className="not-found-orbit not-found-orbit--inner" />
          <SearchX size={42} strokeWidth={1.25} />
          <strong>404</strong>
          <div className="not-found-hero__note">
            <Compass size={18} strokeWidth={1.5} />
            <span>Yolunuzu birlikte yeniden bulalım.</span>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
