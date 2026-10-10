#!/usr/bin/env bash
# Only completed backups created by this tool. Never touch sibling manual backups.
prune_completed_backups() {
  local task_root=$1 task_keep=$2 task_path task_name task_index=0
  [[ $task_keep =~ ^[1-9][0-9]*$ && -d $task_root && ! -L $task_root ]] || return 1
  task_root=$(realpath -e -- "$task_root") || return 1
  while IFS= read -r task_name; do
    [[ $task_name =~ ^[0-9]{8}T[0-9]{6}Z$ ]] || continue
    task_path="$task_root/$task_name"
    [[ -d $task_path && ! -L $task_path && $(realpath -e -- "$task_path") == "$task_path" ]] || continue
    [[ -f $task_path/.complete && ! -L $task_path/.complete ]] || continue
    [[ $(< "$task_path/.complete") == furkantoplu-backup-v1 ]] || continue
    local task_valid=true task_file
    for task_file in database.dump uploads.tar.gz runtime.tar.gz frontend-image.tar.gz images.txt SHA256SUMS; do
      [[ -s $task_path/$task_file && ! -L $task_path/$task_file ]] || task_valid=false
    done
    [[ $task_valid == true ]] || continue
    task_index=$((task_index + 1))
    if (( task_index > task_keep )); then
      # Revalidate the exact target. Root and non-tool directories are never deleted.
      [[ $(dirname -- "$task_path") == "$task_root" && ! -L $task_path ]] || return 1
      rm -r --one-file-system -- "$task_path" || return 1
      printf 'Retention removed completed backup: %s\n' "$task_name"
    fi
  done < <(find "$task_root" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | LC_ALL=C sort -r)
}
