import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Phone, ArrowLeft, Eye, EyeOff, Shield, Building2, UserPlus, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const ApplicantLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signInWithPhone, profile, refreshProfile } = useAuth();

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

      // Login successful - navigate immediately without waiting for profile
      // Profile will be fetched by AuthContext automatically
      console.log('✅ Login successful, navigating to dashboard...');
      
      toast({
        title: "Success",
        description: "Login successful!",
      });
      
      // Navigate immediately - don't wait for profile fetch
      navigate("/dashboard/applicant");
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
            <CardTitle className="text-2xl">Applicant Portal</CardTitle>
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

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                New user?{" "}
              </span>
              <Link to="/auth/applicant-register/step-1" className="text-primary hover:underline font-semibold">
                Register Now
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
              <Link to="/dashboard/client">
                <Building2 className="mr-2 h-4 w-4" />
                Client Dashboard
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

export default ApplicantLogin;
