import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, FolderPlus, MapPin, MoreHorizontal } from "lucide-react";
import type { Applicant } from "@/hooks/useApplicants";
import { formatLpa } from "@/lib/dateFormat";
import { extractHighlightTerms } from "@/utils/booleanSearchParser";
import type { SearchMode } from "@/lib/resdexSearchParams";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function highlightText(text: string, terms: string[]) {
  if (!terms.length || !text) return text;
  const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    terms.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
      <mark key={i} className="rounded bg-amber-100 px-0.5 text-amber-900">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

interface AdminCandidateCardProps {
  applicant: Applicant;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  searchQuery: string;
  searchMode: SearchMode;
  onAddToFolder?: (id: string) => void;
  onStatusChange?: (status: string, id: string) => void;
}

export function AdminCandidateCard({
  applicant,
  selected,
  onSelect,
  searchQuery,
  searchMode,
  onAddToFolder,
  onStatusChange,
}: AdminCandidateCardProps) {
  const terms = extractHighlightTerms(searchQuery, searchMode);
  const skills = (applicant.key_skills
    ? String(applicant.key_skills).split(/[,;|]/).map((s) => s.trim())
    : []
  ).filter(Boolean);
  const visibleSkills = skills.slice(0, 5);
  const extraSkills = skills.length - visibleSkills.length;
  const name = applicant.name || "Unnamed";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const exp =
    applicant.total_experience_years != null
      ? `${applicant.total_experience_years} yrs`
      : applicant.experience || "—";
  const status = applicant.status || "submitted";

  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md",
        selected && "ring-2 ring-primary/30 border-primary/40"
      )}
    >
      <div className="flex gap-3">
        <Checkbox checked={selected} onCheckedChange={(c) => onSelect(!!c)} className="mt-1" />
        <Avatar className="h-11 w-11 shrink-0">
          <AvatarFallback className="bg-slate-100 text-slate-700 text-sm">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">
                {highlightText(name, terms)}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {highlightText(
                  applicant.current_designation || applicant.job_role || "—",
                  terms
                )}
                {applicant.current_company ? ` · ${applicant.current_company}` : ""}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                {applicant.city || applicant.currentCity || "—"}
                {applicant.education_level ? ` · ${applicant.education_level}` : ""}
              </p>
            </div>
            <Badge variant="outline" className="shrink-0 capitalize text-[10px]">
              {status.replace(/_/g, " ")}
            </Badge>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            <Badge variant="secondary">{exp}</Badge>
            {applicant.current_ctc != null && (
              <Badge variant="outline">{formatLpa(Number(applicant.current_ctc))}</Badge>
            )}
            {applicant.notice_period && <Badge variant="outline">{applicant.notice_period}</Badge>}
            {applicant.is_verified && <Badge className="bg-emerald-600 text-white">Verified</Badge>}
          </div>

          {visibleSkills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {visibleSkills.map((s) => (
                <Badge key={s} variant="secondary" className="text-[10px] font-normal">
                  {highlightText(s, terms)}
                </Badge>
              ))}
              {extraSkills > 0 && (
                <span className="text-[10px] text-muted-foreground self-center">+{extraSkills} more</span>
              )}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="default" className="h-8 text-xs" asChild>
              <Link to={`/dashboard/admin/applicants/${applicant.id}`}>
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                View profile
              </Link>
            </Button>
            {onAddToFolder && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={() => onAddToFolder(applicant.id)}
              >
                <FolderPlus className="mr-1.5 h-3.5 w-3.5" />
                Add to folder
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onStatusChange &&
                  ["shortlisted", "under_review", "rejected", "on_hold"].map((s) => (
                    <DropdownMenuItem key={s} onClick={() => onStatusChange(s, applicant.id)}>
                      Mark {s.replace(/_/g, " ")}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
