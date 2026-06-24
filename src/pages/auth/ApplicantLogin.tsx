import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { validatePortalAccess } from "@/services/portalAuthService";
import { normalizeLoginEmail } from "@/lib/resolveSignInEmail";
import { NaukriAuthLayout } from "@/components/auth/NaukriAuthLayout";
import { GuestAuthRoute } from "@/components/auth/GuestAuthRoute";
import { PORTAL_ROUTES } from "@/lib/portalRoutes";

function ApplicantLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { signIn, signInWithPhone, user, profile, loading: authLoading, signOut, refreshProfile } = useAuth();

  useEffect(() => {
    if (searchParams.get("reason") === "timeout") {
      toast({ title: "Session ended", description: "You were logged out due to inactivity." });
    }
  }, [searchParams, toast]);

  useEffect(() => {
    if (authLoading) return;
    if (user && profile?.role === "applicant") {
      navigate(PORTAL_ROUTES.candidate.dashboard, { replace: true });
    }
  }, [authLoading, user, profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (activeTab === "email") {
        if (!email || !password) {
          toast({ title: "Missing fields", variant: "destructive" });
          return;
        }
        const loginEmail = normalizeLoginEmail(email);
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email?.toLowerCase() === loginEmail) {
          navigate(PORTAL_ROUTES.candidate.dashboard, { replace: true });
          return;
        }
        if (session?.user && session.user.email?.toLowerCase() !== loginEmail) {
          await signOut();
        }
      } else if (!phone || !password) {
        toast({ title: "Missing fields", variant: "destructive" });
        return;
      }

      const result =
        activeTab === "email"
          ? await signIn(email, password, "applicant")
          : await signInWithPhone(phone, password);

      if (result.error) {
        toast({ title: "Login failed", description: result.error.message, variant: "destructive" });
        return;
      }

      const updatedProfile = await refreshProfile();
      if (updatedProfile) {
        const access = await validatePortalAccess(updatedProfile, "applicant");
        if (!access.ok) {
          await signOut();
          toast({ title: "Wrong portal", description: access.message, variant: "destructive" });
          return;
        }
      }

      toast({ title: "Welcome back!" });
      navigate(PORTAL_ROUTES.candidate.dashboard, { replace: true });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordField = (id: string) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor={id} className="text-xs text-slate-500">Password</Label>
        <Link to="/auth/forgot-password" className="text-xs text-[#0566CD] hover:underline">Forgot Password?</Link>
      </div>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 bg-blue-50/40 pr-16"
          required
        />
        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#0566CD]" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );

  return (
    <NaukriAuthLayout
      title="Candidate Login"
      welcomeMessage="Welcome back! Great to see you again."
      subtitle="Find your dream job on Ellure TalentHub"
      cartoonVariant="candidate"
      promoTitle="New to Ellure TalentHub?"
      promoItems={[
        "One-click apply using your TalentHub profile",
        "Get relevant job recommendations",
        "Showcase profile to top companies",
        "Track application status on applied jobs",
      ]}
      promoCta={{ label: "Register for Free", to: PORTAL_ROUTES.candidate.register }}
      footerLinks={[
        { label: "Recruiter login", to: PORTAL_ROUTES.recruiter.login },
        { label: "Admin login", to: PORTAL_ROUTES.admin.login },
        { label: "All portals", to: PORTAL_ROUTES.hub },
      ]}
    >
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "email" | "phone")}>
        <TabsList className="grid w-full grid-cols-2 mb-4 h-9">
          <TabsTrigger value="email" className="text-xs"><Mail className="mr-1 h-3.5 w-3.5" />Email</TabsTrigger>
          <TabsTrigger value="phone" className="text-xs"><Phone className="mr-1 h-3.5 w-3.5" />Phone</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-slate-500">Email ID / Username</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 bg-blue-50/40" required />
            </div>
            {passwordField("password-email")}
            <Button type="submit" className="w-full h-11 bg-[#0566CD] hover:bg-[#0066c0] font-semibold" disabled={isLoading}>
              {isLoading ? "Signing in…" : "Login"}
            </Button>
            <p className="text-center text-sm text-[#0566CD] hover:underline cursor-pointer">Use OTP to Login</p>
          </form>
        </TabsContent>
        <TabsContent value="phone">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs text-slate-500">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 bg-blue-50/40" required />
            </div>
            {passwordField("password-phone")}
            <Button type="submit" className="w-full h-11 bg-[#0566CD] hover:bg-[#0066c0] font-semibold" disabled={isLoading}>
              {isLoading ? "Signing in…" : "Login"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
      <p className="mt-4 text-center text-sm text-slate-600">
        New user?{" "}
        <Link to={PORTAL_ROUTES.candidate.register} className="text-[#0566CD] font-medium hover:underline">
          Register for free
        </Link>
      </p>
    </NaukriAuthLayout>
  );
}

export default function ApplicantLogin() {
  return (
    <GuestAuthRoute expectedRole="applicant">
      <ApplicantLoginForm />
    </GuestAuthRoute>
  );
}
