import Image from "next/image";

export function AuthenticatorQr({ qrDataUrl, secret }: { qrDataUrl: string | null; secret: string }) {
  return <div className="admin-authenticator-setup">
    {qrDataUrl && <div className="admin-authenticator-qr">
      <Image src={qrDataUrl} unoptimized width={240} height={240} alt="Google Authenticator hesabını eklemek için kurulum QR kodu" />
      <p>Google Authenticator → <strong>+</strong> → <strong>QR kod tara</strong></p>
    </div>}
    <p className="admin-authenticator-instruction">QR kodu taradıktan sonra uygulamada görünen güncel 6 haneli kodu aşağıya girip kurulumu tamamlayın.</p>
    <details className="admin-authenticator-manual" open={!qrDataUrl}>
      <summary>QR kodu tarayamıyorum — anahtarı elle gir</summary>
      <div className="admin-secret"><span>Authenticator kurulum anahtarı</span><code>{secret}</code><small>Google Authenticator → “Kurulum anahtarı gir”. Anahtar türünü “Zamana dayalı” seçin.</small></div>
    </details>
    <p className="admin-authenticator-warning">QR kodu ve anahtarı paylaşmayın. Kurulum, doğrulama kodu onaylanınca etkinleşir. Telefon ve sunucu saatleri doğru olmalıdır.</p>
  </div>;
}
