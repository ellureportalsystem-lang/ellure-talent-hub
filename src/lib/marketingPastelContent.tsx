import type { PastelFeatureCard } from "@/components/marketing/bharatgo/BharatGoPastelFeatureCards";
import { MarketingCartoonArt } from "@/components/marketing/MarketingCartoonArt";

/** Homepage pastel cards — 50/50: cartoon PNG + product mockup */
export const landingPastelCards: PastelFeatureCard[] = [
  {
    tone: "peach",
    title: "Enhance hiring with powerful platform tools",
    description:
      "Resume search, bulk CV upload, skill mapping, and client collaboration — everything your recruitment team needs to move faster without losing quality.",
    ctaLabel: "Start for FREE",
    ctaHref: "/auth/register",
    illustration: <MarketingCartoonArt variant="recruiter" size="card" />,
  },
  {
    tone: "sky",
    title: "Structured workflows for every role",
    description:
      "Applicants, recruiters, and clients each get a clear workspace — profiles, shortlists, and analytics without spreadsheet chaos.",
    ctaLabel: "Explore features",
    ctaHref: "/features",
    productVisual: "client-workspace",
  },
];

export const servicesPastelCards: PastelFeatureCard[] = [
  {
    tone: "mint",
    title: "Structured screening & coordination",
    description:
      "We validate profiles, map skills to roles, and coordinate interviews — so your team focuses on decisions, not admin.",
    ctaLabel: "Talk to us",
    ctaHref: "/contact",
    productVisual: "resume-search",
  },
];

export const featuresPastelCards: PastelFeatureCard[] = [
  {
    tone: "peach",
    title: "AI-assisted resume search",
    description:
      "Find the right candidates in seconds with skill filters, match insights, and bulk tools built for recruitment teams.",
    ctaLabel: "Explore features",
    ctaHref: "/features",
    illustration: <MarketingCartoonArt variant="features" size="card" />,
  },
  {
    tone: "sky",
    title: "Dashboards your team will actually use",
    description:
      "Hiring analytics, pipeline visibility, and export-ready reports — without dashboard overload.",
    ctaLabel: "View showcase",
    ctaHref: "/showcase",
    productVisual: "analytics",
  },
];

export const aboutPastelCards: PastelFeatureCard[] = [
  {
    tone: "lavender",
    title: "10+ years of recruitment expertise",
    description:
      "Ellure Consulting Services brings industry knowledge; TalentHub brings the technology to scale ethical hiring.",
    ctaLabel: "About Ellure",
    ctaHref: "/about",
    illustration: <MarketingCartoonArt variant="team" size="card" />,
  },
];

export const industriesPastelCard: PastelFeatureCard = {
  tone: "sky",
  title: "Hiring expertise across sectors",
  description:
    "IT, BFSI, pharma, telecom, retail, and more — with role-aware screening and industry-specific talent pools.",
  ctaLabel: "Explore industries",
  ctaHref: "/industries",
  productVisual: "client-workspace",
};

export const contactPastelCard: PastelFeatureCard = {
  tone: "peach",
  title: "We're here to help you hire better",
  description:
    "Whether you're an employer scaling hiring or a candidate building your profile — reach out and we'll guide you.",
  ctaLabel: "Send a message",
  ctaHref: "#contact-form",
  illustration: <MarketingCartoonArt variant="recruiter" size="card" />,
};
