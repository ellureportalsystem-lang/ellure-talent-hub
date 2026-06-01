import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type MarketingFullWidthBannerProps = {
  imageSrc: string;
  alt?: string;
  className?: string;
  /** Fixed aspect on mobile; taller on desktop */
  aspectClass?: string;
  /** Solid overlay for readable text (no gradients) */
  overlay?: "none" | "light" | "dark";
  children?: ReactNode;
};

/**
 * Full-width image banner between marketing sections (BharatGo-style breaks).
 */
export function MarketingFullWidthBanner({
  imageSrc,
  alt = "",
  className,
  aspectClass = "aspect-[21/9] min-h-[160px] sm:min-h-[200px] md:aspect-[3/1] md:min-h-[240px]",
  overlay = "none",
  children,
}: MarketingFullWidthBannerProps) {
  const overlayClass =
    overlay === "dark"
      ? "bg-black/45"
      : overlay === "light"
        ? "bg-white/55"
        : "";

  return (
    <section className={cn("bharatgo-banner-strip w-full", className)}>
      <div className={cn("relative w-full overflow-hidden", aspectClass)}>
        <img
          src={imageSrc}
          alt={alt}
          className="marketing-photo-banner absolute inset-0 h-full w-full"
          loading="lazy"
        />
        {overlay !== "none" ? <div className={cn("absolute inset-0", overlayClass)} aria-hidden /> : null}
        {children ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">{children}</div>
        ) : null}
      </div>
    </section>
  );
}
