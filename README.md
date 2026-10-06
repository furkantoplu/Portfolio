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

## Frontend geliştirme modu

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
