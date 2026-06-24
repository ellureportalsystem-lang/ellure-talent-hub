import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, StickyNote, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { formatDateIST } from "@/lib/dateFormat";
import { tagColorClass } from "@/components/client/UpgradePlanModal";
import {
  addRecruiterNote,
  addRecruiterTag,
  fetchRecruiterNotes,
  fetchRecruiterTags,
  removeRecruiterTag,
} from "@/services/recruiterCandidateService";
import { cn } from "@/lib/utils";

const TAG_COLORS = ["blue", "green", "orange", "purple", "red"] as const;

type RecruiterCandidateNotesPanelProps = {
  recruiterId: string;
  applicantId: string;
  userId: string;
  invitedAt?: string | null;
  className?: string;
  variant?: "tabs" | "stacked";
};

export function RecruiterCandidateNotesPanel({
  recruiterId,
  applicantId,
  userId,
  invitedAt,
  className,
  variant = "tabs",
}: RecruiterCandidateNotesPanelProps) {
  const [subTab, setSubTab] = useState<"notes" | "tags">("notes");
  const [notes, setNotes] = useState<
    { id: string; note: string; created_at: string; profiles?: { full_name?: string } | null }[]
  >([]);
  const [tags, setTags] = useState<{ id: string; tag: string; color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagColor, setTagColor] = useState<string>("blue");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [n, t] = await Promise.all([
        fetchRecruiterNotes(recruiterId, applicantId),
        fetchRecruiterTags(recruiterId, applicantId),
      ]);
      setNotes(n as typeof notes);
      setTags(t as typeof tags);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [recruiterId, applicantId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSaveNote = async () => {
    const text = noteText.trim();
    if (!text) return;
    setSaving(true);
    try {
      await addRecruiterNote(recruiterId, applicantId, text, userId);
      setNoteText("");
      toast.success("Note saved");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = async () => {
    const text = tagInput.trim();
    if (!text) return;
    setSaving(true);
    try {
      await addRecruiterTag(recruiterId, applicantId, text, tagColor);
      setTagInput("");
      toast.success("Tag added");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add tag");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      await removeRecruiterTag(tagId);
      setTags((prev) => prev.filter((t) => t.id !== tagId));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove tag");
    }
  };

  const notesBody = (
    <div className="space-y-4">
      <Textarea
        placeholder="Add a private note about this candidate…"
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        rows={3}
        className="text-sm resize-none"
      />
      <Button
        size="sm"
        className="bg-[#0566CD] hover:bg-[#0066c0]"
        disabled={saving || !noteText.trim()}
        onClick={() => void handleSaveNote()}
      >
        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save note"}
      </Button>
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-[#0566CD]" />
        </div>
      ) : notes.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">No notes yet</p>
      ) : (
        <ul className="space-y-3 max-h-[320px] overflow-y-auto">
          {notes.map((n) => (
            <li key={n.id} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
              <p className="text-slate-800 whitespace-pre-wrap">{n.note}</p>
              <p className="mt-2 text-[10px] text-slate-400">
                {n.profiles?.full_name || "You"} · {formatDateIST(n.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const tagsBody = (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 min-h-[28px]">
        {tags.length === 0 && !loading && (
          <p className="text-sm text-slate-500">No tags yet</p>
        )}
        {tags.map((t) => (
          <Badge
            key={t.id}
            variant="outline"
            className={cn("gap-1 pr-1", tagColorClass(t.color))}
          >
            {t.tag}
            <button
              type="button"
              className="rounded-full hover:bg-black/10 p-0.5"
              onClick={() => void handleRemoveTag(t.id)}
              aria-label={`Remove tag ${t.tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Type tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void handleAddTag();
            }
          }}
          className="text-sm h-9"
        />
        <Button
          size="sm"
          variant="outline"
          disabled={saving || !tagInput.trim()}
          onClick={() => void handleAddTag()}
        >
          Add
        </Button>
      </div>
      <div className="flex gap-1.5">
        {TAG_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            title={c}
            className={cn(
              "h-5 w-5 rounded-full border-2",
              tagColorClass(c).split(" ")[0],
              tagColor === c ? "border-slate-800 ring-1 ring-slate-400" : "border-transparent"
            )}
            onClick={() => setTagColor(c)}
          />
        ))}
      </div>
    </div>
  );

  if (variant === "stacked") {
    return (
      <div className={cn("space-y-4", className)}>
        {invitedAt && (
          <Badge variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50">
            Invited on {formatDateIST(invitedAt)}
          </Badge>
        )}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 mb-3">
            <StickyNote className="h-4 w-4 text-[#0566CD]" /> Notes
          </h3>
          {notesBody}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 mb-3">
            <Tag className="h-4 w-4 text-[#0566CD]" /> Tags
          </h3>
          {tagsBody}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {invitedAt && (
        <Badge variant="outline" className="mb-3 border-emerald-300 text-emerald-700 bg-emerald-50">
          Invited on {formatDateIST(invitedAt)}
        </Badge>
      )}
      <div className="flex border-b border-slate-200 text-sm mb-4">
        <button
          type="button"
          className={cn(
            "px-4 py-2.5 font-medium flex items-center gap-1.5",
            subTab === "notes"
              ? "text-slate-900 border-b-2 border-[#e84444]"
              : "text-slate-500 hover:text-slate-700"
          )}
          onClick={() => setSubTab("notes")}
        >
          <StickyNote className="h-3.5 w-3.5" /> Notes
        </button>
        <button
          type="button"
          className={cn(
            "px-4 py-2.5 font-medium flex items-center gap-1.5",
            subTab === "tags"
              ? "text-slate-900 border-b-2 border-[#e84444]"
              : "text-slate-500 hover:text-slate-700"
          )}
          onClick={() => setSubTab("tags")}
        >
          <Tag className="h-3.5 w-3.5" /> Tags
        </button>
      </div>
      {subTab === "notes" ? notesBody : tagsBody}
    </div>
  );
}
