import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { fetchSubscriptionPlans } from "@/services/clientService";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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

interface PricingSectionProps {
  showComparison?: boolean;
  className?: string;
}

export function PricingSection({ showComparison = false, className }: PricingSectionProps) {
  const [yearly, setYearly] = useState(false);
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionPlans()
      .then((data) => setPlans((data || []) as PlanRow[]))
      .finally(() => setLoading(false));
  }, []);

  const features = ["CV Downloads", "Active Jobs", "Team Members", "Saved Searches"];

  return (
    <section className={cn("py-16", className)}>
      <div className="container px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-heading)]">Simple, transparent pricing</h2>
          <p className="text-muted-foreground mt-2">Choose the plan that fits your hiring volume</p>
          <div className="flex justify-center gap-2 mt-6">
            <Button variant={!yearly ? "default" : "outline"} size="sm" onClick={() => setYearly(false)}>Monthly</Button>
            <Button variant={yearly ? "default" : "outline"} size="sm" onClick={() => setYearly(true)}>Yearly <Badge variant="secondary" className="ml-1">-20%</Badge></Button>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-80" />)}</div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {plans.filter((p) => p.slug !== "enterprise").map((p, idx) => (
              <Card key={p.id} className={cn("relative", idx === 1 && "border-primary ring-2 ring-primary/20 shadow-lg")}>
                {idx === 1 && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <p className="text-3xl font-bold">
                    ₹{yearly ? Math.round(p.price_yearly / 12) : p.price_monthly}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                  {yearly && <p className="text-xs text-muted-foreground">Billed ₹{p.price_yearly} yearly</p>}
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0" />{p.cv_downloads_per_month} CV downloads/mo</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0" />{p.max_active_jobs} active jobs</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0" />{p.max_team_members} team seats</li>
                  </ul>
                  <Button className="w-full" asChild>
                    <Link to="/client/auth/signup">{p.slug === "free" ? "Get Started" : "Start Hiring"}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Enterprise</h3>
                <p className="text-muted-foreground text-sm">Custom limits, SSO, dedicated support</p>
                <Button variant="outline" className="w-full" asChild><Link to="/contact">Contact Sales</Link></Button>
              </CardContent>
            </Card>
          </div>
        )}

        {showComparison && !loading && plans.length > 0 && (
          <div className="mt-12 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Feature</th>
                  {plans.filter((p) => p.slug !== "enterprise").map((p) => (
                    <th key={p.id} className="p-3 text-center">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: features[0], key: "cv_downloads_per_month" as const },
                  { label: features[1], key: "max_active_jobs" as const },
                  { label: features[2], key: "max_team_members" as const },
                ].map((row) => (
                  <tr key={row.label} className="border-b">
                    <td className="p-3 font-medium">{row.label}</td>
                    {plans.filter((p) => p.slug !== "enterprise").map((p) => (
                      <td key={p.id} className="p-3 text-center">{p[row.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
