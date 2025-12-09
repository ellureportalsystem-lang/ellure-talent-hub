import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Plus, Sparkles, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface SkillsSectionProps {
  skills: string[];
  viewMode: 'applicant' | 'admin' | 'client';
  onUpdateSkills?: (skills: string[]) => void;
}

const suggestedSkills = [
  "React", "Node.js", "Python", "Java", "AWS", "Docker", "Kubernetes",
  "TypeScript", "MongoDB", "PostgreSQL", "GraphQL", "REST API",
  "Machine Learning", "Data Analysis", "Agile", "Scrum", "Git"
];

const SkillsSection = ({ skills, viewMode, onUpdateSkills }: SkillsSectionProps) => {
  const [currentSkills, setCurrentSkills] = useState<string[]>(skills);
  const [newSkill, setNewSkill] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const maxSkillsLength = 250;
  
  const totalChars = currentSkills.join(", ").length;
  const canEdit = viewMode !== 'client';

  const handleAddSkill = (skill: string) => {
    if (!skill.trim()) return;
    if (currentSkills.includes(skill)) {
      toast.error("Skill already added");
      return;
    }
    const newSkills = [...currentSkills, skill.trim()];
    if (newSkills.join(", ").length > maxSkillsLength) {
      toast.error("Maximum character limit reached");
      return;
    }
    setCurrentSkills(newSkills);
    onUpdateSkills?.(newSkills);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const newSkills = currentSkills.filter(s => s !== skillToRemove);
    setCurrentSkills(newSkills);
    onUpdateSkills?.(newSkills);
  };

  const handleAISuggest = () => {
    toast.success("AI is analyzing your profile to suggest relevant skills...");
    setTimeout(() => {
      setShowSuggestions(true);
    }, 1000);
  };

  const availableSuggestions = suggestedSkills.filter(s => !currentSkills.includes(s));

  return (
    <div className="space-y-4">
      {/* Character Counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Add your key skills to help recruiters find you
        </p>
        <span className={`text-xs px-2 py-1 rounded ${
          totalChars >= maxSkillsLength ? 'bg-destructive/10 text-destructive' : 'bg-muted'
        }`}>
          {totalChars}/{maxSkillsLength} characters
        </span>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2">
        {currentSkills.map((skill, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="px-3 py-1.5 text-sm flex items-center gap-2 group"
          >
            {skill}
            {canEdit && (
              <button 
                onClick={() => handleRemoveSkill(skill)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>

      {/* Add Skill Input */}
      {canEdit && (
        <div className="flex gap-2">
          <Input
            placeholder="Type a skill and press Enter..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill(newSkill);
              }
            }}
            className="flex-1"
          />
          <Button variant="outline" onClick={() => handleAddSkill(newSkill)}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
          <Button variant="outline" onClick={handleAISuggest}>
            <Sparkles className="h-4 w-4 mr-2" />
            AI Suggest
          </Button>
        </div>
      )}

      {/* Skill Suggestions */}
      {showSuggestions && canEdit && availableSuggestions.length > 0 && (
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Suggested Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.slice(0, 8).map((skill, index) => (
              <Badge 
                key={index}
                variant="outline"
                className="px-3 py-1.5 cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => handleAddSkill(skill)}
              >
                <Plus className="h-3 w-3 mr-1" />
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
