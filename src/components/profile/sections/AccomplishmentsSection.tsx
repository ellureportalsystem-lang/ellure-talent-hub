import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, FileText, Presentation, BookOpen, Medal, GraduationCap, Edit, Trash2, ExternalLink } from "lucide-react";

interface Accomplishment {
  id: number;
  type: 'certification' | 'publication' | 'presentation' | 'patent' | 'award' | 'course';
  title: string;
  issuer?: string;
  date?: string;
  link?: string;
  description?: string;
}

interface AccomplishmentsSectionProps {
  accomplishments: Accomplishment[];
  viewMode: 'applicant' | 'admin' | 'client';
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const typeIcons: Record<string, any> = {
  certification: Award,
  publication: FileText,
  presentation: Presentation,
  patent: BookOpen,
  award: Medal,
  course: GraduationCap,
};

const typeLabels: Record<string, string> = {
  certification: 'Certification',
  publication: 'Publication',
  presentation: 'Presentation',
  patent: 'Patent',
  award: 'Award',
  course: 'Course',
};

const AccomplishmentsSection = ({ accomplishments, viewMode, onEdit, onDelete }: AccomplishmentsSectionProps) => {
  const canEdit = viewMode !== 'client';
  
  // Group by type
  const grouped = accomplishments.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, Accomplishment[]>);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([type, items]) => {
        const Icon = typeIcons[type];
        return (
          <div key={type} className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-sm">
              <Icon className="h-4 w-4 text-primary" />
              {typeLabels[type]}s ({items.length})
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 rounded-lg border hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium">{item.title}</h5>
                        {item.link && (
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      {item.issuer && (
                        <p className="text-sm text-muted-foreground">{item.issuer}</p>
                      )}
                      {item.date && (
                        <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                      )}
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    {canEdit && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit?.(item.id)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete?.(item.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AccomplishmentsSection;
