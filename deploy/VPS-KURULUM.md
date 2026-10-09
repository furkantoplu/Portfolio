# VPS erişimi ve yayın hazırlığı

## İlk erişim kontrolü — 9 Ekim 2026

- Domain: `furkantoplu.com`; kayıt firması Namecheap.
- VPS: OVHcloud, `149.56.103.60`, Ubuntu 26.04 LTS.
- Linux kullanıcı adı: `ubuntu`. Paneldeki `furkofizyo` hizmet etiketidir; giriş kullanıcı adı değildir.
- Anahtarla giriş kullanıcı tarafından ve ardından Codex tarafından başarıyla test edildi. `sudo -n` erişimi çalışıyor.
- Sunucunun ED25519 kimlik parmak izi: `SHA256:7DRD8MXm+7NcIKOqjbs6rkRwndsjTSM6dcIpoAMBSDg`.
- Kullanıcının VPS açık anahtarının parmak izi: `SHA256:tvdkWXIiMDND4mfiqkD9XVB4+vhlwLu+tdyMBBCtDfU`.
- Windows SSH agent çalışıyor; kullanıcı anahtarı agent'a ekledi. Özel anahtar veya parolası okunmadı, sunucuya kopyalanmadı ve bu depoya eklenmedi.
- Kontrol anında kök disk yaklaşık 38 GB, kullanılan 2.3 GB, boş 36 GB; RAM yaklaşık 3.7 GiB. Swap yok.
- Git kurulu; Docker henüz kurulu değil. TCP 22 dışında dış arayüzlerde dinleyen servis görülmedi. DNS ve zaman servislerinin yerel dinleyicileri mevcut.
- Bu aşama yalnız erişim ve salt-okunur envanter kontrolüdür. Sunucu güncellemesi, firewall değişikliği, Docker kurulumu, site/veri aktarımı veya DNS/TLS değişikliği yapılmadı.

## Güncel durum — sunucu hazırlığı tamamlandı, site henüz taşınmadı

Kullanıcı sıra olarak önce sunucu hazırlığını, ardından site/veri aktarımını ve en son domain/Cloudflare bağlantısını seçti. Cloudflare hesabı var; bu pakette hesap/DNS erişimi kullanılmadı.

- Ubuntu'nun uygulanabilir güncellemeleri kuruldu. Önceden başlamış otomatik güncellemenin dpkg kilidi bitene kadar beklendi; paket işlemi zorla kesilmedi. Yeni çekirdek `7.0.0-38-generic` ile yeniden başlatıldı; boot ID değişimi ve yeni SSH girişi doğrulandı.
- Docker Engine `29.9.0`, Compose plugin `v5.6.0` resmî apt deposundan kuruldu. Docker API yalnız Unix socket'te; TCP yönetim portu açılmadı. Ubuntu kullanıcısı docker grubuna eklenmedi; yönetim sudo üzerinden.
- SSH anahtar girişi açık; PasswordAuthentication/KbdInteractiveAuthentication ve doğrudan root SSH girişi kapalı. Linux kullanıcı parolası ve KVM erişimi değiştirilmedi. Etkin SSH yapılandırması ve yeniden başlatma sonrası anahtarlı giriş doğrulandı.
- UFW IPv4/IPv6 etkin: gelen bağlantı varsayılan deny, giden allow; TCP 22/80/443 ve UDP 443 izinli. PostgreSQL/Directus veya diğer teknik servis internete açılmadı.
- Docker iptables backend kullanıyor. WAN `ens3` üzerinden DNAT ile gelen container trafiği DOCKER-USER → FIZYO-WEB zincirinde özgün hedef portuna göre filtreleniyor. TCP 80/443, UDP 443 ve established/related dönüşler korunur; diğer yayımlanan portlar düşürülür. Yalnız kendi zincirimiz yönetilir. Docker ExecStartPost kancası kuralları her daemon başlangıcında idempotent uygular; IPv4/IPv6 zincirleri boot ve Docker restart sonrasında test edildi.
- Container logları `local` sürücüyle sıkıştırmalı `10m × 3` rotasyon kullanıyor. Journald kalıcı log sınırı 150M, geçici log sınırı 50M, retention 14 gün. Bu değerler bütün disk/DB/upload kullanımına sınır koymaz.
- 2 GiB swap `/swapfile`, izin 600/root; fstab ile boot'ta açılıyor, swappiness 10. Otomatik Ubuntu güvenlik güncelleme timer'ları etkin; otomatik reboot kapalı. Docker üçüncü taraf apt origin'i otomatik upgrade kapsamına eklenmedi.
- Boş uygulama dizini `/opt/furkantoplu` (ubuntu:ubuntu, 750); config yedekleri `/var/backups/furkantoplu/provision-20261009T184937Z` (root erişimi). Bu, uygulama/veritabanı yedeği değildir; gerçek veri yedekleri ve periyodik restore/retention taşıma aşamasında kurulacak.
- Son kontrolde yaklaşık 33 GB boş disk; 3.7 GiB RAM ve 2 GiB swap, saat NTP senkron. Başarısız systemd birimi ve dpkg audit hatası yok; reboot ihtiyacı yok. Beş paket Ubuntu phased rollout nedeniyle bekliyor (`libopeniscsiusr`, `open-iscsi`, `openssh-client`, `openssh-server`, `openssh-sftp-server`); kademeli dağıtım zorlanmadı.

### Gerçek kurulum/ağ testleri

- `bash -n` iki script için geçti, Docker daemon config doğrulandı. Resmî hello-world çalıştı; Compose geçici Nginx fixture'ı healthy oldu ve container'ın dış DNS/HTTPS erişimi geçti.
- Dış bilgisayardan TCP 80 ve 443 HTTP 200 döndürdü. 443 test fixture'ında **plaintext HTTP** idi; bu TLS/sertifika testi değildir. SSL ve gerçek HTTPS domain bağlama aşamasına kaldı.
- Docker'da bilerek yayımlanan 8080 portu localhost'tan çalıştı ama dışarıdan timeout oldu; FIZYO-WEB DROP sayaçları arttı. Localhost'a bağlı 8055 de dışarıdan erişilemedi. Docker restart sonrası 80 çalıştı, 8080 kapalı kaldı; hook birikmedi.
- Bu bilgisayarda IPv6 varsayılan rota yok. Sunucuda IPv6 UFW/Docker zincirleri etkin, ancak dış IPv6 erişimi doğrulanmış sayılmıyor. İlk domain kaydı A/IPv4 olacak; doğrulanmadan AAAA eklenmeyecek.
- Fixture container/ağı ve iki test imajı kesin isimlerle kaldırıldı. Docker'da kalan container/image/volume/build cache yok. Uygulama veya kullanıcı verisi silinmedi. Son dinleyici kontrolünde public TCP yalnız SSH 22; web portları izinli ancak henüz site container'ı yok.
- 75 Node regresyon testi geçti (7 yeni hazırlık testi dahil). Frontend/admin/DB çalışma dosyaları değiştirilmedi; pixel QA veya gerçek sitenin VPS/TLS testi yapılmış gibi raporlanmaz.

### Kurulum dosyaları ve operasyon

`deploy/vps/bootstrap-vps.sh` yalnız gözden geçirilmiş boş Ubuntu 26.04 amd64 hedefinde çalışır; canlı container varsa durur. Managed sistem dosyalarını yedekler, mevcut authorized_keys/host keys ve paket configlerini ezmez. `deploy/vps/*` Git'te LF tutulur. `preflight.compose.yaml` gerçek production dosyası değildir ve sürekli çalıştırılmamalı.

Uzun paket işleri SSH bağlantısına bağlı kalmadan systemd altında çalıştırılır. Tekrar uygulama gerekiyorsa önce mevcut uygulama ve unit durumunu incele; körlemesine yeniden çalıştırma. Günlük/sonuç örneği:

```bash
sudo systemctl show fizyoterapi-prepare-vps -p ActiveState -p SubState -p Result
sudo journalctl -u fizyoterapi-prepare-vps --no-pager
```

İlk çalıştırmada systemd-run kontrol bağlantısı paketlerin D-Bus yenilemesi sırasında kapandı; hazırlık unit'i devam etti ve success + VPS_PREPARATION_COMPLETE ile bitti. Gelecekte başlatıcıda `systemd-run --no-block` kullan, sonucu journal/unit üzerinden ayrı izle. Transient unit reboot sonrası yoktur; kalıcı SSH/Docker/firewall dosyaları ve yedekler durur.

SSH erişim sorunu olduğunda önce KVM'de ubuntu hesabını kullan. SSH anahtar veya host key dosyalarını değiştirmek/silmek yerine `sudo sshd -t`, `sudo sshd -T`, `sudo ufw status verbose` ve journal ile tanıla. Yalnız bu projeye ait SSH drop-in'i gerektiğinde KVM'den yedek konuma taşıyıp config testi sonrası ssh.service reload etmek mümkündür; root SSH açılmaz. Firewall Docker kancasını kaldırmak bütün daemon ayarını/kuralları silmek anlamına gelmez.

## Bağlantı

Anahtar agent'a yüklenmişken bu bilgisayardaki bağlantı:

```powershell
ssh -i "C:\Users\Lenovo\.ssh\furkantoplu_vps" -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=yes ubuntu@149.56.103.60
```

`BatchMode=yes` etkileşimsiz kontroller içindir; agent'ta anahtar yoksa parola sormak yerine başarısız olur. Kullanıcı anahtarı kendisi yüklerken parolayı yerel terminalde girer. `ssh-add` diğer sunucu anahtarlarını silmez; `ssh-add -D` kullanılmaz. Ortak SSH config ve mevcut başka sunucu bağlantıları değiştirilmedi.

Sunucu anahtarı KVM üzerinden alınan, kullanıcı tarafından paylaşılan parmak iziyle karşılaştırıldı. Windows `known_hosts` kaydı ve ağdaki gerçek SSH el sıkışması aynı ED25519 anahtarı doğruladı. `StrictHostKeyChecking=no` veya körlemesine host kabulü kullanılmadı.

Windows OpenSSH 9.5'in `ssh-keyscan` aracı bu sunucuda `unsupported KEX method sntrup761x25519-sha512@openssh.com` hatası verdi. Bu, gerçek SSH girişinin çalışmadığı anlamına gelmiyor. Kimlik kontrolünde yalnız o tanılama komutuna `KexAlgorithms=curve25519-sha256` verildi; kalıcı SSH ayarı değiştirilmedi. Son gerçek giriş bu override olmadan da başarılı oldu.

## Sıradaki işler — site ve domain için henüz yapılmadı

1. Yerel PostgreSQL ve `directus_uploads` için tutarlı yedek/aktarımı hazırla. Yalnız container imajı içerikleri ve yöneticileri taşımaz. `.env`, anahtarlar, oturum/uygulama sırları Git'e girmez.
2. Production Compose/Caddy yapılandırması ve gerçek `SITE_PUBLIC_URL=https://furkantoplu.com` değeriyle derleme/çalıştırma hazırla. Mevcut localhost düzenini bozma; HTTPS oturum çerezi `secure` olmalı. TLS öncesi özel yönetim testi yalnız SSH tünelinden yapılmalı, public HTTP'den parola girilmemeli.
3. Cloudflare zone durumunu kullanıcıyla netleştir. Namecheap nameserver değişikliğinden önce mevcut DNS/mail kayıtlarını koru. A kaydını VPS'ye yönlendir; IPv6 test edilmeden AAAA yayımlama.
4. Origin HTTPS ve Cloudflare Full (strict) kur; admin/API önbellek dışı kalsın. TLS gerçekten çalışmadan siteyi teslim edilmiş veya yayında diye raporlama.
5. Üç dil, admin/TOTP, medya, 404, sitemap/robots ve yedekten geri yüklemeyi doğrula. Düzenli yedek/retention ve disk takibini tamamla.

## Resmî başvuru kaynakları

- [OVH ilk VPS girişi](https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/starting-with-a-vps)
- [OVH KVM erişimi](https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/using-kvm-for-vps)
- [Ubuntu için Docker kurulumu](https://docs.docker.com/engine/install/ubuntu/)
- [Docker iptables port filtreleme](https://docs.docker.com/engine/network/firewall-iptables/)
- [Docker local log sürücüsü](https://docs.docker.com/engine/logging/drivers/local/)
- [Ubuntu otomatik güvenlik güncellemeleri](https://documentation.ubuntu.com/security/security-updates/)
- [Cloudflare nameserver kurulumu](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)
- [Namecheap DNS seçimi](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/)
