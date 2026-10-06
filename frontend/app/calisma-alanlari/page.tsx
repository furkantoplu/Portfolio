import { getPageTools } from "../lib/i18n-server";
import type { Metadata } from "next";
import Image from "next/image";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Dumbbell,
  HeartPulse,
  PersonStanding,
} from "lucide-react";
import { getPracticeAreas, getEditablePage } from "../lib/directus";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export async function generateMetadata(): Promise<Metadata> { const page = await getEditablePage("areas"); return { title: page.seo_title || "Çalışma alanları sayfası | Fzt. Furkan Toplu", description: page.seo_description || undefined }; }

const icons = [Activity, Dumbbell, HeartPulse, PersonStanding];

export default async function PracticeAreasPage() {
  const { locale, t, href: localHref } = await getPageTools();
  const practiceAreas = await getPracticeAreas();
  const { content } = await getEditablePage("areas");

  return (
    <main className="site-shell practice-directory-page">
      <SiteHeader locale={locale} active="areas" />

      <section className="practice-directory-hero" aria-labelledby="directory-title">
        <div>
          <p className="eyebrow"><span aria-hidden="true" />{content.hero_image_alt}</p>
          <h1 id="directory-title">{content.hero_title}<em>{" "}{content.hero_accent}</em>
          </h1>
        </div>
        <div className="practice-directory-hero__aside">
          <ArrowDownRight aria-hidden="true" size={30} strokeWidth={1.35} />
          <p>{content.hero_description}</p>
          <span>{String(practiceAreas.length).padStart(2, "0")}{" "}{t("çalışma alanı · Kişiye özel değerlendirme")}</span>
        </div>
      </section>
      {content.hero_image && <div className="managed-page-image"><Image src={content.hero_image} alt={content.hero_image_alt} fill sizes="100vw" /></div> }

      <section className="practice-directory-grid" aria-label={t("Çalışma alanı listesi")}>
        {practiceAreas.length === 0 && <p>{t("Bu dilde çalışma alanları yakında eklenecek.")}</p>}
        {practiceAreas.map((area, index) => {
          const Icon = icons[index % icons.length];
          const number = String(index + 1).padStart(2, "0");
          return (
            <article key={area.slug}>
              {area.image_path && <a className="content-card-image" href={localHref(`/calisma-alanlari/${area.slug}`)}><Image src={area.image_path} alt={area.image_alt || area.title} fill sizes="(max-width: 860px) 100vw, 33vw" /></a>}
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
        <h2 id="directory-note-title">{content.note_title}<em>{" "}{content.note_accent}</em>
        </h2>
        <p>{content.note_text}</p>
        <a href={localHref("/iletisim")}>{t("İletişim bilgilerine gidin")}{" "}<ArrowUpRight aria-hidden="true" size={18} /></a>
      </section>

      <SiteFooter />
    </main>
  );
}
