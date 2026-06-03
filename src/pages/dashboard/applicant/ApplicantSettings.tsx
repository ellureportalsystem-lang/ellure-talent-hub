import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Key, Loader2, Monitor, Moon, Sun, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { applyPortalTheme, resolvePortalTheme, setStoredPortalTheme, type PortalTheme } from "@/lib/portalTheme";

const ApplicantSettings = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingContact, setSavingContact] = useState(false);
  const [pw, setPw] = useState({ next: "", confirm: "" });
  const [savingPw, setSavingPw] = useState(false);
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
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
      .select("phone, full_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        setPhone((data?.phone as string) || "");
        setFullName((data?.full_name as string) || profile?.full_name || "");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [user?.id, profile?.full_name]);

  useEffect(() => {
    setPortalTheme(resolvePortalTheme());
  }, []);

  const setTheme = (next: PortalTheme) => {
    setStoredPortalTheme(next);
    applyPortalTheme(next);
    setPortalTheme(next);
    toast.success(`Theme set to ${next}`);
  };

  const saveContact = async () => {
    if (!user?.id) return;
    setSavingContact(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ phone: phone || null, full_name: fullName || null, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (error) throw error;
      await refreshProfile?.();
      toast.success("Profile updated");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSavingContact(false);
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
      <div className="p-6 max-w-xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Account details and password</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Theme is applied across your dashboard.</CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>Email comes from signup and cannot be changed here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile?.email || user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="as-name">Full name</Label>
            <Input id="as-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="as-phone">Phone</Label>
            <Input id="as-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Separator />
          <Button onClick={() => void saveContact()} disabled={savingContact}>
            {savingContact ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password
          </CardTitle>
          <CardDescription>Choose a strong password you have not reused elsewhere.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="pw1">New password</Label>
            <Input id="pw1" type="password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} autoComplete="new-password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw2">Confirm</Label>
            <Input id="pw2" type="password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} autoComplete="new-password" />
          </div>
          <Button variant="secondary" onClick={() => void updatePassword()} disabled={savingPw}>
            {savingPw ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Update password
          </Button>
          <p className="text-xs text-muted-foreground">
            Lost access?{" "}
            <Link to="/auth/forgot-password" className="text-primary underline-offset-4 hover:underline">
              Reset via email
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicantSettings;
