# Fizyoterapist Web Sitesi — Teknik Kararlar ve Çalışma Kuralları

## Karar 001 — Önce arayüz

Backend ve veritabanı geliştirmesine ana frontend bütünü hazırlandıktan sonra kontrollü paketlerle geçilecek. Bunun nedeni müşteri tarafında en fazla geri bildirimin görsel tasarım üzerinden gelmesinin beklenmesi. 23 Eylül 2026 tarihinde arayüzü bozmadan Directus ve PostgreSQL çalışma temeli kurulmuştur.

## Karar 002 — Küçük paketler

Frontend bir kerede tamamlanmayacak. Her bölüm bağımsız küçük paket olarak hazırlanacak, gösterilecek ve onaylandıktan sonra sıradaki bölüme geçilecek.

## Karar 003 — Hazır CMS, özel deneyim

Yönetim paneli sıfırdan yazılmayacak. Directus'un hazır ve test edilmiş içerik yönetimi kullanılacak; fakat alanlar, menüler, yetkiler ve görünür bölümler müşterinin anlayacağı biçimde sadeleştirilecek.

## Karar 004 — Public kullanıcı sistemi yok

Web sitesi ziyaretçileri üye olmayacak. Yalnızca içerik yöneticisi güvenli yönetim hesabına sahip olacak.

## Karar 005 — TOTP zorunluluğu

Yönetici hesabında e-posta/parolaya ek olarak Google Authenticator uyumlu TOTP kullanılacak. Telefon kaybı için kontrollü kurtarma prosedürü teslim dokümanında açıklanacak.

## Karar 006 — Docker odaklı dağıtım

Uygulama, CMS, veritabanı, reverse proxy ve yedek görevi Docker Compose ile yönetilecek. Veritabanı portu internetten erişilebilir olmayacak.

## Karar 007 — Cloudflare

Alan adının DNS yönetimi Cloudflare üzerinden yapılacak. TLS modu Full (strict) olacak. Yönetim yolları önbellek dışında tutulacak ve uygun güvenlik kurallarıyla korunacak.

## Karar 008 — GitHub deposu

İlk arayüz paketlerinde Git yalnızca yerel sürüm kontrolü için kullanıldı. 21 Eylül 2026 tarihinde kullanıcı `https://github.com/furkantoplu/Portfolio.git` deposunu bildirdi ve push yetkisi verdi. Bundan sonraki sürüm kontrolü bu remote üzerinden de sürdürülebilir.

## Karar 009 — Obsidian ile ortak dokümantasyon

Her anlamlı işlemden sonra geliştirme günlüğü, genel mimari ve karar kayıtları güncellenecek. Proje içindeki not aynası Git'e dahil edilecek; Obsidian klasörüyle eşitlenecek.

## Karar 010 — Görseller

AI ile üretilen görseller arayüz yönünü belirlemek için kullanılabilir. Nihai yayında mümkün olduğunda gerçek fizyoterapist ve gerçek çalışma ortamı fotoğraflarına geçilecek. Kullanılan geçici görseller açıkça kayıt altına alınacak.

## Karar 011 — Ortak ve sabit navigasyon

Ana sayfa ve iç sayfalar aynı header bileşenini kullanacak. Navigasyon viewport'un üstünde sabit kalacak; içerik navbar arkasına girmeyecek şekilde sayfa üst boşluğu ve bölüm kaydırma payı birlikte yönetilecek. İç sayfalarda aktif navigasyon öğesi sayfa bağlamına göre değiştirilecek.

## Karar 012 — Çalışma alanı URL yapısı

Çalışma alanı detayları `/calisma-alanlari/[slug]` düzeninde ilerleyecek. İlk örnek rota `/calisma-alanlari/bel-ve-boyun-sagligi` olarak oluşturuldu. Directus entegrasyonunda aynı slug yapısı korunacak.

## Karar 013 — Blog URL ve yayın durumu

Blog liste sayfası `/blog`, yazı detayları `/blog/[slug]` yapısını kullanacak. Arayüz aşamasında yalnızca detay görünümü tamamlanan yazılar aktif bağlantı alacak. Diğer örnek içerikler bozuk bağlantı üretmek yerine “Yakında” durumuyla gösterilecek. Directus entegrasyonunda yalnızca `status = published` kayıtları ziyaretçiye açık olacak.

## Karar 014 — Ortak footer

Ana sayfa ve içerik sayfalarında footer tekrar yazılmayacak. Marka, alt navigasyon, sosyal bağlantı ve yasal bağlantılar ortak `SiteFooter` bileşeni üzerinden yönetilecek.

## Karar 015 — Mobil navigasyon ve istemci sınırı

Mobil navigasyon 1120 piksel ve altında sağdan açılan panel olarak çalışacak. Panel; Escape, arka alan ve bağlantı seçimiyle kapanacak, açıkken sayfanın arka plan kaymasını engelleyecek. Erişilebilirlik durumları menü düğmesinde açıkça bildirilecek ve kapalı paneldeki bağlantılar klavye odağı almayacak.

Navigasyon bağlantıları `components/navigation.ts`, marka işareti `components/brand-mark.tsx` içinde tutulacak. Etkileşim gerektiren `SiteHeader` istemci bileşeni olabilir; ancak ortak salt veri veya sunucu tarafında kullanılabilecek sunum parçaları istemci bileşeninden dışa aktarılmayacak. Bu ayrım Vinext/React Server Components çalışma ortamında footer gibi sunucu bileşenlerinin gereksiz yere istemci sınırına girmesini önler.

## Karar 016 — Çalışma alanı detay şablonu

Her çalışma alanı `/calisma-alanlari/[slug]` düzeninde ayrı ve paylaşılabilir bir URL kullanacak. Tasarım ve bölüm yapısı `PracticeDetail` bileşeninde ortak tutulacak; her rota yalnızca kendine ait içerik nesnesini ve metadata bilgisini sağlayacak. Bu sayede görsel tutarlılık korunacak, düzeltmeler tek yerden uygulanacak ve Directus entegrasyonunda içerik nesneleri CMS verileriyle değiştirilebilecek.

Arayüz onayı süresince rotalar paketler halinde eklenecek. Mevcut rotalar:

- `/calisma-alanlari/bel-ve-boyun-sagligi`
- `/calisma-alanlari/sporcu-rehabilitasyonu`
- `/calisma-alanlari/ameliyat-sonrasi-surec`
- `/calisma-alanlari/durus-ve-hareket-analizi`

## Karar 017 — Çalışma alanı dizini ve ortak katalog

Tüm çalışma alanları `/calisma-alanlari` dizin sayfasında listelenecek. Üst ve alt navigasyondaki ana “Çalışma Alanları” bağlantısı bu dizine gidecek; ana sayfanın kendi bölüm içi çağrı bağlantıları ise `/#calisma-alanlari` davranışını koruyacak.

Kartlarda, detay sayfalarında ve çapraz yönlendirmelerde gerekli tüm bilgiler Directus `practice_areas` koleksiyonunda tek kaynak olarak tutulur. Eski `components/practice-catalog.ts` dosyası ve dört sabit detay rota dosyası kaldırılmış; liste ve detaylar dinamik veri katmanına taşınmıştır.

Çalışma alanı detaylarında mevcut detay dışındaki üç alan görünür bağlantılarla sunulacak. Böylece içerik keşfi yalnızca tarayıcının geri tuşuna veya ana sayfaya bağlı kalmayacak.

## Karar 018 — Bağımsız kurumsal sayfalar

Ana sayfadaki Hakkımda ve İletişim bölümleri kısa özet olarak korunacak. Ana navigasyon `/hakkimda` ve `/iletisim` bağımsız sayfalarına gidecek. Site genelindeki randevu ve iletişim çağrıları tek hedef olarak `/iletisim` rotasını kullanacak.

Müşteri tarafından doğrulanmayan eğitim, sertifika, adres, telefon veya sosyal medya bilgileri gerçek bilgi gibi yayınlanmayacak. Arayüzdeki geçici bilgiler yayın kontrol listesinde müşteri içeriğiyle değiştirilecek.

## Karar 019 — İletişimde veri minimizasyonu

İlk sürümde iletişim formu bulunmayacak. Telefon, WhatsApp ve e-posta bağlantıları kullanılacak. Site ziyaretçisinden sağlık raporu, tanı, ayrıntılı şikâyet veya başka özel nitelikli kişisel veri web sitesi üzerinden istenmeyecek.

## Karar 020 — Yasal metinlerin taslak durumu

KVKK ve gizlilik sayfaları arayüz onayı için taslaktır; hukuki uygunluk belgesi olarak kabul edilmeyecek. Veri sorumlusu kimliği, işleme amaçları, aktarım tarafları, toplama yöntemi, hukuki sebepler, başvuru kanalı ve teknik sağlayıcılar gerçek veri işleme envanteriyle eşleştirilecek. Aydınlatma ile açık rıza süreçleri gerekiyorsa ayrı ele alınacak. Yayın öncesinde uzman kontrolü zorunlu kabul edilecek.

Resmî referanslar:

- https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-
- https://www.kvkk.gov.tr/Icerik/4132/aydinlatma-yukumlulugunun-yerine-getirilmesinde-uyulacak-usul-ve-esaslar-hakkinda-teblig

## Karar 021 — Backend container ve gizli değer sınırları

- CMS imajı tekrar üretilebilir kurulum için `directus/directus:12.4.0` sürümüne sabitlendi.
- Veritabanı `postgres:16-alpine` üzerinde çalışır ve host sistemine port yayınlamaz.
- Directus geliştirme portu yalnızca loopback adresine (`127.0.0.1`) bağlanır. Production ortamında doğrudan 8055 portu internete açılmayacak; erişim reverse proxy ve özel yönetim yolu üzerinden sağlanacaktır.
- `postgres_data` ve `directus_uploads` named volume'ları container yeniden oluşturulsa bile veriyi korur. Directus eklentileri proje içindeki `directus/extensions` klasöründen salt-okunur bind mount ile yüklenir ve Git ile sürümlenir.
- Örnek değişken adları `.env.example` içinde tutulur. Gerçek parola, secret ve yönetici bilgileri `.env` içinde kalır ve Git'e girmez.
- Yerel yönetici hesabı `admin@furkantoplu.com` adresiyle oluşturulmuştur. Parola dokümanlarda tutulmaz.
- İlk backend paketi yalnızca çalışma altyapısını kapsar. İçerik şeması, editör rolü, alan bazlı yetkiler, TOTP, `/bakir`, yedekleme ve production sertleştirmesi ayrı paketlerde ele alınacaktır.

## Karar 022 — Çalışma alanı yayın ve görünürlük modeli

- Çalışma alanları `practice_areas` Directus koleksiyonunda tutulur; sayıları frontend koduyla sınırlandırılmaz.
- `status` alanı `draft`, `published` veya `hidden` değerini alır. Public frontend yalnızca `published` kayıtları okuyacaktır.
- `hidden` kayıtlar silinmez; listelerde gösterilmez ve doğrudan slug isteğinde bulunamaz/404 davranışı üretir.
- `show_on_homepage` yalnızca ana sayfa seçkisidir. Bir kaydın bu değeri açık olsa bile `status` değeri `published` değilse ziyaretçiye gösterilmez.
- `/calisma-alanlari` sayfası tüm yayınlanmış kayıtları `sort` alanına göre sıralar; ana sayfa yayınlanmış ve `show_on_homepage = true` kayıtları kullanır.
- `slug` benzersizdir ve public URL'nin kalıcı parçasıdır. Yayına çıktıktan sonra değiştirilmesi yönlendirme gerektireceği için panelde açıklama gösterilir.
- Kurulum ve başlangıç verileri `scripts/bootstrap-directus.mjs` ile idempotent biçimde uygulanır. Betik `.env` içindeki yönetici bilgilerini kullanır ve gizli değerleri loglamaz.

## Karar 023 — Public içerik endpoint'i ve Directus 12 lisans sınırı

- Directus 12.4.0 ücretsiz kurulumunda satır bazlı özel permission kuralları lisans kısıtına tabidir. Proje bu ücretli özelliğe bağımlı olmayacaktır.
- Standart `items/practice_areas` koleksiyon API'sine anonim okuma izni verilmez; bu endpoint HTTP 403 döndürür.
- Public site içeriği, proje içinde sürümlenen `directus-extension-website-content` endpoint eklentisinden okunur.
- Eklenti SQL sorgusunda zorunlu `status = published` koşulu uygular, yalnızca açıkça belirlenmiş alanları seçer ve yazma işlemi sunmaz.
- Detay sorgusunda slug Knex parametre bağlama sistemi üzerinden uygulanır; doğrudan SQL birleştirmesi yapılmaz.
- Directus production ortamında doğrudan internete port açmayacak; frontend Compose servis adı üzerinden iç ağdan erişecektir. Yönetim yolu ayrıca reverse proxy/Cloudflare kurallarıyla korunacaktır.
- Vinext Worker ortamı normal container değişkenlerini otomatik devralmadığı için `DIRECTUS_URL`, Vite Cloudflare binding yapılandırmasına eklenir. Docker build varsayılanı `http://directus:8055`, yerel geliştirme varsayılanı `http://localhost:8055` olur.

## Karar 024 — Blog içerik ve yayın modeli

- Blog kayıtları Directus `blog_posts` koleksiyonunda tutulur ve `scripts/bootstrap-blog.mjs` ile idempotent biçimde hazırlanır.
- `status` alanı `draft`, `published` veya `hidden` değerini alır. Public frontend yalnızca `published` kayıtları görebilir; diğer durumlar listeye girmez ve detay isteğinde 404 üretir.
- Blog liste adresi `/blog`, kalıcı detay adresi `/blog/[slug]` olur. `slug` benzersizdir ve yayınlandıktan sonra değiştirilmesi gerekiyorsa yönlendirme planlanmalıdır.
- `featured` alanı öne çıkan yazıyı, `sort` alanı sıralamayı belirler. Ana sayfa en fazla üç yayınlanmış yazı ister; blog sayfası bütün yayınlanmış yazıları gösterir.
- Frontend blog verisini standart anonim koleksiyon API'sinden değil, `directus-extension-website-content` içindeki `/blog-posts` ve `/blog-posts/:slug` salt-okunur endpoint'lerinden alır.
- Public endpoint zorunlu `status = published` filtresi uygular ve yalnızca açıkça seçilmiş alanları döndürür. Yazma işlemi sunmaz.
- Blog gövdesi kontrolsüz zengin HTML yerine yapılandırılmış JSON paragrafları ve öneri nesneleriyle tutulur. Frontend bu değerleri React metni olarak render ederek kayıt içinden script veya ham HTML çalıştırmaz.
- SEO başlığı ve açıklaması kayıt bazında girilebilir; boş bırakılırsa başlık ve kart özeti güvenli varsayılan olarak kullanılır.
- Tarih biçimlendirici Directus'tan gelebilecek yalın tarih ve tam ISO zaman damgası biçimlerini destekler; geçersiz değerde sayfayı çökertmek yerine nötr bir tarih metni gösterir.

## Karar 025 — Directus proje sahibi bilgisi toplama

- Directus 12 yönetim panelindeki proje sahibi e-posta modalı müşteri içerik yönetimi deneyiminde gösterilmeyecektir.
- Directus'un desteklediği `PROJECT_OWNER_ENABLED=false` ortam ayarı Docker Compose içinde varsayılan olarak uygulanır.
- Ayar sahibi bilgisi toplama ve senkronizasyonunu kapatır; lisans denetimini atlatmak, yazılımı yamalamak veya lisans koşullarını değiştirmek amacıyla kullanılmaz.
- Directus sürümünün lisans şartları dağıtım öncesinde ayrıca kontrol edilir. Müşteri veya müşteri kuruluşu güncel ücretsiz kullanım sınırlarını karşılamıyorsa uygun lisans ayrıca temin edilir.

## Karar 026 — Özel yönetim yüzeyi ve güvenli oturum modeli

- Site sahibinin günlük yönetim adresi `/bakir` olur. Directus Studio yalnızca teknik geliştirme ve bakım amacıyla loopback adresinde kalır.
- `/bakir` bir güvenlik sırrı değildir. Yetkilendirme Directus hesabı, güçlü parola, giriş denemesi sınırı ve Google Authenticator uyumlu TOTP ile sağlanır.
- Tarayıcı Directus'a doğrudan farklı origin üzerinden bağlanmaz. Caddy `/bakir-api/*` yolunu Directus'a reverse proxy eder ve yol ön ekini kaldırır.
- Girişte Directus `mode: session` kullanılır. Oturum `httpOnly`, `SameSite=Lax` çerezde tutulur; erişim belirteci localStorage veya frontend state içine yazılmaz.
- Yerel geliştirme HTTP olduğu için `DIRECTUS_SESSION_COOKIE_SECURE=false` kullanılır. VPS'te Caddy/Cloudflare üzerinden HTTPS hazır olduğunda değer `true` yapılmadan production teslimi tamamlanmış sayılmaz.
- `/bakir` HTML yanıtları `Cache-Control: no-store` ve `X-Robots-Tag: noindex, nofollow, noarchive` başlıklarını taşır. Sayfa metadata'sı da aynı indeksleme yasağını uygular.
- TOTP kurulumu otomasyonla tamamlanmaz. Yönetici mevcut parolasını girdikten sonra oluşan gizli anahtarı kendi Authenticator uygulamasına kaydeder ve canlı 6 haneli kodla etkinleştirir.
- TOTP gizli anahtarı, yönetici parolası ve oturum çerezleri loglara, Git deposuna veya Obsidian notlarına yazılmaz.
- İlk özel panel paketi yalnızca giriş, çıkış, içerik özeti ve TOTP kurulumunu kapsar. İçerik CRUD ekranları küçük paketlerle ayrıca geliştirilecektir.

## Karar 027 — Hesap bazlı TOTP ve çoklu yönetici modeli

- Yönetim için ortak kullanıcı hesabı paylaşılmaz. Her yönetici benzersiz e-posta, güçlü parola, ayrı oturum ve kendi telefonuna bağlı TOTP kullanır.
- Panelin TOTP durumu React state tahminiyle değil, Directus veritabanındaki oturum kullanıcısından türetilir.
- `website-content/admin-account` yalnızca kimliği doğrulanmış oturum kullanıcısını döndürür. `tfa_secret` API yanıtından daima çıkarılır; istemciye yalnızca `tfa_enabled` boolean değeri gönderilir.
- `website-content/admin-team` yalnızca `admin_access=true` politikasıyla bağlı kullanıcı veya rollere açıktır. Ekip listesi parola, token veya TOTP gizli anahtarı içermez.
- Yeni yönetici hesabı Directus'un standart kullanıcı servisi üzerinden oluşturulur. Böylece parola hashleme, parola politikası ve aktivite kaydı Directus tarafından uygulanır.
- İlk yönetici yeni hesap için geçici güçlü parola belirler. Yeni yönetici giriş yaptıktan sonra kendi TOTP kurulumunu tamamlar; gizli anahtar başka yöneticiyle paylaşılmaz.
- Yönetici kaldırma veya yetki düşürme işlemi yanlışlıkla erişim kaybı yaratabileceği için bu pakette özel panele eklenmez; teknik Directus arayüzünde kontrollü olarak yapılır ve ileride ayrıca güvenli akış tasarlanır.

## Karar 028 — Özel panel blog düzenleme akışı

- Site sahibinin günlük blog yönetimi Directus Studio yerine `/bakir` içindeki sade editörden yapılır.
- Özel panel yeni bir içerik veritabanı veya ayrı yetkilendirme katmanı oluşturmaz; Directus'un oturum çerezi ve standart item API'sini kullanır.
- Yazı ekleme `POST`, düzenleme ve yayın durumu değişikliği `PATCH` ile yapılır. Bu sayede Directus aktivite geçmişi işlemi yapan yönetici hesabını kaydedebilir.
- İlk sürümde hard delete sunulmaz. Yayından kaldırma `hidden`, üzerinde çalışmaya devam etme `draft` durumuyla yapılır.
- `published` durumuna alınan kaydın tarihi boşsa panel güncel tarihi ekler. Public endpoint yalnızca `published` kayıtları döndürmeye devam eder.
- Blog gövdesi ham HTML veya çalıştırılabilir markup kabul etmez. Yönetici boş satırlarla paragraf ayırır; istemci bunları `{ text: string }` biçimindeki JSON listesine dönüştürür.
- Yeni kayıtta başlıktan Türkçe uyumlu slug üretilir. Benzersizlik Directus/veritabanı kuralıyla da korunur ve çakışma kullanıcıya anlaşılır hata olarak gösterilir.
- Kullanılabilirlik için listede hızlı yayınlama ve gizleme bulunur; tüm alan değişiklikleri formdaki açık kaydet düğmesiyle tamamlanır.

## Git commit yaklaşımı

- Her küçük paket bittikten ve build doğrulandıktan sonra commit oluşturulur.
- Commit mesajları kısa ve yapılan işi açıklayan İngilizce conventional commit biçiminde yazılır.
- Örnek: `feat: add physiotherapy practice areas section`
- Backend başlamadan önce arayüz için ayrı bir dönüm noktası etiketi değerlendirilebilir.

## Yerel çalıştırma komutları

Proje klasörü:

```powershell
cd C:\Users\Lenovo\OneDrive\Desktop\fizyoterapi\frontend
```

Bu bilgisayarda doğrulanan geliştirme sunucusu komutu:

```powershell
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
```

Sunucu başladıktan sonra site `http://localhost:5173/` adresinden açılır. Sunucuyu durdurmak için komutun çalıştığı terminalde `Ctrl+C` kullanılır.

Normal npm komutu ortamda doğru çalışıyorsa kısa biçimi de kullanılabilir:

```powershell
npm run dev
```

Production build kontrolü:

```powershell
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run build
```

## Docker ile çalıştırma

Docker Desktop açıkken proje kökünde:

```powershell
cd C:\Users\Lenovo\OneDrive\Desktop\fizyoterapi
docker compose up -d --build
```

Docker üzerinden site `http://localhost:8080/` adresinde açılır.

```powershell
docker compose ps
docker compose logs -f
docker compose down
```

- `frontend` servisi internete doğrudan port açmaz; yalnızca Compose ağı içinde 3000 portunu kullanır.
- `proxy` servisi Caddy'dir ve varsayılan olarak host 8080 portunu yayınlar.
- Port değiştirmek için PowerShell'de `$env:HTTP_PORT=8081` ayarlanabilir.
- Production domain ve TLS ayarları domain belli olduğunda Caddy ve Cloudflare için ayrıca düzenlenecek.
- Directus ve PostgreSQL aynı Compose dosyasına eklenmiştir. Directus yerelde `http://localhost:8055/admin/` adresindedir; PostgreSQL dışarı port açmaz.
- Yedekleme servisi backend aşamasının sonraki paketinde eklenecektir.
- Parolalar, TOTP secret, Directus key/secret ve PostgreSQL parolası Git'e commit edilmeyecek.

## Güncelleme kontrol listesi

Her paket sonunda:

1. Masaüstü görünüm kontrol edilir.
2. Mobil görünüm kontrol edilir.
3. Production build çalıştırılır.
4. Geliştirme günlüğü güncellenir.
5. Obsidian notları eşitlenir.
6. Yerel Git commit'i oluşturulur.
