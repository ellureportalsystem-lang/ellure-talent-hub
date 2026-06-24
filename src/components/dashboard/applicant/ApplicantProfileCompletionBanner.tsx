import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { applicantProfileCard } from "./applicantProfileStyles";

type CompletionItem = {
  id: string;
  label: string;
  completed: boolean;
  section: string;
};

type ApplicantProfileCompletionBannerProps = {
  percentage: number;
  items: CompletionItem[];
  onGoToSection: (sectionId: string) => void;
  onDismiss?: () => void;
  className?: string;
};

export function ApplicantProfileCompletionBanner({
  percentage,
  items,
  onGoToSection,
  onDismiss,
  className,
}: ApplicantProfileCompletionBannerProps) {
  if (percentage >= 100) return null;

  const nextItem = items.find((i) => !i.completed);
  if (!nextItem) return null;

  return (
    <div className={cn(applicantProfileCard, "p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-semibold text-[#333]">Complete your profile</p>
          <p className="text-xs text-muted-foreground">
            Next step: <span className="font-medium text-foreground">{nextItem.label}</span>
          </p>
          <Progress value={percentage} className="h-2 bg-[#eef4fb] [&>div]:bg-[#0566CD]" />
          <p className="text-[11px] text-muted-foreground">{percentage}% complete</p>
        </div>
        {onDismiss && (
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        size="sm"
        className="mt-3 h-8 w-full text-xs"
        onClick={() => onGoToSection(nextItem.section)}
      >
        Continue profile
        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
