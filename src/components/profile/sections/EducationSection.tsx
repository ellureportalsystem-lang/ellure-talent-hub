import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, Award, Edit, Trash2 } from "lucide-react";

interface Education {
  id: number;
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
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
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

  // Sort by year descending
  const sortedEducation = [...education].sort((a, b) => b.yearOfPassing - a.yearOfPassing);

  return (
    <div className="space-y-4">
      {sortedEducation.map((edu) => (
        <div 
          key={edu.id} 
          className="flex gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow group"
        >
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <Badge variant="outline" className="text-xs">
                    {typeLabels[edu.type]}
                  </Badge>
                </div>
                {edu.specialization && (
                  <p className="text-sm text-muted-foreground">{edu.specialization}</p>
                )}
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                {edu.board && (
                  <p className="text-xs text-muted-foreground">Board: {edu.board}</p>
                )}
              </div>
              
              {canEdit && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit?.(edu.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete?.(edu.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {edu.yearOfPassing}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Award className="h-4 w-4" />
                {edu.marks} ({edu.gradingSystem})
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationSection;
