# Fizyoterapist Portföy Sitesi

Fizyoterapist portföyü ve blogu için geliştirilen React/TypeScript tabanlı web sitesi. Arayüz küçük paketler halinde ilerletiliyor; içerik yönetimi aşamasında Directus ve PostgreSQL aynı Docker Compose mimarisine eklenecek.

## Docker ile çalıştırma

Docker Desktop açıkken proje kökünde:

```powershell
docker compose up -d --build
```

Site: `http://localhost:8080/`

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

Directus, PostgreSQL, yedekleme ve production TLS ayarları backend aşamasında eklenecek. Parolalar ve diğer gizli değerler Git deposuna yazılmayacak.
