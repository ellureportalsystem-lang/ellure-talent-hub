import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { HiringProcessStep } from "@/lib/hiringProcessSteps";
import { motion } from "framer-motion";
import { Briefcase, Calendar, FileText, MapPin, Users } from "lucide-react";

type HiringProcessStepPreviewProps = {
  step: HiringProcessStep;
};

export function HiringProcessStepPreview({ step }: HiringProcessStepPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="mt-4"
    >
      <div className="rounded-xl border border-border/80 bg-muted/25 p-3 sm:p-3.5">
        {step.id === "understand" && <UnderstandPreview />}
        {step.id === "source" && <SourcePreview />}
        {step.id === "screen" && <ScreenPreview />}
        {step.id === "deliver" && <DeliverPreview />}
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] text-emerald-600">
          ✓
        </span>
        {step.successMessage}
      </p>
    </motion.div>
  );
}

function UnderstandPreview() {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
        <Briefcase className="h-3.5 w-3.5 text-primary" />
        Role brief & alignment
      </div>
      <div className="rounded-lg border border-border bg-card px-3 py-2">
        <p className="text-xs font-semibold">Senior React Developer — Pune</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">3–5 yrs · Full-time · Hybrid · Budget aligned</p>
      </div>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {["Skills & experience aligned", "Notice period confirmed", "Timeline agreed", "Stakeholders looped in"].map(
          (line) => (
            <li key={line} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-primary" />
              {line}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

function SourcePreview() {
  const rows = [
    { name: "Priya S.", role: "Frontend Dev", tag: "New", source: "Referral" },
    { name: "Rahul M.", role: "Full Stack", tag: "Validated", source: "Portal" },
    { name: "Anita K.", role: "React", tag: "New", source: "Campaign" },
  ];
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-muted-foreground">Structured resume intake & validation</p>
      {rows.map((row, i) => (
        <div
          key={row.name}
          className={cn(
            "flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5",
            i === 0 && "ring-1 ring-primary/20"
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
              {row.name[0]}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium">{row.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{row.role}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Badge variant="outline" className="h-5 px-1.5 text-[9px] font-normal">
              {row.source}
            </Badge>
            <Badge variant="secondary" className="h-5 px-1.5 text-[9px]">
              {row.tag}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScreenPreview() {
  const rows = [
    { name: "Priya S.", score: 94, skills: "React · TS" },
    { name: "Rahul M.", score: 88, skills: "Node · AWS" },
    { name: "Anita K.", score: 91, skills: "React · Redux" },
  ];
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-muted-foreground">Skill mapping & relevance scoring</p>
      {rows.map((row, i) => (
        <div
          key={row.name}
          className={cn(
            "flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5",
            i === 0 && "border-primary/25 bg-primary/[0.03]"
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="h-3.5 w-3.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium">{row.name}</p>
              <p className="text-[10px] text-muted-foreground">{row.skills}</p>
            </div>
          </div>
          <Badge className="h-5 shrink-0 bg-primary/10 px-1.5 text-[9px] text-primary hover:bg-primary/15">
            {row.score}%
          </Badge>
        </div>
      ))}
      <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <MapPin className="h-3 w-3 shrink-0" />
        Mapped to role requirements · Experience verified
      </p>
    </div>
  );
}

function DeliverPreview() {
  return (
    <div className="space-y-2.5">
      <p className="text-[11px] font-semibold text-muted-foreground">Client handoff & interview coordination</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { folder: "Engineering Q1", count: 12 },
          { folder: "Urgent roles", count: 5 },
        ].map((item, i) => (
          <div
            key={item.folder}
            className={cn(
              "rounded-lg border border-border bg-card p-2.5 text-center",
              i === 0 && "border-primary/30 bg-primary/5"
            )}
          >
            <p className="text-[10px] font-medium">{item.folder}</p>
            <p className="mt-0.5 text-base font-bold text-primary">{item.count}</p>
            <p className="text-[9px] text-muted-foreground">candidates</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5">
          <Calendar className="h-3 w-3" />
          Interviews scheduled
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5">
          <Users className="h-3 w-3" />
          Feedback shared
        </span>
      </div>
    </div>
  );
}
