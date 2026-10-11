#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

# One-time production rollout of the mandatory administrator Authenticator gate.
# Run as root after the matching, verified source/image archives and a fresh daily
# backup have been staged. Never print .env, account rows, or the SQL dump.
if [ "$(id -u)" -ne 0 ] || [ "$#" -ne 0 ]; then
  printf '%s\n' 'Run as root without arguments on the intended VPS.' >&2
  exit 2
fi

app=/opt/furkantoplu
stage=/home/ubuntu/tfa-rollout-20261010
backup=/var/backups/furkantoplu/daily/20261010T205349Z
rollback=/var/backups/furkantoplu/deploy/20261010T205349Z-admin-tfa
image=fizyoterapist-frontend:vps-20261010-tfa1
source_hash=d19add790c30de3429b028e03f4385f80a4f5eabdd3c988ff8ab73dcd806f502
image_hash=9d57efc32e682edefb87347b7e545d23af9dc7e141224e55b6eafe80aada2472

test -f "$backup/.complete"
test ! -e /run/furkantoplu-backup/directus-stopped
test -d "$app/directus/extensions/directus-extension-website-content"
test -f "$app/.env"
test ! -e "$rollback"
test ! -e "$app/directus/extensions/directus-extension-admin-tfa"
test "$(realpath -- "$stage")" = "$stage"
test "$(sha256sum "$stage/source.tar.gz" | cut -d ' ' -f 1)" = "$source_hash"
test "$(sha256sum "$stage/frontend.tar" | cut -d ' ' -f 1)" = "$image_hash"
test "$(grep -c '^FRONTEND_IMAGE=' "$app/.env")" = 1

exec 9>/run/furkantoplu-backup/backup.lock
flock -n 9
test ! -e /run/furkantoplu-backup/directus-stopped

payload="$stage/payload"
test ! -e "$payload"
install -d -m 700 "$payload" "$rollback"
tar -xzf "$stage/source.tar.gz" -C "$payload"
test -f "$payload/directus/extensions/directus-extension-admin-tfa/dist/index.js"
test -f "$payload/directus/extensions/directus-extension-website-content/src/index.js"
test -f "$payload/scripts/migrations/012-admin-tfa-enforcement.sql"

cp -a "$app/.env" "$app/compose.vps.yaml" "$rollback/"
install -d -m 700 "$rollback/website-content/src" "$rollback/website-content/dist"
cp -a "$app/directus/extensions/directus-extension-website-content/src/index.js" "$rollback/website-content/src/index.js"
cp -a "$app/directus/extensions/directus-extension-website-content/dist/index.js" "$rollback/website-content/dist/index.js"
docker load -i "$stage/frontend.tar" >/dev/null
docker image inspect "$image" --format '{{.Id}}' >/dev/null

install -m 644 "$payload/compose.vps.yaml" "$app/compose.vps.yaml"
install -D -m 644 "$payload/scripts/migrations/012-admin-tfa-enforcement.sql" "$app/scripts/migrations/012-admin-tfa-enforcement.sql"
install -D -m 644 "$payload/directus/extensions/directus-extension-admin-tfa/package.json" "$app/directus/extensions/directus-extension-admin-tfa/package.json"
install -D -m 644 "$payload/directus/extensions/directus-extension-admin-tfa/src/index.js" "$app/directus/extensions/directus-extension-admin-tfa/src/index.js"
install -D -m 644 "$payload/directus/extensions/directus-extension-admin-tfa/dist/index.js" "$app/directus/extensions/directus-extension-admin-tfa/dist/index.js"
install -d -m 755 "$app/directus/extensions/directus-extension-admin-tfa" "$app/directus/extensions/directus-extension-admin-tfa/src" "$app/directus/extensions/directus-extension-admin-tfa/dist"
install -m 644 "$payload/directus/extensions/directus-extension-website-content/src/index.js" "$app/directus/extensions/directus-extension-website-content/src/index.js"
install -m 644 "$payload/directus/extensions/directus-extension-website-content/dist/index.js" "$app/directus/extensions/directus-extension-website-content/dist/index.js"

cd "$app"
compose=(docker compose --env-file .env -f compose.vps.yaml -f compose.vps.https.yaml)
"${compose[@]}" config --quiet
docker exec -i furkantoplu-database-1 sh -c 'exec psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < scripts/migrations/012-admin-tfa-enforcement.sql
"${compose[@]}" up -d --no-deps --wait directus

sed -i "s|^FRONTEND_IMAGE=.*$|FRONTEND_IMAGE=$image|" .env
test "$(stat -c '%a' .env)" = 600
"${compose[@]}" config --quiet
"${compose[@]}" up -d --no-deps --wait frontend

docker inspect furkantoplu-directus-1 --format '{{range .Config.Env}}{{if eq . "CACHE_ENABLED=false"}}cache-disabled {{end}}{{if eq . "WEBSOCKETS_ENABLED=false"}}websockets-disabled{{end}}{{end}}'
"${compose[@]}" ps --format 'table {{.Service}}\t{{.State}}'
printf '%s\n' 'Admin TFA rollout completed; verify public pages and protected API before cleanup.'
