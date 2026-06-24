export function formatExpNaukri(years: number | null | undefined): string {
  if (years == null || Number.isNaN(years)) return "—";
  const y = Math.floor(years);
  const m = Math.round((years - y) * 12);
  return m > 0 ? `${y}y ${m}m` : `${y}y`;
}

export function formatLacs(amount: number | string | null | undefined): string {
  const n = Number(amount);
  if (!n || Number.isNaN(n)) return "—";
  return `₹ ${n.toFixed(2)} Lacs`;
}

export function splitSkills(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
