import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const rootDirectory = resolve(import.meta.dirname, "..");
const contents = await readFile(resolve(rootDirectory, ".env"), "utf8");
const environment = {};

for (const rawLine of contents.split(/\r?\n/)) {
  const line = rawLine.trim();
  if (!line || line.startsWith("#")) continue;
  const separator = line.indexOf("=");
  if (separator === -1) continue;
  environment[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
}

const directusUrl = (environment.DIRECTUS_PUBLIC_URL || "http://localhost:8055").replace(/\/$/, "");

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
if (!token) throw new Error("Directus oturum açma yanıtında erişim anahtarı bulunamadı.");

const fields = [
  {
    field: "status",
    type: "string",
    schema: { default_value: "draft", is_nullable: false, max_length: 32 },
    meta: {
      interface: "select-dropdown",
      required: true,
      width: "half",
      sort: 1,
      options: { choices: [
        { text: "Taslak", value: "draft", color: "#A2B5CD" },
        { text: "Yayında", value: "published", color: "#2ECDA7" },
        { text: "Gizli", value: "hidden", color: "#E35169" },
      ] },
      translations: [{ language: "tr-TR", translation: "Yayın durumu" }],
    },
  },
  {
    field: "sort",
    type: "integer",
    schema: { is_nullable: true },
    meta: { interface: "input", width: "half", sort: 2, translations: [{ language: "tr-TR", translation: "Sıralama" }] },
  },
  {
    field: "featured",
    type: "boolean",
    schema: { default_value: false, is_nullable: false },
    meta: { interface: "boolean", width: "half", sort: 3, translations: [{ language: "tr-TR", translation: "Öne çıkan yazı" }] },
  },
  {
    field: "category",
    type: "string",
    schema: { is_nullable: false, max_length: 100 },
    meta: { interface: "input", required: true, width: "half", sort: 4, translations: [{ language: "tr-TR", translation: "Kategori" }] },
  },
  {
    field: "title",
    type: "string",
    schema: { is_nullable: false, max_length: 220 },
    meta: { interface: "input", required: true, width: "full", sort: 5, translations: [{ language: "tr-TR", translation: "Başlık" }] },
  },
  {
    field: "slug",
    type: "string",
    schema: { is_nullable: false, is_unique: true, max_length: 180 },
    meta: { interface: "input", required: true, width: "full", sort: 6, note: "Örnek: masa-basinda-hareket-molalari", translations: [{ language: "tr-TR", translation: "URL adı" }] },
  },
  {
    field: "summary",
    type: "text",
    schema: { is_nullable: false },
    meta: { interface: "input-multiline", required: true, width: "full", sort: 7, translations: [{ language: "tr-TR", translation: "Kart özeti" }] },
  },
  {
    field: "published_at",
    type: "date",
    schema: { is_nullable: true },
    meta: { interface: "datetime", width: "half", sort: 8, translations: [{ language: "tr-TR", translation: "Yayın tarihi" }] },
  },
  {
    field: "reading_minutes",
    type: "integer",
    schema: { default_value: 4, is_nullable: false },
    meta: { interface: "input", width: "half", sort: 9, translations: [{ language: "tr-TR", translation: "Okuma süresi (dakika)" }] },
  },
  {
    field: "cover_path",
    type: "string",
    schema: { is_nullable: true, max_length: 255 },
    meta: { interface: "input", width: "full", sort: 10, note: "Boş bırakılırsa varsayılan fizyoterapi görseli kullanılır.", translations: [{ language: "tr-TR", translation: "Kapak görseli yolu" }] },
  },
  {
    field: "cover_alt",
    type: "string",
    schema: { is_nullable: true, max_length: 255 },
    meta: { interface: "input", width: "full", sort: 11, translations: [{ language: "tr-TR", translation: "Kapak alternatif metni" }] },
  },
  {
    field: "cover_caption",
    type: "string",
    schema: { is_nullable: true, max_length: 255 },
    meta: { interface: "input", width: "full", sort: 12, translations: [{ language: "tr-TR", translation: "Kapak açıklaması" }] },
  },
  {
    field: "lead",
    type: "text",
    schema: { is_nullable: true },
    meta: { interface: "input-multiline", width: "full", sort: 13, translations: [{ language: "tr-TR", translation: "Yazı giriş metni" }] },
  },
  {
    field: "body_paragraphs",
    type: "json",
    schema: { is_nullable: true },
    meta: { interface: "list", width: "full", sort: 14, options: { fields: [{ field: "text", name: "Paragraf", type: "text", meta: { interface: "input-multiline" } }] }, translations: [{ language: "tr-TR", translation: "Ana paragraflar" }] },
  },
  {
    field: "quote",
    type: "text",
    schema: { is_nullable: true },
    meta: { interface: "input-multiline", width: "full", sort: 15, translations: [{ language: "tr-TR", translation: "Vurgulu alıntı" }] },
  },
  {
    field: "tips_title",
    type: "string",
    schema: { is_nullable: true, max_length: 220 },
    meta: { interface: "input", width: "full", sort: 16, translations: [{ language: "tr-TR", translation: "Öneriler başlığı" }] },
  },
  {
    field: "tips",
    type: "json",
    schema: { is_nullable: true },
    meta: { interface: "list", width: "full", sort: 17, options: { fields: [
      { field: "title", name: "Başlık", type: "string", meta: { interface: "input" } },
      { field: "text", name: "Açıklama", type: "text", meta: { interface: "input-multiline" } },
    ] }, translations: [{ language: "tr-TR", translation: "Uygulanabilir adımlar" }] },
  },
  {
    field: "closing_title",
    type: "string",
    schema: { is_nullable: true, max_length: 220 },
    meta: { interface: "input", width: "full", sort: 18, translations: [{ language: "tr-TR", translation: "Kapanış başlığı" }] },
  },
  {
    field: "closing_body",
    type: "text",
    schema: { is_nullable: true },
    meta: { interface: "input-multiline", width: "full", sort: 19, translations: [{ language: "tr-TR", translation: "Kapanış metni" }] },
  },
  {
    field: "seo_title",
    type: "string",
    schema: { is_nullable: true, max_length: 160 },
    meta: { interface: "input", width: "full", sort: 20, translations: [{ language: "tr-TR", translation: "SEO başlığı" }] },
  },
  {
    field: "seo_description",
    type: "text",
    schema: { is_nullable: true },
    meta: { interface: "input-multiline", width: "full", sort: 21, translations: [{ language: "tr-TR", translation: "SEO açıklaması" }] },
  },
];

const collections = await request("/collections", { token });
if (!collections.some((collection) => collection.collection === "blog_posts")) {
  await request("/collections", {
    method: "POST",
    token,
    body: {
      collection: "blog_posts",
      schema: { name: "blog_posts" },
      meta: {
        icon: "article",
        note: "Bilgi Köşesi yazılarını ve yayın durumlarını yönetin.",
        display_template: "{{title}}",
        archive_field: "status",
        archive_value: "hidden",
        unarchive_value: "draft",
        archive_app_filter: true,
        sort_field: "sort",
        translations: [{ language: "tr-TR", translation: "Blog Yazıları" }],
      },
    },
  });
  console.log("blog_posts koleksiyonu oluşturuldu.");
}

const currentFields = await request("/fields/blog_posts", { token });
const currentNames = new Set(currentFields.map((field) => field.field));
for (const definition of fields) {
  if (currentNames.has(definition.field)) continue;
  await request("/fields/blog_posts", { method: "POST", token, body: definition });
  console.log(`${definition.field} alanı oluşturuldu.`);
}

const posts = [
  {
    status: "published",
    sort: 1,
    featured: true,
    category: "Günlük Yaşam",
    title: "Masa başında geçen günlerde hareket molaları neden önemli?",
    slug: "masa-basinda-hareket-molalari",
    summary: "Uzun süre aynı pozisyonda kalmak yerine güne küçük ve sürdürülebilir hareket araları eklemek üzerine kısa bir rehber.",
    published_at: "2026-09-18",
    reading_minutes: 4,
    cover_path: "/hero-physiotherapy-v1.png",
    cover_alt: "Fizyoterapist eşliğinde hareket yapan danışan",
    cover_caption: "Hareketi günün içine küçük adımlarla yerleştirmek",
    lead: "İnsan bedeni gün boyunca aynı pozisyonda kalmak için değil, farklı hareketler arasında geçiş yapmak için tasarlanmıştır.",
    body_paragraphs: [
      { text: "Masa başında çalışırken zamanın nasıl geçtiğini fark etmeden aynı pozisyonda kalabiliriz. Buradaki amaç “kusursuz” bir oturuş bulmak değil; pozisyonu zaman zaman değiştirmek ve gün içine hareket için küçük fırsatlar yerleştirmektir." },
      { text: "Hareket molası uzun bir antrenman anlamına gelmez. Ayağa kalkmak, birkaç adım yürümek veya çalışma pozisyonunu değiştirmek bile günün tekdüzeliğini kıran bir başlangıç olabilir." },
    ],
    quote: "En iyi hareket molası, günlük düzenin içinde sürdürülebilen moladır.",
    tips_title: "Hareket molaları nasıl planlanabilir?",
    tips: [
      { title: "Kısa bir hatırlatıcı belirleyin", text: "Gün içinde belirli aralıklarla ayağa kalkmayı hatırlatan sade bir alarm, hareketi unutmayı azaltabilir." },
      { title: "Küçük başlayın", text: "Uzun bir egzersiz yerine birkaç dakikalık yürüyüş veya pozisyon değişikliği, alışkanlığı sürdürülebilir kılabilir." },
      { title: "Günün akışına bağlayın", text: "Su almak, telefon görüşmesi yapmak veya öğle arasına çıkmak gibi mevcut rutinler hareket için doğal bir işaret olabilir." },
    ],
    closing_title: "Her ihtiyaç birbirinden farklıdır.",
    closing_body: "Hareket sırasında belirgin rahatsızlık, günlük yaşamı etkileyen kısıtlılık veya devam eden bir yakınma varsa genel öneriler yerine kişisel değerlendirme gerekir. Mevcut bir sağlık durumunda hekimin veya ilgili sağlık profesyonelinin yönlendirmesi esas alınmalıdır.",
    seo_title: "Masa Başında Hareket Molaları | Fzt. Furkan Toplu",
    seo_description: "Masa başında geçen günlerde küçük ve sürdürülebilir hareket molaları oluşturmak hakkında genel bilgilendirici yazı.",
  },
  {
    status: "draft",
    sort: 2,
    featured: false,
    category: "Hareket Bilgisi",
    title: "Egzersizde düzeni korumayı kolaylaştıran üç küçük adım",
    slug: "egzersizde-duzeni-korumak",
    summary: "Yoğun günlerde bile hareket alışkanlığını gerçekçi hedeflerle sürdürmeye yardımcı olabilecek temel öneriler.",
    published_at: "2026-09-10",
    reading_minutes: 5,
  },
  {
    status: "draft",
    sort: 3,
    featured: false,
    category: "Süreç Rehberi",
    title: "İlk fizyoterapi görüşmesinde sizi neler bekler?",
    slug: "ilk-fizyoterapi-gorusmesi",
    summary: "İlk değerlendirme öncesinde merak edilenleri ve görüşmenin genel akışını sade bir dille ele alıyoruz.",
    published_at: "2026-09-02",
    reading_minutes: 3,
  },
];

for (const post of posts) {
  const query = new URLSearchParams({ "filter[slug][_eq]": post.slug, limit: "1" });
  const existing = await request(`/items/blog_posts?${query}`, { token });

  if (existing.length > 0) {
    const missing = Object.fromEntries(Object.entries(post).filter(([key]) => {
      const value = existing[0][key];
      return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
    }));
    if (Object.keys(missing).length > 0) {
      await request(`/items/blog_posts/${existing[0].id}`, { method: "PATCH", token, body: missing });
      console.log(`${post.title} kaydındaki eksik alanlar tamamlandı.`);
    }
    continue;
  }

  await request("/items/blog_posts", { method: "POST", token, body: post });
  console.log(`${post.title} başlangıç kaydı oluşturuldu.`);
}

console.log("Directus blog şeması hazır.");
