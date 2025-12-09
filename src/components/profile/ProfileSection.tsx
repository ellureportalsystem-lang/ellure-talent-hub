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
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-3">
            <span className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </span>
            <span>{title}</span>
            {badge && (
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {badge}
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {canAdd && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => { e.stopPropagation(); onAdd?.(); }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
            {canEdit && !isEmpty && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
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
            <CardContent className="pt-0">
              {isEmpty ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p>{emptyMessage}</p>
                  {canAdd && (
                    <Button variant="outline" className="mt-4" onClick={onAdd}>
                      <Plus className="h-4 w-4 mr-2" />
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
