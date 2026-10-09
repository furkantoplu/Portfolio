# Çalışma alanları — 10 Ekim 2026

Kullanıcı altı hizmetin tamamının Furkan tarafından sunulduğunu açıkça teyit etti. İçerikler yerel CMS'de üç dilde yayında; gerçek domain/VPS yayını henüz yapılmadı. Görsel eklenmedi. Başlıklar klinik sınıflandırma yerine ziyaretçinin anlayacağı ifadeleri kullanır.

| Klinik karşılık | Türkçe başlık | English | Deutsch |
| --- | --- | --- | --- |
| Ortopedik rehabilitasyon | Kas ve Eklem Ağrıları | Muscle and Joint Pain | Muskel- und Gelenkbeschwerden |
| Nörolojik rehabilitasyon | Sinir Sistemi ve Hareket | Movement and Nervous System Conditions | Bewegung und Nervensystem |
| Kardiyopulmoner rehabilitasyon | Nefes ve Dayanıklılık | Breathing and Stamina | Atmung und Ausdauer |
| Pediatrik rehabilitasyon | Çocuklarda Hareket ve Gelişim | Movement and Development in Children | Bewegung und Entwicklung bei Kindern |
| Spor fizyoterapisi | Spor Yaralanmaları ve Spora Dönüş | Sports Injuries and Return to Sport | Sportverletzungen und Rückkehr zum Sport |
| Geriatrik rehabilitasyon | İleri Yaşta Denge ve Hareket | Balance and Mobility in Later Life | Bewegung und Gleichgewicht im Alter |

Her dilde kart özeti, detay girişi, odak açıklaması, üç değerlendirme maddesi, üç süreç adımı, iki SSS ve SEO metni vardır. Başlıklardan slug mevcut DB trigger'ıyla otomatik üretilir. Metinler `scripts/content/practice-catalogue.mjs` kaynak taslağındadır; bundan sonraki gerçek düzenlemeler admin panelinden yapılabilir.

Kapsam eşlemesinin genel klinik çerçevesi [NHS fizyoterapi bilgisi](https://www.nhs.uk/tests-and-treatments/physiotherapy/) ile kontrol edildi. Bu kaynak Furkan'ın yetkinlik belgesi değildir; hizmet kapsamı kullanıcı teyidinden gelir. Metinler özgün editoryal taslaktır, kaynak kopyası veya kişisel tedavi protokolü değildir. Ekipman, ev ziyareti, süre/sonuç garantisi, sertifika ve hasta yorumu uydurulmadı. Gerçek yayından önce fizyoterapistin metinleri/çevirileri gözden geçirmesi uygundur.

## Uygulama

Manuel `node scripts/import-practice-catalogue.mjs` importu yalnız boş çalışma alanı koleksiyonunda, tek transaction içinde altı kayıt ve on iki çeviri oluşturur. `website_content_imports` tablosundaki tek seferlik `friendly-practice-areas-v1` işareti tekrarı engeller. İşaret küçük operasyon geçmişidir; silinen içerikleri yeniden yaratmak için kullanılmaz. Script Compose/otomatik migration'a bağlı değildir. Mevcut kayıtları overwrite, tablo truncate veya id sıfırlama yapmaz. Marker varsa admin düzenlemeleri/silmeleri korunur.

Oluşturulan parent ID'leri 18–23; altı kayıt da ana sayfada görünür. Ana sayfada altı kart 3×2, tablet iki kolon, mobil tek kolon olur. Görseller null olduğundan mevcut görselsiz kart/detay tasarımı kullanılır. Admin'den gerekirse görsel, çeviri, görünürlük veya yayın durumu değiştirilebilir.

Doğrulama: 89 unit/regresyon testi, TypeScript/lint, Docker build; üç dil liste + 18 gerçek detay URL'si/başlık/görselsiz detay/sitemap/dil bağlantıları. Tekrar import `already-applied` verdi; yeni kopya oluşmadı. Pixel QA bu testlerin yerine geçti diye raporlanmaz.
