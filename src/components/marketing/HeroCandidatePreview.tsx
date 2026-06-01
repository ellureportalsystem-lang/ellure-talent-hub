import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Sparkles,
  Star,
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
    avatarClass: "bg-[#7c3aed] text-white",
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

  const cardClass = cn(
    "overflow-hidden rounded-2xl bg-card p-3.5 shadow-lg ring-1 ring-black/[0.04] sm:p-4",
    isHero
      ? "border border-white/30 bg-white/95 shadow-primary/10 backdrop-blur-md"
      : "border border-border/80"
  );

  const statItems = [
    { label: "Apps", value: candidate.applications },
    { label: "Shortlist", value: candidate.shortlisted },
    { label: "Interviews", value: candidate.interviews },
  ];

  return (
    <motion.div
      className={cn("relative mx-auto w-full max-w-md lg:max-w-none", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className={cardClass}>
          {/* Top bar */}
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Applicant
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/80">{candidate.applicantNo}</span>
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
              {/* Identity row */}
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-sm",
                    candidate.avatarClass
                  )}
                >
                  {candidate.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold leading-tight text-foreground">
                        {candidate.name}
                      </p>
                      <p className="truncate text-xs font-medium text-primary">{candidate.role}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{candidate.subtitle}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        <Star className="h-3 w-3 fill-current" />
                        {candidate.match}%
                      </span>
                      <Badge
                        variant={candidate.statusVariant}
                        className="h-5 px-1.5 text-[10px] font-medium"
                      >
                        {candidate.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact meta line */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0 text-primary/70" />
                  {candidate.location}
                </span>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3 w-3 shrink-0 text-primary/70" />
                  {candidate.experience}
                </span>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3 shrink-0 text-primary/70" />
                  {candidate.notice}
                </span>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1 truncate">
                  <GraduationCap className="h-3 w-3 shrink-0 text-primary/70" />
                  {candidate.education}
                </span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1">
                {candidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-muted/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Progress + stats row */}
              <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-2.5 py-2">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Profile</span>
                    <span className="font-semibold text-primary">{candidate.profileComplete}%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-background/80">
                    <motion.div
                      key={`${candidate.id}-progress`}
                      className="h-full rounded-full bg-primary"
                      initial={reducedMotion ? false : { width: 0 }}
                      animate={{ width: `${candidate.profileComplete}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <div className="flex shrink-0 gap-2 border-l border-border/60 pl-2.5">
                  {statItems.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-sm font-bold leading-none text-foreground">{stat.value}</p>
                      <p className="mt-0.5 text-[9px] text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer insight chips */}
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-lg bg-primary/5 px-2 py-1 text-[10px] font-medium text-primary">
                  <Sparkles className="h-3 w-3" />
                  {candidate.smartMatch}
                </span>
                <span className="truncate rounded-lg bg-muted/60 px-2 py-1 text-[10px] text-muted-foreground">
                  {candidate.lastActive} · {candidate.email}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {profiles.length > 1 ? (
            <div
              className="mt-2.5 flex items-center justify-center gap-1"
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
                    i === index ? "w-5 bg-primary" : "w-1 bg-border hover:bg-primary/50"
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}
