import { CheckCircle2, KeyRound, LoaderCircle, ShieldCheck } from "lucide-react";
import { AuthenticatorQr } from "./authenticator-qr";

type Props = {
  email: string; enabled: boolean; mandatory?: boolean; busy: boolean;
  password: string; secret: string | null; qr: string | null; otp: string; message: string | null;
  onPassword: (value: string) => void; onOtp: (value: string) => void;
  onGenerate: () => Promise<void>; onEnable: () => Promise<void>;
};
export function SecurityPanel(props: Props) {
  return (
    <section className={`admin-security${props.enabled ? " admin-security--enabled" : ""}`} aria-labelledby="tfa-title">
      <div className="admin-security__copy">
        <p className="admin-eyebrow"><ShieldCheck size={17} /> Hesap güvenliği</p>
        <h2 id="tfa-title">{props.enabled ? "İki adımlı doğrulama aktif" : props.mandatory ? "Authenticator kurulumu zorunlu" : "Google Authenticator kurulumu"}</h2>
        <p>{props.enabled ? `${props.email} hesabı her girişte telefonunuzdaki 6 haneli kodla korunuyor.` : "Kurulumu tamamlamadan içeriklere ve yönetici ekibine erişemezsiniz. QR kodu kendi telefonunuzla tarayın; ardından 6 haneli kodla doğrulayın."}</p>
      </div>
      <form className="admin-security__form" onSubmit={event => { event.preventDefault(); if (!props.busy) void (props.secret ? props.onEnable() : props.onGenerate()); }}>
        {props.enabled ? (
          <div className="admin-security__active"><CheckCircle2 size={34} aria-hidden="true" /><div><strong>Authenticator bağlı</strong><span>Her yönetici bu güvenliği kendi hesabı ve kendi telefonu için ayrı kurar.</span></div></div>
        ) : !props.secret ? (
          <>
            <label><span>Mevcut parola</span><input type="password" value={props.password} onChange={event => props.onPassword(event.target.value)} autoComplete="current-password" placeholder="Kurulumu doğrulamak için" required /></label>
            <button type="submit" disabled={props.busy}>{props.busy ? <LoaderCircle className="admin-spinner" size={18} /> : <KeyRound size={18} />} Kurulum anahtarı ve QR oluştur</button>
          </>
        ) : (
          <>
            <AuthenticatorQr qrDataUrl={props.qr} secret={props.secret} />
            <label><span>Uygulamadaki 6 haneli kod</span><input className="admin-otp" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={props.otp} onChange={event => props.onOtp(event.target.value.replace(/\D/g, ""))} autoComplete="one-time-code" placeholder="000000" required /></label>
            <button type="submit" disabled={props.busy}>{props.busy ? <LoaderCircle className="admin-spinner" size={18} /> : <ShieldCheck size={18} />} İki adımlı doğrulamayı etkinleştir</button>
          </>
        )}
        {props.message && <p className="admin-security__message" role="status">{props.message}</p>}
      </form>
    </section>
  );
}
