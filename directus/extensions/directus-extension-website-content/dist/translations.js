const table = "website_content_translations";
import { practiceSlug } from "./practice-urls.js";
import { sharedVisibility, validateVisibility, visibilityScope, saveSharedVisibility } from "./section-visibility.js";
const pageTextFields = ["hero_kicker","hero_title","hero_accent","hero_suffix","hero_description","hero_image_alt","hero_note_title","hero_note_text","location","location_note","fact_1","fact_2","fact_3","practice_title","practice_accent","practice_intro","practice_note","about_image_alt","about_title","about_accent","about_lead","about_body","value_1","value_2","value_3","approach_title","step_1_title","step_1_text","step_2_title","step_2_text","step_3_title","step_3_text","blog_title","blog_accent","blog_intro","blog_note","contact_title","contact_accent","contact_intro","note_title","note_accent","note_text","archive_title","archive_intro"];
const translatedFields = {
  practice_areas: ["title", "summary", "hero_title", "hero_accent", "lead", "image_alt", "overview_title", "overview_accent", "overview", "assessment_points", "process_steps", "faqs", "seo_title", "seo_description"],
  blog_posts: ["title", "category", "summary", "cover_alt", "cover_caption", "lead", "body_paragraphs", "quote", "tips_title", "tips", "closing_title", "closing_body", "seo_title", "seo_description"],
  site_pages: [...new Set([...pageTextFields, "image_alt", "hero_title", "hero_accent", "hero_description", "story_title", "story_accent", "story_lead", "story_paragraphs", "professional_note", "principles_title", "principles", "intro", "privacy_note", "address_note", "working_days", "working_hours", "flow_title", "flow_steps", "seo_title", "seo_description"])],
};
const arrays = {
  assessment_points: ["text"], process_steps: ["title", "description"], faqs: ["question", "answer"],
  body_paragraphs: ["text"], tips: ["title", "text"], story_paragraphs: ["text"], principles: ["title", "text"], flow_steps: ["title", "text"],
};
export function language(request) {
  const value = request.query.language ?? "tr";
  return ["tr", "en", "de"].includes(value) ? value : null;
}
function pickContent(collection, input) {
  const output = {};
  for (const key of translatedFields[collection]) {
    if (arrays[key]) {
      if (input[key] == null) output[key] = [];
      else {
        if (!Array.isArray(input[key]) || input[key].length > 100) throw new Error("Liste alanı geçersiz.");
        output[key] = input[key].map(row => Object.fromEntries(arrays[key].map(field => {
          if (typeof row?.[field] !== "string" || row[field].length > 20000) throw new Error("Liste metni geçersiz.");
          return [field, row[field].trim()];
        })));
      }
    } else {
      const value = input[key] ?? "";
      if (typeof value !== "string" || value.length > 50000) throw new Error("Metin alanı geçersiz.");
      output[key] = value.trim();
    }
  }
  return output;
}

export async function translateItems(database, collection, items, locale) {
  if (!items.length) return [];
  const rows = await database(table).where("collection", collection).whereIn("parent_id", items.map(item => item.id)).where("status", "published");
  return items.flatMap(item => {
    const versions = rows.filter(row => row.parent_id === item.id);
    const language_slugs = { tr: item.slug, ...Object.fromEntries(versions.filter(row => row.slug).map(row => [row.language, row.slug])) };
    if (locale === "tr") return [{ ...item, language_slugs }];
    const version = versions.find(row => row.language === locale);
    if (!version) return [];
    return [{ ...item, ...pickContent(collection, version.content), slug: version.slug, language_slugs }];
  });
}

export async function translatePage(database, page, locale) {
  if (!page || locale === "tr") return page;
  const version = await database(table).where({ collection: "site_pages", parent_id: page.id, language: locale, status: "published" }).first();
  if (!version) return null;
  const content = pickContent("site_pages", version.content);
  const { seo_title, seo_description, ...translated } = content;
  return { ...page, content: { ...page.content, ...translated }, seo_title, seo_description };
}

export function registerTranslations(router, database, adminAccount) {
  router.get("/translations/:collection/:parentId/:language", async (request, response, next) => {
    try {
      const account = await adminAccount(database, request.accountability?.user);
      if (!account || account.status !== "active") return response.status(401).json({ errors: [{ message: "Oturum gerekli." }] });
      if (!account.is_admin) return response.status(403).json({ errors: [{ message: "Yönetici yetkisi gerekli." }] });
      const { collection, parentId, language: locale } = request.params;
      if (!Object.hasOwn(translatedFields, collection) || !["en", "de"].includes(locale) || !/^\d+$/.test(parentId)) return response.status(400).json({ errors: [{ message: "Geçersiz çeviri isteği." }] });
      const parent = await database(collection).where("id", Number(parentId)).first();
      if (!parent) return response.status(404).json({ errors: [{ message: "İçerik bulunamadı." }] });
      const version = await database(table).where({ collection, parent_id: Number(parentId), language: locale }).first();
      response.set("Cache-Control", "no-store").json({ data: { ...(version ?? { status: "draft", slug: "", content: {} }), section_visibility: sharedVisibility(collection, parent) } });
    } catch (error) { next(error); }
  });
  router.patch("/translations/:collection/:parentId/:language", async (request, response, next) => {
    try {
      const account = await adminAccount(database, request.accountability?.user);
      if (!account || account.status !== "active") return response.status(401).json({ errors: [{ message: "Oturum gerekli." }] });
      if (!account.is_admin) return response.status(403).json({ errors: [{ message: "Yönetici yetkisi gerekli." }] });
      const { collection, parentId, language: locale } = request.params;
      if (!Object.hasOwn(translatedFields, collection) || !["en", "de"].includes(locale) || !/^\d+$/.test(parentId)) return response.status(400).json({ errors: [{ message: "Geçersiz çeviri isteği." }] });
      const parent = await database(collection).where("id", Number(parentId)).first();
      if (!parent) return response.status(404).json({ errors: [{ message: "İçerik bulunamadı." }] });
      let content, slug, visibility;
      const status = request.body?.status;
      try {
        if (!["draft", "published", "hidden"].includes(status)) throw new Error("Yayın durumu geçersiz.");
        if (!request.body.content || typeof request.body.content !== "object" || Array.isArray(request.body.content)) throw new Error("Çeviri içeriği geçersiz.");
        content = pickContent(collection, request.body.content);
        if (request.body.section_visibility !== undefined) visibility = validateVisibility(visibilityScope(collection, parent.page_key), request.body.section_visibility);
        slug = collection === "site_pages" ? null : collection === "practice_areas" ? practiceSlug(content.title) : String(request.body.slug || "").trim();
        if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("URL adı küçük harf, rakam ve tire içermeli.");
        if (slug?.length > 220) throw new Error("URL adı çok uzun.");
        if (status === "published") {
          const required = collection === "site_pages" ? ["hero_title", "hero_accent", parent.page_key === "contact" ? "intro" : "hero_description"] : ["title", "summary"];
          if (required.some(field => !content[field]) || (collection !== "site_pages" && !slug)) throw new Error("Yayın için başlık, açıklama ve URL alanlarını doldurun.");
        }
      } catch (error) { return response.status(400).json({ errors: [{ message: error.message }] }); }
      const record = { collection, parent_id: Number(parentId), language: locale, status, slug: slug || null, content: JSON.stringify(content), updated_at: new Date() };
      const write = async db => {
        const [saved] = await db(table).insert(record).onConflict(["collection", "parent_id", "language"]).merge(["status", "slug", "content", "updated_at"]).returning(["id", "status", "slug", "content"]);
        if (visibility !== undefined) await saveSharedVisibility(db, collection, Number(parentId), visibility);
        return { ...saved, section_visibility: visibility ?? sharedVisibility(collection, parent) };
      };
      const saved = visibility === undefined ? await write(database) : await database.transaction(write);
      response.set("Cache-Control", "no-store").json({ data: saved });
    } catch (error) {
      if (error.code === "23505") return response.status(409).json({ errors: [{ message: "Bu dilde aynı URL adı kullanılıyor." }] });
      next(error);
    }
  });
}
