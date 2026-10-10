# VPS yedekleme — ilk küçük paket

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

Başarılı arşivlerde `pg_restore --list`, tar okuma ve SHA256 kontrolü yapılır; sonrasında `.complete` işareti ve atomik klasör adı değişimi gelir. **Arşivi okumak gerçek geri yükleme testi değildir.** İzole restore denemesi sonraki küçük pakettir. Hatalı `.partial-*` kopyalar tanı için kalır; otomatik başarılı retention'a girmez ve elle incelenmelidir.

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

Gerçek DB'ye `pg_restore`, `restore-initial.sh`, `down -v` veya volume silme komutu uygulanmaz. Geri yükleme önce izole hedefte test edilir; ayrı kullanıcı kararı gerekir. Bu ilk pakette dışarıya hata bildirimi yoktur: başarısızlık unit/journal üzerinden görünür. Ayrı yerde şifreli kopya, restore kanıtı ve hata bildirimi sonraki işlerdir.
