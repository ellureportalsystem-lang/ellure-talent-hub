import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, ArrowLeft, Eye, EyeOff, Shield, Building2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const ApplicantLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signInWithPhone } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (activeTab === "email") {
        if (!email || !password) {
          toast({ title: "Missing fields", description: "Please enter both email and password", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        result = await signIn(email, password);
      } else {
        if (!phone || !password) {
          toast({ title: "Missing fields", description: "Please enter both phone and password", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        result = await signInWithPhone(phone, password);
      }

      if (result.error) {
        let errorMessage = result.error.message || "Invalid credentials";
        if (result.error.message?.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. For old applicants, use default password: applicant@123";
        } else if (result.error.message?.includes('Email not confirmed')) {
          errorMessage = "Please verify your email first";
        } else if (result.error.message?.includes('User not found')) {
          errorMessage = "No account found with this email. Please check your email or register first.";
        }
        toast({ title: "Login failed", description: errorMessage, variant: "destructive" });
        setIsLoading(false);
        return;
      }

      toast({ title: "Welcome back!", description: "Redirecting to your profile..." });
      setIsLoading(false);
      setTimeout(() => navigate("/dashboard/applicant/profile"), 100);
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
              <CardTitle className="text-xl">Applicant Portal</CardTitle>
              <CardDescription className="mt-1">
                Sign in with your email or phone number
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "email" | "phone")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-5 h-10">
                <TabsTrigger value="email" className="text-sm">
                  <Mail className="mr-2 h-3.5 w-3.5" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone" className="text-sm">
                  <Phone className="mr-2 h-3.5 w-3.5" />
                  Phone
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-email" className="text-sm">Password</Label>
                      <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password-email"
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
                      Default password for imported applicants: <code className="bg-muted px-1 py-0.5 rounded text-foreground font-medium">applicant@123</code>
                    </p>
                  </div>
                  <Button type="submit" className="w-full h-10" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-phone" className="text-sm">Password</Label>
                      <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password-phone"
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
                      Default password for imported applicants: <code className="bg-muted px-1 py-0.5 rounded text-foreground font-medium">applicant@123</code>
                    </p>
                  </div>
                  <Button type="submit" className="w-full h-10" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-5 pt-5 border-t text-center">
              <span className="text-sm text-muted-foreground">New user? </span>
              <Link to="/auth/applicant-register/step-1" className="text-sm text-primary hover:underline font-medium">
                Register Now
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-2">
          <p className="text-center text-xs font-medium text-muted-foreground mb-3">Other Portals</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="w-full justify-start h-9 text-xs" asChild>
              <Link to="/admin/auth/login">
                <Shield className="mr-2 h-3.5 w-3.5" />
                Admin Login
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

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="underline hover:text-foreground">Terms</Link>{" "}and{" "}
          <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default ApplicantLogin;
