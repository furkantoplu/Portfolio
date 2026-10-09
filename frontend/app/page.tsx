import type { Metadata } from "next";
import { getPageTools } from "./lib/i18n-server";
import { formatDate } from "./lib/i18n";
import Image from "next/image";
import { isSectionVisible } from "./lib/section-visibility";
import { NativeLink } from "./components/native-link";
import { type ContactContent, phoneHref } from "./lib/contact";
import { getBlogPosts, getPracticeAreas, getHomeContact, getEditablePage } from "./lib/directus";
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

export async function generateMetadata(): Promise<Metadata> { const page = await getEditablePage("home"); return { title: page.seo_title || "Fzt. Furkan Toplu | Fizyoterapist", description: page.seo_description || undefined }; }

export default async function Home() {
  const { locale, t, href: localHref } = await getPageTools();
  const [practiceAreas, blogPosts, contactPage, homePage] = await Promise.all([
    getPracticeAreas({ homepage: true }),
    getBlogPosts({ homepage: true }),
    getHomeContact<ContactContent>(),
    getEditablePage("home"),
  ]);
  const contact = contactPage.content;
  const content = homePage.content;
  const show = (key: string) => isSectionVisible(content.section_visibility, key);
  const contactShow = (key: string) => isSectionVisible(contact.section_visibility, key);
  return (
    <main className="site-shell">
      <SiteHeader locale={locale} active="home" />

      <section className={`hero${show("image") ? "" : " hero--text-only"}`} aria-labelledby="hero-title">
        <div className="hero__content">
          <p className="eyebrow">
            <span aria-hidden="true" />{content.hero_kicker}</p>

          <h1 id="hero-title">{content.hero_title}<br />
            <em>{" "}{content.hero_accent}</em>{" "}{content.hero_suffix}</h1>

          {show("intro") && (<p className="hero__description">{content.hero_description}</p>) }

          <div className="hero__actions">
            <a className="primary-button" href={show("practices") ? "#calisma-alanlari" : localHref("/calisma-alanlari")}>{t("Çalışma Alanlarını İncele")}<ArrowUpRight aria-hidden="true" size={18} />
            </a>
            <NativeLink className="text-link" href={localHref("/hakkimda")}>{t("Yaklaşımımı Tanıyın")}<span aria-hidden="true">→</span>
            </NativeLink>
          </div>

          {show("facts") && (<dl className="hero__facts" aria-label={t("Kısa bilgiler")}>
            <div>
              <dt>01</dt>
              <dd>{content.fact_1}</dd>
            </div>
            <div>
              <dt>02</dt>
              <dd>{content.fact_2}</dd>
            </div>
            <div>
              <dt>03</dt>
              <dd>{content.fact_3}</dd>
            </div>
          </dl>) }
        </div>

        {show("image") && (<div className="hero__visual">
          <div className="hero__character">
            <span className="hero__portrait-orbit hero__portrait-orbit--outer" aria-hidden="true" />
            <span className="hero__portrait-orbit hero__portrait-orbit--inner" aria-hidden="true" />
            <Image
              src={content.hero_image || "/furkan-toplu-hero-white-coat-v1.png"}
              alt={content.hero_image_alt}
              fill
              priority
              sizes="(max-width: 860px) 100vw, 52vw"
              style={{ objectFit: "contain", objectPosition: "center bottom" }}
            />
            <span className="hero__portrait-floor" aria-hidden="true" />
          </div>

          {show("location") && (<div className="hero__location">
            <span>{content.location}</span>
            <strong>{content.location_note}</strong>
          </div>) }
        </div>) }
      </section>

      {show("practices") && (<section
        className="practice-section"
        id="calisma-alanlari"
        aria-labelledby="practice-title"
      >
        <div className="practice-section__intro">
          <div>
            <p className="section-kicker">{t("Çalışma Alanları")}</p>
            <h2 id="practice-title">{content.practice_title}<em>{" "}{content.practice_accent}</em>
            </h2>
          </div>
          <p>{content.practice_intro}</p>
        </div>

        <div className="practice-grid">
          {practiceAreas.length === 0 && <p>{t("Bu dilde çalışma alanları yakında eklenecek.")}</p>}
          {practiceAreas.map(({ title, summary, slug, image_path, image_alt, section_visibility }, index) => {
            const Icon = practiceIcons[index % practiceIcons.length];
            const number = String(index + 1).padStart(2, "0");
            const href = `/calisma-alanlari/${slug}`;
            const hasImage = Boolean(image_path) && isSectionVisible(section_visibility, "image");
            return (
              <article
                className={`practice-card${index === 0 ? " practice-card--featured" : ""}${hasImage ? " practice-card--with-image" : " practice-card--text-only"}`}
                key={title}
              >
                <div className="practice-card__topline">
                  <span>{number}</span>
                  <Icon aria-hidden="true" size={26} strokeWidth={1.45} />
                </div>
                {image_path && isSectionVisible(section_visibility, "image") && <a className="content-card-image practice-card-image" href={localHref(href)}><Image src={image_path} alt={image_alt || title} fill sizes="(max-width: 860px) 100vw, 25vw" style={{ objectFit: "contain", objectPosition: "center" }} /></a>}
                <div className="practice-card__body">
                  <h3>{title}</h3>
                  {isSectionVisible(section_visibility, "summary") && <p>{summary}</p>}
                </div>
                <a className="practice-card__link" href={localHref(href)} aria-label={`${title}: ${t("Detayları incele")}`}>{t("Detayları incele")}<ArrowUpRight aria-hidden="true" size={17} />
                </a>
              </article>
            );
          })}
        </div>

        <p className="practice-section__footnote">{content.practice_note}</p>
      </section>) }

      {show("about") && (<section className={`about-section${show("about_image") ? "" : " about-section--text-only"}`} id="hakkimda" aria-labelledby="about-title">
        {show("about_image") && (<div className="about-section__portrait">
          <div className="about-section__image">
            <Image
              src={content.about_image || "/about-physiotherapist-v1.png"}
              alt={content.about_image_alt}
              fill
              sizes="(max-width: 860px) 100vw, 43vw"
            />
          </div>
          <div className="about-section__caption">
            <span>{t("Fizyoterapist")}</span>
            <strong>{t("Furkan Toplu")}</strong>
          </div>
        </div>) }

        <div className="about-section__content">
          <p className="section-kicker section-kicker--light">{t("Hakkımda")}</p>
          <h2 id="about-title">{content.about_title}<em>{" "}{content.about_accent}</em>
          </h2>
          <p className="about-section__lead">{content.about_lead}</p>
          <p className="about-section__body">{content.about_body}</p>

          {show("values") && (<div className="about-values" aria-label={t("Yaklaşım değerleri")}>
            <div>
              <span>01</span>
              <strong>{content.value_1}</strong>
            </div>
            <div>
              <span>02</span>
              <strong>{content.value_2}</strong>
            </div>
            <div>
              <span>03</span>
              <strong>{content.value_3}</strong>
            </div>
          </div>) }
        </div>

        {show("approach") && (<div className="approach-panel" aria-labelledby="approach-title">
          <div className="approach-panel__heading">
            <p className="section-kicker section-kicker--light">{t("Yaklaşımım")}</p>
            <h3 id="approach-title">{content.approach_title}</h3>
          </div>

          <div className="approach-steps">
            {approachSteps.map(({ number, title, icon: Icon }, index) => (
              <article className="approach-step" key={title}>
                <div className="approach-step__icon">
                  <Icon aria-hidden="true" size={25} strokeWidth={1.5} />
                </div>
                <span>{number}</span>
                <h4>{content[`step_${index + 1}_title`]}</h4>
                <p>{content[`step_${index + 1}_text`]}</p>
              </article>
            ))}
          </div>
        </div>) }
      </section>) }

      {show("blog") && (<section className="blog-section" id="blog" aria-labelledby="blog-title">
        <div className="blog-section__heading">
          <div>
            <p className="section-kicker">{t("Bilgi Köşesi")}</p>
            <h2 id="blog-title">{content.blog_title}<em>{" "}{content.blog_accent}</em>
            </h2>
          </div>
          <div className="blog-section__intro">
            <p>{content.blog_intro}</p>
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
              {post.cover_path && isSectionVisible(post.section_visibility, "image") && <NativeLink className="content-card-image" href={localHref(`/blog/${post.slug}`)}><Image src={post.cover_path} alt={post.cover_alt || post.title} fill sizes="(max-width: 860px) 100vw, 33vw" /></NativeLink>}
              {isSectionVisible(post.section_visibility, "meta") && (<div className="blog-card__meta">
                <span>{post.category}</span>
                <span>{post.reading_minutes}{" "}{t("dk okuma")}</span>
              </div>) }
              <div className="blog-card__content">
                {index === 0 && (
                  <span className="blog-card__icon" aria-hidden="true">
                    <BookOpenText size={28} strokeWidth={1.4} />
                  </span>
                )}
                <h3>{post.title}</h3>
                {isSectionVisible(post.section_visibility, "summary") && <p>{post.summary}</p>}
              </div>
              <div className="blog-card__footer">
                {isSectionVisible(post.section_visibility, "meta") && <time>{formatDate(post.published_at, locale)}</time>}
                <NativeLink href={localHref(`/blog/${post.slug}`)} aria-label={`${post.title}: ${t("Yazıyı okuyun")}`}>{t("Yazıyı okuyun")}<ArrowUpRight aria-hidden="true" size={17} />
                </NativeLink>
              </div>
            </article>
          ))}
        </div>

        <p className="blog-section__note">{content.blog_note}</p>
      </section>) }

      {show("contact") && (<section className="contact-section" id="iletisim" aria-labelledby="contact-title">
        <div className={`contact-section__main${contactShow("phone") || contactShow("whatsapp") || contactShow("email") ? "" : " contact-section__main--text-only"}`}>
          <div className="contact-section__copy">
            <p className="section-kicker">{t("İletişim")}</p>
            <h2 id="contact-title">{content.contact_title}<em>{" "}{content.contact_accent}</em>
            </h2>
            <p>{content.contact_intro}</p>
          </div>

          <div className="contact-section__actions" aria-label={t("İletişim seçenekleri")}>
            {contactShow("phone") && (<a className="contact-action contact-action--primary" href={phoneHref(contact)}>
              <Phone aria-hidden="true" size={22} strokeWidth={1.6} />
              <span>
                <small>{t("Telefon")}</small>
                <strong>{contact.phone_display}</strong>
              </span>
              <ArrowUpRight aria-hidden="true" size={19} />
            </a>) }
            {contactShow("whatsapp") && (<a
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
            </a>) }
            {contactShow("email") && (<a className="contact-action" href={`mailto:${contact.email}`}>
              <Mail aria-hidden="true" size={22} strokeWidth={1.6} />
              <span>
                <small>{t("E-posta")}</small>
                <strong>{contact.email}</strong>
              </span>
              <ArrowUpRight aria-hidden="true" size={19} />
            </a>) }
          </div>
        </div>

        {show("contact_details") && (contactShow("address") || contactShow("hours")) && (<div className={`contact-details${contactShow("address") && contactShow("hours") ? "" : " contact-details--single"}`}>
          {contactShow("address") && (<article>
            <MapPin aria-hidden="true" size={24} strokeWidth={1.5} />
            <div>
              <span>{t("Görüşme adresi")}</span>
              <strong>{contact.address_title}</strong>
              <p>{contact.address_note}</p>
            </div>
          </article>) }
          {contactShow("hours") && (<article>
            <Clock3 aria-hidden="true" size={24} strokeWidth={1.5} />
            <div>
              <span>{t("Çalışma saatleri")}</span>
              <strong>{contact.working_days}</strong>
              <p>{contact.working_hours}</p>
            </div>
          </article>) }
        </div>) }
      </section>) }

      <SiteFooter />
    </main>
  );
}
