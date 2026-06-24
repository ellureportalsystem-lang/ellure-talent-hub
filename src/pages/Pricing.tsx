import { MarketingSaasShell } from "@/components/marketing/MarketingSaasShell";
import { MarketingSaasPageHero } from "@/components/marketing/MarketingSaasPageHero";
import { PageMeta } from "@/components/marketing/PageMeta";
import { PricingSection } from "@/components/marketing/PricingSection";
import { MarketingCartoonArt } from "@/components/marketing/MarketingCartoonArt";
import { MarketingIllustrationFrame } from "@/components/marketing/MarketingIllustrationFrame";

const Pricing = () => (
  <MarketingSaasShell>
    <PageMeta
      title="Pricing — Ellure TalentHub"
      description="Flexible subscription plans for recruiters. CV downloads, job postings, and team collaboration."
    />
    <MarketingSaasPageHero
      eyebrow="Pricing"
      align="left"
      illustration={
        <MarketingIllustrationFrame tone="peach" className="w-full max-w-md">
          <MarketingCartoonArt variant="candidates" size="hero" />
        </MarketingIllustrationFrame>
      }
      illustrationTone="peach"
      title="Pricing built for growing teams"
      subtitle="Start free, upgrade as you scale. No hidden fees."
    />
    <PricingSection />
  </MarketingSaasShell>
);

export default Pricing;
