import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Mail } from "lucide-react";
import { fetchSubscriptionPlans } from "@/services/clientService";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { BharatGoSectionHeader } from "@/components/marketing/bharatgo/BharatGoSectionHeader";

interface PlanRow {
  id: string;
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly: number;
  cv_downloads_per_month: number;
  max_active_jobs: number;
  max_team_members: number;
  max_saved_searches?: number;
}

type MarketingPlanCard = {
  slug: "free" | "pro";
  name: string;
  description: string;
  priceLabel: string;
  priceNote?: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
  tone: string;
};

const defaultPlans: MarketingPlanCard[] = [
  {
    slug: "free",
    name: "Free",
    description: "For candidates and teams getting started",
    priceLabel: "₹0",
    priceNote: "Forever free for applicants",
    features: [
      "Applicant profile & dashboard",
      "Apply to opportunities",
      "Document uploads",
      "Basic profile visibility",
      "Email support",
    ],
    cta: "Create free account",
    ctaHref: "/auth/register",
    tone: "border-[#d4e2fc] bg-[#E9F0FF]",
  },
  {
    slug: "pro",
    name: "Pro",
    description: "For employers hiring at scale",
    priceLabel: "₹4,999",
    priceNote: "Per month · billed monthly",
    features: [
      "AI resume search & shortlists",
      "50 CV downloads / month",
      "10 active job postings",
      "3 team member seats",
      "Client folders & collaboration",
      "Priority support",
    ],
    cta: "Start hiring",
    ctaHref: "/client/auth/signup",
    highlighted: true,
    tone: "border-primary bg-white",
  },
];

function mergePlanFromApi(card: MarketingPlanCard, api?: PlanRow): MarketingPlanCard {
  if (!api) return card;
  const isFree = api.slug === "free" || api.price_monthly === 0;
  return {
    ...card,
    name: api.name || card.name,
    priceLabel: isFree ? "₹0" : `₹${api.price_monthly.toLocaleString("en-IN")}`,
    priceNote: isFree ? card.priceNote : "Per month · billed monthly",
    features: [
      isFree
        ? "Applicant profile & dashboard"
        : `${api.cv_downloads_per_month} CV downloads / month`,
      isFree ? "Apply to opportunities" : `${api.max_active_jobs} active job postings`,
      isFree ? "Document uploads" : `${api.max_team_members} team member seats`,
      isFree ? "Basic profile visibility" : "AI resume search & shortlists",
      isFree ? "Email support" : "Client folders & collaboration",
    ],
  };
}

interface PricingSectionProps {
  className?: string;
}

export function PricingSection({ className }: PricingSectionProps) {
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionPlans()
      .then((data) => setPlans((data || []) as PlanRow[]))
      .finally(() => setLoading(false));
  }, []);

  const apiFree = plans.find((p) => p.slug === "free" || p.price_monthly === 0);
  const apiPro = plans.find((p) => p.slug === "pro" || p.slug === "professional");
  const displayPlans = [
    mergePlanFromApi(defaultPlans[0], apiFree),
    mergePlanFromApi(defaultPlans[1], apiPro),
  ];

  return (
    <section className={cn("bharatgo-section py-16 sm:py-20", className)}>
      <div className="container px-4 sm:px-6">
        <BharatGoSectionHeader
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          subtitle="Start free as a candidate or upgrade to Pro when you're ready to hire."
        />

        {loading ? (
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-[420px] rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            {displayPlans.map((plan) => (
              <Card
                key={plan.slug}
                className={cn(
                  "relative rounded-2xl border-2 shadow-sm",
                  plan.tone,
                  plan.highlighted && "border-primary bg-white pt-2 shadow-lg ring-2 ring-primary/25"
                )}
              >
                {plan.highlighted ? (
                  <div className="flex justify-center px-4 pt-4">
                    <Badge className="rounded-full bg-primary px-4 py-1 text-primary-foreground shadow-md">
                      Most popular
                    </Badge>
                  </div>
                ) : null}
                <CardContent
                  className={cn("flex h-full flex-col p-6 sm:p-8", plan.highlighted && "pt-4")}
                >
                  <div>
                    <h3 className="font-poppins text-xl font-bold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="mt-6">
                    <p className="font-poppins text-4xl font-bold tracking-tight text-foreground">
                      {plan.priceLabel}
                      {plan.slug === "pro" ? (
                        <span className="text-base font-normal text-muted-foreground">/mo</span>
                      ) : null}
                    </p>
                    {plan.priceNote ? (
                      <p className="mt-1 text-xs text-muted-foreground">{plan.priceNote}</p>
                    ) : null}
                  </div>
                  <ul className="mt-6 flex-1 space-y-3 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={cn("mt-8 h-11 w-full rounded-full font-semibold", plan.highlighted && "shadow-md")}
                    variant={plan.highlighted ? "default" : "outline"}
                    asChild
                  >
                    <Link to={plan.ctaHref}>
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border bg-[#FDF0E9]">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left sm:p-8">
            <div>
              <p className="font-poppins text-lg font-bold text-foreground">Custom plan</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Need higher limits, SSO, bulk hiring, or enterprise controls? We&apos;ll tailor a package for your
                team.
              </p>
            </div>
            <Button variant="outline" className="h-11 shrink-0 rounded-full border-primary px-6 font-semibold" asChild>
              <Link to="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Contact our team
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
