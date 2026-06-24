import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Bookmark, CheckCircle2, Clock, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePortalBanners } from "@/hooks/usePortalContent";
import { PortalBannerStrip } from "@/components/portal/PortalBannerStrip";
import { PortalStatLinkGrid, PortalStatLinkCard } from "@/components/portal/portal-ui";
import { supabase } from "@/lib/supabase";
import { formatDateIST } from "@/lib/dateFormat";
import { getApplicantLastUpdated } from "@/lib/applicantProfileTimestamps";
import { cn } from "@/lib/utils";
import {
  applicantProfileAccent,
  applicantProfileCard,
  applicantProfileMuted,
  applicantQuickActionIcon,
  applicantQuickActionTile,
} from "./applicantProfileStyles";

type ApplicantHomeStripProps = {
  applicantData: Record<string, unknown>;
  profileData?: Record<string, unknown> | null;
  profileCompletion: number;
  onScrollToSection?: (sectionId: string) => void;
  editProfilePath?: string;
  variant?: "full" | "minimal";
};

const QUICK_ACTIONS = [
  { to: "/dashboard/applicant/jobs", label: "Jobs", icon: Briefcase },
  { to: "/dashboard/applicant/applications", label: "Apps", icon: FileText },
  { to: "/dashboard/applicant/saved-jobs", label: "Saved", icon: Bookmark },
  { to: "/dashboard/applicant/messages", label: "Inbox", icon: MessageSquare },
] as const;

/** Figma-aligned dashboard strip above the unified applicant profile. */
export function ApplicantHomeStrip({
  applicantData,
  profileData,
  profileCompletion,
  onScrollToSection,
  editProfilePath = "/dashboard/applicant/profile/edit",
  variant = "full",
}: ApplicantHomeStripProps) {
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
  });

  const { banners: applicantBanners } = usePortalBanners("applicant");

  const fullName =
    (profileData?.full_name as string) ||
    (applicantData.name as string) ||
    (applicantData.full_name as string) ||
    "there";
  const firstName = fullName === "there" ? fullName : fullName.split(" ")[0];
  const designation =
    (applicantData.current_designation as string) ||
    (applicantData.job_role as string) ||
    "";
  const location =
    (profileData?.location as string) ||
    (applicantData.city as string) ||
    (applicantData.city_current_location as string) ||
    "";
  const profileLastUpdated = getApplicantLastUpdated(applicantData);
  const subtitle = [designation, location, profileLastUpdated ? `Updated ${formatDateIST(profileLastUpdated)}` : null]
    .filter(Boolean)
    .join(" · ");
  const resumeFile =
    (profileData?.resume_file as string) ||
    (applicantData.resume_file as string) ||
    (applicantData.upload_cv_any_format as string) ||
    null;

  useEffect(() => {
    const applicantId = applicantData.id as string | undefined;
    if (!applicantId) return;
    void (async () => {
      const { data } = await supabase
        .from("job_applications")
        .select("current_stage")
        .eq("applicant_id", applicantId);
      if (!data) return;
      setApplicationStats({
        total: data.length,
        pending: data.filter((a) => a.current_stage === "applied" || a.current_stage === "screening").length,
        shortlisted: data.filter((a) => a.current_stage === "shortlisted").length,
      });
    })();
  }, [applicantData.id]);

  const scrollTo = (sectionId: string) => {
    if (onScrollToSection) {
      onScrollToSection(sectionId);
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      {variant === "full" && (
      <>
      {/* Welcome — Figma node 4:3 */}
      <div className={cn(applicantProfileCard, "space-y-1 p-4")}>
        <p className="text-xl font-bold tracking-tight text-[#333]">Hi, {firstName}!</p>
        <p className={cn("text-xs", applicantProfileMuted)}>
          {subtitle || "Your TalentHub profile"}
        </p>
      </div>

      {applicantBanners.length > 0 && (
        <PortalBannerStrip banners={applicantBanners} className="border-[#e8e8e8]" />
      )}

      {/* Today — Figma node 4:6 */}
      <div className={cn(applicantProfileCard, "p-4")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <p className={cn("text-[13px]", applicantProfileMuted)}>
              {applicationStats.pending > 0
                ? `${applicationStats.pending} application${applicationStats.pending === 1 ? "" : "s"} awaiting update`
                : "No pending applications — browse jobs to apply"}
            </p>
            <div className="flex items-center gap-3">
              <div className="min-w-[140px] flex-1 space-y-1">
                <p className={cn("text-xs font-semibold", applicantProfileAccent)}>
                  Profile strength {profileCompletion}%
                </p>
                <Progress value={profileCompletion} className="h-2 bg-[#eef4fb] [&>div]:bg-[#0566CD]" />
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn("h-8 shrink-0 px-2 text-xs font-semibold", applicantProfileAccent)}
            onClick={() => {
              if (onScrollToSection) onScrollToSection("resume");
              else window.location.href = editProfilePath;
            }}
          >
            Improve profile →
          </Button>
        </div>
      </div>
      </>
      )}

      {variant === "minimal" && (
        <div className={cn(applicantProfileCard, "flex flex-wrap items-center justify-between gap-3 p-4")}>
          <p className={cn("text-sm", applicantProfileMuted)}>
            This is how recruiters see your profile.
          </p>
          <Button asChild size="sm" className="h-8 bg-[#0566CD] text-xs hover:bg-[#0066c0]">
            <Link to={editProfilePath}>Update profile</Link>
          </Button>
        </div>
      )}

      {/* Quick actions — Figma node 4:12 */}
      <div className="grid grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className={applicantQuickActionTile}>
            <span className={applicantQuickActionIcon}>
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-semibold text-[#333]">{label}</span>
          </Link>
        ))}
      </div>

      <PortalStatLinkGrid>
        <PortalStatLinkCard
          label="Applications"
          value={applicationStats.total}
          icon={<FileText className="h-4 w-4" />}
          to="/dashboard/applicant/applications"
          className={applicantProfileCard}
        />
        <PortalStatLinkCard
          label="Pending"
          value={applicationStats.pending}
          icon={<Clock className="h-4 w-4" />}
          to="/dashboard/applicant/applications"
          className={applicantProfileCard}
        />
        <PortalStatLinkCard
          label="Shortlisted"
          value={applicationStats.shortlisted}
          icon={<CheckCircle2 className="h-4 w-4" />}
          to="/dashboard/applicant/applications"
          className={applicantProfileCard}
        />
      </PortalStatLinkGrid>

      {profileCompletion < 85 && (
        <div className={cn(applicantProfileCard, "border-amber-200 bg-amber-50/80 p-4")}>
          <p className="text-sm font-medium text-[#333]">Complete your profile</p>
          <p className={cn("mt-0.5 text-xs", applicantProfileMuted)}>
            Profiles above 85% get more recruiter views.
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-3 h-9 w-full border-[#e8e8e8] bg-white"
            onClick={() => scrollTo("resume")}
          >
            Update profile
          </Button>
        </div>
      )}

      {!resumeFile && (
        <div className={cn(applicantProfileCard, "border-sky-200 bg-sky-50/80 p-4")}>
          <p className="text-sm font-medium text-[#333]">Upload your resume</p>
          <p className={cn("mt-0.5 text-xs", applicantProfileMuted)}>
            Required to apply to most jobs on TalentHub.
          </p>
          <Button
            type="button"
            size="sm"
            className="mt-3 h-9 w-full bg-[#0566CD] hover:bg-[#0066c0]"
            onClick={() => scrollTo("resume")}
          >
            Upload resume
          </Button>
        </div>
      )}
    </div>
  );
}
