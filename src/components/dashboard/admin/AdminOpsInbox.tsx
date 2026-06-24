import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileSpreadsheet, Users, UserCog } from "lucide-react";
import { loadImportBatch } from "@/lib/importBatchSession";
import { portalPanelClass } from "@/components/portal/portalStyles";
import { cn } from "@/lib/utils";

interface AdminOpsInboxProps {
  pendingApprovals: number;
  totalApplicants: number;
  resumesUploaded: number;
}

export function AdminOpsInbox({
  pendingApprovals,
  totalApplicants,
  resumesUploaded,
}: AdminOpsInboxProps) {
  const batch = loadImportBatch();
  const importInProgress = batch && batch.phase !== "completed" && batch.importResults.length > 0;
  const missingResumesEstimate =
    totalApplicants > 0 ? Math.max(0, totalApplicants - resumesUploaded) : 0;

  const items = [
    pendingApprovals > 0 && {
      key: "pending",
      icon: UserCog,
      title: `${pendingApprovals} recruiter${pendingApprovals !== 1 ? "s" : ""} awaiting approval`,
      href: "/dashboard/admin/recruiters?status=pending",
      cta: "Review",
      tint: "text-amber-700",
    },
    importInProgress && {
      key: "import",
      icon: FileSpreadsheet,
      title: `Import in progress — ${batch?.fileName ?? "batch"}`,
      href: "/dashboard/admin/data/import?step=5",
      cta: "Continue",
      tint: "text-primary",
    },
    missingResumesEstimate > 0 && {
      key: "resumes",
      icon: Users,
      title: `~${missingResumesEstimate.toLocaleString()} profiles may be missing resumes`,
      href: "/dashboard/admin/data/import?step=6",
      cta: "Upload CVs",
      tint: "text-sky-700",
    },
  ].filter(Boolean) as {
    key: string;
    icon: typeof Users;
    title: string;
    href: string;
    cta: string;
    tint: string;
  }[];

  if (items.length === 0) {
    return (
      <div className={cn(portalPanelClass, "p-4 flex items-center gap-3 text-sm text-muted-foreground")}>
        <AlertCircle className="h-4 w-4 text-emerald-600 shrink-0" />
        All clear — no urgent admin actions right now.
      </div>
    );
  }

  return (
    <div className={cn(portalPanelClass, "divide-y")}>
      {items.map((item) => (
        <div key={item.key} className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3 min-w-0">
            <item.icon className={cn("h-5 w-5 shrink-0", item.tint)} />
            <p className="text-sm font-medium truncate">{item.title}</p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 h-8 text-xs" asChild>
            <Link to={item.href}>{item.cta}</Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
