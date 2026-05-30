import {
  Cpu,
  Headphones,
  Landmark,
  Pill,
  Radio,
  ShoppingCart,
  HardHat,
  type LucideIcon,
} from "lucide-react";

export type MarketingIndustry = {
  id: string;
  icon: LucideIcon;
  title: string;
  shortDesc: string;
  fullDesc: string;
  roles: string[];
  /** Tailwind classes for icon badge background + icon color */
  accentBg: string;
  accentIcon: string;
};

export const marketingIndustries: MarketingIndustry[] = [
  {
    id: "it",
    icon: Cpu,
    title: "IT & Technology Services",
    shortDesc: "Technology and software development",
    fullDesc:
      "Comprehensive recruitment solutions for software developers, engineers, architects, DevOps specialists, cloud experts, and IT leadership roles across all technology stacks.",
    roles: ["Software Developer", "Full Stack Engineer", "DevOps Engineer", "Cloud Architect", "IT Manager"],
    accentBg: "bg-blue-500/15 ring-blue-500/20",
    accentIcon: "text-blue-600",
  },
  {
    id: "ites",
    icon: Headphones,
    title: "ITES & Shared Services",
    shortDesc: "IT-enabled services and BPO",
    fullDesc:
      "Specialized hiring for customer support, technical support, data entry, back office operations, and process management roles in the ITES sector.",
    roles: ["Customer Support", "Technical Support", "Data Entry Operator", "Process Associate", "Team Leader"],
    accentBg: "bg-violet-500/15 ring-violet-500/20",
    accentIcon: "text-violet-600",
  },
  {
    id: "bfsi",
    icon: Landmark,
    title: "BFSI",
    shortDesc: "Banking, financial services, and insurance",
    fullDesc:
      "Strategic hiring for banking operations, financial analysis, insurance sales, risk management, and compliance roles in the BFSI sector.",
    roles: ["Relationship Manager", "Financial Analyst", "Insurance Advisor", "Risk Manager", "Compliance Officer"],
    accentBg: "bg-emerald-500/15 ring-emerald-500/20",
    accentIcon: "text-emerald-600",
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "E-commerce & Digital Businesses",
    shortDesc: "Online retail and digital marketplaces",
    fullDesc:
      "Talent acquisition for e-commerce operations, logistics, digital marketing, customer service, and management roles in the rapidly growing online retail sector.",
    roles: ["E-commerce Manager", "Logistics Coordinator", "Digital Marketing", "Customer Service", "Operations Head"],
    accentBg: "bg-orange-500/15 ring-orange-500/20",
    accentIcon: "text-orange-600",
  },
  {
    id: "pharma",
    icon: Pill,
    title: "Pharmaceuticals & Life Sciences",
    shortDesc: "Healthcare and pharmaceutical industry",
    fullDesc:
      "Specialized hiring for pharmaceutical sales, medical representatives, quality control, R&D, and regulatory affairs professionals.",
    roles: ["Medical Representative", "Pharma Sales", "Quality Control", "R&D Scientist", "Regulatory Affairs"],
    accentBg: "bg-rose-500/15 ring-rose-500/20",
    accentIcon: "text-rose-600",
  },
  {
    id: "manufacturing",
    icon: HardHat,
    title: "Manufacturing & Engineering",
    shortDesc: "Infrastructure and engineering",
    fullDesc:
      "Recruitment for engineers, project managers, quality control, production managers, and technical professionals in manufacturing and engineering sectors.",
    roles: ["Production Engineer", "Quality Engineer", "Project Manager", "Maintenance Engineer", "Process Engineer"],
    accentBg: "bg-amber-500/15 ring-amber-500/20",
    accentIcon: "text-amber-700",
  },
  {
    id: "telecom",
    icon: Radio,
    title: "Telecom & Infrastructure",
    shortDesc: "Telecommunications and networking",
    fullDesc:
      "Expert recruitment for telecom engineers, network specialists, RF engineers, sales executives, and technical support roles in the telecommunications industry.",
    roles: ["Network Engineer", "RF Engineer", "Telecom Sales", "Technical Support", "Infrastructure Manager"],
    accentBg: "bg-cyan-500/15 ring-cyan-500/20",
    accentIcon: "text-cyan-600",
  },
];
