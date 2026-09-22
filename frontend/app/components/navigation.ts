export const navItems = [
  { key: "home", label: "Ana Sayfa", href: "/" },
  { key: "about", label: "Hakkımda", href: "/#hakkimda" },
  { key: "areas", label: "Çalışma Alanları", href: "/calisma-alanlari" },
  { key: "blog", label: "Blog", href: "/blog" },
  { key: "contact", label: "İletişim", href: "/#iletisim" },
] as const;

export type NavigationKey = (typeof navItems)[number]["key"];
