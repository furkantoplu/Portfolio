const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function isPublicImage(database, id) {
  if (!uuid.test(id)) return false;
  const path = `/site-media/${id}`;
  const [area, post, page] = await Promise.all([
    database("practice_areas").where({ status: "published", image_path: path }).first("id"),
    database("blog_posts").where({ status: "published", cover_path: path }).first("id"),
    database("site_pages").whereIn("page_key", ["home", "about", "contact", "areas", "blog"]).where(builder => {
      for (const key of ["hero_image", "about_image", "image_path"]) builder.orWhereRaw("content ->> ? = ?", [key, path]);
    }).first("id"),
  ]);
  return Boolean(area || post || page);
}

export function registerMedia(router, { database, services, getSchema }) {
  router.get("/media/:id", async (request, response, next) => {
    try {
      const id = request.params.id;
      if (!await isPublicImage(database, id)) return response.status(404).json({ errors: [{ message: "Görsel bulunamadı." }] });
      const record = await database("directus_files").where("id", id).first("type");
      if (!record || !imageTypes.has(record.type)) return response.status(404).end();
      // Public access is granted only for referenced images, never the entire file library.
      const service = new services.AssetsService({ schema: await getSchema(), knex: database, accountability: null });
      const { stream, file } = await service.getAsset(id, {});
      response.set({ "Content-Type": file.type, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
      stream.on("error", error => { if (response.headersSent) response.destroy(error); else next(error); });
      response.on("close", () => stream.destroy());
      stream.pipe(response);
    } catch (error) { next(error); }
  });
}
