import { routes } from './i18n';

export const pageVisibilityOptions = [
  { key: 'home', label: 'Ana sayfa' },
  { key: 'about', label: 'Hakkımda' },
  { key: 'areas', label: 'Çalışma alanları' },
  { key: 'blog', label: 'Blog' },
  { key: 'contact', label: 'İletişim' },
  { key: 'privacy', label: 'Gizlilik' },
  { key: 'kvkk', label: 'KVKK Aydınlatma Metni' },
] as const;
export type PublicPageKey = typeof pageVisibilityOptions[number]['key'];
export type PageVisibility = Record<PublicPageKey, boolean>;
export function readPageVisibility(value: unknown): PageVisibility {
  const raw = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
  return Object.fromEntries(pageVisibilityOptions.map(({key}) => [key, key === 'home' || raw[key] !== false])) as PageVisibility;
}
export function isPageVisible(value: unknown, key: PublicPageKey): boolean {
  return readPageVisibility(value)[key];
}
export function pageForHref(href: string): PublicPageKey | undefined {
  if (!href.startsWith('/') || href.startsWith('//')) return;
  const path = href.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  if (path === '/gizlilik') return 'privacy';
  if (path === '/kvkk-aydinlatma-metni') return 'kvkk';
  for (const [key, translations] of Object.entries(routes)) {
    for (const route of Object.values(translations)) {
      if (path === route || ((key === 'areas' || key === 'blog') && path.startsWith(route + '/'))) return key as PublicPageKey;
    }
  }
}
