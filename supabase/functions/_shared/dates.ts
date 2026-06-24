const IST = "Asia/Kolkata";

export function formatIST(date: Date | string | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    timeZone: IST,
    dateStyle: "medium",
    timeStyle: "short",
    ...opts,
  });
}

export function formatISTDate(date: Date | string | null | undefined): string {
  return formatIST(date, { dateStyle: "medium", timeStyle: undefined });
}
