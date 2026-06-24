import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BatchVerificationRow } from "@/services/importVerificationService";
import { CheckCircle2, XCircle, AlertTriangle, ExternalLink, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImportBatchReviewTableProps {
  rows: BatchVerificationRow[];
  showImportStatus?: boolean;
  profileBasePath?: string;
  maxHeight?: string;
}

function StatusIcon({ ok, warn }: { ok: boolean; warn?: boolean }) {
  if (ok) return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (warn) return <AlertTriangle className="h-4 w-4 text-amber-600" />;
  return <XCircle className="h-4 w-4 text-red-600" />;
}

export function ImportBatchReviewTable({
  rows,
  showImportStatus = true,
  profileBasePath = "/dashboard/admin/applicants",
  maxHeight = "420px",
}: ImportBatchReviewTableProps) {
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No rows to review.</p>;
  }

  return (
    <div className="overflow-auto rounded-md border" style={{ maxHeight }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            {showImportStatus && <TableHead>Import</TableHead>}
            <TableHead>In DB</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Search</TableHead>
            <TableHead>Issues</TableHead>
            <TableHead className="w-24">Profile</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const importOk = row.importStatus === "inserted" || row.importStatus === "updated";
            const hasIssues = row.missingFields.length > 0 || row.mismatchedFields.length > 0;
            const issueText = [
              ...row.missingFields.map((f) => `Missing ${f}`),
              ...row.mismatchedFields.map((f) => `Mismatch ${f}`),
              row.importError,
            ]
              .filter(Boolean)
              .join("; ");

            return (
              <TableRow
                key={`${row.email}-${row.rowIndex}`}
                className={cn(
                  row.readyForResdex && "bg-emerald-50/40",
                  !row.inDatabase && importOk && "bg-red-50/60",
                  row.inDatabase && !row.resumeAttached && "bg-amber-50/40"
                )}
              >
                <TableCell className="text-xs text-muted-foreground">{row.rowIndex + 1}</TableCell>
                <TableCell className="text-sm font-medium max-w-[140px] truncate" title={row.name}>
                  {row.name || "—"}
                </TableCell>
                <TableCell className="text-sm max-w-[180px] truncate" title={row.email}>
                  {row.email || "—"}
                </TableCell>
                {showImportStatus && (
                  <TableCell>
                    <Badge
                      variant={
                        importOk ? "secondary" : row.importStatus === "skipped" ? "outline" : "destructive"
                      }
                      className="text-[10px] capitalize"
                    >
                      {row.importStatus.replace("_", " ")}
                    </Badge>
                  </TableCell>
                )}
                <TableCell>
                  <StatusIcon ok={row.inDatabase} />
                </TableCell>
                <TableCell>
                  {row.inDatabase ? (
                    row.resumeAttached ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-700">
                        <FileText className="h-3.5 w-3.5" />
                        Linked
                      </span>
                    ) : (
                      <span className="text-xs text-amber-700">Missing</span>
                    )
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {row.inDatabase ? (
                    <StatusIcon ok={row.searchIndexed} warn={!row.searchIndexed} />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="max-w-[160px]">
                  {hasIssues || row.importError ? (
                    <span className="text-xs text-amber-800 line-clamp-2" title={issueText}>
                      {issueText || "—"}
                    </span>
                  ) : row.readyForResdex ? (
                    <span className="text-xs text-emerald-700">Ready</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {row.applicantId ? (
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                      <Link to={`${profileBasePath}/${row.applicantId}`} target="_blank" rel="noopener">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        View
                      </Link>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
