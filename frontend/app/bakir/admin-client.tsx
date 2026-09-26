"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LogOut,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { BrandMark } from "../components/brand-mark";

type AdminUser = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
};

type ContentItem = { status: "draft" | "published" | "hidden" };

type ContentSummary = {
  blog: ContentItem[];
  practices: ContentItem[];
};

type DirectusError = {
  errors?: Array<{ message?: string; extensions?: { code?: string } }>;
};

const apiBase = "/bakir-api";

async function directusRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as DirectusError | null;
    const error = new Error(payload?.errors?.[0]?.message || "İstek tamamlanamadı.");
    error.name = payload?.errors?.[0]?.extensions?.code || String(response.status);
    throw error;
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function countStatus(items: ContentItem[], status: ContentItem["status"]) {
  return items.filter((item) => item.status === status).length;
}

export function BakirAdmin() {
  const [sessionState, setSessionState] = useState<"checking" | "signed-out" | "signed-in">("checking");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [summary, setSummary] = useState<ContentSummary | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [setupPassword, setSetupPassword] = useState("");
  const [tfaSecret, setTfaSecret] = useState<string | null>(null);
  const [tfaOtp, setTfaOtp] = useState("");
  const [tfaMessage, setTfaMessage] = useState<string | null>(null);
  const [tfaBusy, setTfaBusy] = useState(false);

  const loadDashboard = useCallback(async () => {
    const [{ data: currentUser }, { data: blog }, { data: practices }] = await Promise.all([
      directusRequest<{ data: AdminUser }>("/users/me?fields=id,email,first_name,last_name"),
      directusRequest<{ data: ContentItem[] }>("/items/blog_posts?fields=status&limit=-1"),
      directusRequest<{ data: ContentItem[] }>("/items/practice_areas?fields=status&limit=-1"),
    ]);

    setUser(currentUser);
    setSummary({ blog, practices });
    setSessionState("signed-in");
  }, []);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        await loadDashboard();
      } catch {
        if (active) setSessionState("signed-out");
      }
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, [loadDashboard]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    try {
      await directusRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
          otp: otp.trim() || undefined,
          mode: "session",
        }),
      });
      setPassword("");
      setOtp("");
      await loadDashboard();
    } catch (error) {
      const code = error instanceof Error ? error.name : "";
      if (code === "INVALID_OTP") {
        setMessage("Doğrulama kodu hatalı veya süresi dolmuş. Yeni 6 haneli kodu girin.");
      } else if (code === "INVALID_CREDENTIALS" || code === "401") {
        setMessage("E-posta, parola veya doğrulama kodu doğru değil.");
      } else {
        setMessage("Yönetim servisine ulaşılamadı. Docker servislerinin açık olduğunu kontrol edin.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);
    await directusRequest("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ mode: "session" }),
    }).catch(() => undefined);
    setUser(null);
    setSummary(null);
    setSessionState("signed-out");
    setBusy(false);
  }

  async function generateTfa() {
    if (!setupPassword) {
      setTfaMessage("Google Authenticator kurulumu için mevcut parolanızı girin.");
      return;
    }

    setTfaBusy(true);
    setTfaMessage(null);
    try {
      const { data } = await directusRequest<{ data: { secret: string; otpauth_url: string } }>("/users/me/tfa/generate", {
        method: "POST",
        body: JSON.stringify({ password: setupPassword }),
      });
      setTfaSecret(data.secret);
      setSetupPassword("");
      setTfaMessage("Kurulum anahtarı oluşturuldu. Anahtarı Authenticator uygulamasına girin.");
    } catch {
      setTfaMessage("Kurulum başlatılamadı. Parolanızı kontrol edip yeniden deneyin.");
    } finally {
      setTfaBusy(false);
    }
  }

  async function enableTfa() {
    if (!tfaSecret || !/^\d{6}$/.test(tfaOtp)) {
      setTfaMessage("Authenticator uygulamasındaki güncel 6 haneli kodu girin.");
      return;
    }

    setTfaBusy(true);
    setTfaMessage(null);
    try {
      await directusRequest("/users/me/tfa/enable", {
        method: "POST",
        body: JSON.stringify({ secret: tfaSecret, otp: tfaOtp }),
      });
      setTfaSecret(null);
      setTfaOtp("");
      setTfaMessage("İki adımlı doğrulama etkinleştirildi. Bundan sonraki girişlerde 6 haneli kod istenecek.");
    } catch {
      setTfaMessage("Kod doğrulanamadı. Uygulamadaki yeni kodla tekrar deneyin.");
    } finally {
      setTfaBusy(false);
    }
  }

  if (sessionState === "checking") {
    return (
      <main className="admin-shell admin-shell--loading">
        <LoaderCircle className="admin-spinner" aria-hidden="true" />
        <p>Güvenli oturum kontrol ediliyor…</p>
      </main>
    );
  }

  if (sessionState === "signed-out") {
    return (
      <main className="admin-shell">
        <section className="admin-login" aria-labelledby="admin-login-title">
          <div className="admin-login__intro">
            <Link className="admin-brand" href="/" aria-label="Furkan Toplu ana sayfa">
              <BrandMark />
              <span><strong>Furkan Toplu</strong><small>İçerik yönetimi</small></span>
            </Link>
            <div>
              <p className="admin-eyebrow"><ShieldCheck size={17} aria-hidden="true" /> Güvenli yönetim alanı</p>
              <h1 id="admin-login-title">Site içeriğini<br /><em>tek yerden yönetin.</em></h1>
              <p>Blog yazıları ve çalışma alanları yalnızca yetkili hesap tarafından düzenlenebilir.</p>
            </div>
            <p className="admin-login__privacy">Bu sayfa arama motorlarına kapalıdır. Oturum bilgileri tarayıcıda erişilemeyen güvenli çerezle korunur.</p>
          </div>

          <div className="admin-login__form-wrap">
            <form className="admin-form" onSubmit={handleLogin}>
              <div className="admin-form__heading">
                <span>Yönetici girişi</span>
                <h2>Tekrar hoş geldiniz.</h2>
                <p>Devam etmek için yönetici bilgilerinizi girin.</p>
              </div>

              <label>
                <span>E-posta adresi</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required placeholder="ornek@alanadi.com" />
              </label>

              <label>
                <span>Parola</span>
                <div className="admin-password-field">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required placeholder="Parolanızı girin" />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Parolayı gizle" : "Parolayı göster"}>
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </label>

              <label>
                <span>6 haneli doğrulama kodu <small>Etkinse</small></span>
                <input className="admin-otp" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} autoComplete="one-time-code" placeholder="000000" />
              </label>

              {message && <p className="admin-form__message" role="alert">{message}</p>}

              <button className="admin-submit" type="submit" disabled={busy}>
                {busy ? <LoaderCircle className="admin-spinner" size={19} /> : <KeyRound size={19} />}
                Güvenli giriş
                {!busy && <ArrowRight size={18} />}
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  const userName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Yönetici";

  return (
    <main className="admin-shell admin-dashboard">
      <header className="admin-dashboard__header">
        <Link className="admin-brand admin-brand--light" href="/">
          <BrandMark />
          <span><strong>Furkan Toplu</strong><small>İçerik yönetimi</small></span>
        </Link>
        <div className="admin-user">
          <span><strong>{userName}</strong><small>{user?.email}</small></span>
          <button type="button" onClick={handleLogout} disabled={busy}><LogOut size={17} /> Çıkış</button>
        </div>
      </header>

      <div className="admin-dashboard__content">
        <section className="admin-welcome">
          <p className="admin-eyebrow"><CheckCircle2 size={17} /> Güvenli oturum açık</p>
          <h1>İçerikleriniz<br /><em>kontrolünüz altında.</em></h1>
          <p>Bu ilk yönetim paketinde güvenli giriş ve iki adımlı doğrulama hazırlandı. İçerik düzenleme ekranları sıradaki pakette bu alana eklenecek.</p>
        </section>

        <section className="admin-stat-grid" aria-label="İçerik özeti">
          <article>
            <BookOpenText aria-hidden="true" />
            <div><span>Blog yazıları</span><strong>{summary?.blog.length ?? 0}</strong></div>
            <p>{countStatus(summary?.blog ?? [], "published")} yayında · {countStatus(summary?.blog ?? [], "draft")} taslak</p>
          </article>
          <article>
            <Stethoscope aria-hidden="true" />
            <div><span>Çalışma alanları</span><strong>{summary?.practices.length ?? 0}</strong></div>
            <p>{countStatus(summary?.practices ?? [], "published")} yayında · {countStatus(summary?.practices ?? [], "hidden")} gizli</p>
          </article>
        </section>

        <section className="admin-security" aria-labelledby="tfa-title">
          <div className="admin-security__copy">
            <p className="admin-eyebrow"><ShieldCheck size={17} /> Hesap güvenliği</p>
            <h2 id="tfa-title">Google Authenticator kurulumu</h2>
            <p>Kurulum tamamlandığında e-posta ve parolaya ek olarak, her girişte telefonunuzdaki 6 haneli kod gerekir.</p>
          </div>

          <div className="admin-security__form">
            {!tfaSecret ? (
              <>
                <label><span>Mevcut parola</span><input type="password" value={setupPassword} onChange={(event) => setSetupPassword(event.target.value)} autoComplete="current-password" placeholder="Kurulumu doğrulamak için" /></label>
                <button type="button" onClick={generateTfa} disabled={tfaBusy}>{tfaBusy ? <LoaderCircle className="admin-spinner" size={18} /> : <KeyRound size={18} />} Kurulum anahtarı oluştur</button>
              </>
            ) : (
              <>
                <div className="admin-secret"><span>Authenticator kurulum anahtarı</span><code>{tfaSecret}</code><small>Google Authenticator → “Kurulum anahtarı gir” seçeneğini kullanın.</small></div>
                <label><span>Uygulamadaki 6 haneli kod</span><input className="admin-otp" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={tfaOtp} onChange={(event) => setTfaOtp(event.target.value.replace(/\D/g, ""))} autoComplete="one-time-code" placeholder="000000" /></label>
                <button type="button" onClick={enableTfa} disabled={tfaBusy}>{tfaBusy ? <LoaderCircle className="admin-spinner" size={18} /> : <ShieldCheck size={18} />} İki adımlı doğrulamayı etkinleştir</button>
              </>
            )}
            {tfaMessage && <p className="admin-security__message" role="status">{tfaMessage}</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
