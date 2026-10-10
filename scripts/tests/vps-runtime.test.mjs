import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
test('VPS uses a non-root standalone production Node server, not local Wrangler dev',()=>{
  const docker=read('frontend/Dockerfile.vps'),config=read('frontend/vite.vps.config.ts');
  assert.match(docker,/dist\/standalone/);assert.match(docker,/USER node/);assert.match(docker,/CMD \["node", "server.js"\]/);
  assert.doesNotMatch(docker,/wrangler|--local/);assert.match(config,/output: "standalone"/);assert.match(config,/sites\(\{mockAuth: false\}\)/);
});
test('Staging stays loopback-only, does not bootstrap accounts or automatically reseed restored content',()=>{
  const compose=read('compose.vps.yaml');assert.match(compose,/127\.0\.0\.1:8080:80/);assert.match(compose,/127\.0\.0\.1:8055:8055/);
  assert.doesNotMatch(compose,/ADMIN_PASSWORD|ADMIN_EMAIL|content-migrations|bootstrap|import-practice/);
  assert.match(compose,/https:\/\/furkantoplu.com/);assert.match(compose,/caddy_data:\/data/);
  assert.match(read('frontend/Dockerfile.vps.dockerignore'),/\.env\*/);
});
