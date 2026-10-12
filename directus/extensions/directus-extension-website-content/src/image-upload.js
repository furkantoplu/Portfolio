import { createRequire } from 'node:module';
import { realpathSync } from 'node:fs';
import { Readable } from 'node:stream';
import { uploadMarker } from './media-cleanup.js';

function runtimeSharp() {
  // Directus' pnpm layout keeps Sharp next to the real API package, not the
  // /directus/node_modules/@directus/api symlink location.
  return createRequire(realpathSync('/directus/node_modules/@directus/api/package.json'))('sharp');
}
const maxBytes = 10 * 1024 * 1024;
const maxPixels = 16_000_000;
const formats = new Map([
  ['image/jpeg', { format: 'jpeg', extension: 'jpg' }],
  ['image/png', { format: 'png', extension: 'png' }],
  ['image/webp', { format: 'webp', extension: 'webp' }],
]);

function fail(response, status, message) {
  return response.status(status).json({ errors: [{ message }] });
}

export function readBoundedImage(stream, limit = maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let length = 0;
    const cleanup = () => {
      stream.off('data', onData);
      stream.off('end', onEnd);
      stream.off('error', onError);
      stream.off('aborted', onAbort);
    };
    const onError = error => { cleanup(); reject(error); };
    const onAbort = () => onError(new Error('IMAGE_ABORTED'));
    const onEnd = () => {
      cleanup();
      if (!length) reject(new Error('IMAGE_EMPTY'));
      else resolve(Buffer.concat(chunks, length));
    };
    const onData = chunk => {
      length += chunk.length;
      if (length > limit) {
        // Pause instead of destroying the socket; the HTTP layer can return 413.
        stream.pause();
        cleanup();
        reject(new Error('IMAGE_TOO_LARGE'));
      } else chunks.push(chunk);
    };
    stream.on('data', onData);
    stream.once('end', onEnd);
    stream.once('error', onError);
    stream.once('aborted', onAbort);
  });
}

export async function decodeImage(bytes, mimeType, sharp = runtimeSharp()) {
  const expected = formats.get(mimeType);
  if (!expected) throw new Error('IMAGE_TYPE');
  const image = sharp(bytes, { failOn: 'error', limitInputPixels: maxPixels, animated: false });
  const metadata = await image.metadata();
  if (metadata.format !== expected.format || !metadata.width || !metadata.height ||
      metadata.width > 5000 || metadata.height > 5000 ||
      metadata.width * metadata.height > maxPixels || (metadata.pages || 1) !== 1) {
    throw new Error('IMAGE_INVALID');
  }
  // Metadata alone reads only the header; force a full pixel decode before storage.
  await image.raw().toBuffer();
  return expected.extension;
}

export function registerImageUpload(router, context, adminAccount, sharpFactory = runtimeSharp) {
  router.post('/image-upload', async (request, response) => {
    try {
      const account = await adminAccount(context.database, request.accountability?.user);
      if (!account || account.status !== 'active') return fail(response, 401, 'Oturum gerekli.');
      if (!account.is_admin) return fail(response, 403, 'Yönetici yetkisi gerekli.');
      const mimeType = request.headers['content-type']?.split(';', 1)[0]?.trim().toLowerCase();
      if (!formats.has(mimeType)) return fail(response, 415, 'Yalnızca JPG, PNG veya WebP yükleyin.');
      const declaredSize = Number(request.headers['content-length']);
      if (Number.isFinite(declaredSize) && declaredSize > maxBytes) return fail(response, 413, 'Görsel en fazla 10 MB olabilir.');
      const bytes = await readBoundedImage(request);
      const sharp = sharpFactory();
      let extension;
      try { extension = await decodeImage(bytes, mimeType, sharp); }
      catch { return fail(response, 400, 'Dosya geçerli bir JPG, PNG veya WebP görseli değil.'); }
      const service = new context.services.FilesService({
        schema: await context.getSchema(), knex: context.database, accountability: request.accountability,
      });
      const id = await service.uploadOne(Readable.from(bytes), {
        filename_download: `site-image.${extension}`, type: mimeType, storage: 'local', description: uploadMarker,
      });
      return response.status(201).set('Cache-Control', 'no-store').json({ data: { id } });
    } catch (error) {
      if (error?.message === 'IMAGE_TOO_LARGE') return fail(response.set('Connection', 'close'), 413, 'Görsel en fazla 10 MB olabilir.');
      if (error?.message === 'IMAGE_EMPTY') return fail(response, 400, 'Boş dosya yüklenemez.');
      context.logger?.error(error, 'Site image upload failed');
      return fail(response, 503, 'Görsel yüklenemedi. Daha sonra tekrar deneyin.');
    }
  });
}
