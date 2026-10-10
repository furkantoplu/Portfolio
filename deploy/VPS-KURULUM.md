# VPS erişimi ve yayın hazırlığı

## Güncel frontend — 10 Ekim 2026 / Paket 56: Kırpmasız fotoğraf ve responsive çerçeveler

- Kullanıcı fotoğrafın tamamını göstermeyi, dik fotoğrafta kenar boşluğu olmasını ve ortak kart ölçülerini açıkça onayladı. Sorun tekrar eden400 değil, gerçek Vinext Image fill bileşeninin inline cover varsayılanıydı. CSS'teki contain tek başına bunu ezemiyordu. Ortak SiteImage artık default inline contain/center uygular, özel hero objectPosition=center bottom gibi explicit stiller korunur. Yükleme/publish/visibility/alt/sizes/priority/lazy/medya silme sistemi değişmedi.
- Blog kartları240px ortak kutu; featured görsel contain ve nötr zemin, fotoğrafı büyüten hover yok. Article cover image ve caption ayrı akışta, desktop genişlik en çok1100px/yükseklik320–620px, telefon yüksekliği300–440px. Son yüklenen `public-design.css` de güncellendi:240px kutu kuralı ve article image width100%/aspect-ratio:auto. İlk fit1 kabulünde bu katmanın190px ve16/9 override'ı fark edildi, fit2 ile tamamlandı. Geometrinin gerçek browser'da ölçülmesi yalnız kaynak regex testiyle yetinilmesini önledi.
- İki ayrı kontrollü release: `fit-20261010-01` (kaynak e300c00, imajfit1), ardından `fit-20261010-02` (kaynak0b920d5, son imajfit2). Son image ID `sha256:85600949a684c9d4db23f4a61ca848e378157a6bf9f54aa1d90dfd793e890514`, runtime node. İki pakette source/image strict SHA256 kontrolü geçti. AppData release ve VPS `.releases` transferlerinde env/DB/user/upload dosyası yok; yalnız Git kaynak dosyaları ve imaj. Önce private Docker preflight, sonra iki Compose dosyasıyla --no-deps frontend recreate.
- Config/source yedekleri `/var/backups/furkantoplu/photo-fit-20261010-01` ve `photo-fit-20261010-02`, root700/dosyalar600. Son env yalnız FRONTEND_IMAGE=fit2; önceki media1/fit1 imajları korunur. PostgreSQL/Directus/Caddy yeniden başlatılmadı; content/translation/hesap/TOTP/sessions/medya değiştirilmedi. Yerel frontend de aynı kaynaklarla rebuild; DB'ler ayrı kalır.
- Gerçek browser: desktop1440 ve telefon390/360 istek ölçüleri; scrollbar nedeniyle içerik1425/375/345px. Ana sayfa iki blog kartı masaüstünde aynı621.4×567.45px, görsel240px/contain. Mobil kart görsel259.2×240px; viewport scrollWidth=clientWidth, yatay taşma yok. Blog listesi/detayı contain/center ve JPEG yüklemesi gerçek. Article desktop img1098.4×620px (figure1100), telefonda337.6×370.875 ve307.2×342px, caption static. Sayfa aşağı kaydırılıp fotoğrafın tamamı görsel olarak da incelendi; seçili error/warn logları boş.
- Canlı6 çalışma alanında fotoğraf yoktu. Bu nedenle production kaydı oluşturmak yerine `workarea-photo-preview.mjs` ile gerçek Areas/PracticeDetail/Image ve mevcut local stylesheet kullanılarak yalnız loopback9123 fixture oluşturuldu. Yayındaki seçili JPEG salt okunur aktarıldı; sahte önizleme metinleri yalnız bu localhost belleğinde, gerçek CMS/DB/Git content'e yazılmadı. Fotoğraflı kartlar ortak ölçülü/contain; mobil detay339.2×300px ve taşmasız375px, fotoğraf tam görünür. Bu fixture testini canlıda yeni çalışma alanı fotoğrafı yükleme/CRUD kabulü olarak sunma.
- 100 Node testi/TypeScript ve production build geçti. Final domain media/blog-images/practice-images/vps-deployment/languages HTTP kontrolleri; statik portrait optimizer ve private ports/canonical/admin koruması korunur. Yerel önizleme sunucusu ve iki volumesiz VPS preflight container test sonunda kapatıldı; eski image/yedekler tutuldu, broad prune yapılmadı. Viewport override sonrasında reset edilir, test tabları kapatılır.

Fotoğraflı çalışma alanı görünümünü veri değiştirmeden tekrar kontrol etmek için local8080 frontend açıkken:

```powershell
node scripts/tests/workarea-photo-preview.mjs "/site-media/YAYINLANMIS-FOTOGRAF-UUID"
```

Fixture `http://localhost:9123/` liste ve `/preview` detay; argüman exactUUID olarak doğrulanır, mevcut public JPEG gerekir. Ctrl+C ile kapat. Görseli üretimden silme/yeniden bağlama veya test için public çalışma alanı açma gerekmez. Gerçek admin upload/delete kabulü ve düzenli/off-server backup ayrı kalan işlerdir.

## Güncel frontend — 10 Ekim 2026 / Paket 55: CMS görsel 400 düzeltmesi

- Kullanıcı teşhis ardından uygulamayı açıkça onayladı. Ortak `frontend/app/components/site-image.tsx` exact `/site-media/<UUID>` kaynaklarını `unoptimized` ile mevcut public medya route'undan gösterir. Ana sayfa hero/about/kartlar, Hakkımda, blog sayfa/list/detay ve çalışma alanı sayfa/list/detay aynı bileşeni kullanır. Alt/fill/priority/lazy/style/contain/visibility korunur. Admin private asset önizlemesi/QR bileşeni, Directus yayın erişimi ve fiziksel medya temizliği değişmedi. Framework optimizer veya SVG/type güvenlik allowlist'i gevşetilmedi.
- Kaynak commit `b9b41cc`, yeni imaj `fizyoterapist-frontend:vps-20261010-media1`; image ID `sha256:e8d1c1b83d02d5f3c053baf7ccb77dacb22ce96f944041d96dad5c2752787ddf`, runtime node, yaklaşık101MB. İmaj ve yalnız10 ilgili Git dosyasının kaynak arşivi `.releases/media-20261010-01` üzerinden aktarıldı. SHA256 image `2235a8cb5a82353d2e598d22d21509a954f2dc90632f86c289a81be6bd805fbe`; kaynak `be04fee78d05cd1866b6f20b06190f4a88233a5edaafa4254a1674c1669f3e3a`. Yerel release AppData/fizyoterapi-deployments altında, Git/OneDrive dışında; secret/DB/hesap/upload dosyası transfer edilmedi.
- Önce yalnız loopback3001 ve mevcut private Docker ağında geçici `furkantoplu-media-preflight-20261010` açıldı; gerçek Directus içeriği salt okunur kullanıldı. Yüklenmiş JPEG ham200,61993bayt; ana sayfa/blog/yazı detail `<img src=/site-media/UUID>` doğru, statik portre optimizer200. Bu fixture'a yeni dosya/hesap/içerik yazılmadı; kabul sonrası container kaldırılır, volume yok.
- Eski frontend imajı `vps-20261010` tutuldu. Önceki `.env` ve frontend kaynak yedeği `/var/backups/furkantoplu/media-fix-20261010-01` root700/dosyalar600. `.env` yalnız FRONTEND_IMAGE alanı değişti; source tar yalnız ilgili dosyalara çıkarıldı. `up -d --no-deps frontend` ile yalnız frontend recreate edildi. PostgreSQL/Directus/Caddy yeniden başlatılmadı; veri/upload/TOTP/sessions restore veya silme yapılmadı. HTTPS iki Compose dosyası, Secure cookie ve Full(strict) aynı kalır.
- İlk kaynak digest satırında elle kopyalama biçim hatası warning verdi; strict doğrulama yerel gerçek hash'ten otomatik üretildi ve kaynak extract öncesi geçti. İlk imaj selector sed'i `.env` değerinin tek tırnaklı biçimini eşleştirmedi; `ps` eski imajı gösterince açık doğrulama/biçim düzeltmesiyle yeni imaja geçildi. İlk salt-okunur son SSH kontrolünde tek reset görüldü; sonraki bağlantı yeniden kontrol edilir. Bu durumlar veri silme veya uygulama source hatası değildi.
- 98 Node regresyon ve TypeScript geçti. Mevcut boş Next config annotation'ı geniş Next/Vinext env tip uyuşmazlığı veriyordu; `satisfies NextConfig` ile runtime config değeri aynı tutularak daraltıldı. Yeni4 gerçek Vinext Image renderer testi CMS direct URL, layout/a11y/loading, statik optimizer ve tüm public import yüzeylerini doğrular. `media-smoke` artık desteklenmeyen optimizer'ı çağırmak yerine gerçekten render edilmiş img URL'sini ve Directus/proxy JPEG/PNG/WebP imza/bayt eşitliğini denetler.
- Gerçek HTTPS medya/blog/practice/deployment/languages/https/account-access smoke'ları geçti; browser blog liste→detay JPEG yüklemesi complete=true,862×1320 ve seçili error/warn logları boş. Yeni Node runtime'ın CMS `/_next/image?...` endpoint'i doğrudan çağrılırsa hâlâ400 verir; bu uygulamada artık o isteği üretmiyoruz. Eski açık sayfa Ctrl+F5 ile yenilenmelidir. Büyük CMS dosyaları orijinal baytlarıyla gelir; özel resize/WebP hattı bu pakette kurulmadı.

Canlı operasyon hâlâ `sudo docker compose --env-file .env -f compose.vps.yaml -f compose.vps.https.yaml ...`. Kontrollü geri dönüş gerekirse yalnız FRONTEND_IMAGE eski etikete alınır ve frontend recreate edilir; DB restore/seed/volume silme yok. Eski kaynak arşivi ayrıca tutulur; ilerideki sır/env değişikliklerini eski tam `.env` ile körlemesine ezme. Bu yedekler periyodik DB/upload/off-server backup yerine geçmez. Yerel frontend de aynı kaynaklarla rebuild edildi, yerel DB ayrı/korunur.

## Güncel durum — 10 Ekim 2026 / Paket 54: Cloudflare ve gerçek HTTPS aktif

Site `https://furkantoplu.com`, Türkçe yönetim `https://furkantoplu.com/bakir`. Kullanıcı Namecheap→Custom DNS adımını yaptı; 1.1.1.1/8.8.8.8 NS sorguları `daisy.ns.cloudflare.com` / `elliot.ns.cloudflare.com` döndürdü. Yetkili Cloudflare DNS'inde apex/www A yanıtları proxy adresleri; canlı yanıtta `CF-RAY` ve `Server: cloudflare` var. Önceki Namecheap parking kayıtlarının yerini VPS'ye giden proxied A ve www CNAME aldı. MX/TXT/mail değişikliği bu paket kapsamında yapılmadı. DNSSEC ekranında kapalıydı; Cloudflare DNSSEC daha sonra ayrı DS eşlemesiyle ele alınacak. Dış IPv6 doğrulanmadığından AAAA eklenmedi.

- Kullanıcı SSL/TLS ekranı başlangıçta **Full** gösterdi. VPS cert hazırlığı için ayrı 503/no-store Caddy yapılandırması açıldı; upstream uygulama/admin yoktu. Port80 yalnız ACME HTTP-01 ve HTTPS yönlendirmesi için. Cloudflare TLS-ALPN geçirmediğinden bu challenge kapalı; DNS API tokenı veya Origin CA özel anahtarı kullanıcıdan istenmedi. İki alan için Let’s Encrypt sertifikası başarıyla alındı. Doğrudan149.56.103.60→alan adı/SNI curl doğrulaması `--insecure` olmadan geçti; bootstrap beklenen503 döndü. Ardından public siteye geçildi.
- Origin sertifikaları apexYE1/wwwYE2 issuer, SAN doğru; geçerlilik10Ekim2026 12:03UTC–8Ocak2027 12:03UTC. `caddy_data` kalıcı volume'de; Caddy otomatik yenilemesi aktif, gerçek ileri tarih yenileme henüz gözlenmiş sayılmaz. HTTP challenge/port80 erişimi ve volume korunmalı. Sertifika özel anahtarları okunmadı/loglanmadı/Git'e alınmadı.
- Kullanıcı **Full(strict)** seçip kaydettiğini bildirdi; bundan sonra canlı HTTPS tekrar200. Dashboard/API üzerinden ayar ayrıca okunmadı; kullanıcı teyidi ve doğrulanmış origin/edge bağlantısı kaydedilir. HTTP→aynı path/query HTTPS308, wwwHTTPS→apexHTTPS308 çalışır. IP adresinden sertifika eşleşmesi beklenmez; site domain üzerinden açılır.
- `compose.vps.https.yaml` base ile birleşir: ports `!override` (Compose>=2.24.4) ile eski8080 kalkar, yalnız IPv4TCP80/443 veUDP443 public olur. Directus8055 loopback, DB5432/frontend3000/adminCaddy2019 internal kalır. Secure cookie true override gerçek Directus env üzerinden doğrulandı. Gerçek kullanıcı login response çerez/TOTP kabulü henüz yapılmadı.
- `deploy/Caddyfile.vps` private proxy güvenlik başlıkları ve aynı method/path API allowlist'ini korur. Regresyon testi iki route gövdesinin eşitliğini zorunlu tutar. `/bakir` no-store/noindex, API no-store; gerçek Cloudflare cevapları DYNAMIC ve HIT değil. Cloudflare hesabında ayrıca Cache Rule eklenmedi/okunmadı; ileride Cache Everything kuralı eklenirse admin/API bypass mutlaka korunmalı.
- Eski config ve `.env` `/var/backups/furkantoplu/https-20261010` root700/dosyalar600 altında. Yedekleme ilk izin adımında ubuntu'nun root dizinindeki wildcard'ı açamaması nedeniyle durdu; kesin dosya yollarıyla düzeltildi, o anda servis değişikliği henüz yapılmamıştı. Dosya/sır içeriği çıktıya yazılmadı. DB/hesap/TOTP/upload/içerikler restore edilmedi veya silinmedi; yalnız Directus/proxy recreate edildi, frontend imajı aynı kaldı.
- 94 Node regresyon geçti. Gerçek HTTPS domaininde vps-deployment, languages, practice-catalogue, account-access, public-design, hero-portrait ve vps-https smoke geçti: 16 sayfa,18 alan detayı,404,canonical/hreflang/sitemap/robots, gizli dosya404,optimizer200, dış8055/8080 engeli, anonymous401/403, HTTP/www yönlendirmeleri ve CF cache koruması. Yeni smoke ilk kez var olmayan `/website-content/session` yolunu401 sanıyordu;404 doğruydu, test mevcut korumalı translation endpoint'e düzeltildi. Uygulama endpoint'i eklenmedi.
- Gerçek tarayıcı kontrolü: mobil menüden Hakkımda, dil menüsünden English, İngilizce custom404→ana sayfa ve canlı admin giriş formu açıldı. Seçili geçişlerde yakalanan JavaScript error/warn logları boştu. Beklenen404/oturumsuz401 HTTP durumları uygulama çökmesi değildir. Gerçek kullanıcı parolası/TOTP girilmedi; kapsamlı her viewport/pixel testi yapılmış sayılmaz.

### Canlı operasyon — iki Compose dosyası zorunlu

```bash
cd /opt/furkantoplu
sudo docker compose --env-file .env -f compose.vps.yaml -f compose.vps.https.yaml ps
sudo docker compose --env-file .env -f compose.vps.yaml -f compose.vps.https.yaml up -d
```

`VPS_CADDYFILE` bootstrap override'ı aktif oturumda bırakılmaz; normal default `./deploy/Caddyfile.vps`. Base-only `up` private staging'e geri döner ve Secure=false olabilir; normal operasyonda kullanılmaz. Site artık eski HTTP8080/9090 tünelinden açılmaz. SSH ve KVM erişimi korunur; yerel8080 ayrı geliştirme DB'sidir.

HTTPS sorunu halinde önce Caddy logları/sertifika ve iki dosyalı Compose config testi incelenir. Certifikayı/sırları/volume'leri silme, `down -v`, seed veya restore yapma. Gerekirse public upstream'i kapatmak için yalnız proxy'yi `VPS_CADDYFILE=./deploy/Caddyfile.tls-bootstrap` seçeneğiyle recreate ederek HTTPS503 bakımına al; Directus secure ayarı ve veri korunur. Private staging'e geri dönüş yalnız public proxy kapatılarak ve kullanıcıya HTTP tünelinin güvenli sınırı açıklanarak yapılabilir.

### Teslim öncesi hâlâ kalanlar

1. Kullanıcı kendi parola/Google Authenticator koduyla canlı admin girişi, oturum yenileme ve fotoğraf upload/replace/delete kabulünü yapmalı. Gerçek sırlarla Codex giriş/OTP üretimi yapılmadı.
2. Telefon/WhatsApp/e-posta/konum ve mesleki/gerçek içerikler kontrol edilmeli; site üzerinde örnek iletişim değerleri hâlâ görülüyor. E-posta domain satın alındığı için kendiliğinden çalışan posta kutusu değildir. Blog çevirileri ayrıca yayımlanır.
3. Düzenli uygulama/DB/upload/secret backup, retention/off-server ve restore provası tamamlanmalı. Şimdiki root config ve ilk migration snapshot'ları periyodik yedek değildir.
4. Cloudflare cache bypass kurallarını dashboard'da açıkça teyit etmek, DNSSEC/DS ve Search Console/sitemap gönderimi ayrı son kontrollerdir. “Tam teslim” bu kabul maddeleri bitmeden söylenmez.

Aşağıdaki Paket53/52 kayıtları geçmiş özel staging aşamasıdır; güncel bağlantı/Compose komutları yukarıdadır.

## Güncel durum — 10 Ekim 2026 / Paket 53: VPS'ye taşıma tamamlandı

Kullanıcı bu turda hassas paket aktarımını açıkça onayladı. Paket strict host kontrolüyle SSH/SCP üzerinden `149.56.103.60` hedefine gönderildi. Domain/Cloudflare/TLS değişmedi; bu **özel staging** kurulumudur, henüz public domain yayını değildir.

- Kaynak arşivi `68b5736`, üretim etiketi `fizyoterapist-frontend:vps-20261010`; VPS Node imaj kimliği `sha256:ca823662972d6165533f8bd8ce360f297a768d54d9f759d31dc975f75a488005`. Runtime kullanıcısı node; Node standalone çalışıyor, Wrangler dev kullanılmıyor. PostgreSQL/Directus/Caddy yereldeki aynı sürümlerle çalışır.
- Transfer manifestindeki sekiz dosyanın SHA256 kontrolü geçti. `fizyoterapi-restore.service` oneshot/RemainAfterExit olarak başarıyla tamamlandı, journal `PRIVATE_VPS_TRANSFER_COMPLETE` işaretini verdi. SSH kopsa da restore bağımsız çalışır. Yeniden başlatma sonrası transient unit geçmişi kaybolabilir; container restart policy ve volume'ler kalıcıdır. Bu unit'i dolu DB üzerine tekrar çalıştırma.
- PostgreSQL custom dump gerçek boş hedefe single-transaction ile restore edildi. 14 tablonun kaynak/hedef parmak izleri aynı: hesaplar/parola hashleri/TOTP, rol/policy/access, içerikler/çeviriler/medya metadata dahil. Uygulama secret hash ve upload byte manifest eşit. İki yönetici, altı alan, üç blog, altı sayfa ve 22 çeviri korundu. Upload files0 mevcut durumdur; statik portreler imajda. Kaynak veri/hesap değiştirilmedi. Yalnız hedefe kopyalanan dört eski session silindi; yeni giriş gerekir.
- Dört servis çalışıyor; database/directus/frontend healthy, proxy HTTP kabulü geçti. VPS RAM anlık yaklaşık: frontend66MiB, Directus224MiB, PostgreSQL40MiB, Caddy14MiB; toplam disk boşluğu31GB. Bunlar anlık ölçüm, kapasite/yoğun trafik garantisi değildir.
- Hostta yalnız SSH22 public dinliyor; web127.0.0.1:8080 ve Directus127.0.0.1:8055. DB5432/frontend3000 internete yayımlanmıyor. Dış bilgisayardan8055/8080 erişimi başarısız, tünelden site başarılı. HTTP staging olduğu için Caddy'nin TLS/HTTP2/HTTP3 uyarıları beklenen durumdur; origin HTTPS henüz kurulmadı.
- `/opt/furkantoplu/.env` root600; `.migration` ubuntu700, özel bundle dosyaları600. İlk geri dönüş paketi ayrıca `/var/backups/furkantoplu/migration-20261010-a94723c2a8` root700 altında korundu. Yerel özel yedek bilgisayarda kalır; bu off-server kopya da OneDrive/Git dışındadır. Sunucunun tek diskindeki ikinci kopya disk arızasına karşı ayrı off-server yedek değildir. Periyodik uygulama backup/retention ve geri yükleme provası yayın öncesi tamamlanmalı; bu pakette timer kurulmadı.

### Özel siteyi bilgisayardan açma

Codex'in geçici test tüneli/sekmesi test sonunda kapatılır; VPS container'ları çalışmaya devam eder. CMD veya PowerShell'de aşağıdaki komutu çalıştır, terminali açık bırak:

```powershell
ssh -i "C:\Users\Lenovo\.ssh\furkantoplu_vps" -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o ExitOnForwardFailure=yes -o ServerAliveInterval=30 -N -L 127.0.0.1:9090:127.0.0.1:8080 ubuntu@149.56.103.60
```

Anahtar agent'ta değilse yerel passphrase prompt'u çıkabilir; özel anahtar/parola sohbete yazılmaz. Başarılı `-N` tüneli terminalde sessiz bekler. Tarayıcı: `http://localhost:9090/`, admin: `http://localhost:9090/bakir`. Bunlar yerel8080 sitesi değil, VPS'e şifreli tünellenmiş bağlantıdır. Giriş için mevcut e-posta/parola ve Google Authenticator kodu kullanılır; gerçek OTP testi kullanıcı tarafından yapılmalı. Ctrl+C yalnız tüneli kapatır, VPS sitesini durdurmaz.

İçerik düzenlemelerini artık VPS panelinde yap. Yerel8080 ile VPS9090 ayrı DB'lerdir; yerelden yeni dump ile VPS verisinin üzerine yazma. Sonraki deploy'lar mevcut volume'leri korumalıdır; `down -v`, seed ve `restore-initial.sh` tekrar çalıştırılmaz.

### Gerçek kabul testleri

- 91 Node regresyon testi geçti. SSH tünelinden gerçek Caddy/Directus/Node zincirinde languages, practice-catalogue, public-design, account-access, hero-portrait ve media smoke geçti. Üç dil ana/list/about/contact, altı hizmetin18 detayı, blog ve yasal sayfalar, custom404, sitemap/hreflang, portre contain ve no-image kartlar doğrulandı.
- `vps-deployment-smoke.mjs`: production canonical/robots URL'leri `https://furkantoplu.com`, proxy güvenlik başlıkları, admin no-store/noindex, `.env/runtime.env/database.dump/.migration` yolları404, gerçek Node image optimizer200, dış8055/8080 kapalı. İlk test SSR'de password input varsaydı; admin formu client-rendered olduğundan test shell kontrolüne düzeltildi. Site kodunda değişiklik gerektiren hata değildi.
- Gerçek in-app browser artık erişilebildi: mobil menü→Hakkımda, yanlış URL→404→Blog→yazı→ana sayfa, ana dil dropdown TR→EN→DE akışları çalıştı; yakalanan error/warn logları boştu. Admin yükleme shell'inden giriş formuna geçti; e-posta/parola/6hane OTP alanları görüldü. Bu yalnız seçili viewport/akışların kontrolüdür, kapsamlı desktop/mobile pixel QA veya gerçek kullanıcı OTP login/CRUD testi değildir.
- Published uploaded file yok; media smoke bunu açıkça bildirdi. Raw/optimized statik portre ve gerçek Directus runtime kullanıcısının upload dizinine yazma izni test edildi. VPS'te yeni dosya upload/replace/delete gerçek kullanıcı kabulü henüz yapılmadı. HTTP testindeki yetkisiz POST/PATCH/DELETE girişimleri401/403 beklenen sonuçları verdi; gerçek içerik silinmedi, yönetici hesabı eklenmedi.

### Yayın öncesi kalanlar

1. Kullanıcı özel VPS panelinde gerçek parola/OTP girişi ve bir içerik/görsel düzenleme kabul testi yapar. Canlı telefon/WhatsApp/e-posta/konum verileri son kez doğrulanır; blog EN/DE çevirileri ayrıca yayımlanmadıkça listelenmez.
2. Düzenli DB/upload/appsecret yedek, retention/off-server kapsamı ve restore provası tamamlanır. Şimdiki iki lokasyondaki ilk snapshot geçmiş başlangıç durumudur, yeni editleri otomatik yedeklemez.
3. Cloudflare zone/mevcut DNS/mail kayıtları incelenir; Namecheap nameserver ve A kaydı kullanıcıyla bağlanır. IPv6 dış ağ testi yokken AAAA eklenmez.
4. Origin sertifikası/HTTPS + Cloudflare Full(strict), admin/API cache bypass ve secure cookie=true; domain üzerinden üç dil/admin/medya/404/SEO kabulü yapılır. TLS doğrulanmadan public admin girişi açılmaz.

## Taşıma hazırlığı — 10 Ekim 2026 / Paket 52

**Yerel paket hazır; VPS'ye henüz dosya/veri aktarılmadı.** Hedefte yalnız boş `/opt/furkantoplu/.migration/20261010-a94723c2a8` dizini oluşturuldu. Güvenlik denetimi hassas aktarımı durdurdu; DB, yönetici parola hashleri/TOTP anahtarları ve uygulama sırrının `149.56.103.60` hedefine gönderilmesi için açık kullanıcı onayı bekleniyor. Red başka araç/betikle aşılmaz.

- Yerel Compose ve Dockerfile korunur. `frontend/Dockerfile.vps` / `vite.vps.config.ts` ayrı Node standalone üretim imajı oluşturur; VPS'de Wrangler geliştirme sunucusu kullanılmaz. Non-root runtime, `fizyoterapist-frontend:vps-20261010`, yaklaşık100MB. Public üç dil rotaları,404,görsel optimizasyonu/sitemap yerel üretim container'ında HTTP ile doğrulandı. Geçici test container'ı kaldırıldı, imaj/yedek ve yerel site korunur.
- `compose.vps.yaml`: PostgreSQL16, Directus12.4, Node frontend, Caddy; kaynak sınırları ve yalnız loopback8080/8055. İlk kabul testi SSH tünelinden; public HTTP admin login açılmaz. Ayrı cookie adı local oturumuyla çakışmayı önler. Secure cookie şimdilikfalse, HTTPS yayında true zorunlu. Seed/admin hesabı oluşturma yok; mevcut DB restore edilir.
- Tutarlı snapshot için kaynak proxy/Directus kısa süre durduruldu, finally tekrar başlatıldı. İlk checksum yardımcı komutu hatası düzeltildi; yeni tam yedek başarılı. Kaynak veri/volume silinmedi. Tam özel yedek `C:\Users\Lenovo\AppData\Local\fizyoterapi-backups\20261010-a94723c2a8`; OneDrive/Git dışında kullanıcı/SYSTEM ACL korumalı. Önceki eksik paket kullanılmaz.
- Envanter:2 yönetici,6 çalışma alanı,3 blog,6 sayfa,22 çeviri. Uploaded file kayıtları ve volume boş olduğundan boş upload checksum beklenir. Statik portreler kaynak/imajda. Gerçek uygulama secret korunur, VPS PostgreSQL parolası yeni rastgeledir; sırlar log/Git/notlara yazılmaz. SSH özel anahtarı aktarılmaz.
- `prepare-vps-migration.mjs` snapshot; `package-vps-migration.mjs` Git HEAD kaynak arşivi, Docker image save ve SHA256 manifest üretir. Kaynak arşivi68b5736; kullanıcı untracked prototip görselleri eklenmedi. `restore-initial.sh` yalnız boş hedefe restore eder,14 tablo parmak izi/upload byte hash/appsecret hash karşılaştırır, yalnız hedef kopya session'larını iptal eder. Betik VPS'de henüz çalıştırılmadı. Dolu hedefe kör retry veya DB/volume silme yok.
- 91 Node regresyon geçti; üretim frontend'in Caddy olmayan doğrudan portundaki API404 tam sistem kabulü sayılmaz. Gerçek restore/proxy/admin/TOTP/medya testleri ve periyodik backup henüz yapılmadı. DNS/nameserver/Cloudflare/sertifika değişmedi; site yayında değildir.

Onaydan sonra: SSH/SCP özel paket → checksum/boş hedef kontrolü → image load/restore → özel tünel testleri → düzenli yedek/retention → domain/origin HTTPS/Cloudflare Full(strict). Kaynak yerel site çalışmaya devam eder.

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

## Önceki aşama — 9 Ekim 2026: host hazırlığı tamamlandı

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

## İlk host hazırlığı sonundaki kontrol listesi — güncel sonuçlar üsttedir

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
