import type { ReactNode } from "react";
import { MarketingGradientSplitCta, type MarketingGradientSplitCtaProps } from "./MarketingGradientSplitCta";

/** @deprecated Use MarketingGradientSplitCta — image banners removed for gradient split CTAs */
type MarketingCtaCardProps = {
  imageSrc?: string;
  children?: ReactNode;
  className?: string;
} & MarketingGradientSplitCtaProps;

const MarketingCtaCard = ({
  headline,
  subtitle,
  applicant,
  employer,
  className,
}: MarketingCtaCardProps) => (
  <MarketingGradientSplitCta
    headline={headline}
    subtitle={subtitle}
    applicant={applicant}
    employer={employer}
    className={className}
  />
);

export default MarketingCtaCard;
export { MarketingGradientSplitCta };
