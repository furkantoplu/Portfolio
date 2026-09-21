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
