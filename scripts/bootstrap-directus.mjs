import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const rootDirectory = resolve(import.meta.dirname, "..");

async function readEnvironmentFile() {
  const contents = await readFile(resolve(rootDirectory, ".env"), "utf8");
  const values = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator === -1) continue;

    values[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }

  return values;
}

const environment = await readEnvironmentFile();
const directusUrl = (environment.DIRECTUS_PUBLIC_URL || "http://localhost:8055").replace(/\/$/, "");

if (!environment.DIRECTUS_ADMIN_EMAIL || !environment.DIRECTUS_ADMIN_PASSWORD) {
  throw new Error("DIRECTUS_ADMIN_EMAIL ve DIRECTUS_ADMIN_PASSWORD .env içinde tanımlı olmalı.");
}

async function request(path, options = {}) {
  const response = await fetch(`${directusUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.errors?.map((error) => error.message).join("; ") || response.statusText;
    const error = new Error(`${options.method || "GET"} ${path}: ${response.status} ${message}`);
    error.status = response.status;
    throw error;
  }

  return payload?.data ?? payload;
}

const login = await request("/auth/login", {
  method: "POST",
  body: {
    email: environment.DIRECTUS_ADMIN_EMAIL,
    password: environment.DIRECTUS_ADMIN_PASSWORD,
  },
});
const token = login.access_token;

if (!token) {
  throw new Error("Directus oturum açma yanıtında erişim anahtarı bulunamadı.");
}

const fieldDefinitions = [
  {
    field: "status",
    type: "string",
    schema: { default_value: "draft", is_nullable: false, max_length: 32 },
    meta: {
      interface: "select-dropdown",
      width: "half",
      required: true,
      sort: 1,
      options: {
        choices: [
          { text: "Taslak", value: "draft", color: "#A2B5CD" },
          { text: "Yayında", value: "published", color: "#2ECDA7" },
          { text: "Gizli", value: "hidden", color: "#E35169" },
        ],
      },
      translations: [{ language: "tr-TR", translation: "Yayın durumu" }],
    },
  },
  {
    field: "sort",
    type: "integer",
    schema: { is_nullable: true },
    meta: {
      interface: "input",
      width: "half",
      sort: 2,
      translations: [{ language: "tr-TR", translation: "Sıralama" }],
    },
  },
  {
    field: "show_on_homepage",
    type: "boolean",
    schema: { default_value: false, is_nullable: false },
    meta: {
      interface: "boolean",
      width: "half",
      sort: 3,
      translations: [{ language: "tr-TR", translation: "Ana sayfada göster" }],
      note: "Yalnızca yayınlanmış alanlarda etkili olur.",
    },
  },
  {
    field: "title",
    type: "string",
    schema: { is_nullable: false, max_length: 160 },
    meta: {
      interface: "input",
      width: "full",
      required: true,
      sort: 4,
      translations: [{ language: "tr-TR", translation: "Başlık" }],
    },
  },
  {
    field: "slug",
    type: "string",
    schema: { is_nullable: false, is_unique: true, max_length: 160 },
    meta: {
      interface: "input",
      width: "full",
      required: true,
      sort: 5,
      translations: [{ language: "tr-TR", translation: "URL adı" }],
      note: "Örnek: bel-ve-boyun-sagligi. Yayına aldıktan sonra mümkünse değiştirmeyin.",
    },
  },
  {
    field: "summary",
    type: "text",
    schema: { is_nullable: false },
    meta: {
      interface: "input-multiline",
      width: "full",
      required: true,
      sort: 6,
      translations: [{ language: "tr-TR", translation: "Kart açıklaması" }],
    },
  },
  {
    field: "hero_title",
    type: "string",
    schema: { is_nullable: true, max_length: 200 },
    meta: {
      interface: "input",
      width: "full",
      sort: 7,
      translations: [{ language: "tr-TR", translation: "Detay başlığı" }],
    },
  },
  {
    field: "hero_accent",
    type: "string",
    schema: { is_nullable: true, max_length: 200 },
    meta: {
      interface: "input",
      width: "full",
      sort: 8,
      translations: [{ language: "tr-TR", translation: "Vurgulu başlık" }],
    },
  },
  {
    field: "lead",
    type: "text",
    schema: { is_nullable: true },
    meta: {
      interface: "input-multiline",
      width: "full",
      sort: 9,
      translations: [{ language: "tr-TR", translation: "Detay giriş açıklaması" }],
    },
  },
  {
    field: "image_path",
    type: "string",
    schema: { is_nullable: true, max_length: 255 },
    meta: {
      interface: "input",
      width: "full",
      sort: 10,
      note: "Boş bırakılırsa varsayılan fizyoterapi görseli kullanılır.",
      translations: [{ language: "tr-TR", translation: "Görsel yolu" }],
    },
  },
  {
    field: "image_alt",
    type: "string",
    schema: { is_nullable: true, max_length: 255 },
    meta: {
      interface: "input",
      width: "full",
      sort: 11,
      translations: [{ language: "tr-TR", translation: "Görsel alternatif metni" }],
    },
  },
  {
    field: "overview_title",
    type: "string",
    schema: { is_nullable: true, max_length: 200 },
    meta: {
      interface: "input",
      width: "full",
      sort: 12,
      translations: [{ language: "tr-TR", translation: "Değerlendirme başlığı" }],
    },
  },
  {
    field: "overview_accent",
    type: "string",
    schema: { is_nullable: true, max_length: 200 },
    meta: {
      interface: "input",
      width: "full",
      sort: 13,
      translations: [{ language: "tr-TR", translation: "Vurgulu değerlendirme başlığı" }],
    },
  },
  {
    field: "intro",
    type: "text",
    schema: { is_nullable: true },
    meta: {
      interface: "input-rich-text-html",
      width: "full",
      sort: 14,
      translations: [{ language: "tr-TR", translation: "Giriş metni" }],
    },
  },
  {
    field: "overview",
    type: "text",
    schema: { is_nullable: true },
    meta: {
      interface: "input-rich-text-html",
      width: "full",
      sort: 15,
      translations: [{ language: "tr-TR", translation: "Detaylı açıklama" }],
    },
  },
  {
    field: "assessment_points",
    type: "json",
    schema: { is_nullable: true },
    meta: {
      interface: "list",
      width: "full",
      sort: 16,
      options: { fields: [{ field: "text", name: "Madde", type: "string", meta: { interface: "input" } }] },
      translations: [{ language: "tr-TR", translation: "Değerlendirme başlıkları" }],
    },
  },
  {
    field: "process_steps",
    type: "json",
    schema: { is_nullable: true },
    meta: {
      interface: "list",
      width: "full",
      sort: 17,
      options: {
        fields: [
          { field: "title", name: "Başlık", type: "string", meta: { interface: "input" } },
          { field: "description", name: "Açıklama", type: "text", meta: { interface: "input-multiline" } },
        ],
      },
      translations: [{ language: "tr-TR", translation: "Süreç adımları" }],
    },
  },
  {
    field: "faqs",
    type: "json",
    schema: { is_nullable: true },
    meta: {
      interface: "list",
      width: "full",
      sort: 18,
      options: {
        fields: [
          { field: "question", name: "Soru", type: "string", meta: { interface: "input" } },
          { field: "answer", name: "Cevap", type: "text", meta: { interface: "input-multiline" } },
        ],
      },
      translations: [{ language: "tr-TR", translation: "Sık sorulan sorular" }],
    },
  },
  {
    field: "seo_title",
    type: "string",
    schema: { is_nullable: true, max_length: 160 },
    meta: {
      interface: "input",
      width: "full",
      sort: 19,
      translations: [{ language: "tr-TR", translation: "SEO başlığı" }],
    },
  },
  {
    field: "seo_description",
    type: "text",
    schema: { is_nullable: true },
    meta: {
      interface: "input-multiline",
      width: "full",
      sort: 20,
      translations: [{ language: "tr-TR", translation: "SEO açıklaması" }],
    },
  },
];

const collections = await request("/collections", { token });

if (collections.some((collection) => collection.collection === "practice_areas")) {
  console.log("practice_areas koleksiyonu zaten mevcut.");
} else {
  await request("/collections", {
    method: "POST",
    token,
    body: {
      collection: "practice_areas",
      schema: { name: "practice_areas" },
      meta: {
        icon: "medical_services",
        note: "Sitedeki çalışma alanlarını, sıralamayı ve görünürlüğü yönetin.",
        display_template: "{{title}}",
        archive_field: "status",
        archive_value: "hidden",
        unarchive_value: "draft",
        archive_app_filter: true,
        sort_field: "sort",
        translations: [{ language: "tr-TR", translation: "Çalışma Alanları" }],
      },
    },
  });
  console.log("practice_areas koleksiyonu oluşturuldu.");
}

const currentFields = await request("/fields/practice_areas", { token });
const currentFieldNames = new Set(currentFields.map((field) => field.field));

for (const definition of fieldDefinitions) {
  if (currentFieldNames.has(definition.field)) continue;

  await request("/fields/practice_areas", {
    method: "POST",
    token,
    body: definition,
  });
  console.log(`${definition.field} alanı oluşturuldu.`);
}

const initialItems = [
  {
    status: "published",
    sort: 1,
    show_on_homepage: true,
    title: "Bel ve Boyun Sağlığı",
    slug: "bel-ve-boyun-sagligi",
    summary: "Günlük yaşamı etkileyen hareket kısıtlılıklarına yönelik değerlendirme odaklı yaklaşım.",
    hero_title: "Bel ve boyun sağlığına",
    hero_accent: "hareket odaklı yaklaşım.",
    lead: "Günlük yaşamı etkileyen hareket kısıtlılıklarını anlamak, ihtiyaca uygun bir yol haritası oluşturmak ve süreci düzenli olarak izlemek için değerlendirme odaklı bir yaklaşım.",
    image_path: "/hero-physiotherapy-v1.png",
    image_alt: "Fizyoterapist eşliğinde kontrollü omuz hareketi yapan danışan",
    overview_title: "Süreci yalnızca bir bölgeye değil,",
    overview_accent: "günlük harekete bakarak anlamak.",
    overview: "Bel ve boyun bölgesindeki hareket ihtiyacı; çalışma düzeni, günlük alışkanlıklar, aktivite seviyesi ve kişinin hedefleriyle birlikte ele alınır. İlk adım, mevcut durumu açık ve anlaşılır şekilde değerlendirmektir.",
    assessment_points: [
      { text: "Uzun süre masa başında kalmaya bağlı hareket ihtiyacı" },
      { text: "Günlük hareketlerde zorlanma veya kısıtlılık hissi" },
      { text: "Hekim yönlendirmesi sonrasında planlanan fizyoterapi süreci" },
      { text: "Duruş ve günlük alışkanlıkların hareket üzerindeki etkileri" },
    ],
    process_steps: [
      { title: "İhtiyacı dinleme", description: "Günlük yaşamınız, hareket alışkanlıklarınız ve beklentileriniz birlikte ele alınır." },
      { title: "Hareket değerlendirmesi", description: "Hareket kapasitesi ve süreci etkileyebilecek temel noktalar değerlendirilir." },
      { title: "Kişisel yol haritası", description: "Değerlendirme sonucuna göre anlaşılır, takip edilebilir bir çalışma planı oluşturulur." },
    ],
    faqs: [
      { question: "İlk görüşme ne kadar sürer?", answer: "İlk görüşme değerlendirme kapsamına göre değişebilir. Randevu oluşturulurken tahmini süre hakkında bilgi verilir." },
      { question: "Tetkiklerimi yanımda getirmeli miyim?", answer: "Varsa hekim değerlendirmeleri ve ilgili tetkikler süreci anlamaya yardımcı olabilir. Size ait belgeleri paylaşmadan önce kapsam hakkında bilgi alabilirsiniz." },
      { question: "Egzersiz planı herkeste aynı mı olur?", answer: "Hayır. Plan; değerlendirme bulguları, günlük yaşam, ihtiyaçlar ve hedefler birlikte ele alınarak kişiye göre şekillendirilir." },
    ],
    seo_title: "Bel ve Boyun Sağlığı | Fzt. Furkan Toplu",
    seo_description: "Bel ve boyun hareketlerini etkileyen durumlara yönelik değerlendirme ve fizyoterapi yaklaşımı hakkında genel bilgi.",
  },
  {
    status: "published",
    sort: 2,
    show_on_homepage: true,
    title: "Sporcu Rehabilitasyonu",
    slug: "sporcu-rehabilitasyonu",
    summary: "Spora dönüş sürecini hareket analizi, yük yönetimi ve kişiye özel planlamayla destekleme.",
    hero_title: "Spora dönüşte",
    hero_accent: "planlı ve ölçülü ilerleme.",
    lead: "Hareket kapasitesini, sporun gerekliliklerini ve kişisel hedefleri birlikte değerlendirerek spora dönüş sürecini anlaşılır adımlarla planlayan bir yaklaşım.",
    image_path: "/hero-physiotherapy-v1.png",
    image_alt: "Fizyoterapist eşliğinde kontrollü hareket çalışması yapan danışan",
    overview_title: "Yalnızca bugünkü hareketi değil,",
    overview_accent: "sporun gerektirdiği yükü de değerlendirmek.",
    overview: "Sporcu rehabilitasyonu; yapılan sporun özellikleri, mevcut hareket kapasitesi, antrenman düzeni ve spora dönüş hedefleri birlikte düşünülerek planlanır. Süreç, kademeli yüklenme ve düzenli yeniden değerlendirme üzerine kurulur.",
    assessment_points: [
      { text: "Spor dalına özgü hareket ve yük gereksinimleri" },
      { text: "Mevcut kuvvet, hareketlilik ve kontrol kapasitesi" },
      { text: "Antrenman düzeni ile günlük yaşamın birlikte planlanması" },
      { text: "Hekim yönlendirmesi sonrasında spora dönüş basamakları" },
    ],
    process_steps: [
      { title: "Hedefi ve sporu tanıma", description: "Spor geçmişiniz, güncel antrenman düzeniniz ve geri dönmek istediğiniz seviye birlikte ele alınır." },
      { title: "Kapasiteyi değerlendirme", description: "İhtiyaca göre hareket, kuvvet, denge ve kontrol başlıklarında mevcut durum değerlendirilir." },
      { title: "Kademeli dönüş planı", description: "Yüklenme basamakları izlenir, geri bildirimlere göre plan düzenli olarak yeniden şekillendirilir." },
    ],
    faqs: [
      { question: "Spora dönüş için kesin bir süre verilebilir mi?", answer: "Süre; değerlendirme bulgularına, sporun gerekliliklerine ve sürecin ilerleyişine göre değişir. İlk görüşmede kişisel durum için genel bir yol haritası konuşulur." },
      { question: "Antrenman programımı getirmeli miyim?", answer: "Mevcut antrenman planı, yarışma takvimi veya hekim yönlendirmesi varsa sürecin bütüncül değerlendirilmesine yardımcı olabilir." },
      { question: "Sadece profesyonel sporcularla mı çalışılır?", answer: "Hayır. Rekreasyonel olarak spor yapan kişilerde de hedefler ve aktivite düzeyi değerlendirilerek kişiye uygun bir süreç planlanabilir." },
    ],
    seo_title: "Sporcu Rehabilitasyonu | Fzt. Furkan Toplu",
    seo_description: "Spora dönüş sürecinde hareket kapasitesi, yük yönetimi ve kişisel hedeflere yönelik fizyoterapi yaklaşımı hakkında genel bilgi.",
  },
  {
    status: "published",
    sort: 3,
    show_on_homepage: true,
    title: "Ameliyat Sonrası Süreç",
    slug: "ameliyat-sonrasi-surec",
    summary: "Hekim yönlendirmesi doğrultusunda hareket kapasitesinin yeniden kazanılmasına destek.",
    hero_title: "Ameliyat sonrasında",
    hero_accent: "adım adım güvenli ilerleme.",
    lead: "Hekim yönlendirmesi, günlük yaşam ihtiyaçları ve mevcut hareket kapasitesi doğrultusunda süreci anlaşılır, ölçülü ve takip edilebilir basamaklara ayıran bir yaklaşım.",
    image_path: "/about-physiotherapist-v1.png",
    image_alt: "Klinik ortamında süreci değerlendiren fizyoterapist",
    overview_title: "Her aşamayı kendi koşulları içinde,",
    overview_accent: "bütün sürecin bir parçası olarak ele almak.",
    overview: "Ameliyat sonrası fizyoterapi planı; cerrahi ekibin yönlendirmeleri, operasyonun niteliği, kişinin günlük yaşamı ve değerlendirme bulguları birlikte dikkate alınarak şekillendirilir. Sürecin her basamağı düzenli olarak yeniden değerlendirilir.",
    assessment_points: [
      { text: "Hekim ve cerrahi ekip tarafından belirtilen sınırlar" },
      { text: "Günlük yaşamda ihtiyaç duyulan temel hareketler" },
      { text: "Hareketlilik, kuvvet ve kontrol kapasitesindeki değişim" },
      { text: "Ev programının anlaşılır ve sürdürülebilir biçimde planlanması" },
    ],
    process_steps: [
      { title: "Yönlendirmeyi anlama", description: "Hekim önerileri, operasyonla ilgili bilgiler ve günlük yaşam ihtiyaçları birlikte değerlendirilir." },
      { title: "Mevcut durumu değerlendirme", description: "Uygun sınırlar içinde hareket kapasitesi ve süreci etkileyen temel gereksinimler ele alınır." },
      { title: "Basamaklı ilerleme", description: "Plan, geri bildirimler ve yeniden değerlendirme sonuçları doğrultusunda kademeli olarak güncellenir." },
    ],
    faqs: [
      { question: "Fizyoterapiye ne zaman başlanır?", answer: "Başlangıç zamanı operasyonun türüne ve hekimin yönlendirmesine göre değişir. Kişisel durum için cerrahi ekibin önerisi esas alınır." },
      { question: "Hangi belgeleri getirmeliyim?", answer: "Varsa ameliyat raporu, hekim önerileri ve ilgili tetkikler sürecin sınırlarını anlamaya yardımcı olabilir." },
      { question: "Süreç boyunca plan değişir mi?", answer: "Evet. Hareket kapasitesi ve ihtiyaçlar yeniden değerlendirildikçe plan uygun sınırlar içinde güncellenebilir." },
    ],
    seo_title: "Ameliyat Sonrası Süreç | Fzt. Furkan Toplu",
    seo_description: "Hekim yönlendirmesi sonrasında hareket kapasitesinin yeniden kazanılmasına yönelik fizyoterapi süreci hakkında genel bilgi.",
  },
  {
    status: "published",
    sort: 4,
    show_on_homepage: true,
    title: "Duruş ve Hareket Analizi",
    slug: "durus-ve-hareket-analizi",
    summary: "Günlük alışkanlıkların ve hareket örüntülerinin bütüncül olarak değerlendirilmesi.",
    hero_title: "Duruşu tek bir poz değil,",
    hero_accent: "değişen bir hareket bütünü olarak görmek.",
    lead: "Çalışma düzenini, günlük alışkanlıkları ve farklı hareketleri birlikte inceleyerek kişiye uygun, uygulanabilir farkındalık ve hareket önerileri oluşturmayı amaçlayan bir değerlendirme.",
    image_path: "/hero-physiotherapy-v1.png",
    image_alt: "Fizyoterapist eşliğinde hareket değerlendirmesi yapan danışan",
    overview_title: "İdeal bir pozisyon aramak yerine,",
    overview_accent: "hareket çeşitliliğini ve günlük bağlamı anlamak.",
    overview: "Duruş ve hareket analizi yalnızca ayakta veya otururken çekilen tek bir görüntüye dayanmaz. Çalışma ortamı, günlük tekrarlar, aktivite düzeyi ve kişinin hareket sırasında verdiği geri bildirimler birlikte ele alınır.",
    assessment_points: [
      { text: "Masa başı ve günlük çalışma düzeninin hareket üzerindeki etkisi" },
      { text: "Tekrarlanan hareketler ve uzun süre korunan pozisyonlar" },
      { text: "Farklı yönlerde hareketlilik ve kontrol kapasitesi" },
      { text: "Gün içine eklenebilecek gerçekçi hareket çeşitliliği" },
    ],
    process_steps: [
      { title: "Günlük düzeni dinleme", description: "Çalışma koşulları, hareket alışkanlıkları ve zorlanma hissedilen durumlar birlikte konuşulur." },
      { title: "Hareketi gözlemleme", description: "İhtiyaca göre farklı pozisyonlar ve işlevsel hareketler bütüncül biçimde değerlendirilir." },
      { title: "Uygulanabilir öneriler", description: "Günlük yaşamla uyumlu hareket seçenekleri ve takip edilebilir küçük düzenlemeler planlanır." },
    ],
    faqs: [
      { question: "Tek bir doğru duruş var mı?", answer: "Duruş sabit bir doğru veya yanlış pozdan ibaret değildir. Hareket çeşitliliği, kişinin ihtiyaçları ve pozisyonda kalma süresi birlikte değerlendirilir." },
      { question: "Çalışma masamın fotoğrafını getirebilir miyim?", answer: "Çalışma ortamını gösteren bir fotoğraf, günlük düzeni anlamaya yardımcı olabilir; ancak kişisel değerlendirmenin yerini tek başına tutmaz." },
      { question: "Değerlendirme yalnızca masa başı çalışanlar için mi?", answer: "Hayır. Günlük yaşamında veya mesleğinde tekrarlayan hareketleri bulunan farklı kişiler için de ihtiyaçlara göre değerlendirme yapılabilir." },
    ],
    seo_title: "Duruş ve Hareket Analizi | Fzt. Furkan Toplu",
    seo_description: "Günlük alışkanlıkların, çalışma düzeninin ve hareket örüntülerinin bütüncül değerlendirilmesi hakkında genel bilgi.",
  },
];

for (const item of initialItems) {
  const query = new URLSearchParams({ "filter[slug][_eq]": item.slug, limit: "1" });
  const existingItems = await request(`/items/practice_areas?${query}`, { token });

  if (existingItems.length > 0) {
    const existingItem = existingItems[0];
    const missingValues = Object.fromEntries(
      Object.entries(item).filter(([key]) => {
        const value = existingItem[key];
        return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
      }),
    );

    if (Object.keys(missingValues).length > 0) {
      await request(`/items/practice_areas/${existingItem.id}`, {
        method: "PATCH",
        token,
        body: missingValues,
      });
      console.log(`${item.title} kaydındaki eksik detaylar tamamlandı.`);
    }

    continue;
  }

  await request("/items/practice_areas", {
    method: "POST",
    token,
    body: item,
  });
  console.log(`${item.title} başlangıç kaydı oluşturuldu.`);
}

console.log("Directus çalışma alanları şeması hazır.");
