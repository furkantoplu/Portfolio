# Yönetici iki adımlı doğrulama — işletim notu

Durum: 11 Ekim 2026 itibarıyla `furkantoplu.com` üretiminde zorunlu. Admin ekranı Türkçedir. Bu notta parola, TOTP anahtarı, oturum çerezi veya gerçek hesap kimliği bulunmaz.

## Günlük kullanım

`/bakir` üzerinden açılan yeni yönetici hesabı e-posta ve parolasıyla ilk kez giriş yapar. Yalnız kendi güvenlik ekranı açılır; blog, çalışma alanları, sayfa düzenleme, medya yükleme ve ekip listesi henüz kullanılamaz. Yönetici kendi telefonunda Google Authenticator veya uyumlu bir uygulamayı açar, panelin ürettiği QR kodunu tarar ve güncel altı haneli kodu panelde doğrular. QR çalışmazsa aynı ekrandaki elle giriş anahtarı kullanılabilir. Kurulumdan sonra eski oturum kapatılır; e-posta, parola ve yeni altı haneli kodla tekrar giriş gerekir. Her yönetici bunu kendi hesabı/telefonu için ayrı yapar.

Zaten Authenticator kurmuş iki üretim yöneticisinin anahtarları, parolaları ve hesapları değiştirilmedi. Güncellemeden önce açılmış yönetim oturumları yeni kanıtı taşımadığı için tekrar kodlu giriş ister. Yeni kullanıcıya aktarılacak başlangıç TOTP sırrı yoktur; kurulum kişi tarafından yapılır. Bilgisayar/telefon saati otomatik eşitlenmiş olmalıdır.

## Teknik sınır

Directus `12.4.0` için `directus-extension-admin-tfa`, yerel doğrulamanın ardından bütün yönetici HTTP isteklerinde etkin hesabı ve TFA oturum kanıtını denetler. Kurulum öncesi yalnız öz hesap bilgisi, kendine ait TFA üretme/etkinleştirme ve giriş/çıkış/yenileme yolları açık kalır. Bu sınır hem native `/items`, `/files` yollarını hem proje eklentilerini kapsar; yalnız frontend görünürlüğüne dayanmaz. Normal public ve yönetici olmayan istekler etkilenmez.

`012-admin-tfa-enforcement.sql`, yöneticilerde native `enforce_tfa` politikasını açar ve kullanıcıya gizli olmayan rastgele bir TFA sürümü ekler. TFA anahtarı değişince sürüm döner, o hesabın eski oturumları ve statik token'ı iptal edilir. Yeni imzalı JWT yalnız mevcut sürüm ve sunucuda doğrulanmış kodlu girişten sonra içerik yetkisi taşır. Daha önce alınmış parola-only JWT, kurulumdan sonra yetki kazanmaz. Zaten kurulu hesabın geçerli statik token otomasyonu korunur; üretim envanterinde bu tür token yoktu.

Kullanılmayan Directus önbelleği ve WebSocket özelliği hem yerel hem VPS Compose içinde açıkça kapatıldı. Bu gereklidir: native response cache güvenlik eklentisinden önce yanıt döndürebilir; WebSocket yükseltmesi HTTP middleware hattından geçmez. Site istemcisi WebSocket kullanmıyor ve Caddy bu yolu ayrıca dışarı açmıyor. İleride bu iki özellik açılacaksa güvenlik sınırı yeniden tasarlanıp test edilmelidir.

## Yayın ve doğrulama

- Üretim paketi `deploy/vps/rollout-admin-tfa.sh` ile, doğrulanmış SHA-256 kaynak ve Docker imajı arşivlerinden uygulandı. Betik yalnız `/opt/furkantoplu` ve kendi staging/rollback dizinlerini hedefler; `.env`, önceki Compose ve önceki website-content kaynakları root erişimli rollback dizininde tutulur. Veritabanı/medya volume'leri silinmez. Günlük yedekle aynı `flock` kullanılır.
- Değişiklik öncesi günlük yedek `20261010T205349Z` başarıyla tamamlandı. Bu sunucu içi geri dönüş noktasıdır; site sahibinin ayrı yerde şifreli yedek tercihi hâlâ beklemede.
- İlk canlı doğrulamada yeni eklentinin klasörleri `700` izinle oluştuğu için Directus eklentiyi yüklememişti; test bunu yakaladı. Yalnız üç eklenti dizini `755` yapıldı, Directus yeniden başlatıldı ve yükleme listesinde `directus-extension-admin-tfa` görüldü. Dağıtım betiği de bu izin adımını içerecek şekilde düzeltildi. İlk geçici test hesabı temizlendi.
- Tek geçici yöneticiyle canlı native API testi yeniden yapıldı: ilk girişte içerik ve ekip erişimi reddi, kendine ait QR/TOTP etkinleştirme, eski oturumun reddi, kodsuz girişin reddi, kodlu girişte yetkili okuma ve test hesabı temizliği geçti. Test gerçek yönetici anahtarlarını kullanmadı; orijinal hesap/blog kimlikleri aynı kaldı.
- İzole kopya veritabanında eski açık davranış yeniden üretildi, ardından düzeltilmiş akış native API ile geçti. 109 otomatik regresyon testi, TypeScript, ilgili lint, üç dil public smoke, Cloudflare/HTTPS ve anonim API erişim testleri geçti. Bunlar sahibin kendi telefonu ile yapacağı son kullanım kontrolünün yerini almaz.

## İşletim ve sorun giderme

### Login401 ve otomatik askıya alma

Kurulu Directus12.4.0, `auth_login_attempts=5` sınırı aşıldığında ilgili kullanıcıyı `suspended` durumuna geçirir. Bu durumdaki hesaba doğru parola/kod girilse de genel `INVALID_CREDENTIALS`401 döner; mevcut oturumdan içerik istekleri401/403 olabilir. Rol veya TFA kaldırarak çözmeyin. Önce yalnız status/rol/TFA açık boolean ve status değişiklik kaydı denetlenir; gerçek parola/hash/TOTP/token okunmaz. Sınır kaydının yalnız suspended değişimi ve kullanıcı aktörüyle eşleşmesi otomatik kilitlenme kanıtıdır; başlangıçtaki hatanın yanlış parola mı kod mu olduğunu tek başına söylemez.

12 Ekim2026 ikinci yönetici bu şekilde askıya alınmış bulundu. Hesabı yeniden aktif yapmak erişim kontrolü değişikliğidir; otomatik onay incelemesi bu kullanıcı adına açık hesap-statüsü onayı gerektiği için hazırlanan kurtarma komutunu çalıştırmadan reddetti. Onay sonrası yalnız hedef status değiştirilip hedef sessions iptal edilir; parola/rol/Authenticator korunur ve kişi kendi güncel koduyla giriş yapar. Çalışan diğer yöneticiye dokunulmaz. Bu not pending kurtarmadır; hesap açıldı diye yorumlanmaz.

Üretim Compose için her zaman `compose.vps.yaml` ile `compose.vps.https.yaml` birlikte kullanılmalıdır. TFA eklentisi Directus loglarında yüklenmiş olmalı; yalnız dosyanın hostta bulunması yeterli değildir. Eklenti dizinleri container'ın root olmayan kullanıcısınca okunabilir olmalıdır. Yeni yönetici kurulumdan önce içerik görebiliyorsa öncelikle eklenti yükleme listesi, klasör izinleri ve servis sağlığı incelenir. Bu durumda başarılı test yapılana dek güvenlik paketi tamamlanmış sayılmaz.

Rollout betiği tek seferliktir; aynı adla yeniden çalıştırılmaz. Mevcut root erişimli snapshot ve rollback kopyaları korunur. Geri alma veya veritabanı restore işlemi, etkin içerik yazımlarının ve mevcut hesapların durumu görülerek ayrı planlanır; eski imaja gelişigüzel dönmek kurulum zorunluluğunu kaldırabilir. Gizli `.env` veya yedekler Git/Obsidian'a taşınmaz.
