import { cache } from 'react';
import { notFound } from 'next/navigation';
import { pageVisibilityOptions, readPageVisibility, type PublicPageKey } from './page-visibility';

export const getPageVisibility = cache(async () => {
  const base = (process.env.DIRECTUS_URL || 'http://localhost:8055').replace(/\/$/, '');
  try {
    const response = await fetch(`${base}/website-content/page-visibility`, { cache: 'no-store', signal: AbortSignal.timeout(4000) });
    if (!response.ok) throw new Error(`Sayfa görünürlüğü alınamadı: ${response.status}`);
    return readPageVisibility(((await response.json()) as { data: unknown }).data);
  } catch {
    // A CMS outage must not break the 404 renderer or resurrect hidden links.
    return readPageVisibility(Object.fromEntries(pageVisibilityOptions.map(({ key }) => [key, false])));
  }
});
export async function requireVisiblePage(key: PublicPageKey) {
  const visibility = await getPageVisibility();
  if (!visibility[key]) notFound();
  return visibility;
}
