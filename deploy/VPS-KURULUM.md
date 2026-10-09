# VPS erişimi ve yayın hazırlığı

## Doğrulanan durum — 9 Ekim 2026

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

## Bağlantı

Anahtar agent'a yüklenmişken bu bilgisayardaki bağlantı:

```powershell
ssh -i "C:\Users\Lenovo\.ssh\furkantoplu_vps" -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=yes ubuntu@149.56.103.60
```

`BatchMode=yes` etkileşimsiz kontroller içindir; agent'ta anahtar yoksa parola sormak yerine başarısız olur. Kullanıcı anahtarı kendisi yüklerken parolayı yerel terminalde girer. `ssh-add` diğer sunucu anahtarlarını silmez; `ssh-add -D` kullanılmaz. Ortak SSH config ve mevcut başka sunucu bağlantıları değiştirilmedi.

Sunucu anahtarı KVM üzerinden alınan, kullanıcı tarafından paylaşılan parmak iziyle karşılaştırıldı. Windows `known_hosts` kaydı ve ağdaki gerçek SSH el sıkışması aynı ED25519 anahtarı doğruladı. `StrictHostKeyChecking=no` veya körlemesine host kabulü kullanılmadı.

Windows OpenSSH 9.5'in `ssh-keyscan` aracı bu sunucuda `unsupported KEX method sntrup761x25519-sha512@openssh.com` hatası verdi. Bu, gerçek SSH girişinin çalışmadığı anlamına gelmiyor. Kimlik kontrolünde yalnız o tanılama komutuna `KexAlgorithms=curve25519-sha256` verildi; kalıcı SSH ayarı değiştirilmedi. Son gerçek giriş bu override olmadan da başarılı oldu.

## Sonraki uygulama sırası — henüz yapılmadı

1. Güncellemeleri ve yeniden başlatma ihtiyacını kontrol et; normal erişim çalışırken KVM kurtarma yolunu açık tut.
2. Resmî Docker apt deposuyla Engine/Compose kurulumu yap; sınırlı log ve disk kullanımı ayarla.
3. SSH/HTTP/HTTPS erişimini IPv4 ve IPv6 için değerlendir. Docker'ın yayımlanan portlarının UFW kurallarını aşabildiğini hesaba kat. PostgreSQL'i yayımlama; Directus teknik portunu localhost'ta tut.
4. Yerel PostgreSQL ve `directus_uploads` için tutarlı yedek/aktarımı hazırla. Yalnız container imajı içerikleri ve yöneticileri taşımaz. `.env`, anahtarlar, oturum/uygulama sırları Git'e girmez.
5. Production Compose/Caddy yapılandırması ve gerçek `SITE_PUBLIC_URL=https://furkantoplu.com` değeriyle derleme/çalıştırma hazırla. Mevcut localhost düzenini bozma; HTTPS oturum çerezi `secure` olmalı.
6. Cloudflare hesap/zone durumunu kullanıcıyla netleştir. Namecheap nameserver değişikliğinden önce mevcut DNS/mail kayıtlarını koru. A kaydını VPS'ye yönlendir; IPv6 test edilmeden AAAA yayımlama.
7. Origin HTTPS ve Cloudflare Full (strict) kur; admin/API önbellek dışı kalsın. TLS gerçekten çalışmadan siteyi teslim edilmiş veya yayında diye raporlama.
8. Üç dil, admin/TOTP, medya, 404, sitemap/robots ve yedekten geri yüklemeyi doğrula. Düzenli yedek/retention ve disk takibini tamamla.

## Resmî başvuru kaynakları

- [OVH ilk VPS girişi](https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/starting-with-a-vps)
- [OVH KVM erişimi](https://docs.ovhcloud.com/en/guides/bare-metal-cloud/virtual-private-servers/using-kvm-for-vps)
- [Ubuntu için Docker kurulumu](https://docs.docker.com/engine/install/ubuntu/)
- [Cloudflare nameserver kurulumu](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)
- [Namecheap DNS seçimi](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/)
