import type { Metadata } from "next";
import "./globals.css";
import { getLocale } from "./lib/i18n-server";
import { headers } from "next/headers";
import { routes, localeFromPath } from "./lib/i18n";
import { getSiteUrl } from "./lib/site-url";

const defaultMetadata: Metadata = {
  title: "Fzt. Furkan Toplu | Fizyoterapi",
  description:
    "Kişiye özel değerlendirme ve bilimsel yaklaşımla fizyoterapi süreci.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const path = (await headers()).get("x-site-path") || "/";
  const base = getSiteUrl();
  const route = Object.values(routes).find(values => Object.values(values).includes(path as never));
  const locale = localeFromPath(path);
  const languages = route ? Object.fromEntries(Object.entries(route).map(([key, value]) => [key, base + value])) : undefined;
  return { ...defaultMetadata, alternates: languages ? { canonical: languages[locale], languages: { ...languages, "x-default": languages.tr } } : undefined };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
