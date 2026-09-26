# Fizyoterapist Portföy Sitesi

Fizyoterapist portföyü ve blogu için geliştirilen React/TypeScript tabanlı web sitesi. Frontend, Directus içerik yönetimi ve PostgreSQL veritabanı aynı Docker Compose mimarisinde çalışır.

## Docker ile çalıştırma

Docker Desktop açıkken proje kökünde:

```powershell
docker compose up -d --build
```

Site: `http://localhost:8080/`

Özel yönetim girişi: `http://localhost:8080/bakir`

Directus teknik yönetim arayüzü geliştirme sırasında yalnızca bu bilgisayardan `http://localhost:8055/` adresinde erişilebilir.

İlk çalıştırmadan önce `.env.example` dosyasını `.env` adıyla kopyalayın ve örnek parolaları değiştirin. Bu depodaki yerel `.env` Git tarafından yok sayılır.

Directus çalışma alanları koleksiyonunu ve başlangıç kayıtlarını idempotent biçimde kurmak için servisler başladıktan sonra:

```powershell
node scripts/bootstrap-directus.mjs
node scripts/bootstrap-blog.mjs
node scripts/bootstrap-security.mjs
```

Komut mevcut koleksiyonu veya kayıtları silmez; yalnızca eksik şema alanlarını ve başlangıç kayıtlarını ekler.

`/bakir` ekranı site sahibinin günlük kullanımına ayrılmış özel yönetim yüzeyidir. Giriş, Directus'a Caddy üzerinden aynı origin altında iletilir ve oturum JavaScript'in okuyamadığı `httpOnly` çerezde tutulur. Panel, e-posta ve parola girişinin yanında Google Authenticator uyumlu 6 haneli TOTP kodunu destekler. İlk TOTP kurulumu yönetici oturumu açıldıktan sonra ekrandaki güvenlik bölümünden, telefon sahibinin bizzat doğrulamasıyla tamamlanır.

Panel birden fazla yöneticiyi destekler. Tam yetkili bir yönetici `/bakir` içindeki ekip bölümünden ayrı e-posta ve geçici parolayla yeni yönetici hesabı oluşturabilir. Ortak hesap kullanılmaz; her yönetici ilk girişinden sonra kendi telefonuyla ayrı TOTP kurulumu yapar. Panel TOTP durumunu kullanıcı bazında okur ve etkin hesapta kurulum formu yerine `2FA aktif` durumunu gösterir. Gizli TOTP anahtarları hiçbir liste endpoint'inden tarayıcıya gönderilmez.

Blog yazıları da doğrudan `/bakir` panelinden yönetilir. Yönetici yeni taslak oluşturabilir, mevcut yazıyı düzenleyebilir, yayınlayabilir, yeniden taslağa alabilir veya silmeden gizleyebilir. Başlık, URL adı, kategori, kart özeti, yayın tarihi, okuma süresi, öne çıkarma, giriş, paragraflar, alıntı, kapanış ve SEO alanları sade formdan düzenlenir. Paragraflar boş satırlarla ayrılır ve güvenli yapılandırılmış JSON olarak saklanır; panel ham HTML kabul etmez.

Yerel HTTP geliştirmesinde `DIRECTUS_SESSION_COOKIE_SECURE=false` kullanılır. VPS üzerinde HTTPS etkinleştirildiğinde bu değer mutlaka `true` yapılmalıdır. `/bakir` yanıtları `noindex`, `nofollow`, `noarchive` ve `no-store` başlıklarıyla korunur; özel adres tek başına güvenlik önlemi sayılmaz.

Çalışma alanları artık Directus'tan dinamik okunur. Ana sayfa yalnızca `Yayında` ve `Ana sayfada göster` işaretli kayıtları; `/calisma-alanlari` ise tüm `Yayında` kayıtları sıralama alanına göre gösterir. `Taslak` veya `Gizli` kayıtlar listelenmez ve detay URL'leri 404 döndürür.

Blog içerikleri de Directus `blog_posts` koleksiyonundan yönetilir. Ana sayfa en fazla üç yayınlanmış yazıyı, `/blog` bütün yayınlanmış yazıları gösterir; her kayıt `/blog/[slug]` adresinde açılır. `Taslak` ve `Gizli` yazılar ziyaretçiye gösterilmez ve doğrudan URL istekleri 404 döndürür.

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

PostgreSQL host sistemine port açmaz. Directus geliştirme aşamasında yalnızca `127.0.0.1:8055` adresine bağlanır. Özel `/bakir` girişi, TOTP kurulum akışı ve güvenli oturum temeli uygulanmıştır. Blog ve çalışma alanı düzenleme formları, zamanlanmış yedekleme ve production TLS/Cloudflare sertleştirmesi sonraki backend paketlerinde eklenecek. Parolalar ve diğer gizli değerler Git deposuna yazılmayacak.

Directus 12'nin yönetim panelinde gösterdiği proje sahibi e-posta toplama penceresi, resmî `PROJECT_OWNER_ENABLED=false` yapılandırmasıyla kapalıdır. Bu ayar yalnızca sahip bilgisi toplama ve senkronizasyonunu devre dışı bırakır; kullanılan Directus sürümünün lisans koşullarını değiştirmez.
