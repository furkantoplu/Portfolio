import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { Readable } from 'node:stream';
import { readFileSync } from 'node:fs';
import { decodeImage, readBoundedImage, registerImageUpload } from '../../directus/extensions/directus-extension-website-content/src/image-upload.js';

const requireFrontend = createRequire(new URL('../../frontend/package.json', import.meta.url));
const sharp = requireFrontend('sharp');
const pixel = sharp({ create: { width: 8, height: 6, channels: 4, background: '#33aacc88' } });
const formats = [['image/jpeg', 'jpeg', 'jpg'], ['image/png', 'png', 'png'], ['image/webp', 'webp', 'webp']];
const image = format => pixel.clone().toFormat(format).toBuffer();

test('real JPEG, PNG and WebP pixels decode, but mismatched, truncated and fake images do not', async () => {
  for (const [mime, format, extension] of formats) {
    const bytes = await image(format);
    assert.equal(await decodeImage(bytes, mime, sharp), extension);
    assert.deepEqual(await readBoundedImage(Readable.from([bytes])), bytes);
    for (const [otherMime] of formats.filter(([other]) => other !== mime)) {
      await assert.rejects(decodeImage(bytes, otherMime, sharp));
    }
  }
  const png = await image('png');
  await assert.rejects(decodeImage(png.subarray(0, 28), 'image/png', sharp));
  await assert.rejects(decodeImage(Buffer.from('<script>alert(1)</script>'), 'image/png', sharp));
  await assert.rejects(decodeImage(png, 'image/svg+xml', sharp));
  const oversizeDimensions = await sharp({ create: { width: 5001, height: 1, channels: 3, background: 'red' } }).png().toBuffer();
  await assert.rejects(decodeImage(oversizeDimensions, 'image/png', sharp));
});

test('empty and oversized streams are rejected before storage', async () => {
  await assert.rejects(readBoundedImage(Readable.from([])), /IMAGE_EMPTY/);
  await assert.rejects(readBoundedImage(Readable.from([Buffer.alloc(11)]), 10), /IMAGE_TOO_LARGE/);
});

async function requestUpload(bytes, mime, account = { status: 'active', is_admin: true }, headers = {}) {
  let handler;
  const uploads = [];
  const context = {
    database: {}, getSchema: async () => ({}), logger: { error() {} },
    services: { FilesService: class {
      constructor(options) { assert.equal(options.accountability.user, 'admin'); }
      async uploadOne(stream, data) {
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        uploads.push({ bytes: Buffer.concat(chunks), data });
        return '12345678-1234-4234-8234-123456789abc';
      }
    } },
  };
  registerImageUpload({ post(path, callback) { assert.equal(path, '/image-upload'); handler = callback; } }, context, async () => account, () => sharp);
  const request = Readable.from([bytes]);
  request.headers = { 'content-type': mime, 'content-length': String(bytes.length), ...headers };
  request.accountability = { user: 'admin', admin: true };
  const response = { statusCode: 200, payload: null, status(code) { this.statusCode = code; return this; }, set() { return this; }, json(data) { this.payload = data; return this; } };
  await handler(request, response);
  return { status: response.statusCode, payload: response.payload, uploads };
}

test('only an active admin can store a fully decoded image with cleanup marker', async () => {
  const png = await image('png');
  const accepted = await requestUpload(png, 'image/png');
  assert.equal(accepted.status, 201);
  assert.equal(accepted.uploads.length, 1);
  assert.deepEqual(accepted.uploads[0].bytes, png);
  assert.equal(accepted.uploads[0].data.description, 'fizyoterapi-site-image:v1');
  assert.equal(accepted.uploads[0].data.type, 'image/png');
  assert.equal((await requestUpload(png, 'image/png', null)).status, 401);
  assert.equal((await requestUpload(png, 'image/png', { status: 'active', is_admin: false })).status, 403);
  assert.equal((await requestUpload(png, 'image/jpeg')).status, 400);
  assert.equal((await requestUpload(Buffer.from('not a picture'), 'image/png')).uploads.length, 0);
  assert.equal((await requestUpload(png, 'image/svg+xml')).status, 415);
  assert.equal((await requestUpload(png, 'image/png', { status: 'active', is_admin: true }, { 'content-length': String(10 * 1024 * 1024 + 1) })).status, 413);
});

test('public proxy exposes only the validated panel upload path', () => {
  const caddy = readFileSync(new URL('../../deploy/Caddyfile.vps', import.meta.url), 'utf8');
  const client = readFileSync(new URL('../../frontend/app/bakir/image-field.tsx', import.meta.url), 'utf8');
  assert.match(caddy, /'\/website-content\/image-upload'/);
  assert.doesNotMatch(caddy, /'\/files'/);
  assert.match(client, /"\/website-content\/image-upload"/);
  assert.doesNotMatch(client, /directusRequest[^\n]*"\/files"/);
});
