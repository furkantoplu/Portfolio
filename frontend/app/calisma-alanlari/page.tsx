import type { Metadata } from "next";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Dumbbell,
  HeartPulse,
  PersonStanding,
} from "lucide-react";
import { practiceAreas } from "../components/practice-catalog";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "Çalışma Alanları | Fzt. Deniz Yılmaz",
  description:
    "Bel ve boyun sağlığı, sporcu rehabilitasyonu, ameliyat sonrası süreç ile duruş ve hareket analizi çalışma alanlarını inceleyin.",
};

const icons = [Activity, Dumbbell, HeartPulse, PersonStanding];

export default function PracticeAreasPage() {
  return (
    <main className="site-shell practice-directory-page">
      <SiteHeader active="areas" />

      <section className="practice-directory-hero" aria-labelledby="directory-title">
        <div>
          <p className="eyebrow"><span aria-hidden="true" />Çalışma Alanları</p>
          <h1 id="directory-title">
            Her hareket ihtiyacına
            <em> kendi bağlamında bakmak.</em>
          </h1>
        </div>
        <div className="practice-directory-hero__aside">
          <ArrowDownRight aria-hidden="true" size={30} strokeWidth={1.35} />
          <p>
            Aynı başlık altında görünen ihtiyaçlar bile her kişide farklı bir
            hikâyeye sahip olabilir. Süreç, dinleme ve değerlendirmeyle başlar.
          </p>
          <span>04 çalışma alanı · Kişiye özel değerlendirme</span>
        </div>
      </section>

      <section className="practice-directory-grid" aria-label="Çalışma alanı listesi">
        {practiceAreas.map((area, index) => {
          const Icon = icons[index];
          return (
            <article key={area.slug}>
              <div className="practice-directory-card__topline">
                <span>{area.number}</span>
                <Icon aria-hidden="true" size={29} strokeWidth={1.35} />
              </div>
              <h2>{area.title}</h2>
              <p>{area.description}</p>
              <a href={area.href} aria-label={`${area.title} detayını inceleyin`}>
                Detay sayfasını açın
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
            </article>
          );
        })}
      </section>

      <section className="practice-directory-note" aria-labelledby="directory-note-title">
        <p className="section-kicker">Yaklaşım Notu</p>
        <h2 id="directory-note-title">
          Sayfadaki başlıklar bir tanı listesi değil,
          <em> değerlendirme kapsamını anlatan genel çerçevelerdir.</em>
        </h2>
        <p>
          Kişisel ihtiyaçlar ve sürecin uygunluğu ancak bireysel görüşme ve
          değerlendirme sonrasında ele alınabilir.
        </p>
        <a href="/#iletisim">İletişim bilgilerine gidin <ArrowUpRight aria-hidden="true" size={18} /></a>
      </section>

      <SiteFooter />
    </main>
  );
}
