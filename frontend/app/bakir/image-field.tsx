"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { directusRequest } from "./admin-api";

export function ImageField({ label, value, onChange, disabled = false, visibilityControl }: { label: string; value: string; onChange: (path: string) => void; disabled?: boolean; visibilityControl?: ReactNode }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const mounted=useRef(true);
  const pendingPaths=useRef(new Set<string>());
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  async function discard(path: string) {
    if (!pendingPaths.current.has(path)) return;
    const id=path.match(/^\/site-media\/([0-9a-f-]{36})$/i)?.[1];
    if (!id) return;
    await directusRequest(`/website-content/media-discard/${id}`, {method:"POST"}).catch(()=>undefined);
  }
  async function remove() {
    setBusy(true);
    try { onChange(""); await discard(value); setMessage("İçerikten kaldırıldı. Kaydet sonrası başka içerikte kullanılmayan dosya ve veritabanı kaydı kalıcı silinir."); }
    finally {setBusy(false);}
  }
  async function upload(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) { setMessage("En fazla 10 MB boyutunda JPG, PNG veya WebP seçin."); return; }
    setBusy(true); setMessage("");
    try {
      const body = new FormData(); body.append("description", "fizyoterapi-site-image:v1"); body.append("file", file);
      const { data } = await directusRequest<{ data: { id: string } }>("/files", { method: "POST", body });
      const path=`/site-media/${data.id}`;
      pendingPaths.current.add(path);
      if (!mounted.current) {await discard(path);return;}
      onChange(path);
      await discard(value);
      setMessage("Görsel yüklendi. Sitede görünmesi için içeriği kaydedin.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Görsel yüklenemedi."); }
    finally { setBusy(false); }
  }
  return <div className="admin-image-field admin-field--wide">
    <span className="admin-field-heading"><span>{label}</span>{visibilityControl}</span>
    {value && <Image unoptimized width={600} height={210} src={value.startsWith("/site-media/") ? `/bakir-api/assets/${value.split("/").pop()}` : value} alt="Seçili görsel önizlemesi" />}
    <label className="admin-image-upload">{busy ? <LoaderCircle className="admin-spinner" size={18} /> : <ImagePlus size={18} />} {busy ? "Yükleniyor…" : "Bilgisayardan görsel seç"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy || disabled} onChange={e => { void upload(e.target.files?.[0]); e.target.value = ""; }} /></label>
    <button type="button" disabled={busy || disabled || !value} onClick={() => void remove()}>Görseli içerikten kaldır</button>
    <small>JPG, PNG veya WebP · En fazla 10 MB. Ana karakter için şeffaf PNG kullanın. Kaydet sonrası başka yerde kullanılmayan eski görsel kalıcı silinir. Kaydedilmeyen yüklemeler 24 saat sonra temizlenir.</small>
    {message && <p role="status">{message}</p>}
  </div>;
}
