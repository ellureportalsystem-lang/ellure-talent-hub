import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { mockApplicants, Applicant } from "@/data/mockApplicants";

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
  // Use prop ID if provided, otherwise use URL param
  const id = propApplicantId || paramId;
  const { toast: toastHook } = useToast();
  const { user, profile: authProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('resume');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applicantData, setApplicantData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [educationData, setEducationData] = useState<any[]>([]);
  const [experienceData, setExperienceData] = useState<any[]>([]);
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [profileSummary, setProfileSummary] = useState('');

  // TEMPORARY: Demo mode - use mock data
  useEffect(() => {
    const fetchData = async () => {
      // TEMPORARY: Always use mock data for demo UI
      const mockApplicant = mockApplicants.find(a => a.id.toString() === id) || mockApplicants[0];
      
      // Convert mock applicant to database format
      const mockData = {
        id: mockApplicant.id.toString(),
        name: mockApplicant.name,
        email: mockApplicant.email,
        phone: mockApplicant.phone,
        city: mockApplicant.currentCity,
        skill: mockApplicant.primarySkill,
        job_role: mockApplicant.primarySkill,
        skill_job_role_applying_for: mockApplicant.primarySkill,
        total_experience: mockApplicant.experience.toString(),
        current_company: mockApplicant.currentCompany,
        current_designation: mockApplicant.designation,
        designation: mockApplicant.designation,
        current_ctc: mockApplicant.currentCTC,
        expected_ctc: mockApplicant.expectedCTC,
        exp_ctc: mockApplicant.expectedCTC,
        notice_period: mockApplicant.noticePeriod,
        highest_qualification: mockApplicant.education.highest,
        education_level: mockApplicant.education.highest,
        course_degree_name: mockApplicant.education.degree,
        course_degree: mockApplicant.education.degree,
        university_institute_name: mockApplicant.education.university,
        university: mockApplicant.education.university,
        year_of_passing: mockApplicant.education.yearOfPassing,
        passing_year: mockApplicant.education.yearOfPassing,
        percentage: mockApplicant.education.percentage.toString(),
        key_skills: mockApplicant.skills.join(','),
        status: mockApplicant.status,
        gender: mockApplicant.gender,
        age: mockApplicant.age,
        communication: mockApplicant.communicationSkill,
        profile_image: mockApplicant.profilePhoto || null,
        resume_file: mockApplicant.resumeUrl || null,
        created_at: mockApplicant.registeredDate,
        updated_at: mockApplicant.resumeUpdated,
        preferred_city: mockApplicant.preferredCity,
      };
      
      setApplicantData(mockData);
      
      // TEMPORARY: Create mock experience and education data
      const mockExperiences = [
    {
      id: 1,
          company_name: mockApplicant.currentCompany,
          designation: mockApplicant.designation,
          employment_type: "Full-time",
          city_id: mockApplicant.currentCity,
          start_date: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
          is_current: true,
          responsibilities: "Leading development teams, architecting solutions, and implementing best practices.",
          current_ctc: mockApplicant.currentCTC,
          notice_period: mockApplicant.noticePeriod
        }
      ];
      
      const mockEducation = [
    {
      id: 1,
          education_level: mockApplicant.education.highest,
          degree_id: mockApplicant.education.degree,
          course_id: mockApplicant.education.degree,
          institution_id: mockApplicant.education.university,
          passing_year: mockApplicant.education.yearOfPassing,
          percentage: mockApplicant.education.percentage,
          is_highest: true
        }
      ];
      
      const mockSkills = mockApplicant.skills.map((skill, idx) => ({
        id: idx + 1,
        skill_name: skill,
        skill_version: "Latest",
        years_of_experience: Math.min(mockApplicant.experience, 5),
        skill_level: 'Expert'
      }));
      
      setExperienceData(mockExperiences);
      setEducationData(mockEducation);
      setSkillsData(mockSkills);
      setLoading(false);
      
      // TEMPORARY: Skip database fetch, use mock data only
      // Original database fetch code removed for demo mode
    };

    fetchData();
  }, [id, navigate, toastHook, viewMode, authProfile, user]);

  // Update profile summary when applicant data is loaded
  useEffect(() => {
    if (applicantData) {
      const summary = applicantData.profile_summary || 
        `Highly motivated ${applicantData.current_designation || applicantData.designation || 'Professional'} with ${applicantData.total_experience || 0} years of experience. Passionate about building scalable solutions and working with cutting-edge technologies.`;
      setProfileSummary(summary);
    }
  }, [applicantData]);

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
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!applicantData) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Applicant not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Map database data to component format
  const applicant = {
    id: applicantData.id,
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
  };

  // Map experience data
  const experiences = experienceData.map((exp, index) => ({
    id: exp.id || index + 1,
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

  // Map education data
  const mappedEducationData = educationData.map((edu, index) => ({
    id: edu.id || index + 1,
    degree: edu.degree_id || edu.course_id || applicant.education.degree || "N/A",
    specialization: edu.course_id || "N/A",
    institution: edu.institution_id || applicant.education.university || "N/A",
    yearOfPassing: edu.passing_year || applicant.education.yearOfPassing || new Date().getFullYear(),
    gradingSystem: edu.percentage ? "Percentage" : "CGPA",
    marks: edu.percentage ? String(edu.percentage) : "N/A",
    type: (edu.education_level?.toLowerCase().includes('graduation') || edu.education_level?.toLowerCase().includes('degree')) ? 'graduation' as const : 'school' as const
  }));

  // Map IT skills from applicant_skills table
  const itSkills = skillsData.map((skill, index) => ({
    id: skill.id || index + 1,
    name: skill.skill_name || "N/A",
    version: skill.skill_version || "Latest",
    experience: skill.years_of_experience || Math.min(applicant.experience, 5),
    proficiency: (skill.skill_level || 'Intermediate') as 'Beginner' | 'Intermediate' | 'Expert'
  }));

  // Projects (can be extended later with projects table)
  const projects: any[] = [];

  // Career profile (using applicantData directly since applicant is defined later)
  const careerProfile = {
    currentIndustry: applicantData.current_industry || "IT Software",
    preferredIndustry: applicantData.preferred_industry || "IT Software, Product Companies",
    functionalArea: applicantData.functional_area || "Engineering / Software Development",
    preferredRole: applicantData.job_role || applicantData.current_designation || applicantData.designation || "Software Engineer",
    desiredJobType: applicantData.desired_job_type ? (typeof applicantData.desired_job_type === 'string' ? applicantData.desired_job_type.split(',') : applicantData.desired_job_type) : ["Full-time"],
    preferredLocations: applicantData.preferred_locations ? (typeof applicantData.preferred_locations === 'string' ? applicantData.preferred_locations.split(',') : applicantData.preferred_locations) : [applicantData.preferred_city || applicantData.city || "N/A", applicantData.city || "N/A"],
    expectedSalary: applicantData.expected_ctc || applicantData.exp_ctc || 0,
    openToRelocation: applicantData.open_to_relocation !== false
  };

  // Personal details (using applicantData directly since applicant is defined later)
  const personalDetails = {
    dateOfBirth: applicantData.date_of_birth || applicantData.dob || "N/A",
    gender: applicantData.gender || 'Other',
    maritalStatus: applicantData.marital_status || "N/A",
    languages: applicantData.languages ? (typeof applicantData.languages === 'string' ? applicantData.languages.split(',') : applicantData.languages) : ["English"],
    address: applicantData.address || applicantData.address_line1 || "N/A",
    homeTown: applicantData.city || applicantData.city_current_location || "N/A"
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
  
  const completionItems = [
    { id: '1', label: 'Resume uploaded', completed: !!(applicantData.resume_file || profileData?.resume_file), section: 'resume' },
    { id: '2', label: 'Resume headline added', completed: profileSummary.length > 50, section: 'resume' },
    { id: '3', label: 'Key skills added', completed: applicantSkills.length > 3, section: 'skills' },
    { id: '4', label: 'Employment details', completed: experienceData.length > 0, section: 'experience' },
    { id: '5', label: 'Education details', completed: educationData.length > 0, section: 'education' },
    { id: '6', label: 'IT skills added', completed: skillsData.length > 0, section: 'itskills' },
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

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => {
            if (viewMode === 'applicant') {
              navigate('/dashboard/applicant');
            } else if (viewMode === 'client') {
              navigate('/dashboard/client/candidates');
            } else {
              navigate('/dashboard/admin/applicants');
            }
          }} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to {viewMode === 'applicant' ? 'Dashboard' : viewMode === 'client' ? 'Candidates' : 'Applicants'}
          </Button>
          {viewMode === 'client' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-yellow-500/10 px-3 py-1.5 rounded-full">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Read-only Client View
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Profile Header */}
        <ProfileHeader
          applicant={applicant}
          viewMode={viewMode}
          profileCompletion={completionPercentage}
          onEdit={() => toast.info("Edit profile clicked")}
          onDelete={() => toast.error("Delete profile clicked")}
          onAddNote={() => toast.info("Add note clicked")}
          onAddToFolder={() => toast.info("Add to folder clicked")}
          onShortlist={() => toast.success("Added to shortlist")}
          onFavorite={() => setIsFavorite(!isFavorite)}
          isFavorite={isFavorite}
        />

        {/* Main Content Grid */}
        <div className="mt-8 grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-2 hidden lg:block">
            <ProfileSidebar 
              activeSection={activeSection} 
              onSectionClick={scrollToSection}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Resume Section */}
            <div id="resume" data-section>
              <ProfileSection
                id="resume-section"
                title="Resume & Headline"
                icon={<FileText className="h-5 w-5" />}
                canEdit={canEdit}
                badge="Important"
              >
                <ResumeSection
                  applicant={applicant}
                  viewMode={viewMode}
                  onUpdateHeadline={(headline) => toast.success("Headline updated")}
                />
              </ProfileSection>
            </div>

            {/* Key Skills Section */}
            <div id="skills" data-section>
              <ProfileSection
                id="skills-section"
                title="Key Skills"
                icon={<Code2 className="h-5 w-5" />}
                canEdit={canEdit}
                badge="250 chars"
              >
                <SkillsSection
                  skills={applicant.skills}
                  viewMode={viewMode}
                  onUpdateSkills={(skills) => toast.success("Skills updated")}
                />
              </ProfileSection>
            </div>

            {/* Employment Section */}
            <div id="experience" data-section>
              <ProfileSection
                id="experience-section"
                title="Employment"
                icon={<Briefcase className="h-5 w-5" />}
                canAdd={canEdit}
                isEmpty={experiences.length === 0}
                emptyMessage="No employment history added yet"
              >
                <ExperienceSection
                  experiences={experiences}
                  viewMode={viewMode}
                  onEdit={(id) => toast.info(`Edit experience ${id}`)}
                  onDelete={(id) => toast.error(`Delete experience ${id}`)}
                />
              </ProfileSection>
            </div>

            {/* Education Section */}
            <div id="education" data-section>
              <ProfileSection
                id="education-section"
                title="Education"
                icon={<GraduationCap className="h-5 w-5" />}
                canAdd={canEdit}
              >
                <EducationSection
                  education={mappedEducationData}
                  viewMode={viewMode}
                  onEdit={(id) => toast.info(`Edit education ${id}`)}
                  onDelete={(id) => toast.error(`Delete education ${id}`)}
                />
              </ProfileSection>
            </div>

            {/* IT Skills Section */}
            <div id="itskills" data-section>
              <ProfileSection
                id="itskills-section"
                title="IT Skills"
                icon={<Settings className="h-5 w-5" />}
                canAdd={canEdit}
              >
                <ITSkillsSection
                  skills={itSkills}
                  viewMode={viewMode}
                  onEdit={(id) => toast.info(`Edit IT skill ${id}`)}
                  onDelete={(id) => toast.error(`Delete IT skill ${id}`)}
                />
              </ProfileSection>
            </div>

            {/* Projects Section */}
            <div id="projects" data-section>
              <ProfileSection
                id="projects-section"
                title="Projects"
                icon={<FolderKanban className="h-5 w-5" />}
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
                icon={<UserCircle className="h-5 w-5" />}
                canEdit={canEdit}
              >
                {canEdit ? (
                  <Textarea
                    value={profileSummary}
                    onChange={(e) => setProfileSummary(e.target.value)}
                    rows={5}
                    placeholder="Write a brief summary about yourself..."
                    className="resize-none"
                  />
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {profileSummary}
                  </p>
                )}
              </ProfileSection>
            </div>

            {/* Online Profiles Section */}
            <div id="links" data-section>
              <ProfileSection
                id="links-section"
                title="Online Profiles"
                icon={<Globe className="h-5 w-5" />}
                canEdit={canEdit}
              >
                <OnlineProfilesSection
                  profiles={onlineProfiles}
                  viewMode={viewMode}
                />
              </ProfileSection>
            </div>

            {/* Accomplishments Section */}
            <div id="accomplishments" data-section>
              <ProfileSection
                id="accomplishments-section"
                title="Accomplishments"
                icon={<Award className="h-5 w-5" />}
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
                icon={<Target className="h-5 w-5" />}
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
                icon={<User className="h-5 w-5" />}
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
                icon={<Activity className="h-5 w-5" />}
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
                {/* Quick Stats Card */}
                <div className="bg-card rounded-xl border p-4 space-y-4">
                  <h3 className="font-semibold">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Profile Views</span>
                      <span className="font-medium">127</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Resume Downloads</span>
                      <span className="font-medium">34</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shortlisted</span>
                      <span className="font-medium">8 times</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Profile Score</span>
                      <span className="font-medium text-green-600">{completionPercentage}%</span>
                    </div>
                  </div>
                </div>

                {/* Admin Notes (Admin only) */}
                {viewMode === 'admin' && (
                  <div className="bg-card rounded-xl border p-4 space-y-4">
                    <h3 className="font-semibold">Admin Notes</h3>
                    <Textarea 
                      placeholder="Add a note about this candidate..."
                      rows={3}
                    />
                    <Button size="sm" className="w-full">Add Note</Button>
                    <div className="space-y-2 pt-2 border-t max-h-[200px] overflow-y-auto">
                      <div className="p-2 bg-muted/50 rounded text-sm">
                        <p>Strong technical skills, recommended for senior position</p>
                        <p className="text-xs text-muted-foreground mt-1">Admin • Jan 15</p>
                      </div>
                      <div className="p-2 bg-muted/50 rounded text-sm">
                        <p>Completed first round interview - excellent communication</p>
                        <p className="text-xs text-muted-foreground mt-1">HR Manager • Jan 18</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseApplicantProfile;
