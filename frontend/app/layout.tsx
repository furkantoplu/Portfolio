import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
