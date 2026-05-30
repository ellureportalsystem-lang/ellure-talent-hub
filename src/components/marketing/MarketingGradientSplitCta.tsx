import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export type SplitCtaSide = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaVariant?: "secondary" | "default" | "outline";
};

export type MarketingGradientSplitCtaProps = {
  headline?: ReactNode;
  subtitle?: ReactNode;
  applicant?: Partial<SplitCtaSide>;
  employer?: Partial<SplitCtaSide>;
  className?: string;
};

const defaultApplicant: SplitCtaSide = {
  eyebrow: "For candidates",
  title: "Looking for a job?",
  description:
    "Create your profile, get discovered by employers, and track your applications in one place.",
  ctaLabel: "Register as applicant",
  ctaHref: "/auth/register",
  ctaVariant: "secondary",
};

const defaultEmployer: SplitCtaSide = {
  eyebrow: "For employers",
  title: "Looking for talent?",
  description:
    "Partner with Ellure for structured screening, ethical hiring, and faster shortlists across industries.",
  ctaLabel: "Hire talent",
  ctaHref: "/contact",
  ctaVariant: "default",
};

function CtaSidePanel({
  side,
  icon: Icon,
  align,
}: {
  side: SplitCtaSide;
  icon: typeof UserRound;
  align: "left" | "right";
}) {
  const isOutline = side.ctaVariant === "outline";

  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12",
        align === "right" && "lg:border-l lg:border-white/10"
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-white/60">{side.eyebrow}</p>
      <div className="mt-4 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
          <Icon className="h-6 w-6 text-white" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 space-y-2">
          <h3 className="font-poppins text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {side.title}
          </h3>
          <p className="text-sm leading-relaxed text-white/80 sm:text-base">{side.description}</p>
        </div>
      </div>
      <Button
        size="lg"
        variant={isOutline ? "outline" : side.ctaVariant === "secondary" ? "secondary" : "default"}
        className={cn(
          "mt-6 h-12 min-h-[48px] w-full btn-hover active:scale-[0.98] sm:w-auto",
          isOutline && "border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white",
          side.ctaVariant === "default" && "bg-white text-primary hover:bg-white/90"
        )}
        asChild
      >
        <Link to={side.ctaHref}>
          {side.ctaLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

export function MarketingGradientSplitCta({
  headline,
  subtitle,
  applicant: applicantOverrides,
  employer: employerOverrides,
  className,
}: MarketingGradientSplitCtaProps) {
  const applicant = { ...defaultApplicant, ...applicantOverrides };
  const employer = { ...defaultEmployer, ...employerOverrides };

  return (
    <motion.div
      className={cn(
        "marketing-gradient-split-cta relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl",
        className
      )}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <div className="marketing-gradient-split-cta__mesh pointer-events-none absolute inset-0" aria-hidden />
      <div className="marketing-gradient-split-cta__noise pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden />

      {(headline || subtitle) && (
        <div className="relative z-10 border-b border-white/10 px-6 py-8 text-center sm:px-10 md:py-10">
          {headline && (
            <h2 className="font-poppins text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
              {headline}
            </h2>
          )}
          {subtitle && (
            <p className="mx-auto mt-3 max-w-2xl text-base text-white/85 sm:text-lg">{subtitle}</p>
          )}
        </div>
      )}

      <div className="relative z-10 flex flex-col lg:flex-row">
        <CtaSidePanel side={applicant} icon={UserRound} align="left" />
        <CtaSidePanel side={employer} icon={Briefcase} align="right" />
      </div>
    </motion.div>
  );
}
