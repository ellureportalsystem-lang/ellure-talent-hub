import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  normalizeImportRow,
  validateImportRow,
  importApplicantsBatch,
  type ImportRow,
  type ImportResult,
} from "@/services/importService";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PortalPageHeader } from "@/components/portal/portal-ui";
import { portalPanelClass } from "@/components/portal/portalStyles";

type Step = 1 | 2 | 3 | 4;

interface ParsedRow {
  raw: Record<string, unknown>;
  normalized: ImportRow;
  errors: string[];
}

const TEMPLATE_HEADERS = [
  "name", "email", "phone", "city", "job_role", "current_designation", "current_company",
  "total_experience_years", "experience_type", "current_ctc", "expected_ctc", "notice_period",
  "education_level", "highest_qualification", "course_degree_name", "university_institute_name",
  "year_of_passing", "key_skills", "communication",
];

const ImportCandidatesPage = () => {
  const [step, setStep] = useState<Step>(1);
  const [fileName, setFileName] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ImportResult[]>([]);

  const validRows = parsedRows.filter((r) => r.errors.length === 0);
  const errorRows = parsedRows.filter((r) => r.errors.length > 0);

  const downloadTemplate = () => {
    const sample = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "9876543210",
      city: "Pune",
      job_role: "Data Analyst",
      current_designation: "Analyst",
      current_company: "Acme Corp",
      total_experience_years: 3,
      experience_type: "Mid-Level",
      current_ctc: "5 LPA",
      expected_ctc: "7 LPA",
      notice_period: "30 Days",
      education_level: "Graduate",
      highest_qualification: "B.Tech",
      course_degree_name: "B.Tech IT",
      university_institute_name: "SPPU",
      year_of_passing: 2020,
      key_skills: "SQL, Python, Excel",
      communication: "Good",
    };
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([sample], { header: TEMPLATE_HEADERS });
    XLSX.utils.book_append_sheet(wb, ws, "Import Template");
    const instructions = [
      ["Column", "Required", "Valid values / notes"],
      ["name", "Yes", "Full name"],
      ["email", "Yes", "Unique per candidate"],
      ["phone", "Yes", "10-digit mobile"],
      ["city", "Yes", "e.g. Pune, Mumbai"],
      ["notice_period", "No", "Immediate, 15 Days, 30 Days, 45 Days, 60 Days, 90 Days"],
      ["education_level", "No", "Graduate, Post Graduate, Diploma, 12th, 10th, Doctorate"],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(instructions), "Instructions");
    XLSX.writeFile(wb, "ellure_import_template.xlsx");
  };

  const parseFile = useCallback(async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["xlsx", "csv"].includes(ext)) {
      toast.error("Only .xlsx and .csv files are supported");
      return;
    }

    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

    const rows: ParsedRow[] = json.map((raw) => {
      const normalized = normalizeImportRow(raw);
      const errors = validateImportRow(normalized);
      return { raw, normalized, errors };
    });

    setFileName(file.name);
    setParsedRows(rows);
    setStep(2);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) void parseFile(file);
  };

  const runImport = async () => {
    setImporting(true);
    setStep(4);
    setProgress(0);
    setResults([]);
    try {
      const batchResults = await importApplicantsBatch(validRows.map((r) => r.normalized), (done, total, result) => {
        setProgress(Math.round((done / total) * 100));
        setResults((prev) => [...prev, result]);
      });
      const inserted = batchResults.filter((r) => r.status === "inserted").length;
      const updated = batchResults.filter((r) => r.status === "updated").length;
      const failed = batchResults.filter((r) => r.status === "failed").length;
      toast.success(`Import complete: ${inserted} inserted, ${updated} updated, ${failed} failed`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const summary = {
    inserted: results.filter((r) => r.status === "inserted").length,
    updated: results.filter((r) => r.status === "updated").length,
    failed: results.filter((r) => r.status === "failed").length,
  };

  return (
    <DashboardPageShell width="wide" className="space-y-6">
      <PortalPageHeader title="Import data" subtitle="Bulk import candidates from Excel or CSV" />
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((s) => (
          <Badge key={s} variant={step === s ? "default" : "outline"}>
            Step {s}
          </Badge>
        ))}
      </div>

      {step === 1 && (
        <Card className={portalPanelClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload file
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => document.getElementById("import-file")?.click()}
            >
              <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Drag & drop or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">.xlsx or .csv — max 10MB</p>
              <input
                id="import-file"
                type="file"
                accept=".xlsx,.csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void parseFile(f);
                }}
              />
            </div>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </CardContent>
        </Card>
      )}

      {step >= 2 && (
        <div className="grid gap-4 lg:grid-cols-3 mb-4">
          <Card className={portalPanelClass}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total rows</p>
              <p className="text-2xl font-bold">{parsedRows.length}</p>
            </CardContent>
          </Card>
          <Card className={portalPanelClass}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Valid</p>
              <p className="text-2xl font-bold text-emerald-600">{validRows.length}</p>
            </CardContent>
          </Card>
          <Card className={portalPanelClass}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Errors</p>
              <p className="text-2xl font-bold text-destructive">{errorRows.length}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 2 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Preview (first 10 rows)</CardTitle>
            {fileName && <p className="text-xs text-muted-foreground">{fileName}</p>}
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">City</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {parsedRows.slice(0, 10).map((row, i) => (
                  <tr key={i} className={row.errors.length ? "bg-destructive/5" : ""}>
                    <td className="p-2">{row.normalized.name}</td>
                    <td className="p-2">{row.normalized.email}</td>
                    <td className="p-2">{row.normalized.city}</td>
                    <td className="p-2">
                      {row.errors.length ? (
                        <span className="text-destructive text-xs" title={row.errors.join(", ")}>
                          {row.errors[0]}
                        </span>
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setStep(3)} disabled={validRows.length === 0}>
                Continue ({validRows.length} valid rows)
              </Button>
              <Button variant="outline" onClick={() => setStep(1)}>
                Re-upload
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Normalization preview</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <p>• Experience like &quot;3 YRS&quot; → numeric years</p>
            <p>• CTC like &quot;4.5LPA&quot; → stored as &quot;4.5 LPA&quot;</p>
            <p>• Notice &quot;30days&quot; → &quot;30 Days&quot;</p>
            <p>• Education &quot;B.Tech&quot; → &quot;Graduate&quot;</p>
            <div className="flex gap-2 pt-4">
              <Button onClick={runImport} disabled={importing || validRows.length === 0}>
                Start Import ({validRows.length} rows)
              </Button>
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className={portalPanelClass}>
          <CardHeader>
            <CardTitle>Import progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground">{importing ? `Processing… ${progress}%` : "Complete"}</p>
            {!importing && (
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{summary.inserted}</p>
                  <p className="text-xs">Inserted</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{summary.updated}</p>
                  <p className="text-xs">Updated</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{summary.failed}</p>
                  <p className="text-xs">Failed</p>
                </div>
              </div>
            )}
            <div className="max-h-48 overflow-y-auto text-xs space-y-1">
              {results.slice(-20).map((r, i) => (
                <div key={i} className="flex justify-between gap-2">
                  <span className="truncate">{r.email}</span>
                  <span className={r.status === "failed" ? "text-destructive" : "text-emerald-600"}>
                    {r.status} {r.error && <AlertTriangle className="inline h-3 w-3" />}
                  </span>
                </div>
              ))}
            </div>
            {!importing && (
              <Button asChild>
                <Link to="/dashboard/admin/applicants">View Imported Applicants</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </DashboardPageShell>
  );
};

export default ImportCandidatesPage;
