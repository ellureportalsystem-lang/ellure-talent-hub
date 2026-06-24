import { format } from "date-fns";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ApplicationStageRow = {
  id: string;
  stage: string;
  changed_at: string | null;
  notes?: string | null;
};

const STAGE_LABELS: Record<string, string> = {
  applied: "Applied",
  screening: "Screening",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview scheduled",
  interviewed: "Interviewed",
  offer: "Offer",
  offered: "Offer",
  hired: "Hired",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

type ApplicationStageTimelineProps = {
  stages: ApplicationStageRow[];
  appliedAt?: string | null;
  currentStage?: string | null;
  className?: string;
};

export function ApplicationStageTimeline({
  stages,
  appliedAt,
  currentStage,
  className,
}: ApplicationStageTimelineProps) {
  const timeline =
    stages.length > 0
      ? stages
      : appliedAt
        ? [
            {
              id: "applied-fallback",
              stage: currentStage || "applied",
              changed_at: appliedAt,
              notes: null,
            },
          ]
        : [];

  if (timeline.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">No status updates yet.</p>
    );
  }

  return (
    <ol className={cn("space-y-0", className)}>
      {timeline.map((row, index) => {
        const isLast = index === timeline.length - 1;
        const isCurrent = row.stage === currentStage && isLast;
        return (
          <li key={row.id} className="relative flex gap-3 pb-4 last:pb-0">
            {!isLast && (
              <span className="absolute left-[7px] top-4 h-full w-px bg-border" aria-hidden />
            )}
            {isCurrent ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0566CD]" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <div className="min-w-0 pt-0.5">
              <p className="text-xs font-medium">
                {STAGE_LABELS[row.stage] ?? row.stage.replace(/_/g, " ")}
              </p>
              {row.changed_at && (
                <p className="text-[11px] text-muted-foreground">
                  {format(new Date(row.changed_at), "dd MMM yyyy, h:mm a")}
                </p>
              )}
              {row.notes && (
                <p className="mt-1 text-[11px] text-muted-foreground">{row.notes}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
