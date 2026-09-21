import Image from "next/image";
import {
  Activity,
  ArrowUpRight,
  BookOpenText,
  CalendarDays,
  Clock3,
  Dumbbell,
  HeartPulse,
  ListChecks,
  Mail,
  MapPin,
  Menu,
  MessageCircleMore,
  PersonStanding,
  Phone,
  Route,
} from "lucide-react";

const navItems = [
  { label: "Ana Sayfa", href: "#" },
  { label: "Hakkımda", href: "#hakkimda" },
  { label: "Çalışma Alanları", href: "#calisma-alanlari" },
  { label: "Blog", href: "#blog" },
  { label: "İletişim", href: "#iletisim" },
];

const approachSteps = [
  {
    number: "01",
    title: "Sizi dinleyerek başlarız",
    description:
      "Beklentilerinizi, günlük yaşamınızı ve hareketle ilgili ihtiyaçlarınızı birlikte ele alırız.",
    icon: MessageCircleMore,
  },
  {
    number: "02",
    title: "Yol haritasını netleştiririz",
    description:
      "Değerlendirme sonrasında anlaşılır ve kişiye özel bir süreç planı oluştururuz.",
    icon: ListChecks,
  },
  {
    number: "03",
    title: "Süreci birlikte izleriz",
    description:
      "İlerlemeyi düzenli olarak gözden geçirir, ihtiyaçlara göre planı yeniden şekillendiririz.",
    icon: Route,
  },
];

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

const blogPosts = [
  {
    category: "Günlük Yaşam",
    title: "Masa başında geçen günlerde hareket molaları neden önemli?",
    summary:
      "Uzun süre aynı pozisyonda kalmak yerine güne küçük ve sürdürülebilir hareket araları eklemek üzerine kısa bir rehber.",
    date: "18 Eylül 2026",
    readTime: "4 dk okuma",
  },
  {
    category: "Hareket Bilgisi",
    title: "Egzersizde düzeni korumayı kolaylaştıran üç küçük adım",
    summary:
      "Yoğun günlerde bile hareket alışkanlığını gerçekçi hedeflerle sürdürmeye yardımcı olabilecek temel öneriler.",
    date: "10 Eylül 2026",
    readTime: "5 dk okuma",
  },
  {
    category: "Süreç Rehberi",
    title: "İlk fizyoterapi görüşmesinde sizi neler bekler?",
    summary:
      "İlk değerlendirme öncesinde merak edilenleri ve görüşmenin genel akışını sade bir dille ele alıyoruz.",
    date: "2 Eylül 2026",
    readTime: "3 dk okuma",
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
              href={item.href}
              className={index === 0 ? "is-active" : undefined}
              key={item.label}
            >
              {item.label}
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

      <section className="about-section" id="hakkimda" aria-labelledby="about-title">
        <div className="about-section__portrait">
          <div className="about-section__image">
            <Image
              src="/about-physiotherapist-v1.png"
              alt="Klinikte duran fizyoterapist portresi"
              fill
              sizes="(max-width: 860px) 100vw, 43vw"
            />
          </div>
          <div className="about-section__caption">
            <span>Fizyoterapist</span>
            <strong>Deniz Yılmaz</strong>
          </div>
        </div>

        <div className="about-section__content">
          <p className="section-kicker section-kicker--light">Hakkımda</p>
          <h2 id="about-title">
            Hareketin her insanda
            <em> farklı bir hikâyesi var.</em>
          </h2>
          <p className="about-section__lead">
            Her bireyin ihtiyaçlarının, günlük yaşamının ve hedeflerinin farklı
            olduğuna inanıyorum. Bu nedenle sürece hazır kalıplarla değil,
            dinleyerek ve değerlendirerek başlıyorum.
          </p>
          <p className="about-section__body">
            Amacım; karmaşık görünen süreci anlaşılır hale getirmek, hareketle
            ilgili hedefleri birlikte belirlemek ve her adımda açık bir iletişim
            kurmak.
          </p>

          <div className="about-values" aria-label="Yaklaşım değerleri">
            <div>
              <span>01</span>
              <strong>Dinlemek</strong>
            </div>
            <div>
              <span>02</span>
              <strong>Anlamak</strong>
            </div>
            <div>
              <span>03</span>
              <strong>Birlikte ilerlemek</strong>
            </div>
          </div>
        </div>

        <div className="approach-panel" aria-labelledby="approach-title">
          <div className="approach-panel__heading">
            <p className="section-kicker section-kicker--light">Yaklaşımım</p>
            <h3 id="approach-title">Sade, anlaşılır ve takip edilebilir bir süreç.</h3>
          </div>

          <div className="approach-steps">
            {approachSteps.map(({ number, title, description, icon: Icon }) => (
              <article className="approach-step" key={title}>
                <div className="approach-step__icon">
                  <Icon aria-hidden="true" size={25} strokeWidth={1.5} />
                </div>
                <span>{number}</span>
                <h4>{title}</h4>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="blog-section" id="blog" aria-labelledby="blog-title">
        <div className="blog-section__heading">
          <div>
            <p className="section-kicker">Bilgi Köşesi</p>
            <h2 id="blog-title">
              Hareketi anlamak için
              <em> sade ve güvenilir bilgiler.</em>
            </h2>
          </div>
          <div className="blog-section__intro">
            <p>
              Günlük yaşamda hareket sağlığını destekleyen, kolay anlaşılır ve
              kaynak odaklı içerikler.
            </p>
            <a href="#blog-yazilari">
              Tüm yazıları görün
              <ArrowUpRight aria-hidden="true" size={18} />
            </a>
          </div>
        </div>

        <div className="blog-grid" id="blog-yazilari">
          {blogPosts.map((post, index) => (
            <article
              className={`blog-card${index === 0 ? " blog-card--featured" : ""}`}
              key={post.title}
            >
              <div className="blog-card__meta">
                <span>{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <div className="blog-card__content">
                {index === 0 && (
                  <span className="blog-card__icon" aria-hidden="true">
                    <BookOpenText size={28} strokeWidth={1.4} />
                  </span>
                )}
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
              </div>
              <div className="blog-card__footer">
                <time>{post.date}</time>
                <a href="#" aria-label={`${post.title} yazısını okuyun`}>
                  Yazıyı okuyun
                  <ArrowUpRight aria-hidden="true" size={17} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="blog-section__note">
          Bilgi Köşesi içerikleri genel bilgilendirme amaçlıdır; tanı veya kişisel
          tedavi önerisi yerine geçmez.
        </p>
      </section>

      <section className="contact-section" id="iletisim" aria-labelledby="contact-title">
        <div className="contact-section__main">
          <div className="contact-section__copy">
            <p className="section-kicker">İletişim</p>
            <h2 id="contact-title">
              İlk adımı birlikte
              <em> sakin ve net atalım.</em>
            </h2>
            <p>
              Görüşme süreci, uygun saatler veya çalışma alanları hakkında bilgi
              almak için size uygun iletişim kanalını kullanabilirsiniz.
            </p>
          </div>

          <div className="contact-section__actions" aria-label="İletişim seçenekleri">
            <a className="contact-action contact-action--primary" href="tel:+905551234567">
              <Phone aria-hidden="true" size={22} strokeWidth={1.6} />
              <span>
                <small>Telefon</small>
                <strong>+90 555 123 45 67</strong>
              </span>
              <ArrowUpRight aria-hidden="true" size={19} />
            </a>
            <a
              className="contact-action"
              href="https://wa.me/905551234567"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircleMore aria-hidden="true" size={22} strokeWidth={1.6} />
              <span>
                <small>WhatsApp</small>
                <strong>Mesaj gönderin</strong>
              </span>
              <ArrowUpRight aria-hidden="true" size={19} />
            </a>
            <a className="contact-action" href="mailto:merhaba@denizyilmaz.com">
              <Mail aria-hidden="true" size={22} strokeWidth={1.6} />
              <span>
                <small>E-posta</small>
                <strong>merhaba@denizyilmaz.com</strong>
              </span>
              <ArrowUpRight aria-hidden="true" size={19} />
            </a>
          </div>
        </div>

        <div className="contact-details">
          <article>
            <MapPin aria-hidden="true" size={24} strokeWidth={1.5} />
            <div>
              <span>Görüşme adresi</span>
              <strong>Kadıköy / İstanbul</strong>
              <p>Detaylı adres randevu oluşturulduktan sonra paylaşılır.</p>
            </div>
          </article>
          <article>
            <Clock3 aria-hidden="true" size={24} strokeWidth={1.5} />
            <div>
              <span>Çalışma saatleri</span>
              <strong>Pazartesi — Cumartesi</strong>
              <p>09.00 — 19.00 · Yalnızca randevu ile</p>
            </div>
          </article>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer__top">
          <a className="brand brand--footer" href="#" aria-label="Ana sayfaya dön">
            <BrandMark />
            <span className="brand__copy">
              <strong>Fzt. Deniz Yılmaz</strong>
              <span>Harekete alan açın</span>
            </span>
          </a>

          <nav className="site-footer__nav" aria-label="Alt menü">
            {navItems.slice(1).map((item) => (
              <a href={item.href} key={item.label}>{item.label}</a>
            ))}
          </nav>

          <a className="site-footer__social" href="#" aria-label="Instagram profili">
            <span aria-hidden="true">@</span>
            Instagram
          </a>
        </div>

        <div className="site-footer__bottom">
          <p>© 2026 Fzt. Deniz Yılmaz. Tüm hakları saklıdır.</p>
          <p>Bu web sitesindeki içerikler genel bilgilendirme amaçlıdır.</p>
          <div>
            <a href="#">KVKK Aydınlatma Metni</a>
            <a href="#">Gizlilik</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
