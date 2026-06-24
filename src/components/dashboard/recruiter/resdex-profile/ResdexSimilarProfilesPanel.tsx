import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, IndianRupee, MapPin, Paperclip } from "lucide-react";
import { HighlightText } from "./HighlightText";
import { formatExpNaukri, formatLacs, splitSkills } from "@/lib/naukriFormat";
import type { Applicant } from "@/hooks/useApplicants";
import type { SearchMode } from "@/lib/resdexSearchParams";
import { cn } from "@/lib/utils";

type ResdexSimilarProfilesPanelProps = {
  currentId: string;
  similar: Applicant[];
  loading: boolean;
  searchQuery: string;
  searchMode: SearchMode;
  activeTab: "details" | "viewed";
  onTabChange: (tab: "details" | "viewed") => void;
};

function MiniCard({
  applicant,
  currentId,
  searchQuery,
  searchMode,
}: {
  applicant: Applicant;
  currentId: string;
  searchQuery: string;
  searchMode: SearchMode;
}) {
  const isActive = applicant.id === currentId;
  const skills = splitSkills(applicant.key_skills).slice(0, 6);
  const initials = (applicant.name || "C").split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <Link
      to={`/dashboard/client/candidates/${applicant.id}?q=${encodeURIComponent(searchQuery)}`}
      className={cn(
        "block rounded border p-3 transition-colors hover:border-[#0566CD]/40",
        isActive ? "border-violet-300 bg-violet-50/50" : "border-slate-200 bg-white"
      )}
    >
      <div className="flex gap-2">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={(applicant as { profile_image?: string }).profile_image} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 truncate">{applicant.name}</p>
          <p className="text-[10px] text-slate-500 line-clamp-2">
            {applicant.current_designation} at {applicant.current_company}
          </p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-slate-600">
        <span className="flex items-center gap-0.5">
          <Briefcase className="h-3 w-3" />
          {formatExpNaukri(applicant.total_experience_years)}
        </span>
        <span className="flex items-center gap-0.5">
          <IndianRupee className="h-3 w-3" />
          {formatLacs(applicant.current_ctc)}
        </span>
        <span className="flex items-center gap-0.5">
          <MapPin className="h-3 w-3" />
          {applicant.city}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {skills.map((s) => (
          <Badge key={s} variant="secondary" className="text-[9px] px-1 py-0 font-normal">
            <HighlightText text={s} query={searchQuery} mode={searchMode} />
          </Badge>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
        <span className="flex items-center gap-0.5">
          <Paperclip className="h-3 w-3" /> CV
        </span>
        <span className="text-emerald-600">
          {applicant.is_actively_looking ? "Active today" : "Active in last 15 days"}
        </span>
      </div>
    </Link>
  );
}

export function ResdexSimilarProfilesPanel({
  currentId,
  similar,
  loading,
  searchQuery,
  searchMode,
  activeTab,
  onTabChange,
}: ResdexSimilarProfilesPanelProps) {
  return (
    <div className="space-y-4">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">No comments</span>
            <button type="button" className="text-sm font-medium text-[#0566CD] hover:underline">
              Add comments
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
            <Users className="h-4 w-4 text-[#0566CD]" />
            <span className="text-sm font-semibold text-slate-900">Similar profiles</span>
          </div>
          <div className="flex border-b border-slate-100 text-xs">
            <button
              type="button"
              className={cn(
                "flex-1 py-2.5 font-medium",
                activeTab === "details"
                  ? "text-slate-900 border-b-2 border-[#e84444]"
                  : "text-slate-500"
              )}
              onClick={() => onTabChange("details")}
            >
              Profile details ({similar.length})
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 py-2.5 font-medium",
                activeTab === "viewed"
                  ? "text-slate-900 border-b-2 border-[#e84444]"
                  : "text-slate-500"
              )}
              onClick={() => onTabChange("viewed")}
            >
              Recruiters also viewed (220)
            </button>
          </div>
          <div className="max-h-[calc(100vh-20rem)] overflow-y-auto p-3 space-y-3">
            {loading ? (
              <p className="text-xs text-slate-500 text-center py-4">Loading similar profiles…</p>
            ) : similar.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No similar profiles found</p>
            ) : (
              similar.map((a) => (
                <MiniCard
                  key={a.id}
                  applicant={a}
                  currentId={currentId}
                  searchQuery={searchQuery}
                  searchMode={searchMode}
                />
              ))
            )}
          </div>
          <div className="border-t border-slate-100 p-3">
            <button type="button" className="w-full text-sm text-[#0566CD] hover:underline">
              View all similar profiles →
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
