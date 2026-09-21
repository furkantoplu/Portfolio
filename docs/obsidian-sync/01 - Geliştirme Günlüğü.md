# Fizyoterapist Web Sitesi — Geliştirme Günlüğü

## 20 Eylül 2026

### Araştırma ve kapsam

- Türkiye ve yurt dışındaki güncel fizyoterapist sitesi örnekleri incelendi.
- Güçlü ortak desenler belirlendi: gerçek uzman fotoğrafı, anlaşılır çalışma alanları, görünür iletişim bilgisi, konum bilgisi ve mobil uyumluluk.
- Türkiye'deki sağlık tanıtımı ve KVKK sınırları mimariye dahil edildi.
- Projenin hasta takip sistemi olmadığı netleştirildi.
- Online ödeme, hasta hesabı, seans takibi ve sağlık verisi toplama ilk sürüm kapsamından çıkarıldı.

### İlk görsel konsept

- Müşteri sunumu için yüksek sadakatli masaüstü ana sayfa mockupı üretildi.
- Görsel yön: kırık beyaz, koyu orman yeşili, adaçayı ve terracotta.
- Tasarım dili: sıcak, bilimsel, güvenilir fakat hastane şablonu gibi olmayan kişisel portföy.
- Mockup proje içinde `assets/fizyoterapist-anasayfa-konsept-v1.png` olarak saklandı.

### İlk mimari kararı

- Başlangıçta Next.js + Sanity Studio düşünüldü.
- Site sahibinin e-posta/parola ve Google Authenticator uyumlu TOTP isteği netleşince CMS kararı değiştirildi.
- Self-hosted Directus + PostgreSQL seçildi.
- Yönetim panelinin özel bir path altında çalışması planlandı.
- Production ortamının VPS, Docker Compose, Cloudflare ve domain üzerinden kurulması kararlaştırıldı.

## 21 Eylül 2026

### Paket 1 — Tasarım temeli, header ve hero

- Frontend projesi `frontend/` klasöründe kuruldu.
- React, TypeScript ve Vinext tabanlı çalışma ortamı hazırlandı.
- Projeye özel renk tokenları ve temel tipografi oluşturuldu.
- Marka alanı, navigasyon ve randevu bilgisi butonu hazırlandı.
- Masaüstü ve mobil hero yerleşimi oluşturuldu.
- Fizyoterapi sahnesi için bağımsız hero fotoğrafı üretildi ve `frontend/public/hero-physiotherapy-v1.png` olarak saklandı.
- Siteye özel yaprak/hareket temalı favicon hazırlandı.
- Hero metinleri sağlık reklamı sınırlarına uygun, iddiasız ve bilgilendirici tutuldu.
- Yerel önizleme `http://localhost:5173/` üzerinde çalıştırıldı.
- Production build başarıyla doğrulandı.

### Paket 2 — Çalışma alanları

- Ana sayfaya koyu yeşil zeminli çalışma alanları bölümü eklendi.
- Dört örnek alan tanımlandı:
  - Bel ve Boyun Sağlığı
  - Sporcu Rehabilitasyonu
  - Ameliyat Sonrası Süreç
  - Duruş ve Hareket Analizi
- Kart yapısı masaüstünde dört sütun, tablette iki sütun ve mobilde tek sütun olacak şekilde hazırlandı.
- İlk kart terracotta vurgu rengiyle öne çıkarıldı.
- İçeriklerin genel bilgilendirme amaçlı olduğuna dair not eklendi.
- Production build yeniden başarıyla doğrulandı.

### Sürüm kontrol kararı

- Projede yerel Git kullanılmasına karar verildi.
- GitHub repository veya remote henüz oluşturulmayacak.
- Push işlemleri kullanıcı GitHub reposunu açtığını bildirdikten sonra yapılacak.
- Her anlamlı arayüz paketi yerel bir commit ile işaretlenecek.

### Yerel Git başlangıcı

- Proje kökünde yerel Git deposu oluşturuldu.
- GitHub remote eklenmedi ve push yapılmadı.

### Paket 5 — İletişim ve alt bilgi

- Ana sayfaya `#iletisim` kimliğini kullanan iletişim bölümü eklendi.
- Ziyaretçinin doğrudan ulaşabilmesi için telefon, WhatsApp ve e-posta seçenekleri tasarlandı.
- Sağlık verisi toplayabilecek bir iletişim formu özellikle eklenmedi.
- Görüşme konumu, çalışma günleri ve çalışma saatleri için ayrı bilgi alanları oluşturuldu.
- Telefon, e-posta, adres ve sosyal medya bilgileri müşteri verileri gelene kadar sunum amaçlı örnek değerlerle dolduruldu.
- Alt bilgi bölümüne marka alanı, sayfa navigasyonu, Instagram bağlantısı, genel bilgilendirme notu ve yasal metin bağlantıları eklendi.
- Masaüstü, tablet ve mobil kırılımlar için iletişim kartları ve footer yerleşimi ayrı ayrı düzenlendi.
- Yerel geliştirme sunucusu yeniden başlatıldı ve `http://localhost:5173/#iletisim` adresi HTTP 200 yanıtıyla doğrulandı.
- Masaüstü iletişim ve footer görünümü tarayıcıda görsel olarak kontrol edildi.
- İlk derlemede mevcut ikon paketinde Instagram ikonu bulunmadığı görüldü; bağımlılık eklemek yerine uyumlu metin işareti kullanıldı.
- Düzeltme sonrasında production build başarıyla tamamlandı.
- İletişim ve alt bilgi paketi `7aabaab` kimliğiyle yerel Git deposuna kaydedildi.
- Commit mesajı: `feat: add contact and footer sections`.
- GitHub remote eklenmedi ve push yapılmadı.
- İlk kontrol noktası `f5eeab4` kimliğiyle oluşturuldu.
- İlk commit mesajı: `feat: establish physiotherapy site foundation`.
- Bu commit; mimari notlarını, ilk mockupı, frontend temelini, hero bölümünü ve çalışma alanları paketini kapsıyor.

### Dokümantasyon kararı

- Projedeki mimari, teknik kararlar ve günlük gelişmeler Obsidian notlarıyla birlikte ilerleyecek.
- Kanonik notların proje içindeki aynası `docs/obsidian-sync/` altında tutulacak.
- Aynı notlar Obsidian kasasındaki `cybersecurity/fizyoterapist` klasörüne eşitlenecek.

### Paket 3 — Hakkımda ve yaklaşım

- Ana sayfaya Hakkımda bölümü eklendi.
- Gerçek müşteri fotoğrafları gelene kadar kullanılmak üzere bağımsız bir fizyoterapist portresi üretildi.
- Geçici portre `frontend/public/about-physiotherapist-v1.png` olarak kaydedildi.
- Bölümde kişisel yaklaşımı anlatan iki kısa metin ve üç temel değer kullanıldı: dinlemek, anlamak ve birlikte ilerlemek.
- Süreç; dinleme, yol haritası oluşturma ve takip olmak üzere üç adımda görselleştirildi.
- Navigasyondaki Hakkımda ve Çalışma Alanları bağlantıları gerçek bölüm kimliklerine bağlandı.
- Mobil görünümde portre, değerler ve süreç adımları tek sütun yapısına dönüştürüldü.
- Production build başarıyla tamamlandı.

### Paket 3 — Git kontrol noktası

- Hakkımda ve yaklaşım paketi `14f51c0` kimliğiyle yerel Git deposuna kaydedildi.
- Commit mesajı: `feat: add about and care approach section`.
- GitHub remote eklenmedi ve herhangi bir uzak depoya push yapılmadı.

### Paket 4 — Bilgi Köşesi blog önizlemesi

- Ana sayfaya `#blog` kimliğini kullanan Bilgi Köşesi bölümü eklendi.
- Navigasyondaki Blog bağlantısı yeni bölüme bağlandı.
- İleride Directus üzerinden gelecek blog kayıtlarına benzer bir veri yapısı hazırlandı: kategori, başlık, özet, yayın tarihi ve tahmini okuma süresi.
- Üç örnek içerik kartı oluşturuldu:
  - Masa başında geçen günlerde hareket molaları neden önemli?
  - Egzersizde düzeni korumayı kolaylaştıran üç küçük adım
  - İlk fizyoterapi görüşmesinde sizi neler bekler?
- İlk yazı koyu yeşil vurgulu kartla öne çıkarıldı; diğer iki yazı açık editoryal kartlarla sunuldu.
- Bölüm yeni bir fotoğraf eklenmeden, tipografi ve sade geometrik detaylarla hazırlandı. Böylece son sitedeki görsel sayısı kontrollü tutuldu.
- İçeriklerin genel bilgilendirme amaçlı olduğu ve kişisel tanı veya tedavi önerisi yerine geçmediği belirtildi.
- Kart düzeni masaüstünde üç sütun, tablette iki sütun ve mobilde tek sütun olarak ayarlandı.
- Yerel önizleme `http://localhost:5173/#blog` adresinde HTTP 200 yanıtıyla ve görsel kontrolle doğrulandı.
- Production build başarıyla tamamlandı.
- Bilgi Köşesi paketi `2f17d78` kimliğiyle yerel Git deposuna kaydedildi.
- Commit mesajı: `feat: add blog preview section`.
- GitHub remote eklenmedi ve push yapılmadı.

### Docker temel altyapısı ve GitHub geçişi

- Kullanıcının talebiyle projenin sunucuya aktarımını kolaylaştıracak Docker temeli arayüz aşamasında hazırlandı.
- Frontend için iki aşamalı `frontend/Dockerfile` oluşturuldu:
  - İlk aşama bağımlılıkları kurup production build alıyor.
  - İkinci aşama yalnızca derleme çıktısını ve sabitlenmiş Wrangler çalışma ortamını içeriyor.
  - Runtime root kullanıcısı yerine `node` kullanıcısıyla çalışıyor.
- Docker build bağlamından `node_modules`, build çıktıları, yerel ayarlar ve `.env` dosyalarını çıkaran `.dockerignore` eklendi.
- Proje köküne `compose.yaml` eklendi.
- Compose içinde mevcut iki servis tanımlandı:
  - `frontend`: Vinext uygulaması, dahili 3000 portu ve sağlık kontrolü.
  - `proxy`: Caddy 2.10, varsayılan olarak host üzerindeki 8080 portu.
- `deploy/Caddyfile` ile gzip/zstd sıkıştırma, temel güvenlik başlıkları ve frontend reverse proxy ayarlandı.
- Gizli `.env` dosyaları, yedek klasörleri ve loglar kök `.gitignore` içine alındı.
- İlk container testinde root olmayan kullanıcının Wrangler geçici klasörüne yazamadığı belirlendi.
- Docker imajında yalnızca gerekli çalışma klasörleri `node` kullanıcısına verilerek sorun giderildi; container root kullanıcısına alınmadı.
- `docker compose up -d --build` başarıyla tamamlandı.
- Frontend container sağlık kontrolü `healthy` durumuna geçti.
- Caddy üzerinden `http://localhost:8080/` adresinden HTTP 200 yanıtı alındı.
- Docker kullanım komutları kök `README.md` dosyasına ve teknik karar notuna eklendi.
- Kullanıcı `https://github.com/furkantoplu/Portfolio.git` deposunu hedef remote olarak bildirdi ve push yetkisi verdi.
