import type { Metadata } from "next";
import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircleMore, Phone, ShieldCheck } from "lucide-react";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { type ContactContent, phoneHref } from "../lib/contact";
import { getSitePage } from "../lib/directus";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage<ContactContent>("contact");
  return { title: page.seo_title || "İletişim | Fzt. Furkan Toplu", description: page.seo_description || undefined };
}

export default async function ContactPage() {
  const { content } = await getSitePage<ContactContent>("contact");
  const methods = [
    { icon: Phone, label: "Telefon", value: content.phone_display, note: content.working_days, href: phoneHref(content) },
    { icon: MessageCircleMore, label: "WhatsApp", value: "Mesaj gönderin", note: "Uygun olduğunda dönüş yapılır", href: `https://wa.me/${content.whatsapp_value}` },
    { icon: Mail, label: "E-posta", value: content.email, note: "Genel bilgi talepleri için", href: `mailto:${content.email}` },
  ];
  return (
    <main className="site-shell contact-page">
      <SiteHeader active="contact" />

      <section className="contact-page-hero" aria-labelledby="contact-page-title">
        <div>
          <p className="eyebrow"><span aria-hidden="true" />İletişim</p>
          <h1 id="contact-page-title">{content.hero_title}<em> {content.hero_accent}</em></h1>
        </div>
        <div className="contact-page-hero__intro">
          <p>{content.intro}</p>
          <div><ShieldCheck aria-hidden="true" size={19} /><span>{content.privacy_note}</span></div>
        </div>
      </section>

      <section className="contact-methods" aria-label="İletişim seçenekleri">
        {methods.map(({ icon: Icon, label, value, note, href }) => (
          <a href={href} key={label} target={label === "WhatsApp" ? "_blank" : undefined} rel={label === "WhatsApp" ? "noreferrer" : undefined}>
            <div className="contact-methods__top"><Icon aria-hidden="true" size={25} strokeWidth={1.45} /><ArrowUpRight aria-hidden="true" size={19} /></div>
            <span>{label}</span><strong>{value}</strong><small>{note}</small>
          </a>
        ))}
      </section>

      <section className="contact-details" aria-labelledby="visit-title">
        <div className="contact-details__heading">
          <p className="section-kicker">Görüşme Bilgileri</p>
          <h2 id="visit-title">Görüşme öncesinde bilmeniz gerekenler.</h2>
        </div>
        <div className="contact-details__cards">
          <article><MapPin aria-hidden="true" size={24} /><span>Görüşme adresi</span><h3>{content.address_title}</h3><p>{content.address_note}</p></article>
          <article><Clock3 aria-hidden="true" size={24} /><span>Çalışma saatleri</span><h3>{content.working_days}</h3><p>{content.working_hours}</p></article>
        </div>
      </section>

      <section className="contact-flow" aria-labelledby="contact-flow-title">
        <div><p className="section-kicker section-kicker--light">Kısa Süreç</p><h2 id="contact-flow-title">{content.flow_title}</h2></div>
        <ol>
          {content.flow_steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step.title}</strong><p>{step.text}</p></div></li>)}
        </ol>
      </section>

      <SiteFooter />
    </main>
  );
}
