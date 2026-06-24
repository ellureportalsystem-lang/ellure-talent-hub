import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { NaukriAuthLayout } from "@/components/auth/NaukriAuthLayout";
import { GuestAuthRoute } from "@/components/auth/GuestAuthRoute";
import { PORTAL_ROUTES } from "@/lib/portalRoutes";

const DEMO_RECRUITER_EMAIL = "client.infosys@ellureconsulting.com";

function RecruiterLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, refreshProfile } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn(email, password);
      if (result.error) {
        toast({ title: "Login failed", description: result.error.message, variant: "destructive" });
        return;
      }
      const updatedProfile = await refreshProfile();
      if (!updatedProfile) {
        toast({ title: "Error", description: "Profile not found.", variant: "destructive" });
        return;
      }
      if (updatedProfile.role !== "client") {
        toast({
          title: "Wrong portal",
          description: `This account is "${updatedProfile.role}". Use the correct portal login.`,
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Welcome back!", description: "Opening recruiter dashboard…" });
      navigate(PORTAL_ROUTES.recruiter.dashboard);
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

  return (
    <NaukriAuthLayout
      title="Recruiter Login"
      portalBadge="Resdex"
      welcomeMessage="Welcome back, recruiter!"
      subtitle="Access Resdex, NVite, Jobs & Responses"
      cartoonVariant="recruiter"
      promoTitle="Hire with Ellure TalentHub"
      promoItems={[
        "Search millions of verified candidate profiles with Resdex",
        "Send NVite mass-mail campaigns to shortlisted talent",
        "Post jobs and manage responses in one place",
        "Track quota usage and team hiring activity",
      ]}
      promoCta={{ label: "Request recruiter access", to: PORTAL_ROUTES.recruiter.signup }}
      footerLinks={[
        { label: "Candidate login", to: PORTAL_ROUTES.candidate.login },
        { label: "Admin login", to: PORTAL_ROUTES.admin.login },
        { label: "All portals", to: PORTAL_ROUTES.hub },
      ]}
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recruiter-email" className="text-xs text-slate-500">
            Email ID / Username
          </Label>
          <Input
            id="recruiter-email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-blue-50/40 border-slate-200"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="recruiter-password" className="text-xs text-slate-500">
              Password
            </Label>
            <Link to="/auth/forgot-password" className="text-xs text-[#0566CD] hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="recruiter-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-blue-50/40 border-slate-200 pr-16"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#0566CD]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {import.meta.env.DEV && (
          <p className="text-[11px] text-slate-500 rounded bg-slate-50 p-2 border border-slate-100">
            Dev demo: <code className="text-slate-800">{DEMO_RECRUITER_EMAIL}</code> /{" "}
            <code className="text-slate-800">client@123</code>
          </p>
        )}

        <Button
          type="submit"
          className="w-full h-11 bg-[#0566CD] hover:bg-[#0066c0] text-base font-semibold"
          disabled={isLoading}
        >
          {isLoading ? "Signing in…" : "Login"}
        </Button>

        <p className="text-center text-sm text-slate-600">
          Don&apos;t have access?{" "}
          <Link to={PORTAL_ROUTES.recruiter.signup} className="text-[#0566CD] font-medium hover:underline">
            Register as recruiter
          </Link>
        </p>
      </form>
    </NaukriAuthLayout>
  );
}

export default function ClientLogin() {
  return (
    <GuestAuthRoute expectedRole="client">
      <RecruiterLoginForm />
    </GuestAuthRoute>
  );
}
