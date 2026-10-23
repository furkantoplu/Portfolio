// Execute via stdin in the selected image, without network or production mounts.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {realpathSync} from 'node:fs';
import {brotliCompressSync,brotliDecompressSync,createBrotliDecompress,constants} from 'node:zlib';
import {Readable} from 'node:stream';
import {pipeline} from 'node:stream/promises';

assert.equal(process.versions.node,'22.23.4','patched Node release required');
assert.equal(process.versions.modules,'127','retain Node22 native addon ABI');
assert.equal(constants.BROTLI_DECODER_ERROR_FORMAT_BLOCK_SWITCH,-17,'upstream CVE patch marker required');
const require=createRequire('/directus/package.json');
assert.equal(require('./package.json').version,'12.4.0','CMS version must not change');
const native=createRequire(realpathSync(require.resolve('@directus/api/package.json')));
const sharp=native('sharp');
for(const format of ['jpeg','png','webp']){
  const bytes=await sharp({create:{width:8,height:6,channels:3,background:'#336699'}}).toFormat(format).toBuffer();
  const image=sharp(bytes,{failOn:'error'});assert.equal((await image.metadata()).format,format);assert.equal((await image.raw().toBuffer()).length,8*6*3);
}
const plain=Buffer.from('runtime compatibility control '.repeat(20));
const compressed=brotliCompressSync(plain);
assert.deepEqual(brotliDecompressSync(compressed),plain);
const pieces=[];
await pipeline(Readable.from([compressed.subarray(0,3),compressed.subarray(3)]),createBrotliDecompress(),async source=>{for await(const chunk of source)pieces.push(chunk)});
assert.deepEqual(Buffer.concat(pieces),plain);
assert.throws(()=>brotliDecompressSync(compressed.subarray(0,2)));
assert.throws(()=>brotliDecompressSync(Buffer.from([255,255,255,255])));
console.log('PASS patched runtime, CVE backport marker, retained CMS/ABI, Sharp JPEG/PNG/WebP and valid/invalid Brotli controls.');
