import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type FeatureBentoItem = {
  icon: LucideIcon;
  title: string;
  shortDesc: string;
  fullDesc: string;
};

type FeatureBentoCardProps = {
  feature: FeatureBentoItem;
  size?: "default" | "tall" | "wide";
  className?: string;
};

export function FeatureBentoCard({ feature, size = "default", className }: FeatureBentoCardProps) {
  const Icon = feature.icon;

  return (
    <Card
      className={cn(
        "marketing-feature-bento-card group relative h-full overflow-hidden border-2 border-border bg-card p-5 shadow-md transition-all duration-300 sm:p-6",
        "hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10",
        size === "tall" && "md:p-7",
        size === "wide" && "md:flex md:flex-row md:items-center md:gap-8 md:p-7",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary via-primary/80 to-secondary transition-transform duration-300 group-hover:scale-x-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />

      <div className={cn("relative z-10", size === "wide" && "md:max-w-[55%]")}>
        <div
          className={cn(
            "mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/25 via-primary/10 to-secondary/30 shadow-inner ring-1 ring-primary/15 transition-transform duration-300 group-hover:scale-105",
            size === "tall" ? "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]" : "h-14 w-14"
          )}
        >
          <Icon
            className={cn(
              "text-primary",
              size === "tall" ? "h-8 w-8" : "h-7 w-7"
            )}
            strokeWidth={2}
          />
        </div>
        <h3
          className={cn(
            "font-semibold text-foreground",
            size === "tall" ? "text-xl md:text-2xl" : "text-lg"
          )}
        >
          {feature.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.shortDesc}</p>
        {size === "tall" && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground/90">{feature.fullDesc}</p>
        )}
      </div>

      {size === "wide" && (
        <div className="relative z-10 mt-4 flex-1 md:mt-0">
          <p className="text-sm leading-relaxed text-muted-foreground md:max-w-md">{feature.fullDesc}</p>
        </div>
      )}
    </Card>
  );
}
