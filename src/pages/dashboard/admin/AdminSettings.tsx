import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Key, Loader2, Monitor, Moon, Sun, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { applyPortalTheme, resolvePortalTheme, setStoredPortalTheme, type PortalTheme } from "@/lib/portalTheme";

const AdminSettings = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [pw, setPw] = useState({ next: "", confirm: "" });
  const [savingPw, setSavingPw] = useState(false);
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [portalTheme, setPortalTheme] = useState<PortalTheme>(() =>
    typeof window !== "undefined" ? resolvePortalTheme() : "light"
  );

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    let alive = true;
    void supabase
      .from("profiles")
      .select("full_name, display_name, phone")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        setFullName((data?.full_name as string) || profile?.full_name || "");
        setDisplayName((data?.display_name as string) || profile?.display_name || "");
        setPhone((data?.phone as string) || profile?.phone || "");
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [user?.id, profile?.full_name, profile?.display_name, profile?.phone]);

  useEffect(() => {
    setPortalTheme(resolvePortalTheme());
  }, []);

  const setTheme = (next: PortalTheme) => {
    setStoredPortalTheme(next);
    applyPortalTheme(next);
    setPortalTheme(next);
    toast.success(`Theme set to ${next}`);
  };

  const saveProfile = async () => {
    if (!user?.id) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || null,
          display_name: displayName.trim() || null,
          phone: phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (error) throw error;
      await refreshProfile();
      toast.success("Profile saved");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSavingProfile(false);
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

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full max-w-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin settings</h1>
        <p className="text-muted-foreground">Your administrator profile — automations run through Supabase Edge Functions.</p>
      </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Theme is applied across the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={portalTheme === "light" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setTheme("light")}
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </Button>
              <Button
                type="button"
                variant={portalTheme === "dark" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setTheme("dark")}
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </Button>
            </div>
          </CardContent>
        </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>Displayed internally; email comes from authentication.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile?.email || user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adm-fn">Full name</Label>
            <Input id="adm-fn" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adm-dn">Display name</Label>
            <Input id="adm-dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adm-ph">Phone</Label>
            <Input id="adm-ph" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Separator />
          <Button onClick={() => void saveProfile()} disabled={savingProfile}>
            {savingProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save profile
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Platform operations
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            Webhooks, scheduled jobs (crons), and transactional email deploy as Supabase Edge Functions. Configure secrets
            such as{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">RESEND_API_KEY</code> and{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">SITE_URL</code> in the Supabase project dashboard, then deploy
            each folder under <code className="text-xs bg-muted px-1 py-0.5 rounded">supabase/functions</code>.
          </p>
          <p>Add database webhooks in the Supabase Dashboard so rows in applicants, job applications, clients, or messages call your function URLs.</p>
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
            <Label htmlFor="a-np">New password</Label>
            <Input id="a-np" type="password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} autoComplete="new-password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="a-cp">Confirm</Label>
            <Input id="a-cp" type="password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} autoComplete="new-password" />
          </div>
          <Button variant="secondary" onClick={() => void updatePassword()} disabled={savingPw}>
            {savingPw ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Update password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
