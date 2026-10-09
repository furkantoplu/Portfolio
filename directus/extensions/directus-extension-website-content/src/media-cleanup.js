import { imageTypes } from './media.js';
export const uploadMarker = 'fizyoterapi-site-image:v1';
export const managedTable = 'website_media_assets';
export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function adoptTaggedUploads(database) {
  const files = await database('directus_files').where('description', uploadMarker).whereIn('type', [...imageTypes]).whereNotNull('uploaded_on').whereNotNull('filename_disk').select('id', 'uploaded_on');
  for (const file of files) await database(managedTable).insert({file_id:file.id, previously_referenced:false, cleanup_after:new Date(new Date(file.uploaded_on).getTime()+24*60*60*1000)}).onConflict('file_id').ignore();
}

export async function hasImageReferences(database, id, schema) {
  // All statuses and languages count, including drafts, hidden sections and inline URLs.
  for (const collection of ['practice_areas', 'blog_posts']) {
    if (await database(collection).whereRaw('to_jsonb(??)::text ILIKE ?', [collection, `%${id}%`]).first('id')) return true;
  }
  for (const collection of ['site_pages', 'website_content_translations']) {
    if (await database(collection).whereRaw('content::text ILIKE ?', [`%${id}%`]).first('id')) return true;
  }
  // Protect native/other CMS file relations such as avatars or project logos too.
  for (const relation of schema.relations || []) {
    if (relation.related_collection !== 'directus_files' || relation.collection === managedTable) continue;
    if (await database(relation.collection).where(relation.field,id).first()) return true;
  }
  return false;
}

export async function cleanupImage(context, id, { discardUser = null, now = new Date() } = {}) {
  if (!uuidPattern.test(id)) return 'invalid';
  const {database, services, getSchema} = context;
  const schema=await getSchema();
  const decision=await database.transaction(async trx => {
    // DB content triggers take the same row lock before attaching an image.
    // A concurrent attachment either commits first and is preserved, or safely fails.
    const file=await trx('directus_files').where('id',id).forUpdate().first();
    if (!file) return 'missing';
    const managed=await trx(managedTable).where('file_id',id).first();
    if (!managed || !imageTypes.has(file.type) || !new RegExp(`^${id}\\.[a-z0-9]+$`,'i').test(file.filename_disk || '')) return 'unmanaged';
    if (await hasImageReferences(trx,id,schema)) return 'referenced';
    if (discardUser && (file.uploaded_by !== discardUser || file.description !== uploadMarker)) return 'forbidden';
    if (!discardUser && !managed.retired_at && !managed.previously_referenced && new Date(managed.cleanup_after)>now) return 'pending';
    // Persist retirement BEFORE any storage mutation. Even if only part of the
    // disk deletion succeeds, a future save cannot reattach the damaged asset.
    await trx(managedTable).where('file_id',id).update({retired_at:managed.retired_at || now});
    return 'ready';
  });
  if(decision!=='ready') return decision;
  return database.transaction(async trx => {
    const file=await trx('directus_files').where('id',id).forUpdate().first();
    if(!file) return 'missing';
    if(!imageTypes.has(file.type) || !new RegExp(`^${id}\\.[a-z0-9]+$`,'i').test(file.filename_disk || '')) return 'unmanaged';
    if(await hasImageReferences(trx,id,schema)) return 'referenced';
    const service=new services.FilesService({schema,knex:trx,accountability:null});
    // File service removes the DB row, original and generated variants. An error
    // rolls the outer DB transaction back so the scheduler can retry remaining files.
    await service.deleteOne(id);
    return 'deleted';
  });
}

export async function collectUnusedImages(context) {
  await adoptTaggedUploads(context.database);
  const candidates=await context.database(managedTable).where(builder => builder.where('previously_referenced',true).orWhere('cleanup_after','<=',new Date()).orWhereNotNull('retired_at')).select('file_id');
  const result={deleted:0,kept:0,failed:0};
  for (const {file_id} of candidates) {
    try { if (await cleanupImage(context,file_id)==='deleted') result.deleted++; else result.kept++; }
    catch { result.failed++; context.logger?.warn({file_id},'Site image cleanup will retry'); }
  }
  return result;
}

export function registerMediaCleanup(router, context, adminAccount) {
  router.post('/media-discard/:id',async (request,response) => {
    try {
      const user=request.accountability?.user;
      const account=await adminAccount(context.database,user);
      if (!account || account.status!=='active') return response.status(401).json({errors:[{message:'Oturum gerekli.'}]});
      if (!account.is_admin) return response.status(403).json({errors:[{message:'Yönetici yetkisi gerekli.'}]});
      if (!uuidPattern.test(request.params.id)) return response.status(400).json({errors:[{message:'Geçersiz görsel.'}]});
      await adoptTaggedUploads(context.database);
      const outcome=await cleanupImage(context,request.params.id,{discardUser:user});
      if (['forbidden','unmanaged'].includes(outcome)) return response.status(403).json({errors:[{message:'Bu dosya temizlenemez.'}]});
      return response.json({data:{result:outcome}});
    } catch { return response.status(503).json({errors:[{message:'Görsel temizlenemedi. Otomatik temizlik yeniden deneyecek.'}]}); }
  });
}
