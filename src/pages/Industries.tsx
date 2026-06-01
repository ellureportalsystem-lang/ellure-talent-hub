import { Card } from "@/components/ui/card";
import { CheckCircle, TrendingUp, Users, Award } from "lucide-react";
import { MarketingSaasShell } from "@/components/marketing/MarketingSaasShell";
import { MarketingSaasPageHero } from "@/components/marketing/MarketingSaasPageHero";
import { MarketingSaasSection } from "@/components/marketing/MarketingSaasSection";
import { IndustriesTabbedSelector } from "@/components/marketing/IndustriesTabbedSelector";
import { MarketingTrustStats } from "@/components/marketing/MarketingTrustStats";
import { BharatGoPastelFeatureCards } from "@/components/marketing/bharatgo/BharatGoPastelFeatureCards";
import { industriesPastelCard } from "@/lib/marketingPastelContent";
import { getPageHeroIllustration } from "@/lib/pageMarketingVisuals";

const Industries = () => (
  <MarketingSaasShell>
    <MarketingSaasPageHero
      eyebrow="Industries"
      align="left"
      illustration={getPageHeroIllustration("industries")}
      illustrationTone="sky"
      title="Industries we serve"
      subtitle="Specialised recruitment expertise across IT, BFSI, pharma, telecom, retail, and more."
    />

    <BharatGoPastelFeatureCards cards={[industriesPastelCard]} columns={1} className="!py-10 sm:!py-12" />

    <MarketingSaasSection
      title="Explore by industry"
      subtitle="Select a sector to view expertise, typical roles, and how we support your hiring goals."
    >
      <IndustriesTabbedSelector />
    </MarketingSaasSection>

    <MarketingSaasSection tone="muted" title="Why clients choose us">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: TrendingUp, title: "Industry expertise", desc: "Understanding role nuances across sectors." },
          { icon: CheckCircle, title: "Quality screening", desc: "Relevance over volume — no bulk resumes." },
          { icon: Users, title: "Talent network", desc: "Access to active and passive candidates." },
          { icon: Award, title: "Proven track record", desc: "Consistent delivery and ethical practices." },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="rounded-2xl border border-border p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </Card>
          );
        })}
      </div>
    </MarketingSaasSection>

    <MarketingTrustStats />
  </MarketingSaasShell>
);

export default Industries;
