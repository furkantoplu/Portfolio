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

export type BlogPost = {
  id: number;
  sort: number | null;
  featured: boolean;
  category: string;
  title: string;
  slug: string;
  summary: string;
  published_at: string | null;
  reading_minutes: number;
  cover_path: string | null;
  cover_alt: string | null;
  cover_caption: string | null;
  lead: string | null;
  body_paragraphs: Array<{ text: string }> | null;
  quote: string | null;
  tips_title: string | null;
  tips: Array<{ title: string; text: string }> | null;
  closing_title: string | null;
  closing_body: string | null;
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

export function getBlogPosts(options: { homepage?: boolean } = {}) {
  const query = options.homepage ? "?homepage=true" : "";
  return fetchDirectus<BlogPost[]>(`/blog-posts${query}`);
}

export async function getBlogPost(slug: string) {
  const response = await fetch(`${directusUrl}/website-content/blog-posts/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Directus içerik isteği başarısız: ${response.status}`);

  const payload = (await response.json()) as DirectusResponse<BlogPost>;
  return payload.data;
}

export function formatTurkishDate(value: string | null) {
  if (!value) return "Tarih yakında";

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00+03:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return "Tarih yakında";

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(date);
}
