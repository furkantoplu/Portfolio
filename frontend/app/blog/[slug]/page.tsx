import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock3, Quote } from "lucide-react";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { formatTurkishDate, getBlogPost } from "../../lib/directus";

type PageProps = { params: { slug: string } | Promise<{ slug: string }> };
async function resolveSlug(params: PageProps["params"]) {
  return (await Promise.resolve(params)).slug;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogPost(await resolveSlug(params));
  if (!post) return { title: "Yazı Bulunamadı | Fzt. Furkan Toplu" };
  return {
    title: post.seo_title || `${post.title} | Fzt. Furkan Toplu`,
    description: post.seo_description || post.summary,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPost(await resolveSlug(params));
  if (!post) notFound();

  const paragraphs = post.body_paragraphs || [];
  const tips = post.tips || [];

  return (
    <main className="site-shell article-page">
      <SiteHeader active="blog" />
      <article>
        <header className="article-header">
          <a className="detail-back-link" href="/blog"><ArrowLeft aria-hidden="true" size={17} />Bilgi Köşesi&apos;ne dön</a>
          <div className="article-header__meta">
            <span>{post.category}</span>
            <time>{formatTurkishDate(post.published_at)}</time>
            <span><Clock3 aria-hidden="true" size={15} />{post.reading_minutes} dk okuma</span>
          </div>
          <h1>{post.title}</h1>
          <p>{post.summary}</p>
        </header>

        <div className="article-cover">
          <Image src={post.cover_path || "/hero-physiotherapy-v1.png"} alt={post.cover_alt || post.title} fill priority sizes="(max-width: 860px) 100vw, 1200px" />
          {post.cover_caption && <div className="article-cover__caption">{post.cover_caption}</div>}
        </div>

        <div className="article-layout">
          <aside className="article-toc" aria-label="Yazı içeriği">
            <span>Bu yazıda</span>
            <a href="#giris">Konuya giriş</a>
            {tips.length > 0 && <a href="#oneriler">Uygulanabilir adımlar</a>}
            {post.closing_body && <a href="#kisa-not">Akılda tutulması gerekenler</a>}
          </aside>

          <div className="article-body">
            <section id="giris">
              {post.lead && <p className="article-body__lead">{post.lead}</p>}
              {paragraphs.map((paragraph, index) => <p key={`${post.id}-paragraph-${index}`}>{paragraph.text}</p>)}
            </section>

            {post.quote && <blockquote><Quote aria-hidden="true" size={28} strokeWidth={1.35} /><p>{post.quote}</p></blockquote>}

            {tips.length > 0 && (
              <section id="oneriler">
                <p className="section-kicker">Uygulanabilir Adımlar</p>
                <h2>{post.tips_title || "Günlük yaşamda nasıl uygulanabilir?"}</h2>
                <div className="article-steps">
                  {tips.map((tip, index) => (
                    <div key={`${post.id}-tip-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{tip.title}</h3><p>{tip.text}</p></div></div>
                  ))}
                </div>
              </section>
            )}

            {post.closing_body && (
              <section id="kisa-not">
                <p className="section-kicker">Kısa Not</p>
                <h2>{post.closing_title || "Her ihtiyaç birbirinden farklıdır."}</h2>
                <p>{post.closing_body}</p>
              </section>
            )}

            <div className="article-disclaimer">Bu yazı genel bilgilendirme amaçlıdır; tanı, tedavi veya kişisel egzersiz önerisi yerine geçmez.</div>
            <div className="article-end">
              <a href="/blog"><ArrowLeft aria-hidden="true" size={17} />Tüm yazılara dön</a>
              <a href="/iletisim">Görüşme hakkında bilgi alın <ArrowUpRight aria-hidden="true" size={18} /></a>
            </div>
          </div>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
