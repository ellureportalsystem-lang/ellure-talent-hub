import MarketingLayout from "@/components/marketing/MarketingLayout";
import { PageMeta } from "@/components/marketing/PageMeta";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MarketingPageHero from "@/components/marketing/MarketingPageHero";
import { PricingSection } from "@/components/marketing/PricingSection";

const Pricing = () => (
  <MarketingLayout showGeometry>
    <PageMeta
      title="Pricing — Ellure NexHire"
      description="Flexible subscription plans for recruiters. CV downloads, job postings, and team collaboration."
    />
    <Navbar />
    <MarketingPageHero
      imageSrc="/services-banner.jpg"
      title="Pricing built for growing teams"
      subtitle="Start free, upgrade as you scale. No hidden fees."
    />
    <PricingSection showComparison />
    <Footer />
  </MarketingLayout>
);

export default Pricing;
