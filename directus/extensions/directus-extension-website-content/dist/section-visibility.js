import definitions from "./section-config.json" with { type: "json" };
export function visibilityScope(collection, pageKey) { return collection === "site_pages" ? pageKey : collection; }
export function validateVisibility(scope, value) {
  if (!Object.hasOwn(definitions, scope) || !value || typeof value !== "object" || Array.isArray(value)) throw new Error("Bölüm görünürlüğü geçersiz.");
  const allowed = new Set(definitions[scope].map(section => section.key));
  for (const [key, flag] of Object.entries(value)) if (!allowed.has(key) || typeof flag !== "boolean") throw new Error("Görünürlük yalnızca tanımlı bölümler için açık/kapalı olabilir.");
  return { ...value };
}
export function sharedVisibility(collection, parent) { return collection === "site_pages" ? parent.content?.section_visibility || {} : parent.section_visibility || {}; }
export async function saveSharedVisibility(database, collection, parentId, visibility) {
  if (collection === "site_pages") await database(collection).where("id", parentId).update({ content: database.raw("jsonb_set(content::jsonb, '{section_visibility}', ?::jsonb, true)", [JSON.stringify(visibility)]) });
  else await database(collection).where("id", parentId).update({ section_visibility: JSON.stringify(visibility) });
}
