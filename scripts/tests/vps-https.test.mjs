import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = path => readFileSync(new URL('../../'+path, import.meta.url), 'utf8').replaceAll('\r\n','\n');

test('Public HTTPS replaces private port publishing and forces secure sessions', () => {
  const compose = read('compose.vps.https.yaml');
  assert.match(compose, /ports: !override/);
  for (const port of ['0.0.0.0:80:80','0.0.0.0:443:443','0.0.0.0:443:443/udp']) assert.ok(compose.includes(port));
  assert.doesNotMatch(compose, /8055:|8080:|5432:|3000:/);
  assert.match(compose, /SESSION_COOKIE_SECURE: "true"/);
  assert.match(compose, /VPS_CADDYFILE:-\.\/deploy\/Caddyfile\.vps/);
});

test('Production retains the entire private proxy API allowlist and cache protections', () => {
  const production = read('deploy/Caddyfile.vps');
  const routes = production.split('furkantoplu.com {\n  import origin_tls\n')[1].split('\n}\n\nwww.')[0];
  assert.equal(routes, read('deploy/Caddyfile').replace(/^:80 \{\n/, '').replace(/\n\}\n?$/, ''));
  assert.match(production, /disable_tlsalpn_challenge/);
  assert.match(production, /redir https:\/\/furkantoplu\.com\{uri\} 308/);
  assert.doesNotMatch(production, /tls internal|insecure_skip_verify|http:\/\/furkantoplu/);
});

test('Certificate bootstrap cannot expose frontend or admin before verification', () => {
  const config = read('deploy/Caddyfile.tls-bootstrap');
  assert.match(config, /furkantoplu\.com, www\.furkantoplu\.com/);
  assert.match(config, /respond .* 503/);
  assert.match(config, /Cache-Control "no-store"/);
  assert.match(config, /disable_tlsalpn_challenge/);
  assert.doesNotMatch(config, /reverse_proxy|file_server|tls internal|insecure_skip_verify/);
});
