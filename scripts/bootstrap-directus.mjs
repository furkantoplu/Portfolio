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
    field: "intro",
    type: "text",
    schema: { is_nullable: true },
    meta: {
      interface: "input-rich-text-html",
      width: "full",
      sort: 7,
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
      sort: 8,
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
      sort: 9,
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
      sort: 10,
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
      sort: 11,
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
      sort: 12,
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
      sort: 13,
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
  },
  {
    status: "published",
    sort: 2,
    show_on_homepage: true,
    title: "Sporcu Rehabilitasyonu",
    slug: "sporcu-rehabilitasyonu",
    summary: "Spora dönüş sürecini hareket analizi, yük yönetimi ve kişiye özel planlamayla destekleme.",
  },
  {
    status: "published",
    sort: 3,
    show_on_homepage: true,
    title: "Ameliyat Sonrası Süreç",
    slug: "ameliyat-sonrasi-surec",
    summary: "Hekim yönlendirmesi doğrultusunda hareket kapasitesinin yeniden kazanılmasına destek.",
  },
  {
    status: "published",
    sort: 4,
    show_on_homepage: true,
    title: "Duruş ve Hareket Analizi",
    slug: "durus-ve-hareket-analizi",
    summary: "Günlük alışkanlıkların ve hareket örüntülerinin bütüncül olarak değerlendirilmesi.",
  },
];

for (const item of initialItems) {
  const query = new URLSearchParams({ "filter[slug][_eq]": item.slug, limit: "1" });
  const existingItems = await request(`/items/practice_areas?${query}`, { token });

  if (existingItems.length > 0) continue;

  await request("/items/practice_areas", {
    method: "POST",
    token,
    body: item,
  });
  console.log(`${item.title} başlangıç kaydı oluşturuldu.`);
}

console.log("Directus çalışma alanları şeması hazır.");
