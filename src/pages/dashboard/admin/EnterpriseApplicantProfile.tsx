import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { incrementProfileView } from "@/services/profileViewService";
import { updateProfileSummary } from "@/services/applicantService";
import {
  syncApplicantSkillsFromChipList,
  deleteApplicantExperienceRow,
  deleteApplicantEducationRow,
  deleteApplicantSkillRow,
  resyncApplicantKeySkillsFromTable,
  saveResumeHeadline,
  upsertApplicantExperience,
  upsertApplicantEducation,
  saveApplicantProjects,
  savePersonalDetails,
  saveCareerPreferences,
  upsertApplicantITSkill,
  type ExperienceFormData,
  type EducationFormData,
  type ProjectFormData,
  type PersonalDetailsFormData,
  type CareerPreferencesFormData,
  type ITSkillFormData,
} from "@/services/applicantProfileMutations";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { useClientContext } from "@/hooks/useClientContext";
import { fetchClientUnlockedApplicantIds } from "@/services/clientService";
import { canViewClientContact } from "@/lib/clientMasking";
import { cn } from "@/lib/utils";
import {
  applicantProfileTouchFields,
  getApplicantLastUpdated,
} from "@/lib/applicantProfileTimestamps";

// Profile Components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileCompletion from "@/components/profile/ProfileCompletion";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileSection from "@/components/profile/ProfileSection";

// Section Components
import ResumeSection from "@/components/profile/sections/ResumeSection";
import SkillsSection from "@/components/profile/sections/SkillsSection";
import ExperienceSection from "@/components/profile/sections/ExperienceSection";
import EducationSection from "@/components/profile/sections/EducationSection";
import ITSkillsSection from "@/components/profile/sections/ITSkillsSection";
import ProjectsSection from "@/components/profile/sections/ProjectsSection";
import CareerProfileSection from "@/components/profile/sections/CareerProfileSection";
import PersonalDetailsSection from "@/components/profile/sections/PersonalDetailsSection";
import ProfileAnalytics from "@/components/profile/sections/ProfileAnalytics";
import AccomplishmentsSection from "@/components/profile/sections/AccomplishmentsSection";
import OnlineProfilesSection from "@/components/profile/sections/OnlineProfilesSection";
import { RecruiterCandidateNotesPanel } from "@/components/dashboard/recruiter/RecruiterCandidateNotesPanel";
import { ApplicantHomeStrip } from "@/components/dashboard/applicant/ApplicantHomeStrip";
import { ApplicantProfileCompletionBanner } from "@/components/dashboard/applicant/ApplicantProfileCompletionBanner";
import { applicantProfileCanvas, applicantProfilePage, applicantProfileCard } from "@/components/dashboard/applicant/applicantProfileStyles";
import { ExperienceFormModal } from "@/components/profile/modals/ExperienceFormModal";
import { EducationFormModal } from "@/components/profile/modals/EducationFormModal";
import { ProjectFormModal } from "@/components/profile/modals/ProjectFormModal";
import { PersonalDetailsFormModal } from "@/components/profile/modals/PersonalDetailsFormModal";
import { CareerProfileFormModal } from "@/components/profile/modals/CareerProfileFormModal";
import { ITSkillFormModal } from "@/components/profile/modals/ITSkillFormModal";
import {
  ProfileSectionTabs,
  ProfileMobileSectionNav,
  sectionVisibleInTab,
  type ProfileTabId,
  PROFILE_TABS,
} from "@/components/profile/ProfileSectionTabs";
import { fetchLastInviteForApplicant } from "@/services/recruiterCandidateService";
import { resolveExperienceYears } from "@/lib/applicantProfileUtils";

// Icons
import {
  FileText, Code2, Briefcase, GraduationCap, FolderKanban,
  User, Target, Globe, Award, Activity, UserCircle, Settings
} from "lucide-react";

interface EnterpriseApplicantProfileProps {
  viewMode?: 'applicant' | 'admin' | 'client';
  applicantId?: string; // Optional prop to pass ID directly
  applicantDisplayMode?: 'view' | 'edit';
}

const EnterpriseApplicantProfile = ({ viewMode = 'admin', applicantId: propApplicantId, applicantDisplayMode = 'edit' }: EnterpriseApplicantProfileProps) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: clientCtx } = useClientContext();
  const [clientContactVisible, setClientContactVisible] = useState(false);
  const [resolvedApplicantId, setResolvedApplicantId] = useState<string | undefined>(
    propApplicantId || paramId
  );
  const [resolvingApplicantId, setResolvingApplicantId] = useState(
    viewMode === "applicant" && !propApplicantId && !paramId
  );
  const id = resolvedApplicantId;
  const { toast: toastHook } = useToast();
  const [activeSection, setActiveSection] = useState('resume');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applicantData, setApplicantData] = useState<any>(null);
  const viewRecordedRef = useRef<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [educationData, setEducationData] = useState<any[]>([]);
  const [experienceData, setExperienceData] = useState<any[]>([]);
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [profileSummary, setProfileSummary] = useState('');
  const [savingSummary, setSavingSummary] = useState(false);
  const [profileReloadNonce, setProfileReloadNonce] = useState(0);
  const [clientInvitedAt, setClientInvitedAt] = useState<string | null>(null);
  const [addressLine, setAddressLine] = useState<string>("");
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTabId>("essentials");
  const [completionBannerDismissed, setCompletionBannerDismissed] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [savingAdminRemarks, setSavingAdminRemarks] = useState(false);
  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [educationModalOpen, setEducationModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [personalModalOpen, setPersonalModalOpen] = useState(false);
  const [careerModalOpen, setCareerModalOpen] = useState(false);
  const [itSkillModalOpen, setItSkillModalOpen] = useState(false);
  const [experienceInitial, setExperienceInitial] = useState<Partial<ExperienceFormData>>();
  const [educationInitial, setEducationInitial] = useState<Partial<EducationFormData>>();
  const [projectInitial, setProjectInitial] = useState<Partial<ProjectFormData>>();
  const [itSkillInitial, setItSkillInitial] = useState<Partial<ITSkillFormData>>();

  useEffect(() => {
    if (propApplicantId || paramId) {
      setResolvedApplicantId(propApplicantId || paramId);
      setResolvingApplicantId(false);
      return;
    }
    if (viewMode !== "applicant") {
      setResolvingApplicantId(false);
      return;
    }
    if (!user?.id) {
      setResolvingApplicantId(false);
      return;
    }

    let cancelled = false;
    setResolvingApplicantId(true);

    void (async () => {
      if (profile?.applicant_id) {
        if (!cancelled) {
          setResolvedApplicantId(profile.applicant_id);
          setResolvingApplicantId(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("applicants")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Error resolving applicant id:", error);
      }
      setResolvedApplicantId(data?.id);
      setResolvingApplicantId(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [viewMode, user?.id, profile?.applicant_id, propApplicantId, paramId]);

  // Fetch applicant data from database
  useEffect(() => {
    const fetchData = async () => {
      if (resolvingApplicantId) {
        return;
      }

      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Fetch applicant data
        const { data: applicant, error: applicantError } = await supabase
          .from('applicants')
          .select('*')
          .eq('id', id)
          .single();

        if (applicantError) {
          console.error('Error fetching applicant:', applicantError);
          toastHook({
            title: "Error",
            description: "Failed to load applicant profile",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (applicant) {
          setApplicantData(applicant);
          setAdminRemarks((applicant as { remarks?: string }).remarks ?? "");
        }

        // Fetch education data
        const { data: education, error: educationError } = await supabase
          .from('applicant_education')
          .select('*')
          .eq('applicant_id', id)
          .order('is_highest', { ascending: false })
          .order('passing_year', { ascending: false });

        if (!educationError && education) {
          setEducationData(education);
        }

        // Fetch experience data
        const { data: experience, error: experienceError } = await supabase
          .from('applicant_experience')
          .select('*')
          .eq('applicant_id', id)
          .order('start_date', { ascending: false });

        if (!experienceError && experience) {
          setExperienceData(experience);
        }

        // Fetch skills data
        const { data: skills, error: skillsError } = await supabase
          .from('applicant_skills')
          .select('*')
          .eq('applicant_id', id)
          .order('skill_level', { ascending: false });

        if (!skillsError && skills) {
          setSkillsData(skills);
        }

        const { data: addressRow } = await supabase
          .from('applicant_addresses')
          .select('address_line1')
          .eq('applicant_id', id)
          .eq('is_primary', true)
          .maybeSingle();
        setAddressLine(addressRow?.address_line1 ?? '');

        // Fetch profile data if available
        if (applicant?.user_id) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', applicant.user_id)
            .single();

          if (!profileError && profile) {
            setProfileData(profile);
            const summary = (profile as { summary?: string }).summary || (applicant as { profile_summary?: string }).profile_summary || '';
            setProfileSummary(summary);
          } else {
            const summary = (applicant as { profile_summary?: string }).profile_summary || '';
            setProfileSummary(summary);
          }
        } else {
          const summary = (applicant as { profile_summary?: string })?.profile_summary || '';
          setProfileSummary(summary);
        }

        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toastHook({
          title: "Error",
          description: error.message || "Failed to load profile data",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [id, profileReloadNonce, toastHook, resolvingApplicantId]);

  useEffect(() => {
    viewRecordedRef.current = null;
  }, [id, viewMode]);

  useEffect(() => {
    if (loading || !applicantData?.id) return;
    if (viewMode !== "admin" && viewMode !== "client") return;

    let cancelled = false;
    void (async () => {
      const uid = user?.id;
      if (!uid || cancelled) return;
      const key = `${viewMode}:${applicantData.id}`;
      if (viewRecordedRef.current === key) return;
      viewRecordedRef.current = key;
      const viewerType = viewMode === "admin" ? "admin" : "client";
      try {
        await incrementProfileView(applicantData.id, uid, viewerType);
      } catch {
        viewRecordedRef.current = null;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loading, applicantData?.id, viewMode, user?.id]);

  useEffect(() => {
    if (viewMode !== "client" || !clientCtx?.client?.id || !id) {
      setClientContactVisible(false);
      return;
    }
    const planAllows = clientCtx.client.subscription_plans?.can_see_contact_details !== false;
    fetchClientUnlockedApplicantIds(clientCtx.client.id)
      .then((ids) => setClientContactVisible(canViewClientContact(planAllows, ids.has(id))))
      .catch(() => setClientContactVisible(planAllows));
  }, [viewMode, clientCtx?.client?.id, clientCtx?.client?.subscription_plans, id]);

  useEffect(() => {
    if (viewMode !== "client" || !clientCtx?.client?.id || !id) {
      setClientInvitedAt(null);
      return;
    }
    fetchLastInviteForApplicant(clientCtx.client.id, id).then(setClientInvitedAt);
  }, [viewMode, clientCtx?.client?.id, id]);

  // Intersection observer for active section detection (must be before early returns)
  useEffect(() => {
    if (loading || !applicantData) return; // Early exit if not ready
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [loading, applicantData]); // Re-run when data is loaded

  useEffect(() => {
    if (viewMode !== "applicant" || applicantDisplayMode !== "edit" || loading || resolvingApplicantId || !applicantData) return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const timer = window.setTimeout(() => {
      setActiveSection(hash);
      const tabForSection = PROFILE_TABS.find((t) => t.sections.includes(hash));
      if (tabForSection) setActiveProfileTab(tabForSection.id);
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [viewMode, applicantDisplayMode, loading, resolvingApplicantId, applicantData]);

  if (loading || resolvingApplicantId) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!applicantData) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-12">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-muted-foreground">
            {viewMode === "applicant"
              ? "We could not find your candidate profile. Complete registration or contact support."
              : "Applicant not found"}
          </p>
          {viewMode === "applicant" ? (
            <Button onClick={() => navigate("/auth/applicant-register/step-1")}>Complete registration</Button>
          ) : (
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          )}
        </div>
      </div>
    );
  }

  const profileLastUpdated = getApplicantLastUpdated(applicantData);

  // Map database data to component format
  const applicant = {
    id: applicantData.id,
    userId: applicantData.user_id ?? null,
    name: applicantData.name || applicantData.full_name || profileData?.full_name || "N/A",
    email: applicantData.email || applicantData.email_address || profileData?.email || "N/A",
    phone: applicantData.phone || applicantData.mobile_number || profileData?.phone || "N/A",
    skills: skillsData.length > 0 
      ? skillsData.map(s => s.skill_name)
      : (applicantData.key_skills ? (typeof applicantData.key_skills === 'string' ? applicantData.key_skills.split(',').map((s: string) => s.trim()) : applicantData.key_skills) : []),
    primarySkill: applicantData.job_role || applicantData.skill || applicantData.skill_job_role_applying_for || skillsData[0]?.skill_name || "N/A",
    currentCity: applicantData.city || applicantData.city_current_location || profileData?.location || "N/A",
    preferredCity: applicantData.preferred_city || applicantData.city || "N/A",
    experience: resolveExperienceYears(applicantData, experienceData),
    experienceYears: applicantData.total_experience_years,
    totalExperienceRaw: applicantData.total_experience,
    totalExperienceNumbers: applicantData.total_experience_numbers,
    experienceRows: experienceData,
    currentCompany: applicantData.current_company || experienceData.find(e => e.is_current)?.company_name || "N/A",
    pastCompanies: experienceData.filter(e => !e.is_current).map(e => e.company_name),
    designation: applicantData.current_designation || experienceData.find(e => e.is_current)?.designation || "N/A",
    currentCTC: applicantData.current_ctc || experienceData.find(e => e.is_current)?.current_ctc || 0,
    expectedCTC: applicantData.expected_ctc || applicantData.exp_ctc || 0,
    noticePeriod: applicantData.notice_period || experienceData.find(e => e.is_current)?.notice_period || "N/A",
    education: {
      highest: applicantData.highest_qualification || applicantData.education_level || educationData.find(e => e.is_highest)?.education_level || "N/A",
      degree: applicantData.course_degree_name || applicantData.course_degree || educationData.find(e => e.is_highest)?.degree_id || "N/A",
      university: applicantData.university_institute_name || applicantData.university || educationData.find(e => e.is_highest)?.institution_id || "N/A",
      yearOfPassing: applicantData.year_of_passing || applicantData.passing_year || educationData.find(e => e.is_highest)?.passing_year || new Date().getFullYear(),
      percentage: applicantData.percentage || educationData.find(e => e.is_highest)?.percentage || 0,
    },
    status: applicantData.status || 'Active',
    isFavorite: false,
    lastActive: profileLastUpdated || new Date().toISOString(),
    registeredDate: applicantData.created_at || new Date().toISOString(),
    resumeUpdated: profileLastUpdated || new Date().toISOString(),
    gender: applicantData.gender || 'Other',
    age: applicantData.age || 0,
    communicationSkill: applicantData.communication || 'Average',
    profilePhoto: applicantData.profile_image || profileData?.profile_image || null,
    resumeUrl: applicantData.resume_file || profileData?.resume_file || null,
    resumeHeadline: profileData?.headline ?? '',
  };

  // Map experience data: use applicant_experience table when available, else show flat data from applicants row
  const experiencesFromTable = experienceData.map((exp) => ({
    id: exp.id,
    deletable: Boolean(exp.id),
    company: exp.company_name || "N/A",
    designation: exp.designation || "N/A",
    employmentType: exp.employment_type || "Full-time",
    location: exp.city_id || applicant.currentCity,
    startDate: exp.start_date ? new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "N/A",
    endDate: exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : undefined,
    isCurrent: exp.is_current || false,
    responsibilities: exp.responsibilities || exp.description || "No description provided",
    ctc: exp.current_ctc || applicant.currentCTC,
    noticePeriod: exp.notice_period || applicant.noticePeriod
  }));
  const hasExperienceInRow = !!(applicantData.current_company || applicantData.current_designation || applicantData.total_experience);
  const experiences = experiencesFromTable.length > 0
    ? experiencesFromTable
    : hasExperienceInRow
      ? [{
          id: 'registration-summary',
          deletable: false,
          company: applicantData.current_company || "N/A",
          designation: applicantData.current_designation || "N/A",
          employmentType: "Full-time",
          location: applicant.currentCity,
          startDate: "N/A",
          endDate: undefined as string | undefined,
          isCurrent: true,
          responsibilities: "Experience details from profile.",
          ctc: applicant.currentCTC,
          noticePeriod: applicant.noticePeriod
        }]
      : [];

  // Map education data: use applicant_education when available, else show flat data from applicants row
  const educationFromTable = educationData.map((edu, index) => ({
    id: edu.id ?? `education-row-${index}`,
    deletable: Boolean(edu.id),
    degree: edu.degree_id || edu.course_id || applicant.education.degree || "N/A",
    specialization: edu.course_id || "N/A",
    institution: edu.institution_id || applicant.education.university || "N/A",
    yearOfPassing: edu.passing_year || applicant.education.yearOfPassing || new Date().getFullYear(),
    gradingSystem: edu.percentage ? "Percentage" : "CGPA",
    marks: edu.percentage ? String(edu.percentage) : "N/A",
    type: (edu.education_level?.toLowerCase().includes('graduation') || edu.education_level?.toLowerCase().includes('degree')) ? 'graduation' as const : 'school' as const
  }));
  const hasEducationInRow = !!(applicantData.education_level || applicantData.highest_qualification || applicantData.university || applicantData.university_institute_name || applicantData.course_degree);
  const mappedEducationData = educationFromTable.length > 0
    ? educationFromTable
    : hasEducationInRow
      ? [{
          id: 'registration-education',
          deletable: false,
          degree: applicant.education.degree,
          specialization: "N/A",
          institution: applicant.education.university,
          yearOfPassing: typeof applicant.education.yearOfPassing === 'number' ? applicant.education.yearOfPassing : new Date().getFullYear(),
          gradingSystem: applicant.education.percentage ? "Percentage" : "CGPA",
          marks: applicant.education.percentage ? String(applicant.education.percentage) : "N/A",
          type: (applicant.education.highest?.toLowerCase().includes('graduation') || applicant.education.degree?.toLowerCase().includes('degree')) ? 'graduation' as const : 'school' as const
        }]
      : [];

  // Map IT skills: use applicant_skills table when available, else derive from applicants.key_skills
  const itSkillsFromTable = skillsData.map((skill, index) => ({
    id: skill.id ?? `it-skill-${index}`,
    deletable: Boolean(skill.id),
    name: skill.skill_name || "N/A",
    version: skill.skill_version || '',
    experience: skill.years_of_experience || 0,
    proficiency: (skill.skill_level || 'Beginner') as 'Beginner' | 'Intermediate' | 'Expert'
  }));
  const keySkillsArr = applicantData.key_skills
    ? (typeof applicantData.key_skills === 'string' ? applicantData.key_skills.split(',').map((s: string) => s.trim()).filter(Boolean) : applicantData.key_skills)
    : [];
  const itSkills = itSkillsFromTable.length > 0
    ? itSkillsFromTable
    : keySkillsArr.map((name: string, index: number) => ({
        id: `key-skill-${index}`,
        deletable: false,
        name,
        version: '',
        experience: 0,
        proficiency: 'Beginner' as const
      }));

  // Projects from applicants.projects JSON
  const parsedProjects: ProjectFormData[] = Array.isArray(applicantData?.projects)
    ? (applicantData.projects as ProjectFormData[]).map((p, i) => ({
        id: p.id ?? `project-${i}`,
        title: p.title ?? "",
        description: p.description ?? "",
        skills: p.skills ?? (p as { techStack?: string[] }).techStack ?? [],
        link: p.link ?? (p as { url?: string }).url,
        githubLink: p.githubLink,
        teamSize: p.teamSize,
        duration: p.duration ?? (p as { role?: string }).role,
      }))
    : [];

  const projects = parsedProjects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    skills: p.skills ?? [],
    link: p.link,
    githubLink: p.githubLink,
    teamSize: p.teamSize,
    duration: p.duration,
  }));

  const industryPrefs = applicantData.industry_preferences ?? [];
  const careerProfile = {
    currentIndustry: industryPrefs[0] || '',
    preferredIndustry: industryPrefs[1] || '',
    functionalArea: applicantData.job_role || applicantData.functional_area || '',
    preferredRole: applicantData.job_role || applicantData.current_designation || '',
    desiredJobType: applicantData.preferred_job_types ?? [],
    preferredLocations: applicantData.preferred_locations
      ? (typeof applicantData.preferred_locations === 'string'
          ? applicantData.preferred_locations.split(',').map((s: string) => s.trim()).filter(Boolean)
          : applicantData.preferred_locations)
      : (applicantData.city ? [applicantData.city] : []),
    expectedSalary: applicantData.expected_ctc || applicantData.exp_ctc || 0,
    openToRelocation: applicantData.open_to_relocate === true,
  };

  const personalDetails = {
    dateOfBirth: applicantData.date_of_birth || applicantData.dob || '',
    gender: applicantData.gender || '',
    maritalStatus: applicantData.marital_status || '',
    languages: applicantData.languages_known
      ? (Array.isArray(applicantData.languages_known)
          ? applicantData.languages_known
          : String(applicantData.languages_known).split(',').map((s: string) => s.trim()).filter(Boolean))
      : applicantData.languages
        ? (typeof applicantData.languages === 'string'
            ? applicantData.languages.split(',').map((s: string) => s.trim()).filter(Boolean)
            : applicantData.languages)
        : [],
    address: addressLine || applicantData.address || '',
    homeTown: applicantData.city || applicantData.city_current_location || '',
  };

  // Accomplishments (can be extended later with accomplishments table)
  const accomplishments: any[] = [];

  // Online profiles (can be extended later with online_profiles table)
  const onlineProfiles = {
    linkedin: applicantData.linkedin_url || profileData?.linkedin_url || "",
    github: applicantData.github_url || profileData?.github_url || "",
    portfolio: applicantData.portfolio_url || profileData?.portfolio_url || "",
  };

  // Profile completion calculation (using data directly, not mapped applicant object)
  const applicantSkills = skillsData.length > 0 
    ? skillsData.map(s => s.skill_name)
    : (applicantData.key_skills ? (typeof applicantData.key_skills === 'string' ? applicantData.key_skills.split(',').map((s: string) => s.trim()) : applicantData.key_skills) : []);
  
  // Profile completion: consider both normalized tables and applicants row data
  const hasEmployment = experienceData.length > 0 || !!(applicantData.current_company || applicantData.current_designation || applicantData.total_experience);
  const hasEducation = educationData.length > 0 || !!(applicantData.education_level || applicantData.highest_qualification || applicantData.university || applicantData.course_degree);
  const hasItSkills = skillsData.length > 0 || (applicantSkills.length > 0);
  const hasCareerPrefs = !!(
    applicantData.expected_ctc ||
    applicantData.job_role ||
    (applicantData.preferred_job_types?.length ?? 0) > 0 ||
    (applicantData.preferred_locations?.length ?? 0) > 0
  );
  const hasPersonalDetails = !!(
    applicantData.date_of_birth ||
    applicantData.gender ||
    applicantData.marital_status ||
    addressLine ||
    (applicantData.languages_known && (Array.isArray(applicantData.languages_known) ? applicantData.languages_known.length : true))
  );
  const completionItems = [
    { id: '1', label: 'Resume uploaded', completed: !!(applicantData.resume_file || profileData?.resume_file), section: 'resume' },
    { id: '2', label: 'Resume headline added', completed: (profileData?.headline ?? '').trim().length > 10, section: 'resume' },
    { id: '3', label: 'Key skills added', completed: applicantSkills.length > 3, section: 'skills' },
    { id: '4', label: 'Employment details', completed: hasEmployment, section: 'experience' },
    { id: '5', label: 'Education details', completed: hasEducation, section: 'education' },
    { id: '6', label: 'IT skills added', completed: hasItSkills, section: 'itskills' },
    { id: '7', label: 'Projects added', completed: projects.length > 0, section: 'projects' },
    { id: '8', label: 'Profile summary', completed: profileSummary.length > 50, section: 'summary' },
    { id: '9', label: 'Online profiles linked', completed: Object.values(onlineProfiles).some(v => v), section: 'links' },
    { id: '10', label: 'Certifications added', completed: accomplishments.some(a => a.type === 'certification'), section: 'accomplishments' },
    { id: '11', label: 'Career preferences', completed: hasCareerPrefs, section: 'career' },
    { id: '12', label: 'Personal details', completed: hasPersonalDetails, section: 'personal' },
  ];

  const completionPercentage = Math.round(
    (completionItems.filter(i => i.completed).length / completionItems.length) * 100
  );

  const isRowUuid = (rowId: string | number) =>
    typeof rowId === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rowId);

  const scrollToSection = (sectionId: string) => {
    const tabForSection = PROFILE_TABS.find((t) => t.sections.includes(sectionId));
    if (viewMode === "applicant" && tabForSection) {
      setActiveProfileTab(tabForSection.id);
    }
    setActiveSection(sectionId);
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, viewMode === "applicant" ? 80 : 0);
  };

  const isApplicantView = viewMode === "applicant" && applicantDisplayMode === "view";
  const isApplicantEdit = viewMode === "applicant" && applicantDisplayMode === "edit";
  const sectionReadOnly = isApplicantView;
  const effectiveSectionViewMode = sectionReadOnly ? "client" as const : viewMode;

  const showProfileSection = (sectionId: string) => {
    if (!isApplicantEdit) return true;
    return sectionVisibleInTab(sectionId, activeProfileTab);
  };

  const sectionExpandedDefault = (sectionId: string) => {
    if (isApplicantView) return true;
    if (viewMode !== "applicant") return true;
    return sectionId === activeSection || sectionId === "resume";
  };

  const editProfilePath = "/dashboard/applicant/profile/edit";

  const openExperienceModal = (expId?: string | number) => {
    if (expId && isRowUuid(expId)) {
      const row = experienceData.find((e) => e.id === expId);
      if (row) {
        setExperienceInitial({
          id: row.id,
          company_name: row.company_name,
          designation: row.designation,
          employment_type: row.employment_type,
          start_date: row.start_date ?? "",
          end_date: row.end_date,
          is_current: row.is_current ?? false,
          description: row.description,
          current_ctc: row.current_ctc,
          notice_period: row.notice_period,
        });
      }
    } else if (expId === "registration-summary" || (!expId && experienceData.length === 0)) {
      setExperienceInitial({
        company_name: applicantData.current_company ?? "",
        designation: applicantData.current_designation ?? "",
        is_current: true,
        employment_type: "full-time",
        start_date: "",
        current_ctc: applicantData.current_ctc ?? "",
        notice_period: applicantData.notice_period ?? "",
      });
    } else {
      setExperienceInitial(undefined);
    }
    setExperienceModalOpen(true);
  };

  const openEducationModal = (eduId?: string | number) => {
    if (eduId && isRowUuid(eduId)) {
      const row = educationData.find((e) => e.id === eduId);
      if (row) {
        setEducationInitial({
          id: row.id,
          education_level: row.education_level ?? "",
          institution_name: row.institution_name ?? row.institution_id ?? "",
          degree: row.degree_id ?? row.course_id ?? "",
          field_of_study: row.field_of_study ?? "",
          passing_year: row.passing_year,
          percentage: row.percentage,
          is_highest: row.is_highest ?? false,
        });
      }
    } else if (eduId === "registration-education" || (!eduId && educationData.length === 0)) {
      setEducationInitial({
        education_level: applicantData.education_level ?? applicantData.highest_qualification ?? "",
        institution_name: applicantData.university_institute_name ?? applicantData.university ?? "",
        degree: applicantData.course_degree_name ?? applicantData.course_degree ?? "",
        passing_year: applicantData.passing_year ? Number(applicantData.passing_year) : undefined,
        percentage: applicantData.percentage ? Number(applicantData.percentage) : undefined,
        is_highest: true,
      });
    } else {
      setEducationInitial(undefined);
    }
    setEducationModalOpen(true);
  };

  const openItSkillModal = (skillId?: string | number) => {
    if (skillId && isRowUuid(skillId)) {
      const row = skillsData.find((s) => s.id === skillId);
      if (row) {
        setItSkillInitial({
          id: row.id,
          skill_name: row.skill_name,
          skill_level: row.skill_level ?? "intermediate",
          years_of_experience: row.years_of_experience,
        });
      }
    } else {
      setItSkillInitial(undefined);
    }
    setItSkillModalOpen(true);
  };

  const careerFormInitial: CareerPreferencesFormData = {
    current_ctc: applicantData.current_ctc ? Number(applicantData.current_ctc) : null,
    expected_ctc: applicantData.expected_ctc ? Number(applicantData.expected_ctc) : null,
    notice_period: applicantData.notice_period ?? "",
    job_role: applicantData.job_role ?? "",
    preferred_job_types: applicantData.preferred_job_types ?? [],
    work_mode_preferences: applicantData.work_mode_preferences ?? [],
    industry_preferences: applicantData.industry_preferences ?? [],
    preferred_locations: applicantData.preferred_locations ?? [],
    open_to_relocate: applicantData.open_to_relocate ?? false,
    is_actively_looking: applicantData.is_actively_looking !== false,
    current_industry: applicantData.industry_preferences?.[0] ?? "",
    preferred_industry: applicantData.industry_preferences?.[1] ?? "",
    functional_area: applicantData.job_role ?? "",
  };

  const personalFormInitial: PersonalDetailsFormData = {
    date_of_birth: applicantData.date_of_birth ?? applicantData.dob ?? null,
    gender: applicantData.gender ?? null,
    marital_status: applicantData.marital_status ?? null,
    languages: applicantData.languages_known
      ? (Array.isArray(applicantData.languages_known)
          ? applicantData.languages_known
          : String(applicantData.languages_known).split(",").map((s: string) => s.trim()))
      : [],
    address_line1: addressLine,
    city: applicantData.city ?? applicantData.city_current_location ?? "",
  };

  const canEdit = viewMode !== 'client';
  const profileUiVariant = viewMode === "applicant" ? "applicant" : "default";

  const saveProjectsList = async (next: ProjectFormData[]) => {
    const { error } = await saveApplicantProjects(applicantData.id, next);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Projects saved");
    setApplicantData({ ...applicantData, projects: next });
    setProfileReloadNonce((n) => n + 1);
  };

  const openProjectModal = (projectId?: string | number) => {
    if (projectId) {
      const row = parsedProjects.find((p) => p.id === projectId);
      setProjectInitial(row);
    } else {
      setProjectInitial(undefined);
    }
    setProjectModalOpen(true);
  };

  const profileChrome = (
    <>
      {viewMode !== "applicant" && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 -ml-2"
            onClick={() => {
              if (viewMode === "client") {
                navigate("/dashboard/client/candidates");
              } else {
                navigate("/dashboard/admin/applicants");
              }
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {viewMode === "client" ? "Candidates" : "Resume Search"}
          </Button>
          {viewMode === "client" && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              Read-only client view
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          viewMode === "applicant" ? applicantProfilePage : "mx-auto w-full max-w-7xl space-y-5 py-2"
        )}
      >
        {isApplicantEdit && (
          <ApplicantHomeStrip
            applicantData={applicantData}
            profileData={profileData}
            profileCompletion={completionPercentage}
            onScrollToSection={scrollToSection}
            editProfilePath={editProfilePath}
          />
        )}

        {isApplicantView && (
          <ApplicantHomeStrip
            variant="minimal"
            applicantData={applicantData}
            profileData={profileData}
            profileCompletion={completionPercentage}
            editProfilePath={editProfilePath}
          />
        )}

        {isApplicantEdit && !completionBannerDismissed && completionPercentage < 100 && (
          <ApplicantProfileCompletionBanner
            percentage={completionPercentage}
            items={completionItems}
            onGoToSection={scrollToSection}
            onDismiss={() => setCompletionBannerDismissed(true)}
            className="mb-4"
          />
        )}

        {isApplicantEdit && (
          <ProfileSectionTabs
            activeTab={activeProfileTab}
            onTabChange={setActiveProfileTab}
            className="mb-4"
          />
        )}

        <ProfileHeader
          applicant={applicant}
          viewMode={viewMode}
          applicantProfileLayout={isApplicantView ? "view" : "edit"}
          profileCompletion={completionPercentage}
          onEdit={() => {
            if (isApplicantView) {
              navigate(editProfilePath);
              return;
            }
            const el = document.getElementById('resume');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onDelete={() => toast.error("Delete profile clicked")}
          onAddNote={() => toast.info("Add note clicked")}
          onAddToFolder={() => toast.info("Add to folder clicked")}
          onShortlist={() => toast.success("Added to shortlist")}
          onFavorite={() => setIsFavorite(!isFavorite)}
          isFavorite={isFavorite}
          onProfileImageUploaded={(url) => {
            setApplicantData({ ...applicantData, profile_image: url });
          }}
          clientContactVisible={clientContactVisible}
        />

        <div className="mt-6">
          {isApplicantEdit && (
            <ProfileMobileSectionNav
              activeSection={activeSection}
              activeTab={activeProfileTab}
              onSectionClick={scrollToSection}
            />
          )}

        <div className="grid lg:grid-cols-12 gap-5">
          {isApplicantEdit && (
          <div className="lg:col-span-2 hidden lg:block">
            <ProfileSidebar 
              activeSection={activeSection} 
              onSectionClick={scrollToSection}
              variant={profileUiVariant}
            />
          </div>
          )}

          <div className={cn(isApplicantView ? "lg:col-span-8" : "lg:col-span-7", "space-y-5")}>
            {showProfileSection('resume') && (
            <div id="resume" data-section>
              <ProfileSection
                variant={profileUiVariant}
                id="resume-section"
                title="Resume & Headline"
                icon={<FileText className="h-4 w-4" />}
                canEdit={canEdit && !sectionReadOnly}
                badge="Important"
                defaultExpanded={sectionExpandedDefault('resume')}
              >
                <ResumeSection
                  applicant={applicant}
                  viewMode={effectiveSectionViewMode}
                  onUpdateHeadline={async (headline) => {
                    const { error } = await saveResumeHeadline(applicantData.id, applicantData.user_id, headline);
                    if (error) {
                      toast.error(error);
                      throw new Error(error);
                    }
                    toast.success("Headline saved");
                    if (profileData && applicantData.user_id) {
                      setProfileData({ ...profileData, headline });
                    }
                    setProfileReloadNonce((n) => n + 1);
                  }}
                  onResumeUploaded={(url) => {
                    const touch = applicantProfileTouchFields();
                    setApplicantData({
                      ...applicantData,
                      resume_file: url,
                      upload_cv_any_format: url,
                      ...touch,
                    });
                    if (profileData && applicantData.user_id) {
                      setProfileData({ ...profileData, resume_file: url });
                    }
                    toast.success("Resume linked to profile");
                    setProfileReloadNonce((n) => n + 1);
                  }}
                  onResumeRemoved={() => {
                    const touch = applicantProfileTouchFields();
                    setApplicantData({
                      ...applicantData,
                      resume_file: null,
                      upload_cv_any_format: null,
                      ...touch,
                    });
                    if (profileData) {
                      setProfileData({ ...profileData, resume_file: null });
                    }
                    setProfileReloadNonce((n) => n + 1);
                  }}
                />
              </ProfileSection>
            </div>
            )}

            {showProfileSection('skills') && (
            <div id="skills" data-section>
              <ProfileSection
                variant={profileUiVariant}
                id="skills-section"
                title="Key Skills"
                icon={<Code2 className="h-4 w-4" />}
                canEdit={canEdit && !sectionReadOnly}
                badge="250 chars"
                defaultExpanded={sectionExpandedDefault('skills')}
              >
                <SkillsSection
                  skills={applicant.skills}
                  viewMode={effectiveSectionViewMode}
                  onUpdateSkills={async (skills) => {
                    const { error } = await syncApplicantSkillsFromChipList(
                      applicantData.id,
                      applicantData.user_id,
                      skills
                    );
                    if (error) {
                      toast.error(error);
                      return;
                    }
                    toast.success("Key skills saved");
                    setProfileReloadNonce((n) => n + 1);
                  }}
                />
              </ProfileSection>
            </div>
            )}

            {showProfileSection('experience') && (
            <div id="experience" data-section>
              <ProfileSection
                variant={profileUiVariant}
                id="experience-section"
                title="Employment"
                icon={<Briefcase className="h-4 w-4" />}
                canAdd={canEdit && !sectionReadOnly}
                onAdd={() => openExperienceModal()}
                isEmpty={experiences.length === 0}
                emptyMessage="No employment history added yet"
                defaultExpanded={sectionExpandedDefault('experience')}
              >
                <ExperienceSection
                  experiences={experiences}
                  viewMode={effectiveSectionViewMode}
                  onEdit={(expId) => openExperienceModal(expId)}
                  onDelete={async (expId) => {
                    if (!isRowUuid(expId)) {
                      toast.error("This line comes from your registration summary, not a separate employment record.");
                      return;
                    }
                    const { error } = await deleteApplicantExperienceRow(expId);
                    if (error) {
                      toast.error(error);
                      return;
                    }
                    toast.success("Employment removed");
                    setProfileReloadNonce((n) => n + 1);
                  }}
                />
              </ProfileSection>
            </div>
            )}

            {showProfileSection('education') && (
            <div id="education" data-section>
              <ProfileSection
                variant={profileUiVariant}
                id="education-section"
                title="Education"
                icon={<GraduationCap className="h-4 w-4" />}
                canAdd={canEdit && !sectionReadOnly}
                onAdd={() => openEducationModal()}
                isEmpty={mappedEducationData.length === 0}
                emptyMessage="No education added yet"
                defaultExpanded={sectionExpandedDefault('education')}
              >
                <EducationSection
                  education={mappedEducationData}
                  viewMode={effectiveSectionViewMode}
                  onEdit={(eduId) => openEducationModal(eduId)}
                  onDelete={async (eduId) => {
                    if (!isRowUuid(eduId)) {
                      toast.error("This line comes from your registration summary, not a separate education record.");
                      return;
                    }
                    const { error } = await deleteApplicantEducationRow(eduId);
                    if (error) {
                      toast.error(error);
                      return;
                    }
                    toast.success("Education removed");
                    setProfileReloadNonce((n) => n + 1);
                  }}
                />
              </ProfileSection>
            </div>
            )}

            {showProfileSection('itskills') && (
            <div id="itskills" data-section>
              <ProfileSection
                variant={profileUiVariant}
                id="itskills-section"
                title="IT Skills"
                icon={<Settings className="h-4 w-4" />}
                canAdd={canEdit && !sectionReadOnly}
                onAdd={() => openItSkillModal()}
                defaultExpanded={sectionExpandedDefault('itskills')}
              >
                <ITSkillsSection
                  skills={itSkills}
                  viewMode={effectiveSectionViewMode}
                  onEdit={(skillId) => openItSkillModal(skillId)}
                  onDelete={async (skillId) => {
                    if (!isRowUuid(skillId)) {
                      toast.info("Change key skills in the section above, or add IT skills as detailed rows after registration.");
                      return;
                    }
                    const { error } = await deleteApplicantSkillRow(skillId);
                    if (error) {
                      toast.error(error);
                      return;
                    }
                    const { error: syncErr } = await resyncApplicantKeySkillsFromTable(
                      applicantData.id,
                      applicantData.user_id
                    );
                    if (syncErr) {
                      toast.error(syncErr);
                      return;
                    }
                    toast.success("Skill removed");
                    setProfileReloadNonce((n) => n + 1);
                  }}
                />
              </ProfileSection>
            </div>
            )}

            {showProfileSection('projects') && (
            <div id="projects" data-section>
              <ProfileSection
                variant={profileUiVariant}
                id="projects-section"
                title="Projects"
                icon={<FolderKanban className="h-4 w-4" />}
                canAdd={canEdit && !sectionReadOnly}
                onAdd={() => openProjectModal()}
                isEmpty={projects.length === 0}
                emptyMessage="No projects added yet"
                defaultExpanded={sectionExpandedDefault('projects')}
              >
                <ProjectsSection
                  projects={projects}
                  viewMode={effectiveSectionViewMode}
                  onEdit={(id) => openProjectModal(id)}
                  onDelete={async (id) => {
                    const next = parsedProjects.filter((p) => p.id !== id);
                    await saveProjectsList(next);
                  }}
                />
              </ProfileSection>
            </div>
            )}

            {showProfileSection('summary') && (
            <div id="summary" data-section>
              <ProfileSection
                variant={profileUiVariant}
                id="summary-section"
                title="Profile Summary"
                icon={<UserCircle className="h-4 w-4" />}
                canEdit={canEdit && !sectionReadOnly}
                defaultExpanded={sectionExpandedDefault('summary')}
              >
                {canEdit ? (
                  <div className="space-y-2">
                    <Textarea
                      value={profileSummary}
                      onChange={(e) => setProfileSummary(e.target.value)}
                      rows={4}
                      placeholder="Write a brief summary about yourself..."
                      className="resize-none text-sm"
                    />
                    {applicantData?.user_id && (
                      <Button
                        size="sm"
                        disabled={savingSummary}
                        onClick={async () => {
                          setSavingSummary(true);
                          const { success, error } = await updateProfileSummary(
                            applicantData.user_id,
                            profileSummary,
                            applicantData.id
                          );
                          setSavingSummary(false);
                          if (success) {
                            toast.success("Profile summary saved.");
                            const touch = applicantProfileTouchFields();
                            if (profileData) setProfileData({ ...profileData, summary: profileSummary });
                            setApplicantData({ ...applicantData, summary: profileSummary, ...touch });
                            setProfileReloadNonce((n) => n + 1);
                          } else {
                            toast.error(error || "Failed to save summary.");
                          }
                        }}
                      >
                        {savingSummary ? "Saving..." : "Save summary"}
                      </Button>
                    )}
                  </div>
                ) : (
                  profileSummary ? (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {profileSummary}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No profile summary added yet.</p>
                  )
                )}
              </ProfileSection>
            </div>
            )}

            {showProfileSection('links') && (
            <div id="links" data-section>
              <ProfileSection
                variant={profileUiVariant}
                id="links-section"
                title="Online Profiles"
                icon={<Globe className="h-4 w-4" />}
                canEdit={canEdit && !sectionReadOnly}
                defaultExpanded={sectionExpandedDefault('links')}
              >
                <OnlineProfilesSection
                  profiles={onlineProfiles}
                  viewMode={effectiveSectionViewMode}
                  onSave={async (profiles) => {
                    const touch = applicantProfileTouchFields();
                    const patch = {
                      linkedin_url: profiles.linkedin?.trim() || null,
                      github_url: profiles.github?.trim() || null,
                      portfolio_url: profiles.portfolio?.trim() || null,
                      ...touch,
                    };
                    const { error: appErr } = await supabase.from("applicants").update(patch).eq("id", applicantData.id);
                    if (appErr) {
                      throw new Error(appErr.message);
                    }
                    if (applicantData.user_id) {
                      const { error: profErr } = await supabase
                        .from("profiles")
                        .update(patch)
                        .eq("id", applicantData.user_id);
                      if (profErr) {
                        throw new Error(profErr.message);
                      }
                      if (profileData) {
                        setProfileData({
                          ...profileData,
                          linkedin_url: patch.linkedin_url,
                          github_url: patch.github_url,
                          portfolio_url: patch.portfolio_url,
                        });
                      }
                    }
                    setApplicantData({
                      ...applicantData,
                      linkedin_url: patch.linkedin_url,
                      github_url: patch.github_url,
                      portfolio_url: patch.portfolio_url,
                    });
                    setProfileReloadNonce((n) => n + 1);
                  }}
                />
              </ProfileSection>
            </div>
            )}

            {showProfileSection('accomplishments') && (
            <div id="accomplishments" data-section>
              <ProfileSection
                variant={profileUiVariant}
                id="accomplishments-section"
                title="Accomplishments"
                icon={<Award className="h-4 w-4" />}
                canAdd={canEdit && !sectionReadOnly}
                isEmpty={accomplishments.length === 0}
                emptyMessage="No accomplishments added yet"
                defaultExpanded={sectionExpandedDefault('accomplishments')}
              >
                <AccomplishmentsSection
                  accomplishments={accomplishments}
                  viewMode={effectiveSectionViewMode}
                  onEdit={(id) => toast.info(`Edit accomplishment ${id}`)}
                  onDelete={(id) => toast.error(`Delete accomplishment ${id}`)}
                />
              </ProfileSection>
            </div>
            )}

            {showProfileSection('career') && (
            <div id="career" data-section>
              <ProfileSection
                variant={profileUiVariant}
                id="career-section"
                title="Career Profile"
                icon={<Target className="h-4 w-4" />}
                canEdit={canEdit && !sectionReadOnly}
                onEdit={canEdit && !sectionReadOnly ? () => setCareerModalOpen(true) : undefined}
                badge="Matching"
                defaultExpanded={sectionExpandedDefault('career')}
              >
                <CareerProfileSection
                  career={careerProfile}
                  viewMode={effectiveSectionViewMode}
                  onEdit={canEdit && !sectionReadOnly ? () => setCareerModalOpen(true) : undefined}
                />
              </ProfileSection>
            </div>
            )}

            {showProfileSection('personal') && (
            <div id="personal" data-section>
              <ProfileSection
                variant={profileUiVariant}
                id="personal-section"
                title="Personal Details"
                icon={<User className="h-4 w-4" />}
                canEdit={canEdit && !sectionReadOnly}
                onEdit={canEdit && !sectionReadOnly ? () => setPersonalModalOpen(true) : undefined}
                defaultExpanded={sectionExpandedDefault('personal')}
              >
                <PersonalDetailsSection
                  details={personalDetails}
                  viewMode={effectiveSectionViewMode}
                  onEdit={canEdit && !sectionReadOnly ? () => setPersonalModalOpen(true) : undefined}
                />
              </ProfileSection>
            </div>
            )}

            {showProfileSection('analytics') && (
            <div id="analytics" data-section>
              <ProfileSection
                variant={profileUiVariant}
                id="analytics-section"
                title="Profile Analytics"
                icon={<Activity className="h-4 w-4" />}
                defaultExpanded={sectionExpandedDefault('analytics')}
              >
                <ProfileAnalytics
                  viewMode={effectiveSectionViewMode}
                  profileViewsCount={applicantData.profile_views_count ?? 0}
                  searchAppearanceCount={applicantData.search_appearance_count ?? 0}
                  shortlistCount={applicantData.shortlist_count ?? 0}
                />
              </ProfileSection>
            </div>
            )}
          </div>

          {/* Right Sidebar - Profile Completion */}
          <div className={cn(isApplicantView ? "lg:col-span-4" : "lg:col-span-3")}>
            {viewMode === 'applicant' && (
              <div className="sticky top-24 space-y-4">
                {isApplicantEdit && (
                  <div className="hidden lg:flex items-center justify-between rounded-lg border border-[#e8e8e8] bg-white px-3 py-2 text-xs text-[#666]">
                    <span>Editing your profile</span>
                    <Button variant="link" className="h-auto p-0 text-xs text-[#0566CD]" onClick={() => navigate("/dashboard/applicant")}>
                      View profile
                    </Button>
                  </div>
                )}
                <ProfileCompletion
                  percentage={completionPercentage}
                  items={completionItems}
                  onItemClick={(sectionId) => {
                    if (isApplicantView) {
                      navigate(`${editProfilePath}#${sectionId}`);
                      return;
                    }
                    scrollToSection(sectionId);
                  }}
                  variant="applicant"
                  showPendingOnly={isApplicantView}
                />
                {isApplicantView && completionPercentage < 100 && (
                  <Button
                    className="w-full h-9 bg-[#0566CD] text-xs hover:bg-[#0066c0]"
                    onClick={() => navigate(editProfilePath)}
                  >
                    Complete profile
                  </Button>
                )}
                <div className={cn(applicantProfileCard, "space-y-3 p-4")}>
                  <h3 className="text-sm font-semibold text-[#333]">Profile status</h3>
                  {applicantData.created_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Registered</span>
                      <span className="font-medium text-xs">
                        {new Date(applicantData.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  {profileLastUpdated && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last updated</span>
                      <span className="font-medium text-xs">
                        {new Date(profileLastUpdated).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(viewMode === 'admin' || viewMode === 'client') && (
              <div className="sticky top-24 space-y-6">
                <div className="bg-card rounded-xl border p-4 space-y-4">
                  <h3 className="text-sm font-semibold">Quick Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Profile Score</span>
                      <span className="font-medium text-green-600">{completionPercentage}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium">{applicantData.status || 'Active'}</span>
                    </div>
                    {applicantData.created_at && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Registered</span>
                        <span className="font-medium text-xs">{new Date(applicantData.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    )}
                    {profileLastUpdated && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="font-medium text-xs">{new Date(profileLastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
                </div>

                {viewMode === 'admin' && (
                  <div className="bg-card rounded-xl border p-4 space-y-3">
                    <h3 className="text-sm font-semibold">Admin notes</h3>
                    <Textarea
                      placeholder="Internal note about this candidate (visible to admins only)…"
                      rows={3}
                      className="text-sm"
                      value={adminRemarks}
                      onChange={(e) => setAdminRemarks(e.target.value)}
                    />
                    <Button
                      size="sm"
                      className="w-full h-8 text-xs"
                      disabled={savingAdminRemarks || !applicantData?.id}
                      onClick={async () => {
                        if (!applicantData?.id) return;
                        setSavingAdminRemarks(true);
                        const { error } = await supabase
                          .from("applicants")
                          .update({ remarks: adminRemarks.trim() || null, updated_at: new Date().toISOString() })
                          .eq("id", applicantData.id);
                        setSavingAdminRemarks(false);
                        if (error) toast.error(error.message);
                        else toast.success("Admin note saved");
                      }}
                    >
                      {savingAdminRemarks ? "Saving…" : "Save note"}
                    </Button>
                  </div>
                )}

                {viewMode === 'client' && clientCtx?.client?.id && id && user?.id && (
                  <div className="bg-card rounded-xl border p-4">
                    <RecruiterCandidateNotesPanel
                      recruiterId={clientCtx.client.id}
                      applicantId={id}
                      userId={user.id}
                      invitedAt={clientInvitedAt}
                      variant="stacked"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {isApplicantEdit && (
        <>
          <ExperienceFormModal
            open={experienceModalOpen}
            onOpenChange={setExperienceModalOpen}
            initial={experienceInitial}
            onSave={async (data) => {
              const { error } = await upsertApplicantExperience(applicantData.id, data);
              if (error) {
                toast.error(error);
                throw new Error(error);
              }
              toast.success(data.id ? "Employment updated" : "Employment added");
              setProfileReloadNonce((n) => n + 1);
            }}
          />
          <EducationFormModal
            open={educationModalOpen}
            onOpenChange={setEducationModalOpen}
            initial={educationInitial}
            onSave={async (data) => {
              const { error } = await upsertApplicantEducation(applicantData.id, data);
              if (error) {
                toast.error(error);
                throw new Error(error);
              }
              toast.success(data.id ? "Education updated" : "Education added");
              setProfileReloadNonce((n) => n + 1);
            }}
          />
          <ProjectFormModal
            open={projectModalOpen}
            onOpenChange={setProjectModalOpen}
            initial={projectInitial}
            onSave={async (data) => {
              const exists = parsedProjects.some((p) => p.id === data.id);
              const next = exists
                ? parsedProjects.map((p) => (p.id === data.id ? data : p))
                : [...parsedProjects, data];
              await saveProjectsList(next);
            }}
          />
          <PersonalDetailsFormModal
            open={personalModalOpen}
            onOpenChange={setPersonalModalOpen}
            initial={personalFormInitial}
            onSave={async (data) => {
              const { error } = await savePersonalDetails(
                applicantData.id,
                applicantData.user_id,
                data
              );
              if (error) {
                toast.error(error);
                throw new Error(error);
              }
              toast.success("Personal details saved");
              setProfileReloadNonce((n) => n + 1);
            }}
          />
          <CareerProfileFormModal
            open={careerModalOpen}
            onOpenChange={setCareerModalOpen}
            initial={careerFormInitial}
            onSave={async (data) => {
              const { error } = await saveCareerPreferences(applicantData.id, data);
              if (error) {
                toast.error(error);
                throw new Error(error);
              }
              toast.success("Career preferences saved");
              setProfileReloadNonce((n) => n + 1);
            }}
          />
          <ITSkillFormModal
            open={itSkillModalOpen}
            onOpenChange={setItSkillModalOpen}
            initial={itSkillInitial}
            onSave={async (data) => {
              const { error } = await upsertApplicantITSkill(
                applicantData.id,
                applicantData.user_id,
                data
              );
              if (error) {
                toast.error(error);
                throw new Error(error);
              }
              toast.success(data.id ? "IT skill updated" : "IT skill added");
              setProfileReloadNonce((n) => n + 1);
            }}
          />
        </>
      )}
    </>
  );

  if (viewMode === "applicant") {
    return (
      <div className={applicantProfileCanvas}>{profileChrome}</div>
    );
  }

  return (
    <DashboardPageShell className="space-y-1">{profileChrome}</DashboardPageShell>
  );
};

export default EnterpriseApplicantProfile;
