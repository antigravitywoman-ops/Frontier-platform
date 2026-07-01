export const DEMO_PROVIDER_DISPLAY_NAME = "John";
export const DEMO_CLINIC_DISPLAY_NAME = "Harborview Integrative Medicine";

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function fullName(first?: string | null, last?: string | null) {
  return [first, last].filter(Boolean).join(" ").trim();
}

export function isPlaceholderProviderName(first?: string | null, last?: string | null) {
  return normalizeKey(fullName(first, last)) === "jane smith";
}

export function isPlaceholderClinicName(name?: string | null) {
  const trimmed = name?.trim() ?? "";
  if (!trimmed) return true;
  const key = normalizeKey(trimmed);
  return key === "abc" || key === "test" || key === "test clinic";
}

export function resolveProviderDisplayName(
  first?: string | null,
  last?: string | null,
): string {
  if (isPlaceholderProviderName(first, last)) return DEMO_PROVIDER_DISPLAY_NAME;
  const name = fullName(first, last);
  return name || DEMO_PROVIDER_DISPLAY_NAME;
}

export function resolveClinicDisplayName(name?: string | null): string {
  if (isPlaceholderClinicName(name)) return DEMO_CLINIC_DISPLAY_NAME;
  return name?.trim() || DEMO_CLINIC_DISPLAY_NAME;
}

export function resolvePracticeContactNames(first?: string | null, last?: string | null) {
  if (isPlaceholderProviderName(first, last)) {
    return { first_name: "John", last_name: "" };
  }
  return {
    first_name: first?.trim() || "",
    last_name: last?.trim() || "",
  };
}
