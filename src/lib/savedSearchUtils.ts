export type SavedSearchRow = {
  id: string;
  name: string;
  filters?: Record<string, unknown> | null;
  search_query?: string | null;
  last_run_at?: string | null;
};

export function getSavedSearchQuery(row: SavedSearchRow): string {
  const fromFilters = (row.filters as { q?: string } | null)?.q;
  return row.search_query?.trim() || fromFilters?.trim() || row.name;
}

export function formatSavedSearchMeta(row: SavedSearchRow): string {
  const f = (row.filters ?? {}) as Record<string, unknown>;
  const parts: string[] = [];

  const exp = f.experienceRange;
  if (Array.isArray(exp) && exp.length === 2) {
    const [min, max] = exp as number[];
    if (min > 0 || max < 30) parts.push(`${min}-${max} years`);
  }

  const cities = f.currentCity;
  if (Array.isArray(cities) && cities.length) {
    parts.push(cities.join(", "));
  }

  const skills = f.skills;
  if (Array.isArray(skills) && skills.length) {
    parts.push(skills.slice(0, 2).join(", "));
  }

  return parts.join(" | ") || "—";
}

export function buildSavedSearchResultsUrl(row: SavedSearchRow): string {
  const q = getSavedSearchQuery(row);
  return `/dashboard/client/resdex/results?q=${encodeURIComponent(q)}`;
}

export function buildRecentSearchResultsUrl(query: string): string {
  return `/dashboard/client/resdex/results?q=${encodeURIComponent(query.trim())}`;
}
