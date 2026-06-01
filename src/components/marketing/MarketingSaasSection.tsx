import { BharatGoSectionHeader } from "@/components/marketing/bharatgo/BharatGoSectionHeader";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type MarketingSaasSectionProps = {
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted";
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
};

export function MarketingSaasSection({
  children,
  className,
  tone = "default",
  eyebrow,
  title,
  subtitle,
  align = "center",
}: MarketingSaasSectionProps) {
  return (
    <section
      className={cn(
        "bharatgo-section py-14 sm:py-16 lg:py-20",
        tone === "muted" && "bg-muted/40",
        className
      )}
    >
      <div className="container px-4 sm:px-6">
        {title ? (
          <BharatGoSectionHeader
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            align={align}
            className="mb-10"
          />
        ) : null}
        {children}
      </div>
    </section>
  );
}
