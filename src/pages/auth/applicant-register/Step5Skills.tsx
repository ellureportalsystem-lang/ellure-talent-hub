import { useState, useEffect } from "react";
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
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Loader2 } from "lucide-react";
import { useRegistrationApplicant } from "@/hooks/useRegistrationApplicant";
import { saveRegistrationStep5 } from "@/services/registrationService";
import { toast as sonnerToast } from "sonner";
import { TagInput } from "@/components/ui/tag-input";
import { supabase } from "@/lib/supabase";

interface SkillEntry {
  skillName: string;
  skillType: "technical" | "soft" | "tool" | "language";
  skillLevel: "beginner" | "intermediate" | "advanced" | "expert";
}

const Step5Skills = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { applicantId, user, data, loading } = useRegistrationApplicant();
  const [keySkills, setKeySkills] = useState<string[]>([]);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [entries, setEntries] = useState<SkillEntry[]>([
    {
      skillName: "",
      skillType: "technical",
      skillLevel: "intermediate",
    },
  ]);

  useEffect(() => {
    supabase
      .from("applicant_skills")
      .select("skill_name")
      .limit(200)
      .then(({ data: rows }) => {
        const names = [...new Set((rows || []).map((r) => r.skill_name).filter(Boolean))] as string[];
        setSkillSuggestions(names);
      });
  }, []);

  useEffect(() => {
    if (!data?.applicant) return;
    const ks = data.applicant.key_skills;
    if (Array.isArray(ks)) setKeySkills(ks);
    else if (typeof ks === "string" && ks) {
      setKeySkills(ks.split(/[,;|]/).map((s) => s.trim()).filter(Boolean));
    }
    const it = (data.skills || []).filter((s: { skill_type?: string }) => s.skill_type !== "key");
    if (it.length) {
      setEntries(
        it.map((s: { skill_name: string; skill_type?: string; proficiency?: string }) => ({
          skillName: s.skill_name,
          skillType: (s.skill_type as SkillEntry["skillType"]) || "technical",
          skillLevel: (s.proficiency as SkillEntry["skillLevel"]) || "intermediate",
        }))
      );
    }
  }, [data]);

  const updateEntry = (index: number, field: keyof SkillEntry, value: string) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      { skillName: "", skillType: "technical", skillLevel: "intermediate" },
    ]);
  };

  const removeEntry = (index: number) => {
    if (entries.length === 1) {
      toast({ title: "Cannot Remove", description: "At least one IT skill row is required", variant: "destructive" });
      return;
    }
    setEntries(entries.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    if (keySkills.length < 3) {
      sonnerToast.error("Add at least 3 key skills");
      return;
    }
    if (!applicantId || !user?.id) return;
    setSaving(true);
    try {
      const itSkills = entries
        .filter((e) => e.skillName.trim())
        .map((e) => ({
          name: e.skillName,
          proficiency: e.skillLevel,
          years: 1,
        }));
      await saveRegistrationStep5(applicantId, user.id, keySkills, itSkills, []);
      sonnerToast.success("Saved");
      navigate("/auth/applicant-register/step-6");
    } catch (err) {
      sonnerToast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <RegistrationLayout currentStep={5} totalSteps={8} stepTitle="Loading" stepSubtitle="">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </RegistrationLayout>
    );
  }

  return (
    <RegistrationLayout
      currentStep={5}
      totalSteps={8}
      stepTitle="Skills"
      stepSubtitle="Key skills and IT expertise"
      onNext={onSubmit}
      onPrevious={() => navigate("/auth/applicant-register/step-4")}
      onSaveLater={() => {
        localStorage.setItem("applicant_step5_draft", JSON.stringify({ keySkills, entries }));
        toast({ title: "Progress Saved", description: "You can continue later." });
        navigate("/");
      }}
      nextLabel={saving ? "Saving..." : "Next"}
      isNextDisabled={saving}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>
            Key Skills <span className="text-destructive">*</span>
            <span className="text-muted-foreground font-normal ml-1">(minimum 3)</span>
          </Label>
          <TagInput
            value={keySkills}
            onChange={setKeySkills}
            placeholder="Type a skill and press Enter"
            suggestions={skillSuggestions}
            maxTags={25}
          />
        </div>

        <div className="border-t border-[var(--surface-border)] pt-6">
          <h3 className="font-semibold mb-1">IT Skills</h3>
          <p className="text-sm text-muted-foreground mb-4">Technical tools and technologies</p>

          {entries.map((entry, index) => (
            <div key={index} className="p-6 border rounded-lg space-y-4 mb-4 bg-[var(--surface-1)]">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Skill {index + 1}</h4>
                {entries.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeEntry(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-1">
                  <Label>Skill Name</Label>
                  <Input
                    placeholder="e.g., React, SQL"
                    value={entry.skillName}
                    onChange={(e) => updateEntry(index, "skillName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={entry.skillType} onValueChange={(v) => updateEntry(index, "skillType", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="soft">Soft Skill</SelectItem>
                      <SelectItem value="tool">Tool</SelectItem>
                      <SelectItem value="language">Language</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select value={entry.skillLevel} onValueChange={(v) => updateEntry(index, "skillLevel", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
            Add Another IT Skill
          </Button>
        </div>
      </div>
    </RegistrationLayout>
  );
};

export default Step5Skills;
