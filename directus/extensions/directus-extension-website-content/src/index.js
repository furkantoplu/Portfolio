import { language, translateItems, translatePage, registerTranslations } from "./translations.js";
import { registerMedia } from "./media.js";
import { resolvePracticeUrl } from "./practice-urls.js";

const publicFields = [
  "id",
  "sort",
  "show_on_homepage",
  "title",
  "slug",
  "summary",
  "hero_title",
  "hero_accent",
  "lead",
  "image_path",
  "image_alt",
  "overview_title",
  "overview_accent",
  "overview",
  "assessment_points",
  "process_steps",
  "faqs",
  "seo_title",
  "seo_description",
];

function publishedPracticeAreas(database) {
  return database("practice_areas")
    .select(publicFields)
    .where("status", "published");
}

const publicBlogFields = [
  "id",
  "sort",
  "featured",
  "category",
  "title",
  "slug",
  "summary",
  "published_at",
  "reading_minutes",
  "cover_path",
  "cover_alt",
  "cover_caption",
  "lead",
  "body_paragraphs",
  "quote",
  "tips_title",
  "tips",
  "closing_title",
  "closing_body",
  "seo_title",
  "seo_description",
];

function publishedBlogPosts(database) {
  return database("blog_posts")
    .select(publicBlogFields)
    .where("status", "published");
}

function sitePage(database, pageKey) {
  return database("site_pages").select("id", "page_key", "content", "seo_title", "seo_description").where("page_key", pageKey).first();
}

async function adminAccount(database, userId) {
  if (!userId) return null;

  const account = await database("directus_users as users")
    .leftJoin("directus_roles as roles", "users.role", "roles.id")
    .select(
      "users.id",
      "users.email",
      "users.first_name",
      "users.last_name",
      "users.status",
      "users.role",
      "users.tfa_secret",
      "roles.name as role_name",
    )
    .where("users.id", userId)
    .first();

  if (!account) return null;

  const adminPolicy = await database("directus_access as access")
    .join("directus_policies as policies", "access.policy", "policies.id")
    .where("policies.admin_access", true)
    .andWhere((builder) => builder.where("access.user", userId).orWhere("access.role", account.role))
    .first("access.id");

  const { tfa_secret: tfaSecret, ...safeAccount } = account;
  return { ...safeAccount, tfa_enabled: Boolean(tfaSecret), is_admin: Boolean(adminPolicy) };
}

export default {
  id: "website-content",
  handler: (router, context) => {
    const { database } = context;
    registerMedia(router, context);
    registerTranslations(router, database, adminAccount);
    router.use((request, response, next) => language(request) ? next() : response.status(400).json({ errors: [{ message: "Geçersiz dil." }] }));
    router.get("/admin-account", async (request, response, next) => {
      try {
        const account = await adminAccount(database, request.accountability?.user);
        if (!account) return response.status(401).json({ errors: [{ message: "Oturum gerekli." }] });
        response.json({ data: account });
      } catch (error) {
        next(error);
      }
    });

    router.get("/admin-team", async (request, response, next) => {
      try {
        const account = await adminAccount(database, request.accountability?.user);
        if (!account) return response.status(401).json({ errors: [{ message: "Oturum gerekli." }] });
        if (!account.is_admin) return response.status(403).json({ errors: [{ message: "Yönetici yetkisi gerekli." }] });

        const adminRoles = database("directus_access as access")
          .join("directus_policies as policies", "access.policy", "policies.id")
          .where("policies.admin_access", true)
          .whereNotNull("access.role")
          .select("access.role");

        const members = await database("directus_users as users")
          .leftJoin("directus_roles as roles", "users.role", "roles.id")
          .whereIn("users.role", adminRoles)
          .select("users.id", "users.email", "users.first_name", "users.last_name", "users.status", "users.role", "users.tfa_secret", "roles.name as role_name")
          .orderBy("users.first_name", "asc")
          .orderBy("users.email", "asc");

        response.json({
          data: members.map(({ tfa_secret: tfaSecret, ...member }) => ({
            ...member,
            tfa_enabled: Boolean(tfaSecret),
          })),
        });
      } catch (error) {
        next(error);
      }
    });

    router.get("/practice-areas", async (request, response, next) => {
      try {
        const query = publishedPracticeAreas(database).orderByRaw("sort ASC NULLS LAST").orderBy("id", "asc");

        if (request.query.homepage === "true") {
          query.where("show_on_homepage", true);
        }

        response.json({ data: await translateItems(database, "practice_areas", await query, language(request)) });
      } catch (error) {
        next(error);
      }
    });

    router.get("/practice-areas/:slug", async (request, response, next) => {
      try {
        const items = await translateItems(database, "practice_areas", await publishedPracticeAreas(database), language(request));
        const item = await resolvePracticeUrl(database, items, request.params.slug, language(request));

        if (!item) {
          response.status(404).json({ errors: [{ message: "Çalışma alanı bulunamadı." }] });
          return;
        }

        response.json({ data: item });
      } catch (error) {
        next(error);
      }
    });

    router.get("/blog-posts", async (request, response, next) => {
      try {
        const query = publishedBlogPosts(database)
          .orderBy("featured", "desc")
          .orderByRaw("published_at DESC NULLS LAST")
          .orderByRaw("sort ASC NULLS LAST")
          .orderBy("id", "asc");

        const items = await translateItems(database, "blog_posts", await query, language(request));
        response.json({ data: request.query.homepage === "true" ? items.slice(0, 3) : items });
      } catch (error) {
        next(error);
      }
    });

    router.get("/blog-posts/:slug", async (request, response, next) => {
      try {
        const items = await translateItems(database, "blog_posts", await publishedBlogPosts(database), language(request));
        const item = items.find(row => row.slug === request.params.slug);

        if (!item) {
          response.status(404).json({ errors: [{ message: "Blog yazısı bulunamadı." }] });
          return;
        }

        response.json({ data: item });
      } catch (error) {
        next(error);
      }
    });

    router.get("/pages/:pageKey", async (request, response, next) => {
      try {
        if (!new Set(["home", "about", "contact", "areas", "blog"]).has(request.params.pageKey)) return response.status(404).json({ errors: [{ message: "Sayfa bulunamadı." }] });
        const page = await translatePage(database, await sitePage(database, request.params.pageKey), language(request));
        if (!page) return response.status(404).json({ errors: [{ message: "Sayfa bulunamadı." }] });
        response.json({ data: page });
      } catch (error) {
        next(error);
      }
    });
  },
};
