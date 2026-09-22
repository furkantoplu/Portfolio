import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "../components/legal-document";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Fzt. Deniz Yılmaz",
  description: "Kişisel verilerin işlenmesine ilişkin taslak aydınlatma metni.",
};

const sections: LegalSection[] = [
  {
    title: "Veri sorumlusunun kimliği",
    content: <p>Veri sorumlusu bilgileri; gerçek hizmet sağlayıcının adı, mesleki adresi ve başvuru iletişim kanalı kesinleştirildikten sonra bu alana eksiksiz olarak eklenecektir.</p>,
  },
  {
    title: "İşlenebilecek kişisel veriler",
    content: <><p>Web sitesinde üyelik veya sağlık bilgisi toplayan bir form bulunmaz. Telefon, e-posta ya da WhatsApp üzerinden iletişim kurulması halinde kişinin kendi isteğiyle paylaştığı kimlik, iletişim ve mesaj içeriği ilgili kanal kapsamında işlenebilir.</p><p>İlk iletişim sırasında ayrıntılı sağlık verisi veya sağlık raporu gönderilmemesi önerilir.</p></>,
  },
  {
    title: "İşleme amaçları",
    content: <ul><li>İletişim talebine yanıt verilmesi</li><li>Görüşme zamanı ve genel kapsam bilgisinin paylaşılması</li><li>Bilgi güvenliği ve hizmet sürekliliğinin sağlanması</li><li>Mevzuattan doğan yükümlülüklerin yerine getirilmesi</li></ul>,
  },
  {
    title: "Aktarım, yöntem ve hukuki sebep",
    content: <p>Aktarım yapılan hizmet sağlayıcıları, veri toplama yöntemleri ve 6698 sayılı Kanun kapsamındaki hukuki sebepler; kullanılacak gerçek telefon, e-posta, barındırma, Cloudflare ve yedekleme hizmetleri kesinleştirildikten sonra veri işleme envanteriyle uyumlu biçimde ayrı ayrı belirtilecektir.</p>,
  },
  {
    title: "İlgili kişinin hakları ve başvuru",
    content: <p>İlgili kişilerin 6698 sayılı Kanunun 11. maddesi kapsamındaki haklarını kullanabileceği başvuru yöntemi, posta adresi ve doğrulanmış e-posta kanalı yayın öncesinde veri sorumlusu bilgileriyle birlikte eklenecektir.</p>,
  },
];

export default function KvkkNoticePage() {
  return <LegalDocument eyebrow="Yasal Bilgilendirme" title="KVKK Aydınlatma Metni" intro="Kişisel verilerin hangi kapsamda ve hangi süreçlerde ele alınabileceğini açıklamak üzere hazırlanan arayüz taslağı." updated="22 Eylül 2026" sections={sections} />;
}
