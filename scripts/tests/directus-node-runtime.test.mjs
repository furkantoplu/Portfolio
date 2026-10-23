import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
test('Runtime overlay pins trusted musl sources and changes only Node, retaining CMS and non-root settings',()=>{
  const source=read('deploy/directus-node.Dockerfile');
  assert.match(source,/FROM node:22\.23\.4-alpine3\.24@sha256:[0-9a-f]{64}/);
  assert.match(source,/FROM directus\/directus:12\.4\.0@sha256:[0-9a-f]{64}/);
  assert.match(source,/COPY --from=patched-node \/usr\/local\/bin\/node \/usr\/local\/bin\/node/);
  assert.equal((source.match(/^COPY /gm)||[]).length,1);
  assert.match(source,/BROTLI_DECODER_ERROR_FORMAT_BLOCK_SWITCH/);
  assert.doesNotMatch(source,/^USER |^ENTRYPOINT |^CMD |apk |npm |curl /m);
  assert.match(read('compose.vps.yaml'),/image: fizyoterapist-directus:12\.4\.0-node22\.23\.4/);
});
test('Fixture is internal, disposable and credential-guarded, with the actual candidate image',()=>{
  const fixture=read('deploy/vps/node-runtime-test.compose.yaml');
  assert.match(fixture,/image: fizyoterapist-directus:12\.4\.0-node22\.23\.4/);
  assert.match(fixture,/internal: true/);assert.match(fixture,/\/directus\/uploads:uid=1000,gid=1000,mode=0700/);
  assert.doesNotMatch(fixture,/ports:|furkantoplu_default|postgres_data|directus_uploads/);
  const smoke=read('scripts/tests/directus-node-fixture-smoke.mjs');
  assert.ok(smoke.indexOf("assert.equal(process.env.DB_DATABASE,'node_runtime_fixture')")<smoke.indexOf('const db=dbFactory()'));
  assert.match(smoke,/current_database\(\)/);assert.match(smoke,/copied real accounts must be scrubbed/);
});
test('Rollout has lock, immutable old-state guards, private image recovery and only a Directus recreation',()=>{
  const source=read('deploy/vps/rollout-node-runtime.sh');
  for(const value of ['flock -n 9','docker image save','sha256sum --check --status','account_fingerprint','--no-deps --force-recreate --wait','trap rollback ERR'])assert.ok(source.includes(value),value);
  assert.doesNotMatch(source,/down -v|volume rm|pg_restore|frontend-image|up -d.*frontend/);
  const guide=read('deploy/DIRECTUS-NODE-YAMASI.md');assert.ok(guide.includes('docker image load'));assert.ok(guide.includes('Günlük yedek yalnız frontend'));
});
