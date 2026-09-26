"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  ShieldCheck,
  Stethoscope,
  UserPlus,
  Users,
} from "lucide-react";
import { BrandMark } from "../components/brand-mark";
import { directusRequest, type ContentItem } from "./admin-api";
import { BlogManager, type ManagedBlogPost } from "./blog-manager";
import { PracticeManager, type ManagedPracticeArea } from "./practice-manager";
import { PageManager, type ManagedSitePage } from "./page-manager";

type AdminUser = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  status: string;
  role: string;
  role_name: string | null;
  tfa_enabled: boolean;
  is_admin: boolean;
};

type AdminMember = Omit<AdminUser, "is_admin">;
type AdminView = "overview" | "blog" | "practices" | "pages" | "team" | "security";

type ContentSummary = {
  blog: ManagedBlogPost[];
  practices: ManagedPracticeArea[];
  pages: ManagedSitePage[];
};

function countStatus(items: ContentItem[], status: ContentItem["status"]) {
  return items.filter((item) => item.status === status).length;
}

export function BakirAdmin() {
  const [sessionState, setSessionState] = useState<"checking" | "signed-out" | "signed-in">("checking");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [summary, setSummary] = useState<ContentSummary | null>(null);
  const [team, setTeam] = useState<AdminMember[]>([]);
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
  const [newAdmin, setNewAdmin] = useState({ first_name: "", last_name: "", email: "", password: "" });
  const [teamBusy, setTeamBusy] = useState(false);
  const [teamMessage, setTeamMessage] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<AdminView>("overview");

  const loadDashboard = useCallback(async () => {
    const [{ data: currentUser }, { data: members }, { data: blog }, { data: practices }, { data: pages }] = await Promise.all([
      directusRequest<{ data: AdminUser }>("/website-content/admin-account"),
      directusRequest<{ data: AdminMember[] }>("/website-content/admin-team"),
      directusRequest<{ data: ManagedBlogPost[] }>("/items/blog_posts?fields=id,status,sort,featured,category,title,slug,summary,published_at,reading_minutes,lead,body_paragraphs,quote,closing_title,closing_body,seo_title,seo_description&sort=-published_at,sort&limit=-1"),
      directusRequest<{ data: ManagedPracticeArea[] }>("/items/practice_areas?fields=id,status,sort,show_on_homepage,title,slug,summary,hero_title,hero_accent,lead,overview_title,overview_accent,overview,assessment_points,process_steps,faqs,seo_title,seo_description&sort=sort,id&limit=-1"),
      directusRequest<{ data: ManagedSitePage[] }>("/items/site_pages?fields=id,page_key,content,seo_title,seo_description&sort=page_key&limit=-1"),
    ]);

    setUser(currentUser);
    setTeam(members);
    setSummary({ blog, practices, pages });
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
      setUser((current) => current ? { ...current, tfa_enabled: true } : current);
      setTfaMessage("İki adımlı doğrulama etkinleştirildi. Bundan sonraki girişlerde 6 haneli kod istenecek.");
    } catch {
      setTfaMessage("Kod doğrulanamadı. Uygulamadaki yeni kodla tekrar deneyin.");
    } finally {
      setTfaBusy(false);
    }
  }

  async function createAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user?.is_admin || !user.role) return;

    setTeamBusy(true);
    setTeamMessage(null);
    try {
      await directusRequest("/users", {
        method: "POST",
        body: JSON.stringify({
          ...newAdmin,
          email: newAdmin.email.trim(),
          role: user.role,
          status: "active",
        }),
      });
      const { data } = await directusRequest<{ data: AdminMember[] }>("/website-content/admin-team");
      setTeam(data);
      setNewAdmin({ first_name: "", last_name: "", email: "", password: "" });
      setTeamMessage("Yeni yönetici oluşturuldu. İlk girişinden sonra kendi Authenticator kurulumunu yapabilir.");
    } catch (error) {
      const code = error instanceof Error ? error.name : "";
      setTeamMessage(code === "RECORD_NOT_UNIQUE" ? "Bu e-posta adresiyle zaten bir hesap var." : "Yönetici oluşturulamadı. Bilgileri ve parola kurallarını kontrol edin.");
    } finally {
      setTeamBusy(false);
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
            <Link className="admin-brand" href="/" prefetch={false} aria-label="Furkan Toplu ana sayfa">
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

  const navigation: Array<{ id: AdminView; label: string; icon: typeof LayoutDashboard; adminOnly?: boolean }> = [
    { id: "overview", label: "Genel bakış", icon: LayoutDashboard },
    { id: "blog", label: "Blog yazıları", icon: BookOpenText },
    { id: "practices", label: "Çalışma alanları", icon: Stethoscope },
    { id: "pages", label: "Sayfa içerikleri", icon: FileText },
    { id: "team", label: "Yöneticiler", icon: Users, adminOnly: true },
    { id: "security", label: "Hesap güvenliği", icon: ShieldCheck },
  ];

  return (
    <main className="admin-shell admin-dashboard">
      <header className="admin-dashboard__header">
        <Link className="admin-brand admin-brand--light" href="/" prefetch={false}>
          <BrandMark />
          <span><strong>Furkan Toplu</strong><small>İçerik yönetimi</small></span>
        </Link>
        <div className="admin-user">
          <span><strong>{userName}</strong><small>{user?.email}</small></span>
          <button type="button" onClick={handleLogout} disabled={busy}><LogOut size={17} /> Çıkış</button>
        </div>
      </header>

      <div className="admin-dashboard__body">
        <aside className="admin-sidebar" aria-label="Yönetim menüsü">
          <nav>
            {navigation.filter((item) => !item.adminOnly || user?.is_admin).map((item) => {
              const Icon = item.icon;
              return (
                <button className={activeView === item.id ? "is-active" : ""} type="button" key={item.id} onClick={() => setActiveView(item.id)}>
                  <Icon size={18} /><span>{item.label}</span>
                  {item.id === "blog" && <small>{summary?.blog.length ?? 0}</small>}
                  {item.id === "practices" && <small>{summary?.practices.length ?? 0}</small>}
                </button>
              );
            })}
          </nav>
          <div className="admin-sidebar__footer">
            <span><strong>{userName}</strong><small>{user?.role_name || "Yönetici"}</small></span>
            <Link href="/" prefetch={false} target="_blank">Siteyi görüntüle <ArrowRight size={14} /></Link>
          </div>
        </aside>

        <div className="admin-dashboard__content">
          {activeView === "overview" && (
            <>
              <section className="admin-welcome">
                <p className="admin-eyebrow"><CheckCircle2 size={17} /> Güvenli oturum açık</p>
                <h1>İçerikleriniz<br /><em>kontrolünüz altında.</em></h1>
                <p>Sol menüden yönetmek istediğiniz bölüme doğrudan geçebilirsiniz. Her bölüm kendi çalışma ekranında açılır.</p>
              </section>

              <section className="admin-stat-grid" aria-label="İçerik özeti">
                <button type="button" onClick={() => setActiveView("blog")}>
                  <BookOpenText aria-hidden="true" />
                  <div><span>Blog yazıları</span><strong>{summary?.blog.length ?? 0}</strong></div>
                  <p>{countStatus(summary?.blog ?? [], "published")} yayında · {countStatus(summary?.blog ?? [], "draft")} taslak</p>
                </button>
                <button type="button" onClick={() => setActiveView("practices")}>
                  <Stethoscope aria-hidden="true" />
                  <div><span>Çalışma alanları</span><strong>{summary?.practices.length ?? 0}</strong></div>
                  <p>{countStatus(summary?.practices ?? [], "published")} yayında · {countStatus(summary?.practices ?? [], "hidden")} gizli</p>
                </button>
              </section>

              <section className="admin-overview-note">
                <ShieldCheck size={24} />
                <div><strong>Hesabınız korunuyor</strong><p>{user?.tfa_enabled ? "Google Authenticator bu hesap için aktif." : "Hesap güvenliği bölümünden Google Authenticator kurulumunu tamamlayın."}</p></div>
                <button type="button" onClick={() => setActiveView("security")}>Güvenliğe git <ArrowRight size={15} /></button>
              </section>
            </>
          )}

          {activeView === "blog" && <BlogManager posts={summary?.blog ?? []} onChanged={loadDashboard} />}

          {activeView === "practices" && <PracticeManager areas={summary?.practices ?? []} onChanged={loadDashboard} />}

          {activeView === "pages" && <PageManager pages={summary?.pages ?? []} onChanged={loadDashboard} />}

          {activeView === "security" && (
            <section className={`admin-security${user?.tfa_enabled ? " admin-security--enabled" : ""}`} aria-labelledby="tfa-title">
              <div className="admin-security__copy">
                <p className="admin-eyebrow"><ShieldCheck size={17} /> Hesap güvenliği</p>
                <h2 id="tfa-title">{user?.tfa_enabled ? "İki adımlı doğrulama aktif" : "Google Authenticator kurulumu"}</h2>
                <p>{user?.tfa_enabled ? `${user.email} hesabı her girişte telefonunuzdaki 6 haneli kodla korunuyor.` : "Kurulum tamamlandığında e-posta ve parolaya ek olarak, her girişte telefonunuzdaki 6 haneli kod gerekir."}</p>
              </div>

              <div className="admin-security__form">
                {user?.tfa_enabled ? (
                  <div className="admin-security__active">
                    <CheckCircle2 size={34} aria-hidden="true" />
                    <div><strong>Authenticator bağlı</strong><span>Her yönetici bu güvenliği kendi hesabı ve kendi telefonu için ayrı kurar.</span></div>
                  </div>
                ) : !tfaSecret ? (
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
          )}

          {activeView === "team" && user?.is_admin && (
            <section className="admin-team" aria-labelledby="admin-team-title">
              <div className="admin-team__heading">
                <div>
                  <p className="admin-eyebrow"><Users size={17} /> Yönetici ekibi</p>
                  <h2 id="admin-team-title">Birden fazla yönetici,<br /><em>ayrı ve güvenli hesaplar.</em></h2>
                </div>
                <p>Ortak parola kullanılmaz. Her yönetici kendi e-postası, parolası ve Authenticator kurulumu ile giriş yapar; işlemler hesabına göre kaydedilir.</p>
              </div>

              <div className="admin-team__layout">
                <div className="admin-team__members">
                  {team.map((member) => (
                    <article key={member.id}>
                      <div className="admin-team__avatar">{(member.first_name?.[0] || member.email[0]).toLocaleUpperCase("tr-TR")}</div>
                      <div><strong>{[member.first_name, member.last_name].filter(Boolean).join(" ") || "Yönetici"}</strong><span>{member.email}</span></div>
                      <span className={member.tfa_enabled ? "is-secure" : "is-pending"}>{member.tfa_enabled ? "2FA aktif" : "2FA bekliyor"}</span>
                    </article>
                  ))}
                </div>

                <form className="admin-team__form" onSubmit={createAdmin}>
                  <div><UserPlus size={20} /><strong>Yeni yönetici ekle</strong></div>
                  <div className="admin-team__names">
                    <label><span>Ad</span><input value={newAdmin.first_name} onChange={(event) => setNewAdmin((current) => ({ ...current, first_name: event.target.value }))} required /></label>
                    <label><span>Soyad</span><input value={newAdmin.last_name} onChange={(event) => setNewAdmin((current) => ({ ...current, last_name: event.target.value }))} required /></label>
                  </div>
                  <label><span>E-posta</span><input type="email" value={newAdmin.email} onChange={(event) => setNewAdmin((current) => ({ ...current, email: event.target.value }))} autoComplete="off" required /></label>
                  <label><span>Geçici parola</span><input type="password" value={newAdmin.password} onChange={(event) => setNewAdmin((current) => ({ ...current, password: event.target.value }))} minLength={10} autoComplete="new-password" required /><small>En az 10 karakter; büyük/küçük harf, rakam ve sembol içermeli.</small></label>
                  <button type="submit" disabled={teamBusy}>{teamBusy ? <LoaderCircle className="admin-spinner" size={18} /> : <UserPlus size={18} />} Yönetici hesabını oluştur</button>
                  {teamMessage && <p role="status">{teamMessage}</p>}
                </form>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
