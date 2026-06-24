import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRecruiterSaveToShortlist } from "@/hooks/useRecruiterSaveToShortlist";
import { useAuth } from "@/contexts/AuthContext";
import { fetchClientUnlockedApplicantIds, fetchResdexApplicantProfile } from "@/services/clientService";
import { canViewClientContact } from "@/lib/clientMasking";
import { incrementProfileView } from "@/services/profileViewService";
import { useApplicantSearch } from "@/hooks/useApplicantSearch";
import type { SearchMode } from "@/lib/resdexSearchParams";
import { ResdexProfileActionBar } from "@/components/dashboard/recruiter/resdex-profile/ResdexProfileActionBar";
import { ResdexProfileHeader } from "@/components/dashboard/recruiter/resdex-profile/ResdexProfileHeader";
import { ResdexProfileDetailTab, parseApplicantSkills } from "@/components/dashboard/recruiter/resdex-profile/ResdexProfileDetailTab";
import { ResdexProfileCvTab } from "@/components/dashboard/recruiter/resdex-profile/ResdexProfileCvTab";
import { ResdexSimilarProfilesPanel } from "@/components/dashboard/recruiter/resdex-profile/ResdexSimilarProfilesPanel";
import { ResdexProfileFloatingBar } from "@/components/dashboard/recruiter/resdex-profile/ResdexProfileFloatingBar";
import { useClientContext } from "@/hooks/useClientContext";
import { useClientPlanFeatures } from "@/hooks/useClientPlanFeatures";
import { downloadCandidateCv } from "@/services/cvDownloadService";
import { CVLimitModal } from "@/components/client/CVLimitModal";
import { fetchDownloadedApplicantIds } from "@/services/nviteService";
import { fetchLastInviteForApplicant } from "@/services/recruiterCandidateService";
import { RecruiterCandidateNotesPanel } from "@/components/dashboard/recruiter/RecruiterCandidateNotesPanel";
import { formatDateIST } from "@/lib/dateFormat";
import { cn } from "@/lib/utils";

export default function ResdexCandidateProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: ctx } = useClientContext();
  const { user } = useAuth();
  const { canDownloadCV, cvLimit } = useClientPlanFeatures();
  const { saveApplicant } = useRecruiterSaveToShortlist();
  const clientId = ctx?.client?.id;

  const searchQuery = searchParams.get("q") ?? "";
  const searchMode = (searchParams.get("mode") === "boolean" ? "boolean" : "normal") as SearchMode;

  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState<Record<string, unknown> | null>(null);
  const [education, setEducation] = useState<Record<string, unknown>[]>([]);
  const [experience, setExperience] = useState<Record<string, unknown>[]>([]);
  const [skills, setSkills] = useState<{ skill_name?: string }[]>([]);
  const [contactVisible, setContactVisible] = useState(false);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"detail" | "cv" | "notes">("detail");
  const [sidebarTab, setSidebarTab] = useState<"details" | "viewed">("details");
  const [cvLimitOpen, setCvLimitOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [invitedAt, setInvitedAt] = useState<string | null>(null);

  const planAllowsContact = Boolean(
    (ctx?.client?.subscription_plans as { allows_contact_view?: boolean } | undefined)?.allows_contact_view
  );

  useEffect(() => {
    if (!clientId || !id) return;
    fetchClientUnlockedApplicantIds(clientId).then((ids) => {
      setUnlockedIds(new Set(ids));
      if (ids.has(id)) setContactVisible(true);
    });
    fetchDownloadedApplicantIds(clientId, [id]).then((s) => setDownloaded(s.has(id)));
    fetchLastInviteForApplicant(clientId, id).then(setInvitedAt);
  }, [clientId, id]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const [{ data: edu }, { data: exp }, { data: sk }] = await Promise.all([
          supabase.from("applicant_education").select("*").eq("applicant_id", id).order("is_highest", { ascending: false }),
          supabase.from("applicant_experience").select("*").eq("applicant_id", id).order("start_date", { ascending: false }),
          supabase.from("applicant_skills").select("skill_name").eq("applicant_id", id),
        ]);

        let app: Record<string, unknown> | null = null;
        try {
          app = await fetchResdexApplicantProfile(id);
        } catch {
          /* fallback below */
        }
        if (!app) {
          const { data: direct, error: appError } = await supabase
            .from("applicants")
            .select("*")
            .eq("id", id)
            .maybeSingle();
          if (appError) {
            toast.error(appError.message);
            return;
          }
          app = direct;
        }

        if (!app) {
          toast.error("Candidate not found");
          return;
        }
        setApplicant(app);
        setEducation(edu || []);
        setExperience(exp || []);
        setSkills(sk || []);
        if (clientId && user?.id) void incrementProfileView(id, user.id, "client");
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id, clientId]);

  const { applicants: similar, loading: similarLoading } = useApplicantSearch({
    searchQuery: searchQuery || (applicant?.key_skills as string) || "",
    searchMode,
    page: 1,
    pageSize: 8,
    clientId,
  });

  const similarFiltered = useMemo(
    () => similar.filter((a) => a.id !== id),
    [similar, id]
  );

  const { primary: primarySkills, secondary: secondarySkills } = parseApplicantSkills(
    applicant?.key_skills as string,
    skills
  );

  const highestEdu = education[0];
  const eduLabel = highestEdu
    ? `${highestEdu.degree || highestEdu.qualification || ""} ${highestEdu.institution || ""} ${highestEdu.passing_year || ""}`.trim()
    : null;

  const handleRevealContact = () => {
    if (canViewClientContact(planAllowsContact, unlockedIds.has(id!))) {
      setContactVisible(true);
    } else {
      toast.info("Unlock contact via CV download or upgrade your plan");
    }
  };

  const handleDownloadCv = async () => {
    if (!canDownloadCV) {
      setCvLimitOpen(true);
      return;
    }
    if (!clientId || !user?.id || !id) return;
    const result = await downloadCandidateCv({
      clientId,
      applicantId: id,
      downloadedBy: user.id,
      resumeUrl: applicant?.resume_file as string | null,
      fileName: `${applicant?.name || "resume"}.pdf`,
    });
    if (!result.ok) {
      if ("limitReached" in result && result.limitReached) setCvLimitOpen(true);
      else toast.error("error" in result ? result.error : "Download failed");
      return;
    }
    setDownloaded(true);
    setContactVisible(true);
    setUnlockedIds((prev) => new Set([...prev, id]));
    toast.success("CV downloaded — contact details unlocked");
  };

  const handleSendNvite = () => {
    navigate(`/dashboard/client/nvite?ids=${id}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0566CD]" />
      </div>
    );
  }

  if (!applicant || !id) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">Profile not found</p>
        <Link to="/dashboard/client/resdex/results" className="text-[#0566CD] hover:underline text-sm">
          Back to results
        </Link>
      </div>
    );
  }

  const profileApplicant = {
    id,
    name: String(applicant.name || "Candidate"),
    email: applicant.email as string,
    phone: applicant.phone as string,
    city: applicant.city as string,
    profile_image: applicant.profile_image as string | null,
    resume_headline: applicant.resume_headline as string | null,
    current_designation: applicant.current_designation as string | null,
    current_company: applicant.current_company as string | null,
    previous_company: applicant.previous_company as string | null,
    job_role: applicant.job_role as string | null,
    current_ctc: applicant.current_ctc as number | string | null,
    total_experience_years: applicant.total_experience_years as number | null,
    highest_qualification: (eduLabel || applicant.highest_qualification) as string | null,
    preferred_locations: applicant.preferred_locations as string | string[] | null,
    key_skills: applicant.key_skills as string | null,
    notice_period: applicant.notice_period as string | null,
    notice_period_days: applicant.notice_period_days as number | null,
    is_actively_looking: applicant.is_actively_looking as boolean | null,
    last_profile_updated_at: applicant.last_profile_updated_at as string | null,
    updated_at: applicant.updated_at as string | null,
    industry: applicant.industry as string | null,
    department: applicant.department as string | null,
    linkedin_url: applicant.linkedin_url as string | null,
    profile_summary: applicant.profile_summary as string | null,
  };

  return (
    <div className="bg-[#f4f5f7] min-h-full">
      <ResdexProfileActionBar onSendNvite={handleSendNvite} />

      <div className="mx-auto max-w-[1180px] px-4 py-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-3 flex items-center gap-1 text-sm text-[#0566CD] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to search results
        </button>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4 min-w-0">
            <ResdexProfileHeader
              applicant={profileApplicant}
              searchQuery={searchQuery}
              searchMode={searchMode}
              contactVisible={contactVisible || canViewClientContact(planAllowsContact, unlockedIds.has(id))}
              onRevealContact={handleRevealContact}
              onSave={() => void saveApplicant(id)}
              onDownloadCv={() => void handleDownloadCv()}
              downloaded={downloaded}
            />
            {invitedAt && activeTab !== "notes" && (
              <p className="text-xs text-emerald-700 px-1">Invited on {formatDateIST(invitedAt)}</p>
            )}

            <div className="rounded border border-slate-200 bg-white shadow-sm">
              <div className="flex border-b border-slate-200 text-sm overflow-x-auto">
                <button
                  type="button"
                  className={cn(
                    "px-5 py-3 font-medium whitespace-nowrap",
                    activeTab === "detail"
                      ? "text-slate-900 border-b-2 border-[#e84444]"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                  onClick={() => setActiveTab("detail")}
                >
                  Profile detail
                </button>
                <button
                  type="button"
                  className={cn(
                    "px-5 py-3 font-medium whitespace-nowrap",
                    activeTab === "cv"
                      ? "text-slate-900 border-b-2 border-[#e84444]"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                  onClick={() => setActiveTab("cv")}
                >
                  Attached CV
                </button>
                <button
                  type="button"
                  className={cn(
                    "px-5 py-3 font-medium whitespace-nowrap",
                    activeTab === "notes"
                      ? "text-slate-900 border-b-2 border-[#e84444]"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                  onClick={() => setActiveTab("notes")}
                >
                  Notes &amp; Tags
                </button>
              </div>
              <div className="p-5">
                {activeTab === "detail" ? (
                  <ResdexProfileDetailTab
                    headline={profileApplicant.resume_headline}
                    summary={profileApplicant.profile_summary}
                    skills={primarySkills}
                    secondarySkills={secondarySkills}
                    industry={profileApplicant.industry}
                    department={profileApplicant.department}
                    role={profileApplicant.job_role}
                    experience={experience as Parameters<typeof ResdexProfileDetailTab>[0]["experience"]}
                    searchQuery={searchQuery}
                    searchMode={searchMode}
                  />
                ) : activeTab === "cv" ? (
                  <ResdexProfileCvTab
                    name={profileApplicant.name}
                    city={profileApplicant.city}
                    phone={contactVisible ? profileApplicant.phone : undefined}
                    email={contactVisible ? profileApplicant.email : undefined}
                    resumeUrl={(applicant.resume_file as string) || null}
                    skills={primarySkills}
                    experience={experience as Parameters<typeof ResdexProfileCvTab>[0]["experience"]}
                    searchQuery={searchQuery}
                    searchMode={searchMode}
                  />
                ) : clientId && user?.id ? (
                  <RecruiterCandidateNotesPanel
                    recruiterId={clientId}
                    applicantId={id}
                    userId={user.id}
                    invitedAt={invitedAt}
                    variant="tabs"
                  />
                ) : null}
              </div>
            </div>
          </div>

          <ResdexSimilarProfilesPanel
            currentId={id}
            similar={similarFiltered}
            loading={similarLoading}
            searchQuery={searchQuery}
            searchMode={searchMode}
            activeTab={sidebarTab}
            onTabChange={setSidebarTab}
          />
        </div>
      </div>

      <ResdexProfileFloatingBar />
      <CVLimitModal open={cvLimitOpen} onOpenChange={setCvLimitOpen} limit={cvLimit} />
    </div>
  );
}
