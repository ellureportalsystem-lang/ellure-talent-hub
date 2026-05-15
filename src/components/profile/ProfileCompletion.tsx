import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompletionItem {
  id: string;
  label: string;
  completed: boolean;
  section: string;
}

interface ProfileCompletionProps {
  percentage: number;
  items: CompletionItem[];
  onItemClick: (sectionId: string) => void;
}

const ProfileCompletion = ({ percentage, items, onItemClick }: ProfileCompletionProps) => {
  const completedCount = items.filter(i => i.completed).length;

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Profile Completion</span>
          <span className={cn(
            "text-xl font-bold",
            percentage >= 80 && "text-green-600",
            percentage >= 50 && percentage < 80 && "text-yellow-600",
            percentage < 50 && "text-red-600"
          )}>
            {percentage}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <div className="space-y-1.5">
          <Progress value={percentage} className="h-2" />
          <p className="text-[11px] text-muted-foreground text-center">
            {completedCount} of {items.length} sections completed
          </p>
        </div>

        <div className={cn(
          "p-2 rounded-md text-xs",
          percentage >= 80 && "bg-green-500/10 text-green-700",
          percentage >= 50 && percentage < 80 && "bg-yellow-500/10 text-yellow-700",
          percentage < 50 && "bg-red-500/10 text-red-700"
        )}>
          {percentage >= 80 && (
            <p className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Great! Your profile is almost complete.
            </p>
          )}
          {percentage >= 50 && percentage < 80 && (
            <p className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Add more details to improve visibility.
            </p>
          )}
          {percentage < 50 && (
            <p className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Complete your profile to get noticed!
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <h4 className="font-medium text-xs">Pending Items</h4>
          <div className="space-y-0.5 max-h-[280px] overflow-y-auto">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item.section)}
                className={cn(
                  "w-full flex items-center gap-2 p-1.5 rounded-md text-xs text-left transition-colors",
                  item.completed
                    ? "text-muted-foreground"
                    : "hover:bg-muted cursor-pointer"
                )}
              >
                {item.completed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={item.completed ? "line-through" : ""}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletion;
