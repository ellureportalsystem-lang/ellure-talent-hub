import { Button } from "@/components/ui/button";
import { MarketingSaasShell } from "@/components/marketing/MarketingSaasShell";
import { MarketingSaasPageHero } from "@/components/marketing/MarketingSaasPageHero";
import { MarketingSaasSection } from "@/components/marketing/MarketingSaasSection";
import { MarketingBrandedBanner } from "@/components/marketing/MarketingBrandedBanner";
import { MarketingIllustrationFrame } from "@/components/marketing/MarketingIllustrationFrame";
import { MarketingCartoonArt } from "@/components/marketing/MarketingCartoonArt";
import { BharatGoPastelFeatureCards } from "@/components/marketing/bharatgo/BharatGoPastelFeatureCards";
import { BharatGoMarketStats } from "@/components/marketing/bharatgo/BharatGoMarketStats";
import { BharatGoCoreValues } from "@/components/marketing/bharatgo/BharatGoCoreValues";
import { BharatGoTeamGrid } from "@/components/marketing/bharatgo/BharatGoTeamGrid";
import { BharatGoOfficeGallery } from "@/components/marketing/bharatgo/BharatGoOfficeGallery";
import { BharatGoTestimonials } from "@/components/marketing/bharatgo/BharatGoTestimonials";
import { BharatGoHowItWorks } from "@/components/marketing/bharatgo/BharatGoHowItWorks";
import { aboutPastelCards } from "@/lib/marketingPastelContent";
import { marketingBanners } from "@/lib/marketingPastelColors";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const About = () => (
  <MarketingSaasShell>
    <MarketingSaasPageHero
      eyebrow="About us"
      align="left"
      illustration={
        <MarketingIllustrationFrame tone="lavender" className="w-full">
          <MarketingCartoonArt variant="team" size="hero" />
        </MarketingIllustrationFrame>
      }
      illustrationTone="lavender"
      title="Empowering ethical, structured hiring"
      subtitle="We're on a mission to help employers and candidates succeed through transparent recruitment workflows — powered by Ellure NexHire."
    />

    <MarketingSaasSection eyebrow="About us" title="Simplifying recruitment" align="left">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Ellure was founded with a simple belief: hiring should be structured, transparent, and accountable —
            for employers and candidates alike.
          </p>
          <p>
            In a market where scattered spreadsheets and bulk resumes slow everyone down, we built Ellure NexHire
            to bring role alignment, screening, and coordination into one platform. No chaos — just clear steps
            from intake to shortlist.
          </p>
          <p>
            We're proud to support organisations across IT, BFSI, pharma, telecom, retail, and more — combining
            Ellure Consulting Services' recruitment expertise with technology built for Indian hiring teams.
          </p>
          <Button className="rounded-full" variant="outline" asChild>
            <Link to="/showcase">
              See platform showcase
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <MarketingIllustrationFrame tone="sky" className="w-full lg:ml-auto">
          <MarketingCartoonArt variant="recruiter" size="showcase" />
        </MarketingIllustrationFrame>
      </div>
    </MarketingSaasSection>

    <MarketingBrandedBanner imageSrc={marketingBanners.about} alt="About Ellure NexHire" />

    <BharatGoPastelFeatureCards cards={aboutPastelCards} columns={1} className="!py-10 sm:!py-12" />

    <BharatGoMarketStats />

    <BharatGoCoreValues />

    <BharatGoHowItWorks
      className="bg-[#FFFBF7]"
      eyebrow="Process"
      title="How we work with you"
      subtitle="Four steps from role alignment to delivery — the same process on our Services page."
    />

    <BharatGoTeamGrid />

    <BharatGoTestimonials />

    <BharatGoOfficeGallery />
  </MarketingSaasShell>
);

export default About;
