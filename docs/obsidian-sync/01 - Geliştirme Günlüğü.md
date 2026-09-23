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
- Docker temel altyapısı `2f9f056` kimliği ve `chore: add docker deployment foundation` mesajıyla commit edildi.
- Uzak GitHub deposunun boş olduğu `git ls-remote` ile doğrulandı; mevcut bir uzak geçmişin üzerine yazılmadı.
- Yerel dal `master` adından `main` adına taşındı.
- `origin` remote'u `https://github.com/furkantoplu/Portfolio.git` adresine eklendi.
- Tüm yerel commit geçmişi `origin/main` dalına başarıyla push edildi ve upstream takibi kuruldu.
- Docker doğrulaması sonrasında daha önce açık bırakılan `localhost:5173` geliştirme sunucusu durduruldu; çalışan sunum ortamı Docker üzerinden `http://localhost:8080/` olarak bırakıldı.

### Paket 6 — Sabit navbar ve ilk çalışma alanı detay sayfası

- Mevcut tema ve görsel yön korunarak iç sayfa tasarımlarına geçildi.
- Header içeriği tekrar kullanılabilir `app/components/site-header.tsx` bileşenine taşındı.
- Navigasyon ana sayfa ve detay sayfasında aynı ortak bileşeni kullanacak şekilde düzenlendi.
- Navbar `position: fixed` yapısına geçirildi; sayfa kaydırılırken ekrandan bağımsız biçimde üstte kalması sağlandı.
- Sabit menüye yarı saydam arka plan, blur, ince sınır ve hafif gölge eklendi.
- Sayfa içeriklerine navbar yüksekliği kadar üst boşluk verildi; bölüm bağlantılarının menünün altında kalmaması için `scroll-margin-top` tanımlandı.
- Mobil görünümde navbar yüksekliği ve sayfa üst boşluğu 78 piksele uyarlandı.
- Ana sayfadaki `Bel ve Boyun Sağlığı` kartı `/calisma-alanlari/bel-ve-boyun-sagligi` rotasına bağlandı.
- Bel ve Boyun Sağlığı detay sayfasına özel başlık ve açıklama metadata'sı eklendi.
- Detay sayfasında şu bölümler tasarlandı:
  - Çalışma alanlarına dönüş bağlantısı ve görsel hero alanı
  - Genel değerlendirme yaklaşımı ve örnek değerlendirme başlıkları
  - Üç aşamalı süreç anlatımı
  - İlk görüşme öncesi kısa soru ve cevaplar
  - İletişim yönlendirmesi ve sade alt bilgi
- Sağlık reklamı sınırları korunarak garanti, kesin sonuç veya tanı dili kullanılmadı.
- Sayfada içeriklerin genel bilgilendirme amaçlı olduğuna ilişkin görünür uyarı kullanıldı.
- Yeni sayfa için ek görsel üretilmedi; mevcut fizyoterapi görseli farklı kırpma ile tekrar kullanıldı.
- Production build ana sayfa ve yeni detay rotasıyla başarıyla tamamlandı.
- Docker imajı yeniden oluşturuldu ve frontend container sağlık kontrolünden geçti.
- `http://localhost:8080/` ve `http://localhost:8080/calisma-alanlari/bel-ve-boyun-sagligi` rotalarının ikisi de HTTP 200 yanıtıyla doğrulandı.
- Detay sayfasının ilk görünümü ve kaydırma sonrasında sabit navbar davranışı tarayıcıda görsel olarak kontrol edildi.
- Paket `518e625` kimliği ve `feat: add fixed navigation and practice detail page` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

## 22 Eylül 2026

### Paket 7 — Blog liste ve ilk yazı detay tasarımı

- Frontend geliştirmesine blog deneyimiyle devam edildi.
- Navbar içindeki Blog bağlantısı ana sayfa bölümünden bağımsız `/blog` rotasına taşındı.
- Ana sayfadaki “Tüm yazıları görün” bağlantısı yeni blog liste sayfasına bağlandı.
- Ana sayfadaki ilk blog kartı `/blog/masa-basinda-hareket-molalari` yazı detayına bağlandı.
- Tekrarlanan footer yapısı `app/components/site-footer.tsx` bileşenine taşındı.
- Ana sayfa, blog listesi ve blog yazısı aynı footer bileşenini kullanacak şekilde düzenlendi.
- `/blog` sayfasında şu alanlar tasarlandı:
  - Koyu yeşil editoryal giriş alanı
  - Görselli öne çıkan yazı
  - Kategori, tarih ve tahmini okuma süresi bilgileri
  - Bilgi arşivi kartları
  - Genel bilgilendirme uyarısı
- Henüz detay sayfası hazırlanmayan iki örnek içerik “Yakında” durumuyla gösterildi; bozuk sayfa bağlantısı oluşturulmadı.
- `/blog/masa-basinda-hareket-molalari` rotasında ilk yazı detay tasarımı oluşturuldu.
- Yazı detayına özel metadata başlığı ve açıklaması tanımlandı.
- Yazı sayfasında içerik özeti, geniş kapak görseli, masaüstünde sabit içerik dizini, metin bölümleri, vurgulu alıntı, uygulanabilir adım kartları ve iletişim yönlendirmesi yer aldı.
- İçerik dili genel bilgilendirme sınırında tutuldu; kişisel egzersiz, tanı veya tedavi önerisi verilmedi.
- Yeni görsel üretilmedi; mevcut fizyoterapi görseli editoryal kırpma ile tekrar kullanıldı.
- Production build dört rota ile başarıyla tamamlandı:
  - `/`
  - `/blog`
  - `/blog/masa-basinda-hareket-molalari`
  - `/calisma-alanlari/bel-ve-boyun-sagligi`
- Docker imajı yeniden oluşturuldu ve frontend container `healthy` durumuna geçti.
- Dört rotanın tamamı Docker/Caddy üzerinden HTTP 200 yanıtıyla doğrulandı.
- Blog liste sayfası ve ilk yazı detay sayfası tarayıcıda görsel olarak kontrol edildi.
- Paket `e36e7cd` kimliği ve `feat: add blog listing and article design` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

### Paket 8 — İşlevsel mobil navigasyon

- Tablet ve mobil görünümde daha önce yalnızca görsel olan menü düğmesi işlevsel hale getirildi.
- Ortak header etkileşimli bir istemci bileşeni olarak düzenlendi.
- 1120 piksel ve altındaki ekranlarda sağdan açılan koyu yeşil navigasyon paneli tasarlandı.
- Panelde numaralandırılmış ana sayfa, hakkımda, çalışma alanları, blog ve iletişim bağlantıları gösterildi.
- Mevcut rota panel içinde görsel olarak vurgulandı.
- Mobil randevu yönlendirmesi panelin alt bölümüne yerleştirildi.
- Menü düğmesinin açık/kapalı durumuna uygun menü ve çarpı ikonları eklendi.
- Menü; düğmeye yeniden basıldığında, panel dışına dokunulduğunda, bağlantı seçildiğinde ve Escape tuşuna basıldığında kapanacak şekilde hazırlandı.
- Panel açıkken arka sayfanın kaydırılması durduruldu; panel kapandığında body kaydırma ayarı temizleniyor.
- `aria-expanded`, `aria-controls`, durumla değişen erişilebilir etiketler ve kapalı panel bağlantıları için odak kontrolü eklendi.
- Marka işareti ve navigasyon verisi ayrı ortak modüllere taşındı. Böylece istemci bileşeni sınırı footer'a taşınmadı ve header/footer aynı bağlantı kaynağını kullanmaya devam etti.
- İlk Docker denemesinde istemci bileşeni sınırı nedeniyle ana sayfanın HTTP 500 verdiği tespit edildi. Ortak veri ve marka bileşeni ayrıştırılarak sorun giderildi.
- Production build dört rota ile başarıyla tamamlandı.
- Docker imajı yeniden oluşturuldu ve frontend container `healthy` durumuna geçti.
- `/`, `/blog`, `/blog/masa-basinda-hareket-molalari` ve `/calisma-alanlari/bel-ve-boyun-sagligi` rotalarının tamamı Docker/Caddy üzerinden HTTP 200 yanıtıyla doğrulandı.
- 390 × 844 piksel mobil görünümde kapalı ve açık menü görsel olarak kontrol edildi; panelin ekrana sığdığı ve Escape ile kapandığı doğrulandı.
- Paket `c7a3f34` kimliği ve `feat: add responsive mobile navigation` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

### Paket 9 — Ortak çalışma alanı şablonu ve Sporcu Rehabilitasyonu

- Çalışma alanlarının ziyaretçi açısından ayrı sayfa ve ayrı URL kullanmasına karar verildi.
- Sayfaların kopyala-yapıştır kodlarla çoğaltılmaması için tekrar kullanılabilir `PracticeDetail` bileşeni oluşturuldu.
- Ortak şablon hero, değerlendirme alanı, üç aşamalı süreç, SSS, iletişim yönlendirmesi ve alt bilgi bölümlerini içeriyor.
- Şablonun içerik modeli; sıra numarası, başlık, vurgulu başlık, giriş metni, görsel, genel değerlendirme metni, değerlendirme maddeleri, süreç adımları ve sorulardan oluşuyor.
- Mevcut `/calisma-alanlari/bel-ve-boyun-sagligi` sayfası görünümü değiştirilmeden ortak şablona taşındı.
- `/calisma-alanlari/sporcu-rehabilitasyonu` adresinde ikinci çalışma alanı detay sayfası oluşturuldu.
- Sporcu Rehabilitasyonu sayfasına özel SEO başlığı ve açıklaması eklendi.
- İçerikte spor dalının gereksinimleri, hareket kapasitesi, kademeli yüklenme, spora dönüş hedefleri ve sık sorulan sorular ele alındı.
- Kesin iyileşme veya kesin spora dönüş süresi vaadi kullanılmadı; içerik genel bilgilendirme sınırında tutuldu.
- Ana sayfadaki Sporcu Rehabilitasyonu kartı yeni detay rotasına bağlandı.
- Production build beş rota ile başarıyla tamamlandı.
- Docker imajı yeniden oluşturuldu ve frontend container `healthy` durumuna geçti.
- Beş rotanın tamamı Docker/Caddy üzerinden HTTP 200 yanıtıyla doğrulandı.
- Yeni sayfa masaüstü ve 390 × 844 piksel mobil görünümde görsel olarak kontrol edildi.
- Paket `6082811` kimliği ve `feat: add reusable practice detail pages` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

### Paket 10 — Çalışma alanları frontend bütününün tamamlanması

- Kullanıcının onayıyla önceki küçük paketlerden daha geniş kapsamlı bir frontend paketi hazırlandı.
- `/calisma-alanlari` adresinde dört çalışma alanını tek yerde sunan bağımsız bir dizin sayfası oluşturuldu.
- Dizin sayfasında editoryal giriş alanı, dört büyük çalışma alanı kartı, yaklaşım uyarısı, iletişim yönlendirmesi ve ortak footer kullanıldı.
- Masaüstünde iki sütun, mobilde tek sütun kart düzeni hazırlandı.
- Header ve footer içindeki “Çalışma Alanları” bağlantısı ana sayfa içi bağlantı yerine yeni dizin sayfasına yönlendirildi.
- Ana sayfadaki hero ve bölüm içi bağlantılar, ziyaretçiyi aynı sayfadaki çalışma alanı bölümüne götürmeye devam ediyor.
- Dört çalışma alanının temel katalog verileri `app/components/practice-catalog.ts` dosyasında merkezileştirildi:
  - Sıra numarası
  - Slug
  - Başlık
  - Kısa açıklama
  - Detay URL'si
- Ana sayfa kartları ve çalışma alanı dizini aynı katalog verisini kullanacak şekilde düzenlendi.
- `/calisma-alanlari/ameliyat-sonrasi-surec` detay sayfası oluşturuldu.
- Ameliyat sonrası içerikte hekim yönlendirmesinin esas olduğu açıkça belirtildi; kesin başlangıç zamanı veya sonuç vaadi kullanılmadı.
- `/calisma-alanlari/durus-ve-hareket-analizi` detay sayfası oluşturuldu.
- Duruş içeriğinde tek bir “doğru duruş” iddiası yerine hareket çeşitliliği, günlük bağlam ve kişisel değerlendirme yaklaşımı kullanıldı.
- İki yeni sayfaya özgü SEO başlıkları ve açıklamaları eklendi.
- `PracticeDetail` içerik modeline slug bilgisi eklendi.
- Her detay sayfasının sonuna mevcut sayfa dışındaki üç çalışma alanını gösteren çapraz yönlendirme bölümü eklendi.
- Böylece ziyaretçi bir detay sayfasından diğer çalışma alanlarına veya genel çalışma alanı dizinine doğrudan geçebiliyor.
- Production build sekiz rotayla başarıyla tamamlandı.
- Docker imajı yeniden oluşturuldu ve frontend container `healthy` durumuna geçti.
- Sekiz rotanın tamamı Docker/Caddy üzerinden HTTP 200 yanıtıyla doğrulandı.
- Çalışma alanları dizini masaüstü ve 390 × 844 piksel mobil görünümde kontrol edildi.
- Duruş ve Hareket Analizi detay sayfasının hero alanı ile detay sayfalarının çapraz yönlendirme bölümü görsel olarak kontrol edildi.
- Paket `a39dfe7` kimliği ve `feat: complete practice areas frontend` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

### Paket 11 — Hakkımda, İletişim ve yasal taslak sayfaları

- Büyük frontend paketi kapsamında kurumsal ve yasal sayfa tasarımları tamamlandı.
- `/hakkimda` adresinde bağımsız Hakkımda sayfası oluşturuldu.
- Hakkımda sayfasında portreli hero, mesleki yaklaşım, çalışma ilkeleri ve çalışma alanlarına yönlendirme bölümleri hazırlandı.
- Müşteriden henüz alınmayan diploma, eğitim ve sertifika bilgileri uydurulmadı; gerçek içerik bekleyen alan açık bir notla belirtildi.
- `/iletisim` adresinde bağımsız İletişim sayfası oluşturuldu.
- Telefon, WhatsApp ve e-posta seçenekleri büyük erişilebilir bağlantı kartları olarak tasarlandı.
- Görüşme adresi, çalışma saatleri ve iletişimden ilk görüşmeye kadar üç adımlı süreç bölümü eklendi.
- İlk iletişimde sağlık raporu veya ayrıntılı sağlık verisi gönderilmemesi gerektiği görünür biçimde belirtildi.
- Bilinçli veri minimizasyonu kararıyla ilk sürüme iletişim formu eklenmedi.
- `/kvkk-aydinlatma-metni` ve `/gizlilik` rotaları oluşturuldu.
- İki yasal sayfanın ortak düzeni `LegalDocument` bileşeninde merkezileştirildi.
- KVKK taslağında veri sorumlusu kimliği, işlenebilecek veriler, işleme amaçları, aktarım/yöntem/hukuki sebep ile ilgili kişi hakları ayrı bölümlerde sunuldu.
- Gizlilik taslağında site kapsamı, harici iletişim bağlantıları, teknik kayıtlar, çerez/ölçüm araçları ve güncelleme bilgileri yer aldı.
- Yasal metinlerin gerçek veri işleme envanteri ve production sağlayıcıları kesinleşmeden nihai olmadığı açıkça gösterildi.
- Taslak oluşturulurken Kişisel Verileri Koruma Kurumunun resmî aydınlatma yükümlülüğü sayfası ve kamuoyu duyurusu kontrol edildi:
  - https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-
  - https://www.kvkk.gov.tr/Icerik/6765/AYDINLATMA-YUKUMLULUGUNUN-YERINE-GETIRILMESI-HAKKINDA-KAMUOYU-DUYURUSU
- Navbar içindeki Hakkımda ve İletişim bağlantıları bağımsız sayfalara taşındı.
- Header randevu butonları ve site genelindeki iletişim çağrıları `/iletisim` rotasına bağlandı.
- Footer içindeki KVKK ve Gizlilik bağlantıları gerçek rotalara bağlandı.
- Production build on iki rota ile başarıyla tamamlandı.
- Docker imajı yeniden oluşturuldu ve frontend container `healthy` durumuna geçti.
- On iki rotanın tamamı Docker/Caddy üzerinden HTTP 200 yanıtıyla doğrulandı.
- Hakkımda ve İletişim sayfaları masaüstünde; İletişim ve KVKK sayfaları 390 × 844 piksel mobil görünümde görsel olarak kontrol edildi.
- Paket `2f4a5b5` kimliği ve `feat: add about contact and legal pages` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

## 23 Eylül 2026

### Paket 12 — Furkan Toplu kişiselleştirmesi ve backend temeli

- Site genelindeki örnek fizyoterapist adı `Furkan Toplu` olarak güncellendi.
- Sayfa metadata'ları, header, footer, ana sayfa, kurumsal sayfalar, çalışma alanları, blog ve yasal taslaklarda aynı isim kullanıldı.
- Örnek iletişim e-postası `merhaba@furkantoplu.com` olarak düzenlendi.
- Ana sayfadaki dört çalışma alanı kartının bağlantı metni `Detayları incele` yapıldı.
- Kart bağlantılarının yazı boyutu 12 pikselden 13 piksele yükseltildi.
- Backend'e ilk kontrollü geçiş paketi hazırlandı.
- Docker Compose'a `postgres:16-alpine` tabanlı `database` servisi eklendi.
- PostgreSQL dışarıya port açmadan yalnızca Docker ağı içinde çalışacak şekilde yapılandırıldı.
- Veritabanı verileri `postgres_data` adlı kalıcı volume'a bağlandı ve `pg_isready` sağlık kontrolü eklendi.
- Docker Compose'a sürümü açıkça sabitlenmiş `directus/directus:12.4.0` servisi eklendi.
- Directus, PostgreSQL sağlık kontrolü başarılı olduktan sonra başlayacak şekilde bağımlı hale getirildi.
- Directus yönetim portu geliştirme ortamında yalnızca `127.0.0.1:8055` adresine açıldı; yerel ağdan veya internetten doğrudan erişim engellendi.
- Directus yüklemeleri ve eklentileri `directus_uploads` ve `directus_extensions` kalıcı volume'larına bağlandı.
- Directus telemetrisi kapatıldı, WebSocket desteği etkinleştirildi ve yönetim arayüzü üzerinden container sağlık kontrolü eklendi.
- Gizli olmayan ortam değişkeni şablonu `.env.example` dosyasına eklendi.
- Gerçek yerel parolalar ve Directus secret değeri yalnızca Git tarafından yok sayılan `.env` dosyasında tutuldu.
- İlk bootstrap sırasında `.local` uzantılı yönetici e-postasının Directus tarafından geçerli kabul edilmediği görüldü; adres `admin@furkantoplu.com` olarak düzeltildi.
- Veritabanı ilk denemede kurulmuş olduğundan yönetici hesabı Directus CLI ile güvenli biçimde oluşturuldu.
- Yönetici oturum açma isteği HTTP 200 yanıtıyla doğrulandı; parola terminal çıktısına veya dokümana yazılmadı.
- Directus 12'de anonim `/server/health` isteğinin 403 döndürdüğü belirlendi; container sağlık kontrolü başarılı yanıt veren `/admin/` rotasına taşındı.
- `database`, `directus` ve `frontend` container'larının `healthy`, Caddy `proxy` servisinin çalışır durumda olduğu doğrulandı.
- Site `http://localhost:8080/`, yönetim arayüzü `http://localhost:8055/admin/` üzerinden HTTP 200 yanıtıyla kontrol edildi.
- Tarayıcı kontrolünde sayfa başlığının `Fzt. Furkan Toplu | Fizyoterapi` olduğu ve dört kart bağlantısının `Detayları incele` metnini 13 piksel boyutunda gösterdiği doğrulandı.
- Bu paket yalnızca backend çalışma temelini kurdu; içerik koleksiyonları, roller/izinler, TOTP, production `/bakir` yönlendirmesi ve yedekleme sıradaki backend paketlerine bırakıldı.
- Paket `ed68940` kimliği ve `feat: add backend foundation and personalize site` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

### Paket 13 — Yönetilebilir çalışma alanları şeması

- Çalışma alanlarının sayısının yaklaşık 15'e ve ileride daha fazlasına çıkabileceği gereksinimi mimariye eklendi.
- Çalışma alanlarının koda sabit sayfalar olarak eklenmesi yerine Directus `practice_areas` koleksiyonundan yönetilmesine karar verildi.
- Tekrar çalıştırıldığında mevcut veri veya şemayı silmeyen `scripts/bootstrap-directus.mjs` kurulum betiği oluşturuldu.
- Betik yönetici bilgilerini Git'e kapalı `.env` dosyasından okur; parola veya erişim anahtarını çıktıya yazmaz.
- `practice_areas` koleksiyonuna yayın durumu, sıralama, ana sayfada gösterme, başlık, slug, kart açıklaması, giriş, detay metni, değerlendirme maddeleri, süreç adımları, SSS ve SEO alanları eklendi.
- Yayın durumu için `Taslak`, `Yayında` ve `Gizli` seçenekleri tanımlandı.
- `Gizli` durumundaki kayıtların silinmeden yayından kaldırılması; `Ana sayfada göster` seçeneğinin ise genel yayından bağımsız olarak ana sayfa kartlarını sınırlandırması kararlaştırıldı.
- Slug alanına benzersizlik kuralı eklendi; iki çalışma alanının aynı URL'yi üretmesi engellendi.
- Directus alanları Türkçe etiketler ve açıklamalarla panelde anlaşılır hale getirildi.
- Mevcut dört çalışma alanı başlangıç verisi olarak `Yayında` ve `Ana sayfada göster` durumunda eklendi.
- Kurulum betiği ikinci kez çalıştırıldı; koleksiyonun ve dört kaydın çoğaltılmadığı doğrulandı.
- Veritabanında dört kaydın sırası, başlığı, slug değeri ve yayın durumu doğrudan kontrol edildi.
- Bu paket henüz public API izni veya frontend veri bağlantısı açmaz. Sonraki paket yalnızca yayınlanmış kayıtların okunmasını sağlayacak ve liste/detay sayfalarını Directus verisine bağlayacaktır.
