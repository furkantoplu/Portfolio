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
- Paket `03d1652` kimliği ve `feat: add manageable practice areas schema` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

### Paket 14 — Directus–frontend çalışma alanları bağlantısı

- Mevcut dört detay sayfasındaki tüm başlık, açıklama, değerlendirme maddesi, süreç adımı, SSS ve SEO içeriği Directus kayıtlarına aktarıldı.
- `practice_areas` koleksiyonuna detay hero başlıkları, vurgu başlıkları, giriş metni, görsel yolu/alternatif metni ve değerlendirme başlıkları için eksik alanlar eklendi.
- Kurulum betiği mevcut yönetici düzenlemelerini ezmemek için yalnızca boş alanları tamamlayacak şekilde geliştirildi.
- Directus 12.4.0 ücretsiz kurulumunda özel satır bazlı permission kuralının `custom_permission_rules_enabled` lisans kısıtına takıldığı kurulum sırasında tespit edildi.
- Gizli kayıtları standart public API ile açmamak için anonim `items/practice_areas` erişimi kapalı bırakıldı.
- `directus-extension-website-content` adlı salt-okunur endpoint eklentisi oluşturuldu ve Docker içindeki Directus extensions dizinine koddan bağlandı.
- Eklenti yalnızca `status = published` kayıtlarını ve frontend için açıkça listelenen alanları döndürür.
- Liste endpoint'i sıralamayı `sort` alanına göre yapar; `homepage=true` parametresi yalnızca ana sayfada gösterilecek kayıtları seçer.
- Detay endpoint'i yalnızca yayınlanmış ve slug değeri eşleşen tek kaydı döndürür; taslak, gizli veya bilinmeyen slug için 404 üretir.
- Directus loglarında `directus-extension-website-content` eklentisinin başarıyla yüklendiği doğrulandı.
- Standart anonim koleksiyon API'sinin HTTP 403 vermeye devam ettiği; özel yayın endpoint'inin HTTP 200 ile dört kayıt döndürdüğü doğrulandı.
- Frontend için `app/lib/directus.ts` sunucu tarafı veri katmanı oluşturuldu.
- Ana sayfa yalnızca yayınlanmış ve `Ana sayfada göster` işaretli kayıtları Directus'tan almaya başladı.
- `/calisma-alanlari` sayfası yayınlanmış kayıt sayısını, sıralamasını, başlığını ve kart açıklamasını Directus'tan alacak şekilde dönüştürüldü.
- Dört ayrı sabit rota tek `/calisma-alanlari/[slug]` dinamik rotasında birleştirildi.
- Dinamik rota metadata, detay içeriği, SSS ve diğer çalışma alanı bağlantılarını Directus verisinden üretir.
- Yeni eklenen çalışma alanları için boş bırakılabilen detay alanlarında güvenli varsayılan metin ve görsel davranışı tanımlandı.
- Vinext/Wrangler Worker ortamına `DIRECTUS_URL` binding'i eklendi; geliştirmede localhost, Docker'da `http://directus:8055` kullanılır.
- Production build başarılı oldu ve dinamik çalışma alanı rotası build çıktısında doğrulandı.
- Docker imajı yeniden oluşturuldu; database, Directus ve frontend servisleri `healthy` durumuna geçti.
- Ana sayfa, çalışma alanları dizini ve mevcut dört detay rotası HTTP 200; bilinmeyen slug HTTP 404 verdi.
- Duruş ve Hareket Analizi kaydı kısa süreliğine `Gizli` yapılarak listeden çıktığı ve detay URL'sinin 404 döndürdüğü doğrulandı; test sonunda kayıt yeniden `Yayında` durumuna alındı.
- Paket `e2699ea` kimliği ve `feat: connect practice areas to directus` mesajıyla commit edildi.
- Commit `origin/main` dalına başarıyla push edildi.

## 24 Eylül 2026

### Paket 15 — Directus–frontend blog bağlantısı

- Kullanıcının isteği doğrultusunda çalışma alanlarına yeni kayıt eklenmedi; sonraki backend paketi blog yönetimine ayrıldı.
- Directus içinde `blog_posts` koleksiyonunu ve alanlarını idempotent biçimde oluşturan `scripts/bootstrap-blog.mjs` betiği eklendi.
- Blog modeline yayın durumu, sıralama, öne çıkarma, kategori, başlık, benzersiz slug, kart özeti, yayın tarihi, okuma süresi, kapak bilgileri, giriş, paragraflar, vurgulu alıntı, uygulanabilir adımlar, kapanış ve SEO alanları eklendi.
- Yayın durumu için `Taslak`, `Yayında` ve `Gizli` seçenekleri tanımlandı.
- Bir yayınlanmış örnek yazı ile gelecekte düzenlenebilmesi için iki taslak yazı başlangıç verisi olarak eklendi.
- Bootstrap betiği tekrar çalıştırıldı; mevcut koleksiyon ve kayıtların çoğaltılmadığı doğrulandı.
- `directus-extension-website-content` eklentisine `/blog-posts` ve `/blog-posts/:slug` salt-okunur endpoint'leri eklendi.
- Public endpoint yalnızca `status = published` kayıtlarını ve açıkça izin verilen alanları döndürecek şekilde sınırlandı.
- Ana sayfa en fazla üç yayınlanmış blog kaydını Directus'tan alacak şekilde güncellendi.
- `/blog` liste sayfası yayınlanmış kayıtları öne çıkan, yayın tarihi ve sıralama bilgilerine göre dinamik gösterecek şekilde dönüştürüldü.
- Eski sabit yazı rota dosyası kaldırıldı ve bütün yazılar için `/blog/[slug]` dinamik rotası oluşturuldu.
- Dinamik yazı sayfası metadata, kapak, paragraflar, alıntı, öneriler, kapanış ve okuma bilgilerini CMS kaydından üretir.
- Yapılandırılmış metin alanları ham HTML olarak çalıştırılmadan React metni şeklinde render edilir.
- Directus'un tarih alanını tam ISO zaman damgası olarak döndürdüğü görüldü; tarih biçimlendirici hem `YYYY-MM-DD` hem ISO değerlerini güvenli işleyecek şekilde düzeltildi.
- Yerel production build ve Docker içi production build başarıyla tamamlandı.
- Database, Directus ve frontend container'larının `healthy`, Caddy proxy servisinin çalışır durumda olduğu doğrulandı.
- `/`, `/blog` ve yayınlanmış örnek yazı Docker/Caddy üzerinden HTTP 200 yanıtı verdi.
- Taslak yazı slug'ı ve bilinmeyen blog slug'ı HTTP 404 verdi; taslak içeriğin public siteye sızmadığı doğrulandı.
- Paket `cf90022` kimliği ve `feat: connect blog content to directus` mesajıyla commit edildi.
- Kod ve dokümantasyon commitleri `origin/main` dalına başarıyla push edildi.

### Paket 16 — Directus proje sahibi uyarısının kaldırılması

- Directus yönetim panelinde “You have not set a project owner” başlıklı modalın açıldığı kullanıcı ekran görüntüsüyle tespit edildi.
- Pencerenin site ziyaretçi arayüzüne ait olmadığı; Directus 12'nin lisans uyumluluğu kapsamında yönetim panelinden proje sahibi e-postası toplama akışı olduğu doğrulandı.
- Directus'un resmî sürüm notlarında sahip bilgisi toplama ve senkronizasyonunu kapatmak için `PROJECT_OWNER_ENABLED` ortam değişkeninin desteklendiği kontrol edildi.
- `compose.yaml` içindeki Directus servisine `PROJECT_OWNER_ENABLED: ${DIRECTUS_PROJECT_OWNER_ENABLED:-false}` eklendi.
- Böylece yeni kurulumlarda ve VPS dağıtımında proje sahibi bilgisi toplama varsayılan olarak kapalı olacak; yöneticiye bu modal gösterilmeyecek.
- `.env.example` dosyasına `DIRECTUS_PROJECT_OWNER_ENABLED=false` örnek değeri ve açıklaması eklendi.
- Yapılandırmanın Directus lisans koşullarını değiştirmediği, yalnızca sahip bilgisi toplama ve senkronizasyonunu kapattığı README ve teknik karar notlarında açıkça kaydedildi.
- Directus servisi yeniden oluşturuldu; API'nin `project_owner_enabled: false` döndürdüğü, Directus ve frontend container'larının sağlıklı olduğu, site ile yönetim panelinin HTTP 200 verdiği doğrulandı.
- Düzeltme `59b84a9` kimliği ve `fix: disable directus owner prompt` mesajıyla commit edilerek `origin/main` dalına başarıyla push edildi.

## 26 Eylül 2026

### Paket 17 — Özel `/bakir` yönetim girişi ve TOTP temeli

- Deneme yayını sırasında görülen `Failed to fetch` hatasının uygulama kodundan değil, Docker Desktop'ın yanlışlıkla kapatılmış olmasından kaynaklandığı netleştirildi. Servisler açılınca API erişimi normale döndü.
- Site sahibinin günlük kullanımda Directus Studio'yu görmemesi için `/bakir` adresinde projeye özel yönetim arayüzü oluşturuldu.
- Arayüze e-posta, parola ve etkinse Google Authenticator'dan alınan 6 haneli TOTP koduyla giriş eklendi.
- Directus `mode: session` oturum modeli kullanıldı; oturum belirteci frontend JavaScript'ine verilmeden `httpOnly`, `SameSite=Lax` çerezle tutuldu.
- Caddy'ye `/bakir-api/*` ters proxy yolu eklendi. Böylece tarayıcı yönetim API'sine aynı origin üzerinden bağlanır ve ayrı CORS yapılandırmasına ihtiyaç duymaz.
- `/bakir` sayfasına hem metadata hem HTTP başlığı düzeyinde `noindex`, `nofollow`, `noarchive`; ayrıca `Cache-Control: no-store` koruması eklendi.
- Giriş sonrası yönetici adı, blog yazısı sayıları, çalışma alanı sayıları ve yayın/taslak/gizli özetleri gösterilen başlangıç panosu hazırlandı.
- Google Authenticator kurulumu için mevcut parolayla kurulum anahtarı üretme ve telefondaki güncel kodla TOTP'yi etkinleştirme akışı eklendi.
- TOTP gizli anahtarı otomatik etkinleştirilmedi, terminale veya dokümana yazılmadı. Gerçek kurulum site sahibinin telefonu elindeyken tamamlanacak.
- Directus ayarlarını idempotent uygulayan `scripts/bootstrap-security.mjs` oluşturuldu. Proje adı, Türkçe dil, en fazla beş başarısız giriş denemesi, güçlü parola politikası ve kapalı public kayıt ayarları uygulandı.
- Yerel HTTP ortamı için `DIRECTUS_SESSION_COOKIE_SECURE=false`, production HTTPS ortamı için `true` kullanılması `.env.example` ve README içinde belgelendi.
- Masaüstü ve 390 × 844 mobil giriş görünümü tarayıcıda görsel olarak kontrol edildi.
- Yeni `/bakir` dosyaları hedefli ESLint kontrolünden geçti; production build hem yerelde hem Docker imajı içinde başarıyla tamamlandı.
- Docker üzerinden `/bakir` HTTP 200, güvenlik başlıkları ve hatalı giriş HTTP 401 davranışı doğrulandı; tüm bağımlı servisler sağlıklı çalıştı.
- Bu paket güvenli giriş ve TOTP temelini tamamlar. Blog ve çalışma alanı ekleme/düzenleme/gizleme ekranları sıradaki yönetim paketinde hazırlanacaktır.
- Uygulama paketi `1fb0494` kimliği ve `feat: add secure custom admin access` mesajıyla commit edildi.

### Paket 18 — TOTP durum düzeltmesi ve çoklu yönetici desteği

- Kullanıcının Google Authenticator kurulumunu başarıyla tamamlamasına rağmen panelin kurulum formunu göstermeye devam ettiği bildirildi.
- Veritabanında mevcut yönetici hesabının `tfa_secret` değerinin dolu olduğu yalnızca boolean sonuçla doğrulandı; TOTP gizli anahtarı okunabilir çıktıya veya dokümana alınmadı.
- Hatanın TOTP kaydında değil, ilk panel sürümünün hesap güvenlik durumunu hiç sorgulamamasında olduğu belirlendi.
- Directus özel endpoint eklentisine kimliği doğrulanmış kullanıcıya ait güvenli `/admin-account` endpoint'i eklendi.
- Endpoint Directus oturumundan kullanıcıyı belirler, TOTP gizli anahtarını yanıttan çıkarır ve yalnızca `tfa_enabled` boolean bilgisini döndürür.
- `/bakir` paneli etkin hesaplarda kurulum formunu kaldırıp `İki adımlı doğrulama aktif` durumunu gösterecek şekilde güncellendi.
- TOTP yeni etkinleştirildiğinde panel durumu sayfa yenilemeden güncellenir.
- Çoklu yönetici için `/admin-team` endpoint'i eklendi. Endpoint yalnızca Directus `admin_access` politikasına sahip hesaplar tarafından kullanılabilir ve ekip üyelerinin gizli anahtarları yerine yalnızca 2FA açık/kapalı durumlarını döndürür.
- Yönetim paneline mevcut yöneticileri ve hesap bazında `2FA aktif` / `2FA bekliyor` durumunu gösteren ekip bölümü eklendi.
- Tam yetkili yöneticinin ad, soyad, e-posta ve geçici güçlü parolayla yeni yönetici oluşturabileceği form eklendi.
- Yeni hesap mevcut yönetici rolüne atanır; ortak hesap yerine her yönetici ayrı e-posta, parola, oturum ve Authenticator kurulumu kullanır.
- Yeni yönetici oluşturma testi sırasında gereksiz deneme hesabı bırakılmadı.
- Özel hesap ve ekip endpoint'lerinin oturumsuz istekleri HTTP 401 ile reddettiği Docker/Caddy üzerinden doğrulandı.
- Directus eklentisinin yeniden yüklendiği, frontend hedefli ESLint kontrolünün geçtiği ve Docker production build'inin başarıyla tamamlandığı doğrulandı.
- Tarayıcıda giriş ekranı yeniden kontrol edildi. Etkin durum ve ekip ekranının gerçek oturum doğrulaması, güvenlik gereği yönetici parolası/TOTP kodu otomasyona alınmadan kullanıcının bir sonraki girişiyle tamamlanacaktır.
- Uygulama paketi `38f7272` kimliği ve `feat: support account-aware two-factor auth` mesajıyla commit edildi.

### Paket 19 — Özel panelde blog yazısı yönetimi

- `/bakir` yönetim paneline site sahibinin Directus Studio'ya girmeden kullanabileceği blog yönetimi bölümü eklendi.
- Mevcut blog yazıları yayın durumu, başlık, kategori ve okuma süresiyle listelenir.
- Her yazı listeden seçilerek aynı ekranda düzenlenebilir; yayınlanmış yazı yeni sekmede public sitede açılabilir.
- Yeni yazı düğmesi boş ve varsayılan olarak taslak bir editör açar.
- Yazı başlığı girilirken yeni kayıtlarda Türkçe karakterleri güvenli dönüştüren slug otomatik üretilir; slug alanı ayrıca düzenlenebilir.
- Formda taslak/yayında/gizli durumu, kategori, başlık, slug, kart özeti, yayın tarihi, okuma süresi ve ana sayfada öne çıkarma seçenekleri bulunur.
- Giriş metni, boş satırlarla ayrılan ana paragraflar, vurgulu alıntı, kapanış başlığı/metni ve SEO başlığı/açıklaması düzenlenebilir.
- Paragraflar ham HTML yerine `{ text }` nesnelerinden oluşan güvenli JSON listesine dönüştürülerek Directus'a kaydedilir.
- Yeni kayıtlar Directus standart `POST /items/blog_posts`, düzenlemeler ve durum değişiklikleri `PATCH /items/blog_posts/:id` endpoint'leri üzerinden yapılır.
- Taslak veya gizli yazı tek düğmeyle yayınlanabilir; yayın tarihi boşsa güncel tarih atanır. Yayındaki yazı silinmeden gizlenebilir.
- Yanlışlıkla kalıcı veri kaybını önlemek için bu pakette silme düğmesi eklenmedi.
- Admin API istemcisi ayrı `admin-api.ts` modülüne taşınarak giriş, ekip ve içerik bileşenleri arasında güvenli biçimde paylaşıldı.
- Blog formunun veritabanı alanlarıyla uyumu transaction içinde geçici kayıt eklenip `ROLLBACK` edilerek doğrulandı; test sonunda kalıcı deneme kaydı kalmadı.
- Hedefli ESLint kontrolü, yerel production build ve Docker production build başarıyla tamamlandı.
- Docker servislerinin tamamı `healthy`, `/bakir` rotası HTTP 200 durumunda doğrulandı.
- Tarayıcı paneli oturum kapalı durumda bulundu; parola ve TOTP bilgilerine otomasyonla müdahale edilmedi. Editörün gerçek oturumdaki son kullanıcı görsel kontrolü bir sonraki manuel girişte yapılacaktır.
- Uygulama paketi `df9b1a9` kimliği ve `feat: add blog management workspace` mesajıyla commit edildi.

### Paket 20 — Sidebar tabanlı modüler admin navigasyonu

- Yönetim araçlarının tek uzun sayfada alt alta bulunmasının, çalışma alanı editörü eklendiğinde ciddi kullanım sorunu oluşturacağı kullanıcı tarafından belirtildi.
- `/bakir` paneli tek sayfalık dikey akıştan modüler yönetim kabuğuna dönüştürüldü.
- Masaüstü görünümüne viewport boyunca sabit kalan sol sidebar eklendi.
- Sidebar içinde Genel bakış, Blog yazıları, Çalışma alanları, Yöneticiler ve Hesap güvenliği bölümleri tanımlandı.
- Aktif bölüm koyu yeşil durumla belirginleştirilir; blog ve çalışma alanı menülerinde mevcut kayıt sayısı gösterilir.
- Yönetici ekibi menüsü yalnızca `admin_access` yetkisine sahip kullanıcılar tarafından görülür.
- Her menü seçimi yalnızca ilgili çalışma ekranını render eder; blog editörü, güvenlik ve ekip yönetimi artık uzun sayfada birlikte bulunmaz.
- Genel bakış ekranındaki içerik özet kartları butona dönüştürüldü ve doğrudan ilgili yönetim bölümüne bağlandı.
- Genel bakışa hesap güvenliği durumunu gösteren ve güvenlik ekranına götüren kısa kart eklendi.
- Henüz editörü tamamlanmayan Çalışma alanları bölümü için ayrı bir yer tutucu ekran hazırlandı; sıradaki paket aynı menü alanında uygulanacak.
- Sidebar altına oturumdaki yönetici bilgisi ve public siteyi yeni sekmede açan bağlantı eklendi.
- 900 piksel ve altında sidebar, header'ın altında sabitlenen yatay kaydırılabilir menüye dönüşür. Böylece mobilde ekran alanı korunurken bütün bölümlere hızlı erişim sürer.
- Header da sayfa kaydırıldığında görünür kalacak şekilde sticky yapıldı.
- Hedefli ESLint kontrolü, yerel production build ve Docker production build başarıyla tamamlandı.
- Uygulama paketi `ef1702a` kimliği ve `feat: add modular admin navigation` mesajıyla commit edildi.

### Paket 21 — Özel panelde çalışma alanı yönetimi

- Sidebar içindeki Çalışma alanları yer tutucusu gerçek içerik yönetim ekranıyla değiştirildi.
- Mevcut çalışma alanları yayın durumu, başlık ve ana sayfa görünürlük bilgisiyle listelenir.
- Yönetici listeden bir alanı seçerek düzenleyebilir veya `Yeni alan` düğmesiyle taslak kayıt hazırlayabilir.
- Yeni kayıt başlığı yazılırken Türkçe uyumlu slug ve detay başlığı otomatik oluşturulur.
- Yayın durumu taslak, yayında veya gizli olarak seçilebilir; sıralama değeri ve `Ana sayfadaki kartlarda göster` seçeneği yönetilebilir.
- Kart açıklaması, detay başlığı/vurgusu, giriş açıklaması, değerlendirme başlığı/vurgusu ve genel bilgilendirme alanları eklendi.
- Değerlendirme maddeleri her satırın ayrı madde olduğu sade textarea üzerinden düzenlenir.
- Süreç adımları `Başlık | Açıklama`, sık sorulan sorular `Soru | Cevap` biçiminde satır bazında girilir ve güvenli JSON listelerine dönüştürülür.
- SEO başlığı ve açıklaması aynı editör içinde düzenlenebilir.
- Listeden taslak/gizli alan tek düğmeyle yayınlanabilir; yayındaki alan silinmeden gizlenebilir.
- Yayınlanmış alanın public detay sayfasını yeni sekmede açan kontrol eklendi.
- Yeni kayıt sıralaması mevcut son kaydın ardından önerilir; yönetici isterse değeri değiştirebilir.
- Çalışma alanları sorgusu panel için gereken tüm alanları ve belirlenmiş sıralamayı döndürecek şekilde genişletildi.
- Form payload'ındaki metin ve JSON alanları PostgreSQL transaction içinde geçici kayıtla doğrulandı; `ROLLBACK` sonrasında test kaydı kalmadığı kontrol edildi.
- Hedefli ESLint kontrolü ve Docker production build başarıyla tamamlandı; bütün container'lar `healthy`, `/bakir` HTTP 200 durumunda doğrulandı.
- Uygulama paketi `7d52ceb` kimliği ve `feat: add practice area management workspace` mesajıyla commit edildi.

### Paket 22 — Hakkımda ve İletişim sayfası içerik yönetimi

- Hakkımda ve İletişim sayfalarının metin ve iletişim bilgilerinin de özel panelden yönetilmesi gereksinimi eklendi.
- `scripts/bootstrap-site-pages.mjs` betiği oluşturuldu ve `site_pages` Directus koleksiyonu idempotent biçimde hazırlandı.
- Koleksiyona benzersiz `page_key`, JSON `content`, SEO başlığı ve SEO açıklaması alanları eklendi.
- Mevcut hardcoded Hakkımda ve İletişim içerikleri `about` ve `contact` başlangıç kayıtlarına taşındı; geçiş sırasında public sayfaların boş kalması engellendi.
- Yönetici hesabında TOTP aktif olduğu için bootstrap sırasında 2FA kapatılmadı. Veritabanına yalnızca işlem süresince rastgele statik token verildi, betik tamamlanınca `finally` bloğunda temizlendi.
- Geçici token terminal çıktısına veya dosyaya yazılmadı; işlem sonunda kullanıcı token alanının tekrar boş olduğu doğrulandı.
- Directus özel eklentisine yalnızca `about` ve `contact` anahtarlarını kabul eden `/pages/:pageKey` salt-okunur endpoint'i eklendi.
- Frontend veri katmanına tipli `getSitePage` fonksiyonu eklendi.
- `/hakkimda` sayfası hero, yaklaşım paragrafları, mesleki not, çalışma ilkeleri ve SEO metadata'sını CMS kaydından üretmeye başladı.
- `/iletisim` sayfası hero, uyarı, telefon, WhatsApp, e-posta, adres, çalışma saatleri, süreç adımları ve SEO metadata'sını CMS kaydından üretmeye başladı.
- Admin navigasyonuna `Sayfa içerikleri` bölümü eklendi.
- Yönetim ekranında Hakkımda ve İletişim için iki sekmeli form hazırlandı.
- Hakkımda formu başlıkları, açıklamaları, yaklaşım paragraflarını, mesleki notu, çalışma ilkelerini ve SEO değerlerini yönetir.
- İletişim formu telefon görünümü/bağlantısı, WhatsApp, e-posta, adres, çalışma günleri/saatleri, gizlilik uyarısı, iletişim adımları ve SEO değerlerini yönetir.
- Tekrarlanan paragraflar ve adımlar sade satır biçiminden güvenli JSON listelerine dönüştürülür.
- Directus eklentisi yeniden yüklendi; hedefli lint ve Docker production build başarıyla tamamlandı.
- `/hakkimda`, `/iletisim`, `/website-content/pages/about` ve `/website-content/pages/contact` Docker/Caddy üzerinden HTTP 200 yanıtıyla doğrulandı.
- Database, Directus ve frontend container'larının `healthy`, Caddy proxy'nin çalışır durumda olduğu doğrulandı.
- Uygulama paketi `fe00856` kimliği ve `feat: manage about and contact pages` mesajıyla commit edildi.

### Paket 23 — İletişim verisi birleştirme ve Vinext konsol temizliği

- Tarayıcı konsolunda yaklaşık 50 hata gibi görünen kayıtların farklı hatalar olmadığı, Vinext `next/link` RSC prefetch kurulumundaki aynı `TypeError: f is not a function` mesajının görünür her bağlantı için tekrarlandığı belirlendi.
- Aynı kayıtta Directus `GET` ve `PATCH` isteklerinin başarıyla tamamlandığı görüldü; veri kaydetme problemi olmadığı doğrulandı.
- Projedeki bütün `next/link` kullanımlarına `prefetch={false}` eklendi. Böylece mevcut Vinext beta sürümündeki sorunlu otomatik RSC ön yükleme yolu kullanılmadan normal istemci navigasyonu korunur.
- Ana sayfadaki iç bağlantılar lint kuralına uygun olarak `Link` bileşenine geçirildi ve aynı şekilde prefetch kapatıldı.
- Admin İletişim formundaki `Telefon görünümü` ve teknik `Telefon bağlantısı` alanları tek `Telefon numarası` alanında birleştirildi.
- `phoneToDialValue` yardımcı fonksiyonu eklendi. Yönetici boşluklu veya yerel biçimde numara yazabilir; kayıtta arama bağlantısı otomatik olarak uluslararası `+` ve rakam biçimine dönüştürülür.
- Eski Directus kayıtlarıyla uyumluluk için türetilen değer `phone_value` anahtarında tutulmaya devam eder; public sayfalar görünür numarayı esas alarak güvenli fallback üretir.
- Ana sayfadaki telefon, WhatsApp, e-posta, adres ve çalışma saatleri hardcoded değerlerden çıkarıldı ve aynı `site_pages.contact` CMS kaydına bağlandı.
- Hedefli ESLint ve yerel production build başarıyla tamamlandı.
- Frontend Docker imajı yeniden oluşturuldu; database, Directus ve frontend container'ları `healthy`, Caddy proxy çalışır durumda doğrulandı.
- `/`, `/iletisim`, `/bakir` ve contact public endpoint'i Docker/Caddy üzerinden HTTP 200 yanıtı verdi.
- Tarayıcıda `/bakir` ve `/` sayfalarının hata/uyarı konsolları ayrı ayrı kontrol edildi; ikisi de boş döndü.
- Admin kaydında daha önce değiştirilmiş telefonun ana sayfada görünür hale geldiği ve `tel:+...` arama bağlantısının otomatik üretildiği doğrulandı.

### Paket 24 — Markalı ve erişilebilir 404 sayfası

- Projede kök seviye özel 404 bileşeni bulunmadığı, framework'ün varsayılan bulunamadı çıktısının kullanıldığı belirlendi.
- `app/not-found.tsx` eklenerek sitenin renk, tipografi, header ve footer sistemini kullanan markalı bir “Sayfa bulunamadı” ekranı hazırlandı.
- Ziyaretçiye ana sayfaya dönme, çalışma alanlarını inceleme, blog, hakkımda ve iletişim bağlantıları sunuldu.
- Sayfaya arama motorları için `noindex, nofollow` metadata'sı eklendi.
- Ortak header'da aktif menü varsayılanı kaldırıldı; 404 ve yasal sayfalarda Ana Sayfa menüsünün yanlışlıkla aktif görünmesi engellendi.
- Header iç bağlantıları lint uyumlu `Link` bileşenine geçirildi ve Vinext prefetch sorununun tekrarlamaması için `prefetch={false}` kullanıldı.
- Hedefli ESLint, yerel production build ve Docker production build başarıyla tamamlandı.
- Rastgele genel URL, bilinmeyen blog slug'ı ve bilinmeyen çalışma alanı slug'ı ayrı ayrı test edildi; üçü de özel ekranla gerçek HTTP 404 ve `noindex` döndürdü.
- Masaüstü ve 390 × 844 mobil görünüm tarayıcıda görsel olarak kontrol edildi; responsive yerleşim ve bağlantılar doğrulandı.
- 404 sayfasının tarayıcı konsolunda hata veya uyarı bulunmadı.
- Database, Directus ve frontend container'larının `healthy`, Caddy proxy'nin çalışır durumda olduğu doğrulandı.

### Paket 25 — Vinext sayfa geçişi çalışma zamanı düzeltmesi

- Kullanıcı, 404 paketinden sonra menü bağlantılarının çalışmadığını ve konsolda `link-*.js: Uncaught TypeError: e is not a function` hatasının tekrarlandığını bildirdi.
- Yeni kayıt, hatanın yalnızca RSC prefetch kurulumunda olmadığını; `next/link` tıklama işleyicisinin `startTransition` içindeki istemci navigasyonunda da oluştuğunu gösterdi.
- Önceki `prefetch={false}` yaklaşımının prefetch tekrarını durdurduğu ancak bozuk router tıklama yolunu devrede bıraktığı kabul edildi ve teknik karar düzeltildi.
- `NativeLink` adlı ortak, tipli bağlantı bileşeni eklendi. Bileşen semantik `<a href>` üretir ve framework istemci router'ı yerine tarayıcının yerel tam sayfa navigasyonunu kullanır.
- Ana sayfa, ortak header, 404, Hakkımda, admin marka bağlantıları ve blog/çalışma alanı “sitede aç” kontrolleri dahil bütün `next/link` kullanımları kaldırıldı.
- Proje uygulama kodunda `next/link`, `<Link>` veya `prefetch={false}` kullanımı kalmadığı kaynak taramasıyla doğrulandı.
- Hedefli ESLint, yerel production build ve Docker production build başarıyla tamamlandı.
- Tarayıcıda gerçek tıklamalarla Ana Sayfa → Hakkımda → Çalışma Alanları → Blog → İletişim → Ana Sayfa zinciri tamamlandı.
- Ana sayfadaki yayınlanmış yazı bağlantısından dinamik blog detayına geçiş ayrıca doğrulandı.
- Bütün tıklama zincirinin sonunda tarayıcı hata/uyarı konsolu boş döndü; `link-*.js` çalışma zamanı hatası ortadan kalktı.

### Paket 26 — Chrome DevTools 404 konsol gürültüsünün ayrıştırılması

- Kullanıcı, yanlış bir URL denediğinde konsolda aynı `GET /iletisim/lsd 404` satırının çok sayıda tekrarlandığını bildirdi.
- Paylaşılan kayıttaki `Navigated to ...` satırlarının hata değil, başarılı tam sayfa navigasyon bildirimleri olduğu ayrıştırıldı.
- Docker frontend erişim kayıtlarında `/iletisim/lsd` isteğinin yalnızca bir kez geldiği görüldü; uygulamanın bilinmeyen URL'yi tekrar tekrar isteyen bir döngüye girmediği doğrulandı.
- Aynı zaman aralığında Chrome DevTools'un `/.well-known/appspecific/com.chrome.devtools.json` yolunu onlarca kez sorguladığı tespit edildi.
- Caddy'ye yalnızca bu kesin DevTools çalışma alanı keşif yolu için içeriksiz HTTP 204 cevabı eklendi. Genel `/.well-known` alanı veya başka public yollar etkilenmedi.
- Caddy yapılandırması container içinde `caddy validate` ile doğrulandı.
- DevTools teknik yolunun HTTP 204 ve sıfır bayt; `/iletisim/lsd` yolunun ise markalı içerikle gerçek HTTP 404 döndürdüğü doğrulandı.
- Database, Directus ve frontend servisleri `healthy`, yeniden oluşturulan Caddy proxy çalışır durumda kaldı.

### Paket 27 — Dinamik sitemap.xml ve robots.txt

- Arama motoru tarama talimatları için Next/Vinext metadata route biçiminde `app/robots.ts` eklendi.
- Public sayfalar taramaya açık bırakılırken `/bakir`, `/bakir/` ve `/bakir-api/` yolları robots çıktısında tarama dışında bırakıldı.
- Robots çıktısına sitemap adresi ve tercih edilen site host'u eklendi.
- `app/sitemap.ts` ile ana sayfa, Hakkımda, Çalışma Alanları, Blog, İletişim, KVKK ve Gizlilik sayfaları listelendi.
- Directus public endpoint'lerinden yalnızca yayınlanmış çalışma alanları ve blog yazıları dinamik olarak sitemap'e eklenmeye başladı; taslak ve gizli kayıtlar dahil edilmedi.
- Blog yayın tarihi uygun olduğunda `lastmod` değeri olarak kullanıldı.
- Directus geçici olarak erişilemezse sitemap'in tamamen bozulmaması için dinamik sorgular `Promise.allSettled` ile ayrıştırıldı; sabit sayfalar üretilmeye devam eder.
- `SITE_PUBLIC_URL` Vinext/Cloudflare binding, Docker build argümanı ve frontend runtime ortamına eklendi. Böylece localhost ile production domain arasında kod değişikliği gerekmez.
- Hedefli ESLint kontrolü ve production build başarılı tamamlandı. Genel lint kontrolü yalnızca Vinext çalışma zamanı hatası nedeniyle bilerek kullanılan mevcut `NativeLink`/HTML anchor bağlantıları için altı `no-html-link-for-pages` ihlalini raporladı; yeni SEO dosyalarında hata bulunmadı.
- Frontend Docker imajı yeniden oluşturuldu; `/robots.txt` `text/plain`, `/sitemap.xml` `application/xml` içerik türüyle HTTP 200 döndürdü.
- Sitemap çıktısında yedi sabit sayfa, dört yayınlanmış çalışma alanı ve iki yayınlanmış blog yazısı doğrulandı.

### Paket 28 — Şeffaf 3D Furkan Toplu hero görseli

- Kullanıcının sağladığı portre; kimlik, yüz ifadesi, saç/sakal yapısı, bakış yönü, kırmızı `23` numaralı tişört ve çapraz kol pozu korunarak şeffaf 3B karaktere dönüştürüldü.
- İlk iki denemenin yarı gerçekçi görünümü ve karakteri çevreleyen dikdörtgen sahne, kullanıcı değerlendirmesinde hâlâ “fotoğraf/kart” hissi verdiği için reddedildi.
- Üçüncü denemede foto-gerçekçi ten dokusu azaltıldı; saç, sakal ve yüz yüzeyleri sinema/oyun karakteri estetiğinde daha belirgin biçimde modellendi. Sıcak ana ışık ve turkuaz kenar ışığı karakter hacmini güçlendirdi.
- Güncel aday `frontend/public/furkan-toplu-hero-3d-v3.png` adıyla projeye alındı. Dosyanın `1024 × 1536`, `Format32bppArgb` olduğu ve dört köşe alfa değerinin de `0` olduğu doğrulandı.
- Fotoğraf kartını çağrıştıran kenarlık, köşe yuvarlama, dolu dikdörtgen arka plan ve kırpma kaldırıldı. Karakter krem sayfa üzerinde serbest duran, sağ kolondan taşan ayrı bir nesne olarak konumlandırıldı.
- Arka planda yalnızca sınırı görünmeyen yumuşak dairesel hale, ince yörünge çizgileri, zemin gölgesi ve karakter drop-shadow'u bırakıldı. Bilgi kartı ile konum etiketi üst katmanda tutuldu.
- Vinext `Image` bileşeninde açık `objectFit: contain` ve alt merkez hizası kullanılmaya devam edildi. Masaüstünde saçın sabit header arkasında kalmaması için karakter sahnesi aşağı taşındı.
- Hedefli ESLint ve production build başarıyla tamamlandı; frontend Docker imajı her yerleşim düzeltmesinden sonra yeniden oluşturuldu.
- `1440 × 900` masaüstü ve `390 × 844` mobil görünüm gerçek tarayıcıda kontrol edildi. Mobilde karakter, bilgi kartı ve sonraki bölüm sınırı taşma olmadan görüntülendi.
- Kullanıcı geri bildirimiyle karakterin hero içindeki izole katman bağlamı kaldırıldı ve karakter katmanı sabit navbar'ın üzerine çıkarıldı. Sayfa kaydırıldığında saç veya gövde navbar alanına girse bile navbar karakteri örtemez; karakter her zaman en önde çizilir.
- Karakter katmanı `pointer-events: none` olarak korundu. Böylece görsel navbarın önünde görünürken alttaki menü bağlantılarının tıklanmasını engellemez.
- Yeni katman davranışı hem dar görünümde hem `1440 × 900` masaüstünde gerçek tarayıcı kaydırmasıyla doğrulandı.
- Karakterin alt kısmının çalışma alanları bölümünün yeşil zeminine kadar uzadığı ve PNG'nin düz alt kenarını görünür kıldığı kullanıcı tarafından belirtildi. Karakter sahnesinin alt sınırı hero içine çekildi.
- PNG üzerine çok kademeli alfa maskesi eklendi. Alt bölüm yüzde 73'e kadar tam görünür kalır; son bölümde kademeli olarak saydamlaşır ve hero sınırından önce tamamen kaybolur. Böylece sert kırpma yerine karakter kadrajın dışında devam ediyormuş izlenimi oluşur.
- Fade bitişi `1440 × 900` masaüstü ve `390 × 844` mobil görünümde kontrol edildi; yeşil çalışma alanları bölümü başladığında karakterin görünmediği doğrulandı.
- Bu paket görsel geri bildirimlerle ilerleyen deneysel aday olarak tutuldu; sonraki çok dilli site çalışmasında mevcut hero görünümü korundu.

## 6 Ekim 2026

### Paket 29 — Türkçe / İngilizce / Almanca ziyaretçi sitesi

- Kullanıcı navbar'dan dil seçimini ve admin panelinin yalnızca Türkçe kalmasını onayladı. Mevcut Türkçe sayfa adresleri korundu; `/en` ve `/de` public dil kökleri eklendi.
- `i18n.ts` dil tanımları, rota eşleştirme, çeviri sözlüğü erişimi, detay dil bağlantıları ve tarih biçimlendirmesini merkezileştirdi. Arayüz metinleri `messages.ts` dosyasına çıkarıldı.
- `proxy.ts` URL üzerinden belirlenen dili server-rendered sayfalara aktarır. Dışarıdan gönderilen `x-site-language` ve `x-site-path` başlıkları güvenilir URL değerleriyle değiştirilir. HTML `lang` etiketi güncellenir.
- Ana sayfa, navbar, footer, Hakkımda, İletişim, Blog, çalışma alanı listesi/detayı ve 404 arayüzleri dile göre render edilir. Tarihler `tr-TR`, `en-GB`, `de-DE` biçiminde gösterilir.
- `/[locale]/[[...path]]` rotası aynı public bileşenleri kullanır ve yalnızca tanımlı EN/DE adreslerini kabul eder. `/en/bakir` gibi çevrilmiş admin yolları oluşturulmaz.
- PostgreSQL `website_content_translations` tablosu eklendi. Koleksiyon/kayıt/dil anahtarı ve dil bazlı URL benzersizliği veritabanında korunur. Türkçe kayıtlara ve önceki içeriklere dokunulmadı.
- Directus public endpoint'lerine dil filtresi eklendi. Ana kayıt veya çeviri taslak/gizli olduğunda foreign-language listede gösterilmez. Detay dil seçicisi yalnızca yayımlanmış sürümlere bağlanır.
- Yeni yönetici çeviri endpoint'leri aktif admin hesabı gerektirir. Gönderilen içerik yalnızca izinli metin ve yapılandırılmış liste alanlarıyla sınırlandırılır. Çeviri ortak telefon/görsel alanlarını veya yetkileri değiştiremez.
- Blog, çalışma alanı ve kurumsal sayfa editörlerine Türkçe / İngilizce / Almanca sekmeleri ve Türkçe etiketli çeviri formları eklendi. Çevirinin durum, metin ve URL adı ayrı kaydedilir.
- Hakkımda/İletişim için başlangıç EN/DE metinleri eklendi. Blog/çalışma alanlarının çevirileri otomatik yayımlanmadı; sahibi panelden hazırlayıp yayımlar. Çeviri olmayan listelerde ilgili dilde boş-durum açıklaması bulunur.
- `content-migrations` Compose servisi SQL kurulumunu Docker'a aldı. Mevcut kayıtlar `ON CONFLICT DO NOTHING` ile korunur. Yeni veritabanı için README temel servis → bootstrap → Compose sırasını açıklıyor.
- Sitemap üç dilin sabit sayfalarını ve yalnızca yayındaki detay çevirilerini içerir. Canonical ve hreflang bağlantıları eklendi. Yönetim yollarının robots/noindex davranışı korundu.
- Yasal belge içerikleri Türkçe kaldı; EN/DE footer bağlantıları bunu kullanıcıya belirtir.
- TypeScript ve ESLint kontrolleri geçti. Önceden belgelenmiş Vinext bağlantı sorunu nedeniyle ESLint'in yalnızca `no-html-link-for-pages` kuralı bu kontrolde kapatıldı; NativeLink ile yerel tarayıcı navigasyonu sürüyor.
- Altı otomatik test dil doğrulama, taslak/gizli çeviri filtreleme, ortak alanların korunması, olmayan ana kayda çeviri bağlanmaması ve admin yetkilerini doğruladı.
- Canlı smoke testi 16 sayfada HTTP 200, doğru HTML dili/canonical/hreflang; iki bilinmeyen dil detayında 404, anonim çeviri isteğinde 401 ve geçersiz dilde 400 doğruladı. Sitemap EN/DE alternatifleri kontrol edildi.
- Tarayıcıda navbar üzerinden TR → EN, İngilizce iletişim bağlantısı ve aynı sayfada DE geçişi denendi. 390 px ve 320 px mobil görünüm incelendi; 320 px'te eski body minimum genişliğinin scrollbar ile yarattığı yatay taşma kaldırıldı.
- Önceki hero denemesinin görsel ve katman düzeni korundu. Kullanıcının ilgisiz `bok_kafa.png` dosyası ile eski v1/v2 deneme görselleri bu paketin Git kapsamına alınmadı.

### Paket 30 — Kart düzeni, açılır dil menüsü ve tam sayfa/görsel yönetimi

- Kullanıcı İletişim'deki “Görüşme öncesinde bilmeniz gerekenler” başlığının kaldırılmasını, adres/saat kartlarının düzeltilmesini, blog okuma bağlantılarının büyütülmesini, sayfa ve yazı görsellerinin admin'den yönetilmesini ve dil seçeneklerinin açılır menüye dönüşmesini istedi.
- Aynı `.contact-details` sınıfının ana sayfa grid kuralları ile ayrı iletişim sayfasının grid kurallarını çakıştırdığı doğrulandı. İletişim bölümü `.contact-visit-details` kapsamına ayrıldı; iki kart ikon + tek metin kolonu haline getirildi. Gereksiz büyük başlık kaldırıldı. 320 px kontrolünde uzun e-posta adresinin kesilmesi görüldü; satıra bölünme eklendi.
- Navbar'daki yan yana TR/EN/DE kaldırıldı. Mevcut tam dil adı düğmesi, altta açılan Türkçe/English/Deutsch menüsü, Escape/dışarı tıklama kapatma ve mevcut sayfayı koruyan dil URL'leri uygulandı. Yayımlanmamış detay çevirisi pasif kalır.
- Ana sayfa/blog/liste ve öne çıkan blog okuma bağlantıları 16 px'e, tıklama alanı en az 44 px yüksekliğe çıkarıldı; footer satırları gerektiğinde bölünebilir.
- Ortak `ImageField` bilgisayardan dosya seçme, admin oturumunda önizleme, 10 MB/type kontrolü ve içerikten kaldırma sağlar. FormData isteklerinde JSON Content-Type başlığı gönderilmez. `/files` Directus endpoint'i kullanılır; dosya önce yüklenir, ilgili içerik sonra kaydedilir.
- Blog editörüne kapak/alt metin/alt yazı; alan editörüne görsel/alt metin eklendi. Dashboard sorguları bu alanları yükler; kaydetme payload'ları değişiklikleri saklar. Kayıt görselleri ana sayfa kartlarında, blog arşivinde, alan listesinde ve mevcut detay bileşenlerinde kullanılır.
- `site_pages` kapsamı home/about/contact/areas/blog oldu. Sayfa panelinde beş sekme; Ana sayfa'da hero, bölüm açıklamaları, kısa bilgiler, değerler, süreç adımları ve iki görsel; blog/alan listelerinde giriş metinleri, isteğe bağlı giriş görseli ve bilgi notları yönetilir. Hakkımda portresi de panelden değiştirilir. İletişim ortak kayıt davranışı korundu.
- `page-content-config.json` editör etiketlerini ve mevcut tasarımdan alınan başlangıç metinlerini merkezileştirir. Yeni `003` SQL ve generator üç dilde başlangıç kayıtlarını ekler; `ON CONFLICT DO NOTHING` eski düzenlemeleri korur. About görsel varsayılanları mevcut anahtarları ezmeden birleştirilir. Manuel dil kurulum script'i ve Compose migrasyon komutu güncellendi.
- Çeviri izinli metin listesi yeni sayfa alanlarına genişletildi, ortak görsel alanları kapsam dışında kaldı. Home/Blog/Areas ve EN/DE metadata CMS SEO değerlerini kullanır. Sitemap artık beş sayfanın dil yayın uygunluğunu kontrol eder.
- Özel medya endpoint'i yalnızca UUID + yayındaki blog/alan görsel referansı veya tanımlı public sayfa görseli + JPG/PNG/WebP MIME doğrulamasından sonra AssetsService ile stream döndürür. Genel public dosya izni eklenmedi. Frontend `/site-media/[id]` akışı sunar. Admin kaydedilmemiş dosyayı yetkili `/assets` üzerinden önizler.
- Directus kaynak ve runtime dist eşitlendi; yükleme sınırı Compose'a eklendi. Yerel Docker database/Directus/frontend sağlıklı; `content-migrations` başarıyla tamamlandı. Production frontend imajı yeniden oluşturuldu.
- 11 otomatik test geçti: admin formlarının gerçek JSX render'ında beş sayfa/görsel alanları, medya referans kuralları, dil/çeviri/yetki korumaları. Next görsel optimizasyonu form testinde izole edilmiştir. TypeScript ve hedefli ESLint geçti; yalnızca önceden belgelenmiş NativeLink kuralı kontrolde kapalıdır.
- Canlı smoke: 16 TR/EN/DE sayfası 200/doğru lang/canonical/dil seçici, bilinmeyen sayfa/medya 404, anonim çeviri 401, hatalı dil 400 ve sitemap alternatifleri geçti. İletişim kartları ve menü masaüstünde; dil değiştirme aynı iletişim sayfasında; 390 ve 320 px mobilde taşma kontrol edildi.
- Tarayıcıda admin oturumu kapalı olduğundan gerçek hesapla upload → kaydet E2E yapılmadı; şifre/TOTP değiştirilmedi veya atlanmadı. Bu doğrulama teslim öncesinde açık yönetici oturumuyla yapılmalı. API akışının pozitif canlı dosya yükleme testi yapılmış gibi raporlanmaz.
- README'de panel kullanımı, upload/kaydet ayrımı, izinli formatlar, varsayılan görsele dönüş, kalıcı volume taşıma ve test komutları belgelendi. Obsidian eşitlenir; paket Git'e kaydedilip mevcut main remote'una gönderilir. İlgisiz dosyalar kapsam dışıdır.

### Paket 31 — Admin bölüm geçişlerinde kaydırmayı sıfırlama

- Kullanıcı, uzun çalışma alanı/sayfa editörünün aşağısındayken sidebar'dan başka bölüme geçildiğinde yeni bölümün eski kaydırma yüksekliğinde açıldığını bildirdi.
- Admin bölümleri aynı sayfa üzerinde `activeView` state'iyle değişiyordu; document scroll konumu sıfırlanmıyordu. Yeni rotaya geçilmediği için tarayıcının rota kaydırma davranışı devreye girmiyordu.
- `activeView` değiştiğinde çalışan `useLayoutEffect` eklendi. Yeni bölüm DOM'a işlendiğinde, boyama öncesi `window.scrollTo({ top: 0, left: 0, behavior: "instant" })` ile tepeye dönülür. Global smooth-scroll kuralına rağmen geçiş anlıktır.
- Sidebar ve genel bakış kısayolları aynı mekanizmadan faydalanır. Editörün içinde yazı yazmak, kayıt yüklemek veya içerik kaydetmek `activeView` değiştirmediği için kaydırmayı sıfırlamaz. Kimlik doğrulama ve içerik kayıtları değiştirilmedi.
- TypeScript, hedefli ESLint ve mevcut 11 test geçti; production Docker build tamamlandı, frontend yeniden başlatıldı ve `/bakir` HTTP 200 doğrulandı. Açık yönetici oturumu ile aşağı kaydırıp bölüm değiştirme etkileşimi bu pakette ayrıca tarayıcıdan denenmedi.

### Paket 32 — Görselsiz blog yazılarında örnek kapak kaldırıldı

- Kullanıcının bildirdiği fark public API ile doğrulandı: iki yayındaki yazıdan yalnızca ilkinde `cover_path` doluydu; ikinci yazının görsel alanı boştu. Detay sayfasındaki `cover_path || örnek fotoğraf` kuralı olmayan görseli gösteriyordu.
- Blog detayında görsel ve alt yazı bölümü yalnızca kayıtlı kapak varsa render edilir; görselsiz yazıda boş fotoğraf alanı bırakılmaz. Blog listesindeki öne çıkan kart için de örnek fotoğraf fallback'i kaldırıldı; görselsiz kart tek kolona geçer.
- Ana sayfa blog kartları ve arşiv kartları zaten yalnızca kayıtlı görseli gösteriyordu; bu davranış korundu. Çalışma alanları, ana sayfa karakteri ve Hakkımda görsel varsayılanları bu talebin dışında kaldı. İçerik/veritabanı kayıtlarına dokunulmadı.
- `blog-images-smoke.mjs` canlı yayındaki yazıların kapak bölümünü CMS görsel alanıyla karşılaştırır; liste öne çıkan kartının görsel ve tek kolon sınıfını da denetler.
- TypeScript, hedefli ESLint, 11 mevcut test ve Docker production build geçti. Yeni canlı test ilk yazıda kapak bulunduğunu, ikinci yazıda kapak bölümü olmadığını doğruladı; üç dilde 16 sayfa ve SEO/404/yetki smoke kontrolleri de geçti. Yerel frontend sağlıklı olarak yeniden başlatıldı.

### Paket 33 — Google Authenticator QR ile kayıt

- Kullanıcı önceki 400/TOTP sorununu yanlış bilgisayar saati olarak tespit edip çözdüğünü bildirdi; bu inceleme durduruldu. Var olan kullanıcı hesaplarına, parola kurallarına ve aktif 2FA ayarlarına müdahale edilmedi. Loglardaki parola veya gerçek kurulum anahtarları notlara kopyalanmadı.
- Yeni kurulum ekranına QR ile kayıt eklendi. Directus'un `/users/me/tfa/generate` yanıtındaki `secret` ve `otpauth_url` kullanılır. QR yalnızca yerelde `qrcode@1.5.4` ile PNG data URL olarak üretilir; dış QR API'sine hesap anahtarı gönderilmez.
- Kurulum bağlantısı `otpauth://totp` protokol/türünde ve dönen secret ile aynı olmalıdır. Beyaz zemin, siyah modüller, 4 modül sessiz alan ve 240 px boyut kullanılır. Görsel Next Image ile `unoptimized` render edilir; resim sunucusuna/proxy optimizer'a gönderilmez.
- Google Authenticator + → QR kod tara yönergesi, 6 haneli kodla onay ve anahtarı elle girme alternatifi eklendi. QR üretimi başarısızsa manuel seçenek açık kalır; etkinleştirme yine Directus doğrulamasını gerektirir. Aktif 2FA hesabında yeni QR gösterilmez/kurulum sıfırlanmaz.
- Kurulum alanı gerçek `form` oldu; parola/OTP Enter ile gönderilebilir ve zorunlu girişler tarayıcı tarafından doğrulanır. Form dışında parola DOM uyarısının bu alandaki nedeni kaldırıldı.
- QR ve anahtar yalnızca React state'inde tutulur; başarı/çıkışta temizlenir. Devam eden TFA isteği sırasında çıkış düğmesi kilitlenir. Anahtar/QR paylaşılmaması ve saat uyumu için uyarı eklendi.
- Test bağımlılıkları `@types/qrcode@1.5.6` ve `jsqr@1.4.0` eklendi, lockfile güncellendi. Gerçek hesap olmayan test URL'si QR PNG'den geri okunup birebir eşleştiği doğrulandı. Yanlış protokol/tür/anahtar reddedilir. QR/manüel bileşen render testi de eklendi; toplam 14 otomatik test geçti.
- TypeScript, hedefli ESLint, 16 public/admin rota smoke testi, blog kapak smoke testi ve Docker production build geçti. Frontend sağlıklı olarak yeniden başlatıldı. Gerçek yönetici hesabında telefonla tarama/2FA etkinleştirme yapılmadı; mevcut aktif doğrulama ayarları korunuyor. README, mimari ve teknik karar notları güncellendi.

### Paket 34 — Yüklenen görsellerde 502 düzeltmesi

- Kullanıcı, admin'den değiştirilen iki görselin public `/site-media/<UUID>` yolunda 502 verdiğini bildirdi. Read-only kontrol Directus özel medya endpoint'inde 500, frontend proxy'sinde 502 olduğunu doğruladı.
- Directus stack trace `resolvePreset` içinde eksik `transformationParams.transforms` erişimini gösterdi. Yazılan `getAsset(id, {})` çağrısı kurulu 12.4.0 servisinin seçenek yapısına uymuyordu. Dosyalar yüklenmiş ve public içerik referansları doğruydu; yükleme/veritabanı hatası yoktu.
- Kaynak ve runtime `dist/media.js` çağrısı `getAsset(id, { transformationParams: {} })` olarak düzeltildi. Dosyalar, kullanıcı kayıtları ve public yetki kapsamı değiştirilmedi. Directus yerelde yeniden başlatıldı; frontend kodu değişmediği için tekrar frontend build gerekmedi.
- Eski medya testleri referans ve MIME erişim kontrolü gibi negatif/filtre durumlarını kapsıyordu; gerçek dosyanın servis çağrısıyla başarıyla akması eksikti. Pozitif stream testi ve Directus seçenek sözleşmesi kontrolü eklendi. Özel/izin dışı MIME dosyalarının AssetsService'e ulaşmadığı da endpoint düzeyinde test edilir.
- `media-smoke.mjs` yayındaki içeriklerden yüklenen görsel UUID'lerini otomatik toplar veya komut argümanı alır. Directus özel endpoint'ini, frontend `/site-media` akışını ve Next/Vinext `/_next/image` bileşen yolunu kontrol eder. HTTP 200, JPG/PNG/WebP dosya imzası ve upstream/proxy bayt eşitliği doğrulanır.
- Kullanıcının hata veren iki gerçek görseli üç katmanda da 200/düzgün görsel baytlarıyla doğrulandı. Otomatik public görsel keşfi de aynı iki dosyada geçti; yeniden yükleme veya kayıt düzenleme yapılmadı. Toplam 16 birim/render/regresyon testi geçti. README yeni medya testini ve çağrı sözleşmesini belgeler.

### Paket 35 — Çalışma alanlarında görselsiz tasarım ve tam fotoğraf gösterimi

- Kullanıcı çalışma alanı kartında görsel olmayınca gereksiz boşluk kaldığını, detayda kaldırılan fotoğraf yerine örnek görsel çıktığını ve dik fotoğrafların kırpıldığını bildirdi.
- Karttaki sabit minimum yükseklik, `justify-content: space-between` ve başlığın otomatik üst marjı boşluğu artırıyordu. Detay mapper'ında kalan `image_path || örnek görsel` kuralı kaldırıldı; içerik tipi nullable oldu.
- Görselsiz detayda görsel kolonu tamamen render edilmez, hero tek kolon olur ve bilgi notu metnin altına yerleşir. Fotoğraf varsa `contain` ile oran korunarak sığar; büyük köşe kırpması/üzerine binen bilgi kutusu ve dekoratif numara kaldırıldı. Bilgi kutusu fotoğrafın altında gösterilir.
- Ana sayfa çalışma alanı kartları ve dizin kartları ayrı fotoğraflı/görselsiz sınıflar kullanır. İkonlar görselsiz durumda daire zeminli, başlık/açıklama/bağlantı normal akışta ve gereksiz sabit yükseklik olmadan gösterilir. Boş bir fotoğraf slotu bırakılmaz.
- Dizin kartlarında masaüstünde görsel/metin yan yana, dar mobilde alt alta kullanılır. Fotoğraflı ve fotoğrafsız kart yükseklikleri gerçek tarayıcıda yaklaşık 351/338 px olarak doğrulandı. Ana sayfa kartları kendi dikey kompozisyonunu korur.
- Çalışma alanı kart, detay ve isteğe bağlı liste giriş görselleri kırpılmadan çerçeveye sığar. Nötr zemin kenar boşlukları kullanılır; fotoğrafın oranı bozulmaz. Blog/Hakkımda/ana karakter tasarımı bu pakette değiştirilmedi.
- TypeScript, hedefli ESLint ve Docker production build geçti. `practice-images-smoke.mjs` dört yayındaki alanın görsel/detay durumunu CMS kaydıyla, görselsiz detayın örnek fotoğraf kullanmamasını ve kartta medya slotunun yalnızca görsel varsa bulunmasını doğrular. Render edilen HTML etiketi sayılır; RSC serileştirmesi çift sayılmaz.
- Computer Use becerisiyle masaüstü kartlar, fotoğrafsız Sporcu Rehabilitasyonu detayı, 390 px mobil kart ve portreli detay kontrol edildi. Mobil scrollWidth/clientWidth 375/375; fotoğraf `object-fit: contain`, alt bilgi notu `position: static`. Görsel var/yok ve tam fotoğraf gösterimi doğrulandı. Geçici viewport testten sonra sıfırlandı; ekran görüntüleri visualizations klasörüne kaydedildi.
- İçerik metinleri, kullanıcının yüklediği fotoğraflar, yayın durumları ve hesaplar değiştirilmedi. Görsel kaldırma artık kart ve detayda aynı sonucu verir. Mevcut 16 test, üç dil rota smoke testi, blog kapak testi ve gerçek public görsel testi de çalıştırıldı. README kullanım notu güncellendi.

### Paket 36 — Çalışma alanı ana başlığı ve otomatik URL

- Kullanıcı çalışma alanına girince alan adının başlık olarak görünmesini ve ad değişince URL'nin de aynı yerden otomatik değişmesini istedi. Detayda `hero_title` ana başlık olarak kullanılıyor, URL düzenlenmiş kayıtlarda bağımsız kalıyordu.
- Detay H1 doğrudan `area.title` oldu. Önceki tanıtım başlığı/vurgusu kaybolmadan isteğe bağlı alt başlığa taşındı. Panel etiketleri ana ad/sayfa başlığı ve alt başlık ayrımını açıklar.
- Türkçe alan editörünün URL girişi salt okunur önizleme oldu; yeni ve mevcut kayıtta ad yazılırken URL türetilir. EN/DE çalışma alanı çevirilerinde de başlık URL'yi türetir; backend gelen manuel slug yerine çeviri başlığını kullanır. Blog URL editörü kapsam dışıdır ve korunur.
- PostgreSQL `004` migrasyonu title → slug tetikleyicilerini, Türkçe/Latin karakter normalizasyonunu, çakışma halinde kayıt kimliği eki ve işlem bazlı advisory lock'u ekler. Böylece doğrudan Directus kullanıcı arayüzü/API yazımlarında da URL bağımsız değiştirilemez. Aynı ada sahip kayıtlar birbirinin adresini kullanmaz.
- `website_practice_slug_aliases` dil/eski slug anahtarı ve çalışma alanı FK'siyle adres geçmişini tutar. Başlık değişikliklerinde eski adres saklanır; tekrar ad değiştirmede alias son kayda doğrudan çözülür. Silinmiş kayıt aliasları FK cascade ile temizlenir; gizli/kaydı olmayan/yayımlanmamış çeviri aliası public sayfa üretmez.
- Migrasyon mevcut alan adlarına/metinlere/fotoğraflara dokunmadan URL'leri adlarla eşitledi. Aynı test adına sahip iki mevcut kayıt benzersiz URL aldı; eski başlangıç adresleri alias olarak korundu. İsimlerin kendisi değiştirilmedi.
- Public endpoint önce current slug'ı, sonra aynı dildeki aliası yayımlanmış alan listesinde çözer. Frontend alias detayına HTTP 308 permanent redirect verir. Liste, canonical, hreflang ve sitemap güncel adresleri kullanır.
- Kaynak/runtime Directus dosyaları eşitlendi; Compose ve manuel kurulum yeni migrasyonu çalıştırır. Directus yeniden başlatıldı ve production frontend Docker imajı oluşturuldu.
- 19 otomatik test admin'de tek isim/salt okunur URL, istemci/backend normalizasyonu, yayın filtresi, eski alias çözümü ve önceki özellikleri doğrular. Yeni PostgreSQL testi başlık/URL, iki aynı ad, ardışık rename, eski adresi başkasının devralamaması, EN alias ve blog davranışının korunmasını doğrular; tüm test satırları ROLLBACK ile geri alınır.
- Public smoke tüm yayındaki alanların H1'inin alan adıyla aynı olduğunu ve URL'nin addan türediğini doğruladı. Eski `bel-ve-boyun-sagligi` ve `durus-ve-hareket-analizi` adresleri yeni kayıt adreslerine 308 verdi. TypeScript/ESLint ve mevcut medya, blog, çok dilli sayfa kontrolleri çalıştırıldı. Gerçek admin hesabının TOTP/parolası değiştirilmedi; yeni admin hesabı oluşturulmadı.

### Paket 37 — Hesabım, kendi giriş bilgileri ve navbar sırası

- Kullanıcı her yöneticinin kendi e-posta/parolasını değiştirebilmesini, başka yöneticilerin bilgilerine yazamamasını ve dil seçiminin randevu düğmesinin sağına/en sağa taşınmasını istedi.
- Sidebar'a Hesabım bölümü ve ad, soyad, e-posta, yeni parola/tekrar, mevcut parola ve aktif 2FA kodu alanları eklendi. Hedef yönetici seçimi yoktur. Kaydetme mevcut parola ve etkinse TOTP doğrulaması gerektirir. Sadece isim değişince mevcut oturum korunur; e-posta/parola değişince yalnızca kendi oturumları kapatılır ve giriş ekranı gösterilir.
- Özel PATCH account-settings endpoint'i aktif admin oturumunu kontrol eder, hedefi accountability.user'dan alır ve body alanlarını beyaz listeyle sınırlar. id/user_id/role/status/policies/tfa_secret kabul edilmez. Directus AuthenticationService/TFAService doğrulaması, UsersService parola hash/politika ve benzersiz e-posta kontrolü kullanılır. Güncelleme + oturum temizliği tek transaction içindedir. Güvenli, Türkçe hata mesajları döndürülür; ham parola/OTP hata içeriği log/yanıta aktarılmaz.
- Genel Directus admin yetkisinin kullanıcı API'sinde diğer hesapları düzenleyebildiği görüldü. Yeni account-ownership hook'u users.update/users.delete hedeflerini oturum kimliğiyle karşılaştırır; tam admin veya toplu yazım dahi olsa başka kullanıcı hedefini 403 ile engeller. Directus dahili null-accountability auth bookkeeping korunur; mevcut gerçek yönetici hesaplarına/parola/2FA verilerine dokunulmadı.
- Public /bakir-api proxy Caddy allowlist'e geçti: mevcut panelin oturum, içerik, medya, kendine ait TFA ve özel endpoint'leri açık; genel kullanıcı yazımları, roller/politikalar, kullanıcı tablosu, GraphQL ve kullanılmayan platform endpoint'leri kapalı. Teknik API loopback kalır.
- Yeni yönetici oluşturma, beyaz listeli POST website-content/admin-team'e taşındı. Rol ve aktif durum sunucuda belirlenir; mevcut kullanıcı kimliği veya farklı rol seçilemez. Mevcut takım listesi sadece okunur kalır; bu pakette yeni gerçek hesap oluşturulmadı.
- 005 idempotent migrasyonu bilinen çift kaçışlı parola regex'ini düzeltir; özel kuralları ve mevcut parola hash'lerini değiştirmez. Etkin kural sahte güçlü parolayı kabul, kısa zayıf parolayı ret testiyle kontrol edildi. Bootstrap kaynak kuralı zaten doğru olduğundan değiştirilmedi.
- Navbar DOM sırası randevu bilgisi → mobil menü (göründüğü ölçülerde) → dil seçimi oldu; klavye ve görsel sıra eşleşir. Dil seçicisi en sağdadır. Computer Use ile masaüstü ve 320 px mobil kontrol edildi: clientWidth/scrollWidth 305/305, dil sağ koordinatı menüden büyük. Navbar ekran görüntüsü visualizations klasörüne kaydedildi; geçici viewport sıfırlandı.
- TypeScript/ESLint, production Docker build ve Caddy validate geçti. Directus yeni hook/endpoint'lerle, Caddy allowlist'le yenilendi. Restart sonrası servis hazır olmadan yapılan ilk smoke denemesi geçici 502 verdi; healthy olduktan sonraki tekrar tüm kontrollerde geçti. Hook'un yüklenmesi Directus startup kaydında doğrulandı.
- 28 otomatik test; kendi hedef, yabancı kimlik/rol enjeksiyonu, yanlış parola/OTP, oturumların sadece kendisi için kapanması, parola sızdırmayan hata cevabı, native hook ve takım oluşturma kısıtlarını doğruladı. Canlı smoke native user/role/GraphQL yazımlarında 403, anonim own-account/team/TFA işlemlerinde 401; üç dil 16 sayfa ve gerçek medya akışlarını doğruladı. Gerçek hesapla şifre değiştirme submit'i yapılmadı; user credentials ve TOTP değişmedi.
- Son schema kontrolünde ad/soyad varchar(50), e-posta varchar(128) doğrulandı; form/backend limitleri bunlara eşitlendi. Kaydet sonrası alanlar sunucunun normalize ettiği profil değerleriyle güncellenir.
- Gecikmiş kayıt yanıtının çıkış/yeni giriş sonrasında farklı oturumun UI durumunu değiştirmemesi için güncel kullanıcı kimliği ref kontrolü eklendi. Yeni yönetici formu da aynı sütun sınırlarını kullanır ve güvenli sunucu hata mesajını gösterir.
