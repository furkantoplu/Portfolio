#!/usr/bin/env bash
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/backup-recovery.sh"
task_fixture=$(mktemp -d)
task_marker="$task_fixture/directus-stopped"
task_expected=$(printf '%064d' 1)
task_mock_current=$task_expected
task_start_ok=true
task_mock_health=healthy
task_compose=(mock_compose)
mock_compose() { printf '%s\n' "$task_mock_current"; }
timeout() { shift; "$@"; }
sleep() { :; }
docker() {
  case $1 in
    start) [[ $task_start_ok == true ]] ;;
    inspect) printf '%s\n' "$task_mock_health" ;;
    *) return 1 ;;
  esac
}
recover_directus # No marker: never touches a container.
printf 'invalid\n' > "$task_marker"
if recover_directus; then exit 1; fi
printf '%s\n' "$task_expected" > "$task_marker"
task_mock_current=$(printf '%064d' 2)
if recover_directus; then exit 1; fi
[[ -f $task_marker ]]
task_mock_current=$task_expected
task_start_ok=false
if recover_directus; then exit 1; fi
[[ -f $task_marker ]]
task_start_ok=true
task_mock_health=unhealthy
if recover_directus; then exit 1; fi
[[ -f $task_marker ]]
task_mock_health=healthy
recover_directus
[[ ! -e $task_marker ]]
ln -s "$task_fixture" "$task_marker"
if recover_directus; then exit 1; fi
[[ $task_fixture == /tmp/tmp.* && $(realpath -e "$task_fixture") == "$task_fixture" ]]
rm -r --one-file-system -- "$task_fixture"
echo 'Backup recovery: no-state, invalid-state, changed-container, failed-start, health-timeout and success passed.'
