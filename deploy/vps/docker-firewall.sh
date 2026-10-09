#!/usr/bin/env bash
# Guard Docker-published WAN ports; do not flush Docker's own chains.
set -euo pipefail
[[ $EUID -eq 0 ]] || { echo 'Run as root.' >&2; exit 1; }
mapfile -t task_wan_interfaces < <(
  { ip -o -4 route show default; ip -o -6 route show default; } |
    awk '{for (i=1;i<=NF;i++) if ($i=="dev") print $(i+1)}' | sort -u
)
[[ ${#task_wan_interfaces[@]} -gt 0 ]] || { echo 'No WAN interface found.' >&2; exit 1; }

for task_firewall in iptables ip6tables; do
  if ! "$task_firewall" -w 10 -nL DOCKER-USER >/dev/null 2>&1; then
    # IPv6 publishing through docker-proxy is filtered by UFW INPUT instead.
    [[ $task_firewall == ip6tables ]] && continue
    echo 'Docker IPv4 DOCKER-USER chain missing.' >&2
    exit 1
  fi
  if ! "$task_firewall" -w 10 -nL FIZYO-WEB >/dev/null 2>&1; then
    "$task_firewall" -w 10 -N FIZYO-WEB
  fi
  # Only this project's chain is rebuilt. Existing unrelated rules remain.
  "$task_firewall" -w 10 -F FIZYO-WEB
  "$task_firewall" -w 10 -A FIZYO-WEB -m conntrack --ctstate ESTABLISHED,RELATED -j RETURN
  "$task_firewall" -w 10 -A FIZYO-WEB -p tcp -m conntrack --ctorigdstport 80 -j RETURN
  "$task_firewall" -w 10 -A FIZYO-WEB -p tcp -m conntrack --ctorigdstport 443 -j RETURN
  "$task_firewall" -w 10 -A FIZYO-WEB -p udp -m conntrack --ctorigdstport 443 -j RETURN
  "$task_firewall" -w 10 -A FIZYO-WEB -j DROP
  for task_interface in "${task_wan_interfaces[@]}"; do
    if ! "$task_firewall" -w 10 -C DOCKER-USER -i "$task_interface" -m conntrack --ctstate DNAT -j FIZYO-WEB 2>/dev/null; then
      "$task_firewall" -w 10 -I DOCKER-USER 1 -i "$task_interface" -m conntrack --ctstate DNAT -j FIZYO-WEB
    fi
  done
done
echo 'Docker WAN guard ready: TCP 80/443, UDP 443.'
