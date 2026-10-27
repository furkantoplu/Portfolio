#!/usr/bin/env bash
# One-time, manifest-guarded rollout of the tested 2026-10-27 candidate.
set -Eeuo pipefail
umask 077
test "$(id -u)" = 0
test "$#" = 0
task_app=/opt/furkantoplu
task_stage=/tmp/furkantoplu-pagevisibility-20261027-01
task_rollback=/var/backups/furkantoplu/pagevisibility-20261027-01
task_manifest=$task_stage/incoming/page-visibility-release.tsv
task_image=fizyoterapist-frontend:vps-20261027-pagevisibility1
test "$(realpath "$task_app")" = "$task_app"
test "$(realpath "$task_stage")" = "$task_stage"
test "$(sha256sum "$task_manifest" | cut -d ' ' -f 1)" = 677ff47195322ab01fe9b178cb38076dcda3e10c8baf1bd378b619dce72baf6d
cd "$task_app"
exec 9>/run/furkantoplu-backup/backup.lock
flock -n 9
test ! -e /run/furkantoplu-backup/directus-stopped
test ! -e "$task_rollback"
test ! -L .env
test "$(docker inspect -f '{{.Image}}' furkantoplu-frontend-1)" = sha256:d89a6de6ce270768fd7f92e5ad83a585161c1109c0b215d15c67b05ce109e3c8
test "$(docker inspect -f '{{range .Mounts}}{{if eq .Destination "/etc/caddy/Caddyfile"}}{{.Source}}{{end}}{{end}}' furkantoplu-proxy-1)" = "$task_app/deploy/Caddyfile.vps"
docker image inspect "$task_image" >/dev/null
test "$(docker image inspect -f '{{.Id}}' "$task_image")" = sha256:8e8240953a75a494ba9e8c26b66efb50e2dfdfdeb8fc745df54475eedc2da278
test "$(grep -c '^FRONTEND_IMAGE=' .env)" = 1
while IFS=$'\t' read -r task_path task_before task_after; do
  [[ $task_path != /* && $task_path != *..* && $task_path != *\\* ]]
  [[ $(realpath -m "$task_app/$task_path") == "$task_app/"* ]]
  test ! -L "$task_app/$task_path"
  test "$(sha256sum "$task_stage/$task_path" | cut -d ' ' -f 1)" = "$task_after"
  if test "$task_before" = -; then test ! -e "$task_app/$task_path";
  else test "$(tr -d '\r' < "$task_app/$task_path" | sha256sum | cut -d ' ' -f 1)" = "$task_before"; fi
done < "$task_manifest"
install -d -m 700 "$task_rollback/files"
cp -a .env "$task_rollback/.env"
cp "$task_manifest" "$task_rollback/manifest.tsv"
while IFS=$'\t' read -r task_path task_before task_after; do
  if test "$task_before" != -; then cp -a --parents "$task_path" "$task_rollback/files/"; fi
done < "$task_manifest"
task_compose=(docker compose --env-file .env -f compose.vps.yaml -f compose.vps.https.yaml)
task_db_before=$(docker inspect -f '{{.Id}}' furkantoplu-database-1)
task_proxy_before=$(docker inspect -f '{{.Id}}' furkantoplu-proxy-1)
task_directus_image=$(docker inspect -f '{{.Image}}' furkantoplu-directus-1)
fingerprint() {
  docker exec furkantoplu-database-1 sh -c 'exec psql -X -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Atqc "SELECT md5(coalesce(string_agg(row_to_json(t)::text, chr(10) ORDER BY id), chr(32))) FROM site_pages t; SELECT md5(coalesce(string_agg(jsonb_build_array(id,status,email,password,tfa_secret,token,website_tfa_epoch)::text, chr(10) ORDER BY id), chr(32))) FROM directus_users"' </dev/null
}
task_data_before=$(fingerprint)
rollback() {
  trap - ERR
  cp -a "$task_rollback/.env" .env
  while IFS=$'\t' read -r task_path task_before task_after; do
    if test "$task_before" = -; then rm -f -- "$task_app/$task_path";
    else cp -p "$task_rollback/files/$task_path" "$task_app/$task_path"; fi
  done < "$task_manifest"
  "${task_compose[@]}" up -d --no-deps --force-recreate --wait --wait-timeout 120 directus frontend </dev/null
  docker exec furkantoplu-proxy-1 caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile </dev/null
  echo 'Deployment failed; previous sources, frontend and config restored. No production DB restore/writes.' >&2
  exit 1
}
trap rollback ERR
while IFS=$'\t' read -r task_path task_before task_after; do
  # Keep the Caddy bind-mounted inode so validate/reload sees the new contents.
  if test "$task_path" = deploy/Caddyfile.vps; then cp "$task_stage/$task_path" "$task_app/$task_path";
  else install -D -m 644 "$task_stage/$task_path" "$task_app/$task_path"; fi
done < "$task_manifest"
sed -i "s|^FRONTEND_IMAGE=.*|FRONTEND_IMAGE=$task_image|" .env
"${task_compose[@]}" config --quiet </dev/null
"${task_compose[@]}" up -d --no-deps --force-recreate --wait --wait-timeout 120 directus </dev/null
docker exec furkantoplu-proxy-1 caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile </dev/null
test "$(docker exec furkantoplu-proxy-1 sha256sum /etc/caddy/Caddyfile | cut -d ' ' -f 1)" = "$(sha256sum deploy/Caddyfile.vps | cut -d ' ' -f 1)"
docker exec furkantoplu-proxy-1 caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile </dev/null
"${task_compose[@]}" up -d --no-deps --force-recreate --wait --wait-timeout 120 frontend </dev/null
test "$(docker inspect -f '{{.Id}}' furkantoplu-database-1)" = "$task_db_before"
test "$(docker inspect -f '{{.Id}}' furkantoplu-proxy-1)" = "$task_proxy_before"
test "$(docker inspect -f '{{.Image}}' furkantoplu-directus-1)" = "$task_directus_image"
test "$(fingerprint)" = "$task_data_before"
while IFS=$'\t' read -r task_path task_before task_after; do
  test "$(sha256sum "$task_app/$task_path" | cut -d ' ' -f 1)" = "$task_after"
done < "$task_manifest"
trap - ERR
echo 'PASS controlled page-visibility rollout; existing page content, users and TOTP preserved; DB/proxy containers retained.'
docker inspect -f 'Frontend={{.Config.Image}} ID={{.Image}} Health={{.State.Health.Status}}' furkantoplu-frontend-1
echo "Private rollback: $task_rollback"
