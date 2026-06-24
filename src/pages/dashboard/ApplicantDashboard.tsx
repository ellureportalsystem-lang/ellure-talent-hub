import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  User,
  FileText,
  Award,
  Clock,
  Download,
  LogOut,
  Edit,
  CheckCircle2,
  HelpCircle,
  Bookmark,
  MessageSquare,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { openResumePreview } from "@/lib/resumePreview";
import { toast } from "sonner";
import { CandidateFAQs } from "@/components/CandidateFAQs";
import { usePortalBanners } from "@/hooks/usePortalContent";
import { PortalBannerStrip } from "@/components/portal/PortalBannerStrip";
import {
  PortalQuickActionGrid,
  PortalStatLinkCard,
  PortalStatLinkGrid,
  PortalTodayPanel,
  PortalWelcomeHero,
  portalAlerts,
} from "@/components/portal/portal-ui";
import { portalPageCanvas, portalPageWidth, portalPanelClass } from "@/components/portal/portalStyles";
import { EllureBrandLogo } from "@/components/auth/EllureBrandLogo";
import { cn } from "@/lib/utils";
import {
  fetchApplicantProfileChecklist,
  fetchApplicantRecentActivity,
  type ProfileChecklistItem,
  type ApplicantActivityItem,
} from "@/services/applicantDashboardService";
import { getApplicantLastUpdated } from "@/lib/applicantProfileTimestamps";
import { formatDateIST } from "@/lib/dateFormat";

const ApplicantDashboard = ({ embedded = false }: { embedded?: boolean }) => {
  const { profile, user, signOut } = useAuth();
  const [applicantData, setApplicantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<ProfileChecklistItem[]>([]);
  const [activity, setActivity] = useState<ApplicantActivityItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicantData = async () => {
      // Don't wait for profile - if user is logged in, proceed
      if (!user?.id) {
        setLoading(false);
        return;
      }

      // Set a timeout to stop loading even if fetch fails
      const loadingTimeout = setTimeout(() => {
        console.warn('⏱️ Loading timeout - proceeding without applicant data');
        setLoading(false);
      }, 5000); // 5 second max loading time

      const fetchWithRetry = async (retries = 2) => {
        for (let attempt = 0; attempt <= retries; attempt++) {
          try {
            // Try to fetch applicant data by applicant_id first, then by user_id
            let query = supabase.from('applicants').select('*');
            
            if (profile?.applicant_id) {
              query = query.eq('id', profile.applicant_id);
            } else if (user?.id) {
              query = query.eq('user_id', user.id);
            }

            const { data, error } = await query.single();

            if (error) {
              // If not found, that's okay
              if (error.code === 'PGRST116') {
                console.log('Applicant data not found - this is okay');
                setLoading(false);
                return;
              }
              
              // Network errors - retry
              const isNetworkError = error.message?.includes('Failed to fetch') || 
                                     error.message?.includes('ERR_NAME_NOT_RESOLVED') ||
                                     error.message?.includes('TypeError');
              
              if (isNetworkError && attempt < retries) {
                console.warn(`Network error fetching applicant data (attempt ${attempt + 1}/${retries + 1}), retrying...`);
                await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
                continue;
              }
              
              console.error('Error fetching applicant data:', error);
              setLoading(false);
              return;
            }

            if (data) {
              setApplicantData(data);
            }
            clearTimeout(loadingTimeout);
            setLoading(false);
            return;
          } catch (error: any) {
            const isNetworkError = error.message?.includes('Failed to fetch') || 
                                   error.message?.includes('ERR_NAME_NOT_RESOLVED') ||
                                   error.name === 'TypeError';
            
            if (isNetworkError && attempt < retries) {
              console.warn(`Network error (attempt ${attempt + 1}/${retries + 1}), retrying...`);
              await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
              continue;
            }
            
            console.error('Error fetching applicant data:', error);
            if (attempt === retries) {
              clearTimeout(loadingTimeout);
              setLoading(false);
            }
          }
        }
        clearTimeout(loadingTimeout);
        setLoading(false);
      };

      fetchWithRetry();
      
      return () => {
        clearTimeout(loadingTimeout);
      };
    };

    fetchApplicantData();
  }, [profile, user]);

  useEffect(() => {
    const id = applicantData?.id as string | undefined;
    if (!id) return;
    void fetchApplicantProfileChecklist(id).then(setChecklist);
    void fetchApplicantRecentActivity(id, 5).then(setActivity);
  }, [applicantData?.id]);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/applicant");
  };

  // Helper functions to get data
  const getFullName = () => {
    return profile?.full_name || applicantData?.full_name || applicantData?.name || "Not provided";
  };

  const getInitials = () => {
    const name = getFullName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || "U";
  };

  const getEmail = () => {
    return profile?.email || applicantData?.email_address || applicantData?.email || "Not provided";
  };

  const getPhone = () => {
    return profile?.phone || applicantData?.mobile_number || applicantData?.phone || "Not provided";
  };

  const getLocation = () => {
    return profile?.location || applicantData?.city_current_location || applicantData?.city || "Not specified";
  };

  const getExperience = () => {
    const exp = applicantData?.total_experience || applicantData?.total_experience_numbers;
    if (exp) {
      return `${exp} ${exp.includes('year') ? '' : 'years'}`;
    }
    return "Not specified";
  };

  const getCurrentDesignation = () => {
    return applicantData?.current_designation || applicantData?.job_role || "Not specified";
  };

  const getSkills = () => {
    const skills = profile?.key_skills || applicantData?.key_skill || applicantData?.key_skills;
    if (skills) {
      // Split by comma, semicolon, or newline
      return skills.split(/[,;\n]/).map(s => s.trim()).filter(s => s.length > 0).slice(0, 5);
    }
    return [];
  };

  const getCurrentCTC = () => {
    return applicantData?.current_ctc || "Not specified";
  };

  const getExpectedCTC = () => {
    return applicantData?.exp_ctc || applicantData?.expected_ctc || "Not specified";
  };

  const getEducation = () => {
    const degree = applicantData?.course_degree_name || applicantData?.course_degree || "Not specified";
    const university = applicantData?.university_institute_name || applicantData?.university || "";
    const year = applicantData?.year_of_passing || applicantData?.passing_year || "";
    const percentage = applicantData?.percentage || "";
    
    return { degree, university, year, percentage };
  };

  const getResumeFile = () => {
    return profile?.resume_file || applicantData?.upload_cv_any_format || applicantData?.resume_file;
  };

  const profileCompletion = profile?.profile_complete_percent || applicantData?.profile_complete_percent || 0;
  const profileLastUpdated = getApplicantLastUpdated(applicantData);
  const profileSubtitle = [
    getCurrentDesignation(),
    getLocation(),
    profileLastUpdated ? `Updated ${formatDateIST(profileLastUpdated)}` : null,
  ]
    .filter((part) => part && part !== "Not specified")
    .join(" · ");
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    interviews: 0,
  });

  const applyGoal = 3;
  const applyRemaining = Math.max(0, applyGoal - applicationStats.total);
  const applyLabel =
    applyRemaining > 0
      ? `Apply to ${applyRemaining} more job${applyRemaining === 1 ? "" : "s"}`
      : "Browse more jobs";
  const { banners: applicantBanners } = usePortalBanners("applicant");

  useEffect(() => {
    const loadStats = async () => {
      const applicantId = profile?.applicant_id ?? applicantData?.id;
      if (!applicantId) return;
      const { data } = await supabase
        .from("job_applications")
        .select("current_stage")
        .eq("applicant_id", applicantId);
      if (!data) return;
      setApplicationStats({
        total: data.length,
        pending: data.filter((a) => a.current_stage === "applied" || a.current_stage === "screening").length,
        shortlisted: data.filter((a) => a.current_stage === "shortlisted").length,
        interviews: data.filter((a) =>
          ["interview_scheduled", "interviewed", "offer"].includes(a.current_stage ?? "")
        ).length,
      });
    };
    void loadStats();
  }, [profile?.applicant_id, applicantData?.id]);

  // Show loading only if we have a user but no profile/applicant data yet
  // Don't block if user is logged in - show dashboard with available data
  if (loading && user && !profile && !applicantData) {
    return (
      <div
        className={
          embedded
            ? "flex min-h-[40vh] items-center justify-center py-12"
            : "min-h-screen bg-gradient-subtle flex items-center justify-center"
        }
      >
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading profile...</p>
          {!embedded && (
            <p className="text-xs text-muted-foreground">This may take a few seconds</p>
          )}
        </div>
      </div>
    );
  }
  
  // If no user, redirect to login
  if (!user) {
    navigate("/auth/applicant");
    return null;
  }

  const cardClass = embedded ? portalPanelClass : "shadow-lg";

  return (
    <div
      className={
        embedded
          ? cn(portalPageCanvas, portalPageWidth.standard, "min-w-0 text-foreground")
          : "min-h-screen bg-gradient-subtle"
      }
    >
      {!embedded && (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <EllureBrandLogo to="/dashboard/applicant" size="md" portalLabel="Candidate" />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      )}

      <div className={embedded ? "space-y-6" : "container py-8"}>
        {embedded && (
          <div className="space-y-4 md:space-y-6 animate-fade-in-up">
            <PortalWelcomeHero
              name={getFullName() === "Not provided" ? "there" : getFullName().split(" ")[0]}
              subtitle={profileSubtitle || `${getCurrentDesignation()} · ${getLocation()}`}
              initials={getInitials()}
              avatarUrl={profile?.profile_image}
            />

            {applicantBanners.length > 0 && (
              <PortalBannerStrip banners={applicantBanners} className="border-muted" />
            )}

            <PortalTodayPanel
              title="Today"
              action={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-primary"
                  onClick={() => navigate("/dashboard/applicant/applications")}
                >
                  View all
                </Button>
              }
            >
              <p className="text-sm text-muted-foreground">
                {applicationStats.pending > 0
                  ? `${applicationStats.pending} application${applicationStats.pending === 1 ? "" : "s"} awaiting update`
                  : "No pending applications — browse jobs to apply"}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Profile strength</span>
                    <span className="font-semibold text-primary">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="h-9 shrink-0"
                  onClick={() => navigate("/dashboard/applicant#resume")}
                >
                  Improve
                </Button>
              </div>
            </PortalTodayPanel>

            <PortalQuickActionGrid
              columns={4}
              actions={[
                { to: "/dashboard/applicant/jobs", label: "Jobs", icon: <Briefcase className="h-5 w-5" />, tint: "primary" },
                { to: "/dashboard/applicant/applications", label: "Apps", icon: <FileText className="h-5 w-5" />, tint: "sky" },
                { to: "/dashboard/applicant/saved-jobs", label: "Saved", icon: <Bookmark className="h-5 w-5" />, tint: "violet" },
                { to: "/dashboard/applicant/messages", label: "Inbox", icon: <MessageSquare className="h-5 w-5" />, tint: "amber" },
              ]}
            />

            <PortalStatLinkGrid>
              <PortalStatLinkCard
                label="Applications"
                value={applicationStats.total}
                icon={<FileText className="h-4 w-4" />}
                to="/dashboard/applicant/applications"
              />
              <PortalStatLinkCard
                label="Pending"
                value={applicationStats.pending}
                icon={<Clock className="h-4 w-4" />}
                to="/dashboard/applicant/applications"
              />
              <PortalStatLinkCard
                label="Shortlisted"
                value={applicationStats.shortlisted}
                icon={<CheckCircle2 className="h-4 w-4" />}
                to="/dashboard/applicant/applications"
              />
            </PortalStatLinkGrid>

            {profileCompletion < 85 && (
              <div className={portalAlerts.warning}>
                <p className="text-sm font-medium">Complete your profile</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Profiles above 85% get more recruiter views.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mt-3 h-9 w-full"
                  onClick={() => navigate("/dashboard/applicant#resume")}
                >
                  Update profile
                </Button>
              </div>
            )}

            {!getResumeFile() && (
              <div className={portalAlerts.info}>
                <p className="text-sm font-medium">Upload your resume</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Required to apply to most jobs on TalentHub.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Profile Header Card — compact on mobile when embedded in portal */}
        <Card className={embedded ? `mb-6 ${cardClass} hidden sm:block` : "mb-8 shadow-lg"}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {profile?.profile_image ? (
                <img 
                  src={profile.profile_image} 
                  alt={getFullName()}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div
                  className={
                    embedded
                      ? "h-24 w-24 rounded-full bg-primary/15 text-primary flex items-center justify-center text-3xl font-bold border border-primary/20"
                      : "h-24 w-24 rounded-full bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold"
                  }
                >
                  {getInitials()}
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-tight sm:text-2xl">{getFullName()}</h2>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      applicantData?.is_actively_looking
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {applicantData?.is_actively_looking ? "Actively looking" : applicantData?.status ?? "Profile"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getCurrentDesignation()} | {getLocation()} | {getExperience()} experience
                </p>
                {getSkills().length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getSkills().map((skill, index) => (
                      <span key={index} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid w-full gap-2 sm:w-auto sm:min-w-[220px]">
                <Button size="sm" className="h-10" variant="default" onClick={() => navigate("/dashboard/applicant#resume")}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit settings
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-10"
                  onClick={async () => {
                    const u = getResumeFile();
                    if (!u) return;
                    try {
                      await openResumePreview(u);
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Could not open resume");
                    }
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Completion — desktop / standalone; mobile uses hero strip above */}
        <Card className={embedded ? `mb-6 ${cardClass} hidden sm:block` : "mb-8"}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Profile Completion
            </CardTitle>
            <CardDescription>
              Complete your profile to increase visibility to recruiters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
            </div>
            <div className="grid gap-2">
              {checklist.length === 0 ? (
                <p className="text-sm text-muted-foreground">Complete your profile to get started.</p>
              ) : (
                checklist.map((item) => (
                  <Link
                    key={item.key}
                    to={item.href}
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    {item.done ? (
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={item.done ? "" : "text-muted-foreground"}>{item.label}</span>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats — standalone only; embedded uses PortalStatLinkGrid above */}
        <div
          className={
            embedded
              ? "hidden"
              : "grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-8"
          }
        >
          <Card className={embedded ? cardClass : undefined}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold leading-none">{applicationStats.total}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={embedded ? cardClass : undefined}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xl font-bold leading-none">{applicationStats.pending}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={embedded ? cardClass : undefined}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xl font-bold leading-none">{applicationStats.shortlisted}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Shortlisted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={embedded ? cardClass : undefined}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-xl font-bold leading-none">{applicationStats.interviews}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Interviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          {/* Main column */}
          <div className="space-y-6">
            {/* Resume (primary action card) */}
            <Card className={embedded ? cardClass : undefined}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5" />
                  Resume
                </CardTitle>
                <CardDescription className="text-sm">Keep your resume updated to improve matches</CardDescription>
              </CardHeader>
              <CardContent>
                {getResumeFile() ? (
                  <div className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {getResumeFile().split("/").pop() || "Resume"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {applicantData?.created_at
                          ? `Uploaded ${new Date(applicantData.created_at).toLocaleDateString()}`
                          : "Resume available"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-10 px-3"
                      onClick={async () => {
                        const u = getResumeFile();
                        if (!u) return;
                        try {
                          await openResumePreview(u);
                        } catch (e) {
                          toast.error(e instanceof Error ? e.message : "Could not open resume");
                        }
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-xl border bg-muted/20 p-6 text-center">
                    <p className="text-sm font-medium">No resume uploaded</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Add a resume in Settings to start applying faster.
                    </p>
                    <Button
                      type="button"
                      className="mt-4 h-10"
                      onClick={() => navigate("/dashboard/applicant#resume")}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Go to settings
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile snapshot (condensed, not a giant form) */}
            <Card className={embedded ? cardClass : undefined}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-5 w-5" />
                  Profile snapshot
                </CardTitle>
                <CardDescription className="text-sm">What recruiters see at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border bg-card p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Location</p>
                    <p className="mt-1 text-sm font-medium">{getLocation()}</p>
                  </div>
                  <div className="rounded-xl border bg-card p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Experience</p>
                    <p className="mt-1 text-sm font-medium">{getExperience()}</p>
                  </div>
                  <div className="rounded-xl border bg-card p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Current role</p>
                    <p className="mt-1 text-sm font-medium">{getCurrentDesignation()}</p>
                  </div>
                  <div className="rounded-xl border bg-card p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Education</p>
                    {(() => {
                      const education = getEducation();
                      return (
                        <p className="mt-1 text-sm font-medium">
                          {education.degree !== "Not specified" ? education.degree : "Not specified"}
                        </p>
                      );
                    })()}
                  </div>
                </div>

                {getSkills().length ? (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Top skills</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {getSkills().map((skill, index) => (
                        <span key={index} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button type="button" className="h-10" onClick={() => navigate("/dashboard/applicant#resume")}>
                    <Edit className="mr-2 h-4 w-4" />
                    Update profile
                  </Button>
                  <Button type="button" variant="outline" className="h-10" onClick={() => navigate("/dashboard/applicant/jobs")}>
                    Browse jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right rail */}
          <div className="space-y-6">
            <Card className={embedded ? cardClass : undefined}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Activity</CardTitle>
                <CardDescription className="text-sm">Recent updates from your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activity.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent activity yet.</p>
                  ) : (
                    activity.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <div
                          className={`mt-2 h-2 w-2 rounded-full ${
                            item.type === "success"
                              ? "bg-success"
                              : item.type === "info"
                                ? "bg-info"
                                : "bg-muted-foreground"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-snug">{item.action}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className={embedded ? cardClass : undefined}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Next steps</CardTitle>
                <CardDescription className="text-sm">Improve your chances this week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full justify-start"
                  onClick={() => navigate("/dashboard/applicant#resume")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Complete profile
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full justify-start"
                  onClick={() => navigate("/dashboard/applicant/jobs")}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  {applyLabel}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full justify-start"
                  onClick={() => navigate("/dashboard/applicant/applications")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Track applications
                </Button>
              </CardContent>
            </Card>

            <Card className={embedded ? cardClass : undefined}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <HelpCircle className="h-5 w-5" />
                  Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CandidateFAQs />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;