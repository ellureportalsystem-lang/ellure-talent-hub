import { cn } from "@/lib/utils";

type MarketingBrandedBannerProps = {
  /** Banner image already includes headline copy (e.g. Empowering…) */
  imageSrc: string;
  alt?: string;
  className?: string;
};

/**
 * Full-width branded banner — edge-to-edge in section (cover fill).
 * object-position keeps faces/headline art in frame.
 */
export function MarketingBrandedBanner({ imageSrc, alt = "", className }: MarketingBrandedBannerProps) {
  return (
    <section className={cn("bharatgo-branded-banner w-full bg-muted/20", className)} aria-label={alt || undefined}>
      <div className="container px-0 sm:px-0">
        <div className="marketing-banner-bleed w-full">
          <img
            src={imageSrc}
            alt={alt}
            className="marketing-photo-banner marketing-photo-banner--strip"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
