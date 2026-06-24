import type { ReactNode } from "react";
import { MarketingProductMockup } from "@/components/marketing/MarketingProductMockup";
import { TalentHubResumeSearchMockup } from "@/components/marketing/product-mockups/TalentHubResumeSearchMockup";
import { TalentHubClientWorkspaceMockup } from "@/components/marketing/product-mockups/TalentHubClientWorkspaceMockup";
import { TalentHubAnalyticsMockup } from "@/components/marketing/product-mockups/TalentHubAnalyticsMockup";

export type ProductVisualVariant = "resume-search" | "client-workspace" | "analytics";

export function renderProductVisual(
  variant: ProductVisualVariant,
  size: "compact" | "default" | "hero" = "default"
): ReactNode {
  const illoClass = "h-auto w-full";

  const inner =
    variant === "resume-search" ? (
      <TalentHubResumeSearchMockup className={illoClass} />
    ) : variant === "client-workspace" ? (
      <TalentHubClientWorkspaceMockup className={illoClass} />
    ) : (
      <TalentHubAnalyticsMockup className={illoClass} />
    );

  return <MarketingProductMockup size={size}>{inner}</MarketingProductMockup>;
}
