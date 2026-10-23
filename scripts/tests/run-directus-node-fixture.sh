#!/usr/bin/env bash
set -euo pipefail
test "$(id -u)" = 0
task_root=$(cd "$(dirname "$0")/../.." && pwd)
cd "$task_root"
export TEST_PG_PASSWORD=$(openssl rand -hex 32)
export TEST_APP_SECRET=$(openssl rand -hex 32)
task_project=fizyoterapi-node-runtime-20261023
task_compose=(docker compose -p "$task_project" -f deploy/vps/node-runtime-test.compose.yaml)
test -z "$(docker ps -aq --filter label=com.docker.compose.project=$task_project)"
cleanup() {
  local task_status=$?
  trap - EXIT
  "${task_compose[@]}" down --timeout 10 </dev/null >/dev/null
  exit "$task_status"
}
trap cleanup EXIT
"${task_compose[@]}" up -d --wait database </dev/null >/dev/null
task_db=$("${task_compose[@]}" ps -q database </dev/null)
test "$(docker inspect -f '{{index .Config.Labels "com.docker.compose.project"}}' "$task_db")" = "$task_project"
test "$task_db" != "$(docker inspect -f '{{.Id}}' furkantoplu-database-1)"
test "$("${task_compose[@]}" exec -T database psql -X -U node_fixture -d node_runtime_fixture -Atqc "select count(*) from pg_tables where schemaname='public'" </dev/null)" = 0
docker exec furkantoplu-database-1 sh -c 'exec pg_dump -Fc --no-owner --no-acl -U "$POSTGRES_USER" -d "$POSTGRES_DB"' </dev/null |
  "${task_compose[@]}" exec -T database pg_restore --exit-on-error --single-transaction --no-owner --no-acl -U node_fixture -d node_runtime_fixture
"${task_compose[@]}" exec -T database psql -X -v ON_ERROR_STOP=1 -U node_fixture -d node_runtime_fixture -c "BEGIN; DELETE FROM directus_sessions; UPDATE directus_users SET status='suspended',email=NULL,password=NULL,tfa_secret=NULL,token=NULL,first_name=NULL,last_name=NULL; COMMIT;" </dev/null >/dev/null
test "$("${task_compose[@]}" exec -T database psql -X -U node_fixture -d node_runtime_fixture -Atqc "select count(*) from directus_users where status <> 'suspended' or email is not null or password is not null or tfa_secret is not null or token is not null" </dev/null)" = 0
echo 'PASS isolated tmpfs DB copied and real credentials scrubbed before API startup'
"${task_compose[@]}" up -d --wait directus </dev/null >/dev/null
task_api=$("${task_compose[@]}" ps -q directus </dev/null)
test "$(docker inspect -f '{{.Config.Image}}' "$task_api")" = fizyoterapist-directus:12.4.0-node22.23.4
docker exec "$task_api" node -e "const fs=require('node:fs');const s=fs.statSync('/directus/uploads');console.log('Fixture uploads uid='+s.uid+' mode='+s.mode.toString(8));fs.accessSync('/directus/uploads',fs.constants.W_OK)"
docker exec -i -e TEST_NODE_RUNTIME_FIXTURE=1 "$task_api" node --input-type=module < scripts/tests/directus-node-fixture-smoke.mjs
echo 'PASS COMPLETE FIXTURE'
