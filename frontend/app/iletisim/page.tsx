import { getPageTools } from "../lib/i18n-server";
import type { Metadata } from "next";
import { isSectionVisible } from "../lib/section-visibility";
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
  const { locale, t } = await getPageTools();
  const { content } = await getSitePage<ContactContent>("contact");
  const show = (key: string) => isSectionVisible(content.section_visibility, key);
  const methods = [
    { key: "phone", icon: Phone, label: "Telefon", value: content.phone_display, note: content.working_days, href: phoneHref(content) },
    { key: "whatsapp", icon: MessageCircleMore, label: "WhatsApp", value: "Mesaj gönderin", note: "Uygun olduğunda dönüş yapılır", href: `https://wa.me/${content.whatsapp_value}` },
    { key: "email", icon: Mail, label: "E-posta", value: content.email, note: "Genel bilgi talepleri için", href: `mailto:${content.email}` },
  ].filter(method => show(method.key));
  return (
    <main className="site-shell contact-page">
      <SiteHeader locale={locale} active="contact" />

      <section className="contact-page-hero" aria-labelledby="contact-page-title">
        <div>
          <p className="eyebrow"><span aria-hidden="true" />{t("İletişim")}</p>
          <h1 id="contact-page-title">{content.hero_title}<em> {content.hero_accent}</em></h1>
        </div>
        <div className="contact-page-hero__intro">
          {show("intro") && (<p>{content.intro}</p>) }
          <div><ShieldCheck aria-hidden="true" size={19} /><span>{content.privacy_note}</span></div>
        </div>
      </section>

      {methods.length > 0 && (<section className={`contact-methods${methods.length === 1 ? " contact-methods--single" : methods.length === 2 ? " contact-methods--two" : ""}`} aria-label={t("İletişim seçenekleri")}>
        {methods.map(({ icon: Icon, label, value, note, href }) => (
          <a href={href} key={label} target={label === "WhatsApp" ? "_blank" : undefined} rel={label === "WhatsApp" ? "noreferrer" : undefined}>
            <div className="contact-methods__top"><Icon aria-hidden="true" size={25} strokeWidth={1.45} /><ArrowUpRight aria-hidden="true" size={19} /></div>
                <span>{t(label)}</span><strong>{t(value)}</strong><small>{t(note)}</small>
          </a>
        ))}
      </section>) }

      {(show("address") || show("hours")) && (<section className="contact-visit-details" aria-label={t("Görüşme Bilgileri")}>
        <div className={`contact-details__cards${show("address") && show("hours") ? "" : " contact-details__cards--single"}`}>
          {show("address") && (<article><MapPin aria-hidden="true" size={24} /><div><span>{t("Görüşme adresi")}</span><h3>{content.address_title}</h3><p>{content.address_note}</p></div></article>) }
          {show("hours") && (<article><Clock3 aria-hidden="true" size={24} /><div><span>{t("Çalışma saatleri")}</span><h3>{content.working_days}</h3><p>{content.working_hours}</p></div></article>) }
        </div>
      </section>) }

      {show("flow") && (<section className="contact-flow" aria-labelledby="contact-flow-title">
        <div><p className="section-kicker section-kicker--light">{t("Kısa Süreç")}</p><h2 id="contact-flow-title">{content.flow_title}</h2></div>
        <ol>
          {content.flow_steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step.title}</strong><p>{step.text}</p></div></li>)}
        </ol>
      </section>) }

      <SiteFooter />
    </main>
  );
}
