# Fizyoterapist Web Sitesi — Mimari ve Tasarım Notları

## 1. Projenin amacı

Site iki işi iyi yapmalı:

1. Fizyoterapistin uzmanlığını, yaklaşımını ve çalışma alanlarını sade biçimde anlatmak.
2. Ziyaretçiyi güvenli ve hızlı şekilde iletişim/randevu bilgisine yönlendirmek.

İlk sürüm bir hasta takip veya tedavi sistemi değildir. Sağlık verisi tutulmaz; online ödeme, seans yönetimi ve hasta hesabı kapsam dışıdır.

## 2. Önerilen sayfa yapısı

- **Ana Sayfa**
  - Net değer önerisi
  - Birincil iletişim/randevu butonu
  - Çalışma alanları
  - Kısa uzman profili
  - Üç adımlı yaklaşım
  - Son üç blog yazısı
  - Konum ve iletişim
- **Hakkımda**
  - Eğitim, mesleki unvan, sertifikalar ve yaklaşım
  - Gerçek, profesyonel fotoğraflar
- **Çalışma Alanları**
  - Her alan için ayrı detay sayfası
  - Örnek: bel-boyun sağlığı, sporcu rehabilitasyonu, ameliyat sonrası süreç, duruş ve hareket analizi
- **Blog / Bilgi Köşesi**
  - Liste, kategori ve yazı detay sayfası
  - Yazar ve güncelleme tarihi
- **İletişim**
  - Telefon, WhatsApp, çalışma saatleri, açık adres ve harita
  - Gerekirse yalnızca temel iletişim bilgilerini isteyen kısa form
- **Yasal sayfalar**
  - KVKK aydınlatma metni
  - Çerez politikası
  - Gizlilik politikası
- **İçerik yönetimi**
  - Giriş korumalı yönetim ekranı
  - Yazı oluşturma, taslak kaydetme, kapak görseli, kategori, yayınlama tarihi ve SEO alanları

## 3. Tavsiye edilen teknik mimari

### Önerilen çözüm: Next.js + Directus + PostgreSQL + VPS

- **Web arayüzü:** Next.js + TypeScript
- **Stil:** Tailwind CSS
- **İçerik yönetimi:** Self-hosted Directus Data Studio
- **Veritabanı:** PostgreSQL
- **Yayınlama:** Docker Compose ile Linux VPS
- **Ters proxy:** Caddy veya Nginx
- **Alan adı / DNS / CDN / temel WAF:** Cloudflare
- **Harita:** Google Maps bağlantısı veya izin durumuna göre gömülü harita
- **İletişim:** Telefon ve WhatsApp bağlantısı; form gerekiyorsa sunucu tarafı doğrulama ve spam koruması
- **Analitik:** Açık onay/çerez tercihlerine göre mahremiyet odaklı analitik

Bu yapı, blog için sıfırdan özel admin paneli, kimlik doğrulama, dosya yükleme ve editör geliştirme yükünü kaldırır. Yönetici yalnızca içerik düzenler; sitenin tasarımına veya koduna dokunmaz. Directus'un hazır kullanıcı yönetimi ve TOTP tabanlı iki aşamalı doğrulaması kullanılır.

## 3.1. Sunucu ve alan adı mimarisi

```text
Ziyaretçi
   |
   v
Alan adı + Cloudflare
   |  DNS, HTTPS, CDN, temel güvenlik
   v
Linux VPS
   |
   +-- Caddy/Nginx ters proxy
   +-- Next.js uygulaması (Docker)
   +-- Directus CMS (Docker)
   +-- PostgreSQL (Docker)
   +-- İzleme ve düzenli yedek görevleri
```

Önerilen adresler:

- `siteadi.com`: herkese açık web sitesi
- `www.siteadi.com`: ana adrese yönlendirme
- `siteadi.com/bakir`: yalnızca içerik yöneticisinin giriş yaptığı CMS. `bakir` örnektir; yayına çıkmadan müşteriye özel, tahmin edilmesi zor ve sonradan değiştirilmesi gerekmeyecek bir yol belirlenir.

Cloudflare kurulumu:

1. Alan adı güvenilir bir kayıt kuruluşundan alınır ve mümkünse müşteri adına açılan hesapta tutulur.
2. Alan adının nameserver kayıtları Cloudflare'e yönlendirilir.
3. Ana alan adı ve `www` kaydı VPS'e bağlanır; web trafiği Cloudflare proxy üzerinden geçirilir.
4. Origin sunucuda geçerli TLS sertifikası kurulur ve Cloudflare SSL modu **Full (strict)** yapılır.
5. HTTPS yönlendirmesi, temel güvenlik başlıkları, önbellek kuralları ve sınırlı bot/rate-limit kuralları ayarlanır.
6. Yönetim yolu Cloudflare üzerinde önbellek dışında bırakılır, botlara kapatılır ve ayrıca giriş denemesi sınırlarına tabi tutulur.

VPS temel kurulumu:

- Güncel ve desteklenen Ubuntu LTS
- Docker Engine ve Docker Compose
- Yalnızca gerekli web portları; SSH için anahtar tabanlı erişim
- Güvenlik duvarı ve otomatik güvenlik güncellemeleri
- Container restart politikası ve Next.js, Directus ve PostgreSQL için sağlık kontrolleri
- Uygulama yapılandırması için sunucuda korunan ortam değişkenleri
- Düzenli PostgreSQL ve yüklenen medya yedeği; periyodik geri yükleme testi
- Sunucu kaynak ve erişilebilirlik izlemesi

Directus içerikleri VPS üzerindeki PostgreSQL veritabanında, medya dosyaları kalıcı Docker volume'ünde tutulur. Container silinse bile kalıcı volume'ler korunur; ancak disk veya VPS arızasına karşı bu yeterli değildir. Veritabanı dökümleri ve medya dosyaları VPS dışındaki şifreli bir hedefe düzenli olarak yedeklenmelidir.

### Yönetici giriş güvenliği

1. Yönetici `siteadi.com/bakir` adresini açar.
2. E-posta ve parolasını girer.
3. Directus, Google Authenticator uyumlu TOTP uygulamasındaki 6 haneli kodu ister.
4. Kod doğrulanırsa kısa ömürlü güvenli oturum açılır.

Ek kontroller:

- İlk kurulumda QR kod okutularak TOTP etkinleştirilir.
- Telefon kaybı için kurtarma prosedürü belirlenir: ikinci güvenli cihaz kaydı veya kimlik doğrulamasından sonra sunucu yöneticisinin TOTP'yi sıfırlaması. CMS'nin sunmadığı bir “yedek kod” özelliği varmış gibi kabul edilmez.
- Giriş denemeleri rate limit ile sınırlandırılır; tekrarlanan hatalar geçici olarak engellenir.
- Oturum çerezi `Secure`, `HttpOnly` ve uygun `SameSite` ayarlarıyla kullanılır.
- `/bakir` ve ilgili CMS/API yolları Cloudflare/CDN önbelleğine alınmaz.
- Arama motorları ve site haritası yönetim yolunu içermez.
- Özel yol tek başına güvenlik sayılmaz; e-posta, güçlü parola ve TOTP asıl korumadır.

### Alternatif: Klasik WordPress

Müşteri yönetim panelinin tamamen kendi sunucusunda olmasını veya daha sonra çok sayıda eklenti kullanmayı istiyorsa WordPress düşünülebilir. Küçük ve hızlı bir kişisel portföy + blog için önerilen modern yapı daha temizdir; ancak ucuz paylaşımlı hosting önceliği varsa WordPress ekonomik olabilir.

### İlk sürümde özel admin paneli neden önerilmiyor?

Özel panel; kullanıcı girişi, parola sıfırlama, rol sistemi, dosya güvenliği, editör, taslak/yayın akışı ve bakım sorumluluğu getirir. Müşteri bunların görünümünden çok yazıyı kolayca yayınlamaya önem vereceği için hazır bir CMS daha doğru yatırım olur.

## 4. Basit sistem akışı

```text
Ziyaretçi
   |
   v
Next.js web sitesi -----> Telefon / WhatsApp / Harita
   |
   v
Directus içerik API'si
   ^
   |
Fizyoterapist -> Güvenli CMS girişi -> Taslak -> Ön izleme -> Yayınla
```

## 5. İçerik modeli

### Blog yazısı

- Başlık
- URL kısa adı (slug)
- Kısa özet
- Kapak görseli ve alternatif metni
- İçerik
- Kategori
- Yazar
- Yayın tarihi / son güncelleme tarihi
- Taslak veya yayında durumu
- SEO başlığı ve açıklaması

### Çalışma alanı

- Başlık
- Kısa açıklama
- Kimler için bilgi sunduğu
- Süreç hakkında genel bilgi
- Sık sorulan sorular
- Görsel ve alternatif metni
- İletişim yönlendirmesi

### Site ayarları

- Ad, unvan ve kısa tanıtım
- Telefon, e-posta, WhatsApp
- Adres ve çalışma saatleri
- Sosyal medya bağlantıları
- Ana sayfa metinleri
- SEO ve sosyal paylaşım görseli

## 6. Tasarım yönü

- **Duygu:** sakin, güven veren, kişisel, bilimsel ama soğuk olmayan
- **Renk:** kırık beyaz, koyu orman/teal yeşili, adaçayı ve küçük terracotta vurgu
- **Fotoğraf:** gerçek mekân ve gerçek fizyoterapist; mümkünse stok fotoğraf kullanılmamalı
- **Tipografi:** geniş puntolu, yüksek kontrastlı, sade sans serif
- **Arayüz:** bol boşluk, kısa metinler, belirgin iletişim butonu, mobilde kolay dokunma alanları
- **Kaçınılacaklar:** anatomi klişeleri, aşırı medikal mavi, kırmızı haç, yoğun animasyon, pop-up bombardımanı, fiyat/indirim kampanyası hissi

## 7. Sağlık ve KVKK açısından ürün kararları

- “Kesin sonuç”, “garanti iyileşme”, “en iyi”, “1 numara” gibi reklam ve sonuç vaadi içeren metinler kullanılmamalı.
- Öncesi/sonrası görselleri ve doğrulanamayacak hasta yorumları tasarımın omurgası yapılmamalı.
- Blog metinleri genel bilgilendirme amacı taşımalı; kişiye özel tanı veya tedavi önerisi gibi yazılmamalı.
- İletişim formunda sağlık şikâyeti, teşhis, rapor veya görüntü istenmemeli. Sağlık verisi özel nitelikli kişisel veridir.
- Form varsa aydınlatma metni görünür olmalı; pazarlama izni randevu/iletişim talebinin zorunlu şartı yapılmamalı.
- Son hukuki metinler yayından önce alanında uzman biri tarafından kontrol edilmelidir.

## 8. MVP kapsamı

### Dahil

- Responsive ana sayfa
- Hakkımda
- Çalışma alanları liste ve detay
- Blog liste ve detay
- İletişim ve harita
- CMS üzerinden yazı yayınlama
- Temel teknik SEO, site haritası ve sosyal paylaşım görseli
- Performans ve erişilebilirlik kontrolleri
- KVKK/gizlilik/çerez sayfa şablonları

### Sonraya bırakılabilir

- Online randevu takvimi
- Çoklu dil
- E-posta bülteni
- Hasta hesabı
- Seans ve ödeme yönetimi
- Gelişmiş arama ve filtreleme

## 9. Uygulama sırası

1. Müşteriye görsel yön ve sayfa yapısını onaylat.
2. Gerçek marka bilgilerini, çalışma alanlarını ve fotoğrafları topla.
3. Figma veya kodlanabilir detaylı arayüzleri hazırla.
4. CMS içerik modellerini kur.
5. Ön yüzü geliştir ve gerçek içerikleri bağla.
6. Mobil, erişilebilirlik, performans, SEO ve yasal içerik kontrollerini yap.
7. Alan adı ve yayın ortamını bağla; kısa bir yönetim eğitimi ver.

## 10. Müşteriden istenecek içerikler

- Tam ad ve kullanılacak mesleki unvan
- Özgeçmiş, eğitim ve doğrulanabilir sertifikalar
- Çalışma alanları ve sunulan hizmetlerin sınırı
- Adres, telefon, çalışma saatleri ve sosyal medya
- Profesyonel portre ve çalışma ortamı fotoğrafları
- Logo varsa kaynak dosyası
- İlk üç blog konusu
- Alan adı tercihi
- İletişim/randevu sürecinin nasıl işleyeceği

## 11. Araştırma notları

Güncel fizyoterapi sitesi örneklerinde güçlü ortaklar; gerçek uzman fotoğrafı, açık çalışma alanları, görünür iletişim aksiyonu, mobil kullanım, konum bilgisi ve bilgilendirici içeriklerdir. Tasarım, “güven + kime yardımcı olduğu + nasıl iletişim kurulacağı” üçlüsünü ilk ekranda anlatmalıdır.

Başlıca referanslar:

- Sağlık Bakanlığı, Sağlık Hizmetlerinde Tanıtım ve Bilgilendirme Faaliyetleri Hakkında Yönetmelik: https://antalyaism.saglik.gov.tr/TR-366500/saglik-hizmetlerinde-tanitim-ve-bilgilendirme--faaliyetleri-hakkinda-yonetmelik.html
- KVKK, Özel Nitelikli Kişisel Veriler: https://www.kvkk.gov.tr/Icerik/2051/Ozel-Nitelikli-Kisisel-Veriler
- Fizik tedavi sitesi tasarım örnekleri ve ortak desenler: https://www.webcitz.com/blog/best-physical-therapy-websites/
- Hasta odaklı içerik ve dönüşüm yaklaşımı: https://www.physio-growth.com/blog/pt-practice-website-that-gets-patients.html
