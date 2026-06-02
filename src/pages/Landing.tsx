import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import { TrustLogoMarquee } from "@/components/marketing/TrustLogoMarquee";
import { PricingSection } from "@/components/marketing/PricingSection";
import { MarketingBrandedBanner } from "@/components/marketing/MarketingBrandedBanner";
import { BharatGoHero } from "@/components/marketing/bharatgo/BharatGoHero";
import { BharatGoFeatureGrid } from "@/components/marketing/bharatgo/BharatGoFeatureGrid";
import { BharatGoPastelFeatureCards } from "@/components/marketing/bharatgo/BharatGoPastelFeatureCards";
import { BharatGoSplitShowcase } from "@/components/marketing/bharatgo/BharatGoSplitShowcase";
import { BharatGoIndustriesSection } from "@/components/marketing/bharatgo/BharatGoIndustriesSection";
import { BharatGoWhyChoose } from "@/components/marketing/bharatgo/BharatGoWhyChoose";
import { BharatGoTestimonials } from "@/components/marketing/bharatgo/BharatGoTestimonials";
import { BharatGoHowItWorks } from "@/components/marketing/bharatgo/BharatGoHowItWorks";
import { BharatGoFaqSection } from "@/components/marketing/bharatgo/BharatGoFaqSection";
import { BharatGoFinalCta } from "@/components/marketing/bharatgo/BharatGoFinalCta";
import { MarketingIllustrationFrame } from "@/components/marketing/MarketingIllustrationFrame";
import { MarketingCartoonArt } from "@/components/marketing/MarketingCartoonArt";
import { landingPastelCards } from "@/lib/marketingPastelContent";
import { marketingBanners } from "@/lib/marketingPastelColors";
import { renderProductVisual } from "@/lib/marketingProductVisuals";
import {
  Building2,
  FileCheck,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const platformFeatures = [
  {
    icon: FileCheck,
    title: "Smart application management",
    description:
      "Multi-step registration, automated profiles, resume parsing, and instant dashboard access for every candidate.",
  },
  {
    icon: TrendingUp,
    title: "Advanced analytics",
    description:
      "Track hiring performance, applicant flow, skill clusters, and real-time metrics in easy-to-read dashboards.",
  },
  {
    icon: Users,
    title: "Bulk operations",
    description:
      "Upload thousands of applicants via CSV or Excel, export reports, and manage recruitment data at scale.",
  },
  {
    icon: Shield,
    title: "Enterprise security",
    description:
      "Role-based access control, audit logging, and encrypted data built for sensitive hiring workflows.",
  },
  {
    icon: Building2,
    title: "Client collaboration",
    description:
      "Share shortlists, collect feedback, and manage employer–candidate communication in one place.",
  },
  {
    icon: Sparkles,
    title: "AI resume search",
    description:
      "Skill-based matching and intelligent search help recruiters shortlist the right profiles faster.",
  },
];

/** Analytics band — compact cartoon + dashboard mockup side by side */
function HomePlatformAnalyticsBand() {
  return (
    <section className="bharatgo-section border-y border-[#ddd0f5] bg-[#F3EFFE] py-10 sm:py-12 lg:py-14">
      <div className="container px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-10">
          <div className="max-lg:text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Platform insights</p>
            <h2 className="font-poppins mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Hiring analytics at a glance
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Track pipeline health, applicant flow, and shortlist quality — dashboards built for recruitment
              teams, not spreadsheet wranglers.
            </p>
          </div>
          <div className="flex flex-row items-stretch justify-center gap-3 sm:gap-4 lg:justify-end">
            <MarketingIllustrationFrame tone="lavender" className="w-auto max-w-[200px] p-2 sm:max-w-[220px] sm:p-3">
              <MarketingCartoonArt variant="analytics" size="band" />
            </MarketingIllustrationFrame>
            {renderProductVisual("analytics", "compact")}
          </div>
        </div>
      </div>
    </section>
  );
}

const Landing = () => {
  return (
    <MarketingLayout variant="saas">
      <Navbar variant="saas" heroOverlay />

      <BharatGoHero />

      <TrustLogoMarquee className="border-t-0" />

      {/* Visuals 1–2: cartoon + mockup */}
      <BharatGoPastelFeatureCards cards={landingPastelCards} />

      <BharatGoFeatureGrid features={platformFeatures} variant="pastel" />

      {/* Visual 3: analytics mockup */}
      <HomePlatformAnalyticsBand />

      <MarketingBrandedBanner
        imageSrc={marketingBanners.homeMid}
        alt="Empowering organizations with exceptional talent"
      />

      {/* Visual 4: resume-search mockup */}
      <BharatGoSplitShowcase
        eyebrow="AI-powered hiring"
        title="Find the right candidates in seconds"
        description="Resume search with skill filters, match insights, and bulk CV tools — built for recruitment teams who need speed without sacrificing quality."
        ctaLabel="Start for FREE"
        ctaHref="/auth/register"
        visual={renderProductVisual("resume-search", "default")}
      />

      {/* Visual 5: team cartoon */}
      <BharatGoSplitShowcase
        reverse
        className="bg-[#FDF0E9]"
        eyebrow="Client workspace"
        title="Collaborate with your hiring team"
        description="Shortlists, folders, jobs, and messaging keep employers aligned — structured operations applied to talent acquisition."
        ctaLabel="Hire talent"
        ctaHref="/contact"
        visual={
          <MarketingIllustrationFrame tone="peach" className="w-full max-w-lg">
            <MarketingCartoonArt variant="team" size="showcase" />
          </MarketingIllustrationFrame>
        }
      />

      <BharatGoIndustriesSection />

      {/* Visual 6: candidates cartoon + trust stats */}
      <BharatGoWhyChoose />

      <BharatGoTestimonials />

      <BharatGoHowItWorks />

      <PricingSection className="bg-[#E9F0FF]" />

      <MarketingBrandedBanner imageSrc={marketingBanners.cta} alt="Create your free profile" />

      <BharatGoFaqSection />

      <BharatGoFinalCta />

      <Footer variant="light" />
    </MarketingLayout>
  );
};

export default Landing;
