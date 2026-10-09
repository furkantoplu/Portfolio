"use client";

import { FormEvent, useRef, useState } from "react";
import { ArrowUpRight, Check, EyeOff, FilePlus2, Home, LoaderCircle, PencilLine, Save, Stethoscope } from "lucide-react";
import { directusRequest, type ContentItem } from "./admin-api";
import { NativeLink } from "../components/native-link";
import { LanguageTabs, TranslationEditor } from "./translation-editor";
import type { Locale } from "../lib/i18n";
import { ImageField } from "./image-field";
import { VisibilityField, VisibilitySwitch, ExtraSectionControls } from "./section-visibility";
import { practiceSlug } from "../lib/practice-slug";
import { ContentDeleteControl } from "./content-delete-control";

export type ManagedPracticeArea = ContentItem & {
  section_visibility?: Record<string, boolean>;
  id: number;
  sort: number | null;
  show_on_homepage: boolean;
  title: string;
  slug: string;
  summary: string;
  image_path: string | null;
  image_alt: string | null;
  hero_title: string | null;
  hero_accent: string | null;
  lead: string | null;
  overview_title: string | null;
  overview_accent: string | null;
  overview: string | null;
  assessment_points: Array<{ text: string }> | null;
  process_steps: Array<{ title: string; description: string }> | null;
  faqs: Array<{ question: string; answer: string }> | null;
  seo_title: string | null;
  seo_description: string | null;
};

type PracticeDraft = {
  section_visibility: Record<string, boolean>;
  image_path: string;
  image_alt: string;
  status: ContentItem["status"];
  sort: string;
  show_on_homepage: boolean;
  title: string;
  slug: string;
  summary: string;
  hero_title: string;
  hero_accent: string;
  lead: string;
  overview_title: string;
  overview_accent: string;
  overview: string;
  assessment_points: string;
  process_steps: string;
  faqs: string;
  seo_title: string;
  seo_description: string;
};

const emptyDraft: PracticeDraft = {
  section_visibility: {},
  image_path: "", image_alt: "",
  status: "draft",
  sort: "",
  show_on_homepage: false,
  title: "",
  slug: "",
  summary: "",
  hero_title: "",
  hero_accent: "",
  lead: "",
  overview_title: "Değerlendirme",
  overview_accent: "ve yaklaşım",
  overview: "",
  assessment_points: "",
  process_steps: "",
  faqs: "",
  seo_title: "",
  seo_description: "",
};

const statusLabels: Record<ContentItem["status"], string> = {
  draft: "Taslak",
  published: "Yayında",
  hidden: "Gizli",
};

function parsePairs(value: string, first: string, second: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const separator = line.indexOf("|");
    return separator === -1
      ? { [first]: line, [second]: "" }
      : { [first]: line.slice(0, separator).trim(), [second]: line.slice(separator + 1).trim() };
  });
}

function areaToDraft(area: ManagedPracticeArea): PracticeDraft {
  return {
    section_visibility: area.section_visibility || {},
    image_path: area.image_path ?? "", image_alt: area.image_alt ?? "",
    status: area.status,
    sort: area.sort == null ? "" : String(area.sort),
    show_on_homepage: area.show_on_homepage,
    title: area.title,
    slug: area.slug,
    summary: area.summary,
    hero_title: area.hero_title ?? "",
    hero_accent: area.hero_accent ?? "",
    lead: area.lead ?? "",
    overview_title: area.overview_title ?? "",
    overview_accent: area.overview_accent ?? "",
    overview: area.overview ?? "",
    assessment_points: area.assessment_points?.map((point) => point.text).join("\n") ?? "",
    process_steps: area.process_steps?.map((step) => `${step.title} | ${step.description}`).join("\n") ?? "",
    faqs: area.faqs?.map((faq) => `${faq.question} | ${faq.answer}`).join("\n") ?? "",
    seo_title: area.seo_title ?? "",
    seo_description: area.seo_description ?? "",
  };
}

export function PracticeManager({ areas, onChanged }: { areas: ManagedPracticeArea[]; onChanged: () => Promise<void> }) {
  const [language, setLanguage] = useState<Locale>("tr");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedIdRef = useRef<number | null>(null);
  const [draft, setDraft] = useState<PracticeDraft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [translationBusy, setTranslationBusy] = useState(false);
  const locked = busy || translationBusy;
  const [message, setMessage] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  async function areaDeleted(id: number) {
    setDeletedIds(current => [...current, id]);
    if (selectedIdRef.current === id) startNew();
    try { await onChanged(); setMessage("Çalışma alanı ve tüm dil çevirileri kalıcı silindi."); }
    catch { setMessage("Çalışma alanı silindi; liste yenilenemedi. Bağlantı düzeldiğinde paneli yenileyin."); }
  }

  function update<K extends keyof PracticeDraft>(field: K, value: PracticeDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function startNew() {
    selectedIdRef.current = null;
    setLanguage("tr");
    setSelectedId(null);
    setDraft({ ...emptyDraft, sort: String((areas.at(-1)?.sort ?? areas.length) + 1) });
    setMessage(null);
  }

  function editArea(area: ManagedPracticeArea) {
    selectedIdRef.current = area.id;
    setSelectedId(area.id);
    setDraft(areaToDraft(area));
    setMessage(null);
  }

  async function saveArea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    const assessmentPoints = draft.assessment_points.split("\n").map((text) => text.trim()).filter(Boolean).map((text) => ({ text }));
    const processSteps = parsePairs(draft.process_steps, "title", "description");
    const faqs = parsePairs(draft.faqs, "question", "answer");
    const payload = {
      section_visibility: draft.section_visibility,
      image_path: draft.image_path || null, image_alt: draft.image_alt.trim() || null,
      status: draft.status,
      sort: draft.sort ? Number.parseInt(draft.sort, 10) : null,
      show_on_homepage: draft.show_on_homepage,
      title: draft.title.trim(),
      slug: practiceSlug(draft.title),
      summary: draft.summary.trim(),
      hero_title: draft.hero_title.trim() || null,
      hero_accent: draft.hero_accent.trim() || null,
      lead: draft.lead.trim() || null,
      overview_title: draft.overview_title.trim() || null,
      overview_accent: draft.overview_accent.trim() || null,
      overview: draft.overview.trim() || null,
      assessment_points: assessmentPoints.length ? assessmentPoints : null,
      process_steps: processSteps.length ? processSteps : null,
      faqs: faqs.length ? faqs : null,
      seo_title: draft.seo_title.trim() || null,
      seo_description: draft.seo_description.trim() || null,
    };

    try {
      const result = await directusRequest<{ data: ManagedPracticeArea }>(selectedId ? `/items/practice_areas/${selectedId}` : "/items/practice_areas", {
        method: selectedId ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      selectedIdRef.current = result.data.id;
      setSelectedId(result.data.id);
      setDraft(areaToDraft(result.data));
      await onChanged();
      setMessage(draft.status === "published" ? "Çalışma alanı kaydedildi ve sitede yayınlandı." : "Çalışma alanı güvenle kaydedildi.");
    } catch (error) {
      const code = error instanceof Error ? error.name : "";
      setMessage(code === "RECORD_NOT_UNIQUE" ? "Bu URL adı başka bir çalışma alanında kullanılıyor." : "Çalışma alanı kaydedilemedi. Zorunlu alanları kontrol edin.");
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(area: ManagedPracticeArea, status: ContentItem["status"]) {
    setBusy(true);
    setMessage(null);
    try {
      await directusRequest(`/items/practice_areas/${area.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      if (selectedId === area.id) update("status", status);
      await onChanged();
      setMessage(status === "published" ? "Çalışma alanı yayınlandı." : "Çalışma alanı ziyaretçilerden gizlendi.");
    } catch {
      setMessage("Yayın durumu değiştirilemedi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-content-manager" aria-labelledby="practice-manager-title">
      <div className="admin-content-manager__heading">
        <div>
          <p className="admin-eyebrow"><Stethoscope size={17} /> Çalışma alanları</p>
          <h2 id="practice-manager-title">Alanları düzenleyin,<br /><em>görünürlüğü yönetin.</em></h2>
        </div>
        <button type="button" onClick={startNew} disabled={locked}><FilePlus2 size={18} /> Yeni alan</button>
      </div>

      <div className="admin-content-manager__layout">
        <div className="admin-post-list" aria-label="Çalışma alanları">
          {areas.filter(area => !deletedIds.includes(area.id)).map((area) => (
            <article className={selectedId === area.id ? "is-selected" : ""} key={area.id}>
              <button className="admin-post-list__main" type="button" onClick={() => editArea(area)} disabled={locked}>
                <span className={`admin-status admin-status--${area.status}`}>{statusLabels[area.status]}</span>
                <strong>{area.title}</strong>
                <small>{area.show_on_homepage ? "Ana sayfada gösteriliyor" : "Yalnızca alanlar sayfası"}</small>
              </button>
              <div className="admin-post-list__actions">
                <button type="button" onClick={() => editArea(area)} title="Düzenle" disabled={locked}><PencilLine size={16} /></button>
                {area.status === "published" ? (
                  <button type="button" onClick={() => changeStatus(area, "hidden")} title="Gizle" disabled={locked}><EyeOff size={16} /></button>
                ) : (
                  <button type="button" onClick={() => changeStatus(area, "published")} title="Yayınla" disabled={locked}><Check size={16} /></button>
                )}
                {area.status === "published" && <NativeLink href={`/calisma-alanlari/${area.slug}`} target="_blank" title="Sitede aç"><ArrowUpRight size={16} /></NativeLink>}
                <ContentDeleteControl collection="practice_areas" id={area.id} title={area.title} disabled={locked} onBusyChange={setBusy} onDeleted={areaDeleted} />
              </div>
            </article>
          ))}
        </div>

        <div>
        <LanguageTabs language={language} onChange={setLanguage} disabled={!selectedId || locked} />
        {language !== "tr" && selectedId ? <TranslationEditor key={`${selectedId}-${language}`} collection="practice_areas" parentId={selectedId} language={language} onBusyChange={setTranslationBusy} onVisibilitySaved={async value => { if (selectedIdRef.current === selectedId) update("section_visibility", value); await onChanged(); }} /> : <form className="admin-post-editor" onSubmit={saveArea}>
          <div className="admin-post-editor__topline">
            <div><PencilLine size={18} /><strong>{selectedId ? "Alanı düzenle" : "Yeni çalışma alanı"}</strong></div>
            <select value={draft.status} onChange={(event) => update("status", event.target.value as ContentItem["status"])} aria-label="Yayın durumu">
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
              <option value="hidden">Gizli</option>
            </select>
          </div>

          <p className="admin-visibility-note">Görünürlük tüm dillerde ortaktır. Gizlemek içerikleri silmez; Kaydet ile uygulanır.</p>
          <div className="admin-editor-grid">
            <ImageField key={`practice-image-${selectedId ?? "new"}`} label="Çalışma alanı görseli" value={draft.image_path} onChange={path => update("image_path", path)} disabled={busy}  visibilityControl={<VisibilitySwitch section="image" label="Çalışma alanı görseli" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy} />} />
            <label className="admin-field--wide"><span>Görsel açıklaması</span><input value={draft.image_alt} onChange={e => update("image_alt", e.target.value)} /></label>
            <label className="admin-field--wide"><span>Çalışma alanı adı / sayfa başlığı</span><input value={draft.title} maxLength={220} onChange={event => { const title = event.target.value; setDraft(current => ({ ...current, title, slug: practiceSlug(title) })); }} required /><small>Kart ve detay sayfasının ana başlığı bu addır.</small></label>
            <label><span>Otomatik URL adı</span><input value={draft.slug || practiceSlug(draft.title)} readOnly /><small>Alan adı değişince adres otomatik güncellenir. Aynı ad kullanılıyorsa kayıtta benzersiz bir ek oluşturulur. Eski adres yeni sayfaya yönlenir.</small></label>
            <label><span>Sıralama</span><input type="number" min="1" value={draft.sort} onChange={(event) => update("sort", event.target.value)} /></label>
            <label className="admin-check admin-field--wide"><input type="checkbox" checked={draft.show_on_homepage} onChange={(event) => update("show_on_homepage", event.target.checked)} /><span><Home size={15} /> Ana sayfadaki kartlarda göster</span></label>
            <VisibilityField label="Kart açıklaması" section="summary" className="admin-field--wide" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy}><textarea rows={3} value={draft.summary} onChange={(event) => update("summary", event.target.value)} required /></VisibilityField>
            <VisibilityField label="Detay alt başlığı (isteğe bağlı)" section="subtitle" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy}><input value={draft.hero_title} onChange={(event) => update("hero_title", event.target.value)} /></VisibilityField>
            <label><span>Alt başlık vurgusu (isteğe bağlı)</span><input value={draft.hero_accent} onChange={(event) => update("hero_accent", event.target.value)} /></label>
            <VisibilityField label="Detay giriş açıklaması" section="lead" className="admin-field--wide" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy}><textarea rows={4} value={draft.lead} onChange={(event) => update("lead", event.target.value)} /></VisibilityField>
            <VisibilityField label="Değerlendirme başlığı" section="overview" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy}><input value={draft.overview_title} onChange={(event) => update("overview_title", event.target.value)} /></VisibilityField>
            <label><span>Değerlendirme vurgusu</span><input value={draft.overview_accent} onChange={(event) => update("overview_accent", event.target.value)} /></label>
            <label className="admin-field--wide"><span>Genel bilgilendirme</span><textarea rows={5} value={draft.overview} onChange={(event) => update("overview", event.target.value)} /></label>
            <VisibilityField label="Değerlendirme maddeleri" section="assessment" className="admin-field--wide" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy}><textarea rows={5} value={draft.assessment_points} onChange={(event) => update("assessment_points", event.target.value)} placeholder={"Her satıra bir madde yazın.\nHareket değerlendirmesi\nGünlük yaşam alışkanlıkları"} /><small>Her satır sitede ayrı bir madde olarak görünür.</small></VisibilityField>
            <VisibilityField label="Süreç adımları" section="process" className="admin-field--wide" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy}><textarea rows={6} value={draft.process_steps} onChange={(event) => update("process_steps", event.target.value)} placeholder={"Değerlendirme | İhtiyaçlar birlikte belirlenir.\nPlanlama | Kişiye uygun yol haritası oluşturulur."} /><small>Her satırı “Başlık | Açıklama” biçiminde yazın.</small></VisibilityField>
            <VisibilityField label="Sık sorulan sorular" section="faqs" className="admin-field--wide" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy}><textarea rows={6} value={draft.faqs} onChange={(event) => update("faqs", event.target.value)} placeholder={"İlk görüşme ne kadar sürer? | Süre ihtiyaca göre değişebilir.\nNe getirmeliyim? | Varsa önceki raporlarınızı getirebilirsiniz."} /><small>Her satırı “Soru | Cevap” biçiminde yazın.</small></VisibilityField>
            <label><span>SEO başlığı</span><input value={draft.seo_title} onChange={(event) => update("seo_title", event.target.value)} /></label>
            <label><span>SEO açıklaması</span><textarea rows={2} maxLength={180} value={draft.seo_description} onChange={(event) => update("seo_description", event.target.value)} /></label>
            <ExtraSectionControls scope="practice_areas" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy} />
          </div>

          <div className="admin-post-editor__footer">
            <p className={message ? "is-visible" : ""} role="status">{message || "Değişiklikler kaydet düğmesine basılana kadar yayınlanmaz."}</p>
            <button type="submit" disabled={busy}>{busy ? <LoaderCircle className="admin-spinner" size={18} /> : <Save size={18} />} {draft.status === "published" ? "Kaydet ve yayınla" : "Alanı kaydet"}</button>
          </div>
        </form>}
        </div>
      </div>
    </section>
  );
}
