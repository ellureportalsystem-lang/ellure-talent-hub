import { Card } from "@/components/ui/card";
import { AnimatedStatValue } from "@/components/marketing/AnimatedStatValue";
import { TrustLogoMarquee } from "@/components/marketing/TrustLogoMarquee";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { motion } from "framer-motion";
import { Users, Building2, Clock, Star, type LucideIcon } from "lucide-react";
import { FadeInSection } from "./FadeInSection";

export type StatItem = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export const defaultTrustedStats: StatItem[] = [
  { value: "500+", label: "Successful Placements", icon: Users },
  { value: "50+", label: "Corporate Clients", icon: Building2 },
  { value: "8+", label: "Years Experience", icon: Clock },
  { value: "95%", label: "Client Satisfaction", icon: Star },
];

type StatCardProps = {
  stat: StatItem;
  index: number;
};

function StatCard({ stat, index }: StatCardProps) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.2);
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
    >
      <Card className="marketing-card-lift group relative h-full overflow-hidden border-2 border-border p-4 text-center shadow-md sm:p-5 md:p-6">
        <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:h-20 sm:w-20" />
        <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-3">
          <div className="icon-brand-green flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
          </div>
          <p className="text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
            <AnimatedStatValue value={stat.value} active={inView} />
          </p>
          <p className="px-1 text-center text-xs font-medium leading-snug text-muted-foreground sm:text-sm">
            {stat.label}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

type StatsStripProps = {
  stats?: StatItem[];
  className?: string;
  showMarquee?: boolean;
};

const StatsStrip = ({
  stats = defaultTrustedStats,
  className = "",
  showMarquee = true,
}: StatsStripProps) => (
  <>
    <FadeInSection className={`relative border-b bg-background py-8 md:py-10 ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-muted/10" />
      <div className="container relative px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </FadeInSection>
    {showMarquee ? <TrustLogoMarquee /> : null}
  </>
);

export default StatsStrip;
