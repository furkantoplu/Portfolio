import type { Metadata } from "next";
import {
  PracticeDetail,
  type PracticeDetailContent,
} from "../../components/practice-detail";

export const metadata: Metadata = {
  title: "Bel ve Boyun Sağlığı | Fzt. Deniz Yılmaz",
  description:
    "Bel ve boyun hareketlerini etkileyen durumlara yönelik değerlendirme ve fizyoterapi yaklaşımı hakkında genel bilgi.",
};

const content: PracticeDetailContent = {
  slug: "bel-ve-boyun-sagligi",
  index: "01",
  title: "Bel ve boyun sağlığına",
  titleAccent: "hareket odaklı yaklaşım.",
  lead:
    "Günlük yaşamı etkileyen hareket kısıtlılıklarını anlamak, ihtiyaca uygun bir yol haritası oluşturmak ve süreci düzenli olarak izlemek için değerlendirme odaklı bir yaklaşım.",
  image: "/hero-physiotherapy-v1.png",
  imageAlt: "Fizyoterapist eşliğinde kontrollü omuz hareketi yapan danışan",
  overviewTitle: "Süreci yalnızca bir bölgeye değil,",
  overviewAccent: "günlük harekete bakarak anlamak.",
  overviewDescription:
    "Bel ve boyun bölgesindeki hareket ihtiyacı; çalışma düzeni, günlük alışkanlıklar, aktivite seviyesi ve kişinin hedefleriyle birlikte ele alınır. İlk adım, mevcut durumu açık ve anlaşılır şekilde değerlendirmektir.",
  evaluationTopics: [
    "Uzun süre masa başında kalmaya bağlı hareket ihtiyacı",
    "Günlük hareketlerde zorlanma veya kısıtlılık hissi",
    "Hekim yönlendirmesi sonrasında planlanan fizyoterapi süreci",
    "Duruş ve günlük alışkanlıkların hareket üzerindeki etkileri",
  ],
  processSteps: [
    {
      title: "İhtiyacı dinleme",
      description:
        "Günlük yaşamınız, hareket alışkanlıklarınız ve beklentileriniz birlikte ele alınır.",
    },
    {
      title: "Hareket değerlendirmesi",
      description:
        "Hareket kapasitesi ve süreci etkileyebilecek temel noktalar değerlendirilir.",
    },
    {
      title: "Kişisel yol haritası",
      description:
        "Değerlendirme sonucuna göre anlaşılır, takip edilebilir bir çalışma planı oluşturulur.",
    },
  ],
  questions: [
    {
      question: "İlk görüşme ne kadar sürer?",
      answer:
        "İlk görüşme değerlendirme kapsamına göre değişebilir. Randevu oluşturulurken tahmini süre hakkında bilgi verilir.",
    },
    {
      question: "Tetkiklerimi yanımda getirmeli miyim?",
      answer:
        "Varsa hekim değerlendirmeleri ve ilgili tetkikler süreci anlamaya yardımcı olabilir. Size ait belgeleri paylaşmadan önce kapsam hakkında bilgi alabilirsiniz.",
    },
    {
      question: "Egzersiz planı herkeste aynı mı olur?",
      answer:
        "Hayır. Plan; değerlendirme bulguları, günlük yaşam, ihtiyaçlar ve hedefler birlikte ele alınarak kişiye göre şekillendirilir.",
    },
  ],
};

export default function NeckAndBackHealthPage() {
  return <PracticeDetail content={content} />;
}
