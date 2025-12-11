import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";

interface SkillEntry {
  skillName: string;
  skillType: "technical" | "soft" | "tool" | "language";
  skillLevel: "beginner" | "intermediate" | "advanced" | "expert";
}

const Step5Skills = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState<SkillEntry[]>([
    {
      skillName: "",
      skillType: "technical",
      skillLevel: "intermediate",
    },
  ]);

  const updateEntry = (index: number, field: keyof SkillEntry, value: any) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        skillName: "",
        skillType: "technical",
        skillLevel: "intermediate",
      },
    ]);
  };

  const removeEntry = (index: number) => {
    if (entries.length === 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one skill is required",
        variant: "destructive",
      });
      return;
    }
    setEntries(entries.filter((_, i) => i !== index));
  };

  const onSubmit = () => {
    // Validate all entries have skill names
    const invalidEntries = entries.filter((e) => !e.skillName.trim());
    if (invalidEntries.length > 0) {
      toast({
        title: "Incomplete Skills",
        description: "Please enter skill name for all entries",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("applicant_step5", JSON.stringify({ entries }));
    navigate("/auth/applicant-register/step-6");
  };

  const handlePrevious = () => {
    navigate("/auth/applicant-register/step-4");
  };

  const handleSaveLater = () => {
    localStorage.setItem("applicant_step5_draft", JSON.stringify({ entries }));
    toast({
      title: "Progress Saved",
      description: "Your progress has been saved. You can continue later.",
    });
    navigate("/");
  };

  const suggestedSkills = [
    "Communication",
    "Excel",
    "CRM",
    "Word",
    "English Speaking",
    "Data Entry",
    "Telecalling",
    "Team Handling",
    "MS Office",
    "Customer Service",
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "SQL",
    "Git",
  ];

  const addSuggestedSkill = (skillName: string) => {
    // Check if skill already exists
    if (entries.some((e) => e.skillName.toLowerCase() === skillName.toLowerCase())) {
      toast({
        title: "Skill Already Added",
        description: "This skill is already in your list",
        variant: "destructive",
      });
      return;
    }

    // Add to first empty entry or create new
    const emptyIndex = entries.findIndex((e) => !e.skillName.trim());
    if (emptyIndex >= 0) {
      updateEntry(emptyIndex, "skillName", skillName);
    } else {
      setEntries([
        ...entries,
        {
          skillName,
          skillType: "technical",
          skillLevel: "intermediate",
        },
      ]);
    }
  };

  return (
    <RegistrationLayout
      currentStep={5}
      totalSteps={7}
      stepTitle="Skills"
      stepSubtitle="Add your skills and expertise"
      onNext={onSubmit}
      onPrevious={handlePrevious}
      onSaveLater={handleSaveLater}
    >
      <div className="space-y-6">
        {/* Suggested Skills */}
        <div className="space-y-2">
          <Label>Suggested Skills (Click to add)</Label>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => addSuggestedSkill(skill)}
              >
                + {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Skill Entries */}
        {entries.map((entry, index) => (
          <div key={index} className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Skill {index + 1}</h3>
              {entries.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEntry(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-1">
                <Label>
                  Skill Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="e.g., JavaScript, Communication"
                  value={entry.skillName}
                  onChange={(e) => updateEntry(index, "skillName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Skill Type</Label>
                <Select
                  value={entry.skillType}
                  onValueChange={(value) => updateEntry(index, "skillType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="soft">Soft Skill</SelectItem>
                    <SelectItem value="tool">Tool</SelectItem>
                    <SelectItem value="language">Language</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Skill Level</Label>
                <Select
                  value={entry.skillLevel}
                  onValueChange={(value) => updateEntry(index, "skillLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addEntry} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Another Skill
        </Button>
      </div>
    </RegistrationLayout>
  );
};

export default Step5Skills;












