import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "../components/legal-document";

export const metadata: Metadata = {
  title: "Gizlilik | Fzt. Furkan Toplu",
  description: "Web sitesinin gizlilik ve teknik veri kullanımı hakkında taslak bilgilendirme.",
};

const sections: LegalSection[] = [
  {
    title: "Site kapsamı",
    content: <p>Bu web sitesi fizyoterapi çalışma alanları ve genel bilgilendirici içerikler sunar. Ziyaretçiler için üyelik, kullanıcı profili veya çevrim içi hasta dosyası özelliği bulunmaz.</p>,
  },
  {
    title: "İletişim bağlantıları",
    content: <p>Telefon, e-posta ve WhatsApp bağlantıları harici iletişim kanallarını açar. Bu kanallarda paylaşılan bilgiler ilgili hizmetin kendi koşulları ve gerçek veri sorumlusunun süreçleri kapsamında değerlendirilir.</p>,
  },
  {
    title: "Teknik kayıtlar ve güvenlik",
    content: <p>Site yayına alındığında güvenlik, hata tespiti ve hizmet sürekliliği amacıyla IP adresi, istek zamanı ve teknik tarayıcı bilgileri gibi sınırlı sunucu kayıtları oluşabilir. Saklama süresi ve hizmet sağlayıcılar production altyapısı kesinleştiğinde açıkça belirtilecektir.</p>,
  },
  {
    title: "Çerezler ve ölçüm araçları",
    content: <p>Mevcut arayüz taslağında reklam veya davranışsal takip amacıyla kurulmuş bir ölçüm aracı bulunmaz. İleride zorunlu olmayan çerez veya analiz aracı eklenirse tercih ve bilgilendirme mekanizması ayrıca tasarlanacaktır.</p>,
  },
  {
    title: "Güncelleme ve iletişim",
    content: <p>Bu metin kullanılan altyapı ve hizmetler değiştikçe güncellenebilir. Yayın öncesinde gerçek alan adı, veri sorumlusu, barındırma sağlayıcısı ve iletişim bilgileriyle son kontrol yapılacaktır.</p>,
  },
];

export default function PrivacyPage() {
  return <LegalDocument eyebrow="Site Politikası" title="Gizlilik Bilgilendirmesi" intro="Sitenin iletişim bağlantıları, teknik kayıtları ve gelecekte kullanılabilecek çerezler hakkında sade bir arayüz taslağı." updated="22 Eylül 2026" sections={sections} />;
}
