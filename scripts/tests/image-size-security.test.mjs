import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const requireFrontend = createRequire(new URL('../../frontend/package.json', import.meta.url));
const cjsPath = requireFrontend.resolve('image-size');
const esmPath = cjsPath.replace(/\.cjs$/, '.mjs').replace(/([\\/])cjs([\\/])/, '$1esm$2');
assert.notEqual(esmPath, cjsPath, 'Test the separate ESM export used by Vinext');
const esmUrl = pathToFileURL(esmPath).href;

// A timeout in the parent cannot interrupt a synchronous parser loop. Each
// malformed input runs in a disposable child, so a vulnerable version fails
// the test instead of hanging the test runner.
test('CJS and ESM image parsers reject malformed ICNS, HEIF and JXL without looping', () => {
  const icns = Buffer.alloc(16);
  icns.write('icns');
  icns.writeUInt32BE(16, 4);
  icns.write('ic07', 8);
  const heif = Buffer.alloc(20);
  heif.writeUInt32BE(12, 0);
  heif.write('ftyp', 4);
  heif.write('heic', 8);
  heif.write('free', 16);
  const jxl = Buffer.alloc(20);
  jxl.writeUInt32BE(12, 0);
  jxl.write('JXL ', 4);
  jxl.write('free', 16);
  for (const [mode, modulePath] of [['cjs', cjsPath], ['esm', esmUrl]]) {
    const load = mode === 'cjs'
      ? 'require(process.argv[1])'
      : 'await import(process.argv[1])';
    const source = `const parser = ${load}; try {
      parser.imageSize(Buffer.from(JSON.parse(process.argv[2])));
      process.exitCode = 1;
    } catch { process.exitCode = 0; }`;
    for (const [name, bytes] of [['ICNS', icns], ['HEIF', heif], ['JXL', jxl]]) {
      const result = spawnSync(process.execPath,
        [...(mode === 'esm' ? ['--input-type=module'] : []), '-e', source, modulePath, JSON.stringify([...bytes])],
        { timeout: 2000, encoding: 'utf8', maxBuffer: 16 * 1024 });
      assert.equal(result.error, undefined, `${mode} ${name}: parser must terminate`);
      assert.equal(result.status, 0, `${mode} ${name}: malformed input must be rejected: ${result.stderr}`);
    }
  }
});

test('normal JPEG, PNG, WebP and SVG dimensions remain correct in both exports', async () => {
  const sharp = requireFrontend('sharp');
  const parsers = [requireFrontend('image-size'), await import(esmUrl)];
  const pixel = sharp({ create: { width: 8, height: 6, channels: 3, background: '#336699' } });
  const inputs = await Promise.all(['jpeg', 'png', 'webp'].map(format => pixel.clone().toFormat(format).toBuffer()));
  inputs.push(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="6"></svg>'));
  for (const parser of parsers) {
    for (const input of inputs) {
      const { width, height } = parser.imageSize(input);
      assert.deepEqual({ width, height }, { width: 8, height: 6 });
    }
  }
});
