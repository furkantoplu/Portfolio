import type { Metadata } from "next";
import { PracticeDetail, type PracticeDetailContent } from "../../components/practice-detail";

export const metadata: Metadata = {
  title: "Duruş ve Hareket Analizi | Fzt. Furkan Toplu",
  description:
    "Günlük alışkanlıkların, çalışma düzeninin ve hareket örüntülerinin bütüncül değerlendirilmesi hakkında genel bilgi.",
};

const content: PracticeDetailContent = {
  slug: "durus-ve-hareket-analizi",
  index: "04",
  title: "Duruşu tek bir poz değil,",
  titleAccent: "değişen bir hareket bütünü olarak görmek.",
  lead:
    "Çalışma düzenini, günlük alışkanlıkları ve farklı hareketleri birlikte inceleyerek kişiye uygun, uygulanabilir farkındalık ve hareket önerileri oluşturmayı amaçlayan bir değerlendirme.",
  image: "/hero-physiotherapy-v1.png",
  imageAlt: "Fizyoterapist eşliğinde hareket değerlendirmesi yapan danışan",
  overviewTitle: "İdeal bir pozisyon aramak yerine,",
  overviewAccent: "hareket çeşitliliğini ve günlük bağlamı anlamak.",
  overviewDescription:
    "Duruş ve hareket analizi yalnızca ayakta veya otururken çekilen tek bir görüntüye dayanmaz. Çalışma ortamı, günlük tekrarlar, aktivite düzeyi ve kişinin hareket sırasında verdiği geri bildirimler birlikte ele alınır.",
  evaluationTopics: [
    "Masa başı ve günlük çalışma düzeninin hareket üzerindeki etkisi",
    "Tekrarlanan hareketler ve uzun süre korunan pozisyonlar",
    "Farklı yönlerde hareketlilik ve kontrol kapasitesi",
    "Gün içine eklenebilecek gerçekçi hareket çeşitliliği",
  ],
  processSteps: [
    {
      title: "Günlük düzeni dinleme",
      description:
        "Çalışma koşulları, hareket alışkanlıkları ve zorlanma hissedilen durumlar birlikte konuşulur.",
    },
    {
      title: "Hareketi gözlemleme",
      description:
        "İhtiyaca göre farklı pozisyonlar ve işlevsel hareketler bütüncül biçimde değerlendirilir.",
    },
    {
      title: "Uygulanabilir öneriler",
      description:
        "Günlük yaşamla uyumlu hareket seçenekleri ve takip edilebilir küçük düzenlemeler planlanır.",
    },
  ],
  questions: [
    {
      question: "Tek bir doğru duruş var mı?",
      answer:
        "Duruş sabit bir doğru veya yanlış pozdan ibaret değildir. Hareket çeşitliliği, kişinin ihtiyaçları ve pozisyonda kalma süresi birlikte değerlendirilir.",
    },
    {
      question: "Çalışma masamın fotoğrafını getirebilir miyim?",
      answer:
        "Çalışma ortamını gösteren bir fotoğraf, günlük düzeni anlamaya yardımcı olabilir; ancak kişisel değerlendirmenin yerini tek başına tutmaz.",
    },
    {
      question: "Değerlendirme yalnızca masa başı çalışanlar için mi?",
      answer:
        "Hayır. Günlük yaşamında veya mesleğinde tekrarlayan hareketleri bulunan farklı kişiler için de ihtiyaçlara göre değerlendirme yapılabilir.",
    },
  ],
};

export default function PostureAndMovementAnalysisPage() {
  return <PracticeDetail content={content} />;
}
