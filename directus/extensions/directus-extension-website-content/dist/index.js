const publicFields = ["id", "sort", "show_on_homepage", "title", "slug", "summary", "hero_title", "hero_accent", "lead", "image_path", "image_alt", "overview_title", "overview_accent", "overview", "assessment_points", "process_steps", "faqs", "seo_title", "seo_description"];
const publishedPracticeAreas = (database) => database("practice_areas").select(publicFields).where("status", "published");
const publicBlogFields = ["id", "sort", "featured", "category", "title", "slug", "summary", "published_at", "reading_minutes", "cover_path", "cover_alt", "cover_caption", "lead", "body_paragraphs", "quote", "tips_title", "tips", "closing_title", "closing_body", "seo_title", "seo_description"];
const publishedBlogPosts = (database) => database("blog_posts").select(publicBlogFields).where("status", "published");

export default {
  id: "website-content",
  handler: (router, { database }) => {
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
