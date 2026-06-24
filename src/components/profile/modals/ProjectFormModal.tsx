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
import type { ProjectFormData } from "@/services/applicantProfileMutations";

type ProjectFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<ProjectFormData>;
  onSave: (data: ProjectFormData) => Promise<void>;
};

const emptyForm = (): ProjectFormData => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  skills: [],
  link: "",
  githubLink: "",
  duration: "",
});

export function ProjectFormModal({
  open,
  onOpenChange,
  initial,
  onSave,
}: ProjectFormModalProps) {
  const [form, setForm] = useState<ProjectFormData>(emptyForm());
  const [skillsText, setSkillsText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const base = {
      ...emptyForm(),
      ...initial,
      id: initial?.id ?? crypto.randomUUID(),
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      link: initial?.link ?? "",
      githubLink: initial?.githubLink ?? "",
      duration: initial?.duration ?? "",
      teamSize: initial?.teamSize,
      skills: initial?.skills ?? [],
    };
    setForm(base);
    setSkillsText((base.skills ?? []).join(", "));
  }, [open, initial]);

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        skills: skillsText
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
          <DialogTitle>{initial?.title ? "Edit project" : "Add project"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Project title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Skills (comma separated)</Label>
            <Input value={skillsText} onChange={(e) => setSkillsText(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                placeholder="e.g. 3 months"
                value={form.duration ?? ""}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Team size</Label>
              <Input
                type="number"
                value={form.teamSize ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    teamSize: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Live demo URL</Label>
            <Input
              value={form.link ?? ""}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>GitHub URL</Label>
            <Input
              value={form.githubLink ?? ""}
              onChange={(e) => setForm({ ...form, githubLink: e.target.value })}
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
