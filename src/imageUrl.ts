/** Resolve server image paths without changing signed URLs or local previews. */
export function resolveApiImageUrl(value: string | null | undefined, apiBase = import.meta.env.VITE_API_BASE_URL || ''): string | undefined {
  const path = value?.trim();
  if (!path) return undefined;
  if (/^(https?:|blob:|data:image\/)/i.test(path)) return path;
  try {
    const base = new URL(apiBase);
    if (!/^https?:$/.test(base.protocol)) return undefined;
    const url = new URL(path, base.origin + '/');
    return /^https?:$/.test(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
