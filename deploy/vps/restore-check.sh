#!/usr/bin/env bash
# Manual, same-VPS, network-isolated QA. Never restores to the live Compose services.
set -euo pipefail
umask 077
[[ $EUID -eq 0 && $# == 1 && $1 =~ ^[0-9]{8}T[0-9]{6}Z$ ]] || {
  echo 'Use sudo furkantoplu-restore-check UTC-backup-directory-name.' >&2; exit 1;
}
task_bundle="/var/backups/furkantoplu/daily/$1"
[[ -d $task_bundle && ! -L $task_bundle && $(realpath -e "$task_bundle") == "$task_bundle" ]] || exit 1
[[ -f $task_bundle/.complete && ! -L $task_bundle/.complete && $(< "$task_bundle/.complete") == furkantoplu-backup-v1 ]] || exit 1
[[ ! -L /run/furkantoplu-backup ]] || exit 1
install -d -m 0700 /run/furkantoplu-backup
# Share the backup lock so retention cannot delete a bundle during this check.
exec 9> /run/furkantoplu-backup/backup.lock
flock -n 9 || { echo 'Backup/restore check already running.' >&2; exit 1; }
[[ ! -e /run/furkantoplu-backup/directus-stopped ]] || exit 1
(cd "$task_bundle" && sha256sum --check --status SHA256SUMS)
cd /opt/furkantoplu
task_compose=(docker compose --env-file .env -f compose.vps.yaml -f compose.vps.https.yaml)
task_live=$("${task_compose[@]}" ps -q database)
[[ $task_live =~ ^[a-f0-9]{64}$ && $(docker inspect --format '{{.State.Health.Status}}' "$task_live") == healthy ]] || exit 1
task_image=$(docker inspect --format '{{.Image}}' "$task_live")
task_mem=$(awk '/MemAvailable:/ {print $2}' /proc/meminfo)
(( task_mem > 1572864 )) || { echo 'At least 1.5GiB available memory required.' >&2; exit 1; }
task_stamp="$(date -u +%Y%m%dT%H%M%SZ)-$(openssl rand -hex 4)"
task_name="furkantoplu-restore-check-$task_stamp"
task_reports=/var/backups/furkantoplu/restore-checks
[[ ! -L $task_reports ]] || exit 1
install -d -m 0700 "$task_reports"
[[ $(realpath -e "$task_reports") == "$task_reports" ]] || exit 1
task_report="$task_reports/$task_stamp"
mkdir -m 0700 -- "$task_report"
task_work=$(mktemp -d /run/furkantoplu-restore-check.XXXXXX)
task_container=
finish() {
  local task_status=$?
  trap - EXIT
  if [[ -n $task_container ]]; then
    if [[ $(docker inspect --format '{{index .Config.Labels "com.furkantoplu.restore-check"}}' "$task_container") == "$task_stamp" && $task_container != "$task_live" ]]; then
      docker rm -f -v "$task_container" >/dev/null || task_status=1
    else
      echo 'Cleanup refused: container identity mismatch.' >&2
      task_status=1
    fi
  fi
  if [[ $task_work =~ ^/run/furkantoplu-restore-check\.[A-Za-z0-9]+$ && ! -L $task_work && $(realpath -e "$task_work") == "$task_work" ]]; then
    rm -r --one-file-system -- "$task_work" || task_status=1
  else
    echo 'Cleanup refused: temporary path mismatch.' >&2
    task_status=1
  fi
  if (( task_status == 0 )); then
    printf 'PASS cleanup: own temporary container/data removed\n' | tee -a "$task_report/result.txt"
  else
    echo 'Restore check failed; private report retained, no live restore performed.' >&2
  fi
  exit "$task_status"
}
trap finish EXIT
trap 'exit 1' TERM INT
openssl rand -hex 32 > "$task_work/password"
mkdir -m 0700 "$task_work/uploads"
printf 'Backup: %s; check: %s\n' "$1" "$task_stamp" | tee "$task_report/result.txt"
task_container=$(docker run -d --name "$task_name" --label "com.furkantoplu.restore-check=$task_stamp" \
  --network none --memory 768m --memory-swap 768m --cpus 0.75 --pids-limit 100 \
  --read-only --tmpfs /var/lib/postgresql/data:rw,nosuid,noexec,size=384m \
  --tmpfs /var/run/postgresql:rw,nosuid,noexec,size=16m --tmpfs /tmp:rw,nosuid,noexec,size=16m \
  --mount "type=bind,source=$task_work/password,target=/run/secrets/restore-password,readonly" \
  -e POSTGRES_USER=restore_check -e POSTGRES_DB=restore_check \
  -e POSTGRES_PASSWORD_FILE=/run/secrets/restore-password "$task_image")
[[ $task_container =~ ^[a-f0-9]{64}$ && $task_container != "$task_live" ]] || exit 1
[[ $(docker inspect --format '{{.HostConfig.NetworkMode}}' "$task_container") == none ]] || exit 1
task_ready=false
for ((task_attempt=0; task_attempt<60; task_attempt++)); do
  if docker exec "$task_container" pg_isready -U restore_check -d restore_check >/dev/null 2>&1; then task_ready=true; break; fi
  sleep 1
done
[[ $task_ready == true ]] || { docker logs "$task_container" > "$task_report/startup.log" 2>&1; exit 1; }
# Guards: explicitly different instance, no production network/volume/port, empty target.
task_tables=$(docker exec "$task_container" psql -X -At -U restore_check -d restore_check -c "SELECT count(*) FROM pg_tables WHERE schemaname='public'")
[[ $task_tables == 0 ]] || exit 1
timeout 180 docker exec -i "$task_container" pg_restore --exit-on-error --single-transaction --no-owner --no-acl \
  -U restore_check -d restore_check < "$task_bundle/database.dump" > "$task_report/restore.log" 2>&1
# Independently derive expected COPY row hashes from the same immutable backup.
timeout 120 docker exec -i "$task_container" pg_restore --data-only --file=- < "$task_bundle/database.dump" 2> "$task_report/inventory.log" \
  | python3 /usr/local/lib/furkantoplu/restore-check-data.py inventory > "$task_work/inventory.json"
echo 'PASS backup COPY inventory parsed.' | tee -a "$task_report/result.txt"
timeout 180 python3 /usr/local/lib/furkantoplu/restore-check-data.py verify "$task_container" \
  "$task_work/inventory.json" "$task_bundle/uploads.tar.gz" "$task_work/uploads" \
  | tee -a "$task_report/result.txt"
echo 'PASS schema/data restore and photo consistency; not a full website/admin login test.' | tee -a "$task_report/result.txt"
