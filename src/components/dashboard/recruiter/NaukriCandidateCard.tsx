import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  IndianRupee,
  MapPin,
  Phone,
  Eye,
  Download,
  Share2,
  Clock,
  MessageSquare,
  Bookmark,
  FileText,
} from "lucide-react";
import type { Applicant } from "@/hooks/useApplicants";
import { formatLpa } from "@/lib/dateFormat";
import { extractHighlightTerms } from "@/utils/booleanSearchParser";
import type { SearchMode } from "@/lib/resdexSearchParams";
import { cn } from "@/lib/utils";
import { tagColorClass } from "@/components/client/UpgradePlanModal";

type CandidateTag = { tag: string; color: string };

function highlightText(text: string, terms: string[]) {
  if (!terms.length || !text) return text;
  const pattern = new RegExp(
    `(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  );
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    terms.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
      <mark key={i} className="bg-yellow-200 px-0.5 text-slate-900">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function formatExp(years: number | null | undefined) {
  if (years == null) return "—";
  const y = Math.floor(years);
  const m = Math.round((years - y) * 12);
  return m > 0 ? `${y}y ${m}m` : `${y}y`;
}

function similarCount(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
  return 100 + (h % 400);
}

type NaukriCandidateCardProps = {
  applicant: Applicant;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  searchQuery: string;
  searchMode: SearchMode;
  profilePath: string;
  onViewPhone?: (id: string) => void;
  onSave?: (id: string) => void;
  showContactActions?: boolean;
  tags?: CandidateTag[];
  isContacted?: boolean;
  isDownloaded?: boolean;
};

export function NaukriCandidateCard({
  applicant,
  selected,
  onSelect,
  searchQuery,
  searchMode,
  profilePath,
  onViewPhone,
  onSave,
  showContactActions = true,
  tags = [],
  isContacted = false,
  isDownloaded = false,
}: NaukriCandidateCardProps) {
  const terms = extractHighlightTerms(searchQuery, searchMode);
  const name = applicant.name || "Candidate";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const skills = String(applicant.key_skills || "")
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const prefCities = applicant.preferred_locations
    ? String(applicant.preferred_locations).split(/[,;|]/).map((s) => s.trim()).filter(Boolean)
    : applicant.city
      ? [applicant.city]
      : [];

  const lastActive = applicant.updated_at
    ? new Date(applicant.updated_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
    : null;

  return (
    <article
      className={cn(
        "rounded border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md",
        selected && "ring-2 ring-[#0566CD]/40 border-[#0566CD]/50"
      )}
    >
      <div className="flex gap-0">
        <div className="flex-1 min-w-0 p-4">
          <div className="flex gap-3">
            <Checkbox checked={selected} onCheckedChange={(c) => onSelect(!!c)} className="mt-1 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <Link to={profilePath} className="text-base font-semibold text-[#0566CD] hover:underline">
                  {highlightText(name, terms)}
                </Link>
                {isContacted && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700" title="Contacted">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Contacted
                  </span>
                )}
                {isDownloaded && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#0566CD]" title="CV downloaded">
                    <span className="h-2 w-2 rounded-full bg-[#0566CD]" /> Downloaded
                  </span>
                )}
                <span className="flex items-center gap-1 text-slate-600">
                  <Briefcase className="h-3.5 w-3.5" />
                  {formatExp(applicant.total_experience_years as number)}
                </span>
                {applicant.current_ctc != null && (
                  <span className="flex items-center gap-1 text-slate-600">
                    <IndianRupee className="h-3.5 w-3.5" />
                    {formatLpa(Number(applicant.current_ctc))}
                  </span>
                )}
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="h-3.5 w-3.5" />
                  {applicant.city || "—"}
                </span>
              </div>

              <dl className="mt-3 grid gap-1.5 text-sm">
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <dt className="text-slate-500">Current</dt>
                  <dd className="text-slate-800">
                    {highlightText(
                      `${applicant.current_designation || applicant.job_role || "—"} at ${applicant.current_company || "—"}`,
                      terms
                    )}
                  </dd>
                </div>
                {applicant.previous_company && (
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <dt className="text-slate-500">Previous</dt>
                    <dd className="text-slate-800">{applicant.previous_company}</dd>
                  </div>
                )}
                {(applicant.highest_qualification || applicant.education_level) && (
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <dt className="text-slate-500">Education</dt>
                    <dd className="text-slate-800">
                      {applicant.highest_qualification || applicant.education_level}
                    </dd>
                  </div>
                )}
                {prefCities.length > 0 && (
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <dt className="text-slate-500">Pref. locations</dt>
                    <dd className="text-slate-800">
                      {prefCities.slice(0, 4).join(", ")}
                      {prefCities.length > 4 && ` +${prefCities.length - 4} more`}
                    </dd>
                  </div>
                )}
                {skills.length > 0 && (
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <dt className="text-slate-500">Key skills</dt>
                    <dd className="text-slate-800 leading-relaxed">
                      {highlightText(skills.join(", "), terms)}
                    </dd>
                  </div>
                )}
              </dl>

              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {tags.slice(0, 4).map((t) => (
                    <span
                      key={t.tag}
                      className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", tagColorClass(t.color))}
                    >
                      {t.tag}
                    </span>
                  ))}
                </div>
              )}

              <button type="button" className="mt-2 text-sm font-medium text-[#0566CD] hover:underline">
                {similarCount(applicant.id)} similar profiles
              </button>
            </div>
          </div>
        </div>

        {/* Right action column — Naukri style */}
        <div className="hidden w-[200px] shrink-0 border-l border-slate-100 p-4 md:flex flex-col items-center text-center">
          <Avatar className="h-14 w-14 mb-2">
            <AvatarImage src={applicant.profile_image || undefined} />
            <AvatarFallback className="bg-slate-100 text-slate-600">{initials}</AvatarFallback>
          </Avatar>
          <p className="text-xs text-slate-600 line-clamp-3 mb-3">
            {applicant.resume_headline || applicant.current_designation || applicant.job_role || "Professional"}
          </p>
          {showContactActions && (
            <div className="w-full space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs border-[#0566CD] text-[#0566CD]"
                onClick={() => onViewPhone?.(applicant.id)}
              >
                View phone number
              </Button>
              <Button variant="outline" size="sm" className="w-full h-8 text-xs border-[#0566CD] text-[#0566CD]">
                <Phone className="h-3 w-3 mr-1" />
                Call candidate
              </Button>
              <p className="text-[10px] text-emerald-600">Verified phone & email</p>
            </div>
          )}
        </div>

        <div className="hidden lg:flex flex-col items-center gap-2 border-l border-slate-100 px-2 py-4 text-slate-500">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link to={profilePath}><FileText className="h-4 w-4" /></Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Share2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Clock className="h-4 w-4" /></Button>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-2 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> —</span>
          <span className="flex items-center gap-1"><Download className="h-3 w-3" /> —</span>
          {lastActive && <span>Modified {lastActive}</span>}
          {applicant.is_actively_looking && (
            <span className="text-emerald-600 font-medium">Active in last 15 days</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center gap-1 text-[#0566CD] hover:underline">
            <MessageSquare className="h-3 w-3" /> Comment
          </button>
          <button
            type="button"
            className="flex items-center gap-1 text-[#0566CD] hover:underline"
            onClick={() => onSave?.(applicant.id)}
          >
            <Bookmark className="h-3 w-3" /> Save
          </button>
        </div>
      </footer>
    </article>
  );
}
