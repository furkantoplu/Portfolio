import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Compass, SearchX } from "lucide-react";
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
            <Link className="primary-button" href="/" prefetch={false}>
              <ArrowLeft aria-hidden="true" size={18} />
              Ana sayfaya dön
            </Link>
            <Link className="text-link" href="/calisma-alanlari" prefetch={false}>
              Çalışma alanlarını incele
              <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          </div>

          <nav className="not-found-quick-links" aria-label="Yardımcı bağlantılar">
            <span>Aradığınız içerik için</span>
            <Link href="/blog" prefetch={false}>Blog</Link>
            <Link href="/hakkimda" prefetch={false}>Hakkımda</Link>
            <Link href="/iletisim" prefetch={false}>İletişim</Link>
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
