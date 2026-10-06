import { getPageTools } from "./lib/i18n-server";
import { formatDate } from "./lib/i18n";
import Image from "next/image";
import { NativeLink } from "./components/native-link";
import { type ContactContent, phoneHref } from "./lib/contact";
import { getBlogPosts, getPracticeAreas, getHomeContact } from "./lib/directus";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import {
  Activity,
  ArrowUpRight,
  BookOpenText,
  Clock3,
  Dumbbell,
  HeartPulse,
  ListChecks,
  Mail,
  MapPin,
  MessageCircleMore,
  PersonStanding,
  Phone,
  Route,
} from "lucide-react";

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

const practiceIcons = [Activity, Dumbbell, HeartPulse, PersonStanding];

export default async function Home() {
  const { locale, t, href: localHref } = await getPageTools();
  const [practiceAreas, blogPosts, contactPage] = await Promise.all([
    getPracticeAreas({ homepage: true }),
    getBlogPosts({ homepage: true }),
    getHomeContact<ContactContent>(),
  ]);
  const contact = contactPage.content;
  return (
    <main className="site-shell">
      <SiteHeader locale={locale} active="home" />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <p className="eyebrow">
            <span aria-hidden="true" />{t("Kişiye özel fizyoterapi yaklaşımı")}</p>

          <h1 id="hero-title">{t("Hareketinize güven,")}<br />
            <em>{" "}{t("yaşamınıza güç")}</em>{" "}{t("katın.")}</h1>

          <p className="hero__description">{t("İhtiyaçlarınızı dinleyen, hareket kapasitenizi destekleyen ve süreci sizinle birlikte şekillendiren bilimsel bir yaklaşım.")}</p>

          <div className="hero__actions">
            <a className="primary-button" href="#calisma-alanlari">{t("Çalışma Alanlarını İncele")}<ArrowUpRight aria-hidden="true" size={18} />
            </a>
            <NativeLink className="text-link" href={localHref("/hakkimda")}>{t("Yaklaşımımı Tanıyın")}<span aria-hidden="true">→</span>
            </NativeLink>
          </div>

          <dl className="hero__facts" aria-label={t("Kısa bilgiler")}>
            <div>
              <dt>01</dt>
              <dd>{t("Kişiye özel değerlendirme")}</dd>
            </div>
            <div>
              <dt>02</dt>
              <dd>{t("Bilimsel ve güncel yaklaşım")}</dd>
            </div>
            <div>
              <dt>03</dt>
              <dd>{t("Şeffaf süreç takibi")}</dd>
            </div>
          </dl>
        </div>

        <div className="hero__visual">
          <div className="hero__character">
            <span className="hero__portrait-orbit hero__portrait-orbit--outer" aria-hidden="true" />
            <span className="hero__portrait-orbit hero__portrait-orbit--inner" aria-hidden="true" />
            <Image
              src="/furkan-toplu-hero-3d-v3.png"
              alt={t("Kollarını bağlayarak gülümseyen Fizyoterapist Furkan Toplu")}
              fill
              priority
              sizes="(max-width: 860px) 100vw, 52vw"
              style={{ objectFit: "contain", objectPosition: "center bottom" }}
            />
            <span className="hero__portrait-floor" aria-hidden="true" />
          </div>

          <div className="hero__note">
            <span className="hero__note-icon" aria-hidden="true">✦</span>
            <p>
              <strong>{t("Her hareket bir başlangıçtır.")}</strong>
              <span>{t("Sizin için doğru olan yerden başlayalım.")}</span>
            </p>
          </div>

          <div className="hero__location">
            <span>{t("İstanbul")}</span>
            <strong>{t("Yüz yüze görüşme")}</strong>
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
            <p className="section-kicker">{t("Çalışma Alanları")}</p>
            <h2 id="practice-title">{t("Hareketin farklı ihtiyaçlarına")}<em>{" "}{t("bütüncül bir bakış.")}</em>
            </h2>
          </div>
          <p>{t("Her süreç dinlemekle başlar. Değerlendirme sonrasında ihtiyaçlara uygun, anlaşılır ve takip edilebilir bir yol haritası oluşturulur.")}</p>
        </div>

        <div className="practice-grid">
          {practiceAreas.length === 0 && <p>{t("Bu dilde çalışma alanları yakında eklenecek.")}</p>}
          {practiceAreas.map(({ title, summary, slug }, index) => {
            const Icon = practiceIcons[index % practiceIcons.length];
            const number = String(index + 1).padStart(2, "0");
            const href = `/calisma-alanlari/${slug}`;
            return (
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
                  <p>{summary}</p>
                </div>
                <a href={localHref(href)} aria-label={`${title}: ${t("Detayları incele")}`}>{t("Detayları incele")}<ArrowUpRight aria-hidden="true" size={17} />
                </a>
              </article>
            );
          })}
        </div>

        <p className="practice-section__footnote">{t("Buradaki içerikler genel bilgilendirme amaçlıdır; kişisel değerlendirme yerine geçmez.")}</p>
      </section>

      <section className="about-section" id="hakkimda" aria-labelledby="about-title">
        <div className="about-section__portrait">
          <div className="about-section__image">
            <Image
              src="/about-physiotherapist-v1.png"
              alt={t("Klinikte duran fizyoterapist portresi")}
              fill
              sizes="(max-width: 860px) 100vw, 43vw"
            />
          </div>
          <div className="about-section__caption">
            <span>{t("Fizyoterapist")}</span>
            <strong>{t("Furkan Toplu")}</strong>
          </div>
        </div>

        <div className="about-section__content">
          <p className="section-kicker section-kicker--light">{t("Hakkımda")}</p>
          <h2 id="about-title">{t("Hareketin her insanda")}<em>{" "}{t("farklı bir hikâyesi var.")}</em>
          </h2>
          <p className="about-section__lead">{t("Her bireyin ihtiyaçlarının, günlük yaşamının ve hedeflerinin farklı olduğuna inanıyorum. Bu nedenle sürece hazır kalıplarla değil, dinleyerek ve değerlendirerek başlıyorum.")}</p>
          <p className="about-section__body">{t("Amacım; karmaşık görünen süreci anlaşılır hale getirmek, hareketle ilgili hedefleri birlikte belirlemek ve her adımda açık bir iletişim kurmak.")}</p>

          <div className="about-values" aria-label={t("Yaklaşım değerleri")}>
            <div>
              <span>01</span>
              <strong>{t("Dinlemek")}</strong>
            </div>
            <div>
              <span>02</span>
              <strong>{t("Anlamak")}</strong>
            </div>
            <div>
              <span>03</span>
              <strong>{t("Birlikte ilerlemek")}</strong>
            </div>
          </div>
        </div>

        <div className="approach-panel" aria-labelledby="approach-title">
          <div className="approach-panel__heading">
            <p className="section-kicker section-kicker--light">{t("Yaklaşımım")}</p>
            <h3 id="approach-title">{t("Sade, anlaşılır ve takip edilebilir bir süreç.")}</h3>
          </div>

          <div className="approach-steps">
            {approachSteps.map(({ number, title, description, icon: Icon }) => (
              <article className="approach-step" key={title}>
                <div className="approach-step__icon">
                  <Icon aria-hidden="true" size={25} strokeWidth={1.5} />
                </div>
                <span>{number}</span>
                <h4>{t(title)}</h4>
                <p>{t(description)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="blog-section" id="blog" aria-labelledby="blog-title">
        <div className="blog-section__heading">
          <div>
            <p className="section-kicker">{t("Bilgi Köşesi")}</p>
            <h2 id="blog-title">{t("Hareketi anlamak için")}<em>{" "}{t("sade ve güvenilir bilgiler.")}</em>
            </h2>
          </div>
          <div className="blog-section__intro">
            <p>{t("Günlük yaşamda hareket sağlığını destekleyen, kolay anlaşılır ve kaynak odaklı içerikler.")}</p>
            <NativeLink href={localHref("/blog")}>{t("Tüm yazıları görün")}<ArrowUpRight aria-hidden="true" size={18} />
            </NativeLink>
          </div>
        </div>

        <div className="blog-grid" id="blog-yazilari">
          {blogPosts.length === 0 && <p>{t("Yeni bilgi yazıları hazırlandığında burada yayınlanacak.")}</p>}
          {blogPosts.map((post, index) => (
            <article
              className={`blog-card${index === 0 ? " blog-card--featured" : ""}`}
              key={post.title}
            >
              <div className="blog-card__meta">
                <span>{post.category}</span>
                <span>{post.reading_minutes}{" "}{t("dk okuma")}</span>
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
                <time>{formatDate(post.published_at, locale)}</time>
                <NativeLink href={localHref(`/blog/${post.slug}`)} aria-label={`${post.title}: ${t("Yazıyı okuyun")}`}>{t("Yazıyı okuyun")}<ArrowUpRight aria-hidden="true" size={17} />
                </NativeLink>
              </div>
            </article>
          ))}
        </div>

        <p className="blog-section__note">{t("Bilgi Köşesi içerikleri genel bilgilendirme amaçlıdır; tanı veya kişisel tedavi önerisi yerine geçmez.")}</p>
      </section>

      <section className="contact-section" id="iletisim" aria-labelledby="contact-title">
        <div className="contact-section__main">
          <div className="contact-section__copy">
            <p className="section-kicker">{t("İletişim")}</p>
            <h2 id="contact-title">{t("İlk adımı birlikte")}<em>{" "}{t("sakin ve net atalım.")}</em>
            </h2>
            <p>{t("Görüşme süreci, uygun saatler veya çalışma alanları hakkında bilgi almak için size uygun iletişim kanalını kullanabilirsiniz.")}</p>
          </div>

          <div className="contact-section__actions" aria-label={t("İletişim seçenekleri")}>
            <a className="contact-action contact-action--primary" href={phoneHref(contact)}>
              <Phone aria-hidden="true" size={22} strokeWidth={1.6} />
              <span>
                <small>{t("Telefon")}</small>
                <strong>{contact.phone_display}</strong>
              </span>
              <ArrowUpRight aria-hidden="true" size={19} />
            </a>
            <a
              className="contact-action"
              href={`https://wa.me/${contact.whatsapp_value}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircleMore aria-hidden="true" size={22} strokeWidth={1.6} />
              <span>
                <small>{t("WhatsApp")}</small>
                <strong>{t("Mesaj gönderin")}</strong>
              </span>
              <ArrowUpRight aria-hidden="true" size={19} />
            </a>
            <a className="contact-action" href={`mailto:${contact.email}`}>
              <Mail aria-hidden="true" size={22} strokeWidth={1.6} />
              <span>
                <small>{t("E-posta")}</small>
                <strong>{contact.email}</strong>
              </span>
              <ArrowUpRight aria-hidden="true" size={19} />
            </a>
          </div>
        </div>

        <div className="contact-details">
          <article>
            <MapPin aria-hidden="true" size={24} strokeWidth={1.5} />
            <div>
              <span>{t("Görüşme adresi")}</span>
              <strong>{contact.address_title}</strong>
              <p>{contact.address_note}</p>
            </div>
          </article>
          <article>
            <Clock3 aria-hidden="true" size={24} strokeWidth={1.5} />
            <div>
              <span>{t("Çalışma saatleri")}</span>
              <strong>{contact.working_days}</strong>
              <p>{contact.working_hours}</p>
            </div>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
