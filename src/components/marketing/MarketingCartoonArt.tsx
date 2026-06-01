import { cn } from "@/lib/utils";
import {
  marketingCartoonAlt,
  marketingCartoonAssets,
  type MarketingCartoonVariant,
} from "@/lib/marketingCartoonAssets";

const sizeClass = {
  band: "max-h-[140px] min-h-0 w-full max-w-[200px] sm:max-h-[160px] sm:max-w-[220px]",
  card: "max-h-[min(280px,42vw)] min-h-[160px] w-full max-w-[300px] sm:max-w-[340px]",
  showcase: "max-h-[min(360px,48vw)] min-h-[200px] w-full max-w-md sm:max-w-lg",
  hero: "max-h-[min(400px,52vw)] min-h-[220px] w-full max-w-lg",
};

type MarketingCartoonArtProps = {
  variant: MarketingCartoonVariant;
  size?: keyof typeof sizeClass;
  className?: string;
  alt?: string;
};

/** Visible 3D cartoon artwork — PNG with fallback chain */
export function MarketingCartoonArt({
  variant,
  size = "card",
  className,
  alt,
}: MarketingCartoonArtProps) {
  const src = marketingCartoonAssets[variant];
  const resolvedAlt = alt ?? marketingCartoonAlt[variant];
  const fallbacks: Record<MarketingCartoonVariant, string> = {
    recruiter: marketingCartoonAssets.features,
    candidates: marketingCartoonAssets.recruiter,
    team: marketingCartoonAssets.recruiter,
    analytics: marketingCartoonAssets.recruiter,
    services: marketingCartoonAssets.team,
    industries: marketingCartoonAssets.recruiter,
    features: marketingCartoonAssets.recruiter,
  };

  return (
    <img
      src={src}
      alt={resolvedAlt}
      className={cn("marketing-cartoon-art h-auto w-full object-contain", sizeClass[size], className)}
      loading="lazy"
      data-fallback={fallbacks[variant]}
      onError={(e) => {
        const img = e.currentTarget;
        const fb = img.dataset.fallback;
        if (fb && !img.src.endsWith(fb)) img.src = fb;
      }}
    />
  );
}
