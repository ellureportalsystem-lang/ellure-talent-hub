import { Card } from "@/components/ui/card";
import { MarketingSaasShell } from "@/components/marketing/MarketingSaasShell";
import { MarketingSaasPageHero } from "@/components/marketing/MarketingSaasPageHero";
import { MarketingSaasSection } from "@/components/marketing/MarketingSaasSection";

const Terms = () => (
  <MarketingSaasShell showFinalCta={false} showMobileCta={false}>
    <MarketingSaasPageHero
      eyebrow="Legal"
      title="Terms of service"
      subtitle="Rules for using the Ellure TalentHub website and platform."
      align="left"
    />
    <MarketingSaasSection>
      <Card className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-border p-6 text-sm leading-relaxed text-muted-foreground shadow-sm sm:p-10 md:text-base">
        <p>
          By accessing Ellure TalentHub, you agree to these terms. If you do not agree, please do not use our services.
        </p>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Use of the platform</h2>
          <p>
            You agree to provide accurate information, use the platform only for lawful recruitment purposes, and not
            misuse candidate or employer data.
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Accounts</h2>
          <p>You are responsible for safeguarding your login credentials and for activity under your account.</p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Intellectual property</h2>
          <p>Content, branding, and software on this site remain the property of Ellure unless otherwise stated.</p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Contact</h2>
          <p>
            Questions about these terms:{" "}
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

export default Terms;
