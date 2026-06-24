import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ITSkillFormData } from "@/services/applicantProfileMutations";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

type ITSkillFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<ITSkillFormData>;
  onSave: (data: ITSkillFormData) => Promise<void>;
};

export function ITSkillFormModal({
  open,
  onOpenChange,
  initial,
  onSave,
}: ITSkillFormModalProps) {
  const [form, setForm] = useState<ITSkillFormData>({
    skill_name: "",
    skill_level: "Intermediate",
    years_of_experience: null,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      id: initial?.id,
      skill_name: initial?.skill_name ?? "",
      skill_level: initial?.skill_level ?? "Intermediate",
      years_of_experience: initial?.years_of_experience ?? null,
      skill_version: initial?.skill_version ?? "",
    });
  }, [open, initial]);

  const handleSubmit = async () => {
    if (!form.skill_name.trim()) return;
    setSaving(true);
    try {
      await onSave(form);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit IT skill" : "Add IT skill"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Skill name *</Label>
            <Input
              value={form.skill_name}
              onChange={(e) => setForm({ ...form, skill_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Version</Label>
            <Input
              value={form.skill_version ?? ""}
              onChange={(e) => setForm({ ...form, skill_version: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Years of experience</Label>
              <Input
                type="number"
                min={0}
                step={0.5}
                value={form.years_of_experience ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    years_of_experience: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Proficiency</Label>
              <Select
                value={form.skill_level}
                onValueChange={(v) => setForm({ ...form, skill_level: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
