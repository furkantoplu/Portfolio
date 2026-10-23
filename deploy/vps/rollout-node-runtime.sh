#!/usr/bin/env bash
# One-time 2026-10-23 runtime-only rollout. Run only after isolated checks pass.
set -Eeuo pipefail
umask 077
test "$(id -u)" = 0
test "$#" = 0
task_app=/opt/furkantoplu
task_stage=/tmp/furkantoplu-nodepatch-20261023-01
task_rollback=/var/backups/furkantoplu/node-runtime-20261023-01
task_image=fizyoterapist-directus:12.4.0-node22.23.4
cd "$task_app"
exec 9>/run/furkantoplu-backup/backup.lock
flock -n 9
test ! -e /run/furkantoplu-backup/directus-stopped
test "$(docker inspect -f '{{.Image}}' furkantoplu-directus-1)" = sha256:e4809aa907c6dc67d60fcea734bbbbac567df458bfd86dd5984b1cc08d018212
test "$(sha256sum compose.vps.yaml | cut -d ' ' -f 1)" = 70bfa0a0a360e81bdea7d01f2a55c603774a4a3325a18dc7b2c7041a06431720
test ! -e "$task_rollback"
test "$(realpath "$task_stage")" = "$task_stage"
test "$(sha256sum "$task_stage/compose.vps.yaml" | cut -d ' ' -f 1)" = 9eff4f826e525e9cc3b206443894f1877b83dd503994c5624782638c1c14f1e9
docker image inspect "$task_image" >/dev/null
install -d -m 700 "$task_rollback"
cp -a compose.vps.yaml "$task_rollback/compose.vps.yaml"
docker image save "$task_image" | gzip -1 > "$task_rollback/directus-node22.23.4.tar.gz"
(cd "$task_rollback" && sha256sum directus-node22.23.4.tar.gz > SHA256SUMS && sha256sum --check --status SHA256SUMS)
tar -tzf "$task_rollback/directus-node22.23.4.tar.gz" >/dev/null
task_frontend_before=$(docker inspect -f '{{.Id}}' furkantoplu-frontend-1)
task_proxy_before=$(docker inspect -f '{{.Id}}' furkantoplu-proxy-1)
task_db_before=$(docker inspect -f '{{.Id}}' furkantoplu-database-1)
# Compare only stable account security fields; never print their values or digest.
account_fingerprint() {
  docker exec furkantoplu-database-1 sh -c 'exec psql -X -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Atqc "SELECT md5(coalesce(string_agg(jsonb_build_array(id,status,email,password,tfa_secret,token,website_tfa_epoch)::text, CHR(10) ORDER BY id), chr(0+32))) FROM directus_users"' </dev/null
}
task_accounts_before=$(account_fingerprint)
task_compose=(docker compose -f compose.vps.yaml -f compose.vps.https.yaml)
rollback() {
  trap - ERR
  cp -a "$task_rollback/compose.vps.yaml" compose.vps.yaml
  "${task_compose[@]}" up -d --no-deps --force-recreate --wait directus </dev/null
  echo 'Runtime deployment failed and previous Directus image was restored; no database restore performed.' >&2
  exit 1
}
trap rollback ERR
cp "$task_stage/compose.vps.yaml" compose.vps.yaml
"${task_compose[@]}" config --quiet </dev/null
"${task_compose[@]}" up -d --no-deps --force-recreate --wait --wait-timeout 120 directus </dev/null
test "$(docker exec furkantoplu-directus-1 node -p process.versions.node)" = 22.23.4
test "$(docker inspect -f '{{.Id}}' furkantoplu-frontend-1)" = "$task_frontend_before"
test "$(docker inspect -f '{{.Id}}' furkantoplu-proxy-1)" = "$task_proxy_before"
test "$(docker inspect -f '{{.Id}}' furkantoplu-database-1)" = "$task_db_before"
test "$(account_fingerprint)" = "$task_accounts_before"
trap - ERR
install -m 644 "$task_stage/deploy/directus-node.Dockerfile" deploy/directus-node.Dockerfile
echo 'PASS runtime rollout; original accounts/TOTP/tokens unchanged; only Directus recreated.'
docker inspect -f 'Image={{.Config.Image}} ID={{.Image}} Health={{.State.Health.Status}}' furkantoplu-directus-1
echo "Private image archive and previous Compose retained: $task_rollback"
