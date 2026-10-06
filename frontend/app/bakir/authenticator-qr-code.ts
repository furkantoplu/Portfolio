import QRCode from "qrcode";

export async function createAuthenticatorQr(secret: string, otpauthUrl: string): Promise<string> {
  const uri = new URL(otpauthUrl);
  if (uri.protocol !== "otpauth:" || uri.hostname !== "totp" || !secret || uri.searchParams.get("secret") !== secret) {
    throw new Error("Authenticator kurulum bağlantısı geçersiz.");
  }
  // Encode locally: never transmit the account's secret to an external QR service.
  return QRCode.toDataURL(otpauthUrl, { type: "image/png", width: 240, margin: 4, errorCorrectionLevel: "M", color: { dark: "#000000", light: "#ffffff" } });
}
