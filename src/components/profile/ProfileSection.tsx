import { useState, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Edit, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { applicantProfileCard } from "@/components/dashboard/applicant/applicantProfileStyles";

interface ProfileSectionProps {
  id: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  canEdit?: boolean;
  canAdd?: boolean;
  onEdit?: () => void;
  onAdd?: () => void;
  defaultExpanded?: boolean;
  badge?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  variant?: "default" | "applicant";
}

const ProfileSection = ({
  id,
  title,
  icon,
  children,
  canEdit = false,
  canAdd = false,
  onEdit,
  onAdd,
  defaultExpanded = true,
  badge,
  isEmpty = false,
  emptyMessage = "No information added yet",
  variant = "default",
}: ProfileSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const isApplicant = variant === "applicant";

  return (
    <Card
      id={id}
      className={cn(
        "overflow-hidden scroll-mt-24",
        isApplicant ? applicantProfileCard : undefined
      )}
    >
      <CardHeader
        className={cn(
          "cursor-pointer py-3 px-4 transition-colors",
          isApplicant ? "hover:bg-[#f8fafc]" : "hover:bg-muted/50"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2.5 text-[#333]">
            <span
              className={cn(
                "h-7 w-7 rounded-md flex items-center justify-center flex-shrink-0",
                isApplicant ? "bg-[#f0f7ff] text-[#0566CD]" : "bg-primary/10 text-primary"
              )}
            >
              {icon}
            </span>
            <span>{title}</span>
            {badge && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-normal",
                  isApplicant ? "bg-[#f0f7ff] text-[#0566CD]" : "bg-primary/10 text-primary"
                )}
              >
                {badge}
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-1.5">
            {canAdd && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={(e) => { e.stopPropagation(); onAdd?.(); }}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            )}
            {canEdit && !isEmpty && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7">
              {isExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <CardContent className="pt-0 px-4 pb-4">
              {isEmpty ? (
                <div className="py-6 text-center text-muted-foreground">
                  <p className="text-sm">{emptyMessage}</p>
                  {canAdd && (
                    <Button variant="outline" size="sm" className="mt-3 h-8 text-xs" onClick={onAdd}>
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Add {title}
                    </Button>
                  )}
                </div>
              ) : (
                children
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ProfileSection;
