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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExperienceFormData } from "@/services/applicantProfileMutations";

const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
];

const NOTICE_PERIODS = [
  "Immediate",
  "15 days",
  "30 days",
  "45 days",
  "60 days",
  "90 days",
  "More than 90 days",
];

type ExperienceFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<ExperienceFormData>;
  onSave: (data: ExperienceFormData) => Promise<void>;
};

const emptyForm = (): ExperienceFormData => ({
  company_name: "",
  designation: "",
  employment_type: "full-time",
  start_date: "",
  end_date: null,
  is_current: false,
  description: "",
  current_ctc: "",
  notice_period: "",
});

export function ExperienceFormModal({
  open,
  onOpenChange,
  initial,
  onSave,
}: ExperienceFormModalProps) {
  const [form, setForm] = useState<ExperienceFormData>(emptyForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      ...emptyForm(),
      ...initial,
      company_name: initial?.company_name ?? "",
      designation: initial?.designation ?? "",
      employment_type: initial?.employment_type ?? "full-time",
      start_date: initial?.start_date ?? "",
      end_date: initial?.end_date ?? null,
      is_current: initial?.is_current ?? false,
      description: initial?.description ?? "",
      current_ctc: initial?.current_ctc ?? "",
      notice_period: initial?.notice_period ?? "",
      id: initial?.id,
    });
  }, [open, initial]);

  const handleSubmit = async () => {
    if (!form.company_name.trim() || !form.designation.trim() || !form.start_date) return;
    if (!form.is_current && !form.end_date) return;
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
          <DialogTitle>{form.id ? "Edit employment" : "Add employment"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Company *</Label>
              <Input
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Designation *</Label>
              <Input
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Employment type</Label>
              <Select
                value={form.employment_type || "full-time"}
                onValueChange={(v) => setForm({ ...form, employment_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Current CTC (LPA)</Label>
              <Input
                value={form.current_ctc ?? ""}
                onChange={(e) => setForm({ ...form, current_ctc: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Start date *</Label>
              <Input
                type="month"
                value={form.start_date?.slice(0, 7) ?? ""}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value ? `${e.target.value}-01` : "" })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>End date {!form.is_current && "*"}</Label>
              <Input
                type="month"
                disabled={form.is_current}
                value={form.end_date?.slice(0, 7) ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    end_date: e.target.value ? `${e.target.value}-01` : null,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between sm:col-span-2 rounded-md border p-3">
              <Label>Currently working here</Label>
              <Switch
                checked={form.is_current}
                onCheckedChange={(checked) =>
                  setForm({ ...form, is_current: checked, end_date: checked ? null : form.end_date })
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Notice period</Label>
              <Select
                value={form.notice_period || ""}
                onValueChange={(v) => setForm({ ...form, notice_period: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select notice period" />
                </SelectTrigger>
                <SelectContent>
                  {NOTICE_PERIODS.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
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
