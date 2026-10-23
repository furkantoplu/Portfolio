# Directus 12.4.0 — Node 22.23.4 güvenlik runtime'ı

## 23 Ekim 2026 — sonuç: `fixed` (canlı Directus Node runtime'ı)

Canlı Directus içindeki Node **22.23.2 → 22.23.4** geçirildi. Frontend zaten 22.23.4'tü, yeniden oluşturulmadı. Directus sürümü 12.4.0, uygulama dosyaları, mevcut hesap/parola/TOTP/token, DB ve upload volume'leri korunur. Host/genel geliştirme Node'u ve yerel `compose.yaml` bu pakette değiştirilmedi.

Etkilenen sınır, Directus işlemlerinin kullandığı Node ikilisinin yerleşik Brotli decoder'ıdır (`CVE-2026-111497`, [resmî Node duyurusu](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases), [22.23.4 sürümü](https://nodejs.org/en/blog/release/v22.23.4/)). İncelenen body-parser 1.20.8 yalnız gzip/deflate/identity işler, `br` gövdeyi reddeder; bu projede anonim HTTP isteğinden RCE'ye ulaşan yol kanıtlanmadı. Diğer decoder/fetch çağrıları için istismar edilebilirlik açık sorudur. Yama seçimi, bu belirsizliği istismar iddiasına çevirmeden, bütün Directus Node süreçlerini upstream yamalı ikiliye taşır. Sadece sürüm etiketi veya Brotli 1.1.0 raporu kanıt sayılmadı.

Canlı imaj `fizyoterapist-directus:12.4.0-node22.23.4`, ID `sha256:34e18500287fb46d6390705309adcfa801853ee3519d44983d18acefee9de2f9`. Kaynaklar:

- `deploy/directus-node.Dockerfile`: digest-pinned Alpine/musl runtime katmanı.
- `compose.vps.yaml`: yalnız Directus image satırı değişir; HTTPS overlay birlikte kullanılmaya devam eder.
- `deploy/vps/rollout-node-runtime.sh`: eski imaj/Compose hash guard'ı, yedek kilidi, özel image arşivi, hesap güvenlik parmak izi karşılaştırması ve hata halinde yalnız Directus rollback. Tek seferlik bu yayın içindir; tekrar uygulanacak genel deployment aracı değildir.
- `deploy/vps/node-runtime-test.compose.yaml` ve `scripts/tests/run-directus-node-fixture.sh`: portsuz/internal/tmpfs uyumluluk ortamı.
- `scripts/tests/directus-node-runtime.test.mjs`, `directus-node-runtime-smoke.mjs`, `directus-node-fixture-smoke.mjs`: regresyon/runtime/native iş akışı kontrolleri.

### Sıralı doğrulama kapıları

1. **Kaynak/sözdizimi/build — geçti.** `git diff --check`, üç yeni `.mjs` için `node --check`, iki shell scripti için `bash -n`; VPS'te `docker build -f deploy/directus-node.Dockerfile -t fizyoterapist-directus:12.4.0-node22.23.4 .`. Kullanıcı, workdir, entrypoint ve command base ile aynı; `/directus` dosya ağacı hash'i her iki imajda `84382e696f08c626c788faf7f66afe9338568f29207cfd462fa5924b63bcb818`.
2. **Güvenlik için odaklı ikame — geçti.** Eski imaj kesin runtime kapısından beklendiği gibi 22.23.2 ile geçemedi. Yeni imajın Node binary SHA256'sı sabit digest'li resmî donor ile birebir eşleşti; 22.23.4/ABI127 ve upstream backport `BROTLI_DECODER_ERROR_FORMAT_BLOCK_SWITCH=-17` doğrulandı. Ağsız/read-only `docker run ... --entrypoint node ... --input-type=module < scripts/tests/directus-node-runtime-smoke.mjs` geçerli sync/stream Brotli ve kesilmiş/geçersiz girdileri test etti. Exploit/RCE payload'u çalıştırılmadı; savunmasız runtime artık mevcut değil, uygulama üzerinden gerçek RCE reproduksiyonu yapılmış sayılmaz.
3. **Normal kullanım/regresyon — geçti.** `node --test scripts/tests/directus-node-runtime.test.mjs scripts/tests/admin-tfa.test.mjs scripts/tests/image-upload.test.mjs scripts/tests/media-cleanup.test.mjs scripts/tests/vps-runtime.test.mjs`: **25/25**. `sudo bash /tmp/furkantoplu-nodepatch-20261023-01/scripts/tests/run-directus-node-fixture.sh`: native parola/TOTP, setup öncesi erişim reddi, eski oturum reddi, login/refresh/logout; sahte görüntü reddi, JPEG/PNG/WebP upload ve DB/registry/disk temizliği; public içerik geçti. Test kullanıcısı/dosyaları temizlendi; fixture container/ağı kaldırıldı. İlk fixture denemelerindeki root-owned tmpfs ve logout'ta eksik `mode:session` yalnız test kurulumu hatalarıydı; production izinleri veya auth kodu gevşetilmedi.
4. **Kontrollü yayın/canlı — geçti.** Önce `sudo systemctl start furkantoplu-backup.service`: `Result=success`, çıkış0, tamamlanmış yedek `/var/backups/furkantoplu/daily/20261023T081402Z` (11.14 Türkiye). Ardından tek seferlik rollout scripti çalıştı. Yalnız Directus recreate; diğer üç container ID aynı. Hesap güvenlik alanlarının önce/sonra parmak izi aynı (değerler/sırlar yazdırılmadı). Servis healthy; `/proc/*/exe` üzerinden dört gerçek Node executable'ın hash'i yamalı binary ile eşleşti. `TEST_SITE_URL=https://furkantoplu.com node scripts/tests/{public-design,media,blog-sharing,practice-sharing}-smoke.mjs` dosyalarının her biri ayrı çalıştırıldı ve geçti: üç dil/genel sayfalar/404, gerçek yüklenmiş görselin proxy byte eşitliği, altı blog ve 18 alan/dil kartı. Anonim GET blog/alan özel koleksiyonları403; admin-team/account401. Gerçek production hesabıyla yeni oturum yazılmadı; giriş/native workflow canlı ayarların scrub edilmiş kopyasında sınandı.

Bağımsız sınır incelemesi ve tek aday review döngüsü yapıldı. Reviewer'ın yerel özel imajın kurtarılabilirliği ve fixture cleanup'ta hata sonrası DB bağlantısının kapanması konuları kaynakta doğrulanıp giderildi; ilgili kontroller tekrar geçti. Frontend build/typecheck bu backend binary-only paketi için yeniden çalıştırılmadı; frontend kaynak/image değişmez. Tam yeni güvenlik taraması veya tüm bağımlılıkların temiz olduğu iddiası yok. Yerel terminal Node26.4.0 ve yerel Docker Directus runtime'ı ayrı küçük pakette güncellenecek.

Bu imaj yalnız `/usr/local/bin/node` ikilisini digest-pinned resmî Node Alpine3.24 imajından alır. Directus12.4.0 uygulama ağacı, native addonlar, kullanıcı, giriş komutu ve üretim volume'leri korunur. Debian/glibc Node ikilisi Alpine/musl içine kopyalanmaz. Node22 ABI127 kalır. Ayrı npm/apk paketlerinin tüm güvenlik açıklarını düzelttiği iddia edilmez.

## Yeniden kurma / geri yükleme

Üretim Compose artık `fizyoterapist-directus:12.4.0-node22.23.4` bekler. Docker Hub'da bu yerel etiket yoktur. Başka makinede Compose'u başlatmadan önce repo/runtime yedeğindeki bu tarifle imajı üret:

```sh
docker build -f deploy/directus-node.Dockerfile -t fizyoterapist-directus:12.4.0-node22.23.4 .
```

Alternatif: yayın sırasında root-only saklanan özel `directus-node22.23.4.tar.gz` arşivinin SHA256 değerini kontrol et, sonra `gzip -dc directus-node22.23.4.tar.gz | docker image load` ile içe al. Geri dönüş klasörü `/var/backups/furkantoplu/node-runtime-20261023-01`; arşiv/parmak izi ve önceki Compose burada saklanır. Eski upstream imaj da rollback için tutulur; eski sürüme dönüş güvenlik riskini geri getirir ve ancak başarısız yayını kurtarmak içindir.

**Günlük yedek yalnız frontend imajını içerir; özel Directus imajını içermez.** `runtime.tar.gz` deploy tarifini taşır, dolayısıyla registry erişimi varsa yeniden build mümkündür. Sunucu dışı yedek planlanırken ayrıca özel imaj arşivini de taşı veya imajı bu sabit digest kaynaklarından yeniden üret. Aynı VPS'teki arşiv sunucu kaybına karşı bağımsız yedek değildir. Registry'ye imaj yayınlanmadı.

## Odaklı kontroller

`scripts/tests/directus-node-runtime-smoke.mjs` imaj içinde stdin üzerinden çalışır; kesin Node22.23.4/ABI127, upstream CVE backport sabiti, CMS12.4.0, Sharp JPEG/PNG/WebP ve geçerli/bozuk Brotli girdilerini denetler. Resmî donor binary SHA256 eşitliği ve uygulama ağacı hash eşitliği ayrıca ölçülür. Bu, gerçek RCE payload'u çalıştırmak değildir.

`scripts/tests/run-directus-node-fixture.sh` root ile **yalnız izole test kopyasında** çalışır. Production DB'den salt okunur pg_dump akışını yeni boş tmpfs DB'ye geri yükler. API başlamadan yalnız kopyada gerçek oturumları siler; hesapların parola/e-posta/TOTP/token ve adlarını NULL yapıp hepsini askıya alır. Dosyalardaki yabancı anahtarları bozmamak için kimlik satırlarını korur. Ağ internal, uploads tmpfs, production ağı/volume/port yok. `directus-node-fixture-smoke.mjs` DB kimliğini ve kopyalanmış hesaplarda giriş bilgisi kalmadığını doğrulamadan yazmaz. Native parola/TOTP/refresh/logout, korumalı API, JPEG/PNG/WebP yükleme ve DB+disk dosya temizliği test edilir. Testlerin sırları yazdırılmaz; başarısızlıkta da fixture kaynakları kaldırılır.
