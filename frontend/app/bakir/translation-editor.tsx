"use client";

import { useEffect, useState, type FormEvent } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { adminLanguageNames, locales, type Locale } from "../lib/i18n";
import { directusRequest } from "./admin-api";
import pageConfig from "../lib/page-content-config.json";
import type { PageKey } from "./page-manager";
import { practiceSlug } from "../lib/practice-slug";
import { readSectionVisibility } from "../lib/section-visibility";
import { sectionForField, VisibilityField, ExtraSectionControls, type SectionScope } from "./section-visibility";

type Collection = "practice_areas" | "blog_posts" | "site_pages";
type Field = { key: string; label: string; columns?: string[] };
const labels: Record<string, string> = {
  title: "Başlık", summary: "Kart açıklaması", category: "Kategori", hero_title: "Ana başlık", hero_accent: "Vurgulu başlık", lead: "Giriş açıklaması", image_alt: "Görsel açıklaması", cover_alt: "Kapak görseli açıklaması", cover_caption: "Kapak alt yazısı",
  overview_title: "Değerlendirme başlığı", overview_accent: "Değerlendirme vurgusu", overview: "Genel bilgilendirme", assessment_points: "Değerlendirme maddeleri", process_steps: "Süreç adımları", faqs: "Sık sorulan sorular",
  body_paragraphs: "Yazı paragrafları", quote: "Vurgulu alıntı", tips_title: "Öneriler başlığı", tips: "Öneriler", closing_title: "Kapanış başlığı", closing_body: "Kapanış metni", seo_title: "SEO başlığı", seo_description: "SEO açıklaması",
  hero_description: "Ana açıklama", story_title: "Yaklaşım başlığı", story_accent: "Yaklaşım vurgusu", story_lead: "Öne çıkan yaklaşım metni", story_paragraphs: "Yaklaşım paragrafları", professional_note: "Mesleki bilgi notu", principles_title: "Çalışma ilkeleri başlığı", principles: "Çalışma ilkeleri",
  intro: "Giriş açıklaması", privacy_note: "Gizlilik uyarısı", address_note: "Adres açıklaması", working_days: "Çalışma günleri", working_hours: "Çalışma saatleri", flow_title: "İletişim süreci başlığı", flow_steps: "İletişim adımları",
};
const arrayFields: Record<string, string[]> = { assessment_points: ["text"], process_steps: ["title", "description"], faqs: ["question", "answer"], body_paragraphs: ["text"], tips: ["title", "text"], story_paragraphs: ["text"], principles: ["title", "text"], flow_steps: ["title", "text"] };
const fieldKeys = {
  practice_areas: "title summary hero_title hero_accent lead image_alt overview_title overview_accent overview assessment_points process_steps faqs",
  blog_posts: "title category summary cover_alt cover_caption lead body_paragraphs quote tips_title tips closing_title closing_body",
  about: "hero_title hero_accent hero_description story_title story_accent story_lead story_paragraphs professional_note principles_title principles",
  contact: "hero_title hero_accent intro privacy_note address_note working_days working_hours flow_title flow_steps",
};
type Translation = { status: "draft" | "published" | "hidden"; slug: string | null; content: Record<string, unknown>; section_visibility?: Record<string, boolean> };

export function LanguageTabs({ language, onChange, disabled = false }: { language: Locale; onChange: (locale: Locale) => void; disabled?: boolean }) {
  return <div className="admin-language-tabs" aria-label="İçerik dili">{locales.map(locale => <button key={locale} type="button" aria-pressed={language === locale} className={language === locale ? "is-active" : ""} disabled={disabled && locale !== "tr"} onClick={() => onChange(locale)}>{adminLanguageNames[locale]}</button>)}</div>;
}

export function TranslationEditor({ collection, parentId, language, pageKey, onVisibilitySaved }: { collection: Collection; parentId: number; language: "en" | "de"; pageKey?: PageKey; onVisibilitySaved?: (value: Record<string, boolean>) => void | Promise<void> }) {
  const configuredPage = pageKey === "home" || pageKey === "areas" || pageKey === "blog" ? pageConfig[pageKey] : null;
  const fields: Field[] = configuredPage ? [...configuredPage.fields.filter(field => !("type" in field && field.type === "image")).map(field => ({ key: field.key, label: field.label })), { key: "seo_title", label: labels.seo_title }, { key: "seo_description", label: labels.seo_description }] : `${fieldKeys[collection === "site_pages" ? pageKey === "contact" ? "contact" : "about" : collection]}${pageKey === "about" ? " image_alt" : ""} seo_title seo_description`.split(" ").map(key => ({ key, label: labels[key], columns: arrayFields[key] }));
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const scope: SectionScope = collection === "site_pages" ? pageKey || "about" : collection;
  const [status, setStatus] = useState<Translation["status"]>("draft");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [message, setMessage] = useState("");
  const endpoint = `/website-content/translations/${collection}/${parentId}/${language}`;
  useEffect(() => {
    const controller = new AbortController();
    directusRequest<{ data: Translation }>(endpoint, { signal: controller.signal }).then(({ data }) => {
      const values: Record<string, string> = {};
      for (const [key, raw] of Object.entries(data.content)) values[key] = Array.isArray(raw) ? raw.map(row => (arrayFields[key] || ["text"]).map(column => row[column] || "").join(" | ")).join("\n") : typeof raw === "string" ? raw : "";
      setDraft(values); setStatus(data.status); setSlug(data.slug || ""); setVisibility(readSectionVisibility(data.section_visibility));
    }).catch(error => { if (!controller.signal.aborted) { setLoadFailed(true); setMessage(error instanceof Error ? error.message : "Çeviri yüklenemedi."); } }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [endpoint]);

  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const content = Object.fromEntries(fields.map(field => [field.key, field.columns ? (draft[field.key] || "").split("\n").filter(line => line.trim()).map(line => { const cells = line.split("|"); return Object.fromEntries(field.columns!.map((column, index) => [column, (index === field.columns!.length - 1 ? cells.slice(index).join("|") : cells[index] || "").trim()])); }) : (draft[field.key] || "").trim()]));
    try {
      const { data } = await directusRequest<{ data: Translation }>(endpoint, { method: "PATCH", body: JSON.stringify({ status, slug: collection === "practice_areas" ? practiceSlug(String(content.title || "")) : slug, content, section_visibility: visibility }) });
      await onVisibilitySaved?.(readSectionVisibility(data.section_visibility));
      setSlug(data.slug || "");
      setMessage(`${adminLanguageNames[language]} çeviri kaydedildi. ${status === "published" ? "Ana kayıt da yayındaysa sitede görünür." : "Ziyaretçilerden gizli tutuluyor."}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Çeviri kaydedilemedi."); }
    finally { setBusy(false); }
  }
  if (loading) return <div className="admin-post-editor admin-translation-loading"><LoaderCircle className="admin-spinner" /> Çeviri yükleniyor…</div>;
  return <form className="admin-post-editor" onSubmit={save}>
    <div className="admin-post-editor__topline"><strong>{adminLanguageNames[language]} çevirisi</strong><select aria-label="Çeviri yayın durumu" value={status} onChange={e => setStatus(e.target.value as Translation["status"])}><option value="draft">Taslak</option><option value="published">Yayında</option><option value="hidden">Gizli</option></select></div>
    <p className="admin-translation-note">Metinler seçili dile aittir. Bölüm görünürlüğü tüm dillerde ortaktır; içerik silinmeden gizlenir. Görsel, sıralama ve iletişim numaraları Türkçe sekmesindeki ortak bilgilerden alınır.</p>
    <div className="admin-editor-grid">
      {collection !== "site_pages" && <label className="admin-field--wide"><span>{collection === "practice_areas" ? "Otomatik URL adı" : "Bu dilde URL adı"}</span><input value={slug} readOnly={collection === "practice_areas"} pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={220} required={status === "published"} onChange={e => setSlug(e.target.value)} placeholder="ornek-baslik" />{collection === "practice_areas" && <small>Bu dildeki başlık değişince URL otomatik güncellenir; eski adres korunarak yönlendirilir.</small>}</label>}
      {fields.map(field => {
        const section = sectionForField(scope, field.key);
        const label = collection === "practice_areas" && field.key === "hero_title" ? "Detay alt başlığı (isteğe bağlı)" : collection === "practice_areas" && field.key === "hero_accent" ? "Alt başlık vurgusu" : field.label;
        const input = <><textarea rows={field.columns ? 5 : ["title", "hero_title", "hero_accent", "seo_title", "category"].includes(field.key) ? 2 : 3} value={draft[field.key] || ""} onChange={e => { setDraft(state => ({ ...state, [field.key]: e.target.value })); if (collection === "practice_areas" && field.key === "title") setSlug(practiceSlug(e.target.value)); }} />{field.columns && <small>{field.columns.length === 1 ? "Her satır ayrı bir metin olur." : field.key === "faqs" ? "Her satır: Soru | Cevap" : "Her satır: Başlık | Açıklama"}</small>}</>;
        return section ? <VisibilityField key={field.key} label={label} section={section.key} className="admin-field--wide" visibility={visibility} onChange={setVisibility} disabled={busy}>{input}</VisibilityField> : <label key={field.key} className="admin-field--wide"><span>{label}</span>{input}</label>;
      })}
      <ExtraSectionControls scope={scope} availableFields={fields.map(field => field.key)} visibility={visibility} onChange={setVisibility} disabled={busy} />
    </div>
    <div className="admin-post-editor__footer"><p role="status">{message || "Çeviri kaydedilene kadar ziyaretçiler tarafından görülmez."}</p><button type="submit" disabled={busy || loadFailed}>{busy ? <LoaderCircle className="admin-spinner" size={18} /> : <Save size={18} />} Çeviriyi kaydet</button></div>
  </form>;
}
