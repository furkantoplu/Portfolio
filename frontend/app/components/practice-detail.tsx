import { getPageTools } from "../lib/i18n-server";
import Image from "./site-image";
import { isSectionVisible } from "../lib/section-visibility";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ClipboardCheck,
  MessageCircleMore,
  Route,
} from "lucide-react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import type { Locale } from "../lib/i18n";

type ProcessStep = {
  title: string;
  description: string;
};

type Question = {
  question: string;
  answer: string;
};

export type PracticeDetailContent = {
  section_visibility?: Record<string, boolean>;
  slug: string;
  index: string;
  title: string;
  subtitle?: string;
  titleAccent: string;
  lead: string;
  image: string | null;
  imageAlt: string;
  overviewTitle: string;
  overviewAccent: string;
  overviewDescription: string;
  evaluationTopics: string[];
  processSteps: ProcessStep[];
  questions: Question[];
};

type RelatedPracticeArea = {
  slug: string;
  number: string;
  title: string;
  href: string;
};

const processIcons = [MessageCircleMore, ClipboardCheck, Route];

export async function PracticeDetail({
  content,
  relatedAreas,
  languageLinks,
}: {
  content: PracticeDetailContent;
  relatedAreas: RelatedPracticeArea[];
  languageLinks?: Partial<Record<Locale, string>>;
}) {
  const { locale, t, href: localHref } = await getPageTools();
  const show = (key: string) => isSectionVisible(content.section_visibility, key);
  const hasImage = Boolean(content.image) && show("image");
  return (
    <main className="site-shell detail-page">
      <SiteHeader locale={locale} active="areas" languageLinks={languageLinks} />

      <section className={`detail-hero${hasImage ? "" : " detail-hero--text-only"}`} aria-labelledby="detail-title">
        <div className="detail-hero__content">
          <a className="detail-back-link" href={localHref("/calisma-alanlari")}>
            <ArrowLeft aria-hidden="true" size={17} />{t("Çalışma alanlarına dön")}</a>
          <p className="eyebrow">
            <span aria-hidden="true" />{t("Çalışma Alanı ·")}{content.index}
          </p>
          <h1 id="detail-title">
            {content.title}
          </h1>
          {show("subtitle") && (content.subtitle || content.titleAccent) && <p className="detail-hero__subtitle">{content.subtitle}<em> {content.titleAccent}</em></p>}
          {show("lead") && (<p className="detail-hero__lead">{content.lead}</p>) }
          <a className="primary-button" href={localHref("/iletisim")}>{t("Görüşme hakkında bilgi alın")}<ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </div>

        {hasImage && <div className="detail-hero__visual">
          <div className="detail-hero__image">
            <Image
              src={content.image!}
              alt={content.imageAlt}
              fill
              priority
              sizes="(max-width: 860px) 100vw, 46vw"
              style={{ objectFit: "contain", objectPosition: "center" }}
            />
          </div>
        </div>}
      </section>

      {show("overview") && (<section className="detail-overview" aria-labelledby="overview-title">
        <div className="detail-overview__heading">
          <p className="section-kicker">{t("Değerlendirme Alanı")}</p>
          <h2 id="overview-title">
            {content.overviewTitle}
            <em> {content.overviewAccent}</em>
          </h2>
        </div>
        <div className="detail-overview__body">
          <p>{content.overviewDescription}</p>
          {show("assessment") && (<div className="detail-topic-list">
            {content.evaluationTopics.map((topic) => (
              <div key={topic}>
                <span aria-hidden="true"><Check size={17} strokeWidth={2} /></span>
                <p>{topic}</p>
              </div>
            ))}
          </div>) }
        </div>
      </section>) }

      {show("process") && (<section className="detail-process" aria-labelledby="process-title">
        <div className="detail-process__heading">
          <p className="section-kicker">{t("Süreç Nasıl İlerler?")}</p>
          <h2 id="process-title">{t("Üç adımda açık ve takip edilebilir bir yaklaşım.")}</h2>
        </div>
        <div className="detail-process__grid">
          {content.processSteps.map((step, index) => {
            const Icon = processIcons[index % processIcons.length];
            return (
              <article key={step.title}>
                <div className="detail-process__topline">
                  <span>0{index + 1}</span>
                  <Icon aria-hidden="true" size={27} strokeWidth={1.45} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            );
          })}
        </div>
      </section>) }

      {show("faqs") && (<section className="detail-faq" aria-labelledby="faq-title">
        <div className="detail-faq__intro">
          <p className="section-kicker">{t("Merak Edilenler")}</p>
          <h2 id="faq-title">{t("İlk görüşme öncesinde kısa cevaplar.")}</h2>
        </div>
        <div className="detail-faq__list">
          {content.questions.map((item, index) => (
            <article key={item.question}>
              <span>0{index + 1}</span>
              <div>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            </article>
          ))}
        </div>
      </section>) }

      {show("related") && (<section className="detail-related" aria-labelledby="related-title">
        <div className="detail-related__heading">
          <p className="section-kicker">{t("Diğer Çalışma Alanları")}</p>
          <h2 id="related-title">{t("İhtiyacınıza yakın diğer başlıkları inceleyin.")}</h2>
        </div>
        <div className="detail-related__grid">
          {relatedAreas.map((area) => (
              <a href={localHref(area.href)} key={area.slug}>
                <span>{area.number}</span>
                <strong>{area.title}</strong>
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
            ))}
        </div>
      </section>) }

      {show("cta") && (<section className="detail-cta" aria-labelledby="detail-cta-title">
        <div>
          <p className="section-kicker section-kicker--light">{t("İletişim")}</p>
          <h2 id="detail-cta-title">{t("Sürecin sizin için uygunluğunu birlikte konuşalım.")}</h2>
        </div>
        <a href={localHref("/iletisim")}>{t("İletişim bilgilerine gidin")}<ArrowUpRight aria-hidden="true" size={19} />
        </a>
      </section>) }

      <SiteFooter />
    </main>
  );
}
