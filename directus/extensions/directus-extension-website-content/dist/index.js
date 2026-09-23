const publicFields = ["id", "sort", "show_on_homepage", "title", "slug", "summary", "hero_title", "hero_accent", "lead", "image_path", "image_alt", "overview_title", "overview_accent", "overview", "assessment_points", "process_steps", "faqs", "seo_title", "seo_description"];
const publishedPracticeAreas = (database) => database("practice_areas").select(publicFields).where("status", "published");

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
  },
};
