import { cn } from "@/lib/utils";
import {
  applicantSectionNavActive,
  applicantSectionNavIdle,
} from "@/components/dashboard/applicant/applicantProfileStyles";
import { 
  FileText, Code2, Briefcase, GraduationCap, FolderKanban, 
  User, Target, Globe, Award, Activity, UserCircle, Settings
} from "lucide-react";

interface ProfileSidebarProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  variant?: "default" | "applicant";
}

const sections = [
  { id: 'resume', label: 'Resume & Headline', icon: FileText },
  { id: 'skills', label: 'Key Skills', icon: Code2 },
  { id: 'experience', label: 'Employment', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'itskills', label: 'IT Skills', icon: Settings },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'summary', label: 'Profile Summary', icon: UserCircle },
  { id: 'links', label: 'Online Profiles', icon: Globe },
  { id: 'accomplishments', label: 'Accomplishments', icon: Award },
  { id: 'career', label: 'Career Profile', icon: Target },
  { id: 'personal', label: 'Personal Details', icon: User },
  { id: 'analytics', label: 'Profile Analytics', icon: Activity },
];

const ProfileSidebar = ({ activeSection, onSectionClick, variant = "default" }: ProfileSidebarProps) => {
  const isApplicant = variant === "applicant";

  return (
    <nav
      className={cn(
        "sticky top-24 space-y-1",
        isApplicant && "rounded-lg border border-[#e8e8e8] bg-white p-2 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      )}
    >
      <h3
        className={cn(
          "mb-3 px-3 text-sm font-semibold",
          isApplicant ? "text-[#666]" : "text-muted-foreground"
        )}
      >
        Profile Sections
      </h3>
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        
        return (
          <button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
              isActive
                ? isApplicant
                  ? applicantSectionNavActive
                  : "bg-primary text-primary-foreground font-medium"
                : isApplicant
                  ? applicantSectionNavIdle
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{section.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default ProfileSidebar;
