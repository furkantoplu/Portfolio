import type { MetadataRoute } from "next";
import { getBlogPosts, getPracticeAreas } from "./lib/directus";
import { getSiteUrl } from "./lib/site-url";

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/hakkimda", changeFrequency: "monthly", priority: 0.8 },
  { path: "/calisma-alanlari", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/iletisim", changeFrequency: "monthly", priority: 0.8 },
  { path: "/kvkk-aydinlatma-metni", changeFrequency: "yearly", priority: 0.2 },
  { path: "/gizlilik", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [practiceAreasResult, blogPostsResult] = await Promise.allSettled([
    getPracticeAreas(),
    getBlogPosts(),
  ]);

  const practiceAreas = practiceAreasResult.status === "fulfilled" ? practiceAreasResult.value : [];
  const blogPosts = blogPostsResult.status === "fulfilled" ? blogPostsResult.value : [];

  return [
    ...staticRoutes.map(({ path, ...metadata }) => ({
      url: `${siteUrl}${path}`,
      ...metadata,
    })),
    ...practiceAreas.map((area) => ({
      url: `${siteUrl}/calisma-alanlari/${encodeURIComponent(area.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${encodeURIComponent(post.slug)}`,
      lastModified: post.published_at ? new Date(post.published_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
