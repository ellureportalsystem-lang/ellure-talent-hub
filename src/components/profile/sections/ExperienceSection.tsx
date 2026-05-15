import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Calendar, MapPin, IndianRupee, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Experience {
  id: string | number;
  deletable?: boolean;
  company: string;
  designation: string;
  employmentType: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  responsibilities?: string;
  ctc?: number;
  noticePeriod?: string;
}

interface ExperienceSectionProps {
  experiences: Experience[];
  viewMode: 'applicant' | 'admin' | 'client';
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
}

const ExperienceSection = ({ experiences, viewMode, onEdit, onDelete }: ExperienceSectionProps) => {
  const canEdit = viewMode !== 'client';

  return (
    <div className="relative">
      <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-border" />

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative pl-12">
            <div className={cn(
              "absolute left-3 top-2 w-3.5 h-3.5 rounded-full border-[3px] border-background",
              exp.isCurrent ? "bg-primary" : "bg-muted-foreground"
            )} />

            <div className="p-3 rounded-lg border hover:shadow-sm transition-shadow group">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1.5 min-w-0">
                  <div>
                    <h4 className="text-sm font-semibold">{exp.designation}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                      <Building className="h-3 w-3 flex-shrink-0" />
                      <span>{exp.company}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {exp.employmentType}
                      </Badge>
                      {exp.isCurrent && (
                        <Badge className="text-[10px] px-1.5 py-0">Current</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate || 'N/A'}
                    </span>
                    {exp.location && exp.location !== 'N/A' && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {exp.location}
                      </span>
                    )}
                    {exp.ctc && exp.ctc > 0 && (
                      <span className="flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {exp.ctc} LPA
                      </span>
                    )}
                  </div>

                  {exp.responsibilities && exp.responsibilities !== 'Experience details from profile.' && exp.responsibilities !== 'No description provided' && (
                    <p className="text-xs text-muted-foreground mt-1">{exp.responsibilities}</p>
                  )}
                </div>

                {canEdit && (
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit?.(exp.id)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    {exp.deletable !== false && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete?.(exp.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;
