import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "../components/legal-document";
import { getSiteUrl } from "../lib/site-url";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Fzt. Furkan Toplu",
  description: "Fzt. Furkan Toplu web sitesi ziyaretçileri ve iletişim taleplerine ilişkin kişisel veri aydınlatması.",
  alternates: { canonical: `${getSiteUrl()}/kvkk-aydinlatma-metni` },
};

const sections: LegalSection[] = [
  {
    title: "Veri sorumlusu",
    content: <p>Bu web sitesi ve site üzerinden başlatılan iletişim süreçleri bakımından veri sorumlusu Fizyoterapist Furkan Toplu’dur. İletişim: <a href="mailto:toplu.furkan0220@gmail.com">toplu.furkan0220@gmail.com</a> · <a href="tel:+905522903902">+90 552 290 39 02</a>. Ziyaretçilere açık bir fiziksel klinik adresi bulunmaz; iletişim uzaktan yürütülür.</p>,
  },
  {
    title: "Hangi veriler, nasıl elde edilir?",
    content: <><p>Siteyi ziyaret ettiğinizde IP adresi, erişim zamanı ve istek/tarayıcıya ilişkin teknik bilgiler sunucu ve güvenlik sistemlerinde oluşabilir. Telefon, e-posta veya WhatsApp üzerinden siz iletişime geçtiğinizde paylaştığınız ad, iletişim bilgisi, talep ve mesaj içeriği ilgili kanaldan elde edilir.</p><p>Web sitesinde ziyaretçi hesabı veya sağlık verisi toplayan form bulunmaz. İlk iletişimde sağlık raporu ve ayrıntılı sağlık bilgisi göndermeyin. Hizmetin ilerleyen aşamalarında sağlık verisi gerekirse o faaliyete özgü bilgilendirme ve koruma koşulları ayrıca uygulanır.</p></>,
  },
  {
    title: "Amaçlar ve hukuki sebepler",
    content: <ul><li>İletişim ve görüşme taleplerini yanıtlamak, talep ettiğiniz görüşmenin kapsamını ve zamanını belirlemek: talebinizle bağlantılı sözleşme öncesi işlemler için 6698 sayılı Kanun’un 5/2(c) maddesi.</li><li>Genel bilgi taleplerine dönüş yapmak, siteyi güvenli ve erişilebilir tutmak, teknik hataları incelemek: temel hak ve özgürlüklerinize zarar vermemek kaydıyla Kanun’un 5/2(f) maddesindeki meşru menfaat.</li><li>Uygulanabilir bir hukuki yükümlülük doğarsa bunu yerine getirmek: Kanun’un 5/2(ç) maddesi.</li></ul>,
  },
  {
    title: "Kimlere aktarılabilir?",
    content: <p>Site trafiğine ait teknik bilgiler, barındırma ve güvenlik hizmetleri için OVHcloud ve Cloudflare altyapılarında işlenebilir; OVHcloud sunucusu Kanada’dadır. E-posta ile yazmayı seçerseniz mesaj e-posta hizmeti üzerinden, WhatsApp’ı seçerseniz mesaj WhatsApp/Meta hizmeti üzerinden iletilir. Bu hizmetler yurt dışında veri işleyebilir. Yasal bir zorunluluk bulunması halinde veriler yetkili kamu kurumlarıyla paylaşılabilir. Bu sitede reklam amaçlı veri satışı veya ziyaretçi profillemesi yapılmaz.</p>,
  },
  {
    title: "İlgili kişinin hakları ve başvuru",
    content: <><p>6698 sayılı Kanun’un 11. maddesi kapsamındaki haklarınız için Furkan Toplu’ya başvurabilirsiniz. Bilgi almak için <a href="mailto:toplu.furkan0220@gmail.com">toplu.furkan0220@gmail.com</a> adresine yazabilirsiniz. Resmî başvurular, <a href="https://www.kvkk.gov.tr/Icerik/6938/Kurumumuza-Yapilan-Sikayetlerin-Usul-Sartlarina-Iliskin-Kamuoyu-Duyurusu" target="_blank" rel="noopener noreferrer">KVKK’nın açıkladığı usullerle</a> yapılmalıdır; normal e-posta ile başvuru için gönderen adresin daha önce tarafımıza bildirilmiş ve sistemimizde kayıtlı olması gerekir.</p><p>Bu metin yalnızca web sitesi ziyareti ve site aracılığıyla başlatılan ilk iletişim kapsamını açıklar; fizyoterapi hizmetinin kendisine ilişkin ayrı veri işleme süreçlerinin yerine geçmez.</p></>,
  },
];

export default function KvkkNoticePage() {
  return <LegalDocument eyebrow="Yasal Bilgilendirme" title="KVKK Aydınlatma Metni" intro="Web sitesi ziyaretiniz ve site üzerinden başlattığınız iletişim için kişisel verilerin nasıl işlendiği." updated="11 Ekim 2026" sections={sections} />;
}
