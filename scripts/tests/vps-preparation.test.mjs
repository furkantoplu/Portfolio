import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = name => readFileSync(new URL(`../../deploy/vps/${name}`, import.meta.url), 'utf8');

test('Linux preparation assets stay LF across Windows git checkouts', () => {
  const attributes = readFileSync(new URL('../../.gitattributes', import.meta.url), 'utf8');
  assert.match(attributes, /deploy\/vps\/\* text eol=lf/);
  for (const name of ['bootstrap-vps.sh', 'docker-firewall.sh', '00-fizyoterapi-hardening.conf', 'docker.sources']) assert.ok(!read(name).includes('\r'), name);
});

test('fresh-server bootstrap guards existing workloads and never deploys app/data or deletes volumes', () => {
  const source = read('bootstrap-vps.sh');
  assert.match(source, /VERSION_ID == 26\.04/);
  assert.match(source, /Refusing to modify a server with running containers/);
  assert.match(source, /authorized_keys/);
  assert.match(source, /Configuration backup directory/);
  assert.match(source, /--force-confold/);
  assert.doesNotMatch(source, /docker (?:volume|system) prune|compose down|rm -rf|git clone|ssh-add -D/);
  assert.doesNotMatch(source, /get\.docker\.com|usermod.*docker|StrictHostKeyChecking=no/);
});
test('SSH is key-only before host firewall is enabled and port 22 remains allowed', () => {
  const ssh = read('00-fizyoterapi-hardening.conf');
  for (const value of ['PubkeyAuthentication yes', 'PasswordAuthentication no', 'KbdInteractiveAuthentication no', 'PermitRootLogin no']) assert.ok(ssh.includes(value));
  const source = read('bootstrap-vps.sh');
  assert.ok(source.indexOf('/usr/sbin/sshd -t') < source.indexOf('systemctl reload ssh.service'));
  assert.ok(source.indexOf('ufw allow 22/tcp') < source.indexOf('ufw --force enable'));
  assert.match(source, /IPV6=yes/);
});
test('Docker keeps supported networking and bounded compressed logs', () => {
  const config = JSON.parse(read('daemon.json'));
  assert.equal(config['log-driver'], 'local');
  assert.deepEqual(config['log-opts'], { 'max-size': '10m', 'max-file': '3', compress: 'true' });
  assert.equal(config['firewall-backend'], 'iptables');
  assert.equal(config['live-restore'], true);
  assert.notEqual(config.iptables, false);
  assert.match(read('docker.sources'), /Signed-By: \/etc\/apt\/keyrings\/docker\.asc/);
  assert.match(read('docker.sources'), /Suites: resolute/);
});
test('Docker WAN guard matches original published ports, both families, and preserves unrelated chains', () => {
  const source = read('docker-firewall.sh');
  assert.match(source, /iptables ip6tables/);
  assert.match(source, /--ctstate ESTABLISHED,RELATED -j RETURN/);
  assert.match(source, /--ctstate DNAT -j FIZYO-WEB/);
  assert.match(source, /--ctorigdstport 80 -j RETURN/);
  assert.match(source, /--ctorigdstport 443 -j RETURN/);
  assert.match(source, /-A FIZYO-WEB -j DROP/);
  assert.doesNotMatch(source, /-F (?:DOCKER|DOCKER-USER|INPUT|FORWARD)(?:\s|$)/);
  assert.match(read('20-fizyoterapi-firewall.conf'), /ExecStartPost=\/usr\/local\/sbin\/fizyoterapi-docker-firewall/);
});
test('swap is restricted, existing files guarded, security updates do not auto-reboot', () => {
  const source = read('bootstrap-vps.sh');
  assert.match(source, /Existing inactive \/swapfile needs manual review/);
  assert.match(source, /fallocate -l 2G \/swapfile/);
  assert.match(source, /chmod 600 \/swapfile/);
  assert.match(read('99-fizyoterapi-updates'), /Automatic-Reboot "false"/);
  assert.match(read('60-fizyoterapi-journal.conf'), /SystemMaxUse=150M/);
  assert.match(read('60-fizyoterapi-swap.conf'), /vm.swappiness=10/);
});

test('preflight is an explicitly disposable, bounded network fixture without app or volumes', () => {
  const source = read('preflight.compose.yaml');
  assert.match(source, /NOT the site's production configuration/);
  assert.match(source, /plaintext HTTP solely to test TCP forwarding/);
  assert.match(source, /"127\.0\.0\.1:8055:80"/);
  assert.match(source, /"8080:80"/);
  assert.match(source, /restart: "no"/);
  assert.match(source, /mem_limit: 64m/);
  assert.doesNotMatch(source, /volumes:|postgres|directus|\.env/);
});
