# Fizyoterapist Web Sitesi — Proje Genel Bakış ve Mimari

## İzole geri yükleme doğrulaması — 10 Ekim2026 / Paket59

Kullanıcı devam isteğiyle yalnız sıradaki küçük restore testi yapıldı. İlk günlük yedek ayrı PostgreSQL16 instance'ında ağnone/read-only/tmpfs/no-publicport ile gerçekten geri yüklendi.40 public tablonun arşiv→geri yüklenen COPY satır sayımı ve SHA256 multiset parmak izi eşit;1 fotoğraf61993bayt ayrı private klasörde çıkarılıp hash/boyut/DBkaydı doğrulandı. İlk doğrulama aracının explicit pg_restore --file=- eksiği giderilip6 regresyon ve gerçek tam karşılaştırma geçti.

Geçici container/tmpfsDB/özel test parolası/inventory/fotoğraf kopyası temizlendi; canlı DB/hesap/servisler değiştirilmedi, HTTPS200. DB/medya restore kanıtıdır; tüm webuygulaması/adminlogin/başka sunucuda HTTPS test edilmedi. Günlük backup timer/son7 arşiv aynı; ayrı yerde şifreli kopya ve hata bildirimi henüz yok. Ayrıntı `deploy/YEDEKLEME.md`, özel özet/log root altında. Güvenlik/SEO/Google değişiklikleri bu pakete eklenmedi.

## Günlük VPS yedeği — 10 Ekim 2026 / Paket 58

Kullanıcı önerilen sırayı kabul edip küçük adımlarla başlamamızı istedi. Yalnız ilk yerel VPS yedekleme paketi uygulandı; güvenlik/dependency/SEO/Search Console değişiklikleri yapılmadı. Türkiye04.15 günlük systemd timer, son7 başarılı arşiv; PostgreSQL custom dump, uploads, özel runtime config/extensions ve çalışan frontend imajı `/var/backups/furkantoplu/daily` altında root erişimiyle tutulur. İmaj önce hazırlanır, DB/uploads tutarlılığı için Directus kısa süre durur; hata/sonlandırma kurtarması ve çakışma kilidi vardır.

İlk gerçek yedek100927055bayt, arşiv/SHA256 kontrolleri başarılı; DB/Directus/frontend healthy, publicHTTPS200. Mevcut kullanıcı/şifre/TOTP/içerik/fotoğraflar değiştirilmedi, önceki manual yedekler korunur. Yedek aynı VPS'tedir ve henüz gerçek restore testi yapılmamıştır; ayrı yerde şifreli kopya/izole restore/hata bildirimi sonraki küçük işlerdir. Ayrıntılı işletim belgesi `deploy/YEDEKLEME.md`; günlük Paket58 kaydı test ve kurulum ayrımlarını içerir.

## Güvenlik ve Google yayın değerlendirmesi — 10 Ekim 2026 / Paket 57

Kullanıcının ilgili güvenlik kontrolleri ve Google hazırlığı raporu isteği salt-okunur incelendi. Uygulama/deploy/DB/hesap/Cloudflare/DNS/Search Console ayarları değiştirilmedi. Native Security başlangıç cevabı alınamadığından tamamlanmış otomatik scan iddiası yok; kapsamı sınırlı manuel kaynak ve canlı metadata/politika/HTTP kontrolü yapıldı.

Kapanmamış güvenlik değerlendirmesi public GitHub'a gönderilmez. Ayrıntılı proje raporu yalnız Git ignored `backups/reports/2026-10-10-guvenlik-google-kontrolu.md` ve Obsidian'daki `03 - Güvenlik ve Google Yayın Kontrolü - 2026-10-10.md` içinde tutulur. Bu rapor formal Codex Security canonical report değildir. Mevcut site fit2 olarak çalışır; iyileştirme paketleri ayrı kullanıcı onayıyla uygulanır.

## Güncel fotoğraf yerleşimi — 10 Ekim 2026 / Paket 56

Kullanıcı fotoğrafların tamamının kırpılmadan gösterilmesini onayladı. SiteImage default inline contain/center uygular; Vinext fill'in inline cover varsayılanı artık blog/managed page fotoğraflarını kesmez. Hero özel bottom hizası, admin/private preview, mevcut visibility ve medya temizliği korunur. Nötr fotoğraf çerçeveleri ve ortak240px blog kart kutusu,1100px maksimum detay genişliği ve ayrı caption; telefon kapak yüksekliği300–440px.

Sonra gelen public-design tema override'ları da uyumlandı: width100%/aspect-ratio:auto ve gerçek240px. Desktop1440, telefon390/360 browser kontrolünde fotoğraf tam görünür, yatay taşma yok, seçili error/warn boş. Çalışma alanlarında canlı fotoğraf yok; gerçek bileşen/CSS/JPEG ile salt-okunur localhost9123 fixture kart/detay kontrolü yapıldı, production kayıtlarına dokunulmadı. Fixture/server/tablar test sonrası kapatılır ve viewport reset edilir.

Canlı imaj `vps-20261010-fit2`, kaynak0b920d5, runtime node;100 test/TypeScript başarılı. Sadece frontend güncellendi, DB/Directus/Caddy/hesap/TOTP/sessions/fotoğraflar değişmedi. Eski imajlar ve root700 photo-fit01/02 config/source yedeği korunur; kaynak/imaj checksum geçti. Yerel frontend aynı düzeltmeyle rebuild. Docker/CloudflareFullstrict/ikiCompose aynı; gerçek yeni upload/delete ve periyodik/off-server backup hâlâ ayrı işlerdir. Önceki bölümler tarihsel aşamaları kaydeder.

## Güncel medya düzeltmesi — 10 Ekim 2026 / Paket 55

Kullanıcı uygulamayı onayladı; CMS fotoğraf 400 sorunu canlı VPS'te giderildi. Ortak SiteImage exact `/site-media/<UUID>` kaynaklarını mevcut güvenli medya route'undan doğrudan gösterir; statik portre optimizasyonu, contain/fill/priority/lazy ve tüm bölüm görünürlükleri korunur. Ana sayfa/about/blog/practice yüzeylerinin tamamı bu bileşeni kullanır; admin private preview/QR, Directus erişim kontrolü ve medya temizliği aynı kalır.

Kod `b9b41cc`, Node imaj `vps-20261010-media1`, node runtime. İki dosyalı HTTPS Compose ile yalnız frontend recreate; DB/Directus/Caddy/upload/hesap/TOTP/oturumlar değiştirilmedi. Gerçek JPEG yeni imajın private loopback preflight'ında, sonra domain ana sayfa/blog/detay HTML'inde ve browser complete=true/862×1320 ile doğrulandı; seçili JavaScript error/warn yok. Preflight container geçicidir ve test sonrası kaldırılır; eski imaj ve root700 config/source geri dönüş yedeği tutulur.

98 regresyon/TypeScript ve gerçek HTTPS smoke'ları geçti. Local frontend de rebuild edildi; ayrı DB korunur. Node'un statik-only optimizer endpoint'i hâlâ dinamik kaynağa400 verebilir, ancak public bileşen artık bu isteği üretmez; eski açık sekme yenilenmelidir. CMS görselleri orijinal baytlarıyla gelir, resize pipeline kurulmadı. Gerçek admin yeni upload/delete kabulü ve periyodik/off-server backup hâlâ ayrı işlerdir. Aşağıdaki teşhis bölümü düzeltme öncesinin tarihsel kaydıdır.

## Teşhis geçmişi — 10 Ekim 2026: VPS'te yüklenen görselin Image isteği 400

Kullanıcının canlı panelden yükleyip bloga bağladığı JPEG, Directus public media ve frontend `/site-media/<UUID>` yollarında 200 / image/jpeg olarak geliyor; baytlar eşit. Ancak `/_next/image?url=%2Fsite-media%2F<UUID>&w=640&q=75` 400, gövde `The requested resource is not an allowed image type`. Aynı hata Node container'ın localhost3000 isteğinde de var; Cloudflare/DNS/TLS kaynaklı değil.

Gerçek çalışan Vinext 1.0.0-beta.5 Node standalone `prod-server.js`, App Router optimizer dalında URL uzantısından `contentTypeForPath` kullanıyor, ardından yalnız build statik dosyalarını `tryServeStatic` ile okuyor. Uzantısız dinamik Directus görsel yolunu route handler'a geçirmeden reddediyor. Güvenli öneri: sadece yönetilen `/site-media/<UUID>` görsellerinde optimizer'ı atlayarak mevcut doğrulanmış medya route'unu kullanmak; statik portre optimizer'ını, Directus yayın yetkisini ve dosya temizliğini korumak. URL'ye sahte uzantı eklemek yeterli değil; static dosya varsayımı da var. Global tür/güvenlik kontrolü gevşetilmeyecek.

Bu tur yalnız kontrol/teşhis istendi: kaynak/runtime/config/DB/görsel değiştirilmedi, deploy yapılmadı; düzeltme onayı bekleniyor. Önceki medya kabulünde uploaded file0 olduğundan yalnız statik fotoğraf senaryosu geçmişti; Paket54'teki diğer 94 test başarısı bu yeni dinamik yükleme hatasının çözüldüğü anlamına gelmez. Gerçek yüklenen fotoğraf smoke artık hatayı yeniden üretiyor. Ayrıntılar günlükte.

## Güncel yayın durumu — 10 Ekim 2026 / Paket 54

Canlı site `https://furkantoplu.com`, yönetim `https://furkantoplu.com/bakir`. Kullanıcı Namecheap nameserver'larını daisy/elliot Cloudflare'e geçirdi; recursive NS ve yetkili apex/www proxy A yanıtları doğrulandı. Kullanıcı Full(strict) kaydettiğini teyit etti; VPS origin ve Cloudflare üzerinden HTTPS 200, gerçek alan adı sertifika doğrulaması geçti. DNSSEC kapalı, AAAA yok; mail MX/TXT değiştirilmedi.

Docker aynı dört servistir. `compose.vps.yaml` + `compose.vps.https.yaml` birlikte kullanılır. Public portlar IPv4 TCP 80/443 ve UDP 443; Directus loopback 8055, DB/frontend internal. Eski 8080/9090 HTTP tüneli artık kullanılmaz; yerel 8080 ayrı DB ile korunur. Caddy apex/www Let’s Encrypt sertifika/SAN doğrulaması geçti; geçerlilik 10 Ekim 2026–8 Ocak 2027. Kalıcı data volume ve otomatik yenileme aktif; ileri tarihteki gerçek yenileme henüz gözlenmedi. Cloudflare için HTTP-01 kullanılır, TLS-ALPN challenge kapalıdır. API token veya özel sertifika anahtarı aktarımı gerekmedi.

Sertifika öncesi uygulamasız HTTPS 503 bakım uç noktası açıldı; doğrulama sonrası site upstream'e geçirildi. HTTP→HTTPS / www→apex 308, path/query korunur. Secure cookie=true gerçek Directus environment üzerinden doğrulandı; admin no-store/noindex ve aynı API method/path allowlist korundu. Cloudflare yönetim/API DYNAMIC, HIT yok; dashboard cache rule ayrıca ayarlanmadı. Config/env yedeği root 700 `https-20261010` içinde, dosyalar 600. DB/hesap/TOTP/içerikler değiştirilmedi veya yeniden restore edilmedi; frontend imajı aynı.

94 regresyon ve 7 gerçek HTTPS smoke geçti. Gerçek tarayıcıda mobil menü/Hakkımda, English dil geçişi, 404→ana sayfa ve admin giriş formu açıldı; seçili akışların JavaScript error/warn logları boş. Gerçek parola/OTP girilmedi. Teslim kalanları: kullanıcı admin/OTP/medya kabulü, örnek iletişim bilgilerinin gerçek değerlerle düzenlenmesi, düzenli/off-server backup ve restore provası, Cloudflare cache bypass/DNSSEC ve Search Console son kontrolü. Teknik erişimin açılması bu kalanların tamamlandığı anlamına gelmez. Sites becerisi mevcut kaynak/VPS dağıtımını korumak için kullanıldı; native Sites hosting'e taşıma yok. Ayrıntılar `deploy/VPS-KURULUM.md`; aşağıdaki aşamalar tarihlendirilmiş geçmiş kayıtlardır.

## Güncel yayın durumu — 10 Ekim 2026 / Paket 53

Kullanıcının açık hassas aktarım onayıyla site `149.56.103.60` VPS'ine taşındı. `/opt/furkantoplu` içinde PostgreSQL16/Directus12.4/Node standalone/Caddy çalışıyor, dört servis sağlıklı. Yerel düzen aynen durur; production runtime non-root Node, Wrangler dev değil. Transfer SHA256,14 tablo içerik/hesap/rol/TOTP parmak izi, upload bytes ve appsecret hash eşit.2 yönetici/6 alan/3 blog/6 sayfa/22 çeviri korundu; yalnız hedefte4 eski session iptal edildi. Yeni giriş mevcut bilgiler/Google Authenticator koduyla yapılır, gerçek kullanıcı giriş testi bekliyor.

Staging sadece loopback8080/8055, dışarıda yalnızSSH22; public domain yayını yok. Özel SSH tüneliyle bilgisayar9090→VPS8080, admin9090/bakir. Yerel8080 ve VPS9090 farklı DB: yeni içerik düzenlemeleri VPS panelinden yapılmalı. DNS/Namecheap/Cloudflare/originHTTPS ve secure cookie=true henüz yapılmadı.

91 regresyon ve gerçek VPS proxy HTTP smoke'ları geçti: üç dil sayfalar/18 alan detayı,404/sitemap/robots, admin cache/index engeli, yetkisiz erişim, gizli dosya404 ve image optimizer. In-app browser mobil menü/Hakkımda,404 sonrasıBlog/detay/ana sayfa ve TR→EN→DE çalıştı; yakalanan JavaScript error/warn yok. Admin client formu açıldı; gerçek parola/OTP/CRUD ve kapsamlı pixel QA yapılmış sayılmaz. Uploaded file0; statik portreler çalışır, yeni upload kabulü bekliyor.

İlk geri dönüş yedeği root700 `/var/backups/furkantoplu/migration-20261010-a94723c2a8`; yerel özel ACL'li kopya AppData'da korunur, Git/OneDrive'a secrets girmez. Yeni editler için günlük backup/retention/off-server ve restore provası henüz kurulmadı. Anlık disk31GB boş, dört app yaklaşık344MiB RAM; kapasite garantisi değil. Operasyon/tünel/geri dönüş uyarıları `deploy/VPS-KURULUM.md`; aşağıdaki9Ekim/52.paket notları geçmiş aşamalardır.

## Projenin amacı

Furkan Toplu için güven veren, sade ve içerik odaklı bir fizyoterapist portföy sitesi hazırlanıyor. Site ziyaretçileri için üyelik sistemi bulunmayacak. Site sahibi; blog yazılarını, çalışma alanlarını, görselleri ve temel iletişim bilgilerini kod görmeden yönetebilecek.

## VPS erişim durumu — 9 Ekim 2026

- Kullanıcı OVHcloud Ubuntu 26.04 VPS ve Namecheap üzerinden `furkantoplu.com` domainini aldı. Sunucu IPv4 adresi `149.56.103.60`, Linux kullanıcı adı `ubuntu`; `furkofizyo` yalnız hizmet etiketidir.
- Sunucuya özel parolalı ED25519 anahtarı kullanıcı tarafından yerelde oluşturuldu; açık anahtar sunucuya eklendi, özel anahtar bilgisayarda kaldı. SSH agent üzerinden Codex'in anahtarlı girişi ve etkileşimsiz sudo erişimi doğrulandı. Mevcut diğer sunucu anahtarları/SSH ayarları değiştirilmedi.
- KVM'den alınan host parmak izi yerel kayıt ve gerçek SSH el sıkışmasıyla karşılaştırıldı. İlk kontrolde Git vardı, Docker yoktu; yaklaşık 36 GB boş disk ve 3.7 GiB RAM görüldü. Sonraki hazırlıkta uygulanabilir Ubuntu güncellemeleri, Docker Engine 29.9.0 / Compose v5.6.0, UFW IPv4/IPv6 ve Docker WAN port filtresi kuruldu. Yeni 7.0.0-38 çekirdeğiyle reboot/SSH ve Docker restart sonrası kurallar test edildi.
- SSH anahtar-only/root SSH kapalı; 2 GiB swap, container logları 10m × 3/sıkıştırmalı, journal 150M/50M/14 gün. Ubuntu güvenlik güncelleme timer'ları aktif, otomatik reboot kapalı. Yaklaşık 33 GB boş disk var. Boş `/opt/furkantoplu` uygulama dizini ve root erişimli config yedek dizini hazır; gerçek uygulama yedek sistemi henüz yok.
- Geçici Compose fixture'ında dış TCP 80/443 çalıştı, 8080/8055 kapalı kaldı; test container/ağ/imajları kaldırıldı. 443 yalnız plaintext port testiydi, TLS değil. IPv6 dış testine bu bilgisayarda rota olmadığı için onay verilmedi; ilk yayın IPv4 üzerinden hazırlanacak. 75 regresyon testi geçti.
- Site, veritabanı ve fotoğraflar henüz VPS'ye taşınmadı. DNS, Cloudflare ve TLS değiştirilmedi. Kullanıcı sırası sunucu → site/veri → domain/Cloudflare; sonraki kurulum ve ayrıntılar `deploy/VPS-KURULUM.md` içinde. Sırlar/özel anahtarlar notlara/Git'e alınmaz. Ubuntu'nun phased rollout nedeniyle tuttuğu beş paket zorlanmadı.

## Kalıcı içerik silme — 9 Ekim 2026

- VPS'ye taşımadan önce yerel admin paneline blog yazısı ve çalışma alanı için görünür Sil düğmesi eklendi. Native dialog kaydı gösterir, SIL onayı ve Vazgeç içerir; gizleme ayrı kalır. Yeni/kaydedilmemiş form değil, mevcut kayıt silinir. Seçili kayıt silinince editör/çeviri sekmesi yeni Türkçe forma döner; farklı kayıt taslağı korunur.
- Native Directus DELETE yalnız iki koleksiyonun tek pozitif numerik ID'sine proxy üzerinden izinlidir. 011 migrasyonu çevirileri parent ile atomik temizler, alias mevcut FK cascade ile gider; parent kilidi/çeviri guard öksüz yeni yazımı önler. İşlem/backup geçmişleri ayrı tutulur, mevcut satırlara geniş purge yapılmaz.
- Medya temizliği paylaşılan/draft/hidden kullanımı korur; son kullanım kalkınca yönetilen upload dosyası/DB/registry temizlenir. Geçici kayıtlarla üç dil 404, sitemap, alias, anonim deny ve fiziksel dosya kontrolü geçti; gerçek iki fotoğraf korundu. 82 test, TypeScript/lint, Docker build ve HTTP kontrolleri geçti. Tarayıcı yardımcısı başlatılamadığı için popup görsel QA'sı tamamlanmış sayılmaz. VPS ve DNS değiştirilmedi; yerel Docker güncellendi.

## Güncel içerik ve hero revizyonu — 10 Ekim 2026

- Kullanıcı eski alanları sildi; import öncesi çalışma alanı tablosunda 0 kayıt olduğu doğrulandı. Görseldeki genel altı klinik alanın hizmet kapsamında olup olmadığı soruldu, kullanıcı tamamının sunulduğunu açıkça teyit etti. Altı anlaşılır başlık, özgün detay/SSS/SEO ve EN/DE karşılıkları fotoğrafsız yayına alındı: kas/eklem, sinir sistemi/hareket, nefes/dayanıklılık, çocuk hareket/gelişim, spor yaralanmaları/spora dönüş, ileri yaş denge/hareket.
- Altı parent (18–23) ve 12 çeviri tek transaction'da oluşturuldu. Manuel bir defalık import marker'ı tekrar eklemeyi/sonraki admin silmelerini geri almayı önler; Compose startup'a bağlı değildir, mevcut veriyi ezmez. 18 detay URL'si/listeler/dil linkleri/sitemap/görselsiz görünüm geçti. Admin'den tüm metinler/görseller/visibility/status düzenlenebilir. İçerik eşlemesi docs/calisma-alanlari-icerik.md içindedir.
- Ana sayfa altı kartı 3×2/tablet2/mobil1 dizilime alır. Portre arkasında tek mat adaçayı kemer ve ince kontur var; parıltı/orbit/yüzen slogan yok. Aynı fotoğraf, alt fade, desktop derinlik ve mobil relative/izole metin akışı korunur. CSS dekor fotoğrafın arkasında, pointer-events none; yeni raster asset/dependency yok.
- 89 test, TypeScript/lint, Docker build/canlı HTTP kontrolü geçti. Yerel Docker ve Obsidian/Git güncellenir; pixel QA tamam diye sunulmaz. Blog, yönetici hesapları ve mevcut CMS sayfa/görselleri değiştirilmedi; VPS/domain/Cloudflare henüz taşımadan ayrı aşamadır.

## Geliştirme yaklaşımı

Hakkımda sayfası ve ana sayfadaki Hakkımda bölüm fotoğrafının kırpılması 9 Ekim 2026'da düzeltildi: Vinext fill img'ye inline object-fit:cover eklediği için CSS contain etkisiz kalıyordu. Her iki Image bileşeninde explicit contain verildi; aynı 4/5 kutu, padding, caption, görünürlük ve admin görsel kaynağı korunur. Üstteki ana sayfa 3D karakteri değiştirilmez. Gerçek framework renderer ve TR/EN/DE HTTP HTML testleri eklendi; toplam 86 test geçti, yerel Docker yenilendi. CMS/asset/DB/VPS/DNS değişmedi.

Proje tek seferde tamamlanmayacak. Önce küçük arayüz paketleri hazırlanacak ve her paket görsel olarak kontrol edilecek. Backend, veritabanı ve yönetim paneline ana frontend bütünü tamamlandıktan sonra kontrollü paketlerle geçilecek. Dağıtımı tekrarlanabilir tutmak için frontend, reverse proxy, Directus ve PostgreSQL aynı Docker Compose mimarisine alındı.

Planlanan sıra:

1. Tasarım dili, header ve hero
2. Çalışma alanları
3. Hakkımda ve yaklaşım
4. Blog ön izlemesi
5. İletişim, konum ve footer
6. İç sayfalar ve responsive son kontroller
7. Directus ve PostgreSQL temeli (23 Eylül 2026'da tamamlandı)
8. Çalışma alanları ve blogun Directus bağlantısı (24 Eylül 2026'da tamamlandı)
9. Yönetici girişi ve TOTP
10. Zamanlanmış veritabanı ve dosya yedek servisinin eklenmesi
11. VPS, Cloudflare ve domain bağlantısı

İç sayfa tasarımlarına `Bel ve Boyun Sağlığı` çalışma alanı ile başlandı. Kullanılan rota: `/calisma-alanlari/bel-ve-boyun-sagligi`. İkinci örnek olarak `/calisma-alanlari/sporcu-rehabilitasyonu` hazırlandı.

Ana sayfa hero görseli Furkan Toplu'nun kullanıcı tarafından sağlanan fotoğrafından üretilmiş, foto-gerçekçilikten bilinçli olarak uzaklaştırılmış şeffaf 3B karakter render'ını kullanır. Onay için kullanılan güncel aday `frontend/public/furkan-toplu-hero-3d-v3.png` dosyasıdır; özgün fotoğraf ile önceki görsel denemeleri geri dönüş olanağı için korunur. Karakter bir fotoğraf kartı veya dikdörtgen sahne içine kapatılmaz; krem sayfa üzerinde serbest duran ve sağ kolondan taşan ayrı bir nesne gibi yerleşir. Hacim hissi CSS perspektifi, yumuşak ışık halesi, zemin gölgesi, drop-shadow ve sınırlı hover dönüşümüyle desteklenir. `prefers-reduced-motion` tercihinde hareket süresi proje genel kuralıyla etkisiz hale gelir.

Her çalışma alanı ziyaretçi açısından kendine ait `/calisma-alanlari/[slug]` adresine sahiptir. Tek dinamik rota ortak `PracticeDetail` şablonunu kullanır; metadata, başlık, açıklamalar, değerlendirme başlıkları, süreç adımları ve SSS verileri Directus kaydından alınır.

Çalışma alanlarının tamamını sunan `/calisma-alanlari` dizin sayfası oluşturuldu. Kartlar, detay sayfaları ve çapraz bağlantılarda kullanılan başlık, slug, özet ve sıralama bilgileri Directus `practice_areas` koleksiyonundan dinamik olarak alınıyor.

Mevcut çalışma alanı rotaları:

- `/calisma-alanlari/bel-ve-boyun-sagligi`
- `/calisma-alanlari/sporcu-rehabilitasyonu`
- `/calisma-alanlari/ameliyat-sonrasi-surec`
- `/calisma-alanlari/durus-ve-hareket-analizi`

Blog liste sayfası `/blog`, yazı detayları `/blog/[slug]` düzenini kullanır. Ana sayfa, blog listesi ve yazı detayları Directus `blog_posts` koleksiyonundan dinamik okunur. İlk yayınlanmış örnek yazı `/blog/masa-basinda-hareket-molalari` rotasındadır; taslak ve gizli yazılar listelenmez ve doğrudan adreslerinde 404 döndürür.

Kök seviyedeki `app/not-found.tsx` bütün bulunamayan içerikler için ortak ziyaretçi deneyimidir. Rastgele URL'ler, bilinmeyen blog slug'ları ve yayında olmayan/bilinmeyen çalışma alanları aynı markalı sayfayı gösterir. Sayfa ana sayfa, çalışma alanları, blog, hakkımda ve iletişim yönlendirmeleri sunar; görünür tasarıma rağmen sunucu gerçek HTTP 404 durumunu ve `noindex, nofollow` robots talimatını korur.

Arama motoru keşfi için kök seviyede `/robots.txt` ve `/sitemap.xml` metadata rotaları bulunur. Robots çıktısı public siteyi taramaya açar; `/bakir`, alt yolları ve `/bakir-api` yönetim trafiğini tarama dışında bırakır. Sitemap sabit public sayfalara ek olarak Directus salt-okunur endpoint'inden yalnızca yayınlanmış çalışma alanlarını ve blog yazılarını alır. Directus geçici olarak erişilemezse sabit URL listesi yine oluşturulur. Bütün mutlak URL'lerin kökü `SITE_PUBLIC_URL` ortam değişkeninden gelir; VPS yayınında gerçek HTTPS domaini kullanılır.

Vinext `1.0.0-beta.5` bağlantı shim'i bu proje kombinasyonunda hem RSC prefetch sırasında hem de tıklama navigasyonunda çalışma zamanı hatası ürettiği için public ve özel panel iç bağlantıları `next/link` kullanmaz. Ortak `NativeLink` bileşeni semantik `<a href>` üretir ve tarayıcının güvenilir tam sayfa navigasyonunu kullanır. Bu tercih sayfa geçişini biraz daha az optimize eder ancak bozuk istemci router'ını tamamen devreden çıkarır.

Ortak navigasyon masaüstünde yatay, 1120 piksel ve altındaki ekranlarda açılır panel olarak çalışır. Mobil panel; aktif sayfa vurgusu, arka alana dokunarak kapatma, Escape tuşuyla kapatma ve açıkken arka sayfa kaymasını durdurma davranışlarını içerir. Menü verileri tek bir ortak kaynaktan hem header hem footer tarafından kullanılır.

## Sayfa yapısı

- Ana Sayfa
- Hakkımda: `/hakkimda`
- Çalışma Alanları: `/calisma-alanlari`
- Çalışma Alanı Detayı
- Blog: `/blog`
- Blog Yazısı
- İletişim: `/iletisim`
- KVKK Aydınlatma Metni: `/kvkk-aydinlatma-metni`
- Gizlilik Bilgilendirmesi: `/gizlilik`
- Özel yönetim yolu: örnek olarak `/bakir`

Hakkımda ve İletişim bölümleri ana sayfada kısa özet olarak kalır; navigasyon bağlantıları ziyaretçiyi ayrıntılı bağımsız sayfalara götürür. İlk sürümde iletişim formu bulunmaz. Telefon, WhatsApp ve e-posta bağlantıları kullanılır; ziyaretçiden site üzerinden sağlık verisi toplanmaz.

KVKK ve gizlilik sayfaları arayüz taslağı olarak hazırlanmıştır. Veri sorumlusu kimliği, hukuki sebepler, aktarım tarafları, saklama süreleri ve production hizmet sağlayıcıları gerçek veri işleme envanteri kesinleştiğinde doldurulacak; yayın öncesinde hukuk uzmanı kontrolü yapılacaktır.

## Teknoloji mimarisi

### Ön yüz

- Next.js uyumlu Vinext başlangıç yapısı
- React ve TypeScript
- Tailwind CSS altyapısı ile birlikte projeye özel CSS
- Lucide ikonları
- Responsive tasarım

### İçerik yönetimi

- Self-hosted Directus Data Studio
- Site sahibine özel sadeleştirilmiş içerik ekranları
- Blog, çalışma alanları, görseller ve site ayarları
- Taslak/yayın durumları
- Rol ve yetki sınırlandırması

### Veritabanı

- PostgreSQL
- Directus sistem tabloları
- Blog yazıları, kategoriler, çalışma alanları ve site ayarları

### Yönetici girişi

- Ziyaretçiler için üyelik sistemi olmayacak.
- Site sahibi özel bir yol üzerinden panele girecek: `site.com/bakir` benzeri.
- E-posta ve parola kullanılacak.
- Google Authenticator uyumlu 6 haneli TOTP doğrulaması etkin olacak.
- Giriş denemesi sınırı ve güvenli oturum çerezleri kullanılacak.
- Özel URL tek başına güvenlik önlemi kabul edilmeyecek.

Bu temel artık `/bakir` rotasında uygulanmıştır. Site sahibine Directus Studio yerine projeye özel sade bir giriş ve özet ekranı gösterilir. Caddy, tarayıcıdan gelen `/bakir-api/*` isteklerini aynı origin altında Directus'a iletir; Directus oturumu `httpOnly`, `SameSite=Lax` çerezle yönetilir. Yerel HTTP ortamında Secure bayrağı kapalıdır, production HTTPS ortamında açılacaktır. Ekran Google Authenticator uyumlu TOTP kurulumunu destekler; kurulum anahtarı yalnızca oturum sahibine gösterilir ve etkinleştirme telefondaki güncel kodla tamamlanır. İçerik ekleme/düzenleme formları bir sonraki yönetim paketi olacaktır.

Birden fazla yönetici ayrı Directus kullanıcı hesaplarıyla çalışabilir. Tam yetkili yönetici özel panelden yeni yönetici hesabı açar; ortak parola veya ortak TOTP anahtarı kullanılmaz. Panel yalnızca oturumdaki hesabın `tfa_enabled` durumunu ve yönetici ekibindeki hesapların güvenlik durumunu gösterir, `tfa_secret` değerini API cevabına koymaz. Her yöneticinin içerik işlemleri Directus aktivite kaydında kendi kullanıcı kimliğiyle izlenebilir.

Yönetim arayüzü büyüyebilir modüler bir kabuk kullanır. Masaüstünde 248 piksel genişliğinde sabit sidebar; 900 piksel altında ise header'ın altında sabitlenen yatay ve kaydırılabilir bölüm menüsü bulunur. Genel bakış, blog, çalışma alanları, yönetici ekibi ve hesap güvenliği aynı anda alt alta render edilmez; seçilen bölüm tek çalışma alanında gösterilir. Sidebar içerik sayılarını ve aktif bölümü belirtir. Genel bakış kartları da ilgili bölüme doğrudan geçiş sağlar.

### Production altyapısı

Docker Compose servisleri:

```text
reverse-proxy   Caddy veya Nginx
web             Next.js/Vinext uygulaması
cms             Directus
database        PostgreSQL
backup          Zamanlanmış yedek görevi
```

Mevcut durumda `frontend`, `proxy`, `directus` ve `database` servisleri uygulanmıştır. Frontend imajı çok aşamalı build kullanır; Caddy container'ı dış istekleri frontend'e ve `/bakir-api/*` isteklerini Directus'a yönlendirir. Yerel site varsayılan olarak `http://localhost:8080/`, özel yönetim girişi `http://localhost:8080/bakir`, Directus teknik arayüzü ise yalnızca bu bilgisayardan erişilecek şekilde `http://localhost:8055/admin/` adresindedir. PostgreSQL host portu açmaz ve yalnızca Compose ağı üzerinden Directus tarafından erişilir. Veritabanı, yüklenen dosyalar ve Directus eklentileri ayrı kalıcı volume'larda tutulur. Zamanlanmış yedek servisi sonraki backend paketinde eklenecektir.

Cloudflare görevleri:

- DNS yönetimi
- Proxy/CDN
- Full (strict) TLS
- Temel WAF ve rate limit kuralları
- Yönetim ve API yollarında uygun cache bypass kuralları

Yerel geliştirmede Chrome DevTools, otomatik çalışma alanı keşfi için `/.well-known/appspecific/com.chrome.devtools.json` yolunu tekrar tekrar sorgulayabilir. Caddy bu kesin teknik yola içeriksiz HTTP 204 verir; istek frontend 404 bileşenine düşmez ve geliştirici konsolunu sahte çoklu hata görünümüyle kirletmez. Diğer bilinmeyen yollar normal biçimde özel 404 sayfasına ve HTTP 404 durumuna gitmeye devam eder.

## İçerik modelleri

### Blog yazısı

- Yayın durumu: taslak, yayında veya gizli
- Sıralama ve öne çıkan yazı seçimi
- Başlık
- Slug
- Kısa özet
- Kapak görseli ve alternatif metni
- Giriş, paragraflar, vurgulu alıntı ve uygulanabilir adımlar
- Kategori
- Yayın tarihi ve okuma süresi
- SEO başlığı ve açıklaması

Blog yazıları `scripts/bootstrap-blog.mjs` ile oluşturulan `blog_posts` koleksiyonunda tutulur. `status = published` kayıtları ana sayfa ve blog listesinde gösterilir; `draft` veya `hidden` kayıtları public endpoint tarafından döndürülmez. `featured` seçeneği öne çıkan yazı sırasını, `sort` ise aynı gruptaki sıralamayı belirler. Başlangıçta bir yayınlanmış ve iki taslak kayıt eklenmiştir.

Site sahibi bu kayıtları `/bakir` içindeki özel blog yönetimi ekranından ekleyip düzenler. Liste ekranı yayın durumunu ve temel yazı bilgisini gösterir; hızlı yayınla/gizle işlemleri sunar. Editör başlık, otomatik Türkçe slug, kategori, özet, tarih, okuma süresi, öne çıkarma, giriş, paragraflar, alıntı, kapanış ve SEO bilgilerini yönetir. Silme işlemi ilk sürümde bilerek sunulmaz; içerik geri getirilebilir biçimde `hidden` durumuna alınır.

Frontend blog içeriğini çalışma alanlarıyla aynı `directus-extension-website-content` salt-okunur eklentisinden alır. Eklenti `/blog-posts` ve `/blog-posts/:slug` endpoint'lerinde yalnızca izin verilen alanları ve yayınlanmış kayıtları döndürür. Yapılandırılmış paragraflar ve öneriler HTML olarak çalıştırılmadan React metni şeklinde render edilir.

### Çalışma alanı

- Başlık
- Slug
- Kısa açıklama
- Detaylı genel bilgilendirme
- Görsel ve alternatif metni
- Sıralama
- Yayın durumu: taslak, yayında veya gizli
- Ana sayfada göster seçeneği
- Değerlendirme başlıkları ve süreç adımları
- Sık sorulan sorular
- SEO başlığı ve açıklaması

Çalışma alanları kodda sabit bir sayıyla sınırlandırılmayacak. Yaklaşık 15 alan veya daha fazlası Directus panelinden eklenebilir. `status = published` kayıtları çalışma alanları dizininde ve kendi detay URL'lerinde gösterilir. `status = hidden` kayıtları silinmeden ziyaretçiden saklanır. `show_on_homepage = true` yalnızca ana sayfadaki sınırlı kart seçimini belirler; böylece tüm alanlar dizinde kalırken ana sayfa kalabalıklaşmaz.

Günlük yönetim Directus Studio yerine `/bakir` içindeki Çalışma alanları ekranından yapılır. Liste mevcut alanların yayın ve ana sayfa görünürlük durumunu gösterir. Editör temel kart bilgileri, detay hero metinleri, değerlendirme içeriği, satır bazlı maddeler, `Başlık | Açıklama` biçimindeki süreç adımları, `Soru | Cevap` biçimindeki SSS ve SEO alanlarını yönetir. Yeni alanlar varsayılan olarak taslak oluşturulur; silme yerine gizleme kullanılır.

Frontend çalışma alanlarını `directus-extension-website-content` adlı salt-okunur Directus endpoint eklentisinden alır. Eklenti yalnızca `status = published` kayıtlarını ve frontend için izin verilen alanları döndürür. Standart Directus koleksiyon API'si anonim erişime kapalıdır. Ana sayfa endpoint'e ayrıca `homepage=true` parametresi göndererek yalnızca `show_on_homepage = true` kayıtları ister. Liste ve detay sayfaları her istekte güncel veriyi alır; gizlenen bir kayıt hem listeden kalkar hem de detay URL'sinde 404 üretir.

### Site ayarları

- İsim ve mesleki unvan
- Telefon, e-posta ve WhatsApp
- Adres ve çalışma saatleri
- Sosyal medya bağlantıları
- Ana sayfa metinleri
- SEO ayarları

Hakkımda ve İletişim sayfaları `site_pages` koleksiyonunda `about` ve `contact` anahtarlı iki kayıt olarak tutulur. Sayfaya özgü alanlar güvenli JSON `content` nesnesinde, SEO başlığı ve açıklaması ayrı alanlarda saklanır. Public frontend `/website-content/pages/:pageKey` salt-okunur endpoint'ini kullanır; endpoint yalnızca izin verilen iki sayfa anahtarını kabul eder. Yönetici `/bakir` içindeki Sayfa içerikleri ekranında Hakkımda ve İletişim sekmeleri arasında geçerek bu değerleri kod görmeden düzenler.

İletişim kaydındaki telefon için yöneticiye tek `Telefon numarası` alanı gösterilir. Görünen metin bu alandan alınır; arama bağlantısında kullanılacak uluslararası `tel:` değeri kayıt sırasında otomatik normalize edilerek geriye dönük uyumluluk için `phone_value` anahtarında tutulur. Public iletişim sayfası ve ana sayfadaki iletişim bloğu aynı `contact` kaydını kullanır. Telefon, WhatsApp, e-posta, adres ve çalışma saatlerinde yapılan tek değişiklik iki görünümde de geçerli olur.

## Çok dilli ziyaretçi sitesi — 6 Ekim 2026

Ziyaretçi arayüzü Türkçe, İngilizce ve Almanca sunulur. Navbar'daki mevcut dil adı (Türkçe / English / Deutsch) tıklanınca açılan menü dil değiştirir; üç dil yan yana gösterilmez. Türkçe mevcut kök adreslerini korur; İngilizce `/en`, Almanca `/de` altında çalışır. Sabit adresler ortak rota haritasında tanımlıdır. Örnekler: `/hakkimda`, `/en/about`, `/de/ueber-mich`; `/iletisim`, `/en/contact`, `/de/kontakt`. Alt sayfalara geçildiğinde dil URL üzerinden korunur. Admin yalnızca Türkçedir ve `/bakir` adresini kullanır.

Sabit arayüz metinleri `frontend/app/lib/messages.ts` sözlüğündedir. `proxy.ts` ziyaretçi URL'sinden dili çıkarır, istemciden gelen dil başlığını doğrulanmış değerle değiştirir ve server-rendered sayfalara aktarır. Kök HTML `lang` değeri dilin kendisini gösterir. İngilizce ve Almanca rotalar mevcut public sayfa bileşenlerini yeniden kullanır; sayfa tasarımı üç ayrı kopyaya ayrılmaz. Framework istemci navigasyon sorunu nedeniyle kullanılan NativeLink ve tam sayfa navigasyonu korunur.

Türkçe editorial kayıtlar mevcut Directus koleksiyonlarında kalır. İngilizce/Almanca çeviriler PostgreSQL `website_content_translations` tablosunda `collection + parent_id + language` benzersiz anahtarıyla ana kayda bağlanır. İlişki uygulama tarafından doğrulanır; dinamik koleksiyonlar için tek fiziksel yabancı anahtar kullanılmaz. Çevirinin JSON içeriği yalnızca açıkça izin verilen metin ve liste alanlarını kabul eder. Telefon, e-posta, görsel, sıralama ve görünürlük seçenekleri ana kayıttan gelir. Çeviri URL adı dil/koleksiyon bazında benzersizdir.

Yönetici mevcut editörlerin Türkçe / İngilizce / Almanca sekmelerini kullanır. Çeviri yayın durumu ana kayıttan bağımsızdır; public blog ve çalışma alanında hem ana kayıt hem çeviri `published` olmalıdır. Hazır olmayan dil sürümleri listelenmez, dil seçicisinde kullanılamaz ve doğrudan URL'de 404 verir. Liste boşsa o dilde açıklayıcı mesaj gösterilir. Çeviri okuma/yazma endpoint'leri aktif, tam yetkili Directus yöneticisi gerektirir; oturum ve TOTP sistemi değiştirilmez.

Compose `content-migrations` servisi idempotent SQL migrasyonlarını çalıştırır ve başarılı tamamlanmadan frontend başlatılmaz. Var olan çeviriler başlangıç metinleriyle ezilmez. İlk örnek Hakkımda/İletişim çevirileri hazırdır; blog ve çalışma alanı çevirileri panelden doldurulur. Yasal belgeler bu pakette Türkçe kalır; EN/DE bağlantı metni belgenin Türkçe olduğunu belirtir. Sitemap yalnızca yayınlanmış çeviri detaylarını listeler; canonical ve hreflang adresleri dil URL'leriyle eşleşir.

## Yönetilebilir sayfalar ve medya — 6 Ekim 2026

`site_pages` kayıtları artık `home`, `about`, `contact`, `areas`, `blog` sayfalarını kapsar. Sayfa içerikleri panelinde beş ayrı sekme vardır. Ana sayfa hero ve bölüm metinleri, kısa bilgiler/değerler/süreç adımları ile hero/Hakkımda görselleri yönetilebilir. Blog ve çalışma alanları liste sayfalarının girişleri, isteğe bağlı giriş görselleri, arşiv ve bilgi notu metinleri de CMS'den gelir. Hakkımda'nın görseli kendi sayfa kaydındadır. İletişim bilgileri ana sayfa ve İletişim'de tek ortak kayıttan kullanılır. Tasarım yapısı/CSS ve ortak gezinme düğmelerinin etiketleri kodda kalır; serbest sayfa oluşturucu uygulanmadı.

Yazı `cover_path/cover_alt/cover_caption`, çalışma alanı `image_path/image_alt` bilgileri kendi kayıtlarında saklanır. Yönetici JPG/PNG/WebP dosyasını panelden seçer; Directus `/files` üzerinden mevcut yetkili oturumla yüklenir. Dosya yüklemek ile içeriği kaydetmek iki ayrı adımdır. Görseller diller arasında ortak, alt metinler çevrilebilir. Yeni sayfa başlangıç içerikleri/çevirileri idempotent `003-editable-public-pages.sql` ile eklenir, mevcut kayıtlar ezilmez.

Yüklenen dosyalar `directus_uploads` volume'ünde kalıcıdır; PostgreSQL içerik kayıtlarını tutar. İmaj taşımak bu verileri taşımaz; VPS geçişinde her iki volume de yedeklenmelidir. Public `/site-media/<UUID>` route'u Directus özel `/website-content/media/<UUID>` endpoint'inden akış alır. Yalnızca yayındaki blog/alan veya tanımlı public sayfa görselleri açılır; dosya kütüphanesine genel public permission verilmez. SVG/HTML sunulmaz. Kaydedilmemiş dosyalar admin oturumu üzerinden önizlenir. İçerikten kaldırma dosyayı silmez.

### Authenticator QR kurulum akışı

Yeni yönetici kurulumunda Directus `secret/otpauth_url` üretir. Panel `qrcode` ile bağlantıyı yerelde PNG QR'a çevirir; Google Authenticator QR ile ekler, sonra altı haneli kod Directus'ta doğrulanır. QR taramak tek başına 2FA'yı açmaz. Manuel zamana dayalı anahtar girişi alternatif olarak kalır. QR/anahtar yalnızca geçici React state'inde tutulur; dış QR servisleri, public dosya depolaması ve kalıcı tarayıcı depolaması kullanılmaz. Başarı/çıkış sonrası state temizlenir. Önceden aktif hesaplara dokunulmaz. Telefon ve sunucu saatlerinin uyumlu olması gerekir. QR geri okuma testi yalnızca sahte test verileriyle yapılır.

### Çalışma alanı adları ve adres geçmişi

Çalışma alanının kart adı ve detay H1'i ana `title` alanıdır. Ayrı hero metni isteğe bağlı alt başlıktır. Türkçe ve EN/DE çalışma alanı URL'si başlıktan otomatik türetilir; PostgreSQL tetikleyicileri Directus yazımlarında bu sözleşmeyi uygular. Aynı isimlerde benzersiz kayıt eki kullanılır. `website_practice_slug_aliases` eski slug/dil → alan kimliği eşleştirmesini tutar. Public çözüm yalnızca o dilde yayımlanmış mevcut alanları hedefler; eski adresler tek adımda güncel adrese HTTP 308 yönlenir. URL geçmişi başka kayda atanamaz. Blog URL'leri bağımsız editörünü korur.

### Yönetici hesap sahipliği

Hesabım ekranı ve account-settings endpoint'i sadece oturum açan yöneticiye aittir. Güncelleme hedef kimliği istek gövdesinden alınmaz; rol/durum/TFA anahtarı düzenlenemez. Mevcut parola ve etkin TOTP onayı sonrası isimler/e-posta/parola Directus servisleriyle değiştirilir. Giriş bilgisi değişince kendi tüm oturumları kapanır; diğer yönetici oturumları etkilenmez. Veri ve session değişikliği tek transaction içindedir.

account-ownership hook'u oturum açmış yöneticinin başka kullanıcıya güncelleme/silme yazmasını sistem seviyesinde durdurur. Public panel proxy'si dar allowlist kullanır; genel platform yönetimi ve user API yazımları dışa açık değildir. Takım oluşturma ayrı, kontrollü yeni-hesap endpoint'idir; diğer üyeler okunur görüntülenir. Dahili Directus auth işlemleri ve loopback bakım API'si farklı güven sınırıdır; Directus portu internete açılmaz. Mevcut 2FA anahtarı e-posta/parola değişiminde korunur. Parola unutma ayrı özellik olarak ele alınacaktır.

## Bölüm görünürlüğü — 7 Ekim 2026

Admin'de sayfa, alan ve blog editörlerinde bölüm adının yanında Görünür/Gizli anahtarı bulunur. Sayfa başlığı, navbar/footer ve sabit bilgilendirme uyarıları korunurken düzenlenebilir içerik bölümleri kapatılabilir. Görünürlük kaydetme ile uygulanır; yazı, görsel referansı, alt bölüm ayarları ve çeviriler silinmez. Üst bölüm kapalıysa altları da public DOM'da üretilmez. Fotoğraf kapatıldığında kart/detay aynı bayrağı kullanır ve görselsiz yerleşime geçer.

Bayraklar tüm dillerde ortak düzen bilgisidir. `practice_areas` ve `blog_posts` yeni JSONB `section_visibility` alanını, `site_pages` ise `content.section_visibility` haritasını kullanır. Eksik anahtar görünür kabul edilir; yalnızca boolean false gizler. Frontend/Directus `section-config.json` tanımları eşleşir. `006-section-visibility.sql` Directus JSON alan metadatasını ekler, idempotenttir; mevcut içerik veya yayın durumunu değiştirmez. Compose ve manuel dil kurulumu migrasyonu içerir.

Çeviri endpoint'i ortak görünürlüğü okur ve EN/DE metin kaydıyla aynı DB transaction'ında ana kayda yazar. Sayfa JSON'una yazım jsonb_set ile yalnızca görünürlük yolunu günceller; Türkçe metinler ezilmez. Çeviri beyaz listesi görünürlüğün çeviri metni üzerinden geçersiz kılınmasına izin vermez. İletişim kartları ana sayfada ortak iletişim ayarını kullanır. Blog içindekiler yalnızca görünen bölümlere bağlanır; öne çıkan blok kapalıysa ilk yazı arşive taşınır.

Bu bir gizlilik/yetkilendirme sistemi değildir. Public içerik API'si gizli bölüm metinlerini, public referanslı dosya URL'si görselleri sunmaya devam edebilir. Hassas içerik konulmamalıdır. Bölüm kapatma URL/sitemap/SEO veya yazının yayın durumunu kaldırmaz. Gerçek admin hesabı/şifre/2FA test için değiştirilmez. Otomatik render/kayıt testleri sahte içerik kullanır. Bu pakette Computer Use yardımcısı sandbox başlatma hatası verdiğinden masaüstü/mobil görsel doğrulaması tamamlanamadı; production build, TypeScript/ESLint ve canlı HTTP kontrolleri geçti.

## 10 Ekim 2026 / Paket 52 — VPS taşıma hazırlığı

Yerel düzen korunarak ayrı Node standalone üretim imajı ve `compose.vps.yaml` hazırlandı: PostgreSQL16/Directus12.4/Node/Caddy, non-root frontend, loopback staging. DNS/HTTPS/Cloudflare ayrı aşama; secure cookie özel tüneldefalse, yayındatrue. Seed mevcut veriyi ezmez.

Özel ACL'li snapshot ve transfer paketi: `C:\Users\Lenovo\AppData\Local\fizyoterapi-backups\20261010-a94723c2a8` (OneDrive/Git dışında).2 yönetici/6 alan/3 blog/6 sayfa/22 çeviri; upload files0, statik portreler imajda. Uygulama secret/TOTP korunacak, server DB parolası yeni; gerçek sırlar notlara yazılmaz. Kaynak arşivi68b5736.14 tablo/upload/secret hash kontrollü boş hedef restore betiği hazır, çalıştırılmadı.

**VPS'ye dosya/DB gönderilmedi.** Güvenlik denetimi hassas paketin149.56.103.60'a aktarımı için açık onay istiyor; sadece boş özel hedef dizini oluşturuldu.91 regresyon ve yerel üretim HTTP kontrolleri geçti; proxy/admin gerçek login/restore/backup/domain kabulü bekliyor. Site yerelde çalışıyor, yayın tamamlanmış değil. Ayrıntı `deploy/VPS-KURULUM.md`.

## Beyaz önlüklü ana karakter — 8 Ekim 2026

Kullanıcının sağladığı yeni fotoğraf ana sayfada önceki kırmızı tişörtlü portrenin yerine geçti. Yerleşik image_gen ile kişi belden yukarı çıkarıldı, klinik arka planı kaldırıldı; `frontend/public/furkan-toplu-hero-white-coat-v1.png` şeffaf PNG'dir. Perspektif, z-index 120, drop-shadow ve alttan kaybolan maske mevcut CSS'ten gelir, yeni 3D motor/model eklenmedi. Önceki asset dosyası geri dönüş için korunur. Admin görsel yönetimi ve üç dilde ortak görsel kullanımı devam eder.

Config/fallback yeni dosyayı kullanır; `007-white-coat-hero.sql` sadece önceki v1/v2/v3 paketlenmiş görsel yolunu ve değiştirilmemiş eski alt açıklamalarını TR/EN/DE için günceller. Bağımsız metin/görsel yüklemeleri ve bölüm görünürlüğü ezilmez. Compose/manual kurulum migrasyonu içerir. Üretim prompt'u `assets/hero-white-coat-prompt.md` içindedir. 41 test, üç dil rota/hero smoke ve production Docker build geçti. Computer Use sandbox hatası nedeniyle masaüstü/mobil sayfa screenshot QA tamamlanamadı; gerçek PNG ve canlı HTTP çıktıları doğrulandı.

### Çalışma alanı kartlarının eşit ölçüleri — 8 Ekim 2026

Ana sayfa ve alan listesi ızgaraları `grid-auto-rows: 1fr` / stretch ile aynı ekran genişliğinde tüm satırlarda ortak yüksekliği kullanır. Sabit kesici height yerine en uzun içerik belirleyicidir; uzun TR/EN/DE metin kesilmeden kartların tamamını büyütür. Eşit kolonlar minmax(0,1fr), kartta min-width 0 ve overflow-wrap ile taşma önlenir. Footer linkleri flex margin-top auto; görselli directory kartı auto/1fr/auto grid satırlarıyla en alta hizalanır. Görselsiz kartlarda metin kalan alanı dengeli kullanır, boş görsel slotu oluşturulmaz. CMS verisi/değişen fotoğraf ve detay sayfaları aynı kalır.

## Fotoğraf yaşam döngüsü ve kalıcı temizlik — 9 Ekim 2026

Önceki “görseli içerikten kaldır dosyayı saklar” davranışı Paket 41 ile değişti. Kaldırma/değiştirme kaydedildikten sonra son güncel kullanımını kaybeden yüklenmiş fotoğraf orijinali, thumbnail'ları ve directus_files satırıyla kalıcı silinir. Draft/hidden kayıtlar, bölüm görünürlükleri, diğer sayfalar, tüm dil içerikleri ve schema dosya ilişkileri referans kabul edilir. Yalnız görünürlüğü kapatmak temizlik tetiklemez; paketlenmiş/default repo görselleri silinmez.

website_media_assets kayıt tablosu yalnız bilinen site yüklemelerini izler. 008 migrasyonu güncel/eski CMS revizyonlarındaki bilinen /site-media UUID'lerini benimser. Yeni yüklemeler description işaretiyle takip edilir; hiç kaydedilmeyenlere 24 saat edit payı verilir. Editörde vazgeçilen aynı oturumun yeni yüklemesi yalnız yükleyen aktif adminin media-discard çağrısıyla erken temizlenebilir. Başka kişinin dosyasına veya genel file delete API'sine erişim açılmaz.

DB trigger'ları dosya varlığını ve MIME'ını kontrol edip dosya satırlarını sıralı kilitler, referans kaydını aynı transaction'da işaretler. Collector aynı kilitle güncel referansları denetler ve FilesService silmesini dış DB transaction'da yapar. Storage hatası DB yazımını geri alır; küçük resimlerin kalan kısmı da sonraki denemede temizlenir. Dosya/sayfa eşzamanlılığı kırık referans oluşturmaz. Hook kayıt olayları sonrası çalışır; dakikalık schedule kaçan olayları/restart hatalarını yeniden ele alır.

Mevcut iki gerçek upload toplam 1.923.046 bayt ve hâlâ kullanılıyor; korunmuştur. Gerçek disk/thumbnail/DB silme ve canlı schedule yalnız yapay test PNG'lerinde doğrulandı; test kayıtları temizlendi. 52 unit/regresyon testi, TypeScript/ESLint, Docker build ve canlı dil/medya/yetki smoke geçti. Fotoğraf kalıcı silindiğinde revizyon eski URL'yi taşısa da görseli geri getirmez. Metin geçmişi ve eski yedeklerin saklama politikası değiştirilmedi.

Silme iki aşamalıdır: kilit/kullanım kontrolü sonrası retired_at işareti DB'ye commit edilir, ardından dosya/metadata silinir. Kısmi fiziksel silme hatasında DB geri alınsa bile işaret korunur, eski dosyanın yeniden bir içeriğe bağlanması reddedilir. Böylece tekrar deneme sırasında hasarlı/kayıp fotoğrafı kullanan yeni sayfa oluşmaz; işaretli dosya grace süresini beklemeden temizlenir.

## Mobil hero ve navbar — 9 Ekim 2026, Paket 42

860 px altında portre absolute/translate3d büyütmeli masaüstü katmanından çıkarıldı: relative aspect-ratio kutusu, isolation ve normal akış kullanılır. Mobilde gölge hafif, dekoratif halo/orbit/floor kapalıdır; konum kartı fotoğraftan önce akışa girer. Masaüstü portre yapısı korunur. Dil görünümü TR/EN/DE, erişilebilir isimler tamdır; gerçek DOM sırası randevu → dil → menü olup mobil menü en sağdadır. Portre not kutusu public/editör/CSS tanımlarından kaldırıldı; eski home.note görünürlük bayrağı çeviri kaydını bozmadan yok sayılır. Eski CMS metin alanları veri silme migrasyonu olmadan pasif kalır.

Kullanıcının limit isteğine göre yalnız bu ilk paket yapıldı. Sonraki paketler: footer sosyal/diğer bağlantılarının admin yönetimi; genel bilgilendirme metinlerini ve kalan dekorları kapsamıyla ele alma; YouTube videosunun konuşma/altyazısına yeniden erişip tasarım sürecini buna göre değerlendirme. Bu turda video izlenmiş/dinlenmiş gibi raporlanmaz. Mobil son görünüm için gerçek ekran doğrulaması henüz yapılmadı; CSS/SSR sözleşme testleri ve production derleme kontrolü kullanıldı.

## Ortak footer yönetimi — 9 Ekim 2026, Paket 43

Admin sidebar'da Footer ekranı vardır. Yedi sosyal/dış hesap HTTPS URL'si ve görünürlüğü, dört site menüsü ile KVKK/Gizlilik footer linklerinin görünürlüğü tek ortak ayarla yönetilir. Boş link gösterilmez; Instagram için eski # placeholder kaldırılmıştır. Menü hedefleri sabit/dile göre eşlenir, link gizlemek sayfayı silmez. Ayar Türkçe admin'den TR/EN/DE ortak uygulanır; ayrı çeviri gerekmez.

`site_pages.page_key=footer` content JSON'u social/menu haritalarını tutar. 009 migrasyonu yalnız eksik kaydı ekler; diğer sayfa verilerini ve sonradan düzenlenmiş footer'ı ezmez. Yetkili native items PATCH kaydı günceller; public GET website-content/footer yalnız normalize edilmiş ayar döndürür. Formda URL doğrulama ve public sınırda güvenli URL filtreleme vardır. Credentials/protocol-relative/javascript/data/http/uzun adres gösterilmez; sunucu uzaktaki URL'ye fetch yapmaz. Dış link yeni sekmede noopener/noreferrer kullanır.

Çalışma alanı detayındaki küçük özel footer ortak SiteFooter ile değiştirildi; ayar bütün sayfalara yansır. Birden çok link responsive flex wrap kullanır, mobilde ayrı tam genişlik satırıdır. Footer API geçici çalışmazsa güvenli varsayılanlar 404 sayfasının sırf bu nedenle bozulmasını önler. 60 otomatik test, TypeScript/ESLint ve Docker build geçti; canlı anonim items write 403, public footer/dil sayfaları kontrol edilir. Gerçek admin hesabıyla form submit/screenshot QA yapılmadı; yapay render testleri kullanıldı. Bilgilendirme cümleleri, video konuşması ve kalan dekorlar sonraki pakettir.

## Genel public notlarının temizliği — 9 Ekim 2026, Paket 44

Ana sayfa çalışma alanları/blog alt notları, alan liste yaklaşım notu, blog arşiv bilgi notu, alan detay görselli/görselsiz uyarı ve SSS genel açıklaması, blog detay disclaimer'ı ve footer genel cümlesi render'dan kaldırıldı. İlgili editör/config/CSS alanları temizlendi. Footer alt satırı copyright + yasal linkler için iki kolondur; boş not sütunu kalmaz. Home/areas/blog eski note visibility bayrakları kaydetmeyi bozmadan emekli edilir. DB metin/revizyonları veya yazı içerikleri silinmedi.

Hakkımda'daki bilinen üç dil örnek mesleki notu exact-match/trim ile gizlenir; gerçek kullanıcı mesleki metni ve görünürlük kontrolü korunur. İletişimin gerçek gizlilik/sağlık verisi uyarısı, KVKK/Gizlilik belgeleri ve admin açıklamaları bu kaldırma kapsamına girmez. 62 otomatik test, TypeScript/ESLint, Docker build ve üç dil public HTML taraması uygulanır. UI temizliği hukuki uygunluk değerlendirmesi veya bütün içeriğin yayına hazır olduğunun onayı değildir. Dekor/video işi sonraki paket olarak bekler.

## Public görsel sistem revizyonu — 9 Ekim 2026, Paket 45

DESIGN.md artık public kararları kalıcılaştırır; public-design.css yalnız site-shell kapsamındadır, admin görünümünü/işleyişini değiştirmez. Forest/paper temel paleti korunarak kontrastı yüksek muted/accent seçildi. Display serif birinci başlıkta, sans bölüm/kart başlıklarında kullanılır; radius 3–6 px, daha kısa/ölçülü başlık ve bölüm aralıkları vardır. Halo, orbit, glass blur, çizgi şekilleri ve keyfi ilk kart renklendirmesi emekli edildi. Teknik arşiv başlangıç cümlesi üç dil exact-match filtreyle gizlenir.

Hero uzman adı/portre ve mevcut iletişim aksiyonuna odaklanır. Country bilgisi fotoğraf altında satırdır. Bio ve süreçler yüzen kutu yerine akış/kolon/çizgiler kullanır. Blog kartları eşit, kayıt sayısına göre kolonludur. Kapak figcaption'ı fotoğraf altındadır. Liste, detay, iletişim, yasal ve 404 ekranları aynı dilde; mobil/hidden-column/reduced-motion durumları korunur. Native link davranışı değişmez.

010 migrasyonu yalnız eski paketlenmiş farklı kişi görselini Hakkımda varsayılanından çıkarır; Furkan'ın mevcut portresini kullanır, özel upload/alt metin/visibility korunur. Varsayılan altlar EN/DE'ye uyarlanır. Yeni bitmap, yeni bağımlılık, WebGL/uzak font veya hasta/deneyim/sayısal güven iddiası eklenmedi. Gerçek CMS içerikleri/hesaplar/kalıcı uploadlar değişmedi; gerçek upload sayısı hâlâ ikidir.

68 otomatik test, TypeScript/ESLint, production Docker build, gerçek CSS/CTA/3 dil/404/not/medya/erişim smoke uygulanır. 010 testi geçici tabloda tekrar ve özel veri korumasını doğrular. Seçili palet kontrastı ölçüldü; browser screenshot/piksel QA tamamlanmadı. Computer Use helper yeniden sandbox setup hatası verdi. Video ses oynatımı değil, public konuşma dökümünün okunmasıyla incelendi; kaynak DESIGN.md/README'dedir. Haricî skill veya üçüncü taraf talimat kurulumu yapılmadı.

## Sağlık ve veri güvenliği sınırları

- Kesin sonuç, garanti iyileşme, en iyi veya bir numara gibi ifadeler kullanılmayacak.
- Kampanya, indirim ve fiyat odaklı sağlık reklamı dili kullanılmayacak.
- Hasta memnuniyeti ve öncesi/sonrası görselleri tasarımın temeli yapılmayacak.
- Blog içerikleri genel bilgilendirme niteliğinde olacak.
- İlk sürümde iletişim formundan sağlık raporu, teşhis veya ayrıntılı şikâyet toplanmayacak.
- Sağlık verisinin özel nitelikli kişisel veri olduğu kabul edilerek veri minimizasyonu uygulanacak.
- Nihai yasal metinler yayından önce uzman kontrolünden geçirilecek.

## Sahiplik ilkesi

Domain, VPS, Cloudflare ve gerekli servis hesapları mümkünse müşteri adına açılacak. Geliştirici teknik kullanıcı olarak eklenecek. Böylece alan adı, ödeme ve hesap sahipliği konusunda ileride bağımlılık oluşmayacak.
