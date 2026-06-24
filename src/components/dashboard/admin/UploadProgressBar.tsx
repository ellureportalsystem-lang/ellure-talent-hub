import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface UploadProgressBarProps {
  value: number;
  label?: string;
  detail?: string;
  active?: boolean;
  className?: string;
}

/** 0–100% upload/import progress with label and optional detail line */
export function UploadProgressBar({
  value,
  label = "Progress",
  detail,
  active = false,
  className,
}: UploadProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-foreground flex items-center gap-2">
          {active && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
          {label}
        </span>
        <span className="tabular-nums font-semibold text-primary">{pct}%</span>
      </div>
      <Progress value={pct} className="h-2.5" />
      {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
    </div>
  );
}
