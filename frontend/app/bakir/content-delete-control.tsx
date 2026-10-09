"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { deleteContentItem, deletionConfirmed, type DeletableCollection } from "./content-delete";

export function ContentDeleteControl({ collection, id, title, disabled, onBusyChange, onDeleted }: {
  collection: DeletableCollection;
  id: number;
  title: string;
  disabled: boolean;
  onBusyChange: (busy: boolean) => void;
  onDeleted: (id: number) => Promise<void>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const inFlight = useRef(false);
  const headingId = useId();
  const descriptionId = useId();
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function open() {
    if (disabled || inFlight.current) return;
    setConfirmation("");
    setError(null);
    dialog.current?.showModal();
  }

  async function remove(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || !deletionConfirmed(confirmation)) return;
    inFlight.current = true;
    setDeleting(true);
    setError(null);
    onBusyChange(true);
    try {
      await deleteContentItem(collection, id, confirmation);
      dialog.current?.close();
      await onDeleted(id);
    } catch {
      setError("İçerik silinemedi. Oturumunuzu ve bağlantınızı kontrol edip yeniden deneyin.");
    } finally {
      inFlight.current = false;
      onBusyChange(false);
      if (dialog.current) setDeleting(false);
    }
  }

  return <>
    <button className="admin-content-delete__trigger" type="button" disabled={disabled || deleting} onClick={open} title="Kalıcı sil" aria-label={`${title} — kalıcı sil`}><Trash2 size={16} aria-hidden="true" /><span>Sil</span></button>
    <dialog ref={dialog} className="admin-delete-dialog" role="alertdialog" aria-labelledby={headingId} aria-describedby={descriptionId} onCancel={event => { if (inFlight.current) event.preventDefault(); }}>
      <form onSubmit={remove}>
        <h3 id={headingId}>{collection === "blog_posts" ? "Blog yazısını kalıcı sil" : "Çalışma alanını kalıcı sil"}</h3>
        <p className="admin-delete-dialog__record">{title}</p>
        <div id={descriptionId}>
          <p>Bu kayıt ve İngilizce/Almanca çevirileri silinir. Panelden geri alınamaz. Sadece yayından kaldırmak istiyorsanız <strong>Gizle</strong> seçeneğini kullanın.</p>
          <p>Başka içerikte kullanılan fotoğraflar korunur. Artık kullanılmayan yüklenmiş görseller otomatik temizlenir.</p>
        </div>
        <label><span>Onaylamak için <strong>SIL</strong> yazın.</span><input value={confirmation} onChange={event => setConfirmation(event.target.value)} disabled={deleting} autoComplete="off" spellCheck={false} maxLength={20} required /></label>
        {error && <p className="admin-delete-dialog__error" role="alert">{error}</p>}
        <div className="admin-delete-dialog__actions">
          <button type="button" autoFocus disabled={deleting} onClick={() => dialog.current?.close()}>Vazgeç</button>
          <button className="admin-delete-dialog__confirm" type="submit" disabled={deleting || !deletionConfirmed(confirmation)}>{deleting ? <LoaderCircle size={17} className="admin-spinner" /> : <Trash2 size={17} />} {deleting ? "Siliniyor…" : "Kalıcı sil"}</button>
        </div>
      </form>
    </dialog>
  </>;
}
