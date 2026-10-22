# Fizyoterapist Web Sitesi — Geliştirme Günlüğü

## 22 Ekim 2026 — Küçük paket: çalışma alanı detaylarının paylaşımı

- Kullanıcı sıradaki çalışma alanı paketinden devam etmemizi istedi. Yalnız `calisma-alanlari/[slug]/page.tsx` metadata bağlantısı ve yeni `practice-sharing.ts` yardımcısı değişti; blog helper/ana sayfa CSS'i/arayüz metinleri değiştirilmedi. Yeni bağımlılık, admin alanı, DB kaydı, medya kopyası veya görsel tasarımı eklenmedi.
- Alan SEO başlık/açıklaması öncelikli, boş veya whitespace değerlerde aynı dilde başlık/özet/giriş yedeği var. `contentLanguageLinks` ve gerçek güncel `area.slug` ile canonical/og:url üretilir; mevcut dil alternates ve eski URL redirect davranışı korunur. OG türü `website`, X kartı `summary_large_image`; alanlar blog makalesi veya uydurma tarih/mesleki iddia olarak tanımlanmaz.
- Görünür fotoğraf varsa aynı origin public yolu kullanılır; dış kaynak fetch edilmez. Yok/gizli/geçersiz/dış fotoğraf veya büyük varsayılan portre PNG'si için mevcut 600×600 JPEG yedek olur. Sadece bilinen JPEG için gerçek boyut/MIME yazılır. Gizli fotoğrafın alt metni ortak portreye taşınmaz. Bu pakette özel kapakların otomatik küçültülmesi ve ayrı admin paylaşım resmi ayarı yoktur.
- 5 yeni practice-sharing testi + 5 blog-sharing + 8 public-design + 2 practice-urls olmak üzere 20 yerel test geçti. TypeScript ve hedef lint, smoke syntax/diff kontrolü başarılı. Kaynak kıyaslamasında önceki canlı alan dosyası Git HEAD ile normalize birebir aynıydı; iki yeni kaynak SCP sonrası SHA256 eşleşti. Diğer yöneticilerin CMS değişikliklerine dokunulmadı.
- VPS kaynağının izole kopyasında Linux üretim build geçti; Node base digest önceki paketle aynı `de170b39439eb0e5a3444ad7d60b015614a381e10fecae2e30ec9e735122f38d`, lock/package değişmedi. Portsuz etiketli private preview ile 18 gerçek dil adresinde WhatsApp/Meta/X user-agent başına ilk HTML head içinde tek doğru paylaşım seti, gerçek dil/başlık/özet/URL ve public görsel 200/MIME doğrulandı. Her dilde 6 alan var, hiçbirinde şu an fotoğraf yok; fotoğraflı/gizli senaryo birim testinde sınandı, gerçek CMS'ye test fotoğrafı eklenmedi. Üç dilde bulunmayan alan 404 ve paylaşım kartı olmayan HTML üretir.
- Ortak backup lock altında root-only `/var/backups/furkantoplu/practiceshare-20261022-01` önceki env/alan sayfası kaynaklarını saklar; helper önce yoktu. Önceki blogshare1 image korunur. Kaynak/env/config kontrolünden sonra yalnız frontend recreate edilip healthy doğrulandı; hata halinde env/page/helper/eski image rollback trap'i hazırdı, gerekmedi. Canlı imaj `fizyoterapist-frontend:vps-20261022-practiceshare1`, ID `sha256:d89a6de6ce270768fd7f92e5ad83a585161c1109c0b215d15c67b05ce109e3c8`.
- Canlı HTTPS üzerinde 18 alanın üç crawler testi, altı blog dil rotasının önceki paylaşım testi ve public-design genel sayfa/portre/ana sayfa rengi/404 regresyonları çalıştırıldı. DB/Directus/medya/volume/Caddy/DNS/Cloudflare değişmedi. Crawler/HTTP başarısı gerçek WhatsApp uygulama kabulü değildir; kullanıcıya alan deneme bağlantısı verilir. Geçici preview ve kesin staging alanı temizlenir, root-only geri dönüş saklanır. Üç Obsidian mirror önceki dış notla eşitlik kontrolünden sonra senkronlanır, kullanıcı untracked fotoğrafları korunur.

## 22 Ekim 2026 — Küçük paket: blog detaylarının paylaşım etiketleri

- Kullanıcı kaldığımız yerden devam etmek istedi. Kalanlar sırasındaki paylaşım önizlemesi işi, yalnız blog detaylarını kapsayan küçük pakete ayrıldı; ana sayfa rengi ve diğer tasarım korunur. Open Graph resmî protokolü okundu: https://ogp.me/ . Görsel UI/tasarım veya yeni fotoğraf üretilmedi.
- `blog-sharing.ts` saf yardımcı fonksiyonu mevcut SEO başlık/açıklaması, özet/giriş, kapak, kapak alt metni, görünürlük ve kategoriden `article` OG/X kartı üretir. TR/EN/DE locale, yazının gerçek dil slug'ından canonical/og:url ve `summary_large_image` eşleşir. SEO boşluğu kırpılır, yedek açıklama aynı dilde özet/girişten gelir. Gerçek olmayan yayın/güncelleme tarihi eklenmez. Blog sayfası mevcut alternates dil bağlantılarını korur; eksik güncel dil slug'ı için gerçek post.slug kullanılır.
- Kapak mevcut ve görünürse aynı origin public yolu kullanılır; URL metadata olarak üretilir, helper dış kaynağa istek atmaz. Kapak yok/gizli/dış/geçersizse veya varsayılan büyük beyaz önlük PNG'siyse mevcut 600×600 JPEG portreye düşer; boyut/MIME yalnız bilinen fallback için yazılır. Gizlenen kapağın alt metni paylaşım yedeğine taşınmaz. Ayrı admin paylaşım alanı ve özel yüklemelerin otomatik küçük JPEG dönüşümü sonraki pakettir; bu tur DB/şema/medya/içerik yazımı yok.
- 5 yeni paylaşım testi + 8 mevcut tasarım testi, TypeScript, hedef lint ve smoke sözdizimi kontrolü geçti. Yeni `blog-sharing-smoke.mjs` public yayımlı listeyi her dilde okuyup WhatsApp/Meta/X user-agent'larıyla ilk HTML head içinde tek doğru OG/X setini, gerçek yazı URL/başlık/özet/locale'ini ve görselin public 200/MIME/gövdesini kontrol eder. Fotoğrafsız ve fotoğraflı iki gerçek yazı, toplam altı dil rotası sınandı; olmayan blog 404 ve article etiketsiz kalır. Taslak yayınlanmadı.
- İlk SSH denemesi timeout oldu; yerel iş sürerken sonraki salt okunur deneme başarılıydı. VPS eski blog kaynak içeriği Git HEAD ile normalize birebir eşleşti. Yalnız page.tsx ve yeni yardımcı dosya ayrı staging'e SCP edildi; SHA256 eşleşti. Mevcut VPS kaynağının kopyasında Linux Docker build geçti. Node 22 base etiketi bu build'de `sha256:de170b39439eb0e5a3444ad7d60b015614a381e10fecae2e30ec9e735122f38d` digest'ine çözüldü; package/lock sürümleri değiştirilmedi. Mevcut deprecated esbuild-kit ve nextConfig/plugin timing uyarıları ayrı işlerdir.
- Portsuz private preview konteynerinde altı gerçek blog rotasının üç crawler/görsel kontrolü geçti. Ortak backup lock altında root-only `/var/backups/furkantoplu/blogshare-20261022-01` eski env ve blog page.tsx kopyası alındı; yeni helper daha önce yoktu. Hata geri alma trap'i hazırdı, gerekmedi. Yalnız frontend image/source güncellenip Compose config kontrolü ve recreate/healthy uygulandı. İmaj `fizyoterapist-frontend:vps-20261022-blogshare1`, ID `sha256:c363a01f0c371f029cdc2e5e34ae9b21b7c6df4d7b53b936bb03f6098dd3e613`; eski homepaper1 saklanır. Canlı HTTPS üzerinde aynı altı rota ve mevcut public-design smoke geçti. Ana sayfa `#F3F0E8` kalır.
- Canlı servis/CMS/DNS/Cloudflare/admin giriş ayarları değiştirilmedi. Bu crawler/HTTP kabulüdür; WhatsApp uygulaması cihaz testi kullanıcıda bekler. Özel kapak görselleri orijinal boyutta kalabilir; önceki büyük dosya önizleme sorununu her özel yükleme için çözdüğümüz iddia edilmez. Yalnız kendi etiketli preview ve kesin staging yolu temizlenir; rollback dosyaları tutulur. Üç Obsidian notu, eşitlik kontrolü yapılmış mirror'dan güncellenir. Önceki PHP kontrolünün commit edilmemiş kendi günlük kaydı da korunur; kullanıcının üç takip edilmeyen görseline dokunulmaz.

## 22 Ekim 2026 — PHP2Shell duyurusunun bu siteye uygulanabilirlik kontrolü

- Kullanıcı dün gece duyurulan PHP açığının siteyi etkileyip etkilemediğini sordu. PHP'nin 21 Ekim resmî duyurusu okundu: `CVE-2026-109618` ve `CVE-2026-109619`, web isteği işleyen PHP kurulumlarında kimlik doğrulamasız uzaktan kod çalıştırma riski. Düzeltmeler 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35. Kaynak: https://www.php.net/archive/2026.php (21 Ekim güvenlik duyurusu); ikinci resmî teyit: https://www.cyber.gc.ca/en/alerts-advisories/al26-026-critical-vulnerabilities-impacting-php-cve-2026-109618-cve-2026-109619.
- Yalnız salt okunur envanter kontrolü yapıldı. VPS'te çalışan dört konteyner frontend `vps-20261021-homepaper1`, Directus 12.4.0, PostgreSQL 16-alpine ve Caddy 2.10-alpine. Host üzerinde kurulu PHP/Apache PHP modülü paketi, PATH'te PHP çalıştırıcısı veya PHP/Apache/httpd süreç adı bulunmadı. Dört konteynerin her birinde PATH'te PHP ve paket veritabanında kurulu PHP paketi bulunmadı. Proxy Alpine paket sorgusu eksik cache dizini uyarısı verdi; PHP paketi çıktısı üretmedi. Yerel Dockerfile/Compose kaynakları da Node.js/Directus/PostgreSQL/Caddy mimarisini doğrular.
- Sonuç: kontrol edilen fizyoterapi site altyapısında bu PHP açıklarının gerektirdiği çalışma zamanı görülmedi; bu iki açık için uygulanacak PHP güncellemesi veya siteyi kapatma gereği tespit edilmedi. Docker tek başına güvence değildir; kapsam dışılığı sağlayan, bu serviste PHP kullanılmamasıdır. Kullanıcının diğer kişisel sunucusu incelenmedi. Bu dar uygulanabilirlik/envanter kontrolüdür; tam güvenlik taraması, sızma testi veya hiçbir açık olmadığı garantisi değildir. Kod, bağımlılık, servis ayarı, CMS ve medya değiştirilmedi; yeniden başlatma/deploy yapılmadı. Kontrol notu yerel mirror ve Obsidian günlüğüne kaydedilir.

## 21 Ekim 2026 — İlk renk seçeneğinin canlıya uygulanması

- Kullanıcı `#F3F0E8` ilk seçeneğini seçip canlıya yayınlamayı onayladı. Önceki tek sayfa kapsamı korundu: `Home` kabuğunda `site-shell home-page`, CSS'te yalnız `.site-shell.home-page { --public-paper: #f3f0e8; }`. EN/DE rotaları aynı bileşeni kullandığından üç ana sayfa eşit; başka sayfa/admin/yeşil bölüm/kart, metin, fotoğraf ve CMS kayıtları değişmez.
- Yayın öncesinde VPS servisleri sağlıklı, disk 21 GB boştu. Yerel/VPS eski page.tsx aynı; CSS farkı yalnız CRLF/LF idi, normalize içerik birebir eşleşti. Yeni iki kaynak dosyası SCP sonrası SHA256 eşleşti. Mevcut VPS frontend kaynak kopyası `/tmp/furkantoplu-homepaper-20261021-01` içinde derlendi; bağımlılık/lock güncellenmedi. İmaj `fizyoterapist-frontend:vps-20261021-homepaper1`, ID `sha256:05202d6db5e31f8424339e47ebf37a86f3161b65ed8d98217130233fc969d9a1`.
- 8 tasarım testi geçti: ana sayfa sınıfı/yerelleştirme kapsamı, eski paletin diğer sayfalarda korunması, normal yazı renklerinin yeni zeminde en az 4.5:1 kontrastı ve mevcut responsive portre/kart sözleşmeleri. TypeScript ve page.tsx lint geçti. Linux Docker üretim build başarılı; mevcut nextConfig/plugin timing uyarıları hata değil. Portsuz özel preview konteynerinde 10 rota ve ana sayfa paylaşım JPEG yolu doğrulandı; dışa port veya yeni güvenlik yetkisi açılmadı.
- Ortak backup flock altında root-only `/var/backups/furkantoplu/homepaper-20261021-01` içine önceki `.env`, page.tsx ve public-design.css alındı; eski sharefix1 imajı tutulur. Yalnız FRONTEND_IMAGE ve iki frontend kaynak dosyası güncellendi. Compose config doğrulandı, yalnız frontend recreate edildi ve healthy oldu. Hata halinde kaynak/env/imaj geri alma trap'i hazırdı, gerekmedi. DB/Directus/volume/medya/Caddy/DNS/Cloudflare değiştirilmedi.
- Canlı smoke üç ana sayfada yeni sınıf ve CSS, altı genel sayfa 200, üç dilde kırpılmayan hakkında portresi ve özel 404'ü doğruladı. Gerçek IAB 1280 px görünümünde ana sayfa shell/navbar `rgb(243, 240, 232)`, yatay taşma yok. Hakkımda'ya geçince `#F7F5F0`/`rgb(247, 245, 240)` korunuyor. Ekran görüntüsü yerel görselleştirme alanında `home-paper-live-20261021.png`; gerçek mobil cihaz testi yapılmış sayılmaz.
- Yerel görsel karşılaştırma aracı üretim frontend'e eklenmez. Geçici portsuz preview/derleme alanı yalnız kendi kesin adı/etiketi/yolu doğrulandıktan sonra temizlenir; geri dönüş kopyası saklanır. DESIGN.md, işletim notu ve üç Obsidian mirror güncellenir; Obsidian önceki mirror ile eşitlik kontrolünden sonra senkronlanır. Kullanıcının üç takip edilmeyen görseli korunur.

## 21 Ekim 2026 — Ana sayfa için yerel zemin rengi karşılaştırması

- Kullanıcı iki tonu sırayla yalnız yerel ana sayfada denemeyi, seçimden sonra canlıya uygulamayı istedi. Kaynak public paper rengi `#F7F5F0`; `#F3F0E8` daha koyu/sıcak, `#FBFAF6` mevcut renkten daha açık. Ek fikir olarak `#EAE6DB` karşılaştırmaya eklendi. Yeni tasarım veya tüm site renk dönüşümü yapılmadı.
- `scripts/preview-home-colors.mjs` Node HTTP sunucusu 127.0.0.1:4175 üzerinde çalışır. Güncel public ana sayfa yalnız bir kez fetch edilir, site JS/modül preload'ları çıkarılır, public asset adresleri base URL ile çözülür; bellekteki HTML'e zemin değişkeni ve yerel karşılaştırma paneli eklenir. Üretim CSS'i, CMS, Docker/DB ve VPS'e yazılmaz. Sayfa geçişleri/formlar kapalıdır; bu kopya yalnız renk/görünüm değerlendirmesidir. İlk seçenek varsayılan, panelden dört ton arasında geçiş yapılabilir, panel gizlenebilir.
- Betik sözdizimi kontrolü ve üç renk URL'sinin beklenen CSS çıktısı geçti; /blog yerel önizlemede 404 olduğundan kapsam tek sayfadır. IAB'de fotoğraf/stiller ve panel görüntülendi, seçenekler arasında UI geçişleri gözlendi; ilk ve karşılaştırma görüntüleri yerel görselleştirme alanına kaydedildi. Yerel sunucu kullanıcı seçimi için açık tutulur. Asıl localhost:8080 uygulaması bu renkleri almadı. Seçim henüz verilmediğinden yeni bir canlı deploy veya GitHub push yapılmadı; deneme dosyası ve bu notlar yerel çalışma değişikliğidir.

## 21 Ekim 2026 — WhatsApp gerçek cihaz sonucu

- Kullanıcı, `/?paylasim=2` bağlantısında fotoğraf önizlemesinin gelip gelmediği sorusuna “Evet, fotoğraf göründü” yanıtını verdi. Ana sayfa için küçük JPEG düzeltmesinin gerçek WhatsApp kabulü tamamlandı olarak kaydedildi. Sadece bu bağlantı/cihaz denemesi doğrulandı; diğer diller, blog/alan detayları veya eski paylaşımların önbellek yenilenmesi ayrıca test edilmiş sayılmadı.
- Kalanlar ve proje özeti güncellendi; yeni kod, CMS, Docker veya Cloudflare işlemi yapılmadı. Obsidian mevcut üç notu değişiklik öncesinde mirror ile hash eşleşti. Kullanıcıya ait üç takip edilmeyen fotoğraf korunur; önceki 20 Ekim kayıtları tarihî işlem kanıtı olarak kalır.

## 20 Ekim 2026 — WhatsApp'ta fotoğraf görünmemesi

- Kullanıcı gerçek paylaşımda fotoğraf çıkmadığını bildirdi; async soruda başlık/açıklamanın geldiğini, yalnız fotoğrafın eksik olduğunu netleştirdi. Canlı WhatsApp/Meta UA 200 ve OG head doğru, challenge işareti yok; normal browser metadata streaming davranışı beklenendi. Mevcut OG fotoğrafı 1086×1448 şeffaf PNG, 1.329.199 bayt. `/_next/image?w=640&q=75` denemesi aynı bayt/boyutu döndürdü; optimizer'a yönlendirmek bu sorunu küçültmedi. Bu ölçüm WhatsApp'ın gerçek ret nedenini tek başına kanıtlamaz; ilk paketin gerçek cihaz kabulünün eksik olduğu doğrulandı. Kullanıcıda yazı çıktığı için link-preview kapalı ayarı veya genel streaming ayarı değiştirilmedi.
- `frontend/scripts/export-share-image.mjs`, mevcut resmi Sharp ile kırpmadan kareye sığdırıp açık zeminli 600×600 JPEG olarak dışa aktarır; yeni fotoğraf/AI yüz üretilmez. Çıktı `frontend/public/furkan-toplu-share-v1.jpg` 17.692 bayt, yerelde görsel olarak kontrol edildi. Boyut/200 KB üst sınırı ihracat betiğinde doğrulanır. Sharp zaten yerel bağımlılık ağacında var; yeni paket/lock değişikliği yok. Yeniden üretim: `node frontend/scripts/export-share-image.mjs`.
- Ana sayfa metadata'sı paketlenmiş eski portre yolunu küçük JPEG'e eşler; OG type=image/jpeg ve width/height=600 ekler. Yeni URL eski görsel URL'sini yeniden kullanmaz; kaynak hero görünümü aynı. Özel admin fotoğraf yolları önceki gibi kullanılır, onlar için otomatik küçük kopya ve ayrı OG alanı sonraki paket olarak açık. TypeScript, hedef ESLint, VPS build, üç dil özel önizleme ve canlı WhatsApp UA testleri geçti; gerçek JPEG imzası/boyutu ve GET/HEAD 200/type kontrol edildi. `/?paylasim=2` ilk head'de yeni görseli veriyor; kullanıcıdan cihaz testi istendi.
- Üç kaynak/asset blob'u SCP sonrası eşleşti: page `d1e05f240a00ef0996fc2c4079b7ee7bd7f778b0`, ihracat betiği `03ae0229fc563e8799de5aada6f38978add4a0f8`, JPEG `37362fe37abff1d3ef7f587f52f1b5036e91f1d2`. Yedekle ortak flock, root-only `/var/backups/furkantoplu/sharefix-20261020-01` kaynak/env ve eski share1 imajı korundu. Yalnız frontend `vps-20261020-sharefix1` ile healthy; imaj `sha256:64a0de17f36d9e5623e052f61099547aa2548e9063fc1d44c974622a9ffb9c11`. CMS/hesap/Cloudflare/DB aynı. Özel preview ve staging temizlendi; kullanıcı untracked fotoğrafları korunur.

## 20 Ekim 2026 — Küçük paket: ana sayfa fotoğraflı paylaşım etiketleri

- Kullanıcı bir küçük paket daha istedi. Kapsam yalnız `/`, `/en`, `/de` için mevcut ana fotoğrafla OG/X etiketleri; yeni yatay görsel üretimi, ayrı admin alanı ve diğer sayfa kartları bu pakete alınmadı. `frontend/app/page.tsx` metadata'sı CMS SEO başlığı/açıklaması, dile göre canonical URL, OG locale ve ana görsel/alternatif metnini kullanır. Boş açıklamada mevcut aynı dil girişine döner. Görsel adresi aynı origin ile sınırlandırılır; eksik/geçersiz yolda paketlenmiş Furkan portresi kullanılır. Hiçbir dış görsel fetch/proxy yüzeyi açılmadı.
- Yerel TypeScript ve hedef dosya ESLint geçti. Eski VPS page.tsx blob'u CRLF normalizasyonundan sonra Git bazına eşleşti (`4ff54f18d924face55bd6df79c2a4ffb42d6d380`). Yeni dosya SCP sonrası ham blob `84280f16568cb1acce51077b1dd1ad08fc4dd471` eşleşti. Linux Docker build `vps-20261020-share1` başarılı. Önizlemede ilk head kontrolü normal node user-agent ile metadata streaming nedeniyle başarısız oldu; Vinext'in desteklediği WhatsApp html-limited-bot davranışı kaynakta doğrulandı ve WhatsApp UA ile ilk HTML head etiketleri üç dilde geçti. Bu durum için framework ayarı değiştirilmedi.
- Yedekle ortak flock alınarak eski `.env`/page.tsx root-only `/var/backups/furkantoplu/share-20261020-01` altında 700/600 saklandı. Önceki adminsync1 imajı korundu; iki HTTPS Compose dosyasıyla yalnız frontend recreate edildi, healthy oldu. Yeni imaj `sha256:104f13a15265c3113ad46c719f211eadb548cca0cbed0445bbe218c80a5e13eb`. Canlı üç dilde WhatsApp isteği doğru URL/locale/OG/X, alt metin ve gerçek 200 PNG verdi; Meta ve Twitterbot istekleri de ilk head içinde OG görseli aldı. Admin/blog/alan sayfaları 200. Gerçek mesaj gönderilmedi, uygulama içi WhatsApp kartı/cache davranışı denenmedi.
- Mevcut fotoğraf `/furkan-toplu-hero-white-coat-v1.png`; tasarlanmış 1200×630 yatay kart değildir. Özel kart, admin override ve blog/alan kartları kalanlarda açık. DB, hesap, CMS metni, görseller ve Cloudflare ayarı değişmedi. Etiket ve canonical yolu doğrulanmış geçici preview/staging temizlendi; eski imaj/geri dönüş saklandı. Obsidian mirror güncelleme öncesi hash eşleşti; üç kullanıcı untracked görseli korunur.

## 20 Ekim 2026 — Küçük paket: yedi SEO açıklaması

- Kullanıcı limit nedeniyle küçük paket istedi. İlk iş olarak yalnız yedi boş SEO açıklaması seçildi; fotoğraflı paylaşım sonraki pakete bırakıldı. Canlı CMS kontrolünde home/areas/blog Türkçe SEO alanları ve home/areas EN/DE SEO alanları boştu. Mevcut giriş metinleri 40–180 karakter aralığında, aynı dilde ve açıklama olarak uygundu; yeni hizmet/unvan iddiası eklenmeden bu metinler kullanıldı.
- `scripts/content-updates/2026-10-20-seo-descriptions.sql` yalnız boş alanları hedefler, üç Türkçe+dört yayımlı çeviri sayısını ve geçerli giriş uzunluklarını denetler; tablo kilidiyle tek transaction kullanır. Önce ROLLBACK denemesi başarılı oldu. İlgili site_pages/website_content_translations tablolarının VPS içi root-only `/var/backups/furkantoplu/seo-20261020-01/before.dump` yedeği alındı ve pg_restore listesi doğrulandı; ardından SQL commit edildi. Bu otomatik migrasyon değildir; tekrar çalıştırılması mevcut dolu alanlar nedeniyle durur.
- Yedi hedef public URL 200 ve doğru dilde tek description verdi. Değiştirilmeyen EN/DE blog listeleri de mevcut açıklamalarla geçti; toplam dokuz sayfa kontrolü başarılı. Görünen gövde, görsel, hesap, yayın durumu, Docker, DNS/Cloudflare değiştirilmedi. Geniş test/build gerekmedi. Admin açıklamayı tekrar boşaltırsa kodda otomatik fallback işi hâlâ açık; bu paket yalnız mevcut CMS açıklamalarını tamamlar.
- Önceki turun commit edilmemiş 19 Ekim Kalanlar/özet/günlük notları kendi değişikliklerimiz olarak korunup bu paketle birlikte sürüm kontrolüne alınır. Obsidian'ın üç dosyası güncelleme öncesinde yerel mirror ile hash eşleşti. Kullanıcının üç takip edilmeyen görseli korunur; özel veritabanı yedeği Git'e alınmaz.

## 19 Ekim 2026 — Kalanlar notu ve fotoğraflı paylaşım işi

- Kullanıcı kalan işleri Obsidian fizyoterapi bölümünde ayrı bir yere yazmamızı ve WhatsApp benzeri yerlerde fotoğraflı paylaşım önizlemesini bu işlere eklememizi istedi. `04 - Kalanlar.md` oluşturuldu; fotoğraf/özellik uygulaması yapılmadı. Eski özel güvenlik raporu tarihî veri olarak okundu, ayrıntılı eski bulgular yeni public nota kopyalanmadı. Kaynak/HTTP/işletim kontrolleri tam güvenlik taraması değildir.
- Canlı sitemap'teki 41 URL sınırlı eşzamanlı HTTP okumalarıyla kontrol edildi: tümü 200, 0 og:image, 0 JSON-LD, lastmod yok; description eksik yedi yol `/`, `/en`, `/de`, `/blog`, `/calisma-alanlari`, `/en/practice-areas`, `/de/behandlungsbereiche`. Open Graph alanları için ogp.me standardı okundu. Meta görsel dokümanı web aracıyla alınamadı; WhatsApp cihaz kabulü yapılmış gibi raporlanmadı. Plan ortak admin-seçilebilir paylaşım görseli, içerik kapağı/yedek görsel ve TR/EN/DE başlık/açıklama içerir.
- Salt-okunur VPS envanterinde frontend/Directus/DB healthy, proxy up, disk yaklaşık 22 GB boş. Günlük backup timer active; son işlem Result=success/0 ve 19 Ekim 01.15 UTC (04.15 Türkiye). Seçili rate/proxy env değerleri unset bulundu; bu tur varsayılan etkin davranış tekrar analiz edilmedi, dolayısıyla bunlardan yeni açık sonucu üretilmedi. Blog id 2 gövdesiz, id 3 taslak; dört yayımlı ve iki taslak blog çevirisi mevcut. Hakkımda öğrenci biyografisi sürüyor.
- Search Console kurulumunu, mevcut yedek/restore ve kullanıcı admin/upload kabulünü tamamlanmış olarak ayırdık. Kalanlarda sunucu dışı şifreli yedek sahibin hazır olacağı adıma, Cloudflare bot ayarı kullanıcıya bırakıldı; indeksleme/performans sonucu bilinmiyor olarak yazıldı. Kod, CMS, kullanıcı, fotoğraf, Docker, DNS/Cloudflare değişmedi; yalnız not dosyaları oluşturulup güncellendi.

## 14 Ekim 2026 — Canlı Hakkımda ve blog yazılarının İngilizce/Almanca sürümleri

- Kullanıcı yeni Hakkımda Türkçe metninin ve blog içeriklerinin EN/DE eksiklerini tamamlamamızı istedi. Canlı salt-okunur envanter: Hakkımda id 1'in Türkçe eğitim/mesleki vizyon açıklaması yeni; EN/DE eski. Blog sayfası id 5 çevirileri mevcut ama eski açıklama ve SEO açıklaması boş. Blog yazıları id 1 ve 2 `published`, id 3 `draft`; üçünde de EN/DE çeviri kaydı yok. Türkçe asıl metinler kaynak kabul edildi; admin parolası/TOTP okunmadı. Hareket molası yazısına yeni tıbbi iddia eklenmedi; terminoloji için [WHO fiziksel aktivite bilgi notu](https://www.who.int/news-room/fact-sheets/detail/physical-activity/) ve [NHS hareket önerileri](https://www.nhs.uk/better-health/get-active/how-to-be-more-active/) kontrol edildi.
- Tek seferlik SQL dosyası `scripts/content-updates/2026-10-14-about-blog-translations.sql`: mevcut kaynak parmak izlerini ve boş çeviri kümesini şart koşar, dört sayfa çeviri JSON'unun yalnız ilgili anahtarlarını günceller, altı blog çevirisi ekler. İki yayındaki yazı EN/DE yayımlandı; üçüncü iki dilde de taslak. İlk yazının tüm gövde/öneri/kapanış metni çevrildi; ikinci ve üçüncü Türkçe kayıtlarında gövde olmadığı için yabancı dilde yeni gövde uydurulmadı. Kaynak görsel yolları ve Türkçe satırlar değişmedi. Görsel alt metnindeki Türkçe “danışan hareket yapıyor” açıklaması önceki portre görseliyle uyuşmuyor; EN/DE alt metin portreyi tarif eder, Türkçe alan ayrıca gözden geçirilmeli.
- SQL checksum yerel/VPS aynı (`1f3c2b4d9865aeea8ff9ca5bfb3c7d47eea9a84366a62842e14b8d3b27464c41`). Önce `COMMIT` yerine `ROLLBACK` ile canlı DB'de denendi: dört UPDATE, altı INSERT, tüm koşullar başarılı; veri kalıcı değişmedi. İlgili üç tablo `pg_dump -Fc` ile root-only `/var/backups/furkantoplu/i18n-20261014-01/before.dump` olarak saklandı ve pg_restore listesi doğrulandı. Aynı SQL tek transaction'da COMMIT edildi; staging temizlendi. Yedek sonraki CMS düzenlemelerini de içermeyeceğinden otomatik geri yükleme yapılmamalı.
- Canlı EN/DE Hakkımda, blog liste ve dört detay URL'si 200/yeni metin verdi. Taslak EN/DE detaylar 404; sitemap dört yayımlı URL'yi içerir, taslakları içermez. Türkçe Hakkımda ve üç blog kaydının önce/sonra MD5 parmak izleri aynı. CMS dışı kod/Docker/Cloudflare değişmedi. Yeni biyografi hâlen lisans eğitimi sürüyor diyor; sitedeki `Fzt.` unvanıyla tutarlılığı kullanıcıya bildirilecek, bu kapsamda Türkçe içerik/unvan değiştirilmedi.

## 14 Ekim 2026 — GitHub kaynak/VPS admin arayüzü eşitlemesi

- Kullanıcı VPS kodunun bilgisayar ve GitHub ile eşit olup olmadığını sordu ve yalnız kod eşitlemesine onay verdi; mevcut fotoğraf ve metinleri ayrı sakladığını belirtti. Yerel/GitHub `main` commit'i `eea020f38a6f331c9605ed4e24c66707518e179b`. VPS `/opt/furkantoplu` Git checkout'u değil. Seçili 201 üretim dosyası karşılaştırmasında 194 metin ve dört PNG eşleşti; `admin-client.tsx` eski, `security-panel.tsx` eksikti. Jenerik Caddyfile farklı ama aktif `Caddyfile.vps` eşti. DB/Directus/proxy kaynaklarına değişiklik gerekmedi.
- Git arşivinin SHA256'sı yerel/VPS aynı olmasına rağmen Windows Git arşivinde CRLF dönüşümü iki blob'u değiştirdi; canlıya aktarılmadan tespit edildi. Dosyalar doğrudan SCP ile aktarılıp HEAD blob'ları `62aa5f74c83f31db9aecc03761c3b93f70c4f671` ve `8a8506059121a1c08da6865fcba334589e76675a` eşleşti. 24 hedefli yerel admin test geçti. VPS'te yeni Docker imajı `vps-20261014-adminsync1` üretildi; izole 3001 önizlemede sekiz ana rota 200, bilinmeyen rota 404; TFA kodu bundle'da bulundu.
- Önceki `.env` ve admin-client `/var/backups/furkantoplu/admin-sync-20261014-01` içinde 700/600 izinli yedeklendi, önceki imaj tutuldu. Yalnız frontend konteyneri yenilendi ve healthy oldu; Directus/DB healthy, Caddy up, backup timer active. Canlı üç dil, yasal/404, public tasarım, admin erişim sınırları, HTTPS ve özel port smoke geçti. Gerçek admin giriş/TOTP bu turda denenmedi. İzole test konteyneri, staging ve yerel geçici arşiv yalnız kendi hedefleri doğrulanarak temizlendi. CMS verisi, hesap, upload, DNS/Cloudflare değişmedi.
- Kod eşitlemesi CMS veri yedeği değildir: metinler DB'de, yüklenen fotoğraflar Directus volume'ündedir. VPS içi yedek sürer; ayrı yerde doğrulanmış tam DB+upload kopyası için site sahibinin daha önce ertelediği karar hâlâ gerekir.

## 13 Ekim 2026 — Paket 67: Next/React yama sürümleri ve canlı dağıtım

- Kullanıcı kademeli bağımlılık güncellemesine devam etmemizi istedi. Altı doğrudan paket değişti: Next/ESLint config 16.3.4→16.3.8, React/React DOM/React Server DOM 19.2.6→19.2.8, `@vitejs/plugin-rsc` 0.5.26→0.5.29. Vinext 1.0.0-beta.5 ve Vite 8.0.13 sabit kaldı. Lockfile yalnız bunlar ve zorunlu alt bağımlılıklarıyla yenilendi. `npm ci` sonrası gerçek manifestler ile eklenti içindeki `dist/vendor/react-server-dom` 19.2.8 doğrulandı; bağımsız salt-okunur yama incelemesi belirgin uyumsuzluk bulmadı.
- Yerel 122/122 test, TypeScript ve Vinext üretim build geçti. Npm audit 29 (1 kritik,20 yüksek,7 orta,1 düşük) → 27 (0 kritik,19 yüksek,7 orta,1 düşük). Lint iki değişmemiş kaynak satırında hata ve bir uyarı verdi; bu paket frontend uygulama kodunu değiştirmedi. Bu sonuç bütün bağımlılık uyarılarının kapandığı veya uygulamada eski sürümlerin aktif istismar yoluna sahip olduğu anlamına gelmez. Next `next/og`/`ImageResponse` ve app `use server` kaynak çağrısı bulunmadı; Next'in vendored `image-size` sınırı ayrıca durur.
- VPS ön koşulunda mevcut `email1` imajı, DB/Directus/frontend healthy, yedek service inactive/timer active, disk25GB boş bulundu. Uzak `package.json` ve lock gerçek Git HEAD blob'larıyla eşleşti. İki dosyalı kaynak arşivi SHA256 `170c805c5a5d6e1d3bda1ef34c1b8d6f79c45c7f266075860b2e023ac38b208b` iki tarafta aynı. `/tmp/furkantoplu-next-react.pkCKXxdr` özel staging'de yeni Linux imajı `sha256:103583dd0f74cc03b63c84ea294be7d762a314d7295fd1c5d0fef0f967b055b2` üretildi; build-stage kopyasında altı sürüm ve gömülü RSC doğrulandı. Ayrı loopback 3001 önizlemesinde 9 rota 200.
- Önceki `.env` ve iki kaynak root-only `/var/backups/furkantoplu/react-20261013-01` dizininde 700/600 izinlerle saklandı. Kaynak blob'ları doğrulanıp `.env` imaj etiketi `fizyoterapist-frontend:vps-20261013-react1` oldu; iki Compose config geçti, yalnız frontend yeniden oluşturuldu. DB, Directus, proxy, medya, hesap, içerik ve Cloudflare değişmedi. Canlı frontend/Directus/DB healthy, yedek timer active. Languages, HTTPS, deployment, public-design ve account-access smoke geçti; medya smoke yayımlı upload bulmadığı için gerçek resim akışı endpoint sözleşmesi testlerinde kaldı. Gerçek admin giriş/TOTP, upload ve mobil görsel kabulü ayrı kullanıcı kontrolü gerektirir.
- İlk HTTPS/deployment smoke denemesi gerekli `TEST_SITE_URL` değişkeni verilmediği için çalışmadı; açık `https://furkantoplu.com` ile tekrarlandı ve ikisi de geçti. İlk önizleme çoklu curl komutu gövdeyi terminale bastı; ayrı dokuz URL durum kontrolüyle temiz tekrar yapıldı. Etiketi doğrulanan geçici preview, staging dizini, build-check imajı ve yerel arşiv kaldırıldı; eski üretim imajı ve root geri dönüş yedeği korundu. Üç Obsidian notu önce dış klasördeki eski hash'lerle karşılaştırılıp mirror'dan eşitlendi. Kaynak/operasyon ayrıntısı `deploy/VPS-KURULUM.md`.

## 13 Ekim 2026 — Public iş e-postası güncellendi

- Kullanıcı giriş sorununun yanlış parola yazmalarından olduğunu, çözüldüğünü bildirdi. Parola sıfırlama veya ek hesap değişikliği yapılmadı. Ardından gizlilik/KVKK ve diğer public adresleri `fzt.furkantoplu@gmail.com` yapmamızı istedi; admin giriş hesabı bu scope'a dahil edilmedi.
- Canlı salt-okunur CMS incelemesinde contact email zaten yeni adresti ve kullanıcı email kartını görünür yapmıştı. Diğer phone/whatsapp/address/hours gizliydi; bu güncel görünürlükler aynen korundu. site_pages/website_content_translations/blog_posts/practice_areas row metninde eski adres sıfır sonuç verdi. CMS veya directus_users yazımı gerekmedi.
- Kaynakta eski public adres üç dosyada kaldı: gizlilik, KVKK ve ortak legal-document. Görünen metin ve mailto yeni adrese geçirildi; iki yasal belgenin tarihi13Ekim2026 oldu. Mevcut legal-contact beklentisi güncellendi, yeni düşük etkili test eklenmedi. Hedefli legal/contact/translations8test ve diffcheck başarılı; frontend/app eski adres araması boş.
- Üç eski VPS dosyası Git başlangıcıyla normalleştirilmiş hash eşleşti. Üç kaynak dosyasını taşıyan arşiv SHA256strict eşleşti; sır/DB/medya/hesap aktarılmadı. VPS staging build `vps-20261013-email1` başarılı; shared-network/loopback önizlemede TR/EN/DE home/contact ve iki yasal rota8adet200, yeni mailto/eski yok/tarih kontrolleri geçti.
- Root-only rollback `/var/backups/furkantoplu/email-20261013-01` eski env/üç kaynak ve dep1imajıyla korundu. İki Compose config başarılı; yalnız frontend recreate edildi. Dış bilgisayardan11publicrota200, ilgili8rota yeni mailto ve tümrotalarda eskiadresyok doğrulandı. Frontend/Directus/DB healthy, backup timer aktif; geçici label/path doğrulanıp önizleme/staging kaldırıldı. SMTP teslim ve gerçek mesaj gönderimi yapılmadı; link hedefi doğrulandı. Obsidian guard hash'leri başlangıçta alındı; günlüğün önceki yarım kalan parola teşhis notu korunarak kullanıcı çözüm bildirimi eklendi.

## 13 Ekim 2026 — Açılan yönetici hesabında giriş401 kontrolü

- Kullanıcı mevcut şifrenin ne olduğunu kontrol etmemizi ve doğru olması gerekirken girişte hata aldığını söyledi. Şifre geri okunabilir düz metin olarak tutulmadığından mevcut şifreyi bulma/deşifre veya gerçek hash/TOTP/token okuma yapılmadı. Önceki kurtarma yalnız status ve sessions içindi; parola değiştirilmedi.
- Canlı salt-okunur kontrolde hedef hesap active, Administrator ve tfa_enabled=true; yeniden suspended olmamış. Son native auth/login denemesi401; server request logu INVALID_OTP veya INVALID_CREDENTIALS ayrıntısını göstermedi. Bu kanıt parola hatasıyla OTP hatasını ayırmaya yetmez. Kullanıcıdan tarayıcı Network→auth/login→Response içindeki güvenli errors/extensions/code bilgisi istenecek; request payload, parola, kod veya cookie paylaşması istenmez. Yeni parola sıfırlama veya hesap ayarı mutasyonu yapılmadı.
- Kullanıcı sonraki mesajında yanlış parola yazdıklarını ve giriş sorununun çözüldüğünü bildirdi; ek tanılama/kurtarma yapılmadı.

## 12 Ekim 2026 — İkinci yönetici giriş hatası araştırması

- Kullanıcı iki yöneticiden birinin giriş yapamadığını; admin-account/admin-team401, içerik403 ve login401 gördüğünü bildirdi. Başlangıç tracked Git temiz, üç kullanıcı görseli korunur. Kodda oturum okuma/TFA/çoklu yönetici akışı ve canlı Directus'un yalnız hesap durumu/rol/2FA booleans alanları salt-okunur incelendi; parola/hash/TOTP anahtarı veya session token okunmadı.
- İki hesabın Administrator rolü var; çalışan aktif, hata veren suspended. Hata verenin TFA'sı açık. 12 Ekim20.52.06UTC (23.52.06Türkiye) activity/revision kaydı yalnız status=suspended değişimi ve hesabın kendisini actor gösteriyor. auth_login_attempts=5. Kurulu Directus12.4.0 AuthenticationService'in başarısız giriş sınırı aşıldığında yazdığı kayıtla eşleşir; suspended kullanıcı login'de INVALID_CREDENTIALS401 döner. Böylece içerik401/403'leri ayrı rol eksiklikleri sayılmadı. Parolanın veya kodun başlangıçta neden reddedildiği bu salt-okunur kontrolden kanıtlanamaz.
- Dar kurtarma işlemi hazırlandı: yalnız doğrulanan suspended yönetici status=active, aynı rol/parola/TFA korunarak yalnız kendi eski sessions iptal edilecek. İlk otomatik onay denetimi açık hesap-statüsü değişikliği yetkisi olmadığı gerekçesiyle komutu **çalıştırmadan reddetti**. Bu aşamada hesap suspended kaldı; bypass/indirect deneme yapılmadı.
- Kullanıcı ardından açıkça hesabı geri açmayı onayladı. 12 Ekim23.58Türkiye civarında tek hedef hesap transaction/row-lock ve suspended+admin önkoşuluyla native UsersService üzerinden active yapıldı; yalnız o hesabın sessions temizlendi. Sonuç active, role_unchanged=true, tfa_enabled=true, sessions_remaining=0. Parola, TOTP anahtarı, token/hash okunmadı veya değiştirilmedi; diğer yöneticiye, kaynaklara ve içeriklere yazılmadı. Site/admin200; kullanıcının kendi parolası ve Authenticator koduyla giriş kabulü henüz yapılmadı. Native schema primary-key uyarısı bu işlemde çıktı; unrelated koleksiyon değiştirilmedi. Obsidian ve Git kayıtları güncellenir.

## 12 Ekim 2026 — Küçük paket: Vinext image-size güvenlik yaması

- Kullanıcı kademeli iyileştirmelere devam etmemizi, Cloudflare bot korumasını kendisinin yönetmesini istedi. `fix-finding` yönergeleri okundu; yeni salt-okunur sınır incelemesi ve bağımsız aday incelemesi yapıldı. Kullanıcının üç untracked fotoğrafı korunur. Güncel npm audit30 kaydı verdi; bu 30 doğrulanmış site açığı olarak yorumlanmadı. Resmî iki image-size advisory 2.0.3'ü yamalı sürüm olarak gösterdi.
- Parent/araştırmacı Vinext'in statik metadata ve görsel import build/dev çağrılarını buldu. NUL içeren framework index dosyası `rg -a` ile incelendi. Mevcut CMS upload Sharp, public görseller SiteImage/medya akışı kullanır; named image-size'a anonim request veya CMS baytlarıyla erişen yol doğrulanmadı. Next içindeki ayrı gömülü image-size ICNS döngüsü de kontrollü alt süreçte doğrulandı; bu kopya kapsam dışı açık kalır, public istismar olarak sunulmaz.
- Eski named2.0.2 16 baytlık ICNS sıfır giriş uzunluğuyla 750ms timeout/SIGTERM verdi. Paket tanımında yalnız `vinext@1.0.0-beta.5`→image-size2.0.3 override ve lockfile'da tek kayıt değişti. İlk npm install actual paketi değiştirmeden hidden-lock metadata'sını güncel göstermişti; gerçek manifest2.0.2 bulundu. Yalnız kimliği/tam yolu doğrulanan üretilmiş node_modules/image-size klasörü kaldırıldı ve 2.0.3 yeniden kuruldu; kaynak/medya dosyası silinmedi.
- `scripts/tests/image-size-security.test.mjs` timeout'lu alt süreçte ICNS/HEIF/JXL ret ve JPG/PNG/WebP/SVG boyutları kontrol eder. İncelemeci ilk ESM yolunun yeni package layout'unda CJS'ye denk geldiğini yakaladı; ayrı dist/esm yolu ve distinct-path assert ile düzeltildi. Yeni test2/2 tekrar geçti; hedefli14/14, tam122/122, TypeScript, yerel build geçti. Audit30→29, high21→20; critical1/moderate7/low1 ve diğer kopyalar hâlâ açık.
- İki bağımlılık dosyasını taşıyan sır/veri içermeyen tar yerel/uzak SHA256 eşleşti. VPS'te ayrı staging frontend build `vps-20261012-dep1` üretti; gerçek runtime manifest2.0.3, ağsız ESM ICNS ret ve loopback altı rota200 doğrulandı. Eski imaj ve `.env`/package/lock root700/600 geri dönüş kopyası `/var/backups/furkantoplu/dependency-20261012-01` altında tutuldu. Compose config başarılı; yalnız frontend recreate edildi. DB/Directus/proxy/medya/hesap/Cloudflare/DNS değişikliği yok.
- Dış bilgisayardan canlı languages-smoke, vps-https-smoke, vps-deployment-smoke geçti: üç dil sayfaları, doğru404/401/400, sitemap/dil/canonical, HTTPS/www redirect, no-store/admin koruması, secret404, statik optimizer200 ve private8055/8080 erişim engeli. Gerçek kullanıcı giriş/upload kabulü bu bağımlılık paketiyle yapılmış sayılmaz. Obsidian üç notu işlem öncesi mirror ile SHA256 eşitti; son kayıtlar guard ile eşitlenir. Geçici önizleme/staging kesin kimlik doğrulamasıyla temizlendi; eski imaj/yedekler korunur.

## 12 Ekim 2026 — Görsel yükleme güvenlik düzeltmesi canlıya alındı

- Önceki aktarım girişimi otomatik onay 429 sınırında durmuştu. Kullanıcının açık onayıyla yalnız ilgili yedi kaynak dosyasını taşıyan arşiv oluşturuldu; yerel/uzak SHA256 eşleşti. Önizleme için ayrı frontend imajı `fizyoterapist-frontend:vps-20261012-image1` üretildi ve loopback 3001 üzerinde altı rota 200 döndü. Staging Caddy dosyası izole Caddy konteynerinde doğrulandı.
- Canlı değişiklikten önce yalnız etkilenen `.env`, Caddy, Directus giriş dosyaları ve frontend kaynaklarının kopyası `/var/backups/furkantoplu/image-verify-20261012-01` altında root-only 700/600 izinlerle alındı; eski frontend imajı saklandı. Yeni yükleme kaynakları ve proxy dosyası taşındı, frontend imaj etiketi güncellendi; iki Compose dosyası `config -q` geçti. Directus/frontend/proxy `--no-deps --force-recreate` ile yenilendi; DB konteyneri ve veri/medya volume'leri değiştirilmedi. Directus ve frontend healthy, proxy çalışıyor.
- Canlı `https://furkantoplu.com` üzerinde `/`, `/bakir`, `/blog`, `/calisma-alanlari`, `/en`, `/de` 200; anonim eski `POST /bakir-api/files` 403, anonim yeni `POST /bakir-api/website-content/image-upload` 401. Directus eklentisi yüklendi ve günlüklerde yeni endpoint'e dair sunucu hatası görülmedi. Hedefli upload/TFA 12/12, tam yerel regresyon 120/120 geçti. Gerçek yönetici hesabı/TOTP kullanılmadığından girişli geçerli fotoğraf yükleme ve sahte fotoğraf ret kabulü henüz doğrulanmadı. Kimliği doğrulanan geçici önizleme konteyneri ve staging klasörü kaldırıldı; eski imaj ile geri dönüş yedeği korundu. Cloudflare bot ayarı, DNS, DB, mevcut medya, hesaplar ve içerikler bu yayında değiştirilmedi.

## 12 Ekim 2026 — Görsel yükleme doğrulaması ve Cloudflare botları

- MIME allowlist sonrası gerçek byte/decode/piksel denetimi için panel `ImageField` → Caddy `/bakir-api/files` → Directus 12.4.0 `POST /files` → depolama/DB → yayınlanan referanslı `/site-media` akışı yeniden incelendi. Native controller 10 MB ve bildirilen MIME'ı multipart yüklemede denetler, gerçek baytları çözümlemez. Public medya kayıtlı türe ve referansa bakar; `nosniff` vardır. Bu bulgu kendi başına XSS kanıtı değildir. `/files/import`, dosya değiştirme ve servis içi yükleme alternatifleri de tam sınır tasarımında hesaba katılmalı; native upload sonrası kanca pre-storage engel değildir.
- Kullanıcı yalnız `/bakir` panelinden yükleme yapılacağını seçti. TFA'lı aktif yöneticiye özel raw-image endpoint'i eklendi; 10 MB, bildirilen tür/gerçek Sharp biçimi, tam piksel çözme, 5000 px kenar ve 16 MP denetiminden sonra FilesService'e mevcut temizleme işaretiyle kayıt yapılır. Panel bu yola taşındı; yerel/VPS Caddy'de native `POST /files` kamu geçişi çıkarıldı, diğer CMS işlemleri korunur. Var olan kayıtlar/medya değişmedi. `scripts/tests/image-upload.test.mjs` gerçek Sharp ile geçerli/bozuk/tür uyuşmazlığı/büyük boyut ve yetki yolunu denetler; içerik silme smoke testi yeni yola uyarlandı. Canlıya henüz dağıtılmadı, gerçek Directus konteyner testi bekler.
- Resmî Cloudflare belgelerinde Free Bot Fight Mode'un tüm domain için bot challenge olduğu, özel WAF Skip istisnası olmadığı ve yanlış pozitif üretebildiği doğrulandı. Mevcut public `robots.txt` okundu: `/` açık, `/bakir` ve `/bakir-api` dışarıda, sitemap URL'si var. Cloudflare hesabına girilmedi, bot modu/AI bot ayarı değiştirilmedi; kullanıcıya menü yolu ve Search Console/gerçek kullanıcı trafiğini izleme uyarısı verildi. `robots.txt` botları teknik olarak durdurmaz.
- Post-patch salt-okunur inceleme kamu yükleme yolunu atlayan bir rota bulmadı; büyük chunked istekte 413 yanıtı için request'i yok etmek yerine duraklatma/bağlantıyı kapatma düzeltildi. TFA güvenlik testine gerçek yeni upload endpoint'i eklendi. Tam paket 120/120 (son TFA satırı öncesi), son ilgili paket 15/15, `npx tsc --noEmit`, `npm run build` ve `git diff --check` geçti. Yerel Docker daemon kapalıydı. Canlı Directus imajında Sharp'ın pnpm gerçek yolundan çözüldüğü, servislerin healthy olduğu, VPS kaynaklarının Git ile yalnız CRLF farkı taşıdığı salt-okunur doğrulandı. Yeni frontend imajı için `/tmp/furkantoplu-image-verify.7SZJRvgK` staging dizini ve mevcut frontend'in kopyası açıldı; dosya aktarımı otomatik onay 429 nedeniyle **gerçekleşmedi**. Canlı dosya, imaj, proxy, DB, medya ve Cloudflare değişmedi; staging dizini gizli anahtar içermez, temizleme sonraki erişim penceresine kaldı. Gerçek yetkili upload E2E ve deploy açık.

## 12 Ekim 2026 — Paket 64: Dosya yükleme MIME türü sınırı

- Kullanıcının güvenlik iyileştirmelerine küçük adımlarla devam talebiyle yalnız dosya yükleme türü sınırı seçildi. Önceki 30 `npm audit` paket/advisory kaydı yeniden ölçüldü; bunların tümü kanıtlanmış uygulama açığı veya bu pakette kapanmış sorun sayılmadı. Dar dosya yükleme kontrolü, büyük bağımlılık yükseltmesinden ayrı tutuldu.
- Paneldeki `ImageField` JPEG/PNG/WebP ve 10 MB kontrolü tarayıcı tarafındaydı; Caddy `POST /files` isteğini Directus'a geçiriyordu. Yerel/VPS Compose'da yalnız 10 MB vardı, global MIME listesi yoktu. Directus 12.4.0 kaynak ve kurulu image kontrolü, `FILES_MIME_TYPE_ALLOW_LIST` denetiminin `uploadOne` öncesinde istemcinin multipart MIME bilgisine uygulandığını gösterdi. Mevcut upload sonrası cleanup hook'u yükleme öncesi engel değildir.
- Her iki Compose'a tam `image/jpeg,image/png,image/webp` listesi eklendi. İki yeni regresyon testi bu eşitliği ve wildcard yokluğunu kontrol eder. Ağsız geçici Directus 12.4.0 konteynerinde env listeye doğru ayrıldı; yerleşik eşleştirici üç resim türünü kabul, HTML/SVG etiketini reddetti. Bağımsız salt-okunur incelemede bu dar hedefte bypass/regresyon bulunmadı; istemcinin sahte `image/png` etiketiyle resim olmayan byte göndermesi hâlâ çözümsüzdür.
- Yerelde 116/116 Node testi geçti. İlk sandbox koşusunda esbuild'in frontend yolu ACL nedeniyle altı test çözümlenemedi; aynı paket genişletilmiş okuma izniyle değişikliksiz geçti. Docker Desktop yerelde kapalı olduğundan yerel Compose başlatma yapılmadı. Üretimde önce mevcut Compose'un Git HEAD ile byte eşitliği, yeni dosyanın SHA256'sı, root-only geri dönüş kopyası ve iki HTTPS Compose `config -q` doğrulandı. Yedek işi aktif değilken yalnız Directus recreate edildi; healthy ve yeni env değeri görüldü. Dış site 200, admin kabuğu/no-store/noindex, gizli dosyalar, resim optimizer ve özel port smoke geçti. Sahip OTP'si veya gerçek medya verisiyle upload kabul testi yapılmadı.
- Geçici aktarım dosyası yalnız doğrulanan hedef adı/hash ile temizlendi; eski Compose root-only yedeği kaldı. Üç kullanıcı untracked görseli, CMS verileri, uploads, hesaplar, Cloudflare/DNS ve Search Console değiştirilmedi. Sonraki güvenlik işi gerçek dosya byte/decode/piksel sınırı ve ardından bağımlılıkları uyumlulukla ele almak; site dışı yedek sahibinin yanında yapılacak.

## 11 Ekim 2026 — Paket 63: Gerçek iletişim bilgileri ve yasal sayfalar

- Kullanıcı gerçek veri sorumlusu Fizyoterapist Furkan Toplu, `toplu.furkan0220@gmail.com`, `0552 290 39 02` (WhatsApp aktif) bilgisini doğruladı; iş/klinik adresi yok, uzaktan iletişim. Canlı telefon/e-posta/WhatsApp kartlarının ve diğer iletişim bloklarının gizlilik ayarlarını değiştirmememizi özellikle istedi.
- Canlı CMS salt okunur incelendi: sahte telefon/e-posta/WhatsApp, Kadıköy/İstanbul adresi ve yüz yüze görüşme metni vardı; ilgili `section_visibility` bayrakları false. Guarded/idempotent `013-verified-contact-remote.sql` ile yalnız bilinen eski değerler gerçek iletişim/uzaktan metnine çevrildi. TR/EN/DE ana sayfa konum ve iletişim çevirileri düzeltildi. Canlı API tekrar okumasında numara/e-posta doğru, tüm eski gizlilik bayrakları false. Yerel ayrı DB'ye de aynı migration uygulandı; yerel null görünürlükten dolayı yerel kart gösterimi canlıdan farklıdır, bilinçli olarak korunur.
- `gizlilik` ve `kvkk-aydinlatma-metni` gerçek web/iletişim işleyişine göre yazıldı: veri sorumlusu/başvuru, teknik kayıtlar, Cloudflare, Kanada OVHcloud, seçime bağlı Gmail/WhatsApp, sağlık verisi sınırı. Ortak legal bileşendeki “taslak” etiketi kaldırıldı; iki rota self-canonical aldı. Mobil navbar konumu “Uzaktan iletişim”; EN/DE çevirileri eklendi. Site hiçbir fiziksel klinik varlığı iddia etmez.
- Resmî KVKK aydınlatma, usul, özel nitelikli veri, çerez ve yurt dışı aktarım kaynakları incelendi. Metin web ziyareti/ilk temas kapsamındadır; Kanun'a tümden uygunluk veya klinik hizmete ait sağlık verisi aydınlatması iddiası değildir. Yurt dışı aktarımın hukuki mekanizması/sözleşmeleri ayrıca doğrulanmalı. Hukukçu/site sahibi kontrolü kalan iş olarak açık yazıldı.
- `legal-contact.test.mjs` eklendi. 114 Node testi ve TypeScript geçti; yerel Docker frontend healthy, altı rota200. Canlı günlük yedek başarılı; DB değişiminden önce iki tablo root-only `/var/backups/furkantoplu/contact-20261011-01/content-tables.dump` arşivine alındı. `pg_restore -l` ilgili iki TABLE DATA girdisini doğruladı; gerçek geri yükleme bu pakette yapılmadı. Eski `.env`/kaynak root-only `/var/backups/furkantoplu/legal-20261011-01` altında. Transfer imaj/kaynak SHA256 eşleşti; `vps-20261011-legal1` image ID `sha256:226cb644c6078da736e17e621de5dc59b2cc108357627539d7e609c39b51e2dc`.
- Private loopback3001 ön kontrolde altı rota200, gerçek e-posta/no-taslak/no-public-wa.me/uzaktan navbar geçti; geçici container exact adıyla kaldırıldı. İki HTTPS Compose dosyasıyla yalnız frontend yenilendi, healthy. Canlı altı rota200, TR/EN/DE/404/sitemap/API koruma, TLS/HTTP-www redirect, canonical ve güvenlik başlığı smoke'ları geçti. Directus/Caddy/DB/hesap/TOTP/medya restart ya da silme yapılmadı.
- Site dışı şifreli yedek kullanıcının isteğiyle site sahibinin hazır olduğu sonraki adıma bırakıldı. Google Search Console TXT doğrulaması ve sitemap gönderimi henüz yapılmadı. WhatsApp'ın doğru hedef hesaba açılması sahibin cihazında ayrıca kabul edilmelidir. Kullanıcıya ait üç untracked görsel korunur; VPS'teki iki staging tar'ı ve geçici SQL dosyası ile yerel iki geçici aktarım arşivi yalnız exact hedef/doğrulanmış içerik sonrasında kaldırıldı. Root yedekler ve eski Docker imajı korundu.

## 10 Ekim 2026 — Paket 57: Salt-okunur güvenlik ve yayın raporu

- Kullanıcı kendi mimarisine uygun güvenlik sorunlarını raporlamayı ve Google/Search Console yayın işlerini birlikte değerlendirmeyi istedi. Security scan becerisi/masaüstü kuralları okundu; native başlangıç60 saniyede authoritative context vermedi. Tam otomatik rapor veya scan completion iddiası yok; sınırlı manuel kontrol ve SEO için Sites kaynak yönergesi kullanıldı.
- İlgili auth/admin/ownership/çeviri/media/cleanup/Compose/Caddy kaynakları, seçili kurulu Directus env/upload kodu, frontend runtime bağımlılıkları ve canlı HTTP/DNS kontrol edildi. Npm audit salt-okunur çalıştı; build/runtime ve advisory önkoşulları ayrı değerlendirildi. Gerçek sırlar/hashler/OTP'ler alınmadı; yalnız politika/2FA toplamları ve whitelist env alanları okundu. Bazı tanılama komutlarının paket export/PowerShell quoting sorunları düzeltilip tekrarlandı; bunlar uygulama mutasyonu değildi.
- Robots/sitemap/canonical/indexleme işaretleri, metadata ve37 sitemap adresinin HTTP durumu ölçüldü. Google/WhatsApp/Directus ve ilgili advisory birincil dokümanları kontrol edildi. Search Console/Cloudflare dashboard veya provider backup ayarlarına erişilmedi; gerçek Google indeks durumu ve tam container/OS CVE kapsamı tamam denmedi.
- Ayrıntılı bulgular/riskler ve iyileştirme sırası özel proje raporuna yazıldı; public repoya rapor/kanıt push edilmez. Yerel kopya mevcut backups ignore kuralı içinde; Obsidian03 tarihli raporla hash eşitliği korunur. Üç genel notta yalnız bu işlem özeti tutulur, kapatılmamış ayrıntılar kopyalanmaz.
- Bu tur application code/lockfile/runtime/DB/fotoğraf/hesap/DNS/Google değişikliği veya exploit/brute-force/zararlı upload yok. Yalnız rapor ve proje notları oluşturuldu/güncellendi. GitHub'a push yapılmadı; düzeltme ve yayın kayıtları sonraki ayrı onaylı paketlerdir.

## 10 Ekim 2026 — Paket 56: Tam fotoğraf görünümü, desktop/mobile kabulü

- Kullanıcı ana sayfa/blog liste/detay fotoğraflarında yüzün kesildiğini bildirdi; çalışma alanlarını ve mobil görünümü kontrol istedi. Sites kaynak/Computer Use browser talimatları okundu. Önce salt-okunur ölçüm yapıldı; ardından kullanıcı fotoğrafın tamamı/ortak kart ölçüsü/kenar boşluğu seçimini açıkça onayladı. İlk browser handle adı yoktu; mevcut browser ID2'ye bağlanıp belgelenmiş viewport capability kullanıldı. Native apps, gerçek admin login veya DB değişikliği yok.
- Gerçek eski desktop blog img733.96×608.4, source862×1320, fit cover; telefonda337.6×360, cover. Kesilmenin sebebi Image fill'in inline cover varsayılanı ve geniş yatay kutuydu. SiteImage varsayılanına inline contain/center eklendi; hero explicit bottom hizası korunur. Global CSS blog kart240px, featured padding/nötr zemin/hover zoom kaldırma, article image320–620px ve mobile300–440px, caption normal akış olarak düzenlendi.
- Kaynak e300c00 ve fit1 üretim imajı hazırlandı, strict transfer digest geçti, private preflight realJPEG/HTML contain doğrulandı, root700/dosyalar600 photo-fit01 geri dönüş yedeği alınıp yalnızfrontend recreate edildi. Browser'da son public-design katmanı kart190px ve article16/9 ile yeni ölçüleri override ediyordu; sadece globals regex testi bunu yakalamamıştı. Public-design karta240px ve article width100%/aspect-ratio:auto/max1100px olarak düzeltildi.0b920d5 commit ve fit2 final imaj aynı guarded/backup/preflight akışıyla yayımlandı. Eski image/taglar korunur.
- Son image ID85600949a684c9d4db23f4a61ca848e378157a6bf9f54aa1d90dfd793e890514, node runtime; localfrontend de rebuild. Env yalnız FRONTEND_IMAGE selector değişti. DB/Directus/Caddy, gerçek fotoğraf/content/çeviri/admin/TOTP/oturumlar değiştirilmedi veya restore edilmedi. Seed/down-v/broad prune yok. AppData release paketleri secrets/DB/upload içermez; kaynak Git'ten yalnız ilgili dosyalar.
- 100 test ve TypeScript geçti; gerçek renderer default contain/statik optimizer/hero hizası, mobil frame/caption ve final theme override kuralları test edildi. Final domain media JPEG imzası ve byte eşitliği/direct src, blog/practice görünürlük, VPS headers/private ports/SEO ve üç dil/404/sitemap HTTP smoke'ları geçti. Kapsam yeni admin upload/delete denemesi değil, kullanıcının mevcut yayımlanmış JPEG'idir.
- Browser gerçekdesktop1440 (içerik1425), mobil390/360 (375/345): ana sayfa iki kart eşit621.4×567.45px, görsel240px/contain; mobil259.2×240px ve yataytaşmayok. Detaydesktop img1098.4×620/figure1100; mobil337.6×370.875 ve307.2×342/contain. Caption static ve fotoğrafın altında, tamfotoğraf screenshot ile görüldü. Blogliste mobilcontain, currentSrc direct/media400 yok; seçili error/warn=[] . Offscreen lazy görsel ilk ölçümde unloaded idi; blogbölümüne gerçek scroll sonrası loaded=true teyit edildi. Yeni sekmeler viewport override'ını otomatik taşımadığından her ölçümde gerçek clientWidth ayrıca okundu; varsayılan1265 ölçüm mobil diye sunulmadı.
- Canlı altı çalışma alanı fotoğrafsız. Gerçek kayıt yerine `workarea-photo-preview.mjs` bind127.0.0.1:9123 ile gerçek Areas/PracticeDetail/Image/CSS ve yayındaki JPEG kullanıldı. Fotoğraflı kartlar contain/ortak ölçü, mobile375px scrollWidth375; detay339.2×300 tam fotoğraf, desktop1440 da taşmasız. Önizleme metinleri yalnız fixture belleğinde, CMS'e yazılmadı; JPEG diske kaydedilmedi. Preview CLI exact UUID argümanı ister; gelecekte başka yayımlanmış görsel test edilebilir.
- VPS fit1/fit2 volumesiz preflight container'ları tam isim/imaj guard ile stop/rm edildi; root yedek/eski imaj korundu. Local9123 Node sunucusu Ctrl+C ile kapandı; portta listener kalmadığı ayrıca doğrulandı. Kalıcı local/VPS frontend çalışır. Viewport reset/test tab cleanup yapılır. README/ops/üç Obsidian notu baseline/hash guard ile senkron, GitHub push. Kullanıcının üç untracked görseli korunur. Düzenli/off-server backup ve gerçek admin CRUD kabulü hâlâ ayrı kalan iş.

## 10 Ekim 2026 — Paket 55: Dinamik fotoğraf düzeltmesi canlıya uygulandı

- Kullanıcı “uygula” diyerek onay verdi. Sites becerisi mevcut kaynak/Docker/VPS akışını korumak için, Computer Use yalnız browser kabulü için kullanıldı. Native Sites hosting'e taşıma, dependency yükseltme, framework node_modules patch veya global optimizer güvenlik gevşetmesi yok.
- `SiteImage` ortak bileşeni eklendi,6 public dosyada import değişti. Yalnız exact `/site-media/<UUID>` unoptimized olur; diğer statik kaynaklar aynı optimizer'da. Alt/fill/priority/lazy/style/contain/sizes ve visibility korunur. Private admin preview/QR ve Directus yayımlanmış dosya kontrolü/medya temizliği değiştirilmedi.4 yeni gerçek Vinext renderer testi eklendi;98 Node testi geçti. TypeScript ilk kez mevcut NextConfig annotation/env geniş tip uyuşmazlığını verdi; config runtime değeri değişmeden satisfies ile daraltıldı, ardından geçti.
- Üretim Docker build yeni ayrı etiket `vps-20261010-media1` ile tamamlandı. Kaynak commit `b9b41cc`, image ID `e8d1c1b83d02d5f3c053baf7ccb77dacb22ce96f944041d96dad5c2752787ddf`, runtime node, yaklaşık101MB. AppData/fizyoterapi-deployments/media-20261010-01 içinde Docker save ve yalnız ilgili10 Git dosyasının archive'ı hazırlandı, VPS `.releases/media-20261010-01` içine SCP oldu. Sırlar/DB/gerçek upload dosyası transfer edilmedi. Image hash geçti; elle kopyalanan source hash satırı malformed warning verdiğinden yerel hash otomatik alınıp strict kontrol tekrarlandı, source extract öncesi geçti.
- Canlı frontend'e geçmeden private network/loopback3001 preflight container kuruldu. Directus mevcut gerçek blog cover'ı salt okunur; JPEG200/61993bayt, ana sayfa/blog/detay HTML raw img src doğru, statik optimizer200. Yeni dosya/hesap/içerik oluşturulmadı. Eski image/tag korundu, root700 `media-fix-20261010-01` yedeğinde .env/source600. Yalnız frontend source dosyaları çıkarıldı, .env yalnız image selector değişti. İlk sed tırnaklı env değerini eşleştirmedi; ps eski imajı gösterince doğru biçimle guard/selector/update tekrarlandı ve yeni etiket doğrulandı.
- İki Compose dosyasıyla yalnız frontend recreate; DB/Directus/Caddy/sessions/TOTP/media kayıtları değiştirilmedi veya restore edilmedi. Eski Node imajı geri dönüş için tutulur. Local Docker frontend de --no-deps rebuild; yerel DB ayrı/korunur, yerel portre/public-design smoke geçti.
- Gerçek domain media smoke: Directus/proxy image/jpeg imza ve tüm bayt eşitliği, ana/blog/detay `<img src=/site-media/...>` geçti. Smoke artık yanlış static-only optimizer beklentisi yerine gerçek üretilen URL'yi kontrol eder. Blog görsel/görselsiz ve6 practice görselsiz kartlar, production SEO/headers/imageoptimizer/privateports,3dil/404/sitemap,HTTPS/www/cache ve anonymous erişim smoke'ları geçti. Yeni upload/delete yapılmadı; kullanıcının mevcut gerçek fotoğrafı test edildi.
- Browser blog→yazı geçişinde JPEG natural862×1320, complete=true, error/warn=[]; geçiş anında ilk ölçüm image henüz yüklenmediğinden0 idi, yükleme sonrası tekrar ölçüldü. Screenshot blogda görseli gösterdi. Bir salt-okunur final SSH bağlantısı reset aldı; güvenli tekrar ile servis/cleanup doğrulanır. Geçici, volumesiz preflight container kaldırılır; geniş prune/volume silme yapılmaz. Notlar hash/baseline korumasıyla Obsidian'a senkron, Git push; kullanıcı3untracked görsel korunur.
- Eski sekme sayfayı yenileyene kadar eski optimizer URL'sini gösterebilir; Ctrl+F5 önerilir. Dinamik optimizer route'u doğrudan çağrılırsa framework400 kalır, uygulama artık bunu kullanmaz. Orijinal CMS dosyası baytları servis edilir; ileri resize/WebP optimizasyonu ayrı kapsam. Periyodik DB/upload/off-server backup ve gerçek admin CRUD teslim kabulü henüz bitmiş sayılmaz.

## 10 Ekim 2026 — Canlı fotoğraf 400 teşhisi; düzeltme henüz uygulanmadı

- Kullanıcı admin panelinden fotoğraf yükledikten sonra `image:1 ... 400` bildirdi, kontrol istedi. Sites becerisi mevcut VPS kaynaklarını incelemek için okundu; hosting/runtime değişikliği yok. Dört canlı servis sağlıklı, proxy/frontend son loglarında açıklayıcı runtime exception yok. Sırlar veya kullanıcının admin oturumu okunmadı; gerçek parola/OTP girilmedi.
- Public blog kaydı1 üzerinde bir `/site-media/<UUID>` cover bulundu. `media-smoke.mjs` gerçek domainle çalıştı: Directus public media200, frontend proxy200 / image/jpeg, imza ve tüm bayt eşitliği geçti. Image optimizer640/q75 adımında400 oluştu; yanıt gövdesi `The requested resource is not an allowed image type`. Görsel indirilip yeni dosyaya kaydedilmedi, silinmedi veya değiştirilmedi.
- Cloudflare/proxy atlanarak frontend container localhost3000 üzerinden ham medya200 ve optimizer400 tekrarlandı. Çalışan imaj Vinext1.0.0-beta.5. Gerçek `/app/node_modules/vinext/dist/server/prod-server.js` App Router Image dalı `contentTypeForPath(params.imageUrl)` ile URL uzantısını denetliyor; dinamik uzantısız `/site-media/UUID` güvenli tür kabulüne giremiyor. Devamında yalnız `tryServeStatic(clientDir, ...)` var, route handler fetch yok. Bu yüzden sorun JPEG dosyasının türü değil, Node standalone ile dinamik CMS görseli uyumluluğu.
- Teşhis komutundaki ilk `require` + top-level await karışımı Node modül hatası verdi; `--input-type=module` / import ile salt okunur kontrol tekrarlandı. Windows rg glob/path yazımından gelen tanılama hataları da uygulama hatası değildi; kesin dosya yollarıyla okundu. Vinext resmî repo platform uyumluluğu bağlamı için incelendi; kesin kanıt kurulu gerçek runtime kodu ve HTTP yanıtlarıdır.
- Önerilen dar kapsamlı düzeltme: sadece yönetilen `/site-media/<UUID>` Image kaynaklarını `unoptimized` ile mevcut güvenli public route'tan göster; yerel/Worker/Node davranışını test et, statik portre optimizer'ını koru. Dosyalar/admin upload preview, yayın visibility ve fiziksel/DB temizliği değişmemeli. Global SVG/type allowlist açılmaz, URL'ye sahte uzantı eklenmez, dependencies kör yükseltilmez. Gerçek upload smoke ve farklı sayfalardaki CMS fotoğrafları kabul kapsamına alınmalı.
- Kullanıcının bu turdaki talebi kontrol olduğu için uygulama kodu, Docker imajı, Cloudflare/TLS ve veri değiştirilmedi. Henüz düzeltilmiş değildir; kaynak değişikliği/deploy için kullanıcı yönlendirmesi beklenir. Mimari/günlük Obsidian notları bağımsız değişiklik korumasıyla eşitlenir; yalnız teşhis dokümantasyonu Git'e kaydedilir. Önceki uploaded file0 kabul sınırı açıkça kaydedildi.

## 10 Ekim 2026 — Paket 54: Cloudflare/domain/HTTPS yayını

- Kullanıcı Cloudflare proxied apex A→149.56.103.60, www CNAME→apex ve Namecheap Custom DNS→daisy/elliot adımlarını yaptı. NS sorguları 1.1.1.1/8.8.8.8 üzerinden doğru; ilk recursive A eski VPS yanıtını kısa süre cache'de tutuyordu. Yetkili Cloudflare apex/www A yanıtları ve canlı CF-RAY proxy'yi doğruladı. MX/TXT korunur, DNSSEC ekranı kapalı, AAAA eklenmedi. Kişisel adres/telefon/e-posta ekranları notlara alınmadı.
- Kullanıcının Full ekranı görüldü. Sites becerisiyle mevcut VPS kaynak mimarisi korundu, farklı hosting yok. Resmî Caddy automatic HTTPS/tls issuer, Compose merge ve Cloudflare Full strict dokümanları kontrol edildi. HTTPS override ve iki Caddy dosyası eklenip VPS'ye sır içermeden SCP yapıldı. Private Caddy/base Compose checksum baseline aynı. Config snapshot root 700, dosyalar 600. İlk chmod wildcard ubuntu'nun root dizinini listeleyememesi nedeniyle servis mutasyonundan önce durdu; kesin dosya yollarıyla düzeltildi.
- Production ve bootstrap gerçek Caddy 2.10 validate geçti. HTTP-01 kullanıldı; Cloudflare TLS-ALPN'i proxy etmediğinden kapalı. Bootstrap HTTPS 503/no-store/noindex, upstream yok; HTTP yalnız challenge/redirect. Directus/proxy recreate edildi, gerçek Secure cookie=true. Origin apex/www Let’s Encrypt sertifikaları alındı; hostname/SNI curl/openssl trust kontrolü geçti, bypass veya private key okuması yok. SAN/issuer YE1/YE2 doğru; geçerlilik 10 Ekim 2026 12:03 UTC–8 Ocak 2027 12:03 UTC. Kalıcı caddy_data ve otomatik renewal; gerçek ileri tarih renewal henüz test edilmiş değildir.
- Sertifika ardından final proxy açıldı. Kullanıcı Full(strict) kaydettiğini teyit etti; sonraki canlı HTTPS 200, HTTP/www 308 query/path korunur, CF-RAY/Server cloudflare ve DYNAMIC. Panel/API ile strict ayarı ayrıca okunmadı. Admin no-store/noindex ve API no-store, aynı private allowlist korundu; test route gövdesi eşitliğini kontrol eder. Dashboard cache rule yapılmadı; ileride Cache Everything/bypass kontrol edilmeli.
- 94 Node testi, 7 domain HTTPS smoke geçti: vps-deployment/languages/catalogue/account-access/public-design/hero-portrait/https. Anonymous 401/403 normal; gerçek veri CRUD yapılmadı. Yeni HTTPS smoke ilk kez olmayan session endpoint'ini 401 varsayıyordu; 404 doğruydu, mevcut korumalı translation endpoint'iyle test düzeltildi. 16 sayfa, 18 alan detayı, 404, SEO, optimizer, headers/private ports geçti. DB/hesap/TOTP/upload restore veya silme yapılmadı; frontend imajı aynı, yerel uygulama korunur.
- Computer Use yalnız canlı tarayıcı QA için kullanıldı: mobil menü→Hakkımda, English dil menüsü, İngilizce custom404→ana sayfa ve admin loading→login formu. Seçili geçişlerde JavaScript error/warn logları boş; beklenen HTTP 404/401 ayrı durumlardır. Gerçek parola/OTP girilmedi, tam viewport/pixel kabulü değildir. README, VPS dokümanı ve 3 Obsidian notuna canlı URL/ikili Compose/eski staging komutu geçersizliği/teslim kalanları eklendi. Harici 3 not HEAD baseline karşılaştırması geçti; bağımsız Obsidian değişikliği ezilmez. Git'te yalnız bu paket dosyaları, kullanıcı untracked görselleri korunur.
- Kalanlar: gerçek kullanıcı admin login/OTP/medya CRUD kabulü; örnek telefon/WhatsApp/iletişim verisi düzenleme; günlük backup/retention/off-server/restore provası; Cloudflare explicit cache bypass/DNSSEC/Search Console kontrolleri. HTTPS aktif ama tam teslim kabulü henüz bitmedi.

## 10 Ekim 2026 — Paket 53: Onaylı VPS aktarımı ve özel staging kabulü tamamlandı

- Kullanıcı DB, parola hashleri/TOTP ve uygulama sırrının kendi VPS'ine SSH ile aktarımını açıkça onayladı. Önceki güvenlik reddi aşılmadı; onay ardından SCP başarıyla çalıştı. Kaynak `68b5736`, imaj `vps-20261010`, sekiz paket dosyasının SHA256 değerleri eşit. Özel SSH anahtarı ve parolası aktarılmadı/okunmadı.
- Boş PostgreSQL hedefi pg_restore single-transaction ile geri yüklendi; 14 tablo parmak izi, upload baytları ve uygulama sırrı hash'i eşit. 2 yönetici, 6 alan, 3 blog, 6 sayfa ve 22 çeviri korundu. Sadece hedefte 4 kopya oturum silindi; kaynak hesap/veri/oturumları korunur. Uploaded files sayısı 0, mevcut durumla aynı; statik portreler imaj/kaynakta.
- Systemd oneshot restore bağımsız tamamlandı; success ve PRIVATE_VPS_TRANSFER_COMPLETE doğrulandı. Dört Docker servisi sağlıklı. Node non-root production standalone, Wrangler yok; PG16/Directus12.4/Caddy2.10. Hedef `.env` root600, özel migration dizini700/dosyalar600; root700 korumalı ilk yedek ayrıca `/var/backups/furkantoplu/migration-20261010-a94723c2a8` altında. Yerel AppData özel kopyası durur.
- Sunucuda sadece SSH22 public dinliyor; proxy127.0.0.1:8080, Directus127.0.0.1:8055, DB/frontend internal. Dış8055/8080 erişimi başarısız, SSH tüneli9090 başarılı. Anlık disk31GB boş; RAM frontend66, Directus224, PG40, Caddy14MiB. TLS uyarıları private HTTP aşamasının beklenen sonucu; domain/CF/HTTPS değişmedi. Gerçek Directus kullanıcısının upload dizinine yazma izni de fs.accessSync ile doğrulandı; dosya oluşturulmadı. İlk izin kontrol komutu PowerShell alıntılama hatası verdi; SSH stdin ile düzeltildi.
- 91 regresyon ve 6 mevcut HTTP smoke VPS proxy üzerinde geçti: 3 dil sayfalar/18 alan detayı, custom404, sitemap/hreflang, publicCSS, portrecontain, görselsiz kart, API401/403 ve medya okuma. Yeni vps-deployment-smoke canonical/robots, admin no-store/noindex, gizli dosya404, image optimizer200 ve dış port engeli geçti. İlk SSR password input varsayımı yanlıştı; admin client-rendered olduğundan test shell kontrolüne düzeltildi, uygulama bozuk değildi.
- Computer Use tarayıcısı bu tur çalıştı: görünür VPS site/screenshot, mobil menü→Hakkımda, 404→Blog→yazı→ana sayfa, dropdown TR→EN→DE ve admin loading→login formu doğrulandı. Yakalanan error/warn logları boş; gerçek kullanıcı parolası/OTP girilmedi, kullanıcı verisi değiştirilmedi. Bu seçili akış kontrolüdür, kapsamlı her breakpoint pixel QA değildir. Uploaded foto yok; yeni upload/delete gerçek kullanıcı kabulü bekliyor.
- README/VPS kurulum ve 3 Obsidian notu gerçek durum, tünel, yerel-VPS DB ayrımı ve restore tekrarlamama uyarılarıyla güncellendi. Geçici test sekmesi/tüneli temizlenir; kalıcı VPS container'ları ve yerel site çalışır. Önceki kod/yedekler ve üç untracked kullanıcı görseli korunur. Sonraki adımlar: kullanıcı login/medya, gerçek iletişim verileri, düzenli backup/restore provası, sonra domain/SSL/Cloudflare. Yeni editler otomatik başlangıç snapshot'ına girmez.

## 10 Ekim 2026 — Paket 52: Taşıma paketi hazır, hassas aktarım onayı bekliyor

- Kullanıcı Docker ile VPS'ye taşımanın başlamasını istedi. Sites kaynak hazırlığı yönergesi kullanıldı; mevcut starter/local önizleme korundu, hosting kullanıcının VPS'si. Node standalone ayrı VPS config/Dockerfile, non-root yaklaşık100MB imaj; local Wrangler düzeni değiştirilmedi. Public rotalar/404/görsel/sitemap HTTP kontrolü ve91 regresyon geçti. Caddy'siz API404 tam sistem testi sayılmaz; browser/piksel ve gerçek OTP login testi yapılmadı.
- VPS Compose PG16/Directus12.4/Node/Caddy, loopback8080/8055 ve ayrı cookie adı kullanır. Admin/seed yeniden oluşturulmaz. Secure cookie false sadece SSH tünel staging içindir; gerçekHTTPS'te true yapılacak.
- Kaynak proxy/Directus kısa süre durdurulup tutarlı snapshot alındı, finally açıldı. İlk checksum komutu hatası düzeltildi ve yeni tam snapshot başarılı. Kaynak veri silinmedi. Tam özel paket `C:\Users\Lenovo\AppData\Local\fizyoterapi-backups\20261010-a94723c2a8`: OneDrive/Git dışında ACL korumalı,2 yönetici/6 alan/3 blog/6 sayfa/22 çeviri; uploaded files0, statik portreler imajda. Secret korunur, yeni güçlü VPS DB parolası üretildi; sırların kendisi not/loglara yazılmadı.
- Kaynak arşivi68b5736, image save/SHA256 manifest hazır. Boş hedef restore betiği14 tablo parmak izi, upload bytes ve appsecret hash kontrolü yapacak; yalnız hedef session kopyasını iptal edecek. Gerçek hesap/TOTP değişmez; gerçek kullanıcı sırrıyla OTP üretip test yapılmaz.
- SSH hedefi kontrol edildi,33GB boş disk; sadece boş özel `/opt/furkantoplu/.migration/20261010-a94723c2a8` oluşturuldu. SCP çalıştırılmadan güvenlik denetimi reddetti: DB/parola hashleri/TOTP/secret'ın149.56.103.60'a aktarımı için açık kullanıcı onayı bekleniyor. Red başka araçla aşılmadı; dosya/DB aktarımı, restore, VPS container startup ve DNS/CF/TLS yapılmadı.
- Geçici yerel üretim test container'ı kaldırıldı; imaj/yedekler ve asıl yerel site korunur. Bekleyenler onay→aktarım/restore→özel tünel/proxy/admin kabulü→düzenli yedek→domain/HTTPS/CF. Üç Obsidian notu eşitlik guard/hash ile senkronlanır, yalnız paket dosyaları Git'e alınır.

## 20 Eylül 2026

### Araştırma ve kapsam

- Türkiye ve yurt dışındaki güncel fizyoterapist sitesi örnekleri incelendi.
- Güçlü ortak desenler belirlendi: gerçek uzman fotoğrafı, anlaşılır çalışma alanları, görünür iletişim bilgisi, konum bilgisi ve mobil uyumluluk.
- Türkiye'deki sağlık tanıtımı ve KVKK sınırları mimariye dahil edildi.
- Projenin hasta takip sistemi olmadığı netleştirildi.
- Online ödeme, hasta hesabı, seans takibi ve sağlık verisi toplama ilk sürüm kapsamından çıkarıldı.

### İlk görsel konsept

- Müşteri sunumu için yüksek sadakatli masaüstü ana sayfa mockupı üretildi.
- Görsel yön: kırık beyaz, koyu orman yeşili, adaçayı ve terracotta.
- Tasarım dili: sıcak, bilimsel, güvenilir fakat hastane şablonu gibi olmayan kişisel portföy.
- Mockup proje içinde `assets/fizyoterapist-anasayfa-konsept-v1.png` olarak saklandı.

### İlk mimari kararı

- Başlangıçta Next.js + Sanity Studio düşünüldü.
- Site sahibinin e-posta/parola ve Google Authenticator uyumlu TOTP isteği netleşince CMS kararı değiştirildi.
- Self-hosted Directus + PostgreSQL seçildi.
- Yönetim panelinin özel bir path altında çalışması planlandı.
- Production ortamının VPS, Docker Compose, Cloudflare ve domain üzerinden kurulması kararlaştırıldı.

## 21 Eylül 2026

### Paket 1 — Tasarım temeli, header ve hero

- Frontend projesi `frontend/` klasöründe kuruldu.
- React, TypeScript ve Vinext tabanlı çalışma ortamı hazırlandı.
- Projeye özel renk tokenları ve temel tipografi oluşturuldu.
- Marka alanı, navigasyon ve randevu bilgisi butonu hazırlandı.
- Masaüstü ve mobil hero yerleşimi oluşturuldu.
- Fizyoterapi sahnesi için bağımsız hero fotoğrafı üretildi ve `frontend/public/hero-physiotherapy-v1.png` olarak saklandı.
- Siteye özel yaprak/hareket temalı favicon hazırlandı.
- Hero metinleri sağlık reklamı sınırlarına uygun, iddiasız ve bilgilendirici tutuldu.
- Yerel önizleme `http://localhost:5173/` üzerinde çalıştırıldı.
- Production build başarıyla doğrulandı.

### Paket 2 — Çalışma alanları

- Ana sayfaya koyu yeşil zeminli çalışma alanları bölümü eklendi.
- Dört örnek alan tanımlandı:
  - Bel ve Boyun Sağlığı
  - Sporcu Rehabilitasyonu
  - Ameliyat Sonrası Süreç
  - Duruş ve Hareket Analizi
- Kart yapısı masaüstünde dört sütun, tablette iki sütun ve mobilde tek sütun olacak şekilde hazırlandı.
- İlk kart terracotta vurgu rengiyle öne çıkarıldı.
- İçeriklerin genel bilgilendirme amaçlı olduğuna dair not eklendi.
- Production build yeniden başarıyla doğrulandı.

### Sürüm kontrol kararı

- Projede yerel Git kullanılmasına karar verildi.
- GitHub repository veya remote henüz oluşturulmayacak.
- Push işlemleri kullanıcı GitHub reposunu açtığını bildirdikten sonra yapılacak.
- Her anlamlı arayüz paketi yerel bir commit ile işaretlenecek.

### Yerel Git başlangıcı

- Proje kökünde yerel Git deposu oluşturuldu.
- GitHub remote eklenmedi ve push yapılmadı.

### Paket 5 — İletişim ve alt bilgi

- Ana sayfaya `#iletisim` kimliğini kullanan iletişim bölümü eklendi.
- Ziyaretçinin doğrudan ulaşabilmesi için telefon, WhatsApp ve e-posta seçenekleri tasarlandı.
- Sağlık verisi toplayabilecek bir iletişim formu özellikle eklenmedi.
- Görüşme konumu, çalışma günleri ve çalışma saatleri için ayrı bilgi alanları oluşturuldu.
- Telefon, e-posta, adres ve sosyal medya bilgileri müşteri verileri gelene kadar sunum amaçlı örnek değerlerle dolduruldu.
- Alt bilgi bölümüne marka alanı, sayfa navigasyonu, Instagram bağlantısı, genel bilgilendirme notu ve yasal metin bağlantıları eklendi.
- Masaüstü, tablet ve mobil kırılımlar için iletişim kartları ve footer yerleşimi ayrı ayrı düzenlendi.
- Yerel geliştirme sunucusu yeniden başlatıldı ve `http://localhost:5173/#iletisim` adresi HTTP 200 yanıtıyla doğrulandı.
- Masaüstü iletişim ve footer görünümü tarayıcıda görsel olarak kontrol edildi.
- İlk derlemede mevcut ikon paketinde Instagram ikonu bulunmadığı görüldü; bağımlılık eklemek yerine uyumlu metin işareti kullanıldı.
- Düzeltme sonrasında production build başarıyla tamamlandı.
- İletişim ve alt bilgi paketi `7aabaab` kimliğiyle yerel Git deposuna kaydedildi.
- Commit mesajı: `feat: add contact and footer sections`.
- GitHub remote eklenmedi ve push yapılmadı.
- İlk kontrol noktası `f5eeab4` kimliğiyle oluşturuldu.
- İlk commit mesajı: `feat: establish physiotherapy site foundation`.
- Bu commit; mimari notlarını, ilk mockupı, frontend temelini, hero bölümünü ve çalışma alanları paketini kapsıyor.

### Dokümantasyon kararı

- Projedeki mimari, teknik kararlar ve günlük gelişmeler Obsidian notlarıyla birlikte ilerleyecek.
- Kanonik notların proje içindeki aynası `docs/obsidian-sync/` altında tutulacak.
- Aynı notlar Obsidian kasasındaki `cybersecurity/fizyoterapist` klasörüne eşitlenecek.

### Paket 3 — Hakkımda ve yaklaşım

- Ana sayfaya Hakkımda bölümü eklendi.
- Gerçek müşteri fotoğrafları gelene kadar kullanılmak üzere bağımsız bir fizyoterapist portresi üretildi.
- Geçici portre `frontend/public/about-physiotherapist-v1.png` olarak kaydedildi.
- Bölümde kişisel yaklaşımı anlatan iki kısa metin ve üç temel değer kullanıldı: dinlemek, anlamak ve birlikte ilerlemek.
- Süreç; dinleme, yol haritası oluşturma ve takip olmak üzere üç adımda görselleştirildi.
- Navigasyondaki Hakkımda ve Çalışma Alanları bağlantıları gerçek bölüm kimliklerine bağlandı.
- Mobil görünümde portre, değerler ve süreç adımları tek sütun yapısına dönüştürüldü.
- Production build başarıyla tamamlandı.

### Paket 3 — Git kontrol noktası

- Hakkımda ve yaklaşım paketi `14f51c0` kimliğiyle yerel Git deposuna kaydedildi.
- Commit mesajı: `feat: add about and care approach section`.
- GitHub remote eklenmedi ve herhangi bir uzak depoya push yapılmadı.

### Paket 4 — Bilgi Köşesi blog önizlemesi

- Ana sayfaya `#blog` kimliğini kullanan Bilgi Köşesi bölümü eklendi.
- Navigasyondaki Blog bağlantısı yeni bölüme bağlandı.
- İleride Directus üzerinden gelecek blog kayıtlarına benzer bir veri yapısı hazırlandı: kategori, başlık, özet, yayın tarihi ve tahmini okuma süresi.
- Üç örnek içerik kartı oluşturuldu:
  - Masa başında geçen günlerde hareket molaları neden önemli?
  - Egzersizde düzeni korumayı kolaylaştıran üç küçük adım
  - İlk fizyoterapi görüşmesinde sizi neler bekler?
- İlk yazı koyu yeşil vurgulu kartla öne çıkarıldı; diğer iki yazı açık editoryal kartlarla sunuldu.
- Bölüm yeni bir fotoğraf eklenmeden, tipografi ve sade geometrik detaylarla hazırlandı. Böylece son sitedeki görsel sayısı kontrollü tutuldu.
- İçeriklerin genel bilgilendirme amaçlı olduğu ve kişisel tanı veya tedavi önerisi yerine geçmediği belirtildi.
- Kart düzeni masaüstünde üç sütun, tablette iki sütun ve mobilde tek sütun olarak ayarlandı.
- Yerel önizleme `http://localhost:5173/#blog` adresinde HTTP 200 yanıtıyla ve görsel kontrolle doğrulandı.
- Production build başarıyla tamamlandı.
- Bilgi Köşesi paketi `2f17d78` kimliğiyle yerel Git deposuna kaydedildi.
- Commit mesajı: `feat: add blog preview section`.
- GitHub remote eklenmedi ve push yapılmadı.

### Docker temel altyapısı ve GitHub geçişi

- Kullanıcının talebiyle projenin sunucuya aktarımını kolaylaştıracak Docker temeli arayüz aşamasında hazırlandı.
- Frontend için iki aşamalı `frontend/Dockerfile` oluşturuldu:
  - İlk aşama bağımlılıkları kurup production build alıyor.
  - İkinci aşama yalnızca derleme çıktısını ve sabitlenmiş Wrangler çalışma ortamını içeriyor.
  - Runtime root kullanıcısı yerine `node` kullanıcısıyla çalışıyor.
- Docker build bağlamından `node_modules`, build çıktıları, yerel ayarlar ve `.env` dosyalarını çıkaran `.dockerignore` eklendi.
- Proje köküne `compose.yaml` eklendi.
- Compose içinde mevcut iki servis tanımlandı:
  - `frontend`: Vinext uygulaması, dahili 3000 portu ve sağlık kontrolü.
  - `proxy`: Caddy 2.10, varsayılan olarak host üzerindeki 8080 portu.
- `deploy/Caddyfile` ile gzip/zstd sıkıştırma, temel güvenlik başlıkları ve frontend reverse proxy ayarlandı.
- Gizli `.env` dosyaları, yedek klasörleri ve loglar kök `.gitignore` içine alındı.
- İlk container testinde root olmayan kullanıcının Wrangler geçici klasörüne yazamadığı belirlendi.
- Docker imajında yalnızca gerekli çalışma klasörleri `node` kullanıcısına verilerek sorun giderildi; container root kullanıcısına alınmadı.
- `docker compose up -d --build` başarıyla tamamlandı.
- Frontend container sağlık kontrolü `healthy` durumuna geçti.
- Caddy üzerinden `http://localhost:8080/` adresinden HTTP 200 yanıtı alındı.
- Docker kullanım komutları kök `README.md` dosyasına ve teknik karar notuna eklendi.
- Kullanıcı `https://github.com/furkantoplu/Portfolio.git` deposunu hedef remote olarak bildirdi ve push yetkisi verdi.
- Docker temel altyapısı `2f9f056` kimliği ve `chore: add docker deployment foundation` mesajıyla commit edildi.
- Uzak GitHub deposunun boş olduğu `git ls-remote` ile doğrulandı; mevcut bir uzak geçmişin üzerine yazılmadı.
- Yerel dal `master` adından `main` adına taşındı.
- `origin` remote'u `https://github.com/furkantoplu/Portfolio.git` adresine eklendi.
- Tüm yerel commit geçmişi `origin/main` dalına başarıyla push edildi ve upstream takibi kuruldu.
- Docker doğrulaması sonrasında daha önce açık bırakılan `localhost:5173` geliştirme sunucusu durduruldu; çalışan sunum ortamı Docker üzerinden `http://localhost:8080/` olarak bırakıldı.

### Paket 6 — Sabit navbar ve ilk çalışma alanı detay sayfası

- Mevcut tema ve görsel yön korunarak iç sayfa tasarımlarına geçildi.
- Header içeriği tekrar kullanılabilir `app/components/site-header.tsx` bileşenine taşındı.
- Navigasyon ana sayfa ve detay sayfasında aynı ortak bileşeni kullanacak şekilde düzenlendi.
- Navbar `position: fixed` yapısına geçirildi; sayfa kaydırılırken ekrandan bağımsız biçimde üstte kalması sağlandı.
- Sabit menüye yarı saydam arka plan, blur, ince sınır ve hafif gölge eklendi.
- Sayfa içeriklerine navbar yüksekliği kadar üst boşluk verildi; bölüm bağlantılarının menünün altında kalmaması için `scroll-margin-top` tanımlandı.
- Mobil görünümde navbar yüksekliği ve sayfa üst boşluğu 78 piksele uyarlandı.
- Ana sayfadaki `Bel ve Boyun Sağlığı` kartı `/calisma-alanlari/bel-ve-boyun-sagligi` rotasına bağlandı.
- Bel ve Boyun Sağlığı detay sayfasına özel başlık ve açıklama metadata'sı eklendi.
- Detay sayfasında şu bölümler tasarlandı:
  - Çalışma alanlarına dönüş bağlantısı ve görsel hero alanı
  - Genel değerlendirme yaklaşımı ve örnek değerlendirme başlıkları
  - Üç aşamalı süreç anlatımı
  - İlk görüşme öncesi kısa soru ve cevaplar
  - İletişim yönlendirmesi ve sade alt bilgi
- Sağlık reklamı sınırları korunarak garanti, kesin sonuç veya tanı dili kullanılmadı.
- Sayfada içeriklerin genel bilgilendirme amaçlı olduğuna ilişkin görünür uyarı kullanıldı.
- Yeni sayfa için ek görsel üretilmedi; mevcut fizyoterapi görseli farklı kırpma ile tekrar kullanıldı.
- Production build ana sayfa ve yeni detay rotasıyla başarıyla tamamlandı.
- Docker imajı yeniden oluşturuldu ve frontend container sağlık kontrolünden geçti.
- `http://localhost:8080/` ve `http://localhost:8080/calisma-alanlari/bel-ve-boyun-sagligi` rotalarının ikisi de HTTP 200 yanıtıyla doğrulandı.
- Detay sayfasının ilk görünümü ve kaydırma sonrasında sabit navbar davranışı tarayıcıda görsel olarak kontrol edildi.
- Paket `518e625` kimliği ve `feat: add fixed navigation and practice detail page` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

## 22 Eylül 2026

### Paket 7 — Blog liste ve ilk yazı detay tasarımı

- Frontend geliştirmesine blog deneyimiyle devam edildi.
- Navbar içindeki Blog bağlantısı ana sayfa bölümünden bağımsız `/blog` rotasına taşındı.
- Ana sayfadaki “Tüm yazıları görün” bağlantısı yeni blog liste sayfasına bağlandı.
- Ana sayfadaki ilk blog kartı `/blog/masa-basinda-hareket-molalari` yazı detayına bağlandı.
- Tekrarlanan footer yapısı `app/components/site-footer.tsx` bileşenine taşındı.
- Ana sayfa, blog listesi ve blog yazısı aynı footer bileşenini kullanacak şekilde düzenlendi.
- `/blog` sayfasında şu alanlar tasarlandı:
  - Koyu yeşil editoryal giriş alanı
  - Görselli öne çıkan yazı
  - Kategori, tarih ve tahmini okuma süresi bilgileri
  - Bilgi arşivi kartları
  - Genel bilgilendirme uyarısı
- Henüz detay sayfası hazırlanmayan iki örnek içerik “Yakında” durumuyla gösterildi; bozuk sayfa bağlantısı oluşturulmadı.
- `/blog/masa-basinda-hareket-molalari` rotasında ilk yazı detay tasarımı oluşturuldu.
- Yazı detayına özel metadata başlığı ve açıklaması tanımlandı.
- Yazı sayfasında içerik özeti, geniş kapak görseli, masaüstünde sabit içerik dizini, metin bölümleri, vurgulu alıntı, uygulanabilir adım kartları ve iletişim yönlendirmesi yer aldı.
- İçerik dili genel bilgilendirme sınırında tutuldu; kişisel egzersiz, tanı veya tedavi önerisi verilmedi.
- Yeni görsel üretilmedi; mevcut fizyoterapi görseli editoryal kırpma ile tekrar kullanıldı.
- Production build dört rota ile başarıyla tamamlandı:
  - `/`
  - `/blog`
  - `/blog/masa-basinda-hareket-molalari`
  - `/calisma-alanlari/bel-ve-boyun-sagligi`
- Docker imajı yeniden oluşturuldu ve frontend container `healthy` durumuna geçti.
- Dört rotanın tamamı Docker/Caddy üzerinden HTTP 200 yanıtıyla doğrulandı.
- Blog liste sayfası ve ilk yazı detay sayfası tarayıcıda görsel olarak kontrol edildi.
- Paket `e36e7cd` kimliği ve `feat: add blog listing and article design` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

### Paket 8 — İşlevsel mobil navigasyon

- Tablet ve mobil görünümde daha önce yalnızca görsel olan menü düğmesi işlevsel hale getirildi.
- Ortak header etkileşimli bir istemci bileşeni olarak düzenlendi.
- 1120 piksel ve altındaki ekranlarda sağdan açılan koyu yeşil navigasyon paneli tasarlandı.
- Panelde numaralandırılmış ana sayfa, hakkımda, çalışma alanları, blog ve iletişim bağlantıları gösterildi.
- Mevcut rota panel içinde görsel olarak vurgulandı.
- Mobil randevu yönlendirmesi panelin alt bölümüne yerleştirildi.
- Menü düğmesinin açık/kapalı durumuna uygun menü ve çarpı ikonları eklendi.
- Menü; düğmeye yeniden basıldığında, panel dışına dokunulduğunda, bağlantı seçildiğinde ve Escape tuşuna basıldığında kapanacak şekilde hazırlandı.
- Panel açıkken arka sayfanın kaydırılması durduruldu; panel kapandığında body kaydırma ayarı temizleniyor.
- `aria-expanded`, `aria-controls`, durumla değişen erişilebilir etiketler ve kapalı panel bağlantıları için odak kontrolü eklendi.
- Marka işareti ve navigasyon verisi ayrı ortak modüllere taşındı. Böylece istemci bileşeni sınırı footer'a taşınmadı ve header/footer aynı bağlantı kaynağını kullanmaya devam etti.
- İlk Docker denemesinde istemci bileşeni sınırı nedeniyle ana sayfanın HTTP 500 verdiği tespit edildi. Ortak veri ve marka bileşeni ayrıştırılarak sorun giderildi.
- Production build dört rota ile başarıyla tamamlandı.
- Docker imajı yeniden oluşturuldu ve frontend container `healthy` durumuna geçti.
- `/`, `/blog`, `/blog/masa-basinda-hareket-molalari` ve `/calisma-alanlari/bel-ve-boyun-sagligi` rotalarının tamamı Docker/Caddy üzerinden HTTP 200 yanıtıyla doğrulandı.
- 390 × 844 piksel mobil görünümde kapalı ve açık menü görsel olarak kontrol edildi; panelin ekrana sığdığı ve Escape ile kapandığı doğrulandı.
- Paket `c7a3f34` kimliği ve `feat: add responsive mobile navigation` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

### Paket 9 — Ortak çalışma alanı şablonu ve Sporcu Rehabilitasyonu

- Çalışma alanlarının ziyaretçi açısından ayrı sayfa ve ayrı URL kullanmasına karar verildi.
- Sayfaların kopyala-yapıştır kodlarla çoğaltılmaması için tekrar kullanılabilir `PracticeDetail` bileşeni oluşturuldu.
- Ortak şablon hero, değerlendirme alanı, üç aşamalı süreç, SSS, iletişim yönlendirmesi ve alt bilgi bölümlerini içeriyor.
- Şablonun içerik modeli; sıra numarası, başlık, vurgulu başlık, giriş metni, görsel, genel değerlendirme metni, değerlendirme maddeleri, süreç adımları ve sorulardan oluşuyor.
- Mevcut `/calisma-alanlari/bel-ve-boyun-sagligi` sayfası görünümü değiştirilmeden ortak şablona taşındı.
- `/calisma-alanlari/sporcu-rehabilitasyonu` adresinde ikinci çalışma alanı detay sayfası oluşturuldu.
- Sporcu Rehabilitasyonu sayfasına özel SEO başlığı ve açıklaması eklendi.
- İçerikte spor dalının gereksinimleri, hareket kapasitesi, kademeli yüklenme, spora dönüş hedefleri ve sık sorulan sorular ele alındı.
- Kesin iyileşme veya kesin spora dönüş süresi vaadi kullanılmadı; içerik genel bilgilendirme sınırında tutuldu.
- Ana sayfadaki Sporcu Rehabilitasyonu kartı yeni detay rotasına bağlandı.
- Production build beş rota ile başarıyla tamamlandı.
- Docker imajı yeniden oluşturuldu ve frontend container `healthy` durumuna geçti.
- Beş rotanın tamamı Docker/Caddy üzerinden HTTP 200 yanıtıyla doğrulandı.
- Yeni sayfa masaüstü ve 390 × 844 piksel mobil görünümde görsel olarak kontrol edildi.
- Paket `6082811` kimliği ve `feat: add reusable practice detail pages` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

### Paket 10 — Çalışma alanları frontend bütününün tamamlanması

- Kullanıcının onayıyla önceki küçük paketlerden daha geniş kapsamlı bir frontend paketi hazırlandı.
- `/calisma-alanlari` adresinde dört çalışma alanını tek yerde sunan bağımsız bir dizin sayfası oluşturuldu.
- Dizin sayfasında editoryal giriş alanı, dört büyük çalışma alanı kartı, yaklaşım uyarısı, iletişim yönlendirmesi ve ortak footer kullanıldı.
- Masaüstünde iki sütun, mobilde tek sütun kart düzeni hazırlandı.
- Header ve footer içindeki “Çalışma Alanları” bağlantısı ana sayfa içi bağlantı yerine yeni dizin sayfasına yönlendirildi.
- Ana sayfadaki hero ve bölüm içi bağlantılar, ziyaretçiyi aynı sayfadaki çalışma alanı bölümüne götürmeye devam ediyor.
- Dört çalışma alanının temel katalog verileri `app/components/practice-catalog.ts` dosyasında merkezileştirildi:
  - Sıra numarası
  - Slug
  - Başlık
  - Kısa açıklama
  - Detay URL'si
- Ana sayfa kartları ve çalışma alanı dizini aynı katalog verisini kullanacak şekilde düzenlendi.
- `/calisma-alanlari/ameliyat-sonrasi-surec` detay sayfası oluşturuldu.
- Ameliyat sonrası içerikte hekim yönlendirmesinin esas olduğu açıkça belirtildi; kesin başlangıç zamanı veya sonuç vaadi kullanılmadı.
- `/calisma-alanlari/durus-ve-hareket-analizi` detay sayfası oluşturuldu.
- Duruş içeriğinde tek bir “doğru duruş” iddiası yerine hareket çeşitliliği, günlük bağlam ve kişisel değerlendirme yaklaşımı kullanıldı.
- İki yeni sayfaya özgü SEO başlıkları ve açıklamaları eklendi.
- `PracticeDetail` içerik modeline slug bilgisi eklendi.
- Her detay sayfasının sonuna mevcut sayfa dışındaki üç çalışma alanını gösteren çapraz yönlendirme bölümü eklendi.
- Böylece ziyaretçi bir detay sayfasından diğer çalışma alanlarına veya genel çalışma alanı dizinine doğrudan geçebiliyor.
- Production build sekiz rotayla başarıyla tamamlandı.
- Docker imajı yeniden oluşturuldu ve frontend container `healthy` durumuna geçti.
- Sekiz rotanın tamamı Docker/Caddy üzerinden HTTP 200 yanıtıyla doğrulandı.
- Çalışma alanları dizini masaüstü ve 390 × 844 piksel mobil görünümde kontrol edildi.
- Duruş ve Hareket Analizi detay sayfasının hero alanı ile detay sayfalarının çapraz yönlendirme bölümü görsel olarak kontrol edildi.
- Paket `a39dfe7` kimliği ve `feat: complete practice areas frontend` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

### Paket 11 — Hakkımda, İletişim ve yasal taslak sayfaları

- Büyük frontend paketi kapsamında kurumsal ve yasal sayfa tasarımları tamamlandı.
- `/hakkimda` adresinde bağımsız Hakkımda sayfası oluşturuldu.
- Hakkımda sayfasında portreli hero, mesleki yaklaşım, çalışma ilkeleri ve çalışma alanlarına yönlendirme bölümleri hazırlandı.
- Müşteriden henüz alınmayan diploma, eğitim ve sertifika bilgileri uydurulmadı; gerçek içerik bekleyen alan açık bir notla belirtildi.
- `/iletisim` adresinde bağımsız İletişim sayfası oluşturuldu.
- Telefon, WhatsApp ve e-posta seçenekleri büyük erişilebilir bağlantı kartları olarak tasarlandı.
- Görüşme adresi, çalışma saatleri ve iletişimden ilk görüşmeye kadar üç adımlı süreç bölümü eklendi.
- İlk iletişimde sağlık raporu veya ayrıntılı sağlık verisi gönderilmemesi gerektiği görünür biçimde belirtildi.
- Bilinçli veri minimizasyonu kararıyla ilk sürüme iletişim formu eklenmedi.
- `/kvkk-aydinlatma-metni` ve `/gizlilik` rotaları oluşturuldu.
- İki yasal sayfanın ortak düzeni `LegalDocument` bileşeninde merkezileştirildi.
- KVKK taslağında veri sorumlusu kimliği, işlenebilecek veriler, işleme amaçları, aktarım/yöntem/hukuki sebep ile ilgili kişi hakları ayrı bölümlerde sunuldu.
- Gizlilik taslağında site kapsamı, harici iletişim bağlantıları, teknik kayıtlar, çerez/ölçüm araçları ve güncelleme bilgileri yer aldı.
- Yasal metinlerin gerçek veri işleme envanteri ve production sağlayıcıları kesinleşmeden nihai olmadığı açıkça gösterildi.
- Taslak oluşturulurken Kişisel Verileri Koruma Kurumunun resmî aydınlatma yükümlülüğü sayfası ve kamuoyu duyurusu kontrol edildi:
  - https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-
  - https://www.kvkk.gov.tr/Icerik/6765/AYDINLATMA-YUKUMLULUGUNUN-YERINE-GETIRILMESI-HAKKINDA-KAMUOYU-DUYURUSU
- Navbar içindeki Hakkımda ve İletişim bağlantıları bağımsız sayfalara taşındı.
- Header randevu butonları ve site genelindeki iletişim çağrıları `/iletisim` rotasına bağlandı.
- Footer içindeki KVKK ve Gizlilik bağlantıları gerçek rotalara bağlandı.
- Production build on iki rota ile başarıyla tamamlandı.
- Docker imajı yeniden oluşturuldu ve frontend container `healthy` durumuna geçti.
- On iki rotanın tamamı Docker/Caddy üzerinden HTTP 200 yanıtıyla doğrulandı.
- Hakkımda ve İletişim sayfaları masaüstünde; İletişim ve KVKK sayfaları 390 × 844 piksel mobil görünümde görsel olarak kontrol edildi.
- Paket `2f4a5b5` kimliği ve `feat: add about contact and legal pages` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

## 23 Eylül 2026

### Paket 12 — Furkan Toplu kişiselleştirmesi ve backend temeli

- Site genelindeki örnek fizyoterapist adı `Furkan Toplu` olarak güncellendi.
- Sayfa metadata'ları, header, footer, ana sayfa, kurumsal sayfalar, çalışma alanları, blog ve yasal taslaklarda aynı isim kullanıldı.
- Örnek iletişim e-postası `merhaba@furkantoplu.com` olarak düzenlendi.
- Ana sayfadaki dört çalışma alanı kartının bağlantı metni `Detayları incele` yapıldı.
- Kart bağlantılarının yazı boyutu 12 pikselden 13 piksele yükseltildi.
- Backend'e ilk kontrollü geçiş paketi hazırlandı.
- Docker Compose'a `postgres:16-alpine` tabanlı `database` servisi eklendi.
- PostgreSQL dışarıya port açmadan yalnızca Docker ağı içinde çalışacak şekilde yapılandırıldı.
- Veritabanı verileri `postgres_data` adlı kalıcı volume'a bağlandı ve `pg_isready` sağlık kontrolü eklendi.
- Docker Compose'a sürümü açıkça sabitlenmiş `directus/directus:12.4.0` servisi eklendi.
- Directus, PostgreSQL sağlık kontrolü başarılı olduktan sonra başlayacak şekilde bağımlı hale getirildi.
- Directus yönetim portu geliştirme ortamında yalnızca `127.0.0.1:8055` adresine açıldı; yerel ağdan veya internetten doğrudan erişim engellendi.
- Directus yüklemeleri ve eklentileri `directus_uploads` ve `directus_extensions` kalıcı volume'larına bağlandı.
- Directus telemetrisi kapatıldı, WebSocket desteği etkinleştirildi ve yönetim arayüzü üzerinden container sağlık kontrolü eklendi.
- Gizli olmayan ortam değişkeni şablonu `.env.example` dosyasına eklendi.
- Gerçek yerel parolalar ve Directus secret değeri yalnızca Git tarafından yok sayılan `.env` dosyasında tutuldu.
- İlk bootstrap sırasında `.local` uzantılı yönetici e-postasının Directus tarafından geçerli kabul edilmediği görüldü; adres `admin@furkantoplu.com` olarak düzeltildi.
- Veritabanı ilk denemede kurulmuş olduğundan yönetici hesabı Directus CLI ile güvenli biçimde oluşturuldu.
- Yönetici oturum açma isteği HTTP 200 yanıtıyla doğrulandı; parola terminal çıktısına veya dokümana yazılmadı.
- Directus 12'de anonim `/server/health` isteğinin 403 döndürdüğü belirlendi; container sağlık kontrolü başarılı yanıt veren `/admin/` rotasına taşındı.
- `database`, `directus` ve `frontend` container'larının `healthy`, Caddy `proxy` servisinin çalışır durumda olduğu doğrulandı.
- Site `http://localhost:8080/`, yönetim arayüzü `http://localhost:8055/admin/` üzerinden HTTP 200 yanıtıyla kontrol edildi.
- Tarayıcı kontrolünde sayfa başlığının `Fzt. Furkan Toplu | Fizyoterapi` olduğu ve dört kart bağlantısının `Detayları incele` metnini 13 piksel boyutunda gösterdiği doğrulandı.
- Bu paket yalnızca backend çalışma temelini kurdu; içerik koleksiyonları, roller/izinler, TOTP, production `/bakir` yönlendirmesi ve yedekleme sıradaki backend paketlerine bırakıldı.
- Paket `ed68940` kimliği ve `feat: add backend foundation and personalize site` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

### Paket 13 — Yönetilebilir çalışma alanları şeması

- Çalışma alanlarının sayısının yaklaşık 15'e ve ileride daha fazlasına çıkabileceği gereksinimi mimariye eklendi.
- Çalışma alanlarının koda sabit sayfalar olarak eklenmesi yerine Directus `practice_areas` koleksiyonundan yönetilmesine karar verildi.
- Tekrar çalıştırıldığında mevcut veri veya şemayı silmeyen `scripts/bootstrap-directus.mjs` kurulum betiği oluşturuldu.
- Betik yönetici bilgilerini Git'e kapalı `.env` dosyasından okur; parola veya erişim anahtarını çıktıya yazmaz.
- `practice_areas` koleksiyonuna yayın durumu, sıralama, ana sayfada gösterme, başlık, slug, kart açıklaması, giriş, detay metni, değerlendirme maddeleri, süreç adımları, SSS ve SEO alanları eklendi.
- Yayın durumu için `Taslak`, `Yayında` ve `Gizli` seçenekleri tanımlandı.
- `Gizli` durumundaki kayıtların silinmeden yayından kaldırılması; `Ana sayfada göster` seçeneğinin ise genel yayından bağımsız olarak ana sayfa kartlarını sınırlandırması kararlaştırıldı.
- Slug alanına benzersizlik kuralı eklendi; iki çalışma alanının aynı URL'yi üretmesi engellendi.
- Directus alanları Türkçe etiketler ve açıklamalarla panelde anlaşılır hale getirildi.
- Mevcut dört çalışma alanı başlangıç verisi olarak `Yayında` ve `Ana sayfada göster` durumunda eklendi.
- Kurulum betiği ikinci kez çalıştırıldı; koleksiyonun ve dört kaydın çoğaltılmadığı doğrulandı.
- Veritabanında dört kaydın sırası, başlığı, slug değeri ve yayın durumu doğrudan kontrol edildi.
- Bu paket henüz public API izni veya frontend veri bağlantısı açmaz. Sonraki paket yalnızca yayınlanmış kayıtların okunmasını sağlayacak ve liste/detay sayfalarını Directus verisine bağlayacaktır.
- Paket `03d1652` kimliği ve `feat: add manageable practice areas schema` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

### Paket 14 — Directus–frontend çalışma alanları bağlantısı

- Mevcut dört detay sayfasındaki tüm başlık, açıklama, değerlendirme maddesi, süreç adımı, SSS ve SEO içeriği Directus kayıtlarına aktarıldı.
- `practice_areas` koleksiyonuna detay hero başlıkları, vurgu başlıkları, giriş metni, görsel yolu/alternatif metni ve değerlendirme başlıkları için eksik alanlar eklendi.
- Kurulum betiği mevcut yönetici düzenlemelerini ezmemek için yalnızca boş alanları tamamlayacak şekilde geliştirildi.
- Directus 12.4.0 ücretsiz kurulumunda özel satır bazlı permission kuralının `custom_permission_rules_enabled` lisans kısıtına takıldığı kurulum sırasında tespit edildi.
- Gizli kayıtları standart public API ile açmamak için anonim `items/practice_areas` erişimi kapalı bırakıldı.
- `directus-extension-website-content` adlı salt-okunur endpoint eklentisi oluşturuldu ve Docker içindeki Directus extensions dizinine koddan bağlandı.
- Eklenti yalnızca `status = published` kayıtlarını ve frontend için açıkça listelenen alanları döndürür.
- Liste endpoint'i sıralamayı `sort` alanına göre yapar; `homepage=true` parametresi yalnızca ana sayfada gösterilecek kayıtları seçer.
- Detay endpoint'i yalnızca yayınlanmış ve slug değeri eşleşen tek kaydı döndürür; taslak, gizli veya bilinmeyen slug için 404 üretir.
- Directus loglarında `directus-extension-website-content` eklentisinin başarıyla yüklendiği doğrulandı.
- Standart anonim koleksiyon API'sinin HTTP 403 vermeye devam ettiği; özel yayın endpoint'inin HTTP 200 ile dört kayıt döndürdüğü doğrulandı.
- Frontend için `app/lib/directus.ts` sunucu tarafı veri katmanı oluşturuldu.
- Ana sayfa yalnızca yayınlanmış ve `Ana sayfada göster` işaretli kayıtları Directus'tan almaya başladı.
- `/calisma-alanlari` sayfası yayınlanmış kayıt sayısını, sıralamasını, başlığını ve kart açıklamasını Directus'tan alacak şekilde dönüştürüldü.
- Dört ayrı sabit rota tek `/calisma-alanlari/[slug]` dinamik rotasında birleştirildi.
- Dinamik rota metadata, detay içeriği, SSS ve diğer çalışma alanı bağlantılarını Directus verisinden üretir.
- Yeni eklenen çalışma alanları için boş bırakılabilen detay alanlarında güvenli varsayılan metin ve görsel davranışı tanımlandı.
- Vinext/Wrangler Worker ortamına `DIRECTUS_URL` binding'i eklendi; geliştirmede localhost, Docker'da `http://directus:8055` kullanılır.
- Production build başarılı oldu ve dinamik çalışma alanı rotası build çıktısında doğrulandı.
- Docker imajı yeniden oluşturuldu; database, Directus ve frontend servisleri `healthy` durumuna geçti.
- Ana sayfa, çalışma alanları dizini ve mevcut dört detay rotası HTTP 200; bilinmeyen slug HTTP 404 verdi.
- Duruş ve Hareket Analizi kaydı kısa süreliğine `Gizli` yapılarak listeden çıktığı ve detay URL'sinin 404 döndürdüğü doğrulandı; test sonunda kayıt yeniden `Yayında` durumuna alındı.
- Paket `e2699ea` kimliği ve `feat: connect practice areas to directus` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

## 24 Eylül 2026

### Paket 15 — Directus–frontend blog bağlantısı

- Kullanıcının isteği doğrultusunda çalışma alanlarına yeni kayıt eklenmedi; sonraki backend paketi blog yönetimine ayrıldı.
- Directus içinde `blog_posts` koleksiyonunu ve alanlarını idempotent biçimde oluşturan `scripts/bootstrap-blog.mjs` betiği eklendi.
- Blog modeline yayın durumu, sıralama, öne çıkarma, kategori, başlık, benzersiz slug, kart özeti, yayın tarihi, okuma süresi, kapak bilgileri, giriş, paragraflar, vurgulu alıntı, uygulanabilir adımlar, kapanış ve SEO alanları eklendi.
- Yayın durumu için `Taslak`, `Yayında` ve `Gizli` seçenekleri tanımlandı.
- Bir yayınlanmış örnek yazı ile gelecekte düzenlenebilmesi için iki taslak yazı başlangıç verisi olarak eklendi.
- Bootstrap betiği tekrar çalıştırıldı; mevcut koleksiyon ve kayıtların çoğaltılmadığı doğrulandı.
- `directus-extension-website-content` eklentisine `/blog-posts` ve `/blog-posts/:slug` salt-okunur endpoint'leri eklendi.
- Public endpoint yalnızca `status = published` kayıtlarını ve açıkça izin verilen alanları döndürecek şekilde sınırlandı.
- Ana sayfa en fazla üç yayınlanmış blog kaydını Directus'tan alacak şekilde güncellendi.
- `/blog` liste sayfası yayınlanmış kayıtları öne çıkan, yayın tarihi ve sıralama bilgilerine göre dinamik gösterecek şekilde dönüştürüldü.
- Eski sabit yazı rota dosyası kaldırıldı ve bütün yazılar için `/blog/[slug]` dinamik rotası oluşturuldu.
- Dinamik yazı sayfası metadata, kapak, paragraflar, alıntı, öneriler, kapanış ve okuma bilgilerini CMS kaydından üretir.
- Yapılandırılmış metin alanları ham HTML olarak çalıştırılmadan React metni şeklinde render edilir.
- Directus'un tarih alanını tam ISO zaman damgası olarak döndürdüğü görüldü; tarih biçimlendirici hem `YYYY-MM-DD` hem ISO değerlerini güvenli işleyecek şekilde düzeltildi.
- Yerel production build ve Docker içi production build başarıyla tamamlandı.
- Database, Directus ve frontend container'larının `healthy`, Caddy proxy servisinin çalışır durumda olduğu doğrulandı.
- `/`, `/blog` ve yayınlanmış örnek yazı Docker/Caddy üzerinden HTTP 200 yanıtı verdi.
- Taslak yazı slug'ı ve bilinmeyen blog slug'ı HTTP 404 verdi; taslak içeriğin public siteye sızmadığı doğrulandı.
- Paket `cf90022` kimliği ve `feat: connect blog content to directus` mesajıyla commit edildi.
- Kod ve dokümantasyon commitleri `origin/main` dalına başarıyla push edildi.

### Paket 16 — Directus proje sahibi uyarısının kaldırılması

- Directus yönetim panelinde “You have not set a project owner” başlıklı modalın açıldığı kullanıcı ekran görüntüsüyle tespit edildi.
- Pencerenin site ziyaretçi arayüzüne ait olmadığı; Directus 12'nin lisans uyumluluğu kapsamında yönetim panelinden proje sahibi e-postası toplama akışı olduğu doğrulandı.
- Directus'un resmî sürüm notlarında sahip bilgisi toplama ve senkronizasyonunu kapatmak için `PROJECT_OWNER_ENABLED` ortam değişkeninin desteklendiği kontrol edildi.
- `compose.yaml` içindeki Directus servisine `PROJECT_OWNER_ENABLED: ${DIRECTUS_PROJECT_OWNER_ENABLED:-false}` eklendi.
- Böylece yeni kurulumlarda ve VPS dağıtımında proje sahibi bilgisi toplama varsayılan olarak kapalı olacak; yöneticiye bu modal gösterilmeyecek.
- `.env.example` dosyasına `DIRECTUS_PROJECT_OWNER_ENABLED=false` örnek değeri ve açıklaması eklendi.
- Yapılandırmanın Directus lisans koşullarını değiştirmediği, yalnızca sahip bilgisi toplama ve senkronizasyonunu kapattığı README ve teknik karar notlarında açıkça kaydedildi.
- Directus servisi yeniden oluşturuldu; API'nin `project_owner_enabled: false` döndürdüğü, Directus ve frontend container'larının sağlıklı olduğu, site ile yönetim panelinin HTTP 200 verdiği doğrulandı.
- Düzeltme `59b84a9` kimliği ve `fix: disable directus owner prompt` mesajıyla commit edilerek `origin/main` dalına başarıyla push edildi.

## 26 Eylül 2026

### Paket 17 — Özel `/bakir` yönetim girişi ve TOTP temeli

- Deneme yayını sırasında görülen `Failed to fetch` hatasının uygulama kodundan değil, Docker Desktop'ın yanlışlıkla kapatılmış olmasından kaynaklandığı netleştirildi. Servisler açılınca API erişimi normale döndü.
- Site sahibinin günlük kullanımda Directus Studio'yu görmemesi için `/bakir` adresinde projeye özel yönetim arayüzü oluşturuldu.
- Arayüze e-posta, parola ve etkinse Google Authenticator'dan alınan 6 haneli TOTP koduyla giriş eklendi.
- Directus `mode: session` oturum modeli kullanıldı; oturum belirteci frontend JavaScript'ine verilmeden `httpOnly`, `SameSite=Lax` çerezle tutuldu.
- Caddy'ye `/bakir-api/*` ters proxy yolu eklendi. Böylece tarayıcı yönetim API'sine aynı origin üzerinden bağlanır ve ayrı CORS yapılandırmasına ihtiyaç duymaz.
- `/bakir` sayfasına hem metadata hem HTTP başlığı düzeyinde `noindex`, `nofollow`, `noarchive`; ayrıca `Cache-Control: no-store` koruması eklendi.
- Giriş sonrası yönetici adı, blog yazısı sayıları, çalışma alanı sayıları ve yayın/taslak/gizli özetleri gösterilen başlangıç panosu hazırlandı.
- Google Authenticator kurulumu için mevcut parolayla kurulum anahtarı üretme ve telefondaki güncel kodla TOTP'yi etkinleştirme akışı eklendi.
- TOTP gizli anahtarı otomatik etkinleştirilmedi, terminale veya dokümana yazılmadı. Gerçek kurulum site sahibinin telefonu elindeyken tamamlanacak.
- Directus ayarlarını idempotent uygulayan `scripts/bootstrap-security.mjs` oluşturuldu. Proje adı, Türkçe dil, en fazla beş başarısız giriş denemesi, güçlü parola politikası ve kapalı public kayıt ayarları uygulandı.
- Yerel HTTP ortamı için `DIRECTUS_SESSION_COOKIE_SECURE=false`, production HTTPS ortamı için `true` kullanılması `.env.example` ve README içinde belgelendi.
- Masaüstü ve 390 × 844 mobil giriş görünümü tarayıcıda görsel olarak kontrol edildi.
- Yeni `/bakir` dosyaları hedefli ESLint kontrolünden geçti; production build hem yerelde hem Docker imajı içinde başarıyla tamamlandı.
- Docker üzerinden `/bakir` HTTP 200, güvenlik başlıkları ve hatalı giriş HTTP 401 davranışı doğrulandı; tüm bağımlı servisler sağlıklı çalıştı.
- Bu paket güvenli giriş ve TOTP temelini tamamlar. Blog ve çalışma alanı ekleme/düzenleme/gizleme ekranları sıradaki yönetim paketinde hazırlanacaktır.
- Uygulama paketi `1fb0494` kimliği ve `feat: add secure custom admin access` mesajıyla commit edildi.

### Paket 18 — TOTP durum düzeltmesi ve çoklu yönetici desteği

- Kullanıcının Google Authenticator kurulumunu başarıyla tamamlamasına rağmen panelin kurulum formunu göstermeye devam ettiği bildirildi.
- Veritabanında mevcut yönetici hesabının `tfa_secret` değerinin dolu olduğu yalnızca boolean sonuçla doğrulandı; TOTP gizli anahtarı okunabilir çıktıya veya dokümana alınmadı.
- Hatanın TOTP kaydında değil, ilk panel sürümünün hesap güvenlik durumunu hiç sorgulamamasında olduğu belirlendi.
- Directus özel endpoint eklentisine kimliği doğrulanmış kullanıcıya ait güvenli `/admin-account` endpoint'i eklendi.
- Endpoint Directus oturumundan kullanıcıyı belirler, TOTP gizli anahtarını yanıttan çıkarır ve yalnızca `tfa_enabled` boolean bilgisini döndürür.
- `/bakir` paneli etkin hesaplarda kurulum formunu kaldırıp `İki adımlı doğrulama aktif` durumunu gösterecek şekilde güncellendi.
- TOTP yeni etkinleştirildiğinde panel durumu sayfa yenilemeden güncellenir.
- Çoklu yönetici için `/admin-team` endpoint'i eklendi. Endpoint yalnızca Directus `admin_access` politikasına sahip hesaplar tarafından kullanılabilir ve ekip üyelerinin gizli anahtarları yerine yalnızca 2FA açık/kapalı durumlarını döndürür.
- Yönetim paneline mevcut yöneticileri ve hesap bazında `2FA aktif` / `2FA bekliyor` durumunu gösteren ekip bölümü eklendi.
- Tam yetkili yöneticinin ad, soyad, e-posta ve geçici güçlü parolayla yeni yönetici oluşturabileceği form eklendi.
- Yeni hesap mevcut yönetici rolüne atanır; ortak hesap yerine her yönetici ayrı e-posta, parola, oturum ve Authenticator kurulumu kullanır.
- Yeni yönetici oluşturma testi sırasında gereksiz deneme hesabı bırakılmadı.
- Özel hesap ve ekip endpoint'lerinin oturumsuz istekleri HTTP 401 ile reddettiği Docker/Caddy üzerinden doğrulandı.
- Directus eklentisinin yeniden yüklendiği, frontend hedefli ESLint kontrolünün geçtiği ve Docker production build'inin başarıyla tamamlandığı doğrulandı.
- Tarayıcıda giriş ekranı yeniden kontrol edildi. Etkin durum ve ekip ekranının gerçek oturum doğrulaması, güvenlik gereği yönetici parolası/TOTP kodu otomasyona alınmadan kullanıcının bir sonraki girişiyle tamamlanacaktır.
- Uygulama paketi `38f7272` kimliği ve `feat: support account-aware two-factor auth` mesajıyla commit edildi.

### Paket 19 — Özel panelde blog yazısı yönetimi

- `/bakir` yönetim paneline site sahibinin Directus Studio'ya girmeden kullanabileceği blog yönetimi bölümü eklendi.
- Mevcut blog yazıları yayın durumu, başlık, kategori ve okuma süresiyle listelenir.
- Her yazı listeden seçilerek aynı ekranda düzenlenebilir; yayınlanmış yazı yeni sekmede public sitede açılabilir.
- Yeni yazı düğmesi boş ve varsayılan olarak taslak bir editör açar.
- Yazı başlığı girilirken yeni kayıtlarda Türkçe karakterleri güvenli dönüştüren slug otomatik üretilir; slug alanı ayrıca düzenlenebilir.
- Formda taslak/yayında/gizli durumu, kategori, başlık, slug, kart özeti, yayın tarihi, okuma süresi ve ana sayfada öne çıkarma seçenekleri bulunur.
- Giriş metni, boş satırlarla ayrılan ana paragraflar, vurgulu alıntı, kapanış başlığı/metni ve SEO başlığı/açıklaması düzenlenebilir.
- Paragraflar ham HTML yerine `{ text }` nesnelerinden oluşan güvenli JSON listesine dönüştürülerek Directus'a kaydedilir.
- Yeni kayıtlar Directus standart `POST /items/blog_posts`, düzenlemeler ve durum değişiklikleri `PATCH /items/blog_posts/:id` endpoint'leri üzerinden yapılır.
- Taslak veya gizli yazı tek düğmeyle yayınlanabilir; yayın tarihi boşsa güncel tarih atanır. Yayındaki yazı silinmeden gizlenebilir.
- Yanlışlıkla kalıcı veri kaybını önlemek için bu pakette silme düğmesi eklenmedi.
- Admin API istemcisi ayrı `admin-api.ts` modülüne taşınarak giriş, ekip ve içerik bileşenleri arasında güvenli biçimde paylaşıldı.
- Blog formunun veritabanı alanlarıyla uyumu transaction içinde geçici kayıt eklenip `ROLLBACK` edilerek doğrulandı; test sonunda kalıcı deneme kaydı kalmadı.
- Hedefli ESLint kontrolü, yerel production build ve Docker production build başarıyla tamamlandı.
- Docker servislerinin tamamı `healthy`, `/bakir` rotası HTTP 200 durumunda doğrulandı.
- Tarayıcı paneli oturum kapalı durumda bulundu; parola ve TOTP bilgilerine otomasyonla müdahale edilmedi. Editörün gerçek oturumdaki son kullanıcı görsel kontrolü bir sonraki manuel girişte yapılacaktır.
- Uygulama paketi `df9b1a9` kimliği ve `feat: add blog management workspace` mesajıyla commit edildi.

### Paket 20 — Sidebar tabanlı modüler admin navigasyonu

- Yönetim araçlarının tek uzun sayfada alt alta bulunmasının, çalışma alanı editörü eklendiğinde ciddi kullanım sorunu oluşturacağı kullanıcı tarafından belirtildi.
- `/bakir` paneli tek sayfalık dikey akıştan modüler yönetim kabuğuna dönüştürüldü.
- Masaüstü görünümüne viewport boyunca sabit kalan sol sidebar eklendi.
- Sidebar içinde Genel bakış, Blog yazıları, Çalışma alanları, Yöneticiler ve Hesap güvenliği bölümleri tanımlandı.
- Aktif bölüm koyu yeşil durumla belirginleştirilir; blog ve çalışma alanı menülerinde mevcut kayıt sayısı gösterilir.
- Yönetici ekibi menüsü yalnızca `admin_access` yetkisine sahip kullanıcılar tarafından görülür.
- Her menü seçimi yalnızca ilgili çalışma ekranını render eder; blog editörü, güvenlik ve ekip yönetimi artık uzun sayfada birlikte bulunmaz.
- Genel bakış ekranındaki içerik özet kartları butona dönüştürüldü ve doğrudan ilgili yönetim bölümüne bağlandı.
- Genel bakışa hesap güvenliği durumunu gösteren ve güvenlik ekranına götüren kısa kart eklendi.
- Henüz editörü tamamlanmayan Çalışma alanları bölümü için ayrı bir yer tutucu ekran hazırlandı; sıradaki paket aynı menü alanında uygulanacak.
- Sidebar altına oturumdaki yönetici bilgisi ve public siteyi yeni sekmede açan bağlantı eklendi.
- 900 piksel ve altında sidebar, header'ın altında sabitlenen yatay kaydırılabilir menüye dönüşür. Böylece mobilde ekran alanı korunurken bütün bölümlere hızlı erişim sürer.
- Header da sayfa kaydırıldığında görünür kalacak şekilde sticky yapıldı.
- Hedefli ESLint kontrolü, yerel production build ve Docker production build başarıyla tamamlandı.
- Uygulama paketi `ef1702a` kimliği ve `feat: add modular admin navigation` mesajıyla commit edildi.

### Paket 21 — Özel panelde çalışma alanı yönetimi

- Sidebar içindeki Çalışma alanları yer tutucusu gerçek içerik yönetim ekranıyla değiştirildi.
- Mevcut çalışma alanları yayın durumu, başlık ve ana sayfa görünürlük bilgisiyle listelenir.
- Yönetici listeden bir alanı seçerek düzenleyebilir veya `Yeni alan` düğmesiyle taslak kayıt hazırlayabilir.
- Yeni kayıt başlığı yazılırken Türkçe uyumlu slug ve detay başlığı otomatik oluşturulur.
- Yayın durumu taslak, yayında veya gizli olarak seçilebilir; sıralama değeri ve `Ana sayfadaki kartlarda göster` seçeneği yönetilebilir.
- Kart açıklaması, detay başlığı/vurgusu, giriş açıklaması, değerlendirme başlığı/vurgusu ve genel bilgilendirme alanları eklendi.
- Değerlendirme maddeleri her satırın ayrı madde olduğu sade textarea üzerinden düzenlenir.
- Süreç adımları `Başlık | Açıklama`, sık sorulan sorular `Soru | Cevap` biçiminde satır bazında girilir ve güvenli JSON listelerine dönüştürülür.
- SEO başlığı ve açıklaması aynı editör içinde düzenlenebilir.
- Listeden taslak/gizli alan tek düğmeyle yayınlanabilir; yayındaki alan silinmeden gizlenebilir.
- Yayınlanmış alanın public detay sayfasını yeni sekmede açan kontrol eklendi.
- Yeni kayıt sıralaması mevcut son kaydın ardından önerilir; yönetici isterse değeri değiştirebilir.
- Çalışma alanları sorgusu panel için gereken tüm alanları ve belirlenmiş sıralamayı döndürecek şekilde genişletildi.
- Form payload'ındaki metin ve JSON alanları PostgreSQL transaction içinde geçici kayıtla doğrulandı; `ROLLBACK` sonrasında test kaydı kalmadığı kontrol edildi.
- Hedefli ESLint kontrolü ve Docker production build başarıyla tamamlandı; bütün container'lar `healthy`, `/bakir` HTTP 200 durumunda doğrulandı.
- Uygulama paketi `7d52ceb` kimliği ve `feat: add practice area management workspace` mesajıyla commit edildi.

### Paket 22 — Hakkımda ve İletişim sayfası içerik yönetimi

- Hakkımda ve İletişim sayfalarının metin ve iletişim bilgilerinin de özel panelden yönetilmesi gereksinimi eklendi.
- `scripts/bootstrap-site-pages.mjs` betiği oluşturuldu ve `site_pages` Directus koleksiyonu idempotent biçimde hazırlandı.
- Koleksiyona benzersiz `page_key`, JSON `content`, SEO başlığı ve SEO açıklaması alanları eklendi.
- Mevcut hardcoded Hakkımda ve İletişim içerikleri `about` ve `contact` başlangıç kayıtlarına taşındı; geçiş sırasında public sayfaların boş kalması engellendi.
- Yönetici hesabında TOTP aktif olduğu için bootstrap sırasında 2FA kapatılmadı. Veritabanına yalnızca işlem süresince rastgele statik token verildi, betik tamamlanınca `finally` bloğunda temizlendi.
- Geçici token terminal çıktısına veya dosyaya yazılmadı; işlem sonunda kullanıcı token alanının tekrar boş olduğu doğrulandı.
- Directus özel eklentisine yalnızca `about` ve `contact` anahtarlarını kabul eden `/pages/:pageKey` salt-okunur endpoint'i eklendi.
- Frontend veri katmanına tipli `getSitePage` fonksiyonu eklendi.
- `/hakkimda` sayfası hero, yaklaşım paragrafları, mesleki not, çalışma ilkeleri ve SEO metadata'sını CMS kaydından üretmeye başladı.
- `/iletisim` sayfası hero, uyarı, telefon, WhatsApp, e-posta, adres, çalışma saatleri, süreç adımları ve SEO metadata'sını CMS kaydından üretmeye başladı.
- Admin navigasyonuna `Sayfa içerikleri` bölümü eklendi.
- Yönetim ekranında Hakkımda ve İletişim için iki sekmeli form hazırlandı.
- Hakkımda formu başlıkları, açıklamaları, yaklaşım paragraflarını, mesleki notu, çalışma ilkelerini ve SEO değerlerini yönetir.
- İletişim formu telefon görünümü/bağlantısı, WhatsApp, e-posta, adres, çalışma günleri/saatleri, gizlilik uyarısı, iletişim adımları ve SEO değerlerini yönetir.
- Tekrarlanan paragraflar ve adımlar sade satır biçiminden güvenli JSON listelerine dönüştürülür.
- Directus eklentisi yeniden yüklendi; hedefli lint ve Docker production build başarıyla tamamlandı.
- `/hakkimda`, `/iletisim`, `/website-content/pages/about` ve `/website-content/pages/contact` Docker/Caddy üzerinden HTTP 200 yanıtıyla doğrulandı.
- Database, Directus ve frontend container'larının `healthy`, Caddy proxy'nin çalışır durumda olduğu doğrulandı.
- Uygulama paketi `fe00856` kimliği ve `feat: manage about and contact pages` mesajıyla commit edildi.

### Paket 23 — İletişim verisi birleştirme ve Vinext konsol temizliği

- Tarayıcı konsolunda yaklaşık 50 hata gibi görünen kayıtların farklı hatalar olmadığı, Vinext `next/link` RSC prefetch kurulumundaki aynı `TypeError: f is not a function` mesajının görünür her bağlantı için tekrarlandığı belirlendi.
- Aynı kayıtta Directus `GET` ve `PATCH` isteklerinin başarıyla tamamlandığı görüldü; veri kaydetme problemi olmadığı doğrulandı.
- Projedeki bütün `next/link` kullanımlarına `prefetch={false}` eklendi. Böylece mevcut Vinext beta sürümündeki sorunlu otomatik RSC ön yükleme yolu kullanılmadan normal istemci navigasyonu korunur.
- Ana sayfadaki iç bağlantılar lint kuralına uygun olarak `Link` bileşenine geçirildi ve aynı şekilde prefetch kapatıldı.
- Admin İletişim formundaki `Telefon görünümü` ve teknik `Telefon bağlantısı` alanları tek `Telefon numarası` alanında birleştirildi.
- `phoneToDialValue` yardımcı fonksiyonu eklendi. Yönetici boşluklu veya yerel biçimde numara yazabilir; kayıtta arama bağlantısı otomatik olarak uluslararası `+` ve rakam biçimine dönüştürülür.
- Eski Directus kayıtlarıyla uyumluluk için türetilen değer `phone_value` anahtarında tutulmaya devam eder; public sayfalar görünür numarayı esas alarak güvenli fallback üretir.
- Ana sayfadaki telefon, WhatsApp, e-posta, adres ve çalışma saatleri hardcoded değerlerden çıkarıldı ve aynı `site_pages.contact` CMS kaydına bağlandı.
- Hedefli ESLint ve yerel production build başarıyla tamamlandı.
- Frontend Docker imajı yeniden oluşturuldu; database, Directus ve frontend container'ları `healthy`, Caddy proxy çalışır durumda doğrulandı.
- `/`, `/iletisim`, `/bakir` ve contact public endpoint'i Docker/Caddy üzerinden HTTP 200 yanıtı verdi.
- Tarayıcıda `/bakir` ve `/` sayfalarının hata/uyarı konsolları ayrı ayrı kontrol edildi; ikisi de boş döndü.
- Admin kaydında daha önce değiştirilmiş telefonun ana sayfada görünür hale geldiği ve `tel:+...` arama bağlantısının otomatik üretildiği doğrulandı.

### Paket 24 — Markalı ve erişilebilir 404 sayfası

- Projede kök seviye özel 404 bileşeni bulunmadığı, framework'ün varsayılan bulunamadı çıktısının kullanıldığı belirlendi.
- `app/not-found.tsx` eklenerek sitenin renk, tipografi, header ve footer sistemini kullanan markalı bir “Sayfa bulunamadı” ekranı hazırlandı.
- Ziyaretçiye ana sayfaya dönme, çalışma alanlarını inceleme, blog, hakkımda ve iletişim bağlantıları sunuldu.
- Sayfaya arama motorları için `noindex, nofollow` metadata'sı eklendi.
- Ortak header'da aktif menü varsayılanı kaldırıldı; 404 ve yasal sayfalarda Ana Sayfa menüsünün yanlışlıkla aktif görünmesi engellendi.
- Header iç bağlantıları lint uyumlu `Link` bileşenine geçirildi ve Vinext prefetch sorununun tekrarlamaması için `prefetch={false}` kullanıldı.
- Hedefli ESLint, yerel production build ve Docker production build başarıyla tamamlandı.
- Rastgele genel URL, bilinmeyen blog slug'ı ve bilinmeyen çalışma alanı slug'ı ayrı ayrı test edildi; üçü de özel ekranla gerçek HTTP 404 ve `noindex` döndürdü.
- Masaüstü ve 390 × 844 mobil görünüm tarayıcıda görsel olarak kontrol edildi; responsive yerleşim ve bağlantılar doğrulandı.
- 404 sayfasının tarayıcı konsolunda hata veya uyarı bulunmadı.
- Database, Directus ve frontend container'larının `healthy`, Caddy proxy'nin çalışır durumda olduğu doğrulandı.

### Paket 25 — Vinext sayfa geçişi çalışma zamanı düzeltmesi

- Kullanıcı, 404 paketinden sonra menü bağlantılarının çalışmadığını ve konsolda `link-*.js: Uncaught TypeError: e is not a function` hatasının tekrarlandığını bildirdi.
- Yeni kayıt, hatanın yalnızca RSC prefetch kurulumunda olmadığını; `next/link` tıklama işleyicisinin `startTransition` içindeki istemci navigasyonunda da oluştuğunu gösterdi.
- Önceki `prefetch={false}` yaklaşımının prefetch tekrarını durdurduğu ancak bozuk router tıklama yolunu devrede bıraktığı kabul edildi ve teknik karar düzeltildi.
- `NativeLink` adlı ortak, tipli bağlantı bileşeni eklendi. Bileşen semantik `<a href>` üretir ve framework istemci router'ı yerine tarayıcının yerel tam sayfa navigasyonunu kullanır.
- Ana sayfa, ortak header, 404, Hakkımda, admin marka bağlantıları ve blog/çalışma alanı “sitede aç” kontrolleri dahil bütün `next/link` kullanımları kaldırıldı.
- Proje uygulama kodunda `next/link`, `<Link>` veya `prefetch={false}` kullanımı kalmadığı kaynak taramasıyla doğrulandı.
- Hedefli ESLint, yerel production build ve Docker production build başarıyla tamamlandı.
- Tarayıcıda gerçek tıklamalarla Ana Sayfa → Hakkımda → Çalışma Alanları → Blog → İletişim → Ana Sayfa zinciri tamamlandı.
- Ana sayfadaki yayınlanmış yazı bağlantısından dinamik blog detayına geçiş ayrıca doğrulandı.
- Bütün tıklama zincirinin sonunda tarayıcı hata/uyarı konsolu boş döndü; `link-*.js` çalışma zamanı hatası ortadan kalktı.

### Paket 26 — Chrome DevTools 404 konsol gürültüsünün ayrıştırılması

- Kullanıcı, yanlış bir URL denediğinde konsolda aynı `GET /iletisim/lsd 404` satırının çok sayıda tekrarlandığını bildirdi.
- Paylaşılan kayıttaki `Navigated to ...` satırlarının hata değil, başarılı tam sayfa navigasyon bildirimleri olduğu ayrıştırıldı.
- Docker frontend erişim kayıtlarında `/iletisim/lsd` isteğinin yalnızca bir kez geldiği görüldü; uygulamanın bilinmeyen URL'yi tekrar tekrar isteyen bir döngüye girmediği doğrulandı.
- Aynı zaman aralığında Chrome DevTools'un `/.well-known/appspecific/com.chrome.devtools.json` yolunu onlarca kez sorguladığı tespit edildi.
- Caddy'ye yalnızca bu kesin DevTools çalışma alanı keşif yolu için içeriksiz HTTP 204 cevabı eklendi. Genel `/.well-known` alanı veya başka public yollar etkilenmedi.
- Caddy yapılandırması container içinde `caddy validate` ile doğrulandı.
- DevTools teknik yolunun HTTP 204 ve sıfır bayt; `/iletisim/lsd` yolunun ise markalı içerikle gerçek HTTP 404 döndürdüğü doğrulandı.
- Database, Directus ve frontend servisleri `healthy`, yeniden oluşturulan Caddy proxy çalışır durumda kaldı.

### Paket 27 — Dinamik sitemap.xml ve robots.txt

- Arama motoru tarama talimatları için Next/Vinext metadata route biçiminde `app/robots.ts` eklendi.
- Public sayfalar taramaya açık bırakılırken `/bakir`, `/bakir/` ve `/bakir-api/` yolları robots çıktısında tarama dışında bırakıldı.
- Robots çıktısına sitemap adresi ve tercih edilen site host'u eklendi.
- `app/sitemap.ts` ile ana sayfa, Hakkımda, Çalışma Alanları, Blog, İletişim, KVKK ve Gizlilik sayfaları listelendi.
- Directus public endpoint'lerinden yalnızca yayınlanmış çalışma alanları ve blog yazıları dinamik olarak sitemap'e eklenmeye başladı; taslak ve gizli kayıtlar dahil edilmedi.
- Blog yayın tarihi uygun olduğunda `lastmod` değeri olarak kullanıldı.
- Directus geçici olarak erişilemezse sitemap'in tamamen bozulmaması için dinamik sorgular `Promise.allSettled` ile ayrıştırıldı; sabit sayfalar üretilmeye devam eder.
- `SITE_PUBLIC_URL` Vinext/Cloudflare binding, Docker build argümanı ve frontend runtime ortamına eklendi. Böylece localhost ile production domain arasında kod değişikliği gerekmez.
- Hedefli ESLint kontrolü ve production build başarılı tamamlandı. Genel lint kontrolü yalnızca Vinext çalışma zamanı hatası nedeniyle bilerek kullanılan mevcut `NativeLink`/HTML anchor bağlantıları için altı `no-html-link-for-pages` ihlalini raporladı; yeni SEO dosyalarında hata bulunmadı.
- Frontend Docker imajı yeniden oluşturuldu; `/robots.txt` `text/plain`, `/sitemap.xml` `application/xml` içerik türüyle HTTP 200 döndürdü.
- Sitemap çıktısında yedi sabit sayfa, dört yayınlanmış çalışma alanı ve iki yayınlanmış blog yazısı doğrulandı.

### Paket 28 — Şeffaf 3D Furkan Toplu hero görseli

- Kullanıcının sağladığı portre; kimlik, yüz ifadesi, saç/sakal yapısı, bakış yönü, kırmızı `23` numaralı tişört ve çapraz kol pozu korunarak şeffaf 3B karaktere dönüştürüldü.
- İlk iki denemenin yarı gerçekçi görünümü ve karakteri çevreleyen dikdörtgen sahne, kullanıcı değerlendirmesinde hâlâ “fotoğraf/kart” hissi verdiği için reddedildi.
- Üçüncü denemede foto-gerçekçi ten dokusu azaltıldı; saç, sakal ve yüz yüzeyleri sinema/oyun karakteri estetiğinde daha belirgin biçimde modellendi. Sıcak ana ışık ve turkuaz kenar ışığı karakter hacmini güçlendirdi.
- Güncel aday `frontend/public/furkan-toplu-hero-3d-v3.png` adıyla projeye alındı. Dosyanın `1024 × 1536`, `Format32bppArgb` olduğu ve dört köşe alfa değerinin de `0` olduğu doğrulandı.
- Fotoğraf kartını çağrıştıran kenarlık, köşe yuvarlama, dolu dikdörtgen arka plan ve kırpma kaldırıldı. Karakter krem sayfa üzerinde serbest duran, sağ kolondan taşan ayrı bir nesne olarak konumlandırıldı.
- Arka planda yalnızca sınırı görünmeyen yumuşak dairesel hale, ince yörünge çizgileri, zemin gölgesi ve karakter drop-shadow'u bırakıldı. Bilgi kartı ile konum etiketi üst katmanda tutuldu.
- Vinext `Image` bileşeninde açık `objectFit: contain` ve alt merkez hizası kullanılmaya devam edildi. Masaüstünde saçın sabit header arkasında kalmaması için karakter sahnesi aşağı taşındı.
- Hedefli ESLint ve production build başarıyla tamamlandı; frontend Docker imajı her yerleşim düzeltmesinden sonra yeniden oluşturuldu.
- `1440 × 900` masaüstü ve `390 × 844` mobil görünüm gerçek tarayıcıda kontrol edildi. Mobilde karakter, bilgi kartı ve sonraki bölüm sınırı taşma olmadan görüntülendi.
- Kullanıcı geri bildirimiyle karakterin hero içindeki izole katman bağlamı kaldırıldı ve karakter katmanı sabit navbar'ın üzerine çıkarıldı. Sayfa kaydırıldığında saç veya gövde navbar alanına girse bile navbar karakteri örtemez; karakter her zaman en önde çizilir.
- Karakter katmanı `pointer-events: none` olarak korundu. Böylece görsel navbarın önünde görünürken alttaki menü bağlantılarının tıklanmasını engellemez.
- Yeni katman davranışı hem dar görünümde hem `1440 × 900` masaüstünde gerçek tarayıcı kaydırmasıyla doğrulandı.
- Karakterin alt kısmının çalışma alanları bölümünün yeşil zeminine kadar uzadığı ve PNG'nin düz alt kenarını görünür kıldığı kullanıcı tarafından belirtildi. Karakter sahnesinin alt sınırı hero içine çekildi.
- PNG üzerine çok kademeli alfa maskesi eklendi. Alt bölüm yüzde 73'e kadar tam görünür kalır; son bölümde kademeli olarak saydamlaşır ve hero sınırından önce tamamen kaybolur. Böylece sert kırpma yerine karakter kadrajın dışında devam ediyormuş izlenimi oluşur.
- Fade bitişi `1440 × 900` masaüstü ve `390 × 844` mobil görünümde kontrol edildi; yeşil çalışma alanları bölümü başladığında karakterin görünmediği doğrulandı.
- Bu paket görsel geri bildirimlerle ilerleyen deneysel aday olarak tutuldu; sonraki çok dilli site çalışmasında mevcut hero görünümü korundu.

## 6 Ekim 2026

### Paket 29 — Türkçe / İngilizce / Almanca ziyaretçi sitesi

- Kullanıcı navbar'dan dil seçimini ve admin panelinin yalnızca Türkçe kalmasını onayladı. Mevcut Türkçe sayfa adresleri korundu; `/en` ve `/de` public dil kökleri eklendi.
- `i18n.ts` dil tanımları, rota eşleştirme, çeviri sözlüğü erişimi, detay dil bağlantıları ve tarih biçimlendirmesini merkezileştirdi. Arayüz metinleri `messages.ts` dosyasına çıkarıldı.
- `proxy.ts` URL üzerinden belirlenen dili server-rendered sayfalara aktarır. Dışarıdan gönderilen `x-site-language` ve `x-site-path` başlıkları güvenilir URL değerleriyle değiştirilir. HTML `lang` etiketi güncellenir.
- Ana sayfa, navbar, footer, Hakkımda, İletişim, Blog, çalışma alanı listesi/detayı ve 404 arayüzleri dile göre render edilir. Tarihler `tr-TR`, `en-GB`, `de-DE` biçiminde gösterilir.
- `/[locale]/[[...path]]` rotası aynı public bileşenleri kullanır ve yalnızca tanımlı EN/DE adreslerini kabul eder. `/en/bakir` gibi çevrilmiş admin yolları oluşturulmaz.
- PostgreSQL `website_content_translations` tablosu eklendi. Koleksiyon/kayıt/dil anahtarı ve dil bazlı URL benzersizliği veritabanında korunur. Türkçe kayıtlara ve önceki içeriklere dokunulmadı.
- Directus public endpoint'lerine dil filtresi eklendi. Ana kayıt veya çeviri taslak/gizli olduğunda foreign-language listede gösterilmez. Detay dil seçicisi yalnızca yayımlanmış sürümlere bağlanır.
- Yeni yönetici çeviri endpoint'leri aktif admin hesabı gerektirir. Gönderilen içerik yalnızca izinli metin ve yapılandırılmış liste alanlarıyla sınırlandırılır. Çeviri ortak telefon/görsel alanlarını veya yetkileri değiştiremez.
- Blog, çalışma alanı ve kurumsal sayfa editörlerine Türkçe / İngilizce / Almanca sekmeleri ve Türkçe etiketli çeviri formları eklendi. Çevirinin durum, metin ve URL adı ayrı kaydedilir.
- Hakkımda/İletişim için başlangıç EN/DE metinleri eklendi. Blog/çalışma alanlarının çevirileri otomatik yayımlanmadı; sahibi panelden hazırlayıp yayımlar. Çeviri olmayan listelerde ilgili dilde boş-durum açıklaması bulunur.
- `content-migrations` Compose servisi SQL kurulumunu Docker'a aldı. Mevcut kayıtlar `ON CONFLICT DO NOTHING` ile korunur. Yeni veritabanı için README temel servis → bootstrap → Compose sırasını açıklıyor.
- Sitemap üç dilin sabit sayfalarını ve yalnızca yayındaki detay çevirilerini içerir. Canonical ve hreflang bağlantıları eklendi. Yönetim yollarının robots/noindex davranışı korundu.
- Yasal belge içerikleri Türkçe kaldı; EN/DE footer bağlantıları bunu kullanıcıya belirtir.
- TypeScript ve ESLint kontrolleri geçti. Önceden belgelenmiş Vinext bağlantı sorunu nedeniyle ESLint'in yalnızca `no-html-link-for-pages` kuralı bu kontrolde kapatıldı; NativeLink ile yerel tarayıcı navigasyonu sürüyor.
- Altı otomatik test dil doğrulama, taslak/gizli çeviri filtreleme, ortak alanların korunması, olmayan ana kayda çeviri bağlanmaması ve admin yetkilerini doğruladı.
- Canlı smoke testi 16 sayfada HTTP 200, doğru HTML dili/canonical/hreflang; iki bilinmeyen dil detayında 404, anonim çeviri isteğinde 401 ve geçersiz dilde 400 doğruladı. Sitemap EN/DE alternatifleri kontrol edildi.
- Tarayıcıda navbar üzerinden TR → EN, İngilizce iletişim bağlantısı ve aynı sayfada DE geçişi denendi. 390 px ve 320 px mobil görünüm incelendi; 320 px'te eski body minimum genişliğinin scrollbar ile yarattığı yatay taşma kaldırıldı.
- Önceki hero denemesinin görsel ve katman düzeni korundu. Kullanıcının ilgisiz `bok_kafa.png` dosyası ile eski v1/v2 deneme görselleri bu paketin Git kapsamına alınmadı.

### Paket 30 — Kart düzeni, açılır dil menüsü ve tam sayfa/görsel yönetimi

- Kullanıcı İletişim'deki “Görüşme öncesinde bilmeniz gerekenler” başlığının kaldırılmasını, adres/saat kartlarının düzeltilmesini, blog okuma bağlantılarının büyütülmesini, sayfa ve yazı görsellerinin admin'den yönetilmesini ve dil seçeneklerinin açılır menüye dönüşmesini istedi.
- Aynı `.contact-details` sınıfının ana sayfa grid kuralları ile ayrı iletişim sayfasının grid kurallarını çakıştırdığı doğrulandı. İletişim bölümü `.contact-visit-details` kapsamına ayrıldı; iki kart ikon + tek metin kolonu haline getirildi. Gereksiz büyük başlık kaldırıldı. 320 px kontrolünde uzun e-posta adresinin kesilmesi görüldü; satıra bölünme eklendi.
- Navbar'daki yan yana TR/EN/DE kaldırıldı. Mevcut tam dil adı düğmesi, altta açılan Türkçe/English/Deutsch menüsü, Escape/dışarı tıklama kapatma ve mevcut sayfayı koruyan dil URL'leri uygulandı. Yayımlanmamış detay çevirisi pasif kalır.
- Ana sayfa/blog/liste ve öne çıkan blog okuma bağlantıları 16 px'e, tıklama alanı en az 44 px yüksekliğe çıkarıldı; footer satırları gerektiğinde bölünebilir.
- Ortak `ImageField` bilgisayardan dosya seçme, admin oturumunda önizleme, 10 MB/type kontrolü ve içerikten kaldırma sağlar. FormData isteklerinde JSON Content-Type başlığı gönderilmez. `/files` Directus endpoint'i kullanılır; dosya önce yüklenir, ilgili içerik sonra kaydedilir.
- Blog editörüne kapak/alt metin/alt yazı; alan editörüne görsel/alt metin eklendi. Dashboard sorguları bu alanları yükler; kaydetme payload'ları değişiklikleri saklar. Kayıt görselleri ana sayfa kartlarında, blog arşivinde, alan listesinde ve mevcut detay bileşenlerinde kullanılır.
- `site_pages` kapsamı home/about/contact/areas/blog oldu. Sayfa panelinde beş sekme; Ana sayfa'da hero, bölüm açıklamaları, kısa bilgiler, değerler, süreç adımları ve iki görsel; blog/alan listelerinde giriş metinleri, isteğe bağlı giriş görseli ve bilgi notları yönetilir. Hakkımda portresi de panelden değiştirilir. İletişim ortak kayıt davranışı korundu.
- `page-content-config.json` editör etiketlerini ve mevcut tasarımdan alınan başlangıç metinlerini merkezileştirir. Yeni `003` SQL ve generator üç dilde başlangıç kayıtlarını ekler; `ON CONFLICT DO NOTHING` eski düzenlemeleri korur. About görsel varsayılanları mevcut anahtarları ezmeden birleştirilir. Manuel dil kurulum script'i ve Compose migrasyon komutu güncellendi.
- Çeviri izinli metin listesi yeni sayfa alanlarına genişletildi, ortak görsel alanları kapsam dışında kaldı. Home/Blog/Areas ve EN/DE metadata CMS SEO değerlerini kullanır. Sitemap artık beş sayfanın dil yayın uygunluğunu kontrol eder.
- Özel medya endpoint'i yalnızca UUID + yayındaki blog/alan görsel referansı veya tanımlı public sayfa görseli + JPG/PNG/WebP MIME doğrulamasından sonra AssetsService ile stream döndürür. Genel public dosya izni eklenmedi. Frontend `/site-media/[id]` akışı sunar. Admin kaydedilmemiş dosyayı yetkili `/assets` üzerinden önizler.
- Directus kaynak ve runtime dist eşitlendi; yükleme sınırı Compose'a eklendi. Yerel Docker database/Directus/frontend sağlıklı; `content-migrations` başarıyla tamamlandı. Production frontend imajı yeniden oluşturuldu.
- 11 otomatik test geçti: admin formlarının gerçek JSX render'ında beş sayfa/görsel alanları, medya referans kuralları, dil/çeviri/yetki korumaları. Next görsel optimizasyonu form testinde izole edilmiştir. TypeScript ve hedefli ESLint geçti; yalnızca önceden belgelenmiş NativeLink kuralı kontrolde kapalıdır.
- Canlı smoke: 16 TR/EN/DE sayfası 200/doğru lang/canonical/dil seçici, bilinmeyen sayfa/medya 404, anonim çeviri 401, hatalı dil 400 ve sitemap alternatifleri geçti. İletişim kartları ve menü masaüstünde; dil değiştirme aynı iletişim sayfasında; 390 ve 320 px mobilde taşma kontrol edildi.
- Tarayıcıda admin oturumu kapalı olduğundan gerçek hesapla upload → kaydet E2E yapılmadı; şifre/TOTP değiştirilmedi veya atlanmadı. Bu doğrulama teslim öncesinde açık yönetici oturumuyla yapılmalı. API akışının pozitif canlı dosya yükleme testi yapılmış gibi raporlanmaz.
- README'de panel kullanımı, upload/kaydet ayrımı, izinli formatlar, varsayılan görsele dönüş, kalıcı volume taşıma ve test komutları belgelendi. Obsidian eşitlenir; paket Git'e kaydedilip mevcut main remote'una gönderilir. İlgisiz dosyalar kapsam dışıdır.

### Paket 31 — Admin bölüm geçişlerinde kaydırmayı sıfırlama

- Kullanıcı, uzun çalışma alanı/sayfa editörünün aşağısındayken sidebar'dan başka bölüme geçildiğinde yeni bölümün eski kaydırma yüksekliğinde açıldığını bildirdi.
- Admin bölümleri aynı sayfa üzerinde `activeView` state'iyle değişiyordu; document scroll konumu sıfırlanmıyordu. Yeni rotaya geçilmediği için tarayıcının rota kaydırma davranışı devreye girmiyordu.
- `activeView` değiştiğinde çalışan `useLayoutEffect` eklendi. Yeni bölüm DOM'a işlendiğinde, boyama öncesi `window.scrollTo({ top: 0, left: 0, behavior: "instant" })` ile tepeye dönülür. Global smooth-scroll kuralına rağmen geçiş anlıktır.
- Sidebar ve genel bakış kısayolları aynı mekanizmadan faydalanır. Editörün içinde yazı yazmak, kayıt yüklemek veya içerik kaydetmek `activeView` değiştirmediği için kaydırmayı sıfırlamaz. Kimlik doğrulama ve içerik kayıtları değiştirilmedi.
- TypeScript, hedefli ESLint ve mevcut 11 test geçti; production Docker build tamamlandı, frontend yeniden başlatıldı ve `/bakir` HTTP 200 doğrulandı. Açık yönetici oturumu ile aşağı kaydırıp bölüm değiştirme etkileşimi bu pakette ayrıca tarayıcıdan denenmedi.

### Paket 32 — Görselsiz blog yazılarında örnek kapak kaldırıldı

- Kullanıcının bildirdiği fark public API ile doğrulandı: iki yayındaki yazıdan yalnızca ilkinde `cover_path` doluydu; ikinci yazının görsel alanı boştu. Detay sayfasındaki `cover_path || örnek fotoğraf` kuralı olmayan görseli gösteriyordu.
- Blog detayında görsel ve alt yazı bölümü yalnızca kayıtlı kapak varsa render edilir; görselsiz yazıda boş fotoğraf alanı bırakılmaz. Blog listesindeki öne çıkan kart için de örnek fotoğraf fallback'i kaldırıldı; görselsiz kart tek kolona geçer.
- Ana sayfa blog kartları ve arşiv kartları zaten yalnızca kayıtlı görseli gösteriyordu; bu davranış korundu. Çalışma alanları, ana sayfa karakteri ve Hakkımda görsel varsayılanları bu talebin dışında kaldı. İçerik/veritabanı kayıtlarına dokunulmadı.
- `blog-images-smoke.mjs` canlı yayındaki yazıların kapak bölümünü CMS görsel alanıyla karşılaştırır; liste öne çıkan kartının görsel ve tek kolon sınıfını da denetler.
- TypeScript, hedefli ESLint, 11 mevcut test ve Docker production build geçti. Yeni canlı test ilk yazıda kapak bulunduğunu, ikinci yazıda kapak bölümü olmadığını doğruladı; üç dilde 16 sayfa ve SEO/404/yetki smoke kontrolleri de geçti. Yerel frontend sağlıklı olarak yeniden başlatıldı.

### Paket 33 — Google Authenticator QR ile kayıt

- Kullanıcı önceki 400/TOTP sorununu yanlış bilgisayar saati olarak tespit edip çözdüğünü bildirdi; bu inceleme durduruldu. Var olan kullanıcı hesaplarına, parola kurallarına ve aktif 2FA ayarlarına müdahale edilmedi. Loglardaki parola veya gerçek kurulum anahtarları notlara kopyalanmadı.
- Yeni kurulum ekranına QR ile kayıt eklendi. Directus'un `/users/me/tfa/generate` yanıtındaki `secret` ve `otpauth_url` kullanılır. QR yalnızca yerelde `qrcode@1.5.4` ile PNG data URL olarak üretilir; dış QR API'sine hesap anahtarı gönderilmez.
- Kurulum bağlantısı `otpauth://totp` protokol/türünde ve dönen secret ile aynı olmalıdır. Beyaz zemin, siyah modüller, 4 modül sessiz alan ve 240 px boyut kullanılır. Görsel Next Image ile `unoptimized` render edilir; resim sunucusuna/proxy optimizer'a gönderilmez.
- Google Authenticator + → QR kod tara yönergesi, 6 haneli kodla onay ve anahtarı elle girme alternatifi eklendi. QR üretimi başarısızsa manuel seçenek açık kalır; etkinleştirme yine Directus doğrulamasını gerektirir. Aktif 2FA hesabında yeni QR gösterilmez/kurulum sıfırlanmaz.
- Kurulum alanı gerçek `form` oldu; parola/OTP Enter ile gönderilebilir ve zorunlu girişler tarayıcı tarafından doğrulanır. Form dışında parola DOM uyarısının bu alandaki nedeni kaldırıldı.
- QR ve anahtar yalnızca React state'inde tutulur; başarı/çıkışta temizlenir. Devam eden TFA isteği sırasında çıkış düğmesi kilitlenir. Anahtar/QR paylaşılmaması ve saat uyumu için uyarı eklendi.
- Test bağımlılıkları `@types/qrcode@1.5.6` ve `jsqr@1.4.0` eklendi, lockfile güncellendi. Gerçek hesap olmayan test URL'si QR PNG'den geri okunup birebir eşleştiği doğrulandı. Yanlış protokol/tür/anahtar reddedilir. QR/manüel bileşen render testi de eklendi; toplam 14 otomatik test geçti.
- TypeScript, hedefli ESLint, 16 public/admin rota smoke testi, blog kapak smoke testi ve Docker production build geçti. Frontend sağlıklı olarak yeniden başlatıldı. Gerçek yönetici hesabında telefonla tarama/2FA etkinleştirme yapılmadı; mevcut aktif doğrulama ayarları korunuyor. README, mimari ve teknik karar notları güncellendi.

### Paket 34 — Yüklenen görsellerde 502 düzeltmesi

- Kullanıcı, admin'den değiştirilen iki görselin public `/site-media/<UUID>` yolunda 502 verdiğini bildirdi. Read-only kontrol Directus özel medya endpoint'inde 500, frontend proxy'sinde 502 olduğunu doğruladı.
- Directus stack trace `resolvePreset` içinde eksik `transformationParams.transforms` erişimini gösterdi. Yazılan `getAsset(id, {})` çağrısı kurulu 12.4.0 servisinin seçenek yapısına uymuyordu. Dosyalar yüklenmiş ve public içerik referansları doğruydu; yükleme/veritabanı hatası yoktu.
- Kaynak ve runtime `dist/media.js` çağrısı `getAsset(id, { transformationParams: {} })` olarak düzeltildi. Dosyalar, kullanıcı kayıtları ve public yetki kapsamı değiştirilmedi. Directus yerelde yeniden başlatıldı; frontend kodu değişmediği için tekrar frontend build gerekmedi.
- Eski medya testleri referans ve MIME erişim kontrolü gibi negatif/filtre durumlarını kapsıyordu; gerçek dosyanın servis çağrısıyla başarıyla akması eksikti. Pozitif stream testi ve Directus seçenek sözleşmesi kontrolü eklendi. Özel/izin dışı MIME dosyalarının AssetsService'e ulaşmadığı da endpoint düzeyinde test edilir.
- `media-smoke.mjs` yayındaki içeriklerden yüklenen görsel UUID'lerini otomatik toplar veya komut argümanı alır. Directus özel endpoint'ini, frontend `/site-media` akışını ve Next/Vinext `/_next/image` bileşen yolunu kontrol eder. HTTP 200, JPG/PNG/WebP dosya imzası ve upstream/proxy bayt eşitliği doğrulanır.
- Kullanıcının hata veren iki gerçek görseli üç katmanda da 200/düzgün görsel baytlarıyla doğrulandı. Otomatik public görsel keşfi de aynı iki dosyada geçti; yeniden yükleme veya kayıt düzenleme yapılmadı. Toplam 16 birim/render/regresyon testi geçti. README yeni medya testini ve çağrı sözleşmesini belgeler.

### Paket 35 — Çalışma alanlarında görselsiz tasarım ve tam fotoğraf gösterimi

- Kullanıcı çalışma alanı kartında görsel olmayınca gereksiz boşluk kaldığını, detayda kaldırılan fotoğraf yerine örnek görsel çıktığını ve dik fotoğrafların kırpıldığını bildirdi.
- Karttaki sabit minimum yükseklik, `justify-content: space-between` ve başlığın otomatik üst marjı boşluğu artırıyordu. Detay mapper'ında kalan `image_path || örnek görsel` kuralı kaldırıldı; içerik tipi nullable oldu.
- Görselsiz detayda görsel kolonu tamamen render edilmez, hero tek kolon olur ve bilgi notu metnin altına yerleşir. Fotoğraf varsa `contain` ile oran korunarak sığar; büyük köşe kırpması/üzerine binen bilgi kutusu ve dekoratif numara kaldırıldı. Bilgi kutusu fotoğrafın altında gösterilir.
- Ana sayfa çalışma alanı kartları ve dizin kartları ayrı fotoğraflı/görselsiz sınıflar kullanır. İkonlar görselsiz durumda daire zeminli, başlık/açıklama/bağlantı normal akışta ve gereksiz sabit yükseklik olmadan gösterilir. Boş bir fotoğraf slotu bırakılmaz.
- Dizin kartlarında masaüstünde görsel/metin yan yana, dar mobilde alt alta kullanılır. Fotoğraflı ve fotoğrafsız kart yükseklikleri gerçek tarayıcıda yaklaşık 351/338 px olarak doğrulandı. Ana sayfa kartları kendi dikey kompozisyonunu korur.
- Çalışma alanı kart, detay ve isteğe bağlı liste giriş görselleri kırpılmadan çerçeveye sığar. Nötr zemin kenar boşlukları kullanılır; fotoğrafın oranı bozulmaz. Blog/Hakkımda/ana karakter tasarımı bu pakette değiştirilmedi.
- TypeScript, hedefli ESLint ve Docker production build geçti. `practice-images-smoke.mjs` dört yayındaki alanın görsel/detay durumunu CMS kaydıyla, görselsiz detayın örnek fotoğraf kullanmamasını ve kartta medya slotunun yalnızca görsel varsa bulunmasını doğrular. Render edilen HTML etiketi sayılır; RSC serileştirmesi çift sayılmaz.
- Computer Use becerisiyle masaüstü kartlar, fotoğrafsız Sporcu Rehabilitasyonu detayı, 390 px mobil kart ve portreli detay kontrol edildi. Mobil scrollWidth/clientWidth 375/375; fotoğraf `object-fit: contain`, alt bilgi notu `position: static`. Görsel var/yok ve tam fotoğraf gösterimi doğrulandı. Geçici viewport testten sonra sıfırlandı; ekran görüntüleri visualizations klasörüne kaydedildi.
- İçerik metinleri, kullanıcının yüklediği fotoğraflar, yayın durumları ve hesaplar değiştirilmedi. Görsel kaldırma artık kart ve detayda aynı sonucu verir. Mevcut 16 test, üç dil rota smoke testi, blog kapak testi ve gerçek public görsel testi de çalıştırıldı. README kullanım notu güncellendi.

### Paket 36 — Çalışma alanı ana başlığı ve otomatik URL

- Kullanıcı çalışma alanına girince alan adının başlık olarak görünmesini ve ad değişince URL'nin de aynı yerden otomatik değişmesini istedi. Detayda `hero_title` ana başlık olarak kullanılıyor, URL düzenlenmiş kayıtlarda bağımsız kalıyordu.
- Detay H1 doğrudan `area.title` oldu. Önceki tanıtım başlığı/vurgusu kaybolmadan isteğe bağlı alt başlığa taşındı. Panel etiketleri ana ad/sayfa başlığı ve alt başlık ayrımını açıklar.
- Türkçe alan editörünün URL girişi salt okunur önizleme oldu; yeni ve mevcut kayıtta ad yazılırken URL türetilir. EN/DE çalışma alanı çevirilerinde de başlık URL'yi türetir; backend gelen manuel slug yerine çeviri başlığını kullanır. Blog URL editörü kapsam dışıdır ve korunur.
- PostgreSQL `004` migrasyonu title → slug tetikleyicilerini, Türkçe/Latin karakter normalizasyonunu, çakışma halinde kayıt kimliği eki ve işlem bazlı advisory lock'u ekler. Böylece doğrudan Directus kullanıcı arayüzü/API yazımlarında da URL bağımsız değiştirilemez. Aynı ada sahip kayıtlar birbirinin adresini kullanmaz.
- `website_practice_slug_aliases` dil/eski slug anahtarı ve çalışma alanı FK'siyle adres geçmişini tutar. Başlık değişikliklerinde eski adres saklanır; tekrar ad değiştirmede alias son kayda doğrudan çözülür. Silinmiş kayıt aliasları FK cascade ile temizlenir; gizli/kaydı olmayan/yayımlanmamış çeviri aliası public sayfa üretmez.
- Migrasyon mevcut alan adlarına/metinlere/fotoğraflara dokunmadan URL'leri adlarla eşitledi. Aynı test adına sahip iki mevcut kayıt benzersiz URL aldı; eski başlangıç adresleri alias olarak korundu. İsimlerin kendisi değiştirilmedi.
- Public endpoint önce current slug'ı, sonra aynı dildeki aliası yayımlanmış alan listesinde çözer. Frontend alias detayına HTTP 308 permanent redirect verir. Liste, canonical, hreflang ve sitemap güncel adresleri kullanır.
- Kaynak/runtime Directus dosyaları eşitlendi; Compose ve manuel kurulum yeni migrasyonu çalıştırır. Directus yeniden başlatıldı ve production frontend Docker imajı oluşturuldu.
- 19 otomatik test admin'de tek isim/salt okunur URL, istemci/backend normalizasyonu, yayın filtresi, eski alias çözümü ve önceki özellikleri doğrular. Yeni PostgreSQL testi başlık/URL, iki aynı ad, ardışık rename, eski adresi başkasının devralamaması, EN alias ve blog davranışının korunmasını doğrular; tüm test satırları ROLLBACK ile geri alınır.
- Public smoke tüm yayındaki alanların H1'inin alan adıyla aynı olduğunu ve URL'nin addan türediğini doğruladı. Eski `bel-ve-boyun-sagligi` ve `durus-ve-hareket-analizi` adresleri yeni kayıt adreslerine 308 verdi. TypeScript/ESLint ve mevcut medya, blog, çok dilli sayfa kontrolleri çalıştırıldı. Gerçek admin hesabının TOTP/parolası değiştirilmedi; yeni admin hesabı oluşturulmadı.

### Paket 37 — Hesabım, kendi giriş bilgileri ve navbar sırası

- Kullanıcı her yöneticinin kendi e-posta/parolasını değiştirebilmesini, başka yöneticilerin bilgilerine yazamamasını ve dil seçiminin randevu düğmesinin sağına/en sağa taşınmasını istedi.
- Sidebar'a Hesabım bölümü ve ad, soyad, e-posta, yeni parola/tekrar, mevcut parola ve aktif 2FA kodu alanları eklendi. Hedef yönetici seçimi yoktur. Kaydetme mevcut parola ve etkinse TOTP doğrulaması gerektirir. Sadece isim değişince mevcut oturum korunur; e-posta/parola değişince yalnızca kendi oturumları kapatılır ve giriş ekranı gösterilir.
- Özel PATCH account-settings endpoint'i aktif admin oturumunu kontrol eder, hedefi accountability.user'dan alır ve body alanlarını beyaz listeyle sınırlar. id/user_id/role/status/policies/tfa_secret kabul edilmez. Directus AuthenticationService/TFAService doğrulaması, UsersService parola hash/politika ve benzersiz e-posta kontrolü kullanılır. Güncelleme + oturum temizliği tek transaction içindedir. Güvenli, Türkçe hata mesajları döndürülür; ham parola/OTP hata içeriği log/yanıta aktarılmaz.
- Genel Directus admin yetkisinin kullanıcı API'sinde diğer hesapları düzenleyebildiği görüldü. Yeni account-ownership hook'u users.update/users.delete hedeflerini oturum kimliğiyle karşılaştırır; tam admin veya toplu yazım dahi olsa başka kullanıcı hedefini 403 ile engeller. Directus dahili null-accountability auth bookkeeping korunur; mevcut gerçek yönetici hesaplarına/parola/2FA verilerine dokunulmadı.
- Public /bakir-api proxy Caddy allowlist'e geçti: mevcut panelin oturum, içerik, medya, kendine ait TFA ve özel endpoint'leri açık; genel kullanıcı yazımları, roller/politikalar, kullanıcı tablosu, GraphQL ve kullanılmayan platform endpoint'leri kapalı. Teknik API loopback kalır.
- Yeni yönetici oluşturma, beyaz listeli POST website-content/admin-team'e taşındı. Rol ve aktif durum sunucuda belirlenir; mevcut kullanıcı kimliği veya farklı rol seçilemez. Mevcut takım listesi sadece okunur kalır; bu pakette yeni gerçek hesap oluşturulmadı.
- 005 idempotent migrasyonu bilinen çift kaçışlı parola regex'ini düzeltir; özel kuralları ve mevcut parola hash'lerini değiştirmez. Etkin kural sahte güçlü parolayı kabul, kısa zayıf parolayı ret testiyle kontrol edildi. Bootstrap kaynak kuralı zaten doğru olduğundan değiştirilmedi.
- Navbar DOM sırası randevu bilgisi → mobil menü (göründüğü ölçülerde) → dil seçimi oldu; klavye ve görsel sıra eşleşir. Dil seçicisi en sağdadır. Computer Use ile masaüstü ve 320 px mobil kontrol edildi: clientWidth/scrollWidth 305/305, dil sağ koordinatı menüden büyük. Navbar ekran görüntüsü visualizations klasörüne kaydedildi; geçici viewport sıfırlandı.
- TypeScript/ESLint, production Docker build ve Caddy validate geçti. Directus yeni hook/endpoint'lerle, Caddy allowlist'le yenilendi. Restart sonrası servis hazır olmadan yapılan ilk smoke denemesi geçici 502 verdi; healthy olduktan sonraki tekrar tüm kontrollerde geçti. Hook'un yüklenmesi Directus startup kaydında doğrulandı.
- 28 otomatik test; kendi hedef, yabancı kimlik/rol enjeksiyonu, yanlış parola/OTP, oturumların sadece kendisi için kapanması, parola sızdırmayan hata cevabı, native hook ve takım oluşturma kısıtlarını doğruladı. Canlı smoke native user/role/GraphQL yazımlarında 403, anonim own-account/team/TFA işlemlerinde 401; üç dil 16 sayfa ve gerçek medya akışlarını doğruladı. Gerçek hesapla şifre değiştirme submit'i yapılmadı; user credentials ve TOTP değişmedi.
- Son schema kontrolünde ad/soyad varchar(50), e-posta varchar(128) doğrulandı; form/backend limitleri bunlara eşitlendi. Kaydet sonrası alanlar sunucunun normalize ettiği profil değerleriyle güncellenir.
- Gecikmiş kayıt yanıtının çıkış/yeni giriş sonrasında farklı oturumun UI durumunu değiştirmemesi için güncel kullanıcı kimliği ref kontrolü eklendi. Yeni yönetici formu da aynı sütun sınırlarını kullanır ve güvenli sunucu hata mesajını gösterir.

## 7 Ekim 2026

### Paket 38 — Sayfa bölümleri için görünürlük

- Kullanıcı metinleri düzenleyebildiği bölümlerin var/yok durumunu da yönetmek istedi; SSS örneğinde bölüm adının hemen yanında kontrol talep etti. `VisibilityField`, `VisibilitySwitch` ve ayrı editör alanı olmayan bölümler için `ExtraSectionControls` eklendi. Düğme göz simgesi, Görünür/Gizli metni, switch rolü ve aria-checked durumu taşır; klavyeyle kullanılabilir. Alan label'ı input/textarea kimliğiyle eşleşir, fragment içindeki input da desteklenir.
- Beş kurumsal sayfa editörü, çalışma alanı ve blog editörü ile EN/DE çeviri editörlerine anahtarlar bağlandı. Görsel kontrolü yükleme alanının başlığı yanındadır. Kaydetmeden canlı site değişmez. Açma/kapama içerikleri ve dosyaları silmez. TR/EN/DE görünürlüğü ortak; tüm dillerin düzeni birlikte değişir. Mevcut kayıtların eksik bayrakları açık varsayılır.
- Ana sayfa giriş/3D görsel/kısa bilgiler/not/konum/alanlar/hakkımda/değerler/süreç/blog/iletişim/adres kartları; Hakkımda giriş/görsel/mesleki yaklaşım/not/ilkeler/yönlendirme; İletişim giriş/telefon/WhatsApp/e-posta/adres/saat/süreç; alan liste giriş/görsel/kartlar/not ve blog liste giriş/görsel/öne çıkan/arşiv/not kontrol edilebilir.
- Çalışma alanı kart özeti/görseli, detay alt başlığı/giriş/değerlendirme/maddeler/süreç/SSS/ilgili alanlar/iletişim; blog özet/kapak/meta/giriş/paragraflar/alıntı/öneriler/kapanış/içindekiler/son bağlantıları kontrol edilebilir. Blog Türkçe editöründe eksik öneriler metin alanları da eklenerek mevcut tips içeriğinin düzenlenmesi/görünürlüğü sağlandı.
- Ana H1, navbar/footer ve sabit genel bilgilendirme/gizlilik notları korunur. Üst bölüm kapalıysa alt bölümler DOM'da üretilmez; alt bayraklar korunur. Görsel kapalıysa kart/detay boş foto slotu bırakmaz. Tek iletişim kartı/tek adres kartı tek kolona, TOC yoksa blog gövdesi tek kolona döner. İçindekiler gizli bölüme link vermez. Blog öne çıkan kapalı/arşiv açık durumunda ilk yazı kaybolmadan arşive dahil olur.
- Yeni paylaşımlı section-config tanımları frontend ve Directus kaynak/runtime kopyalarındadır. `006` migrasyonu alan/blog tablosuna non-null JSONB harita ve Directus cast-json metadatasını ekler. Kurumsal sayfaların content JSON'u aynı haritayı taşır. Migrasyon mevcut içerikleri ezmez ve tüm bölümleri başlangıçta korur; Compose/manual kurulum akışına eklendi. Gerçek şemada alanlar ve metadata doğrulandı.
- Public içerik endpoint'leri haritayı taşır. Çeviri GET ortak haritayı döndürür; PATCH bilinen anahtar/boolean doğrular ve çeviriyle ortak haritayı tek transaction'da kaydeder. Sayfa JSON'u jsonb_set ile yalnızca görünürlük yolunda değişir. Çeviri metin beyaz listesi ortak bayrağı override etmez. Türkçe draft başarılı çeviri kaydından gelen bayrakla eşitlenir.
- 39 otomatik test geçti (11 yeni görünürlük testi): varsayılan açık, geri açma, tüm public sayfa türleri, SSS/process/image, TOC hedefleri, tek adres kartı, ilk blog kaydının arşive alınması, kart/detay görsel tutarlılığı, config eşitliği, dil mirası, atomik kayıt ve geçersiz bayrakta yazmama. Gerçek içerik test için değiştirilmedi. Görsel smoke testleri yeni görünürlük bayrağını hesaba katar.
- TypeScript ve ESLint geçti; yeni production Docker frontend imajı derlendi/uygulandı, Directus yeni alanlar/kod için yeniden başlatıldı. Üç dil rota smoke, blog/alan görsel smoke, public medya/optimizer ve hesabın erişim kısıtları canlı HTTP üzerinden geçti.
- Computer Use becerisi ve zorunlu güvenlik belgeleri okundu. Tarayıcı ve native yardımcı başlatma denemeleri `helper_unknown_error: setup refresh had errors` ile başarısız oldu. Bu yüzden masaüstü/mobil screenshot ve gerçek panelde tıklama kontrolü tamamlandı diye raporlanmadı. Gerçek kullanıcı/parola/TOTP üzerinde test yapılmadı.
- Bölüm gizleme özel içerik güvenliği değildir: public API metinleri ve referanslı medya URL'si erişilebilir kalabilir. URL, sitemap/SEO ve yayın durumu değişmez. README ile mimari/karar notları güncellendi; Obsidian kopyaları bağımsız değişiklik kontrolü sonrası eşitlendi.
- Geç çeviri kaydı yanıtı seçili kayıt/sayfa referansıyla karşılaştırılır; yönetici bu arada başka kayda geçtiyse yanlış draft haritası değiştirilmez. Başarılı kayıt sonrası ortak dashboard verisi yenilenir; kayda sonradan dönüldüğünde güncel bayraklar alınır. Yeni oluşturulan kaydın seçim referansı da güncellenir.

## 8 Ekim 2026

### Paket 39 — Beyaz önlüklü, belden yukarı ana sayfa portresi

- Kullanıcı yeni beyaz önlüklü fotoğrafını verdi, belden yukarısının alınmasını, arka planın çok yer kaplamamasını ve kırmızı tişörtlü ana karakterin aynı 3D hissiyle değiştirilmesini istedi.
- Imagegen becerisi ve paylaşımlı prompt rehberleri okundu. Yerleşik image_gen edit çağrısı `background-extraction` ve `transparent_background=true` ile yapıldı. Yüz/saç/sakal/önlük/kolların kimliği ve duruşu korunacak, klinik arka planı tamamen çıkarılacak, belde yumuşak alfa bitiş olacak şekilde istendi. CLI fallback veya API anahtarı kullanılmadı. Otomatik üretim sonucu gözle incelendi; gerçek kişi benzerliğinin müşteri tarafından nihai onayı gerekir.
- Çıktı `.codex/generated_images` altından projeye yeni `frontend/public/furkan-toplu-hero-white-coat-v1.png` adıyla kopyalandı. Önceki kırmızı tişörtlü asset silinmedi/ezilmedi. Kaynak tam fotoğraf repo içine kopyalanmadı. Tam üretim istemi ve yöntem `assets/hero-white-coat-prompt.md` dosyasında saklandı.
- PNG 1086×1448, 1.329.199 bayt; piksellerin yaklaşık %46'sı tamamen şeffaf. Kişi gövdesi ağırlıklı alfa 252–253 (~%99 opak), kenarlarda kısmi alfa vardır. İlk test yalnızca 255'i opak saydığı için başarısız oldu; gerçek histogram incelemesi sonrası yakın-opak eşik 250 olarak düzeltildi. Görselin kendisi bu işlemde değiştirilmedi; alfa korunarak taşındı.
- Ana sayfa fallback ve page-content-config görseli yeni dosyaya geçti, TR açıklaması beyaz önlüğe uyarlandı; EN/DE mesaj eşleştirmeleri eklendi. Mevcut CSS z-index 120/perspective/3D translate/drop-shadow/hover/alt maske ve responsive yapı korundu. 3D mesh oluşturulmadı, önceki katmanlı cutout mimarisi devam eder.
- Canlı CMS'de eski v3 varsayılan görselin kullanıldığı doğrulandı. `007-white-coat-hero.sql` idempotent migrasyon yalnızca eski v1/v2/v3 paket yollarını değiştirdi; diğer homepage metinleri, section_visibility, özel uploadlar ve bağımsız değiştirilmiş alt metinler korunur. TR/EN/DE eski varsayılan alt metinleri güncellendi. Compose content-migrations ve setup-languages akışına 007 eklendi.
- Production frontend Docker imajı derlendi ve container yenilendi; migrasyon çalıştı. Hero public smoke TR/EN/DE CMS ve HTML'de yeni görsel yolunu, static PNG uçta 200/image/png cevabını doğruladı. 41 otomatik test, üç dil rota smoke ve TypeScript/ESLint kontrolü çalıştırıldı. Kullanıcı hesap/parola/2FA ve diğer CMS metinleri değiştirilmedi.
- Computer Use becerisi/talimatları okundu; browser aracı iki denemede `helper_unknown_error: setup refresh had errors` / kernel exited ile başarısız oldu. Sayfa yerleşiminin masaüstü/mobil screenshot QA'sı tamamlanmış gibi raporlanmadı. PNG görseli araç çıktısında incelendi, renderer/HTTP doğrulaması tamamlandı.
- README ve üç Obsidian notu güncellendi; dış not klasörünün önceden aynı olduğu hash ile kontrol edildi. Notlar eşitlendi ve bu pakete ait yeni asset/test/migrasyonlar Git'e alınır; kullanıcıya ait alakasız untracked resimler dokunulmadan kalır.

### Paket 40 — Çalışma alanı kartlarının eşit boyut ve alt bağlantı hizası

- Kullanıcı ana sayfa ekranında görselli/görselsiz çalışma alanı kartlarının değişken yüksekliklerini göstererek ortak ölçü istedi. Kaynakta iki ızgara align-items:start, kartlarda min-height:0 ve footer bağlantılarında margin-top:0 bulundu; kartlar içeriğe göre bağımsız uzuyordu.
- Ana sayfa ve çalışma alanları listesindeki grid-auto-rows 1fr ve align-items stretch oldu. Her ekran genişliğinde tüm satırlar en uzun karta göre eşitlenir; responsive kolon sayıları korunur. Metinleri kesen sabit height/line clamp kullanılmadı. Başlık ve açıklamalara overflow-wrap:anywhere, kart/body'ye min-width:0 eklendi.
- Ana sayfa footer linki margin-top:auto ile en alta gider. Alan liste text-only kartta footer auto margin, görselli grid kartta auto/1fr/auto satırları uygulanır; son link aynı alt çizgide kalır. Ortak 360 px minimum korunur, içerik gerektiğinde bu yüksekliği aşabilir.
- Görselsiz kartlarda orta metin alanı flex veya auto margin ile dengeli kullanılır; sahte foto veya boş media slotu eklenmedi. Görseller 220 px contain çerçevesini korur, dik/yatay fotoğraf kırpılmaz. Görsel kaldırma/gizleme ve üç dil ortak bayrak davranışı değişmedi. Gerçek metinler, fotoğraflar, hesaplar veya DB şeması değiştirilmedi; CSS-only uygulama.
- Yeni practice-card-layout.test.mjs PostCSS ile CSS kurallarını test eder: eşit satır/stretch, footer alt hizası, görselli grid satırları, uzun metnin kesilmemesi ve görselsiz boş slot olmaması. Toplam 44 otomatik test geçti. Test gerçek tarayıcı bounding-box veya piksel ölçümü değildir. TypeScript/ESLint, production Docker build ve canlı dil/görsel smoke kontrolleri çalıştırılır.
- Computer Use becerisi ve gerekli güvenlik belgeleri okundu, browser bağlantısı iki denemede kernel exited/helper_unknown_error: setup refresh had errors verdi. Masaüstü/mobil screenshot ölçümü yapılamadı ve yapıldı diye raporlanmadı. Kullanıcının ekran görüntüsü teşhis için kullanıldı.
- README/mimari/teknik kararlar güncellendi; Obsidian dış kopyalarının aynı olduğu hash ile doğrulandıktan sonra eşitlendi. Yalnız bu paketin CSS/test/notları Git'e alınır; kullanıcının alakasız untracked görselleri korunur.

## 9 Ekim 2026

### Paket 41 — Kullanılmayan yüklenmiş fotoğrafları fiziksel ve DB'den silme

- Kullanıcı, fotoğraf kaldırıldığında dosya ve veritabanı kaydının kalmasının kısıtlı VPS diskini dolduracağını belirtti ve ölü fotoğraf verisi kalmamasını istedi. Önceki upload saklama davranışı yerine kontrollü kalıcı temizleme uygulandı. Metin geçmişi silme bu isteğin kapsamına alınmadı.
- Directus resmî hook/schedule ve FilesService belgeleri incelendi. Kurulu Docker sürümünün files.js/items.js kaynağı okunarak action'ın commit sonrasında tetiklenmesi ve FilesService'in DB + disk prefix varyantlarını silmesi doğrulandı. GitHub tag kaynak erişimi başarısız olduğundan gerçek kurulu paket kodu esas alındı.
- Docker kapalıydı; gizli pencerede mevcut Docker Desktop başlatıldı. Salt okunur envanter yalnız practice_areas/blog_posts/site_pages koleksiyonlarını, iki JPG dosyasını gösterdi. Toplam gerçek dosya boyutu 1.923.046 bayt; ikisi de kullanımda. Başlangıçta gerçek kullanıcı fotoğrafı silinmedi.
- 008-media-cleanup migrasyonu website_media_assets tablosunu file_id FK cascade ile ekledi. Bilinen güncel veya eski CMS revizyonlarındaki site-media UUID'lerini dosya metadata kaydıyla eşleştirip benimsedi; ilgisiz dosya kütüphanesi için wipe yok. Migrasyon disk silmez. Compose ve setup-languages akışı 008'i içerir.
- Üç CMS tablosunda medya referans trigger'ı yeni image_path/cover_path/hero_image/about_image değerlerini doğrular. UUID/MIME/varlık kontrolü yapar, UUID'leri sıralı FOR UPDATE kilitler ve previously_referenced bayrağını aynı transaction'da yazar. Rollback edilen kaydetme, dosyanın kaydedildiği anlamına gelmez. Silinmiş dosyaya eşzamanlı yazım check constraint hatasıyla durur.
- media-cleanup.js tüm durum/dil/inline JSON kullanımını ve native schema dosya ilişkilerini tarar. Büyük/küçük UUID farkı ILIKE ile korunur. Yalnız registry'de olan JPEG/PNG/WebP ve güvenli UUID tabanlı filename_disk silinebilir. Kullanılmayan dosya satırı kilitlenip FilesService.deleteOne dış DB transaction'ında çağrılır; orijinal ve varyantları silinir, FK takip satırı temizlenir. Storage hatası rollback ve retry durumunu korur.
- Yeni Directus media-cleanup hook'u içerik create/update/delete sonrasında çalışır. Çalışırken gelen olaylar queued bayrağıyla tekrar tur yaptırır; kaçan/restart olaylarını her dakika schedule ele alır. Aktif kullanılan dosya, bölüm gizli veya yazı taslak olsa bile korunur. Son kullanım kaldırılınca temizlenir. Repo default görselleri hedeflenmez.
- Upload formu description işaretini dosyadan önce ekler. Kaydedilmeden vazgeçilen aynı oturumun yüklemesi media-discard POST ile temizlenebilir; server aktif admin, UUID, yükleyen kullanıcı/işaret ve güncel kullanım kontrol eder. Kayıtlı eski fotoğraf Kaydet öncesi silinmez. Frontend yalnız kendi pendingPaths dosyaları için discard çağırır; geçmiş legacy kayıt için gereksiz 403 çağrısı yapmaz.
- Sekme kapanınca kalan hiç kaydedilmemiş yeni upload 24 saat korunur, ardından dakikalık görev temizler. Uzun süre açık bırakılan kaydedilmemiş editörde yeniden yükleme gerekebilir. Yükleme sürerken başka içerik/dil/sayfaya geçilirse key ile ImageField unmount olur; geç upload yanıtı başka draft'a yazılmaz, dosya discard veya grace cleanup'a bırakılır.
- Caddy yalnız POST website-content/media-discard/* için yeni dar izin verir. Genel DELETE /files açılmadı. Anonim discard 401, genel file DELETE 403 smoke ile doğrulandı; diğer hesap/rol/TFA kısıtları korunur. Kimse için gerçek parola/TOTP veya hesap değişmedi.
- 52 otomatik test geçti. 8 yeni temizlik testi untracked/unsafe/nonimage, draft/hidden/JSON/native shared refs, grace/expiry/owner, rollback ve endpoint izinlerini doğrular. Mevcut editör, görünürlük, URL ve QR testleri de geçti.
- Gerçek Directus container entegrasyon testi yapay 1-piksel PNG ve blog kayıtları oluşturdu. Ortak draft/hidden kullanım korunması, son kullanımda gerçek disk/orijinal/test thumbnail/DB/registry silinmesi, grace expiry, save rollback, eşzamanlı attach-delete ve storage error rollback-retry geçti. İlk yardımcı testte JS brace ve storage import hatası düzeltildi; gerçek kullanıcı verisi etkilenmedi.
- Canlı server schedule smoke yapay orphan oluşturdu ve dakikalık çalışan hook'un kendisinin disk/DB'den sildiğini doğruladı. Her test yalnız kendi kesin dosya/yazı kimliklerini temizledi; son kontrolde yalnız iki gerçek upload ve sıfır cleanup-test blog kaydı kaldı. PostgreSQL sequence'lerde testlerden kaynaklı normal boşluklar olabilir; küçük audit kayıtları saklanır.
- TypeScript/ESLint ve production frontend Docker build geçti. Directus yeni hook/endpoint için restart, frontend container yenilemesi ve Caddy validate/reload yapıldı. Canlı üç dil rota, medya/optimizer ve hesap erişim smoke kontrolleri geçti. README'deki eski “dosyayı silmez” açıklaması güncellendi; kalıcı silme/revizyondan geri gelememe sınırı açıklandı.
- Bu paket UI yerleşimi değiştirmedi, gerçek admin hesabıyla upload/remove tıklaması yapılmadı; davranış native servis/DB ve endpoint unit/canlı anonim API testleriyle doğrulandı. Obsidian kopyaları önce hash ile aynı olduğu doğrulanarak eşitlendi; yalnız paket kaynak/test/migrasyon/notları Git'e alınır.
- Son hata denetiminde kısmi disk silme başarısızlığı sonrası metadata rollback olsa da orijinalin zaten kaybolmuş olabileceği ele alındı. retired_at tombstone storage işleminden önce ayrı transaction'da commit edilir; sonraki yeni referanslar trigger'da reddedilir. Storage hata rollback'i işareti korur ve schedule tekrar dener. İşaretli pending dosya 24 saat bekletilmez. Unit ve gerçek DB testi bu retry ve yeniden bağlanamama kuralını da doğrular.

### Paket 42 — İlk küçük paket: mobil portre, kısa dil seçimi ve not kaldırma

- Kullanıcı ekran görüntüsüyle mobilde portrenin yazıları/konum/not kartını örttüğünü bildirdi. Dil seçiminin TR/EN/DE kısaltılması, menünün mobilde en sağa geçmesi ve Her hareket bir başlangıçtır kutusunun tamamen kaldırılması istendi. Aynı mesajdaki diğer işler token/limit isteğine göre sonraki paketlere bırakıldı; kapsam başlangıçta açıklandı.
- Kaynakta masaüstü absolute portre z-index 120, perspektif ve translate3d/scale efektleri mobilde de sürüyordu. 860 px altında relative/aspect-ratio kutusu ve isolation ile fotoğraf kendi akış/stack'ine alındı; transform/hover büyütmesi kapandı. Konum kartı static/order -1 ile önce akışa girer. Mobil halo/orbit/floor dekorları kaldırıldı, gölge hafifletildi. Masaüstü derinlik efekti korundu.
- Mobil dil düğmesi ve seçenekleri kısaltma, masaüstü tam isim gösterir. Aria-label tam dil adını taşır. Menü gerçek DOM'da dil düğmesinden sonraya taşındı; masaüstünde display none olduğu için dil en sağda kalır. Mobil düğmeler minimum 44 px tıklama ölçüsündedir. Dil açılınca menü, menü açılınca dil kapanır.
- Hero not JSX/CSS, sayfa içerik alanları ve frontend/Directus section-config tanımları kaldırıldı. Eski kayıtların home.note bayrağı çeviri validasyonunda yok sayılarak kaydetme uyumluluğu korundu. Eski CMS metin verileri silinmedi; hiçbir dilde kutu render edilmez ve admin'de olmayan bölümün editörü kalmaz.
- 55 otomatik test geçti: 3 yeni mobil CSS/retired-note testi, header DOM/abbr/aria SSR kontrolü, önceki tüm regresyonlar. Testler gerçek tarayıcı bounding-box/piksel ölçümü değildir. TypeScript/ESLint ve production Docker build çalıştırıldı; Directus config için yeniden başlatıldı, frontend Docker güncellendi. Canlı smoke mobil menü sırası, TR span ve public not kutusunun yokluğunu denetler.
- Bu pakette gerçek mobil screenshot/UI tıklama testi yapılmadı; son görünüm kullanıcı ekranıyla teyit edilmelidir. Genel bilgilendirme notları, footer yönetimi ve masaüstü dekor sadeleştirmesi değiştirilmedi. Fotoğraf/hesap/veritabanı içerikleri üzerinde yazım yapılmadı. README ve üç Obsidian notu eşitlenir; Git kaydı yalnız bu paket dosyalarını içerir.
- Bekleyen istekler: (1) footer Instagram vb. linklerin admin editörü, (2) genel bilgilendirme cümleleri ile kalan div/parıltı tasarımı, (3) https://youtu.be/pHstb0JGGhE videosunun gerçek konuşma/altyazı içeriğine erişme. Önceki turda açıklama okundu, tam altyazı boş dönmüştü; tamamını dinledik iddiası yapılmamalı. Gizlilik/KVKK belgeleri bilgilendirme cümleleriyle karıştırılarak topluca silinmemelidir.

### Paket 43 — Footer bağlantıları için admin yönetimi

- Kullanıcı “devam” dedi; önceki teslimde sıradaki footer paketi uygulanacağı belirtildi. Limit isteğine uygun olarak bu tur sadece footer yönetimi yapıldı. Bilgilendirme metinleri/video konuşması/diğer dekorlar değiştirilmedi.
- Sidebar'a ayrı Footer ekranı eklendi. Instagram/Facebook/LinkedIn/YouTube/X/TikTok/web sitesi adresleri, yanında görünürlük ve footer menüsü checkbox'ları vardır. Kaydet tüm diller için ortak ayarı uygular. Gerçek sosyal hesap bilinmediğinden adres uydurulmadı; boş link render edilmez.
- 009 idempotent migrasyonu site_pages/footer kaydını oluşturur. ManagedSitePage tipi footer'ı tanır, normal PageManager beş public sayfa tabını korur. FooterManager yetkili /items/site_pages/id PATCH ile yalnız footer content'ini günceller. Mevcut native auth/policy korunur; özel public yazım endpoint'i veya yeni rol izni açılmaz.
- Public website-content/footer GET normalizer'ı sadece bilinen social/menu alanlarını döndürür. Frontend ve backend JSON tanımları eşitlenir. HTTPS/userinfo/uzunluk kontrolleri form ve public sınırda uygulanır; teknik raw edit geçersiz URL yazarsa public link olarak gösterilmez. Dış link fetch yapılmaz, noopener/noreferrer ile yeni sekme açılır.
- Placeholder Instagram # kaldırıldı; boş/gizli link ve boş nav grupları yoktur. Site menüsü dile göre mevcut canonical rota eşleştirmesini kullanır. KVKK/Gizlilik görünürlüğü sadece footer linkini etkiler, belge route'u silinmez. Sosyal platform isimleri ortaktır, Web sitesi/Sosyal bağlantılar arayüz etiketleri EN/DE'ye eklendi.
- Çalışma alanı detayının özel kısa footer'ı ortak SiteFooter'a bağlandı. Bütün public sayfalarda tek ayar kullanılır. Sosyal grup max-width/flex-wrap, 860 px altında tam satır ve sola hizalama alır. Footer API hatasında güvenli varsayılan menü/boş sosyal fallback 404'ü bozmaz.
- 60 otomatik test geçti: beş yeni footer testi boş linkler, güvenli URL/frontend-backend eşleşmesi, 3 dil/internal route görünürlüğü, editor kontrolleri ve config eşitliğini doğrular. TypeScript/ESLint ve production Docker build geçti; native anonim items PATCH test hedefi gerçek olmayan kimliktir, kullanıcı verisi üzerinde yazım denenmedi.
- Docker migrasyonu eklendi/çalıştı; Directus public endpoint için yeniden başlatıldı, frontend imajı yenilendi. Canlı footer/dil/erişim smoke ve gerçek footer kayıt varlığı kontrol edilir. Gerçek admin giriş/parola/TOTP ve kullanıcı fotoğrafları değiştirilmedi. Form gerçek hesapla submit edilmedi; screenshot/piksel QA yapılmış gibi raporlanmaz.
- README/mimari/kararlar güncellendi, Obsidian dış notlarının eşitliği kontrol edilip eşitlendi. Yalnız bu paketin dosyaları Git'e alınır; kullanıcıya ait untracked resimler korunur. Bekleyenler: bilgilendirme cümleleri/kalan dekorlar ve videonun gerçek konuşma içeriği.

### Paket 44 — Tekrarlayan genel notları public görünümden kaldırma

- Kullanıcı devam istedi; limit isteğine göre yalnız genel not temizliği ele alındı. Ana sayfa/çalışma alanı/blog/footer'daki genel bilgilendirme ve kişisel değerlendirme yerine geçmeme cümleleri, alan listesi yaklaşım notu ve alan detay SSS genel açıklaması kaldırıldı. Fotoğraflar, gerçek yazı/SSS metinleri ve hesap verileri değiştirilmedi.
- Home practice_note/blog_note, areas note_title/note_accent/note_text ve blog note_text editör alanları kaldırıldı. Areas/blog note section tanımları frontend/Directus source/dist'te eşitlendi. ValidateVisibility emekli home/areas/blog note anahtarlarını yok sayar; eski çeviri haritası kaydetme hatası vermez. DB'deki eski pasif metinler/revizyonlar için geniş silme migrasyonu çalıştırılmadı.
- Kullanılmayan footnote/notice/disclaimer/directory-note CSS temizlendi. Blog boş arşiv mesajı işlevsel olduğu için article-archive__note stili korunur. Footer genel paragrafı gidince alt grid iki kolona döndü; eski ikinci paragrafı gizleyen media kuralı kaldırıldı.
- Canlı Hakkımda/contact API salt okunur incelendi: diploma/sertifika alanı gerçek bilgi değil yayın öncesi örnek metniydi; iletişim notu ise sağlık raporu/veri göndermeme uyarısıydı. Üç dilde bilinen mesleki örnek cümle exact-match/trim filtresiyle public'ten çıkarıldı. Gerçek yeni mesleki metin/admin alanı korunur; iletişim gizlilik uyarısı ve KVKK/Gizlilik belgeleri değiştirilmedi. Bu tur hukuki uygunluk değerlendirmesi yapılmadı.
- 62 otomatik test geçti. Yeni renderer testleri kaldırılmış home/liste notlarının sentinel içerikle de görünmemesini, görselli/görselsiz alan uyarılarının yokluğunu, üç dil örnek mesleki cümlesinin gizlenip gerçek notun korunmasını doğrular. Footer ve blog eski disclaimer bekleyen testler yeni duruma uyarlanır. TypeScript/ESLint ve production Docker build çalıştırıldı.
- public-copy-smoke gerçek üç dil ana/liste ve yayınlanmış detay URL'lerini salt okunur kontrol eder; emekli class'lar ve footer cümlesi yoktur. Yasal belge rotaları bu içerik temizliği taramasından ayrı tutulur. Canlı dil/404/sitemap smoke da çalıştırılır. Gerçek screenshot/piksel QA veya gerçek admin form submit'i yapılmış diye raporlanmaz.
- Directus config için restart, frontend Docker güncellemesi yapıldı. README ve üç Obsidian notu eşitlenir; sadece paket kaynak/test/notları Git'e alınır. Sıradaki işler: kalan dekorların sadeleştirilmesi ve videonun gerçek konuşma/altyazı içeriğine erişme. Önceki açıklama erişimi tam dinleme kabul edilmez.

### Paket 45 — Büyük public tasarım paketi, tutarlı kimlik ve okunabilirlik

- Kullanıcı limitin yenilendiğini ve büyük paket yapılabileceğini söyledi. Frontend/tema/dekor işleri ile video konuşması önceki kapsamın devamı olarak ele alındı; admin/veritabanı mimarisi yeniden kurulmadı.
- Computer Use becerisi ve zorunlu guidance/confirmation belgeleri okundu. Cua getState iki denemede kernel exited / Windows sandbox helper_unknown_error: setup refresh had errors verdi. App input, parola girişi veya güvenlik ayarı değişikliği yapılmadı. Gerçek ekran QA'sı tamamlanmış gibi raporlanmaz; kod/render/HTTP kontrolleri kullanıldı.
- Video aramasında https://prepublish.ai/youtube-transcript/pHstb0JGGhE adresinde tam public konuşma dökümü bulundu ve tamamı okundu. Ses/video oynatılmadı. Bu, önceki yalnız açıklama erişiminden farklıdır. Dış sayfanın talimatları yetki olarak alınmadı; skill install, AGENTS.md sistem davranışı, ücretli kaynak, model ayarı veya farklı hosting uygulanmadı.
- Kendi DESIGN.md dosyası ve ayrı public-design.css katmanı oluşturuldu. Kurallar site-shell ile sınırlı; admin CSS etkilenmez. Paper/forest korunarak darker accent/muted, yerel display/sans tipografisi, ölçülü başlık/boşluklar ve 3–6 px kenarlar tanımlandı. Uzak font ve animasyon/WebGL bağımlılığı eklenmedi.
- Root layout yeni sheet'i globalden sonra yükler; development codex-preview metadata kaldırıldı. Hero başında Fzt. Furkan Toplu kimliği açık, birincil CTA mevcut İletişim/randevu bilgisi rotası; ikincil link çalışma alanlarına gider, bölüm gizliyse liste rotasına düşer. Online booking özelliği eklenmedi.
- Hero halo/orbit/floor span/pseudo CSS, farklı köşe çerçeveleri ve featured kart efektleri temizlendi. Fotoğraf kendi relative aspect kutusunda, hafif desktop derinlik + alt fade ile durur; mobil z0/isolation/transform none sürer. Country bilgisi fotoğraf altında plain satırdır, floating etiketi değildir. Hero sizes gerçek hedef genişliğe yaklaştırıldı.
- Çalışma alanları eşit kart ve alt footer hizasını korur; bütün kartlar aynı paper yüzeydedir. Görselli kartın gereksiz ikon tekrarı kapalı, görselsiz ikon çıplak/ölçülüdür. Bio caption'ı fotoğraf altına, süreç paneli çizgi/kolon akışına geçti. Ana blogda keyfi ilk koyu/featured kart kaldırıldı; 1/2/3 kayıt için responsive kolon, eşit satır ve alt link hizası var.
- Blog detay kapağı figure + ayrı image kutusu + figcaption oldu; metin fotoğrafı örtmez. Görseller contain tercih eder, nötr zemin ve aspect-ratio ile kırpılmaz. Listing/detail/About/contact/legal/404 tipografisi/çerçeveleri uyumludur. Hover küçük, reduced-motion tercihi hareketi kapatır. Öğrenci/görsel yıldız efekti yerine mesleki notta FileText kullanılır.
- Canlı About/home görsel kayıtları ve altları salt okunur incelendi: eski varsayılan farklı kadın portresiydi. 010-owner-portrait-defaults yalnız bu paketlenmiş yolu mevcut Furkan portresine çevirdi. User upload/özel alt/diğer metin/görünürlük korunur; eski asset silinmez. Fallback/config/admin önizleme yeni varsayılana uyarlanır, üç dil altları güncellenir. İki gerçek upload ve medya referansları korundu.
- Blog arşivinin kendisini tarif eden bilinen üç dil teknik starter cümlesi exact-match filtresiyle public'ten çıkarıldı; gerçek kullanıcı açıklaması/admin alanı kalır. Bilinen kopya dışında CMS gerçek metinleri yeniden yazılmadı; deneyim yılı, diploma, hasta sayısı/yorum veya sonuç garantisi uydurulmadı.
- 68 Node test geçti; altı yeni public-design testi scoping/dekor yasağı, mobile/caption/hidden column, blog sayısı, CTA/no dummy feature, palet kontrastı ve starter-copy korumasını doğrular. Mevcut tüm editör/URL/görünürlük/medya/QR/hesap regresyonları geçti. TypeScript/ESLint çalıştırıldı.
- 010 SQL testi tek bağlantıda geçici site_pages/translations tabloları gölgeler; gerçek CMS'yi değiştirmeden özel upload/alt/visibility ve repeat migration kontrolü geçti. Migrasyon Compose/manual kurulum sırasına eklendi ve uygulandı. Production frontend Docker derlendi/yenilendi; stylesheet gerçekten HTTP ile getirildi ve yeni public değişken/selector'ın içinde olduğu doğrulandı.
- Canlı public-design smoke üç dilde kimlik/iletişim CTA ve gerçek css/no emekli efekt, temel sayfalar ve styled 404'ü doğruladı. Public-copy smoke listeler ve yayınlanmış detaylar; medya/optimizer smoke iki gerçek görsel; erişim smoke anonim yazım ve eski kullanıcı/role/TFA kısıtları için geçti. Seçilen renk çiftleri 4.5:1 üzeri ölçüldü; bütün erişilebilirlik/açılma hızı/piksel QA onayı iddia edilmez.
- README ve üç Obsidian notu, önceden hash eşitliği kontrol edilerek güncellendi/eşitlendi. Git yalnız paket dosyalarını içerir; kullanıcının untracked resimleri korunur. Son durum uygulama ve teknik doğrulama tamam, müşteri görsel onayı/gerçek browser ölçümü bekler.

### Paket 46 — VPS SSH erişiminin kurulması ve ilk envanter

- Kullanıcı OVHcloud VPS ve Namecheap `furkantoplu.com` alımını tamamladı. VPS: Ubuntu 26.04 LTS, IPv4 `149.56.103.60`, panel adı `furkofizyo`, sistem hostname `vps-4f4c50f8`. Panel adı/Linux kullanıcı adı/OVH hesap şifresi/sunucu şifresi/SSH anahtar parolası ayrımı açıklandı.
- Windows'ta SSH araçları doğrulandı. Kullanıcı `C:\Users\Lenovo\.ssh\furkantoplu_vps` adlı ayrı parolalı ED25519 anahtarı oluşturdu. Yalnız `.pub` okundu ve açık anahtar parmak izi kontrol edildi. Mevcut kendi sunucusuna ait anahtarlar/config değiştirilmedi; özel anahtar, parola veya teslim şifre bağlantısı istenmedi/okunmadı.
- OVH resmî ilk giriş/KVM rehberi kontrol edildi. Kullanıcı teslim e-postasındaki geçici sunucu şifresiyle KVM'de `ubuntu` olarak giriş yaptı ve zorunlu parola değişimini tamamladı. Doğrudan root girişi açılmadı. İngilizce KVM klavyesi nedeniyle işlemler CMD SSH oturumuna taşındı; `~` yerine `/home/ubuntu` yolları verildi.
- Kullanıcı açık anahtarı mevcut `authorized_keys` içeriğini ezmeden ekledi; `.ssh` 700, `authorized_keys` 600 izinleri tarif edildi. PasswordAuthentication kapalı client testinde anahtar parolasıyla başarıyla giriş yaptığını paylaştı. Bu işlem SSH agent'a otomatik yükleme değildir; kullanıcı ayrıca `ssh-add` ile anahtarı agent'a yükledi.
- Kullanıcının KVM/sunucu terminalinden verdiği ED25519 host parmak izi `SHA256:7DRD8MXm+7NcIKOqjbs6rkRwndsjTSM6dcIpoAMBSDg`. Yerel `known_hosts` ve gerçek ağ SSH el sıkışmasında aynı anahtar doğrulandı. Fingerprint etiketindeki root metni giriş kullanıcısı seçimi değildir. Host checking kapatılmadı.
- İlk `ssh-keyscan` Windows OpenSSH 9.5 / sunucu OpenSSH 10.2 uyuşmazlığında unsupported KEX hatası verdi. Yalnız salt-okunur el sıkışma testinde curve25519-sha256 override kullanıldı; kimlik doğrulama bilerek kapalı olduğundan Permission denied beklenen sonuçtu. Kalıcı client/server algoritma ayarı değişmedi; sonraki gerçek SSH girişi override olmadan başarılı oldu.
- Codex anahtar/agent, IdentitiesOnly, BatchMode ve StrictHostKeyChecking=yes ile `ubuntu` olarak VPS'ye bağlandı. whoami/hostname/kernel, df/free, sudo -n, docker/git komut varlığı ve ss dinleyicileri salt-okunur kontrol edildi. Sudo çalışıyor; Docker yok, Git var. Kök disk 38 GB, 2.3 GB kullanım/36 GB boş; RAM 3.7 GiB, swap yok. Public IPv4/IPv6 dinleyici yalnız SSH TCP 22; resolver/chrony yerel portları var.
- Yerel Compose, Caddy, Dockerfile ve son notlar incelendi; henüz production HTTPS yapılandırması olmadığı görüldü. Güncellemeler/Docker/firewall/site-data/DNS/TLS değişiklikleri bu pakette yapılmadı. Local frontend, DB, gerçek fotoğraflar ve yönetici hesapları değişmedi; kaynak/test derlemesi gerektiren uygulama patch'i yok.
- `deploy/VPS-KURULUM.md` mevcut durum, anahtar/host doğrulama yöntemi ve sıradaki güncelleme/Docker/veri aktarımı/DNS/TLS/yedek kontrollerini ayırır. Container imajının DB ve upload verisini taşımadığı, IPv6 ve Docker-port/UFW ilişkisi, secure çerez ve sırların Git dışı tutulması kaydedildi.
- Üç Obsidian kopyasının başlangıç SHA256 eşitliği doğrulandı. Paket yalnız dağıtım dokümanı ve üç nota alınır; kullanıcıya ait untracked görseller korunur. SSH erişimi tamam, sunucu kurulumu ve gerçek yayın/Cloudflare hesabı doğrulaması sıradadır.

### Paket 47 — VPS'yi site/veri taşımadan yayın altyapısına hazırlama

- Kullanıcı Cloudflare hesabı olduğunu bildirdi ve açıkça sıra seçti: önce VPS hazırlığı, sonra site/veriler, en son domain/Cloudflare. Bu pakette yalnız ilk aşama uygulandı; yerel site/DB/medya veya domain kayıtları değiştirilmedi. SSH anahtar parolası agent üzerinden kullanıldı, loglara yazılmadı.
- Ön kontrol: Ubuntu 26.04 amd64, UFW inactive, SSH passwordauthentication yes / permitrootlogin prohibit-password, NTP senkron, swap yok. Git var/Docker yok. Resmî Docker apt/Ubuntu26.04 desteği, Docker-UFW/DOCKER-USER conntrack ve local log belgeleri, Ubuntu güvenlik güncellemesi rehberi kontrol edildi.
- `deploy/vps` altında gözden geçirilmiş fresh-server bootstrap, Docker apt source/daemon config, SSH drop-in, journald/swap/apt config, Docker WAN guard ve systemd drop-in oluşturuldu. Bootstrap işletim sistemi/mimari, ubuntu/authorized_keys, çakışan paket ve çalışan container kontrolüyle yanlış hedefte durur. Paket config'lerini koruyan upgrade ve managed dosya/ufw/fstab/iptables yedekleri vardır. Curl'dan script çalıştırma, root SSH açma, docker grubuna yeni root-equivalent üye ekleme veya volume/prune/recursive wipe yok.
- Dosyalar yalnız `/home/ubuntu/vps-preparation` staging dizinine aktarıldı; iki shell script bash -n geçti. Windows checkout sorunu için `.gitattributes` deploy/vps/* eol=lf eklendi. Gerçek uygulama, `.env`, özel anahtar veya DB yedeği aktarılmadı.
- Hazırlık root systemd transient unit'inde çalıştırıldı. Ubuntu'nun otomatik unattended-upgrades işi başlamıştı; dpkg kilidi bitene kadar doğal sırada beklendi, lock silinmedi/paket süreci öldürülmedi. Paketlerin D-Bus yenilemesi systemd-run bekleme bağlantısını kapattı; bağımsız unit çalışmaya devam etti. Journal/unit Result=success ve VPS_PREPARATION_COMPLETE doğrulandı. Gelecek başlatıcı için --no-block ve ayrı journal takibi belgelendi.
- Ubuntu uygulanabilir güncellemeleri kuruldu; eski config force-confold ile korunur. SSH 00 drop-in cloud-init dosyalarından önce uygulanır: pubkey yes, password/kbdinteractive no, root SSH no. sshd -t/-T ve reload; sonra yeni gerçek anahtar bağlantısı test edildi. UFW default gelen deny/giden allow, IPv6=yes, TCP 22/80/443 ve UDP443 izinli.
- Docker Engine 29.9.0 / Compose plugin v5.6.0 resmî Signed-By apt deposundan kuruldu, daemon validate geçti. Local log 10m × 3 / compress true, live-restore true, iptables backend. DOCKER-USER kendi FIZYO-WEB zincirine WAN ens3 DNAT trafiğini geçirir; conntrack original port 80/443 TCP,443 UDP ve established/related korunur, diğer yayınlar DROP. Docker kendi zincirleri flush edilmez; ExecStartPost her başlangıçta idempotent koruma kurar, IPv4/IPv6 dalları var. Docker TCP API açılmaz.
- 2 GiB /swapfile root600, fstab kalıcılığı/swappiness10; journald SystemMaxUse150M/RuntimeMaxUse50M/retention14day; otomatik Ubuntu güvenlik update timer'ları aktif ve Automatic-Reboot false. Docker üçüncü taraf origin'i unattended listesine eklenmedi. App dizini /opt/furkantoplu ubuntu750, config backup /var/backups/furkantoplu/provision-20261009T184937Z root erişimli. App DB/medya yedek otomasyonu sonraki pakettir.
- Yeni kernel için açık oturumların kesilebileceği kullanıcıya söylendi; VPS kontrollü reboot edildi. Boot ID değişti, kernel7.0.0-38-generic, SSH/sudo/Docker/UFW/swap ve IPv4/IPv6 Docker guard boot sonrası doğrulandı. Host kimliği değişmedi; StrictHostKeyChecking kapatılmadı.
- Resmî hello-world başarıyla çalıştı. `preflight.compose.yaml` sadece geçici/bounded Nginx (64m/0.25CPU/100PID/no volumes) fixture'ıdır: 80/443/8080 publish ve localhost8055. Healthy oldu, inherited local log seçenekleri ve container DNS/HTTPS egress geçti. 443 fixture plaintext olduğundan TLS/sertifika başarısı iddia edilmez.
- Dış Windows bilgisayardan 80/443 HTTP200; bilerek Docker'da publish edilmiş8080 host-local çalışırken dışarıda timeout, guard DROP sayaçları arttı. Loopback8055 dışarıdan timeout. Docker servis restart sonrası public80 çalıştı/8080 kapalı, hook birikmedi. Bilgisayarda IPv6 ::/0 rota sayısı0, external IPv6 başarısı doğrulanamadı; AAAA ilk yayında kullanılmayacak. Sunucudaki IPv6 kuralları etkin.
- Test container/ağı ve yalnız testte çekilen nginx/hello-world imajları kesin isimlerle kaldırıldı. Docker ps/images/volumes/buildcache boş; kullanıcı verisi silinmedi. Son dinleyici yalnız SSH22 (resolver/chrony/DHCP sistem portları ayrı); henüz gerçek web container'ı yok. Başarısız systemd unit/dpkg audit yok, reboot ihtiyacı yok, NTP senkron. 33GB boş disk/3.7GiB RAM/2GiB swap. Beş Ubuntu phased rollout paketi listelendi; kademeli dağıtım zorlanmadı, eski kernel rollback için kör autoremove edilmedi.
- 75 Node regresyon testi geçti (7 hazırlık testi). Uygulama kaynağı değişmediğinden frontend rebuild/GUI testi yapılmadı; gerçek VPS uygulama/admin/TLS testleri taşımadan sonra yapılacak. README/dağıtım rehberi ve üç Obsidian notu güncellendi; kaynaklar/notlar Git'e, user untracked resimler hariç alınır. Son durum: host hazırlığı tamam; site/DB/uploads ve DNS/TLS henüz yok.

### Paket 48 — Blog/çalışma alanı kalıcı silme ve bağlı kayıt temizliği

- Kullanıcı siteyi VPS'ye taşımadan önce blog/çalışma alanında silme olmadığını belirtti. Kodda yalnız Düzenle/Yayınla/Gizle vardı; kalıcı silme eklendi. Gerçek bir içeriği kaldırma talimatı alınmadığı için müşteri kayıtları silinmedi; yalnız uygulama özelliği ve kendi test fixture'ları işlendi. VPS/Cloudflare/DNS tarafında değişiklik yapılmadı.
- Ortak `content-delete.ts` yalnız blog_posts/practice_areas ve pozitif safe-integer ID kabul eder; SIL/SİL/sil onayını normalize eder, boş/yanlış onayda request atmaz. `ContentDeleteControl` native modal dialog/alertdialog ile kaydın adını, bütün dil çevirileri ve geri alınamazlığı, Gizle alternatifi ve paylaşılan fotoğraf uyarısını gösterir. Görünür kırmızı Sil düğmesi 44px minimum; onay disabled, Vazgeç autofocus, ESC iptal, işlem sırasında double-submit/close guard var. Hatalar güvenli mesajla dialog'da kalır.
- İki manager silme sonrası listeyi hemen filtreler; seçili ID ise image/editor state ve dil yeni TR forma sıfırlanır. Başka seçili kayıt korunur. Refresh başarısızlığı silme başarısını geri alınmış gibi göstermez; yeniden yükleme mesajı verilir. Yeni/düzenle/statü/delete/dil düğmeleri busy/translationBusy ile kilitlenir; çeviri cleanup'ı ana silme busy durumunu erken kapatamaz.
- Caddy tek DELETE matcher'ı `^/items/(blog_posts|practice_areas)/[1-9][0-9]*$` ile sınırlı. Backend native Directus auth/permissions uygulanır; bulk collection delete, CSV ID, site_pages/users/files ve diğer sistem DELETE yolları açılmadı. Anonim gerçek item DELETE 403 doğrulandı. Admin paneli yine Türkçe, kullanıcı hesabı erişimi değişmedi.
- `011-content-delete-cleanup.sql` polymorphic çevirileri ana kaydın DELETE transaction'ında temizler; parent varsa KEY SHARE koruması ile insert/update, yoksa 23503 reddi kurar. practice alias FK cascade mevcut altyapıyı kullanır. site_pages'in teknik silme yolları da DB seviyesinde öksüz çeviri bırakmaz; custom panelden sabit sayfa silme açılmaz. Mevcut çeviriler topluca purge edilmedi; Directus revision/activity/yedekler ayrı kalır. Compose ve manuel setup-languages sırasına eklendi.
- Çeviri endpoint'i her yazımı transaction'a alır ve child upsert'ten önce parent FOR UPDATE kilitler; görünürlük aynı transaction'da, dönüşte taze lockedParent'tan okunur. Silinmiş parent yarışı 404/güvenli mesaj olur. src/dist birebir eşit tutuldu, mock transaction testleri lock metoduna uyarlanır. Directus yeniden başlatıldı; mevcut secret/hesap/parola/TFA değiştirilmedi.
- Computer Use skill ve zorunlu guidance/confirmation belgeleri okundu; browser plugin tercih edildi. Cua getState iki kez Windows helper_unknown_error: setup refresh had errors / kernel exited verdi. UI auth/gerçek silme click'i yapılmadı; onay ekranının gerçek piksel/klavye QA'sı tamamlanmış gibi raporlanmaz. SSR/render, pure API/confirmation ve HTTP/DB testleri kullanıldı.
- 82 Node test geçti (7 yeni silme testi dahil). Kapsam: onay normalize/invalid target/no bulk, API fail propagation, görünür Sil/closed dialog/disabled confirm/XSS escape, double-submit/ESC/selected reset, dar proxy regex, yarış 404/source-dist eşitliği. İzole yeni schema transaction'ında 011 iki kez uygulandı; parent delete, TR/EN/DE ayrımı, aynı ID'li farklı koleksiyonları koruma, alias cascade, orphan INSERT/UPDATE reddi ve rollback atomikliği geçti. Test schema/functions rollback ile gider; gerçek CMS trigger/rows testte değiştirilmez.
- İlk migrasyon uygulama komutunda /migrations yalnız content-migrations container'ında bağlı olduğundan database container dosya bulamadı; hiçbir DDL uygulanmadı. Doğrulanan SQL stdin üzerinden database'e verilerek uygulandı. Test hesabı emailinde .invalid Directus doğrulamasına takıldı; reserved example.com kullanıldı. Geçici practice kaydı için zorunlu slug ve EN/DE gerçek rota dizinleri düzeltildi; hata denemelerinin kendi kayıtları finally ile temizlendi.
- Tam lintte mevcut legal-document ham root anchor uyarısı bulundu; mevcut NativeLink wrapper'a çevrildi, yine aynı native anchor/normal navigation davranışı kaldı. Yasal metin değişmedi. TypeScript ve tam lint sonra geçti; Docker frontend production build geçti ve yalnız frontend container yenilendi. Proxy reload ve backend restart yerelde yapıldı; volume silinmedi.
- Uçtan uca test yalnız yeni rastgele etiketli temporary admin/static token, tiny PNG, blog/alan, EN/DE çevirileri/rename alias oluşturur. Token/private credentials output edilmez. Gerçek native DELETE 204, public önce200/sonra404 (üç dil), sitemap çıkışı, old alias404, shared photo ilk silmede korunması/ikinci silmede DB/registry/original physical dosya temizliği geçti. Finally kendi test account/kayıtları kaldırıldı; mevcut yönetici sayısı ve gerçek blog/alan ID listeleri başlangıçla aynı.
- Access smoke users/roles/graphql/files/bulk/site_pages/anon DELETE kısıtları için geçti. Dil smoke bütün public rotalar/404/locale/sitemap; medya smoke iki gerçek upload/proxy/optimizer için geçti. Gerçek fotoğraf ve müşteri yazıları korunur. Kullanıcının üç untracked görseli Git dışında kalır. README ve üç Obsidian notu başlangıç eşitliğiyle güncellenir/eşitlenir; paket kaynak/test/notları Git'e alınır. Site taşıma yine sonraki aşamadır.

### Paket 49 — Hakkımda portresinde framework inline kırpma düzeltmesi

- Kullanıcı Hakkımda fotoğrafının kutuya sığmadığını gösterdi. Sayfa markup, public-design.css/globals.css cascade ve canlı HTML incelendi. CSS contain olsa da gerçek fill img style'ında object-fit:cover vardı. Yüklü Vinext image shim getFillStyle default cover ekler, sonra caller style'ı birleştirir. Önceki img-stub/PostCSS testleri bu framework davranışını kapsamıyordu.
- Yalnız Hakkımda Image'a `style={{objectFit:"contain"}}` eklendi. Fotoğraf dosyası, CMS path/alt, 4/5 frame, padding, caption akışı, görünürlük ve ana sayfa 3D portresi değişmez. Aynı sayfa üç dilde ortak olduğundan tüm diller etkilenir. Başka görsel alanlarının tasarımı topluca değiştirilmedi.
- about-image.test gerçek Vinext shim'i esbuild ile kullanır; img stub değil. Default PNG ve sahte uploaded site-media kaynağının gerçek SSR img inline contain, absolute fill/height100 ve kaynak korumasını test eder. Image=false frame/görseli kaldırmaya devam eder. İki yeni test ile toplam84 test geçti; Docker frontend build ve container yenileme tamamlandı.
- public-design-smoke gerçek stylesheet/public rotalar yanında TR /hakkimda, EN /en/about, DE /de/ueber-mich img tag'inde contain/cover yokluğunu kontrol eder; görsel gizliyse text-only koşulunu denetler. Canlı üç dil testi geçti. Bu HTML/renderer doğrulamasıdır; gerçek browser piksel QA yapılmış gibi raporlanmaz. Bu tur UI input veya image editing tool kullanılmadı.
- README ve üç Obsidian notu başlangıç SHA256 eşitliği kontrol edilerek güncellenir/eşitlenir. Sadece kaynak/test/notlar Git'e alınır, üç user untracked görsel korunur. DB/hesap/görsel dosyası, VPS veya domain/Cloudflare değişikliği yok; site taşıma sonraki aşamada.

### Paket 50 — Ana sayfadaki Hakkımda fotoğrafında aynı kırpma düzeltmesi

- Kullanıcı aynı sorunun ana sayfanın Hakkımda bölümünde de olduğunu belirtti. Canlı HTML'de about-section__image altındaki fill img inline object-fit:cover doğrulandı; 49. paketteki kök nedenin aynısı.
- Yalnız frontend/app/page.tsx about_image Image'a explicit style objectFit contain eklendi. Üstteki hero 3D portre, CSS kutu oranı/padding/alt yazı, admin image path/alt, fotoğraf asset'i veya visibility verisi değiştirilmedi. Diğer fotoğraf alanlarına geniş bir rewrite yapılmadı.
- about-image.test gerçek Home bileşenini ve gerçek Vinext image shim'ini render eder. Default ve upload about_image kaynaklarında contain/cover yokluğu/caption korunması; about_image=false için boş frame olmadan text-only/about metni korunması test edildi. İki ek testle toplam86 regresyon geçti.
- public-design-smoke üç dil ana sayfa HTML'sinde about-section fotoğrafının inline contain olduğunu kontrol eder; Hakkımda iç sayfası/diğer rotalar/404 kontrolleri de geçti. TypeScript ve ana sayfa lint geçti. Frontend Docker production build ve yalnız frontend container yenileme tamam. Bunlar renderer/HTTP kontrolleridir, gerçek piksel QA iddiası değildir.
- Üç Obsidian kopyası başlangıç hash eşitliği doğrulanarak güncellenir/eşitlenir. Paket yalnız kaynak/test/README/notları içerir; kullanıcı untracked görselleri korunur. DB/hesap/medya dosyası/VPS/DNS değişikliği yok. Site taşıma hâlâ sonraki aşamadır.

## 11 Ekim 2026

### Paket 62 — WhatsApp ülke kodu, geçersiz bağlantı koruması ve VPS yayını

- Kullanıcı yayındaki Gizlilik/KVKK taslak metinlerini kaldırma ve WhatsApp yurt dışı hatasını çözme istedi. Sites yönergesi mevcut Docker/VPS sitesinde uygulandı; KVKK Kurumu aydınlatma asgari unsurları ve WhatsApp Click to Chat'in tam uluslararası numara gereği resmî kaynaklardan okundu. Kullanıcı gerçek veri sorumlusu iş adresi/başvuru iletişim bilgilerini ayrıca vereceğini söyledi. Bu yüzden yasal metinler uydurulmadı, “taslak” işareti silinip tamamlanmış gibi yayımlanmadı; iki yasal rota/sitemap bu tur değişmedi. Bu, kullanıcının yasal metin isteğinin henüz tamamlanmadığı açık sınırdır.
- Salt-okunur canlı contact API incelemesi numaranın `0` ile başlayan kısa örnek değer olduğunu gösterdi; gerçek değer günlük/Git'e alınmadı. Önceki kod ham değeri `wa.me` sonuna yazdığı için uluslararası bağlantı oluşturamıyordu. Hata, WhatsApp hesabının gerçekten kayıtlı olup olmadığını kanıtlamaz; gerçek numara da site sahibinden bekleniyor.
- `frontend/app/lib/contact.ts` içine `normalizeWhatsAppNumber`/`whatsAppHref` eklendi: Türkiye yerel 10/11 hane `90...`, `+`/`00` ile ülke kodlu numara rakam biçimi, geçersiz/kısa değer `null`. Ana sayfa ve üç dil iletişim sayfası geçersiz WhatsApp linkini göstermiyor. `/bakir` iletişim formu giriş biçimini açıklıyor, kayıt öncesi gerçek ülke kodlu tam numara doğruluyor; boş değer mümkün. Bu kontrol hatalı biçimi engeller, üçüncü taraf WhatsApp kayıtlılığını veya mesaj teslimini garantilemez.
- 3 yeni WhatsApp birim/kaynak testi dahil 112/112 regresyon ve TypeScript geçti. Yerel Docker frontend yeniden build/healthy; yerel CMS'deki geçerli ülke kodlu fixture'la ana/iletişim ve EN/DE sayfalarının doğru bağlantıyı ürettiği, numarayı terminale basmadan doğrulandı. Ayrı VPS üretim imajı `vps-20261011-whatsapp1` linux/amd64 ve yaklaşık101MB; kaynak tar SHA256 `d5d590a96137283ab512c1c18ec1258eaef1eeda84bbc375bf5433a54aa37e21`, imaj tar SHA256 `58cb6575bd5655583197306fc3a2969b6a80541a03ae132b8b4d614ccd4aa805` eşleşti. Bir ilk PowerShell uzaktan-hash komutunda `$()` yerel yorumlanınca guard başarısız oldu; herhangi bir VPS mutasyonu oluşmadı, görünen uzaktan hash'ler ayrı karşılaştırıldı.
- VPS başlangıçta DB/Directus/frontend healthy, yedek timer active, backup inactive/result success ve recovery marker temizdi. Yeni imaj yüklenip yalnız loopback3001/private ağ preflight'ta dört sayfa200/kırık link yok test edildi. Root700 `/var/backups/furkantoplu/whatsapp-20261011-01` altında eski `.env` ve dört kaynak dosya 600 izinli korundu. Yalnız bu dosyalar ve `.env` içindeki FRONTEND_IMAGE satırı güncellendi; iki HTTPS Compose dosyasıyla yalnız frontend healthy olacak şekilde recreate. Veritabanı, CMS, Caddy, admin hesap/TFA, Cloudflare/DNS, upload ve yedek görevi değiştirilmedi.
- Canlı domain dört ana/iletişim dil görünümü ve yasal sayfalar200, geçersiz `wa.me` yok; languages/deployment smoke geçti. Eski Docker imajı ve root geri dönüş paketi kaldı; geçici preflight container, kendi staging tar'ları ve yalnız bu release'e ait yerel geçici tar'lar kaldırıldı (yüklü imaj/Git kaynak korunur). Son kabul: yönetici `/bakir` → Sayfa içerikleri → İletişim'de gerçekten WhatsApp'a kayıtlı numarayı ülke koduyla girmeli; ziyaretçi cihazından hedef hesap açılışı denenmeli. Yasal metin ve gerçek iletişim bilgileri sonraki ayrı paket.

### Paket 61 — Google arama hazırlığı: canlı teknik SEO kontrolü

- Kullanıcının küçük adımlarla devam isteği üzerine mevcut Docker/VPS sitesi için Sites kaynak yönergesi okundu; yeni hosting/Sites projesi açılmadı. Google Search Central'ın sitemap, çok dilli alternatifler, Search Console alan adı doğrulaması ve sitemap gönderimi için güncel resmî belgeleri karşılaştırıldı. Bu paket salt-okunur denetim ve dokümantasyondur; üretim kodu, DNS, Cloudflare, Google hesabı, veritabanı ve VPS ayarı değiştirilmedi.
- 11 Ekim canlı `https://furkantoplu.com/robots.txt` HTTP 200: public tarama açık, `/bakir` ve `/bakir-api/` dışlanmış, HTTPS sitemap adresi doğru. `/sitemap.xml` HTTP 200/application/xml; 37 benzersiz mutlak HTTPS URL içeriyor. XML'deki hreflang hedeflerinin tamamı sitemap içinde; yönetim, localhost, www, medya ve query URL'si yok. Üç ana dil sayfası ile üç blog liste sayfası HTTP 200, self canonical, doğru HTML lang ve TR/EN/DE alternatifleri gösteriyor. `/bakir` noindex/nofollow/noarchive.
- Canlı `languages-smoke`, `practice-catalogue-smoke` ve `vps-deployment-smoke` komutları geçti: 16 temel rota, 18 yayınlanmış alan detayı, 404/401/400 sınırları, canonical/hreflang/sitemap/robots, özel port ve imaj/secret kontrolleri. Bu Google'ın gerçekten indekslediği veya Search Console'un kurulduğu anlamına gelmez; Google hesabı/paneline giriş yapılmadı.
- Yayın engeli bulundu: `/gizlilik` ve `/kvkk-aydinlatma-metni` hâlâ HTTP 200 ve sitemap içinde, fakat canlı metinlerinde “taslak”, “yayın öncesinde” ve veri sorumlusu/işleme envanteri kesinleşince doldurulacak alanlar var. Bu iki yasal sayfada self canonical etiketi de yok. Yasal metni uydurmak veya taslakları sırf SEO için yeterli ilan etmek doğru değil. Site sahibi gerçek veri sorumlusu/iletişim/altyapı ve hukuk kontrolüyle metinleri onaylamadan Search Console'a sitemap gönderilmemeli; indeks durumuna dair garanti verilmez. Mevcut canlı erişim ve sitemap bu tur değiştirilmedi, risk kullanıcıya açıkça bildirilecek.
- Sonraki küçük iş: sahibin seçtiği Google hesabıyla Search Console'da `furkantoplu.com` Domain property açılması; Google'ın verdiği benzersiz DNS TXT değeri, yetkili DNS olan Cloudflare'de kök `@` kaydına eklenip doğrulanması. Doğrulama kaydı Git/Obsidian'a yazılmayacak. Yasal metinler onaylanınca sitemap gönderimi ve URL Inspection ayrı kontrol edilir. Ayrı yerde yedek, gerçek sahip Authenticator kabulü ve iletişim verilerinin son kontrolü beklemede.

### Paket 60 — Yönetici Authenticator zorunluluğu ve canlı doğrulama

- Kullanıcı ayrı yerde yedek tercihini site sahibinin yanında olacağı zamana bıraktı; mevcut VPS günlük yedek timer'ı sürüyor. Kabul edilen küçük paket sırasından yalnız yönetici TOTP zorunluluğu seçildi; Google/SEO veya bağımlılık yenilemesi yapılmadı. `codex-security:fix-finding` ve mevcut VPS sitesi için Sites yönergeleri okundu. Bir sınır araştırması ve bir bağımsız aday incelemesi başlatıldı; ikinci inceleme kısmen sonuç verdi, aracı daha sonra durdu. Cache/alias/WS notları kaynakla ayrıca doğrulandı.
- İlk envanterde production iki aktif yönetici ve ikisinde TFA vardı; statik token yoktu. Native `enforce_tfa` bayrağı kapalıydı. Yeni yönetici oluşturma eklentisi aktif hesap açıyordu. Directus `12.4.0` native kimlik kodunda politika bayrağının yalnız giriş ipucu olduğu; auth controller'ın yeni accountability ürettiği, WebSocket upgrade'in HTTP middleware'inden ayrıldığı ve response cache'in hook'tan önce dönebildiği incelendi.
- Ortak sunucu hook'u `admin-tfa`, aktif admin isteğinde native kimlikten sonra TFA sürüm kanıtı arar. Şifreli ilk oturumda yalnız öz hesap ve kendi TFA üretme/etkinleştirme ile giriş/çıkış yolları geçer. Sürüm JWT'ye yalnız önceden TFA kurulu hesaba kodlu login kanıtından sonra yazılır; AsyncLocalStorage aynı request'teki native auth controller'ların accountability değişimini güvenle bağlar. Eski/parola-only JWT, eski cookie ve setup öncesi statik token içerik yetkisi kazanmaz. Kurulu statik otomasyon akışı korunur.
- `012-admin-tfa-enforcement.sql` kullanıcıya random UUID TFA sürümü ekler, TFA değişiminde sürümü döndürür ve o hesabın session/static token'ını iptal eder; admin politikalarında native enforce_tfa true olur. Kaynak ve runtime `src/dist` eşittir. `admin-account` yalnız `is_admin`/`tfa_session_verified` boolean döndürür; sır dönmez. Frontend önce öz hesabı yükler, pending hesapta sidebar/content/team sorgularını yapmaz; QR/manuel akış gerçek password formundadır. Etkinleştirme sonrası kodla yeni giriş istenir.
- Kullanılmayan cache ve WebSocket hem yerel hem VPS Compose'ta explicit false yapıldı. Caddy API allowlist korunur. Yerel gerçek DB'ye 012 migrasyonu uygulanıp Directus yeni eklentiyle başlatıldı; mevcut gerçek hesapların TFA/parolası değişmedi. Test yerel kullanıcı sınırını aşmamak için ayrı Docker projesi, tmpfs PostgreSQL, iç ağ, port/yeni volume olmadan izole edildi; yalnız kopya DB'nin hesapları temizlendi, kaynak DB/hesaplar korunur.
- İzole test önce gerçek eski davranışı yeniden üretti: parola-only yeni yönetici özel içerik okuyabiliyordu. Aynı kopyada 012/hook sonrası yeni yönetici kurulum öncesi native/custom/items/files/ekip yollarını kullanamadı; hatalı OTP, kurulum sonrası eski JWT/cookie/static/refresh, kodsuz giriş reddedildi. Kodlu giriş, oturum yenileme, ikinci yönetici, yalnız kendi profil ayarı ve TFA kurulu geçerli otomasyon geçti. İzole proje konteyner/ağı temizlendi. 109 regresyon testi ve TypeScript/lint geçti; yeni production Node frontend imajı `fizyoterapist-frontend:vps-20261010-tfa1` derlendi.
- Dağıtım öncesi günlük backup servisiyle `20261010T205349Z` yeni snapshot başarıyla alındı. Kaynak+imaj arşivleri kendi staging alanına aktarıldı; SHA256 eşleşti. Root-only rollback `.env`/Compose/eski website-content source/dist kopyaları tutuldu. Backup flock altında 012 canlı migrasyonu, Directus ve frontend imaj güncellemesi uygulandı; volume, gerçek medya, DNS, TLS ve Cloudflare ayarı değiştirilmedi.
- İlk canlı test bilinçli engel yakaladı: yeni eklenti dizinleri root umask yüzünden `700` oluşmuş, Directus yükleme listesinde görünmemiş ve geçici yeni yönetici içerik okuyabilmişti. Test hesabı temizlendi; mevcut hesap/blog kimlikleri aynıydı. Yalnız yeni üç dizin `755` yapılıp Directus yeniden başlatıldı, logda `directus-extension-admin-tfa` yüklendi; rollout betiği de kalıcı olarak düzeltildi. Aynı canlı test tekrarında pending içerik/ekip reddi, QR/TOTP kurulum, eski oturum ve kodsuz giriş reddi, yeni OTP'li erişim geçti; tek geçici hesap silindi ve gerçek hesap/blog kimlikleri değişmedi.
- Yerel Docker Directus, cache/WebSocket false ve yeni hook ile yeniden oluşturuldu; yerel frontend kaynak koddan üretim benzeri Docker build alıp healthy oldu. Yerel anonim API sınırları tekrar geçti. Son tam regresyon 109/109; rollout betiği yeni extension dizinlerini 755 yapmayı testle sabitliyor. VPS'te yeni imaj/Directus healthy, eklenti yüklü ve günlük yedek timer'ı aktif.
- Cloudflare HTTPS/www yönlendirme, public üç dil/temel sayfalar/404 ve anonim yönetim API erişim smoke geçti. Gerçek yönetici OTP sırları kullanılmadı; site sahibinin kendi telefonuyla görsel/kullanım kabulü hâlâ gerekli. Off-server yedek tercihi bekliyor, günlük yedek aktif. Google Search Console/SEO sonraki pakettir. Ayrıntılı işletim ve sınırlar `deploy/ADMIN-TFA.md` içindedir.
- Kaynak/test/işletim notları `9f05093` commit'iyle kullanıcı tarafından daha önce izin verilen GitHub `main` dalına gönderildi. Geçici yerel `tfa-20261010` arşiv klasörü ve VPS `/home/ubuntu/tfa-rollout-20261010` klasörü, tam hedef/doğrulama sonrası kaldırıldı. Üç kullanıcıya ait untracked görsel, üretim Docker imajı, günlük yedek ve root erişimli rollback kopyası korundu.

## 10 Ekim 2026


### Paket59 — Küçük adım: gerçek yedek için izole restore kanıtı

- Kullanıcı devam dedi; önceki handoff'taki sıradaki küçük iş DB/medya restore seçildi. Sites skill tam okundu ve mevcut Docker/VPS hedefi korundu; yeni hosted Site veya frontend değişikliği yapılmadı. Git tracked temiz/user3untracked görseller korunur. Başlangıç3 harici Obsidian notu HEAD baseline'a birebir eşitti.
- VPS read-only başlangıç:3 uygulama servisi healthy/proxyrunning, günlük backup Resultsuccess/inactive, seçili snapshot root700,30GB disk/2.7GiB kullanılabilir RAM. PGimageID actualcurrent salt-okunur alınır; gerçek .env/SSHprivatekey/adminpassword/TOTP okunup gösterilmez. Primary pg_restore/Docker none/tmpfs belgeleri okundu; tmpfs'nin swap'a gidebileceği için adli güvenli silme iddiası yok.
- `restore-check.sh` yalnız root ve tarihregex/.complete/canonical privatebackup kabul eder. Backupflock ortak kullanılır; retention çakışmasını engeller, Directus-stoppedmarker varsa ret. Canlı Compose yalnız ps/databaseimageinspect için; hiçbir productionSQLwrite/up/stop/restart yok. Yeni randomlabel/containerID ve boştestDBguard, noowner/noacl/exitonerror/singletransaction ile actual pg_restore. Kaynak foto/DB/ayarlar başka makineye aktarılmadı.
- Test PG ayrı rol/DBrestore_check; ağnone, portsiz,768MiB/no-container-swap/0.75CPU/pids100, read-onlyrootfs ve384MiBPGDATA/16MiBrun/tmp tmpfs. Yalnız kendi root/run tek seferlik passwordFILE read-only bind; production network/DB/uploadvolume yok. Pythonhelper verify de network/ports/read-only/label/mountkontrol eder. Makine minimum1.5GiB RAMguard; uploads extraction512MiB/100000file sınırı. Gelecek büyük yedek bu QA kapasitesine otomatik sığmış sayılmaz.
- `restore-check-data.py` beklenenCOPY publictable/columnheader'larını sıkı identifier regex ile okur; satır SHA256 digestleri multiset sıralanıp aggregatehash ve count üretir. Password/hash/TOTP dahil actualrowlar stdout/nota çıkmaz; root/run privateinventory içinde yalnız kolon/count/digest bulunur. RestoreDB'nin tableSeti ve herCOPYaynıkolon/timestampUTC/floatdigits3 output'u expectedile karşılaştırılır. Satır sırası değişse de duplicatecount korunur; sadece14 eski migrationtablosu değil40publictablonun tamamı kapsandı. Sequence/constraint/trigger/schema geri yüklemesi pg_restore'un atomik başarı koşuluna dahildir, ayrıca frontend/nativeauth test sayılmaz.
- Foto tar kaynakpath traversal/absolute/backslash/symlink/hardlink/device ve duplicateoverwrite retleriyle yalnız boşözel klasöre çıkarılır; dizin700/file600, archivebytehash ve yeniden okunan bytehash/stat eşitliği. Ardından restoreDB directus_files localfilename/boyut kayıtlarıyla fizikselfile eşleşir; dışstorage bilinmezse fail, sessizskip yok. Hakiki mevcut photo kopyası yalnız aynı VPS private çalışma dizininde oldu.
-6 unit/regression senaryosu:escapedCOPY/quotedcolumns/empty/multisetduplicate/order; malformed/truncated/wrongschema/duplicatetable; image-byte roundtrip/emptytarget; path/link/deviceguards; filename/storage/filesize mismatch; runner explicit SQLoutput/networknone/emptyDB/transaction contract. Public3kaynak SCP, hash matching ve bash-n geçti; helperroot0644/entryroot0755 kurulup invalidarg ret test edildi. Pythonfixture own TemporaryDirectory temizler; uygulama kayıtları oluşturulmaz.
- İlk iki isolateddeneme p59/p59b actualDBrestorebaşarılı (private restore.log0bayt) ama expectedCOPYinventoryüretimi pg_restore --data-only için --file=- verilmediğinden usageerror70baytla durdu. Önce genericprivacyerror detaykapatıyordu; fixedCheckError/type-name-only diagnostic eklendi, sonra özel logdan yalnız sabit bilinenmessage grep sonucu teyit edildi. Özel SQL/data satırları logdan gösterilmedi. Explicitfile=- düzeltmesi/regresyon eklendi; başarısız denemeler backupbozukluğu diye sayılmaz, kendi fixture'ları trapile temizlendi.
- Nihai systemdtransient p59c, check20261010T194809Z-12173b09; backup20261010T153341Z.19.48.08UTC/22.48.08Türkiye start,19.48.14inventoryparsed,19.48.19complete.40publictable count/hash eşit,1upload61993bayt/1DBfilemetadata eşit.11.3s toplam,3.34sCPU; actualnativeSQLrestore andphotoextractpassed. TimeoutStart600/Stop60, --no-block SSH'den bağımsız; kalıcı restoretimer yok.
- Başarılı cleanupsonrası docker labelps-a ve /runprefixfind boş; kendi container/data/password/inventory/çıkarılanupload kaldırıldı. Rootrestore-report/loglar kalır, gerçek snapshot/manualbackups/livevolumes korunur. AniSIGKILL/hostcrash için otomatikcleanup garantisi yok; docsleftoverkontrol açık. Sadece kendi iki failedtransientunit reset edilir; geçmişprivate/journalreportkorunur.
- Canlı DB/Directus/frontendhealthy/proxyrunning veHTTPS200 teyit; backup timer/7retention/env/image fit2/DNS/Cloudflare/auth değişmez. README/ops/Yedekleme ve3Obsidian güncellenir, aynıbaselineguard/hash ileeşitlenir; yalnız kaynak/genelnotlarGit'e alınır. Kapanmamış özel güvenlikraporu/backup/realenvGitdışında. Bu seçili DB/medya yedeğinin gerçekrestorekanıtıdır; başka sunucuda tüm site/TLS/adminGoogleAuth acceptance, ayrı yerde şifreli kopya ve failurealert sonrakiişlerdir.

### Paket 58 — Küçük adım: düzenli yerel VPS yedekleme

- Kullanıcı backup→güvenlik→SEO→Google sırasını kabul etti, bütün işleri aynı anda yapmamamızı istedi. Yalnız backup başlangıcı seçildi; mevcut Sites yönergeleri okunup kullanıcının mevcut Docker/VPS hedefi korundu. Yeni hosted Site oluşturulmadı. Başlangıç Git tracked temiz, üç user untracked görsel korunur. Üç harici Obsidian notu Git HEAD baseline ile birebir karşılaştırıldı; eşleşti.
- Salt-okunur VPS envanterinde38GB disk/30GB boş alan, mevcut manual backup106MB ve19 sistem timer vardı; uygulama yedek timer'ı yoktu. Yedekleri veya canlı kayıtları okumadan/silmeden yalnız metadata kontrol edildi. PostgreSQL16 resmi pg_dump dokümanı okundu; custom dump ve pg_restore arşiv incelemesi seçildi. systemd takvimi VPS üzerinde doğrulandı.
- `deploy/vps/backup-daily.sh`, recovery/retention helper'ları, iki bash fixture testi ve systemd service/timer eklendi. Root/umask077/700 klasörler; iki HTTPS Compose birlikte kullanılır. Başlangıç sağlıklı servis, tam containerID, gerçek uploads volume bağı ve disk payı kontrolü var. İmaj/config servis açıkken paketlenir, sonra yalnız Directus durdurularak DB/medya kopyası alınır; PostgreSQL/Frontend/Caddy durmaz. Manuel deploy/doğrudan veri yazımı bu pencereyle çakışmamalıdır.
- Çalışan frontend imajı, DB dump, uploads tar, `.env`/ikiCompose/deploy/extensions runtime tar ve imaj kimlik manifest'i tutulur. PostgreSQL/Directus/Caddy binary imajları, TLS/SSH özel anahtarları, tüm host veya dış hizmetler kapsamda değildir. Gerçek secrets/hesap hash/TOTP notlara/loga/Git'e yazılmadı, özel yedek sunucudan indirilmedi. Arşiv pg_restore --list/tar veSHA256 geçmeden complete olmaz; partial→dated rename atomik.
- Retention yalnız tarih regex'i/.complete araç marker'ı/gerekli dosyaları tam olan doğrudan canonical alt klasörlerde son7 başarılı çalışmayı korur; manual/partial/symlink/başka araç çıktısına dokunmaz. Fixture9→7, idempotency, eksik/malicious symlink ve invalidkeep testleri geçti; yalnız kendi mktemp fixture'ları kaldırıldı. Bu, kesin7 takvim günü veya geçmiş görüntülerin anında güvenli imhası değildir.
- Recovery yalnız kendi marker'ındaki aynı container'ı başlatıp healthy bekler; değişmiş container/invalidmarker/startfail/healthtimeout reddi test edildi, marker başarısızlıkta kalır. EXIT/TERM/INT trap ve systemd ExecStopPost koruması var. Son incelemede fallback recovery'nin başka manuel aktif yedeğe müdahale riskine karşı aynı flock kilidi eklendi; gerçek kilit tutulurken --recover reddi ve boşstate başarılı dönüş test edildi. Arıza yolları mocktur; canlıya bilinçli hata uygulanmadı.
- Gizli veri içermeyen7 kaynak/test/unit dosyası ayrı SSH stage dizinine gönderildi, local/remote SHA256 eşleşti; bash -n ve iki fixture script geçti. Root-owned /usr/local/sbin ve /usr/local/lib/furkantoplu kuruldu; unit verify/daemonreload yapıldı. systemd-analyze verify mevcut Ubuntu XFS unit'lerinde removed CPUAccounting uyarısı verdi; yeni unit hatası yok. Yeni hesap/token/DB kaydı oluşturulmadı.
- İlk gerçek backup aynı unit ile manuel alındı: `20261010T153341Z`,100927055bayt (~96.3MiB).15.33.40UTC start,15.33.47 içerik stop,15.34.11 recoveredhealthy,15.34.13 success;32.7s toplam, yaklaşık24s stop→healthy. ExecMainStatus0/Resultsuccess. Root700 daily/timestamp dizini ve DB/runtime600 doğrulandı; manifest yeniden kontrolde geçti. Bu liste/arşiv kontrolüdür, gerçek restore kanıtı değildir.
- Son helper kilidi kurulup kaynaklar `/opt/furkantoplu/deploy/vps` içine kopyalandı. Timer enable --now, sonraki11Ekim01.15UTC/04.15Türkiye takvimi teyit edildi. Otomatik gece tetikleme henüz gözlenmedi; Persistenttrue kaçırılmış işi açılışta çalıştırabilir. DB/Directus/frontend healthy, proxy running, HTTPS200, marker yok, disk30GB boş. Mevcut frontend fit2/config/port/cookie/DNS korunur; restart yalnız yedek sırasında Directus içindi.
- `deploy/YEDEKLEME.md` kapsam/sır hassasiyeti/komutlar/retention/disk/partial/restore sınırlarını anlatır. Başarısız backup dış bildirimi henüz yok; unit/journal kontrolü vardır. İlk paket yalnız aynı VPS'te kopyadır; sunucu/disk kaybına karşı ayrı yerde şifreli kopya, izole restore ve bildirimi sonraki küçük paketlere bırakıldı. Kapanmamış özel güvenlik raporu public repo dışında kalır. README/ops ve üç Obsidian mirror güncellenir; eşitlik/hash doğrulanır.

### Paket 51 — Üç dilli anlaşılır hizmet kataloğu ve portre sahnesi

- Kullanıcı bütün eski çalışma alanlarını silip yeni alanlar istedi; yapay zekâ ekran görselindeki bilimsel başlıklar yerine halkın anlayacağı profesyonel isimler, EN/DE ve fotoğrafsız içerik talep etti. Hero çevresinin fazla boş olduğunu, eskiye benzer detay istediğini söyledi. Kaynak ekran genel klinik liste olduğu için hizmet/yetkinlik kanıtı sayılmadı; async soru ile altı hizmetin tamamı teyit edildi, kullanıcı yayına hazır hazırlanmasını istedi. İlk baştaki taslak varsayımı bu açık teyitle yayın olarak değiştirildi.
- Yerel public API ve gerçek DB sayımı 0 çalışma alanı doğruladı. Eski bootstrap/demo seed çalıştırılmadı; kullanıcı silmeleri korunur. Genel kapsam doğruluğu için NHS fizyoterapi primary kaynağı okundu; kaynak Fzt. Furkan'ın uzmanlık belgesi olarak kullanılmadı. Orijinal metinlerde cihaz/özel teknik, diploma, ev ziyareti, sonuç/süre garantisi veya hasta yorumu eklenmedi. Hekim/sağlık ekibi sınırları ilgili doğal açıklamalarda korunur, emekli genel-disclaimer UI'sı geri gelmez.
- scripts/content/practice-catalogue.mjs altı başlık ve 18 yerelleştirilmiş metin kümesi içerir. Her birinde summary/lead/overview, üç değerlendirme maddesi, üç süreç adımı, iki SSS/SEO var. Klinik terim yalnız kaynak eşleme notunda, public ana başlıklar anlaşılır. Aynı fotoğraf asset'lerini tekrar kullanma veya yeni fotoğraf üretme/yükleme yok; tüm image_path/image_alt null.
- Manuel import script Docker içindeki native ItemsService/null sistem hesabı ve mevcut schema ile parent kayıtları oluşturur; çeviriler aynı DB transaction'ında native title slug/parent guard trigger'larıyla yazılır. PG advisory lock, boş koleksiyon kontrolü ve website_content_imports marker'ı tek seferlik/mükerrer/yanlışlıkla overwrite engelidir. Startup/migration scriptine bağlanmaz; silinenleri tekrar doğurmaz. Marker küçük operasyon geçmişidir, aktif içerik veya medya artığı değildir.
- Kullanıcının teyidiyle gerçek yerel CMS'ye altı published parent ID18–23 ve EN/DE published12 çeviri eklendi; show_on_homepage true, sort1–6. Başlıklar: Kas ve Eklem Ağrıları; Sinir Sistemi ve Hareket; Nefes ve Dayanıklılık; Çocuklarda Hareket ve Gelişim; Spor Yaralanmaları ve Spora Dönüş; İleri Yaşta Denge ve Hareket. İkinci script çalıştırması already-applied verdi; kopya veya yeni içerik yaratmadı. CMS admin sonraki edit/hide/delete kontrolünü korur.
- Ana sayfa practice-grid--six yalnız altı kayıt için 3 kolon/iki satır kullanır, max860 iki kolon, max560 tek kolon. Eşit satır ve footer hizası değişmez. Diğer kayıt sayılarının mevcut dizilimi korunur. Yeni metinler kadar gerçek listede görselsiz kart/detay kuralları da test edildi.
- Hero visual ::before tek CSS mat adaçayı kemer, ince kenar/kontur ekler. z0 ve pointer-events none, mobil sınırları/margini uygundur; heroCharacter mevcut desktop120/mobil0, normal akış/isolation/hover/reduced-motion ve alt fade korunur. Dekor location satırının üstünde biter, metin/yüzen kart/parıltı/orbit/remote font veya ekstra raster yok. DESIGN.md müşterinin yeni isteğine göre dar istisnayı kaydeder. Diğer sayfa görselleri, ana karakter dosyası, admin veya CMS sayfa metinleri değişmez.
- 89 Node test geçti (katalog tamamlık/photo null/yayın/sort/slug unique, atomik bir defalık import ve responsive kemer/grid testleri dahil). TypeScript/lint ve Docker frontend production build geçti; yalnız frontend container yenilendi. Katalog smoke üç dilde6 liste ve18 detay200, doğru H1, text-only/no image, sitemap/language linkleri; public-design smoke gerçek CSS kemeri, portre contain, genel public/404; dil smoke bütün rotalar için geçti.
- Gerçek browser pixel kontrolü yapılmış gibi raporlanmadı; HTML/renderer/CSS sözleşmeleri doğrulandı. docs/calisma-alanlari-icerik.md klinik→TR/EN/DE tablo ve editoryal/işletim notudur. README ve üç Obsidian notu eşitlik guard/hash ile güncellenir. Yalnız paket kod/test/notları Git'e alınır; üç user untracked görsel korunur. VPS/Cloudflare/domain işlemi yok, gerçek yayın öncesi fizyoterapist içerik/çeviri gözden geçirmesi önerilir.
