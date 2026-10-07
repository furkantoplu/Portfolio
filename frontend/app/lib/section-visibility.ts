export type SectionVisibility = Record<string, boolean>;
export function readSectionVisibility(value: unknown): SectionVisibility {
  return value && typeof value === "object" && !Array.isArray(value) ? Object.fromEntries(Object.entries(value).filter(([, flag]) => typeof flag === "boolean")) : {};
}
export function isSectionVisible(visibility: unknown, key: string): boolean {
  return !(visibility && typeof visibility === "object" && !Array.isArray(visibility) && (visibility as Record<string, unknown>)[key] === false);
}
