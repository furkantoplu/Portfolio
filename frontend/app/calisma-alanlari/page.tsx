import { getPageTools } from "../lib/i18n-server";
import type { Metadata } from "next";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Dumbbell,
  HeartPulse,
  PersonStanding,
} from "lucide-react";
import { getPracticeAreas } from "../lib/directus";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "Çalışma Alanları | Fzt. Furkan Toplu",
  description:
    "Bel ve boyun sağlığı, sporcu rehabilitasyonu, ameliyat sonrası süreç ile duruş ve hareket analizi çalışma alanlarını inceleyin.",
};

const icons = [Activity, Dumbbell, HeartPulse, PersonStanding];

export default async function PracticeAreasPage() {
  const { locale, t, href: localHref } = await getPageTools();
  const practiceAreas = await getPracticeAreas();

  return (
    <main className="site-shell practice-directory-page">
      <SiteHeader locale={locale} active="areas" />

      <section className="practice-directory-hero" aria-labelledby="directory-title">
        <div>
          <p className="eyebrow"><span aria-hidden="true" />{t("Çalışma Alanları")}</p>
          <h1 id="directory-title">{t("Her hareket ihtiyacına")}<em>{" "}{t("kendi bağlamında bakmak.")}</em>
          </h1>
        </div>
        <div className="practice-directory-hero__aside">
          <ArrowDownRight aria-hidden="true" size={30} strokeWidth={1.35} />
          <p>{t("Aynı başlık altında görünen ihtiyaçlar bile her kişide farklı bir hikâyeye sahip olabilir. Süreç, dinleme ve değerlendirmeyle başlar.")}</p>
          <span>{String(practiceAreas.length).padStart(2, "0")}{" "}{t("çalışma alanı · Kişiye özel değerlendirme")}</span>
        </div>
      </section>

      <section className="practice-directory-grid" aria-label={t("Çalışma alanı listesi")}>
        {practiceAreas.length === 0 && <p>{t("Bu dilde çalışma alanları yakında eklenecek.")}</p>}
        {practiceAreas.map((area, index) => {
          const Icon = icons[index % icons.length];
          const number = String(index + 1).padStart(2, "0");
          return (
            <article key={area.slug}>
              <div className="practice-directory-card__topline">
                <span>{number}</span>
                <Icon aria-hidden="true" size={29} strokeWidth={1.35} />
              </div>
              <h2>{area.title}</h2>
              <p>{area.summary}</p>
              <a href={localHref(`/calisma-alanlari/${area.slug}`)} aria-label={`${area.title}: ${t("Detayları incele")}`}>{t("Detay sayfasını açın")}<ArrowUpRight aria-hidden="true" size={18} />
              </a>
            </article>
          );
        })}
      </section>

      <section className="practice-directory-note" aria-labelledby="directory-note-title">
        <p className="section-kicker">{t("Yaklaşım Notu")}</p>
        <h2 id="directory-note-title">{t("Sayfadaki başlıklar bir tanı listesi değil,")}<em>{" "}{t("değerlendirme kapsamını anlatan genel çerçevelerdir.")}</em>
        </h2>
        <p>{t("Kişisel ihtiyaçlar ve sürecin uygunluğu ancak bireysel görüşme ve değerlendirme sonrasında ele alınabilir.")}</p>
        <a href={localHref("/iletisim")}>{t("İletişim bilgilerine gidin")}{" "}<ArrowUpRight aria-hidden="true" size={18} /></a>
      </section>

      <SiteFooter />
    </main>
  );
}
