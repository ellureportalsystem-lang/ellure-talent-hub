import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Trash2 } from "lucide-react";

export type NviteQuestionType = "single" | "multiple" | "short";

export type NviteQuestion = {
  id: string;
  text: string;
  mandatory: boolean;
  type: NviteQuestionType;
  options: string[];
};

type NviteAddQuestionsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: NviteQuestion[];
  onSave: (questions: NviteQuestion[]) => void;
};

function emptyQuestion(): NviteQuestion {
  return {
    id: crypto.randomUUID(),
    text: "",
    mandatory: false,
    type: "single",
    options: ["", ""],
  };
}

export function NviteAddQuestionsModal({
  open,
  onOpenChange,
  questions: initial,
  onSave,
}: NviteAddQuestionsModalProps) {
  const [questions, setQuestions] = useState<NviteQuestion[]>(initial.length ? initial : [emptyQuestion()]);

  const update = (id: string, patch: Partial<NviteQuestion>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);

  const duplicate = (q: NviteQuestion) => {
    setQuestions((prev) => [...prev, { ...q, id: crypto.randomUUID() }]);
  };

  const remove = (id: string) => {
    setQuestions((prev) => (prev.length <= 1 ? prev : prev.filter((q) => q.id !== id)));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Add questions</span>
            <button type="button" className="text-sm font-normal text-[#0566CD] hover:underline">
              Select saved templates ▾
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="rounded border border-slate-200 p-4 space-y-3">
              <Label className="text-xs text-slate-500">Question {idx + 1}</Label>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter your question here"
                  value={q.text}
                  onChange={(e) => update(q.id, { text: e.target.value })}
                  className="flex-1"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={q.mandatory}
                    onCheckedChange={(c) => update(q.id, { mandatory: !!c })}
                  />
                  <span className="text-xs text-slate-600">Mandatory</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-600 mb-2">Question type:</p>
                <div className="flex gap-2">
                  {(["single", "multiple", "short"] as NviteQuestionType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`rounded-full border px-3 py-1 text-xs capitalize ${
                        q.type === t
                          ? "border-[#0566CD] bg-blue-50 text-[#0566CD]"
                          : "border-slate-200 text-slate-600"
                      }`}
                      onClick={() => update(q.id, { type: t })}
                    >
                      {t === "single" ? "Single choice" : t === "multiple" ? "Multiple choice" : "Short answer"}
                    </button>
                  ))}
                </div>
              </div>

              {(q.type === "single" || q.type === "multiple") && (
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border border-slate-300 shrink-0" />
                      <Input
                        placeholder={`Option ${oi + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const next = [...q.options];
                          next[oi] = e.target.value;
                          update(q.id, { options: next });
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-xs text-[#0566CD] hover:underline"
                    onClick={() => update(q.id, { options: [...q.options, ""] })}
                  >
                    + Add another option
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-3 text-xs text-slate-600">
                <button type="button" className="flex items-center gap-1 hover:text-[#0566CD]" onClick={() => duplicate(q)}>
                  <Copy className="h-3.5 w-3.5" /> Duplicate
                </button>
                <button type="button" className="flex items-center gap-1 hover:text-red-600" onClick={() => remove(q.id)}>
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full border-[#0566CD] text-[#0566CD]" onClick={addQuestion}>
            + Add a question
          </Button>

          <div className="flex items-center justify-between pt-2 border-t">
            <button type="button" className="text-sm text-[#0566CD] hover:underline">
              Save as template
            </button>
            <Button
              className="bg-[#0566CD] hover:bg-[#0066c0]"
              onClick={() => {
                onSave(questions.filter((q) => q.text.trim()));
                onOpenChange(false);
              }}
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const SUGGESTED_NVITE_QUESTIONS = [
  "What is your current CTC in Lacs per annum?",
  "What is your expected CTC in Lacs per annum?",
  "What is your notice period?",
];
