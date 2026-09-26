export type ContactContent = {
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
