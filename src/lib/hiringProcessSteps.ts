import type { LucideIcon } from "lucide-react";
import { CheckCircle2, ClipboardList, Filter, Users } from "lucide-react";

export type HiringProcessStep = {
  id: string;
  step: string;
  label: string;
  title: string;
  headline: string;
  description: string;
  previewSubtitle: string;
  successMessage: string;
  icon: LucideIcon;
};

export const hiringProcessSteps: HiringProcessStep[] = [
  {
    id: "understand",
    step: "01",
    label: "Understand",
    title: "Align role requirements & timelines",
    headline: "Step 1: Understand",
    description: "Role requirements, expectations, and timelines are aligned with your hiring team.",
    previewSubtitle: "Capture the role brief and success criteria",
    successMessage: "Role brief aligned with client",
    icon: ClipboardList,
  },
  {
    id: "source",
    step: "02",
    label: "Source",
    title: "Source relevant profiles",
    headline: "Step 2: Source",
    description: "Relevant profiles are sourced through structured intake and your talent network.",
    previewSubtitle: "Structured resume intake & validation",
    successMessage: "Profiles added to pipeline",
    icon: Users,
  },
  {
    id: "screen",
    step: "03",
    label: "Screen",
    title: "Screen for relevance & fit",
    headline: "Step 3: Screen",
    description: "Profiles are screened and mapped for skills, experience, and role fit.",
    previewSubtitle: "Skill mapping & relevance scoring",
    successMessage: "Shortlist candidates ready",
    icon: Filter,
  },
  {
    id: "deliver",
    step: "04",
    label: "Deliver",
    title: "Deliver shortlists & support",
    headline: "Step 4: Deliver",
    description: "Shortlists, coordination, and hiring support through the Ellure TalentHub platform.",
    previewSubtitle: "Client handoff & interview coordination",
    successMessage: "Hiring workflow delivered",
    icon: CheckCircle2,
  },
];
