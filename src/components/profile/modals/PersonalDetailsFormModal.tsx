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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PersonalDetailsFormData } from "@/services/applicantProfileMutations";

type PersonalDetailsFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: PersonalDetailsFormData;
  onSave: (data: PersonalDetailsFormData) => Promise<void>;
};

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];
const MARITAL = ["Single", "Married", "Divorced", "Widowed", "Prefer not to say"];

export function PersonalDetailsFormModal({
  open,
  onOpenChange,
  initial,
  onSave,
}: PersonalDetailsFormModalProps) {
  const [form, setForm] = useState<PersonalDetailsFormData>({});
  const [languagesText, setLanguagesText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(initial ?? {});
    setLanguagesText((initial?.languages ?? []).join(", "));
  }, [open, initial]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSave({
        ...form,
        languages: languagesText
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
          <DialogTitle>Edit personal details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Date of birth</Label>
            <Input
              type="date"
              value={form.date_of_birth?.slice(0, 10) ?? ""}
              onChange={(e) => setForm({ ...form, date_of_birth: e.target.value || null })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={form.gender ?? ""}
                onValueChange={(v) => setForm({ ...form, gender: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Marital status</Label>
              <Select
                value={form.marital_status ?? ""}
                onValueChange={(v) => setForm({ ...form, marital_status: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {MARITAL.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Languages (comma separated)</Label>
            <Input value={languagesText} onChange={(e) => setLanguagesText(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Current city</Label>
            <Input
              value={form.city ?? ""}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea
              rows={2}
              value={form.address_line1 ?? ""}
              onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
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
