import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Calendar, MapPin, IndianRupee, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Experience {
  id: number;
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
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const ExperienceSection = ({ experiences, viewMode, onEdit, onDelete }: ExperienceSectionProps) => {
  const canEdit = viewMode !== 'client';

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-border" />
      
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="relative pl-14">
            {/* Timeline Dot */}
            <div className={cn(
              "absolute left-4 top-2 w-4 h-4 rounded-full border-4 border-background",
              exp.isCurrent ? "bg-primary" : "bg-muted-foreground"
            )} />
            
            <div className="p-4 rounded-lg border hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  {/* Role & Company */}
                  <div>
                    <h4 className="font-semibold text-lg">{exp.designation}</h4>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{exp.company}</span>
                      <Badge variant="outline" className="text-xs">
                        {exp.employmentType}
                      </Badge>
                      {exp.isCurrent && (
                        <Badge className="text-xs">Current</Badge>
                      )}
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {exp.location}
                      </span>
                    )}
                    {exp.ctc && (
                      <span className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        {exp.ctc} LPA
                      </span>
                    )}
                  </div>

                  {/* Responsibilities */}
                  {exp.responsibilities && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {exp.responsibilities}
                    </p>
                  )}
                </div>

                {/* Actions */}
                {canEdit && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit?.(exp.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete?.(exp.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
