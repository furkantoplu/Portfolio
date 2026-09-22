import type { Metadata } from "next";
import {
  PracticeDetail,
  type PracticeDetailContent,
} from "../../components/practice-detail";

export const metadata: Metadata = {
  title: "Sporcu Rehabilitasyonu | Fzt. Deniz Yılmaz",
  description:
    "Spora dönüş sürecinde hareket kapasitesi, yük yönetimi ve kişisel hedeflere yönelik fizyoterapi yaklaşımı hakkında genel bilgi.",
};

const content: PracticeDetailContent = {
  index: "02",
  title: "Spora dönüşte",
  titleAccent: "planlı ve ölçülü ilerleme.",
  lead:
    "Hareket kapasitesini, sporun gerekliliklerini ve kişisel hedefleri birlikte değerlendirerek spora dönüş sürecini anlaşılır adımlarla planlayan bir yaklaşım.",
  image: "/hero-physiotherapy-v1.png",
  imageAlt: "Fizyoterapist eşliğinde kontrollü hareket çalışması yapan danışan",
  overviewTitle: "Yalnızca bugünkü hareketi değil,",
  overviewAccent: "sporun gerektirdiği yükü de değerlendirmek.",
  overviewDescription:
    "Sporcu rehabilitasyonu; yapılan sporun özellikleri, mevcut hareket kapasitesi, antrenman düzeni ve spora dönüş hedefleri birlikte düşünülerek planlanır. Süreç, kademeli yüklenme ve düzenli yeniden değerlendirme üzerine kurulur.",
  evaluationTopics: [
    "Spor dalına özgü hareket ve yük gereksinimleri",
    "Mevcut kuvvet, hareketlilik ve kontrol kapasitesi",
    "Antrenman düzeni ile günlük yaşamın birlikte planlanması",
    "Hekim yönlendirmesi sonrasında spora dönüş basamakları",
  ],
  processSteps: [
    {
      title: "Hedefi ve sporu tanıma",
      description:
        "Spor geçmişiniz, güncel antrenman düzeniniz ve geri dönmek istediğiniz seviye birlikte ele alınır.",
    },
    {
      title: "Kapasiteyi değerlendirme",
      description:
        "İhtiyaca göre hareket, kuvvet, denge ve kontrol başlıklarında mevcut durum değerlendirilir.",
    },
    {
      title: "Kademeli dönüş planı",
      description:
        "Yüklenme basamakları izlenir, geri bildirimlere göre plan düzenli olarak yeniden şekillendirilir.",
    },
  ],
  questions: [
    {
      question: "Spora dönüş için kesin bir süre verilebilir mi?",
      answer:
        "Süre; değerlendirme bulgularına, sporun gerekliliklerine ve sürecin ilerleyişine göre değişir. İlk görüşmede kişisel durum için genel bir yol haritası konuşulur.",
    },
    {
      question: "Antrenman programımı getirmeli miyim?",
      answer:
        "Mevcut antrenman planı, yarışma takvimi veya hekim yönlendirmesi varsa sürecin bütüncül değerlendirilmesine yardımcı olabilir.",
    },
    {
      question: "Sadece profesyonel sporcularla mı çalışılır?",
      answer:
        "Hayır. Rekreasyonel olarak spor yapan kişilerde de hedefler ve aktivite düzeyi değerlendirilerek kişiye uygun bir süreç planlanabilir.",
    },
  ],
};

export default function SportsRehabilitationPage() {
  return <PracticeDetail content={content} />;
}
