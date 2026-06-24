import { cn } from "@/lib/utils";
import { applicantSectionNavActive, applicantSectionNavIdle } from "@/components/dashboard/applicant/applicantProfileStyles";

export type ProfileTabId = "essentials" | "professional" | "preferences" | "insights";

export const PROFILE_TABS: { id: ProfileTabId; label: string; sections: string[] }[] = [
  {
    id: "essentials",
    label: "Essentials",
    sections: ["resume", "skills", "experience", "education"],
  },
  {
    id: "professional",
    label: "Professional",
    sections: ["itskills", "projects", "summary", "links", "accomplishments"],
  },
  {
    id: "preferences",
    label: "Preferences",
    sections: ["career", "personal"],
  },
  {
    id: "insights",
    label: "Insights",
    sections: ["analytics"],
  },
];

type ProfileSectionTabsProps = {
  activeTab: ProfileTabId;
  onTabChange: (tab: ProfileTabId) => void;
  className?: string;
};

export function ProfileSectionTabs({ activeTab, onTabChange, className }: ProfileSectionTabsProps) {
  return (
    <div
      className={cn(
        "flex gap-1 overflow-x-auto rounded-lg border border-[#e8e8e8] bg-white p-1 shadow-[0_1px_4px_rgba(0,0,0,0.06)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      role="tablist"
    >
      {PROFILE_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "shrink-0 rounded-md px-3 py-2 text-xs font-medium transition-colors",
            activeTab === tab.id ? applicantSectionNavActive : applicantSectionNavIdle
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function sectionVisibleInTab(sectionId: string, activeTab: ProfileTabId): boolean {
  const tab = PROFILE_TABS.find((t) => t.id === activeTab);
  return tab?.sections.includes(sectionId) ?? true;
}

type ProfileMobileSectionNavProps = {
  activeSection: string;
  activeTab: ProfileTabId;
  onSectionClick: (sectionId: string) => void;
};

export function ProfileMobileSectionNav({
  activeSection,
  activeTab,
  onSectionClick,
}: ProfileMobileSectionNavProps) {
  const tab = PROFILE_TABS.find((t) => t.id === activeTab);
  const labels: Record<string, string> = {
    resume: "Resume",
    skills: "Skills",
    experience: "Work",
    education: "Education",
    itskills: "IT Skills",
    projects: "Projects",
    summary: "Summary",
    links: "Links",
    accomplishments: "Awards",
    career: "Career",
    personal: "Personal",
    analytics: "Analytics",
  };

  return (
    <div className="lg:hidden sticky top-[56px] z-20 -mx-4 px-4 py-2 bg-[#f4f5f7]/95 backdrop-blur-sm border-b border-[#e8e8e8]">
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {(tab?.sections ?? []).map((sectionId) => (
          <button
            key={sectionId}
            type="button"
            onClick={() => onSectionClick(sectionId)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              activeSection === sectionId ? applicantSectionNavActive : applicantSectionNavIdle
            )}
          >
            {labels[sectionId] ?? sectionId}
          </button>
        ))}
      </div>
    </div>
  );
}
