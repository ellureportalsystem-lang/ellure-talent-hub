const IST = "Asia/Kolkata";

export function formatDateIST(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDateTimeIST(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export function formatLpa(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return `₹${amount.toFixed(2)} LPA`;
}
