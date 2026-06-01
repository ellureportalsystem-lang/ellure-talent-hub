import { cn } from "@/lib/utils";

type MarketingBrandedBannerProps = {
  /** Banner image already includes headline copy (e.g. Empowering…) */
  imageSrc: string;
  alt?: string;
  className?: string;
};

/**
 * Full-width branded banner — viewport-wide, full artwork visible (Type A ~1643×957).
 */
export function MarketingBrandedBanner({ imageSrc, alt = "", className }: MarketingBrandedBannerProps) {
  return (
    <section className={cn("bharatgo-branded-banner w-full bg-muted/20", className)} aria-label={alt || undefined}>
      <div className="marketing-banner-bleed marketing-banner-bleed--strip w-full">
        <img
          src={imageSrc}
          alt={alt}
          className="marketing-photo-banner marketing-photo-banner--strip"
          loading="lazy"
        />
      </div>
    </section>
  );
}
