"use client";

import { FormEvent, useState } from "react";
import { FileText, LoaderCircle, Save } from "lucide-react";
import { phoneToDialValue } from "../lib/contact";
import { directusRequest } from "./admin-api";

export type ManagedSitePage = {
  id: number;
  page_key: "about" | "contact";
  content: Record<string, unknown>;
  seo_title: string | null;
  seo_description: string | null;
};

function lines(value: unknown, first: string, second?: string) {
  if (!Array.isArray(value)) return "";
  return value.map((item) => second ? `${item[first] || ""} | ${item[second] || ""}` : item[first] || "").join("\n");
}

function pairs(value: string, first: string, second?: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    if (!second) return { [first]: line };
    const separator = line.indexOf("|");
    return separator === -1 ? { [first]: line, [second]: "" } : { [first]: line.slice(0, separator).trim(), [second]: line.slice(separator + 1).trim() };
  });
}

export function PageManager({ pages, onChanged }: { pages: ManagedSitePage[]; onChanged: () => Promise<void> }) {
  const [pageKey, setPageKey] = useState<"about" | "contact">("about");
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const current = pages.find((page) => page.page_key === pageKey);

  function selectPage(key: "about" | "contact") {
    const page = pages.find((item) => item.page_key === key);
    const content = page?.content || {};
    setPageKey(key);
    setDraft({
      ...Object.fromEntries(Object.entries(content).filter(([, value]) => typeof value === "string")) as Record<string, string>,
      story_paragraphs: lines(content.story_paragraphs, "text"),
      principles: lines(content.principles, "title", "text"),
      flow_steps: lines(content.flow_steps, "title", "text"),
      seo_title: page?.seo_title || "",
      seo_description: page?.seo_description || "",
    });
    setMessage(null);
  }

  function value(field: string) {
    if (field in draft) return draft[field];
    const raw = current?.content?.[field];
    return typeof raw === "string" ? raw : "";
  }

  function update(field: string, next: string) {
    setDraft((state) => ({ ...state, [field]: next }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current) return;
    setBusy(true);
    setMessage(null);
    const content = { ...current.content, ...draft };
    delete content.seo_title;
    delete content.seo_description;
    if (pageKey === "about") {
      content.story_paragraphs = pairs(draft.story_paragraphs ?? lines(current.content.story_paragraphs, "text"), "text");
      content.principles = pairs(draft.principles ?? lines(current.content.principles, "title", "text"), "title", "text");
    } else {
      content.flow_steps = pairs(draft.flow_steps ?? lines(current.content.flow_steps, "title", "text"), "title", "text");
      const phoneDisplay = String(content.phone_display || "").trim();
      content.phone_display = phoneDisplay;
      content.phone_value = phoneToDialValue(phoneDisplay);
    }
    try {
      await directusRequest(`/items/site_pages/${current.id}`, { method: "PATCH", body: JSON.stringify({ content, seo_title: draft.seo_title ?? current.seo_title, seo_description: draft.seo_description ?? current.seo_description }) });
      await onChanged();
      setMessage(`${pageKey === "about" ? "Hakkımda" : "İletişim"} sayfası güncellendi.`);
    } catch {
      setMessage("Sayfa kaydedilemedi. Bağlantıyı ve alanları kontrol edin.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-content-manager admin-page-manager" aria-labelledby="page-manager-title">
      <div className="admin-content-manager__heading">
        <div><p className="admin-eyebrow"><FileText size={17} /> Sayfa içerikleri</p><h2 id="page-manager-title">Kurumsal sayfaları,<br /><em>kod açmadan güncelleyin.</em></h2></div>
      </div>
      <div className="admin-page-tabs" role="tablist">
        <button type="button" className={pageKey === "about" ? "is-active" : ""} onClick={() => selectPage("about")}>Hakkımda</button>
        <button type="button" className={pageKey === "contact" ? "is-active" : ""} onClick={() => selectPage("contact")}>İletişim</button>
      </div>
      <form className="admin-post-editor" onSubmit={save}>
        <div className="admin-editor-grid">
          {pageKey === "about" ? <>
            <label><span>Ana başlık</span><input value={value("hero_title")} onChange={(e) => update("hero_title", e.target.value)} required /></label>
            <label><span>Vurgulu başlık</span><input value={value("hero_accent")} onChange={(e) => update("hero_accent", e.target.value)} required /></label>
            <label className="admin-field--wide"><span>Ana açıklama</span><textarea rows={4} value={value("hero_description")} onChange={(e) => update("hero_description", e.target.value)} /></label>
            <label><span>Yaklaşım başlığı</span><input value={value("story_title")} onChange={(e) => update("story_title", e.target.value)} /></label>
            <label><span>Yaklaşım vurgusu</span><input value={value("story_accent")} onChange={(e) => update("story_accent", e.target.value)} /></label>
            <label className="admin-field--wide"><span>Öne çıkan yaklaşım metni</span><textarea rows={3} value={value("story_lead")} onChange={(e) => update("story_lead", e.target.value)} /></label>
            <label className="admin-field--wide"><span>Yaklaşım paragrafları</span><textarea rows={7} value={draft.story_paragraphs ?? lines(current?.content.story_paragraphs, "text")} onChange={(e) => update("story_paragraphs", e.target.value)} /><small>Her satır ayrı paragraf olur.</small></label>
            <label className="admin-field--wide"><span>Mesleki bilgi notu</span><textarea rows={3} value={value("professional_note")} onChange={(e) => update("professional_note", e.target.value)} /></label>
            <label className="admin-field--wide"><span>Çalışma ilkeleri başlığı</span><input value={value("principles_title")} onChange={(e) => update("principles_title", e.target.value)} /></label>
            <label className="admin-field--wide"><span>Çalışma ilkeleri</span><textarea rows={7} value={draft.principles ?? lines(current?.content.principles, "title", "text")} onChange={(e) => update("principles", e.target.value)} /><small>Her satırı “Başlık | Açıklama” biçiminde yazın.</small></label>
          </> : <>
            <label><span>Ana başlık</span><input value={value("hero_title")} onChange={(e) => update("hero_title", e.target.value)} required /></label>
            <label><span>Vurgulu başlık</span><input value={value("hero_accent")} onChange={(e) => update("hero_accent", e.target.value)} required /></label>
            <label className="admin-field--wide"><span>Giriş açıklaması</span><textarea rows={3} value={value("intro")} onChange={(e) => update("intro", e.target.value)} /></label>
            <label className="admin-field--wide"><span>Gizlilik uyarısı</span><input value={value("privacy_note")} onChange={(e) => update("privacy_note", e.target.value)} /></label>
            <label><span>Telefon numarası</span><input type="tel" value={value("phone_display")} onChange={(e) => update("phone_display", e.target.value)} placeholder="+90 555 123 45 67" /><small>Arama bağlantısı bu numaradan otomatik oluşturulur.</small></label>
            <label><span>WhatsApp numarası</span><input value={value("whatsapp_value")} onChange={(e) => update("whatsapp_value", e.target.value.replace(/\D/g, ""))} /></label>
            <label><span>E-posta</span><input type="email" value={value("email")} onChange={(e) => update("email", e.target.value)} /></label>
            <label><span>Adres başlığı</span><input value={value("address_title")} onChange={(e) => update("address_title", e.target.value)} /></label>
            <label><span>Çalışma günleri</span><input value={value("working_days")} onChange={(e) => update("working_days", e.target.value)} /></label>
            <label className="admin-field--wide"><span>Adres açıklaması</span><textarea rows={2} value={value("address_note")} onChange={(e) => update("address_note", e.target.value)} /></label>
            <label className="admin-field--wide"><span>Çalışma saatleri</span><input value={value("working_hours")} onChange={(e) => update("working_hours", e.target.value)} /></label>
            <label className="admin-field--wide"><span>Süreç başlığı</span><input value={value("flow_title")} onChange={(e) => update("flow_title", e.target.value)} /></label>
            <label className="admin-field--wide"><span>İletişim adımları</span><textarea rows={7} value={draft.flow_steps ?? lines(current?.content.flow_steps, "title", "text")} onChange={(e) => update("flow_steps", e.target.value)} /><small>Her satırı “Başlık | Açıklama” biçiminde yazın.</small></label>
          </>}
          <label><span>SEO başlığı</span><input value={draft.seo_title ?? current?.seo_title ?? ""} onChange={(e) => update("seo_title", e.target.value)} /></label>
          <label><span>SEO açıklaması</span><textarea rows={2} value={draft.seo_description ?? current?.seo_description ?? ""} onChange={(e) => update("seo_description", e.target.value)} /></label>
        </div>
        <div className="admin-post-editor__footer"><p className={message ? "is-visible" : ""} role="status">{message || "Kaydettiğiniz değişiklikler ilgili public sayfada hemen görünür."}</p><button type="submit" disabled={busy || !current}>{busy ? <LoaderCircle className="admin-spinner" size={18} /> : <Save size={18} />} Sayfayı kaydet</button></div>
      </form>
    </section>
  );
}
