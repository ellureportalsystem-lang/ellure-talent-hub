import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import { FadeInSection } from "@/components/marketing/FadeInSection";
import { Card } from "@/components/ui/card";

const Terms = () => (
  <MarketingLayout showGeometry>
    <Navbar />
    <section className="relative bg-gradient-primary text-primary-foreground py-12 md:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
      <div className="container relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          Terms of <span className="gold-text">Service</span>
        </h1>
        <p className="mt-3 text-primary-foreground/85 max-w-2xl text-sm md:text-base">
          Rules for using the Ellure NexHire website and platform.
        </p>
      </div>
    </section>

    <FadeInSection className="container py-10 md:py-14 max-w-3xl">
      <Card className="p-6 md:p-10 marketing-card-lift border-2 space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed">
        <p>
          By accessing Ellure NexHire, you agree to these terms. If you do not agree, please do not use our services.
        </p>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Use of the platform</h2>
          <p>
            You agree to provide accurate information, use the platform only for lawful recruitment purposes, and not misuse candidate or employer data.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Accounts</h2>
          <p>
            You are responsible for safeguarding your login credentials and for activity under your account.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Intellectual property</h2>
          <p>
            Content, branding, and software on this site remain the property of Ellure unless otherwise stated.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Contact</h2>
          <p>
            Questions about these terms:{" "}
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

export default Terms;
