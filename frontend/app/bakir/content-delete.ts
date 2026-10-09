import { directusRequest } from "./admin-api";

export type DeletableCollection = "blog_posts" | "practice_areas";

export function deletionConfirmed(value: string): boolean {
  return value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() === "SIL";
}

export async function deleteContentItem(
  collection: DeletableCollection,
  id: number,
  confirmation: string,
  request: (path: string, init: RequestInit) => Promise<unknown> = directusRequest,
): Promise<void> {
  if (!["blog_posts", "practice_areas"].includes(collection) || !Number.isSafeInteger(id) || id <= 0 || !deletionConfirmed(confirmation)) {
    throw new Error("Silinecek kayıt ve onay geçersiz.");
  }
  await request(`/items/${collection}/${id}`, { method: "DELETE" });
}
