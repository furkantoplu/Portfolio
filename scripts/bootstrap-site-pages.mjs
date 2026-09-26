import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const rootDirectory = resolve(import.meta.dirname, "..");
const contents = await readFile(resolve(rootDirectory, ".env"), "utf8");
const environment = {};
for (const rawLine of contents.split(/\r?\n/)) {
  const line = rawLine.trim();
  if (!line || line.startsWith("#")) continue;
  const separator = line.indexOf("=");
  if (separator !== -1) environment[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
}

const directusUrl = (environment.DIRECTUS_PUBLIC_URL || "http://localhost:8055").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${directusUrl}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(`${options.method || "GET"} ${path}: ${response.status} ${payload?.errors?.[0]?.message || response.statusText}`);
  return payload?.data ?? payload;
}

let token = process.env.DIRECTUS_ADMIN_TOKEN;
if (!token) {
  const login = await request("/auth/login", {
    method: "POST",
    body: { email: environment.DIRECTUS_ADMIN_EMAIL, password: environment.DIRECTUS_ADMIN_PASSWORD, otp: process.env.DIRECTUS_ADMIN_OTP || undefined },
  });
  token = login.access_token;
}
if (!token) throw new Error("Directus yönetici erişim anahtarı alınamadı.");

const fields = [
  { field: "page_key", type: "string", schema: { is_nullable: false, is_unique: true, max_length: 40 }, meta: { interface: "input", required: true, readonly: true, width: "half", sort: 1, translations: [{ language: "tr-TR", translation: "Sayfa anahtarı" }] } },
  { field: "content", type: "json", schema: { is_nullable: false }, meta: { interface: "input-code", width: "full", sort: 2, options: { language: "json" }, translations: [{ language: "tr-TR", translation: "Sayfa içeriği" }] } },
  { field: "seo_title", type: "string", schema: { is_nullable: true, max_length: 220 }, meta: { interface: "input", width: "full", sort: 3, translations: [{ language: "tr-TR", translation: "SEO başlığı" }] } },
  { field: "seo_description", type: "text", schema: { is_nullable: true }, meta: { interface: "input-multiline", width: "full", sort: 4, translations: [{ language: "tr-TR", translation: "SEO açıklaması" }] } },
];

const collections = await request("/collections", { token });
if (!collections.some((collection) => collection.collection === "site_pages")) {
  await request("/collections", { method: "POST", token, body: { collection: "site_pages", schema: { name: "site_pages" }, meta: { icon: "web", note: "Hakkımda ve iletişim sayfası içerikleri.", display_template: "{{page_key}}", translations: [{ language: "tr-TR", translation: "Sayfa İçerikleri" }] } } });
}

const currentFields = await request("/fields/site_pages", { token });
const currentNames = new Set(currentFields.map((field) => field.field));
for (const field of fields) {
  if (!currentNames.has(field.field)) await request("/fields/site_pages", { method: "POST", token, body: field });
}

const pages = [
  {
    page_key: "about",
    seo_title: "Hakkımda | Fzt. Furkan Toplu",
    seo_description: "Fizyoterapist Furkan Toplu'nun değerlendirme yaklaşımı, çalışma ilkeleri ve danışan iletişimi hakkında bilgi.",
    content: {
      hero_title: "Hareketi anlamak,",
      hero_accent: "önce insanı dinlemekle başlar.",
      hero_description: "Her bireyin günlük yaşamı, hareket deneyimi ve hedefleri farklıdır. Bu nedenle süreci hazır kalıplarla değil; dinleyerek, değerlendirerek ve anlaşılır bir yol haritası oluşturarak ele alıyorum.",
      story_title: "Bilimsel bilgiyi,",
      story_accent: "günlük yaşama uyarlanabilir hale getirmek.",
      story_lead: "Fizyoterapi sürecinin yalnızca görüşme sırasında yapılanlardan ibaret olmadığına inanıyorum.",
      story_paragraphs: [
        { text: "Değerlendirmede kişinin hareket kapasitesini, günlük alışkanlıklarını, çalışma koşullarını ve kendi hedeflerini birlikte ele alıyorum. Amaç; karmaşık görünen bilgileri sadeleştirmek ve kişinin sürece aktif olarak katılabileceği açık bir çerçeve oluşturmaktır." },
        { text: "Her adımda neyin, neden ele alındığını paylaşmaya; ilerlemeyi düzenli olarak gözden geçirmeye ve gerektiğinde planı yeniden şekillendirmeye önem veriyorum." },
      ],
      professional_note: "Diploma, eğitim ve sertifika bilgileri müşteriden alınacak gerçek içerikle yayın öncesinde bu alana eklenecektir.",
      principles_title: "Sade, şeffaf ve kişiye göre şekillenen bir süreç.",
      principles: [
        { title: "Dinlemek", text: "Süreci kişinin günlük yaşamını, beklentilerini ve ihtiyaçlarını anlayarak başlatmak." },
        { title: "Bütünü görmek", text: "Tek bir bölge yerine hareketi, alışkanlıkları ve çevresel koşulları birlikte değerlendirmek." },
        { title: "Yolu açıklamak", text: "Değerlendirme ve takip adımlarını sade, anlaşılır ve şeffaf biçimde paylaşmak." },
      ],
    },
  },
  {
    page_key: "contact",
    seo_title: "İletişim | Fzt. Furkan Toplu",
    seo_description: "Görüşme süreci, çalışma saatleri ve iletişim kanalları hakkında bilgi alın.",
    content: {
      hero_title: "İlk adımı",
      hero_accent: "sakin ve net atalım.",
      intro: "Görüşme süreci, uygun saatler veya çalışma alanları hakkında genel bilgi almak için size uygun kanalı kullanabilirsiniz.",
      privacy_note: "İlk iletişimde sağlık raporu veya ayrıntılı sağlık verisi göndermeyin.",
      phone_display: "+90 555 123 45 67",
      phone_value: "+905551234567",
      whatsapp_value: "905551234567",
      email: "merhaba@furkantoplu.com",
      address_title: "Kadıköy / İstanbul",
      address_note: "Detaylı adres, görüşme oluşturulduktan sonra paylaşılır.",
      working_days: "Pazartesi — Cumartesi",
      working_hours: "09.00 — 19.00 · Yalnızca randevu ile",
      flow_title: "İletişimden ilk görüşmeye üç sade adım.",
      flow_steps: [
        { title: "Uygun kanaldan ulaşın", text: "İletişim tercihinizi ve genel bilgi talebinizi paylaşın." },
        { title: "Saat ve kapsam netleşsin", text: "Uygun zaman ile ilk görüşmenin genel çerçevesi konuşulsun." },
        { title: "İlk değerlendirme yapılsın", text: "Kişisel ihtiyaçlar ancak görüşme sırasında ayrıntılı biçimde ele alınsın." },
      ],
    },
  },
];

for (const page of pages) {
  const query = new URLSearchParams({ "filter[page_key][_eq]": page.page_key, limit: "1" });
  const existing = await request(`/items/site_pages?${query}`, { token });
  if (existing.length === 0) await request("/items/site_pages", { method: "POST", token, body: page });
}

console.log("Hakkımda ve iletişim sayfası içerikleri hazır.");
