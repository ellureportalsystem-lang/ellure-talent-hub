import fs from "fs";

const d = "div";
const m = "motion.div";
const cd = `</${d}>`;
const cm = `</${m}>`;

const content = `import { Card } from "@/components/ui/card";
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

type StatsStripProps = {
  stats?: StatItem[];
  className?: string;
};

const StatsStrip = ({ stats = defaultTrustedStats, className = "" }: StatsStripProps) => (
  <FadeInSection className={\`bg-background border-b relative py-8 md:py-10 \${className}\`}>
    <${d} className="absolute inset-0 bg-gradient-to-b from-muted/20 to-transparent pointer-events-none" />
    <${d} className="container relative px-4 sm:px-6">
      <${d} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <${m}
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
            >
              <Card className="marketing-card-lift p-4 sm:p-5 md:p-6 text-center border-2 border-border shadow-md group relative overflow-hidden h-full">
                <${d} className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-secondary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <${d} className="relative z-10 flex flex-col items-center gap-2 sm:gap-3">
                  <${d} className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-secondary/10 flex items-center justify-center icon-brand-green transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                  ${cd}
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary tabular-nums">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-snug px-1 text-center">
                    {stat.label}
                  </p>
                ${cd}
              </Card>
            ${cm}
          );
        })}
      ${cd}
    ${cd}
  </FadeInSection>
);

export default StatsStrip;
`;

fs.writeFileSync("src/components/marketing/StatsStrip.tsx", content);
console.log("StatsStrip written");
