import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle,
  Code,
  DollarSign,
  FileText,
  HardHat,
  Headphones,
  Pill,
  Shield,
  ShoppingCart,
  Users,
} from "lucide-react";

export type NavMegaItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export const SERVICE_NAV_ITEMS: NavMegaItem[] = [
  {
    icon: FileText,
    title: "Resume Intake & Validation",
    description: "Structured submission and profile readiness",
    href: "/services",
  },
  {
    icon: CheckCircle,
    title: "Profile Relevance Screening",
    description: "Skills, experience, and role-fit screening",
    href: "/services",
  },
  {
    icon: BarChart3,
    title: "Skill & Role Mapping",
    description: "Map candidates to role requirements",
    href: "/services",
  },
  {
    icon: Users,
    title: "Candidate–Client Coordination",
    description: "Interviews, feedback, offers, joiner follow-ups",
    href: "/services",
  },
  {
    icon: Briefcase,
    title: "Hiring Process Support",
    description: "Operational support across hiring stages",
    href: "/services",
  },
  {
    icon: Shield,
    title: "Ethical Hiring Enablement",
    description: "Transparency and accountability",
    href: "/services",
  },
];

export const INDUSTRY_NAV_ITEMS: NavMegaItem[] = [
  {
    icon: Code,
    title: "IT & Technology",
    description: "Software, cloud, DevOps, IT leadership",
    href: "/industries",
  },
  {
    icon: Headphones,
    title: "ITES & Shared Services",
    description: "Support, BPO, back office operations",
    href: "/industries",
  },
  {
    icon: DollarSign,
    title: "BFSI",
    description: "Banking, finance, insurance, compliance",
    href: "/industries",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce & Digital",
    description: "Online retail and digital operations",
    href: "/industries",
  },
  {
    icon: Pill,
    title: "Pharma & Life Sciences",
    description: "Sales, QC, R&D, regulatory affairs",
    href: "/industries",
  },
  {
    icon: HardHat,
    title: "Manufacturing & Engineering",
    description: "Production, QC, project management",
    href: "/industries",
  },
  {
    icon: Building2,
    title: "Telecom & Infrastructure",
    description: "Network, RF, sales, technical support",
    href: "/industries",
  },
];

/** Top-level links shown in the navbar (keep short — showcase & contact live in footer / features) */
export const NAVBAR_PRIMARY_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
] as const;

export const PRIMARY_NAV_LINKS = [
  { href: "/", label: "Home" },
  ...NAVBAR_PRIMARY_LINKS,
  { href: "/showcase", label: "Showcase" },
  { href: "/contact", label: "Contact" },
] as const;
