#!/usr/bin/env bash
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/backup-retention.sh"
task_fixture=$(mktemp -d)
task_root="$task_fixture/daily"
mkdir "$task_root" "$task_fixture/outside" "$task_root/manual" "$task_root/.partial-test"
for task_day in {01..09}; do
  task_dir="$task_root/202610${task_day}T010000Z"
  mkdir "$task_dir"
  printf 'furkantoplu-backup-v1\n' > "$task_dir/.complete"
  for task_file in database.dump uploads.tar.gz runtime.tar.gz frontend-image.tar.gz images.txt SHA256SUMS; do
    printf 'fixture\n' > "$task_dir/$task_file"
  done
done
mkdir "$task_root/20261010T010000Z"
printf 'furkantoplu-backup-v1\n' > "$task_root/20261010T010000Z/.complete"
ln -s "$task_fixture/outside" "$task_root/20261011T010000Z"
prune_completed_backups "$task_root" 7
[[ ! -e $task_root/20261001T010000Z && ! -e $task_root/20261002T010000Z ]]
for task_day in {03..09}; do [[ -d $task_root/202610${task_day}T010000Z ]]; done
[[ -d $task_root/manual && -d $task_root/.partial-test && -d $task_root/20261010T010000Z ]]
[[ -L $task_root/20261011T010000Z && -d $task_fixture/outside ]]
if prune_completed_backups "$task_root" 0; then exit 1; fi
if prune_completed_backups "$task_root/20261011T010000Z" 7; then exit 1; fi
prune_completed_backups "$task_root" 7
# Remove only our verified mktemp fixture after the assertions.
[[ $task_fixture == /tmp/tmp.* && $(realpath -e "$task_fixture") == "$task_fixture" ]]
rm -r --one-file-system -- "$task_fixture"
echo 'Backup retention: completed-count, idempotency, partial/manual/symlink protections passed.'
