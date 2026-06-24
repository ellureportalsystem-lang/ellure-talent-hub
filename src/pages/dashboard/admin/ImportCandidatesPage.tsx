import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  RefreshCw,
  ClipboardCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  IMPORT_COLUMN_DEFS,
  MAPPABLE_FIELDS,
  autoDetectColumnMapping,
  applyColumnMapping,
  buildTemplateHeaders,
  buildTemplateSampleRow,
  type ImportDbField,
} from "@/lib/importColumnMap";
import {
  normalizeImportRow,
  validateImportRowDetailed,
  type ImportRow,
  type RowValidation,
} from "@/lib/importNormalization";
import {
  fetchExistingApplicantEmails,
  findFileDuplicateEmails,
  importApplicantsBatch,
  logImportToAudit,
  summarizeImportResults,
  buildErrorReportRows,
  refreshSearchIndexForEmails,
  type ImportResult,
} from "@/services/importService";
import {
  verifyImportBatch,
  type BatchVerificationRow,
  type BatchVerificationSummary,
} from "@/services/importVerificationService";
import {
  createImportBatch,
  getSuccessfulBatchEmails,
  loadImportBatch,
  saveImportBatch,
  updateImportBatch,
  clearImportBatch,
} from "@/lib/importBatchSession";
import { UploadProgressBar } from "@/components/dashboard/admin/UploadProgressBar";
import { ImportBatchReviewTable } from "@/components/dashboard/admin/ImportBatchReviewTable";
import { BatchResumeUploadPanel } from "@/components/dashboard/admin/BatchResumeUploadPanel";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const MAX_FILE_BYTES = 50 * 1024 * 1024;

interface ParsedRow {
  index: number;
  normalized: ImportRow;
  validation: RowValidation;
}

const STEPS = [
  { n: 1 as Step, title: "Template" },
  { n: 2 as Step, title: "Upload Excel" },
  { n: 3 as Step, title: "Validate" },
  { n: 4 as Step, title: "Import" },
  { n: 5 as Step, title: "Verify data" },
  { n: 6 as Step, title: "Upload resumes" },
  { n: 7 as Step, title: "Final check" },
];

function rowStatusClass(level: RowValidation["level"]) {
  if (level === "error") return "bg-red-50 border-red-200";
  if (level === "warning") return "bg-amber-50 border-amber-200";
  return "bg-emerald-50/50 border-emerald-100";
}

const ImportCandidatesPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [fileName, setFileName] = useState("");
  const [rawRows, setRawRows] = useState<Record<string, unknown>[]>([]);
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, ImportDbField>>({});
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [existingEmails, setExistingEmails] = useState<Set<string>>(new Set());
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importDetail, setImportDetail] = useState("");
  const [results, setResults] = useState<ImportResult[]>([]);
  const [skipErrors, setSkipErrors] = useState(true);
  const [overwriteDuplicates, setOverwriteDuplicates] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationRows, setVerificationRows] = useState<BatchVerificationRow[]>([]);
  const [verificationSummary, setVerificationSummary] = useState<BatchVerificationSummary | null>(null);
  const [batchEmails, setBatchEmails] = useState<string[]>([]);

  useEffect(() => {
    const batch = loadImportBatch();
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const n = Number(stepParam);
      if (n >= 1 && n <= 7) setStep(n as Step);
    }
    if (batch?.phase === "completed") return;
    if (batch?.importResults?.length && batch.phase !== "excel_validating") {
      setFileName(batch.fileName);
      setResults(batch.importResults);
      setBatchEmails(getSuccessfulBatchEmails(batch));
      if (!stepParam) {
        if (batch.phase === "excel_imported" || batch.phase === "data_verified") {
          setStep(5);
        } else if (batch.phase === "resumes_uploading") {
          setStep(6);
        }
      }
    }
  }, [searchParams]);

  const counts = useMemo(() => {
    const valid = parsedRows.filter((r) => r.validation.level === "valid").length;
    const warnings = parsedRows.filter((r) => r.validation.level === "warning").length;
    const errors = parsedRows.filter((r) => r.validation.level === "error").length;
    return { valid, warnings, errors, total: parsedRows.length };
  }, [parsedRows]);

  const importableRows = useMemo(
    () =>
      parsedRows
        .filter((r) => (skipErrors ? r.validation.level !== "error" : r.validation.level === "valid"))
        .map((r) => r.normalized),
    [parsedRows, skipErrors]
  );

  const summary = useMemo(() => summarizeImportResults(results), [results]);

  const runVerification = useCallback(async () => {
    const batch = loadImportBatch();
    const sourceRows = batch?.sourceRows ?? importableRows;
    const importResults = batch?.importResults ?? results;

    if (!sourceRows.length) {
      toast.error("No import data to verify");
      return;
    }

    setVerifying(true);
    try {
      const { rows, summary: vSummary } = await verifyImportBatch({ sourceRows, importResults });
      setVerificationRows(rows);
      setVerificationSummary(vSummary);
      updateImportBatch({ phase: "data_verified" });
      toast.success(`Verified ${rows.length} rows against database`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setVerifying(false);
    }
  }, [importableRows, results]);

  const downloadTemplate = () => {
    const headers = buildTemplateHeaders();
    const sample = buildTemplateSampleRow();
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([sample], { header: headers });
    XLSX.utils.book_append_sheet(wb, ws, "Candidates");

    const instructions = [
      ["Column", "Required", "Description", "Example"],
      ...IMPORT_COLUMN_DEFS.map((c) => [c.field, c.required ? "Yes" : "No", c.description, c.example ?? ""]),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(instructions), "Field guide");
    XLSX.writeFile(wb, "ellure_candidate_import_template.xlsx");
    toast.success("Template downloaded");
  };

  const parseFile = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_BYTES) {
      toast.error("File must be under 50MB");
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["xlsx", "xls"].includes(ext)) {
      toast.error("Only .xlsx and .xls files are supported");
      return;
    }

    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

    if (json.length === 0) {
      toast.error("No data rows found in file");
      return;
    }

    const headers = Object.keys(json[0] ?? {});
    const mapping = autoDetectColumnMapping(headers);

    const hasName = Object.values(mapping).includes("name");
    const hasEmail = Object.values(mapping).includes("email");
    const hasPhone = Object.values(mapping).includes("phone");
    if (!hasName || !hasEmail || !hasPhone) {
      toast.warning("Could not auto-detect name, email, or phone columns — map them manually");
    }

    clearImportBatch();
    setFileName(file.name);
    setRawRows(json);
    setDetectedHeaders(headers);
    setColumnMapping(mapping);
    setParsedRows([]);
    setResults([]);
    setVerificationRows([]);
    setVerificationSummary(null);
    setStep(2);
  }, []);

  const runValidation = async () => {
    setValidating(true);
    try {
      const mapped = applyColumnMapping(rawRows, columnMapping);
      const normalized = mapped.map((raw) => normalizeImportRow(raw));
      const fileDupes = findFileDuplicateEmails(normalized);
      const emails = normalized.map((r) => r.email).filter(Boolean);
      const existing = await fetchExistingApplicantEmails(emails);
      setExistingEmails(existing);

      const rows: ParsedRow[] = normalized.map((row, index) => ({
        index,
        normalized: row,
        validation: validateImportRowDetailed(row, {
          existingEmails: existing,
          fileDuplicateEmails: fileDupes,
        }),
      }));

      setParsedRows(rows);
      const batch = createImportBatch({ fileName, sourceRows: normalized });
      batch.phase = "excel_validating";
      saveImportBatch(batch);
      setStep(3);
      toast.success(`Validated ${rows.length} rows`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Validation failed");
    } finally {
      setValidating(false);
    }
  };

  const runImport = async () => {
    if (importableRows.length === 0) {
      toast.error("No valid rows to import");
      return;
    }

    setImporting(true);
    setStep(4);
    setProgress(0);
    setImportDetail("Starting import…");
    setResults([]);

    updateImportBatch({ phase: "excel_importing" });

    try {
      const batchResults = await importApplicantsBatch(importableRows, {
        overwrite: overwriteDuplicates,
        skipIfDuplicate: !overwriteDuplicates,
        existingEmails,
        onProgress: (done, total, result) => {
          const pct = Math.round((done / total) * 100);
          setProgress(pct);
          setImportDetail(`Imported ${done} of ${total} rows…`);
          setResults((prev) => [...prev, result]);
        },
      });

      const sum = summarizeImportResults(batchResults);
      await logImportToAudit({
        fileName,
        summary: sum,
        totalRows: parsedRows.length,
        actorId: user?.id,
      });

      const indexedEmails = batchResults
        .filter((r) => r.status === "inserted" || r.status === "updated")
        .map((r) => r.email);
      if (indexedEmails.length) {
        setImportDetail("Refreshing search index…");
        await refreshSearchIndexForEmails(indexedEmails);
      }

      const successfulEmails = batchResults
        .filter((r) => r.status === "inserted" || r.status === "updated")
        .map((r) => r.email.toLowerCase());
      setBatchEmails(successfulEmails);

      const batch = loadImportBatch();
      if (batch) {
        saveImportBatch({
          ...batch,
          importResults: batchResults,
          phase: "excel_imported",
        });
      }

      toast.success(
        `Import complete: ${sum.inserted} inserted, ${sum.updated} updated, ${sum.skipped} skipped, ${sum.failed} failed`
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
      setImportDetail("");
    }
  };

  const goToDataVerification = async () => {
    setStep(5);
    await runVerification();
  };

  const goToResumeUpload = () => {
    updateImportBatch({ phase: "resumes_uploading" });
    setStep(6);
  };

  const goToFinalCheck = async () => {
    setStep(7);
    await runVerification();
    updateImportBatch({ phase: "completed" });
  };

  const downloadErrorReport = () => {
    const rows = buildErrorReportRows(results);
    if (rows.length === 0) {
      toast.info("No errors to export");
      return;
    }
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Errors");
    XLSX.writeFile(wb, `import_errors_${Date.now()}.xlsx`);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) void parseFile(file);
  };

  const allReady = verificationSummary
    ? verificationSummary.readyForResdex === verificationSummary.inDatabase && verificationSummary.missingFromDb === 0
    : false;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Import candidates</h1>
        <p className="text-sm text-muted-foreground">
          7-step wizard — Excel import, data verification, resume linking, and final ResDex readiness check
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STEPS.map((s) => (
          <Badge
            key={s.n}
            variant={step === s.n ? "default" : step > s.n ? "secondary" : "outline"}
            className="gap-1.5 px-2.5 py-1 text-xs"
          >
            <span className="font-mono text-[10px] opacity-70">{s.n}</span>
            {s.title}
          </Badge>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileSpreadsheet className="h-5 w-5" />
              Step 1 — Download template
            </CardTitle>
            <CardDescription>
              Required columns map directly to the applicants table. Mandatory fields: name, email, phone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Column</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Example</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {IMPORT_COLUMN_DEFS.map((col) => (
                    <TableRow key={col.field}>
                      <TableCell className="font-mono text-xs">{col.field}</TableCell>
                      <TableCell>
                        {col.required ? (
                          <Badge variant="destructive" className="text-[10px]">
                            Required
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Optional</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{col.description}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{col.example ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-2">
              <p className="font-medium">Recommended workflow</p>
              <ol className="list-decimal pl-5 text-muted-foreground space-y-1">
                <li>Download and fill the Excel template</li>
                <li>Upload and validate the sheet</li>
                <li>Import candidate rows into the database</li>
                <li>Verify every row exists in the database with correct fields</li>
                <li>Upload resumes named by email or full name</li>
                <li>Run the final check before recruiters use ResDex</li>
              </ol>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download template Excel
              </Button>
              <Button variant="outline" asChild>
                <a href="/templates/ellure_candidate_import_template.xlsx" download>
                  <Download className="mr-2 h-4 w-4" />
                  Static template file
                </a>
              </Button>
              <Button variant="outline" onClick={() => setStep(2)}>
                Continue to upload
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Step 2 — Upload Excel file</CardTitle>
              <CardDescription>XLSX or XLS only, max 50MB. First sheet is used.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="cursor-pointer rounded-lg border-2 border-dashed p-10 text-center transition-colors hover:border-primary"
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => document.getElementById("import-file")?.click()}
              >
                <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium">Drag & drop or click to browse</p>
                <p className="mt-1 text-xs text-muted-foreground">.xlsx / .xls — max 50MB</p>
                {fileName && (
                  <p className="mt-3 text-xs font-medium text-primary">
                    {fileName} — {rawRows.length} rows
                  </p>
                )}
                <input
                  id="import-file"
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void parseFile(f);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {detectedHeaders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Column mapping</CardTitle>
                <CardDescription>Match detected headers to database fields.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {detectedHeaders.map((header) => (
                  <div key={header} className="flex flex-wrap items-center gap-3">
                    <span className="min-w-[140px] truncate text-sm font-medium" title={header}>
                      {header}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <Select
                      value={columnMapping[header] ?? "ignore"}
                      onValueChange={(v) => setColumnMapping((m) => ({ ...m, [header]: v as ImportDbField }))}
                    >
                      <SelectTrigger className="h-9 w-[220px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ignore">Ignore column</SelectItem>
                        {MAPPABLE_FIELDS.filter((f) => f !== "ignore").map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => void runValidation()} disabled={validating || rawRows.length === 0}>
                    {validating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Validating…
                      </>
                    ) : (
                      <>
                        Validate {rawRows.length} rows
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{counts.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Valid</p>
                <p className="text-2xl font-bold text-emerald-600">{counts.valid}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold text-amber-600">{counts.warnings}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-red-600">{counts.errors}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preview (first 10 rows)</CardTitle>
              {fileName && <p className="text-xs text-muted-foreground">{fileName}</p>}
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedRows.slice(0, 10).map((row) => (
                    <TableRow key={row.index} className={rowStatusClass(row.validation.level)}>
                      <TableCell className="text-xs">{row.index + 1}</TableCell>
                      <TableCell className="text-sm">{row.normalized.name || "—"}</TableCell>
                      <TableCell className="text-sm">{row.normalized.email || "—"}</TableCell>
                      <TableCell className="text-sm">{row.normalized.phone || "—"}</TableCell>
                      <TableCell className="text-sm">{row.normalized.city || "—"}</TableCell>
                      <TableCell>
                        {row.validation.level === "valid" && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                        {row.validation.level === "warning" && (
                          <span
                            className="flex items-center gap-1 text-xs text-amber-700"
                            title={row.validation.warnings.join("; ")}
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {row.validation.warnings[0]}
                          </span>
                        )}
                        {row.validation.level === "error" && (
                          <span
                            className="flex items-center gap-1 text-xs text-red-700"
                            title={row.validation.errors.join("; ")}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            {row.validation.errors[0]}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center gap-2">
                <Checkbox id="skip-errors" checked={skipErrors} onCheckedChange={(c) => setSkipErrors(!!c)} />
                <Label htmlFor="skip-errors" className="text-sm">
                  Skip rows with errors and import valid rows ({importableRows.length} ready)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="overwrite"
                  checked={overwriteDuplicates}
                  onCheckedChange={(c) => setOverwriteDuplicates(!!c)}
                />
                <Label htmlFor="overwrite" className="text-sm">
                  Overwrite existing applicants when email matches (otherwise skip duplicates)
                </Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => void runImport()} disabled={importableRows.length === 0}>
                  Import {importableRows.length} rows
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Step 4 — Importing candidates</CardTitle>
            <CardDescription>{fileName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <UploadProgressBar
              value={progress}
              active={importing}
              label="Importing Excel data"
              detail={importing ? importDetail || `Processing… ${progress}%` : `Import finished — ${progress}%`}
            />

            {!importing && (
              <>
                <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
                  <div className="rounded-lg border bg-emerald-50 p-3">
                    <p className="text-2xl font-bold text-emerald-700">{summary.inserted}</p>
                    <p className="text-xs text-muted-foreground">Inserted</p>
                  </div>
                  <div className="rounded-lg border bg-blue-50 p-3">
                    <p className="text-2xl font-bold text-blue-700">{summary.updated}</p>
                    <p className="text-xs text-muted-foreground">Updated</p>
                  </div>
                  <div className="rounded-lg border bg-amber-50 p-3">
                    <p className="text-2xl font-bold text-amber-700">{summary.skipped}</p>
                    <p className="text-xs text-muted-foreground">Skipped</p>
                  </div>
                  <div className="rounded-lg border bg-red-50 p-3">
                    <p className="text-2xl font-bold text-red-700">{summary.failed}</p>
                    <p className="text-xs text-muted-foreground">Failed</p>
                  </div>
                </div>

                <div className="max-h-40 overflow-y-auto rounded border text-xs">
                  {results.slice(-30).map((r, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex justify-between gap-2 border-b px-3 py-1.5 last:border-0",
                        r.status === "failed" && "text-red-700",
                        r.status === "skipped" && "text-amber-700",
                        (r.status === "inserted" || r.status === "updated") && "text-emerald-700"
                      )}
                    >
                      <span className="truncate">{r.email}</span>
                      <span className="shrink-0 capitalize">{r.status}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => void goToDataVerification()}>
                    Verify imported data
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={downloadErrorReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Download error report
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardCheck className="h-5 w-5" />
                Step 5 — Verify imported data
              </CardTitle>
              <CardDescription>
                Confirms every Excel row exists in the database with the expected fields. Open any profile to inspect
                before uploading resumes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {verifying ? (
                <div className="flex items-center gap-2 py-8 justify-center text-sm text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Checking database…
                </div>
              ) : verificationSummary ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-4">
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-2xl font-bold">{verificationSummary.totalInFile}</p>
                      <p className="text-xs text-muted-foreground">Rows in file</p>
                    </div>
                    <div className="rounded-lg border p-3 text-center bg-emerald-50">
                      <p className="text-2xl font-bold text-emerald-700">{verificationSummary.inDatabase}</p>
                      <p className="text-xs text-muted-foreground">Found in database</p>
                    </div>
                    <div className="rounded-lg border p-3 text-center bg-red-50">
                      <p className="text-2xl font-bold text-red-700">{verificationSummary.missingFromDb}</p>
                      <p className="text-xs text-muted-foreground">Missing from DB</p>
                    </div>
                    <div className="rounded-lg border p-3 text-center bg-amber-50">
                      <p className="text-2xl font-bold text-amber-700">{verificationSummary.withoutResume}</p>
                      <p className="text-xs text-muted-foreground">No resume yet</p>
                    </div>
                  </div>
                  <ImportBatchReviewTable rows={verificationRows} />
                </>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">Click refresh to run verification.</p>
              )}

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => void runVerification()} disabled={verifying}>
                  <RefreshCw className={cn("mr-2 h-4 w-4", verifying && "animate-spin")} />
                  Refresh check
                </Button>
                <Button onClick={goToResumeUpload} disabled={!verificationSummary || verificationSummary.importedOk === 0}>
                  Continue to resume upload
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setStep(4)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 6 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Step 6 — Upload resumes</CardTitle>
            <CardDescription>
              Upload CV files for applicants imported from this Excel batch. Files are matched by name or email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <BatchResumeUploadPanel
              batchEmails={
                batchEmails.length
                  ? batchEmails
                  : (() => {
                      const b = loadImportBatch();
                      return b ? getSuccessfulBatchEmails(b) : [];
                    })()
              }
              onComplete={() => {
                toast.success("Resumes uploaded — run final check");
              }}
            />
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <Button onClick={() => void goToFinalCheck()}>
                Run final check
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => setStep(5)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 7 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              {allReady ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              )}
              Step 7 — Final readiness check
            </CardTitle>
            <CardDescription>
              {allReady
                ? "All imported candidates are in the database, have resumes linked, and are indexed for ResDex search."
                : "Some candidates need attention before recruiters use ResDex. Fix issues below or re-upload resumes."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {verifying ? (
              <div className="flex items-center gap-2 py-8 justify-center text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Running final verification…
              </div>
            ) : verificationSummary ? (
              <>
                <div
                  className={cn(
                    "rounded-lg border p-4",
                    allReady ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"
                  )}
                >
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted-foreground">ResDex ready</p>
                      <p className="text-2xl font-bold text-emerald-700">{verificationSummary.readyForResdex}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">With resume</p>
                      <p className="text-2xl font-bold">{verificationSummary.withResume}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Needs attention</p>
                      <p className="text-2xl font-bold text-amber-700">{verificationSummary.notReady}</p>
                    </div>
                  </div>
                </div>

                <ImportBatchReviewTable rows={verificationRows.filter((r) => !r.readyForResdex)} />
                {verificationRows.filter((r) => !r.readyForResdex).length === 0 && (
                  <p className="text-sm text-emerald-700 text-center py-4">
                    All {verificationSummary.inDatabase} candidates are ready for recruiters.
                  </p>
                )}
              </>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => void runVerification()} disabled={verifying}>
                <RefreshCw className={cn("mr-2 h-4 w-4", verifying && "animate-spin")} />
                Re-run check
              </Button>
              <Button variant="outline" onClick={() => setStep(6)}>
                Upload more resumes
              </Button>
                <Button asChild>
                  <Link to="/dashboard/admin/applicants">Open candidate search</Link>
                </Button>
              <Button
                variant="outline"
                onClick={() => {
                  clearImportBatch();
                  setStep(1);
                  setParsedRows([]);
                  setRawRows([]);
                  setFileName("");
                  setResults([]);
                  setVerificationRows([]);
                  setVerificationSummary(null);
                }}
              >
                Start new import
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImportCandidatesPage;
