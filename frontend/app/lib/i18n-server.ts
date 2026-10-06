import { headers } from "next/headers";
import { getTranslator, isLocale, localizeHref, type Locale } from "./i18n";

export async function getLocale(): Promise<Locale> {
  const value = (await headers()).get("x-site-language");
  return isLocale(value) ? value : "tr";
}

export async function getPageTools() {
  const locale = await getLocale();
  return { locale, t: getTranslator(locale), href: (path: string) => localizeHref(path, locale) };
}
