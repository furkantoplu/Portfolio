# Fizyoterapist Web Sitesi — Proje Genel Bakış ve Mimari

## Projenin amacı

Furkan Toplu için güven veren, sade ve içerik odaklı bir fizyoterapist portföy sitesi hazırlanıyor. Site ziyaretçileri için üyelik sistemi bulunmayacak. Site sahibi; blog yazılarını, çalışma alanlarını, görselleri ve temel iletişim bilgilerini kod görmeden yönetebilecek.

## Geliştirme yaklaşımı

Proje tek seferde tamamlanmayacak. Önce küçük arayüz paketleri hazırlanacak ve her paket görsel olarak kontrol edilecek. Backend, veritabanı ve yönetim paneline ana frontend bütünü tamamlandıktan sonra kontrollü paketlerle geçilecek. Dağıtımı tekrarlanabilir tutmak için frontend, reverse proxy, Directus ve PostgreSQL aynı Docker Compose mimarisine alındı.

Planlanan sıra:

1. Tasarım dili, header ve hero
2. Çalışma alanları
3. Hakkımda ve yaklaşım
4. Blog ön izlemesi
5. İletişim, konum ve footer
6. İç sayfalar ve responsive son kontroller
7. Directus ve PostgreSQL temeli (23 Eylül 2026'da tamamlandı)
8. Yönetici girişi ve TOTP
9. Zamanlanmış veritabanı ve dosya yedek servisinin eklenmesi
10. VPS, Cloudflare ve domain bağlantısı

İç sayfa tasarımlarına `Bel ve Boyun Sağlığı` çalışma alanı ile başlandı. Kullanılan rota: `/calisma-alanlari/bel-ve-boyun-sagligi`. İkinci örnek olarak `/calisma-alanlari/sporcu-rehabilitasyonu` hazırlandı.

Her çalışma alanı ziyaretçi açısından kendine ait `/calisma-alanlari/[slug]` adresine sahip olacak. Arayüz kodunda sayfalar ortak `PracticeDetail` şablonunu kullanır; yalnızca metadata, başlık, açıklamalar, değerlendirme başlıkları, süreç adımları ve SSS verileri değişir. Directus aşamasında aynı şablon korunacak ve bu veriler CMS kayıtlarından alınacak.

Çalışma alanlarının tamamını sunan `/calisma-alanlari` dizin sayfası oluşturuldu. Dört alanın kartlarda ve detay sayfalarındaki çapraz bağlantılarda kullanılan temel başlık, slug, özet ve URL bilgileri ortak `practice-catalog.ts` kaynağında tutuluyor.

Mevcut çalışma alanı rotaları:

- `/calisma-alanlari/bel-ve-boyun-sagligi`
- `/calisma-alanlari/sporcu-rehabilitasyonu`
- `/calisma-alanlari/ameliyat-sonrasi-surec`
- `/calisma-alanlari/durus-ve-hareket-analizi`

Blog arayüzünde liste sayfası `/blog`, ilk örnek yazı ise `/blog/masa-basinda-hareket-molalari` rotasında hazırlandı. Directus entegrasyonunda blog slug yapısı aynı URL düzenini koruyacak.

Ortak navigasyon masaüstünde yatay, 1120 piksel ve altındaki ekranlarda açılır panel olarak çalışır. Mobil panel; aktif sayfa vurgusu, arka alana dokunarak kapatma, Escape tuşuyla kapatma ve açıkken arka sayfa kaymasını durdurma davranışlarını içerir. Menü verileri tek bir ortak kaynaktan hem header hem footer tarafından kullanılır.

## Sayfa yapısı

- Ana Sayfa
- Hakkımda: `/hakkimda`
- Çalışma Alanları: `/calisma-alanlari`
- Çalışma Alanı Detayı
- Blog: `/blog`
- Blog Yazısı
- İletişim: `/iletisim`
- KVKK Aydınlatma Metni: `/kvkk-aydinlatma-metni`
- Gizlilik Bilgilendirmesi: `/gizlilik`
- Özel yönetim yolu: örnek olarak `/bakir`

Hakkımda ve İletişim bölümleri ana sayfada kısa özet olarak kalır; navigasyon bağlantıları ziyaretçiyi ayrıntılı bağımsız sayfalara götürür. İlk sürümde iletişim formu bulunmaz. Telefon, WhatsApp ve e-posta bağlantıları kullanılır; ziyaretçiden site üzerinden sağlık verisi toplanmaz.

KVKK ve gizlilik sayfaları arayüz taslağı olarak hazırlanmıştır. Veri sorumlusu kimliği, hukuki sebepler, aktarım tarafları, saklama süreleri ve production hizmet sağlayıcıları gerçek veri işleme envanteri kesinleştiğinde doldurulacak; yayın öncesinde hukuk uzmanı kontrolü yapılacaktır.

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

Mevcut durumda `frontend`, `proxy`, `directus` ve `database` servisleri uygulanmıştır. Frontend imajı çok aşamalı build kullanır; Caddy container'ı dış istekleri frontend'e yönlendirir. Yerel site varsayılan olarak `http://localhost:8080/`, Directus yönetim arayüzü ise yalnızca bu bilgisayardan erişilecek şekilde `http://localhost:8055/admin/` adresindedir. PostgreSQL host portu açmaz ve yalnızca Compose ağı üzerinden Directus tarafından erişilir. Veritabanı, yüklenen dosyalar ve Directus eklentileri ayrı kalıcı volume'larda tutulur. Zamanlanmış yedek servisi sonraki backend paketinde eklenecektir.

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
