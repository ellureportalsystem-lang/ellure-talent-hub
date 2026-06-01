import { Card } from "@/components/ui/card";
import { MarketingSaasShell } from "@/components/marketing/MarketingSaasShell";
import { MarketingSaasPageHero } from "@/components/marketing/MarketingSaasPageHero";
import { MarketingSaasSection } from "@/components/marketing/MarketingSaasSection";

const Privacy = () => (
  <MarketingSaasShell showFinalCta={false} showMobileCta={false}>
    <MarketingSaasPageHero
      eyebrow="Legal"
      title="Privacy policy"
      subtitle="How Ellure NexHire collects, uses, and protects your information."
      align="left"
    />
    <MarketingSaasSection>
      <Card className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-border p-6 text-sm leading-relaxed text-muted-foreground shadow-sm sm:p-10 md:text-base">
        <p>
          Ellure NexHire respects your privacy. This policy describes how we handle personal data when you use our
          website and recruitment platform.
        </p>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Information we collect</h2>
          <p>
            Contact details, profile and resume information, employment history, and usage data needed to provide
            hiring services.
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">How we use data</h2>
          <p>
            To operate the platform, match candidates with opportunities, communicate with users, and meet legal
            obligations.
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Security</h2>
          <p>We use access controls and encryption in transit to protect your information.</p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Contact</h2>
          <p>
            Email{" "}
            <a href="mailto:info@ellureconsulting.com" className="text-primary hover:underline">
              info@ellureconsulting.com
            </a>
            .
          </p>
        </div>
        <p className="pt-2 text-xs">Last updated: May 2026</p>
      </Card>
    </MarketingSaasSection>
  </MarketingSaasShell>
);

export default Privacy;
