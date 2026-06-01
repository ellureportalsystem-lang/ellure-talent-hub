import { FileText, CheckCircle, BarChart3, Users, Briefcase, Shield } from "lucide-react";
import { MarketingSaasShell } from "@/components/marketing/MarketingSaasShell";
import { MarketingSaasPageHero } from "@/components/marketing/MarketingSaasPageHero";
import { MarketingSaasSection } from "@/components/marketing/MarketingSaasSection";
import { BharatGoFeatureGrid } from "@/components/marketing/bharatgo/BharatGoFeatureGrid";
import { BharatGoPastelFeatureCards } from "@/components/marketing/bharatgo/BharatGoPastelFeatureCards";
import { BharatGoHowItWorks } from "@/components/marketing/bharatgo/BharatGoHowItWorks";
import { servicesPastelCards } from "@/lib/marketingPastelContent";
import { getPageHeroIllustration } from "@/lib/pageMarketingVisuals";

const services = [
  {
    icon: FileText,
    title: "Resume intake & validation",
    description:
      "Structured resume submission and basic validation to ensure profiles are relevant and ready for hiring workflows.",
  },
  {
    icon: CheckCircle,
    title: "Profile relevance screening",
    description:
      "Initial screening based on skills, experience alignment, notice period, and role fit.",
  },
  {
    icon: BarChart3,
    title: "Skill & role mapping",
    description: "Accurate mapping of candidate skills to role requirements to improve shortlist quality.",
  },
  {
    icon: Users,
    title: "Candidate–client coordination",
    description:
      "Interview scheduling, feedback sharing, offer updates, and joiner follow-ups in one workflow.",
  },
  {
    icon: Briefcase,
    title: "Hiring process support",
    description: "Operational support across hiring stages — timelines, follow-ups, and closure assistance.",
  },
  {
    icon: Shield,
    title: "Ethical hiring enablement",
    description: "Transparency, timely communication, and accountability across candidates and employers.",
  },
];

const Services = () => (
  <MarketingSaasShell>
    <MarketingSaasPageHero
      eyebrow="Services"
      align="left"
      illustration={getPageHeroIllustration("services")}
      illustrationTone="mint"
      title="Structured hiring solutions"
      subtitle="For employers and candidates — coordination, screening, and ethical process management without replacing your internal HR ownership."
    />

    <BharatGoPastelFeatureCards cards={servicesPastelCards} className="!py-10 sm:!py-12" />

    <MarketingSaasSection
      title="What we do"
      subtitle="We support hiring outcomes through structured coordination and relevance screening — powered by the Ellure NexHire platform."
    >
      <BharatGoFeatureGrid embedded variant="pastel" features={services} />
      <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">
        Additional services such as resume writing may be provided upon candidate request.
      </p>
    </MarketingSaasSection>

    <BharatGoHowItWorks
      className="bg-[#E8F8F0]"
      eyebrow="Process"
      title="How it works"
      subtitle="Our hiring process — step by step."
    />
  </MarketingSaasShell>
);

export default Services;
