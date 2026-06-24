import type { NavMegaItem } from "@/lib/marketingNavData";
import { INDUSTRY_NAV_ITEMS, SERVICE_NAV_ITEMS } from "@/lib/marketingNavData";

export type MegaMenuConfig = {
  id: "services" | "industries";
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  viewAllHref: string;
  viewAllLabel: string;
  featured: {
    imageSrc: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    tone: "peach" | "sky";
  };
  columns: {
    heading: string;
    items: NavMegaItem[];
  }[];
};

export const servicesMegaMenu: MegaMenuConfig = {
  id: "services",
  label: "Services",
  eyebrow: "For employers",
  title: "Hiring services",
  description: "Structured coordination, screening, and ethical process support — powered by Ellure TalentHub.",
  viewAllHref: "/services",
  viewAllLabel: "Explore all services",
  featured: {
    imageSrc: "/b1.png",
    title: "End-to-end recruitment support",
    description: "From role alignment to shortlist delivery — without replacing your HR team.",
    ctaLabel: "View services",
    ctaHref: "/services",
    tone: "peach",
  },
  columns: [
    {
      heading: "Core services",
      items: SERVICE_NAV_ITEMS.slice(0, 3),
    },
    {
      heading: "More",
      items: SERVICE_NAV_ITEMS.slice(3),
    },
  ],
};

export const industriesMegaMenu: MegaMenuConfig = {
  id: "industries",
  label: "Industries",
  eyebrow: "Sectors we serve",
  title: "Industry expertise",
  description: "Role-aware screening and talent networks across IT, BFSI, pharma, telecom, and more.",
  viewAllHref: "/industries",
  viewAllLabel: "Explore all industries",
  featured: {
    imageSrc: "/b2.png",
    title: "Hiring across sectors",
    description: "Specialised recruitment for roles that matter in your industry.",
    ctaLabel: "View industries",
    ctaHref: "/industries",
    tone: "sky",
  },
  columns: [
    {
      heading: "Popular sectors",
      items: INDUSTRY_NAV_ITEMS.slice(0, 4),
    },
    {
      heading: "More industries",
      items: INDUSTRY_NAV_ITEMS.slice(4),
    },
  ],
};
