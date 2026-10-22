import type { Metadata } from "next";
import type { BlogPost } from "./directus";
import type { Locale } from "./i18n";

type SharePost = Pick<BlogPost, "title" | "summary" | "lead" | "seo_title" | "seo_description" | "cover_path" | "cover_alt" | "section_visibility" | "category">;

// Metadata only: never fetch arbitrary URLs or bypass the public media route.
export function blogSharingMetadata(post: SharePost, siteUrl: string, url: string, locale: Locale): Metadata {
  const title = post.seo_title?.trim() || `${post.title} | Fzt. Furkan Toplu`;
  const description = post.seo_description?.trim() || post.summary?.trim() || post.lead?.trim() || undefined;
  const fallback = new URL("/furkan-toplu-share-v1.jpg", siteUrl);
  let image = fallback;
  const path = post.cover_path?.trim();
  if (post.section_visibility?.image !== false && path?.startsWith("/") && !path.startsWith("//")) {
    try {
      const candidate = new URL(path, siteUrl);
      if (candidate.origin === new URL(siteUrl).origin) {
        image = candidate.pathname === "/furkan-toplu-hero-white-coat-v1.png" ? fallback : candidate;
      }
    } catch { /* Invalid CMS image path: keep the bundled public portrait. */ }
  }
  const compactPortrait = image.href === fallback.href;
  const imageAlt = compactPortrait ? "Furkan Toplu" : post.cover_alt?.trim() || post.title;
  return {
    title,
    description,
    openGraph: {
      type: "article",
      siteName: "Furkan Toplu",
      title,
      description,
      url,
      locale: { tr: "tr_TR", en: "en_GB", de: "de_DE" }[locale],
      section: post.category?.trim() || undefined,
      images: [{ url: image.href, alt: imageAlt, ...(compactPortrait ? { width: 600, height: 600, type: "image/jpeg" } : {}) }],
    },
    twitter: { card: "summary_large_image", title, description, images: [{ url: image.href, alt: imageAlt }] },
  };
}
