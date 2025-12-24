import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Building2, ArrowLeft, Eye, EyeOff, Shield, UserPlus, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const ClientLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, profile, refreshProfile, signOut } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.error) {
        toast({
          title: "Login failed",
          description: result.error.message || "Invalid credentials",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Login successful - wait for profile and verify role
      toast({
        title: "Success",
        description: "Login successful!",
      });
      
      // Wait for profile to load
      let updatedProfile = await refreshProfile();
      
      // If profile not loaded, wait a bit and try again
      if (!updatedProfile) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        updatedProfile = await refreshProfile();
      }
      
      // Verify role before navigation
      if (!updatedProfile) {
        toast({
          title: "Error",
          description: "Profile not found. Please contact support.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      if (updatedProfile.role !== 'client') {
        toast({
          title: "Access Denied",
          description: `This account has role "${updatedProfile.role}" but client access is required. Please use the correct login page.`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Role verified, navigate to client dashboard
      navigate("/dashboard/client");
      setIsLoading(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex flex-col items-center justify-center mb-4 gap-1">
              <img src="/ellure-logo.png" alt="Ellure NexHire" className="h-14 w-auto object-contain" />
              <div className="flex flex-col items-center leading-none">
                <span className="text-base font-bold" style={{ color: '#3d4853' }}>Ellure</span>
                <span className="text-base font-bold -mt-2" style={{ color: '#0566cd' }}>NexHire</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Client Portal</CardTitle>
            <CardDescription>
              Access your talent pool and manage shortlists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-email">Client Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  placeholder="client+company@ellureconsulting.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="client-password">Password</Label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="client-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Demo: client.infosys@ellureconsulting.com / client@123
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-info/5 border border-info/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-info mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Client Access</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• View and search applicants</li>
                    <li>• Create and manage shortlists</li>
                    <li>• Export candidate data</li>
                    <li>• Track recruitment progress</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Don't have a client account?{" "}
              </span>
              <Link to="/contact" className="text-primary hover:underline">
                Contact sales
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="mt-6 space-y-2">
          <div className="text-center text-sm font-medium text-muted-foreground mb-3">
            Quick Access
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/dashboard/applicant">
                <User className="mr-2 h-4 w-4" />
                Applicant Dashboard
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/dashboard/applicant/profile">
                <FileText className="mr-2 h-4 w-4" />
                Applicant Profile
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/dashboard/admin">
                <Shield className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/auth/applicant-register/step-1">
                <UserPlus className="mr-2 h-4 w-4" />
                User Registration
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;