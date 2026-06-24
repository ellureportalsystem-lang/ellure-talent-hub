/** 3D clay illustrations for portal login pages (`public/`) */
export const authCartoonAssets = {
  candidate: "/auth-cartoon-candidate.png",
  recruiter: "/auth-cartoon-recruiter.png",
  admin: "/auth-cartoon-admin.png",
  hub: "/cartoon-platform-features.png",
} as const;

export type AuthCartoonVariant = keyof typeof authCartoonAssets;

export const authCartoonAlt: Record<AuthCartoonVariant, string> = {
  candidate: "Candidate building profile and applying to jobs on Ellure TalentHub",
  recruiter: "Recruiter searching talent with Resdex and NVite on Ellure TalentHub",
  admin: "Admin managing portal operations and analytics on Ellure TalentHub",
  hub: "Ellure TalentHub hiring platform features",
};
