import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export type ServiceOffering = {
  icon: LucideIcon;
  title: string;
  shortDesc: string;
  fullDesc: string;
  accentBg?: string;
  accentIcon?: string;
};

const defaultAccents = [
  { accentBg: "bg-blue-500/12 ring-blue-500/15", accentIcon: "text-blue-600" },
  { accentBg: "bg-emerald-500/12 ring-emerald-500/15", accentIcon: "text-emerald-600" },
  { accentBg: "bg-violet-500/12 ring-violet-500/15", accentIcon: "text-violet-600" },
  { accentBg: "bg-cyan-500/12 ring-cyan-500/15", accentIcon: "text-cyan-600" },
  { accentBg: "bg-amber-500/12 ring-amber-500/15", accentIcon: "text-amber-700" },
  { accentBg: "bg-rose-500/12 ring-rose-500/15", accentIcon: "text-rose-600" },
];

type ServicesFeatureListProps = {
  services: ServiceOffering[];
  className?: string;
};

export function ServicesFeatureList({ services, className }: ServicesFeatureListProps) {
  return (
    <div className={cn("space-y-4 sm:space-y-5", className)}>
      {services.map((service, index) => {
        const Icon = service.icon;
        const accent = defaultAccents[index % defaultAccents.length];
        const accentBg = service.accentBg ?? accent.accentBg;
        const accentIcon = service.accentIcon ?? accent.accentIcon;

        return (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
          >
            <Card className="group border-2 border-border p-5 shadow-md transition-all duration-300 hover:border-primary/30 hover:shadow-lg sm:p-6 md:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6 md:gap-8">
                <div
                  className={cn(
                    "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-105 sm:h-[4.5rem] sm:w-[4.5rem]",
                    accentBg
                  )}
                >
                  <Icon className={cn("h-8 w-8 sm:h-9 sm:w-9", accentIcon)} strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <h3 className="font-poppins text-xl font-semibold tracking-tight sm:text-2xl">
                    {service.title}
                  </h3>
                  <p className="text-sm font-medium text-primary">{service.shortDesc}</p>
                  <p className="text-base leading-relaxed text-muted-foreground">{service.fullDesc}</p>
                  <Button asChild variant="link" className="h-auto px-0 text-primary">
                    <Link to="/contact">
                      Get started
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
