export function practiceSlug(title) {
  return title.trim().toLowerCase().replaceAll("ı", "i").replaceAll("ß", "ss")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 200).replace(/-$/, "") || "calisma-alani";
}

export async function resolvePracticeUrl(database, items, slug, locale) {
  const current = items.find(item => item.slug === slug);
  if (current) return current;
  const alias = await database("website_practice_slug_aliases").where({ language: locale, slug }).first("parent_id");
  const target = alias && items.find(item => item.id === alias.parent_id);
  return target ? { ...target, redirect_slug: target.slug } : null;
}
