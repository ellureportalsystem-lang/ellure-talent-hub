import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  IndianRupee,
  MapPin,
  Bookmark,
  Phone,
  Clock,
  Eye,
  Download,
  Linkedin,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { HighlightText } from "./HighlightText";
import { formatExpNaukri, formatLacs, splitSkills } from "@/lib/naukriFormat";
import { getApplicantLastUpdated } from "@/lib/applicantProfileTimestamps";
import { displayCandidateName } from "@/lib/clientMasking";
import type { SearchMode } from "@/lib/resdexSearchParams";
import { cn } from "@/lib/utils";

export type ResdexProfileApplicant = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  profile_image?: string | null;
  resume_headline?: string | null;
  current_designation?: string | null;
  current_company?: string | null;
  previous_company?: string | null;
  job_role?: string | null;
  current_ctc?: number | string | null;
  total_experience_years?: number | null;
  highest_qualification?: string | null;
  education_level?: string | null;
  preferred_locations?: string | string[] | null;
  key_skills?: string | null;
  notice_period?: string | null;
  notice_period_days?: number | null;
  is_actively_looking?: boolean | null;
  last_profile_updated_at?: string | null;
  updated_at?: string | null;
  industry?: string | null;
  department?: string | null;
  linkedin_url?: string | null;
  profile_summary?: string | null;
};

type ResdexProfileHeaderProps = {
  applicant: ResdexProfileApplicant;
  searchQuery: string;
  searchMode: SearchMode;
  contactVisible: boolean;
  onRevealContact: () => void;
  onSave?: () => void;
  onDownloadCv?: () => void;
  downloaded?: boolean;
  viewCount?: number;
  downloadCount?: number;
};

export function ResdexProfileHeader({
  applicant,
  searchQuery,
  searchMode,
  contactVisible,
  onRevealContact,
  onSave,
  onDownloadCv,
  downloaded = false,
  viewCount = 0,
  downloadCount = 0,
}: ResdexProfileHeaderProps) {
  const [saved, setSaved] = useState(false);
  const displayName = contactVisible ? applicant.name : displayCandidateName(applicant.name, false, false);
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const prefLocs = Array.isArray(applicant.preferred_locations)
    ? applicant.preferred_locations
    : applicant.preferred_locations
      ? splitSkills(String(applicant.preferred_locations))
      : applicant.city
        ? [applicant.city]
        : [];

  const lastModIso = getApplicantLastUpdated(applicant);
  const lastMod = lastModIso
    ? new Date(lastModIso).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const noticeText = applicant.notice_period
    ? applicant.notice_period
    : applicant.notice_period_days
      ? `${applicant.notice_period_days} days notice`
      : null;

  return (
    <div className="rounded border border-slate-200 bg-white shadow-sm">
      <div className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row">
          <Avatar className="h-16 w-16 shrink-0">
            <AvatarImage src={applicant.profile_image || undefined} />
            <AvatarFallback className="bg-slate-100 text-lg">{initials}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start gap-2">
              <h1 className="text-xl font-bold text-slate-900">{displayName}</h1>
              <button
                type="button"
                className={cn("text-[#0566CD]", saved && "fill-current")}
                onClick={() => {
                  setSaved((s) => !s);
                  onSave?.();
                }}
              >
                <Bookmark className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                {formatExpNaukri(applicant.total_experience_years)}
              </span>
              <span className="flex items-center gap-1">
                <IndianRupee className="h-3.5 w-3.5" />
                {formatLacs(applicant.current_ctc)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {applicant.city || "—"}
              </span>
            </div>

            <dl className="mt-4 space-y-1.5 text-sm">
              <div className="grid grid-cols-[110px_1fr] gap-2">
                <dt className="text-slate-500">Current</dt>
                <dd className="text-slate-800">
                  <HighlightText
                    text={`${applicant.current_designation || applicant.job_role || "—"} at ${applicant.current_company || "—"}`}
                    query={searchQuery}
                    mode={searchMode}
                  />
                </dd>
              </div>
              {applicant.previous_company && (
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <dt className="text-slate-500">Previous</dt>
                  <dd className="text-slate-800">{applicant.previous_company}</dd>
                </div>
              )}
              {(applicant.highest_qualification || applicant.education_level) && (
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <dt className="text-slate-500">Highest degree</dt>
                  <dd className="text-slate-800 truncate">
                    {applicant.highest_qualification || applicant.education_level}
                  </dd>
                </div>
              )}
              {prefLocs.length > 0 && (
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <dt className="text-slate-500">Pref. locations</dt>
                  <dd className="text-slate-800">
                    {prefLocs.slice(0, 5).join(", ")}
                    {prefLocs.length > 5 && ` +${prefLocs.length - 5} more`}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="w-full shrink-0 lg:w-[220px] text-center">
            {noticeText && (
              <p className="mb-3 flex items-center justify-center gap-1 text-xs text-slate-600">
                <Clock className="h-3.5 w-3.5" />
                {noticeText}
              </p>
            )}
            <div className="space-y-2">
              {!contactVisible ? (
                <Button
                  variant="outline"
                  className="w-full border-teal-600 text-teal-700 hover:bg-teal-50"
                  onClick={onRevealContact}
                >
                  View phone number
                </Button>
              ) : (
                <p className="text-sm font-medium text-slate-800">{applicant.phone || "—"}</p>
              )}
              <Button
                variant="outline"
                size="sm"
                className={cn("w-full text-xs", downloaded ? "border-[#0566CD] bg-blue-50 text-[#0566CD]" : "border-slate-300")}
                onClick={onDownloadCv}
                disabled={!onDownloadCv}
              >
                <Download className="h-3 w-3 mr-1" />
                {downloaded ? "CV downloaded" : "Download CV"}
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs border-[#0566CD] text-[#0566CD]">
                <Phone className="h-3 w-3 mr-1" />
                Call candidate
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs border-emerald-600 text-emerald-700">
                WhatsApp
              </Button>
              <div className="flex justify-center gap-2 pt-1">
                {applicant.linkedin_url && (
                  <a href={applicant.linkedin_url} target="_blank" rel="noreferrer" className="text-[#0566CD]">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                <Globe className="h-4 w-4 text-slate-400" />
              </div>
              {contactVisible && applicant.email && (
                <p className="text-[10px] text-slate-500 break-all">{applicant.email}</p>
              )}
              <p className="flex items-center justify-center gap-1 text-[10px] text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
                Verified phone &amp; email
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-2 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" /> {viewCount}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" /> {downloadCount}
          </span>
          {lastMod && <span>Modified {lastMod}</span>}
        </div>
        {applicant.is_actively_looking && (
          <Badge variant="outline" className="border-emerald-200 text-emerald-700 text-[10px]">
            Currently Active
          </Badge>
        )}
      </footer>
    </div>
  );
}
