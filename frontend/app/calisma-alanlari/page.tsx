import { getPageTools } from "../lib/i18n-server";
import type { Metadata } from "next";
import Image from "next/image";
import { isSectionVisible } from "../lib/section-visibility";
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
  const show = (key: string) => isSectionVisible(content.section_visibility, key);

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
          {show("intro") && (<p>{content.hero_description}</p>) }
          <span>{String(practiceAreas.length).padStart(2, "0")}{" "}{t("çalışma alanı · Kişiye özel değerlendirme")}</span>
        </div>
      </section>
      {content.hero_image && show("image") && <div className="managed-page-image"><Image src={content.hero_image} alt={content.hero_image_alt} fill sizes="100vw" /></div> }

      {show("listing") && (<section className="practice-directory-grid" aria-label={t("Çalışma alanı listesi")}>
        {practiceAreas.length === 0 && <p>{t("Bu dilde çalışma alanları yakında eklenecek.")}</p>}
        {practiceAreas.map((area, index) => {
          const Icon = icons[index % icons.length];
          const hasImage = Boolean(area.image_path) && isSectionVisible(area.section_visibility, "image");
          const number = String(index + 1).padStart(2, "0");
          return (
            <article className={`practice-directory-card${hasImage ? " practice-directory-card--with-image" : " practice-directory-card--text-only"}`} key={area.slug}>
              <div className="practice-directory-card__topline">
                <span>{number}</span>
                <Icon aria-hidden="true" size={29} strokeWidth={1.35} />
              </div>
              {area.image_path && isSectionVisible(area.section_visibility, "image") && <a className="content-card-image practice-card-image" href={localHref(`/calisma-alanlari/${area.slug}`)}><Image src={area.image_path} alt={area.image_alt || area.title} fill sizes="(max-width: 860px) 100vw, 50vw" style={{ objectFit: "contain", objectPosition: "center" }} /></a>}
              <div className="practice-directory-card__body">
              <h2>{area.title}</h2>
              {isSectionVisible(area.section_visibility, "summary") && <p>{area.summary}</p>}
              </div>
              <a className="practice-directory-card__link" href={localHref(`/calisma-alanlari/${area.slug}`)} aria-label={`${area.title}: ${t("Detayları incele")}`}>{t("Detay sayfasını açın")}<ArrowUpRight aria-hidden="true" size={18} />
              </a>
            </article>
          );
        })}
      </section>) }

      <SiteFooter />
    </main>
  );
}
