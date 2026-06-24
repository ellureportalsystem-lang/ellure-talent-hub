import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { NaukriAuthLayout } from "@/components/auth/NaukriAuthLayout";
import { GuestAuthRoute } from "@/components/auth/GuestAuthRoute";
import { PORTAL_ROUTES } from "@/lib/portalRoutes";

async function fetchClientIp(): Promise<string> {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip || "unknown";
  } catch {
    return "unknown";
  }
}

function AdminLoginForm() {
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");
    return () => meta?.setAttribute("content", "index, follow");
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rateLimited, setRateLimited] = useState(false);
  const [retryMinutes, setRetryMinutes] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, refreshProfile } = useAuth();

  const checkRateLimit = useCallback(async () => {
    const ip = await fetchClientIp();
    const { data, error } = await supabase.functions.invoke("check-rate-limit", {
      body: { ip, action: "admin_login" },
    });
    if (error || !data) return true;
    if (data.blocked) {
      setRateLimited(true);
      setRetryMinutes(Math.ceil((data.retry_after_seconds ?? 900) / 60));
      return false;
    }
    setRateLimited(false);
    return true;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rateLimited) return;

    setIsLoading(true);
    try {
      const allowed = await checkRateLimit();
      if (!allowed) {
        toast({
          title: "Too many attempts",
          description: `Try again in ${retryMinutes || 15} minutes.`,
          variant: "destructive",
        });
        return;
      }

      const result = await signIn(email, password);
      if (result.error) {
        toast({ title: "Login failed", description: result.error.message, variant: "destructive" });
        return;
      }

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        toast({ title: "Error", description: "Failed to get user.", variant: "destructive" });
        return;
      }

      let updatedProfile = null;
      try {
        const { data } = await supabase.from("profiles").select("*").eq("id", authUser.id).maybeSingle();
        updatedProfile = data;
      } catch {
        updatedProfile = await refreshProfile();
      }

      if (!updatedProfile) {
        toast({ title: "Error", description: "Profile not found.", variant: "destructive" });
        return;
      }

      if (updatedProfile.role !== "admin") {
        toast({ title: "Access denied", description: "This account does not have admin access.", variant: "destructive" });
        return;
      }

      toast({ title: "Welcome back!" });
      navigate(PORTAL_ROUTES.admin.dashboard);
    } catch (error: unknown) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Login failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NaukriAuthLayout
      title="Admin Login"
      portalBadge="Secure"
      welcomeMessage="Welcome back, admin."
      subtitle="Restricted — Ellure internal operations only"
      cartoonVariant="admin"
      promoTitle="Portal operations"
      promoTagline="Ellure TalentHub — secure internal operations console"
      promoItems={[
        "Import candidates and bulk resumes",
        "Manage recruiter accounts and subscriptions",
        "Platform analytics and audit trail",
        "All admin actions are logged",
      ]}
      footerLinks={[
        { label: "Recruiter login", to: PORTAL_ROUTES.recruiter.login },
        { label: "Candidate login", to: PORTAL_ROUTES.candidate.login },
        { label: "All portals", to: PORTAL_ROUTES.hub },
      ]}
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-email" className="text-xs text-slate-500">Admin Email</Label>
          <Input
            id="admin-email"
            type="email"
            placeholder="admin@ellureconsulting.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-blue-50/40"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password" className="text-xs text-slate-500">Password</Label>
          <div className="relative">
            <Input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-blue-50/40 pr-16"
              required
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#0566CD]" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {import.meta.env.DEV && (
            <p className="text-[11px] text-slate-500 rounded bg-slate-50 p-2 border">
              Dev: <code>vishal5952v@gmail.com</code> / <code>Admin@123</code> or demo{" "}
              <code>admin@ellureconsulting.com</code> / <code>admin@123</code>
            </p>
          )}
        </div>
        <Button type="submit" className="w-full h-11 bg-[#0566CD] hover:bg-[#0066c0] font-semibold" disabled={isLoading || rateLimited}>
          {rateLimited
            ? `Locked — retry in ${retryMinutes} min`
            : isLoading
              ? "Authenticating…"
              : "Login"}
        </Button>
        {rateLimited && (
          <p className="text-center text-sm text-red-600">
            Too many login attempts. Try again in {retryMinutes} minutes.
          </p>
        )}
        <p className="text-center text-sm text-slate-600">
          Need access?{" "}
          <Link to={PORTAL_ROUTES.admin.signup} className="text-[#0566CD] hover:underline">
            Request admin access
          </Link>
        </p>
      </form>
    </NaukriAuthLayout>
  );
}

export default function AdminLogin() {
  return (
    <GuestAuthRoute expectedRole="admin">
      <AdminLoginForm />
    </GuestAuthRoute>
  );
}
