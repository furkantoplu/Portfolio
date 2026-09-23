import type { Metadata } from "next";
import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircleMore, Phone, ShieldCheck } from "lucide-react";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "İletişim | Fzt. Furkan Toplu",
  description: "Görüşme süreci, çalışma saatleri ve iletişim kanalları hakkında bilgi alın.",
};

const methods = [
  { icon: Phone, label: "Telefon", value: "+90 555 123 45 67", note: "Pazartesi — Cumartesi", href: "tel:+905551234567" },
  { icon: MessageCircleMore, label: "WhatsApp", value: "Mesaj gönderin", note: "Uygun olduğunda dönüş yapılır", href: "https://wa.me/905551234567" },
  { icon: Mail, label: "E-posta", value: "merhaba@furkantoplu.com", note: "Genel bilgi talepleri için", href: "mailto:merhaba@furkantoplu.com" },
];

export default function ContactPage() {
  return (
    <main className="site-shell contact-page">
      <SiteHeader active="contact" />

      <section className="contact-page-hero" aria-labelledby="contact-page-title">
        <div>
          <p className="eyebrow"><span aria-hidden="true" />İletişim</p>
          <h1 id="contact-page-title">İlk adımı<em> sakin ve net</em> atalım.</h1>
        </div>
        <div className="contact-page-hero__intro">
          <p>Görüşme süreci, uygun saatler veya çalışma alanları hakkında genel bilgi almak için size uygun kanalı kullanabilirsiniz.</p>
          <div><ShieldCheck aria-hidden="true" size={19} /><span>İlk iletişimde sağlık raporu veya ayrıntılı sağlık verisi göndermeyin.</span></div>
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
          <article><MapPin aria-hidden="true" size={24} /><span>Görüşme adresi</span><h3>Kadıköy / İstanbul</h3><p>Detaylı adres, görüşme oluşturulduktan sonra paylaşılır.</p></article>
          <article><Clock3 aria-hidden="true" size={24} /><span>Çalışma saatleri</span><h3>Pazartesi — Cumartesi</h3><p>09.00 — 19.00 · Yalnızca randevu ile</p></article>
        </div>
      </section>

      <section className="contact-flow" aria-labelledby="contact-flow-title">
        <div><p className="section-kicker section-kicker--light">Kısa Süreç</p><h2 id="contact-flow-title">İletişimden ilk görüşmeye üç sade adım.</h2></div>
        <ol>
          <li><span>01</span><div><strong>Uygun kanaldan ulaşın</strong><p>İletişim tercihinizi ve genel bilgi talebinizi paylaşın.</p></div></li>
          <li><span>02</span><div><strong>Saat ve kapsam netleşsin</strong><p>Uygun zaman ile ilk görüşmenin genel çerçevesi konuşulsun.</p></div></li>
          <li><span>03</span><div><strong>İlk değerlendirme yapılsın</strong><p>Kişisel ihtiyaçlar ancak görüşme sırasında ayrıntılı biçimde ele alınsın.</p></div></li>
        </ol>
      </section>

      <SiteFooter />
    </main>
  );
}
