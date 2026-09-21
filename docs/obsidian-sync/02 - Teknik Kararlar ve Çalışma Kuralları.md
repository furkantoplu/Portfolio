# Fizyoterapist Web Sitesi — Teknik Kararlar ve Çalışma Kuralları

## Karar 001 — Önce arayüz

Backend ve veritabanı geliştirmesi arayüz kesinleşmeden başlamayacak. Bunun nedeni müşteri tarafında en fazla geri bildirimin görsel tasarım üzerinden gelmesinin beklenmesi.

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
- Directus, PostgreSQL ve yedekleme servisleri backend aşamasında aynı Compose dosyasına eklenecek.
- Parolalar, TOTP secret, Directus key/secret ve PostgreSQL parolası Git'e commit edilmeyecek.

## Güncelleme kontrol listesi

Her paket sonunda:

1. Masaüstü görünüm kontrol edilir.
2. Mobil görünüm kontrol edilir.
3. Production build çalıştırılır.
4. Geliştirme günlüğü güncellenir.
5. Obsidian notları eşitlenir.
6. Yerel Git commit'i oluşturulur.
