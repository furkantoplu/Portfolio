"use client";

import { useState } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { directusRequest } from "./admin-api";

export function ImageField({ label, value, onChange, disabled = false }: { label: string; value: string; onChange: (path: string) => void; disabled?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) { setMessage("En fazla 10 MB boyutunda JPG, PNG veya WebP seçin."); return; }
    setBusy(true); setMessage("");
    try {
      const body = new FormData(); body.append("file", file);
      const { data } = await directusRequest<{ data: { id: string } }>("/files", { method: "POST", body });
      onChange(`/site-media/${data.id}`);
      setMessage("Görsel yüklendi. Sitede görünmesi için içeriği kaydedin.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Görsel yüklenemedi."); }
    finally { setBusy(false); }
  }
  return <div className="admin-image-field admin-field--wide">
    <span>{label}</span>
    {value && <Image unoptimized width={600} height={210} src={value.startsWith("/site-media/") ? `/bakir-api/assets/${value.split("/").pop()}` : value} alt="Seçili görsel önizlemesi" />}
    <label className="admin-image-upload">{busy ? <LoaderCircle className="admin-spinner" size={18} /> : <ImagePlus size={18} />} {busy ? "Yükleniyor…" : "Bilgisayardan görsel seç"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy || disabled} onChange={e => { void upload(e.target.files?.[0]); e.target.value = ""; }} /></label>
    <button type="button" disabled={busy || disabled || !value} onClick={() => onChange("")}>Görseli içerikten kaldır</button>
    <small>JPG, PNG veya WebP · En fazla 10 MB. Ana karakter için şeffaf PNG kullanın. Görsel tüm dillerde ortaktır; kaldırma işlemi dosyayı silmez.</small>
    {message && <p role="status">{message}</p>}
  </div>;
}
