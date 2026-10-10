#!/usr/bin/env bash
# Sourced by the root backup entry point; variables point only to its private state.
recover_directus() {
  [[ -e $task_marker ]] || return 0
  [[ -f $task_marker && ! -L $task_marker ]] || return 1
  local task_id task_current task_health task_attempt
  task_id=$(< "$task_marker")
  [[ $task_id =~ ^[a-f0-9]{64}$ ]] || return 1
  task_current=$("${task_compose[@]}" ps -a -q directus) || return 1
  [[ $task_current == "$task_id" ]] || { echo 'Recovery refused: Directus container changed.' >&2; return 1; }
  timeout 30 docker start "$task_id" >/dev/null || return 1
  for ((task_attempt=0; task_attempt<60; task_attempt++)); do
    task_health=$(docker inspect --format '{{.State.Health.Status}}' "$task_id") || return 1
    if [[ $task_health == healthy ]]; then
      rm -- "$task_marker"
      echo 'Directus recovered and healthy.'
      return 0
    fi
    sleep 2
  done
  echo 'Directus recovery health check failed; marker retained.' >&2
  return 1
}
