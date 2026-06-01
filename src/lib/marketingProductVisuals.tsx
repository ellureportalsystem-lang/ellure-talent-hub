import type { ReactNode } from "react";
import { MarketingProductMockup } from "@/components/marketing/MarketingProductMockup";
import { NexHireResumeSearchMockup } from "@/components/marketing/product-mockups/NexHireResumeSearchMockup";
import { NexHireClientWorkspaceMockup } from "@/components/marketing/product-mockups/NexHireClientWorkspaceMockup";
import { NexHireAnalyticsMockup } from "@/components/marketing/product-mockups/NexHireAnalyticsMockup";

export type ProductVisualVariant = "resume-search" | "client-workspace" | "analytics";

export function renderProductVisual(
  variant: ProductVisualVariant,
  size: "compact" | "default" | "hero" = "default"
): ReactNode {
  const illoClass = "h-auto w-full";

  const inner =
    variant === "resume-search" ? (
      <NexHireResumeSearchMockup className={illoClass} />
    ) : variant === "client-workspace" ? (
      <NexHireClientWorkspaceMockup className={illoClass} />
    ) : (
      <NexHireAnalyticsMockup className={illoClass} />
    );

  return <MarketingProductMockup size={size}>{inner}</MarketingProductMockup>;
}
