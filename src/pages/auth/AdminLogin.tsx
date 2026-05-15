import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, Eye, EyeOff, Building2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const AdminLogin = () => {
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
        const desc = result.error.message || "Invalid credentials";
        const isConnectionError = /cannot reach the server|check your internet|supabase project url/i.test(desc);
        toast({
          title: isConnectionError ? "Connection error" : "Login failed",
          description: desc,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data: { user: authUser }, error: getUserError } = await supabase.auth.getUser();

      if (getUserError || !authUser) {
        toast({ title: "Error", description: "Failed to get user information.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      let updatedProfile = null;
      try {
        const profilePromise = supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));
        const result = await Promise.race([profilePromise, timeoutPromise]) as any;
        if (!result.error) updatedProfile = result.data;
      } catch {
        updatedProfile = await refreshProfile();
      }

      if (!updatedProfile) {
        toast({ title: "Error", description: "Profile not found.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      if (updatedProfile.role !== 'admin') {
        const { data: adminUser } = await supabase.from('admin_users').select('admin_role, status').eq('user_id', updatedProfile.id).maybeSingle();

        if (adminUser?.status === 'pending') {
          toast({ title: "Access Pending", description: "Your admin access request is pending approval." });
        } else if (adminUser?.status === 'rejected') {
          toast({ title: "Access Denied", description: "Your admin access request has been rejected.", variant: "destructive" });
        } else {
          toast({ title: "Access Denied", description: "This account does not have admin access.", variant: "destructive" });
        }
        setIsLoading(false);
        return;
      }

      toast({ title: "Welcome back!", description: "Redirecting to admin dashboard..." });
      setIsLoading(false);
      navigate("/dashboard/admin");
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
              <div className="flex items-center justify-center gap-2">
                <CardTitle className="text-xl">Admin Portal</CardTitle>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  Secure
                </span>
              </div>
              <CardDescription className="mt-1">
                Restricted access for authorized administrators
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-sm">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@ellureconsulting.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="admin-password" className="text-sm">Password</Label>
                  <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="admin-password"
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
                <p className="text-[11px] text-muted-foreground">
                  Admin: <code className="bg-muted px-1 py-0.5 rounded text-foreground font-medium">vishal5952v@gmail.com</code> / <code className="bg-muted px-1 py-0.5 rounded text-foreground font-medium">Admin@123</code>
                </p>
              </div>

              <Button type="submit" className="w-full h-10" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-5 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2.5">
                <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium">Security Notice</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    All admin actions are logged. Only authorized personnel should access this portal.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t text-center">
              <span className="text-sm text-muted-foreground">Don't have an admin account? </span>
              <Link to="/admin/auth/signup" className="text-sm text-primary hover:underline font-medium">
                Request Access
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
              <Link to="/client/auth/login">
                <Building2 className="mr-2 h-3.5 w-3.5" />
                Client Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
