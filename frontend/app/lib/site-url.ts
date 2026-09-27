const defaultSiteUrl = "http://localhost:8080";

export function getSiteUrl() {
  const configuredUrl = process.env.SITE_PUBLIC_URL || defaultSiteUrl;

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return defaultSiteUrl;
  }
}
