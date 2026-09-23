import type { Metadata } from "next";
import { PracticeDetail, type PracticeDetailContent } from "../../components/practice-detail";

export const metadata: Metadata = {
  title: "Ameliyat Sonrası Süreç | Fzt. Furkan Toplu",
  description:
    "Hekim yönlendirmesi sonrasında hareket kapasitesinin yeniden kazanılmasına yönelik fizyoterapi süreci hakkında genel bilgi.",
};

const content: PracticeDetailContent = {
  slug: "ameliyat-sonrasi-surec",
  index: "03",
  title: "Ameliyat sonrasında",
  titleAccent: "adım adım güvenli ilerleme.",
  lead:
    "Hekim yönlendirmesi, günlük yaşam ihtiyaçları ve mevcut hareket kapasitesi doğrultusunda süreci anlaşılır, ölçülü ve takip edilebilir basamaklara ayıran bir yaklaşım.",
  image: "/about-physiotherapist-v1.png",
  imageAlt: "Klinik ortamında süreci değerlendiren fizyoterapist",
  overviewTitle: "Her aşamayı kendi koşulları içinde,",
  overviewAccent: "bütün sürecin bir parçası olarak ele almak.",
  overviewDescription:
    "Ameliyat sonrası fizyoterapi planı; cerrahi ekibin yönlendirmeleri, operasyonun niteliği, kişinin günlük yaşamı ve değerlendirme bulguları birlikte dikkate alınarak şekillendirilir. Sürecin her basamağı düzenli olarak yeniden değerlendirilir.",
  evaluationTopics: [
    "Hekim ve cerrahi ekip tarafından belirtilen sınırlar",
    "Günlük yaşamda ihtiyaç duyulan temel hareketler",
    "Hareketlilik, kuvvet ve kontrol kapasitesindeki değişim",
    "Ev programının anlaşılır ve sürdürülebilir biçimde planlanması",
  ],
  processSteps: [
    {
      title: "Yönlendirmeyi anlama",
      description:
        "Hekim önerileri, operasyonla ilgili bilgiler ve günlük yaşam ihtiyaçları birlikte değerlendirilir.",
    },
    {
      title: "Mevcut durumu değerlendirme",
      description:
        "Uygun sınırlar içinde hareket kapasitesi ve süreci etkileyen temel gereksinimler ele alınır.",
    },
    {
      title: "Basamaklı ilerleme",
      description:
        "Plan, geri bildirimler ve yeniden değerlendirme sonuçları doğrultusunda kademeli olarak güncellenir.",
    },
  ],
  questions: [
    {
      question: "Fizyoterapiye ne zaman başlanır?",
      answer:
        "Başlangıç zamanı operasyonun türüne ve hekimin yönlendirmesine göre değişir. Kişisel durum için cerrahi ekibin önerisi esas alınır.",
    },
    {
      question: "Hangi belgeleri getirmeliyim?",
      answer:
        "Varsa ameliyat raporu, hekim önerileri ve ilgili tetkikler sürecin sınırlarını anlamaya yardımcı olabilir.",
    },
    {
      question: "Süreç boyunca plan değişir mi?",
      answer:
        "Evet. Hareket kapasitesi ve ihtiyaçlar yeniden değerlendirildikçe plan uygun sınırlar içinde güncellenebilir.",
    },
  ],
};

export default function PostOperativeProcessPage() {
  return <PracticeDetail content={content} />;
}
