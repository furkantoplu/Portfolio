import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Home, { generateMetadata as homeMetadata } from "../../page";
import About, { generateMetadata as aboutMetadata } from "../../hakkimda/page";
import Contact, { generateMetadata as contactMetadata } from "../../iletisim/page";
import Areas, { generateMetadata as areasMetadata } from "../../calisma-alanlari/page";
import Area, { generateMetadata as areaMetadata } from "../../calisma-alanlari/[slug]/page";
import Blog, { generateMetadata as blogMetadata } from "../../blog/page";
import Post, { generateMetadata as postMetadata } from "../../blog/[slug]/page";
import { routes, type Locale, type RouteKey } from "../../lib/i18n";
import { getSiteUrl } from "../../lib/site-url";
import { getBlogPost, getPracticeArea } from "../../lib/directus";

type Props = { params: Promise<{ locale: string; path?: string[] }> };
async function resolve(props: Props) {
  const params = await props.params;
  if (params.locale !== "en" && params.locale !== "de") notFound();
  const locale = params.locale as Locale;
  const parts = params.path || [];
  const pathname = `/${locale}${parts.length ? "/" + parts.join("/") : ""}`;
  for (const [key, values] of Object.entries(routes)) {
    if (pathname === values[locale]) return { locale, key: key as RouteKey, slug: undefined };
    if ((key === "areas" || key === "blog") && parts.length === 2 && pathname.startsWith(values[locale] + "/")) return { locale, key: key as RouteKey, slug: parts[1] };
  }
  notFound();
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, key, slug } = await resolve(props);
  const base = getSiteUrl();
  let metadata: Metadata;
  let languages: Record<string, string> = Object.fromEntries(Object.entries(routes[key]).map(([language, path]) => [language, base + path]));
  if (slug) {
    const item = key === "areas" ? await getPracticeArea(slug) : await getBlogPost(slug);
    if (!item) return { title: locale === "en" ? "Page not found" : "Seite nicht gefunden", robots: { index: false } };
    languages = Object.fromEntries(Object.entries(item.language_slugs || {}).map(([language, translatedSlug]) => [language, base + routes[key][language as Locale] + "/" + encodeURIComponent(translatedSlug)]));
    metadata = await (key === "areas" ? areaMetadata({ params: { slug } }) : postMetadata({ params: { slug } }));
  } else if (key === "about") metadata = await aboutMetadata();
  else if (key === "contact") metadata = await contactMetadata();
  else {
    const titles = { home: { en: "Physiotherapy", de: "Physiotherapie" }, areas: { en: "Practice areas", de: "Behandlungsbereiche" }, blog: { en: "Knowledge corner", de: "Wissensecke" } };
    const descriptions = { en: "Individual physiotherapy assessment, practice areas and clear information about movement with Furkan Toplu in Istanbul.", de: "Individuelle physiotherapeutische Untersuchung, Behandlungsbereiche und verständliche Informationen zu Bewegung mit Furkan Toplu in Istanbul." };
    const editable = await (key === "areas" ? areasMetadata() : key === "blog" ? blogMetadata() : homeMetadata());
    metadata = { title: `${titles[key][locale as "en" | "de"]} | Furkan Toplu`, description: descriptions[locale as "en" | "de"], ...editable };
  }
  return { ...metadata, alternates: { canonical: languages[locale], languages: { ...languages, ...(languages.tr ? { "x-default": languages.tr } : {}) } } };
}

export default async function LocalizedPage(props: Props) {
  const { key, slug } = await resolve(props);
  if (slug) return key === "areas" ? <Area params={{ slug }} /> : <Post params={{ slug }} />;
  if (key === "about") return <About />;
  if (key === "contact") return <Contact />;
  if (key === "areas") return <Areas />;
  if (key === "blog") return <Blog />;
  return <Home />;
}
