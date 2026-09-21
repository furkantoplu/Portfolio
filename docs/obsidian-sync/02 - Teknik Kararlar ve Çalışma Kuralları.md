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

## Karar 008 — Yerel Git

Git yalnızca yerel sürüm kontrolü için kullanılacak. Kullanıcı haber verene kadar GitHub remote eklenmeyecek ve push yapılmayacak.

## Karar 009 — Obsidian ile ortak dokümantasyon

Her anlamlı işlemden sonra geliştirme günlüğü, genel mimari ve karar kayıtları güncellenecek. Proje içindeki not aynası Git'e dahil edilecek; Obsidian klasörüyle eşitlenecek.

## Karar 010 — Görseller

AI ile üretilen görseller arayüz yönünü belirlemek için kullanılabilir. Nihai yayında mümkün olduğunda gerçek fizyoterapist ve gerçek çalışma ortamı fotoğraflarına geçilecek. Kullanılan geçici görseller açıkça kayıt altına alınacak.

## Git commit yaklaşımı

- Her küçük paket bittikten ve build doğrulandıktan sonra commit oluşturulur.
- Commit mesajları kısa ve yapılan işi açıklayan İngilizce conventional commit biçiminde yazılır.
- Örnek: `feat: add physiotherapy practice areas section`
- Backend başlamadan önce arayüz için ayrı bir dönüm noktası etiketi değerlendirilebilir.

## Güncelleme kontrol listesi

Her paket sonunda:

1. Masaüstü görünüm kontrol edilir.
2. Mobil görünüm kontrol edilir.
3. Production build çalıştırılır.
4. Geliştirme günlüğü güncellenir.
5. Obsidian notları eşitlenir.
6. Yerel Git commit'i oluşturulur.

