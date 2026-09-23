import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Eye, MessageCircleMore, Route, Sparkles } from "lucide-react";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "Hakkımda | Fzt. Furkan Toplu",
  description:
    "Fizyoterapist Furkan Toplu'nun değerlendirme yaklaşımı, çalışma ilkeleri ve danışan iletişimi hakkında bilgi.",
};

const principles = [
  { icon: MessageCircleMore, number: "01", title: "Dinlemek", text: "Süreci kişinin günlük yaşamını, beklentilerini ve ihtiyaçlarını anlayarak başlatmak." },
  { icon: Eye, number: "02", title: "Bütünü görmek", text: "Tek bir bölge yerine hareketi, alışkanlıkları ve çevresel koşulları birlikte değerlendirmek." },
  { icon: Route, number: "03", title: "Yolu açıklamak", text: "Değerlendirme ve takip adımlarını sade, anlaşılır ve şeffaf biçimde paylaşmak." },
];

export default function AboutPage() {
  return (
    <main className="site-shell about-page">
      <SiteHeader active="about" />

      <section className="about-page-hero" aria-labelledby="about-page-title">
        <div className="about-page-hero__copy">
          <p className="eyebrow"><span aria-hidden="true" />Hakkımda</p>
          <h1 id="about-page-title">Hareketi anlamak,<em> önce insanı dinlemekle başlar.</em></h1>
          <p>
            Her bireyin günlük yaşamı, hareket deneyimi ve hedefleri farklıdır.
            Bu nedenle süreci hazır kalıplarla değil; dinleyerek, değerlendirerek
            ve anlaşılır bir yol haritası oluşturarak ele alıyorum.
          </p>
          <a className="primary-button" href="/iletisim">İletişim bilgilerini görün <ArrowUpRight aria-hidden="true" size={18} /></a>
        </div>
        <div className="about-page-hero__portrait">
          <Image src="/about-physiotherapist-v1.png" alt="Klinik ortamında fizyoterapist Furkan Toplu" fill priority sizes="(max-width: 860px) 100vw, 48vw" />
          <div><span>Fizyoterapist</span><strong>Furkan Toplu</strong></div>
        </div>
      </section>

      <section className="about-story" aria-labelledby="about-story-title">
        <div>
          <p className="section-kicker">Mesleki Yaklaşım</p>
          <h2 id="about-story-title">Bilimsel bilgiyi,<em> günlük yaşama uyarlanabilir hale getirmek.</em></h2>
        </div>
        <div className="about-story__body">
          <p className="about-story__lead">Fizyoterapi sürecinin yalnızca görüşme sırasında yapılanlardan ibaret olmadığına inanıyorum.</p>
          <p>Değerlendirmede kişinin hareket kapasitesini, günlük alışkanlıklarını, çalışma koşullarını ve kendi hedeflerini birlikte ele alıyorum. Amaç; karmaşık görünen bilgileri sadeleştirmek ve kişinin sürece aktif olarak katılabileceği açık bir çerçeve oluşturmaktır.</p>
          <p>Her adımda neyin, neden ele alındığını paylaşmaya; ilerlemeyi düzenli olarak gözden geçirmeye ve gerektiğinde planı yeniden şekillendirmeye önem veriyorum.</p>
          <div className="about-story__note"><Sparkles aria-hidden="true" size={20} /><span>Diploma, eğitim ve sertifika bilgileri müşteriden alınacak gerçek içerikle yayın öncesinde bu alana eklenecektir.</span></div>
        </div>
      </section>

      <section className="about-principles" aria-labelledby="principles-title">
        <div className="about-principles__heading">
          <p className="section-kicker section-kicker--light">Çalışma İlkeleri</p>
          <h2 id="principles-title">Sade, şeffaf ve kişiye göre şekillenen bir süreç.</h2>
        </div>
        <div className="about-principles__grid">
          {principles.map(({ icon: Icon, number, title, text }) => (
            <article key={title}>
              <div><span>{number}</span><Icon aria-hidden="true" size={28} strokeWidth={1.4} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-page-cta">
        <p>Çalışma alanlarını ve süreç yaklaşımını daha ayrıntılı inceleyin.</p>
        <a href="/calisma-alanlari">Çalışma alanlarına gidin <ArrowUpRight aria-hidden="true" size={18} /></a>
      </section>

      <SiteFooter />
    </main>
  );
}
