import { adoptTaggedUploads, collectUnusedImages } from '../../directus-extension-website-content/src/media-cleanup.js';
const contentCollections=new Set(['practice_areas','blog_posts','site_pages','website_content_translations']);
export default ({action,schedule},context) => {
  let running=null;
  let queued=false;
  const run=() => {
    queued=true;
    if (!running) running=(async()=>{
      while(queued){queued=false;await collectUnusedImages(context);}
    })().catch(()=>context.logger?.warn('Site media cleanup deferred until database is ready')).finally(()=>{running=null;});
    return running;
  };
  for(const event of ['items.create','items.update','items.delete']) action(event,meta=>{if(contentCollections.has(meta.collection)) return run();});
  action('files.upload',()=>adoptTaggedUploads(context.database).catch(()=>context.logger?.warn('Site upload registration deferred')));
  schedule('*/1 * * * *',run);
};
