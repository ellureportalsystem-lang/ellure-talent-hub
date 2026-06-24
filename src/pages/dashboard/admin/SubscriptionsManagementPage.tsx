import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { CreditCard, Plus, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { enrichSubscriptionPlan } from "@/services/clientPlanHelper";

type PlanRow = ReturnType<typeof enrichSubscriptionPlan> & { id: string; is_active?: boolean | null };

const emptyForm = {
  name: "",
  display_name: "",
  price_monthly: "",
  price_yearly: "",
  max_cv_downloads: "",
  max_job_postings: "",
  max_team_members: "",
  max_saved_searches: "",
  can_export_excel: false,
  can_see_contact_details: false,
  can_bulk_download: false,
  can_send_nvite: false,
  can_boolean_search: true,
  can_radius_search: false,
};

export default function SubscriptionsManagementPage() {
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PlanRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("subscription_plans").select("*").order("price_monthly");
    if (error) toast.error(error.message);
    else setPlans((data ?? []).map((r) => enrichSubscriptionPlan(r as Record<string, unknown>) as PlanRow));
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const openEdit = (plan: PlanRow) => {
    const f = (plan.features ?? {}) as Record<string, boolean>;
    setEditing(plan);
    setForm({
      name: plan.name,
      display_name: plan.display_name || "",
      price_monthly: String(plan.price_monthly ?? ""),
      price_yearly: String(plan.price_yearly ?? ""),
      max_cv_downloads: String(plan.max_cv_downloads ?? ""),
      max_job_postings: String(plan.max_job_postings ?? ""),
      max_team_members: String(plan.max_team_members ?? ""),
      max_saved_searches: String(plan.max_saved_searches ?? ""),
      can_export_excel: plan.can_export_excel === true,
      can_see_contact_details: plan.can_see_contact_details === true,
      can_bulk_download: plan.can_bulk_download === true,
      can_send_nvite: f.can_send_nvite === true,
      can_boolean_search: f.can_boolean_search !== false,
      can_radius_search: f.can_radius_search === true,
    });
    setOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      display_name: form.display_name.trim() || form.name.trim(),
      price_monthly: Number(form.price_monthly) || 0,
      price_yearly: Number(form.price_yearly) || 0,
      max_cv_downloads: Number(form.max_cv_downloads) || 0,
      max_job_postings: Number(form.max_job_postings) || 0,
      max_team_members: Number(form.max_team_members) || 1,
      max_saved_searches: Number(form.max_saved_searches) || 5,
      can_export_excel: form.can_export_excel,
      can_see_contact_details: form.can_see_contact_details,
      can_bulk_download: form.can_bulk_download,
      is_active: true,
      features: {
        can_send_nvite: form.can_send_nvite,
        can_boolean_search: form.can_boolean_search,
        can_radius_search: form.can_radius_search,
      },
    };

    const { error } = editing
      ? await supabase.from("subscription_plans").update(payload).eq("id", editing.id)
      : await supabase.from("subscription_plans").insert(payload);

    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Plan updated" : "Plan created");
      setOpen(false);
      void load();
    }
  };

  return (
    <DashboardPageShell title="Subscription plans" description="Manage plan templates, limits, and feature flags." icon={CreditCard}>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> New plan</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit plan" : "Create plan"}</DialogTitle></DialogHeader>
            <div className="grid gap-3 text-sm">
              <div><Label>Name (slug)</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} disabled={!!editing} /></div>
              <div><Label>Display name</Label><Input value={form.display_name} onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Price monthly (₹)</Label><Input type="number" value={form.price_monthly} onChange={(e) => setForm((f) => ({ ...f, price_monthly: e.target.value }))} /></div>
                <div><Label>Price yearly (₹)</Label><Input type="number" value={form.price_yearly} onChange={(e) => setForm((f) => ({ ...f, price_yearly: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Max CV downloads</Label><Input type="number" value={form.max_cv_downloads} onChange={(e) => setForm((f) => ({ ...f, max_cv_downloads: e.target.value }))} /></div>
                <div><Label>Max job postings</Label><Input type="number" value={form.max_job_postings} onChange={(e) => setForm((f) => ({ ...f, max_job_postings: e.target.value }))} /></div>
                <div><Label>Max team members</Label><Input type="number" value={form.max_team_members} onChange={(e) => setForm((f) => ({ ...f, max_team_members: e.target.value }))} /></div>
                <div><Label>Max saved searches</Label><Input type="number" value={form.max_saved_searches} onChange={(e) => setForm((f) => ({ ...f, max_saved_searches: e.target.value }))} /></div>
              </div>
              {[
                ["can_export_excel", "Excel export"],
                ["can_see_contact_details", "See contact details"],
                ["can_bulk_download", "Bulk CV download"],
                ["can_send_nvite", "NVite mass mail"],
                ["can_boolean_search", "Boolean search"],
                ["can_radius_search", "Radius search"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center justify-between">
                  <span>{label}</span>
                  <Switch
                    checked={(form as Record<string, boolean>)[key]}
                    onCheckedChange={(c) => setForm((f) => ({ ...f, [key]: c }))}
                  />
                </label>
              ))}
              <Button onClick={() => void handleSave()} disabled={saving}>{saving ? "Saving…" : "Save plan"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const f = (plan.features ?? {}) as Record<string, boolean>;
            return (
              <Card key={plan.id}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <CardTitle className="text-base">{plan.display_name || plan.name}</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(plan)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="text-lg font-bold text-[#0566CD]">₹{plan.price_monthly ?? 0}<span className="text-xs font-normal text-slate-500">/mo</span></p>
                  <p className="text-xs text-slate-500">₹{plan.price_yearly ?? 0}/yr</p>
                  <ul className="text-xs text-slate-600 space-y-0.5">
                    <li>{plan.max_cv_downloads} CV downloads/mo</li>
                    <li>{plan.max_job_postings} job postings</li>
                    <li>{plan.max_saved_searches} saved searches</li>
                    <li>{plan.max_team_members} team members</li>
                  </ul>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {plan.can_see_contact_details && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">Contacts</span>}
                    {plan.can_export_excel && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">Excel</span>}
                    {f.can_send_nvite && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">NVite</span>}
                    {f.can_boolean_search !== false && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">Boolean</span>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardPageShell>
  );
}
