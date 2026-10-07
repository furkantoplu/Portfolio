"use client";

import { FormEvent, useRef, useState } from "react";
import { ArrowUpRight, BookOpenText, Check, EyeOff, FilePlus2, LoaderCircle, PencilLine, Save } from "lucide-react";
import { directusRequest, type ContentItem } from "./admin-api";
import { NativeLink } from "../components/native-link";
import { LanguageTabs, TranslationEditor } from "./translation-editor";
import type { Locale } from "../lib/i18n";
import { ImageField } from "./image-field";
import { VisibilityField, VisibilitySwitch, ExtraSectionControls } from "./section-visibility";

export type ManagedBlogPost = ContentItem & {
  section_visibility?: Record<string, boolean>;
  tips_title: string | null;
  tips: Array<{ title: string; text: string }> | null;
  id: number;
  sort: number | null;
  featured: boolean;
  category: string;
  title: string;
  slug: string;
  summary: string;
  cover_path: string | null;
  cover_alt: string | null;
  cover_caption: string | null;
  published_at: string | null;
  reading_minutes: number;
  lead: string | null;
  body_paragraphs: Array<{ text: string }> | null;
  quote: string | null;
  closing_title: string | null;
  closing_body: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

type BlogDraft = {
  section_visibility: Record<string, boolean>;
  tips_title: string;
  tips: string;
  cover_path: string;
  cover_alt: string;
  cover_caption: string;
  status: ContentItem["status"];
  featured: boolean;
  category: string;
  title: string;
  slug: string;
  summary: string;
  published_at: string;
  reading_minutes: string;
  lead: string;
  body: string;
  quote: string;
  closing_title: string;
  closing_body: string;
  seo_title: string;
  seo_description: string;
};

const emptyDraft: BlogDraft = {
  section_visibility: {}, tips_title: "", tips: "",
  cover_path: "", cover_alt: "", cover_caption: "",
  status: "draft",
  featured: false,
  category: "Genel Bilgilendirme",
  title: "",
  slug: "",
  summary: "",
  published_at: "",
  reading_minutes: "4",
  lead: "",
  body: "",
  quote: "",
  closing_title: "",
  closing_body: "",
  seo_title: "",
  seo_description: "",
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

function postToDraft(post: ManagedBlogPost): BlogDraft {
  return {
    section_visibility: post.section_visibility || {}, tips_title: post.tips_title || "", tips: post.tips?.map(tip => `${tip.title} | ${tip.text}`).join("\n") || "",
    cover_path: post.cover_path ?? "", cover_alt: post.cover_alt ?? "", cover_caption: post.cover_caption ?? "",
    status: post.status,
    featured: post.featured,
    category: post.category,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    published_at: post.published_at?.slice(0, 10) ?? "",
    reading_minutes: String(post.reading_minutes || 4),
    lead: post.lead ?? "",
    body: post.body_paragraphs?.map((paragraph) => paragraph.text).join("\n\n") ?? "",
    quote: post.quote ?? "",
    closing_title: post.closing_title ?? "",
    closing_body: post.closing_body ?? "",
    seo_title: post.seo_title ?? "",
    seo_description: post.seo_description ?? "",
  };
}

const statusLabels: Record<ContentItem["status"], string> = {
  draft: "Taslak",
  published: "Yayında",
  hidden: "Gizli",
};

export function BlogManager({ posts, onChanged }: { posts: ManagedBlogPost[]; onChanged: () => Promise<void> }) {
  const [language, setLanguage] = useState<Locale>("tr");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedIdRef = useRef<number | null>(null);
  const [draft, setDraft] = useState<BlogDraft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function startNew() {
    selectedIdRef.current = null;
    setLanguage("tr");
    setSelectedId(null);
    setDraft({ ...emptyDraft });
    setMessage(null);
  }

  function editPost(post: ManagedBlogPost) {
    selectedIdRef.current = post.id;
    setSelectedId(post.id);
    setDraft(postToDraft(post));
    setMessage(null);
  }

  function update<K extends keyof BlogDraft>(field: K, value: BlogDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    const paragraphs = draft.body
      .split(/\n\s*\n/)
      .map((text) => text.trim())
      .filter(Boolean)
      .map((text) => ({ text }));

    const payload = {
      section_visibility: draft.section_visibility,
      tips_title: draft.tips_title.trim() || null,
      tips: draft.tips.split("\n").filter(line => line.trim()).map(line => { const separator = line.indexOf("|"); return { title: (separator < 0 ? line : line.slice(0, separator)).trim(), text: separator < 0 ? "" : line.slice(separator + 1).trim() }; }),
      cover_path: draft.cover_path || null, cover_alt: draft.cover_alt.trim() || null, cover_caption: draft.cover_caption.trim() || null,
      status: draft.status,
      featured: draft.featured,
      category: draft.category.trim(),
      title: draft.title.trim(),
      slug: slugify(draft.slug),
      summary: draft.summary.trim(),
      published_at: draft.published_at || (draft.status === "published" ? new Date().toISOString().slice(0, 10) : null),
      reading_minutes: Math.max(1, Number.parseInt(draft.reading_minutes, 10) || 4),
      lead: draft.lead.trim() || null,
      body_paragraphs: paragraphs.length ? paragraphs : null,
      quote: draft.quote.trim() || null,
      closing_title: draft.closing_title.trim() || null,
      closing_body: draft.closing_body.trim() || null,
      seo_title: draft.seo_title.trim() || null,
      seo_description: draft.seo_description.trim() || null,
    };

    try {
      const result = await directusRequest<{ data: ManagedBlogPost }>(selectedId ? `/items/blog_posts/${selectedId}` : "/items/blog_posts", {
        method: selectedId ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      selectedIdRef.current = result.data.id;
      setSelectedId(result.data.id);
      setDraft(postToDraft(result.data));
      await onChanged();
      setMessage(draft.status === "published" ? "Yazı kaydedildi ve sitede yayına alındı." : "Yazı güvenle kaydedildi.");
    } catch (error) {
      const code = error instanceof Error ? error.name : "";
      setMessage(code === "RECORD_NOT_UNIQUE" ? "Bu URL adı başka bir yazıda kullanılıyor." : "Yazı kaydedilemedi. Zorunlu alanları ve bağlantıyı kontrol edin.");
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(post: ManagedBlogPost, status: ContentItem["status"]) {
    setBusy(true);
    setMessage(null);
    try {
      await directusRequest(`/items/blog_posts/${post.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, ...(status === "published" && !post.published_at ? { published_at: new Date().toISOString().slice(0, 10) } : {}) }),
      });
      if (selectedId === post.id) update("status", status);
      await onChanged();
      setMessage(status === "published" ? "Yazı yayına alındı." : status === "hidden" ? "Yazı ziyaretçilerden gizlendi." : "Yazı taslağa alındı.");
    } catch {
      setMessage("Yayın durumu değiştirilemedi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-content-manager" aria-labelledby="blog-manager-title">
      <div className="admin-content-manager__heading">
        <div>
          <p className="admin-eyebrow"><BookOpenText size={17} /> Blog yönetimi</p>
          <h2 id="blog-manager-title">Yazıları hazırlayın,<br /><em>zamanı gelince yayınlayın.</em></h2>
        </div>
        <button type="button" onClick={startNew}><FilePlus2 size={18} /> Yeni yazı</button>
      </div>

      <div className="admin-content-manager__layout">
        <div className="admin-post-list" aria-label="Blog yazıları">
          {posts.map((post) => (
            <article className={selectedId === post.id ? "is-selected" : ""} key={post.id}>
              <button className="admin-post-list__main" type="button" onClick={() => editPost(post)}>
                <span className={`admin-status admin-status--${post.status}`}>{statusLabels[post.status]}</span>
                <strong>{post.title}</strong>
                <small>{post.category} · {post.reading_minutes} dk.</small>
              </button>
              <div className="admin-post-list__actions">
                <button type="button" onClick={() => editPost(post)} title="Düzenle"><PencilLine size={16} /></button>
                {post.status === "published" ? (
                  <button type="button" onClick={() => changeStatus(post, "hidden")} title="Gizle" disabled={busy}><EyeOff size={16} /></button>
                ) : (
                  <button type="button" onClick={() => changeStatus(post, "published")} title="Yayınla" disabled={busy}><Check size={16} /></button>
                )}
                {post.status === "published" && <NativeLink href={`/blog/${post.slug}`} target="_blank" title="Sitede aç"><ArrowUpRight size={16} /></NativeLink>}
              </div>
            </article>
          ))}
        </div>

        <div>
        <LanguageTabs language={language} onChange={setLanguage} disabled={!selectedId || busy} />
        {language !== "tr" && selectedId ? <TranslationEditor key={`${selectedId}-${language}`} collection="blog_posts" parentId={selectedId} language={language} onVisibilitySaved={async value => { if (selectedIdRef.current === selectedId) update("section_visibility", value); await onChanged(); }} /> : <form className="admin-post-editor" onSubmit={savePost}>
          <div className="admin-post-editor__topline">
            <div><PencilLine size={18} /><strong>{selectedId ? "Yazıyı düzenle" : "Yeni yazı oluştur"}</strong></div>
            <select value={draft.status} onChange={(event) => update("status", event.target.value as ContentItem["status"])} aria-label="Yayın durumu">
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
              <option value="hidden">Gizli</option>
            </select>
          </div>

          <p className="admin-visibility-note">Görünürlük tüm dillerde ortaktır. Gizlemek içerikleri silmez; Kaydet ile uygulanır.</p>
          <div className="admin-editor-grid">
            <ImageField label="Yazı kapak görseli" value={draft.cover_path} onChange={path => update("cover_path", path)} disabled={busy}  visibilityControl={<VisibilitySwitch section="image" label="Yazı kapak görseli" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy} />} />
            <label><span>Görsel açıklaması</span><input value={draft.cover_alt} onChange={e => update("cover_alt", e.target.value)} /></label>
            <label><span>Görsel alt yazısı</span><input value={draft.cover_caption} onChange={e => update("cover_caption", e.target.value)} /></label>
            <label className="admin-field--wide"><span>Yazı başlığı</span><input value={draft.title} onChange={(event) => { const title = event.target.value; setDraft((current) => ({ ...current, title, ...(!selectedId ? { slug: slugify(title) } : {}) })); }} required /></label>
            <VisibilityField label="Kategori" section="meta" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy}><input value={draft.category} onChange={(event) => update("category", event.target.value)} required /></VisibilityField>
            <label><span>URL adı</span><input value={draft.slug} onChange={(event) => update("slug", slugify(event.target.value))} required /></label>
            <VisibilityField label="Kart özeti" section="summary" className="admin-field--wide" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy}><textarea rows={3} value={draft.summary} onChange={(event) => update("summary", event.target.value)} required /></VisibilityField>
            <label><span>Yayın tarihi</span><input type="date" value={draft.published_at} onChange={(event) => update("published_at", event.target.value)} /></label>
            <label><span>Okuma süresi</span><input type="number" min="1" max="120" value={draft.reading_minutes} onChange={(event) => update("reading_minutes", event.target.value)} required /></label>
            <label className="admin-check admin-field--wide"><input type="checkbox" checked={draft.featured} onChange={(event) => update("featured", event.target.checked)} /><span>Ana sayfada öne çıkar</span></label>
            <VisibilityField label="Giriş metni" section="lead" className="admin-field--wide" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy}><textarea rows={4} value={draft.lead} onChange={(event) => update("lead", event.target.value)} /></VisibilityField>
            <VisibilityField label="Yazı paragrafları" section="body" className="admin-field--wide" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy}><textarea rows={10} value={draft.body} onChange={(event) => update("body", event.target.value)} placeholder="Her paragrafın arasına bir boş satır bırakın." /><small>Boş satırlarla ayrılan her bölüm ayrı paragraf olarak yayınlanır.</small></VisibilityField>
            <VisibilityField label="Vurgulu alıntı" section="quote" className="admin-field--wide" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy}><textarea rows={2} value={draft.quote} onChange={(event) => update("quote", event.target.value)} /></VisibilityField>
            <VisibilityField label="Öneriler başlığı" section="tips" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy}><input value={draft.tips_title} onChange={e => update("tips_title", e.target.value)} /></VisibilityField>
            <label className="admin-field--wide"><span>Öneriler / uygulanabilir adımlar</span><textarea rows={6} value={draft.tips} onChange={e => update("tips", e.target.value)} /><small>Her satır: Başlık | Açıklama</small></label>
            <VisibilityField label="Kapanış başlığı" section="closing" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy}><input value={draft.closing_title} onChange={(event) => update("closing_title", event.target.value)} /></VisibilityField>
            <label><span>SEO başlığı</span><input value={draft.seo_title} onChange={(event) => update("seo_title", event.target.value)} /></label>
            <label className="admin-field--wide"><span>Kapanış metni</span><textarea rows={3} value={draft.closing_body} onChange={(event) => update("closing_body", event.target.value)} /></label>
            <label className="admin-field--wide"><span>SEO açıklaması</span><textarea rows={2} maxLength={180} value={draft.seo_description} onChange={(event) => update("seo_description", event.target.value)} /></label>
            <ExtraSectionControls scope="blog_posts" visibility={draft.section_visibility} onChange={value => update("section_visibility", value)} disabled={busy} />
          </div>

          <div className="admin-post-editor__footer">
            <p className={message ? "is-visible" : ""} role="status">{message || "Değişiklikler kaydet düğmesine basılana kadar yayınlanmaz."}</p>
            <button type="submit" disabled={busy}>{busy ? <LoaderCircle className="admin-spinner" size={18} /> : <Save size={18} />} {draft.status === "published" ? "Kaydet ve yayınla" : "Yazıyı kaydet"}</button>
          </div>
        </form>}
        </div>
      </div>
    </section>
  );
}
