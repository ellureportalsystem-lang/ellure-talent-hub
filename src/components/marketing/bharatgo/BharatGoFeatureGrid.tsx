import type { LucideIcon } from "lucide-react";
import { BharatGoSectionHeader } from "./BharatGoSectionHeader";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export type BharatGoFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type PastelTone = "peach" | "sky" | "mint" | "lavender";

const pastelCardClass: Record<PastelTone, string> = {
  peach: "bharatgo-feature-card-pastel-peach",
  sky: "bharatgo-feature-card-pastel-sky",
  mint: "bharatgo-feature-card-pastel-mint",
  lavender: "bharatgo-feature-card-pastel-lavender",
};

const pastelTones: PastelTone[] = ["peach", "sky", "mint", "lavender", "peach", "sky"];

type BharatGoFeatureGridProps = {
  features: BharatGoFeature[];
  /** When true, renders only the card grid (for use inside MarketingSaasSection) */
  embedded?: boolean;
  title?: string;
  subtitle?: string;
  /** Soft pastel card backgrounds (Capture.PNG style) */
  variant?: "default" | "pastel";
};

export function BharatGoFeatureGrid({
  features,
  embedded = false,
  title = "Everything you need to hire smarter",
  subtitle = "From applicant tracking to client collaboration, Ellure TalentHub covers the full recruitment lifecycle.",
  variant = "default",
}: BharatGoFeatureGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const mobileCards = (
    <div
      className={cn(
        "sm:hidden",
        embedded ? "" : "mt-8",
        "grid grid-cols-2 gap-3"
      )}
    >
      {features.map((feature, index) => {
        const Icon = feature.icon;
        const isOpen = openIndex === index;
        return (
          <button
            key={feature.title}
            type="button"
            onClick={() => setOpenIndex((v) => (v === index ? null : index))}
            className={cn(
              "bharatgo-feature-card group w-full rounded-2xl border p-3 text-left shadow-sm transition-all active:scale-[0.99]",
              variant === "pastel"
                ? pastelCardClass[pastelTones[index % pastelTones.length]]
                : "border-border/80 bg-card"
            )}
            aria-expanded={isOpen}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold leading-snug text-foreground">
                    {feature.title}
                  </span>
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
                aria-hidden
              />
            </div>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );

  const grid = (
    <div
      className={
        embedded
          ? "grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
          : "mt-12 grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: Math.min(index * 0.06, 0.24) }}
                className={cn(
                  "bharatgo-feature-card group rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-md sm:p-6",
                  variant === "pastel"
                    ? pastelCardClass[pastelTones[index % pastelTones.length]]
                    : "border-border/80 bg-card"
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 font-poppins text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </motion.article>
            );
          })}
    </div>
  );

  if (embedded) {
    return (
      <>
        {mobileCards}
        <div className="hidden sm:block">{grid}</div>
      </>
    );
  }

  return (
    <section className="bharatgo-section bg-muted/40 py-16 sm:py-20 lg:py-24">
      <div className="container px-4 sm:px-6">
        <BharatGoSectionHeader title={title} subtitle={subtitle} />
        {mobileCards}
        <div className="hidden sm:block">{grid}</div>
      </div>
    </section>
  );
}
