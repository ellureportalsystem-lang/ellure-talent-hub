import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/ui/glass-panel";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export type HeroCandidateProfile = {
  id: string;
  initials: string;
  avatarClass: string;
  name: string;
  role: string;
  subtitle: string;
  applicantNo: string;
  email: string;
  match: number;
  location: string;
  experience: string;
  notice: string;
  education: string;
  skills: string[];
  applications: number;
  shortlisted: number;
  interviews: number;
  status: string;
  statusVariant: "default" | "secondary" | "outline";
  profileComplete: number;
  pipeline: string;
  smartMatch: string;
  lastActive: string;
};

export const heroCandidateProfiles: HeroCandidateProfile[] = [
  {
    id: "ananya",
    initials: "AR",
    avatarClass: "bg-primary text-primary-foreground",
    name: "Ananya Rao",
    role: "Senior Data Analyst",
    subtitle: "FinTech · Product analytics",
    applicantNo: "APP-28471",
    email: "ananya.r***@email.com",
    match: 94,
    location: "Pune, MH",
    experience: "5.2 years",
    notice: "30 days",
    education: "B.Tech · Computer Science",
    skills: ["Python", "SQL", "Power BI", "ETL", "Excel"],
    applications: 12,
    shortlisted: 3,
    interviews: 1,
    status: "Interview scheduled",
    statusVariant: "secondary",
    profileComplete: 96,
    pipeline: "Screening → Interview",
    smartMatch: "Role fit: High",
    lastActive: "Active today",
  },
  {
    id: "rahul",
    initials: "RM",
    avatarClass: "bg-[#0d9488] text-white",
    name: "Rahul Mehta",
    role: "Full Stack Developer",
    subtitle: "SaaS · React & Node",
    applicantNo: "APP-31092",
    email: "rahul.m***@email.com",
    match: 91,
    location: "Bangalore, KA",
    experience: "4.5 years",
    notice: "Immediate",
    education: "B.E · Information Technology",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    applications: 8,
    shortlisted: 5,
    interviews: 2,
    status: "Shortlisted",
    statusVariant: "default",
    profileComplete: 100,
    pipeline: "Applied → Shortlist",
    smartMatch: "Stack match: 91%",
    lastActive: "2h ago",
  },
  {
    id: "priya",
    initials: "PK",
    avatarClass: "bg-[#0566CD] text-white",
    name: "Priya Kulkarni",
    role: "DevOps Engineer",
    subtitle: "Cloud · CI/CD",
    applicantNo: "APP-29834",
    email: "priya.k***@email.com",
    match: 88,
    location: "Hyderabad, TS",
    experience: "6+ years",
    notice: "60 days",
    education: "M.Tech · Systems",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform"],
    applications: 6,
    shortlisted: 2,
    interviews: 0,
    status: "Under review",
    statusVariant: "outline",
    profileComplete: 92,
    pipeline: "Sourced → Screening",
    smartMatch: "Cloud cert: Verified",
    lastActive: "Yesterday",
  },
  {
    id: "vikram",
    initials: "VS",
    avatarClass: "bg-[#ea580c] text-white",
    name: "Vikram Singh",
    role: "BFSI Relationship Manager",
    subtitle: "Banking · Retail lending",
    applicantNo: "APP-27655",
    email: "vikram.s***@email.com",
    match: 86,
    location: "Mumbai, MH",
    experience: "7 years",
    notice: "45 days",
    education: "MBA · Finance",
    skills: ["Sales", "CRM", "KYC", "Compliance"],
    applications: 15,
    shortlisted: 4,
    interviews: 1,
    status: "Offer stage",
    statusVariant: "secondary",
    profileComplete: 98,
    pipeline: "Interview → Offer",
    smartMatch: "Industry: BFSI",
    lastActive: "Active today",
  },
];

const ROTATE_MS = 5500;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

type HeroCandidatePreviewProps = {
  className?: string;
  variant?: "light" | "hero";
  profiles?: HeroCandidateProfile[];
};

type CandidateBodyProps = {
  candidate: HeroCandidateProfile;
  reducedMotion: boolean;
  isHero: boolean;
  statItems: { label: string; value: number }[];
};

const HERO_SKILL_LIMIT = 3;

function HeroCompactBody({ candidate }: { candidate: HeroCandidateProfile }) {
  const visibleSkills = candidate.skills.slice(0, HERO_SKILL_LIMIT);
  const extraSkills = candidate.skills.length - visibleSkills.length;

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="flex items-start gap-3.5 sm:gap-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-md ring-2 ring-white/30 sm:h-16 sm:w-16 sm:text-base",
            candidate.avatarClass
          )}
        >
          {candidate.initials}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-lg font-bold leading-tight tracking-tight text-white sm:text-xl">
            {candidate.name}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-sky-200 sm:text-base">{candidate.role}</p>
          <p className="mt-1 text-xs text-white/60 sm:text-sm">{candidate.subtitle}</p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs font-bold text-emerald-200 ring-1 ring-emerald-400/30 sm:px-3 sm:py-1.5 sm:text-sm">
          {candidate.match}%
        </span>
      </div>

      <div className="grid gap-1.5 rounded-xl bg-white/[0.08] px-3.5 py-3 text-xs leading-relaxed text-white/75 ring-1 ring-white/12 sm:gap-2 sm:px-4 sm:text-sm">
        <p>
          <span className="font-medium text-white/90">{candidate.location}</span>
          <span className="text-white/35"> · </span>
          {candidate.experience}
          <span className="text-white/35"> · </span>
          {candidate.notice} notice
        </p>
        <p className="text-white/65">{candidate.education}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {visibleSkills.map((skill) => (
          <span
            key={skill}
            className="rounded-md bg-white/12 px-2 py-0.5 text-[11px] font-medium text-white/90 ring-1 ring-white/18 sm:px-2.5 sm:py-1 sm:text-xs"
          >
            {skill}
          </span>
        ))}
        {extraSkills > 0 ? (
          <span className="rounded-md bg-white/8 px-2 py-0.5 text-[11px] font-medium text-white/55 ring-1 ring-white/10 sm:text-xs">
            +{extraSkills}
          </span>
        ) : null}
      </div>

      <div className="rounded-xl bg-white/[0.08] px-3.5 py-3 ring-1 ring-white/12 sm:px-4 sm:py-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45 sm:text-xs">
          Hiring insight
        </p>
        <p className="mt-1 text-sm font-semibold leading-snug text-sky-100 sm:text-base">
          {candidate.smartMatch}
        </p>
        <p className="mt-1.5 text-xs text-white/60 sm:text-sm">{candidate.pipeline}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/[0.08] px-3.5 py-2.5 ring-1 ring-white/12 sm:gap-3 sm:px-4 sm:py-3">
        <span className="text-xs text-white/55 sm:text-sm">
          {candidate.lastActive} · {candidate.notice} notice
        </span>
        <Badge
          variant={candidate.statusVariant}
          className="h-5 border-white/20 bg-white/10 px-2 text-[10px] font-medium text-white hover:bg-white/15 sm:h-6 sm:px-2.5 sm:text-xs"
        >
          {candidate.status}
        </Badge>
      </div>
    </div>
  );
}

function CandidateBody({ candidate, reducedMotion, isHero, statItems }: CandidateBodyProps) {
  if (isHero) {
    return <HeroCompactBody candidate={candidate} />;
  }

  return (
    <>
      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-md ring-2",
            candidate.avatarClass,
            isHero ? "ring-white/25" : "shadow-sm"
          )}
        >
          {candidate.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p
                className={cn(
                  "truncate text-[15px] font-semibold leading-tight sm:text-base",
                  isHero ? "text-white" : "text-foreground"
                )}
              >
                {candidate.name}
              </p>
              <p
                className={cn(
                  "truncate text-xs font-semibold",
                  isHero ? "text-sky-200" : "font-medium text-primary"
                )}
              >
                {candidate.role}
              </p>
              <p
                className={cn(
                  "truncate text-[11px]",
                  isHero ? "text-white/65" : "text-muted-foreground"
                )}
              >
                {candidate.subtitle}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  isHero
                    ? "bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-400/30"
                    : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                )}
              >
                {candidate.match}%
              </span>
              <Badge
                variant={candidate.statusVariant}
                className={cn(
                  "h-5 px-1.5 text-[10px] font-medium",
                  isHero && "border-white/25 bg-white/15 text-white hover:bg-white/20"
                )}
              >
                {candidate.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]",
          isHero ? "text-white/70" : "text-muted-foreground"
        )}
      >
        <span className="inline-flex items-center gap-1">
          <MapPin className={cn("h-3 w-3 shrink-0", isHero ? "text-sky-300" : "text-primary/70")} />
          {candidate.location}
        </span>
        <span className={isHero ? "text-white/25" : "text-border"}>·</span>
        <span className="inline-flex items-center gap-1">
          <Briefcase className={cn("h-3 w-3 shrink-0", isHero ? "text-sky-300" : "text-primary/70")} />
          {candidate.experience}
        </span>
        <span className={isHero ? "text-white/25" : "text-border"}>·</span>
        <span className="inline-flex items-center gap-1">
          <Clock className={cn("h-3 w-3 shrink-0", isHero ? "text-sky-300" : "text-primary/70")} />
          {candidate.notice}
        </span>
        <span className={isHero ? "text-white/25" : "text-border"}>·</span>
        <span className="inline-flex items-center gap-1 truncate">
          <GraduationCap
            className={cn("h-3 w-3 shrink-0", isHero ? "text-sky-300" : "text-primary/70")}
          />
          {candidate.education}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {candidate.skills.map((skill) => (
          <span
            key={skill}
            className={cn(
              "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
              isHero
                ? "bg-white/12 text-white/90 ring-1 ring-white/15"
                : "bg-muted/80 text-foreground/80"
            )}
          >
            {skill}
          </span>
        ))}
      </div>

      <div
        className={cn(
          "flex items-center gap-3 rounded-xl px-2.5 py-2.5",
          isHero ? "bg-white/10 ring-1 ring-white/20 backdrop-blur-sm" : "bg-muted/40"
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between text-[10px]">
            <span className={isHero ? "font-medium text-white/60" : "text-muted-foreground"}>
              Profile
            </span>
            <span className={cn("font-semibold", isHero ? "text-sky-200" : "text-primary")}>
              {candidate.profileComplete}%
            </span>
          </div>
          <div
            className={cn(
              "h-1.5 overflow-hidden rounded-full",
              isHero ? "bg-white/15" : "bg-background/80"
            )}
          >
            <motion.div
              key={`${candidate.id}-progress`}
              className={cn("h-full rounded-full", isHero ? "bg-sky-400" : "bg-primary")}
              initial={reducedMotion ? false : { width: 0 }}
              animate={{ width: `${candidate.profileComplete}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
        <div
          className={cn(
            "flex shrink-0 gap-2 border-l pl-2.5",
            isHero ? "border-white/15" : "border-border/60"
          )}
        >
          {statItems.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className={cn(
                  "text-sm font-bold leading-none",
                  isHero ? "text-white" : "text-foreground"
                )}
              >
                {stat.value}
              </p>
              <p
                className={cn(
                  "mt-0.5 text-[9px] font-medium",
                  isHero ? "text-white/55" : "text-muted-foreground"
                )}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span
          className={cn(
            "inline-flex items-center rounded-lg px-2 py-1 text-[10px] font-medium",
            isHero ? "bg-sky-500/25 text-sky-100 ring-1 ring-sky-400/25" : "bg-primary/5 text-primary"
          )}
        >
          {candidate.smartMatch}
        </span>
        <span
          className={cn(
            "truncate rounded-lg px-2 py-1 text-[10px]",
            isHero ? "bg-white/10 text-white/60" : "bg-muted/60 text-muted-foreground"
          )}
        >
          {candidate.lastActive} · {candidate.email}
        </span>
      </div>
    </>
  );
}

function ProfileDots({
  profiles,
  index,
  setIndex,
  isHero,
}: {
  profiles: HeroCandidateProfile[];
  index: number;
  setIndex: (i: number) => void;
  isHero: boolean;
}) {
  if (profiles.length <= 1) return null;

  return (
    <div
      className="flex items-center justify-center gap-1"
      role="tablist"
      aria-label="Preview candidates"
    >
      {profiles.map((p, i) => (
        <button
          key={p.id}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`Show ${p.name}`}
          onClick={() => setIndex(i)}
          className={cn(
            "h-1 rounded-full transition-all duration-300",
            i === index
              ? cn("w-6", isHero ? "bg-sky-300" : "bg-primary")
              : cn("w-1.5", isHero ? "bg-white/30 hover:bg-sky-300/70" : "bg-border hover:bg-primary/50")
          )}
        />
      ))}
    </div>
  );
}

export function HeroCandidatePreview({
  className,
  variant = "light",
  profiles = heroCandidateProfiles,
}: HeroCandidatePreviewProps) {
  const isHero = variant === "hero";
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const candidate = profiles[index % profiles.length];

  useEffect(() => {
    if (reducedMotion || profiles.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % profiles.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, profiles.length]);

  const statItems = [
    { label: "Apps", value: candidate.applications },
    { label: "Shortlist", value: candidate.shortlisted },
    { label: "Interviews", value: candidate.interviews },
  ];

  return (
    <motion.div
      className={cn(
        "relative mx-auto w-full",
        isHero ? "max-w-[21rem] sm:max-w-[23rem] lg:max-w-[26rem]" : "max-w-md lg:max-w-none",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {isHero ? (
          <GlassPanel variant="hero" cornerClassName="rounded-2xl" surfaceClassName="relative overflow-hidden">
            <div className="border-b border-white/10 px-4 py-3 sm:px-5 sm:py-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/55 sm:text-xs">
                Candidate profile
              </p>
              <p className="mt-0.5 text-[11px] text-white/45 sm:text-xs">Verified snapshot</p>
            </div>

            <div className="px-4 py-4 sm:px-5 sm:py-4.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={candidate.id}
                  initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                >
                  <CandidateBody
                    candidate={candidate}
                    reducedMotion={reducedMotion}
                    isHero
                    statItems={statItems}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="mt-4 border-t border-white/10 pt-3.5 sm:mt-4.5 sm:pt-4">
                <ProfileDots profiles={profiles} index={index} setIndex={setIndex} isHero />
              </div>
            </div>
          </GlassPanel>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card p-3.5 shadow-lg ring-1 ring-black/[0.04] sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-2 rounded-lg px-2 py-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Applicant
              </span>
              <span className="font-mono text-[10px] font-medium text-muted-foreground/80">
                {candidate.applicantNo}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={candidate.id}
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="space-y-2.5"
              >
                <CandidateBody
                  candidate={candidate}
                  reducedMotion={reducedMotion}
                  isHero={false}
                  statItems={statItems}
                />
              </motion.div>
            </AnimatePresence>

            <div className="mt-2.5">
              <ProfileDots profiles={profiles} index={index} setIndex={setIndex} isHero={false} />
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
