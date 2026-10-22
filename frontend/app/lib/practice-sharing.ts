import type { Metadata } from "next";
import type { PracticeArea } from "./directus";
import type { Locale } from "./i18n";

type ShareArea = Pick<PracticeArea, "title" | "summary" | "lead" | "seo_title" | "seo_description" | "image_path" | "image_alt" | "section_visibility">;

// Only describe public media; do not fetch external resources or expose hidden photos.
export function practiceSharingMetadata(area: ShareArea, siteUrl: string, url: string, locale: Locale): Metadata {
  const title = area.seo_title?.trim() || `${area.title} | Fzt. Furkan Toplu`;
  const description = area.seo_description?.trim() || area.summary?.trim() || area.lead?.trim() || undefined;
  const fallback = new URL("/furkan-toplu-share-v1.jpg", siteUrl);
  let image = fallback;
  const path = area.image_path?.trim();
  if (area.section_visibility?.image !== false && path?.startsWith("/") && !path.startsWith("//")) {
    try {
      const candidate = new URL(path, siteUrl);
      if (candidate.origin === new URL(siteUrl).origin) {
        image = candidate.pathname === "/furkan-toplu-hero-white-coat-v1.png" ? fallback : candidate;
      }
    } catch { /* Keep the existing compact portrait for an invalid CMS image path. */ }
  }
  const compactPortrait = image.href === fallback.href;
  const imageAlt = compactPortrait ? "Furkan Toplu" : area.image_alt?.trim() || area.title;
  return {
    title,
    description,
    openGraph: {
      type: "website",
      siteName: "Furkan Toplu",
      title,
      description,
      url,
      locale: { tr: "tr_TR", en: "en_GB", de: "de_DE" }[locale],
      images: [{ url: image.href, alt: imageAlt, ...(compactPortrait ? { width: 600, height: 600, type: "image/jpeg" } : {}) }],
    },
    twitter: { card: "summary_large_image", title, description, images: [{ url: image.href, alt: imageAlt }] },
  };
}
