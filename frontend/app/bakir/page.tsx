import type { Metadata } from "next";
import { BakirAdmin } from "./admin-client";

export const metadata: Metadata = {
  title: "İçerik Yönetimi | Furkan Toplu",
  description: "Furkan Toplu web sitesi için güvenli içerik yönetim alanı.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function BakirPage() {
  return <BakirAdmin />;
}
