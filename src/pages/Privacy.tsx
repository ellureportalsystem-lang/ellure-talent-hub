import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import { FadeInSection } from "@/components/marketing/FadeInSection";
import { Card } from "@/components/ui/card";

const Privacy = () => (
  <MarketingLayout showGeometry>
    <Navbar />
    <section className="relative bg-gradient-primary text-primary-foreground py-12 md:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
      <div className="container relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="gold-text">Privacy</span> Policy
        </h1>
        <p className="mt-3 text-primary-foreground/85 max-w-2xl text-sm md:text-base">
          How Ellure NexHire collects, uses, and protects your information.
        </p>
      </div>
    </section>

    <FadeInSection className="container py-10 md:py-14 max-w-3xl">
      <Card className="p-6 md:p-10 marketing-card-lift border-2 space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed">
        <p>
          Ellure NexHire respects your privacy. This policy describes how we handle personal data when you use our website and recruitment platform.
        </p>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Information we collect</h2>
          <p>
            Contact details, profile and resume information, employment history, and usage data needed to provide hiring services.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">How we use data</h2>
          <p>
            To operate the platform, match candidates with opportunities, communicate with users, and meet legal obligations.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Security</h2>
          <p>We use access controls and encryption in transit to protect your information.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Contact</h2>
          <p>
            Email{" "}
            <a href="mailto:info@ellureconsulting.com" className="text-primary hover:underline">
              info@ellureconsulting.com
            </a>
            .
          </p>
        </div>
        <p className="text-xs text-muted-foreground pt-2">Last updated: May 2026</p>
      </Card>
    </FadeInSection>
    <Footer />
  </MarketingLayout>
);

export default Privacy;
