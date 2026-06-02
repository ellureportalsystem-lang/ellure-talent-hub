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
      className={cn("border-y border-[#d4e2fc] bg-[#E9F0FF] py-10 sm:py-12", className)}
      aria-label="Company highlights"
    >
      <div className="container px-4 sm:px-6">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-primary">Trusted nationwide</p>
        <h2 className="font-poppins mt-2 text-center text-2xl font-bold text-foreground sm:text-3xl">
          Proven recruitment outcomes
        </h2>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="flex flex-col items-center rounded-2xl border border-[#d4e2fc] bg-white px-3 py-3.5 text-center shadow-sm sm:px-4 sm:py-4"
              >
                <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary sm:mb-2 sm:h-10 sm:w-10">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
                </div>
                <p className="font-poppins text-xl font-bold text-primary sm:text-2xl lg:text-3xl">
                  <AnimatedStatValue value={stat.value} active={inView} />
                </p>
                <p className="mt-0.5 text-[11px] font-medium leading-snug text-muted-foreground sm:mt-1 sm:text-xs">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
