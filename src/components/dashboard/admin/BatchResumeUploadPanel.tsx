import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { uploadApplicantResume } from "@/lib/applicantMediaUpload";
import {
  matchApplicantByFileName,
  type ApplicantMatchRow,
  type MatchMode,
} from "@/lib/bulkResumeMatcher";
import { UploadProgressBar } from "@/components/dashboard/admin/UploadProgressBar";
import { Loader2, Upload, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

type RowStatus = "pending" | "uploading" | "ok" | "error";

type FileRow = {
  file: File;
  status: RowStatus;
  message?: string;
  applicant?: ApplicantMatchRow;
};

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function buildRows(files: File[]): FileRow[] {
  const next: FileRow[] = [];
  for (const file of files) {
    if (!ALLOWED.has(file.type)) {
      next.push({ file, status: "error", message: "Only PDF, DOC, or DOCX allowed" });
      continue;
    }
    if (file.size > MAX_BYTES) {
      next.push({ file, status: "error", message: "Max 15MB per file" });
      continue;
    }
    next.push({ file, status: "pending" });
  }
  return next;
}

async function fetchApplicantsByEmails(emails: string[]): Promise<ApplicantMatchRow[]> {
  const unique = [...new Set(emails.map((e) => e.toLowerCase()).filter(Boolean))];
  const all: ApplicantMatchRow[] = [];
  const chunkSize = 100;

  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("applicants")
      .select("id,name,email,phone")
      .in("email", chunk)
      .eq("is_deleted", false);

    if (error) throw new Error(error.message);
    for (const r of data ?? []) {
      all.push({
        id: r.id,
        name: (r.name || "").trim() || "Unknown",
        email: (r.email || "").trim() || "",
        phone: (r.phone || "").trim() || "",
      });
    }
  }

  return all;
}

interface BatchResumeUploadPanelProps {
  /** Limit matching to applicants from the current import batch */
  batchEmails: string[];
  onComplete?: (summary: { ok: number; fail: number }) => void;
}

export function BatchResumeUploadPanel({ batchEmails, onComplete }: BatchResumeUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [rows, setRows] = useState<FileRow[]>([]);
  const [loadingIndex, setLoadingIndex] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [matchMode, setMatchMode] = useState<MatchMode>("auto");
  const [applicantIndex, setApplicantIndex] = useState<ApplicantMatchRow[] | null>(null);

  const hint = useMemo(
    () =>
      matchMode === "email"
        ? "Name each file like the applicant email, e.g. rajesh.kumar@example.com.pdf"
        : matchMode === "name"
          ? "Name each file like the applicant full name, e.g. Rajesh Kumar.pdf"
          : "Use full name, email, 10-digit phone, or unique first name in the file name.",
    [matchMode]
  );

  const loadApplicants = useCallback(async () => {
    if (!batchEmails.length) {
      toast.error("No applicants in this import batch");
      return;
    }
    setLoadingIndex(true);
    try {
      const list = await fetchApplicantsByEmails(batchEmails);
      setApplicantIndex(list);
      toast.success(`Loaded ${list.length} applicants from this batch`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to load applicants");
    } finally {
      setLoadingIndex(false);
    }
  }, [batchEmails]);

  const addFiles = (files: File[]) => {
    const built = buildRows(files);
    setRows((prev) => {
      const seen = new Set(prev.map((r) => `${r.file.name}__${r.file.size}`));
      const merged = [...prev];
      for (const r of built) {
        const key = `${r.file.name}__${r.file.size}`;
        if (!seen.has(key)) merged.push(r);
      }
      return merged;
    });
  };

  const runBulk = async () => {
    if (!applicantIndex?.length) {
      toast.error("Load batch applicants first");
      return;
    }
    if (!rows.length) {
      toast.error("Select resume files to upload");
      return;
    }

    setRunning(true);
    setProgress(0);
    let ok = 0;
    let fail = 0;
    const uploadable = rows.filter((r) => r.status !== "error");
    const total = uploadable.length || rows.length;
    let done = 0;

    for (let i = 0; i < rows.length; i++) {
      const fr = rows[i];
      if (fr.status === "error") {
        fail++;
        continue;
      }

      setRows((prev) => {
        const copy = [...prev];
        copy[i] = { ...copy[i], status: "uploading", message: undefined };
        return copy;
      });

      const match = matchApplicantByFileName(fr.file.name, applicantIndex, matchMode);
      if (match.status !== "matched") {
        const msg =
          match.status === "ambiguous"
            ? `${match.reason}: ${match.candidates.map((c) => c.name).join(", ")}`
            : match.reason;
        setRows((prev) => {
          const copy = [...prev];
          copy[i] = { ...copy[i], status: "error", message: msg };
          return copy;
        });
        fail++;
        done++;
        setProgress(Math.round((done / total) * 100));
        continue;
      }

      try {
        const url = await uploadApplicantResume(fr.file, { applicantId: match.applicant.id });
        const { error } = await supabase
          .from("applicants")
          .update({
            resume_file: url,
            upload_cv_any_format: url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", match.applicant.id);

        if (error) throw new Error(error.message);

        await supabase.rpc("refresh_applicant_search_index", { p_applicant_id: match.applicant.id });

        const { data: row } = await supabase
          .from("applicants")
          .select("user_id")
          .eq("id", match.applicant.id)
          .maybeSingle();

        if (row?.user_id) {
          await supabase
            .from("profiles")
            .update({ resume_file: url, updated_at: new Date().toISOString() })
            .eq("id", row.user_id);
        }

        setRows((prev) => {
          const copy = [...prev];
          copy[i] = { ...copy[i], status: "ok", applicant: match.applicant, message: url };
          return copy;
        });
        ok++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setRows((prev) => {
          const copy = [...prev];
          copy[i] = { ...copy[i], status: "error", message: msg };
          return copy;
        });
        fail++;
      }

      done++;
      setProgress(Math.round((done / total) * 100));
    }

    setRunning(false);
    toast.message("Resume upload finished", { description: `${ok} linked, ${fail} failed` });
    onComplete?.({ ok, fail });
  };

  const pendingCount = rows.filter((r) => r.status === "pending").length;
  const okCount = rows.filter((r) => r.status === "ok").length;
  const errCount = rows.filter((r) => r.status === "error").length;

  return (
    <div className="space-y-5">
      <div className="rounded-lg border bg-muted/40 p-4 text-sm">
        <p className="font-medium">Batch-scoped resume upload</p>
        <p className="mt-1 text-muted-foreground">
          Only applicants from this Excel import ({batchEmails.length} emails) can be matched. Name files using email
          or full name from the sheet.
        </p>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Match mode</Label>
        <RadioGroup
          value={matchMode}
          onValueChange={(v) => setMatchMode(v as MatchMode)}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="auto" id="batch-m-auto" />
            <Label htmlFor="batch-m-auto" className="font-normal cursor-pointer">
              Auto (name, email, phone)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="name" id="batch-m-name" />
            <Label htmlFor="batch-m-name" className="font-normal cursor-pointer">
              Full name only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="batch-m-email" />
            <Label htmlFor="batch-m-email" className="font-normal cursor-pointer">
              Email as file name
            </Label>
          </div>
        </RadioGroup>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Button type="button" variant="secondary" size="sm" onClick={() => void loadApplicants()} disabled={loadingIndex}>
          {loadingIndex ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Load batch applicants
        </Button>
        {applicantIndex && (
          <span className="text-sm text-muted-foreground">{applicantIndex.length} applicants ready to match</span>
        )}
      </div>

      <div className="space-y-2">
        <Label>Resume files</Label>
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(Array.from(e.dataTransfer.files || []));
          }}
          className="cursor-pointer rounded-xl border border-dashed bg-background p-6 text-center transition-colors hover:bg-muted/30"
        >
          <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Drag & drop resumes or click to browse</p>
          <p className="mt-1 text-xs text-muted-foreground">PDF, DOC, DOCX — max 15MB each</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => {
              addFiles(Array.from(e.target.files || []));
              e.target.value = "";
            }}
            className="hidden"
          />
        </div>
        {rows.length > 0 && (
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>{rows.length} files</span>
            <span className="text-emerald-700">{okCount} uploaded</span>
            <span className="text-amber-700">{pendingCount} pending</span>
            <span className="text-red-700">{errCount} failed</span>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 ml-auto" onClick={() => setRows([])}>
              Clear
            </Button>
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <ScrollArea className="h-[240px] rounded-md border">
          <div className="p-3 space-y-2">
            {rows.map((r, i) => (
              <div
                key={`${r.file.name}-${i}`}
                className="flex items-start justify-between gap-3 text-sm border-b border-border/60 pb-2 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{r.file.name}</p>
                  {r.applicant && <p className="text-xs text-muted-foreground">→ {r.applicant.name}</p>}
                  {r.message && r.status !== "ok" && (
                    <p className="text-xs text-destructive mt-0.5">{r.message}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {r.status === "pending" && <span className="text-xs text-muted-foreground">Pending</span>}
                  {r.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                  {r.status === "ok" && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                  {r.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={running}
                    onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {(running || progress > 0) && (
        <UploadProgressBar
          value={progress}
          active={running}
          label="Uploading resumes"
          detail={running ? `Processing files… ${progress}%` : `Finished — ${progress}%`}
        />
      )}

      <Button onClick={() => void runBulk()} disabled={running || !rows.length || !applicantIndex?.length}>
        {running ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
        Upload &amp; link resumes
      </Button>
    </div>
  );
}
