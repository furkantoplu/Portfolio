'use client';
import { useEffect, useState } from 'react';
import { directusRequest } from './admin-api';
import { pageVisibilityOptions, readPageVisibility, type PublicPageKey, type PageVisibility } from '../lib/page-visibility';

export function PageVisibilityManager({ value, onChanged }: { value?: unknown; onChanged: () => Promise<void> }) {
  const [visibility, setVisibility] = useState(() => readPageVisibility(value));
  const [pending, setPending] = useState<PublicPageKey | null>(null);
  const [message, setMessage] = useState('');
  useEffect(() => { setVisibility(readPageVisibility(value)); }, [value]);
  async function toggle(key: PublicPageKey) {
    if (key === 'home' || pending) return;
    setPending(key); setMessage('');
    try {
      const result = await directusRequest<{ data: PageVisibility }>(`/website-content/page-visibility/${key}`, { method: 'PATCH', body: JSON.stringify({ visible: !visibility[key] }) });
      setVisibility(readPageVisibility(result.data));
      setMessage('Sayfa görünürlüğü tüm dillerde kaydedildi.');
      try { await onChanged(); }
      catch { setMessage('Görünürlük kaydedildi. İçerik listesini yenilemek için paneli yeniden açabilirsiniz.'); }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Görünürlük kaydedilemedi.'); }
    finally { setPending(null); }
  }
  return <section className="admin-page-visibility" aria-labelledby="page-visibility-title">
    <h3 id="page-visibility-title">Sayfa görünürlüğü</h3>
    <p>Değişiklikler anında ve tüm dillerde uygulanır. Kapalı sayfa menülerden, ana sayfadaki ilgili alanlardan ve site haritasından kalkar; adresi ve alt detayları açılmaz. İçerikler silinmez. İletişim kapanınca randevu bağlantıları da gizlenir.</p>
    <div className="admin-page-visibility__list">
      {pageVisibilityOptions.map(({ key, label }) => <div className="admin-page-visibility__row" key={key}>
        <span>{label}{key === 'home' && <small>Daima açık</small>}</span>
        <button type="button" role="switch" aria-checked={visibility[key]} aria-label={`${label} sayfası görünürlüğü`} disabled={key === 'home' || pending !== null} onClick={() => void toggle(key)}>
          {pending === key ? 'Kaydediliyor…' : visibility[key] ? 'Görünür' : 'Gizli'}
        </button>
      </div>)}
    </div>
    <p role="status">{message}</p>
  </section>;
}
