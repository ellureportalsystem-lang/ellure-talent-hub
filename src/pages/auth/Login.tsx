import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Phone, ArrowLeft, Eye, EyeOff, Shield, Building2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signInWithPhone, signInWithGoogle, profile, refreshProfile } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (activeTab === "email") {
        if (!email || !password) {
          toast({
            title: "Missing fields",
            description: "Please enter both email and password",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        result = await signIn(email, password);
      } else {
        if (!phone || !password) {
          toast({
            title: "Missing fields",
            description: "Please enter both phone and password",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        result = await signInWithPhone(phone, password);
      }

      if (result.error) {
        console.error('Login error details:', result.error);
        
        // Provide more helpful error messages
        let errorMessage = result.error.message || "Invalid credentials";
        
        if (result.error.message?.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. For old applicants, use default password: applicant@123";
        } else if (result.error.message?.includes('Email not confirmed')) {
          errorMessage = "Please verify your email first";
        } else if (result.error.message?.includes('User not found')) {
          errorMessage = "No account found with this email. Please check your email or register first.";
        }
        
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Login successful - check for must_change_password and load profile
      toast({
        title: "Success",
        description: "Login successful!",
      });
      
      // Get user from auth to check metadata
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      // Check if password change is required (for old applicants)
      if (authUser?.user_metadata?.must_change_password === true) {
        navigate("/auth/force-change-password");
        setIsLoading(false);
        return;
      }
      
      // Wait for profile to load
        let updatedProfile = await refreshProfile();
        
      // If profile not loaded, wait a bit and try again
        if (!updatedProfile) {
        await new Promise(resolve => setTimeout(resolve, 1000));
          updatedProfile = await refreshProfile();
        }
        
      if (!updatedProfile) {
        toast({
          title: "Error",
          description: "Profile not found. Please contact support.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Navigate based on role
      if (updatedProfile.role === 'admin') {
        navigate("/dashboard/admin");
        setIsLoading(false);
        return;
      } else if (updatedProfile.role === 'client') {
        navigate("/dashboard/client");
        setIsLoading(false);
        return;
      } else if (updatedProfile.role === 'applicant') {
          // Check if applicant has completed registration
            const { data: applicant } = await supabase
              .from('applicants')
              .select('id')
              .eq('user_id', updatedProfile.id)
              .maybeSingle();
            
            if (!applicant) {
              // No applicant record, redirect to registration form
              navigate("/auth/applicant-register/step-1");
        } else {
          // Has applicant record, go to dashboard
          navigate("/dashboard/applicant");
        }
            setIsLoading(false);
            return;
          } else {
        // Unknown role - deny access
        toast({
          title: "Access Denied",
          description: `Unknown role "${updatedProfile.role}". Please contact support.`,
          variant: "destructive",
        });
              setIsLoading(false);
              return;
            }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        toast({
          title: "Google login failed",
          description: result.error.message || "Failed to sign in with Google",
          variant: "destructive",
        });
        setIsLoading(false);
      } else {
        toast({
          title: "Success",
          description: "Redirecting to Google...",
        });
        // Navigation will happen after OAuth callback
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
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
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Login with your email or phone number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "email" | "phone")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="email">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone">
                  <Phone className="mr-2 h-4 w-4" />
                  Phone
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-email">Password</Label>
                      <Link
                        to="/auth/forgot-password"
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password-email"
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
                      Default password for old applicants: applicant@123
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-phone">Password</Label>
                      <Link
                        to="/auth/forgot-password"
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password-phone"
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
                      Default password for old applicants: applicant@123
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Google Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </Button>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                New user?{" "}
              </span>
              <Link to="/auth/register" className="text-primary hover:underline">
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* TEMPORARY TESTING BUTTONS - REMOVE BEFORE PRODUCTION */}
        <Card className="mt-4 border-dashed border-2 border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <p className="text-xs font-semibold text-warning uppercase tracking-wide">
                🧪 Testing Mode - Temporary Access
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Quick access buttons for testing (will be removed in production)
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // Set testing mode for admin
                    sessionStorage.setItem('testing_mode', 'true');
                    sessionStorage.setItem('testing_role', 'admin');
                    navigate("/dashboard/admin");
                  }}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // Set testing mode for client
                    sessionStorage.setItem('testing_mode', 'true');
                    sessionStorage.setItem('testing_role', 'client');
                    navigate("/dashboard/client");
                  }}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Client
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // Set testing mode for applicant
                    sessionStorage.setItem('testing_mode', 'true');
                    sessionStorage.setItem('testing_role', 'applicant');
                    navigate("/dashboard/applicant");
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Applicant
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // TEMPORARY: Navigate directly to profile page
                    sessionStorage.setItem('testing_mode', 'true');
                    sessionStorage.setItem('testing_role', 'applicant');
                    navigate("/dashboard/applicant/profile");
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  View Profile (Demo)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // TEMPORARY: Navigate to registration form in demo mode
                    sessionStorage.setItem('testing_mode', 'true');
                    sessionStorage.setItem('testing_role', 'applicant');
                    sessionStorage.setItem('demo_registration', 'true');
                    navigate("/auth/applicant-register/step-1");
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Registration Form (Demo)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="underline hover:text-foreground">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

