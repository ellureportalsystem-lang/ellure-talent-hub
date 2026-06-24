import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingSaasShell } from "@/components/marketing/MarketingSaasShell";
import { MarketingSaasPageHero } from "@/components/marketing/MarketingSaasPageHero";
import { MarketingSaasSection } from "@/components/marketing/MarketingSaasSection";
import { BharatGoSectionHeader } from "@/components/marketing/bharatgo/BharatGoSectionHeader";
import { MarketingIllustrationFrame } from "@/components/marketing/MarketingIllustrationFrame";
import { MarketingCartoonArt } from "@/components/marketing/MarketingCartoonArt";
import { ArrowRight, Building2, Search, UserCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { marketingBanners } from "@/lib/marketingPastelColors";

const showcases = [
  {
    title: "Applicant profile & registration",
    description: "Multi-step profiles with documents, education, and experience — ready for employer search.",
    image: marketingBanners.showcase,
    tag: "Candidates",
    icon: UserCircle,
    href: "/auth/register",
    tone: "bg-[#FDF0E9] border-[#f5ddd0]",
  },
  {
    title: "AI resume search & shortlists",
    description: "Recruiters filter by skills, location, and match scores — then build client-ready shortlists.",
    image: marketingBanners.services,
    tag: "Recruiters",
    icon: Search,
    href: "/features",
    tone: "bg-[#E9F0FF] border-[#d4e2fc]",
  },
  {
    title: "Client collaboration workspace",
    description: "Folders, jobs, shared candidates, and feedback loops for hiring teams.",
    image: marketingBanners.industries,
    tag: "Employers",
    icon: Building2,
    href: "/client/auth/signup",
    tone: "bg-[#E8F8F0] border-[#c5ead8]",
  },
  {
    title: "Admin operations dashboard",
    description: "Bulk import, analytics, user management, and enterprise controls in one place.",
    image: marketingBanners.gallery[1],
    tag: "Operations",
    icon: Users,
    href: "/features",
    tone: "bg-[#E9F0FF] border-[#d4e2fc]",
  },
];

const Showcase = () => (
  <MarketingSaasShell>
    <MarketingSaasPageHero
      eyebrow="Showcase"
      illustration={
        <MarketingIllustrationFrame tone="sky" className="w-full">
          <MarketingCartoonArt variant="recruiter" size="hero" />
        </MarketingIllustrationFrame>
      }
      illustrationTone="sky"
      title="Experience Ellure TalentHub in action"
      subtitle="See how employers, candidates, and recruitment teams use the platform — structured hiring workflows built for India."
    />

    <MarketingSaasSection>
      <BharatGoSectionHeader
        title="Platform highlights"
        subtitle="Explore live-style examples of our portals and hiring flows. Full access starts with a free profile or client signup."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {showcases.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.title}
              className={`overflow-hidden rounded-2xl border-2 shadow-sm transition-shadow hover:shadow-md ${item.tone}`}
            >
              <div className="marketing-banner-bleed aspect-[16/9] overflow-hidden border-b border-border/60">
                <img
                  src={item.image}
                  alt=""
                  className="marketing-photo-banner marketing-photo-banner--tile h-full w-full"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary">{item.tag}</Badge>
                </div>
                <h3 className="mt-4 font-poppins text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                <Button variant="outline" className="mt-4 rounded-full border-primary text-primary" asChild>
                  <Link to={item.href}>
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </MarketingSaasSection>

    <MarketingSaasSection tone="muted">
      <div className="mx-auto grid max-w-4xl items-center gap-10 lg:grid-cols-2">
        <MarketingIllustrationFrame tone="mint" className="mx-auto w-full max-w-md">
          <MarketingCartoonArt variant="team" size="showcase" />
        </MarketingIllustrationFrame>
        <div className="text-center lg:text-left">
          <h2 className="font-poppins text-2xl font-bold">Ready to see it yourself?</h2>
          <p className="mt-3 text-muted-foreground">
            Create a free applicant profile or talk to us about client access — no complex setup required.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button className="rounded-full" size="lg" asChild>
              <Link to="/auth/register">Start for FREE</Link>
            </Button>
            <Button variant="outline" className="rounded-full" size="lg" asChild>
              <Link to="/contact">Contact sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </MarketingSaasSection>
  </MarketingSaasShell>
);

export default Showcase;
