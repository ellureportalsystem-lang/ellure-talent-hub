/** 3D claymorphism marketing PNGs in `public/` */
export const marketingCartoonAssets = {
  recruiter: "/cartoon-recruiter-tools.png",
  candidates: "/cartoon-candidate-profiles.png",
  team: "/cartoon-team-office.png",
  analytics: "/cartoon-hiring-analytics.png",
  services: "/cartoon-services-coordination.png",
  industries: "/cartoon-industries-sectors.png",
  features: "/cartoon-platform-features.png",
} as const;

export type MarketingCartoonVariant = keyof typeof marketingCartoonAssets;

export const marketingCartoonAlt: Record<MarketingCartoonVariant, string> = {
  recruiter: "Recruiter using hiring platform tools",
  candidates: "Candidates building profiles on NexHire",
  team: "Hiring team collaborating in the office",
  analytics: "Hiring analytics and pipeline insights",
  services: "Recruitment services coordination",
  industries: "Multi-industry hiring expertise",
  features: "AI-powered resume search and platform features",
};
