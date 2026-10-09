import { getPageTools } from "../../lib/i18n-server";
import { getSiteUrl } from "../../lib/site-url";
import { contentLanguageLinks, formatDate } from "../../lib/i18n";
import type { Metadata } from "next";
import Image from "next/image";
import { isSectionVisible } from "../../lib/section-visibility";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock3, Quote } from "lucide-react";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { getBlogPost } from "../../lib/directus";

type PageProps = { params: { slug: string } | Promise<{ slug: string }> };
async function resolveSlug(params: PageProps["params"]) {
  return (await Promise.resolve(params)).slug;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await getPageTools();
  const post = await getBlogPost(await resolveSlug(params));
  if (!post) return { title: "Yazı Bulunamadı | Fzt. Furkan Toplu" };
  return {
    title: post.seo_title || `${post.title} | Fzt. Furkan Toplu`,
    description: post.seo_description || post.summary,
    alternates: { canonical: `${getSiteUrl()}${contentLanguageLinks("blog", post.language_slugs)[locale]}`, languages: Object.fromEntries(Object.entries(contentLanguageLinks("blog", post.language_slugs)).map(([language, path]) => [language, `${getSiteUrl()}${path}`])) },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, t, href: localHref } = await getPageTools();
  const post = await getBlogPost(await resolveSlug(params));
  if (!post) notFound();

  const paragraphs = post.body_paragraphs || [];
  const tips = post.tips || [];
  const show = (key: string) => isSectionVisible(post.section_visibility, key);
  const hasIntro = Boolean(show("lead") && post.lead || show("body") && paragraphs.length);
  const hasTips = show("tips") && tips.length > 0;
  const hasClosing = show("closing") && Boolean(post.closing_body);
  const hasToc = show("toc") && (hasIntro || hasTips || hasClosing);

  return (
    <main className="site-shell article-page">
      <SiteHeader locale={locale} active="blog" languageLinks={contentLanguageLinks("blog", post.language_slugs)} />
      <article>
        <header className="article-header">
          <a className="detail-back-link" href={localHref("/blog")}><ArrowLeft aria-hidden="true" size={17} />{t("Bilgi Köşesi'ne dön")}</a>
          {show("meta") && (<div className="article-header__meta">
            <span>{post.category}</span>
            <time>{formatDate(post.published_at, locale)}</time>
            <span><Clock3 aria-hidden="true" size={15} />{post.reading_minutes}{" "}{t("dk okuma")}</span>
          </div>) }
          <h1>{post.title}</h1>
          {show("summary") && (<p>{post.summary}</p>) }
        </header>

        {post.cover_path && show("image") && <div className="article-cover">
          <Image src={post.cover_path} alt={post.cover_alt || post.title} fill priority sizes="(max-width: 860px) 100vw, 1200px" />
          {post.cover_caption && <div className="article-cover__caption">{post.cover_caption}</div>}
        </div>}

        <div className={`article-layout${hasToc ? "" : " article-layout--no-toc"}`}>
          {hasToc && (<aside className="article-toc" aria-label={t("Yazı içeriği")}>
            <span>{t("Bu yazıda")}</span>
            {hasIntro && <a href="#giris">{t("Konuya giriş")}</a>}
            {hasTips && <a href="#oneriler">{t("Uygulanabilir adımlar")}</a>}
            {hasClosing && <a href="#kisa-not">{t("Akılda tutulması gerekenler")}</a>}
          </aside>) }

          <div className="article-body">
            {hasIntro && (<section id="giris">
              {show("lead") && post.lead && <p className="article-body__lead">{post.lead}</p>}
              {show("body") && paragraphs.map((paragraph, index) => <p key={`${post.id}-paragraph-${index}`}>{paragraph.text}</p>)}
            </section>) }

            {show("quote") && post.quote && <blockquote><Quote aria-hidden="true" size={28} strokeWidth={1.35} /><p>{post.quote}</p></blockquote>}

            {hasTips && (
              <section id="oneriler">
                <p className="section-kicker">{t("Uygulanabilir Adımlar")}</p>
                <h2>{post.tips_title || t("Günlük yaşamda nasıl uygulanabilir?")}</h2>
                <div className="article-steps">
                  {tips.map((tip, index) => (
                    <div key={`${post.id}-tip-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{tip.title}</h3><p>{tip.text}</p></div></div>
                  ))}
                </div>
              </section>
            )}

            {hasClosing && (
              <section id="kisa-not">
                <p className="section-kicker">{t("Kısa Not")}</p>
                <h2>{post.closing_title || t("Her ihtiyaç birbirinden farklıdır.")}</h2>
                <p>{post.closing_body}</p>
              </section>
            )}

            {show("cta") && (<div className="article-end">
              <a href={localHref("/blog")}><ArrowLeft aria-hidden="true" size={17} />{t("Tüm yazılara dön")}</a>
              <a href={localHref("/iletisim")}>{t("Görüşme hakkında bilgi alın")}{" "}<ArrowUpRight aria-hidden="true" size={18} /></a>
            </div>) }
          </div>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
