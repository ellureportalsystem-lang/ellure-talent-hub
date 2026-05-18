import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Building2, Key, HelpCircle, Loader2 } from "lucide-react";
import { HRFAQs } from "@/components/HRFAQs";
import { useClientContext } from "@/hooks/useClientContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

function formatIsoDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" });
  } catch {
    return "—";
  }
}

const ClientSettings = () => {
  const queryClient = useQueryClient();
  const { data: ctx, isLoading } = useClientContext();
  const client = ctx?.client;
  const plan = client?.subscription_plans as
    | { name?: string; slug?: string; cv_downloads_per_month?: number }
    | undefined;

  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [savingCompany, setSavingCompany] = useState(false);

  const [pw, setPw] = useState({ next: "", confirm: "" });
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (!client) return;
    setCompanyName(client.company_name || "");
    setContactPerson(client.contact_person || "");
    setPhone(client.phone || "");
  }, [client?.id]);

  const saveCompany = async () => {
    if (!client?.id) return;
    setSavingCompany(true);
    try {
      const { error } = await supabase
        .from("clients")
        .update({
          company_name: companyName.trim(),
          contact_person: contactPerson.trim() || null,
          phone: phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", client.id);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["client-context"] });
      toast.success("Company profile saved");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingCompany(false);
    }
  };

  const updatePassword = async () => {
    if (pw.next.length < 8) {
      toast.error("Use at least 8 characters");
      return;
    }
    if (pw.next !== pw.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setSavingPw(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw.next });
      if (error) throw error;
      setPw({ next: "", confirm: "" });
      toast.success("Password updated");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Password update failed");
    } finally {
      setSavingPw(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6 space-y-2">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">No client workspace is linked to this account.</p>
      </div>
    );
  }

  const statusVariant =
    client.subscription_status === "active" ? "default" : client.subscription_status === "past_due" ? "destructive" : "secondary";

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your company profile and account security</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company name</Label>
            <Input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-person">Contact person</Label>
            <Input id="contact-person" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Billing / login email</Label>
            <Input id="email" type="email" value={client.email} disabled />
            <p className="text-xs text-muted-foreground">To change login email, contact your Ellure administrator.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Separator />
          <Button onClick={() => void saveCompany()} disabled={savingCompany}>
            {savingCompany ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save changes
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{plan?.name || client.subscription_plan}</p>
              <p className="text-sm text-muted-foreground">Plan details and upgrades are handled on the billing page.</p>
            </div>
            <Badge variant={statusVariant}>{client.subscription_status || "unknown"}</Badge>
          </div>
          <Separator />
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Current period started</p>
              <p className="font-medium">{formatIsoDate(client.subscription_start_date)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Renews / ends</p>
              <p className="font-medium">{formatIsoDate(client.subscription_end_date)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Applicants (legacy counters)</p>
              <p className="font-medium">
                {(client.used_applicants ?? 0).toLocaleString()}
                {client.max_applicants != null ? ` / ${client.max_applicants.toLocaleString()}` : ""}
              </p>
            </div>
          </div>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/dashboard/client/billing">Open billing &amp; invoices</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Match and application notifications follow your subscriptions, saved searches, and messages. Tune saved searches
            from <Link to="/dashboard/client/candidates" className="text-primary underline-offset-4 hover:underline">Candidates</Link>
            {""} and checkout shortlist activity under{" "}
            <Link to="/dashboard/client/folders" className="text-primary underline-offset-4 hover:underline">My Shortlists</Link>.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="npw">New password</Label>
            <Input id="npw" type="password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} autoComplete="new-password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpw">Confirm</Label>
            <Input id="cpw" type="password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} autoComplete="new-password" />
          </div>
          <Button variant="secondary" onClick={() => void updatePassword()} disabled={savingPw}>
            {savingPw ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Update password
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Help & support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HRFAQs />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSettings;
