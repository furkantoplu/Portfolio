export function practiceSlug(title: string) {
  return title.trim().toLowerCase().replaceAll("ı", "i").replaceAll("ß", "ss")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 200).replace(/-$/, "") || "calisma-alani";
}
