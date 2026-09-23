import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PracticeDetail,
  type PracticeDetailContent,
} from "../../components/practice-detail";
import { getPracticeArea, getPracticeAreas } from "../../lib/directus";

type PageProps = {
  params: { slug: string } | Promise<{ slug: string }>;
};

async function resolveSlug(params: PageProps["params"]) {
  return (await Promise.resolve(params)).slug;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const area = await getPracticeArea(await resolveSlug(params));

  if (!area) {
    return { title: "Çalışma Alanı Bulunamadı | Fzt. Furkan Toplu" };
  }

  return {
    title: area.seo_title || `${area.title} | Fzt. Furkan Toplu`,
    description: area.seo_description || area.summary,
  };
}

export default async function PracticeAreaDetailPage({ params }: PageProps) {
  const slug = await resolveSlug(params);
  const [area, allAreas] = await Promise.all([
    getPracticeArea(slug),
    getPracticeAreas(),
  ]);

  if (!area) notFound();

  const index = allAreas.findIndex((item) => item.slug === area.slug);
  const content: PracticeDetailContent = {
    slug: area.slug,
    index: String(index + 1).padStart(2, "0"),
    title: area.hero_title || area.title,
    titleAccent: area.hero_accent || "kişiye özel değerlendirme.",
    lead: area.lead || area.summary,
    image: area.image_path || "/hero-physiotherapy-v1.png",
    imageAlt: area.image_alt || `${area.title} çalışma alanı görseli`,
    overviewTitle: area.overview_title || "İhtiyacı bütüncül biçimde,",
    overviewAccent: area.overview_accent || "kişisel bağlamıyla değerlendirmek.",
    overviewDescription: area.overview || area.summary,
    evaluationTopics: (area.assessment_points || []).map((item) => item.text),
    processSteps: area.process_steps || [],
    questions: area.faqs || [],
  };
  const relatedAreas = allAreas
    .filter((item) => item.slug !== area.slug)
    .slice(0, 3)
    .map((item) => ({
      slug: item.slug,
      number: String(allAreas.findIndex((candidate) => candidate.slug === item.slug) + 1).padStart(2, "0"),
      title: item.title,
      href: `/calisma-alanlari/${item.slug}`,
    }));

  return <PracticeDetail content={content} relatedAreas={relatedAreas} />;
}
