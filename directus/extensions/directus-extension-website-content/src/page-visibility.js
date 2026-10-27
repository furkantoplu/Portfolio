// Page publication is shared by every language; content and translations stay intact.
export const pageKeys = ['home', 'about', 'areas', 'blog', 'contact', 'privacy', 'kvkk'];
export function readPageVisibility(value) {
  const raw = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return Object.fromEntries(pageKeys.map(key => [key, key === 'home' || raw[key] !== false]));
}
export async function getPageVisibility(database) {
  const row = await database('site_pages').where('page_key', 'visibility').first('content');
  return readPageVisibility(row?.content);
}
export function registerPageVisibility(router, database, adminAccount) {
  router.get('/page-visibility', async (_request, response, next) => {
    try { response.set('Cache-Control', 'no-store').json({ data: await getPageVisibility(database) }); }
    catch (error) { next(error); }
  });
  router.patch('/page-visibility/:pageKey', async (request, response, next) => {
    try {
      const account = await adminAccount(database, request.accountability?.user);
      if (!account || account.status !== 'active') return response.status(401).json({ errors: [{ message: 'Oturum gerekli.' }] });
      if (!account.is_admin || !request.accountability?.admin || !request.accountability?.website_tfa_epoch) return response.status(403).json({ errors: [{ message: 'Doğrulanmış yönetici oturumu gerekli.' }] });
      const key = request.params.pageKey;
      const body = request.body;
      if (key === 'home' || !pageKeys.includes(key) || !body || typeof body.visible !== 'boolean' || Object.keys(body).some(field => field !== 'visible')) return response.status(400).json({ errors: [{ message: 'Geçersiz sayfa görünürlüğü. Ana sayfa daima açıktır.' }] });
      const result = await database.transaction(async db => {
        await db('site_pages').insert({ page_key: 'visibility', content: JSON.stringify({}) }).onConflict('page_key').ignore();
        const row = await db('site_pages').where('page_key', 'visibility').forUpdate().first('id', 'content');
        const visibility = { ...readPageVisibility(row.content), [key]: body.visible };
        await db('site_pages').where('id', row.id).update({ content: JSON.stringify(visibility) });
        return visibility;
      });
      response.set('Cache-Control', 'no-store').json({ data: result });
    } catch (error) { next(error); }
  });
}
