import { getLocale } from "./i18n-server";
import type { Locale } from "./i18n";
import { notFound } from "next/navigation";
import pageConfig from "./page-content-config.json";
import { getTranslator } from "./i18n";
import type { SectionVisibility } from "./section-visibility";
export type SitePageKey = "home" | "about" | "contact" | "areas" | "blog";

export type PracticeArea = {
  section_visibility?: SectionVisibility;
  redirect_slug?: string;
  language_slugs?: Partial<Record<Locale, string>>;
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
  section_visibility?: SectionVisibility;
  language_slugs?: Partial<Record<Locale, string>>;
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

export type SitePage<T> = {
  page_key: SitePageKey;
  content: T;
  seo_title: string | null;
  seo_description: string | null;
};

type DirectusResponse<T> = {
  data: T;
};

const directusUrl = (process.env.DIRECTUS_URL || "http://localhost:8055").replace(/\/$/, "");

async function fetchDirectus<T>(path: string, language?: Locale): Promise<T> {
  const locale = language ?? await getLocale();
  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(`${directusUrl}/website-content${path}${separator}language=${locale}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404 && path.startsWith("/pages/")) notFound();
    throw new Error(`Directus içerik isteği başarısız: ${response.status}`);
  }

  const payload = (await response.json()) as DirectusResponse<T>;
  return payload.data;
}

export function getPracticeAreas(options: { homepage?: boolean; locale?: Locale } = {}) {
  const query = options.homepage ? "?homepage=true" : "";
  return fetchDirectus<PracticeArea[]>(`/practice-areas${query}`, options.locale);
}

export async function getPracticeArea(slug: string) {
  const response = await fetch(`${directusUrl}/website-content/practice-areas/${encodeURIComponent(slug)}?language=${await getLocale()}`, {
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Directus içerik isteği başarısız: ${response.status}`);

  const payload = (await response.json()) as DirectusResponse<PracticeArea>;
  return payload.data;
}

export function getBlogPosts(options: { homepage?: boolean; locale?: Locale } = {}) {
  const query = options.homepage ? "?homepage=true" : "";
  return fetchDirectus<BlogPost[]>(`/blog-posts${query}`, options.locale);
}

export function getSitePage<T>(pageKey: SitePageKey, locale?: Locale) {
  return fetchDirectus<SitePage<T>>(`/pages/${pageKey}`, locale);
}

export async function getEditablePage(pageKey: keyof typeof pageConfig) {
  const locale = await getLocale();
  const t = getTranslator(locale);
  const page = await getSitePage<Record<string, string> & { section_visibility?: SectionVisibility }>(pageKey, locale);
  const defaults = Object.fromEntries(pageConfig[pageKey].fields.map(field => [field.key, "type" in field ? field.default : t(field.default)]));
  return { ...page, content: { ...defaults, ...page.content } };
}

export async function getHomeContact<T>() {
  const locale = await getLocale();
  try { return await getSitePage<T>("contact", locale); }
  catch (error) {
    if (locale === "tr") throw error;
    const shared = await getSitePage<Record<string, unknown>>("contact", "tr");
    return { ...shared, content: { ...shared.content, address_note: "", working_days: "", working_hours: "" } as T };
  }
}

export async function getBlogPost(slug: string) {
  const response = await fetch(`${directusUrl}/website-content/blog-posts/${encodeURIComponent(slug)}?language=${await getLocale()}`, {
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
