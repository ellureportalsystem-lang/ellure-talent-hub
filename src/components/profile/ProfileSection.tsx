import { useState, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Edit, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
}: ProfileSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card id={id} className="overflow-hidden scroll-mt-6">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors py-3 px-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2.5">
            <span className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              {icon}
            </span>
            <span>{title}</span>
            {badge && (
              <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full font-normal">
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
