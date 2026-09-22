import type { ReactNode } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export type LegalSection = {
  title: string;
  content: ReactNode;
};

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
};

export function LegalDocument({ eyebrow, title, intro, updated, sections }: LegalDocumentProps) {
  return (
    <main className="site-shell legal-page">
      <SiteHeader />

      <section className="legal-hero" aria-labelledby="legal-title">
        <a href="/" className="legal-back"><ArrowLeft aria-hidden="true" size={17} />Ana sayfaya dön</a>
        <p className="eyebrow"><span aria-hidden="true" />{eyebrow}</p>
        <h1 id="legal-title">{title}</h1>
        <p>{intro}</p>
        <div className="legal-hero__meta">
          <span>Son taslak güncellemesi</span>
          <strong>{updated}</strong>
        </div>
      </section>

      <div className="legal-layout">
        <aside>
          <p>Taslak metin</p>
          <strong>Yayın öncesinde gerçek veri işleme envanterine göre hukuk uzmanı tarafından kontrol edilmelidir.</strong>
          <a href="https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-" target="_blank" rel="noreferrer">
            Resmî KVKK bilgisi <ExternalLink aria-hidden="true" size={15} />
          </a>
        </aside>

        <article className="legal-content">
          {sections.map((section, index) => (
            <section key={section.title} aria-labelledby={`legal-section-${index}`}>
              <span>0{index + 1}</span>
              <div>
                <h2 id={`legal-section-${index}`}>{section.title}</h2>
                {section.content}
              </div>
            </section>
          ))}
        </article>
      </div>

      <SiteFooter />
    </main>
  );
}
