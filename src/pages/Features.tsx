import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileCheck, TrendingUp, Users, Shield, Zap, Search, MessageSquare, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import { MarketingSaasShell } from "@/components/marketing/MarketingSaasShell";
import { MarketingSaasPageHero } from "@/components/marketing/MarketingSaasPageHero";
import { MarketingSaasSection } from "@/components/marketing/MarketingSaasSection";
import { BharatGoFeatureGrid } from "@/components/marketing/bharatgo/BharatGoFeatureGrid";
import { BharatGoPastelFeatureCards } from "@/components/marketing/bharatgo/BharatGoPastelFeatureCards";
import { featuresPastelCards } from "@/lib/marketingPastelContent";

const features = [
  {
    icon: FileCheck,
    title: "Application lifecycle management",
    description:
      "Tracks the candidate journey end-to-end with stage-by-stage visibility and complete application history.",
  },
  {
    icon: Search,
    title: "Context-based matching",
    description:
      "Matches candidates by relevance and role context — not keyword stuffing — for better shortlist quality.",
  },
  {
    icon: MessageSquare,
    title: "HR–recruiter collaboration",
    description:
      "Private feedback and notes in a secure workspace aligned with ethical, transparent hiring practices.",
  },
  {
    icon: Users,
    title: "Controlled bulk actions",
    description:
      "Enterprise-safe bulk operations with limits that save recruiter time without spam or misuse.",
  },
  {
    icon: TrendingUp,
    title: "Essential hiring analytics",
    description:
      "Actionable metrics without dashboard overload — insights MNC teams can trust.",
  },
  {
    icon: Shield,
    title: "Enterprise security & compliance",
    description:
      "Data protection, access control, and compliance-ready practices for sensitive hiring data.",
  },
];

const stats = [
  { value: "80%", label: "Time saved", desc: "In recruitment processes" },
  { value: "95%", label: "Accuracy", desc: "In candidate matching" },
  { value: "50K+", label: "Profiles", desc: "Managed efficiently" },
  { value: "24/7", label: "Support", desc: "Available when you need" },
];

const enterpriseHighlights = [
  { icon: Shield, title: "Enterprise security", desc: "Encryption and compliance-ready controls" },
  { icon: Zap, title: "Lightning fast", desc: "Optimized performance at any scale" },
  { icon: Users, title: "Collaborative", desc: "Built for teams and stakeholders" },
];

const Features = () => (
  <MarketingSaasShell>
    <MarketingSaasPageHero
      eyebrow="Platform"
      align="left"
      productVisual="resume-search"
      title="Platform features"
      subtitle="Everything you need to manage recruitment at scale with efficiency, precision, and accountability."
    />

    <BharatGoPastelFeatureCards cards={featuresPastelCards} className="!py-10 sm:!py-12" />

    <MarketingSaasSection
      title="Powerful features"
      subtitle="Applicant tracking, matching, collaboration, analytics, and security — in one platform."
    >
      <BharatGoFeatureGrid embedded variant="pastel" features={features} />
    </MarketingSaasSection>

    <MarketingSaasSection tone="muted" eyebrow="Results" title="Platform impact">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl border border-border p-4 text-center shadow-sm sm:p-5">
            <div className="text-2xl font-bold text-primary sm:text-3xl">{stat.value}</div>
            <h3 className="mt-2 font-semibold">{stat.label}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{stat.desc}</p>
          </Card>
        ))}
      </div>
    </MarketingSaasSection>

    <MarketingSaasSection eyebrow="Enterprise ready" title="Built for scale & security">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {enterpriseHighlights.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="rounded-2xl border border-border p-5 text-center shadow-sm sm:p-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary sm:mb-4 sm:h-14 sm:w-14">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </Card>
          );
        })}
      </div>
    </MarketingSaasSection>

    <MarketingSaasSection
      tone="muted"
      eyebrow="Explore"
      title="See the platform in action"
      subtitle="Walk through screens, workflows, and UI patterns — or talk to our team about your hiring needs."
    >
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild size="lg" className="h-12 rounded-full px-8 font-semibold">
          <Link to="/showcase">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Platform showcase
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-8 font-semibold">
          <Link to="/contact">Contact sales</Link>
        </Button>
      </div>
    </MarketingSaasSection>
  </MarketingSaasShell>
);

export default Features;
