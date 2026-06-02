import type { LucideIcon } from "lucide-react";
import { BharatGoSectionHeader } from "./BharatGoSectionHeader";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  subtitle = "From applicant tracking to client collaboration, Ellure NexHire covers the full recruitment lifecycle.",
  variant = "default",
}: BharatGoFeatureGridProps) {
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

  if (embedded) return grid;

  return (
    <section className="bharatgo-section bg-muted/40 py-16 sm:py-20 lg:py-24">
      <div className="container px-4 sm:px-6">
        <BharatGoSectionHeader title={title} subtitle={subtitle} />
        {grid}
      </div>
    </section>
  );
}
