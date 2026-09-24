import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, BookOpenText, Clock3 } from "lucide-react";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { formatTurkishDate, getBlogPosts } from "../lib/directus";

export const metadata: Metadata = {
  title: "Bilgi Köşesi | Fzt. Furkan Toplu",
  description: "Hareket, günlük yaşam ve fizyoterapi süreci hakkında sade ve genel bilgilendirici yazılar.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featuredPost, ...otherPosts] = posts;

  return (
    <main className="site-shell editorial-page">
      <SiteHeader active="blog" />

      <section className="editorial-hero" aria-labelledby="editorial-title">
        <div className="editorial-hero__heading">
          <p className="section-kicker">Bilgi Köşesi</p>
          <h1 id="editorial-title">Hareketi anlamak için<em> sade ve güvenilir bilgiler.</em></h1>
        </div>
        <div className="editorial-hero__intro">
          <BookOpenText aria-hidden="true" size={30} strokeWidth={1.35} />
          <p>Günlük yaşamda hareket sağlığını destekleyen konuları, karmaşık ifadelerden uzak ve anlaşılır bir dille ele alıyoruz.</p>
        </div>
      </section>

      {featuredPost ? (
        <section className="featured-article" aria-labelledby="featured-title">
          <a className="featured-article__image" href={`/blog/${featuredPost.slug}`}>
            <Image src={featuredPost.cover_path || "/hero-physiotherapy-v1.png"} alt={featuredPost.cover_alt || featuredPost.title} fill priority sizes="(max-width: 860px) 100vw, 50vw" />
          </a>
          <article className="featured-article__content">
            <div className="article-meta">
              <span>{featuredPost.category}</span>
              <span><Clock3 aria-hidden="true" size={15} />{featuredPost.reading_minutes} dk okuma</span>
            </div>
            <p className="featured-article__label">Öne çıkan yazı</p>
            <h2 id="featured-title">{featuredPost.title}</h2>
            <p>{featuredPost.summary}</p>
            <div className="featured-article__footer">
              <time>{formatTurkishDate(featuredPost.published_at)}</time>
              <a href={`/blog/${featuredPost.slug}`}>Yazıyı okuyun <ArrowUpRight aria-hidden="true" size={18} /></a>
            </div>
          </article>
        </section>
      ) : (
        <section className="article-archive" aria-label="Henüz yayınlanmış yazı yok">
          <p className="article-archive__note">Yeni bilgi yazıları hazırlandığında burada yayınlanacak.</p>
        </section>
      )}

      {otherPosts.length > 0 && (
        <section className="article-archive" aria-labelledby="archive-title">
          <div className="article-archive__heading">
            <div><p className="section-kicker">Son Yazılar</p><h2 id="archive-title">Bilgi arşivi</h2></div>
            <p>Yeni içerikler yayınlandıkça bu alan otomatik olarak genişleyecek.</p>
          </div>
          <div className="article-archive__grid">
            {otherPosts.map((post, index) => (
              <article className="archive-card" key={post.slug}>
                <div className="archive-card__topline"><span>{String(index + 2).padStart(2, "0")}</span><span>{post.category}</span></div>
                <div><h3>{post.title}</h3><p>{post.summary}</p></div>
                <div className="archive-card__footer">
                  <span>{formatTurkishDate(post.published_at)} · {post.reading_minutes} dk okuma</span>
                  <a href={`/blog/${post.slug}`}>Okuyun <ArrowUpRight size={16} /></a>
                </div>
              </article>
            ))}
          </div>
          <p className="article-archive__note">Bu içerikler genel bilgilendirme amaçlıdır; tanı, tedavi veya kişisel değerlendirme yerine geçmez.</p>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
