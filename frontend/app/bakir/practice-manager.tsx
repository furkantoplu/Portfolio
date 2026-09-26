"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, EyeOff, FilePlus2, Home, LoaderCircle, PencilLine, Save, Stethoscope } from "lucide-react";
import { directusRequest, type ContentItem } from "./admin-api";

export type ManagedPracticeArea = ContentItem & {
  id: number;
  sort: number | null;
  show_on_homepage: boolean;
  title: string;
  slug: string;
  summary: string;
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

function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draft, setDraft] = useState<PracticeDraft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function update<K extends keyof PracticeDraft>(field: K, value: PracticeDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function startNew() {
    setSelectedId(null);
    setDraft({ ...emptyDraft, sort: String((areas.at(-1)?.sort ?? areas.length) + 1) });
    setMessage(null);
  }

  function editArea(area: ManagedPracticeArea) {
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
      status: draft.status,
      sort: draft.sort ? Number.parseInt(draft.sort, 10) : null,
      show_on_homepage: draft.show_on_homepage,
      title: draft.title.trim(),
      slug: slugify(draft.slug),
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
        <button type="button" onClick={startNew}><FilePlus2 size={18} /> Yeni alan</button>
      </div>

      <div className="admin-content-manager__layout">
        <div className="admin-post-list" aria-label="Çalışma alanları">
          {areas.map((area) => (
            <article className={selectedId === area.id ? "is-selected" : ""} key={area.id}>
              <button className="admin-post-list__main" type="button" onClick={() => editArea(area)}>
                <span className={`admin-status admin-status--${area.status}`}>{statusLabels[area.status]}</span>
                <strong>{area.title}</strong>
                <small>{area.show_on_homepage ? "Ana sayfada gösteriliyor" : "Yalnızca alanlar sayfası"}</small>
              </button>
              <div className="admin-post-list__actions">
                <button type="button" onClick={() => editArea(area)} title="Düzenle"><PencilLine size={16} /></button>
                {area.status === "published" ? (
                  <button type="button" onClick={() => changeStatus(area, "hidden")} title="Gizle" disabled={busy}><EyeOff size={16} /></button>
                ) : (
                  <button type="button" onClick={() => changeStatus(area, "published")} title="Yayınla" disabled={busy}><Check size={16} /></button>
                )}
                {area.status === "published" && <Link href={`/calisma-alanlari/${area.slug}`} target="_blank" title="Sitede aç"><ArrowUpRight size={16} /></Link>}
              </div>
            </article>
          ))}
        </div>

        <form className="admin-post-editor" onSubmit={saveArea}>
          <div className="admin-post-editor__topline">
            <div><PencilLine size={18} /><strong>{selectedId ? "Alanı düzenle" : "Yeni çalışma alanı"}</strong></div>
            <select value={draft.status} onChange={(event) => update("status", event.target.value as ContentItem["status"])} aria-label="Yayın durumu">
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
              <option value="hidden">Gizli</option>
            </select>
          </div>

          <div className="admin-editor-grid">
            <label className="admin-field--wide"><span>Çalışma alanı adı</span><input value={draft.title} onChange={(event) => { const title = event.target.value; setDraft((current) => ({ ...current, title, ...(!selectedId ? { slug: slugify(title), hero_title: title } : {}) })); }} required /></label>
            <label><span>URL adı</span><input value={draft.slug} onChange={(event) => update("slug", slugify(event.target.value))} required /></label>
            <label><span>Sıralama</span><input type="number" min="1" value={draft.sort} onChange={(event) => update("sort", event.target.value)} /></label>
            <label className="admin-check admin-field--wide"><input type="checkbox" checked={draft.show_on_homepage} onChange={(event) => update("show_on_homepage", event.target.checked)} /><span><Home size={15} /> Ana sayfadaki kartlarda göster</span></label>
            <label className="admin-field--wide"><span>Kart açıklaması</span><textarea rows={3} value={draft.summary} onChange={(event) => update("summary", event.target.value)} required /></label>
            <label><span>Detay sayfası başlığı</span><input value={draft.hero_title} onChange={(event) => update("hero_title", event.target.value)} /></label>
            <label><span>Başlıktaki vurgulu bölüm</span><input value={draft.hero_accent} onChange={(event) => update("hero_accent", event.target.value)} /></label>
            <label className="admin-field--wide"><span>Detay giriş açıklaması</span><textarea rows={4} value={draft.lead} onChange={(event) => update("lead", event.target.value)} /></label>
            <label><span>Değerlendirme başlığı</span><input value={draft.overview_title} onChange={(event) => update("overview_title", event.target.value)} /></label>
            <label><span>Değerlendirme vurgusu</span><input value={draft.overview_accent} onChange={(event) => update("overview_accent", event.target.value)} /></label>
            <label className="admin-field--wide"><span>Genel bilgilendirme</span><textarea rows={5} value={draft.overview} onChange={(event) => update("overview", event.target.value)} /></label>
            <label className="admin-field--wide"><span>Değerlendirme maddeleri</span><textarea rows={5} value={draft.assessment_points} onChange={(event) => update("assessment_points", event.target.value)} placeholder={"Her satıra bir madde yazın.\nHareket değerlendirmesi\nGünlük yaşam alışkanlıkları"} /><small>Her satır sitede ayrı bir madde olarak görünür.</small></label>
            <label className="admin-field--wide"><span>Süreç adımları</span><textarea rows={6} value={draft.process_steps} onChange={(event) => update("process_steps", event.target.value)} placeholder={"Değerlendirme | İhtiyaçlar birlikte belirlenir.\nPlanlama | Kişiye uygun yol haritası oluşturulur."} /><small>Her satırı “Başlık | Açıklama” biçiminde yazın.</small></label>
            <label className="admin-field--wide"><span>Sık sorulan sorular</span><textarea rows={6} value={draft.faqs} onChange={(event) => update("faqs", event.target.value)} placeholder={"İlk görüşme ne kadar sürer? | Süre ihtiyaca göre değişebilir.\nNe getirmeliyim? | Varsa önceki raporlarınızı getirebilirsiniz."} /><small>Her satırı “Soru | Cevap” biçiminde yazın.</small></label>
            <label><span>SEO başlığı</span><input value={draft.seo_title} onChange={(event) => update("seo_title", event.target.value)} /></label>
            <label><span>SEO açıklaması</span><textarea rows={2} maxLength={180} value={draft.seo_description} onChange={(event) => update("seo_description", event.target.value)} /></label>
          </div>

          <div className="admin-post-editor__footer">
            <p className={message ? "is-visible" : ""} role="status">{message || "Değişiklikler kaydet düğmesine basılana kadar yayınlanmaz."}</p>
            <button type="submit" disabled={busy}>{busy ? <LoaderCircle className="admin-spinner" size={18} /> : <Save size={18} />} {draft.status === "published" ? "Kaydet ve yayınla" : "Alanı kaydet"}</button>
          </div>
        </form>
      </div>
    </section>
  );
}
