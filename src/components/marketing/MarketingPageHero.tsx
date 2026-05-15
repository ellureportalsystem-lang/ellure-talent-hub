import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarketingPageHeroProps = {
  imageSrc?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

const MarketingPageHero = ({
  imageSrc,
  title,
  subtitle,
  align = "center",
  className,
}: MarketingPageHeroProps) => (
  <section
    className={cn(
      "relative bg-gradient-primary text-primary-foreground overflow-hidden marketing-page-hero",
      className
    )}
  >
    {imageSrc ? (
      <div
        className="absolute inset-0 marketing-hero-banner bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${imageSrc})` }}
        aria-hidden
      />
    ) : null}
    <div className="absolute inset-0 marketing-hero-overlay" aria-hidden />
    <div
      className={cn(
        "container relative px-4 sm:px-6 marketing-page-hero-inner",
        align === "center" && "text-center"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={cn(
          "max-w-2xl space-y-3 sm:space-y-4 md:space-y-6 z-10",
          align === "center" ? "mx-auto" : ""
        )}
      >
        <h1 className="marketing-hero-title text-white">{title}</h1>
        {subtitle ? (
          <p className="marketing-hero-subtitle text-white/90">{subtitle}</p>
        ) : null}
      </motion.div>
    </div>
  </section>
);

export default MarketingPageHero;
