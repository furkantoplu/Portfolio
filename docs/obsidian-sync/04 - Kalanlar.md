# Fizyoterapi Sitesi — Kalanlar

Ana envanter: **19 Ekim 2026**. Son güncelleme: **21 Ekim 2026**, Türkiye saati. Güncel iş listesi bu nottur; önceki tarihli günlük ve güvenlik raporları o tarihteki durumu anlatır. İşaretlenmeyen maddeler henüz tamamlanmadı. Yedi eksik SEO açıklaması ve ana sayfanın üç dil paylaşım etiketleri tamamlandı. Kullanıcı 21 Ekim'de yeni deneme bağlantısında WhatsApp fotoğrafının göründüğünü doğruladı. Özel yatay kart görseli, diğer sayfalar ve ayrı admin paylaşım ayarları açık.

## Şu anda doğrulanan durum

- Canlı sitemap'teki **41 URL'nin tamamı HTTP 200** döndü.
- **19 Ekim'de 41 sayfanın hiçbirinde `og:image` yoktu.** 20 Ekim'de `/`, `/en`, `/de` için adminin mevcut ana fotoğrafı, dil başlığı/açıklaması ve mutlak HTTPS görsel adresiyle OG/X etiketleri canlıya alındı. Diğer sayfalar ve özel yatay kart açık.
- 19 Ekim'de **7 sayfada SEO açıklaması (`meta description`) eksikti; 20 Ekim'de tamamlandı.** Yedi hedef ve mevcut EN/DE blog listeleri olmak üzere dokuz sayfanın canlı HTML'inde doğru dilde tek açıklama doğrulandı.
- Örneklenen tüm sitemap sayfalarında JSON-LD yok; sitemap'te `lastmod` yok.
- Frontend, Directus ve PostgreSQL sağlıklı; proxy çalışıyor. Son günlük VPS yedeği **19 Ekim 2026 04.15 Türkiye saati** başarılı (`Result=success`, çıkış 0); zamanlayıcı aktif. Yaklaşık 22 GB disk boş.
- Blog: iki yazı yayında, bir yazı taslak. İki yayımlı yazının EN/DE çevirileri yayında, üçüncünün çevirileri taslak. İkinci yayımlı yazıda gövde paragrafı yok; ilkinde iki paragraf var.
- Kaynak ve canlı sayfa kontrolleri yapıldı. Bu kontrol yeni bir güvenlik taraması, PageSpeed ölçümü veya gerçek cihaz/WhatsApp kabul testi değildir.

## 1. Sıradaki küçük paket: fotoğraflı paylaşım önizlemesi

- [x] **21 Ekim, gerçek WhatsApp kabulü:** Kullanıcı `https://furkantoplu.com/?paylasim=2` bağlantısını WhatsApp mesaj alanına yapıştırınca fotoğrafın göründüğünü doğruladı. Ana sayfa fotoğraf sorunu bu denemede çözüldü. Eski önizlemelerin yeniden yüklenmesi ve diğer sayfa/dil bağlantılarının cihaz testi bu onaydan çıkarılmaz; bu tur ek deploy yapılmadı.
- [x] **20 Ekim, düzeltme:** Kullanıcı WhatsApp'ta başlık/açıklamanın geldiğini, fotoğrafın gelmediğini bildirdi. İlk paketteki 1.329.199 baytlık 1086×1448 PNG yerine varsayılan portre için 600×600, **17.692 bayt JPEG** paylaşım kopyası kullanıldı; tüm fotoğraf kırpılmadan korunur. Yeni görsel URL'si, OG genişlik/yükseklik/tür bilgileri canlıda doğrulandı. Gerçek WhatsApp sonucu için `https://furkantoplu.com/?paylasim=2` deneme bağlantısı kullanıcıya verildi; cihaz kabulü henüz doğrulanmadı. Özel admin yüklemeleri mevcut görsel yolunu kullanmaya devam eder; onlara da otomatik küçük paylaşım kopyası üretimi ayrı açık iştir.
- [x] **20 Ekim, küçük paket 1:** Üç dilde ana sayfaya mevcut fotoğrafla `og:title/description/url/type/locale/site_name/image/image:alt` ve X kart etiketleri eklendi. Ana fotoğraf/SEO metni admin'den değişince paylaşım alanları aynı kaydı kullanır. Ayrı paylaşım görseli alanı henüz yok. TypeScript, hedef dosya lint, VPS üretim build, özel önizleme ve canlı WhatsApp/Meta/X user-agent kontrolleri geçti. Gerçek WhatsApp uygulaması testi henüz yapılmadı.
- [ ] **Paylaşımı diğer sayfalara genişlet; ayrı admin paylaşım görseli ayarlarını tamamla.** Ana sayfanın gerçek WhatsApp fotoğraf kabulü yukarıda tamamlandı.
  - Ana sayfa ve genel sayfalar için Furkan'ın fotoğrafını ve site kimliğini içeren ortak bir paylaşım görseli hazırla. İlk tasarım hedefi: 1200 × 630 px JPEG/PNG; mevcut portre ve tema kullanılabilir. Nihai görsel seçimi uygulama sırasında yapılacak.
  - Ortak görsel admin panelinden değiştirilebilsin. Blog/çalışma alanında uygun kapak varsa onu, kapak yoksa ortak görseli kullan; gerekirse içerik bazında ayrı paylaşım görseli seçilebilsin.
  - `og:title`, `og:description`, `og:type`, `og:url`, `og:image` ve görsel açıklaması/boyutları gerçek sayfa ve dil ile eşleşsin. TR/EN/DE başlık ve açıklamalar doğru gelsin. Blog detayları article, genel sayfalar website olarak tanımlansın.
  - Görsel adresi tam HTTPS URL olsun; oturum istemeden 200 ve gerçek görsel MIME türüyle açılsın. Meta etiketleri ilk sunucu HTML'inde bulunsun.
  - WhatsApp/Meta önizleme isteğinin Cloudflare tarafından engellenmediğini seçili public URL ve görsel üzerinde kontrol et. Bunun için bütün bot korumasını kapatma.
  - **Kabul:** Ana sayfa, bir blog ve bir çalışma alanı bağlantısını gerçek WhatsApp sohbetine yapıştırınca doğru başlık/görsel önizlemesi gelsin; fotoğrafı olmayan içerikte ortak görsel kullanılsın. Uygulama önbelleği nedeniyle eski önizleme görülebileceği testte hesaba katılsın. Test mesajını kullanıcı kendisi gönderebilir.
  - Kaynak: [Open Graph standardı](https://ogp.me/). WhatsApp'ın gerçek istemci davranışı cihazda ayrıca doğrulanacak.

## 2. SEO açıklamalarını tamamla

- [x] Şu yedi sayfanın kendi dilinde açıklamasını ekle: `/`, `/en`, `/de`, `/blog`, `/calisma-alanlari`, `/en/practice-areas`, `/de/behandlungsbereiche`. **20 Ekim 2026:** mevcut sayfa girişleri yalnız boş CMS SEO açıklamalarına kaydedildi; özel açıklamalar korunur. Admin SEO alanından değiştirilebilir. Tek seferlik SQL: `scripts/content-updates/2026-10-20-seo-descriptions.sql`.
- [ ] Admin SEO açıklaması boşsa sayfa içeriğinden anlamlı ve aynı dilde bir yedek açıklama üret. Boş alanın üst düzen açıklamasını da kaldırdığı mevcut metadata davranışını düzelt.
- [x] **Mevcut içerik kabulü:** Yedi sayfanın ilk HTML'inde dolu ve ilgili dile ait tek description var; mevcut EN/DE blog açıklamaları korunuyor. Admin alanı sonradan boşaltıldığında otomatik yedek açıklama üretimi yukarıdaki ayrı açık maddedir.

## 3. İçerik tamamlama ve son düzenleme

- [ ] **İkinci yayımlı blog yazısını tamamla:** “Egzersizde düzeni korumayı kolaylaştıran üç küçük adım” şu anda başlık/özet içeriyor; gövde ve üç adım yok. Türkçe asıl metni hazırlayıp EN/DE karşılıklarını birlikte tamamla.
- [ ] Üçüncü blog yazısı isteniyorsa gövdesini ve çevirilerini tamamlayıp ayrıca yayınla. Taslak kalması bir hata değildir; otomatik yayımlama yapılmayacak.
- [ ] Hakkımda biyografisi lisans eğitiminin sürdüğünü söylerken site genelinde kullanılan `Fzt.` unvanını site sahibiyle netleştir; karar çıkarsa TR/EN/DE başlık, SEO, fotoğraf açıklamaları ve hizmet dilini tutarlı güncelle.
- [ ] İlk blog görselinin Türkçe alternatif metnini görselle karşılaştır; 14 Ekim kaydındaki “hareket yapan danışan” metni portreyle uyuşmuyordu. Yabancı dil ve Türkçe fotoğraf açıklamalarını aynı gerçek görsele göre düzenle.

## 4. Arama motorlarına ek bilgi

- [ ] Gerçek bilgilerle `Person`, `WebSite` ve uygun bloglarda `BlogPosting` yapılandırılmış verisi ekle; eksik klinik adresi veya teyitsiz mesleki bilgi üretme.
- [ ] Gerçek içerik güncelleme zamanını tutup sitemap `lastmod` alanına bağla. Her istekte bugünün tarihini yazma; Türkçe/çeviri değişikliklerini doğru hesaba kat.
- [ ] **Kabul:** Geçerli yapılandırılmış veri, doğru dil/URL/görsel/başlık ve gerçek değişim tarihi; taslak/gizli içerikler sitemap dışında kalsın.

## 5. Kademeli teknik iyileştirmeler

- [ ] **Yönetici girişi/API hız sınırı ve gerçek istemci IP'si:** Cloudflare → Caddy → Directus zincirini kontrollü kur; normal iki yönetici birbirini kilitlemesin. Mevcut yanlış parola sonrası hesap askıya alma, IP bazlı hız sınırıyla aynı şey değildir. Kabul için kontrollü deneme ve normal giriş/OTP akışı birlikte test edilsin.
- [ ] **Bağımlılıkların kalan güncellemeleri:** Son kayıt 13 Ekim'de 27 npm audit paket kaydıydı; bu sayı 19 Ekim'de yeniden ölçülmedi ve 27 doğrulanmış uygulama açığı anlamına gelmez. Runtime/build ve gömülü kopyaları ayırıp uyumlu küçük paketlerle devam et.
- [ ] **CSP ve HSTS:** Public yanıtlarında bu başlıklar 19 Ekim kontrolünde yok. CSP'yi önce raporlama ile dene; RSC, görsel, QR ve admin akışlarıyla uyumunu doğrula. HTTPS davranışıyla uyumlu HSTS politikasını ayrı küçük adımda uygula.
- [ ] **Yönetici kurtarma:** E-posta sahipliği doğrulaması, davet/SMTP ve telefon/Authenticator kaybı sürecini site sahibinin kullanabileceği biçimde netleştir. Parola veya TOTP sırları Git/Obsidian'a yazılmayacak.
- [ ] **Geliştirme temizliği:** Önceki lint kaydındaki iki hata ve bir uyarıyı ilgili dosyalarda düzelt; sonraki UI paketinde TypeScript/lint kontrolünü temizle. 19 Ekim'de lint yeniden çalıştırılmadı.

## 6. Site sahibini bekleyen veya kullanıcının üstlendiği işler

- [ ] **Sunucu dışında şifreli yedek:** Kullanıcı site sahibi hazır olmadığı için erteledi. DB + yüklenen fotoğraflar + gerekli kurulum verileri için hedef, erişim ve saklama süresi birlikte seçilecek. Aynı VPS'teki günlük yedek ve bilgisayardaki Git kodu bunun yerine geçmez.
- [ ] **Yedek/servis hata bildirimi:** Uygun alıcı/kanal belirlenince başarısız yedek ve erişilememe durumunu dışarı bildirecek mekanizma kur. Bu not otomasyon oluşturmaz.
- [ ] **Cloudflare bot ayarı:** Kullanıcı yönetiyor. Son ayarın Search Console/Googlebot, gerçek ziyaretçi ve WhatsApp paylaşım önizlemesini bozmadığını birlikte kontrol et. Hesaba bu tur girilmedi.
- [ ] **Search Console takibi:** Kullanıcı mülkiyet/sitemap kurulumunu tamamladığını bildirdi; yeniden kurulum yapılmayacak. Kendi hesabından sitemap sonucu, sayfa indeksleme raporu ve birkaç önemli URL incelemesini kontrol et. Bu hesaba erişilmediği için Google indekslenme sonucu bugün doğrulanmadı.
- [ ] **Sahip içerik onayı:** Mesleki unvan, hizmet kapsamı ve mevcut yasal metinlerde anlatılan gerçek işleyişi son kez sahibiyle teyit et. Mevcut gizlilik/KVKK sayfaları hazırlanmış durumda; yeniden sıfırdan yazılacak iş olarak sayılmıyor.

## 7. Kullanım ve performans ölçümü

- [ ] Mobil/masaüstü PageSpeed ve erişilebilirlik ölçümü al; gerçek sonuçlara göre font/görsel/LCP/CLS ve klavye kullanımını önceliklendir. Bugün ölçüm yapılmadı; puan tahmini yazılmadı.
- [ ] Sonraki arayüz/paylaşım yayını sonrası gerçek telefonda menü, dil geçişi, dik/yatay kapaklar ve paylaşım önizlemesini kontrol et. Kullanıcının başarılı admin giriş/foto yükleme kabulü tamamlananlar arasında kalır.

## Tekrar yapılacak iş olarak sayılmayanlar

- [x] Docker ile VPS yayını, domain ve Cloudflare HTTPS/Full(strict) kurulumu.
- [x] Günlük VPS içi yedek ve seçili yedeğin izole DB/medya geri yükleme denemesi.
- [x] Özel Türkçe admin, çoklu yönetici ve zorunlu iki adımlı doğrulama akışı.
- [x] Backend görsel tür/boyut/piksel doğrulaması ve kullanılmayan yüklenen görsellerin temizliği.
- [x] Fotoğrafların kırpılmadan gösterilmesi ve kart boyutu düzenlemeleri.
- [x] Kullanıcının gerçek admin giriş/fotoğraf yükleme denemesi; sonraki yanlış parola sorunu kullanıcı tarafından çözüldü.
- [x] WhatsApp uluslararası numara düzenlemesi ve gerçek iletişim e-postası.
- [x] Hakkımda ve iki yayımlı blogun EN/DE çevirileri; üçüncü yazının taslak çevirileri.
- [x] Robots/sitemap/canonical/dil adresleri ve 404 sayfası; 19 Ekim'de 41 sitemap adresi erişilebilir.
- [x] Search Console mülkiyet/sitemap kurulumu — kullanıcı bildirimi; hesap içindeki indeksleme sonuçlarının takibi ayrı.

Önerilen uygulama sırası: **paylaşım görseli/etiketleri → eksik SEO açıklamaları → blog içerik tamamlaması → yapılandırılmış veri/lastmod → küçük teknik iyileştirme paketleri**. Sunucu dışı yedek sahibin hazır olacağı ayrı adımdır.
