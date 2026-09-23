export type PracticeArea = {
  id: number;
  sort: number | null;
  show_on_homepage: boolean;
  title: string;
  slug: string;
  summary: string;
  hero_title: string | null;
  hero_accent: string | null;
  lead: string | null;
  image_path: string | null;
  image_alt: string | null;
  overview_title: string | null;
  overview_accent: string | null;
  overview: string | null;
  assessment_points: Array<{ text: string }> | null;
  process_steps: Array<{ title: string; description: string }> | null;
  faqs: Array<{ question: string; answer: string }> | null;
  seo_title: string | null;
  seo_description: string | null;
};

type DirectusResponse<T> = {
  data: T;
};

const directusUrl = (process.env.DIRECTUS_URL || "http://localhost:8055").replace(/\/$/, "");

async function fetchDirectus<T>(path: string): Promise<T> {
  const response = await fetch(`${directusUrl}/website-content${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Directus içerik isteği başarısız: ${response.status}`);
  }

  const payload = (await response.json()) as DirectusResponse<T>;
  return payload.data;
}

export function getPracticeAreas(options: { homepage?: boolean } = {}) {
  const query = options.homepage ? "?homepage=true" : "";
  return fetchDirectus<PracticeArea[]>(`/practice-areas${query}`);
}

export async function getPracticeArea(slug: string) {
  const response = await fetch(`${directusUrl}/website-content/practice-areas/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Directus içerik isteği başarısız: ${response.status}`);

  const payload = (await response.json()) as DirectusResponse<PracticeArea>;
  return payload.data;
}
