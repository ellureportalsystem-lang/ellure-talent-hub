import { AnimatedStatValue } from "@/components/marketing/AnimatedStatValue";
import { defaultTrustedStats, type StatItem } from "@/components/marketing/StatsStrip";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type MarketingTrustStatsProps = {
  stats?: StatItem[];
  className?: string;
};

/**
 * Trust metrics — placed mid-page (not under hero). Compact pastel band.
 */
export function MarketingTrustStats({ stats = defaultTrustedStats, className }: MarketingTrustStatsProps) {
  const { ref, inView } = useInViewOnce<HTMLElement>(0.15);

  return (
    <section
      ref={ref}
      className={cn("border-y border-[#d4e2fc] bg-[#E9F0FF] py-12 sm:py-14", className)}
      aria-label="Company highlights"
    >
      <div className="container px-4 sm:px-6">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-primary">Trusted nationwide</p>
        <h2 className="font-poppins mt-2 text-center text-2xl font-bold text-foreground sm:text-3xl">
          Proven recruitment outcomes
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="flex flex-col items-center rounded-2xl border border-[#d4e2fc] bg-white px-4 py-5 text-center shadow-sm"
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="font-poppins text-2xl font-bold text-primary sm:text-3xl">
                  <AnimatedStatValue value={stat.value} active={inView} />
                </p>
                <p className="mt-1 text-xs font-medium leading-snug text-muted-foreground sm:text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
