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
} from "@/services/applicantProfileMutations";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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

// Icons
import {
  FileText, Code2, Briefcase, GraduationCap, FolderKanban,
  User, Target, Globe, Award, Activity, UserCircle, Settings
} from "lucide-react";

interface EnterpriseApplicantProfileProps {
  viewMode?: 'applicant' | 'admin' | 'client';
  applicantId?: string; // Optional prop to pass ID directly
}

const EnterpriseApplicantProfile = ({ viewMode = 'admin', applicantId: propApplicantId }: EnterpriseApplicantProfileProps) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  // Use prop ID if provided, otherwise use URL param
  const id = propApplicantId || paramId;
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

  // Fetch applicant data from database
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

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
  }, [id, profileReloadNonce, toastHook]);

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

  if (loading) {
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
          <p className="text-muted-foreground">Applicant not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

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
    experience: applicantData.total_experience ? parseInt(applicantData.total_experience) : (experienceData.length > 0 ? experienceData.reduce((acc, exp) => acc + (exp.total_experience_months || 0), 0) / 12 : 0),
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
    lastActive: applicantData.updated_at || applicantData.created_at || new Date().toISOString(),
    registeredDate: applicantData.created_at || new Date().toISOString(),
    resumeUpdated: applicantData.updated_at || applicantData.created_at || new Date().toISOString(),
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

  // Projects (can be extended later with projects table)
  const projects: any[] = [];

  const careerProfile = {
    currentIndustry: applicantData.current_industry || '',
    preferredIndustry: applicantData.preferred_industry || '',
    functionalArea: applicantData.functional_area || '',
    preferredRole: applicantData.job_role || applicantData.current_designation || applicantData.designation || '',
    desiredJobType: applicantData.desired_job_type
      ? (typeof applicantData.desired_job_type === 'string' ? applicantData.desired_job_type.split(',').map((s: string) => s.trim()).filter(Boolean) : applicantData.desired_job_type)
      : [],
    preferredLocations: applicantData.preferred_locations
      ? (typeof applicantData.preferred_locations === 'string' ? applicantData.preferred_locations.split(',').map((s: string) => s.trim()).filter(Boolean) : applicantData.preferred_locations)
      : (applicantData.preferred_city ? [applicantData.preferred_city] : (applicantData.city ? [applicantData.city] : [])),
    expectedSalary: applicantData.expected_ctc || applicantData.exp_ctc || 0,
    openToRelocation: applicantData.open_to_relocation === true || applicantData.open_to_relocation === 'true'
  };

  const personalDetails = {
    dateOfBirth: applicantData.date_of_birth || applicantData.dob || '',
    gender: applicantData.gender || '',
    maritalStatus: applicantData.marital_status || '',
    languages: applicantData.languages
      ? (typeof applicantData.languages === 'string' ? applicantData.languages.split(',').map((s: string) => s.trim()).filter(Boolean) : applicantData.languages)
      : [],
    address: applicantData.address || applicantData.address_line1 || '',
    homeTown: applicantData.city || applicantData.city_current_location || ''
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
    { id: '11', label: 'Career preferences', completed: true, section: 'career' },
    { id: '12', label: 'Personal details', completed: true, section: 'personal' },
  ];

  const completionPercentage = Math.round(
    (completionItems.filter(i => i.completed).length / completionItems.length) * 100
  );

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const canEdit = viewMode !== 'client';

  const isRowUuid = (rowId: string | number) =>
    typeof rowId === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rowId);

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
          "mx-auto w-full max-w-7xl space-y-5",
          viewMode === "applicant" ? "px-4 sm:px-6 py-5" : "py-2"
        )}
      >
        <ProfileHeader
          applicant={applicant}
          viewMode={viewMode}
          profileCompletion={completionPercentage}
          onEdit={() => {
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
        />

        <div className="mt-6 grid lg:grid-cols-12 gap-5">
          <div className="lg:col-span-2 hidden lg:block">
            <ProfileSidebar 
              activeSection={activeSection} 
              onSectionClick={scrollToSection}
            />
          </div>

          <div className="lg:col-span-7 space-y-5">
            {/* Resume Section */}
            <div id="resume" data-section>
              <ProfileSection
                id="resume-section"
                title="Resume & Headline"
                icon={<FileText className="h-4 w-4" />}
                canEdit={canEdit}
                badge="Important"
              >
                <ResumeSection
                  applicant={applicant}
                  viewMode={viewMode}
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
                    setApplicantData({ ...applicantData, resume_file: url, upload_cv_any_format: url, updated_at: new Date().toISOString() });
                    if (profileData && applicantData.user_id) {
                      setProfileData({ ...profileData, resume_file: url });
                    }
                    toast.success("Resume linked to profile");
                    setProfileReloadNonce((n) => n + 1);
                  }}
                  onResumeRemoved={() => {
                    setApplicantData({
                      ...applicantData,
                      resume_file: null,
                      upload_cv_any_format: null,
                      updated_at: new Date().toISOString(),
                    });
                    if (profileData) {
                      setProfileData({ ...profileData, resume_file: null });
                    }
                    setProfileReloadNonce((n) => n + 1);
                  }}
                />
              </ProfileSection>
            </div>

            {/* Key Skills Section */}
            <div id="skills" data-section>
              <ProfileSection
                id="skills-section"
                title="Key Skills"
                icon={<Code2 className="h-4 w-4" />}
                canEdit={canEdit}
                badge="250 chars"
              >
                <SkillsSection
                  skills={applicant.skills}
                  viewMode={viewMode}
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

            {/* Employment Section */}
            <div id="experience" data-section>
              <ProfileSection
                id="experience-section"
                title="Employment"
                icon={<Briefcase className="h-4 w-4" />}
                canAdd={canEdit}
                isEmpty={experiences.length === 0}
                emptyMessage="No employment history added yet"
              >
                <ExperienceSection
                  experiences={experiences}
                  viewMode={viewMode}
                  onEdit={(expId) => toast.info(`Edit experience ${expId}`)}
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

            {/* Education Section */}
            <div id="education" data-section>
              <ProfileSection
                id="education-section"
                title="Education"
                icon={<GraduationCap className="h-4 w-4" />}
                canAdd={canEdit}
                isEmpty={mappedEducationData.length === 0}
                emptyMessage="No education added yet"
              >
                <EducationSection
                  education={mappedEducationData}
                  viewMode={viewMode}
                  onEdit={(eduId) => toast.info(`Edit education ${eduId}`)}
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

            {/* IT Skills Section */}
            <div id="itskills" data-section>
              <ProfileSection
                id="itskills-section"
                title="IT Skills"
                icon={<Settings className="h-4 w-4" />}
                canAdd={canEdit}
              >
                <ITSkillsSection
                  skills={itSkills}
                  viewMode={viewMode}
                  onEdit={(skillId) => toast.info(`Edit IT skill ${skillId}`)}
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

            {/* Projects Section */}
            <div id="projects" data-section>
              <ProfileSection
                id="projects-section"
                title="Projects"
                icon={<FolderKanban className="h-4 w-4" />}
                canAdd={canEdit}
              >
                <ProjectsSection
                  projects={projects}
                  viewMode={viewMode}
                  onEdit={(id) => toast.info(`Edit project ${id}`)}
                  onDelete={(id) => toast.error(`Delete project ${id}`)}
                />
              </ProfileSection>
            </div>

            {/* Profile Summary Section */}
            <div id="summary" data-section>
              <ProfileSection
                id="summary-section"
                title="Profile Summary"
                icon={<UserCircle className="h-4 w-4" />}
                canEdit={canEdit}
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
                          const { success, error } = await updateProfileSummary(applicantData.user_id, profileSummary);
                          setSavingSummary(false);
                          if (success) {
                            toast.success("Profile summary saved.");
                            if (profileData) setProfileData({ ...profileData, summary: profileSummary });
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

            {/* Online Profiles Section */}
            <div id="links" data-section>
              <ProfileSection
                id="links-section"
                title="Online Profiles"
                icon={<Globe className="h-4 w-4" />}
                canEdit={canEdit}
              >
                <OnlineProfilesSection
                  profiles={onlineProfiles}
                  viewMode={viewMode}
                  onSave={async (profiles) => {
                    const patch = {
                      linkedin_url: profiles.linkedin?.trim() || null,
                      github_url: profiles.github?.trim() || null,
                      portfolio_url: profiles.portfolio?.trim() || null,
                      updated_at: new Date().toISOString(),
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

            {/* Accomplishments Section */}
            <div id="accomplishments" data-section>
              <ProfileSection
                id="accomplishments-section"
                title="Accomplishments"
                icon={<Award className="h-4 w-4" />}
                canAdd={canEdit}
              >
                <AccomplishmentsSection
                  accomplishments={accomplishments}
                  viewMode={viewMode}
                  onEdit={(id) => toast.info(`Edit accomplishment ${id}`)}
                  onDelete={(id) => toast.error(`Delete accomplishment ${id}`)}
                />
              </ProfileSection>
            </div>

            {/* Career Profile Section */}
            <div id="career" data-section>
              <ProfileSection
                id="career-section"
                title="Career Profile"
                icon={<Target className="h-4 w-4" />}
                canEdit={canEdit}
                badge="Matching"
              >
                <CareerProfileSection
                  career={careerProfile}
                  viewMode={viewMode}
                />
              </ProfileSection>
            </div>

            {/* Personal Details Section */}
            <div id="personal" data-section>
              <ProfileSection
                id="personal-section"
                title="Personal Details"
                icon={<User className="h-4 w-4" />}
                canEdit={canEdit}
              >
                <PersonalDetailsSection
                  details={personalDetails}
                  viewMode={viewMode}
                />
              </ProfileSection>
            </div>

            {/* Analytics Section */}
            <div id="analytics" data-section>
              <ProfileSection
                id="analytics-section"
                title="Profile Analytics"
                icon={<Activity className="h-4 w-4" />}
                defaultExpanded={viewMode === 'applicant'}
              >
                <ProfileAnalytics viewMode={viewMode} />
              </ProfileSection>
            </div>
          </div>

          {/* Right Sidebar - Profile Completion */}
          <div className="lg:col-span-3">
            {viewMode === 'applicant' && (
              <ProfileCompletion
                percentage={completionPercentage}
                items={completionItems}
                onItemClick={scrollToSection}
              />
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
                    {applicantData.updated_at && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="font-medium text-xs">{new Date(applicantData.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
                </div>

                {viewMode === 'admin' && (
                  <div className="bg-card rounded-xl border p-4 space-y-3">
                    <h3 className="text-sm font-semibold">Admin Notes</h3>
                    <Textarea
                      placeholder="Add a note about this candidate..."
                      rows={3}
                      className="text-sm"
                    />
                    <Button size="sm" className="w-full h-8 text-xs">Add Note</Button>
                    <p className="text-[11px] text-muted-foreground text-center">No notes yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  if (viewMode === "applicant") {
    return (
      <div className="min-h-0 w-full bg-[var(--surface-2)]">{profileChrome}</div>
    );
  }

  return (
    <DashboardPageShell className="space-y-1">{profileChrome}</DashboardPageShell>
  );
};

export default EnterpriseApplicantProfile;
