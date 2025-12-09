import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit, Trash2, Code2 } from "lucide-react";

interface ITSkill {
  id: number;
  name: string;
  version?: string;
  experience: number;
  proficiency: 'Beginner' | 'Intermediate' | 'Expert';
}

interface ITSkillsSectionProps {
  skills: ITSkill[];
  viewMode: 'applicant' | 'admin' | 'client';
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const proficiencyColors: Record<string, string> = {
  'Beginner': 'bg-yellow-500',
  'Intermediate': 'bg-blue-500',
  'Expert': 'bg-green-500'
};

const proficiencyValues: Record<string, number> = {
  'Beginner': 33,
  'Intermediate': 66,
  'Expert': 100
};

const ITSkillsSection = ({ skills, viewMode, onEdit, onDelete }: ITSkillsSectionProps) => {
  const canEdit = viewMode !== 'client';

  return (
    <div className="space-y-3">
      {/* Header Row */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
        <div className="col-span-4">Skill</div>
        <div className="col-span-2">Version</div>
        <div className="col-span-2">Experience</div>
        <div className="col-span-3">Proficiency</div>
        {canEdit && <div className="col-span-1">Actions</div>}
      </div>

      {/* Skill Rows */}
      {skills.map((skill) => (
        <div 
          key={skill.id}
          className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg border hover:bg-muted/30 transition-colors group items-center"
        >
          <div className="col-span-4 flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            <span className="font-medium">{skill.name}</span>
          </div>
          <div className="col-span-2 text-sm text-muted-foreground">
            {skill.version || '—'}
          </div>
          <div className="col-span-2 text-sm">
            {skill.experience} {skill.experience === 1 ? 'year' : 'years'}
          </div>
          <div className="col-span-3">
            <div className="flex items-center gap-2">
              <Progress 
                value={proficiencyValues[skill.proficiency]} 
                className="h-2 flex-1"
              />
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  skill.proficiency === 'Expert' ? 'border-green-500 text-green-600' :
                  skill.proficiency === 'Intermediate' ? 'border-blue-500 text-blue-600' :
                  'border-yellow-500 text-yellow-600'
                }`}
              >
                {skill.proficiency}
              </Badge>
            </div>
          </div>
          {canEdit && (
            <div className="col-span-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit?.(skill.id)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete?.(skill.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ITSkillsSection;
