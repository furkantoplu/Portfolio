import { messages } from "./messages";

export const locales = ["tr", "en", "de"] as const;
export type Locale = typeof locales[number];
export const languageNames: Record<Locale, string> = { tr: "Türkçe", en: "English", de: "Deutsch" };
export const adminLanguageNames: Record<Locale, string> = { tr: "Türkçe", en: "İngilizce", de: "Almanca" };
export const routes = {
  home: { tr: "/", en: "/en", de: "/de" },
  about: { tr: "/hakkimda", en: "/en/about", de: "/de/ueber-mich" },
  areas: { tr: "/calisma-alanlari", en: "/en/practice-areas", de: "/de/behandlungsbereiche" },
  blog: { tr: "/blog", en: "/en/blog", de: "/de/blog" },
  contact: { tr: "/iletisim", en: "/en/contact", de: "/de/kontakt" },
} as const;
export type RouteKey = keyof typeof routes;
export function contentLanguageLinks(key: "areas" | "blog", slugs: Partial<Record<Locale, string>> = {}) {
  return Object.fromEntries(Object.entries(slugs).filter(([language]) => isLocale(language)).map(([language, slug]) => [language, `${routes[key][language as Locale]}/${encodeURIComponent(slug)}`]));
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function localeFromPath(path: string): Locale {
  const prefix = path.split("/")[1];
  return prefix === "en" || prefix === "de" ? prefix : "tr";
}

export function getTranslator(locale: Locale) {
  return (text: string) => locale === "tr" ? text : messages[text]?.[locale] ?? text;
}

export function localizeHref(path: string, locale: Locale): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const hashIndex = path.indexOf("#");
  const hash = hashIndex === -1 ? "" : path.slice(hashIndex);
  const clean = (hashIndex === -1 ? path : path.slice(0, hashIndex)).replace(/\/$/, "") || "/";
  for (const route of Object.values(routes)) {
    for (const source of locales) {
      if (clean === route[source]) return route[locale] + hash;
    }
  }
  for (const key of ["areas", "blog"] as const) {
    for (const source of locales) {
      if (clean.startsWith(routes[key][source] + "/")) return routes[key][locale] + clean.slice(routes[key][source].length) + hash;
    }
  }
  return path;
}

export function formatDate(value: string | null, locale: Locale) {
  if (!value) return getTranslator(locale)("Tarih yakında");
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00+03:00` : value);
  if (Number.isNaN(date.getTime())) return getTranslator(locale)("Tarih yakında");
  return new Intl.DateTimeFormat({ tr: "tr-TR", en: "en-GB", de: "de-DE" }[locale], { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" }).format(date);
}
