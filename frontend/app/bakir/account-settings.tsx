"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle, Save, UserRound } from "lucide-react";
import { directusRequest } from "./admin-api";
export type AccountProfile = { id: string; first_name: string | null; last_name: string | null; email: string; tfa_enabled: boolean };
export function AccountSettings({ user, onSaved }: { user: AccountProfile; onSaved: (profile: AccountProfile, credentialsChanged: boolean) => Promise<void> }) {
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function save(event: FormEvent) {
    event.preventDefault();
    if (newPassword !== confirmation) { setMessage("Yeni parola ile tekrar alanı aynı olmalı."); return; }
    if (newPassword && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,128}$/.test(newPassword)) { setMessage("Yeni parola 10–128 karakter; büyük/küçük harf, rakam ve sembol içermeli."); return; }
    setBusy(true); setMessage("");
    try {
      const { data } = await directusRequest<{ data: { account: AccountProfile; credentials_changed: boolean } }>("/website-content/account-settings", {
        method: "PATCH", body: JSON.stringify({ first_name: firstName, last_name: lastName, email, current_password: currentPassword, new_password: newPassword, otp }),
      });
      setFirstName(data.account.first_name || ""); setLastName(data.account.last_name || ""); setEmail(data.account.email);
      setCurrentPassword(""); setNewPassword(""); setConfirmation(""); setOtp("");
      setMessage("Profil bilgileriniz güncellendi.");
      await onSaved(data.account, data.credentials_changed);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Bilgiler kaydedilemedi."); }
    finally { setBusy(false); }
  }
  return <section className="admin-content-manager admin-account-settings" aria-labelledby="account-title">
    <div className="admin-content-manager__heading"><div><p className="admin-eyebrow"><UserRound size={17} /> Hesabım</p><h2 id="account-title">Kendi bilgilerinizi,<br /><em>güvenle güncelleyin.</em></h2></div></div>
    <form className="admin-post-editor" onSubmit={save}>
      <p className="admin-translation-note">Yalnızca kendi hesabınız düzenlenir. Diğer yöneticilerin giriş bilgileri değiştirilemez. E-posta veya parola değişirse tüm oturumlarınız kapatılır ve yeni bilgilerle giriş yapmanız gerekir.</p>
      <fieldset disabled={busy} className="admin-account-fields">
        <div className="admin-editor-grid">
          <label><span>Ad</span><input autoComplete="given-name" maxLength={50} value={firstName} onChange={e => setFirstName(e.target.value)} /></label>
          <label><span>Soyad</span><input autoComplete="family-name" maxLength={50} value={lastName} onChange={e => setLastName(e.target.value)} /></label>
          <label className="admin-field--wide"><span>Giriş e-posta adresi</span><input type="email" autoComplete="username" maxLength={128} required value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label><span>Yeni parola (isteğe bağlı)</span><input type="password" autoComplete="new-password" minLength={10} maxLength={128} value={newPassword} onChange={e => setNewPassword(e.target.value)} /><small>Boş bırakırsanız mevcut parolanız korunur.</small></label>
          <label><span>Yeni parola tekrar</span><input type="password" autoComplete="new-password" maxLength={128} required={!!newPassword} value={confirmation} onChange={e => setConfirmation(e.target.value)} /></label>
          <label className="admin-field--wide"><span>Mevcut parola ile onaylayın</span><input type="password" autoComplete="current-password" maxLength={1024} required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} /></label>
          {user.tfa_enabled && <label className="admin-field--wide"><span>Authenticator doğrulama kodu</span><input inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" required value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="000000" /></label>}
        </div>
      </fieldset>
      <div className="admin-post-editor__footer"><p role="status">{message || "Güncelleme mevcut parola ve etkinse Authenticator koduyla onaylanır."}</p><button type="submit" disabled={busy}>{busy ? <LoaderCircle className="admin-spinner" size={18} /> : <Save size={18} />} Bilgilerimi kaydet</button></div>
    </form>
  </section>;
}
