import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarketingPageHeroProps = {
  imageSrc?: string;
  /** `contain` shows the full banner; `cover` fills the frame (may crop) */
  imageFit?: "cover" | "contain";
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

const MarketingPageHero = ({
  imageSrc,
  imageFit = "cover",
  title,
  subtitle,
  align = "center",
  className,
}: MarketingPageHeroProps) => (
  <section
    className={cn(
      "relative overflow-hidden bg-gradient-primary text-primary-foreground marketing-page-hero marketing-hero-under-nav",
      className
    )}
  >
    {imageSrc ? (
      <div
        className={cn(
          "absolute inset-0 marketing-hero-banner bg-no-repeat",
          imageFit === "contain" ? "bg-contain bg-center" : "bg-cover",
          align === "center"
            ? "marketing-hero-banner--page-center"
            : "marketing-hero-banner--page-left"
        )}
        style={{ backgroundImage: `url(${imageSrc})` }}
        aria-hidden
      />
    ) : null}
    <div className="absolute inset-0 marketing-hero-overlay" aria-hidden />
    <div
      className={cn(
        "container relative px-4 sm:px-6 marketing-page-hero-inner min-h-full",
        align === "center" && "text-center items-center"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={cn(
          "max-w-3xl space-y-3 sm:space-y-4 md:space-y-5 z-10 w-full",
          align === "center" ? "mx-auto text-center" : "text-left"
        )}
      >
        <h1 className="hero-title marketing-hero-title text-white text-balance">{title}</h1>
        {subtitle ? (
          <p
            className={cn(
              "marketing-hero-subtitle text-white/90 text-balance md:text-lg max-w-2xl",
              align === "center" && "mx-auto"
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </motion.div>
    </div>
  </section>
);

export default MarketingPageHero;
