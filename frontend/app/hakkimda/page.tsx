import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Eye, MessageCircleMore, Route, Sparkles } from "lucide-react";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { getSitePage } from "../lib/directus";

type AboutContent = {
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
  const { content } = await getSitePage<AboutContent>("about");
  return (
    <main className="site-shell about-page">
      <SiteHeader active="about" />

      <section className="about-page-hero" aria-labelledby="about-page-title">
        <div className="about-page-hero__copy">
          <p className="eyebrow"><span aria-hidden="true" />Hakkımda</p>
          <h1 id="about-page-title">{content.hero_title}<em> {content.hero_accent}</em></h1>
          <p>{content.hero_description}</p>
          <Link className="primary-button" href="/iletisim" prefetch={false}>İletişim bilgilerini görün <ArrowUpRight aria-hidden="true" size={18} /></Link>
        </div>
        <div className="about-page-hero__portrait">
          <Image src="/about-physiotherapist-v1.png" alt="Klinik ortamında fizyoterapist Furkan Toplu" fill priority sizes="(max-width: 860px) 100vw, 48vw" />
          <div><span>Fizyoterapist</span><strong>Furkan Toplu</strong></div>
        </div>
      </section>

      <section className="about-story" aria-labelledby="about-story-title">
        <div>
          <p className="section-kicker">Mesleki Yaklaşım</p>
          <h2 id="about-story-title">{content.story_title}<em> {content.story_accent}</em></h2>
        </div>
        <div className="about-story__body">
          <p className="about-story__lead">{content.story_lead}</p>
          {content.story_paragraphs.map((paragraph, index) => <p key={index}>{paragraph.text}</p>)}
          <div className="about-story__note"><Sparkles aria-hidden="true" size={20} /><span>{content.professional_note}</span></div>
        </div>
      </section>

      <section className="about-principles" aria-labelledby="principles-title">
        <div className="about-principles__heading">
          <p className="section-kicker section-kicker--light">Çalışma İlkeleri</p>
          <h2 id="principles-title">{content.principles_title}</h2>
        </div>
        <div className="about-principles__grid">
          {content.principles.map(({ title, text }, index) => {
            const Icon = principleIcons[index] || Sparkles;
            return (
            <article key={title}>
              <div><span>{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" size={28} strokeWidth={1.4} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          );})}
        </div>
      </section>

      <section className="about-page-cta">
        <p>Çalışma alanlarını ve süreç yaklaşımını daha ayrıntılı inceleyin.</p>
        <Link href="/calisma-alanlari" prefetch={false}>Çalışma alanlarına gidin <ArrowUpRight aria-hidden="true" size={18} /></Link>
      </section>

      <SiteFooter />
    </main>
  );
}
