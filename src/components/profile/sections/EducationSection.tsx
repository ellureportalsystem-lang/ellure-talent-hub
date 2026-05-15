import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, Award, Edit, Trash2 } from "lucide-react";

interface Education {
  id: string | number;
  deletable?: boolean;
  degree: string;
  specialization?: string;
  institution: string;
  board?: string;
  yearOfPassing: number;
  gradingSystem: string;
  marks: string;
  type: 'school' | 'diploma' | 'graduation' | 'post-graduation' | 'doctorate';
}

interface EducationSectionProps {
  education: Education[];
  viewMode: 'applicant' | 'admin' | 'client';
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
}

const typeLabels: Record<string, string> = {
  'school': 'School',
  'diploma': 'Diploma',
  'graduation': 'Graduation',
  'post-graduation': 'Post Graduation',
  'doctorate': 'Doctorate'
};

const EducationSection = ({ education, viewMode, onEdit, onDelete }: EducationSectionProps) => {
  const canEdit = viewMode !== 'client';
  const sortedEducation = [...education].sort((a, b) => b.yearOfPassing - a.yearOfPassing);

  return (
    <div className="space-y-3">
      {sortedEducation.map((edu) => (
        <div
          key={edu.id}
          className="flex gap-3 p-3 rounded-lg border hover:shadow-sm transition-shadow group"
        >
          <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-sm font-semibold">{edu.degree}</h4>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {typeLabels[edu.type] || edu.type}
                  </Badge>
                </div>
                {edu.specialization && edu.specialization !== 'N/A' && (
                  <p className="text-xs text-muted-foreground">{edu.specialization}</p>
                )}
                {edu.institution && edu.institution !== 'N/A' && (
                  <p className="text-xs text-muted-foreground">{edu.institution}</p>
                )}
              </div>

              {canEdit && (
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit?.(edu.id)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  {edu.deletable !== false && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete?.(edu.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-1.5 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {edu.yearOfPassing}
              </span>
              {edu.marks && edu.marks !== 'N/A' && edu.marks !== '0' && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Award className="h-3 w-3" />
                  {edu.marks} ({edu.gradingSystem})
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationSection;
