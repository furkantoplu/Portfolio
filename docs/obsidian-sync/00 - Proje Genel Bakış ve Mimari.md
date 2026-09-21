# Fizyoterapist Web Sitesi — Proje Genel Bakış ve Mimari

## Projenin amacı

Türkiye'de hizmet veren bireysel bir fizyoterapist için güven veren, sade ve içerik odaklı bir portföy sitesi hazırlanıyor. Site ziyaretçileri için üyelik sistemi bulunmayacak. Site sahibi; blog yazılarını, çalışma alanlarını, görselleri ve temel iletişim bilgilerini kod görmeden yönetebilecek.

## Geliştirme yaklaşımı

Proje tek seferde tamamlanmayacak. Önce küçük arayüz paketleri hazırlanacak ve her paket görsel olarak kontrol edilecek. Arayüz kesinleşmeden backend, veritabanı, yönetim paneli ve production Docker kurulumu yapılmayacak.

Planlanan sıra:

1. Tasarım dili, header ve hero
2. Çalışma alanları
3. Hakkımda ve yaklaşım
4. Blog ön izlemesi
5. İletişim, konum ve footer
6. İç sayfalar ve responsive son kontroller
7. Directus ve PostgreSQL
8. Yönetici girişi ve TOTP
9. Docker production kurulumu
10. VPS, Cloudflare ve domain bağlantısı

## Sayfa yapısı

- Ana Sayfa
- Hakkımda
- Çalışma Alanları
- Çalışma Alanı Detayı
- Blog
- Blog Yazısı
- İletişim
- KVKK Aydınlatma Metni
- Gizlilik ve Çerez Politikası
- Özel yönetim yolu: örnek olarak `/bakir`

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

### Production altyapısı

Docker Compose servisleri:

```text
reverse-proxy   Caddy veya Nginx
web             Next.js/Vinext uygulaması
cms             Directus
database        PostgreSQL
backup          Zamanlanmış yedek görevi
```

Cloudflare görevleri:

- DNS yönetimi
- Proxy/CDN
- Full (strict) TLS
- Temel WAF ve rate limit kuralları
- Yönetim ve API yollarında uygun cache bypass kuralları

## İçerik modelleri

### Blog yazısı

- Başlık
- Slug
- Kısa özet
- Kapak görseli ve alternatif metni
- İçerik
- Kategori
- Yazar
- Yayın tarihi ve güncelleme tarihi
- Taslak/yayında durumu
- SEO başlığı ve açıklaması

### Çalışma alanı

- Başlık
- Slug
- Kısa açıklama
- Detaylı genel bilgilendirme
- Görsel ve alternatif metni
- Sıralama
- Aktif/pasif durumu
- Sık sorulan sorular

### Site ayarları

- İsim ve mesleki unvan
- Telefon, e-posta ve WhatsApp
- Adres ve çalışma saatleri
- Sosyal medya bağlantıları
- Ana sayfa metinleri
- SEO ayarları

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

