import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useClientContext } from "@/hooks/useClientContext";
import { fetchSubscriptionPlans, fetchSubscriptionTransactions } from "@/services/clientService";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { CreditCard, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { getClientHomeStats } from "@/services/dashboardService";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function usageColor(used: number, limit: number) {
  if (!limit) return "";
  const pct = used / limit;
  if (pct >= 0.9) return "[&>div]:bg-destructive";
  if (pct >= 0.75) return "[&>div]:bg-warning";
  return "[&>div]:bg-success";
}

const ClientBillingPage = () => {
  const { data: ctx, isLoading } = useClientContext();
  const [plans, setPlans] = useState<any[]>([]);
  const [txns, setTxns] = useState<any[]>([]);
  const [yearly, setYearly] = useState(false);
  const [usageStats, setUsageStats] = useState<Awaited<ReturnType<typeof getClientHomeStats>> | null>(null);

  const client = ctx?.client;
  const plan = client?.subscription_plans;

  useEffect(() => {
    fetchSubscriptionPlans().then(setPlans);
    if (client?.id) {
      fetchSubscriptionTransactions(client.id).then(setTxns);
      getClientHomeStats(client.id).then(setUsageStats);
    }
  }, [client?.id]);

  const loadRazorpay = () =>
    new Promise<void>((resolve) => {
      if (window.Razorpay) { resolve(); return; }
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve();
      document.body.appendChild(s);
    });

  const checkout = async (planId: string, amount: number) => {
    if (!client?.id) return;
    if (plan?.slug === "enterprise") {
      toast.info("Contact us for Enterprise plan");
      return;
    }
    try {
      await loadRazorpay();
      const { data, error } = await supabase.functions.invoke("create-payment-order", {
        body: { plan_id: planId, client_id: client.id, billing_cycle: yearly ? "yearly" : "monthly", amount },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message);

      const rzp = new window.Razorpay!({
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name: "Ellure NexHire",
        handler: async (response: Record<string, string>) => {
          await supabase.functions.invoke("verify-payment", {
            body: { ...response, plan_id: planId, client_id: client.id, billing_cycle: yearly ? "yearly" : "monthly", amount },
          });
          toast.success("Subscription activated!");
          window.location.reload();
        },
      });
      rzp.open();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Payment failed");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const cvUsed = client?.cv_downloads_used_this_month ?? 0;
  const cvLimit = plan?.cv_downloads_per_month ?? 0;
  const jobsUsed = usageStats?.activeJobs ?? 0;
  const jobsLimit = plan?.max_active_jobs ?? 0;
  const teamUsed = usageStats?.teamMembers ?? 0;
  const teamLimit = plan?.max_team_members ?? 0;

  const end = client?.subscription_end_date ? new Date(client.subscription_end_date) : null;
  const daysRemaining = end ? Math.ceil((end.getTime() - Date.now()) / 86400000) : null;

  const statusVariant = (s: string) => {
    if (s === "completed" || s === "paid") return "default";
    if (s === "pending") return "secondary";
    return "destructive";
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Billing & Subscription</h1>

      <Card className="bg-[var(--surface-1)] border-[var(--surface-border)]">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            {plan?.name || "No plan"}
            <Badge variant={client?.subscription_status === "active" ? "default" : "secondary"}>
              {client?.subscription_status || "trial"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {client?.subscription_start_date && client?.subscription_end_date
              ? `${new Date(client.subscription_start_date).toLocaleDateString()} – ${new Date(client.subscription_end_date).toLocaleDateString()}`
              : "No billing period on file"}
          </p>
          {daysRemaining != null && (
            <p className={cn("text-sm font-medium", daysRemaining <= 7 ? "text-destructive" : daysRemaining <= 30 ? "text-orange-500" : "text-success")}>
              {daysRemaining < 0 ? "Expired" : `${daysRemaining} days remaining`}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[var(--surface-1)] border-[var(--surface-border)]">
        <CardHeader><CardTitle className="text-base">Usage this period</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-1"><span>CV Downloads</span><span>{cvUsed} / {cvLimit || "∞"}</span></div>
            <Progress value={cvLimit ? (cvUsed / cvLimit) * 100 : 0} className={usageColor(cvUsed, cvLimit)} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1"><span>Job Postings</span><span>{jobsUsed} / {jobsLimit || "∞"}</span></div>
            <Progress value={jobsLimit ? (jobsUsed / jobsLimit) * 100 : 0} className={usageColor(jobsUsed, jobsLimit)} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1"><span>Team Members</span><span>{teamUsed} / {teamLimit || "∞"}</span></div>
            <Progress value={teamLimit ? (teamUsed / teamLimit) * 100 : 0} className={usageColor(teamUsed, teamLimit)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <Button variant={!yearly ? "default" : "outline"} size="sm" onClick={() => setYearly(false)}>Monthly</Button>
        <Button variant={yearly ? "default" : "outline"} size="sm" onClick={() => setYearly(true)}>Yearly</Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Compare plans</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.filter((p) => p.slug !== "enterprise").map((p) => (
            <Card key={p.id} className={cn("bg-[var(--surface-1)]", plan?.id === p.id && "border-primary ring-1 ring-primary")}>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold">{p.name}</h3>
                {plan?.id === p.id && <Badge>Current</Badge>}
                <p className="text-2xl font-bold">₹{yearly ? p.price_yearly : p.price_monthly}</p>
                <p className="text-xs text-muted-foreground">{p.cv_downloads_per_month} CVs · {p.max_active_jobs} jobs</p>
                <Button
                  className="w-full"
                  variant={plan?.id === p.id ? "outline" : "default"}
                  disabled={plan?.id === p.id}
                  onClick={() => checkout(p.id, yearly ? p.price_yearly : p.price_monthly)}
                >
                  {plan?.id === p.id ? "Current Plan" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          ))}
          <Card className="bg-[var(--surface-1)]">
            <CardContent className="p-4">
              <h3 className="font-semibold">Enterprise</h3>
              <p className="text-sm text-muted-foreground mt-2">Custom limits and support</p>
              <Button variant="link" className="px-0" asChild><Link to="/contact">Contact us</Link></Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-[var(--surface-1)] border-[var(--surface-border)]">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Receipt className="h-4 w-4" /> Transaction History</CardTitle></CardHeader>
        <CardContent>
          {txns.length === 0 ? (
            <EmptyState icon={CreditCard} title="No transactions" description="Your payment history will appear here." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txns.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{new Date(t.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{t.subscription_plans?.name || "—"}</TableCell>
                    <TableCell>₹{t.amount}</TableCell>
                    <TableCell><Badge variant={statusVariant(t.status)}>{t.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientBillingPage;
