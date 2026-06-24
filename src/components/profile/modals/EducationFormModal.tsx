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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EducationFormData } from "@/services/applicantProfileMutations";

const EDUCATION_LEVELS = [
  "10th",
  "12th",
  "Diploma",
  "Graduation",
  "Post Graduation",
  "Doctorate",
  "Other",
];

type EducationFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<EducationFormData>;
  onSave: (data: EducationFormData) => Promise<void>;
};

const emptyForm = (): EducationFormData => ({
  education_level: "",
  institution_name: "",
  degree: "",
  field_of_study: "",
  passing_year: undefined,
  percentage: undefined,
  is_highest: false,
});

export function EducationFormModal({
  open,
  onOpenChange,
  initial,
  onSave,
}: EducationFormModalProps) {
  const [form, setForm] = useState<EducationFormData>(emptyForm());
  const [saving, setSaving] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (!open) return;
    setForm({
      ...emptyForm(),
      ...initial,
      education_level: initial?.education_level ?? "",
      institution_name: initial?.institution_name ?? "",
      degree: initial?.degree ?? "",
      field_of_study: initial?.field_of_study ?? "",
      passing_year: initial?.passing_year,
      percentage: initial?.percentage,
      is_highest: initial?.is_highest ?? false,
      id: initial?.id,
    });
  }, [open, initial]);

  const handleSubmit = async () => {
    if (!form.education_level.trim() || !form.institution_name.trim()) return;
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit education" : "Add education"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Education level *</Label>
            <Select
              value={form.education_level}
              onValueChange={(v) => setForm({ ...form, education_level: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {EDUCATION_LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Degree / Course</Label>
            <Input
              value={form.degree ?? ""}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Institution *</Label>
            <Input
              value={form.institution_name}
              onChange={(e) => setForm({ ...form, institution_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Specialization</Label>
            <Input
              value={form.field_of_study ?? ""}
              onChange={(e) => setForm({ ...form, field_of_study: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Year of passing</Label>
              <Select
                value={form.passing_year ? String(form.passing_year) : ""}
                onValueChange={(v) => setForm({ ...form, passing_year: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Percentage / CGPA</Label>
              <Input
                type="number"
                step="0.01"
                value={form.percentage ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    percentage: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label>Highest qualification</Label>
            <Switch
              checked={form.is_highest ?? false}
              onCheckedChange={(checked) => setForm({ ...form, is_highest: checked })}
            />
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
