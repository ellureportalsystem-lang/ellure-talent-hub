import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { uploadApplicantResume } from "@/lib/applicantMediaUpload";
import { isCloudinaryRawConfigured } from "@/lib/cloudinaryUpload";
import { matchApplicantByFileName, type ApplicantMatchRow } from "@/lib/bulkResumeMatcher";
import { ArrowLeft, Loader2, Upload, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
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

async function fetchAllApplicantsForMatch(): Promise<ApplicantMatchRow[]> {
  const pageSize = 1000;
  let from = 0;
  const all: ApplicantMatchRow[] = [];

  for (;;) {
    const { data, error } = await supabase
      .from("applicants")
      .select("id,name,email")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) throw new Error(error.message);
    const rows = (data || []) as { id: string; name: string | null; email: string | null }[];
    for (const r of rows) {
      all.push({
        id: r.id,
        name: (r.name || "").trim() || "Unknown",
        email: (r.email || "").trim() || "",
      });
    }
    if (rows.length < pageSize) break;
    from += pageSize;
  }

  return all;
}

const BulkResumeUpload = () => {
  const [rows, setRows] = useState<FileRow[]>([]);
  const [loadingIndex, setLoadingIndex] = useState(false);
  const [running, setRunning] = useState(false);
  const [matchMode, setMatchMode] = useState<"auto" | "name" | "email">("auto");
  const [applicantIndex, setApplicantIndex] = useState<ApplicantMatchRow[] | null>(null);

  const cloudinaryResume = isCloudinaryRawConfigured();

  const hint = useMemo(
    () =>
      matchMode === "email"
        ? "Name each file like the applicant email, e.g. trisha@gmail.com.pdf"
        : matchMode === "name"
          ? "Name each file like the applicant full name, e.g. Trisha Kumar.pdf"
          : "Use full name (Trisha Kumar.pdf), email as file name (user@domain.com.pdf), or unique first name if only one match exists.",
    [matchMode]
  );

  const loadApplicants = useCallback(async () => {
    setLoadingIndex(true);
    try {
      const list = await fetchAllApplicantsForMatch();
      setApplicantIndex(list);
      toast.success(`Loaded ${list.length} applicants for matching`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to load applicants");
    } finally {
      setLoadingIndex(false);
    }
  }, []);

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
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
    setRows(next);
  };

  const runBulk = async () => {
    if (!applicantIndex?.length) {
      toast.error("Load applicants first");
      return;
    }
    if (!rows.length) {
      toast.error("Select files to upload");
      return;
    }

    setRunning(true);
    let ok = 0;
    let fail = 0;

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

        const { data: row } = await supabase
          .from("applicants")
          .select("user_id")
          .eq("id", match.applicant.id)
          .maybeSingle();

        const userId = row?.user_id as string | null | undefined;
        if (userId) {
          await supabase
            .from("profiles")
            .update({ resume_file: url, updated_at: new Date().toISOString() })
            .eq("id", userId);
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
    }

    setRunning(false);
    toast.message("Bulk upload finished", { description: `${ok} succeeded, ${fail} failed` });
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/dashboard/admin/applicants">
            <ArrowLeft className="h-4 w-4" />
            Resume Search
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bulk resume upload</CardTitle>
          <CardDescription>
            Upload many CV files at once. Each file is matched to an applicant by file name (full name, email, or unique
            first name). URLs are stored in Supabase; files go to{" "}
            {cloudinaryResume ? "Cloudinary (raw upload preset)" : "Supabase Storage (configure Cloudinary for raw uploads)"}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border bg-muted/40 p-4 text-sm space-y-2">
            <p className="font-medium flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Naming rules
            </p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>
                <span className="text-foreground">Email:</span> <code className="text-xs">trisha@company.com.pdf</code>
              </li>
              <li>
                <span className="text-foreground">Full name:</span> <code className="text-xs">Trisha Kumar.pdf</code> (matches
                name on the applicant row)
              </li>
              <li>If several people share the same first name, use full name or email in the file name.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Match mode</Label>
            <RadioGroup
              value={matchMode}
              onValueChange={(v) => setMatchMode(v as typeof matchMode)}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auto" id="m-auto" />
                <Label htmlFor="m-auto" className="font-normal cursor-pointer">
                  Auto (name, then email local-part, then unique first name)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name" id="m-name" />
                <Label htmlFor="m-name" className="font-normal cursor-pointer">
                  Strict full name only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="m-email" />
                <Label htmlFor="m-email" className="font-normal cursor-pointer">
                  Email as file name (before extension)
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={loadApplicants} disabled={loadingIndex}>
              {loadingIndex ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Load applicants from database
            </Button>
            {applicantIndex && (
              <span className="text-sm text-muted-foreground self-center">
                {applicantIndex.length} rows indexed
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulk-files">Files</Label>
            <input
              id="bulk-files"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={onPickFiles}
              className="text-sm"
            />
          </div>

          {rows.length > 0 && (
            <ScrollArea className="h-[280px] rounded-md border">
              <div className="p-3 space-y-2">
                {rows.map((r, i) => (
                  <div
                    key={`${r.file.name}-${i}`}
                    className="flex items-start justify-between gap-2 text-sm border-b border-border/60 pb-2 last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{r.file.name}</p>
                      {r.applicant && <p className="text-xs text-muted-foreground">→ {r.applicant.name}</p>}
                      {r.message && r.status !== "ok" && (
                        <p className="text-xs text-destructive mt-0.5">{r.message}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {r.status === "pending" && <span className="text-xs text-muted-foreground">Pending</span>}
                      {r.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                      {r.status === "ok" && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                      {r.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <Button onClick={runBulk} disabled={running || !rows.length || !applicantIndex?.length}>
            {running ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            Upload &amp; assign
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkResumeUpload;
