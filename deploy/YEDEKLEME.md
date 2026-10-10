# VPS yedekleme — ilk küçük paket

## Geri yükleme kanıtı — 10 Ekim 2026 / Paket 59

`20261010T153341Z` yedeği aynı VPS'teki ayrı, ağsız PostgreSQL16 container'ına gerçekten geri yüklendi.40 public tablonun tüm COPY satırları arşivden türetilen sayım/sıralamadan bağımsız SHA256 parmak izleriyle eşleşti.1 fotoğraf (61993bayt) ayrı özel klasöre çıkarıldı; byte hash'i ve `directus_files` dosya/boyut eşleşmesi geçti. Test11.3s sürdü; geçici container/tmpfs DB/veri/parola/çıkarılan dosyalar kaldırıldı. Canlı DB'ye yazılmadı, servisler yeniden başlatılmadı; HTTPS200 teyit edildi.

Bu, **bu yedeğin şema/veri ve fotoğraf geri yükleme testidir**. Bütün web uygulamasını başka sunucuda açma, yönetici/Google Auth ile giriş veya felaket kurtarma tatbikatı değildir. Runtime/imaj arşivleri önceki checksum/tar kontrolünden geçti; burada yeni TLS/Directus/frontend instance'ı açılmadı. Aynı VPS yedeği hâlâ ayrı yerde yedek değildir.

### Manuel test komutu

```bash
sudo /usr/local/sbin/furkantoplu-restore-check 20261010T153341Z
```

Argüman, var olan `.complete` işaretli yedeğin UTC klasör adıdır; serbest dosya yolu kabul edilmez. Yedek silinmişse bu örnek çalışmaz. Backup ile aynı kilit tutulur; aktif backup varsa test reddedilir. En az1.5GiB kullanılabilir RAM,384MiB tmpfs test DB ve en fazla512MiB çıkarılmış medya sınırı vardır; veri büyüdüğünde test kapasitesi ayrıca planlanır. Üretim `restore-initial.sh` değildir ve onun yerine kullanılmaz.

Test hedefi yayınlanmış port, üretim Docker ağı veya üretim DB/uploads mount'u almaz; ağnone, read-only rootfs,0.75CPU/768MiB memory/no-container-swap/pids100 sınırları vardır. PGDATA tmpfs kullanır; host swap'ı mümkün olduğu için adli anlamda güvenli imha garantisi verilmez. Yalnız kendi label/containerID ve canonical mktemp `/run/furkantoplu-restore-check.*` hedefleri temizlenir; mevcut yedek/volume'ler silinmez. Başarısız SQL detayları yalnız root erişimli `/var/backups/furkantoplu/restore-checks/<UTC-random>/` loglarında kalır; terminale özel satır/hash/şifre/TOTP yazılmaz. Başarılı rapor da burada kalır.

Test aracındaki6 regression senaryosu COPY kaçış/boş/duplicate/truncated akış, sıradan bağımsız/duplicate satır hash'i, fotoğraf byte roundtrip, traversal/symlink/hardlink/device retleri, DB dosya/boyut/storage eşleşmesi ve explicit pg_restore SQL çıktı hedefini kapsar. İlk denemenin restore'u geçti ama arşiv→SQL incelemesinde eksik `--file=-` yüzünden karşılaştırma durdu; düzeltildi ve tam gerçek test sonra geçti. Eski başarısız denemeler gerçek yedek arızası diye raporlanmaz.

Tekrar çalıştırma manuel ve gözetimlidir; kalıcı restore timer'ı eklenmedi. SIGTERM/normal hata cleanup trap'i vardır; ani SIGKILL/host çökmesinde otomatik temizlik garantisi yoktur, leftover fixture label/path kontrol edilmelidir. İzole hedef kaynakları yetersizse canlı veriyi silerek alan açılmaz.

Dayanaklar: [pg_restore](https://www.postgresql.org/docs/16/app-pgrestore.html), [Docker none ağı](https://docs.docker.com/engine/network/drivers/none/), [tmpfs sınırları](https://docs.docker.com/engine/storage/tmpfs/).

---

Bu düzen yalnız `/opt/furkantoplu` üretim kurulumu içindir. Yerel geliştirme DB'sini, DNS/Cloudflare hesabını veya SSH anahtarını değiştirmez. **Tek sunucudaki yedek, sunucu/disk kaybına karşı ayrı yerde yedek değildir.**

## Zaman ve kapsam

- `furkantoplu-backup.timer`: Türkiye saatiyle her gün 04.15 (en fazla bir dakikalık zamanlayıcı hassasiyeti). VPS saati UTC olsa da takvim açıkça `Europe/Istanbul` kullanır.
- `Persistent=true`: sunucu kapalıyken kaçırılmış çalıştırma, timer tekrar açıldığında yapılabilir; bu yüzden açılışta da kısa içerik kesintisi olabilir.
- `/var/backups/furkantoplu/daily/<UTC-zaman>/`: yalnız root erişimi; klasör700, yeni dosyalar600. HTTPS üzerinden servis edilmez, Git'e girmez, bu pakette sunucu dışına gönderilmez.
- `database.dump`: PostgreSQL16 custom-format şema/veri yedeği; yönetici hash/TOTP ve içerikleri de içerir. `uploads.tar.gz`: orijinal fotoğraflar ve mevcut varyantları.
- `runtime.tar.gz`: özel `.env`, iki VPS Compose dosyası, `deploy/` ve Directus extensions (node_modules hariç). `frontend-image.tar.gz`: çalışan frontend imajı. `images.txt`: servis imaj kimlikleri/registry digestleri. PostgreSQL/Directus/Caddy imajları günlük arşivde değildir; yeniden kurulum için registry erişimi veya ayrıca imaj kopyası gerekir.
- TLS özel anahtarları, SSH anahtarları, tüm host dosya sistemi ve dış hizmetler yedek kapsamına alınmaz. Caddy yeni kurulumda sertifika edinmelidir; DNS/80/443 erişimi ayrıca hazırlanır.

## Tutarlılık ve başarısızlık

İmaj/config paketlemesi servisler çalışırken yapılır. Ardından yalnız Directus kısa süre durur; DB ve uploads aynı yazımsız pencerede alınır. Bu sırada panel, medya ve CMS isteyen public istekler kısa süre kesilebilir. PostgreSQL, frontend ve proxy durdurulmaz. İşlem boyunca manuel deploy, migration veya doğrudan DB/upload yazımı yapılmamalıdır; kilit yalnız yedekler arasındaki çakışmayı önler.

Başlamadan önce servis sağlığı, upload volume bağlaması ve disk alanı kontrol edilir; tahmini çıktı alanının yanında en az2GiB boşluk bırakılır. Veri büyüdükçe bu koruma yedeklemeyi başarısız bırakabilir; sınırsız disk garantisi değildir. Daha önce durdurulmuş servis kendi kendine açılmaz: normal yedek başlangıcı sağlıklı Directus gerektirir.

EXIT/TERM/INT kurtarması ve systemd `ExecStopPost`, yalnız betiğin işaretlediği aynı Directus container'ını açıp sağlıklı olmasını bekler. Container deploy ile değişmişse körlemesine açmaz. Kurtarma başarısızsa `/run/furkantoplu-backup/directus-stopped` kalır ve sonraki normal yedek reddedilir. `/run` reboot'ta temizlenir; Docker restart policy servisleri açar.

Başarılı arşivlerde `pg_restore --list`, tar okuma ve SHA256 kontrolü yapılır; sonrasında `.complete` işareti ve atomik klasör adı değişimi gelir. **Arşivi okumak gerçek geri yükleme testi değildir.** Paket59'da seçili ilk yedek için ayrı gerçek restore testi yapıldı; her gece yeni yedeğin otomatik restore edildiği anlamına gelmez. Hatalı `.partial-*` kopyalar tanı için kalır; otomatik başarılı retention'a girmez ve elle incelenmelidir.

Format/geri yükleme araçları için [PostgreSQL16 pg_dump dokümanı](https://www.postgresql.org/docs/16/app-pgdump.html). Bu projede DB snapshot'ına ek olarak dosya ve runtime arşivleri gerekir; yalnız imaj taşımak içerikleri yedeklemez.

## Saklama

Son **7 başarılı çalıştırma** saklanır; bu kesin7 takvim günü değildir. Yalnız bu araç tarafından oluşturulmuş tarihli, doğru `.complete` işaretli ve gerekli dosyaları bulunan doğrudan alt klasörler silinir. Symlink, eksik/partial, elle alınmış migration/provision/photo-fit ve kardeş klasörler korunur. Fotoğraf silinse bile eski yedek, süre dolana kadar geçmiş kopyasını tutar; güvenli veri imhası garantisi verilmez.

## Kontrol komutları (VPS SSH terminali)

```bash
sudo systemctl list-timers furkantoplu-backup.timer
sudo systemctl show furkantoplu-backup.service -p Result -p ExecMainStatus
sudo journalctl -u furkantoplu-backup.service -n 30 --no-pager
sudo systemctl start furkantoplu-backup.service
```

Manuel çalıştırma aynı saklama politikasına dahildir ve kısa içerik kesintisi yapar. Başarısız işte önce log/servis sağlığı ve disk kontrol edilir. Aktif iş bitmeden manuel kurtarma/deploy yapılmaz. Gerekirse:

```bash
sudo systemctl stop furkantoplu-backup.timer
sudo /usr/local/sbin/furkantoplu-backup --recover
```

Gerçek DB'ye `pg_restore`, `restore-initial.sh`, `down -v` veya volume silme komutu uygulanmaz. Gerçek kurtarma/değişim ayrı kullanıcı kararı gerektirir. Şu an dışarıya hata bildirimi yoktur: başarısızlık unit/journal üzerinden görünür. Seçili yedeğin izole restore kanıtı Paket59'da alındı; ayrı yerde şifreli kopya ve hata bildirimi sonraki işlerdir.
