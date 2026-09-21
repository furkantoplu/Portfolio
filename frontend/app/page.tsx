import Image from "next/image";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  Dumbbell,
  HeartPulse,
  Menu,
  PersonStanding,
} from "lucide-react";

const navItems = ["Ana Sayfa", "Hakkımda", "Çalışma Alanları", "Blog", "İletişim"];

const practiceAreas = [
  {
    number: "01",
    title: "Bel ve Boyun Sağlığı",
    description:
      "Günlük yaşamı etkileyen hareket kısıtlılıklarına yönelik değerlendirme odaklı yaklaşım.",
    icon: Activity,
  },
  {
    number: "02",
    title: "Sporcu Rehabilitasyonu",
    description:
      "Spora güvenli dönüş sürecini hareket analizi ve kişiye özel planlamayla destekleme.",
    icon: Dumbbell,
  },
  {
    number: "03",
    title: "Ameliyat Sonrası Süreç",
    description:
      "Hekim yönlendirmesi doğrultusunda hareket kapasitesinin yeniden kazanılmasına destek.",
    icon: HeartPulse,
  },
  {
    number: "04",
    title: "Duruş ve Hareket Analizi",
    description:
      "Günlük alışkanlıkların ve hareket örüntülerinin bütüncül olarak değerlendirilmesi.",
    icon: PersonStanding,
  },
];

function BrandMark() {
  return (
    <span aria-hidden="true" className="brand-mark">
      <span className="brand-mark__leaf brand-mark__leaf--left" />
      <span className="brand-mark__leaf brand-mark__leaf--right" />
      <span className="brand-mark__stem" />
    </span>
  );
}

export default function Home() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="brand" href="#" aria-label="Ana sayfa">
          <BrandMark />
          <span className="brand__copy">
            <strong>Fzt. Deniz Yılmaz</strong>
            <span>Harekete alan açın</span>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Ana menü">
          {navItems.map((item, index) => (
            <a
              href={index === 0 ? "#" : `#${item.toLocaleLowerCase("tr-TR").replaceAll(" ", "-")}`}
              className={index === 0 ? "is-active" : undefined}
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>

        <a className="header-cta" href="#iletisim">
          <CalendarDays aria-hidden="true" size={18} strokeWidth={1.8} />
          <span>Randevu Bilgisi</span>
        </a>

        <button className="mobile-menu" type="button" aria-label="Menüyü aç">
          <Menu aria-hidden="true" size={24} />
        </button>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <p className="eyebrow">
            <span aria-hidden="true" />
            Kişiye özel fizyoterapi yaklaşımı
          </p>

          <h1 id="hero-title">
            Hareketinize güven,
            <br />
            <em>yaşamınıza güç</em> katın.
          </h1>

          <p className="hero__description">
            İhtiyaçlarınızı dinleyen, hareket kapasitenizi destekleyen ve süreci
            sizinle birlikte şekillendiren bilimsel bir yaklaşım.
          </p>

          <div className="hero__actions">
            <a className="primary-button" href="#calisma-alanlari">
              Çalışma Alanlarını İncele
              <ArrowUpRight aria-hidden="true" size={18} />
            </a>
            <a className="text-link" href="#hakkimda">
              Yaklaşımımı Tanıyın
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <dl className="hero__facts" aria-label="Kısa bilgiler">
            <div>
              <dt>01</dt>
              <dd>Kişiye özel değerlendirme</dd>
            </div>
            <div>
              <dt>02</dt>
              <dd>Bilimsel ve güncel yaklaşım</dd>
            </div>
            <div>
              <dt>03</dt>
              <dd>Şeffaf süreç takibi</dd>
            </div>
          </dl>
        </div>

        <div className="hero__visual">
          <div className="hero__image-frame">
            <Image
              src="/hero-physiotherapy-v1.png"
              alt="Fizyoterapist eşliğinde omuz hareketi yapan danışan"
              fill
              priority
              sizes="(max-width: 860px) 100vw, 52vw"
            />
          </div>

          <div className="hero__note">
            <span className="hero__note-icon" aria-hidden="true">✦</span>
            <p>
              <strong>Her hareket bir başlangıçtır.</strong>
              <span>Sizin için doğru olan yerden başlayalım.</span>
            </p>
          </div>

          <div className="hero__location">
            <span>İstanbul</span>
            <strong>Yüz yüze görüşme</strong>
          </div>
        </div>
      </section>

      <section
        className="practice-section"
        id="calisma-alanlari"
        aria-labelledby="practice-title"
      >
        <div className="practice-section__intro">
          <div>
            <p className="section-kicker">Çalışma Alanları</p>
            <h2 id="practice-title">
              Hareketin farklı ihtiyaçlarına
              <em> bütüncül bir bakış.</em>
            </h2>
          </div>
          <p>
            Her süreç dinlemekle başlar. Değerlendirme sonrasında ihtiyaçlara
            uygun, anlaşılır ve takip edilebilir bir yol haritası oluşturulur.
          </p>
        </div>

        <div className="practice-grid">
          {practiceAreas.map(({ number, title, description, icon: Icon }, index) => (
            <article
              className={`practice-card${index === 0 ? " practice-card--featured" : ""}`}
              key={title}
            >
              <div className="practice-card__topline">
                <span>{number}</span>
                <Icon aria-hidden="true" size={26} strokeWidth={1.45} />
              </div>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <a href="#" aria-label={`${title} hakkında bilgi`}>
                Alanı inceleyin
                <ArrowUpRight aria-hidden="true" size={17} />
              </a>
            </article>
          ))}
        </div>

        <p className="practice-section__footnote">
          Buradaki içerikler genel bilgilendirme amaçlıdır; kişisel değerlendirme
          yerine geçmez.
        </p>
      </section>
    </main>
  );
}
