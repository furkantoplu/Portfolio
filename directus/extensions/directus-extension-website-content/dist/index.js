const publicFields = ["id", "sort", "show_on_homepage", "title", "slug", "summary", "hero_title", "hero_accent", "lead", "image_path", "image_alt", "overview_title", "overview_accent", "overview", "assessment_points", "process_steps", "faqs", "seo_title", "seo_description"];
const publishedPracticeAreas = (database) => database("practice_areas").select(publicFields).where("status", "published");
const publicBlogFields = ["id", "sort", "featured", "category", "title", "slug", "summary", "published_at", "reading_minutes", "cover_path", "cover_alt", "cover_caption", "lead", "body_paragraphs", "quote", "tips_title", "tips", "closing_title", "closing_body", "seo_title", "seo_description"];
const publishedBlogPosts = (database) => database("blog_posts").select(publicBlogFields).where("status", "published");
const adminAccount = async (database, userId) => {
  if (!userId) return null;
  const account = await database("directus_users as users").leftJoin("directus_roles as roles", "users.role", "roles.id").select("users.id", "users.email", "users.first_name", "users.last_name", "users.status", "users.role", "users.tfa_secret", "roles.name as role_name").where("users.id", userId).first();
  if (!account) return null;
  const adminPolicy = await database("directus_access as access").join("directus_policies as policies", "access.policy", "policies.id").where("policies.admin_access", true).andWhere((builder) => builder.where("access.user", userId).orWhere("access.role", account.role)).first("access.id");
  const { tfa_secret: tfaSecret, ...safeAccount } = account;
  return { ...safeAccount, tfa_enabled: Boolean(tfaSecret), is_admin: Boolean(adminPolicy) };
};

export default {
  id: "website-content",
  handler: (router, { database }) => {
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
        const adminRoles = database("directus_access as access").join("directus_policies as policies", "access.policy", "policies.id").where("policies.admin_access", true).whereNotNull("access.role").select("access.role");
        const members = await database("directus_users as users").leftJoin("directus_roles as roles", "users.role", "roles.id").whereIn("users.role", adminRoles).select("users.id", "users.email", "users.first_name", "users.last_name", "users.status", "users.role", "users.tfa_secret", "roles.name as role_name").orderBy("users.first_name", "asc").orderBy("users.email", "asc");
        response.json({ data: members.map(({ tfa_secret: tfaSecret, ...member }) => ({ ...member, tfa_enabled: Boolean(tfaSecret) })) });
      } catch (error) {
        next(error);
      }
    });

    router.get("/practice-areas", async (request, response, next) => {
      try {
        const query = publishedPracticeAreas(database).orderByRaw("sort ASC NULLS LAST").orderBy("id", "asc");
        if (request.query.homepage === "true") query.where("show_on_homepage", true);
        response.json({ data: await query });
      } catch (error) {
        next(error);
      }
    });

    router.get("/practice-areas/:slug", async (request, response, next) => {
      try {
        const item = await publishedPracticeAreas(database).where("slug", request.params.slug).first();
        if (!item) return response.status(404).json({ errors: [{ message: "Çalışma alanı bulunamadı." }] });
        response.json({ data: item });
      } catch (error) {
        next(error);
      }
    });

    router.get("/blog-posts", async (request, response, next) => {
      try {
        const query = publishedBlogPosts(database).orderBy("featured", "desc").orderByRaw("published_at DESC NULLS LAST").orderByRaw("sort ASC NULLS LAST").orderBy("id", "asc");
        if (request.query.homepage === "true") query.limit(3);
        response.json({ data: await query });
      } catch (error) {
        next(error);
      }
    });

    router.get("/blog-posts/:slug", async (request, response, next) => {
      try {
        const item = await publishedBlogPosts(database).where("slug", request.params.slug).first();
        if (!item) return response.status(404).json({ errors: [{ message: "Blog yazısı bulunamadı." }] });
        response.json({ data: item });
      } catch (error) {
        next(error);
      }
    });
  },
};
