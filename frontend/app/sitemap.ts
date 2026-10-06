import type { MetadataRoute } from "next";
import { getBlogPosts, getPracticeAreas, getSitePage } from "./lib/directus";
import { locales, routes, contentLanguageLinks, type Locale, type RouteKey } from "./lib/i18n";
import { getSiteUrl } from "./lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [];
  const availability: Record<string, Partial<Record<Locale, string>>> = {};
  for (const [key, paths] of Object.entries(routes)) availability[key] = { ...paths };
  const results = await Promise.all(locales.map(async locale => {
    const [areas, posts, ...pages] = await Promise.allSettled([
      getPracticeAreas({ locale }), getBlogPosts({ locale }), ...(["home", "about", "contact", "areas", "blog"] as const).map(key => getSitePage(key, locale)),
    ]);
    (["home", "about", "contact", "areas", "blog"] as const).forEach((key, index) => { if (pages[index].status === "rejected") delete availability[key][locale]; });
    return { locale, areas: areas.status === "fulfilled" ? areas.value : [], posts: posts.status === "fulfilled" ? posts.value : [] };
  }));
  for (const key of Object.keys(routes) as RouteKey[]) {
    const languages = Object.fromEntries(Object.entries(availability[key]).map(([locale, path]) => [locale, base + path]));
    for (const path of Object.values(availability[key])) entries.push({ url: base + path, changeFrequency: key === "home" || key === "blog" || key === "areas" ? "weekly" : "monthly", priority: key === "home" ? 1 : 0.8, alternates: { languages } });
  }
  for (const { locale, areas, posts } of results) {
    for (const [key, records] of [["areas", areas], ["blog", posts]] as const) {
      for (const item of records) {
        const languages = Object.fromEntries(Object.entries(contentLanguageLinks(key, item.language_slugs)).map(([language, path]) => [language, base + path]));
        entries.push({ url: `${base}${routes[key][locale]}/${encodeURIComponent(item.slug)}`, changeFrequency: "monthly", priority: 0.7, alternates: { languages } });
      }
    }
  }
  for (const path of ["/gizlilik", "/kvkk-aydinlatma-metni"]) entries.push({ url: base + path, changeFrequency: "yearly", priority: 0.2 });
  return entries;
}
