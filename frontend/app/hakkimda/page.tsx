import { getPageTools } from "../lib/i18n-server";
import type { Metadata } from "next";
import Image from "next/image";
import { isSectionVisible } from "../lib/section-visibility";
import { ArrowUpRight, Eye, MessageCircleMore, Route, FileText } from "lucide-react";
import { NativeLink } from "../components/native-link";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { getSitePage } from "../lib/directus";
import { professionalNoteText } from "../lib/public-copy";

type AboutContent = {
  section_visibility?: Record<string, boolean>;
  image_path?: string; image_alt?: string;
  hero_title: string; hero_accent: string; hero_description: string;
  story_title: string; story_accent: string; story_lead: string;
  story_paragraphs: Array<{ text: string }>; professional_note: string;
  principles_title: string; principles: Array<{ title: string; text: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage<AboutContent>("about");
  return { title: page.seo_title || "Hakkımda | Fzt. Furkan Toplu", description: page.seo_description || undefined };
}

const principleIcons = [MessageCircleMore, Eye, Route];

export default async function AboutPage() {
  const { locale, t, href: localHref } = await getPageTools();
  const { content } = await getSitePage<AboutContent>("about");
  const professionalNote=professionalNoteText(content.professional_note);
  const show = (key: string) => isSectionVisible(content.section_visibility, key);
  return (
    <main className="site-shell about-page">
      <SiteHeader locale={locale} active="about" />

      <section className={`about-page-hero${show("image") ? "" : " about-page-hero--text-only"}`} aria-labelledby="about-page-title">
        <div className="about-page-hero__copy">
          <p className="eyebrow"><span aria-hidden="true" />{t("Hakkımda")}</p>
          <h1 id="about-page-title">{content.hero_title}<em> {content.hero_accent}</em></h1>
          {show("intro") && (<p>{content.hero_description}</p>) }
          <NativeLink className="primary-button" href={localHref("/iletisim")}>{t("İletişim bilgilerini görün")}{" "}<ArrowUpRight aria-hidden="true" size={18} /></NativeLink>
        </div>
        {show("image") && (<div className="about-page-hero__portrait">
          <div className="about-page-hero__photo"><Image src={content.image_path || "/furkan-toplu-hero-white-coat-v1.png"} alt={content.image_alt || t("Fizyoterapist Furkan Toplu'nun portresi")} fill priority style={{ objectFit: "contain" }} sizes="(max-width: 860px) 100vw, 48vw" /></div>
          <div><span>{t("Fizyoterapist")}</span><strong>{t("Furkan Toplu")}</strong></div>
        </div>) }
      </section>

      {show("story") && (<section className="about-story" aria-labelledby="about-story-title">
        <div>
          <p className="section-kicker">{t("Mesleki Yaklaşım")}</p>
          <h2 id="about-story-title">{content.story_title}<em> {content.story_accent}</em></h2>
        </div>
        <div className="about-story__body">
          <p className="about-story__lead">{content.story_lead}</p>
          {content.story_paragraphs.map((paragraph, index) => <p key={index}>{paragraph.text}</p>)}
          {show("professional_note") && professionalNote && (<div className="about-story__note"><FileText aria-hidden="true" size={20} /><span>{professionalNote}</span></div>) }
        </div>
      </section>) }

      {show("principles") && (<section className="about-principles" aria-labelledby="principles-title">
        <div className="about-principles__heading">
          <p className="section-kicker section-kicker--light">{t("Çalışma İlkeleri")}</p>
          <h2 id="principles-title">{content.principles_title}</h2>
        </div>
        <div className="about-principles__grid">
          {content.principles.map(({ title, text }, index) => {
            const Icon = principleIcons[index] || FileText;
            return (
            <article key={title}>
              <div><span>{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" size={28} strokeWidth={1.4} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          );})}
        </div>
      </section>) }

      {show("cta") && (<section className="about-page-cta">
        <p>{t("Çalışma alanlarını ve süreç yaklaşımını daha ayrıntılı inceleyin.")}</p>
        <NativeLink href={localHref("/calisma-alanlari")}>{t("Çalışma alanlarına gidin")}{" "}<ArrowUpRight aria-hidden="true" size={18} /></NativeLink>
      </section>) }

      <SiteFooter />
    </main>
  );
}
