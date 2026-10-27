import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "../components/legal-document";
import { getSiteUrl } from "../lib/site-url";
import { requireVisiblePage } from '../lib/page-visibility-server';

export const metadata: Metadata = {
  title: "Gizlilik | Fzt. Furkan Toplu",
  description: "Fzt. Furkan Toplu web sitesinde iletişim bağlantıları, teknik veriler ve çerez kullanımı hakkında bilgi.",
  alternates: { canonical: `${getSiteUrl()}/gizlilik` },
};

const sections = (showKvkk: boolean): LegalSection[] => [
  {
    title: "Bu sitede neler bulunur?",
    content: <p>furkantoplu.com, Fizyoterapist Furkan Toplu’nun çalışma alanlarını ve yazılarını tanıtır. Ziyaretçi hesabı, çevrim içi hasta dosyası veya sağlık bilgisi göndermeye yönelik bir web formu bulunmaz. Görüşme ve genel bilgi talepleri telefon, e-posta veya WhatsApp üzerinden iletilebilir.</p>,
  },
  {
    title: "İletişim kanalları",
    content: <><p>E-posta bağlantısı cihazınızdaki e-posta uygulamasını, WhatsApp bağlantısı ise WhatsApp hizmetini açar. Mesaj göndermeyi seçtiğinizde paylaştığınız bilgiler ilgili iletişim kanalında işlenir; yalnızca bağlantıya bakmanız bize mesaj göndermez.</p><p>İlk mesajınızda sağlık raporu veya ayrıntılı sağlık bilgisi göndermemenizi rica ederiz. Uzaktan iletişimle başlayan hizmet sürecinin ayrıntıları sizinle ayrıca görüşülür.</p></>,
  },
  {
    title: "Teknik veriler ve hizmet sağlayıcılar",
    content: <p>Siteye erişim sırasında IP adresi, istek zamanı ve tarayıcıya ilişkin teknik bilgiler bağlantının kurulması, güvenlik ve hata tespiti için işlenebilir. Site Cloudflare üzerinden sunulur; uygulama ve veritabanı OVHcloud’un Kanada’daki sunucusunda barındırılır. Bu nedenle site trafiğine ait teknik veriler yurt dışındaki altyapı üzerinden geçebilir. E-posta veya WhatsApp ile iletişimi seçerseniz ilgili hizmet sağlayıcının kendi gizlilik koşulları da geçerli olur.</p>,
  },
  {
    title: "Çerezler",
    content: <p>Ziyaretçilere reklam veya davranışsal analiz amacıyla bir çerez yerleştiren araç kurulu değildir. Yönetim paneline giriş yapan yetkili kişiler için oturum çerezi kullanılır. Altyapı ve güvenlik hizmetleri, hizmetin çalışması için gerekli teknik tanımlayıcılar kullanabilir. Zorunlu olmayan bir ölçüm veya reklam aracı eklenirse bu sayfa ve gerekli tercih mekanizması güncellenir.</p>,
  },
  {
    title: "İletişim ve kişisel veriler",
    content: <p>Bu siteyle ilgili gizlilik sorularınızı Fizyoterapist Furkan Toplu’ya <a href="mailto:fzt.furkantoplu@gmail.com">fzt.furkantoplu@gmail.com</a> adresinden veya <a href="tel:+905522903902">+90 552 290 39 02</a> numarasından iletebilirsiniz. Kişisel veri işleme faaliyeti ve haklarınız için ayrıca {showKvkk ? <a href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</a> : <>KVKK Aydınlatma Metni</>}ni okuyabilirsiniz.</p>,
  },
];

export default async function PrivacyPage() {
  const visibility = await requireVisiblePage('privacy');
  return <LegalDocument visibility={visibility} eyebrow="Site Politikası" title="Gizlilik Bilgilendirmesi" intro="Web sitesinde kullanılan iletişim kanalları ve teknik altyapı hakkında bilgi." updated="13 Ekim 2026" sections={sections(visibility.kvkk)} />;
}
