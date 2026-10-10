#!/usr/bin/env bash
# Managed VPS only. Contains secrets: never copy its output bundles to public storage.
set -euo pipefail
umask 077
[[ $EUID -eq 0 ]] || { echo 'Run with sudo.' >&2; exit 1; }
task_app=/opt/furkantoplu
task_root=/var/backups/furkantoplu/daily
task_run=/run/furkantoplu-backup
task_marker=$task_run/directus-stopped
cd -- "$task_app"
task_compose=(docker compose --env-file .env -f compose.vps.yaml -f compose.vps.https.yaml)
[[ ! -L $task_run ]] || exit 1
install -d -m 0700 "$task_run"
source /usr/local/lib/furkantoplu/backup-recovery.sh

if [[ ${1:-} == --recover && $# == 1 ]]; then
  # ExecStopPost runs after this service exits. Never recover a different active job.
  exec 9> "$task_run/backup.lock"
  flock -n 9 || { echo 'Recovery refused while another backup holds the lock.' >&2; exit 1; }
  recover_directus
  exit
fi
[[ $# == 0 ]] || { echo 'Unsupported argument.' >&2; exit 1; }
exec 9> "$task_run/backup.lock"
flock -n 9 || { echo 'Another backup is running.' >&2; exit 1; }
[[ ! -e $task_marker ]] || { echo 'Previous recovery is required before another backup.' >&2; exit 1; }
for task_path in /var/backups/furkantoplu "$task_root" "$task_app/.env"; do
  [[ ! -L $task_path ]] || { echo 'Refusing symlinked backup/config path.' >&2; exit 1; }
done
install -d -m 0700 /var/backups/furkantoplu "$task_root"
[[ $(realpath -e -- "$task_root") == "$task_root" ]] || exit 1
"${task_compose[@]}" config --quiet
task_directus=$("${task_compose[@]}" ps -q directus)
task_database=$("${task_compose[@]}" ps -q database)
task_frontend=$("${task_compose[@]}" ps -q frontend)
for task_id in "$task_directus" "$task_database" "$task_frontend"; do
  [[ $task_id =~ ^[a-f0-9]{64}$ ]] || exit 1
  [[ $(docker inspect --format '{{.State.Health.Status}}' "$task_id") == healthy ]] || exit 1
done
task_uploads=$(docker volume inspect furkantoplu_directus_uploads --format '{{.Mountpoint}}')
[[ $task_uploads == /var/lib/docker/volumes/furkantoplu_directus_uploads/_data && -d $task_uploads && ! -L $task_uploads ]] || exit 1
[[ $(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/directus/uploads"}}{{.Name}}{{end}}{{end}}' "$task_directus") == furkantoplu_directus_uploads ]] || exit 1
task_image=$(docker inspect --format '{{.Image}}' "$task_frontend")
task_image_size=$(docker image inspect --format '{{.Size}}' "$task_image")
task_upload_size=$(du -sb "$task_uploads" | cut -f1)
task_db_size=$("${task_compose[@]}" exec -T database sh -c 'exec psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Atqc "SELECT pg_database_size(current_database())"' </dev/null)
task_free=$(df -B1 --output=avail "$task_root" | tail -1 | tr -d ' ')
[[ $task_db_size =~ ^[0-9]+$ ]] || exit 1
(( task_free > task_image_size + 2 * (task_upload_size + task_db_size) + 2147483648 )) || {
  echo 'Insufficient free disk; backup skipped before stopping Directus.' >&2; exit 1;
}
task_stamp=$(date -u +%Y%m%dT%H%M%SZ)
task_partial="$task_root/.partial-$task_stamp"
[[ ! -e $task_partial && ! -e $task_root/$task_stamp ]] || exit 1
mkdir -m 0700 -- "$task_partial"
finish() {
  local task_result=$?
  trap - EXIT
  if ! recover_directus; then task_result=1; fi
  if (( task_result != 0 )); then echo 'Backup failed; incomplete private bundle retained for diagnosis.' >&2; fi
  exit "$task_result"
}
trap finish EXIT
trap 'exit 1' TERM INT
echo "Backup started: $task_stamp"
# Slow image/config packaging happens before the short content-service interruption.
for task_service in database directus frontend proxy; do
  task_id=$("${task_compose[@]}" ps -q "$task_service")
  task_service_image=$(docker inspect --format '{{.Image}}' "$task_id")
  printf '%s %s\n' "$task_service" "$task_service_image" >> "$task_partial/images.txt"
  docker image inspect --format '{{json .RepoDigests}}' "$task_service_image" >> "$task_partial/images.txt"
done
timeout 300 docker image save "$task_image" | gzip -1 > "$task_partial/frontend-image.tar.gz"
timeout 120 tar --exclude='node_modules' -czf "$task_partial/runtime.tar.gz" -C "$task_app" .env compose.vps.yaml compose.vps.https.yaml deploy directus/extensions
[[ $(docker inspect --format '{{.Image}}' "$task_frontend") == "$task_image" ]] || exit 1
printf '%s\n' "$task_directus" > "$task_marker"
echo 'Stopping content service for consistent database/uploads snapshot.'
timeout 45 docker stop --time 30 "$task_directus" >/dev/null
timeout 90 "${task_compose[@]}" exec -T database sh -c 'exec pg_dump -Fc --no-owner --no-acl --lock-wait-timeout=10s -U "$POSTGRES_USER" -d "$POSTGRES_DB"' </dev/null > "$task_partial/database.dump"
timeout 120 tar -czf "$task_partial/uploads.tar.gz" -C "$task_uploads" .
recover_directus
# Read/validate archives, not a restore test. No production database writes here.
timeout 60 docker exec -i "$task_database" pg_restore --list < "$task_partial/database.dump" > /dev/null
for task_archive in uploads.tar.gz runtime.tar.gz frontend-image.tar.gz; do
  timeout 60 tar -tzf "$task_partial/$task_archive" >/dev/null
done
(cd "$task_partial" && sha256sum database.dump uploads.tar.gz runtime.tar.gz frontend-image.tar.gz images.txt > SHA256SUMS && sha256sum --check --status SHA256SUMS)
printf 'furkantoplu-backup-v1\n' > "$task_partial/.complete"
mv -T -- "$task_partial" "$task_root/$task_stamp"
# Never prune partial, manual, migration or provisioning backups.
source /usr/local/lib/furkantoplu/backup-retention.sh
prune_completed_backups "$task_root" 7
printf 'Backup successful: %s; bytes: %s\n' "$task_stamp" "$(du -sb "$task_root/$task_stamp" | cut -f1)"
