# Fizyoterapist Portföy Sitesi

Fizyoterapist portföyü ve blogu için geliştirilen React/TypeScript tabanlı web sitesi. Frontend, Directus içerik yönetimi ve PostgreSQL veritabanı aynı Docker Compose mimarisinde çalışır.

## Docker ile çalıştırma

Docker Desktop açıkken proje kökünde:

```powershell
docker compose up -d --build
```

Site: `http://localhost:8080/`

Özel yönetim girişi: `http://localhost:8080/bakir`

Dil seçimi navbar'daki TR / EN / DE bağlantılarıyla yapılır. Türkçe adresler korunur; İngilizce ana sayfa `/en`, Almanca ana sayfa `/de` adresindedir. Menü ve içerik bağlantıları seçilen dilde devam eder. Dil tercihi URL ile taşınır; tarayıcı diline göre zorunlu yönlendirme uygulanmaz.

Admin paneli tamamen Türkçedir. Blog, çalışma alanları ve sayfa içerikleri editörlerinde Türkçe / İngilizce / Almanca sekmeleri vardır. Yeni içerik önce Türkçe ana kayıt olarak kaydedilir; ardından çevirileri eklenir. Her çeviri Taslak / Yayında / Gizli durumlarından birine sahiptir. İngilizce/Almanca bir blog yazısı veya çalışma alanı ancak hem ana kayıt hem çeviri yayındaysa listelenir. Görsel, sıralama, telefon ve e-posta ortak kayıttan gelir.

Compose içindeki `content-migrations` servisi çeviri tablosunu ve mevcut Hakkımda/İletişim kayıtlarına başlangıç çevirilerini hazırlar. Başarıyla tamamlanmadan frontend başlamaz. Kurulum tekrar çalıştırılabilir; mevcut çevirilerin üzerine yazmaz. Yeni bir veritabanında önce `docker compose up -d database directus` ile temel servisleri başlatın, aşağıdaki bootstrap komutlarını çalıştırın, ardından `docker compose up -d --build` kullanın.

Başlangıç arayüzü ve Hakkımda/İletişim çevirileri hazırdır. Blog ve çalışma alanlarının İngilizce/Almanca metinleri panelden ayrıca girilip yayımlanmalıdır. Yasal belge bağlantıları şimdilik Türkçe belgelere gider; diğer dillerde bağlantı metninde bu belirtilir.

Directus teknik yönetim arayüzü geliştirme sırasında yalnızca bu bilgisayardan `http://localhost:8055/` adresinde erişilebilir.

İlk çalıştırmadan önce `.env.example` dosyasını `.env` adıyla kopyalayın ve örnek parolaları değiştirin. Bu depodaki yerel `.env` Git tarafından yok sayılır.

Directus çalışma alanları koleksiyonunu ve başlangıç kayıtlarını idempotent biçimde kurmak için servisler başladıktan sonra:

```powershell
node scripts/bootstrap-directus.mjs
node scripts/bootstrap-blog.mjs
node scripts/bootstrap-site-pages.mjs
node scripts/bootstrap-security.mjs
```

Çeviri kontrolleri:

```powershell
node --test scripts/tests/translations.test.mjs
node scripts/tests/languages-smoke.mjs
```

İkinci komut için Docker sitesi açık olmalıdır. Birinci komut çeviri görünürlüğünü, ortak alanları ve yönetici yetki kontrollerini; ikinci komut üç dilde HTTP yanıtlarını, sayfa dilini, canonical/hreflang ve sitemap çıktısını denetler.

Komut mevcut koleksiyonu veya kayıtları silmez; yalnızca eksik şema alanlarını ve başlangıç kayıtlarını ekler.

`/bakir` ekranı site sahibinin günlük kullanımına ayrılmış özel yönetim yüzeyidir. Giriş, Directus'a Caddy üzerinden aynı origin altında iletilir ve oturum JavaScript'in okuyamadığı `httpOnly` çerezde tutulur. Panel, e-posta ve parola girişinin yanında Google Authenticator uyumlu 6 haneli TOTP kodunu destekler. İlk TOTP kurulumu yönetici oturumu açıldıktan sonra ekrandaki güvenlik bölümünden, telefon sahibinin bizzat doğrulamasıyla tamamlanır.

Panel birden fazla yöneticiyi destekler. Tam yetkili bir yönetici `/bakir` içindeki ekip bölümünden ayrı e-posta ve geçici parolayla yeni yönetici hesabı oluşturabilir. Ortak hesap kullanılmaz; her yönetici ilk girişinden sonra kendi telefonuyla ayrı TOTP kurulumu yapar. Panel TOTP durumunu kullanıcı bazında okur ve etkin hesapta kurulum formu yerine `2FA aktif` durumunu gösterir. Gizli TOTP anahtarları hiçbir liste endpoint'inden tarayıcıya gönderilmez.

Blog yazıları da doğrudan `/bakir` panelinden yönetilir. Yönetici yeni taslak oluşturabilir, mevcut yazıyı düzenleyebilir, yayınlayabilir, yeniden taslağa alabilir veya silmeden gizleyebilir. Başlık, URL adı, kategori, kart özeti, yayın tarihi, okuma süresi, öne çıkarma, giriş, paragraflar, alıntı, kapanış ve SEO alanları sade formdan düzenlenir. Paragraflar boş satırlarla ayrılır ve güvenli yapılandırılmış JSON olarak saklanır; panel ham HTML kabul etmez.

Yönetim paneli tek uzun sayfa değildir. Masaüstünde sabit sol sidebar; tablet ve mobilde üstte yatay kaydırılabilir bölüm menüsü kullanır. Genel bakış, blog yazıları, çalışma alanları, yöneticiler ve hesap güvenliği birbirinden ayrı çalışma ekranları olarak açılır. Böylece yeni modüller eklendiğinde kullanıcı sayfanın altına inmek zorunda kalmaz.

Çalışma alanları `/bakir` içindeki kendi bölümünden eklenir ve düzenlenir. Yönetici alanı taslakta tutabilir, yayınlayabilir, silmeden gizleyebilir ve ana sayfa kartlarında gösterilip gösterilmeyeceğini seçebilir. Kart metni, detay başlıkları, genel bilgilendirme, değerlendirme maddeleri, süreç adımları, sık sorulan sorular ve SEO metinleri kod düzenlemeden girilir.

Hakkımda ve İletişim sayfaları da `/bakir → Sayfa içerikleri` bölümünden yönetilir. Hakkımda sayfasının ana metinleri, mesleki yaklaşımı ve çalışma ilkeleri; İletişim sayfasının telefon, WhatsApp, e-posta, adres, çalışma saatleri ve süreç metinleri ayrı sekmelerden düzenlenir. Public sayfalar veriyi salt-okunur özel endpoint üzerinden alır.

Yerel HTTP geliştirmesinde `DIRECTUS_SESSION_COOKIE_SECURE=false` kullanılır. VPS üzerinde HTTPS etkinleştirildiğinde bu değer mutlaka `true` yapılmalıdır. `/bakir` yanıtları `noindex`, `nofollow`, `noarchive` ve `no-store` başlıklarıyla korunur; özel adres tek başına güvenlik önlemi sayılmaz.

Çalışma alanları artık Directus'tan dinamik okunur. Ana sayfa yalnızca `Yayında` ve `Ana sayfada göster` işaretli kayıtları; `/calisma-alanlari` ise tüm `Yayında` kayıtları sıralama alanına göre gösterir. `Taslak` veya `Gizli` kayıtlar listelenmez ve detay URL'leri 404 döndürür.

Blog içerikleri de Directus `blog_posts` koleksiyonundan yönetilir. Ana sayfa en fazla üç yayınlanmış yazıyı, `/blog` bütün yayınlanmış yazıları gösterir; her kayıt `/blog/[slug]` adresinde açılır. `Taslak` ve `Gizli` yazılar ziyaretçiye gösterilmez ve doğrudan URL istekleri 404 döndürür.

Arama motoru keşfi için `/robots.txt` ve `/sitemap.xml` otomatik üretilir. Robots çıktısı public sayfaların taranmasına izin verirken `/bakir` ve `/bakir-api` yollarını tarama dışında bırakır. Sitemap sabit public sayfalarla birlikte yalnızca yayınlanmış blog yazılarını ve çalışma alanlarını Directus'tan dinamik ekler. URL kökü `.env` içindeki `SITE_PUBLIC_URL` değerinden alınır; production ortamında bu değer gerçek HTTPS domaini olmalıdır.

Frontend içeriği standart Directus koleksiyon API'sinden değil, `directus/extensions/directus-extension-website-content` altındaki salt-okunur endpoint'ten alır. Bu endpoint yalnızca yayınlanmış kayıtları ve izin verilen alanları döndürür. Standart `items/practice_areas` ve `items/blog_posts` API'leri anonim erişime kapalı kalır.

Durumu görüntüleme:

```powershell
docker compose ps
```

Logları izleme:

```powershell
docker compose logs -f
```

Container'ları durdurma:

```powershell
docker compose down
```

Port 8080 kullanımdaysa farklı bir port seçilebilir:

```powershell
$env:HTTP_PORT=8081
docker compose up -d
```

## Kendi yönetici hesabını düzenleme

Admin → **Hesabım** bölümünde ad/soyad, giriş e-postası ve isteğe bağlı yeni parola değiştirilebilir. Mevcut parola her kayıtta, aktifse Authenticator kodu da onay için gerekir. Yeni parola ve tekrar alanı eşleşmelidir. Varsayılan kural 10–128 karakter, büyük/küçük harf, rakam ve semboldür. E-posta veya parola değişince yalnızca o hesaba ait tüm oturumlar kapatılır; yeni bilgilerle yeniden giriş yapılır. Sadece ad/soyad değişince mevcut oturum korunur. 2FA anahtarı değiştirilmez; Authenticator uygulamasındaki hesap etiketi eski e-postayı gösterebilir, kod aynı anahtarla çalışmaya devam eder.

`PATCH /website-content/account-settings` hedef kullanıcıyı yalnızca doğrulanmış oturumdan alır. Kullanıcı kimliği, rol, durum, politika veya TFA anahtarı body'den kabul edilmez. Güncelleme ve kendi oturumlarını kapatma tek DB transaction'ındadır. Hata cevaplarına parola/OTP/ham servis hata ayrıntıları eklenmez. Testlerde gerçek yönetici hesaplarının parolası değiştirilmez.

`directus-extension-account-ownership` hook'u, oturum açmış kullanıcıların başka hesaba `users.update/users.delete` yazmasını tam admin olsalar da reddeder. Directus'un null accountability kullanan dahili authentication işlemleri korunur. Yönetici ekleme ayrı `POST /website-content/admin-team` endpoint'iyle sadece yeni hesap oluşturur; rol mevcut yöneticiden gelir, hedef kimlik veya farklı rol gönderilemez. Başka yöneticinin bilgilerini düzenleme/parola sıfırlama ekranı yoktur.

Caddy `/bakir-api` yalnızca mevcut panelin kullandığı oturum, içerik, dosya, kendine ait TFA ve özel website-content yollarını geçirir. Genel `/users`, kullanıcı tablosu, roller/politikalar, GraphQL ve diğer platform yönetim yolları public panel proxy'sinden kapalıdır. Teknik Directus portunu internete açmayın; Compose onu `127.0.0.1:8055` üzerinde tutar. Parola unutma/kurtarma ayrı bir sonraki özellik olarak tasarlanmalıdır.

`005-password-policy-escaping.sql` yalnızca bilinen yanlış çift kaçışlı varsayılan regex'i düzeltir; özel bir politika varsa ezmez. Mevcut kullanıcı parolalarına dokunmaz. Kontroller: `node --test scripts/tests/account-settings.test.mjs`, `node scripts/tests/account-access-smoke.mjs`.

## Authenticator QR kurulumu

Admin → Hesap güvenliği → mevcut parolayı girin → “Kurulum anahtarı ve QR oluştur”. Google Authenticator'da **+ → QR kod tara** ile ekleyin; uygulamadaki güncel altı haneli kodu panelde onaylayın. QR taramak tek başına iki adımlı doğrulamayı etkinleştirmez. QR tarayamıyorsanız “Anahtarı elle gir” alanını açıp zamana dayalı anahtar olarak ekleyebilirsiniz.

QR, Directus'un o oturum için ürettiği `otpauth_url` bağlantısından `qrcode` paketiyle tarayıcı içinde üretilir; dış bir QR servisi kullanılmaz. Anahtar ve QR kalıcı tarayıcı depolamasına veya loglara yazılmaz. Onay/çıkış sonrası React state'inden kaldırılır. QR görselini ve anahtarı paylaşmayın. Telefon/sunucu saatlerinin doğru olması gerekir. Kurulumu tamamlanmış hesaplarda mevcut 2FA korunur; QR yeniden gösterilmez veya 2FA kendiliğinden sıfırlanmaz.

QR okunabilirlik testi: `node --test scripts/tests/authenticator-qr.test.mjs`. Sahte test bağlantısı yerelde QR'a dönüştürülüp `jsqr` ile geri okunur; gerçek kullanıcı parolası/anahtarı kullanılmaz.

## Sayfa ve görsel yönetimi

`http://localhost:8080/bakir` → **Sayfa içerikleri** bölümünde Ana sayfa, Hakkımda, İletişim, Çalışma alanları ve Blog sekmeleri bulunur. Ana sayfanın bölüm başlıkları, açıklamaları, kısa bilgileri, süreç adımları, 3D karakteri ve Hakkımda bölüm görseli burada düzenlenir. Blog/çalışma alanları liste sayfalarının girişleri ve bilgi notları da ayrı yönetilir. İletişim numaraları ana sayfaya aynı ortak kayıttan gelir.

**Blog yazıları** ve **Çalışma alanları** editörlerinde “Bilgisayardan görsel seç” alanını kullanın. Görsel yüklemek dosyayı saklar; ziyaretçilere göstermek için ilgili yazıyı/alanı/sayfayı ayrıca kaydedin. JPG, PNG ve WebP desteklenir; yükleme limiti 10 MB'dir. 3D karakter görünümü için arka planı şeffaf PNG kullanın. Alt metin alanı erişilebilirlik içindir.

Görseller Türkçe sekmesinde yönetilen ortak alanlardır; İngilizce/Almanca sekmeleri metin ve çeviri yayın durumunu değiştirir. Liste ve detay görselleri ilgili kaydın aynı görselini kullanır. Varsayılan görseli olan bölümlerde özel görseli kaldırmak mevcut tasarım görseline döndürür. İsteğe bağlı liste sayfası giriş görselleri boşsa gösterilmez.

Blog ve çalışma alanı kayıtlarında görsel boşsa örnek fotoğraf kullanılmaz. Çalışma alanı kartı bu durumda ikon/metin düzenine, detay sayfası tek kolonlu metin düzenine geçer. Ana sayfa ve çalışma alanları listesindeki kartlar görsel/metin uzunluğundan bağımsız eşit genişlik ve yükseklik kullanır; tüm satırlar en uzun içeriğe göre birlikte büyür. Bağlantılar kartın altına hizalanır, metin kırpılmaz; görselsiz kartta sahte/boş fotoğraf alanı açılmaz. Çalışma alanı fotoğrafları kırpılmadan (`contain`) çerçeveye sığar; dikey/yatay oran korunur ve kenarlarda nötr zemin kalabilir. Detay bilgi notu fotoğrafın altında yer alır, fotoğrafı örtmez. Görsel var/yok kontrolü: `node scripts/tests/practice-images-smoke.mjs`. Kart CSS sözleşmesi: `node --test scripts/tests/practice-card-layout.test.mjs`; bu test gerçek tarayıcı piksel ölçümü yapmaz.

Çalışma alanı adı kartta ve detayın ana başlığında aynıdır. URL bu addan otomatik üretilir (`Postür Analizi` → `postur-analizi`); URL alanı yalnızca önizlemedir. İsim değişikliği kaydedildiğinde URL de değişir. Aynı ada sahip alanlar benzersiz kayıt eki alır; eski adresler yeni canonical adrese HTTP 308 ile yönlenir. Eski tanıtım/hero başlığı isteğe bağlı alt başlık olarak korunur. Bu davranış Türkçe ve EN/DE çalışma alanı çevirilerine uygulanır; blogun bağımsız URL editörü değiştirilmez.

`004-practice-title-urls.sql` PostgreSQL tetikleyicileri ve `website_practice_slug_aliases` tablosunu kurar. Eski URL'ler başka bir alan tarafından devralınamaz; gizli/silinmiş/yayımlanmamış dil sürümlerine ait alias public içerik açmaz. Migrasyon mevcut alan isimlerini değiştirmeden URL'leri eşitler. Direkt Directus editöründen yapılan başlık değişikliklerinde de aynı kural geçerlidir. `node scripts/tests/practice-urls-db.mjs` testi veritabanı yazımlarını transaction sonunda geri alır; yalnızca sequence numaralarında boşluk oluşabilir. `node scripts/tests/practice-urls-smoke.mjs` public URL türetimini kontrol eder; sonuna eski URL adları eklenirse 308 yönlendirmelerini de doğrular.

Dosyalar `directus_uploads` kalıcı Docker volume'ünde, içerik eşleştirmeleri PostgreSQL'de saklanır. VPS taşırken bu iki volume'ü yedekleyip taşıyın: frontend imajı tek başına içerikleri ve yüklenen görselleri taşımaz. Veritabanı ve uploads volume'lerini silmeyin.

Public `/site-media/<UUID>` uçları yalnızca yayınlanmış yazı/alan veya tanımlı public sayfa görsellerini sunar. Dosya kütüphanesinin tamamına anonim erişim açılmaz; SVG/HTML public medya olarak sunulmaz. Kaydedilmemiş görsel yalnızca admin oturumunda önizlenir. “İçerikten kaldır” veya değiştirme **kaydedildiğinde**, başka içerikte kullanılmayan yüklenmiş eski fotoğraf fiziksel dosyası/thumbnail'ları ve veritabanı dosya kaydıyla birlikte kalıcı silinir.

### Kullanılmayan fotoğrafların temizliği

Kaydetmeden kaldırılan mevcut fotoğraf silinmez; vazgeçme hâlinde canlı site korunur. Kaydetme sonrası `directus-extension-media-cleanup` otomatik kontrol eder; hata/restart/kaçan olay için her dakika yeniden tarar. Taslak, gizli kayıt/bölüm, diğer sayfa ve dil sürümlerindeki kullanım da sayılır. Görünürlüğü kapatmak silme değildir. Aynı dosya iki kayıttaysa son kullanım kaldırılmadan silinmez. Repo içindeki paketlenmiş/default görseller bu temizlik kapsamına girmez.

Yeni yüklemeler `description=fizyoterapi-site-image:v1` işaretiyle tanınır. Editörde aynı oturumda yüklenip değiştirilmiş/kaldırılmış, hiçbir yerde kaydedilmemiş dosya yalnızca yükleyen aktif adminin `POST /website-content/media-discard/:id` çağrısıyla temizlenebilir. Bir başka yöneticinin dosyasını veya dosya kütüphanesinin tamamını silen genel endpoint açılmaz. Yüklenip kaydedilmeden sekmesi kapatılan fotoğraflara 24 saat düzenleme payı verilir, ardından otomatik silinir. 24 saati aşan kaydedilmemiş editörde fotoğrafı yeniden yüklemek gerekebilir.

`008-media-cleanup.sql` yalnızca site içeriklerinde/güncel veya eski revizyonlarında kullanıldığı bilinen yüklemeleri `website_media_assets` tablosuna alır; SQL dosya silmez, ilgisiz dosyaları benimsemez. Üç CMS tablosundaki DB trigger'ı yeni `/site-media/UUID` referanslarını doğrular, dosya satırını UUID sırasıyla kilitler ve kaydedilmiş olarak işaretler. Temizleyici aynı satırı kilitleyip tüm güncel referansları tekrar kontrol eder. Silme ve aynı anda yeniden ekleme yarışında ya kullanım korunur ya da silinmiş dosyaya yazım reddedilir; kırık link kaydedilmez.

Silme Directus `FilesService` ile yapılır; orijinal, üretilmiş varyantlar ve `directus_files` satırı kaldırılır. Storage hatasında dış DB transaction rollback olur; kalan dosyalar sonraki taramada tekrar denenir. Kalıcı silinmiş fotoğrafı revizyon geçmişinden geri getirmek mümkün değildir; geçmişte küçük URL/metaveri izleri veya daha önce alınmış yedekler kalabilir. Eski metin sürümlerinin saklama politikası bu özellikte değiştirilmedi. Referans taraması yalnızca bu projenin CMS tablolarını ve schema'daki gerçek dosya ilişkilerini kapsar; yeni görsel içeren koleksiyon eklenirse tarama/trigger kapsamını güncelleyin.

Storage işleminden önce `retired_at` kalıcı işareti ayrı transaction'da yazılır. Diskin yalnız bir kısmı silinip işlem başarısız olsa dahi DB trigger'ı bu dosyanın yeniden kaydedilmesini engeller; sonraki görev işaretli dosyayı bekleme süresini atlayarak yeniden temizler. Dosya sistemi ve PostgreSQL tek atomik sistem olmadığından bu iki aşamalı yaşam döngüsü gerekir.

Testler: `node --test scripts/tests/media-cleanup.test.mjs`. Gerçek disk/DB testi: `docker compose exec -T directus node /directus/extensions/directus-extension-media-cleanup/test/integration.mjs`. Canlı dakikalık görev testi: aynı klasörde `scheduler-smoke.mjs`. Bu testler yalnız kendileri oluşturdukları yapay PNG/yazıların kesin kimliklerini siler; gerçek hesaplara/içeriklere dokunmaz. Kullanılan resmî teknik belgeler: [Directus hook olayları ve schedule](https://directus.com/docs/guides/extensions/api-extensions/hooks), [FilesService](https://directus.com/docs/guides/extensions/api-extensions/services).

`003-editable-public-pages.sql` Docker geçişine eklidir; mevcut metinleri ezmeden üç dilde başlangıç içeriklerini kurar. Manuel kurulum için `node scripts/setup-languages.mjs`. Seed SQL değiştirilecekse Node 22.18+ ile `node scripts/generate-page-content-migration.mjs` çıktısını inceleyin; kaynak config `frontend/app/lib/page-content-config.json` dosyasıdır.

Kontroller: `node --test scripts/tests/*.test.mjs`, `node scripts/tests/languages-smoke.mjs` ve frontend içinde `npx tsc --noEmit`.

Yüklenen public görseller için `node scripts/tests/media-smoke.mjs`: yayındaki yazı/alan ve sayfa görsellerini bulur, Directus endpoint'i → `/site-media` proxy → `/_next/image` yolunda 200 ve gerçek görsel baytlarını doğrular. Belirli dosyalar için komutun sonuna UUID eklenebilir. Özel medya endpoint'i Directus 12 `AssetsService.getAsset` çağrısına `{ transformationParams: {} }` gönderir; sadece `{}` kullanmak görsel döndürme sırasında sunucu hatasına yol açar.

## Bölüm görünürlüğü

### Footer bağlantıları

Admin sidebar → **Footer**: Instagram, Facebook, LinkedIn, YouTube, X, TikTok ve ek web sitesi için HTTPS adresi girin; yanındaki Görünür/Gizli anahtarını kullanıp **Footer’ı kaydet** düğmesine basın. Boş adres gösterilmez; örnek `#` Instagram bağlantısı kaldırıldı. Site içi footer menüsü ve KVKK/Gizlilik bağlantılarının görünürlüğü de buradan ayarlanır; bu seçim sayfaların kendisini silmez. Site içi hedefler sabittir ve dile göre eşleşir; bu panel sayfa URL'sini yeniden adlandırmaz.

Ayarlar tüm dillerde ortak, admin Türkçedir. `site_pages` içindeki `footer` kaydının `content` JSON'una yazılır; `009-footer-settings.sql` kaydı mevcut değerleri ezmeden ekler. Genel `/items/site_pages/:id` yetkili PATCH yolu kullanılır; yeni anonim yazım izni açılmadı. Public `/website-content/footer` yalnız normalize edilmiş bağlantı/görünürlük bilgisini verir. URL kontrolleri formda ve public render/read sınırında uygulanır; teknik Directus üzerinden geçersiz veri yazılırsa link gösterilmez. JavaScript/data/http adresleri, kullanıcı adı/parola içeren URL'ler ve 2048 karakter üzeri adresler kabul edilmez/gösterilmez. Dış bağlantılar yeni sekmede noopener/noreferrer ile açılır.

Tüm sayfalar (çalışma alanı detayları dahil) ortak footer kullanır. Çoklu sosyal linkler mobilde satırlara sarılır; boş nav grupları render edilmez. Footer servisi geçici yoksa boş sosyal/default menüyle güvenli fallback kullanılır; 404 sayfası sadece footer isteği yüzünden bozulmaz. Kontrol: `node --test scripts/tests/footer-settings.test.mjs`. Genel bilgilendirme metinleri bu pakette değiştirilmedi.

Ana sayfanın varsayılan karakteri beyaz önlüklü, belden yukarı şeffaf `furkan-toplu-hero-white-coat-v1.png` görselidir. Mevcut CSS perspective/katman/gölge ve alt fade efekti korunur; bu gerçek bir 3D model değil, şeffaf portreyle derinlik hissidir. Admin → Sayfa içerikleri → Ana sayfa → Ana görsel üzerinden değiştirilebilir. `007-white-coat-hero.sql` sadece eski paketlenmiş kırmızı tişört görselini değiştirir, özel yükleme/diğer içerik/görünürlüğü korur. Görsel üretim yöntemi ve tam istem `assets/hero-white-coat-prompt.md` içindedir. Kontroller: `node --test scripts/tests/hero-portrait.test.mjs` ve `node scripts/tests/hero-portrait-smoke.mjs`.

Admin → Sayfa içerikleri / Çalışma alanları / Blog yazıları editörlerinde ilgili bölüm adının yanında **Görünür / Gizli** anahtarı vardır. Örneğin çalışma alanındaki **Sık sorulan sorular** anahtarını kapatıp alanı kaydedin: SSS başlığı ve cevapları public detayda görünmez. Yeniden açıp kaydettiğinizde aynı içerik geri gelir. İçerik/görsel silinmez; değişiklik Kaydet veya Çeviriyi kaydet ile uygulanır.

Ana sayfa bölümleri, Hakkımda yaklaşımı/ilkeleri, iletişim kartları/süreci, liste sayfası kartları/notları, alan detayının değerlendirme/süreç/SSS bölümleri ve blogun kapak/özet/gövde/alıntı/öneriler/kapanış/içindekiler bölümleri kontrol edilebilir. Ana başlık, navbar/footer ve sabit bilgilendirme/gizlilik uyarıları korunur. Üst bölüm gizliyse altları da görünmez; alt anahtarlar ve içerikler saklanır. Blogun öne çıkan bölümü kapalı, arşivi açıksa ilk yazı arşive katılır.

Görünürlük **TR/EN/DE için ortak** sayfa düzenidir. EN/DE editörü de ortak bayrakları gösterir; çeviri ile birlikte atomik kaydeder. Görsel bayrağı kart ve detayda birlikte uygulanır. İletişim kartlarının ortak ayarı ana sayfada da uygulanır; navbar/footer iletişim bağlantılarını kaldırmaz. Bölüm gizlemek yayın durumundan farklıdır: sayfa URL'si, sitemap kaydı ve SEO alanları korunur. Hassas veriyi özel yapmaz; metin public içerik API'sinde, referanslı medya doğrudan URL'sinde erişilebilir kalabilir.

`section_visibility` haritası `site_pages.content` içinde, `practice_areas/blog_posts` için JSONB sütunlarında saklanır. Eksik bayraklar görünür kabul edilir; yalnızca boolean `false` gizler. `006-section-visibility.sql` idempotent olup içerikleri ezmez, başlangıçta hiçbir bölümü kapatmaz. Frontend ve Directus `section-config.json` tanımları eşleşir. Frontend DOM üretimini koşula bağlar; CSS ile boş alan bırakıp gizlemez. İçindekiler menüsü yalnızca görünür hedeflere bağlantı verir.

Kontrol: `node --test scripts/tests/section-visibility.test.mjs`. Bu test gerçek yönetici girişi/parolası veya canlı içerik değişikliği kullanmaz; tüm sayfa türlerini sahte verilerle render eder. Migrasyon Compose ve `scripts/setup-languages.mjs` akışına eklenmiştir.

## Frontend geliştirme komutları

Mobilde (860 px ve altı) ana portre normal akışta, kendine ait stacking context içinde gösterilir; masaüstü translate3d/scale/perspective efektleri metin veya konum bilgilerini örtmez. Konum kartı portreden önce akar; dekoratif halkalar/parıltı mobilde kapalıdır. Dil düğmesi/seçenekleri TR/EN/DE gösterir, erişilebilir tam dil isimleri korunur. Menü düğmesi DOM ve görsel sırada en sağdadır; masaüstünde menü gizli olduğu için dil yine randevu düğmesinin sağında kalır. Portre yanındaki “Her hareket bir başlangıçtır” kutusu public ve editörden kaldırıldı. Kontrol: `node --test scripts/tests/mobile-header-hero.test.mjs`; gerçek ekran/piksel ölçümü değildir.

```powershell
cd frontend
npm run dev
```

Geliştirme önizlemesi: `http://localhost:5173/`

Bu bilgisayarda npm komutunun Windows shim'i sorun çıkarırsa:

```powershell
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
```

## Mevcut container yapısı

- `frontend`: Uygulamayı çok aşamalı Docker build ile derler ve root olmayan kullanıcıyla çalıştırır.
- `proxy`: Caddy üzerinden sıkıştırma, temel güvenlik başlıkları ve reverse proxy sağlar.
- `database`: PostgreSQL 16 üzerinde Directus ve site içeriklerini kalıcı volume içinde saklar.
- `directus`: Sabitlenmiş Directus 12.4.0 imajıyla içerik yönetim arayüzü ve API sağlar.

PostgreSQL host sistemine port açmaz. Directus geliştirme aşamasında yalnızca `127.0.0.1:8055` adresine bağlanır. Özel `/bakir` girişi, TOTP kurulum akışı, çoklu yönetici desteği ve blog/çalışma alanı/sayfa içerik editörleri uygulanmıştır. Zamanlanmış yedekleme ile production VPS, TLS ve Cloudflare sertleştirmesi sonraki altyapı paketlerinde eklenecek. Parolalar ve diğer gizli değerler Git deposuna yazılmayacak.

Directus 12'nin yönetim panelinde gösterdiği proje sahibi e-posta toplama penceresi, resmî `PROJECT_OWNER_ENABLED=false` yapılandırmasıyla kapalıdır. Bu ayar yalnızca sahip bilgisi toplama ve senkronizasyonunu devre dışı bırakır; kullanılan Directus sürümünün lisans koşullarını değiştirmez.
