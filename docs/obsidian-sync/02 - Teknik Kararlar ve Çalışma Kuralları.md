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

## Karar 029 — Admin bilgi mimarisi ve navigasyon kabuğu

- Yönetim modülleri tek uzun sayfada alt alta dizilmez. Her ana işlev ayrı panel görünümü olarak açılır.
- Masaüstünde sabit sidebar tercih edilir; içerik alanı sidebar yanında bağımsız kayar. Header ekranın üstünde sabit kalır.
- Tablet ve mobilde sidebar ekranı daraltmamak için yatay, kaydırılabilir ve sticky bölüm menüsüne dönüşür.
- Ana bölümler `overview`, `blog`, `practices`, `team` ve `security` kimlikleriyle yönetilir. Yeni modüller aynı navigasyon dizisine eklenerek genişletilir.
- Yetkiye bağlı menüler istemcide gizlenmekle birlikte güvenlik bununla sınırlı değildir; ilgili API endpoint'i sunucu tarafında ayrıca yetki kontrolü uygular.
- Genel bakış yalnızca özet ve kısa yollar içerir. Düzenleme formları kendi çalışma görünümünde yer alır.
- Çalışma alanı yönetimi tamamlanmadan önce navigasyondaki kalıcı yeri hazırlanır; sonraki paket mevcut kabuğu bozmadan bu bölümü doldurur.

## Karar 030 — Çalışma alanı özel editörü

- Çalışma alanı yönetimi sidebar içindeki ayrı `practices` görünümünde yapılır; diğer yönetim modülleriyle aynı uzun sayfada bulunmaz.
- Yeni alanlar varsayılan olarak `draft` ve `show_on_homepage=false` değerleriyle hazırlanır. Yönetici açıkça yayınlamadan public endpoint'e girmez.
- Hard delete sunulmaz. Geçici yayından kaldırma `hidden`, düzenleme süreci `draft` durumuyla yürütülür.
- Ana sayfa görünürlüğü yayın durumundan bağımsız ikinci bir seçimdir. Public ana sayfada görünmek için hem `published` hem `show_on_homepage=true` gerekir.
- Değerlendirme maddeleri satır başına `{ text }`, süreç adımları `{ title, description }`, SSS kayıtları `{ question, answer }` nesnelerine dönüştürülür.
- Süreç ve SSS alanlarında teknik JSON gösterilmez; kullanıcı dostu `Başlık | Açıklama` ve `Soru | Cevap` satır biçimi kullanılır.
- Yeni başlıktan Türkçe karakterleri dönüştüren slug önerilir; benzersizlik veritabanında da korunur.
- Görsel yükleme bu paketin kapsamında değildir. Yeni kayıtlar frontend'in varsayılan görsel davranışını kullanır; mevcut kayıtların görsel alanları editör payload'ı tarafından değiştirilmez.

## Karar 031 — Kurumsal sayfa içerik modeli

- Hakkımda ve İletişim içerikleri frontend kodunda sabit tutulmaz; `site_pages` koleksiyonunda yönetilir.
- Her sayfa `page_key` ile benzersiz tanımlanır. Public endpoint yalnızca allowlist içindeki `about` ve `contact` değerlerini kabul eder.
- Sayfaya özgü değişken yapı `content` JSON alanında, arama motoru metadata'sı ayrı `seo_title` ve `seo_description` alanlarında tutulur.
- Public frontend standart anonim item API'sine erişmez; proje eklentisindeki salt-okunur `/pages/:pageKey` endpoint'ini kullanır.
- Yönetici teknik JSON görmez. Hakkımda paragrafları satır, ilkeler ve iletişim adımları `Başlık | Açıklama` biçiminde düzenlenir; istemci kayıt sırasında JSON nesnelerine dönüştürür.
- Telefon bağlantısı yalnızca `+` ve rakam, WhatsApp değeri yalnızca rakam kabul edecek şekilde istemcide normalize edilir.
- TOTP aktif yöneticiyle otomasyon betiği çalıştırmak için 2FA devre dışı bırakılmaz. Gerektiğinde rastgele geçici statik token yalnızca işlem süresince atanır ve `finally` ile temizlenir; kalıcı token oluşturulmaz.

## Karar 032 — Tek telefon kaynağı ve Vinext bağlantı politikası

- Yöneticiye telefonun görünür ve teknik bağlantı biçimleri ayrı alanlar olarak gösterilmez. Tek `Telefon numarası` alanı içerik kaynağıdır.
- Görünür numara yöneticinin yazdığı okunabilir biçimi korur. `tel:` hedefi `phoneToDialValue` ile boşluk, parantez ve tirelerden arındırılır; Türkiye yerel numarası gerektiğinde `+90` uluslararası biçimine çevrilir.
- Mevcut veriyi ve olası eski istemcileri bozmamak için türetilmiş `phone_value` JSON anahtarı şimdilik saklanır, ancak elle düzenlenmez.
- Ana sayfa ve İletişim sayfası telefon, WhatsApp, e-posta, adres ve çalışma saatleri için aynı `site_pages.contact` kaydını kullanır. Bir alanda iki ayrı içerik kaynağı tutulmaz.
- Vinext `1.0.0-beta.5` altında bağlantı shim'i hem RSC prefetch hem tıklama navigasyonunda çalışma zamanı hatası ürettiği için uygulama içi bağlantılarda `next/link` kullanılmaz.
- İç bağlantılar ortak `NativeLink` bileşeninden semantik `<a href>` olarak üretilir. Böylece tarayıcının yerel tam sayfa navigasyonu kullanılır ve Vinext istemci router'ı devre dışı kalır.
- Tam sayfa navigasyonu istemci yönlendirmesine göre küçük bir performans maliyetine sahiptir; işlevsel güvenilirlik önceliklidir. Vinext kararlı bir sürümde düzeltme doğrulanırsa istemci router'ına dönüş ayrıca test edilerek değerlendirilebilir.

## Karar 033 — Ortak 404 davranışı

- Bilinmeyen genel rotalar, bulunamayan blog yazıları ve bulunamayan çalışma alanları ayrı tasarımlar kullanmaz; kök `app/not-found.tsx` bileşeninde birleşir.
- Kullanıcıya boş veya teknik hata ekranı gösterilmez. Marka navigasyonu korunur ve ana sayfa, çalışma alanları, blog, hakkımda ve iletişim için kurtarma bağlantıları verilir.
- Özel görünüm sunucu durumunu maskelemez. Bulunamayan içerik her durumda gerçek HTTP 404 döndürür.
- 404 sayfası arama indeksine alınmaz; metadata düzeyinde `noindex` ve `nofollow` kullanılır.
- Bulunamayan bir sayfada menü öğelerinden hiçbiri aktif görünmez. `SiteHeader` yalnızca açıkça `active` değeri verilen gerçek bölüm sayfalarında aktif durum gösterir.

## Karar 034 — DevTools çalışma alanı keşif isteği

- Chrome DevTools'un yerel çalışma alanı keşif isteği olan `/.well-known/appspecific/com.chrome.devtools.json`, ziyaretçi içeriği veya uygulama rotası değildir.
- Bu kesin yol Caddy katmanında HTTP 204 ile sonlandırılır; frontend'e ve özel 404 sayfasına iletilmez.
- Kural yalnızca tam yol eşleşmesidir. ACME, güvenlik doğrulaması veya ileride kullanılabilecek diğer `/.well-known/*` yollarını kapsam dışı bırakır.
- Rastgele ziyaretçi URL'leri bu istisnadan etkilenmez ve gerçek HTTP 404 davranışını korur.

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

## Karar 035 — Arama motoru keşif rotaları

- `robots.txt` bir güvenlik mekanizması değildir; yönetim yolları ayrıca kimlik doğrulaması, güvenli çerezler, cache engeli ve production rate-limit kurallarıyla korunmaya devam eder.
- `/bakir`, alt yolları ve `/bakir-api/` iyi niyetli arama motoru tarayıcılarına kapatılır; public içerik taramaya açık kalır.
- Sitemap yalnızca ziyaretçinin gerçekten açabildiği public ve yayınlanmış URL'leri listeler. Taslak, gizli veya bilinmeyen içerik eklenmez.
- Mutlak sitemap ve robots URL'leri tek `SITE_PUBLIC_URL` kaynağından üretilir. Production değerinde HTTPS protokolü ve gerçek canonical domain zorunludur.
- Directus kesintisinin sabit site keşfini de bozmasına izin verilmez; dinamik kayıtlar alınamazsa sitemap sabit public URL'lerle yanıt vermeye devam eder.

## Karar 036 — Hero karakter varlığı ve 3D derinlik yaklaşımı

- Kullanıcı fotoğrafından üretilen şeffaf 3B karakter ayrı ve sürümlü bir PNG olarak saklanır; özgün fotoğraf veya önceki hero varlığı üzerine yazılmaz. Güncel onay adayı `furkan-toplu-hero-3d-v3.png` dosyasıdır.
- Kişinin yüz kimliği, ifadesi ve pozu korunur; foto-gerçekçi yüzey yerine açıkça modellenmiş sinema/oyun karakteri estetiği tercih edilir.
- Karakter dikdörtgen fotoğraf kartı içine alınmaz ve sahne arka planı görselin içine gömülmez. Renk, gölge, ışık halesi ve derinlik web arayüzünde CSS ile kontrol edilir.
- Karakter `contain` ve alt merkez hizasıyla render edilir. Framework'ün varsayılan `cover` davranışına güvenilmez; aksi halde portre ekran oranına göre yüz kadraj dışında kalabilir.
- 3D hissi için ağır WebGL veya Three.js bağımlılığı eklenmez. Perspektif, katman, ışık halkası, gölge ve sınırlı hover dönüşümü CSS ile sağlanır.
- Karakter dekoratif arayüz katmanlarının ve sabit navbar'ın üzerinde çizilir; hero görsel alanında onu navbar altında bırakan ayrı bir stacking context oluşturulmaz. Görsel katman `pointer-events: none` kaldığı için önde görünmesi navigasyon etkileşimini engellemez.
- Karakterin alt kenarı başka bir bölümün zeminine değdirilmez ve sert biçimde kırpılmaz. Çok kademeli CSS alfa maskesiyle hero içinde saydamlığa eritilir; devam eden gövde izlenimi verilirken sonraki bölüm temiz bırakılır.
- Hareket yalnızca yardımcı görsel etkidir; içerik ve navigasyon işlevi animasyona bağlı değildir. Hareket azaltma tercihi proje genelinde korunur.

## Karar 037 — Çok dilli içerik ve Türkçe admin

- Ziyaretçi dilleri `tr`, `en`, `de`; admin arayüzünün dili yalnızca Türkçedir. İçerik dili seçimi panelin arayüzünü değiştirmez.
- Dil URL ile belirlenir. Mevcut Türkçe rotalar korunur; EN/DE alt dizinleri ve dile özgü sabit sayfa adları kullanılır. Tarayıcı diline göre zorunlu yönlendirme yapılmaz.
- Aynı sayfanın dilleri ortak bileşenleri kullanır. Sabit metinler sözlükte, yönetilen editorial metinler çeviri tablosunda tutulur. Kaynak içerik üzerinde tarayıcıda sonradan metin değiştiren bir çeviri katmanı kullanılmaz.
- Türkçe kayıt ana kayıttır. Yeni yazı/alan önce kaydedilir; EN/DE sekmeleri ana kayıt oluşunca kullanılabilir. Ortak görsel, iletişim değerleri, sıralama ve tarih bilgileri çoğaltılmaz.
- EN/DE blog ve çalışma alanı için ana kayıt ve çeviri ayrı ayrı yayında olmalıdır. Taslak/gizli çeviri başka dildeki listede fallback olarak gösterilmez. Dil seçicisinde olmayan çeviri bağlantısı pasif olur.
- Çeviri yazma endpoint'leri aktif tam yetkili Directus yöneticisini kontrol eder. Kullanıcıdan gelen koleksiyon, dil, kayıt kimliği, durum, URL adı ve JSON metin/listeleri doğrulanır. Genel koleksiyon veya yönetici alanları bu API ile güncellenemez.
- Çeviri tablosu uygulama ilişki doğrulamasıyla ana kayıtları referans alır; public çıktı sadece gerçekten mevcut/yayındaki ana kayıtlar üzerinden üretilir. Ana kaydı olmayan bir çeviri public sayfa oluşturamaz.
- Docker migrasyonları tekrar çalışabilir ve mevcut çevirileri ezmez. Servisin başarıyla tamamlanması frontend başlangıcının ön koşuludur. Temel Directus koleksiyonlarının ilk kurulumu README'deki bootstrap adımıdır.
- Yasal metin çevirileri henüz bu pakette sunulmaz; Türkçe belgelere giden yabancı dil bağlantıları bunu açıkça belirtir. İçerik çevirileri yayına çıkmadan önce site sahibi tarafından kontrol edilir.

### Karar 038 — Tam sayfa içerikleri, ortak görseller ve açılır dil menüsü

- Sayfa editörü Ana sayfa/Hakkımda/İletişim/Çalışma alanları/Blog sekmelerini içerir; liste sayfası metinleri tek tek yazı metinlerinden ayrı yönetilir. Sayfa tasarımının düzeni ve CSS admin paneline taşınmaz.
- Ana sayfa 3D karakter ve bölüm portresi ayrı alanlardır. Hakkımda sayfasının portresi de ayrı yönetilir. Blog ve çalışma alanı görselleri kendi kaydında saklanır ve liste/ana sayfa/detayda ortak kullanılır.
- Dosya seçimi panelden yapılır; dosya yolu yazdırılmaz. Yükleme sonrasında kaydetme gereklidir. Şeffaf ana karakter için PNG kullanılır; JPG/PNG/WebP desteklenir, boyut limiti 10 MB'dir.
- Yeni uploadlar kalıcı Directus volume'üne gider. Veritabanı ve uploads volume'leri VPS taşınmasında frontend imajına ek olarak taşınır. Dosya silme bu pakette yoktur; içerikten kaldırma geri dönüşsüz dosya silmez.
- Medya için genel public dosya izni açılmaz. Özel public endpoint UUID, yayın referansı ve MIME allowlist kontrol eder; admin önizleme normal Directus yetkili varlık uçlarını kullanır.
- Görseller ortak Türkçe kayıtta, içerik çevirileri EN/DE tabloda tutulur. Çeviri beyaz listesi görsel yolunu değiştiremez.
- Dil düğmesi mevcut dilin tam adını gösterir; tıklama seçenekleri altına açar. Dışarı tıklama/Escape kapatır; mevcut sayfa dil eşleştirmesi ve yayımlanmamış çeviri pasifliği korunur.
- İletişim kartları ana sayfa ve ayrı iletişim sayfasında farklı CSS kapsamlarına sahiptir; çakışan `.contact-details` yerleşimi ayrıştırılır. Blog okuma bağlantıları 16 px ve en az 44 px tıklama yüksekliğine çıkarılır.

### Karar 039 — QR ile Authenticator ekleme

- QR yalnızca Directus'un hesap için döndürdüğü `otpauth://totp` bağlantısından üretilir; URL secret değeri aynı yanıtın secret değeriyle eşleşmelidir.
- Yerel `qrcode@1.5.4` üretimi kullanılır. QR için dış web servislerine, resim optimizer'a veya public upload alanına hesap anahtarı gönderilmez.
- QR tarama ve elle anahtar girme iki alternatif kayıt yöntemidir; her ikisinde de etkinleştirme altı haneli kodla Directus üzerinden yapılır. Aktif 2FA sıfırlanmaz veya anahtarı yeniden gösterilmez.
- QR/anahtar state'i başarı/çıkışta silinir. TFA isteği devam ederken çıkış engellenir. Manuel anahtar alternatifi QR üretim sorunu halinde açık kalır.
- Kurulum formunda parola ve OTP kontrolleri gerçek HTML form içindedir. QR okunabilirlik testleri sahte URI'yi geri okuyup tam eşleşme kontrolü yapar; gerçek hesaplar üzerinde etkinleştirme testi otomatik yapılmaz.

### Karar 040 — Çalışma alanı adı tek kaynak, URL otomatik

- Kart adı ve detay ana başlığı `title` alanından gelir; hero metinleri kaybedilmeden alt başlık olarak tutulur.
- Çalışma alanı slug'ı TR/EN/DE ilgili başlıktan türetilir. Panel URL'yi salt okunur gösterir; veritabanı tetikleyicisi farklı Directus yazımlarında da otomatik kuralı uygular. Blog slug'ı bu kuralın dışındadır.
- Türkçe/Latin işaretler sadeleştirilir, küçük harf/rakam/tire kullanılır. Çakışma durumunda kayıt kimliği eki üretilir; aynı dil/base için transaction advisory lock seri seçim sağlar.
- İsim değişirken eski slug alias tablosuna kaydedilir. Alias mevcut yayımlanmış dil sürümüne çözülür ve frontend 308 ile güncel canonical'a yönlenir; eski URL'leri başka alan devralamaz.
- URL normalizasyonu mevcut isimleri değiştirmez. Veritabanı testleri ayrı transaction içinde kayıt ekleyip rename/çakışma/geçmiş durumlarını doğrular ve geri alınır. Gerçek hesap erişimini değiştirmek test adımı değildir.

### Karar 041 — Kendi hesabı dışında yazım yok

- Profil hedefi yalnızca authenticated user'dır; request id/role/status/policies/TFA alanları kabul edilmez. Ad/soyad ve giriş bilgileri ayrı politikayla saklanır.
- Mevcut parola ve etkin TOTP onayı zorunludur. E-posta/parola değişince yalnızca actor'ın tüm session'ları kapanır; isim değişiminde oturum korunur. Güncelleme/clear session birlikte commit edilir.
- Genel full-admin user yazımı yalnızca UI'de gizlenmez: users.update/users.delete hook'u cross-account hedefleri ve bulk karma hedefleri engeller. Null accountability dahili auth işlemleridir; public panel yazımı bu yoldan yapılmaz.
- Public bakir-api sadece gerekli yol/metotları geçirir. Genel kullanıcı/rol/GraphQL/system user yolları kapalıdır. Directus teknik portu loopback'tir. Takım ekleme kontrollü create-only endpoint olup mevcut kullanıcıyı hedefleyemez.
- Parola/OTP gerçek verileri testte veya hata çıktılarında kullanılmaz. Servis hataları güvenli Türkçe mesajlara eşlenir. Gerçek parola değiştirme otomasyonla yapılmaz.
- Navbar'da dil seçici gerçek DOM sırasıyla en sağa alınır; yalnızca CSS order ile klavye sırası farklılaştırılmaz.

### Karar 042 — İçerik ve görünürlük ayrı, dillerde ortak

- Sayfa bölümleri frontend koşullu render ile gösterilir/gizlenir; gizli bölüm başlığı, boş görsel slotu veya TOC bağlantısı bırakılmaz. Alan adının yanında anahtar vardır; ayrı metin alanı olmayan bölümler isim/anahtar satırını kullanır. Anahtar form kaydıyla uygulanır, metin/görsel silmez.
- Ortak `section_visibility` haritasının eksik anahtarı görünür, strict boolean false kapalıdır. Mevcut içerikler migrasyonla gizlenmez. Harita sayfalarda content içinde, alan/yazılarda ayrı JSONB'de saklanır. Config çift kopyası otomatik testle eşitlenir; yeni bölüm eklendiğinde iki kaynak/runtime kopyası birlikte güncellenmelidir.
- Görünürlük dile özel metin değildir; TR/EN/DE ortak düzen bilgisidir. Çeviri metninden override edilmez. Çeviri kaydıyla bayrak yazımı atomiktir, sayfa JSON yoluna yazım diğer ortak metinleri ezmez. Üst bölüm altlarını saklar, alt bayrağı/çeviriyi silmez.
- Görsel bayrağı aynı kaydın tüm kart/detay kullanımlarına uygulanır. İletişim yöntemleri aynı ortak haritayı ana sayfada kullanır. Blog öne çıkanın kapalı olması ilk kaydı arşivden çıkarmaz; TOC yalnızca görünen hedefleri gösterir. H1/ortak gezinme/sabit uyarılar korunur.
- Gizleme erişim kontrolü değildir; API ve dosya URL'si public kalabilir. Hassas içerik güvenliği için yayın/yetki tasarımı gerekir. Sayfanın URL/sitemap/SEO ve kayıt yayın durumu ayrı özelliklerdir.
- Canlı metin/görsel veya gerçek hesapları değiştirmeyen sahte render/transaction testleri tercih edilir. UI yardımcı çalışmazsa görsel QA tamamlanmış gibi yazılmaz; başarısızlık ve kalan doğrulama açıkça kaydedilir.

### Karar 043 — Ana karakter değişimi aynı cutout mimarisinde

- Kullanıcı gerçek fotoğrafı yeni ana karakter olarak seçtiğinde sadece asset/default/CMS görseli değiştirilir; mevcut perspektif/gölge/katman/alt fade altyapısı korunur. Şeffaf belden yukarı PNG kullanılır, arka plan/klinik objeleri asset'e dahil edilmez.
- Bu 3D model değildir; şeffaf kişinin sayfa önünde görünmesi ve CSS derinliğiyle 3D hissidir. Kimlik korunması image edit prompt'unda istenir; otomatik üretimin müşteri onayı gerekir.
- Asset yeni sürümlü dosyadır; eski asset silinmez. Yerleşik image_gen varsayılandır; prompt/yöntem projede kaydedilir, proje resmi yalnız generated_images altında bırakılmaz. Alfa kanalı kopyalamada korunur; inceleme testi 252–253 alfa gövdeyi yakın-opak kabul eder.
- Varsayılan fotoğraf değiştirme migrasyonu yalnızca eski bilinen yolları hedefler; sonradan yapılmış özel görsel/metin veya görünürlük yazımlarını ezmez. Yeni kurulum ve mevcut DB ortak migrasyonla eşitlenir. Alt açıklamalar gerçek yeni kıyafet/ifadeye ve dillerine uyarlanır.

### Karar 044 — Kart ölçüsü içeriği kesmeden eşitlenir

- Çalışma alanı kartları aynı ızgarada eşit genişlik/yükseklik kullanır; görsel varlığı veya kısa açıklama daha kısa kart oluşturmaz. Grid auto rows 1fr/stretch ve minimum ölçü kullanılır; sabit max-height veya metin line-clamp yoktur.
- En uzun içerik tüm satırların ortak yüksekliğini belirler. Responsive kolon sayısı korunur; metin min-width 0/overflow-wrap ile taşmaz. Footer son satıra/auto margin ile en alta bağlanır. Görselsiz kartta foto slotu saklanmaz, ikon/metin kullanılabilir alanı dengeler.
- PostCSS sözleşme testleri gerçek tarayıcı ölçümü yerine geçmez. UI yardımcı başarısızsa bu sınır günlüğe/final duruma yazılır. CMS içeriği yalnız yerleşim düzeltmesi için değiştirilmez.

### Karar 045 — Fotoğraf son güncel kullanımdan sonra kalıcı silinir

- Kaldırma/değiştirme Kaydet sonrası uygulanır; Kaydet öncesinde canlı fotoğraf silinmez. Fotoğraf yalnız son güncel referans kalkınca dosya/thumbnail/DB satırıyla kalıcı temizlenir. Görünürlük, draft veya hidden durum kullanım olmaktan çıkarmaz.
- Yalnız bilinen site yüklemeleri registry'de izlenir; keyfi dosya kütüphanesi wipe yok. Yeni upload marker'lıdır; 24 saat kaydedilmeyen yükleme otomatik temizlenir. Aynı oturumda vazgeçilen pending upload sadece kendi uploader'ı aktif admin olarak erken discard edebilir. Paket/default repo görselleri kapsam dışıdır.
- DB trigger ve collector aynı file row kilidini kullanır; çoklu UUID sıralı kilitlenir. Referans son kontrolünden sonra FilesService dış transaction'da çağrılır. Storage hatası DB'yi rollback edip tekrar denemeye olanak sağlar. Eşzamanlı save-delete ya kullanımı korur ya geçersiz save'i reddeder.
- İçerik olayları ve dakikalık schedule birlikte çalışır; olaylar üst üste gelince son değişiklik kaybolmaz. Genel DELETE files API'si açılmaz. Server sahiplik/kullanım kontrolü frontend düğmesinden bağımsızdır.
- Kalıcı silme geri dönüşlü bir visibility ayarı değildir. Revizyon geçmişindeki URL fotoğrafı kurtarmaz; eski yedekler/audit metinleri farklı saklama kapsamıdır. Metin revizyonları bu özellik için silinmez. Yeni string-medya koleksiyonu eklenirse referans taraması/trigger kapsamı büyütülmelidir.
- Test gerçek dosya silmeyi yalnız yeni oluşturduğu yapay PNG/orijinal/varyantlar üzerinde yapar. Gerçek kullanıcı dosyaları ve hesaplar test için değiştirilmez; işlem sonunda kesin ID'lerle test verisi temizlenir.
- Fiziksel storage ve DB atomik değildir: retired_at storage'dan önce ayrı transaction'da persist edilir. Kısmi silme hatasında metadata rollback olurken işaret kalır, yeni referans reddedilir ve grace beklemeden retry yapılır. DB satırı yeniden var diye fiziksel olarak hasarlı dosya tekrar yayına bağlanamaz.

### Karar 046 — Mobilde portre akışta, menü sağda

- Masaüstü yüksek z-index/perspective/scale mobilde aynı biçimde uygulanmaz. Mobil portre own stacking context/relative aspect-ratio ile normal akıştadır; metin ve konum kartlarını örtmez. Dekorlar mobilde azaltılır, alt fade korunur.
- Navbar DOM sırası dil → mobil menü olmalıdır. Tam dil adı desktop/aria'da, TR/EN/DE görsel kısaltması mobilde kullanılır. Menü/dil popover birlikte açık kalmaz. Minimum 44 px kontrol ölçüsü korunur.
- Kaldırılan bölümün public render/editör/config/CSS'i birlikte kaldırılır; eski görünürlük haritası kaydetmeyi bozmamalıdır. Veri kaybı gerektirmeyen pasif eski CMS alanları için geniş silme migrasyonu yapılmaz.
- Kullanıcı limit nedeniyle küçük paket istediğinde bağımsız istekler sıraya yazılır ve hangi paket yapıldığı açıkça teslim edilir. CSS sözleşme testi gerçek mobil ekran ölçümü yerine geçmez; tam dinlenemeyen video dinlenmiş gibi sunulmaz.

### Karar 047 — Footer ayarı tüm dillerde ortak, bağlantılar güvenli

- Footer kendi site_pages kaydı ve sidebar editöründe yönetilir; ayrı dil sürümleri yoktur. İç menü hedefleri mevcut localizeHref rotalarıdır, URL yeniden adlandırma ayarı değildir. Sosyal hesap URL/visibility ve menü visibility birlikte kaydedilir.
- Boş/gizli bağlantı # placeholder üretmez. Kullanıcı verisi HTML olarak basılmaz; yalnız bilinen HTTPS URL'leri gösterilir, credentials ve diğer protokoller elenir. Dış URL fetch edilmez; target blank noopener/noreferrer kullanılır.
- Public endpoint sadece normalize edilmiş link/boolean bilgisini verir. Yazım mevcut native items auth/policy üzerindedir. Raw teknik CMS yazımı frontend form kontrolünü bypass edebilir; public filtre bu durumda da unsafe href göstermez.
- Tek SiteFooter bütün sayfalarda uygulanır; 404 dahil footer veri hatası güvenli fallback alır. Çoklu linkler mobilde sarılır. Yasal link görünürlüğü belgeyi silmek veya içeriğin gerekliliği hakkında karar değildir.
- Yeni config migrasyonu mevcut düzenlemeyi ezmez. Gerçek sosyal adres bilinmeden demo hesap uydurulmaz. Form/renderer testleri gerçek admin submit veya screenshot QA yerine geçmiş gibi anlatılmaz.

### Karar 048 — Genel not kaldırma gerçek içerik silme değildir

- Kullanıcının kaldırılmasını istediği genel UI notları component/config/CSS'ten birlikte emekli edilir; eski visibility anahtarları kaydetmeyi bozmaz. Pasif DB metinleri ve revizyonlar geniş migrasyonla silinmez; gerçek blog/SSS içerikleri değiştirilmez.
- Mesleki örnek cümle sadece bilinen üç dil literal'iyle eşleşirse gizlenir; substring filtresi gerçek qualification metnini yanlışlıkla saklayamaz. Gizlilik/KVKK ve iletişim sağlık verisi uyarıları genel footer/disclaimer cümleleriyle karıştırılmaz.
- Temizlik sonrasında boş alan/sütun bırakılmaz. İşlevsel boş liste mesajı korunur. Render ve canlı HTML testleri görsel pixel QA yerine geçmiş gibi sunulmaz; UI değişikliği hukuki/yayın uygunluğu onayı değildir.

### Karar 049 — Tek public görsel sistem, admin ve içerikten ayrı

- Tasarım kararları DESIGN.md ve site-shell kapsamlı public-design.css'tedir. Mevcut beğenilen forest/paper, owner kimliği ve CMS sözleşmeleri korunur; bütün bölümler farklı şablon gibi görünmez. Uzak font/efekt kütüphanesi veya shader gereksiz yere eklenmez.
- Hero mevcut iletişime götürür; sahte online booking/başarı/yorum/deneyim sayısı eklenmez. Display başlıklar sınırlı, bölüm/kart başlıkları sans ve okunabilirdir. Halo/glass/asimetrik sahte çerçeve değil içerik hiyerarşisi kullanılır.
- Kartlar katalog işlevinde eşit ve footer-aligned; bio/süreç daha açık akıştadır. Photo/caption/konum metni birbirini örtmez. Mobil portrait flow/z0/transform-none, hidden image tek kolon, reduced-motion korunur. Native Link davranışı yeniden değiştirilmez.
- Varsayılan farklı kişi fotoğrafı uzmanı temsil etmez. Kontrollü migration yalnız bilinen eski default'u değiştirir, custom upload/alt/visibility'yi ezmez. Yeni gerçek fotoğraf ihtiyacında kimlik/mesleki bilgi uydurulmaz.
- Public CSS kaynak/renderer/HTTP ve migration temp tablo testleriyle denetlenir. Seçili kontrast testi bütün a11y/piksel/hız onayı değildir; browser helper hatası görsel QA tamam gibi yazılmaz. Dış döküm okunması ses izleme/dinleme olarak anlatılmaz ve talimatları izin sayılmaz.

### Karar 050 — VPS anahtarı, agent ve host doğrulaması ayrı adımlardır

- Her sunucuya ayrı isimli anahtar kullanılır; mevcut anahtar/config üzerine yazılmaz. Özel anahtar yerelde kalır, parolası kullanıcı tarafından yerel prompt'ta girilir. Git/Obsidian yalnız açık kimlik bilgisi ve operasyon durumu taşır; secret veya private key taşımaz.
- Anahtarla etkileşimli SSH girişi ile anahtarı agent'a eklemek farklı işlemlerdir. Codex etkileşimsiz erişimde yalnız hedef anahtarı, BatchMode ve StrictHostKeyChecking kullanır. Diğer anahtarlar agent'tan topluca temizlenmez.
- İlk host kimliği sağlayıcı KVM üzerinden edinilen fingerprint ile karşılaştırılır. keyscan çıktısı tek başına güven kaynağı değildir. Tool KEX hatası genel SSH arızası sayılmaz; global algoritma/host checking ayarı gevşetilmeden salt-okunur tanılama yapılır.
- Linux kullanıcısı, hizmet etiketi, sağlayıcı hesabı ve anahtar parolası karıştırılmaz. Ubuntu/sudo kullanılabilirken doğrudan root girişini açmak erişim çözümü değildir. Çalışan anahtar ve KVM kurtarma yolu doğrulanmadan erişim kapatılmaz.
- Erişim kontrolü tamamlanması yayın tamamlanması değildir. Docker kurulumu, DB/upload aktarımı, gerçek domain/HTTPS, IPv4/IPv6/port sınırları ve yedek/restore ayrı doğrulanır; yapılmayan iş tamam diye not edilmez.

### Karar 051 — Host hazırlığı uygulama ve DNS yayını değildir

- Kullanıcının sunucu → site/veri → domain/Cloudflare sırası korunur. Fresh-server bootstrap yanlış OS/mimari, eksik test edilmiş key veya çalışan container durumunda durur. Uygulama/DB/DNS hiçbir host setup komutunun yan etkisi değildir.
- Uzun apt işi systemd altında bağımsız çalışır; bekleme transport'u kesilirse unit/journal kontrol edilmeden başarısız diye tekrar başlatılmaz. dpkg lock silinmez, otomatik update kesilmez. Config yedeklenir, paket conffile korunur, phased rollout zorlanmaz. Gelecek başlatıcı --no-block kullanır.
- Password SSH ve root SSH kapatma yalnız anahtar/KVM doğrulandıktan sonra yapılır. Console parolası korunur, ortak client config ve diğer sunucu anahtarları silinmez. Docker yönetimi sudo ile kalır; Docker TCP API veya yeni grup üyeliği açılmaz.
- UFW tek başına Docker yayımlanan port güvenliği değildir. Supported iptables/DOCKER-USER + kendi zinciri, conntrack original port ve WAN-interface seçimi kullanılır. Docker'ın zincirleri flush edilmez; runtime restart/boot ve dış negative-port testleri gereklidir. IPv6 yalnız config var diye dış ağdan geçti sayılmaz.
- Disk için container/journal rotasyonu ve emergency swap tanımlanır; bu tüm disk/DB/upload limit garantisi değildir. Keyfi prune/volume wipe/otomatik reboot yok. Periyodik app backup/restore ve retention, gerçek veri taşındıktan sonra ayrı kurulmalıdır.
- Geçici ağ fixture'ı düşük kaynaklı, no volumes ve açıkça production olmayan yapıdadır. Test sonrası yalnız fixture container/ağı/imajları kaldırılır. Plaintext TCP443 testi TLS onayı değildir; gerçek SSL ve admin HTTPS kabul testi domain aşamasına kalır. TLS öncesi admin giriş testi özel SSH tüneliyle yapılır.
- Server setup dosyaları Linux LF ile version-control edilir; `.env`/private key/parolalar tutulmaz. Yapılan kontroller ve henüz yapılmayan app/DNS adımları aynı teslim notunda ayrılır.

### Karar 052 — Kalıcı içerik silme gizlemekten ayrı ve tek kayıtlıdır

- Blog/çalışma alanı Sil, native modal + ad görünümü + SIL yazılı onay ile yapılır; gizleme geri dönüşlü kalır. Taslak dahil mevcut kaydı siler, kaydedilmemiş formu değil. Çift submit, busy sırasında iptal ve çeviriyle eşzamanlı UI işlemi engellenir. Request başarısızken kayıt UI'dan kaldırılmış sayılmaz; refresh hatası ile silme hatası ayrıdır.
- Proxy DELETE yalnız iki içerik koleksiyonunun numerik tek ID'sini geçirir, auth Directus'a aittir. Body/filter/bulk/static pages/users/files delete açılmaz. Onay UI güvenlik yetkisi değildir; server ACL bağımsızdır. Gerçek kullanıcı içerikleri doğrulama için silinmez.
- Polymorphic translations için parent guard/row lock ve parent delete cleanup aynı DB transaction'ında olmalıdır. Custom translation writer parent'ı child'dan önce kilitler; shared visibility aynı transaction'da kalır. Native/teknik parent silme de çeviri bırakmaz; yok olmuş parent 404 ile bildirilir. Old aliases mevcut FK cascade'le silinir.
- İçerik kaldırma sonrası medya son güncel referansa göre temizlenir; shared/draft/hidden kullanımı korunur. Orijinal/metadata/registry fiziksel temizliği kendi fixture'ıyla doğrulanır. Static repo asset'leri, audit/revision ve eski yedekler ayrı kapsamdır; genel güvenli-imha veya tüm geçmiş purge iddiası yapılmaz.
- SSR/source/pure helpers testleri gerçek browser modal focus/piksel QA yerine geçmez. Computer helper başarısızlığı açık yazılır. Geçici test account/token/content dosyaları finally temizlenir; müşteri kimlikleri/fotoğrafları veya parolaları değiştirilmez. Frontend/SQL/proxy kaynakları ve Obsidian birlikte tutulur; VPS yayın aşaması ayrı kalır.

### Karar 053 — Fill görselinde gerçek inline stil de test edilir

- Framework fill img'nin varsayılan inline object-fit:cover stili CSS contain'i ezer. Tam görsel gösterilecek Hakkımda sayfası ve ana sayfa Hakkımda slotları explicit style contain kullanır; dosya/admin kaynağı veya üstteki 3D ana sayfa karakteri değiştirilmez. Her slotun gerçek bileşeni ayrı regression ile kapsanır.
- Sadece img stub veya stylesheet kuralına bakmak kırpılmama kanıtı değildir. Gerçek yüklü renderer ile HTML inline stil, default/upload kaynak ve hidden frame; canlı üç dil route çıktısı denetlenir. HTML testi gerçek piksel ekran QA yerine geçirilmez.

### Karar 054 — Hizmet kapsamı teyitli, içerik importu silmeleri geri almaz

- Genel AI/üçüncü taraf klinik listesi kişisel hizmet/yetkinlik kanıtı değildir. Altı alan kapsamı kullanıcıdan açık teyit gelince yayımlanır. Jargon yerine günlük ve profesyonel başlık; TR/EN/DE anlam eşdeğerliği, özgün detay ve fotoğrafsız payload. Tedavi sonucu, uzmanlık diploması, cihaz veya süre uydurulmaz.
- Manuel katalog importu transaction + advisory lock + boşluk kontrolü + kalıcı bir defalık marker kullanır. Otomatik başlangıca bağlanmaz; admin'in sonraki edit/delete işlemleri tekrar seed ile ezilmez. Diğer koleksiyon/hesap/medya değiştirilmez, kimlik dizileri resetlenmez.
- Müşteri dekor talebi tasarım brief'inde dar istisna olarak kaydedilir: tek mat arka kemer/ince kontur, glow/orbit/slogan değil. Mobilde metin/figure katmanı ve hidden image korunur; CSS dekor pointer almaz ve veri/uzmanlık iddiası taşımaz. Kayıt sayısına özel grid responsive kuralları ayrı test edilir.
- İlk katalog smoke mevcut yayın içeriği için sıkı karşılaştırmadır; admin sonra düzenlerse bu test kodu içeriği geri yazmaz. HTTP/DOM/CSS testi gerçek ekran QA yerine geçirilmez. İçerik/çeviri klinik sahibinin nihai gözden geçirmesine açık tutulur.

## Güncelleme kontrol listesi

Her paket sonunda:

1. Masaüstü görünüm kontrol edilir.
2. Mobil görünüm kontrol edilir.
3. Production build çalıştırılır.
4. Geliştirme günlüğü güncellenir.
5. Obsidian notları eşitlenir.
6. Yerel Git commit'i oluşturulur.
