import { Badge } from "@/components/ui/badge";
import { Search, FolderKanban, Sparkles } from "lucide-react";

export function ResumeSearchVisual() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xl">
      <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-4 py-3">
        <Search className="h-5 w-5 text-primary" />
        <span className="text-sm text-muted-foreground">Search by skills, role, location…</span>
      </div>
      <div className="mt-4 space-y-3">
        {["Senior React Developer", "Data Analyst — Pune", "DevOps Engineer"].map((label, i) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-lg border border-border/80 bg-background px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">Match score {92 - i * 4}%</p>
            </div>
            <Badge variant="secondary" className="shrink-0">
              <Sparkles className="mr-1 h-3 w-3" />
              AI
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CollaborationVisual() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xl">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <FolderKanban className="h-5 w-5 text-secondary" />
        Client shortlists
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { name: "Engineering Q1", count: 48 },
          { name: "BFSI Leads", count: 32 },
          { name: "Fresher Pool", count: 67 },
          { name: "Urgent Roles", count: 19 },
        ].map((folder) => (
          <div
            key={folder.name}
            className="rounded-xl border border-border bg-[#E9F0FF] p-4 text-center"
          >
            <p className="text-xs font-medium">{folder.name}</p>
            <p className="mt-1 text-lg font-bold text-primary">{folder.count}</p>
            <p className="text-[10px] text-muted-foreground">candidates</p>
          </div>
        ))}
      </div>
    </div>
  );
}
