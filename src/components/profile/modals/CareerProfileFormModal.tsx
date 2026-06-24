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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CareerPreferencesFormData } from "@/services/applicantProfileMutations";

const NOTICE = ["Immediate", "15 days", "30 days", "45 days", "60 days", "90 days", "More than 90 days"];
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
const WORK_MODES = ["Onsite", "Remote", "Hybrid"];

type CareerProfileFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: CareerPreferencesFormData;
  onSave: (data: CareerPreferencesFormData) => Promise<void>;
};

export function CareerProfileFormModal({
  open,
  onOpenChange,
  initial,
  onSave,
}: CareerProfileFormModalProps) {
  const [form, setForm] = useState<CareerPreferencesFormData>({ is_actively_looking: true });
  const [locationsText, setLocationsText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({ is_actively_looking: true, ...initial });
    setLocationsText((initial?.preferred_locations ?? []).join(", "));
  }, [open, initial]);

  const toggleList = (
    list: string[],
    value: string,
    checked: boolean
  ) => (checked ? [...list, value] : list.filter((x) => x !== value));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSave({
        ...form,
        preferred_locations: locationsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit career preferences</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={form.current_ctc_not_disclosed ?? false}
              onCheckedChange={(c) =>
                setForm({ ...form, current_ctc_not_disclosed: c === true })
              }
            />
            <Label>Current CTC not disclosed</Label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Current CTC (LPA)</Label>
              <Input
                type="number"
                disabled={form.current_ctc_not_disclosed}
                value={form.current_ctc ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    current_ctc: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Expected CTC (LPA)</Label>
              <Input
                type="number"
                value={form.expected_ctc ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    expected_ctc: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notice period</Label>
            <Select
              value={form.notice_period ?? ""}
              onValueChange={(v) => setForm({ ...form, notice_period: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {NOTICE.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Current industry</Label>
              <Input
                value={form.current_industry ?? ""}
                onChange={(e) => setForm({ ...form, current_industry: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred industry</Label>
              <Input
                value={form.preferred_industry ?? ""}
                onChange={(e) => setForm({ ...form, preferred_industry: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Functional area / preferred role</Label>
            <Input
              value={form.functional_area ?? form.job_role ?? ""}
              onChange={(e) => setForm({ ...form, functional_area: e.target.value, job_role: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Preferred locations (comma separated)</Label>
            <Input value={locationsText} onChange={(e) => setLocationsText(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Job type preference</Label>
            <div className="flex flex-wrap gap-3">
              {JOB_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-1.5 text-sm">
                  <Checkbox
                    checked={(form.preferred_job_types ?? []).includes(t)}
                    onCheckedChange={(c) =>
                      setForm({
                        ...form,
                        preferred_job_types: toggleList(form.preferred_job_types ?? [], t, c === true),
                      })
                    }
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Work mode</Label>
            <div className="flex flex-wrap gap-3">
              {WORK_MODES.map((t) => (
                <label key={t} className="flex items-center gap-1.5 text-sm">
                  <Checkbox
                    checked={(form.work_mode_preferences ?? []).includes(t)}
                    onCheckedChange={(c) =>
                      setForm({
                        ...form,
                        work_mode_preferences: toggleList(
                          form.work_mode_preferences ?? [],
                          t,
                          c === true
                        ),
                      })
                    }
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label>Open to relocation</Label>
            <Switch
              checked={form.open_to_relocate ?? false}
              onCheckedChange={(c) => setForm({ ...form, open_to_relocate: c })}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label>Actively looking for opportunities</Label>
            <Switch
              checked={form.is_actively_looking ?? true}
              onCheckedChange={(c) => setForm({ ...form, is_actively_looking: c })}
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
