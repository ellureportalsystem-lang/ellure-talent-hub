import { cn } from "@/lib/utils";

type CreditsRemainingBadgeProps = {
  label?: string;
  used: number;
  limit: number;
  unit?: string;
  className?: string;
  compact?: boolean;
};

export function CreditsRemainingBadge({
  label = "CV Access",
  used,
  limit,
  unit = "credits",
  className,
  compact = false,
}: CreditsRemainingBadgeProps) {
  const remaining = Math.max(0, limit - used);
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const low = remaining <= limit * 0.1;
  const warn = remaining <= limit * 0.25;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border bg-white px-2.5 py-1.5 shadow-sm",
        low ? "border-red-200 bg-red-50/80" : warn ? "border-amber-200 bg-amber-50/80" : "border-slate-200",
        className
      )}
      title={`${label}: ${remaining} of ${limit} ${unit} remaining this month`}
    >
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 leading-none">
          Credits remaining
        </p>
        {!compact && (
          <p className="text-[10px] text-slate-400 truncate max-w-[100px]">{label}</p>
        )}
        <p
          className={cn(
            "text-sm font-bold tabular-nums leading-tight",
            low ? "text-red-700" : warn ? "text-amber-700" : "text-[#0566CD]"
          )}
        >
          {remaining.toLocaleString()}
          <span className="text-[10px] font-normal text-slate-500"> / {limit.toLocaleString()}</span>
        </p>
      </div>
      <div className="hidden sm:block h-8 w-1 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={cn("w-full rounded-full transition-all", low ? "bg-red-500" : warn ? "bg-amber-500" : "bg-[#0566CD]")}
          style={{ height: `${100 - pct}%`, marginTop: `${pct}%` }}
        />
      </div>
    </div>
  );
}
