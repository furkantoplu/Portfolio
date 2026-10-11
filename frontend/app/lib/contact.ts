export type ContactContent = {
  section_visibility?: Record<string, boolean>;
  hero_title: string;
  hero_accent: string;
  intro: string;
  privacy_note: string;
  phone_display: string;
  phone_value?: string;
  whatsapp_value: string;
  email: string;
  address_title: string;
  address_note: string;
  working_days: string;
  working_hours: string;
  flow_title: string;
  flow_steps: Array<{ title: string; text: string }>;
};

export function phoneToDialValue(value: string) {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (!digits) return "";
  if (trimmed.startsWith("+")) return `+${digits}`;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("90")) return `+${digits}`;
  if (digits.startsWith("0")) return `+90${digits.slice(1)}`;
  if (digits.length === 10) return `+90${digits}`;
  return `+${digits}`;
}

export function phoneHref(content: Pick<ContactContent, "phone_display" | "phone_value">) {
  return `tel:${phoneToDialValue(content.phone_display) || content.phone_value || ""}`;
}

export function normalizeWhatsAppNumber(value: string | null | undefined): string | null {
  const input = (value || "").trim();
  if (!input || !/^\+?[\d\s().-]+$/.test(input)) return null;

  let digits = input.replace(/\D/g, "");
  if (input.startsWith("+") && digits.startsWith("0")) return null;
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) {
    if (!/^0[1-9]\d{9}$/.test(digits)) return null;
    digits = `90${digits.slice(1)}`;
  } else if (!input.startsWith("+") && /^5\d{9}$/.test(digits)) {
    digits = `90${digits}`;
  }

  return /^[1-9]\d{7,14}$/.test(digits) ? digits : null;
}

export function whatsAppHref(value: string | null | undefined): string | null {
  const number = normalizeWhatsAppNumber(value);
  return number ? `https://wa.me/${number}` : null;
}
