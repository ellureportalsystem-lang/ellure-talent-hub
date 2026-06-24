import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lock, MapPin, Download, Eye, MessageSquare, Bookmark } from "lucide-react";
import type { Applicant } from "@/hooks/useApplicants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { canViewClientContact, displayCandidateName } from "@/lib/clientMasking";

interface CandidateCardProps {
  applicant: Applicant;
  canSeeContact: boolean;
  isUnlocked?: boolean;
  onDownloadCv: (applicantId: string) => void;
  onSave?: (applicantId: string) => void;
}

export function CandidateCard({ applicant, canSeeContact, isUnlocked = false, onDownloadCv, onSave }: CandidateCardProps) {
  const skills = (applicant.key_skills
    ? (typeof applicant.key_skills === "string"
      ? applicant.key_skills.split(",").map((s) => s.trim())
      : applicant.key_skills)
    : []
  ).filter(Boolean);
  const displaySkills = skills.slice(0, 5);
  const extra = skills.length - 5;
  const contactVisible = canViewClientContact(canSeeContact, isUnlocked);
  const displayName = displayCandidateName(applicant.name || "Candidate", canSeeContact, isUnlocked);
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const completion = applicant.profile_complete_percent ?? applicant.profileCompletion ?? 0;

  return (
    <div className="dashboard-card p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={applicant.profile_image || applicant.profilePhoto || undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{displayName}</h3>
            {applicant.is_actively_looking && (
              <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" title="Actively looking" />
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {applicant.current_designation || applicant.designation || "—"}
            {applicant.current_company ? ` · ${applicant.current_company}` : ""}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3" />
            {applicant.city || applicant.currentCity || "—"}
          </p>
        </div>
        <div className="text-center shrink-0">
          <div className="relative h-8 w-8 mx-auto">
            <Progress value={completion} className="h-2 w-16" />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-stat font-bold">{completion}%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs">
        {applicant.total_experience_years != null && (
          <Badge variant="secondary">{applicant.total_experience_years}y exp</Badge>
        )}
        {applicant.notice_period && <Badge variant="outline">{applicant.notice_period}</Badge>}
        {(applicant.current_ctc || applicant.expected_ctc) && (
          <Badge variant="outline">
            {applicant.current_ctc ? `₹${applicant.current_ctc}` : "?"} → {applicant.expected_ctc ? `₹${applicant.expected_ctc}` : "?"}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {displaySkills.map((s) => (
          <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
        ))}
        {extra > 0 && <span className="text-xs text-muted-foreground">+{extra} more</span>}
      </div>

      <div className="text-xs border-t pt-2 space-y-1">
        {contactVisible ? (
          <>
            <p>{applicant.phone || applicant.mobile_number || "—"}</p>
            <p className="truncate">{applicant.email || applicant.email_address}</p>
          </>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-muted-foreground blur-[3px] select-none">
                <Lock className="h-3 w-3" />
                <span>••••••••••</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Download CV to unlock contact details</TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-auto pt-1">
        <Button size="sm" variant="outline" asChild>
          <Link to={`/dashboard/client/candidates/${applicant.id}`}><Eye className="h-3.5 w-3.5 mr-1" />View</Link>
        </Button>
        {onSave && (
          <Button size="sm" variant="ghost" onClick={() => onSave(applicant.id)}><Bookmark className="h-3.5 w-3.5" /></Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => onDownloadCv(applicant.id)}><Download className="h-3.5 w-3.5 mr-1" />CV</Button>
        <Button size="sm" variant="ghost"><MessageSquare className="h-3.5 w-3.5" /></Button>
      </div>
    </div>
  );
}
