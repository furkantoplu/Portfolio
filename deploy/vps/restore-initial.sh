#!/usr/bin/env bash
set -euo pipefail
[[ $EUID -eq 0 ]] || { echo 'Run with sudo.' >&2; exit 1; }
task_bundle=${1:?Migration bundle directory required}
[[ $task_bundle =~ ^/opt/furkantoplu/\.migration/20261010-[a-f0-9]{10}$ ]] || { echo 'Unexpected migration directory.' >&2; exit 1; }
[[ ! -L /opt/furkantoplu/.env ]] || exit 1
cd /opt/furkantoplu
chmod 600 .env
(cd "$task_bundle" && sha256sum -c transfer.sha256)
compose=(docker compose -p furkantoplu --env-file .env -f compose.vps.yaml)
"${compose[@]}" config --quiet
"${compose[@]}" up -d --wait --wait-timeout 120 database
task_tables=$(printf '%s\n' "SELECT count(*) FROM pg_tables WHERE schemaname='public';" | "${compose[@]}" exec -T database sh -c 'exec psql -At -U "$POSTGRES_USER" -d "$POSTGRES_DB"')
[[ $task_tables == 0 ]] || { echo 'Target database is not empty; restore refused.' >&2; exit 1; }
task_db=$("${compose[@]}" ps -q database)
docker cp "$task_bundle/database.dump" "$task_db:/tmp/initial-migration.dump"
"${compose[@]}" exec -T database sh -c 'exec pg_restore --exit-on-error --single-transaction --no-owner --no-acl -U "$POSTGRES_USER" -d "$POSTGRES_DB" /tmp/initial-migration.dump'
"${compose[@]}" exec -T database sh -c 'exec psql -v ON_ERROR_STOP=1 -At -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < deploy/vps/data-inventory.sql > "$task_bundle/target-inventory.txt"
python3 -c 'import json,sys; expected=json.load(open(sys.argv[1])); actual=json.loads(next(s for s in open(sys.argv[2]) if s.startswith("{"))); bad=[k for k in expected if expected[k]!=actual.get(k)]; assert not bad,"Restored data mismatch: "+str(bad); print("PASS all restored content/account/permission/file metadata fingerprints")' "$task_bundle/inventory.json" "$task_bundle/target-inventory.txt"
# Force a fresh login on the new host without invalidating source sessions.
"${compose[@]}" exec -T database sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "DELETE FROM directus_sessions"'
docker volume create --label com.docker.compose.project=furkantoplu --label com.docker.compose.volume=directus_uploads furkantoplu_directus_uploads >/dev/null
docker run --rm -v furkantoplu_directus_uploads:/target -v "$task_bundle:/backup:ro" alpine:3.22 sh -c 'test -z "$(ls -A /target)" && tar -xf /backup/uploads.tar -C /target'
docker run --rm -v furkantoplu_directus_uploads:/source:ro alpine:3.22 sh -c 'cd /source && find . -type f -print0 | sort -z | xargs -0 -r sha256sum' > "$task_bundle/target-uploads.sha256"
cmp "$task_bundle/uploads.sha256" "$task_bundle/target-uploads.sha256"
echo 'PASS upload file bytes restored'
"${compose[@]}" up -d --wait --wait-timeout 180
task_secret=$("${compose[@]}" exec -T directus node -e 'console.log(require("crypto").createHash("sha256").update(process.env.SECRET).digest("hex"))')
[[ $task_secret == "$(tr -d '\r\n' < "$task_bundle/secret.sha256")" ]] || { echo 'Application secret mismatch.' >&2; exit 1; }
echo 'PASS application secret preserved; no secret printed'
echo 'PRIVATE_VPS_TRANSFER_COMPLETE'
