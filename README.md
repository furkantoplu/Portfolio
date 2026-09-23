# Fizyoterapist Portföy Sitesi

Fizyoterapist portföyü ve blogu için geliştirilen React/TypeScript tabanlı web sitesi. Frontend, Directus içerik yönetimi ve PostgreSQL veritabanı aynı Docker Compose mimarisinde çalışır.

## Docker ile çalıştırma

Docker Desktop açıkken proje kökünde:

```powershell
docker compose up -d --build
```

Site: `http://localhost:8080/`

Directus yönetim arayüzü: `http://localhost:8055/`

İlk çalıştırmadan önce `.env.example` dosyasını `.env` adıyla kopyalayın ve örnek parolaları değiştirin. Bu depodaki yerel `.env` Git tarafından yok sayılır.

Directus çalışma alanları koleksiyonunu ve başlangıç kayıtlarını idempotent biçimde kurmak için servisler başladıktan sonra:

```powershell
node scripts/bootstrap-directus.mjs
```

Komut mevcut koleksiyonu veya kayıtları silmez; yalnızca eksik şema alanlarını ve başlangıç kayıtlarını ekler.

Çalışma alanları artık Directus'tan dinamik okunur. Ana sayfa yalnızca `Yayında` ve `Ana sayfada göster` işaretli kayıtları; `/calisma-alanlari` ise tüm `Yayında` kayıtları sıralama alanına göre gösterir. `Taslak` veya `Gizli` kayıtlar listelenmez ve detay URL'leri 404 döndürür.

Frontend içeriği standart Directus koleksiyon API'sinden değil, `directus/extensions/directus-extension-website-content` altındaki salt-okunur endpoint'ten alır. Bu endpoint yalnızca yayınlanmış kayıtları ve izin verilen alanları döndürür. Standart `items/practice_areas` API'si anonim erişime kapalı kalır.

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

PostgreSQL host sistemine port açmaz. Directus geliştirme aşamasında yalnızca `127.0.0.1:8055` adresine bağlanır. Production `/bakir` yönlendirmesi, TOTP, yedekleme ve TLS ayarları sonraki backend/güvenlik paketlerinde eklenecek. Parolalar ve diğer gizli değerler Git deposuna yazılmayacak.
