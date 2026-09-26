export type ContentItem = { status: "draft" | "published" | "hidden" };

type DirectusError = {
  errors?: Array<{ message?: string; extensions?: { code?: string } }>;
};

const apiBase = "/bakir-api";

export async function directusRequest<T>(path: string, init?: RequestInit): Promise<T> {
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
