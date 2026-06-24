const STORAGE_PREFIX = "ellure_resdex_recent";

function storageKey(clientId: string) {
  return `${STORAGE_PREFIX}:${clientId}`;
}

export function loadRecentResdexSearches(clientId: string | undefined): string[] {
  if (!clientId) return [];
  try {
    const raw = sessionStorage.getItem(storageKey(clientId));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveRecentResdexSearch(clientId: string | undefined, query: string) {
  const trimmed = query.trim();
  if (!clientId || !trimmed) return;
  const prev = loadRecentResdexSearches(clientId).filter((q) => q !== trimmed);
  sessionStorage.setItem(storageKey(clientId), JSON.stringify([trimmed, ...prev].slice(0, 10)));
}
