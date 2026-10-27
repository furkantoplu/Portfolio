import { headers } from "next/headers";
import { getTranslator, isLocale, localizeHref, type Locale } from "./i18n";
import { getPageVisibility } from './page-visibility-server';

export async function getLocale(): Promise<Locale> {
  const value = (await headers()).get("x-site-language");
  return isLocale(value) ? value : "tr";
}

export async function getPageTools() {
  const [locale, visibility] = await Promise.all([getLocale(), getPageVisibility()]);
  return { locale, visibility, t: getTranslator(locale), href: (path: string) => localizeHref(path, locale) };
}
