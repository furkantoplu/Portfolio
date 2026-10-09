#!/usr/bin/env bash
# Fresh-server preparation only. No app, DB, DNS, keys or secrets are deployed.
set -euo pipefail
[[ $EUID -eq 0 ]] || { echo 'Run with sudo.' >&2; exit 1; }
task_assets=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
. /etc/os-release
[[ $ID == ubuntu && $VERSION_ID == 26.04 && $(dpkg --print-architecture) == amd64 ]] || {
  echo 'This reviewed setup targets Ubuntu 26.04 amd64 only.' >&2; exit 1;
}
id ubuntu >/dev/null
[[ -s /home/ubuntu/.ssh/authorized_keys ]] || { echo 'Install and test the SSH key first.' >&2; exit 1; }
if command -v docker >/dev/null && docker info >/dev/null 2>&1; then
  [[ -z $(docker ps -q) ]] || { echo 'Refusing to modify a server with running containers.' >&2; exit 1; }
fi
for task_package in docker.io docker-compose docker-compose-v2 podman-docker containerd runc; do
  if dpkg-query -W -f='${db:Status-Status}' "$task_package" 2>/dev/null | grep -qx installed; then
    echo "Review conflicting package before proceeding: $task_package" >&2; exit 1
  fi
done

task_state="/var/backups/furkantoplu/provision-$(date -u +%Y%m%dT%H%M%SZ)"
install -d -m 0700 /var/backups/furkantoplu "$task_state"
echo "Configuration backup directory: $task_state"
cp -a /etc/fstab "$task_state/fstab"
if command -v iptables-save >/dev/null; then iptables-save > "$task_state/iptables.before"; fi
if command -v ip6tables-save >/dev/null; then ip6tables-save > "$task_state/ip6tables.before"; fi
if [[ -d /etc/ufw ]]; then cp -a /etc/ufw "$task_state/ufw.before"; fi

install_managed_file() {
  local task_source=$1 task_destination=$2 task_mode=${3:-0644}
  [[ ! -L $task_destination ]] || { echo "Refusing symlink: $task_destination" >&2; exit 1; }
  if [[ -f $task_destination ]]; then
    install -d -m 0700 "$(dirname -- "$task_state$task_destination")"
    cp -a "$task_destination" "$task_state$task_destination"
  fi
  install -d -m 0755 "$(dirname -- "$task_destination")"
  install -m "$task_mode" "$task_assets/$task_source" "$task_destination"
}

export DEBIAN_FRONTEND=noninteractive NEEDRESTART_MODE=a
echo 'PHASE: Ubuntu updates'
apt-get -o DPkg::Lock::Timeout=300 update
apt-get -o DPkg::Lock::Timeout=300 -o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold -y --with-new-pkgs upgrade
apt-get -o DPkg::Lock::Timeout=300 -y install ca-certificates curl gnupg ufw unattended-upgrades

echo 'PHASE: SSH key-only access and host firewall'
install_managed_file 00-fizyoterapi-hardening.conf /etc/ssh/sshd_config.d/00-fizyoterapi-hardening.conf
/usr/sbin/sshd -t
/usr/sbin/sshd -T | grep -qx 'passwordauthentication no'
/usr/sbin/sshd -T | grep -qx 'pubkeyauthentication yes'
/usr/sbin/sshd -T | grep -qx 'permitrootlogin no'
systemctl reload ssh.service
grep -qx 'IPV6=yes' /etc/default/ufw || { echo 'UFW IPv6 must be enabled.' >&2; exit 1; }
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH key access'
ufw allow 80/tcp comment 'Website HTTP'
ufw allow 443/tcp comment 'Website HTTPS'
ufw allow 443/udp comment 'Website HTTP3'
ufw --force enable

echo 'PHASE: Limited logs, swap and automatic OS security updates'
install_managed_file 60-fizyoterapi-journal.conf /etc/systemd/journald.conf.d/60-fizyoterapi.conf
systemctl restart systemd-journald.service
install_managed_file 99-fizyoterapi-updates /etc/apt/apt.conf.d/99-fizyoterapi-updates
systemctl enable --now apt-daily.timer apt-daily-upgrade.timer
if ! swapon --noheadings --show=NAME | grep -qx /swapfile; then
  [[ ! -e /swapfile ]] || { echo 'Existing inactive /swapfile needs manual review.' >&2; exit 1; }
  (umask 077; fallocate -l 2G /swapfile)
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
fi
grep -Eq '^/swapfile[[:space:]]+none[[:space:]]+swap[[:space:]]' /etc/fstab || printf '%s\n' '/swapfile none swap sw 0 0' >> /etc/fstab
install_managed_file 60-fizyoterapi-swap.conf /etc/sysctl.d/60-fizyoterapi-swap.conf
sysctl -p /etc/sysctl.d/60-fizyoterapi-swap.conf

echo 'PHASE: Docker official apt repository and Compose'
install -d -m 0755 /etc/apt/keyrings
curl --fail --show-error --silent --location --proto '=https' https://download.docker.com/linux/ubuntu/gpg -o "$task_state/docker.asc"
gpg --show-keys "$task_state/docker.asc" >/dev/null
install -m 0644 "$task_state/docker.asc" /etc/apt/keyrings/docker.asc
install_managed_file docker.sources /etc/apt/sources.list.d/docker.sources
install_managed_file daemon.json /etc/docker/daemon.json
install_managed_file docker-firewall.sh /usr/local/sbin/fizyoterapi-docker-firewall 0755
install_managed_file 20-fizyoterapi-firewall.conf /etc/systemd/system/docker.service.d/20-fizyoterapi-firewall.conf
systemctl daemon-reload
apt-get -o DPkg::Lock::Timeout=300 update
apt-get -o DPkg::Lock::Timeout=300 -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
dockerd --validate --config-file=/etc/docker/daemon.json
systemctl enable --now docker.service
/usr/local/sbin/fizyoterapi-docker-firewall
docker info --format '{{.ServerVersion}} / {{.LoggingDriver}}'
docker compose version
# Do not grant additional root-equivalent docker group memberships.
install -d -m 0750 -o ubuntu -g ubuntu /opt/furkantoplu
echo 'VPS_PREPARATION_COMPLETE'
if [[ -e /var/run/reboot-required ]]; then echo 'REBOOT_REQUIRED'; fi
