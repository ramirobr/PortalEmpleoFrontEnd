export function normalizeWebsiteUrl(value?: string | null): string {
  const trimmedValue = value?.trim() ?? "";

  if (!trimmedValue) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  return `https://${trimmedValue.replace(/^\/+/, "")}`;
}

export function getWebsiteDisplayUrl(value?: string | null): string {
  return normalizeWebsiteUrl(value)
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "");
}
