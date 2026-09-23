import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, BookOpenText, Clock3 } from "lucide-react";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "Bilgi Köşesi | Fzt. Furkan Toplu",
  description:
    "Hareket, günlük yaşam ve fizyoterapi süreci hakkında sade ve genel bilgilendirici yazılar.",
};

const posts = [
  {
    category: "Günlük Yaşam",
    title: "Masa başında geçen günlerde hareket molaları neden önemli?",
    summary:
      "Uzun süre aynı pozisyonda kalmak yerine güne küçük ve sürdürülebilir hareket araları eklemek üzerine kısa bir rehber.",
    date: "18 Eylül 2026",
    readTime: "4 dk okuma",
    href: "/blog/masa-basinda-hareket-molalari",
    published: true,
  },
  {
    category: "Hareket Bilgisi",
    title: "Egzersizde düzeni korumayı kolaylaştıran üç küçük adım",
    summary:
      "Yoğun günlerde bile hareket alışkanlığını gerçekçi hedeflerle sürdürmeye yardımcı olabilecek temel öneriler.",
    date: "10 Eylül 2026",
    readTime: "5 dk okuma",
    href: "#",
    published: false,
  },
  {
    category: "Süreç Rehberi",
    title: "İlk fizyoterapi görüşmesinde sizi neler bekler?",
    summary:
      "İlk değerlendirme öncesinde merak edilenleri ve görüşmenin genel akışını sade bir dille ele alıyoruz.",
    date: "2 Eylül 2026",
    readTime: "3 dk okuma",
    href: "#",
    published: false,
  },
];

export default function BlogPage() {
  const [featuredPost, ...otherPosts] = posts;

  return (
    <main className="site-shell editorial-page">
      <SiteHeader active="blog" />

      <section className="editorial-hero" aria-labelledby="editorial-title">
        <div className="editorial-hero__heading">
          <p className="section-kicker">Bilgi Köşesi</p>
          <h1 id="editorial-title">
            Hareketi anlamak için
            <em> sade ve güvenilir bilgiler.</em>
          </h1>
        </div>
        <div className="editorial-hero__intro">
          <BookOpenText aria-hidden="true" size={30} strokeWidth={1.35} />
          <p>
            Günlük yaşamda hareket sağlığını destekleyen konuları, karmaşık
            ifadelerden uzak ve anlaşılır bir dille ele alıyoruz.
          </p>
        </div>
      </section>

      <section className="featured-article" aria-labelledby="featured-title">
        <a className="featured-article__image" href={featuredPost.href}>
          <Image
            src="/hero-physiotherapy-v1.png"
            alt="Fizyoterapist eşliğinde kontrollü hareket yapan danışan"
            fill
            priority
            sizes="(max-width: 860px) 100vw, 50vw"
          />
        </a>
        <article className="featured-article__content">
          <div className="article-meta">
            <span>{featuredPost.category}</span>
            <span><Clock3 aria-hidden="true" size={15} />{featuredPost.readTime}</span>
          </div>
          <p className="featured-article__label">Öne çıkan yazı</p>
          <h2 id="featured-title">{featuredPost.title}</h2>
          <p>{featuredPost.summary}</p>
          <div className="featured-article__footer">
            <time>{featuredPost.date}</time>
            <a href={featuredPost.href}>
              Yazıyı okuyun
              <ArrowUpRight aria-hidden="true" size={18} />
            </a>
          </div>
        </article>
      </section>

      <section className="article-archive" aria-labelledby="archive-title">
        <div className="article-archive__heading">
          <div>
            <p className="section-kicker">Son Yazılar</p>
            <h2 id="archive-title">Bilgi arşivi</h2>
          </div>
          <p>Yeni içerikler yayınlandıkça bu alan otomatik olarak genişleyecek.</p>
        </div>

        <div className="article-archive__grid">
          {otherPosts.map((post, index) => (
            <article className="archive-card" key={post.title}>
              <div className="archive-card__topline">
                <span>0{index + 2}</span>
                <span>{post.category}</span>
              </div>
              <div>
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
              </div>
              <div className="archive-card__footer">
                <span>{post.date} · {post.readTime}</span>
                {post.published ? (
                  <a href={post.href}>Okuyun <ArrowUpRight size={16} /></a>
                ) : (
                  <span className="archive-card__status">Yakında</span>
                )}
              </div>
            </article>
          ))}
        </div>

        <p className="article-archive__note">
          Bu içerikler genel bilgilendirme amaçlıdır; tanı, tedavi veya kişisel
          değerlendirme yerine geçmez.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
