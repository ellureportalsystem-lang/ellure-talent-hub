import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit, Trash2, Code2 } from "lucide-react";

interface ITSkill {
  id: string | number;
  deletable?: boolean;
  name: string;
  version?: string;
  experience: number;
  proficiency: 'Beginner' | 'Intermediate' | 'Expert';
}

interface ITSkillsSectionProps {
  skills: ITSkill[];
  viewMode: 'applicant' | 'admin' | 'client';
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
}

const proficiencyValues: Record<string, number> = {
  'Beginner': 33,
  'Intermediate': 66,
  'Expert': 100
};

const ITSkillsSection = ({ skills, viewMode, onEdit, onDelete }: ITSkillsSectionProps) => {
  const canEdit = viewMode !== 'client';

  if (skills.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        No IT skills added yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-3 py-1.5 bg-muted/50 rounded-md text-xs font-medium text-muted-foreground">
        <div className="col-span-4">Skill</div>
        <div className="col-span-2">Version</div>
        <div className="col-span-2">Experience</div>
        <div className={canEdit ? "col-span-3" : "col-span-4"}>Proficiency</div>
        {canEdit && <div className="col-span-1">Actions</div>}
      </div>

      {skills.map((skill) => (
        <div
          key={skill.id}
          className="sm:grid sm:grid-cols-12 gap-3 px-3 py-2 rounded-md border hover:bg-muted/30 transition-colors group items-center flex flex-col sm:flex-row"
        >
          <div className="sm:col-span-4 flex items-center gap-1.5 w-full sm:w-auto">
            <Code2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <span className="text-sm font-medium truncate">{skill.name}</span>
          </div>
          <div className="sm:col-span-2 text-xs text-muted-foreground">
            {skill.version || '—'}
          </div>
          <div className="sm:col-span-2 text-xs">
            {skill.experience > 0 ? `${skill.experience} ${skill.experience === 1 ? 'yr' : 'yrs'}` : '—'}
          </div>
          <div className={canEdit ? "sm:col-span-3" : "sm:col-span-4"}>
            <div className="flex items-center gap-1.5">
              <Progress
                value={proficiencyValues[skill.proficiency]}
                className="h-1.5 flex-1"
              />
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 ${
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
            <div className="sm:col-span-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit?.(skill.id)}>
                <Edit className="h-3 w-3" />
              </Button>
              {skill.deletable !== false && (
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onDelete?.(skill.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ITSkillsSection;
