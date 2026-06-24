import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, LogIn } from "lucide-react";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { supabase } from "@/lib/supabase";
import { fetchClientRecord } from "@/services/clientPlanHelper";
import { fetchSubscriptionPlans } from "@/services/clientService";
import { updateClientPlan } from "@/services/clientAdminService";
import { formatDateIST } from "@/lib/dateFormat";

export default function RecruiterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<Awaited<ReturnType<typeof fetchClientRecord>> | null>(null);
  const [plans, setPlans] = useState<Awaited<ReturnType<typeof fetchSubscriptionPlans>>>([]);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [impersonating, setImpersonating] = useState(false);
  const [overrides, setOverrides] = useState({
    subscription_plan: "",
    max_cv_downloads_per_month: "",
    subscription_end_date: "",
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetchClientRecord(id),
      fetchSubscriptionPlans(),
      supabase.from("profiles").select("id").eq("client_id", id).limit(1).maybeSingle(),
    ])
      .then(([c, p, prof]) => {
        setClient(c);
        setPlans(p);
        setProfileUserId(prof.data?.id ?? null);
        setOverrides({
          subscription_plan: (c.subscription_plan as string) || "",
          max_cv_downloads_per_month: String(c.max_cv_downloads_per_month ?? ""),
          subscription_end_date: (c.subscription_end_date as string)?.slice(0, 10) || "",
        });
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    const { error } = await updateClientPlan(id, {
      subscription_plan: overrides.subscription_plan,
      max_cv_downloads_per_month: Number(overrides.max_cv_downloads_per_month) || 0,
      max_job_postings: client?.max_job_postings as number ?? 10,
      subscription_end_date: overrides.subscription_end_date || null,
    });
    if (error) toast.error(error.message);
    else toast.success("Recruiter updated");
  };

  const handleImpersonate = async () => {
    if (!profileUserId) {
      toast.error("No user profile linked to this recruiter");
      return;
    }
    setImpersonating(true);
    try {
      const { data, error } = await supabase.functions.invoke("impersonate-recruiter", {
        body: { recruiter_user_id: profileUserId },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(String(data.error));
      if (!data?.magic_link) throw new Error("No magic link returned");

      sessionStorage.setItem(
        "admin_impersonation",
        JSON.stringify({ name: data.recruiter_name || client?.company_name })
      );
      window.open(data.magic_link, "_blank");
      toast.success("Opened recruiter session in new tab");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Impersonation failed");
    } finally {
      setImpersonating(false);
    }
  };

  if (loading) {
    return (
      <DashboardPageShell title="Recruiter" description="Loading…">
        <Skeleton className="h-64 w-full" />
      </DashboardPageShell>
    );
  }

  if (!client) {
    return (
      <DashboardPageShell title="Recruiter not found">
        <Button variant="outline" onClick={() => navigate("/dashboard/admin/recruiters")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </DashboardPageShell>
    );
  }

  const plan = client.subscription_plans;
  const features = (plan?.features ?? {}) as Record<string, boolean>;

  return (
    <DashboardPageShell
      title={client.company_name as string}
      description="Manage plan, overrides, and usage"
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/admin/recruiters")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Button size="sm" onClick={() => void handleImpersonate()} disabled={impersonating}>
          <LogIn className="h-4 w-4 mr-1" />
          {impersonating ? "Opening…" : "Login as Recruiter"}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Current plan</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>Plan: <Badge>{plan?.display_name || client.subscription_plan || "—"}</Badge></p>
            <p>Status: {client.subscription_status ?? "—"}</p>
            <p>Valid until: {formatDateIST(client.subscription_end_date as string)}</p>
            <div className="grid gap-2 pt-2">
              <Label>Change plan</Label>
              <Select value={overrides.subscription_plan} onValueChange={(v) => setOverrides((o) => ({ ...o, subscription_plan: v }))}>
                <SelectTrigger><SelectValue placeholder="Plan" /></SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={p.name}>{p.display_name || p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label>CV downloads override / month</Label>
              <Input
                type="number"
                value={overrides.max_cv_downloads_per_month}
                onChange={(e) => setOverrides((o) => ({ ...o, max_cv_downloads_per_month: e.target.value }))}
              />
              <Label>Subscription end date</Label>
              <Input
                type="date"
                value={overrides.subscription_end_date}
                onChange={(e) => setOverrides((o) => ({ ...o, subscription_end_date: e.target.value }))}
              />
              <Button onClick={() => void handleSave()}>Save changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Usage stats</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>CVs downloaded this month: <strong>{client.cv_downloads_used_this_month ?? 0}</strong> / {client.max_cv_downloads_per_month ?? plan?.cv_downloads_per_month ?? "—"}</p>
            <p>Jobs posted: <strong>{client.job_postings_used ?? 0}</strong> / {client.max_job_postings ?? plan?.max_active_jobs ?? "—"}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Feature access (plan defaults)</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                ["Contact details", plan?.can_see_contact_details],
                ["Excel export", plan?.can_export_excel],
                ["Bulk CV download", plan?.can_bulk_download],
                ["NVite", features.can_send_nvite],
                ["Boolean search", features.can_boolean_search !== false],
                ["Radius search", features.can_radius_search],
              ].map(([label, on]) => (
                <Badge key={String(label)} variant={on ? "default" : "outline"}>
                  {label}: {on ? "Yes" : "No"}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
