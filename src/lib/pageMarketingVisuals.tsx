import type { ReactNode } from "react";
import { MarketingIllustrationFrame } from "@/components/marketing/MarketingIllustrationFrame";
import { MarketingCartoonArt } from "@/components/marketing/MarketingCartoonArt";
import { renderProductVisual } from "@/lib/marketingProductVisuals";
import type { PastelCardTone } from "@/components/marketing/bharatgo/BharatGoPastelFeatureCards";

export const pageIllustrationClass = "h-auto w-full min-h-[200px] max-w-full object-contain";

const heroCartoonVariant = {
  services: "services",
  industries: "industries",
  analytics: "analytics",
} as const;

/** 3D PNG illustrations for page heroes and bands */
export function getPageHeroIllustration(
  page: keyof typeof heroCartoonVariant
): ReactNode {
  return (
    <MarketingCartoonArt variant={heroCartoonVariant[page]} size="showcase" className={pageIllustrationClass} />
  );
}

export function wrapPageIllustration(
  children: ReactNode,
  tone: PastelCardTone,
  className?: string
): ReactNode {
  return (
    <MarketingIllustrationFrame tone={tone} className={className}>
      {children}
    </MarketingIllustrationFrame>
  );
}

export function renderPagePastelVisual(
  kind: "services-mockup" | "industries-sectors" | "features-cartoon" | "features-mockup"
): ReactNode {
  switch (kind) {
    case "services-mockup":
      return renderProductVisual("client-workspace", "compact");
    case "industries-sectors":
      return (
        <MarketingIllustrationFrame tone="mint" className="w-full max-w-[360px]">
          <MarketingCartoonArt variant="industries" size="card" className={pageIllustrationClass} />
        </MarketingIllustrationFrame>
      );
    case "features-cartoon":
      return (
        <MarketingIllustrationFrame tone="peach" className="w-full max-w-[360px]">
          <MarketingCartoonArt variant="features" size="card" className={pageIllustrationClass} />
        </MarketingIllustrationFrame>
      );
    case "features-mockup":
      return renderProductVisual("resume-search", "compact");
    default:
      return null;
  }
}
