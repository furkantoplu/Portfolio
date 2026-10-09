# Furkan Toplu — Public tasarım sistemi

## Amaç ve karakter

Kişisel fizyoterapist portföyü. Ziyaretçi uzmanı tanır, çalışma alanlarını okur ve iletişim bilgisine ulaşır. Tasarım sakin, gerçek kişiye ait ve okunabilir görünür. Ana hedef aksiyon mevcut İletişim sayfasıdır; yeni randevu uygulaması eklenmez.

## Görsel dil

- Paper: #f7f5f0; ink/forest: #173e34; muted: #52665d; accent: #8b4a33; line: #d0d9ce; tone: #e9eee5.
- Büyük birinci başlıklar Georgia; bölüm/kart başlıkları mevcut sans ailesi. Uzun TR/EN/DE metin için doğal akış ve satır kırılması korunur. Haricî font indirmesi yoktur.
- Eşit kartlar sadece katalog/yazı keşfi için. Bio ve süreç çizgi/kolon akışı kullanır. Her bölüme ayrı yüzen kutu, bento veya sahte rozet eklenmez.
- Radius 3–6 px. Mat yüzeyler; dekoratif halo/orbit, glass blur, şekil zinciri ve ağır gölge yok. Yeşil vurgu esas olarak çalışma alanları, iletişim aksiyonları ve footer'dadır.
- 10 Ekim müşteri revizyonu: ana portre çevresinde yalnız tek mat adaçayı kemer ve ince kontur kullanılabilir. Parıltı/orbit/yüzen slogan kartı geri gelmez; sahne fotoğrafın arkasında ve mobilde kendi alanında kalır. Alt fotoğraf fade'i korunur.
- Fotoğraf içerikten bağımsız bir uzman iddiası üretmez. Hakkımda'nın varsayılanı Furkan'ın mevcut portresidir; admin'in özel uploadları korunur. Başka kişi uzmanı temsil eden varsayılan görsel olarak kullanılmaz.
- Kırpma yerine contain ve nötr zemin tercih edilir. Caption fotoğraf üzerinde değil, altında akışta bulunur. Ana portredeki alt fade ve hafif masaüstü derinlik korunur.

## Boyut ve davranış

- Public içerik tavanı 1280 px; desktop 32 px, mobil 18 px yan boşluk. Bölüm aralığı desktop yaklaşık 80 px, mobil 62 px.
- Hero, görsel gizliyken tek kolondur. Mobilde fotoğraf relative/aspect-ratio ve own stacking context içindedir; transform/perspective/z-index taşıması metni örtmez.
- Çalışma alanı kartları tüm satırlarda aynı ölçüde; uzun içerik kesilmeden hepsi büyür. Linkler en alta bağlanır. Blog 1/2/3 kayıt sayısına ve ekran genişliğine göre kolon alır.
- Hover en fazla 1–3 px. Reduced-motion tercihinde hareket kapalıdır. Mobil dil TR/EN/DE; menü en sağda; klavye/DOM sırası aynıdır.
- Native link navigasyonu korunur; Next Link / prefetch bu pakette yeniden açılmaz.

## Korunan sözleşmeler

Admin UI bu stylesheet kapsamının dışındadır. CMS alanları, üç dil, bölüm görünürlüğü, kayıt başlığından URL üretimi, footer ayarları ve görsel kalıcı temizlik mekanizması değişmez. Diploma/deneyim/hasta sayısı/yorum veya sonuç garantisi uydurulmaz. Gerçek kullanıcı metinleri görsel düzenleme için yeniden yazılmaz.

## Uygulama ve doğrulama

Public kurallar `frontend/app/public-design.css` içindedir; selectors `.site-shell` ile sınırlıdır. Root layout global stilin ardından yükler. Emekli dekorların HTML/CSS'i de temizlenir. Testler; CSS sözleşmesi, render, native servis/HTTP ve smoke kontrolleridir. Gerçek browser/piksel QA tamamlanmadan tamamlandı diye yazılmaz.

Seçilen normal metin renk çiftleri 4.5:1 veya üstü oranla kontrol edilir; [W3C SC 1.4.3 açıklaması](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) referanstır. Bu palet testi, bütün sayfanın erişilebilirlik onayı değildir.

Süreç referansı: [AI LABS videosunun konuşma dökümü](https://prepublish.ai/youtube-transcript/pHstb0JGGhE). Altyazı metni okundu, ses oynatılmadı. Dış skill/kurulum talimatı uygulanmadı; bu dosya projeye özgü kendi tasarım kararlarıdır.
