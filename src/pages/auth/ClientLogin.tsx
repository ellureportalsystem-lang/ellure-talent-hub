import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Building2, ArrowLeft, Eye, EyeOff, Shield, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const ClientLogin = () => {
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
        toast({ title: "Login failed", description: result.error.message || "Invalid credentials", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      let updatedProfile = await refreshProfile();
      if (!updatedProfile) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        updatedProfile = await refreshProfile();
      }

      if (!updatedProfile) {
        toast({ title: "Error", description: "Profile not found. Please contact support.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      if (updatedProfile.role !== 'client') {
        toast({ title: "Access Denied", description: `This account has role "${updatedProfile.role}" but client access is required.`, variant: "destructive" });
        setIsLoading(false);
        return;
      }

      toast({ title: "Welcome back!", description: "Redirecting to client dashboard..." });
      navigate("/dashboard/client");
      setIsLoading(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "An error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <Button variant="ghost" size="sm" asChild className="mb-6 text-muted-foreground">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <Card className="border shadow-lg">
          <CardHeader className="space-y-4 text-center pb-2">
            <div className="flex flex-col items-center gap-2">
              <img src="/ellure-logo.png" alt="Ellure NexHire" className="h-14 w-auto object-contain" />
              <div className="flex flex-col items-center leading-tight">
                <span className="text-base font-bold text-foreground">Ellure</span>
                <span className="text-base font-bold text-primary -mt-0.5">NexHire</span>
              </div>
            </div>
            <div>
              <CardTitle className="text-xl">Client Portal</CardTitle>
              <CardDescription className="mt-1">
                Access your talent pool and manage shortlists
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-email" className="text-sm">Client Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="client-password" className="text-sm">Password</Label>
                  <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="client-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full h-10" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-5 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2.5">
                <Building2 className="h-4 w-4 text-info mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium">Client Access Includes</p>
                  <ul className="text-[11px] text-muted-foreground mt-1 space-y-0.5">
                    <li>Search and view candidate profiles</li>
                    <li>Create and manage shortlists</li>
                    <li>Export candidate data</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t text-center">
              <span className="text-sm text-muted-foreground">Don't have a client account? </span>
              <Link to="/client/auth/signup" className="text-sm text-primary hover:underline font-medium">
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-2">
          <p className="text-center text-xs font-medium text-muted-foreground mb-3">Other Portals</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="w-full justify-start h-9 text-xs" asChild>
              <Link to="/auth/applicant">
                <UserPlus className="mr-2 h-3.5 w-3.5" />
                Applicant Login
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start h-9 text-xs" asChild>
              <Link to="/admin/auth/login">
                <Shield className="mr-2 h-3.5 w-3.5" />
                Admin Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
