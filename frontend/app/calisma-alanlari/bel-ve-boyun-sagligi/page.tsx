import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ClipboardCheck,
  MessageCircleMore,
  Route,
} from "lucide-react";
import { SiteHeader } from "../../components/site-header";

export const metadata: Metadata = {
  title: "Bel ve Boyun Sağlığı | Fzt. Deniz Yılmaz",
  description:
    "Bel ve boyun hareketlerini etkileyen durumlara yönelik değerlendirme ve fizyoterapi yaklaşımı hakkında genel bilgi.",
};

const evaluationTopics = [
  "Uzun süre masa başında kalmaya bağlı hareket ihtiyacı",
  "Günlük hareketlerde zorlanma veya kısıtlılık hissi",
  "Hekim yönlendirmesi sonrasında planlanan fizyoterapi süreci",
  "Duruş ve günlük alışkanlıkların hareket üzerindeki etkileri",
];

const processSteps = [
  {
    number: "01",
    title: "İhtiyacı dinleme",
    description:
      "Günlük yaşamınız, hareket alışkanlıklarınız ve beklentileriniz birlikte ele alınır.",
    icon: MessageCircleMore,
  },
  {
    number: "02",
    title: "Hareket değerlendirmesi",
    description:
      "Hareket kapasitesi ve süreci etkileyebilecek temel noktalar değerlendirilir.",
    icon: ClipboardCheck,
  },
  {
    number: "03",
    title: "Kişisel yol haritası",
    description:
      "Değerlendirme sonucuna göre anlaşılır, takip edilebilir bir çalışma planı oluşturulur.",
    icon: Route,
  },
];

const questions = [
  {
    question: "İlk görüşme ne kadar sürer?",
    answer:
      "İlk görüşme değerlendirme kapsamına göre değişebilir. Randevu oluşturulurken tahmini süre hakkında bilgi verilir.",
  },
  {
    question: "Tetkiklerimi yanımda getirmeli miyim?",
    answer:
      "Varsa hekim değerlendirmeleri ve ilgili tetkikler süreci anlamaya yardımcı olabilir. Size ait belgeleri paylaşmadan önce kapsam hakkında bilgi alabilirsiniz.",
  },
  {
    question: "Egzersiz planı herkeste aynı mı olur?",
    answer:
      "Hayır. Plan; değerlendirme bulguları, günlük yaşam, ihtiyaçlar ve hedefler birlikte ele alınarak kişiye göre şekillendirilir.",
  },
];

export default function NeckAndBackHealthPage() {
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
            Çalışma Alanı · 01
          </p>
          <h1 id="detail-title">
            Bel ve boyun sağlığına
            <em> hareket odaklı yaklaşım.</em>
          </h1>
          <p className="detail-hero__lead">
            Günlük yaşamı etkileyen hareket kısıtlılıklarını anlamak, ihtiyaca
            uygun bir yol haritası oluşturmak ve süreci düzenli olarak izlemek
            için değerlendirme odaklı bir yaklaşım.
          </p>
          <a className="primary-button" href="/#iletisim">
            Görüşme hakkında bilgi alın
            <ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </div>

        <div className="detail-hero__visual">
          <div className="detail-hero__image">
            <Image
              src="/hero-physiotherapy-v1.png"
              alt="Fizyoterapist eşliğinde kontrollü omuz hareketi yapan danışan"
              fill
              priority
              sizes="(max-width: 860px) 100vw, 46vw"
            />
          </div>
          <div className="detail-hero__index" aria-hidden="true">01</div>
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
            Süreci yalnızca bir bölgeye değil,
            <em> günlük harekete bakarak anlamak.</em>
          </h2>
        </div>
        <div className="detail-overview__body">
          <p>
            Bel ve boyun bölgesindeki hareket ihtiyacı; çalışma düzeni, günlük
            alışkanlıklar, aktivite seviyesi ve kişinin hedefleriyle birlikte ele
            alınır. İlk adım, mevcut durumu açık ve anlaşılır şekilde
            değerlendirmektir.
          </p>
          <div className="detail-topic-list">
            {evaluationTopics.map((topic) => (
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
          {processSteps.map(({ number, title, description, icon: Icon }) => (
            <article key={title}>
              <div className="detail-process__topline">
                <span>{number}</span>
                <Icon aria-hidden="true" size={27} strokeWidth={1.45} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
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
          {questions.map((item, index) => (
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

      <section className="detail-cta" aria-labelledby="detail-cta-title">
        <div>
          <p className="section-kicker section-kicker--light">İletişim</p>
          <h2 id="detail-cta-title">Sürecin sizin için uygunluğunu birlikte konuşalım.</h2>
        </div>
        <a href="/#iletisim">
          İletişim bilgilerine gidin
          <ArrowUpRight aria-hidden="true" size={19} />
        </a>
      </section>

      <footer className="detail-footer">
        <p>© 2026 Fzt. Deniz Yılmaz</p>
        <a href="/">Ana sayfaya dön</a>
      </footer>
    </main>
  );
}
