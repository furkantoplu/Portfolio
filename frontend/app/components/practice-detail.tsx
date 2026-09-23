import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ClipboardCheck,
  MessageCircleMore,
  Route,
} from "lucide-react";
import { SiteHeader } from "./site-header";
import { practiceAreas } from "./practice-catalog";

type ProcessStep = {
  title: string;
  description: string;
};

type Question = {
  question: string;
  answer: string;
};

export type PracticeDetailContent = {
  slug: string;
  index: string;
  title: string;
  titleAccent: string;
  lead: string;
  image: string;
  imageAlt: string;
  overviewTitle: string;
  overviewAccent: string;
  overviewDescription: string;
  evaluationTopics: string[];
  processSteps: [ProcessStep, ProcessStep, ProcessStep];
  questions: Question[];
};

const processIcons = [MessageCircleMore, ClipboardCheck, Route];

export function PracticeDetail({ content }: { content: PracticeDetailContent }) {
  return (
    <main className="site-shell detail-page">
      <SiteHeader active="areas" />

      <section className="detail-hero" aria-labelledby="detail-title">
        <div className="detail-hero__content">
          <a className="detail-back-link" href="/#calisma-alanlari">
            <ArrowLeft aria-hidden="true" size={17} />
            Çalışma alanlarına dön
          </a>
          <p className="eyebrow">
            <span aria-hidden="true" />
            Çalışma Alanı · {content.index}
          </p>
          <h1 id="detail-title">
            {content.title}
            <em> {content.titleAccent}</em>
          </h1>
          <p className="detail-hero__lead">{content.lead}</p>
          <a className="primary-button" href="/iletisim">
            Görüşme hakkında bilgi alın
            <ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </div>

        <div className="detail-hero__visual">
          <div className="detail-hero__image">
            <Image
              src={content.image}
              alt={content.imageAlt}
              fill
              priority
              sizes="(max-width: 860px) 100vw, 46vw"
            />
          </div>
          <div className="detail-hero__index" aria-hidden="true">
            {content.index}
          </div>
          <p className="detail-hero__notice">
            Bu sayfa genel bilgilendirme amaçlıdır; kişisel değerlendirme ve tanı
            yerine geçmez.
          </p>
        </div>
      </section>

      <section className="detail-overview" aria-labelledby="overview-title">
        <div className="detail-overview__heading">
          <p className="section-kicker">Değerlendirme Alanı</p>
          <h2 id="overview-title">
            {content.overviewTitle}
            <em> {content.overviewAccent}</em>
          </h2>
        </div>
        <div className="detail-overview__body">
          <p>{content.overviewDescription}</p>
          <div className="detail-topic-list">
            {content.evaluationTopics.map((topic) => (
              <div key={topic}>
                <span aria-hidden="true"><Check size={17} strokeWidth={2} /></span>
                <p>{topic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-process" aria-labelledby="process-title">
        <div className="detail-process__heading">
          <p className="section-kicker">Süreç Nasıl İlerler?</p>
          <h2 id="process-title">Üç adımda açık ve takip edilebilir bir yaklaşım.</h2>
        </div>
        <div className="detail-process__grid">
          {content.processSteps.map((step, index) => {
            const Icon = processIcons[index];
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
      </section>

      <section className="detail-faq" aria-labelledby="faq-title">
        <div className="detail-faq__intro">
          <p className="section-kicker">Merak Edilenler</p>
          <h2 id="faq-title">İlk görüşme öncesinde kısa cevaplar.</h2>
          <p>
            Kişisel durumunuza ilişkin değerlendirme yalnızca görüşme sırasında
            yapılabilir. Buradaki cevaplar sürecin genel çerçevesini anlatır.
          </p>
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
      </section>

      <section className="detail-related" aria-labelledby="related-title">
        <div className="detail-related__heading">
          <p className="section-kicker">Diğer Çalışma Alanları</p>
          <h2 id="related-title">İhtiyacınıza yakın diğer başlıkları inceleyin.</h2>
        </div>
        <div className="detail-related__grid">
          {practiceAreas
            .filter((area) => area.slug !== content.slug)
            .map((area) => (
              <a href={area.href} key={area.slug}>
                <span>{area.number}</span>
                <strong>{area.title}</strong>
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
            ))}
        </div>
      </section>

      <section className="detail-cta" aria-labelledby="detail-cta-title">
        <div>
          <p className="section-kicker section-kicker--light">İletişim</p>
          <h2 id="detail-cta-title">Sürecin sizin için uygunluğunu birlikte konuşalım.</h2>
        </div>
        <a href="/iletisim">
          İletişim bilgilerine gidin
          <ArrowUpRight aria-hidden="true" size={19} />
        </a>
      </section>

      <footer className="detail-footer">
        <p>© 2026 Fzt. Furkan Toplu</p>
        <a href="/">Ana sayfaya dön</a>
      </footer>
    </main>
  );
}
