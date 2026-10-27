# Sayfa görünürlüğü — 27 Ekim 2026

## Kullanım

`/bakir` → **Sayfa içerikleri → Sayfa görünürlüğü**. Görünür/Gizli düğmesi anında kaydeder; ayrıca içerik formundaki Kaydet'e basmak gerekmez. Ana sayfa daima açık ve düğmesi kilitlidir. Hakkımda, çalışma alanları, blog, iletişim, gizlilik ve KVKK ayrı ayrı açılıp kapatılır. Mevcut bölüm/görsel ve footer menü ayarları silinmez veya sıfırlanmaz; sayfa görünürlüğü bunların üstündedir.

- Kapatılan sayfa masaüstü/mobil navbar, footer, ana sayfadaki ilgili bölüm/bağlantılar ve sitemap'ten çıkar.
- İletişim kapanınca masaüstü ve mobil navbar'daki randevu CTA'ları, ana sayfa ve diğer sayfalardaki iletişim CTA'ları da kalkar.
- Doğrudan URL özel 404 sayfasını ve gerçek HTTP404 döndürür. Blog/alan kapatılınca alt detayları ve eski alan slug yönlendirmeleri de açılmaz. Tüm TR/EN/DE adresleri aynı karara uyar; yasal sayfalar mevcut haliyle yalnız Türkçedir.
- Tekrar açılınca mevcut yazılar, fotoğraf ilişkileri, çeviriler, bölüm tercihleri ve yayın durumları korunarak geri gelir. Gizlemek silmek değildir.
- `/bakir` bu ayarlardan etkilenmez. Görünürlük bir yayın kontrolüdür, özel dosya/erişim sistemi değildir; geçmiş paylaşımları, önceden alınmış kopyaları veya ayrı medya URL'lerini geri çekmez.

## Veri ve API

Yeni kolon/migrasyon yok. İlk yönetici değişikliğinde `site_pages.page_key='visibility'` kaydı oluşturulur; content içinde yalnız izinli sayfa anahtarlarının boolean değerleri tutulur. Kayıt/anahtar yoksa geriye uyumlu olarak görünür; home değeri her okumada zorunlu true'dur. Public GET salt okunurdur, yeni kayıt yaratmaz.

`GET /website-content/page-visibility` no-store public ayarı verir. `PATCH /website-content/page-visibility/:pageKey`, yalnız aktif ve native TFA-doğrulanmış admin için `{visible:boolean}` kabul eder. Home, bilinmeyen anahtar, string boolean ve ek alanlar reddedilir. Transaction + row lock ile yalnız seçilen anahtar güncellenir; başka yöneticinin ayarı veya sayfa içerikleri ezilmez. Native admin içerik/çeviri endpoint'leri mevcut yetkileriyle çalışmaya devam eder.

Public `/pages/:pageKey` gizliyse404, blog/alan liste API'leri boş dizi, detay API'leri404 verir; homepage=true ve dil parametreleri ayarı aşmaz. Sunucu RSC yardımcıları no-store ve request-scope React cache kullanır. Görünürlük servisi erişilemezse ikincil linkler kapalı, home açık varsayılır; 404 renderer sırf bu servis yok diye çökmez. CMS veri servisi de yoksa normal içerik erişimi yine mevcut hata davranışına tabidir.

## Doğrulama ve yayın

- `node --test scripts/tests/*.test.mjs`: **147/147 geçti**. Yeni 9 test + home CTA/footer testleri; eski bölüm görünürlüğü, TFA ve medya regresyonları korunur. İlk sandbox çalışmasında esbuild üst dizin erişimi kısıtlandı; aynı testler normal izinle geçti. İlk yeni sitemap fixture'ı home=false'ı yanlış uyguluyordu; backend'in home istisnasına eşitlenip test tekrar geçti.
- `cd frontend; node node_modules/typescript/bin/tsc --noEmit`: geçti. Hedef backend/smoke JS syntax, shell bash-n ve diff-check geçti. Bu pakette lint yeniden çalıştırılmadı.
- `frontend/Dockerfile.vps` Linux üretim build geçti; dependency/lock ve Node base digest önceki yayınla aynı kaldı. Test edilen imaj `fizyoterapist-frontend:vps-20261027-pagevisibility1`, ID `sha256:8e8240953a75a494ba9e8c26b66efb50e2dfdfdeb8fc745df54475eedc2da278`.
- `run-page-visibility-fixture.sh`: ayrı internal ağ, portsuz Directus/frontend/Caddy ve tmpfs DB/uploads. Production pg_dump salt okunur kopyalandı, API başlamadan kopyadaki gerçek oturum/parola/e-posta/TOTP/token temizlendi. İki geçici yönetici native parola/TOTP ile giriş yaptı. Altı sayfa türü her dilde kapatılıp açıldı; gerçek HTTP404/200, alt detaylar, API'ler, navbar/randevu, ana sayfa ve sitemap doğrulandı. Kullanıcıların içerik/çeviri satırları hash olarak aynı kaldı. Test kullanıcıları, ağ ve tmpfs/container'lar temizlendi. Production'da deneme amacıyla sayfa kapatılmadı.
- Ön yayın yedeği `/var/backups/furkantoplu/daily/20261027T121630Z` (15.16Türkiye), Resultsuccess/çıkış0. Root-only geri dönüş `/var/backups/furkantoplu/pagevisibility-20261027-01`: önceki env/kaynak dosyaları ve hash manifesti; önceki frontend imajı saklanır. `rollout-page-visibility.sh` bu tek seferlik, sabit imaj ve manifest için hazırlanmıştır; tekrar çalıştırılmaz. DB restore yapılmadı.
- Yalnız Directus (aynı yamalı image ile extension reload) ve frontend recreate; PostgreSQL/proxy container ID'leri aynı. Aktif Caddyfile.vps'e dar PATCH yolu eklendi, validate + mount hash + reload geçti. İnaktif VPS `deploy/Caddyfile` Git tabanından farklı olduğu için korunarak yayından hariç bırakıldı; yerel Caddyfile günceldir. Eski/yeni kaynak hash guard'ları ve yayın sonrası kaynak eşitliği geçti. Sayfa içeriği ve hesap güvenlik alanları önce/sonra aynı; başlangıç ayarı yedi sayfada da açık kaldı.
- Canlı `TEST_SITE_URL=https://furkantoplu.com node scripts/tests/page-visibility-public-smoke.mjs`, public-design, blog-sharing, practice-sharing, media ve account-access smoke kontrolleri geçti. 41 güncel sitemap URL'si200. Browser'da /bakir giriş ekranı görüldü; gerçek sahibin oturumu olmadığından yeni admin kontrolü için browser/piksel veya gerçek mobil cihaz kabulü iddia edilmez. Mobil davranış DOM/CSS ve izole gerçek HTTP kontrolleriyle sınandı.

Kaynaklar: frontend `lib/page-visibility*.ts`, `bakir/page-visibility-manager.tsx`, ortak header/footer ve sayfa CTA'ları; backend `page-visibility.js` src/dist ve public endpoint guard'ları; yerel/VPS Caddy allowlist'i; sitemap ve ilgili testler. Yerel genel Node/Docker runtime güncellemesi, diğer tasarım/SEO ve Cloudflare işleri bu pakete dahil değildir.
