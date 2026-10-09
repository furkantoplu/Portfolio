import { getPageTools } from "../lib/i18n-server";
import { formatDate } from "../lib/i18n";
import type { Metadata } from "next";
import Image from "next/image";
import { isSectionVisible } from "../lib/section-visibility";
import { ArrowUpRight, BookOpenText, Clock3 } from "lucide-react";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { getBlogPosts, getEditablePage } from "../lib/directus";
import { archiveIntroText } from "../lib/public-copy";

export async function generateMetadata(): Promise<Metadata> { const page = await getEditablePage("blog"); return { title: page.seo_title || "Blog sayfası | Fzt. Furkan Toplu", description: page.seo_description || undefined }; }

export default async function BlogPage() {
  const { locale, t, href: localHref } = await getPageTools();
  const posts = await getBlogPosts();
  const { content } = await getEditablePage("blog");
  const archiveIntro=archiveIntroText(content.archive_intro);
  const show = (key: string) => isSectionVisible(content.section_visibility, key);
  const featuredPost = show("featured") ? posts[0] : undefined;
  const otherPosts = featuredPost ? posts.slice(1) : posts;
  const featuredImage = Boolean(featuredPost?.cover_path) && isSectionVisible(featuredPost?.section_visibility, "image");

  return (
    <main className="site-shell editorial-page">
      <SiteHeader locale={locale} active="blog" />

      <section className="editorial-hero" aria-labelledby="editorial-title">
        <div className="editorial-hero__heading">
          <p className="section-kicker">{content.hero_image_alt}</p>
          <h1 id="editorial-title">{content.hero_title}<em>{" "}{content.hero_accent}</em></h1>
        </div>
        {show("intro") && (<div className="editorial-hero__intro">
          <BookOpenText aria-hidden="true" size={30} strokeWidth={1.35} />
          <p>{content.hero_description}</p>
        </div>) }
      </section>
      {content.hero_image && show("image") && <div className="managed-page-image"><Image src={content.hero_image} alt={content.hero_image_alt} fill sizes="100vw" /></div> }

      {featuredPost ? (
        <section className={`featured-article${featuredImage ? "" : " featured-article--text-only"}`} aria-labelledby="featured-title">
          {featuredPost.cover_path && isSectionVisible(featuredPost.section_visibility, "image") && <a className="featured-article__image" href={localHref(`/blog/${featuredPost.slug}`)}>
            <Image src={featuredPost.cover_path} alt={featuredPost.cover_alt || featuredPost.title} fill priority sizes="(max-width: 860px) 100vw, 50vw" />
          </a>}
          <article className="featured-article__content">
            {isSectionVisible(featuredPost.section_visibility, "meta") && <div className="article-meta">
              <span>{featuredPost.category}</span>
              <span><Clock3 aria-hidden="true" size={15} />{featuredPost.reading_minutes}{" "}{t("dk okuma")}</span>
            </div>
            }
            <p className="featured-article__label">{t("Öne çıkan yazı")}</p>
            <h2 id="featured-title">{featuredPost.title}</h2>
            {isSectionVisible(featuredPost.section_visibility, "summary") && <p>{featuredPost.summary}</p>}
            <div className="featured-article__footer">
              {isSectionVisible(featuredPost.section_visibility, "meta") && <time>{formatDate(featuredPost.published_at, locale)}</time>}
              <a href={localHref(`/blog/${featuredPost.slug}`)}>{t("Yazıyı okuyun")}{" "}<ArrowUpRight aria-hidden="true" size={18} /></a>
            </div>
          </article>
        </section>
      ) : posts.length === 0 && show("archive") ? (
        <section className="article-archive" aria-label={t("Henüz yayınlanmış yazı yok")}>
          <p className="article-archive__note">{t("Yeni bilgi yazıları hazırlandığında burada yayınlanacak.")}</p>
        </section>
      ) : null}

      {show("archive") && otherPosts.length > 0 && (
        <section className="article-archive" aria-labelledby="archive-title">
          <div className="article-archive__heading">
            <div><p className="section-kicker">{t("Son Yazılar")}</p><h2 id="archive-title">{content.archive_title}</h2></div>
            {archiveIntro&&<p>{archiveIntro}</p>}
          </div>
          <div className="article-archive__grid">
            {otherPosts.map((post, index) => (
              <article className="archive-card" key={post.slug}>
                {post.cover_path && isSectionVisible(post.section_visibility, "image") && <a className="content-card-image" href={localHref(`/blog/${post.slug}`)}><Image src={post.cover_path} alt={post.cover_alt || post.title} fill sizes="(max-width: 860px) 100vw, 33vw" /></a>}
                <div className="archive-card__topline"><span>{String(index + (featuredPost ? 2 : 1)).padStart(2, "0")}</span>{isSectionVisible(post.section_visibility, "meta") && <span>{post.category}</span>}</div>
                <div><h3>{post.title}</h3>{isSectionVisible(post.section_visibility, "summary") && <p>{post.summary}</p>}</div>
                <div className="archive-card__footer">
                  {isSectionVisible(post.section_visibility, "meta") && <span>{formatDate(post.published_at, locale)} · {post.reading_minutes}{" "}{t("dk okuma")}</span>}
                  <a href={localHref(`/blog/${post.slug}`)}>{t("Okuyun")}{" "}<ArrowUpRight size={16} /></a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
