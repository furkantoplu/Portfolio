import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Clock3, Quote } from "lucide-react";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";

export const metadata: Metadata = {
  title: "Masa Başında Hareket Molaları | Fzt. Deniz Yılmaz",
  description:
    "Masa başında geçen günlerde küçük ve sürdürülebilir hareket molaları oluşturmak hakkında genel bilgilendirici yazı.",
};

const movementIdeas = [
  {
    number: "01",
    title: "Kısa bir hatırlatıcı belirleyin",
    text: "Gün içinde belirli aralıklarla ayağa kalkmayı hatırlatan sade bir alarm, hareketi unutmayı azaltabilir.",
  },
  {
    number: "02",
    title: "Küçük başlayın",
    text: "Uzun bir egzersiz yerine birkaç dakikalık yürüyüş veya pozisyon değişikliği, alışkanlığı sürdürülebilir kılabilir.",
  },
  {
    number: "03",
    title: "Günün akışına bağlayın",
    text: "Su almak, telefon görüşmesi yapmak veya öğle arasına çıkmak gibi mevcut rutinler hareket için doğal bir işaret olabilir.",
  },
];

export default function MovementBreaksArticlePage() {
  return (
    <main className="site-shell article-page">
      <SiteHeader active="blog" />

      <article>
        <header className="article-header">
          <a className="detail-back-link" href="/blog">
            <ArrowLeft aria-hidden="true" size={17} />
            Bilgi Köşesi'ne dön
          </a>
          <div className="article-header__meta">
            <span>Günlük Yaşam</span>
            <time>18 Eylül 2026</time>
            <span><Clock3 aria-hidden="true" size={15} />4 dk okuma</span>
          </div>
          <h1>Masa başında geçen günlerde hareket molaları neden önemli?</h1>
          <p>
            Yoğun bir iş gününde hareket için uzun zaman ayırmak her zaman mümkün
            olmayabilir. Küçük ve düzenli molalar ise günlük rutinin doğal bir
            parçası haline gelebilir.
          </p>
        </header>

        <div className="article-cover">
          <Image
            src="/hero-physiotherapy-v1.png"
            alt="Fizyoterapist eşliğinde hareket yapan danışan"
            fill
            priority
            sizes="(max-width: 860px) 100vw, 1200px"
          />
          <div className="article-cover__caption">Hareketi günün içine küçük adımlarla yerleştirmek</div>
        </div>

        <div className="article-layout">
          <aside className="article-toc" aria-label="Yazı içeriği">
            <span>Bu yazıda</span>
            <a href="#neden">Neden hareket molası?</a>
            <a href="#planlama">Nasıl planlanabilir?</a>
            <a href="#hatirlatma">Akılda tutulması gerekenler</a>
          </aside>

          <div className="article-body">
            <section id="neden">
              <p className="article-body__lead">
                İnsan bedeni gün boyunca aynı pozisyonda kalmak için değil,
                farklı hareketler arasında geçiş yapmak için tasarlanmıştır.
              </p>
              <p>
                Masa başında çalışırken zamanın nasıl geçtiğini fark etmeden aynı
                pozisyonda kalabiliriz. Buradaki amaç “kusursuz” bir oturuş bulmak
                değil; pozisyonu zaman zaman değiştirmek ve gün içine hareket için
                küçük fırsatlar yerleştirmektir.
              </p>
              <p>
                Hareket molası uzun bir antrenman anlamına gelmez. Ayağa kalkmak,
                birkaç adım yürümek veya çalışma pozisyonunu değiştirmek bile günün
                tekdüzeliğini kıran bir başlangıç olabilir.
              </p>
            </section>

            <blockquote>
              <Quote aria-hidden="true" size={28} strokeWidth={1.35} />
              <p>En iyi hareket molası, günlük düzenin içinde sürdürülebilen moladır.</p>
            </blockquote>

            <section id="planlama">
              <p className="section-kicker">Uygulanabilir Adımlar</p>
              <h2>Hareket molaları nasıl planlanabilir?</h2>
              <div className="article-steps">
                {movementIdeas.map((idea) => (
                  <div key={idea.number}>
                    <span>{idea.number}</span>
                    <div>
                      <h3>{idea.title}</h3>
                      <p>{idea.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="hatirlatma">
              <p className="section-kicker">Kısa Not</p>
              <h2>Her ihtiyaç birbirinden farklıdır.</h2>
              <p>
                Hareket sırasında belirgin rahatsızlık, günlük yaşamı etkileyen
                kısıtlılık veya devam eden bir yakınma varsa genel öneriler yerine
                kişisel değerlendirme gerekir. Mevcut bir sağlık durumunda hekimin
                veya ilgili sağlık profesyonelinin yönlendirmesi esas alınmalıdır.
              </p>
            </section>

            <div className="article-disclaimer">
              Bu yazı genel bilgilendirme amaçlıdır; tanı, tedavi veya kişisel
              egzersiz önerisi yerine geçmez.
            </div>

            <div className="article-end">
              <a href="/blog">
                <ArrowLeft aria-hidden="true" size={17} />
                Tüm yazılara dön
              </a>
              <a href="/iletisim">
                Görüşme hakkında bilgi alın
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
            </div>
          </div>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
